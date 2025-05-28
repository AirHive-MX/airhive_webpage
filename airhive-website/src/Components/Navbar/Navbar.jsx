import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/Air Hive Log.png";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detectar si estamos en la página de About
  const isAboutPage = location.pathname === "/about";
  const isContactPage = location.pathname === "/contact";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur bg-[#0f0f0f]/70 border-b border-red-700 shadow-md"
          : "bg-transparent"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-6 py-4 flex justify-between items-center transition-colors duration-300 ${
          (isAboutPage || isContactPage) && !scrolled ? "text-black" : "text-white"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Air Hive Logo" className="h-12 w-auto" />
        </Link>

        <ul className="hidden md:flex gap-8 text-base font-medium transition-colors duration-300">
          {["/", "/about", "/products", "/services"].map((route, i) => (
            <li key={route}>
              <Link
                to={route}
                className={`relative group transition py-1 px-1 hover:text-red-500 ${
                  (isAboutPage || isContactPage) && !scrolled ? "text-black" : "text-white"
                }`}
              >
                {[t("navbar.home"), t("navbar.about"), t("navbar.products"), t("navbar.services")][i]}
                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/contact"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition hover:scale-105"
            >
              {t("navbar.contact")}
            </Link>
          </li>
        </ul>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg className={`h-6 w-6 ${isAboutPage && !scrolled ? "fill-black" : "fill-white"}`} viewBox="0 0 24 24">
            {isOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <ul className="md:hidden px-6 pb-4 bg-[#1a1a1a] text-base font-medium flex flex-col gap-4">
          {["Inicio", "Sobre nosotros", "Productos", "Servicios", "Contáctanos"].map((text, i) => (
            <li key={text}>
              <Link
                to={["/", "/about", "/products", "/services", "/contact"][i]}
                onClick={() => setIsOpen(false)}
                className="hover:text-red-500 text-white"
              >
                {text}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
