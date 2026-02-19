import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import about1 from "/about1.webp";
import about2 from "/about2.webp";

const About = () => {
  const { t } = useTranslation();

  return (
    <main className="ah-page pt-28">
      <section className="ah-container grid items-center gap-10 py-16 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1501A5]/70">Air Hive</p>
          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-[#162A42] sm:text-5xl">{t("about.story_title")}</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#202020]/74">{t("about.story_text")}</p>
          <Link to="/contact" className="ah-button ah-button-primary mt-8 inline-block rounded-full px-6 py-3 text-sm font-semibold">
            {t("navbar.diagnostic")}
          </Link>
        </motion.div>
        <motion.img
          src={about1}
          alt="Air Hive story"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="h-[420px] w-full rounded-2xl border border-white bg-white object-cover p-2 shadow-[0_12px_30px_rgba(22,42,66,0.1)]"
        />
      </section>

      <section className="ah-container grid gap-6 py-8 md:grid-cols-2">
        {[{ key: "mission", text: t("about.mission_text") }, { key: "vision", text: t("about.vision_text") }].map((item) => (
          <motion.article
            key={item.key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white bg-gradient-to-br from-[#2A47F6] to-[#1501A5] p-7 text-white shadow-[0_14px_34px_rgba(42,71,246,0.24),inset_0_0_0_1px_rgba(255,255,255,0.35)] sm:p-8"
          >
            <p className="text-base font-bold uppercase tracking-[0.24em] text-white/95 sm:text-lg">{t(`about.${item.key}_button`)}</p>
            <p className="mt-4 text-lg leading-relaxed text-white/90 sm:text-xl">{item.text}</p>
          </motion.article>
        ))}
      </section>

      <section className="ah-container grid items-center gap-10 py-16 lg:grid-cols-2">
        <motion.img
          src={about2}
          alt="Air Hive team"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="h-[360px] w-full rounded-2xl border border-white bg-white object-cover p-2 shadow-[0_12px_30px_rgba(22,42,66,0.1)]"
        />
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-[#162A42] sm:text-4xl">{t("about.team_title")}</h2>
          <p className="mt-4 text-base leading-relaxed text-[#202020]/74">{t("about.team_text_1")}</p>
          <p className="mt-3 text-base leading-relaxed text-[#202020]/74">{t("about.team_text_2")}</p>
          <p className="mt-7 max-w-xl rounded-2xl border border-[#162A42]/12 bg-white/70 p-5 text-sm leading-relaxed text-[#162A42]/85">
            {t("about.philosophy_text")}
          </p>
        </motion.div>
      </section>
    </main>
  );
};

export default About;
