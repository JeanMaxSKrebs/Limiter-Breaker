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

function getChallengeDates() {
  const startDate = new Date();
  const endDate = new Date(startDate);

  // Desafio de 3 anos
  endDate.setFullYear(endDate.getFullYear() + 3);

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  };
}

async function createUserProfile(user: User, name: string, username?: string) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return;
  }

  const { startDate, endDate } = getChallengeDates();

  await setDoc(userRef, {
    uid: user.uid,
    displayName: name,
    username: username || "",
    email: user.email,
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
  });
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

  await createUserProfile(credential.user, name, username);

  return credential.user;
}

export async function loginWithEmail({ email, password }: LoginData) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  const userRef = doc(db, "users", credential.user.uid);
  const userSnap = await getDoc(userRef);

  // Segurança caso o usuário exista no Auth, mas ainda não tenha documento no Firestore
  if (!userSnap.exists()) {
    await createUserProfile(
      credential.user,
      credential.user.displayName || "Novo Herói"
    );
  } else {
    await updateDoc(userRef, {
      updatedAt: serverTimestamp(),
    });
  }

  return credential.user;
}

export async function logout() {
  await signOut(auth);
}

export function listenAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}