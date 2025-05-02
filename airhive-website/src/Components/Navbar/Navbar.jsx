import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/Air Hive Log.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0f0f0f] text-white fixed top-0 left-0 w-full z-50 shadow-md border-b-4 border-red-700">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Air Hive Logo" className="h-12 max-h-[48px] w-auto" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-base font-semibold tracking-wide items-center">
          <li>
            <Link
                to="/"
                className="relative group transition duration-300 py-1 px-1 hover:text-red-500 leading-normal"
                >
                Home
                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="relative group transition duration-300 py-1 px-1 leading-normal hover:text-red-500"
            >
              About Us
              <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="relative group transition duration-300 py-1 px-1 leading-normal hover:text-red-500"
            >
              Products
              <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </li>
          <li>
            <Link
                to="/services"
                className="relative group transition duration-300 py-1 px-1 leading-normal hover:text-red-500"
                >
                Services
                <span className="absolute left-0 -bottom-1 h-[2px] w-full bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </Link>
          </li>
          <li>
            <Link
                to="/contact"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full text-base font-semibold shadow-md tracking-wide transition-all duration-200 transform hover:scale-105"
                >
                Contact Us
            </Link>


          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden px-6 pb-4 flex flex-col gap-4 bg-[#1a1a1a] text-base font-medium">
          <li><Link to="/" onClick={() => setIsOpen(false)} className="hover:text-red-500">Inicio</Link></li>
          <li><Link to="/about" onClick={() => setIsOpen(false)} className="hover:text-red-500">Sobre nosotros</Link></li>
          <li><Link to="/products" onClick={() => setIsOpen(false)} className="hover:text-red-500">Productos</Link></li>
          <li><Link to="/services" onClick={() => setIsOpen(false)} className="hover:text-red-500">Servicios</Link></li>
          <li><Link to="/contact" onClick={() => setIsOpen(false)} className="hover:text-red-500">Contáctanos</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
