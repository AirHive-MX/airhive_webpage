import { Fragment } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Cpu,
  Database,
  Layers3,
  LayoutGrid,
  Package,
  Route,
  Truck,
  Workflow,
} from "lucide-react";
import droneIcon from "/drone-icon@1x.png";
import wmsIcon from "/wms-air-hive-icon@2x.png";
import trazabilidadIcon from "/trazabilidad-icon@2x.png";

const whatWeDoCards = [
  { image: droneIcon, titleKey: "home_redesign.what_we_do_1_title", textKey: "home_redesign.what_we_do_1_text" },
  { image: wmsIcon, titleKey: "home_redesign.what_we_do_2_title", textKey: "home_redesign.what_we_do_2_text" },
  { icon: Cpu, titleKey: "home_redesign.what_we_do_3_title", textKey: "home_redesign.what_we_do_3_text" },
  { image: trazabilidadIcon, titleKey: "home_redesign.what_we_do_4_title", textKey: "home_redesign.what_we_do_4_text" },
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

  return (
    <main className="ah-page overflow-hidden pt-[60px] text-[#202020]">
      <section className="relative min-h-[86vh] overflow-hidden bg-[#162A42] text-white">
        <img
          src="/foto almacen dron volando.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(22,42,66,0.82)_0%,rgba(21,1,165,0.75)_55%,rgba(100,67,219,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(100,67,219,0.24),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(21,1,165,0.38),transparent_40%)]" />
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
              <Link to="/contact" className="rounded-full bg-[#2A47F6] px-7 py-3 text-center text-sm font-semibold text-white shadow-[0_8px_24px_rgba(42,71,246,0.4)] transition duration-500 hover:bg-[#3d5aff] hover:shadow-[0_12px_32px_rgba(42,71,246,0.55)]">
                {t("home_redesign.cta_primary")}
              </Link>
              <Link
                to="/products"
                className="rounded-full bg-[#2A47F6] px-7 py-3 text-center text-sm font-semibold text-white shadow-[0_8px_24px_rgba(42,71,246,0.4)] transition duration-500 hover:bg-[#3d5aff] hover:shadow-[0_12px_32px_rgba(42,71,246,0.55)]"
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
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#202020]/70">
            {t("home_redesign.what_we_do_subtitle")}
          </p>
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
                className="group ah-blue-card rounded-2xl border border-[#162A42]/10 bg-white/85 p-6 transition duration-500 hover:border-[#2A47F6]/50 hover:shadow-[0_0_0_1px_rgba(42,71,246,0.35),0_12px_30px_rgba(42,71,246,0.16)]"
              >
                {card.image ? (
                  <img
                    src={card.image}
                    alt=""
                    className="h-7 w-7 object-contain"
                    style={{ filter: 'brightness(0) saturate(100%) invert(18%) sepia(93%) saturate(7045%) hue-rotate(231deg) brightness(99%) contrast(95%) drop-shadow(0 0 0.45px rgba(42,71,246,1)) drop-shadow(0 0 0.45px rgba(42,71,246,1))' }}
                  />
                ) : (
                  <Icon className="h-5 w-5 text-[#2A47F6]" strokeWidth={2.4} />
                )}
                <h3 className="mt-5 text-lg font-semibold leading-snug text-[#162A42]">{t(card.titleKey)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#202020]/75">{t(card.textKey)}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </section>

      <section className="ah-container py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1501A5]/70">
            {t("home_redesign.process_kicker")}
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#162A42] sm:text-4xl">
            {t("home_redesign.process_title")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[#202020]/75 sm:text-lg">
            {t("home_redesign.process_text")}
          </p>
        </motion.div>

        {/* Desktop */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="hidden items-center justify-center gap-4 md:flex lg:gap-6"
        >
          {[
            { n: 1, icon: Package, label: t("home_redesign.process_stage_1") },
            { n: 2, icon: LayoutGrid, label: t("home_redesign.process_stage_2") },
            { n: 3, icon: ClipboardCheck, label: t("home_redesign.process_stage_3") },
            { n: 4, icon: Truck, label: t("home_redesign.process_stage_4") },
          ].map(({ n, icon: StageIcon, label }, idx) => {
            const isActive = n === 3;
            return (
              <Fragment key={n}>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 28, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`group relative flex h-52 w-44 flex-col items-center justify-between overflow-hidden rounded-xl transition-all duration-500 hover:-translate-y-2 lg:h-60 lg:w-52 ${
                    isActive
                      ? "bg-gradient-to-b from-[#005BFF] to-[#003FC2] shadow-[0_8px_30px_rgba(0,91,255,0.3)] hover:shadow-[0_16px_50px_rgba(0,91,255,0.5),0_0_20px_rgba(100,67,219,0.3)]"
                      : "bg-[#001B3F] shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_50px_rgba(42,71,246,0.4),0_0_20px_rgba(100,67,219,0.25)]"
                  }`}
                >
                  {/* Blue top stripe */}
                  <div className={`h-1.5 w-full ${isActive ? "bg-white/30" : "bg-[#005BFF]"}`} />

                  {/* Icon */}
                  <div className="flex flex-1 items-center justify-center">
                    <StageIcon className="h-16 w-16 text-white lg:h-20 lg:w-20" strokeWidth={1.2} />
                  </div>

                  {/* Label + underline */}
                  <div className="flex flex-col items-center pb-5">
                    <p className="text-base font-bold text-white lg:text-lg">{label}</p>
                    <div className={`mt-2 h-[2px] w-10 rounded-full ${isActive ? "bg-white" : "bg-[#005BFF]"}`} />
                  </div>
                </motion.div>

                {/* Arrow between cards */}
                {idx < 3 && (
                  <motion.div
                    variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 1, scale: 1 } }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex items-center"
                  >
                    <ArrowRight className="h-6 w-6 text-[#005BFF]" strokeWidth={2.5} />
                  </motion.div>
                )}
              </Fragment>
            );
          })}
        </motion.div>

        {/* Mobile */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="flex flex-col items-center gap-3 md:hidden"
        >
          {[
            { n: 1, icon: Package, label: t("home_redesign.process_stage_1") },
            { n: 2, icon: LayoutGrid, label: t("home_redesign.process_stage_2") },
            { n: 3, icon: ClipboardCheck, label: t("home_redesign.process_stage_3") },
            { n: 4, icon: Truck, label: t("home_redesign.process_stage_4") },
          ].map(({ n, icon: StageIcon, label }, idx) => {
            const isActive = n === 3;
            return (
              <Fragment key={n}>
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className={`relative flex h-44 w-40 flex-col items-center justify-between overflow-hidden rounded-xl transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-b from-[#005BFF] to-[#003FC2] shadow-[0_8px_24px_rgba(0,91,255,0.3)]"
                      : "bg-[#001B3F] shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
                  }`}
                >
                  <div className={`h-1.5 w-full ${isActive ? "bg-white/30" : "bg-[#005BFF]"}`} />
                  <div className="flex flex-1 items-center justify-center">
                    <StageIcon className="h-14 w-14 text-white" strokeWidth={1.2} />
                  </div>
                  <div className="flex flex-col items-center pb-4">
                    <p className="text-sm font-bold text-white">{label}</p>
                    <div className={`mt-2 h-[2px] w-8 rounded-full ${isActive ? "bg-white" : "bg-[#005BFF]"}`} />
                  </div>
                </motion.div>

                {idx < 3 && (
                  <motion.div
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    className="rotate-90"
                  >
                    <ArrowRight className="h-5 w-5 text-[#005BFF]" strokeWidth={2.5} />
                  </motion.div>
                )}
              </Fragment>
            );
          })}
        </motion.div>
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
              className="diagnostic-card ah-blue-card rounded-3xl border border-white bg-white p-6 shadow-[0_10px_28px_rgba(22,42,66,0.08)] transition duration-500 hover:border-[#2A47F6]/35 hover:shadow-[0_12px_34px_rgba(42,71,246,0.1)] sm:p-7"
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
              className="diagnostic-card ah-blue-card rounded-3xl border border-white bg-white p-6 shadow-[0_10px_28px_rgba(22,42,66,0.08)] transition duration-500 hover:border-[#6443DB]/35 hover:shadow-[0_12px_34px_rgba(100,67,219,0.1)] sm:p-7"
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
              className="rounded-full border border-[#2A47F6]/20 bg-white px-8 py-3 text-center text-sm font-semibold shadow-[0_12px_26px_rgba(21,1,165,0.12)] transition duration-500 hover:bg-[#2A47F6] hover:!text-white hover:shadow-[0_16px_30px_rgba(42,71,246,0.28)]" style={{ color: '#2A47F6' }}
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
