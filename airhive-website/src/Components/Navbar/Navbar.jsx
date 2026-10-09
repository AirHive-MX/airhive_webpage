import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa";
import logo from "/ah-monograma.png";
import useAutoHideHeader from "./useAutoHideHeader";

const NAV_H = 64; // alto aproximado del header, para la franja que vigila

/**
 * Enlaces que no se muestran por ahora.
 *
 * Es ocultar, no quitar: las rutas siguen registradas en MainLayout y las
 * páginas intactas, porque se van a volver a usar. Para devolver uno al menú
 * basta con sacar su clave de esta lista; no hay que tocar el JSX.
 */
const OCULTOS = new Set(["schedule_diagnostic"]);

const enlaceMovil =
  "block border-b border-white/[0.07] py-4 text-3xl font-semibold tracking-[-0.02em] transition hover:text-[#9fb0ff]";



const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [onLight, setOnLight] = useState(false);
  const [paginaOscura, setPaginaOscura] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const isHome = location.pathname === "/";

  /* Ya en el home, el enlace no cambia la ruta y nadie sube la página. Se
     sube aquí, de golpe: deslizando se repetiría la historia del dron al
     revés. */
  const alInicio = (e) => {
    setIsOpen(false);
    if (!isHome || location.hash) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, location.hash]);

  /*
   * El home es oscuro salvo la sección del WMS, que enseña una captura sobre
   * fondo claro. En vez de codificar aquí qué sección es cuál, el header vigila
   * una franja de su propia altura y se entera de si lo que tiene debajo lleva
   * data-nav-light. Cualquier sección clara que se añada después funciona sola.
   */
  /*
   * Hay páginas enteras oscuras —Sobre nosotros, Diagnóstico— y en ellas el
   * texto del header tiene que ir en blanco igual que en el home. Lo marcan
   * con data-ah-oscuro en su <main>. Las páginas se cargan diferidas, así que
   * al cambiar de ruta el <main> todavía no existe: se vigila el DOM hasta que
   * aparece en vez de mirarlo una sola vez.
   */
  useEffect(() => {
    const mirar = () => setPaginaOscura(!!document.querySelector("main[data-ah-oscuro]"));
    mirar();
    const observer = new MutationObserver(mirar);
    observer.observe(document.getElementById("root") ?? document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [location.pathname]);

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
  const onDark = isOpen || ((isHome || paginaOscura) && !onLight);

  // Con el menú abierto la página de atrás no se mueve.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [isOpen]);

  const visible = useAutoHideHeader({
    pinned: isOpen,
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
          <Link to="/" onClick={alInicio} className="flex items-center gap-2">
            {/* Monograma en vez del wordmark: ~103px de ancho contra ~263px.
                Sobre el home va en blanco para igualar los enlaces; en las
                páginas claras se queda en el azul de marca. */}
            <img
              src={logo}
              alt="Air Hive"
              className={`h-7 w-auto transition duration-300 ${onDark ? "brightness-0 invert" : ""}`}
            />
          </Link>

          <ul className="hidden items-center gap-6 text-sm font-medium lg:flex">
            <li>
              <Link to="/" onClick={alInicio} className="transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">
                {t("navbar.home_short")}
              </Link>
            </li>


            <li>
              <Link to="/diagnostico-gratis" className="transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">
                {t("navbar.free_diagnostic")}
              </Link>
            </li>
            {!OCULTOS.has("schedule_diagnostic") && (
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
            )}
          </ul>


          <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="-mr-2 rounded-full p-2 outline-none transition focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {isOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
          </div>
        </nav>
      </header>

      {/* Menú del teléfono: pantalla completa en el azul de las páginas
          oscuras, por debajo del header para que el logo y la X sigan en su
          sitio. Enlaces grandes, y WhatsApp como la acción principal abajo. */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[#0a1322]/[0.97] px-6 pb-10 pt-24 text-white backdrop-blur-xl lg:hidden">
          <ul className="flex flex-col gap-1">
            <li>
              <Link to="/" onClick={alInicio} className={enlaceMovil}>
                {t("navbar.home_short")}
              </Link>
            </li>
            <li>
              <Link to="/diagnostico-gratis" onClick={() => setIsOpen(false)} className={enlaceMovil}>
                {t("navbar.free_diagnostic")}
              </Link>
            </li>
          </ul>

          <a
            href="https://wa.me/528116070330"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto flex items-center justify-center gap-2 rounded-full bg-[#2A47F6] px-5 py-4 text-base font-semibold shadow-[0_8px_24px_rgba(42,71,246,0.35)] transition hover:bg-[#3d5aff]"
          >
            <FaWhatsapp className="h-5 w-5" />
            {t("navbar.whatsapp")}
          </a>
        </div>
      )}

      {/* El botón flotante de WhatsApp, en todas las páginas menos el home.
          Allí los globos ocupan el ancho completo en móvil, así que el botón
          les cae encima sí o sí; y el recorrido es una composición cerrada
          donde ya se quitaron los demás botones sueltos. El contacto sigue a
          un toque, en el menú. */}
      {!isHome && !isOpen && (
        <a
          href="https://wa.me/528116070330"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-40 rounded-full bg-[#25D366] p-3 text-white shadow-xl transition duration-500 hover:scale-105 lg:hidden"
          aria-label="WhatsApp"
        >
          <FaWhatsapp className="h-6 w-6" />
        </a>
      )}
    </>
  );
};

export default Navbar;
