import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import Navbar from "../Components/Navbar/Navbar";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Products from "../Pages/Products/Products";
import Services from "../Pages/Services/Services";
import Contact from "../Pages/Contact/Contact";
import Diagnostic from "../Pages/Diagnostic/Diagnostic";
import Footer from "../Components/Footer/Footer";
import Error from "../Pages/Error/Error";
import ScrollToTop from "../Components/ScrollToTop/ScrollToTop";
import LanguageSwitcher from "../Components/LanguageSwitcher/LanguageSwitcher";
import PageParallax from "../Components/PageParallax/PageParallax";
import ScrollEffects from "../Components/ScrollEffects/ScrollEffects";


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
        <Route path="/services" element={<Services/>} />
        <Route path="/diagnostico-gratis" element={<Diagnostic/>} />
        <Route path="/contact" element={<Contact/>} /> 

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<Error/>} />
      </Routes>
      {/* Sección de Footer */}
      <Footer /> 

    </BrowserRouter>
  );
};

export default MainLayout;
