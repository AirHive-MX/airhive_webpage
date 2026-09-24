import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, MousePointer2 } from "lucide-react";
import ScrollSequence from "../ScrollSequence/ScrollSequence";

/**
 * Vuelta de 360° al dron Air Hive, controlada por el scroll.
 *
 * Los 120 renders de Blender son un giro completo y cerrado, así que el avance
 * del scroll se mapea directo a grados. Cada cuarto de vuelta expone una parte
 * distinta del equipo y sincroniza el texto con lo que se está viendo.
 */

const TOTAL_FRAMES = 120;
const MOBILE_FRAMES = 60; // Un frame sí, uno no: la mitad de bytes, giro igual de fluido.

const CHAPTERS = [
  { key: "vision", accent: "#2A47F6" },
  { key: "flight", accent: "#6443DB" },
  { key: "payload", accent: "#1501A5" },
  { key: "wms", accent: "#2A47F6" },
];

const pad = (n) => String(n).padStart(4, "0");

const DroneShowcase = () => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const angleRef = useRef(null);
  const ringRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const [isMobile, setIsMobile] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /*
   * El grado y el anillo se escriben directo al DOM: pasarlos por estado
   * dispararía un render de React en cada frame de scroll. El capítulo sí es
   * estado, pero solo cambia cuatro veces en toda la sección.
   */
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const clamped = Math.min(Math.max(value, 0), 1);

    if (angleRef.current) {
      angleRef.current.textContent = `${Math.round(clamped * 360)}°`;
    }
    if (ringRef.current && !reduceMotion) {
      ringRef.current.style.transform = `rotate(${clamped * 360}deg)`;
    }

    const next = Math.min(
      CHAPTERS.length - 1,
      Math.floor(clamped * CHAPTERS.length)
    );
    setChapter((current) => (current === next ? current : next));
  });

  const frameCount = isMobile ? MOBILE_FRAMES : TOTAL_FRAMES;

  const srcFor = useCallback(
    (index) =>
      isMobile
        ? `/renders/drone/mobile/${pad(index * 2 + 1)}.webp`
        : `/renders/drone/desktop/${pad(index + 1)}.webp`,
    [isMobile]
  );

  /** Lleva el scroll al centro del capítulo pedido. */
  const goToChapter = useCallback((index) => {
    const section = sectionRef.current;
    if (!section) return;
    const range = section.offsetHeight - window.innerHeight;
    const target =
      section.offsetTop + range * ((index + 0.5) / CHAPTERS.length);
    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

  const active = CHAPTERS[chapter];
  const loading = loaded < 0.98 && !reduceMotion;

  return (
    <section
      ref={sectionRef}
      data-ah-no-reveal
      className="relative h-[400vh] bg-[#162A42] text-white"
      aria-label={t("showcase.title")}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Capas de fondo: la misma gramática visual del hero. */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(21,1,165,0.45),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.35] [background:repeating-linear-gradient(0deg,transparent,transparent_46px,rgba(255,255,255,0.05)_47px),repeating-linear-gradient(90deg,transparent,transparent_46px,rgba(255,255,255,0.05)_47px)]" />

        {/* El halo cambia de color con el capítulo: el alpha del render deja verlo pasar. */}
        <motion.div
          animate={{ backgroundColor: active.accent }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[130px] lg:left-[63%]"
        />

        {/* Plataforma: base elíptica + anillo que gira con el dron. */}
        <div className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 lg:left-[64%]">
          <div className="h-[110px] w-[440px] rounded-[50%] bg-[radial-gradient(ellipse,rgba(42,71,246,0.35),transparent_70%)] blur-xl sm:w-[620px]" />
          <div
            ref={ringRef}
            className="absolute left-1/2 top-1/2 h-[90px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/10 [background:conic-gradient(from_0deg,transparent_0deg,rgba(42,71,246,0.5)_40deg,transparent_90deg)] opacity-60 sm:w-[540px]"
            style={{ willChange: "transform" }}
          />
        </div>

        {/* El padding define el encuadre: el canvas ajusta el render a "contain",
            así que dejar aire abajo evita que el tren de aterrizaje toque el borde
            y libera la franja del indicador. En lg el dron se corre a la derecha
            para dejarle la columna izquierda al texto. */}
        <div className="absolute inset-0 pb-[40vh] pt-[84px] sm:pb-[30vh] lg:translate-x-[14%] lg:pb-[14vh]">
          <ScrollSequence
            progress={scrollYProgress}
            frameCount={frameCount}
            srcFor={srcFor}
            onLoadProgress={setLoaded}
            className="h-full w-full"
          />
        </div>

        {/* Contenido */}
        <div className="ah-container relative flex h-full flex-col justify-between pb-10 pt-[84px]">
          <header className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
              {t("showcase.kicker")}
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]">
              {t("showcase.title")}
            </h2>
          </header>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* Capítulo activo */}
            <div className="relative min-h-[210px] w-full max-w-md sm:min-h-[190px]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active.key}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 bottom-0 rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-8 w-8 shrink-0 rounded-full text-center text-sm font-semibold leading-8"
                      style={{ backgroundColor: active.accent }}
                    >
                      {chapter + 1}
                    </span>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                      {t(`showcase.chapters.${active.key}.kicker`)}
                    </p>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold sm:text-2xl">
                    {t(`showcase.chapters.${active.key}.title`)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {t(`showcase.chapters.${active.key}.text`)}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Indicador de giro + navegación por capítulo */}
            <div className="flex items-center gap-6">
              <div className="flex gap-2">
                {CHAPTERS.map((item, index) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => goToChapter(index)}
                    aria-label={t(`showcase.chapters.${item.key}.title`)}
                    aria-current={index === chapter}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === chapter
                        ? "w-10 bg-white"
                        : "w-5 bg-white/25 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <div className="text-right">
                <span
                  ref={angleRef}
                  className="block font-mono text-2xl font-semibold tabular-nums"
                >
                  0°
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/45">
                  {t("showcase.rotation")}
                </span>
              </div>

              <Link
                to="/products"
                className="hidden items-center gap-2 rounded-full bg-[#2A47F6] px-6 py-3 text-sm font-semibold shadow-[0_8px_24px_rgba(42,71,246,0.4)] transition duration-500 hover:bg-[#3d5aff] sm:inline-flex"
              >
                {t("showcase.cta")}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Pista de scroll: solo al principio. */}
        <AnimatePresence>
          {chapter === 0 && !reduceMotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-white/45"
            >
              <MousePointer2 size={13} />
              {t("showcase.hint")}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Precarga: barra fina arriba, sin bloquear nada. */}
        <AnimatePresence>
          {loading && (
            <motion.div
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 top-0 h-0.5 bg-white/10"
            >
              <div
                className="h-full bg-[#2A47F6] transition-[width] duration-300"
                style={{ width: `${Math.round(loaded * 100)}%` }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DroneShowcase;
