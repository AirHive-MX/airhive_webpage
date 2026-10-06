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
    /*
     * El idioma sale del navegador: con el teléfono o la computadora en inglés
     * se ve en inglés; con cualquier otro idioma, en español, que es el del
     * público principal. No hay selector, así que tampoco se guarda nada: si
     * se guardara, alguien que entró una vez en español se quedaría así aunque
     * cambiara su navegador. Por lo mismo ya no se lee localStorage (antes era
     * la única fuente, y todos acababan en español).
     */
    fallbackLng: "es",
    supportedLngs: ["es", "en"],
    nonExplicitSupportedLngs: true, // en-US, en-GB… cuentan como en
    load: "languageOnly", // es-MX y en-US resuelven a es / en
    detection: {
      order: ["navigator"],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  });

// Que el <html lang> diga el idioma real: lo usan lectores de pantalla,
// traductores del navegador y buscadores.
const marcarIdioma = (lng) => {
  document.documentElement.lang = (lng || "es").split("-")[0];
};
marcarIdioma(i18n.resolvedLanguage);
i18n.on("languageChanged", marcarIdioma);

export default i18n;
