import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import hero1 from "/hero1.png";
import kit from "/kitarmatudron.jpeg";
import kit2 from "/kitarmatudron2.jpeg";
import personalizado from "/dronpersonalizado.jpeg";
import personalizado2 from "/personalizado2.jpeg";

const Products = () => {
  const { t } = useTranslation();
  const [kitIndex, setKitIndex] = useState(0);
  const kitImages = [kit, kit2];

  useEffect(() => {
    const interval = setInterval(() => {
      setKitIndex((prev) => (prev + 1) % kitImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
            {t("products.title")}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white drop-shadow-md animate-fade-in delay-200">
            {t("products.subtitle")}
          </p>
        </div>
      </div>

      {/* Sección Kit Educativo */}
      <section className="max-w-7xl mx-auto py-28 px-6 grid md:grid-cols-2 items-center gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-xl shadow-2xl w-full max-h-[520px]"
        >
          <img
            src={kitImages[kitIndex]}
            alt="Kit Arma tu Dron"
            className={`object-cover w-full h-full transition-transform duration-700 ${kitIndex === 0 ? "scale-200 -translate-x-6" : "scale-100 translate-x-0"}`}
          />
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            {kitImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setKitIndex(i)}
                className={`w-3 h-3 rounded-full ${kitIndex === i ? "bg-red-600" : "bg-white/70"}`}
              ></button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold mb-6">{t("products.kit_title")}</h2>
          <p className="text-lg text-gray-700 mb-6">{t("products.kit_description")}</p>
          <ul className="list-disc pl-5 text-gray-800 space-y-2 mb-6">
            <li>{t("products.kit_feature1")}</li>
            <li>{t("products.kit_feature2")}</li>
            <li>{t("products.kit_feature3")}</li>
            <li>{t("products.kit_feature4")}</li>
          </ul>
          <Link
            to="/contact"
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow transition hover:scale-105"
          >
            {t("products.kit_button")}
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
            <h2 className="text-4xl font-bold mb-6">{t("products.custom_title")}</h2>
            <p className="text-lg text-gray-700 mb-6">{t("products.custom_description")}</p>
            <ul className="list-disc pl-5 text-gray-800 space-y-2 mb-6">
              <li>{t("products.custom_feature1")}</li>
              <li>{t("products.custom_feature2")}</li>
              <li>{t("products.custom_feature3")}</li>
              <li>{t("products.custom_feature4")}</li>
            </ul>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow transition hover:scale-105"
            >
              {t("products.custom_button")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <img
              src={personalizado}
              className="rounded-xl shadow-lg object-cover w-full h-full"
              alt="Drone personalizado 1"
            />
            <img
              src={personalizado2}
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
