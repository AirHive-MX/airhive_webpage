import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FlujoOperativo from "../../Components/FlujoOperativo/FlujoOperativo";
import WMSSection from "../../Components/WMSSection/WMSSection";

const heroImages = ["/almacen.png", "/foto almacen dron volando.png"];

const Products = () => {
  const { t } = useTranslation();
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="ah-page pt-28">
      {/* Header */}
      <section className="ah-container py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1501A5]/70">Catalog</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#162A42] sm:text-5xl">{t("products.title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[#202020]/72">{t("products.subtitle")}</p>
      </section>

      {/* 1 — Inventory Counting Drone (image left, text right) */}
      <section id="drone-inventory" className="ah-container grid items-center gap-10 py-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="product-img-card relative overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-1"
        >
          {heroImages.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={t("products.drone_inventory.title")}
              className="h-[500px] w-full object-cover object-center transition-opacity duration-1000"
              style={{
                position: i === 0 ? "relative" : "absolute",
                inset: 0,
                opacity: imgIndex === i ? 1 : 0,
              }}
            />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-[#162A42] sm:text-4xl">
            <span className="relative inline-block">
              {t("products.drone_inventory.title")}
              <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2A47F6] to-[#1501A5] rounded-full animate-grow-line" />
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#202020]/74">{t("products.drone_inventory.description")}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {/* Card 1 — Qué problema resuelve */}
            <div className="rounded-2xl bg-[#1E3A6E] p-5">
              <div className="mb-4 flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  {t("products.drone_inventory.problems_title")}
                </p>
              </div>
              <ul className="space-y-2.5">
                {["problem1","problem2","problem3","problem4","problem5"].map((k) => (
                  <li key={k} className="flex items-start gap-2.5 text-sm text-white/85">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2A47F6]" />
                    {t(`products.drone_inventory.${k}`)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2 — Funciones principales */}
            <div className="rounded-2xl border border-[#2A47F6]/20 bg-white p-5 shadow-[0_4px_20px_rgba(42,71,246,0.08)]">
              <div className="mb-4 flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2A47F6]">
                  {t("products.drone_inventory.features_title")}
                </p>
              </div>
              <ul className="space-y-2.5">
                {["func1","func2","func3","func4","func5","func6"].map((k) => (
                  <li key={k} className="flex items-start gap-2.5 text-sm text-[#162A42]/85">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#2A47F6]" />
                    {t(`products.drone_inventory.${k}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link to="/contact" className="ah-button ah-button-primary mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold">
            {t("products.cta_button")}
          </Link>
        </motion.div>
      </section>

      <div className="ah-container pb-2 pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1501A5]/70">
          {t("products.flujo_kicker")}
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-[#162A42] sm:text-3xl">
          {t("products.flujo_title")}
        </h3>
      </div>
      <FlujoOperativo />

      {/* 2 — WMS */}
      <section id="wms">
        <WMSSection />
      </section>
    </main>
  );
};

export default Products;
