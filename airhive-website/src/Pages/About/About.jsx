import { motion } from "framer-motion";
import { useState } from "react";
import image1 from "/hero1.png";
import image2 from "/hero2.png";
import image3 from "/hero3.png";
import { useTranslation } from "react-i18next";
import about1 from "/about1.png";
import about2 from "/about2.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  const [currentTab, setCurrentTab] = useState("mission");
  const { t } = useTranslation();

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
            {t("about.story_title")}
          </h1>
          <p className="text-lg text-gray-600">
            {t("about.story_text")}
          </p>
        </motion.div>
        <motion.img
          src={about1}
          alt="Dron volando"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="rounded-2l shadow-xl md:w-1/2 object-cover"
        />
      </section>

      {/* Misión y Visión Scrollable Mejorado */}
      <section className="relative w-full min-h-[70vh] py-20 px-4 bg-gradient-to-b from-black to-[#000000] text-white text-center flex flex-col items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="flex justify-center gap-6 mb-10">
            <button
              onClick={() => setCurrentTab("mission")}
              className={`px-8 py-3 rounded-full text-base md:text-lg font-medium border transition-all duration-300 ${currentTab === "mission" ? "bg-red-600 text-white border-red-600" : "border-white/30 text-white hover:bg-red-600/20"}`}
            >
              {t("about.mission_button")}
            </button>
            <button
              onClick={() => setCurrentTab("vision")}
              className={`px-8 py-3 rounded-full text-base md:text-lg font-medium border transition-all duration-300 ${currentTab === "vision" ? "bg-red-600 text-white border-red-600" : "border-white/30 text-white hover:bg-red-600/20"}`}
            >
              {t("about.vision_button")}
            </button>
          </div>

          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="px-4"
          >
            <h2 className="text-3xl md:text-5xl font-medium text-white max-w-3xl mx-auto">
              {currentTab === "mission"
                ? t("about.mission_text")
                : t("about.vision_text")}
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Equipo + propósito */}
      <section className="py-28 px-6 max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          transition={{ duration: 1 }}
        >
          <h3 className="text-4xl font-bold mb-6">{t("about.team_title")}</h3>
          <p className="text-gray-700 text-lg mb-4">
            {t("about.team_text_1")}
          </p>
          <p className="text-gray-700 text-lg">
            {t("about.team_text_2")}
          </p>
        </motion.div>
        <motion.img
          src={about2}
          alt="Equipo Air Hive"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="rounded-xl shadow-lg object-cover"
        />
      </section>

      {/* Filosofía final */}
      <section className="py-24 px-6 text-center bg-[#eaeaea]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-bold mb-6">{t("about.philosophy_title")}</h2>
          <p className="text-gray-700 text-lg max-w-4xl mx-auto">
            {t("about.philosophy_text")}
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
