import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock3,
  Database,
  Layers3,
  Radar,
  Route,
  Workflow,
} from "lucide-react";
import home1 from "/home1.webp";
import home2 from "/home2.webp";
import home3 from "/home3.webp";

const whatWeDoCards = [
  { icon: Workflow, titleKey: "home_redesign.what_we_do_1_title", textKey: "home_redesign.what_we_do_1_text" },
  { icon: Bot, titleKey: "home_redesign.what_we_do_2_title", textKey: "home_redesign.what_we_do_2_text" },
  { icon: ChartNoAxesCombined, titleKey: "home_redesign.what_we_do_3_title", textKey: "home_redesign.what_we_do_3_text" },
  { icon: Radar, titleKey: "home_redesign.what_we_do_4_title", textKey: "home_redesign.what_we_do_4_text" },
];

const showcaseCards = [
  { image: home1, titleKey: "home_redesign.card_1_title", textKey: "home_redesign.card_1_text" },
  { image: home2, titleKey: "home_redesign.card_2_title", textKey: "home_redesign.card_2_text" },
  { image: home3, titleKey: "home_redesign.card_3_title", textKey: "home_redesign.card_3_text" },
];

const reviewItems = [
  {
    icon: Workflow,
    titleKey: "home_redesign.review_1_title",
    textKey: "home_redesign.review_1_text",
  },
  {
    icon: Database,
    titleKey: "home_redesign.review_2_title",
    textKey: "home_redesign.review_2_text",
  },
  {
    icon: AlertTriangle,
    titleKey: "home_redesign.review_3_title",
    textKey: "home_redesign.review_3_text",
  },
  {
    icon: BarChart3,
    titleKey: "home_redesign.review_4_title",
    textKey: "home_redesign.review_4_text",
  },
];

const deliverItems = [
  {
    icon: Layers3,
    titleKey: "home_redesign.deliver_1_title",
    textKey: "home_redesign.deliver_1_text",
  },
  {
    icon: BarChart3,
    titleKey: "home_redesign.deliver_2_title",
    textKey: "home_redesign.deliver_2_text",
  },
  {
    icon: Route,
    titleKey: "home_redesign.deliver_3_title",
    textKey: "home_redesign.deliver_3_text",
  },
  {
    icon: CheckCircle2,
    titleKey: "home_redesign.deliver_4_title",
    textKey: "home_redesign.deliver_4_text",
  },
];

const Home = () => {
  const { t } = useTranslation();
  const [activeShowcase, setActiveShowcase] = useState(0);

  return (
    <main className="ah-page overflow-hidden pt-28 text-[#202020]">
      <section className="relative min-h-[86vh] overflow-hidden bg-[#162A42] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(100,67,219,0.24),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(21,1,165,0.38),transparent_40%),linear-gradient(130deg,#162A42_0%,#1501A5_55%,#6443DB_100%)]" />
        <div className="absolute inset-0 opacity-30 [background:repeating-linear-gradient(0deg,transparent,transparent_46px,rgba(255,255,255,0.06)_47px),repeating-linear-gradient(90deg,transparent,transparent_46px,rgba(255,255,255,0.06)_47px)]" />
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2A47F6]/25 blur-[110px]" />

        <div className="ah-container relative flex min-h-[86vh] items-center py-16">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
            >
              {t("home_redesign.hero_headline")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg"
            >
              {t("home_redesign.hero_subheadline")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link to="/contact" className="rounded-full bg-white px-7 py-3 text-center text-sm font-semibold text-[#162A42] transition duration-500 hover:bg-[#DDDDDD]">
                {t("home_redesign.cta_primary")}
              </Link>
              <Link
                to="/products"
                className="rounded-full border border-white/40 px-7 py-3 text-center text-sm font-semibold text-white transition duration-500 hover:border-white hover:bg-white/8"
              >
                {t("home_redesign.cta_cases")}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="ah-container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1501A5]/70">
            {t("home_redesign.what_we_do_kicker")}
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-[#162A42] sm:text-4xl">
            {t("home_redesign.what_we_do_title")}
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {whatWeDoCards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.titleKey}
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="group rounded-2xl border border-[#162A42]/10 bg-white/85 p-6 transition duration-500 hover:border-[#2A47F6]/50 hover:shadow-[0_0_0_1px_rgba(42,71,246,0.35),0_12px_30px_rgba(42,71,246,0.16)]"
              >
                <Icon className="h-5 w-5 text-[#2A47F6]" strokeWidth={1.8} />
                <h3 className="mt-5 text-lg font-semibold leading-snug text-[#162A42]">{t(card.titleKey)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#202020]/75">{t(card.textKey)}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      <section className="ah-container grid gap-8 py-20 lg:grid-cols-[1fr_1.15fr]">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1501A5]/70">{t("home_redesign.stack_kicker")}</p>
          <h2 className="mt-4 max-w-md text-3xl font-semibold leading-tight text-[#162A42] sm:text-4xl">
            {t("home_redesign.stack_title")}
          </h2>
          <p className="mt-4 max-w-md text-base text-[#202020]/72">{t("home_redesign.stack_text")}</p>
          <Link to="/products" className="ah-button ah-button-secondary mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold">
            {t("home_redesign.stack_button")}
          </Link>
          <motion.div
            key={showcaseCards[activeShowcase].image}
            initial={{ opacity: 0.25, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="ah-surface mt-7 overflow-hidden p-2"
          >
            <img
              src={showcaseCards[activeShowcase].image}
              alt={t(showcaseCards[activeShowcase].titleKey)}
              className="h-64 w-full rounded-xl object-cover sm:h-72"
            />
          </motion.div>
        </div>

        <div className="space-y-6">
          {showcaseCards.map((card, index) => (
            <motion.article
              key={card.titleKey}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              onViewportEnter={() => setActiveShowcase(index)}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5 + index * 0.1, ease: "easeOut" }}
              className={`rounded-2xl border bg-white/88 p-6 transition duration-500 sm:p-8 ${
                activeShowcase === index
                  ? "border-[#2A47F6]/35 shadow-[0_0_0_1px_rgba(42,71,246,0.18),0_14px_34px_rgba(42,71,246,0.12)]"
                  : "border-[#162A42]/10 shadow-[0_6px_18px_rgba(22,42,66,0.05)]"
              }`}
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#2A47F6]/75">
                0{index + 1}
              </p>
              <h3 className="text-2xl font-semibold text-[#162A42]">{t(card.titleKey)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#202020]/75 sm:text-base">{t(card.textKey)}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="diagnostic-block relative overflow-hidden bg-white py-24 text-[#202020] lg:py-28">
        <div className="diagnostic-glow-a absolute right-[-120px] top-[-60px] h-80 w-80 rounded-full bg-[radial-gradient(circle,#1501A5_0%,transparent_65%)] opacity-[0.08]" />
        <div className="diagnostic-glow-b absolute left-[-110px] bottom-[-90px] h-80 w-80 rounded-full bg-[radial-gradient(circle,#2A47F6_0%,transparent_68%)] opacity-[0.08]" />

        <div className="ah-container relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <p className="diagnostic-kicker text-xs font-semibold uppercase tracking-[0.22em] text-[#6443DB]">
                {t("home_redesign.diagnostic_kicker")}
              </p>
              <h2 className="diagnostic-title mt-3 bg-gradient-to-r from-[#2A47F6] via-[#1501A5] to-[#6443DB] bg-clip-text text-3xl font-semibold leading-tight text-transparent sm:text-4xl lg:text-[2.65rem]">
                {t("home_redesign.diagnostic_title")}
              </h2>
              <p className="diagnostic-subtitle mt-4 text-sm text-[#202020]/70 sm:text-base">{t("home_redesign.diagnostic_subtitle")}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
              className="flex flex-wrap gap-2 lg:justify-end"
            >
              <span className="diagnostic-chip inline-flex items-center gap-2 rounded-full border border-[#DDDDDD] bg-white px-3 py-1.5 text-xs font-medium text-[#162A42]/85">
                <Clock3 className="diagnostic-chip-icon h-3.5 w-3.5 text-[#6443DB]" />
                {t("home_redesign.diagnostic_chip_1")}
              </span>
              <span className="diagnostic-chip inline-flex items-center rounded-full border border-white bg-white px-3 py-1.5 text-xs font-medium text-[#162A42]/85 shadow-[0_4px_12px_rgba(22,42,66,0.06)]">
                {t("home_redesign.diagnostic_chip_2")}
              </span>
            </motion.div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-12">
            <motion.article
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="diagnostic-card rounded-3xl border border-white bg-white p-6 shadow-[0_10px_28px_rgba(22,42,66,0.08)] transition duration-500 hover:border-[#2A47F6]/35 hover:shadow-[0_12px_34px_rgba(42,71,246,0.1)] sm:p-7"
            >
              <h3 className="diagnostic-card-title mb-5 text-xl font-semibold text-[#162A42]">{t("home_redesign.review_title")}</h3>
              <ul className="space-y-4">
                {reviewItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.titleKey}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, delay: idx * 0.18, ease: "easeOut" }}
                      className="diagnostic-item border-b border-white pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="diagnostic-item-icon mt-0.5 h-4.5 w-4.5 text-[#2A47F6]" strokeWidth={1.8} />
                        <div>
                          <p className="diagnostic-item-title text-sm font-semibold text-[#162A42] sm:text-[0.95rem]">{t(item.titleKey)}</p>
                          <p className="diagnostic-item-text mt-1 text-xs text-[#202020]/72 sm:text-sm">{t(item.textKey)}</p>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
              className="diagnostic-card rounded-3xl border border-white bg-white p-6 shadow-[0_10px_28px_rgba(22,42,66,0.08)] transition duration-500 hover:border-[#6443DB]/35 hover:shadow-[0_12px_34px_rgba(100,67,219,0.1)] sm:p-7"
            >
              <h3 className="diagnostic-card-title mb-5 text-xl font-semibold text-[#162A42]">{t("home_redesign.deliver_title")}</h3>
              <ul className="space-y-4">
                {deliverItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.titleKey}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, delay: idx * 0.18, ease: "easeOut" }}
                      className="diagnostic-item border-b border-white pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="diagnostic-item-icon mt-0.5 h-4.5 w-4.5 text-[#6443DB]" strokeWidth={1.8} />
                        <div>
                          <p className="diagnostic-item-title text-sm font-semibold text-[#162A42] sm:text-[0.95rem]">{t(item.titleKey)}</p>
                          <p className="diagnostic-item-text mt-1 text-xs text-[#202020]/72 sm:text-sm">{t(item.textKey)}</p>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.article>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mt-10 flex justify-center"
          >
            <Link
              to="/contact"
              className="rounded-full bg-[#1501A5] px-8 py-3 text-center text-sm font-semibold text-white shadow-[0_12px_26px_rgba(21,1,165,0.28)] transition duration-500 hover:bg-[#2A47F6] hover:shadow-[0_16px_30px_rgba(42,71,246,0.28)]"
            >
              {t("home_redesign.cta_primary")}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;
