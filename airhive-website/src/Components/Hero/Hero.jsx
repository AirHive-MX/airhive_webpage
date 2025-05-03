import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const slides = [
  {
    image: "/hero1.png",
    title: "Tecnología aérea para el futuro",
    text: "Desarrollamos drones autónomos e infraestructura inteligente para logística, vigilancia e innovación educativa.",
  },
  {
    image: "/hero2.png",
    title: "Soluciones modulares e inteligentes",
    text: "Desde diseño y fabricación hasta operación autónoma, cubrimos toda la cadena tecnológica.",
  },
  {
    image: "/hero3.png",
    title: "Autonomía real para cada misión",
    text: "Capacidad de decisión y vuelo inteligente en entornos complejos. Nuestra ingeniería vuela sola.",
  },
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const { image, title, text } = slides[index];

  return (
    <section className="relative min-h-[100vh] flex items-center justify-start text-white overflow-hidden">
      {/* Background Image */}
      <img
        src={image}
        alt="Slide"
        className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700"
      />

      {/* Content slightly offset to the right */}
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-20 max-w-5xl px-10 sm:px-14 md:px-25 lg:px-38 text-left"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-xl">
          {title}
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl  mb-10 max-w-xl">
          {text}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            to="/products"
            className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full font-semibold transition text-lg"
          >
            Ver productos
          </Link>
          <Link
            to="/about"
            className="border border-white hover:border-red-600 hover:text-red-600 px-8 py-4 rounded-full font-semibold transition text-lg"
          >
            Conocer más
          </Link>
        </div>
      </motion.div>

      {/* Animated Down Arrow Centered */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white text-3xl z-30"
      >
        ↓
      </motion.div>

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-10 top-1/2 transform -translate-y-1/2 text-white text-3xl z-30 opacity-60 hover:opacity-100"
      >
        ❮
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-10 top-1/2 transform -translate-y-1/2 text-white text-3xl z-30 opacity-60 hover:opacity-100"
      >
        ❯
      </button>
    </section>
  );
};

export default Hero;
