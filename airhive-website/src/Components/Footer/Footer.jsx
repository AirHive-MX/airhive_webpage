import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("airhive_theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
      return;
    }

    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = systemPrefersDark ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("airhive_theme", theme);
  }, [theme]);

  return (
    <footer className="mt-24 bg-[#202020] px-6 pb-10 pt-16 text-[#DDDDDD]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 border-b border-white/10 pb-10 md:grid-cols-4">
        <div>
          <img
            src="/Air Hive Logo.png"
            alt="Air Hive"
            className="mb-4 h-11 w-auto [filter:hue-rotate(220deg)_saturate(1.2)_brightness(0.85)]"
          />
          <p className="max-w-xs text-sm leading-relaxed text-[#DDDDDD]/85">{t("footer.description")}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">{t("footer.navigation")}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">{t("navbar.home")}</Link></li>
            <li><Link to="/about" className="hover:text-white">{t("navbar.about")}</Link></li>
            <li><Link to="/products" className="hover:text-white">{t("navbar.products")}</Link></li>
            <li><Link to="/services" className="hover:text-white">{t("navbar.services")}</Link></li>
            <li><Link to="/contact" className="hover:text-white">{t("navbar.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">{t("footer.resources")}</h3>
          <ul className="space-y-2 text-sm text-[#DDDDDD]/85">
            <li>{t("footer.help_center")}</li>
            <li>{t("footer.terms")}</li>
            <li>{t("footer.privacy")}</li>
            <li>{t("footer.downloads")}</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">{t("footer.follow")}</h3>
          <div className="mb-6 flex gap-4 text-xl">
            <a href="https://www.instagram.com/airhive.mx?igsh=aDR1dnBmbmJlOXMx" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/company/air-hive/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaLinkedin />
            </a>
            <a href="https://www.tiktok.com/@airhivemx?_t=ZN-8wjgqehh72d&_r=1" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaTiktok />
            </a>
            <a href="https://www.facebook.com/share/16QM1b3opP/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <FaFacebook />
            </a>
          </div>
          <Link
            to="/contact"
            className="ah-button ah-button-primary inline-block rounded-full px-4 py-2 text-sm font-semibold"
          >
            {t("footer.diagnostic")}
          </Link>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1 text-xs">
            <span className="px-2 text-[#DDDDDD]/75">{t("footer.language")}</span>
            <button
              type="button"
              onClick={() => i18n.changeLanguage("es")}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                i18n.language?.startsWith("es")
                  ? "bg-[#2A47F6] text-white"
                  : "text-[#DDDDDD] hover:bg-white/10"
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => i18n.changeLanguage("en")}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                i18n.language?.startsWith("en")
                  ? "bg-[#2A47F6] text-white"
                  : "text-[#DDDDDD] hover:bg-white/10"
              }`}
            >
              EN
            </button>
          </div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1 text-xs">
            <span className="px-2 text-[#DDDDDD]/75">{t("footer.theme")}</span>
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                theme === "light"
                  ? "bg-[#2A47F6] text-white"
                  : "text-[#DDDDDD] hover:bg-white/10"
              }`}
            >
              {t("footer.theme_light")}
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                theme === "dark"
                  ? "bg-[#2A47F6] text-white"
                  : "text-[#DDDDDD] hover:bg-white/10"
              }`}
            >
              {t("footer.theme_dark")}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-7xl flex-col gap-3 text-xs text-[#DDDDDD]/70 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Air Hive S.A.S. de C.V. {t("footer.rights_reserved")}</p>
        <p>{t("footer.tagline")}</p>
      </div>
    </footer>
  );
};

export default Footer;
