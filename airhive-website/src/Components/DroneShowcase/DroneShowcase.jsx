import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, MousePointer2 } from "lucide-react";
import ScrollSequence from "../ScrollSequence/ScrollSequence";
import DRONE_TRACK from "./droneTrack";
import { TarjetaConteo, TarjetaLecturas } from "./WmsCards";

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

const TOTAL_FRAMES = 360;

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
 * Al llegar los fotogramas 241-360 apareció una tercera posición de reposo, y
 * con el encuadre anterior el dron pasaba esos 120 fotogramas delante de una
 * viga. Se rehizo la búsqueda sobre los 360, pidiendo esta vez que el centro
 * del dron caiga en cajas en el mayor número de fotogramas posible y no solo en
 * los reposos: con 120% y posición 33% se cumple en los 360, en las siete
 * resoluciones. El rango válido va de 29.4% a 36.9%; se toma el centro.
 */
/* La ciudad acompaña el giro; el almacén entra cuando empieza el escaneo. Se
   cruzan en la misma ventana de fotogramas, así que es un solo fundido. */
/**
 * El botón de salida del recorrido, oculto por ahora.
 *
 * Es ocultar, no quitar: la ruta /products sigue registrada y la página
 * intacta. Para devolverlo, poner esto en true.
 */
const MOSTRAR_CTA = false;

/**
 * Superficie común de los globos de texto: los cuatro de los actos y los dos
 * del epílogo. Vive en una constante para que no se separen con el tiempo.
 *
 * Antes era el cristal esmerilado de siempre: muy translúcido, esquinas muy
 * redondas y un borde de 1px dando la vuelta entera. Sobre el cartón del fondo
 * el texto se lavaba y el conjunto se leía blando. Ahora el fondo es casi
 * opaco (90%) y bastante más oscuro que el azul de marca, para que el blanco
 * tenga contra qué apoyarse; el borde se cambió por un ring interior al 7%,
 * que marca el canto sin dibujar una caja; el radio baja de 16 a 14 px, que a
 * este tamaño se lee construido y no burbuja; y la sombra es larga y muy
 * difusa, para que el globo se despegue de la foto sin mancharla.
 *
 * El color no va en el fondo ni en el borde: va en un filo de 3px a la
 * izquierda. Es lo único que cambia de un acto a otro y basta para
 * identificarlo, sin teñir el texto ni encerrarlo.
 */
const GLOBO =
  "relative overflow-hidden rounded-[14px] shadow-[0_26px_70px_-28px_rgba(0,0,0,0.85)] ring-1 backdrop-blur-xl transition-colors duration-700";

/**
 * La superficie cambia con el fondo que hay detrás.
 *
 * Medida sobre las propias fotos: la ciudad promedia un gris frío (#697173) y
 * el almacén un cálido (#836E60), porque es cartón. El azul muy oscuro se
 * apoya bien en el primero, pero sobre el segundo se lee como un recorte de
 * la escena anterior pegado encima: es el color complementario justo del
 * fondo. Del acto 2 en adelante la superficie pasa a un grafito cálido, que
 * es lo que se pone en impresión sobre una imagen cálida. Sigue siendo casi
 * negro, pero pertenece a la foto en vez de discutir con ella.
 *
 * El cambio cae en el fotograma 120, que es donde entra el almacén y donde el
 * panel cambia de texto de todas formas: se releva junto con el contenido, no
 * como un recoloreado a media frase.
 */
const SUPERFICIE = {
  ciudad: "bg-[#0A1322]/90 ring-white/[0.07]",
  almacen: "bg-[#17130F]/92 ring-white/[0.10]",
};

/** Los globos del epílogo no pertenecen a ningún acto: llevan el azul de marca. */
const ACENTO_EPILOGO = "#2A47F6";

/**
 * Lo que la pantalla de carga espera antes de retirarse.
 *
 * No basta el primer fotograma: se iría al instante y el porcentaje saltaría de
 * 0 a 100. Y esperar los 240 serían 8.4 MB. El punto medio es la primera pasada
 * del precargador (un fotograma de cada 16, que cubre el giro entero) más la
 * foto de la ciudad: al levantarse ya se puede hacer scroll sin tirones.
 *
 * Los pesos son proporcionales a lo que ocupa cada parte, para que el número
 * suba parejo en vez de a saltos.
 */
const CARGA_FRAMES = 15;
const CARGA_PESO_FRAMES = 0.67; // ~540 KB
const CARGA_PESO_CIUDAD = 0.33; // ~260 KB

const SCENE_ZOOM = "120%";
const SCENE_POS = "33%";

/**
 * El dron se dibuja un 28% más grande que el escenario, para que domine sobre
 * la mercancía. 1.28 es el tope: por encima, en su punto más bajo se sale por
 * abajo de la pantalla en las resoluciones cortas.
 */
const DRONE_SCALE = 1.28;
const MOBILE_FRAMES = 180; // Un fotograma de cada dos: la mitad de bytes en móvil.

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
 * Alto de la sección. Es el mando del ritmo general: todo el recorrido se
 * consume entre que su borde superior toca el alto de la pantalla y que lo
 * toca su borde inferior, o sea en ALTO_VH - 100 pantallas de scroll.
 */
const ALTO_VH = 1700;

/**
 * Ritmo del recorrido: cuánto scroll cuesta cada tramo.
 *
 * Con el reparto lineal anterior, cada muesca de rueda se llevaba siete u ocho
 * fotogramas y los momentos que hay que mirar pasaban antes de que diera
 * tiempo a frenar. Aquí cada tramo declara lo que pesa respecto a los demás:
 * peso 1 es el paso normal y todo lo que sube de ahí es "aquí hay que poder
 * detenerse". Los pesos son relativos, así que tocar uno no descuadra el
 * resto: solo le quita o le da sitio dentro del mismo alto total.
 *
 * `hasta` es el fotograma donde termina el tramo.
 */
const RITMO = [
  { hasta: 12, peso: 1.8 }, // el titular, antes de que empiece a girar
  { hasta: 108, peso: 1.0 }, // la vuelta de 360°
  { hasta: 132, peso: 1.7 }, // se va la ciudad y entra el almacén
  /*
   * Los actos 2, 3 y 4 duran 58, 36 y 26 fotogramas contra los 120 del
   * primero, y cada uno trae un texto distinto en el panel. Repartiendo el
   * scroll a peso parejo, el acto 4 se despachaba en seis muescas de rueda:
   * el texto aparecía y se iba sin que diera tiempo a leerlo. El peso sube
   * según el acto se acorta, para que los tres duren más o menos lo mismo en
   * scroll aunque no duren lo mismo en fotogramas. No hay descanso aparte al
   * principio de cada uno: el acto entero es el descanso.
   */
  { hasta: 178, peso: 2.2 }, // acto 2 · despegue
  { hasta: 214, peso: 2.8 }, // acto 3 · conteo
  { hasta: 240, peso: 3.4 }, // acto 4 · ruta
  { hasta: 248, peso: 1.0 },
  { hasta: 276, peso: 2.4 }, // entra la tarjeta del conteo: hay que leerla
  { hasta: 308, peso: 1.0 },
  { hasta: 336, peso: 2.4 }, // entra la tarjeta de lecturas: hay que leerla
  { hasta: TOTAL_FRAMES, peso: 1.1 },
];

/** Tramos con su coste acumulado, para poder ir del scroll al fotograma. */
const RITMO_TRAMOS = (() => {
  const tramos = [];
  let desde = 0;
  let acumulado = 0;
  for (const { hasta, peso } of RITMO) {
    const coste = (hasta - desde) * peso;
    tramos.push({ desde, hasta, antes: acumulado, coste });
    acumulado += coste;
    desde = hasta;
  }
  return { tramos, total: acumulado };
})();

/**
 * Scroll 0..1 -> avance del recorrido 0..1.
 *
 * Es la inversa del reparto de arriba: se busca en qué tramo cae el coste
 * consumido y se interpola dentro de él. Sale una curva continua, sin saltos
 * en las costuras, porque los extremos de cada tramo coinciden por
 * construcción con los del siguiente.
 */
const avanceDelScroll = (p) => {
  const coste = clamp01(p) * RITMO_TRAMOS.total;
  const { tramos } = RITMO_TRAMOS;
  for (let i = 0; i < tramos.length; i += 1) {
    const tr = tramos[i];
    if (coste <= tr.antes + tr.coste || i === tramos.length - 1) {
      const dentro = tr.coste > 0 ? clamp01((coste - tr.antes) / tr.coste) : 0;
      return (tr.desde + dentro * (tr.hasta - tr.desde)) / TOTAL_FRAMES;
    }
  }
  return 1;
};

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

/**
 * A partir de aquí el recorrido continúa pero todavía no tiene texto asignado.
 * Se ocultan el panel, su línea guía y el rótulo del acto: dejarlos mostraría
 * el último acto durante 120 fotogramas en los que ya no está pasando eso.
 */
const EPILOGO_FROM = 240;

/**
 * Los dos paneles del WMS, repartidos por el epílogo. El orden es indistinto:
 * son dos vistas del mismo vuelo, no una secuencia. Se sostiene cada una la
 * mitad del tramo para que dé tiempo a leerlas.
 */
/*
 * `nota` es el globo de arriba a la derecha: qué es lo que se está viendo. Va
 * suelto del componente de la tarjeta a propósito, porque no es parte de la
 * interfaz del WMS sino de la web que la enseña.
 *
 * Son pasos y no un párrafo. En prosa las tres ideas se leían amontonadas y
 * había que desenredarlas; numeradas y separadas por un filete se ve de un
 * vistazo que son tres cosas y en qué orden pasan. Tampoco llevan título: el
 * nombre ya está en la tarjeta de al lado, a cuerpo grande, y repetirlo era
 * ruido.
 */
const EPILOGO_TARJETAS = [
  {
    desde: 248,
    Componente: TarjetaConteo,
    nota: {
      pasos: [
        "Cada vuelo recuenta unos racks, no el almacén entero.",
        "La ronda va rotando por las zonas hasta cubrirlo todo.",
        "Nunca hay que parar la operación ni cerrar por conteo anual.",
      ],
    },
  },
  {
    desde: 308,
    Componente: TarjetaLecturas,
    nota: {
      pasos: [
        "El dron lee etiqueta, código y foto en cada ubicación.",
        "Cada lectura se compara contra lo que dice el WMS.",
        "Lo que no cuadra queda marcado para revisar.",
      ],
    },
  },
];

/**
 * Los globos no entran y salen en el sitio: suben como los créditos de una
 * película. Cada uno asoma por abajo del escenario, lo cruza entero mientras
 * se hace scroll y se va por arriba, sin pararse.
 *
 * De ahí que estén todos montados a la vez y que lo único que cambie sea su
 * transform: no hay AnimatePresence ni montaje y desmontaje, porque un globo
 * ya no "aparece", está siempre y lo que cambia es dónde. El recorrido se
 * calcula del fotograma, no del tiempo, así que si se para el scroll el globo
 * se queda clavado donde estaba y si se sube, baja.
 *
 * `desde` y `hasta` son el tramo de fotogramas en que cada uno cruza. Los de
 * los actos se pegan al siguiente a propósito: uno se va por arriba justo
 * cuando el siguiente asoma por abajo, que es como se encadenan los créditos.
 */
const GLOBOS = [
  ...CHAPTERS.map((chapter, index) => ({
    key: `acto-${index}`,
    tipo: "acto",
    indice: index,
    desde: index === 0 ? 0 : CHAPTERS[index - 1].until,
    hasta: chapter.until,
  })),
  /*
   * En el epílogo la tarjeta y su nota van en paralelo, una a cada lado. En
   * móvil no hay dos lados: todo cae en el mismo carril, así que ahí pasan una
   * detrás de otra. `movil` es ese segundo reparto; los globos que no lo
   * declaran usan el mismo tramo en las dos.
   */
  { key: "wms-0", tipo: "tarjeta", indice: 0, desde: 244, hasta: 306, movil: [244, 282] },
  { key: "nota-0", tipo: "nota", indice: 0, desde: 250, hasta: 306, movil: [282, 306] },
  { key: "wms-1", tipo: "tarjeta", indice: 1, desde: 306, hasta: TOTAL_FRAMES, movil: [306, 338] },
  { key: "nota-1", tipo: "nota", indice: 1, desde: 312, hasta: TOTAL_FRAMES, movil: [338, TOTAL_FRAMES] },
];

/** Tramo de un globo, que no es el mismo en escritorio que en móvil. */
const tramoDe = (globo, enMovil) =>
  enMovil && globo.movil ? globo.movil : [globo.desde, globo.hasta];

/** Aire de más allá de los bordes, para que ninguno asome a medias. */
const MARGEN_CREDITO = 32;

/**
 * Fotograma en que el titular de portada se va, en móvil.
 *
 * En escritorio dura todo el acto 1 y no estorba: el globo vive en la columna
 * de la derecha y el titular en la izquierda. En móvil comparten la única
 * columna que hay, y el primer globo le subía por encima. Aquí se retira justo
 * antes de que asome, que además es lo que hace que el globo se lea como lo que
 * viene después y no como algo encimado.
 */
const TITULO_HASTA_MOVIL = 14;

/**
 * Parte del recorrido que se usa para entrar y para salir. Los créditos de
 * verdad no se funden, pero aquí el escenario no tiene un borde duro: arriba
 * está la barra de navegación, transparente, y abajo la de los actos. Sin este
 * fundido los globos se cortarían a mitad de palabra contra nada.
 */
const FUNDIDO = 0.12;

/**
 * Parte del recorrido que el globo pasa completamente quieto en el centro.
 *
 * Antes solo frenaba, y frenar no obliga a leer: el ojo sigue al que se mueve.
 * Ahora cada globo sube, se planta en mitad de la pantalla y ahí se queda
 * mientras se sigue haciendo scroll, hasta que ha consumido su cupo; recién
 * entonces se va por arriba. El dron no se entera: la secuencia va por
 * `avance` y esta curva solo gobierna a los globos, así que durante la parada
 * el vuelo continúa detrás.
 *
 * 0.34 son entre 6 y 9 muescas de rueda según el globo. Suficiente para leer
 * tres líneas sin que llegue a sentirse atascado.
 */
const PAUSA = 0.34;

/**
 * Scroll dentro del tramo -> posición en el trayecto, los dos de 0 a 1.
 *
 * Las dos mitades que sí se mueven llevan su propia curva para que la parada
 * no se note como un frenazo: la de subida llega al centro con velocidad cero
 * y la de salida arranca desde cero. En las costuras de la pausa, entonces,
 * la velocidad es cero por los dos lados y no hay tirón; el acelerón queda en
 * los extremos, que es donde el globo está fuera de pantalla o fundiéndose.
 */
const recorrido = (p) => {
  const tramo = (1 - PAUSA) / 2;
  if (p <= tramo) {
    const x = p / tramo;
    return 0.5 * (1 - (1 - x) * (1 - x)); // llega al centro y se detiene
  }
  if (p < tramo + PAUSA) return 0.5; // quieto en mitad de la pantalla
  const x = (p - tramo - PAUSA) / tramo;
  return 0.5 + 0.5 * x * x; // arranca desde parado y se va
};

/** Dónde cruza cada globo: el carril es fijo, solo cambia la altura. */
const carrilDe = (globo, enMovil) => {
  if (enMovil) return "inset-x-6";  // un solo carril: no hay sitio para dos
  if (globo.tipo === "tarjeta") return "left-6 lg:left-[5%]";
  if (globo.tipo === "nota") return "right-6 w-[17rem] lg:right-[5%]";
  const lado = CHAPTER_SIDES[globo.indice] === "right" ? "right-6 lg:right-[5%]" : "left-6 lg:left-[5%]";
  return `${lado} w-[min(22rem,calc(100%-3rem))]`;
};

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

/** El globo de un acto. Su superficie y su acento no cambian: son del acto. */
const GloboActo = ({ indice, t }) => {
  const acto = CHAPTERS[indice];
  return (
    <div
      className={`${GLOBO} ${indice === 0 ? SUPERFICIE.ciudad : SUPERFICIE.almacen} px-6 py-5`}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ backgroundColor: acto.accent }}
      />

      {/* Número y rótulo en una sola línea, separados por un filete. El número
          iba en negrita y al mismo cuerpo que el rótulo, y competía con el
          titular; aquí queda como referencia, no como dato. */}
      <div className="flex items-center gap-2.5">
        <span
          className="font-mono text-[0.68rem] font-medium tabular-nums"
          style={{ color: acto.accent }}
        >
          {pad(indice + 1).slice(2)}
        </span>
        <span aria-hidden="true" className="h-3 w-px bg-white/15" />
        <p className="text-[0.62rem] font-medium uppercase tracking-[0.22em] text-white/45">
          {t(`showcase.chapters.${acto.key}.kicker`)}
        </p>
      </div>

      {/* Interletraje negativo y menos interlínea: a este cuerpo el titular por
          defecto queda suelto y se lee genérico. */}
      <h3 className="mt-3 text-[1.3rem] font-semibold leading-[1.18] tracking-[-0.015em] sm:text-[1.45rem]">
        {t(`showcase.chapters.${acto.key}.title`)}
      </h3>
      <p className="mt-2.5 text-[0.85rem] leading-[1.65] text-white/60">
        {t(`showcase.chapters.${acto.key}.text`)}
      </p>
    </div>
  );
};

/** El globo del epílogo: qué es lo que enseña la tarjeta de al lado. */
const GloboNota = ({ pasos }) => (
  <div className={`${GLOBO} ${SUPERFICIE.almacen} px-5 py-4`}>
    <span
      aria-hidden="true"
      className="absolute inset-y-0 left-0 w-[3px]"
      style={{ backgroundColor: ACENTO_EPILOGO }}
    />
    {/* El filete entre pasos hace el trabajo que hacían los puntos y aparte, y
        ocupa menos. El número va en monoespacio y cifras tabulares para que los
        tres queden en columna. */}
    <ol className="divide-y divide-white/[0.07]">
      {pasos.map((paso, i) => (
        <li key={paso} className="flex gap-3 py-2.5 first:pt-0 last:pb-0">
          <span
            className="mt-px shrink-0 font-mono text-[0.62rem] tabular-nums"
            style={{ color: ACENTO_EPILOGO }}
          >
            {pad(i + 1).slice(2)}
          </span>
          <p className="text-[0.8rem] leading-[1.5] text-white/70">{paso}</p>
        </li>
      ))}
    </ol>
  </div>
);

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
  const sideRef = useRef(CHAPTER_SIDES[0]);
  const [isMobile, setIsMobile] = useState(false);
  const movilRef = useRef(false); // el mismo dato, para los callbacks
  const [portada, setPortada] = useState(true);
  const [chapter, setChapter] = useState(0);
  const [epilogo, setEpilogo] = useState(false);

  /* La capa de créditos y cada globo dentro de ella. */
  const capaRef = useRef(null);
  const globosRef = useRef({});
  const altosRef = useRef({}); // alto de cada globo, cacheado
  const frameRef = useRef(0); // último fotograma pintado, para recolocar al redimensionar

  const tarjetasRef = useRef({});
  const [escalas, setEscalas] = useState({ 0: 1, 1: 1 });
  const ciudadListaRef = useRef(0);
  const loadedRef = useRef(0);
  const cerradaRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      movilRef.current = query.matches;
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

  /*
   * El recorrido no consume el scroll a ritmo constante: RITMO le da más sitio
   * a los momentos que hay que mirar. De aquí en adelante manda `avance`, no
   * `scrollYProgress`, para que la secuencia, la retícula, los fondos y las
   * tarjetas vayan todos por la misma curva.
   */
  const avance = useTransform(scrollYProgress, avanceDelScroll);

  /**
   * Pone retícula y línea guía sobre el dron del fotograma pedido. Escribe
   * directo al DOM: por estado sería un render de React por fotograma.
   */
  const placeOverlay = useCallback((frame, panelSide) => {
    const layout = layoutRef.current;
    const stage = stageRef.current;
    const field = fieldRef.current;
    if (!layout || !stage || !field) return;

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
      leader.setAttribute("opacity", frame >= EPILOGO_FROM ? "0" : "0.6");
      // De la orilla de la retícula al borde del escenario donde vive el panel.
      const fromX = panelSide === "right" ? x + w : x;
      const toX = panelSide === "right" ? field.clientWidth : 0;
      leader.setAttribute("x1", fromX);
      leader.setAttribute("y1", y + h / 2);
      leader.setAttribute("x2", toX);
      leader.setAttribute("y2", y + h / 2);
    }
  }, []);

  /** Punto del minimapa. Vive en el mismo 0..1 del viewBox. */
  const placeDot = useCallback((cx, cy) => {
    if (!pathDotRef.current) return;
    pathDotRef.current.setAttribute("cx", cx.toFixed(4));
    pathDotRef.current.setAttribute("cy", cy.toFixed(4));
  }, []);

  /**
   * Sube los globos como créditos: de debajo del escenario a encima de él.
   *
   * El alto de cada uno sale de la caché y no de `offsetHeight`, porque leerlo
   * aquí obligaría al navegador a recalcular la maquetación en cada fotograma,
   * justo entre las escrituras de transform de los demás. El ResizeObserver de
   * más abajo mantiene la caché al día.
   *
   * Los que están fuera de su tramo se marcan `hidden`: así el navegador ni
   * los compone, en vez de dejarlos a opacidad 0 encima de la escena.
   */
  const colocarGlobos = useCallback((frame) => {
    const capa = capaRef.current;
    if (!capa) return;
    const alto = capa.clientHeight;

    for (const globo of GLOBOS) {
      const el = globosRef.current[globo.key];
      if (!el) continue;

      const [desde, hasta] = tramoDe(globo, movilRef.current);
      const p = (frame - desde) / (hasta - desde);
      if (p < 0 || p > 1) {
        if (el.style.visibility !== "hidden") el.style.visibility = "hidden";
        continue;
      }

      const h = altosRef.current[globo.key] ?? el.offsetHeight;
      const q = recorrido(p);
      // q = 0 justo debajo del escenario; q = 1 justo encima.
      const y = (1 - q) * (alto + MARGEN_CREDITO) - q * (h + MARGEN_CREDITO);

      if (el.style.visibility === "hidden") el.style.visibility = "visible";
      el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = Math.min(q / FUNDIDO, (1 - q) / FUNDIDO, 1).toFixed(3);
    }
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
      placeOverlay(frameFromProgress(avance.get()), sideRef.current);
    },
    [frameFromProgress, placeOverlay, avance]
  );

  useMotionValueEvent(avance, "change", (value) => {
    const frame = frameFromProgress(value);
    const [cx, cy] = centerOf(DRONE_TRACK[frame] ?? DRONE_TRACK[0]);
    const next = chapterAt(frame);

    frameRef.current = frame;
    sideRef.current = CHAPTER_SIDES[next];
    placeOverlay(frame, sideRef.current);
    colocarGlobos(frame);

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
    const enPortada = movilRef.current ? frame < TITULO_HASTA_MOVIL : next === 0;
    setPortada((current) => (current === enPortada ? current : enPortada));
    const enEpilogo = frame >= EPILOGO_FROM;
    setEpilogo((current) => (current === enEpilogo ? current : enEpilogo));
  });

  useEffect(() => {
    const frame = frameFromProgress(avance.get());
    const [cx, cy] = centerOf(DRONE_TRACK[frame] ?? DRONE_TRACK[0]);
    placeDot(cx, cy);

    const entrada = clamp01((frame - SCENE_FROM) / SCENE_FADE);
    if (sceneRef.current) sceneRef.current.style.opacity = entrada.toFixed(3);
    if (cityRef.current) {
      cityRef.current.style.opacity = clamp01((SCENE_FROM - frame) / CITY_FADE).toFixed(3);
    }
    placeOverlay(frame, sideRef.current);
    frameRef.current = frame;
    colocarGlobos(frame);
  }, [colocarGlobos, frameFromProgress, placeDot, placeOverlay, avance]);

  /** Reporta a la pantalla de carga y la retira cuando el conjunto está listo. */
  const avisarCarga = useCallback((fraccionFrames) => {
    const carga = window.__ahCarga;
    if (!carga || cerradaRef.current) return;
    const total =
      fraccionFrames * CARGA_PESO_FRAMES + ciudadListaRef.current * CARGA_PESO_CIUDAD;
    carga.progreso(total);
    if (total >= 0.999) {
      cerradaRef.current = true;
      carga.cerrar();
    }
  }, []);

  /* La ciudad es un fondo de CSS y no dispara evento de carga, así que se pide
     aparte solo para saber cuándo terminó. El navegador reusa la descarga. */
  useEffect(() => {
    const img = new Image();
    const marcar = () => {
      ciudadListaRef.current = 1;
      avisarCarga(Math.min(loadedRef.current / CARGA_FRAMES, 1));
    };
    img.onload = marcar;
    img.onerror = marcar; // si falla, no vale la pena retener la pantalla
    img.src = "/fondo-ciudad.webp";
  }, [avisarCarga]);

  /* Guarda el elemento de cada globo y el de cada tarjeta, por su clave. */
  const registrarGlobo = useCallback((el) => {
    if (!el) return;
    globosRef.current[el.dataset.globo] = el;
  }, []);

  const registrarTarjeta = useCallback((el) => {
    if (!el) return;
    tarjetasRef.current[el.dataset.tarjeta] = el;
  }, []);

  /*
   * Un solo observador para los dos trabajos que dependen del alto.
   *
   * 1. La caché de altos que usa colocarGlobos, para no leer del DOM por
   *    fotograma.
   * 2. La escala de las tarjetas del WMS. Son fieles al original y eso las
   *    hace altas: la de lecturas mide más que una pantalla corta. En vez de
   *    recortarles contenido se escalan hasta que quepan, así se conservan
   *    enteras y se adaptan solas a cualquier viewport.
   *
   * Hace falta un observador y no una medida al montar porque la foto del bin
   * llega por red: midiendo una sola vez, la tarjeta crece después y se sale
   * de pantalla en la primera visita. También reacciona a las fuentes.
   */
  useEffect(() => {
    const revisar = () => {
      /*
       * Las tarjetas no se escalan a lo que quepa de alto, sino al 72% de la
       * pantalla. Una que ocupa casi todo cabe entera durante un palmo del
       * recorrido y pasa sin dejarse leer; dejándole aire a los lados del
       * trayecto, la de lecturas se ve completa el doble de scroll a cambio de
       * un 15% de tamaño, que no se nota.
       *
       * De ancho se mide contra el carril, que es lo que cambia entre
       * escritorio y móvil: en escritorio el carril lo marca la propia tarjeta
       * y la proporción sale 1, así que esto solo actúa en pantallas estrechas,
       * donde si no se saldría por la derecha.
       */
      const dispAlto = window.innerHeight * 0.72;
      const nuevas = {};
      for (const [i, el] of Object.entries(tarjetasRef.current)) {
        const dispAncho = el.parentElement?.clientWidth ?? el.scrollWidth;
        nuevas[i] = Math.max(
          Math.min(1, dispAlto / el.scrollHeight, dispAncho / el.scrollWidth),
          0.62
        );
      }

      setEscalas((previas) => {
        let siguientes = previas;
        for (const [i, escala] of Object.entries(nuevas)) {
          if (Math.abs((previas[i] ?? 1) - escala) > 0.005) {
            siguientes = { ...siguientes, [i]: escala };
          }
        }
        return siguientes;
      });

      /*
       * El alto que se cachea es el que se ve, no el de maquetación: la escala
       * va en un hijo y un transform no encoge la caja del padre, así que sin
       * esto una tarjeta reducida se daría por más alta de lo que es y saldría
       * de pantalla antes de tiempo.
       */
      for (const globo of GLOBOS) {
        const el = globosRef.current[globo.key];
        if (!el) continue;
        const escala = globo.tipo === "tarjeta" ? nuevas[globo.indice] ?? 1 : 1;
        altosRef.current[globo.key] = el.offsetHeight * escala;
      }

      colocarGlobos(frameRef.current);
    };

    const observador = new ResizeObserver(revisar);
    Object.values(globosRef.current).forEach((el) => observador.observe(el));
    Object.values(tarjetasRef.current).forEach((el) => observador.observe(el));
    revisar();

    window.addEventListener("resize", revisar);
    return () => {
      observador.disconnect();
      window.removeEventListener("resize", revisar);
    };
  }, [colocarGlobos]);

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

  return (
    <section
      ref={sectionRef}
      data-ah-no-reveal
      className="relative bg-[#162A42] text-white"
      style={{ height: `${ALTO_VH}vh` }}
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
            portada ? "opacity-100" : "opacity-0"
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
              progress={avance}
              frameCount={frameCount}
              srcFor={srcFor}
              onLoadProgress={(f) => {
              loadedRef.current = f * (isMobile ? MOBILE_FRAMES : TOTAL_FRAMES);
              avisarCarga(Math.min(loadedRef.current / CARGA_FRAMES, 1));
            }}
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

        </div>

        {/*
          La capa de créditos. Cuelga del contenedor pegajoso y no del
          escenario, para que los globos crucen la pantalla entera y no solo el
          recuadro del dron; el overflow-hidden de arriba es el que los recorta
          al entrar y al salir.

          Están los seis montados siempre. Lo que los mueve es colocarGlobos,
          escribiendo transform y opacidad directo al DOM: por estado sería un
          render de React por fotograma.
        */}
        <div ref={capaRef} className="pointer-events-none absolute inset-0 z-10">
          {GLOBOS.map((globo) => (
            <div
              key={globo.key}
              ref={registrarGlobo}
              data-globo={globo.key}
              className={`absolute top-0 ${carrilDe(globo, isMobile)}`}
              style={{ visibility: "hidden", willChange: "transform, opacity" }}
            >
              {globo.tipo === "acto" && <GloboActo indice={globo.indice} t={t} />}

              {globo.tipo === "tarjeta" && (
                /* El escalado va en un hijo porque el padre ya gobierna el
                   transform del recorrido y se pisarían. */
                <div
                  ref={registrarTarjeta}
                  data-tarjeta={globo.indice}
                  className={isMobile ? "origin-top" : "origin-top-left"}
                  style={{ transform: `scale(${escalas[globo.indice] ?? 1})` }}
                >
                  {globo.indice === 0 ? <TarjetaConteo /> : <TarjetaLecturas />}
                </div>
              )}

              {globo.tipo === "nota" && (
                <GloboNota pasos={EPILOGO_TARJETAS[globo.indice].nota.pasos} />
              )}
            </div>
          ))}
        </div>

        {/* Barra inferior: capítulos, lectura y salida. En móvil sube, porque
            abajo del todo va la pista de scroll y se encimaban. */}
        <div className="ah-container absolute inset-x-0 bottom-16 z-10 flex items-end justify-between gap-6 sm:bottom-8">
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
              {epilogo ? "" : t(`showcase.chapters.${active.key}.phase`)}
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

            {MOSTRAR_CTA && (
              <Link
                to="/products"
                className="hidden items-center gap-2 rounded-full bg-[#2A47F6] px-6 py-3 text-sm font-semibold shadow-[0_8px_24px_rgba(42,71,246,0.4)] transition duration-500 hover:bg-[#3d5aff] sm:inline-flex"
              >
                {t("showcase.cta")}
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>

        <AnimatePresence>
          {portada && !reduceMotion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              /* nowrap: con left-1/2 el ancho disponible es media pantalla, y
                 en móvil el texto partía en dos líneas antes de centrarse. */
              className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[0.7rem] uppercase tracking-[0.2em] text-white/45"
            >
              <MousePointer2 size={13} />
              {t("showcase.hint")}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default DroneShowcase;
