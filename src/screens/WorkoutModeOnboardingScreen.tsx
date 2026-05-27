import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalization } from "../localization/LocalizationContext";
import { WorkoutMode } from "../types/firebase";

interface WorkoutModeOnboardingScreenProps {
  onSelectMode: (mode: WorkoutMode) => void;
}

const options: Array<{
  mode: WorkoutMode;
  titleKey: string;
  descriptionKey: string;
  emoji: string;
}> = [
  {
    mode: "full",
    titleKey: "onboarding.full.title",
    descriptionKey: "onboarding.full.description",
    emoji: "🔥",
  },
  {
    mode: "intercalated",
    titleKey: "onboarding.intercalated.title",
    descriptionKey: "onboarding.intercalated.description",
    emoji: "⏱️",
  },
  {
    mode: "super_intercalated",
    titleKey: "onboarding.super.title",
    descriptionKey: "onboarding.super.description",
    emoji: "⚡",
  },
];

export default function WorkoutModeOnboardingScreen({ onSelectMode }: WorkoutModeOnboardingScreenProps) {
  const { t } = useLocalization();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{t("onboarding.title")}</Text>
        <Text style={styles.heroSubtitle}>{t("onboarding.subtitle")}</Text>
        <Text style={styles.heroNote}>{t("onboarding.note")}</Text>
      </View>

      {options.map((option) => (
        <TouchableOpacity
          key={option.mode}
          style={styles.card}
          onPress={() => onSelectMode(option.mode)}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>{option.emoji}</Text>
            <Text style={styles.cardTitle}>{t(option.titleKey)}</Text>
          </View>
          <Text style={styles.cardDescription}>{t(option.descriptionKey)}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.footerText}>{t("onboarding.changeLater")}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 120, backgroundColor: "#111114" },
  hero: { marginTop: 24, marginBottom: 16, padding: 22, borderRadius: 24, backgroundColor: "#1b1b21", borderWidth: 1, borderColor: "#34343d" },
  heroTitle: { color: "#ffd600", fontSize: 32, fontWeight: "900", marginBottom: 12 },
  heroSubtitle: { color: "#ffffff", fontSize: 16, marginBottom: 8 },
  heroNote: { color: "#a8a8b3", fontSize: 14, lineHeight: 20 },
  card: { marginBottom: 16, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: "#34343d", backgroundColor: "#151519" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  cardEmoji: { fontSize: 28 },
  cardTitle: { color: "#ffffff", fontSize: 20, fontWeight: "800" },
  cardDescription: { color: "#a8a8b3", fontSize: 14, lineHeight: 20 },
  footerText: { marginTop: 10, color: "#8f8f99", fontSize: 13, textAlign: "center" },
});