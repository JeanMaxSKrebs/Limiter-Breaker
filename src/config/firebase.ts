import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const extra = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: extra.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: extra.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: extra.firebaseStorageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    extra.firebaseMessagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: extra.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId:
    extra.firebaseMeasurementId || process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let _auth: any;

try {
  // try to load react-native persistence dynamically
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rn = require("firebase/auth/react-native");
  const persistence = rn?.getReactNativePersistence
    ? rn.getReactNativePersistence(AsyncStorage)
    : undefined;

  if (persistence) {
    _auth = initializeAuth(app, { persistence });
  } else {
    _auth = getAuth(app);
  }
} catch (e) {
  _auth = getAuth(app);
}

export const auth = _auth as ReturnType<typeof getAuth>;
export const db = getFirestore(app);

try {
  if (typeof enableIndexedDbPersistence === "function") {
    enableIndexedDbPersistence(db).catch(() => {
      // persistence may not be supported in this environment, ignore.
    });
  }
} catch {
  // ignore unsupported persistence attempts in React Native/Expo
}
