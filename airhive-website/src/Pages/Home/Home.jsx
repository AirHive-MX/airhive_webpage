import Hero from "../../Components/Hero/Hero";
import { motion } from "framer-motion";
import image1 from "/hero1.png";
import VideoSlider from "../../Components/VideoSlider/VideoSlider";
import Footer from "../../Components/Footer/Footer";
import { useTranslation } from "react-i18next";
import home1 from "/home1.png";
import home2 from "/home2.png";
import home3 from "/home3.png";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <Hero />

      {/* Sección 1 */}
      <section className="bg-[#f7f7f7] text-black py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
          <motion.img
            src={home1}
            alt="Air Hive Drone Showcase"
            className="rounded-2l shadow-xl w-full h-auto object-cover max-h-96"
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

      {/* Sección 2 */}
      <section className="bg-[#ededed] text-black py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              {t("home.innovation_title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("home.innovation_text")}
            </p>
          </motion.div>

          <motion.img
            src={home2}
            alt="Modular Drone System"
            className="rounded-2l shadow-xl w-full h-auto object-cover max-h-96"
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
            src={home3}
            alt="Autonomous Mission"
            className="rounded-2l shadow-xl w-full h-auto object-cover max-h-96"
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
              {t("home.education_title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("home.education_text")}
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
