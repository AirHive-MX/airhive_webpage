import { Link } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaYoutube, FaFacebook, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0e0e0e] text-gray-300 pt-16 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-10">

        {/* Sección 1: Logo y descripción */}
        <div>
          <img src="/Air Hive Logo.png" alt="Air Hive Logo" className="w-32 mb-4" />
          <p className="text-sm">
            Air Hive es una startup mexicana que desarrolla drones autónomos, estaciones inteligentes y soluciones para logística, seguridad y educación.
          </p>
        </div>

        {/* Sección 2: Navegación */}
        <div>
          <h3 className="text-white font-semibold mb-4">Navegación</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-red-500 transition">Inicio</Link></li>
            <li><Link to="/products" className="hover:text-red-500 transition">Productos</Link></li>
            <li><Link to="/about" className="hover:text-red-500 transition">Nosotros</Link></li>
            <li><Link to="/services" className="hover:text-red-500 transition">Servicios</Link></li>
            <li><Link to="/contact" className="hover:text-red-500 transition">Contacto</Link></li>
          </ul>
        </div>

        {/* Sección 3: Recursos */}
        <div>
          <h3 className="text-white font-semibold mb-4">Recursos</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-red-500 transition">Centro de ayuda</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Términos y condiciones</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Política de privacidad</a></li>
            <li><a href="#" className="hover:text-red-500 transition">Descargas</a></li>
          </ul>
        </div>

        {/* Sección 4: Redes sociales */}
        <div>
          <h3 className="text-white font-semibold mb-4">Síguenos</h3>
          <div className="flex space-x-4 text-2xl">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
              <FaLinkedin />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
              <FaTiktok />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>

      {/* Línea divisoria y derechos reservados */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Air Hive S.A.S. de C.V. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
