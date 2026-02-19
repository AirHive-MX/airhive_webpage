import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import kit from "/kitarmatudron.webp";
import personalizado from "/dronpersonalizado.webp";
import personalizado2 from "/personalizado2.webp";

const Products = () => {
  const { t } = useTranslation();

  return (
    <main className="ah-page pt-28">
      <section className="ah-container py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1501A5]/70">Catalog</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#162A42] sm:text-5xl">{t("products.title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[#202020]/72">{t("products.subtitle")}</p>
      </section>

      <section className="ah-container grid items-center gap-8 py-10 lg:grid-cols-2">
        <motion.img
          src={kit}
          alt={t("products.kit_title")}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="h-[420px] w-full rounded-2xl border border-white bg-white object-cover p-2 shadow-[0_12px_30px_rgba(22,42,66,0.1)]"
        />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-2xl border border-white bg-white p-7 shadow-[0_12px_30px_rgba(22,42,66,0.1)]"
        >
          <h2 className="text-3xl font-semibold text-[#162A42]">{t("products.kit_title")}</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#202020]/76 sm:text-base">{t("products.kit_description")}</p>
          <ul className="mt-5 space-y-2 text-sm text-[#162A42]/85 sm:text-base">
            <li>{t("products.kit_feature1")}</li>
            <li>{t("products.kit_feature2")}</li>
            <li>{t("products.kit_feature3")}</li>
            <li>{t("products.kit_feature4")}</li>
          </ul>
          <Link to="/contact" className="ah-button ah-button-primary mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold">
            {t("products.kit_button")}
          </Link>
        </motion.div>
      </section>

      <section className="ah-container grid items-center gap-8 py-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-white bg-white p-7 shadow-[0_12px_30px_rgba(22,42,66,0.1)]"
        >
          <h2 className="text-3xl font-semibold text-[#162A42]">{t("products.custom_title")}</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#202020]/76 sm:text-base">{t("products.custom_description")}</p>
          <ul className="mt-5 space-y-2 text-sm text-[#162A42]/85 sm:text-base">
            <li>{t("products.custom_feature1")}</li>
            <li>{t("products.custom_feature2")}</li>
            <li>{t("products.custom_feature3")}</li>
            <li>{t("products.custom_feature4")}</li>
          </ul>
          <Link to="/contact" className="ah-button ah-button-primary mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold">
            {t("products.custom_button")}
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <img
            src={personalizado}
            alt="Custom drone 1"
            className="h-64 w-full rounded-2xl border border-white bg-white object-cover p-2 shadow-[0_12px_30px_rgba(22,42,66,0.1)] sm:h-80"
          />
          <img
            src={personalizado2}
            alt="Custom drone 2"
            className="h-64 w-full rounded-2xl border border-white bg-white object-cover p-2 shadow-[0_12px_30px_rgba(22,42,66,0.1)] sm:h-80"
          />
        </motion.div>
      </section>
    </main>
  );
};

export default Products;
