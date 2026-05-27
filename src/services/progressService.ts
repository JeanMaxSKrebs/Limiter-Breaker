import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { DailyProgress, UserProfile } from "../types/firebase";

export function getTodayId(): string {
  return new Date().toISOString().slice(0, 10);
}

function getDateId(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  return {
    id: userSnap.id,
    ...(userSnap.data() as UserProfile),
  } as UserProfile;
}

export async function getTodayProgress(uid: string): Promise<DailyProgress | null> {
  const todayId = getTodayId();
  const progressRef = doc(db, "users", uid, "dailyProgress", todayId);
  const progressSnap = await getDoc(progressRef);

  if (!progressSnap.exists()) {
    return null;
  }

  return {
    id: progressSnap.id,
    ...(progressSnap.data() as DailyProgress),
  } as DailyProgress;
}

export async function saveDailyProgress(uid: string, payload: Omit<DailyProgress, "id" | "createdAt" | "updatedAt">) {
  const progressRef = doc(db, "users", uid, "dailyProgress", payload.date);
  await setDoc(
    progressRef,
    {
      ...payload,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function completeWorkout(uid: string, payload: { pushups: number; situps: number; squats: number; runKm: number }) {
  const todayId = getTodayId();
  const userRef = doc(db, "users", uid);
  const todayRef = doc(db, "users", uid, "dailyProgress", todayId);
  const globalRankingRef = doc(db, "rankings", "globalStreak", "users", uid);
  const totalRankingRef = doc(db, "rankings", "totalExercises", "users", uid);

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRef);
    if (!userSnap.exists()) {
      throw new Error("Perfil do usuário não encontrado.");
    }

    const todaySnap = await transaction.get(todayRef);
    const existingProgress = todaySnap.exists()
      ? (todaySnap.data() as DailyProgress)
      : { pushups: 0, situps: 0, squats: 0, runKm: 0, completed: false, date: todayId };

    const yesterdayId = getDateId(new Date(Date.now() - 86400000));
    const yesterdayRef = doc(db, "users", uid, "dailyProgress", yesterdayId);
    const yesterdaySnap = await transaction.get(yesterdayRef);
    const yesterdayCompleted = yesterdaySnap.exists()
      ? Boolean((yesterdaySnap.data() as DailyProgress).completed)
      : false;

    const newProgress = {
      date: todayId,
      pushups: payload.pushups,
      situps: payload.situps,
      squats: payload.squats,
      runKm: payload.runKm,
      completed: payload.pushups >= 100 && payload.situps >= 100 && payload.squats >= 100 && payload.runKm >= 10,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    const deltaPushups = payload.pushups - (existingProgress.pushups || 0);
    const deltaSitups = payload.situps - (existingProgress.situps || 0);
    const deltaSquats = payload.squats - (existingProgress.squats || 0);
    const deltaRunKm = payload.runKm - (existingProgress.runKm || 0);

    const userData = userSnap.data() as UserProfile;
    const totalPushups = (userData.totalPushups || 0) + deltaPushups;
    const totalSitups = (userData.totalSitups || 0) + deltaSitups;
    const totalSquats = (userData.totalSquats || 0) + deltaSquats;
    const totalRunKm = (userData.totalRunKm || 0) + deltaRunKm;
    const totalExercises = totalPushups + totalSitups + totalSquats + totalRunKm;

    let currentStreak = userData.currentStreak || 0;
    let bestStreak = userData.bestStreak || 0;
    let totalTrainingDays = userData.totalTrainingDays || 0;

    if (newProgress.completed && !existingProgress.completed) {
      totalTrainingDays += 1;
      currentStreak = yesterdayCompleted ? Math.max(currentStreak, 0) + 1 : 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    }

    transaction.set(todayRef, newProgress, { merge: true });
    transaction.update(userRef, {
      totalPushups,
      totalSitups,
      totalSquats,
      totalRunKm,
      totalTrainingDays,
      currentStreak,
      bestStreak,
      updatedAt: serverTimestamp(),
    });

    transaction.set(
      globalRankingRef,
      {
        uid,
        displayName: userData.displayName,
        currentStreak,
        totalExercises,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    transaction.set(
      totalRankingRef,
      {
        uid,
        displayName: userData.displayName,
        currentStreak,
        totalExercises,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  });
}

export function listenUserProfile(uid: string, callback: (profile: UserProfile | null) => void) {
  const userRef = doc(db, "users", uid);
  return onSnapshot(userRef, (snapshot) => {
    callback(snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as UserProfile) } as UserProfile) : null);
  });
}

export function listenTodayProgress(uid: string, callback: (progress: DailyProgress | null) => void) {
  const progressRef = doc(db, "users", uid, "dailyProgress", getTodayId());
  return onSnapshot(progressRef, (snapshot) => {
    callback(snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as DailyProgress) } as DailyProgress) : null);
  });
}
