import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files directly
import translationEN from "./locales/en/translation.json";
import translationAR from "./locales/ar/translation.json";

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN,
    },
    ar: {
      translation: translationAR,
    },
  },
  lng: "ar",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
