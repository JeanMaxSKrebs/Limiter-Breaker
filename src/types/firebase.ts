export type WorkoutMode = "full" | "intercalated" | "super_intercalated";
export type FriendStatus = "pending" | "accepted" | "blocked";
export type FriendRequestStatus = "pending" | "accepted" | "rejected";

export interface UserProfile {
  uid: string;
  displayName: string;
  username: string;
  usernameLower: string;
  email: string;
  avatarUrl: string;
  preferredWorkoutMode: WorkoutMode | null;
  onboardingCompleted: boolean;
  currentStreak: number;
  bestStreak: number;
  totalTrainingDays: number;
  totalPushups: number;
  totalSitups: number;
  totalSquats: number;
  totalRunKm: number;
  createdAt: any;
  updatedAt: any;
  lastLoginAt?: any;
}

export interface DailyProgress {
  id: string;
  date: string;
  pushups: number;
  situps: number;
  squats: number;
  runKm: number;
  completed: boolean;
  createdAt: any;
  updatedAt: any;
}

export interface RankingUser {
  uid: string;
  displayName: string;
  username?: string;
  avatarEmoji?: string;
  currentStreak: number;
  bestStreak?: number;
  totalExercises: number;
  totalRunKm?: number;
  isHero?: boolean;
  avatarUrl?: string;
}
