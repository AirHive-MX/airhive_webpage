import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative bg-[#111] text-white min-h-[100vh] flex items-center justify-center px-6 pt-24">
      {/* Background Image */}
      <img
        src="./../../../hero_web.png"
        alt="Air Hive Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-3xl text-center"
        >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Tecnología aérea para el futuro
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8">
            Desarrollamos drones autónomos e infraestructura inteligente para logística, vigilancia e innovación educativa.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
            to="/products"
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full text-white font-semibold transition"
            >
            Ver productos
            </Link>
            <Link
            to="/about"
            className="border border-white hover:border-red-600 hover:text-red-600 px-6 py-3 rounded-full font-semibold transition"
            >
            Conocer más
            </Link>
        </div>

        {/* Flecha animada hacia abajo */}
        <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white text-3xl"
        >
            ↓
        </motion.div>
      </motion.div>

    </section>
  );
};

export default Hero;
