import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import Navbar from "../Components/Navbar/Navbar";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Products from "../Pages/Products/Products";
import Services from "../Pages/Services/Services";
import Contact from "../Pages/Contact/Contact";
import Footer from "../Components/Footer/Footer";
import Error from "../Pages/Error/Error";

const MainLayout = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/products" element={<Products/>} />
        <Route path="/services" element={<Services/>} />
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
