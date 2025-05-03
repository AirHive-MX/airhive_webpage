import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Home from "../Pages/Home/Home";
import About from "../Pages/About/About";
import Error from "../Pages/Error/Error";

const MainLayout = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        {/* <Route path="/products" element={<Products/>} /> */}
        {/* <Route path="/services" element={<Services/>} /> */}
        <Route path="*" element={<Error/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainLayout;
