import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";

const Diagnostic = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

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

      <section className="ah-container max-w-2xl pb-6">
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
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition duration-500 border-[#2A47F6]/35 bg-[#2A47F6]/8 text-[#2A47F6] hover:bg-[#2A47F6] hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
            {t("diagnostic_page.cta_whatsapp")}
          </a>
        </article>
      </section>

      <section className="ah-container max-w-4xl pb-16">
        <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(10,26,63,0.15)] transition duration-500 hover:shadow-[0_16px_48px_rgba(42,71,246,0.45)]" style={{ maxHeight: "480px" }}>
          <img
            src="/fotocontrol.jpg"
            alt=""
            className="w-full object-cover"
            style={{ transform: "scale(1.25)", transformOrigin: "50% 50%" }}
          />
        </div>
      </section>
    </main>
  );
};

export default Diagnostic;
