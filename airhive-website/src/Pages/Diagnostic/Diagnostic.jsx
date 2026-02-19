import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Database,
  Gauge,
  Link2,
  MessageCircle,
  Network,
  Radar,
  Route,
} from "lucide-react";

const whoIcons = [Route, Database, Radar, Gauge];

const Diagnostic = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    { q: t("diagnostic_page.faq_1_q"), a: t("diagnostic_page.faq_1_a") },
    { q: t("diagnostic_page.faq_2_q"), a: t("diagnostic_page.faq_2_a") },
    { q: t("diagnostic_page.faq_3_q"), a: t("diagnostic_page.faq_3_a") },
    { q: t("diagnostic_page.faq_4_q"), a: t("diagnostic_page.faq_4_a") },
  ];

  const steps = [
    t("diagnostic_page.step_1"),
    t("diagnostic_page.step_2"),
    t("diagnostic_page.step_3"),
    t("diagnostic_page.step_4"),
  ];

  const onSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <main className="ah-page px-6 pb-16 pt-32">
      {submitted && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-[#2A47F6] px-6 py-2 text-sm font-semibold text-white">
          {t("contact.success")}
        </div>
      )}

      <section className="ah-container pb-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6443DB]"
        >
          {t("diagnostic_page.kicker")}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-[#162A42] sm:text-5xl"
        >
          {t("diagnostic_page.title")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-4 max-w-2xl text-base text-[#202020]/75"
        >
          {t("diagnostic_page.subtitle")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-7"
        >
          <a
            href="#diagnostic-form"
            className="inline-block rounded-full bg-[#1501A5] px-7 py-3 text-sm font-semibold text-white transition duration-500 hover:bg-[#2A47F6]"
          >
            {t("diagnostic_page.cta_primary")}
          </a>
        </motion.div>
      </section>

      <section className="ah-container grid gap-12 pb-16 lg:grid-cols-2">
        <article className="rounded-3xl border border-white bg-white p-6 shadow-[0_12px_30px_rgba(22,42,66,0.1)] sm:p-8">
          <h2 className="text-2xl font-semibold text-[#162A42]">{t("diagnostic_page.for_whom")}</h2>
          <ul className="mt-6 space-y-4">
            {[t("diagnostic_page.for_1"), t("diagnostic_page.for_2"), t("diagnostic_page.for_3"), t("diagnostic_page.for_4")].map((item, idx) => {
              const Icon = whoIcons[idx];
              return (
                <li key={item} className="flex items-start gap-3 border-b border-[#DDDDDD]/80 pb-4 last:border-b-0 last:pb-0">
                  <Icon className="mt-0.5 h-4.5 w-4.5 text-[#2A47F6]" strokeWidth={1.8} />
                  <p className="text-sm text-[#202020]/80 sm:text-base">{item}</p>
                </li>
              );
            })}
          </ul>
        </article>

        <article className="rounded-3xl border border-white bg-white p-6 shadow-[0_12px_30px_rgba(22,42,66,0.1)] sm:p-8">
          <h2 className="text-2xl font-semibold text-[#162A42]">{t("diagnostic_page.duration_title")}</h2>
          <div className="mt-6 space-y-3">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl border border-white bg-white p-3 shadow-[0_6px_16px_rgba(22,42,66,0.06)]">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2A47F6]/12 text-xs font-semibold text-[#2A47F6]">
                  {idx + 1}
                </span>
                <p className="text-sm text-[#202020]/82 sm:text-base">{step}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="ah-container pb-16">
        <h2 className="text-2xl font-semibold text-[#162A42] sm:text-3xl">{t("diagnostic_page.mock_title")}</h2>
        <div className="mt-6 rounded-3xl border border-white bg-white p-6 shadow-[0_12px_30px_rgba(22,42,66,0.1)] sm:p-8">
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl border border-white bg-white p-4 shadow-[0_6px_16px_rgba(22,42,66,0.06)]">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#6443DB]">{t("diagnostic_page.mock_map")}</p>
              <div className="space-y-3 text-xs text-[#162A42]/85 sm:text-sm">
                <div className="flex items-center gap-2"><Network className="h-4 w-4 text-[#2A47F6]" /> {t("diagnostic_page.mock_map_1")}</div>
                <div className="pl-6">↓</div>
                <div className="flex items-center gap-2"><Link2 className="h-4 w-4 text-[#2A47F6]" /> {t("diagnostic_page.mock_map_2")}</div>
                <div className="pl-6">↓</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#2A47F6]" /> {t("diagnostic_page.mock_map_3")}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white bg-white p-4 shadow-[0_6px_16px_rgba(22,42,66,0.06)]">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#6443DB]">{t("diagnostic_page.mock_matrix")}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-white bg-[#2A47F6]/7 p-2">{t("diagnostic_page.mock_matrix_1")}</div>
                <div className="rounded-lg border border-white p-2">{t("diagnostic_page.mock_matrix_2")}</div>
                <div className="rounded-lg border border-white p-2">{t("diagnostic_page.mock_matrix_3")}</div>
                <div className="rounded-lg border border-white bg-[#6443DB]/10 p-2">{t("diagnostic_page.mock_matrix_4")}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white bg-white p-4 shadow-[0_6px_16px_rgba(22,42,66,0.06)]">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#6443DB]">{t("diagnostic_page.mock_roadmap")}</p>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <p className="mb-1 text-[#162A42]/80">{t("diagnostic_page.mock_roadmap_1")}</p>
                  <div className="h-2 rounded-full bg-[#2A47F6]/20"><div className="h-2 w-1/3 rounded-full bg-[#2A47F6]" /></div>
                </div>
                <div>
                  <p className="mb-1 text-[#162A42]/80">{t("diagnostic_page.mock_roadmap_2")}</p>
                  <div className="h-2 rounded-full bg-[#2A47F6]/20"><div className="h-2 w-2/3 rounded-full bg-[#1501A5]" /></div>
                </div>
                <div>
                  <p className="mb-1 text-[#162A42]/80">{t("diagnostic_page.mock_roadmap_3")}</p>
                  <div className="h-2 rounded-full bg-[#2A47F6]/20"><div className="h-2 w-full rounded-full bg-[#6443DB]" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ah-container grid gap-10 pb-6 lg:grid-cols-[1fr_1.1fr]">
        <article>
          <h2 className="text-2xl font-semibold text-[#162A42] sm:text-3xl">{t("diagnostic_page.faq_title")}</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="rounded-2xl border border-white bg-white p-4 shadow-[0_6px_16px_rgba(22,42,66,0.06)]">
                <summary className="cursor-pointer list-none text-sm font-semibold text-[#162A42] sm:text-base">{faq.q}</summary>
                <p className="mt-3 text-sm text-[#202020]/76">{faq.a}</p>
              </details>
            ))}
          </div>
        </article>

        <article id="diagnostic-form" className="rounded-3xl border border-white bg-white p-6 shadow-[0_12px_30px_rgba(22,42,66,0.1)] sm:p-8">
          <h2 className="text-2xl font-semibold text-[#162A42]">{t("diagnostic_page.form_title")}</h2>
          <p className="mt-2 text-sm text-[#202020]/72">{t("diagnostic_page.form_subtitle")}</p>
          <form
            action="https://formspree.io/f/meogayaj"
            method="POST"
            onSubmit={onSubmit}
            className="mt-5 space-y-4"
          >
            <input name="name" required placeholder={t("contact.form.name")} className="w-full rounded-xl border border-[#DDDDDD] px-4 py-2.5 text-sm outline-none transition focus:border-[#2A47F6]" />
            <input type="email" name="email" required placeholder={t("contact.form.email")} className="w-full rounded-xl border border-[#DDDDDD] px-4 py-2.5 text-sm outline-none transition focus:border-[#2A47F6]" />
            <textarea name="message" rows="4" required placeholder={t("diagnostic_page.form_placeholder")} className="w-full rounded-xl border border-[#DDDDDD] px-4 py-2.5 text-sm outline-none transition focus:border-[#2A47F6]" />
            <button type="submit" className="w-full rounded-full bg-[#1501A5] px-5 py-3 text-sm font-semibold text-white transition duration-500 hover:bg-[#2A47F6]">
              {t("diagnostic_page.cta_primary")}
            </button>
          </form>

          <a
            href="https://wa.me/528116070330"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#2A47F6]/35 bg-[#2A47F6]/8 px-5 py-3 text-sm font-semibold text-[#2A47F6] transition duration-500 hover:bg-[#2A47F6] hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
            {t("diagnostic_page.cta_whatsapp")}
          </a>
        </article>
      </section>
    </main>
  );
};

export default Diagnostic;
