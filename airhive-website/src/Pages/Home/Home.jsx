import Hero from "../../Components/Hero/Hero";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <>
      <Hero />

      <section className="bg-[#0f0f0f] text-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.h2         
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            ¿Por qué elegir Air Hive?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Fusionamos innovación, ingeniería y autonomía para impulsar el futuro aéreo de la industria y la educación.
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Block 1 */}
          <motion.div
            className="bg-[#1a1a1a] p-6 rounded-xl shadow-md hover:shadow-lg transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-red-500 mb-2">Diseño y fabricación propia</h3>
            <p className="text-gray-300">
              Creamos desde cero frames, electrónica y software. Control total para soluciones modulares, escalables y únicas.
            </p>
          </motion.div>

          {/* Block 2 */}
          <motion.div
            className="bg-[#1a1a1a] p-6 rounded-xl shadow-md hover:shadow-lg transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-red-500 mb-2">Autonomía real</h3>
            <p className="text-gray-300">
              Drones capaces de volar, tomar decisiones y completar misiones sin intervención humana, incluso en entornos complejos.
            </p>
          </motion.div>

          {/* Block 3 */}
          <motion.div
            className="bg-[#1a1a1a] p-6 rounded-xl shadow-md hover:shadow-lg transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-xl font-semibold text-red-500 mb-2">Enfoque educativo e industrial</h3>
            <p className="text-gray-300">
              Creamos kits, estaciones y software que ayudan a escuelas y empresas a adoptar tecnologías aéreas de forma accesible.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
