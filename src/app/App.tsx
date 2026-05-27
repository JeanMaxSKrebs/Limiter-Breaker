import { useState } from "react";
import { 
  Home, 
  Dumbbell, 
  Trophy, 
  Users, 
  Calendar,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Search,
  UserPlus,
  ChevronRight,
  Zap,
  Timer,
  Activity
} from "lucide-react";
import { motion } from "motion/react";

type Screen = "home" | "workout" | "ranking" | "friends";
type RankingTab = "streak" | "total";
type WorkoutType = "single" | "intercalated";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [rankingTab, setRankingTab] = useState<RankingTab>("streak");
  const [workoutFilter, setWorkoutFilter] = useState<WorkoutType>("single");

  // Mock data
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2027-01-01");
  const today = new Date();
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progress = (daysPassed / totalDays) * 100;
  const todayProgress = 75;

  const leaderboardStreak = [
    { rank: 1, name: "Saitama", avatar: "🟡", streak: 1095, total: 438000 },
    { rank: 2, name: "Genos", avatar: "⚙️", streak: 365, total: 146000 },
    { rank: 3, name: "You", avatar: "💪", streak: 127, total: 50800, isCurrentUser: true },
    { rank: 4, name: "Mumen Rider", avatar: "🚴", streak: 89, total: 35600 },
    { rank: 5, name: "Tank Top", avatar: "👕", streak: 67, total: 26800 },
  ];

  const leaderboardTotal = [
    { rank: 1, name: "Saitama", avatar: "🟡", streak: 1095, total: 438000 },
    { rank: 2, name: "Genos", avatar: "⚙️", streak: 365, total: 146000 },
    { rank: 3, name: "Mumen Rider", avatar: "🚴", streak: 89, total: 89200 },
    { rank: 4, name: "You", avatar: "💪", streak: 127, total: 50800, isCurrentUser: true },
    { rank: 5, name: "Tank Top", avatar: "👕", streak: 67, total: 26800 },
  ];

  const friends = [
    { name: "Genos", avatar: "⚙️", progress: 100, status: "Completed today" },
    { name: "Mumen Rider", avatar: "🚴", progress: 50, status: "In progress" },
    { name: "Tank Top", avatar: "👕", progress: 25, status: "Just started" },
    { name: "Speed-o'-Sound", avatar: "⚡", progress: 0, status: "Not started" },
  ];

  const renderHomeScreen = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto pb-24"
    >
      {/* Hero Banner */}
      <div className="relative h-56 bg-gradient-to-br from-secondary via-secondary/80 to-primary/30 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,214,0,0.2),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative h-full flex flex-col justify-center px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-7xl mb-2"
          >
            💪
          </motion.div>
          <h1 className="text-5xl font-bold tracking-wider text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            BREAK YOUR
          </h1>
          <h1 className="text-5xl font-bold tracking-wider text-primary mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            LIMITER
          </h1>
          <p className="text-white/80 text-sm font-medium">Saitama's 3-Year Challenge</p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="px-6 py-6 space-y-6">
        {/* Challenge Timeline */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Challenge Progress</h3>
            </div>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-secondary to-primary rounded-full"
            />
          </div>

          <div className="flex justify-between text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Start Date</p>
              <p className="font-bold text-foreground">{startDate.toLocaleDateString()}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground mb-1">Days Completed</p>
              <p className="font-bold text-primary text-xl">{daysPassed}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground mb-1">End Date</p>
              <p className="font-bold text-foreground">{endDate.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Today's Progress */}
        <div className="bg-card rounded-2xl p-6 border border-border/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Today's Training</h3>
            </div>
            <span className="text-2xl font-bold text-primary">{todayProgress}%</span>
          </div>

          {/* Circular Progress */}
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 553 }}
                  animate={{ strokeDashoffset: 553 - (553 * todayProgress) / 100 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  strokeDasharray="553"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF3838" />
                    <stop offset="100%" stopColor="#FFD600" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <Flame className="w-12 h-12 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Keep pushing!</p>
              </div>
            </div>
          </div>

          {/* Exercise Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Push-ups</p>
              <p className="text-2xl font-bold text-foreground">75/100</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Sit-ups</p>
              <p className="text-2xl font-bold text-foreground">100/100</p>
              <span className="text-xs text-primary">✓ Complete</span>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Squats</p>
              <p className="text-2xl font-bold text-foreground">50/100</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1">Running</p>
              <p className="text-2xl font-bold text-foreground">7.5/10 km</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border/50 text-center">
            <Flame className="w-6 h-6 text-secondary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground mb-1">127</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/50 text-center">
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground mb-1">50.8K</p>
            <p className="text-xs text-muted-foreground">Total Reps</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border/50 text-center">
            <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground mb-1">#3</p>
            <p className="text-xs text-muted-foreground">Rank</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderWorkoutScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto pb-24"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-card to-background px-6 py-8 border-b border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <Dumbbell className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            CHOOSE YOUR
          </h1>
        </div>
        <h1 className="text-4xl font-bold tracking-wider text-primary ml-11" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          TRAINING MODE
        </h1>
        <p className="text-muted-foreground mt-3 ml-11">Saitama's legendary routine awaits</p>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Full Workout Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-6 text-left border-2 border-secondary/50 hover:border-secondary transition-colors group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <ChevronRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              FULL WORKOUT
            </h2>
            <p className="text-white/80 text-sm mb-4">
              Complete all exercises in one session. For the truly dedicated.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <p className="text-xs text-white/70">Push-ups</p>
                <p className="text-lg font-bold text-white">100</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <p className="text-xs text-white/70">Sit-ups</p>
                <p className="text-lg font-bold text-white">100</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <p className="text-xs text-white/70">Squats</p>
                <p className="text-lg font-bold text-white">100</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <p className="text-xs text-white/70">Run</p>
                <p className="text-lg font-bold text-white">10 km</p>
              </div>
            </div>
          </div>
        </motion.button>

        {/* Intercalated Workout Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-6 text-left border-2 border-primary/50 hover:border-primary transition-colors group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-background/30 backdrop-blur-sm rounded-xl p-3">
                <Clock className="w-8 h-8 text-background" />
              </div>
              <ChevronRight className="w-6 h-6 text-background/60 group-hover:text-background group-hover:translate-x-1 transition-all" />
            </div>
            <h2 className="text-2xl font-bold text-background mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              INTERCALATED WORKOUT
            </h2>
            <p className="text-background/80 text-sm mb-4">
              Split the routine into different times. Balance strength and stamina.
            </p>
            <div className="flex gap-2 flex-wrap">
              <div className="bg-background/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-xs text-background/70 mb-1">Morning</p>
                <p className="text-sm font-bold text-background">50 Push + 50 Sit-ups</p>
              </div>
              <div className="bg-background/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-xs text-background/70 mb-1">Afternoon</p>
                <p className="text-sm font-bold text-background">50 Squats + 5 km</p>
              </div>
              <div className="bg-background/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-xs text-background/70 mb-1">Evening</p>
                <p className="text-sm font-bold text-background">Remaining + 5 km</p>
              </div>
            </div>
          </div>
        </motion.button>

        {/* Super Intercalated Card */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-br from-card to-muted rounded-2xl p-6 text-left border-2 border-border hover:border-primary transition-colors group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="bg-primary/20 backdrop-blur-sm rounded-xl p-3">
                <Timer className="w-8 h-8 text-primary" />
              </div>
              <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              SUPER INTERCALATED
            </h2>
            <p className="text-muted-foreground text-sm mb-4">
              Break it down into bite-sized sets throughout the day. Perfect for beginners.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-background/50 rounded-lg px-3 py-2 border border-border/50">
                <p className="text-xs text-muted-foreground">Every 2 hours</p>
                <p className="text-sm font-bold text-foreground">10-20 reps each</p>
              </div>
              <div className="bg-background/50 rounded-lg px-3 py-2 border border-border/50">
                <p className="text-xs text-muted-foreground">Total Sessions</p>
                <p className="text-sm font-bold text-foreground">6-8 per day</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-primary/10 rounded-lg px-3 py-2">
              <Activity className="w-4 h-4 text-primary" />
              <span>Recommended for building consistency</span>
            </div>
          </div>
        </motion.button>

        {/* Info Box */}
        <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 mt-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">Pro Tip</h4>
              <p className="text-sm text-muted-foreground">
                Don't forget: Never use the air conditioner in summer or heat in winter. This is crucial to becoming the strongest!
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderRankingScreen = () => {
    const currentLeaderboard = rankingTab === "streak" ? leaderboardStreak : leaderboardTotal;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-y-auto pb-24"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-card to-background px-6 py-8 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              LEADERBOARD
            </h1>
          </div>
          <p className="text-muted-foreground mt-2">Compete with heroes worldwide</p>
        </div>

        <div className="px-6 py-6 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 bg-muted rounded-xl p-1">
            <button
              onClick={() => setRankingTab("streak")}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                rankingTab === "streak"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Flame className="w-4 h-4 inline-block mr-2" />
              Consecutive Days
            </button>
            <button
              onClick={() => setRankingTab("total")}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                rankingTab === "total"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Target className="w-4 h-4 inline-block mr-2" />
              Total Exercises
            </button>
          </div>

          {/* Workout Type Filter */}
          <div className="flex gap-2 bg-card border border-border/50 rounded-xl p-1">
            <button
              onClick={() => setWorkoutFilter("single")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                workoutFilter === "single"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Single Workout
            </button>
            <button
              onClick={() => setWorkoutFilter("intercalated")}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                workoutFilter === "intercalated"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Intercalated
            </button>
          </div>

          {/* Leaderboard */}
          <div className="space-y-3">
            {currentLeaderboard.map((user, index) => (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-xl p-4 border-2 ${
                  user.isCurrentUser
                    ? "bg-gradient-to-r from-primary/20 to-secondary/20 border-primary"
                    : "bg-card border-border/50"
                } ${user.rank <= 3 ? "shadow-lg" : ""}`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${
                    user.rank === 1 ? "bg-gradient-to-br from-primary to-yellow-600 text-primary-foreground" :
                    user.rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800" :
                    user.rank === 3 ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white" :
                    "bg-muted text-muted-foreground"
                  }`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {user.rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl border-2 border-border">
                    {user.avatar}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      {user.name}
                      {user.isCurrentUser && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {rankingTab === "streak" ? (
                        <>
                          <Flame className="w-3 h-3 inline-block mr-1 text-secondary" />
                          {user.streak} day streak
                        </>
                      ) : (
                        <>
                          <Target className="w-3 h-3 inline-block mr-1 text-primary" />
                          {user.total.toLocaleString()} total reps
                        </>
                      )}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {rankingTab === "streak" ? user.streak : user.total.toLocaleString()}
                    </p>
                    {user.rank <= 3 && (
                      <Trophy className="w-4 h-4 text-primary inline-block" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Your Stats Summary */}
          <div className="bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl p-6 border-2 border-primary/50 mt-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Your Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4">
                <Flame className="w-6 h-6 text-secondary mb-2" />
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>127</p>
              </div>
              <div className="bg-background/50 backdrop-blur-sm rounded-xl p-4">
                <Target className="w-6 h-6 text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Total Exercises</p>
                <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>50.8K</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderFriendsScreen = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 overflow-y-auto pb-24"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-card to-background px-6 py-8 border-b border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            FRIENDS
          </h1>
        </div>
        <p className="text-muted-foreground mt-2">Train together, grow stronger</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Add Friends Section */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <UserPlus className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-foreground">Add Friends</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by username or email"
              className="w-full bg-muted border border-border rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Friends List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground">Your Squad ({friends.length})</h3>
            <span className="text-sm text-muted-foreground">Active today: 2</span>
          </div>
          
          <div className="space-y-3">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-4 border border-border/50 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4 mb-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl border-2 border-border">
                      {friend.avatar}
                    </div>
                    {friend.progress === 100 && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                        <span className="text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Friend Info */}
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-1">{friend.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {friend.status}
                    </p>
                  </div>

                  {/* Progress Percentage */}
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      friend.progress === 100 ? "text-primary" : "text-foreground"
                    }`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {friend.progress}%
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${friend.progress}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      friend.progress === 100
                        ? "bg-gradient-to-r from-primary to-primary"
                        : friend.progress >= 50
                        ? "bg-gradient-to-r from-primary to-secondary"
                        : "bg-gradient-to-r from-secondary/50 to-primary/50"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Motivational Card */}
        <div className="bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl p-6 border-2 border-primary/50">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center text-2xl">
                🔥
              </div>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-2">Challenge Your Friends!</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Invite friends to join the 3-year challenge. Those who train together, break their limiters together!
              </p>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-bold text-sm transition-colors">
                Send Invite
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-background flex flex-col relative overflow-hidden">
      {/* Screen Content */}
      {currentScreen === "home" && renderHomeScreen()}
      {currentScreen === "workout" && renderWorkoutScreen()}
      {currentScreen === "ranking" && renderRankingScreen()}
      {currentScreen === "friends" && renderFriendsScreen()}

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border/50 backdrop-blur-xl">
        <div className="flex items-center justify-around px-6 py-4">
          <button
            onClick={() => setCurrentScreen("home")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === "home" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className={`w-6 h-6 ${currentScreen === "home" ? "fill-primary" : ""}`} />
            <span className="text-xs font-semibold">Home</span>
          </button>
          <button
            onClick={() => setCurrentScreen("workout")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === "workout" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Dumbbell className={`w-6 h-6 ${currentScreen === "workout" ? "fill-primary" : ""}`} />
            <span className="text-xs font-semibold">Workout</span>
          </button>
          <button
            onClick={() => setCurrentScreen("ranking")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === "ranking" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Trophy className={`w-6 h-6 ${currentScreen === "ranking" ? "fill-primary" : ""}`} />
            <span className="text-xs font-semibold">Ranking</span>
          </button>
          <button
            onClick={() => setCurrentScreen("friends")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentScreen === "friends" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Users className={`w-6 h-6 ${currentScreen === "friends" ? "fill-primary" : ""}`} />
            <span className="text-xs font-semibold">Friends</span>
          </button>
        </div>
      </div>
    </div>
  );
}
