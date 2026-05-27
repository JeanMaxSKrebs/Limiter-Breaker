import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { User } from "firebase/auth";
import AuthScreen from "./screens/AuthScreen";
import { logout, listenAuthState } from "./services/authService";
import {
  completeWorkout,
  getTodayId,
  listenTodayProgress,
  listenUserProfile,
  saveDailyProgress,
} from "./services/progressService";
import {
  listenGlobalStreakRanking,
  listenTotalExercisesRanking,
} from "./services/rankingService";
import {
  acceptFriendRequest,
  listenFriendRequests,
  listenFriends,
  rejectFriendRequest,
  searchUsersByUsername,
  sendFriendRequest,
} from "./services/friendsService";
import {
  DailyProgress,
  RankingUser,
  UserProfile,
  WorkoutMode,
} from "./types/firebase";

type Screen = "home" | "workout" | "ranking" | "friends";
type RankingTab = "streak" | "total";

type FriendRequest = {
  id: string;
  fromUid: string;
  toUid: string;
  status: string;
};

type FriendItem = {
  id: string;
  uid: string;
  displayName: string;
  status: string;
};

export default function LimiterBreakerApp() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayProgress, setTodayProgress] = useState<DailyProgress | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [rankingTab, setRankingTab] = useState<RankingTab>("streak");
  const [workoutMode, setWorkoutMode] = useState<WorkoutMode>("full");
  const [globalRanking, setGlobalRanking] = useState<RankingUser[]>([]);
  const [totalRanking, setTotalRanking] = useState<RankingUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendsList, setFriendsList] = useState<FriendItem[]>([]);
  const [savingWorkout, setSavingWorkout] = useState(false);

  useEffect(() => {
    const unsubscribe = listenAuthState((authUser) => {
      setUser(authUser);
      setInitializing(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setTodayProgress(null);
      setGlobalRanking([]);
      setTotalRanking([]);
      setSearchResults([]);
      setFriendRequests([]);
      setFriendsList([]);
      return;
    }

    const unsubProfile = listenUserProfile(user.uid, setProfile);
    const unsubProgress = listenTodayProgress(user.uid, setTodayProgress);
    const unsubGlobal = listenGlobalStreakRanking(setGlobalRanking);
    const unsubTotal = listenTotalExercisesRanking(setTotalRanking);
    const unsubRequests = listenFriendRequests(user.uid, setFriendRequests);
    const unsubFriends = listenFriends(user.uid, setFriendsList);

    return () => {
      unsubProfile();
      unsubProgress();
      unsubGlobal();
      unsubTotal();
      unsubRequests();
      unsubFriends();
    };
  }, [user]);

  const todayId = getTodayId();

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

  const todaySnapshot: DailyProgress = todayProgress || {
    id: todayId,
    date: todayId,
    pushups: 0,
    situps: 0,
    squats: 0,
    runKm: 0,
    completed: false,
    createdAt: null,
    updatedAt: null,
  };

  const renderProgressBar = (value: number, large = false) => (
    <View style={[styles.progressTrack, large && styles.progressTrackLarge]}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%` }]} />
    </View>
  );

  const isProgressComplete =
    todaySnapshot.pushups >= 100 &&
    todaySnapshot.situps >= 100 &&
    todaySnapshot.squats >= 100 &&
    todaySnapshot.runKm >= 10;

  const progressPercent = Math.round(
    Math.min(
      100,
      ((Math.min(100, todaySnapshot.pushups) / 100 +
        Math.min(100, todaySnapshot.situps) / 100 +
        Math.min(100, todaySnapshot.squats) / 100 +
        Math.min(10, todaySnapshot.runKm) / 10) / 4) * 100
    )
  );

  const totalExercises = profile
    ? profile.totalPushups + profile.totalSitups + profile.totalSquats + profile.totalRunKm
    : 0;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Não foi possível sair.");
    }
  };

  const handleAddProgress = async (delta: {
    pushups?: number;
    situps?: number;
    squats?: number;
    runKm?: number;
  }) => {
    if (!user) {
      return;
    }

    setSavingWorkout(true);
    try {
      const updated = {
        date: todayId,
        pushups: Math.max(0, Math.min(999, todaySnapshot.pushups + (delta.pushups || 0))),
        situps: Math.max(0, Math.min(999, todaySnapshot.situps + (delta.situps || 0))),
        squats: Math.max(0, Math.min(999, todaySnapshot.squats + (delta.squats || 0))),
        runKm: Math.max(0, todaySnapshot.runKm + (delta.runKm || 0)),
        completed:
          Math.max(0, todaySnapshot.pushups + (delta.pushups || 0)) >= 100 &&
          Math.max(0, todaySnapshot.situps + (delta.situps || 0)) >= 100 &&
          Math.max(0, todaySnapshot.squats + (delta.squats || 0)) >= 100 &&
          Math.max(0, todaySnapshot.runKm + (delta.runKm || 0)) >= 10,
      };

      await saveDailyProgress(user.uid, updated);
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Falha ao salvar progresso.");
    } finally {
      setSavingWorkout(false);
    }
  };

  const handleCompleteWorkout = async () => {
    if (!user) {
      return;
    }

    setSavingWorkout(true);
    try {
      await completeWorkout(user.uid, {
        pushups: 100,
        situps: 100,
        squats: 100,
        runKm: 10,
      });
      Alert.alert("Treino completo", "Seu progresso foi atualizado.");
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Falha ao completar treino.");
    } finally {
      setSavingWorkout(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    try {
      const results = await searchUsersByUsername(searchQuery);
      setSearchResults(results.filter((item) => item.uid !== user?.uid));
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Falha ao buscar usuário.");
    }
  };

  const handleSendRequest = async (uid: string) => {
    if (!user) {
      return;
    }

    try {
      await sendFriendRequest(user.uid, uid);
      Alert.alert("Solicitação enviada", "Sua solicitação de amizade foi registrada.");
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Não foi possível enviar a solicitação.");
    }
  };

  const handleAccept = async (request: FriendRequest) => {
    if (!user) {
      return;
    }

    try {
      await acceptFriendRequest(request.id, request.fromUid, user.uid);
      Alert.alert("Amizade aceita", "Você agora é amigo desse usuário.");
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Falha ao aceitar solicitação.");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectFriendRequest(requestId);
      Alert.alert("Solicitação rejeitada", "A solicitação foi rejeitada.");
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Falha ao rejeitar solicitação.");
    }
  };

  if (initializing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centeredContainer]}>
          <ActivityIndicator size="large" color="#ffd600" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  const profileName = profile?.displayName || "Herói";
  const usernameLabel = profile?.username ? `@${profile.username}` : "";

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
          <Text style={styles.cardTitle}>Olá, {profileName}</Text>
          <Text style={styles.muted}>{usernameLabel}</Text>
        </View>
        <Text style={[styles.muted, { marginTop: 12 }]}>Último login: {profile?.lastLoginAt ? new Date(profile.lastLoginAt.seconds * 1000).toLocaleString() : "—"}</Text>
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
          <Text style={styles.accentText}>{progressPercent}%</Text>
        </View>
        <View style={styles.circleProgress}>
          <Text style={styles.circleEmoji}>🔥</Text>
          <Text style={styles.circlePercent}>{progressPercent}%</Text>
          <Text style={styles.muted}>{isProgressComplete ? "Treino completo" : "Continue assim"}</Text>
        </View>
        <View style={styles.exerciseGrid}>
          {[
            { label: "Push-ups", value: `${todaySnapshot.pushups}/100` },
            { label: "Sit-ups", value: `${todaySnapshot.situps}/100` },
            { label: "Squats", value: `${todaySnapshot.squats}/100` },
            { label: "Run", value: `${todaySnapshot.runKm.toFixed(1)}/10 km` },
          ].map((item) => (
            <View key={item.label} style={styles.exerciseBox}>
              <Text style={styles.muted}>{item.label}</Text>
              <Text style={styles.exerciseValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.smallCard}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statNumber}>{profile?.currentStreak ?? 0}</Text>
          <Text style={styles.mutedSmall}>Day Streak</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.statEmoji}>📈</Text>
          <Text style={styles.statNumber}>{Math.round(totalExercises)}</Text>
          <Text style={styles.mutedSmall}>Total Exercises</Text>
        </View>
        <View style={styles.smallCard}>
          <Text style={styles.statEmoji}>🏆</Text>
          <Text style={styles.statNumber}>{profile?.bestStreak ?? 0}</Text>
          <Text style={styles.mutedSmall}>Best Streak</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderWorkoutScreen = () => (
    <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
      <Header emoji="🏋️" title="WORKOUT" subtitle="Complete seu treino do dia" />

      <View style={styles.segmentedControl}>
        <SegmentButton active={workoutMode === "full"} label="FULL" onPress={() => setWorkoutMode("full")} />
        <SegmentButton active={workoutMode === "intercalated"} label="INTERCALATED" onPress={() => setWorkoutMode("intercalated")} />
        <SegmentButton active={workoutMode === "super_intercalated"} label="SUPER" onPress={() => setWorkoutMode("super_intercalated")} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Seu progresso hoje</Text>
        <Text style={styles.muted}>{todayId}</Text>
        {renderProgressBar(progressPercent, true)}
        <View style={styles.timelineGrid}>
          <View>
            <Text style={styles.muted}>Push-ups</Text>
            <Text style={styles.valueText}>{todaySnapshot.pushups}/100</Text>
          </View>
          <View>
            <Text style={styles.muted}>Sit-ups</Text>
            <Text style={styles.valueText}>{todaySnapshot.situps}/100</Text>
          </View>
          <View>
            <Text style={styles.muted}>Squats</Text>
            <Text style={styles.valueText}>{todaySnapshot.squats}/100</Text>
          </View>
          <View>
            <Text style={styles.muted}>Run</Text>
            <Text style={styles.valueText}>{todaySnapshot.runKm.toFixed(1)}/10 km</Text>
          </View>
        </View>

        <View style={styles.rowBetweenInside}>
          <TouchableOpacity
            style={[styles.primaryButton, { width: "48%" }]}
            onPress={() => handleAddProgress({ pushups: 20, situps: 20, squats: 20, runKm: 1 })}
            disabled={savingWorkout}
          >
            <Text style={styles.primaryButtonText}>+20 / +1km</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, { width: "48%" }]}
            onPress={() => handleAddProgress({ pushups: 50, situps: 50, squats: 50, runKm: 3 })}
            disabled={savingWorkout}
          >
            <Text style={styles.primaryButtonText}>+50 / +3km</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, { width: "100%" }]}
          onPress={handleCompleteWorkout}
          disabled={savingWorkout}
        >
          {savingWorkout ? (
            <ActivityIndicator color="#111" />
          ) : (
            <Text style={styles.primaryButtonText}>Completar Treino 100/100/100/10</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderRankingScreen = () => {
    const currentLeaderboard = rankingTab === "streak" ? globalRanking : totalRanking;

    return (
      <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
        <Header emoji="🏆" title="RANKING" subtitle="Veja os melhores do momento" />

        <View style={styles.segmentedControl}>
          <SegmentButton active={rankingTab === "streak"} label="🔥 Dias" onPress={() => setRankingTab("streak")} />
          <SegmentButton active={rankingTab === "total"} label="🎯 Total" onPress={() => setRankingTab("total")} />
        </View>

        {currentLeaderboard.length === 0 ? (
          <View style={[styles.card, { marginTop: 20 }]}> 
            <Text style={styles.muted}>Carregando ranking...</Text>
          </View>
        ) : (
          currentLeaderboard.map((item, index) => (
            <View key={item.uid} style={[styles.leaderCard, item.uid === user.uid && styles.currentUserCard]}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <Text style={styles.avatar}>💪</Text>
              <View style={styles.flex1}>
                <Text style={styles.userName}>{item.displayName}</Text>
                <Text style={styles.muted}>
                  {rankingTab === "streak"
                    ? `${item.currentStreak} dia(s)`
                    : `${Math.round(item.totalExercises)} pts`}
                </Text>
              </View>
              <Text style={styles.leaderValue}>
                {rankingTab === "streak" ? item.currentStreak : Math.round(item.totalExercises)}
              </Text>
            </View>
          ))
        )}

        <View style={styles.performanceCard}>
          <Text style={styles.cardTitle}>Seu desempenho</Text>
          <View style={styles.statsRowNoMargin}>
            <View style={styles.performanceItem}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statNumber}>{profile?.currentStreak ?? 0}</Text>
              <Text style={styles.mutedSmall}>Current Streak</Text>
            </View>
            <View style={styles.performanceItem}>
              <Text style={styles.statEmoji}>🎯</Text>
              <Text style={styles.statNumber}>{Math.round(totalExercises)}</Text>
              <Text style={styles.mutedSmall}>Total Exercises</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderFriendsScreen = () => (
    <ScrollView contentContainerStyle={styles.screenContent} showsVerticalScrollIndicator={false}>
      <Header emoji="👥" title="FRIENDS" subtitle="Treine junto com seus amigos" />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pesquisar usuário</Text>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Digite o username"
          placeholderTextColor="#8f8f99"
          style={styles.input}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleSearch}>
          <Text style={styles.primaryButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {searchResults.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resultados</Text>
          {searchResults.map((result) => (
            <View key={result.uid} style={[styles.friendCard, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
              <View>
                <Text style={styles.userName}>{result.displayName}</Text>
                <Text style={styles.muted}>@{result.username}</Text>
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={() => handleSendRequest(result.uid)}>
                <Text style={styles.primaryButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {friendRequests.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Solicitações</Text>
          {friendRequests.map((request) => (
            <View key={request.id} style={[styles.friendCard, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}>
              <View>
                <Text style={styles.userName}>Solicitação de {request.fromUid}</Text>
                <Text style={styles.muted}>{request.status}</Text>
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TouchableOpacity style={[styles.primaryButton, { paddingHorizontal: 12 }]} onPress={() => handleAccept(request)}>
                  <Text style={styles.primaryButtonText}>Aceitar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.primaryButton, { paddingHorizontal: 12, backgroundColor: colors.red }]} onPress={() => handleReject(request.id)}>
                  <Text style={styles.primaryButtonText}>Rejeitar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Amigos</Text>
        {friendsList.length === 0 ? (
          <Text style={styles.muted}>Nenhum amigo ainda. Encontre alguém para treinar com você.</Text>
        ) : (
          friendsList.map((friend) => (
            <View key={friend.id} style={styles.friendCard}>
              <Text style={styles.userName}>{friend.displayName || friend.uid}</Text>
              <Text style={styles.muted}>{friend.status}</Text>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={[styles.primaryButton, { marginHorizontal: 20 }]} onPress={handleLogout}>
        <Text style={styles.primaryButtonText}>Sair</Text>
      </TouchableOpacity>
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
  centeredContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
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
