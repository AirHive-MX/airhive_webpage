import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import hero1 from "/hero1.png";


const Products = () => {
  return (
    <div className="bg-white text-black">
      {/* Hero personalizado */}
      <div
        className="relative w-full h-[85vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${hero1})` }}
      >
        <div className="bg-black/60 w-full h-full absolute top-0 left-0" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-fade-in">
            Nuestros Productos
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white drop-shadow-md animate-fade-in delay-200">
            Drones educativos y personalizados para un futuro autónomo.
          </p>
          
        </div>
      </div>

      {/* Sección Kit Educativo */}
      <section className="max-w-7xl mx-auto py-28 px-6 grid md:grid-cols-2 items-center gap-16">
        <motion.img
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          src={hero1}
          alt="Kit Arma tu Dron"
          className="rounded-xl shadow-2xl w-full max-h-[520px] object-cover"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold mb-6">Kit Educativo “Arma tu Dron”</h2>
          <p className="text-lg text-gray-700 mb-6">
            Diseñado para centros educativos, este kit permite a los estudiantes ensamblar un dron desde cero, comprender su funcionamiento y programarlo para ejecutar misiones autónomas. Incluye capacitación y tutoriales exclusivos por parte de nuestro equipo.
          </p>
          <ul className="list-disc pl-5 text-gray-800 space-y-2 mb-6">
            <li>Compatible con software Open Source</li>
            <li>Incluye GPS, IMU, ESCs, controladora de vuelo, estructura, hélices y más</li>
            <li>Ideal para talleres, cursos de ingeniería y competencias educativas</li>
            <li>Precio accesible y soporte directo con Air Hive</li>
          </ul>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow transition hover:scale-105"
          >
            Solicita una cotización
          </Link>
        </motion.div>
      </section>

      {/* Sección Drones Personalizados */}
      <section className="bg-gray-100 py-28 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Drones Personalizados</h2>
            <p className="text-lg text-gray-700 mb-6">
              Fabricamos drones a la medida según las necesidades de nuestros clientes: desde drones FPV para acrobacias hasta plataformas profesionales para fotografía aérea o misiones completamente autónomas.
            </p>
            <ul className="list-disc pl-5 text-gray-800 space-y-2 mb-6">
              <li>Diseños aerodinámicos optimizados</li>
              <li>Componentes de alta calidad seleccionados según su uso</li>
              <li>Integración de cámaras, GPS, LiDAR y más</li>
              <li>Personalización visual y funcional</li>
            </ul>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow transition hover:scale-105"
            >
              Contáctanos para tu diseño
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <img
              src={hero1}
              className="rounded-xl shadow-lg object-cover w-full h-full"
              alt="Drone personalizado 1"
            />
            <img
              src={hero1}
              className="rounded-xl shadow-lg object-cover w-full h-full"
              alt="Drone personalizado 2"
            />
          </motion.div>
        </div>
      </section>

      
    </div>
  );
};

export default Products;