import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaYoutube, FaFacebook, FaTiktok } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const toggleLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <footer className="bg-[#0e0e0e] text-gray-300 pt-16 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-10">
        {/* Sección 1: Logo y descripción */}
        <div>
          <img src="/Air Hive Logo.png" alt="Air Hive Logo" className="w-32 mb-4" />
          <p className="text-sm">
            {t("footer.description")}
          </p>
        </div>

        {/* Sección 2: Navegación */}
        <div>
          <h3 className="text-white font-semibold mb-4">{t("footer.navigation")}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-red-500 transition">{t("navbar.home")}</Link></li>
            <li><Link to="/products" className="hover:text-red-500 transition">{t("navbar.products")}</Link></li>
            <li><Link to="/about" className="hover:text-red-500 transition">{t("navbar.about")}</Link></li>
            <li><Link to="/services" className="hover:text-red-500 transition">{t("navbar.services")}</Link></li>
            <li><Link to="/contact" className="hover:text-red-500 transition">{t("navbar.contact")}</Link></li>
          </ul>
        </div>

        {/* Sección 3: Recursos */}
        <div>
          <h3 className="text-white font-semibold mb-4">{t("footer.resources")}</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-red-500 transition">{t("footer.help_center")}</a></li>
            <li><a href="#" className="hover:text-red-500 transition">{t("footer.terms")}</a></li>
            <li><a href="#" className="hover:text-red-500 transition">{t("footer.privacy")}</a></li>
            <li><a href="#" className="hover:text-red-500 transition">{t("footer.downloads")}</a></li>
          </ul>
        </div>

        {/* Sección 4: Redes sociales */}
        <div>
          <h3 className="text-white font-semibold mb-4">{t("footer.follow")}</h3>
          <div className="flex space-x-4 text-2xl">
            <a href="https://www.instagram.com/airhive.mx?igsh=aDR1dnBmbmJlOXMx" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/company/air-hive/" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
              <FaLinkedin />
            </a>
            <a href="https://www.tiktok.com/@airhivemx?_t=ZN-8wjgqehh72d&_r=1" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
              <FaTiktok />
            </a>
            <a href="https://www.facebook.com/share/16QM1b3opP/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
              <FaFacebook />
            </a>
          </div>

          {/* Language Switcher debajo de redes */}
          <div className="mt-8" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`px-4 py-2 rounded-md border shadow-sm text-sm font-medium transition-all duration-300 ${i18n.language === 'es' ? 'bg-red-600 text-white border-red-700' : 'bg-white text-black border-gray-300'}`}
            >
              {i18n.language === 'es' ? 'MX - Español' : 'US - English'}
            </button>
            {showDropdown && (
              <div className="mt-1 bg-white shadow-lg rounded-md border border-gray-200 absolute z-30">
                <button
                  onClick={() => toggleLanguage("es")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-black"
                >
                  MX - Español
                </button>
                <button
                  onClick={() => toggleLanguage("en")}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-black"
                >
                  US - English
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Línea divisoria y derechos reservados */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Air Hive S.A.S. de C.V. {t("footer.rights_reserved")}
      </div>
    </footer>
  );
};

export default Footer;
