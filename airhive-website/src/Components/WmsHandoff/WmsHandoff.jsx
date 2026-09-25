import { useCallback, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { useTranslation } from "react-i18next";

/**
 * Lo que pasa después del fotograma 240: el vuelo terminó y los datos ya están
 * en el WMS.
 *
 * Tres decisiones que van juntas y se explican entre sí:
 *
 * 1. La captura no arranca en el borde superior, sino por debajo del header.
 *    Antes se metía debajo y el header tapaba la barra de navegación del propio
 *    sistema, que es información que vale la pena ver.
 * 2. Al quedar esa franja libre, la sección se pinta clara en vez de oscura.
 * 3. Con fondo claro el header necesita texto azul; data-nav-light se lo dice,
 *    y él solo se encarga.
 *
 * Las tarjetas van en la zona gris de abajo, que es suelo del render 3D y no
 * tapa ningún dato. Una a la vez: entra, se lee, sale y llega la siguiente.
 */

const PASOS = ["ingesta", "contraste", "cobertura", "evidencia"];

/* Tramo de entrada antes de la primera tarjeta y de salida tras la última, para
   que ninguna aparezca ni desaparezca pegada al borde de la sección. */
const ENTRADA = 0.12;
const SALIDA = 0.12;

const WmsHandoff = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [paso, setPaso] = useState(-1);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const actualizar = useCallback((v) => {
    const util = (v - ENTRADA) / (1 - ENTRADA - SALIDA);
    const i = util < 0 ? -1 : Math.min(PASOS.length - 1, Math.floor(util * PASOS.length));
    setPaso((prev) => (prev === i ? prev : i));
  }, []);

  useMotionValueEvent(scrollYProgress, "change", actualizar);
  const activo = reduceMotion ? 0 : paso;

  return (
    <section
      ref={sectionRef}
      data-ah-no-reveal
      data-nav-light
      className="relative h-[360vh] bg-[#eceff3]"
      aria-label={t("wms.title")}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* La captura, desde justo debajo del header hasta abajo */}
        <div
          className="absolute inset-x-0 bottom-0 top-14 bg-[url('/wms-panel.webp')] bg-cover bg-top"
          aria-label={t("wms.title")}
          role="img"
        />

        {/* Tarjetas sobre el suelo gris, que es la zona sin datos */}
        <div className="ah-container pointer-events-none absolute inset-x-0 bottom-[7vh]">
          <div className="relative h-[13.5rem] w-full max-w-sm">
            <AnimatePresence mode="wait">
              {activo >= 0 && (
                <motion.article
                  key={PASOS[activo]}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-x-0 bottom-0 rounded-2xl border border-[#162A42]/10 bg-white p-6 shadow-[0_18px_44px_rgba(9,16,26,0.16)]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-[#2A47F6]">
                      {String(activo + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#162A42]/55">
                      {t(`wms.steps.${PASOS[activo]}.kicker`)}
                    </p>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold leading-snug text-[#162A42]">
                    {t(`wms.steps.${PASOS[activo]}.title`)}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#202020]/70">
                    {t(`wms.steps.${PASOS[activo]}.text`)}
                  </p>

                  <div className="mt-5 flex gap-1.5">
                    {PASOS.map((p, i) => (
                      <span
                        key={p}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          i === activo ? "w-6 bg-[#2A47F6]" : "w-2.5 bg-[#162A42]/15"
                        }`}
                      />
                    ))}
                  </div>
                </motion.article>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WmsHandoff;
