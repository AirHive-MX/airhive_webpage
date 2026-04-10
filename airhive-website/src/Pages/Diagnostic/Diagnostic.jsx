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
import useDarkMode from "../../hooks/useDarkMode";

const whoIcons = [Route, Database, Radar, Gauge];

const Diagnostic = () => {
  const { t } = useTranslation();
  const isDark = useDarkMode();
  const [submitted, setSubmitted] = useState(false);
  const blueCardStyle = isDark
    ? { background: 'linear-gradient(145deg, rgba(42,71,246,0.85), rgba(34,58,210,0.88))', borderColor: 'rgba(100,145,255,0.4)' }
    : undefined;
  const innerBlueCardStyle = isDark
    ? { background: 'linear-gradient(145deg, rgba(60,90,255,0.55), rgba(40,65,220,0.6))', borderColor: 'rgba(160,195,255,0.35)' }
    : undefined;
  const stepCardStyle = isDark
    ? { background: 'rgba(8, 14, 30, 0.55)', borderColor: 'rgba(180, 205, 255, 0.55)' }
    : undefined;

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
        <article
          className={`ah-blue-card rounded-3xl border p-6 transition duration-500 sm:p-8 ${
            isDark ? '' : 'border-[#DDDDDD] bg-white shadow-[0_12px_30px_rgba(22,42,66,0.1)]'
          }`}
          style={blueCardStyle}
        >
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-[#162A42]'}`}>{t("diagnostic_page.for_whom")}</h2>
          <ul className="mt-6 space-y-4">
            {[t("diagnostic_page.for_1"), t("diagnostic_page.for_2"), t("diagnostic_page.for_3"), t("diagnostic_page.for_4")].map((item, idx) => {
              const Icon = whoIcons[idx];
              return (
                <li key={item} className={`flex items-start gap-3 border-b pb-4 last:border-b-0 last:pb-0 ${isDark ? 'border-white/20' : 'border-[#DDDDDD]/80'}`}>
                  <Icon className={`mt-0.5 h-4.5 w-4.5 ${isDark ? 'text-white' : 'text-[#2A47F6]'}`} strokeWidth={1.8} />
                  <p className={`text-sm sm:text-base ${isDark ? 'text-white/85' : 'text-[#202020]/80'}`}>{item}</p>
                </li>
              );
            })}
          </ul>
        </article>

        <article
          className={`ah-blue-card rounded-3xl border p-6 transition duration-500 sm:p-8 ${
            isDark ? '' : 'border-[#DDDDDD] bg-white shadow-[0_12px_30px_rgba(22,42,66,0.1)]'
          }`}
          style={blueCardStyle}
        >
          <h2 className={`text-2xl font-semibold ${isDark ? 'text-white' : 'text-[#162A42]'}`}>{t("diagnostic_page.duration_title")}</h2>
          <div className="mt-6 space-y-3">
            {steps.map((step, idx) => (
              <div
                key={step}
                className={`flex items-center gap-3 rounded-2xl border p-3 ${
                  isDark ? '' : 'border-[#DDDDDD] bg-white shadow-[0_6px_16px_rgba(22,42,66,0.06)]'
                }`}
                style={stepCardStyle}
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    isDark ? '' : 'bg-[#2A47F6]/12 text-[#2A47F6]'
                  }`}
                  style={isDark ? { background: '#3d5aff', color: '#ffffff' } : undefined}
                >
                  {idx + 1}
                </span>
                <p className={`text-sm sm:text-base ${isDark ? 'text-white/90' : 'text-[#202020]/82'}`}>{step}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="ah-container pb-16">
        <h2 className={`text-2xl font-semibold sm:text-3xl ${isDark ? 'text-white' : 'text-[#162A42]'}`}>{t("diagnostic_page.mock_title")}</h2>
        <div
          className={`ah-blue-card mt-6 rounded-3xl border p-6 transition duration-500 sm:p-8 ${
            isDark ? '' : 'border-[#DDDDDD] bg-white shadow-[0_12px_30px_rgba(22,42,66,0.1)]'
          }`}
          style={blueCardStyle}
        >
          <div className="grid gap-5 lg:grid-cols-3">
            <div
              className={`rounded-2xl border p-4 ${
                isDark ? '' : 'border-[#DDDDDD] bg-white shadow-[0_6px_16px_rgba(22,42,66,0.06)]'
              }`}
              style={stepCardStyle}
            >
              <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-white/90' : 'text-[#6443DB]'}`}>{t("diagnostic_page.mock_map")}</p>
              <div className={`space-y-3 text-xs sm:text-sm ${isDark ? 'text-white/90' : 'text-[#162A42]/85'}`}>
                <div className="flex items-center gap-2"><Network className={`h-4 w-4 ${isDark ? 'text-white' : 'text-[#2A47F6]'}`} /> {t("diagnostic_page.mock_map_1")}</div>
                <div className="pl-6">↓</div>
                <div className="flex items-center gap-2"><Link2 className={`h-4 w-4 ${isDark ? 'text-white' : 'text-[#2A47F6]'}`} /> {t("diagnostic_page.mock_map_2")}</div>
                <div className="pl-6">↓</div>
                <div className="flex items-center gap-2"><CheckCircle2 className={`h-4 w-4 ${isDark ? 'text-white' : 'text-[#2A47F6]'}`} /> {t("diagnostic_page.mock_map_3")}</div>
              </div>
            </div>

            <div
              className={`rounded-2xl border p-4 ${
                isDark ? '' : 'border-[#DDDDDD] bg-white shadow-[0_6px_16px_rgba(22,42,66,0.06)]'
              }`}
              style={stepCardStyle}
            >
              <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-white/90' : 'text-[#6443DB]'}`}>{t("diagnostic_page.mock_matrix")}</p>
              <div className={`grid grid-cols-2 gap-2 text-xs ${isDark ? 'text-white/90' : ''}`}>
                <div
                  className={`rounded-lg border p-2 ${isDark ? 'border-[rgba(120,155,255,0.5)]' : 'border-[#DDDDDD] bg-[#2A47F6]/7'}`}
                  style={isDark ? { background: '#3d5aff' } : undefined}
                >{t("diagnostic_page.mock_matrix_1")}</div>
                <div
                  className={`rounded-lg border p-2 ${isDark ? 'border-[rgba(120,155,255,0.5)]' : 'border-[#DDDDDD]'}`}
                  style={isDark ? { background: '#3d5aff' } : undefined}
                >{t("diagnostic_page.mock_matrix_2")}</div>
                <div
                  className={`rounded-lg border p-2 ${isDark ? 'border-[rgba(120,155,255,0.5)]' : 'border-[#DDDDDD]'}`}
                  style={isDark ? { background: '#3d5aff' } : undefined}
                >{t("diagnostic_page.mock_matrix_3")}</div>
                <div
                  className={`rounded-lg border p-2 ${isDark ? 'border-[rgba(120,155,255,0.5)]' : 'border-[#DDDDDD] bg-[#6443DB]/10'}`}
                  style={isDark ? { background: '#3d5aff' } : undefined}
                >{t("diagnostic_page.mock_matrix_4")}</div>
              </div>
            </div>

            <div
              className={`rounded-2xl border p-4 ${
                isDark ? '' : 'border-[#DDDDDD] bg-white shadow-[0_6px_16px_rgba(22,42,66,0.06)]'
              }`}
              style={stepCardStyle}
            >
              <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.18em] ${isDark ? 'text-white/90' : 'text-[#6443DB]'}`}>{t("diagnostic_page.mock_roadmap")}</p>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <p className={`mb-1 ${isDark ? 'text-white/90' : 'text-[#162A42]/80'}`}>{t("diagnostic_page.mock_roadmap_1")}</p>
                  <div className="h-2 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(42,71,246,0.2)' }}>
                    <div className="h-2 w-1/3 rounded-full" style={{ background: '#ffffff' }} />
                  </div>
                </div>
                <div>
                  <p className={`mb-1 ${isDark ? 'text-white/90' : 'text-[#162A42]/80'}`}>{t("diagnostic_page.mock_roadmap_2")}</p>
                  <div className="h-2 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(42,71,246,0.2)' }}>
                    <div className="h-2 w-2/3 rounded-full" style={{ background: '#ffffff' }} />
                  </div>
                </div>
                <div>
                  <p className={`mb-1 ${isDark ? 'text-white/90' : 'text-[#162A42]/80'}`}>{t("diagnostic_page.mock_roadmap_3")}</p>
                  <div className="h-2 rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(42,71,246,0.2)' }}>
                    <div className="h-2 w-full rounded-full" style={{ background: '#ffffff' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ah-container grid gap-10 pb-6 lg:grid-cols-[1fr_1.1fr]">
        <article
          className={`ah-blue-card rounded-3xl border p-6 transition duration-500 sm:p-8 ${
            isDark ? '' : 'bg-white border-[#162A42]/10 shadow-[0_12px_30px_rgba(22,42,66,0.1)]'
          }`}
          style={blueCardStyle}
        >
          <h2 className={`text-2xl font-semibold sm:text-3xl ${isDark ? 'text-white' : 'text-[#162A42]'}`}>{t("diagnostic_page.faq_title")}</h2>
          <div className="mt-5 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className={`rounded-2xl border p-4 ${
                  isDark ? '' : 'border-[#162A42]/10 bg-white shadow-[0_6px_16px_rgba(22,42,66,0.06)]'
                }`}
                style={stepCardStyle}
              >
                <summary className={`cursor-pointer list-none text-sm font-semibold sm:text-base ${isDark ? 'text-white' : 'text-[#162A42]'}`}>{faq.q}</summary>
                <p className={`mt-3 text-sm ${isDark ? 'text-white/85' : 'text-[#202020]/76'}`}>{faq.a}</p>
              </details>
            ))}
          </div>
        </article>

        <article id="diagnostic-form" className="ah-form-card p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-[#162A42]">{t("diagnostic_page.form_title")}</h2>
          <p className="mt-2 text-sm text-[#202020]/72">{t("diagnostic_page.form_subtitle")}</p>
          <form
            action="https://formspree.io/f/meogayaj"
            method="POST"
            onSubmit={onSubmit}
            className="mt-5 space-y-4"
          >
            <input name="name" required placeholder={t("contact.form.name")} className="w-full rounded-xl border border-[#2A47F6]/40 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2A47F6]" />
            <input type="email" name="email" required placeholder={t("contact.form.email")} className="w-full rounded-xl border border-[#2A47F6]/40 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2A47F6]" />
            <textarea name="message" rows="4" required placeholder={t("diagnostic_page.form_placeholder")} className="w-full rounded-xl border border-[#2A47F6]/40 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2A47F6]" />
            <button type="submit" className="w-full rounded-full bg-[#1501A5] px-5 py-3 text-sm font-semibold text-white transition duration-500 hover:bg-[#2A47F6]">
              {t("diagnostic_page.cta_primary")}
            </button>
          </form>

          <a
            href="https://wa.me/528116070330"
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition duration-500 ${
              isDark
                ? 'text-white hover:bg-[#2A47F6]'
                : 'border-[#2A47F6]/35 bg-[#2A47F6]/8 text-[#2A47F6] hover:bg-[#2A47F6] hover:text-white'
            }`}
            style={isDark ? {
              background: '#1501A5',
              borderColor: 'rgb(160 195 255 / 60%)',
            } : undefined}
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
