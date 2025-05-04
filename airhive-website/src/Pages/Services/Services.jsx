import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import hero2 from "/hero2.png";
// import droneVideo from "/video_icon.svg";
// import trainingIcon from "/training_icon.svg";
// import animationIcon from "/animation_icon.svg";

const Services = () => {
  return (
    <div className="bg-white text-black">
      {/* Hero personalizado */}
      <div
        className="relative w-full h-[85vh] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${hero2})` }}
      >
        <div className="bg-black/60 w-full h-full absolute top-0 left-0" />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg animate-fade-in">
            Nuestros Servicios
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white drop-shadow-md animate-fade-in delay-200">
            Te ayudamos a aprovechar el poder de los drones.
          </p>
        </div>
      </div>

      {/* Servicios */}
      <section className="max-w-7xl mx-auto py-28 px-6">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 bg-gray-100 rounded-xl shadow-xl hover:shadow-2xl transition"
          >
            <img src={hero2} alt="Capacitaciones" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Capacitaciones para vuelo</h3>
            <p className="text-gray-700 mb-4">
              Cursos personalizados para volar drones con seguridad, precisión y autonomía. Ideal para estudiantes, empresas y emprendedores.
            </p>
            <Link to="/contact" className="text-red-600 font-semibold hover:underline">
              Solicita información
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="p-8 bg-gray-100 rounded-xl shadow-xl hover:shadow-2xl transition"
          >
            <img src={hero2} alt="Terrenos y Animaciones" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Grabación y animación de terrenos</h3>
            <p className="text-gray-700 mb-4">
              Volamos sobre tu terreno, capturamos vistas aéreas en alta resolución y generamos animaciones 3D o recorridos visuales.
            </p>
            <Link to="/contact" className="text-red-600 font-semibold hover:underline">
              Contáctanos para cotizar
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="p-8 bg-gray-100 rounded-xl shadow-xl hover:shadow-2xl transition"
          >
            <img src={hero2} alt="Eventos" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Grabación de eventos</h3>
            <p className="text-gray-700 mb-4">
              Captura momentos inolvidables desde el cielo. Ideal para bodas, eventos deportivos, festivales y más.
            </p>
            <Link to="/contact" className="text-red-600 font-semibold hover:underline">
              Reserva tu evento
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Services;
