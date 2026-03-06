import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import droneInventory from "/definitiva.png";
import tracking from "/TRAKING SYSTEM.jpeg";
import aiAgents from "/product-ai-agents.png";
import crm from "/CRM.jpeg";

const Products = () => {
  const { t } = useTranslation();

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
          className="product-img-card overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-1"
        >
          <img
            src={droneInventory}
            alt={t("products.drone_inventory.title")}
            className="w-[125%] max-w-none object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-[#162A42] sm:text-4xl">{t("products.drone_inventory.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-[#202020]/74">{t("products.drone_inventory.description")}</p>
          <ul className="mt-5 space-y-2 text-sm text-[#162A42]/85 sm:text-base">
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.drone_inventory.feature1")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.drone_inventory.feature2")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.drone_inventory.feature3")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.drone_inventory.feature4")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.drone_inventory.feature5")}</span></li>
          </ul>
          <Link to="/contact" className="ah-button ah-button-primary mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold">
            {t("products.cta_button")}
          </Link>
        </motion.div>
      </section>

      {/* 2 — Tracking System (text left, image right) */}
      <section id="tracking" className="ah-container grid items-center gap-10 py-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-[#162A42] sm:text-4xl">{t("products.tracking.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-[#202020]/74">{t("products.tracking.description")}</p>
          <ul className="mt-5 space-y-2 text-sm text-[#162A42]/85 sm:text-base">
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.tracking.feature1")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.tracking.feature2")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.tracking.feature3")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.tracking.feature4")}</span></li>
          </ul>
          <Link to="/contact" className="ah-button ah-button-primary mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold">
            {t("products.cta_button")}
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="product-img-card overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-1"
        >
          <img
            src={tracking}
            alt={t("products.tracking.title")}
            className="w-[125%] max-w-none object-cover"
          />
        </motion.div>
      </section>

      {/* 3 — AI Agents (image left, text right) */}
      <section id="ai-agents" className="ah-container grid items-center gap-10 py-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center transition-all duration-400 hover:-translate-y-1"
        >
          <img
            src={aiAgents}
            alt={t("products.ai_agents.title")}
            className="product-phone-img h-[420px] w-auto object-contain transition-all duration-400"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-[#162A42] sm:text-4xl">{t("products.ai_agents.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-[#202020]/74">{t("products.ai_agents.description")}</p>
          <ul className="mt-5 space-y-2 text-sm text-[#162A42]/85 sm:text-base">
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.ai_agents.feature1")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.ai_agents.feature2")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.ai_agents.feature3")}</span></li>
          </ul>
          <Link to="/contact" className="ah-button ah-button-primary mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold">
            {t("products.cta_button")}
          </Link>
        </motion.div>
      </section>

      {/* 4 — CRM (text left, image right) */}
      <section id="crm" className="ah-container grid items-center gap-10 py-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-[#162A42] sm:text-4xl">{t("products.crm.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-[#202020]/74">{t("products.crm.description")}</p>
          <ul className="mt-5 space-y-2 text-sm text-[#162A42]/85 sm:text-base">
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.crm.feature1")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.crm.feature2")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.crm.feature3")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.crm.feature4")}</span></li>
          </ul>
          <Link to="/contact" className="ah-button ah-button-primary mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold">
            {t("products.cta_button")}
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="product-img-card overflow-hidden rounded-2xl transition-all duration-400 hover:-translate-y-1"
        >
          <img
            src={crm}
            alt={t("products.crm.title")}
            className="w-[125%] max-w-none object-cover"
          />
        </motion.div>
      </section>

      {/* 5 — Other Projects (full width cards) */}
      <section id="other-projects" className="ah-container py-16">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-3xl font-semibold text-[#162A42] sm:text-4xl"
        >
          {t("products.other_projects.title")}
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-2">
          {["logistics", "counting", "vision", "hardware"].map((key, i) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl border border-[#2A47F6]/15 bg-white p-7 shadow-[0_14px_34px_rgba(22,42,66,0.08)] sm:p-8"
            >
              <p className="text-lg font-bold uppercase tracking-[0.14em] text-[#2A47F6]">{t(`products.other_projects.${key}_title`)}</p>
              <p className="mt-3 text-base leading-relaxed text-[#202020]/74">{t(`products.other_projects.${key}_text`)}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Products;
