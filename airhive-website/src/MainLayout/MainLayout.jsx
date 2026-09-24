import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import Navbar from "../Components/Navbar/Navbar";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Products from "../Pages/Products/Products";
import Services from "../Pages/Services/Services";
import Contact from "../Pages/Contact/Contact";
import Diagnostic from "../Pages/Diagnostic/Diagnostic";
import ARP from "../Pages/ARP/ARP";
import Footer from "../Components/Footer/Footer";
import Error from "../Pages/Error/Error";
import ScrollToTop from "../Components/ScrollToTop/ScrollToTop";
import LanguageSwitcher from "../Components/LanguageSwitcher/LanguageSwitcher";
import PageParallax from "../Components/PageParallax/PageParallax";
import ScrollEffects from "../Components/ScrollEffects/ScrollEffects";


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
      <ScrollToTop />
      <ScrollEffects />
      <PageParallax />
      <Navbar />
      {/* <LanguageSwitcher /> */}
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/a-erp" element={<ARP/>} />
        <Route path="/services" element={<Services/>} />
        <Route path="/diagnostico-gratis" element={<Diagnostic/>} />
        <Route path="/contact" element={<Contact/>} /> 

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<Error/>} />
      </Routes>
      <FooterSlot />

    </BrowserRouter>
  );
};

export default MainLayout;
