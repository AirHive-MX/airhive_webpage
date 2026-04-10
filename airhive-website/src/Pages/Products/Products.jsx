import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import droneInventory from "/definitiva.png";
import useDarkMode from "../../hooks/useDarkMode";

const Products = () => {
  const { t } = useTranslation();
  const isDark = useDarkMode();

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
            className="h-[500px] w-[125%] max-w-none object-cover object-top"
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

      {/* 2 — AI Agents (text only) */}
      <section id="ai-agents" className="ah-container py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
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

      {/* 3 — Other Products (full width cards) */}
      <section id="other-products" className="ah-container py-16">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-3xl font-semibold text-[#162A42] sm:text-4xl"
        >
          {t("products.other_products.title")}
        </motion.h2>
        <div className="grid gap-6 md:grid-cols-2">
          {["logistics", "counting", "vision", "hardware"].map((key, i) => (
            <motion.article
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`ah-blue-card rounded-2xl border p-7 transition duration-500 sm:p-8 ${
                isDark
                  ? 'border-[rgba(100,145,255,0.4)]'
                  : 'border-[#2A47F6]/15 bg-white shadow-[0_14px_34px_rgba(22,42,66,0.08)]'
              }`}
              style={isDark ? { background: 'linear-gradient(145deg, rgba(42,71,246,0.85), rgba(34,58,210,0.88))' } : undefined}
            >
              <p className={`text-lg font-bold uppercase tracking-[0.14em] ${isDark ? 'text-white' : 'text-[#2A47F6]'}`}>{t(`products.other_products.${key}_title`)}</p>
              <p className={`mt-3 text-base leading-relaxed ${isDark ? 'text-white/85' : 'text-[#202020]/74'}`}>{t(`products.other_products.${key}_text`)}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Products;
