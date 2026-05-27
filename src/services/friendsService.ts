import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { FriendRequestStatus, FriendStatus, UserProfile } from "../types/firebase";

export async function searchUsersByUsername(username: string) {
  const normalized = username.trim().toLowerCase();
  if (!normalized) {
    return [] as UserProfile[];
  }

  const usersQuery = query(
    collection(db, "users"),
    where("usernameLower", "==", normalized)
  );

  const snapshot = await getDocs(usersQuery);
  return snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...(doc.data() as UserProfile),
  }));
}

export async function sendFriendRequest(fromUid: string, toUid: string) {
  if (fromUid === toUid) {
    throw new Error("Não é possível enviar solicitação para si mesmo.");
  }

  const existingQuery = query(
    collection(db, "friendRequests"),
    where("fromUid", "==", fromUid),
    where("toUid", "==", toUid)
  );

  const existing = await getDocs(existingQuery);
  if (!existing.empty) {
    throw new Error("Solicitação já enviada.");
  }

  await addDoc(collection(db, "friendRequests"), {
    fromUid,
    toUid,
    status: "pending" as FriendRequestStatus,
    createdAt: new Date().toISOString(),
  });
}

export function listenFriendRequests(uid: string, callback: (requests: any[]) => void) {
  const requestsQuery = query(
    collection(db, "friendRequests"),
    where("toUid", "==", uid),
    where("status", "==", "pending")
  );

  return onSnapshot(
    requestsQuery,
    (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    },
    () => {
      callback([]);
    }
  );
}

export async function acceptFriendRequest(requestId: string, fromUid: string, toUid: string) {
  const requestRef = doc(db, "friendRequests", requestId);
  const friendRefA = doc(db, "users", fromUid, "friends", toUid);
  const friendRefB = doc(db, "users", toUid, "friends", fromUid);
  const fromUserRef = doc(db, "users", fromUid);
  const toUserRef = doc(db, "users", toUid);

  await runTransaction(db, async (transaction) => {
    const requestSnap = await transaction.get(requestRef);
    if (!requestSnap.exists()) {
      throw new Error("Solicitação não encontrada.");
    }

    const fromUserSnap = await transaction.get(fromUserRef);
    const toUserSnap = await transaction.get(toUserRef);

    const fromDisplayName = fromUserSnap.exists() ? (fromUserSnap.data() as any).displayName : "Amigo";
    const toDisplayName = toUserSnap.exists() ? (toUserSnap.data() as any).displayName : "Amigo";

    transaction.update(requestRef, {
      status: "accepted" as FriendRequestStatus,
      updatedAt: new Date().toISOString(),
    });

    transaction.set(friendRefA, {
      uid: toUid,
      displayName: toDisplayName,
      status: "accepted" as FriendStatus,
      createdAt: new Date().toISOString(),
    });

    transaction.set(friendRefB, {
      uid: fromUid,
      displayName: fromDisplayName,
      status: "accepted" as FriendStatus,
      createdAt: new Date().toISOString(),
    });
  });
}

export async function rejectFriendRequest(requestId: string) {
  const requestRef = doc(db, "friendRequests", requestId);
  await setDoc(requestRef, {
    status: "rejected" as FriendRequestStatus,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export function listenFriends(uid: string, callback: (friends: any[]) => void) {
  const friendsCollection = collection(db, "users", uid, "friends");
  return onSnapshot(
    friendsCollection,
    (snapshot) => {
      callback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    },
    () => {
      callback([]);
    }
  );
}

export async function removeFriend(uid: string, friendUid: string) {
  const friendRefA = doc(db, "users", uid, "friends", friendUid);
  const friendRefB = doc(db, "users", friendUid, "friends", uid);

  await deleteDoc(friendRefA);
  await deleteDoc(friendRefB);
}
