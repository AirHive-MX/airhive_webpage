import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import DRONE_TRACK from "./droneTrack";

/**
 * Recorrido del dron Air Hive controlado por el scroll.
 *
 * Los 240 renders no son solo un giro: el dron da una vuelta de 360°, enciende
 * motores de frente, baja a una ubicación y vuelve a subir. Como se desplaza en
 * horizontal y en vertical, la interfaz no puede quedarse fija en una esquina.
 *
 * droneTrack.js trae la posición exacta del dron en cada fotograma (medida del
 * canal alpha de los propios renders), y con eso:
 * - la retícula lo sigue cuadro por cuadro,
 * - el panel de texto se coloca solo del lado contrario,
 * - la línea guía une los dos.
 *
 * Nada de eso está a mano: si cambia la animación se regenera droneTrack.js y
 * el encuadre se reacomoda solo.
 */

const TOTAL_FRAMES = 240;

/**
 * El almacén entra cuando el dron deja de girar y se pone a escanear: antes es
 * una pieza de hardware sobre fondo neutro, a partir de aquí está trabajando.
 */
const SCENE_FROM = 120; // fotograma en que empieza a aparecer el almacén
const SCENE_FADE = 18; // fotogramas que tarda en asentar

/**
 * La ciudad se va ANTES de que entre el almacén, no a la vez. Cruzándolas se
 * ven las dos fotos superpuestas a media opacidad y parece doble exposición;
 * así, entre una y otra queda un instante del fondo oscuro de la sección, que
 * se lee como corte y no como mezcla.
 */
const CITY_FADE = 18; // fotogramas que tarda en irse, terminando en SCENE_FROM

/**
 * Encuadre del fondo, sacado a fuerza bruta y no a ojo.
 *
 * La foto tiene cajas en las franjas 0.125-0.325, 0.425-0.650 y 0.725-0.925 de
 * su altura; el resto son vigas. El dron descansa a 0.502 del render mientras
 * gira y a 0.736 mientras escanea. Se probaron todas las combinaciones de
 * tamaño y posición sobre siete resoluciones, buscando la que deja esos dos
 * reposos (y medio cuerpo del dron alrededor) lo más lejos posible de una viga.
 *
 * SCENE_ZOOM se dejó fijo en 160% por escala, no por alineación: subiéndolo
 * mejora el margen pero las cajas acaban del doble del dron. A 160% una caja y
 * el dron miden parecido, que es la proporción creíble.
 *
 * Es aproximado, no exacto: durante el descenso del acto 3 el dron sí cruza una
 * viga. En las dos posiciones donde uno se detiene a leer, no.
 */
/* La ciudad acompaña el giro; el almacén entra cuando empieza el escaneo. Se
   cruzan en la misma ventana de fotogramas, así que es un solo fundido. */
const SCENE_ZOOM = "120%";
const SCENE_POS = "100%";

/**
 * El dron se dibuja un 28% más grande que el escenario, para que domine sobre
 * la mercancía. 1.28 es el tope: por encima, en su punto más bajo se sale por
 * abajo de la pantalla en las resoluciones cortas.
 */
const DRONE_SCALE = 1.28;
const MOBILE_FRAMES = 120; // Un fotograma de cada dos: la mitad de bytes en móvil.

/**
 * Capítulos alineados a la coreografía real, no repartidos en cuartos iguales.
 * `until` es el fotograma donde termina cada uno.
 */
const CHAPTERS = [
  { key: "inspection", until: 120, accent: "#2A47F6", readout: "degrees" },
  { key: "armed", until: 178, accent: "#6443DB", readout: "path" },
  { key: "position", until: 214, accent: "#4F8BFF", readout: "path" },
  { key: "route", until: 240, accent: "#2A47F6", readout: "path" },
];

const chapterAt = (frame) => {
  const index = CHAPTERS.findIndex((chapter) => frame < chapter.until);
  return index === -1 ? CHAPTERS.length - 1 : index;
};

const pad = (n) => String(n).padStart(4, "0");
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const centerOf = ([l, t, r, b]) => [(l + r) / 2, (t + b) / 2];

/**
 * Lado en que vive el panel durante cada capítulo: el contrario al que ocupa el
 * dron en promedio. Se decide por capítulo y no cuadro a cuadro para que el
 * salto coincida con el cambio de texto, en vez de brincar a media maniobra.
 */
const CHAPTER_SIDES = CHAPTERS.map((chapter, index) => {
  const from = index === 0 ? 0 : CHAPTERS[index - 1].until;
  const frames = DRONE_TRACK.slice(from, chapter.until);
  const avg = frames.reduce((sum, box) => sum + centerOf(box)[0], 0) / frames.length;
  return avg > 0.5 ? "left" : "right";
});

/** Trayectoria del vuelo (del fotograma 120 en adelante) para el minimapa. */
const FLIGHT_POINTS = DRONE_TRACK.slice(120).map(centerOf);
const FLIGHT_PATH = FLIGHT_POINTS.map(([x, y]) => `${x.toFixed(4)},${y.toFixed(4)}`).join(" ");

/** viewBox ajustado al recorrido real: si no, el trazo queda perdido en una esquina. */
const FLIGHT_VIEWBOX = (() => {
  const xs = FLIGHT_POINTS.map(([x]) => x);
  const ys = FLIGHT_POINTS.map(([, y]) => y);
  const pad = 0.04;
  const x0 = Math.min(...xs) - pad;
  const y0 = Math.min(...ys) - pad;
  return `${x0} ${y0} ${Math.max(...xs) + pad - x0} ${Math.max(...ys) + pad - y0}`;
})();

const DroneShowcase = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const fieldRef = useRef(null); // el canvas ampliado, mayor que el escenario
  const reticleRef = useRef(null);
  const leaderRef = useRef(null);
  const angleRef = useRef(null);
  const pathDotRef = useRef(null);
  const sceneRef = useRef(null);
  const cityRef = useRef(null);

  const layoutRef = useRef(null); // dónde queda dibujado el render dentro del canvas
  // Altura a la que reposa el dron, en píxeles del viewport. La caída de luz del
  // fondo se centra ahí, así que hace falta en el render y por eso vive en estado.
  const [horizonte, setHorizonte] = useState(0);
  const panelRef = useRef(null);
  const sideRef = useRef(CHAPTER_SIDES[0]);
  const stackedRef = useRef(false); // en móvil el panel va abajo, sin seguimiento
  const [isMobile, setIsMobile] = useState(false);
  const [chapter, setChapter] = useState(0);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      stackedRef.current = query.matches;
      setIsMobile(query.matches);
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /**
   * Pone retícula y línea guía sobre el dron del fotograma pedido. Escribe
   * directo al DOM: por estado sería un render de React por fotograma.
   */
  const placeOverlay = useCallback((frame, panelSide) => {
    const layout = layoutRef.current;
    const stage = stageRef.current;
    const field = fieldRef.current;
    if (!layout || !stage || !field) return;
    // El canvas es más grande que el escenario y está centrado en él: lo que se
    // dibuja dentro del canvas hay que correrlo por esa diferencia para
    // colocarlo en coordenadas del escenario.
    const desfase = (stage.clientHeight - field.clientHeight) / 2;

    const [l, top, r, bottom] = DRONE_TRACK[frame] ?? DRONE_TRACK[0];
    const x = layout.x + l * layout.width;
    const y = layout.y + top * layout.height;
    const w = (r - l) * layout.width;
    const h = (bottom - top) * layout.height;

    const reticle = reticleRef.current;
    if (reticle) {
      reticle.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      reticle.style.width = `${w}px`;
      reticle.style.height = `${h}px`;
    }

    const leader = leaderRef.current;
    if (leader) {
      // De la orilla de la retícula al borde del escenario donde vive el panel.
      const fromX = panelSide === "right" ? x + w : x;
      const toX = panelSide === "right" ? field.clientWidth : 0;
      leader.setAttribute("x1", fromX);
      leader.setAttribute("y1", y + h / 2);
      leader.setAttribute("x2", toX);
      leader.setAttribute("y2", y + h / 2);
    }

    // El panel acompaña al dron en vertical, sin salirse del escenario. En
    // móvil vive anclado abajo: moverlo ahí solo lo sacaría de cuadro.
    const panel = panelRef.current;
    if (panel) {
      if (stackedRef.current) {
        panel.style.transform = "";
      } else {
        const max = stage.clientHeight - panel.offsetHeight;
        const centro = desfase + y + h / 2 - panel.offsetHeight / 2;
        const top = Math.min(Math.max(centro, 0), Math.max(max, 0));
        panel.style.transform = `translate3d(0, ${top}px, 0)`;
      }
    }
  }, []);

  /** Punto del minimapa. Vive en el mismo 0..1 del viewBox. */
  const placeDot = useCallback((cx, cy) => {
    if (!pathDotRef.current) return;
    pathDotRef.current.setAttribute("cx", cx.toFixed(4));
    pathDotRef.current.setAttribute("cy", cy.toFixed(4));
  }, []);

  const frameFromProgress = useCallback(
    (value) => Math.min(TOTAL_FRAMES - 1, Math.floor(clamp01(value) * TOTAL_FRAMES)),
    []
  );

  const handleLayout = useCallback(
    (layout) => {
      layoutRef.current = layout;
      const stage = stageRef.current;
      const field = fieldRef.current;
      if (stage && field) {
        const desfase = (stage.clientHeight - field.clientHeight) / 2;
        const y = (stage.offsetTop ?? 84) + desfase + layout.y + 0.502 * layout.height;
        setHorizonte((prev) => (Math.abs(prev - y) < 0.5 ? prev : y));
      }
      placeOverlay(frameFromProgress(scrollYProgress.get()), sideRef.current);
    },
    [frameFromProgress, placeOverlay, scrollYProgress]
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const frame = frameFromProgress(value);
    const [cx, cy] = centerOf(DRONE_TRACK[frame] ?? DRONE_TRACK[0]);
    const next = chapterAt(frame);

    sideRef.current = CHAPTER_SIDES[next];
    placeOverlay(frame, sideRef.current);

    if (angleRef.current) {
      // La vuelta completa se consume en los primeros 120 fotogramas.
      angleRef.current.textContent = `${Math.round(Math.min(frame / 120, 1) * 360)}°`;
    }
    placeDot(cx, cy);

    const entrada = clamp01((frame - SCENE_FROM) / SCENE_FADE);
    if (sceneRef.current) sceneRef.current.style.opacity = entrada.toFixed(3);
    if (cityRef.current) {
      cityRef.current.style.opacity = clamp01((SCENE_FROM - frame) / CITY_FADE).toFixed(3);
    }

    setChapter((current) => (current === next ? current : next));
  });

  useEffect(() => {
    const frame = frameFromProgress(scrollYProgress.get());
    const [cx, cy] = centerOf(DRONE_TRACK[frame] ?? DRONE_TRACK[0]);
    placeDot(cx, cy);

    const entrada = clamp01((frame - SCENE_FROM) / SCENE_FADE);
    if (sceneRef.current) sceneRef.current.style.opacity = entrada.toFixed(3);
    if (cityRef.current) {
      cityRef.current.style.opacity = clamp01((SCENE_FROM - frame) / CITY_FADE).toFixed(3);
    }
    placeOverlay(frame, sideRef.current);
  }, [chapter, frameFromProgress, placeDot, placeOverlay, scrollYProgress]);

  const frameCount = isMobile ? MOBILE_FRAMES : TOTAL_FRAMES;

  const srcFor = useCallback(
    (index) =>
      isMobile
        ? `/renders/drone/mobile/${pad(index * 2 + 1)}.webp`
        : `/renders/drone/desktop/${pad(index + 1)}.webp`,
    [isMobile]
  );

  /** Lleva el scroll al arranque del capítulo pedido. */
  const goToChapter = useCallback((index) => {
    const section = sectionRef.current;
    if (!section) return;
    const from = index === 0 ? 0 : CHAPTERS[index - 1].until;
    const range = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: section.offsetTop + range * ((from + 4) / TOTAL_FRAMES),
      behavior: "smooth",
    });
  }, []);

  const active = CHAPTERS[chapter];
  const loading = loaded < 0.98 && !reduceMotion;
  const panelSide = isMobile ? "bottom" : CHAPTER_SIDES[chapter];

  const panelClasses = useMemo(() => {
    if (panelSide === "bottom") return "inset-x-6 bottom-0";
    const edge = panelSide === "right" ? "right-6 lg:right-[5%]" : "left-6 lg:left-[5%]";
    return `top-0 w-[min(22rem,calc(100%-3rem))] ${edge}`;
  }, [panelSide]);

  return (
    <section
      ref={sectionRef}
      data-ah-no-reveal
      className="relative h-[500vh] bg-[#162A42] text-white"
      aria-label={t("showcase.title")}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* La ciudad, durante el giro. Lleva su propio degradado vertical: el
            cielo es la parte más clara de la foto y es justo donde caen el
            kicker y el titular, que van en blanco. */}
        <div ref={cityRef} aria-hidden="true" className="absolute inset-0" style={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-[url('/fondo-ciudad.webp')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,17,28,0.78)_0%,rgba(10,17,28,0.34)_34%,rgba(10,17,28,0.24)_62%,rgba(10,17,28,0.58)_100%)]" />
        </div>

        {/* El almacén, durante el escaneo. Entra según se va la ciudad. */}
        <div ref={sceneRef} aria-hidden="true" className="absolute inset-0" style={{ opacity: 0 }}>
          <div
            className="absolute inset-0 bg-[url('/fondo-racks.webp')] bg-repeat-x"
            style={{ backgroundSize: `auto ${SCENE_ZOOM}`, backgroundPosition: `center ${SCENE_POS}` }}
          />
        </div>

        {/* Aquí vivían un degradado índigo y un halo del color del capítulo.
            Sobre fondo liso funcionaban, pero encima de una foto se leen como
            una mancha azul en el centro. El acento del capítulo se sigue viendo
            donde toca: retícula, línea guía, número del panel y minimapa. */}

        {/* Caída detrás del dron y viñeta: comunes a las dos fotos, porque el
            chasis es blanco y se pierde igual sobre el cartón que sobre el
            cielo. Localizadas, para no apagar la imagen entera. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 48% 40% at 50% ${horizonte}px, rgba(5,9,15,0.58) 0%, rgba(5,9,15,0.24) 46%, transparent 72%)`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_46%,rgba(7,12,20,0.6)_100%)]" />

        <div className="absolute inset-0 opacity-[0.35] [background:repeating-linear-gradient(0deg,transparent,transparent_46px,rgba(255,255,255,0.05)_47px),repeating-linear-gradient(90deg,transparent,transparent_46px,rgba(255,255,255,0.05)_47px)]" />

        {/* Encabezado. Va antes del escenario para que el h1 quede por delante
            del h3 del panel en el orden del documento; el z-10 conserva el
            apilamiento que tenía cuando estaba después. */}
        <div
          className={`ah-container pointer-events-none relative z-10 pt-[84px] transition-opacity duration-700 ${
            chapter === 0 ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
            {t("showcase.kicker")}
          </p>
          <h1 className="mt-3 max-w-lg text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]">
            {t("showcase.title")}
          </h1>
        </div>

        {/* Escenario: el canvas y todo lo que se le monta encima comparten el
            mismo sistema de coordenadas. */}
        <div
          ref={stageRef}
          className="absolute inset-x-0 bottom-[30vh] top-[84px] sm:bottom-[24vh] lg:bottom-[16vh]"
        >
          {/* El canvas va más grande que el escenario y centrado en él, para
              que el dron gane presencia frente a la mercancía. La retícula y la
              línea guía viven aquí dentro, en el mismo sistema de coordenadas
              que el render; el panel se queda fuera, atado al viewport. */}
          <div
            ref={fieldRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: `${DRONE_SCALE * 100}%`, height: `${DRONE_SCALE * 100}%` }}
          >
            <ScrollSequence
              progress={scrollYProgress}
              frameCount={frameCount}
              srcFor={srcFor}
              onLoadProgress={setLoaded}
              onLayout={handleLayout}
              className="h-full w-full"
            />

            {!reduceMotion && (
              <>
                <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                  <line
                    ref={leaderRef}
                    stroke={active.accent}
                    strokeWidth="1"
                    strokeDasharray="3 5"
                    opacity="0.6"
                    className="transition-[stroke] duration-700"
                  />
                </svg>

                {/* Retícula: cuatro esquinas que encuadran al dron. */}
                <div
                  ref={reticleRef}
                  className="pointer-events-none absolute left-0 top-0 opacity-90"
                  style={{ willChange: "transform, width, height" }}
                >
                  {[
                    "left-0 top-0 border-l border-t",
                    "right-0 top-0 border-r border-t",
                    "left-0 bottom-0 border-l border-b",
                    "right-0 bottom-0 border-r border-b",
                  ].map((corner) => (
                    <span
                      key={corner}
                      className={`absolute h-5 w-5 transition-[border-color] duration-700 ${corner}`}
                      style={{ borderColor: active.accent }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Panel de texto: cambia de cuadrante según dónde esté el dron. */}
          <div
            ref={panelRef}
            className={`absolute ${panelClasses}`}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={active.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/10 bg-[#162A42]/70 p-6 backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-xs font-semibold transition-colors duration-700"
                    style={{ color: active.accent }}
                  >
                    {pad(chapter + 1).slice(2)}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                    {t(`showcase.chapters.${active.key}.kicker`)}
                  </p>
                </div>
                <h3 className="mt-3 text-xl font-semibold sm:text-2xl">
                  {t(`showcase.chapters.${active.key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {t(`showcase.chapters.${active.key}.text`)}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Barra inferior: capítulos, lectura y salida */}
        <div className="ah-container absolute inset-x-0 bottom-8 z-10 flex items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {CHAPTERS.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => goToChapter(index)}
                  aria-label={t(`showcase.chapters.${item.key}.title`)}
                  aria-current={index === chapter}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === chapter ? "w-10 bg-white" : "w-5 bg-white/25 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-white/45">
              {t(`showcase.chapters.${active.key}.phase`)}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Una ranura, dos lecturas: grados mientras gira, trayectoria real
                cuando se desplaza. */}
            <div className="hidden text-right sm:block">
              {active.readout === "degrees" ? (
                <>
                  <span
                    ref={angleRef}
                    className="block font-mono text-2xl font-semibold tabular-nums"
                  >
                    0°
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/45">
                    {t("showcase.rotation")}
                  </span>
                </>
              ) : (
                <>
                  <svg viewBox={FLIGHT_VIEWBOX} className="ml-auto h-12 w-20" aria-hidden="true">
                    <polyline
                      points={FLIGHT_PATH}
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle ref={pathDotRef} r="0.022" fill={active.accent} />
                  </svg>
                  <span className="text-[0.65rem] uppercase tracking-[0.2em] text-white/45">
                    {t("showcase.trajectory")}
                  </span>
                </>
              )}
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

        <AnimatePresence>
          {chapter === 0 && !reduceMotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[0.7rem] uppercase tracking-[0.2em] text-white/45"
            >
              <MousePointer2 size={13} />
              {t("showcase.hint")}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && (
            <motion.div exit={{ opacity: 0 }} className="absolute inset-x-0 top-0 h-0.5 bg-white/10">
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
