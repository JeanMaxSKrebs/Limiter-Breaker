const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.resolve(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const env = {};
  const content = fs.readFileSync(envPath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const [key, ...rest] = trimmed.split("=");
    env[key] = rest.join("=").trim();
  });

  return env;
}

const env = loadEnv();

module.exports = {
  expo: {
    name: "Limiter Breaker",
    slug: "limiter-breaker",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "dark",
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.jeanmaxskrebs.limiterbreaker",
    },
    web: {
      bundler: "metro",
    },
    extra: {
      firebaseApiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY || null,
      firebaseAuthDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || null,
      firebaseProjectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || null,
      firebaseStorageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || null,
      firebaseMessagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || null,
      firebaseAppId: env.EXPO_PUBLIC_FIREBASE_APP_ID || null,
      firebaseMeasurementId: env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || null,
    },
  },
};
