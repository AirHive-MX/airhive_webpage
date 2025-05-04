import { motion } from "framer-motion";
import image1 from "/hero1.png";
import image2 from "/hero2.png";
import image3 from "/hero3.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    <div className="bg-white text-black overflow-hidden">
      {/* Hero + Story */}
      <section className="min-h-[90vh] px-8 py-28 flex flex-col md:flex-row items-center justify-between gap-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          transition={{ duration: 1 }}
          className="md:w-1/2"
        >
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Nuestra historia comienza en el aire
          </h1>
          <p className="text-lg text-gray-600">
            Air Hive nació en 2025, inspirada por el deseo de transformar el mundo a través de la autonomía aérea. Creemos que los drones pueden ser más que herramientas: pueden ser soluciones inteligentes que impacten industrias, ciudades y la educación misma.
          </p>
        </motion.div>
        <motion.img
          src={image1}
          alt="Dron volando"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="rounded-2xl shadow-xl md:w-1/2 object-cover"
        />
      </section>

      {/* Visión con fondo visual */}
      <section className="relative w-full h-[70vh] flex items-center justify-center bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          src="/sample.mp4"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 text-white text-center max-w-3xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Visión que trasciende la tecnología
          </h2>
          <p className="text-lg text-gray-300">
            Queremos convertirnos en la empresa mexicana de tecnología más influyente del mundo, llevando drones inteligentes a cada rincón donde puedan hacer la diferencia.
          </p>
        </motion.div>
      </section>

      {/* Equipo + propósito */}
      <section className="py-28 px-6 max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          transition={{ duration: 1 }}
        >
          <h3 className="text-4xl font-bold mb-6">El equipo detrás del vuelo</h3>
          <p className="text-gray-700 text-lg mb-4">
            Fundada por Alberto Castro, Eduardo Castro y Rafael Sedas, Air Hive se construye sobre una visión compartida de libertad tecnológica. El COO, Virgilio Acosta, lidera operaciones con enfoque en eficiencia y escalabilidad.
          </p>
          <p className="text-gray-700 text-lg">
            Combinamos ingeniería, visión de negocio y pasión por la educación para diseñar soluciones que realmente vuelen.
          </p>
        </motion.div>
        <motion.img
          src={image2}
          alt="Equipo Air Hive"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="rounded-xl shadow-lg object-cover"
        />
      </section>

      {/* Showcase */}
      <section className="bg-[#f8f8f8] py-32 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold"
          >
            Un vistazo a nuestras misiones
          </motion.h2>
          <p className="text-gray-500 mt-4 text-lg">
            Tecnologías autónomas aplicadas a la seguridad, vigilancia, agricultura y educación.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <img src={image1} className="rounded-xl object-cover w-full h-64" alt="Demo 1" />
          <img src={image2} className="rounded-xl object-cover w-full h-64" alt="Demo 2" />
          <img src={image3} className="rounded-xl object-cover w-full h-64" alt="Demo 3" />
        </div>
      </section>

      {/* Filosofía final */}
      <section className="py-24 px-6 text-center bg-[#eaeaea]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-bold mb-6">Nuestra filosofía</h2>
          <p className="text-gray-700 text-lg max-w-4xl mx-auto">
            "Creemos en un futuro donde la autonomía aérea sea accesible, segura y potencie el talento mexicano en cada vuelo."
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
