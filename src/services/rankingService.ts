import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase";
import { heroesRanking } from "../data/heroesRanking";
import { RankingUser } from "../types/firebase";

function mergeHeroesWithRanking(items: RankingUser[], sortBy: "currentStreak" | "totalExercises") {
  const combined = [...heroesRanking, ...items];
  return combined
    .sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0))
    .slice(0, 20);
}

export function listenGlobalStreakRanking(callback: (items: RankingUser[]) => void) {
  const rankingQuery = query(
    collection(db, "rankings", "globalStreak", "users"),
    orderBy("currentStreak", "desc"),
    limit(20)
  );

  return onSnapshot(
    rankingQuery,
    (snapshot) => {
      callback(
        mergeHeroesWithRanking(
          snapshot.docs.map((doc) => ({
            uid: doc.id,
            ...(doc.data() as RankingUser),
          })),
          "currentStreak"
        )
      );
    },
    () => {
      callback(mergeHeroesWithRanking([], "currentStreak"));
    }
  );
}

export function listenTotalExercisesRanking(callback: (items: RankingUser[]) => void) {
  const rankingQuery = query(
    collection(db, "rankings", "totalExercises", "users"),
    orderBy("totalExercises", "desc"),
    limit(20)
  );

  return onSnapshot(
    rankingQuery,
    (snapshot) => {
      callback(
        mergeHeroesWithRanking(
          snapshot.docs.map((doc) => ({
            uid: doc.id,
            ...(doc.data() as RankingUser),
          })),
          "totalExercises"
        )
      );
    },
    () => {
      callback(mergeHeroesWithRanking([], "totalExercises"));
    }
  );
}
