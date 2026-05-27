import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from "firebase/auth";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../config/firebase";

type RegisterUserData = {
  name: string;
  username?: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

type ExtraUserData = {
  username?: string;
};

function getChallengeDates() {
  const startDate = new Date();
  const endDate = new Date(startDate);

  endDate.setFullYear(endDate.getFullYear() + 3);

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  };
}

export async function ensureUserProfile(user: User, extraData?: ExtraUserData) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  const { startDate, endDate } = getChallengeDates();
  const displayName = user.displayName || "Herói do Limite";
  const username = extraData?.username?.trim() || "";
  const usernameLower = username.toLowerCase();

  const profilePayload = {
    uid: user.uid,
    displayName,
    username,
    usernameLower,
    email: user.email || "",
    avatarUrl: "",
    startDate,
    endDate,
    currentStreak: 0,
    bestStreak: 0,
    totalTrainingDays: 0,
    totalPushups: 0,
    totalSitups: 0,
    totalSquats: 0,
    totalRunKm: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  if (userSnap.exists()) {
    await updateDoc(userRef, {
      ...profilePayload,
      updatedAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
    });
  } else {
    await setDoc(userRef, profilePayload);
  }

  const globalRankingRef = doc(db, "rankings", "globalStreak", "users", user.uid);
  const totalRankingRef = doc(db, "rankings", "totalExercises", "users", user.uid);

  const rankingPayload = {
    uid: user.uid,
    displayName,
    currentStreak: 0,
    totalExercises: 0,
    updatedAt: serverTimestamp(),
  };

  await Promise.all([
    setDoc(globalRankingRef, rankingPayload, { merge: true }),
    setDoc(totalRankingRef, rankingPayload, { merge: true }),
  ]);
}

export async function registerWithEmail({
  name,
  username,
  email,
  password,
}: RegisterUserData) {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  await updateProfile(credential.user, {
    displayName: name,
  });

  await ensureUserProfile(credential.user, { username });

  return credential.user;
}

export async function loginWithEmail({ email, password }: LoginData) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  await ensureUserProfile(credential.user);
  const userRef = doc(db, "users", credential.user.uid);
  await updateDoc(userRef, {
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });

  return credential.user;
}

export async function logout() {
  await signOut(auth);
}

export function listenAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}