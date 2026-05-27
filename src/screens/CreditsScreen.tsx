import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalization } from "../localization/LocalizationContext";

interface CreditsScreenProps {
  onGoBack: () => void;
}

export default function CreditsScreen({ onGoBack }: CreditsScreenProps) {
  const { t } = useLocalization();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t("credits.title")}</Text>
        <Text style={styles.sectionTitle}>{t("credits.createdBy")}</Text>
        <Text style={styles.content}>{t("credits.developerName")}</Text>

        <Text style={styles.sectionTitle}>{t("credits.concept")}</Text>
        <Text style={styles.content}>{t("credits.conceptText")}</Text>

        <Text style={styles.sectionTitle}>{t("credits.inspiration")}</Text>
        <Text style={styles.content}>{t("credits.inspirationText")}</Text>

        <Text style={styles.sectionTitle}>{t("credits.disclaimer")}</Text>
        <Text style={styles.content}>{t("credits.disclaimerText")}</Text>

        <Text style={styles.sectionTitle}>{t("credits.thanks")}</Text>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onGoBack}>
        <Text style={styles.primaryButtonText}>{t("common.back")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 120 },
  card: { marginHorizontal: 20, marginTop: 20, padding: 18, borderRadius: 22, backgroundColor: "#1b1b21", borderWidth: 1, borderColor: "#34343d" },
  title: { color: "#ffd600", fontSize: 34, fontWeight: "900", marginBottom: 16 },
  sectionTitle: { color: "#ffffff", fontSize: 16, fontWeight: "800", marginTop: 16, marginBottom: 6 },
  content: { color: "#a8a8b3", fontSize: 14, lineHeight: 22 },
  primaryButton: { alignSelf: "flex-start", marginTop: 20, marginHorizontal: 20, backgroundColor: "#ffd600", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 18 },
  primaryButtonText: { color: "#111114", fontWeight: "900" },
});