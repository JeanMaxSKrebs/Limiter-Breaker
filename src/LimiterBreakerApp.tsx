import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Screen = "home" | "workout" | "ranking" | "friends";
type RankingTab = "streak" | "total";
type WorkoutType = "single" | "intercalated";

type LeaderboardUser = {
  rank: number;
  name: string;
  avatar: string;
  streak: number;
  total: number;
  isCurrentUser?: boolean;
};

const leaderboardStreak: LeaderboardUser[] = [
  { rank: 1, name: "Saitama", avatar: "🟡", streak: 1095, total: 438000 },
  { rank: 2, name: "Genos", avatar: "⚙️", streak: 365, total: 146000 },
  { rank: 3, name: "You", avatar: "💪", streak: 127, total: 50800, isCurrentUser: true },
  { rank: 4, name: "Mumen Rider", avatar: "🚴", streak: 89, total: 35600 },
  { rank: 5, name: "Tank Top", avatar: "👕", streak: 67, total: 26800 },
];

const leaderboardTotal: LeaderboardUser[] = [
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

const exercises = [
  { label: "Push-ups", value: "75/100" },
  { label: "Sit-ups", value: "100/100", completed: true },
  { label: "Squats", value: "50/100" },
  { label: "Run", value: "7.5/10 km" },
];

export default function LimiterBreakerApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [rankingTab, setRankingTab] = useState<RankingTab>("streak");
  const [workoutFilter, setWorkoutFilter] = useState<WorkoutType>("single");

  const challenge = useMemo(() => {
    const startDate = new Date("2024-01-01T00:00:00");
    const endDate = new Date("2027-01-01T00:00:00");
    const today = new Date();
    const totalDays = Math.max(1, Math.floor((endDate.getTime() - startDate.getTime()) / 86400000));
    const daysPassed = Math.min(totalDays, Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / 86400000)));
    const progress = Math.round((daysPassed / totalDays) * 100);

    return {
      startDate: startDate.toLocaleDateString("pt-BR"),
      endDate: endDate.toLocaleDateString("pt-BR"),
      daysPassed,
      progress,
    };
  }, []);

  const renderProgressBar = (value: number, large = false) => (
    <View style={[styles.progressTrack, large && styles.progressTrackLarge]}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
    </View>
  );

  const renderHomeScreen = () => (
    <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>💪</Text>
        <Text style={styles.heroTitle}>BREAK YOUR</Text>
        <Text style={styles.heroTitleAccent}>LIMITER</Text>
        <Text style={styles.heroSubtitle}>Saitama's 3-Year Challenge</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetweenInside}>
          <Text style={styles.cardTitle}>📅 Challenge Progress</Text>
          <Text style={styles.accentText}>{challenge.progress}%</Text>
        </View>
        {renderProgressBar(challenge.progress, true)}
        <View style={styles.timelineGrid}>
          <View>
            <Text style={styles.muted}>Start Date</Text>
            <Text style={styles.valueText}>{challenge.startDate}</Text>
          </View>
          <View style={styles.centeredInfo}>
            <Text style={styles.muted}>Days</Text>
            <Text style={styles.bigAccent}>{challenge.daysPassed}</Text>
          </View>
          <View style={styles.alignRight}>
            <Text style={styles.muted}>End Date</Text>
            <Text style={styles.valueText}>{challenge.endDate}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetweenInside}>
          <Text style={styles.cardTitle}>🎯 Today's Training</Text>
          <Text style={styles.bigAccent}>75%</Text>
        </View>
        <View style={styles.circleProgress}>
          <Text style={styles.circleEmoji}>🔥</Text>
          <Text style={styles.circlePercent}>75%</Text>
          <Text style={styles.muted}>Keep pushing!</Text>
        </View>
        <View style={styles.exerciseGrid}>
          {exercises.map((item) => (
            <View key={item.label} style={styles.exerciseBox}>
              <Text style={styles.muted}>{item.label}</Text>
              <Text style={styles.exerciseValue}>{item.value}</Text>
              {item.completed && <Text style={styles.completed}>✓ Complete</Text>}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.smallCard}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statNumber}>127</Text>
          <Text style={styles.mutedSmall}>Day Streak</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.statEmoji}>📈</Text>
          <Text style={styles.statNumber}>50.8K</Text>
          <Text style={styles.mutedSmall}>Total Reps</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.statEmoji}>🏆</Text>
          <Text style={styles.statNumber}>#3</Text>
          <Text style={styles.mutedSmall}>Rank</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderWorkoutScreen = () => (
    <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
      <Header emoji="🏋️" title="CHOOSE YOUR" titleAccent="TRAINING MODE" subtitle="Saitama's legendary routine awaits" />

      <WorkoutCard
        emoji="⚡"
        title="FULL WORKOUT"
        description="Complete all exercises in one session. For the truly dedicated."
        variant="red"
        details={["100 Push-ups", "100 Sit-ups", "100 Squats", "10 km Run"]}
      />
      <WorkoutCard
        emoji="⏰"
        title="INTERCALATED WORKOUT"
        description="Split the routine into different times. Balance strength and stamina."
        variant="yellow"
        details={["Morning: 50 Push + 50 Sit-ups", "Afternoon: 50 Squats + 5 km", "Evening: Remaining + 5 km"]}
      />
      <WorkoutCard
        emoji="⏱️"
        title="SUPER INTERCALATED"
        description="Break it down into smaller sets throughout the day. Perfect for beginners."
        details={["Every 2 hours", "10-20 reps each", "6-8 sessions per day"]}
      />

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>💡 Pro Tip</Text>
        <Text style={styles.muted}>Consistency is more important than suffering. Build the habit first.</Text>
      </View>
    </ScrollView>
  );

  const renderRankingScreen = () => {
    const currentLeaderboard = rankingTab === "streak" ? leaderboardStreak : leaderboardTotal;

    return (
      <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
        <Header emoji="🏆" title="LEADERBOARD" subtitle="Compete with heroes worldwide" />

        <View style={styles.segmentedControl}>
          <SegmentButton active={rankingTab === "streak"} label="🔥 Consecutive Days" onPress={() => setRankingTab("streak")} />
          <SegmentButton active={rankingTab === "total"} label="🎯 Total Exercises" onPress={() => setRankingTab("total")} />
        </View>

        <View style={styles.filterControl}>
          <SegmentButton active={workoutFilter === "single"} label="Single Workout" onPress={() => setWorkoutFilter("single")} small />
          <SegmentButton active={workoutFilter === "intercalated"} label="Intercalated" onPress={() => setWorkoutFilter("intercalated")} small />
        </View>

        {currentLeaderboard.map((user) => (
          <View key={user.name} style={[styles.leaderCard, user.isCurrentUser && styles.currentUserCard]}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{user.rank}</Text>
            </View>
            <Text style={styles.avatar}>{user.avatar}</Text>
            <View style={styles.flex1}>
              <Text style={styles.userName}>{user.name} {user.isCurrentUser ? "• You" : ""}</Text>
              <Text style={styles.muted}>{rankingTab === "streak" ? `${user.streak} day streak` : `${user.total.toLocaleString()} total reps`}</Text>
            </View>
            <Text style={styles.leaderValue}>{rankingTab === "streak" ? user.streak : user.total.toLocaleString()}</Text>
          </View>
        ))}

        <View style={styles.performanceCard}>
          <Text style={styles.cardTitle}>Your Performance</Text>
          <View style={styles.statsRowNoMargin}>
            <View style={styles.performanceItem}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.mutedSmall}>Current Streak</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.statEmoji}>🎯</Text>
              <Text style={styles.statNumber}>50.8K</Text>
              <Text style={styles.mutedSmall}>Total Exercises</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderFriendsScreen = () => (
    <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
      <Header emoji="👥" title="FRIENDS" subtitle="Train together, grow stronger" />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>➕ Add Friends</Text>
        <TextInput placeholder="Search by username or email" placeholderTextColor="#8f8f99" style={styles.input} />
      </View>

      <View style={styles.rowBetweenOutside}>
        <Text style={styles.cardTitle}>Your Squad ({friends.length})</Text>
        <Text style={styles.muted}>Active today: 2</Text>
      </View>

      {friends.map((friend) => (
        <View key={friend.name} style={styles.friendCard}>
          <View style={styles.rowCenter}>
            <Text style={styles.avatarLarge}>{friend.avatar}</Text>
            <View style={styles.flex1}>
              <Text style={styles.userName}>{friend.name}</Text>
              <Text style={styles.muted}>🏃 {friend.status}</Text>
            </View>
            <Text style={[styles.leaderValue, friend.progress === 100 && styles.successText]}>{friend.progress}%</Text>
          </View>
          {renderProgressBar(friend.progress)}
        </View>
      ))}

      <View style={styles.performanceCard}>
        <Text style={styles.cardTitle}>🔥 Challenge Your Friends!</Text>
        <Text style={styles.muted}>Invite friends to join the 3-year challenge. Those who train together, break their limiters together!</Text>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Send Invite</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#111114" />
      <View style={styles.container}>
        {currentScreen === "home" && renderHomeScreen()}
        {currentScreen === "workout" && renderWorkoutScreen()}
        {currentScreen === "ranking" && renderRankingScreen()}
        {currentScreen === "friends" && renderFriendsScreen()}
        <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      </View>
    </SafeAreaView>
  );
}

function Header({ emoji, title, titleAccent, subtitle }: { emoji: string; title: string; titleAccent?: string; subtitle: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerEmoji}>{emoji}</Text>
      <Text style={styles.headerTitle}>{title}</Text>
      {titleAccent && <Text style={styles.headerTitleAccent}>{titleAccent}</Text>}
      <Text style={styles.headerSubtitle}>{subtitle}</Text>
    </View>
  );
}

function WorkoutCard({ emoji, title, description, details, variant }: { emoji: string; title: string; description: string; details: string[]; variant?: "red" | "yellow" }) {
  return (
    <TouchableOpacity style={[styles.workoutCard, variant === "red" && styles.workoutCardRed, variant === "yellow" && styles.workoutCardYellow]} activeOpacity={0.85}>
      <Text style={styles.workoutEmoji}>{emoji}</Text>
      <Text style={[styles.workoutTitle, variant && styles.darkText]}>{title}</Text>
      <Text style={[styles.workoutDescription, variant && styles.darkMutedText]}>{description}</Text>
      <View style={styles.detailList}>
        {details.map((item) => (
          <Text key={item} style={[styles.detailPill, variant && styles.lightPill]}>{item}</Text>
        ))}
      </View>
    </TouchableOpacity>
  );
}

function SegmentButton({ active, label, onPress, small }: { active: boolean; label: string; onPress: () => void; small?: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.segmentButton, active && styles.segmentButtonActive, small && styles.segmentButtonSmall]}>
      <Text style={[styles.segmentButtonText, active && styles.segmentButtonTextActive, small && styles.segmentButtonTextSmall]}>{label}</Text>
    </TouchableOpacity>
  );
}

function BottomNav({ currentScreen, setCurrentScreen }: { currentScreen: Screen; setCurrentScreen: (screen: Screen) => void }) {
  const items: { screen: Screen; label: string; icon: string }[] = [
    { screen: "home", label: "Home", icon: "🏠" },
    { screen: "workout", label: "Workout", icon: "🏋️" },
    { screen: "ranking", label: "Ranking", icon: "🏆" },
    { screen: "friends", label: "Friends", icon: "👥" },
  ];

  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const active = currentScreen === item.screen;
        return (
          <TouchableOpacity key={item.screen} style={styles.navButton} onPress={() => setCurrentScreen(item.screen)}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const colors = {
  background: "#111114",
  card: "#1b1b21",
  muted: "#2a2a32",
  border: "#34343d",
  text: "#ffffff",
  mutedText: "#a8a8b3",
  yellow: "#ffd600",
  red: "#ff3838",
  success: "#43d17a",
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  screenContent: { paddingBottom: 110 },
  hero: { minHeight: 245, padding: 24, justifyContent: "center", backgroundColor: "#2a2020" },
  heroEmoji: { fontSize: 64, marginBottom: 8 },
  heroTitle: { color: colors.text, fontSize: 46, fontWeight: "900", letterSpacing: 1 },
  heroTitleAccent: { color: colors.yellow, fontSize: 50, fontWeight: "900", letterSpacing: 1 },
  heroSubtitle: { color: colors.mutedText, fontSize: 14, fontWeight: "600" },
  header: { padding: 24, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: "#151519" },
  headerEmoji: { fontSize: 34, marginBottom: 8 },
  headerTitle: { color: colors.text, fontSize: 34, fontWeight: "900", letterSpacing: 1 },
  headerTitleAccent: { color: colors.yellow, fontSize: 34, fontWeight: "900", letterSpacing: 1 },
  headerSubtitle: { color: colors.mutedText, marginTop: 6, fontSize: 14 },
  card: { marginHorizontal: 20, marginTop: 20, padding: 18, borderRadius: 22, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  cardTitle: { color: colors.text, fontSize: 18, fontWeight: "800" },
  rowBetweenInside: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowBetweenOutside: { marginHorizontal: 20, marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowCenter: { flexDirection: "row", alignItems: "center", gap: 12 },
  accentText: { color: colors.yellow, fontWeight: "900" },
  muted: { color: colors.mutedText, fontSize: 13 },
  mutedSmall: { color: colors.mutedText, fontSize: 11, textAlign: "center" },
  valueText: { color: colors.text, fontWeight: "800", marginTop: 4 },
  bigAccent: { color: colors.yellow, fontWeight: "900", fontSize: 24 },
  progressTrack: { height: 8, backgroundColor: colors.muted, borderRadius: 999, overflow: "hidden", marginTop: 12 },
  progressTrackLarge: { height: 12, marginVertical: 18 },
  progressFill: { height: "100%", backgroundColor: colors.yellow, borderRadius: 999 },
  timelineGrid: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" },
  centeredInfo: { alignItems: "center" },
  alignRight: { alignItems: "flex-end" },
  circleProgress: { alignSelf: "center", width: 185, height: 185, borderRadius: 100, borderWidth: 14, borderColor: colors.yellow, alignItems: "center", justifyContent: "center", marginVertical: 22, backgroundColor: "#151519" },
  circleEmoji: { fontSize: 36 },
  circlePercent: { color: colors.text, fontSize: 34, fontWeight: "900" },
  exerciseGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  exerciseBox: { width: "48%", padding: 14, borderRadius: 16, backgroundColor: colors.muted },
  exerciseValue: { color: colors.text, fontSize: 21, fontWeight: "900", marginTop: 5 },
  completed: { color: colors.yellow, fontSize: 12, marginTop: 4, fontWeight: "800" },
  statsRow: { flexDirection: "row", gap: 10, marginHorizontal: 20, marginTop: 16 },
  statsRowNoMargin: { flexDirection: "row", gap: 10, marginTop: 16 },
  smallCard: { flex: 1, padding: 14, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: "center" },
  statEmoji: { fontSize: 24, marginBottom: 5 },
  statNumber: { color: colors.text, fontSize: 24, fontWeight: "900", textAlign: "center" },
  workoutCard: { marginHorizontal: 20, marginTop: 18, padding: 20, borderRadius: 24, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  workoutCardRed: { backgroundColor: colors.red, borderColor: "#ff7777" },
  workoutCardYellow: { backgroundColor: colors.yellow, borderColor: "#fff08a" },
  workoutEmoji: { fontSize: 34, marginBottom: 10 },
  workoutTitle: { color: colors.text, fontSize: 26, fontWeight: "900" },
  workoutDescription: { color: colors.mutedText, marginTop: 6, marginBottom: 14, lineHeight: 20 },
  darkText: { color: "#161616" },
  darkMutedText: { color: "#2c2c2c" },
  detailList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  detailPill: { color: colors.text, backgroundColor: colors.muted, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12, overflow: "hidden", fontWeight: "800", fontSize: 12 },
  lightPill: { color: "#161616", backgroundColor: "rgba(255,255,255,0.35)" },
  tipBox: { marginHorizontal: 20, marginTop: 20, padding: 16, borderRadius: 18, backgroundColor: "rgba(255,214,0,0.08)", borderWidth: 1, borderColor: "rgba(255,214,0,0.3)" },
  tipTitle: { color: colors.text, fontWeight: "900", marginBottom: 6 },
  segmentedControl: { flexDirection: "row", gap: 8, marginHorizontal: 20, marginTop: 20, padding: 5, borderRadius: 18, backgroundColor: colors.muted },
  filterControl: { flexDirection: "row", gap: 8, marginHorizontal: 20, marginTop: 12, padding: 5, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  segmentButton: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: "center" },
  segmentButtonActive: { backgroundColor: colors.yellow },
  segmentButtonSmall: { paddingVertical: 9 },
  segmentButtonText: { color: colors.mutedText, fontWeight: "800", fontSize: 12 },
  segmentButtonTextActive: { color: "#111" },
  segmentButtonTextSmall: { fontSize: 11 },
  leaderCard: { flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 20, marginTop: 12, padding: 14, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  currentUserCard: { borderColor: colors.yellow, backgroundColor: "#272115" },
  rankBadge: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.muted, alignItems: "center", justifyContent: "center" },
  rankText: { color: colors.yellow, fontWeight: "900", fontSize: 19 },
  avatar: { fontSize: 28 },
  avatarLarge: { width: 54, height: 54, fontSize: 32, textAlign: "center", textAlignVertical: "center", borderRadius: 28, backgroundColor: colors.muted, overflow: "hidden" },
  flex1: { flex: 1 },
  userName: { color: colors.text, fontSize: 16, fontWeight: "900" },
  leaderValue: { color: colors.yellow, fontSize: 20, fontWeight: "900" },
  performanceCard: { marginHorizontal: 20, marginTop: 20, padding: 18, borderRadius: 22, backgroundColor: "rgba(255,214,0,0.08)", borderWidth: 1, borderColor: "rgba(255,214,0,0.4)" },
  performanceItem: { flex: 1, padding: 14, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.05)", alignItems: "center" },
  input: { marginTop: 14, borderRadius: 16, backgroundColor: colors.muted, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 14, color: colors.text },
  friendCard: { marginHorizontal: 20, marginTop: 12, padding: 16, borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  successText: { color: colors.success },
  primaryButton: { alignSelf: "flex-start", marginTop: 14, backgroundColor: colors.yellow, borderRadius: 12, paddingVertical: 11, paddingHorizontal: 18 },
  primaryButtonText: { color: "#111", fontWeight: "900" },
  bottomNav: { position: "absolute", left: 0, right: 0, bottom: 0, flexDirection: "row", justifyContent: "space-around", paddingTop: 10, paddingBottom: 16, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border },
  navButton: { alignItems: "center", gap: 2, minWidth: 70 },
  navIcon: { fontSize: 22 },
  navLabel: { color: colors.mutedText, fontSize: 11, fontWeight: "800" },
  navLabelActive: { color: colors.yellow },
});
