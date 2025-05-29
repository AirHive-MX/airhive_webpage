import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import hero2 from "/hero2.png";
import eventos from "/eventos.jpeg";
import baterias from "/baterias.jpeg";
import capacitacion from "/capacitacion.jpeg";
import regulacion from "/regulacion.jpeg";
import terreno from "/terreno.jpeg";
import consultoria from "/consultoria.jpeg";
import services from "/services.png";

const Services = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { t } = useTranslation();

  const servicesData = [
    {
      title: t("services.training.title"),
      shortText: t("services.training.short"),
      fullText: t("services.training.full"),
      image: capacitacion,
    },
    {
      title: t("services.land.title"),
      shortText: t("services.land.short"),
      fullText: t("services.land.full"),
      image: terreno,
    },
    {
      title: t("services.events.title"),
      shortText: t("services.events.short"),
      fullText: t("services.events.full"),
      image: eventos,
    },
    {
      title: t("services.batteries.title"),
      shortText: t("services.batteries.short"),
      fullText: t("services.batteries.full"),
      image: baterias,
    },
    {
      title: t("services.registration.title"),
      shortText: t("services.registration.short"),
      fullText: t("services.registration.full"),
      image: regulacion,
    },
    {
      title: t("services.support.title"),
      shortText: t("services.support.short"),
      fullText: t("services.support.full"),
      image: consultoria,
    },
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
            {t("services.title")}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white drop-shadow-md animate-fade-in delay-200">
            {t("services.subtitle")}
          </p>
        </div>
      </div>

      {/* Servicios estilo DJI */}
      <section className="w-full px-[0.5%] h-full py-[0.5%] grid grid-cols-1 md:grid-cols-2 gap-3">
        {servicesData.map((service, index) => (
          <div
            key={index}
            className="relative h-[80vh] rounded-l overflow-hidden shadow-xl border border-white/20"
            style={{
              backgroundImage: `url(${service.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-xsm" />

            <div className="relative z-10 p-10 h-full flex flex-col justify-end text-white">
              <h3 className="text-4xl font-bold mb-4 drop-shadow-md">{service.title}</h3>
              <p className="text-lg mb-6 transition-all duration-300 ease-in-out">
                {expandedIndex === index ? service.fullText : service.shortText}
              </p>
              <button
                onClick={() => toggleExpand(index)}
                className="text-base font-semibold underline hover:text-red-400 transition w-fit"
              >
                {expandedIndex === index ? t("services.read_less") : t("services.read_more")}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Services;
