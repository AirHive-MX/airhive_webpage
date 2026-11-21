import React from "react";
import { Suspense, lazy, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Home from "../Pages/Home/Home";
import Footer from "../Components/Footer/Footer";
import { vistaDePagina } from "../analitica";

/*
 * El sitio son dos páginas: el recorrido del dron y el formulario. Solo el home
 * va en el paquete inicial; el formulario y el 404 se descargan al visitarlos,
 * así el recorrido no compite con código que no se está usando.
 */
const Diagnostic = lazy(() => import("../Pages/Diagnostic/Diagnostic"));
const Error = lazy(() => import("../Pages/Error/Error"));
import ScrollToTop from "../Components/ScrollToTop/ScrollToTop";
import LanguageSwitcher from "../Components/LanguageSwitcher/LanguageSwitcher";
import PageParallax from "../Components/PageParallax/PageParallax";
import ScrollEffects from "../Components/ScrollEffects/ScrollEffects";


/**
 * La pantalla de carga espera al recorrido del dron, que solo existe en el home.
 * En cualquier otra ruta no hay nada pesado que aguardar, así que se retira en
 * cuanto la página monta.
 */
const CierreDeCarga = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname !== "/") window.__ahCarga?.cerrar();
  }, [pathname]);
  return null;
};

/**
 * El home quedó como una sola pantalla con el recorrido del dron, así que ahí el
 * footer sobra. El resto del sitio lo conserva.
 */
const FooterSlot = () => {
  const { pathname } = useLocation();
  return pathname === "/" ? null : <Footer />;
};

/**
 * Los globos de fondo llevan blur y se mueven con cada scroll. En el home no se
 * ven (el recorrido tiene fondo opaco encima), pero el celular los seguía
 * desenfocando y recomponiendo en cada cuadro. Solo se montan donde se ven.
 */
const ParallaxSlot = () => {
  const { pathname } = useLocation();
  return pathname === "/" ? null : <PageParallax />;
};

/**
 * Manda a GA la vista de página de cada navegación dentro del sitio. La
 * primera la manda la etiqueta al cargar, por eso se salta. Espera un poco para
 * que la página ya haya puesto su título (el diagnóstico se descarga aparte).
 */
const VistasDePagina = () => {
  const { pathname } = useLocation();
  const primera = useRef(true);
  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return undefined;
    }
    const t = setTimeout(() => vistaDePagina(pathname), 400);
    return () => clearTimeout(t);
  }, [pathname]);
  return null;
};

const MainLayout = () => {
  return (
    <BrowserRouter>
      <CierreDeCarga />
      <VistasDePagina />
      <ScrollToTop />
      <ScrollEffects />
      <ParallaxSlot />
      <Navbar />
      {/* <LanguageSwitcher /> */}
      <Suspense fallback={<div className="min-h-screen" />}>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/diagnostico-gratis" element={<Diagnostic/>} />

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<Error/>} />
      </Routes>
      </Suspense>
      <FooterSlot />

    </BrowserRouter>
  );
};

export default MainLayout;
