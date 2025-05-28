import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react"; // Icono elegante

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = lang === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
    setLang(newLang);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 bg-[#0f0f0f] text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition-all"
      >
        <Globe className="w-5 h-5" />
        {lang === "es" ? "English" : "Español"}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
