import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  loginWithEmail,
  registerWithEmail,
} from "../services/authService";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await loginWithEmail({ email, password });
        return;
      }

      if (!name.trim() || !username.trim()) {
        setError("Preencha nome e username para se cadastrar.");
        return;
      }

      await registerWithEmail({
        name: name.trim(),
        username: username.trim(),
        email,
        password,
      });
    } catch (authError: any) {
      setError(authError?.message || "Não foi possível autenticar.");
      Alert.alert("Erro", error || authError?.message || "Ops, falha no login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Limiter Breaker</Text>
        <Text style={styles.subtitle}>
          {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
        </Text>

        {mode === "register" && (
          <>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nome"
              placeholderTextColor="#8f8f99"
              style={styles.input}
              autoCapitalize="words"
            />
            <TextInput
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor="#8f8f99"
              style={styles.input}
              autoCapitalize="none"
            />
          </>
        )}

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#8f8f99"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          placeholderTextColor="#8f8f99"
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#111" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {mode === "login" ? "Entrar" : "Cadastrar"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
        >
          <Text style={styles.switchText}>
            {mode === "login"
              ? "Ainda não tem conta? Cadastre-se"
              : "Já tem conta? Entrar"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111114",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 24,
    backgroundColor: "#1b1b21",
    padding: 28,
    borderWidth: 1,
    borderColor: "#34343d",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#ffd600",
    marginBottom: 8,
  },
  subtitle: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 22,
  },
  input: {
    backgroundColor: "#151519",
    borderColor: "#34343d",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#ffffff",
    marginBottom: 14,
  },
  errorText: {
    color: "#ff3838",
    marginBottom: 14,
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: "#ffd600",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#111114",
    fontWeight: "900",
    fontSize: 16,
  },
  switchButton: {
    marginTop: 16,
    alignItems: "center",
  },
  switchText: {
    color: "#8f8f99",
    fontSize: 14,
  },
});
