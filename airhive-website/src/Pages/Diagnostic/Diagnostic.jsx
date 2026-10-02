import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle } from "lucide-react";

/*
 * Misma paleta que el recorrido del dron. El formulario es el único sitio donde
 * hizo falta pensar aparte: un campo blanco sobre fondo oscuro es un foco, así
 * que van en transparente con el canto al 15% de blanco y, al enfocarlos, el
 * azul de marca. El texto que escribe el usuario va en blanco y el marcador de
 * posición al 40%, que es el contraste justo para distinguir lo escrito de lo
 * sugerido.
 */
const Diagnostic = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  const campo =
    "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[#2A47F6] focus:bg-white/[0.07]";

  return (
    <main data-ah-oscuro className="ah-oscura px-6 pt-32">
      {submitted && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-full bg-[#2A47F6] px-6 py-2 text-sm font-semibold text-white">
          {t("contact.success")}
        </div>
      )}

      <section className="ah-container max-w-2xl pb-0">
        <article id="diagnostic-form" className="ah-tarjeta-oscura px-6 py-6 sm:px-8 sm:py-7">
          <h2 className="text-2xl font-semibold leading-[1.18] tracking-[-0.015em]">
            {t("diagnostic_page.form_title")}
          </h2>
          <p className="mt-2 text-sm leading-[1.65] text-white/60">{t("diagnostic_page.form_subtitle")}</p>
          <form
            action="https://formspree.io/f/meogayaj"
            method="POST"
            onSubmit={onSubmit}
            className="mt-5 space-y-4"
          >
            <input name="name" required placeholder={t("contact.form.name")} className={campo} />
            <input type="email" name="email" required placeholder={t("contact.form.email")} className={campo} />
            <textarea
              name="message"
              rows="4"
              required
              placeholder={t("diagnostic_page.form_placeholder")}
              className={campo}
            />
            <button
              type="submit"
              className="w-full rounded-full bg-[#2A47F6] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(42,71,246,0.35)] transition duration-500 hover:bg-[#3d5aff]"
            >
              {t("diagnostic_page.cta_primary")}
            </button>
          </form>

          <a
            href="https://wa.me/528116070330"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition duration-500 hover:border-[#2A47F6] hover:bg-[#2A47F6] hover:text-white"
          >
            <MessageCircle className="h-4 w-4" />
            {t("diagnostic_page.cta_whatsapp")}
          </a>
        </article>
      </section>

      <section className="ah-container max-w-4xl pb-16 pt-12">
        <div
          className="overflow-hidden rounded-[14px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07),0_26px_70px_-28px_rgba(0,0,0,0.85)] transition duration-500"
          style={{ maxHeight: "480px" }}
        >
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
