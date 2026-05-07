import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";
import { useTranslation } from "react-i18next";
const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer className="mt-24 bg-[#202020] px-6 pb-10 pt-16 text-[#DDDDDD]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 border-b border-white/10 pb-10 md:grid-cols-3">
        <div>
          <img
            src="/logo sin fondo.png"
            alt="Air Hive"
            className="mb-4 h-6 w-auto"
          />
          <p className="max-w-xs text-sm leading-relaxed text-[#DDDDDD]/85">{t("footer.description")}</p>
        </div>

        <div className="text-center">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">{t("footer.navigation")}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="transition duration-300 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">{t("navbar.home_short")}</Link></li>
            <li><Link to="/products" className="transition duration-300 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">{t("navbar.cases")}</Link></li>
            <li><Link to="/services#como-trabajamos" className="transition duration-300 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">{t("navbar.how_we_work")}</Link></li>
            <li><Link to="/about" className="transition duration-300 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">{t("navbar.about")}</Link></li>
            <li><Link to="/diagnostico-gratis" className="transition duration-300 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">{t("navbar.free_diagnostic")}</Link></li>
          </ul>
        </div>


        <div className="flex flex-col items-end">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">{t("footer.follow")}</h3>
          <div className="mb-4 flex gap-4 text-xl">
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
            className="ah-button ah-button-primary mb-3 inline-block rounded-full px-4 py-2 text-sm font-semibold"
          >
            {t("footer.diagnostic")}
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1 text-xs">
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
