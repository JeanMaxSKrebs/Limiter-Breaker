import { Alert } from "react-native";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalization } from "../localization/LocalizationContext";

interface SettingsScreenProps {
  onViewCredits: () => void;
  onLogout: () => void;
}

export default function SettingsScreen({ onViewCredits, onLogout }: SettingsScreenProps) {
  const { t, language, setLanguage } = useLocalization();

  const handleLanguageSelect = async (nextLanguage: "pt-BR" | "en-US") => {
    try {
      await setLanguage(nextLanguage);
    } catch (error: any) {
      Alert.alert(t("common.error"), error?.message || t("common.error"));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t("settings.title")}</Text>
        <Text style={styles.subtitle}>{t("settings.subtitle")}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("settings.language")}</Text>
        <Text style={styles.cardSubtitle}>{t("settings.languageDescription")}</Text>
        <View style={styles.optionList}>
          <TouchableOpacity
            style={[styles.optionButton, language === "pt-BR" && styles.optionButtonActive]}
            onPress={() => handleLanguageSelect("pt-BR")}
          >
            <Text style={[styles.optionText, language === "pt-BR" && styles.optionTextActive]}>{t("settings.portuguese")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionButton, language === "en-US" && styles.optionButtonActive]}
            onPress={() => handleLanguageSelect("en-US")}
          >
            <Text style={[styles.optionText, language === "en-US" && styles.optionTextActive]}>{t("settings.english")}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("settings.credits")}</Text>
        <Text style={styles.cardSubtitle}>{t("settings.creditsDescription")}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={onViewCredits}>
          <Text style={styles.primaryButtonText}>{t("settings.viewCredits")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t("settings.about")}</Text>
        <Text style={styles.cardSubtitle}>{t("settings.aboutDescription")}</Text>
        <Text style={styles.valueText}>{t("settings.version")}: 1.0.0</Text>
        <Text style={styles.valueText}>{t("settings.developedBy")}</Text>
      </View>

      <TouchableOpacity style={[styles.primaryButton, styles.logoutButton]} onPress={onLogout}>
        <Text style={styles.primaryButtonText}>{t("settings.logout")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 120 },
  card: { marginHorizontal: 20, marginTop: 20, padding: 18, borderRadius: 22, backgroundColor: "#1b1b21", borderWidth: 1, borderColor: "#34343d" },
  title: { color: "#ffd600", fontSize: 34, fontWeight: "900", marginBottom: 8 },
  subtitle: { color: "#ffffff", fontSize: 16, marginTop: 4 },
  cardTitle: { color: "#ffffff", fontSize: 18, fontWeight: "800", marginBottom: 8 },
  cardSubtitle: { color: "#a8a8b3", fontSize: 13, marginBottom: 12 },
  optionList: { gap: 10 },
  optionButton: { padding: 16, borderRadius: 16, backgroundColor: "#151519", borderWidth: 1, borderColor: "#34343d", marginBottom: 8 },
  optionButtonActive: { backgroundColor: "#ffd600" },
  optionText: { color: "#ffffff", fontWeight: "700" },
  optionTextActive: { color: "#111114" },
  primaryButton: { alignSelf: "flex-start", marginTop: 8, backgroundColor: "#ffd600", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18 },
  primaryButtonText: { color: "#111114", fontWeight: "900" },
  valueText: { color: "#ffffff", marginTop: 8 },
  logoutButton: { width: "90%", marginHorizontal: 20 },
});