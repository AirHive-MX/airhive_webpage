import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";
import { useTranslation } from "react-i18next";

/**
 * Enlaces que no se muestran por ahora, los mismos que oculta la barra de
 * navegación.
 *
 * Es ocultar, no quitar: las rutas siguen registradas y las páginas intactas,
 * porque se van a volver a usar. Para devolver uno basta con sacar su clave de
 * esta lista; no hay que tocar el JSX.
 */
const enlace = "transition duration-300 hover:text-white";

/*
 * Footer mínimo: una sola línea con el monograma, los enlaces, las redes y los
 * derechos. Mismo fondo que las páginas oscuras para que no corte la página.
 */
const Footer = () => {
  const { t } = useTranslation();

  const redes = [
    { href: "https://www.linkedin.com/company/air-hive/", icon: <FaLinkedin className="h-3.5 w-3.5" />, label: "LinkedIn" },
    { href: "https://www.instagram.com/airhive.mx?igsh=aDR1dnBmbmJlOXMx", icon: <FaInstagram className="h-3.5 w-3.5" />, label: "Instagram" },
    { href: "https://www.tiktok.com/@airhivemx?_t=ZN-8wjgqehh72d&_r=1", icon: <FaTiktok className="h-3.5 w-3.5" />, label: "TikTok" },
    { href: "https://www.facebook.com/share/16QM1b3opP/?mibextid=wwXIfr", icon: <FaFacebook className="h-3.5 w-3.5" />, label: "Facebook" },
  ];

  return (
    <footer className="border-t border-white/[0.07] bg-[#0a1322] px-6 py-5 text-xs text-white/45">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-5">
          <Link to="/" aria-label="Air Hive">
            <img src="/ah-monograma.png" alt="Air Hive" className="h-4 w-auto brightness-0 invert opacity-70 transition hover:opacity-100" />
          </Link>
          <span>© {new Date().getFullYear()} Air Hive</span>
        </div>

        <nav className="flex items-center gap-5">
          <Link to="/diagnostico-gratis" className={enlace}>{t("navbar.free_diagnostic")}</Link>
          <span className="flex items-center gap-3 pl-1">
            {redes.map(({ href, icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={enlace}>
                {icon}
              </a>
            ))}
          </span>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
