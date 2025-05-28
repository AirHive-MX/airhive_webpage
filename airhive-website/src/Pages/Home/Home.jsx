import Hero from "../../Components/Hero/Hero";
import { motion } from "framer-motion";
import image1 from "/hero1.png";
import VideoSlider from "../../Components/VideoSlider/VideoSlider";
import Footer from "../../Components/Footer/Footer";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <Hero />

      {/* Sección de Introducción Estética */}
      <section className="bg-[#f7f7f7] text-black py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
          <motion.img
            src={image1}
            alt="Air Hive Drone Showcase"
            className="rounded-2xl shadow-xl w-full h-auto object-cover"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          />
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              {t("home.intro_title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("home.intro_text")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sección Invertida */}
      <section className="bg-[#ededed] text-black py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              {t("home.modular_title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("home.modular_text")}
            </p>
          </motion.div>

          <motion.img
            src={image1}
            alt="Modular Drone System"
            className="rounded-2xl shadow-xl w-full h-auto object-cover"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          />
        </div>
      </section>

      {/* Sección 3 */}
      <section className="bg-[#f7f7f7] text-black py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
          <motion.img
            src={image1}
            alt="Autonomous Mission"
            className="rounded-2xl shadow-xl w-full h-auto object-cover"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          />

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              {t("home.autonomy_title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("home.autonomy_text")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sección de Video */}
      <VideoSlider />

    </>
  );
};

export default Home;
