import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { track } from "@vercel/analytics/react";

const FORMSPREE = "https://formspree.io/f/meogayaj";
const WHATSAPP = "https://wa.me/528116070330";

/*
 * Misma paleta que el recorrido del dron. Poco texto a propósito: un título,
 * una pregunta, una frase con la salida a WhatsApp y el formulario. Nada de
 * argumentario; quien llega aquí ya decidió escribir.
 *
 * Para que no se sienta vacía, el peso lo ponen la foto del almacén de fondo
 * y un título grande, no más texto. La foto va muy oscurecida y teñida del
 * azul de la página, más tapada a la izquierda, donde está el título.
 *
 * En el teléfono el formulario va sin tarjeta: el margen de la página más el
 * relleno de la caja dejaban los campos apretados. La tarjeta (misma receta
 * que .ah-tarjeta-oscura) aparece desde sm.
 *
 * Los campos van en transparente con el canto al 15% de blanco y, al
 * enfocarlos, el azul de marca: un campo blanco sobre fondo oscuro sería un
 * foco.
 */
const Diagnostic = () => {
  const { t } = useTranslation();
  /* idle | enviando | enviado | error */
  const [estado, setEstado] = useState("idle");

  /* Título y descripción propios: sin esto la pestaña y el resultado en
     buscadores repetían los del home. Al salir se devuelven. */
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    const canon = document.querySelector('link[rel="canonical"]');
    const antes = { titulo: document.title, desc: meta?.content, canon: canon?.href };
    document.title = "Diagnóstico gratis de inventario | Air Hive";
    meta?.setAttribute("content", "Cuéntanos cómo cuentan hoy el inventario de tu almacén y te decimos qué automatizar primero con drones autónomos y un WMS con agentes de IA. Gratis y sin compromiso.");
    canon?.setAttribute("href", "https://www.airhivemx.com/diagnostico-gratis");
    return () => {
      document.title = antes.titulo;
      if (antes.desc) meta?.setAttribute("content", antes.desc);
      if (antes.canon) canon?.setAttribute("href", antes.canon);
    };
  }, []);

  /*
   * Se envía en segundo plano y la confirmación queda aquí. Antes el form
   * hacía un POST normal a Formspree y quien escribía terminaba en la página
   * genérica de Formspree, en inglés, fuera del sitio. Si falla, se queda lo
   * escrito y se ofrece WhatsApp.
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    try {
      const r = await fetch(FORMSPREE, {
        method: "POST",
        body: new FormData(e.currentTarget),
        headers: { Accept: "application/json" },
      });
      if (!r.ok) throw new Error(String(r.status));
      setEstado("enviado");
      track("diagnostico_enviado");
    } catch {
      setEstado("error");
      track("diagnostico_error");
    }
  };

  const campo =
    "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-white/40 focus:border-[#2A47F6] focus:bg-white/[0.07]";

  return (
    <main data-ah-oscuro className="ah-oscura relative isolate flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-32">
      <img
        src="/almacen-dron-volando.webp"
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_40%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgb(10 19 34 / 96%) 0%, rgb(10 19 34 / 86%) 45%, rgb(10 19 34 / 72%) 100%), linear-gradient(0deg, #0a1322 0%, transparent 35%), rgb(42 71 246 / 10%)",
        }}
      />

      <div className="ah-container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <section>
          <h1 className="text-[3.25rem] font-bold leading-[0.95] tracking-[-0.04em] sm:text-7xl xl:text-8xl">
            {t("diagnostic_page.page_title")}
          </h1>
          <p className="mt-8 text-2xl font-semibold tracking-[-0.01em] sm:text-3xl">{t("diagnostic_page.page_question")}</p>
          <p className="mt-4 max-w-md text-lg leading-[1.6] text-white/70">
            {t("diagnostic_page.page_text")}{" "}
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { desde: "diagnostico" })}
              className="font-semibold text-[#9fb0ff] transition hover:text-white"
            >
              WhatsApp
            </a>
            .
          </p>
        </section>

        {estado === "enviado" ? (
          <div
            role="status"
            className="sm:rounded-[14px] sm:bg-[rgb(19_31_54/0.92)] sm:px-8 sm:py-10 sm:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07),0_26px_70px_-28px_rgb(0_0_0/0.85)]"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#54b385]/15 text-2xl text-[#6fd3a2]" aria-hidden>
              ✓
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.01em]">{t("diagnostic_page.form_sent_title")}</h2>
            <p className="mt-3 max-w-md text-base leading-[1.6] text-white/70">{t("diagnostic_page.form_sent_text")}</p>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("whatsapp_click", { desde: "diagnostico_enviado" })}
              className="mt-7 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white/85 ring-1 ring-white/20 transition hover:bg-white/5"
            >
              {t("diagnostic_page.form_sent_whatsapp")}
            </a>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="space-y-4 sm:rounded-[14px] sm:bg-[rgb(19_31_54/0.92)] sm:px-8 sm:py-8 sm:shadow-[inset_0_0_0_1px_rgb(255_255_255/0.07),0_26px_70px_-28px_rgb(0_0_0/0.85)] sm:backdrop-blur-md"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="name" required placeholder={t("contact.form.name")} className={campo} />
              <input name="company" placeholder={t("diagnostic_page.form_company")} className={campo} />
            </div>
            <input type="email" name="email" required placeholder={t("contact.form.email")} className={campo} />
            <textarea
              name="message"
              rows="5"
              required
              placeholder={t("diagnostic_page.form_placeholder")}
              className={`${campo} resize-none`}
            />
            {estado === "error" && (
              <p role="alert" className="rounded-xl bg-[#f5b549]/10 px-4 py-3 text-sm text-[#f5c86b] ring-1 ring-[#f5b549]/30">
                {t("diagnostic_page.form_error")}{" "}
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                  WhatsApp
                </a>
                .
              </p>
            )}
            <button
              type="submit"
              disabled={estado === "enviando"}
              className="w-full rounded-full bg-[#2A47F6] px-5 py-4 text-base font-semibold text-white shadow-[0_8px_24px_rgba(42,71,246,0.35)] transition duration-300 hover:bg-[#3d5aff] disabled:cursor-wait disabled:opacity-70"
            >
              {estado === "enviando" ? t("diagnostic_page.form_sending") : t("diagnostic_page.form_send")}
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default Diagnostic;
