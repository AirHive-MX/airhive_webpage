import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa";
import logo from "/ah-monograma.png";
import useAutoHideHeader from "./useAutoHideHeader";

const NAV_H = 64; // alto aproximado del header, para la franja que vigila

const productItems = [
  { key: "drone_inventory", to: "/products#drone-inventory" },
];


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    setIsOpen(false);
    setProductsOpen(false);
  }, [location.pathname, location.hash]);

  /*
   * El home es oscuro salvo la sección del WMS, que enseña una captura sobre
   * fondo claro. En vez de codificar aquí qué sección es cuál, el header vigila
   * una franja de su propia altura y se entera de si lo que tiene debajo lleva
   * data-nav-light. Cualquier sección clara que se añada después funciona sola.
   */
  useEffect(() => {
    const claro = document.querySelector("[data-nav-light]");
    if (!claro) {
      setOnLight(false);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entrada]) => setOnLight(entrada.isIntersecting),
      { rootMargin: `0px 0px -${Math.max(window.innerHeight - NAV_H, 0)}px 0px` }
    );
    observer.observe(claro);
    return () => observer.disconnect();
  }, [location.pathname]);

  // Sin fondo propio: el header flota sobre el contenido. Lo único que cambia
  // es el color del texto, según lo que tenga debajo en ese momento.
  const onDark = isHome && !onLight;

  const visible = useAutoHideHeader({
    pinned: isOpen || productsOpen,
    resetKey: location.pathname,
  });

  return (
    <>
      {/* Al esconderse no solo sube: también se desvanece, porque el CTA lleva
          una sombra azul larga que si no se queda asomando por el borde. */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,opacity] duration-300 ease-out ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        }`}
      >
        <nav
          className={`flex w-full items-center justify-between px-4 py-3 transition-colors duration-300 sm:px-6 lg:px-10 ${
            onDark ? "text-white" : "text-[#162A42]"
          }`}
        >
          <Link to="/" className="flex items-center gap-2">
            {/* Monograma en vez del wordmark: ~103px de ancho contra ~263px.
                Sobre el home va en blanco para igualar los enlaces; en las
                páginas claras se queda en el azul de marca. */}
            <img
              src={logo}
              alt="Air Hive"
              className={`h-9 w-auto transition duration-300 ${onDark ? "brightness-0 invert" : ""}`}
            />
          </Link>

          <ul className="hidden items-center gap-6 text-sm font-medium lg:flex">
            <li>
              <Link to="/" className="transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">
                {t("navbar.home_short")}
              </Link>
            </li>

            <li
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <Link
                to="/products"
                className="flex items-center gap-1 transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]"
              >
                {t("navbar.cases")}
                <span className={`text-xs transition duration-300 ${productsOpen ? "rotate-180" : ""}`}>▼</span>
              </Link>

              <div
                className={`absolute left-0 top-full mt-3 w-72 rounded-xl border border-[#162A42]/10 bg-white p-2 pt-4 text-[#162A42] shadow-2xl transition-all duration-300 before:absolute before:-top-3 before:left-0 before:h-3 before:w-full ${
                  productsOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
                }`}
              >
                {productItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    className="block rounded-lg px-3 py-2.5 text-sm transition hover:bg-[#162A42]/5 hover:text-[#2A47F6]"
                  >
                    {t(`products.${item.key}.title`)}
                  </Link>
                ))}
              </div>
            </li>

            <li>
              <Link to="/services#como-trabajamos" className="transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">
                {t("navbar.how_we_work")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">
                {t("navbar.about")}
              </Link>
            </li>
            <li>
              <Link to="/diagnostico-gratis" className="transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">
                {t("navbar.free_diagnostic")}
              </Link>
            </li>
            <li>
              <a
                href="https://wa.me/528116070330"
                target="_blank"
                rel="noopener noreferrer"
                className="transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]"
              >
                {t("navbar.schedule_diagnostic")}
              </a>
            </li>
          </ul>


          <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`rounded-lg border p-2 ${
              onDark ? "border-white/30 text-white" : "border-[#162A42]/15 text-[#162A42]"
            }`}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          </div>
        </nav>

        {isOpen && (
          <div className="w-full border-t border-[#162A42]/12 bg-white/95 p-4 text-[#162A42] backdrop-blur-xl lg:hidden">
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li>
                <Link to="/" className="block rounded-lg px-3 py-2 hover:bg-[#162A42]/5">
                  {t("navbar.home_short")}
                </Link>
              </li>
              <li className="rounded-lg border border-[#162A42]/10 px-3 py-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#162A42]/65">{t("navbar.cases")}</p>
                <div className="space-y-1">
                  {productItems.map((item) => (
                    <Link key={item.key} to={item.to} className="block rounded-md px-2 py-1.5 text-sm hover:bg-[#162A42]/5">
                      {t(`products.${item.key}.title`)}
                    </Link>
                  ))}
                </div>
              </li>
              <li>
                <Link to="/services#como-trabajamos" className="block rounded-lg px-3 py-2 hover:bg-[#162A42]/5">
                  {t("navbar.how_we_work")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="block rounded-lg px-3 py-2 hover:bg-[#162A42]/5">
                  {t("navbar.about")}
                </Link>
              </li>
              <li>
                <Link to="/diagnostico-gratis" className="block rounded-lg px-3 py-2 hover:bg-[#162A42]/5">
                  {t("navbar.free_diagnostic")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="ah-nav-cta mt-2 block rounded-full bg-[#2A47F6] px-4 py-2.5 text-center font-semibold text-white transition duration-500 hover:bg-[#6443DB]"
                >
                  {t("navbar.schedule_diagnostic")}
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/528116070330"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center justify-center gap-2 rounded-full border border-[#162A42]/15 px-4 py-2 text-sm"
                >
                  <FaWhatsapp />
                  {t("navbar.whatsapp")}
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      <a
        href="https://wa.me/528116070330"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-[#25D366] p-3 text-white shadow-xl transition duration-500 hover:scale-105 lg:hidden"
        aria-label="WhatsApp"
      >
        <FaWhatsapp className="h-6 w-6" />
      </a>
    </>
  );
};

export default Navbar;
