import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";

const resources = {
  en: { translation: translationEN },
  es: { translation: translationES },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // El público es mexicano: quien llega sin preferencia guardada debe ver
    // español. Con "en" un visitante nuevo caía en inglés y, mientras
    // LanguageSwitcher siga desmontado, no tenía forma de cambiarlo.
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    load: "languageOnly", // es-MX y en-US resuelven a es / en
    detection: {
      order: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
