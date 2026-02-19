import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import services from "/services.webp";
import heroWeb from "/hero_web.webp";
import home2 from "/home2.webp";
import droneCustom from "/dronpersonalizado.webp";

const Services = () => {
  const { t } = useTranslation();

  const servicesData = [
    { title: t("services_redesign.card_1_title"), text: t("services_redesign.card_1_text"), image: services },
    { title: t("services_redesign.card_2_title"), text: t("services_redesign.card_2_text"), image: heroWeb },
    { title: t("services_redesign.card_3_title"), text: t("services_redesign.card_3_text"), image: home2 },
    { title: t("services_redesign.card_4_title"), text: t("services_redesign.card_4_text"), image: droneCustom },
  ];

  const workflowSteps = [
    { title: t("services_redesign.workflow_1_title"), text: t("services_redesign.workflow_1_text") },
    { title: t("services_redesign.workflow_2_title"), text: t("services_redesign.workflow_2_text") },
    { title: t("services_redesign.workflow_3_title"), text: t("services_redesign.workflow_3_text") },
    { title: t("services_redesign.workflow_4_title"), text: t("services_redesign.workflow_4_text") },
  ];

  return (
    <main className="ah-page pt-28">
      <section className="ah-container py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1501A5]/70">Services</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#162A42] sm:text-5xl">{t("services.title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-[#202020]/72">{t("services.subtitle")}</p>
      </section>

      <section id="como-trabajamos" className="ah-container py-12 scroll-mt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1501A5]/70">
            {t("services_redesign.workflow_kicker")}
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-[#162A42] sm:text-4xl">
            {t("services_redesign.workflow_title")}
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 top-6 hidden h-[2px] w-[82%] -translate-x-1/2 bg-[#DDDDDD] lg:block" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute left-1/2 top-6 hidden h-[2px] w-[82%] origin-left -translate-x-1/2 bg-gradient-to-r from-[#2A47F6] to-[#6443DB] lg:block"
          />

          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-4 lg:gap-8">
            {workflowSteps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.15, ease: "easeOut" }}
                className="relative rounded-2xl border border-white bg-white p-5 shadow-[0_12px_30px_rgba(22,42,66,0.1)]"
              >
                <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2A47F6]/12 text-xs font-semibold text-[#2A47F6]">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-[#162A42]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#202020]/74">{step.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="ah-container grid gap-5 pb-10 pt-8 md:grid-cols-2">
        {servicesData.map((service, index) => (
          <motion.article
            key={service.title}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            className="overflow-hidden rounded-2xl border border-white bg-white shadow-[0_12px_30px_rgba(22,42,66,0.1)]"
          >
            <img src={service.image} alt={service.title} className="h-52 w-full object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#1F3CCF]">{service.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#202020]/75">{service.text}</p>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="ah-container py-14">
        <div className="ah-surface bg-gradient-to-br from-[#162A42] to-[#1501A5] p-8 text-white sm:p-10">
          <h2 className="text-2xl font-semibold sm:text-3xl">{t("services_redesign.cta_title")}</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">{t("services_redesign.cta_text")}</p>
          <Link to="/contact" className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#162A42] transition duration-500 hover:bg-[#DDDDDD]">
            {t("navbar.diagnostic")}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Services;
