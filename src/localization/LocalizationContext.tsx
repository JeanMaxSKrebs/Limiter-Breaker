import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LANGUAGE_STORAGE_KEY, Language, languages } from "./languages";
import { translations } from "./translations";

export type TranslationKey = string;

interface LocalizationContextValue {
  language: Language;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
  loading: boolean;
}

const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

function getValueByPath(obj: any, path: string): string | null {
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }
  return typeof current === "string" ? current : null;
}

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("pt-BR");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then((value) => {
        if (value === "en-US" || value === "pt-BR") {
          setLanguageState(value);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const setLanguage = async (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // ignore storage failures
    }
  };

  const t = (key: TranslationKey) => {
    const result = getValueByPath(translations[language], key);
    if (result) {
      return result;
    }
    const fallback = getValueByPath(translations["pt-BR"], key);
    return fallback ?? key;
  };

  const value = useMemo(
    () => ({ language, setLanguage, t, loading }),
    [language, loading]
  );

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider");
  }
  return context;
}
