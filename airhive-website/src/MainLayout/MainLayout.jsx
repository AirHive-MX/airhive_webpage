import React from "react";
import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Home from "../Pages/Home/Home";
import Footer from "../Components/Footer/Footer";

/*
 * Solo el home va en el paquete inicial. El resto de las páginas (y lo que
 * arrastran: Leaflet, carruseles, EmailJS) se descarga al visitarlas, así el
 * recorrido del dron no compite con código que no se está usando.
 */
const Products = lazy(() => import("../Pages/Products/Products"));
const Services = lazy(() => import("../Pages/Services/Services"));
const Contact = lazy(() => import("../Pages/Contact/Contact"));
const Diagnostic = lazy(() => import("../Pages/Diagnostic/Diagnostic"));
const ARP = lazy(() => import("../Pages/ARP/ARP"));
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

const MainLayout = () => {
  return (
    <BrowserRouter>
      <CierreDeCarga />
      <ScrollToTop />
      <ScrollEffects />
      <PageParallax />
      <Navbar />
      {/* <LanguageSwitcher /> */}
      <Suspense fallback={<div className="min-h-screen" />}>
      <Routes>
        <Route path="/" element={<Home/>} />
        {/* Sobre nosotros está oculta al público; quien llegue por enlace va al home. */}
        <Route path="/about" element={<Navigate to="/" replace />} />
        <Route path="/products" element={<Products/>} />
        <Route path="/a-erp" element={<ARP/>} />
        <Route path="/services" element={<Services/>} />
        <Route path="/diagnostico-gratis" element={<Diagnostic/>} />
        <Route path="/contact" element={<Contact/>} /> 

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<Error/>} />
      </Routes>
      </Suspense>
      <FooterSlot />

    </BrowserRouter>
  );
};

export default MainLayout;
