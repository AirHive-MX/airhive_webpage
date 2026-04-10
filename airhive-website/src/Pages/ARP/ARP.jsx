import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import crm from "/CRM.jpeg";

const ARP = () => {
  const { t } = useTranslation();

  return (
    <main className="ah-page pt-28">
      {/* Header */}
      <section className="ah-container py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1501A5]/70">A-ERP</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#162A42] sm:text-5xl">{t("a_erp.title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[#202020]/72">{t("a_erp.subtitle")}</p>
      </section>

      {/* 1 — Tracking System (text only) */}
      <section id="tracking" className="ah-container py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
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
      </section>

      {/* 2 — CRM (text left, image right) */}
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

      {/* 3 — WMS (text only) */}
      <section id="wms" className="ah-container py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h2 className="text-3xl font-semibold text-[#162A42] sm:text-4xl">{t("products.wms.title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-[#202020]/74">{t("products.wms.description")}</p>
          <ul className="mt-5 space-y-2 text-sm text-[#162A42]/85 sm:text-base">
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.wms.feature1")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.wms.feature2")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.wms.feature3")}</span></li>
            <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#2A47F6]" /><span>{t("products.wms.feature4")}</span></li>
          </ul>
          <Link to="/contact" className="ah-button ah-button-primary mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold">
            {t("products.cta_button")}
          </Link>
        </motion.div>
      </section>

    </main>
  );
};

export default ARP;
