import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4500);
  };

  return (
    <main className="ah-page px-6 pb-14 pt-32">
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-[#2A47F6] px-6 py-3 text-sm font-medium text-white shadow-xl"
        >
          {t("contact.success")}
        </motion.div>
      )}

      <section className="ah-container grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1501A5]/70">Lead Form</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#162A42] sm:text-5xl">{t("contact_redesign.title")}</h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#202020]/74">{t("contact_redesign.subtitle")}</p>

          <div className="mt-8 space-y-3 text-sm text-[#162A42]/82 sm:text-base">
            <p><strong>{t("contact.location_label")}:</strong> {t("contact.location")}</p>
            <p><strong>{t("contact.email_label")}:</strong> airhivemx@gmail.com</p>
            <p><strong>{t("contact.phone_label")}:</strong> +52 81 1607 1269</p>
            <p><strong>{t("contact_redesign.focus_label")}:</strong> {t("contact_redesign.focus_text")}</p>
          </div>
        </div>

        <motion.form
          action="https://formspree.io/f/meogayaj"
          method="POST"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="ah-surface space-y-5 p-7 sm:p-8"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-[#162A42]">{t("contact.form.name")}</label>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-xl border border-[#162A42]/15 bg-white px-4 py-2.5 text-[#202020] outline-none transition duration-300 focus:border-[#2A47F6]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#162A42]">{t("contact.form.email")}</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-xl border border-[#162A42]/15 bg-white px-4 py-2.5 text-[#202020] outline-none transition duration-300 focus:border-[#2A47F6]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#162A42]">{t("contact_redesign.goal")}</label>
            <input
              type="text"
              name="goal"
              placeholder={t("contact_redesign.goal_placeholder")}
              className="w-full rounded-xl border border-[#162A42]/15 bg-white px-4 py-2.5 text-[#202020] outline-none transition duration-300 focus:border-[#2A47F6]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[#162A42]">{t("contact.form.message")}</label>
            <textarea
              name="message"
              rows="5"
              required
              className="w-full rounded-xl border border-[#162A42]/15 bg-white px-4 py-2.5 text-[#202020] outline-none transition duration-300 focus:border-[#2A47F6]"
            ></textarea>
          </div>
          <button type="submit" className="ah-button ah-button-primary w-full rounded-full px-6 py-3 text-sm font-semibold">
            {t("contact_redesign.submit")}
          </button>
        </motion.form>
      </section>
    </main>
  );
};

export default Contact;
