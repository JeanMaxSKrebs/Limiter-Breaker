import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";
import { RankingUser } from "../types/firebase";

export function listenGlobalStreakRanking(callback: (items: RankingUser[]) => void) {
  const rankingQuery = query(
    collection(db, "rankings", "globalStreak", "users"),
    orderBy("currentStreak", "desc"),
    limit(20)
  );

  return onSnapshot(rankingQuery, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...(doc.data() as RankingUser),
      }))
    );
  });
}

export function listenTotalExercisesRanking(callback: (items: RankingUser[]) => void) {
  const rankingQuery = query(
    collection(db, "rankings", "totalExercises", "users"),
    orderBy("totalExercises", "desc"),
    limit(20)
  );

  return onSnapshot(rankingQuery, (snapshot) => {
    callback(
      snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...(doc.data() as RankingUser),
      }))
    );
  });
}
