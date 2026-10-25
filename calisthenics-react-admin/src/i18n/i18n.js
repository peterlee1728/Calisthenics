import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    // add more languages here, e.g.:
    // zh: { translation: zh },
  },
  lng: "en", // default language
  fallbackLng: "en", // fallback if a key is missing in the active language
  interpolation: {
    escapeValue: false, // React already escapes output
  },
});

export default i18n;
