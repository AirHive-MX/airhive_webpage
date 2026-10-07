import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMotionValue, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import ScrollSequence from "../ScrollSequence/ScrollSequence";
import DRONE_TRACK from "../DroneShowcase/droneTrack";
import { TarjetaConteo } from "../DroneShowcase/WmsCards";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useScrollGuiado from "./useScrollGuiado";
import { ArrowRight } from "lucide-react";

/**
 * El dron entra al almacén: la historia del home.
 *
 * Afuera, de noche, el dron flota frente a la fachada mirando a cámara. Con el
 * scroll gira 180° hasta quedar de espaldas, vuela hacia la puerta de carga y
 * la cámara lo sigue hasta cruzarla; adentro arranca motores.
 *
 * Todo es 2D sobre fotos, así que la profundidad se fabrica:
 * - La fachada se acerca escalando sobre el centro de la puerta, que por eso
 *   no se mueve de sitio en pantalla.
 * - Lo que se ve por la puerta es otra capa (la foto del pasillo de racks) que crece
 *   más despacio que la fachada (ver PROFUNDIDAD). Lo lejano
 *   crece menos que lo cercano, y esa diferencia es la que se lee como
 *   profundidad al acercarse.
 * - El dron primero se adelanta (se achica rumbo a la puerta) y luego la
 *   cámara lo alcanza (vuelve a crecer) justo al cruzar.
 *
 * Una versión renderizada en Blender con la escena completa se vería aún más
 * real; los tiempos y encuadres de aquí sirven de guía para hacerla.
 */

/** La foto de la fachada y su puerta de carga, en píxeles de la imagen. */
/*
 * Tres fachadas para comparar con el Atlas 2.0, que es negro: de noche se
 * pierde contra el azul oscuro, y sobre un cielo claro se recorta. Se elige
 * con ?fachada=dia o ?fachada=atardecer en la dirección; sin nada, noche.
 * Cada foto tiene su puerta en otro sitio, medida a mano sobre la imagen.
 */
const FACHADAS = {
  noche: {
    src: "/fachada-almacen.webp", w: 1376, h: 768, puerta: { x0: 552, y0: 396, x1: 824, y1: 598 },
    pasillo: "/pasillo-racks.webp", rack: "/racks-cerca.webp", oscurecerInterior: true,
  },
  /* Con estas dos el pasillo va en su versión clara (sombras levantadas,
     brillo medio 101 contra 65) y sin oscurecer desde la calle: el Atlas 2.0
     es negro y sobre el pasillo oscuro se perdía justo al cruzar la puerta. */
  dia: {
    src: "/fachada-dia.webp", w: 1376, h: 768, puerta: { x0: 553, y0: 322, x1: 823, y1: 553 },
    pasillo: "/pasillo-racks-claro.webp", rack: "/racks-cerca-claro.webp", oscurecerInterior: false,
  },
  atardecer: {
    src: "/fachada-atardecer.webp", w: 1376, h: 768, puerta: { x0: 606, y0: 379, x1: 770, y1: 529 },
    pasillo: "/pasillo-racks-claro.webp", rack: "/racks-cerca-claro.webp", oscurecerInterior: false,
  },
};
const ELEGIDA =
  FACHADAS[typeof window !== "undefined" && new URLSearchParams(window.location.search).get("fachada")] ??
  FACHADAS.noche;
const FACHADA = { src: ELEGIDA.src, w: ELEGIDA.w, h: ELEGIDA.h };
const PUERTA = ELEGIDA.puerta;
const PUERTA_CX = (PUERTA.x0 + PUERTA.x1) / 2 / FACHADA.w;
const PUERTA_CY = (PUERTA.y0 + PUERTA.y1) / 2 / FACHADA.h;
const PUERTA_W = (PUERTA.x1 - PUERTA.x0) / FACHADA.w;
const PUERTA_H = (PUERTA.y1 - PUERTA.y0) / FACHADA.h;

/** Tramos del recorrido, en fracción del scroll de la sección. */
const GIRO = [0.03, 0.16]; // de frente (fotograma 60) a de espaldas (120)
const ACERCA = [0.16, 0.34]; // vuela hacia la puerta, la cámara lo sigue
const CRUZA = [0.34, 0.42]; // la cámara lo alcanza y cruzan la puerta
const AVANZA = [0.42, 0.62]; // la cámara sigue avanzando por el pasillo
const AL_RACK = [0.6, 0.65]; // corte suave del pasillo a la toma de cerca
const CUENTA = [0.65, 0.8]; // barrido lateral frente al rack
const SISTEMA = [0.8, 0.85]; // se apaga el rack y entra el WMS

/**
 * Escenas del scroll guiado en pantallas táctiles (ver useScrollGuiado), como
 * tramos [desde, hasta] en fracción del recorrido.
 *
 * Dentro de cada tramo el scroll es libre: es donde se lee. Lo que queda
 * entre dos tramos es transición, y si se suelta el dedo ahí se termina sola
 * hasta la escena siguiente. Un deslizón fuerte que cruza el centro de una
 * escena se detiene en ella. Antes eran paradas rígidas (scroll-snap) y el
 * scroll se sentía frenado; así se comporta como en hextronics.com.
 */
/*
 * Cada escena empieza donde ya está completa, no donde asoma: al terminar una
 * transición el scroll se queda justo en ese inicio, y ahí tiene que verse
 * todo. Medido contra TEXTOS y las animaciones de cada tramo.
 */
const ESCENAS = [
  [0, 0.035], // gancho
  [0.07, 0.105], // el problema: sus tres datos terminan de salir en 0.07
  [0.14, 0.21], // "Conoce al que cuenta por ti"
  [0.3, 0.34], // el dron llegando a la puerta
  [0.44, 0.595], // el pasillo: la tercera palabra se va en 0.593
  [0.595, 0.615], // "Tu turno sigue. Él también."
  [0.68, 0.78], // conteo frente al rack
  [0.87, 1], // el agente: las tarjetas ya están y las 3 diferencias se resuelven aquí
];

/**
 * Ritmo en pantallas táctiles: cuánto scroll se le da a cada tramo del
 * recorrido, como pares [hasta, peso] (pesos relativos; el alto total no
 * cambia).
 *
 * Con el reparto parejo, los textos cortos casi no duraban: "Tu turno sigue"
 * se iba en una fracción de pantalla. Aquí las escenas de lectura (las de
 * ESCENAS) pesan más y las transiciones menos, que además se completan solas
 * con el scroll guiado. En computadora el reparto sigue parejo.
 */
const RITMO_TACTIL = [
  [0.035, 0.5], // gancho
  [0.07, 0.25],
  [0.105, 0.7], // problema
  [0.14, 0.25],
  [0.21, 0.6], // conoce
  [0.3, 0.4], // vuelo hacia la puerta
  [0.34, 0.3], // la puerta
  [0.44, 0.45], // cruce
  [0.595, 1.3], // pasillo con palabras: tres esquives
  [0.615, 0.5], // "Tu turno sigue"
  [0.68, 0.3],
  [0.78, 0.7], // conteo
  [0.87, 0.35], // entra el sistema
  [1, 0.9], // el agente resuelve una por una
];

/** Del scroll (0..1) al recorrido (0..1) según el ritmo, y al revés. */
const RITMO = (() => {
  const tramos = [];
  let p0 = 0;
  let q0 = 0;
  const total = RITMO_TACTIL.reduce((suma, [, peso]) => suma + peso, 0);
  for (const [hasta, peso] of RITMO_TACTIL) {
    const q1 = q0 + peso / total;
    tramos.push({ p0, p1: hasta, q0, q1 });
    p0 = hasta;
    q0 = q1;
  }
  const recorridoDe = (q) => {
    const t = tramos.find((tr) => q <= tr.q1) ?? tramos[tramos.length - 1];
    return t.p0 + ((Math.min(Math.max(q, 0), 1) - t.q0) / (t.q1 - t.q0)) * (t.p1 - t.p0);
  };
  const scrollDe = (p) => {
    const t = tramos.find((tr) => p <= tr.p1) ?? tramos[tramos.length - 1];
    return t.q0 + ((Math.min(Math.max(p, 0), 1) - t.p0) / (t.p1 - t.p0)) * (t.q1 - t.q0);
  };
  return { recorridoDe, scrollDe };
})();

/** La foto del pasillo (1536x1024): se ve por la puerta y luego se recorre. */
const PASILLO = { w: 1536, h: 1024 };

/**
 * Palabras como obstáculos.
 *
 * Mientras avanza por el pasillo, el dron se encuentra con lo que pasa en un
 * almacén que no se detiene, escrito en el aire, y lo esquiva. No se dice que
 * evita obstáculos: se ve.
 *
 * Van en 3D de verdad (perspective de CSS): cada palabra tiene un sitio fijo
 * en el pasillo —x, y, z en píxeles de mundo, z negativo es hacia el fondo— y
 * lo que se mueve es la cámara, CAMARA_RECORRE píxeles hacia adelante. Así
 * todas crecen con la misma perspectiva, las cercanas corren más que las
 * lejanas y al rebasarlas salen por su costado. (Antes cada una crecía a su
 * propio ritmo, sin relación con las demás ni con el pasillo, y se notaba
 * pegado.) Lo lejano va tenue y desenfocado, como a través del aire de la
 * nave; al pasar junto a la cámara se desenfoca otra vez.
 *
 * El dron va DRON_Z por delante de la cámara y se aparta cuando una palabra
 * llega a su profundidad: al lado contrario, o hacia arriba si la palabra va
 * baja y al centro.
 */
const PERSPECTIVA = 900;
const CAMARA_RECORRE = 9400;
const DRON_Z = -500;
const PALABRAS = [
  // La primera arranca más allá de -3200, donde empieza el esquive: si no, el
  // dron ya se ladeaba afuera, frente a la fachada.
  // Los textos de cada una están en translation.json (inicio.obstaculos).
  { x: 300, y: -30, z: -3600 },
  { x: -340, y: 10, z: -6200 },
  { x: 20, y: 260, z: -8800 },
];
const ESQUIVE = 0.2; // cuánto se aparta de lado, en fracción del ancho
const SUBE = 0.14; // cuánto sube para pasar por encima, en fracción del alto

/**
 * Los textos de la historia, cada uno con su tramo: [entra desde, entra
 * hasta, sale desde, sale hasta]. Van uno a la vez, como subtítulos.
 */
const TEXTOS = {
  gancho: [-1, -1, 0.035, 0.055],
  problema: [0.05, 0.065, 0.105, 0.12],
  // Se presenta al dron cuando acaba de girar y todavía está grande; más
  // tarde ya va chico rumbo a la puerta y casi no se ve a quién se presenta.
  conoce: [0.125, 0.14, 0.21, 0.23],
  sinParar: [0.575, 0.595, 0.615, 0.635],
  cuenta: [0.65, 0.67, 0.78, 0.8],
  sistema: [0.82, 0.85, 2, 2],
};


/**
 * Lo que va leyendo el dron frente al rack. Una sale distinta a lo que dice
 * el sistema: es la que luego resuelve el agente.
 */
const LECTURAS = [
  // El detalle de cada una está en translation.json (inicio.lecturas).
  { ubicacion: "A-01-02", bien: true },
  { ubicacion: "A-01-03", bien: true },
  { ubicacion: "A-02-01", bien: true },
  { ubicacion: "A-03-01", bien: false },
  { ubicacion: "A-03-02", bien: true },
];
const TOTAL_ETIQUETAS = 117;
const TOTAL_UBICACIONES = 41;

/** Las diferencias del vuelo y lo que hizo el agente con cada una. */
const DIFERENCIAS = [
  // Problema y acción de cada una: translation.json (inicio.diferencias).
  { ubicacion: "A-03-01", resuelta: 0.89 },
  { ubicacion: "B-02-04", resuelta: 0.93 },
  { ubicacion: "C-01-03", resuelta: 0.97 },
];

/**
 * La toma de cerca se corre de derecha a izquierda mientras el dron cuenta,
 * como si avanzara de lado a lo largo del rack. ANCHO_CERCA es cuánto más
 * ancha que la pantalla se dibuja, para tener por dónde correrla.
 */
const ANCHO_CERCA = 1.45;
const INCLINACION = 5; // grados que se ladea el dron hacia donde avanza

/**
 * El dron flotando frente a la fachada.
 *
 * No cambia de pose: se queda en el fotograma donde lo deja el giro, y lo
 * único que se mueve es el balanceo de abajo. Las hélices están paradas a
 * propósito; conviene leer esto antes de "arreglarlo", porque ya se intentó.
 *
 * Los renders del Atlas 2.0 traen las hélices animadas, y la idea era
 * reproducir en bucle un tramo donde el dron no cambia de postura para que
 * giraran solas. Con estos renders no sale:
 *
 * - El tramo útil son seis fotogramas (115-120). No se puede alargar: tiene
 *   que terminar donde lo deja el giro o da un tirón al entrar, y solo once
 *   fotogramas comparten esa pose. Medido, el dron no la recupera en ningún
 *   otro punto: del 125 en adelante su silueta difiere entre un 22% y un 44%,
 *   porque ya giró para entrar al almacén.
 * - Seis fotogramas son media vuelta de pala, y las aspas salen del render
 *   como siluetas negras, finas y muy contrastadas. Alternarlas no se lee como
 *   giro: deprisa parpadea, despacio se leen los saltos.
 * - Y lo que más se notaba no era ni siquiera el movimiento de las palas, que
 *   es mínimo entre fotogramas, sino que las aspas tapan más área en unas
 *   fases que en otras: el dron entero pulsaba un 9.8% de densidad en cada
 *   vuelta del bucle. No se movía, parpadeaba.
 *
 * Se probó a difuminarlas promediando fotogramas, que es el motion blur que
 * les falta: con ventana de cinco el pulso baja al 1.97% y deja de temblar,
 * pero entonces las palas quedan como un disco y el giro casi no se ve. Como
 * el giro era lo único que se ganaba, no compensa el tratamiento.
 *
 * Así que se quedan quietas y la vida la pone el balanceo, que es continuo y
 * se ajusta a voluntad. Si algún día se reexportan los renders con motion blur
 * en las palas, el bucle vuelve a tener sentido tal cual: fotogramas 115 a 120,
 * desplazados para que el chasis coincida con el del 121 (el render trae 8.3 px
 * de balanceo propio ahí dentro, y repetido varias veces por segundo es otro
 * tembleque).
 */

/**
 * El balanceo de flotar.
 *
 * Va por tiempo, no por scroll. El que había antes era Math.sin(p * 40): al
 * dejar de hacer scroll se congelaba y el dron se quedaba clavado en el aire.
 *
 * Conviene quedarse corto: un dron parado se sostiene casi quieto, y en cuanto
 * el recorrido se nota deja de leerse como que flota y empieza a leerse como
 * que tiembla la imagen.
 */
const BALANCEO_PX = 2;        // cuánto sube y baja, a cada lado
const BALANCEO_SEG = 4.5;     // lo que tarda en subir y bajar una vez

/** Cuánto se acerca la cámara al final del acercamiento, antes de cruzar. */
const ZOOM_ACERCA = 2.3;
/**
 * Cuánto crece lo que se ve por la puerta respecto a la fachada, como
 * exponente: 1 sería pegado a la fachada (sin profundidad) y 0.5 muy lejos.
 * Con 0.5 el interior arrancaba tan ampliado que por la puerta se veía una
 * sola caja, y con 0.75 los primeros racks medían lo que la puerta. 0.85 los
 * deja al fondo y aún se nota la profundidad.
 */
const PROFUNDIDAD = 0.85;

/**
 * Dónde cae el dron dentro de su render y cómo corregirlo para que su centro
 * quede en el eje de la pantalla. Medido del alpha del Atlas 2.0: el cuerpo
 * está en x = 0.495 y y = 0.61 del cuadro (más abajo que el Atlas 1, que iba
 * en 0.50). El Atlas 1 venía cargado a la izquierda (0.446) y se corría 5.4%
 * a la derecha; con el Atlas 2, ya centrado, ese corrimiento lo dejaba ~80 px
 * a la derecha de la puerta.
 */
const CENTRADO_RENDER = "0.5% -11%";

/**
 * Tamaño del dron: al inicio, al llegar a la puerta y ya adentro (1). Arranca
 * en 0.7 y arriba de la puerta para no taparla: la puerta es el punto de la
 * escena y con el dron a tamaño completo la batería quedaba justo encima.
 */
const DRON_INICIO = 0.85;
/*
 * Al llegar a la puerta apenas se achica: la cámara lo sigue a
 * distancia fija y lo que crece es el edificio. Antes bajaba a 0.3 y al cruzar
 * volvía a crecer, y se leía como un dron que cambia de tamaño, no que avanza.
 */
const DRON_LEJOS = 0.78;
/** Tamaño en el pasillo; frente al rack crece a 1 para la toma de cerca. */
const DRON_PASILLO = 0.82;

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const tramo = (p, [a, b]) => clamp01((p - a) / (b - a));
const suave = (t) => t * t * (3 - 2 * t);
const entra = (t) => t * t * t; // acelera al final, como al cruzar
const mezcla = (a, b, t) => a + (b - a) * t;
const pad = (n) => String(n).padStart(4, "0");

const EntradaAlmacen = () => {
  const { t } = useTranslation();
  const tx = (clave) => t(`inicio.${clave}`);
  const lista = (clave) => t(`inicio.${clave}`, { returnObjects: true });
  const seccionRef = useRef(null);
  const mundoRef = useRef(null);
  const interiorRef = useRef(null);
  const dronRef = useRef(null);
  const balanceoRef = useRef(null); // envoltorio que flota, aparte del transform del scroll
  const asientoRef = useRef(0);    // 1 flotando frente a la fachada, 0 una vez cruzada la puerta
  const velo = useRef(null);
  const cercaRef = useRef(null); // la toma de cerca de los racks
  const textosRef = useRef({}); // cada texto de la historia, por su clave
  const problemasRef = useRef([]);
  const etiquetasRef = useRef(null);
  const ubicacionesRef = useRef(null);
  const lecturasRef = useRef([]);
  const alertaRef = useRef(null);
  const apagadoRef = useRef(null); // oscurece el rack cuando entra el sistema
  const sistemaRef = useRef(null);
  const diferenciasRef = useRef([]);
  const palabrasRef = useRef([]); // las palabras-obstáculo del pasillo
  const gradoRef = useRef(null); // entonado del interior visto desde la calle
  const [movil, setMovil] = useState(false);
  const [tactil, setTactil] = useState(false);

  // Scroll guiado solo en táctil: en computadora la rueda ya avanza poco a
  // poco y lo guiado se sentiría como quitarle el control a quien lee.
  /* Al recargar, la historia empieza desde arriba. El navegador por su
     cuenta devolvía al punto donde se estaba, a veces a mitad de una
     transición. Se restaura al salir, para no afectar a las demás páginas. */
  useEffect(() => {
    const anterior = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      window.history.scrollRestoration = anterior;
    };
  }, []);

  const escenasScroll = useMemo(
    () => ESCENAS.map(([a, b]) => [RITMO.scrollDe(a), RITMO.scrollDe(b)]),
    []
  );
  useScrollGuiado(seccionRef, escenasScroll, tactil);

  useEffect(() => {
    const q = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      setMovil(q.matches);
      setTactil(window.matchMedia("(pointer: coarse)").matches);
    };
    sync();
    q.addEventListener("change", sync);
    return () => q.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: seccionRef,
    offset: ["start start", "end end"],
  });
  /* El resorte suaviza los saltos de la rueda del mouse. En táctil sobra: la
     inercia del teléfono ya es suave y el resorte solo añadía retraso, que se
     sentía como un scroll "chicloso". Ahí el recorrido sigue al dedo. */
  const resorte = useSpring(scrollYProgress, { stiffness: 300, damping: 20, mass: 0.3, restDelta: 0.0002 });

  /* El fotograma del dron, como fracción de los 180 que se usan. */
  const fotograma = useMotionValue(60 / 180);
  const enVueloRef = useRef(false);

  /*
   * Pantalla de carga (vive en index.html). Se retira cuando está la fachada y
   * una cuarta parte de los fotogramas: con eso el giro ya se ve completo y el
   * resto entra por detrás mientras se lee el gancho.
   */
  const cargaRef = useRef({ fachada: false, fotogramas: 0, cerrada: false });
  const avisarCarga = useCallback(() => {
    const c = cargaRef.current;
    const carga = window.__ahCarga;
    if (!carga || c.cerrada) return;
    const listos = Math.min(1, c.fotogramas * 4);
    carga.progreso((c.fachada ? 0.2 : 0) + listos * 0.8);
    if (c.fachada && listos >= 1) {
      c.cerrada = true;
      carga.cerrar();
    }
  }, []);
  useEffect(() => {
    const img = new Image();
    const listo = () => {
      cargaRef.current.fachada = true;
      avisarCarga();
    };
    img.onload = listo;
    img.onerror = listo; // si falla, no vale la pena retener la pantalla
    img.src = FACHADA.src;
  }, [avisarCarga]);

  /*
   * El cuadro a cuadro del dron: qué fotograma le toca y cuánto flota.
   */
  const leerRecorridoRef = useRef(() => 0);
  useEffect(() => {
    let raf = 0;
    const latido = (ahora) => {
      const p = leerRecorridoRef.current();
      /* Mientras gira lo manda el scroll; al terminar se sostiene ahí. Se lee
         el scroll de verdad en cada cuadro, no un dato guardado, para que si
         alguna vez se pierde una actualización —un brinco de scroll en
         Safari— el dron no se quede con el fotograma de espaldas estando
         frente a la fachada. */
      fotograma.set(p >= GIRO[1] ? 120 / 180 : (60 + 60 * suave(tramo(p, GIRO))) / 180);
      /* El balanceo, a su ritmo. Se apaga al cruzar la puerta igual que hacía
         el anterior: ahí dentro la cámara ya va pegada al dron y un vaivén se
         leería como que tiembla la imagen, no como que flota. */
      if (balanceoRef.current) {
        const y = Math.sin((ahora / 1000) * ((2 * Math.PI) / BALANCEO_SEG)) * BALANCEO_PX * asientoRef.current;
        balanceoRef.current.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(latido);
    };
    raf = requestAnimationFrame(latido);
    return () => cancelAnimationFrame(raf);
  }, [fotograma]);

  const aplicar = useCallback((p) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mundo = mundoRef.current;
    const dron = dronRef.current;
    if (!mundo || !dron) return;

    /* Dónde queda la puerta en pantalla. El mundo cubre el viewport con la
       proporción de la foto, centrado; la escala gira sobre la puerta, así que
       la puerta se queda quieta y lo demás crece alrededor. */
    const mundoW = Math.max(vw, (vh * FACHADA.w) / FACHADA.h);
    const mundoH = (mundoW * FACHADA.h) / FACHADA.w;
    const puertaX = vw / 2 + (PUERTA_CX - 0.5) * mundoW;
    const puertaY = vh / 2 + (PUERTA_CY - 0.5) * mundoH;
    const puertaW = PUERTA_W * mundoW;
    const puertaH = PUERTA_H * mundoH;

    /* Cámara. Hasta ZOOM_ACERCA va suave; al cruzar acelera hasta que la
       puerta llena la pantalla con margen. */
    const zoomLleno = Math.max(vw / puertaW, vh / puertaH) * 1.15;
    const tA = suave(tramo(p, ACERCA));
    const tC = entra(tramo(p, CRUZA));
    const tAv = suave(tramo(p, AVANZA));
    const zoom =
      tC > 0 ? mezcla(ZOOM_ACERCA, zoomLleno, tC) * (1 + 0.6 * tAv) : mezcla(1, ZOOM_ACERCA, tA);
    mundo.style.transform = `scale(${zoom.toFixed(4)})`;

    /* Lo que se ve por la puerta crece menos que la cámara (zoom^PROFUNDIDAD):
       está más lejos. Se compensa desde el tamaño final para que nunca deje
       hueco dentro del marco de la puerta. */
    if (interiorRef.current) {
      const relativa = Math.pow(zoomLleno / zoom, 1 - PROFUNDIDAD);
      interiorRef.current.style.transform = `scale(${relativa.toFixed(4)})`;
    }

    /* La fachada se apaga en el último tramo para que no quede un marco
       borroso alrededor una vez dentro. */
    if (velo.current) velo.current.style.opacity = (tC * 0.12).toFixed(3);

    /* Desde la calle el interior va entonado a la luz de la puerta: cálido y
       más oscuro. Al cruzar se le quita, porque ya no se ve a través de nada. */
    // Rápido y al principio del cruce: a media opacidad se lee como neblina.
    if (gradoRef.current) {
      // A la par que la puerta llena la pantalla, no de golpe: antes se
      // quitaba en un tramo cortísimo y el pasillo se "encendía" de repente.
      gradoRef.current.style.opacity = (1 - suave(tramo(p, CRUZA))).toFixed(3);
    }

    /* Sin tinte ni luz agregada: el Atlas 2.0 se queda con la iluminación de
       su propio render. El tinte que oscurecía al Atlas 1 (blanco, con luz
       de estudio) a este, que es de fibra de carbono, lo dejaba hecho una
       silueta negra; y una luz de contorno agregada se veía artificial. */

    /* Toma de cerca: entra con un acercamiento corto (de 1.12 a 1), como un
       corte que sigue el mismo movimiento, y luego se corre de lado. */
    const tR = suave(tramo(p, AL_RACK));
    const tK = suave(tramo(p, CUENTA));
    if (cercaRef.current) {
      const ancho = Math.max(vw * ANCHO_CERCA, vh * 1.5 * 1.08);
      const sobra = ancho - vw;
      const dx = mezcla(sobra / 2, -sobra / 2, tK);
      cercaRef.current.style.width = `${ancho}px`;
      cercaRef.current.style.opacity = tR.toFixed(3);
      cercaRef.current.style.transform = `translate3d(calc(-50% + ${dx.toFixed(1)}px), -50%, 0) scale(${mezcla(1.12, 1, tR).toFixed(4)})`;
    }

    /* Dron. Reposa arriba de la puerta y baja a su altura mientras se acerca.
       La cámara lo sigue a distancia fija, así que su tamaño casi no cambia:
       lo que crece es el edificio. Solo frente al rack se agranda. */
        const reposoY = movil ? vh * 0.34 : vh * 0.33;
    const lejosY = puertaY - puertaH * 0.05;
    let escala;
    let y;
    if (tC > 0) {
      // Cruza la puerta casi del mismo tamaño y solo crece frente al rack.
      escala = mezcla(mezcla(DRON_LEJOS, DRON_PASILLO, suave(tramo(p, CRUZA))), 1, tR);
      y = mezcla(lejosY, vh * 0.5, suave(tramo(p, CRUZA)));
      const enPasillo = suave(tramo(p, [CRUZA[1] - 0.04, CRUZA[1] + 0.02])) * (1 - tR);
      y += vh * 0.03 * enPasillo;
      // Frente al rack se centra en el hueco que va a leer: el centro del
      // nivel de en medio de la toma de cerca cae al 38% del alto, y antes el
      // dron quedaba al 51%, sobre la viga.
      y -= vh * 0.07 * tR;
    } else {
      escala = mezcla(DRON_INICIO, DRON_LEJOS, tA);
      y = mezcla(reposoY, lejosY, tA);
    }
    // Se inclina hacia adelante mientras avanza, más en el centro del tramo.
    const cabeceo = Math.sin(Math.PI * tramo(p, [ACERCA[0], CRUZA[1]])) * 14;
    // El balanceo ya no va aquí: lo lleva el bucle por tiempo (ver BALANCEO_PX).
    // Esto solo le dice cuánto aplicarse, que es nada en cuanto se cruza.
    asientoRef.current = 1 - tC;
    /* Por el pasillo: la cámara avanza y las palabras se le vienen encima. */
    const tPas = tramo(p, AVANZA);
    const camaraZ = tPas * CAMARA_RECORRE;
    /* En pantallas angostas las palabras y sus distancias se encogen con el
       ancho (la letra va en clamp), y el dron se aparta más en proporción,
       porque ahí ocupa casi todo el ancho. */
    const escalaMundo = Math.min(1, vw / 1100);
    const apartaLado = movil ? 0.3 : ESQUIVE;
    let esquive = 0;
    let subida = 0;
    let ladeoEsquive = 0;
    PALABRAS.forEach((w, i) => {
      const z = w.z + camaraZ; // profundidad respecto a la cámara
      const el = palabrasRef.current[i];
      if (el) {
        const enTramo = p > AVANZA[0] && p < AVANZA[1];
        const op = enTramo
          ? // Aparece ya cerca (de -3800 a -2400): más lejos se amontonaba al
            // centro detrás de la que estaba pasando.
            // y se va antes de llegar a la profundidad del dron, para nunca
            // taparlo.
            tramo(z, [-3800, -2400]) * (1 - tramo(z, [DRON_Z - 800, DRON_Z - 150]))
          : 0;
        el.style.opacity = (op * 0.95).toFixed(3);
        el.style.visibility = op > 0.001 ? "visible" : "hidden";
        el.style.transform = `translate3d(calc(-50% + ${(w.x * escalaMundo).toFixed(1)}px), calc(-50% + ${(w.y * escalaMundo).toFixed(1)}px), ${Math.min(z, PERSPECTIVA * 0.7).toFixed(1)}px)`;
      }
      /* Se aparta con tiempo: empieza mientras la palabra aún viene lejos, se
         sostiene a un lado y vuelve cuando ya pasó (para entonces la palabra
         ya se desvaneció). Antes esperaba a tenerla encima y se veía la
         palabra tapándolo. */
      const aparta = suave(tramo(z, [-3200, -1700]));
      const regresa = suave(tramo(z, [DRON_Z - 100, DRON_Z + 700]));
      // Solo dentro del pasillo: fuera de su tramo el dron no esquiva nada.
      const enPasillo = p > AVANZA[0] && p < AVANZA[1] ? 1 : 0;
      const empuje = aparta * (1 - regresa) * enPasillo;
      if (Math.abs(w.x) < 120) {
        subida += empuje * SUBE * vh;
        return;
      }
      const lado = w.x > 0 ? -1 : 1;
      esquive += lado * empuje * apartaLado * vw;
      // Ladeo = velocidad lateral, con tope para que no se vea volcado.
      // Se ladea al apartarse y al revés al volver; quieto mientras sostiene.
      const vaiven = Math.sin(Math.PI * tramo(z, [-3200, -1700])) - Math.sin(Math.PI * tramo(z, [DRON_Z - 100, DRON_Z + 700]));
      ladeoEsquive += Math.max(-8, Math.min(8, lado * vaiven * 8)) * enPasillo;
    });
    y -= subida;

    const x = (puertaX - vw / 2) * (tC > 0 ? 1 : tA) + esquive;
    // De lado frente al rack: se ladea hacia donde avanza, más a media marcha.
    const ladeo = Math.sin(Math.PI * tramo(p, CUENTA)) * INCLINACION + ladeoEsquive;
    dron.style.transform =
      `translate3d(${x.toFixed(1)}px, ${(y - vh / 2).toFixed(1)}px, 0) ` +
      `scale(${escala.toFixed(4)}) rotateX(${cabeceo.toFixed(2)}deg) rotate(${ladeo.toFixed(2)}deg)`;

    /* Fotograma: durante el giro lo manda el scroll; en cuanto termina, el
       bucle de las hélices (ver el efecto de abajo). El barrido frente al rack
       lo hace la cámara, para que el dron no se vaya a la esquina como en los
       renders. */
    enVueloRef.current = p >= GIRO[1];
    if (!enVueloRef.current) fotograma.set((60 + 60 * suave(tramo(p, GIRO))) / 180);

    /* Textos: entran subiendo un poco y salen desvaneciéndose. */
    for (const [clave, [a, b, c, d]] of Object.entries(TEXTOS)) {
      const el = textosRef.current[clave];
      if (!el) continue;
      const dentro = a < 0 ? 1 : tramo(p, [a, b]);
      const op = Math.min(dentro, 1 - tramo(p, [c, d]));
      el.style.opacity = op.toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - dentro) * 18).toFixed(1)}px, 0)`;
      el.style.visibility = op > 0.001 ? "visible" : "hidden";
    }
    problemasRef.current.forEach((el, i) => {
      if (!el) return;
      // Los tres terminan de salir en 0.07, donde empieza su escena de lectura.
      const t = tramo(p, [0.05 + i * 0.005, 0.06 + i * 0.005]);
      el.style.opacity = t.toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - t) * 12).toFixed(1)}px, 0)`;
    });

    /* Conteo: los contadores suben con el barrido y las lecturas entran en
       orden, la que no cuadra en ámbar. */
    const tCuenta = tramo(p, [CUENTA[0] + 0.01, CUENTA[1] - 0.02]);
    if (etiquetasRef.current) etiquetasRef.current.textContent = Math.round(tCuenta * TOTAL_ETIQUETAS);
    if (ubicacionesRef.current) ubicacionesRef.current.textContent = Math.round(tCuenta * TOTAL_UBICACIONES);
    /* Cada lectura brota junto al dron, sube un poco y se desvanece: así
       se ve que es él quien las va tomando. */
    lecturasRef.current.forEach((el, i) => {
      if (!el) return;
      const ti = (i + 0.4) / (LECTURAS.length + 0.6);
      const t = tramo(tCuenta, [ti, ti + 0.16]);
      const op = t <= 0 || t >= 1 ? 0 : Math.min(tramo(t, [0, 0.15]), 1 - tramo(t, [0.7, 1]));
      el.style.opacity = op.toFixed(3);
      el.style.transform = `translate3d(0, ${(-70 * t).toFixed(1)}px, 0)`;
    });
    if (alertaRef.current) {
      const aparece = (3 + 0.4) / (LECTURAS.length + 0.6);
      alertaRef.current.style.opacity = tramo(tCuenta, [aparece, aparece + 0.03]).toFixed(3);
    }

    /* Sistema: el rack se apaga, el dron se va y entran las tarjetas. Cada
       diferencia pasa de detectada a resuelta en su momento. */
    const tS = suave(tramo(p, SISTEMA));
    if (apagadoRef.current) apagadoRef.current.style.opacity = (tS * 0.78).toFixed(3);
    dron.style.opacity = (1 - tS).toFixed(3);
    if (sistemaRef.current) {
      const t = suave(tramo(p, [0.82, 0.87]));
      sistemaRef.current.style.opacity = t.toFixed(3);
      sistemaRef.current.style.transform = `translate3d(0, ${((1 - t) * 28).toFixed(1)}px, 0)`;
      sistemaRef.current.style.visibility = t > 0.001 ? "visible" : "hidden";
    }
    diferenciasRef.current.forEach((el, i) => {
      if (!el) return;
      const hecha = p >= DIFERENCIAS[i].resuelta;
      if (el.dataset.hecha !== String(hecha)) el.dataset.hecha = String(hecha);
    });
  }, [fotograma, movil]);

  const avance = tactil ? scrollYProgress : resorte;
  // En táctil el scroll pasa por el ritmo antes de mover la escena.
  const recorrido = useCallback((v) => (tactil ? RITMO.recorridoDe(v) : v), [tactil]);
  leerRecorridoRef.current = () => recorrido(avance.get());
  useMotionValueEvent(avance, "change", (v) => aplicar(recorrido(v)));
  useEffect(() => {
    aplicar(recorrido(avance.get()));
    const r = () => aplicar(recorrido(avance.get()));
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, [aplicar, avance, recorrido]);

  const frameCount = movil ? 90 : 180;
  const srcFor = useCallback(
    (i) => (movil ? `/renders/drone/mobile/${pad(i * 2 + 1)}.webp` : `/renders/drone/desktop/${pad(i + 1)}.webp`),
    [movil]
  );
  const cropFor = useCallback((i) => DRONE_TRACK[movil ? i * 2 : i], [movil]);

  /* El render trae al dron algo a la izquierda del centro (0.446); se corrige
     para que su centro, y no el del cuadro, quede en el eje de la pantalla. */
  const anchoDron = movil ? "230vw" : "min(100vw, 1500px)";

  return (
    /* data-ah-oscuro: el header lo lee y pone el logo y el menú en blanco. */
    /* Fondo oscuro en todo el main: las secciones de abajo entran con una
       animación (ScrollEffects) y, mientras están transparentes, se veía el
       fondo blanco de la página. */
    <main data-ah-oscuro className="bg-[#070b12]">
    {/*
      Alto del recorrido: cuánto scroll cuesta la historia entera. En celular
      la mitad, porque ahí se desliza rápido y con 14 pantallas se sentía
      eterno. svh y no vh: en Safari de iPhone vh cambia cuando la barra del
      navegador aparece o se esconde, y la escena saltaba.
    */}
    <section
      ref={seccionRef}
      data-ah-no-reveal
      className="relative bg-[#070b12] text-white"
      style={{ height: movil ? "750svh" : "1300vh" }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* El mundo: fachada y, en el hueco de la puerta, el interior. */}
        <div
          ref={mundoRef}
          className="absolute left-1/2 top-1/2"
          style={{
            width: `max(100vw, calc(100vh * ${FACHADA.w / FACHADA.h}))`,
            aspectRatio: `${FACHADA.w} / ${FACHADA.h}`,
            translate: "-50% -50%",
            transformOrigin: `${PUERTA_CX * 100}% ${PUERTA_CY * 100}%`,
            /* will-change solo en pantallas táctiles. Con él la foto se dibuja
               una vez y se estira como textura al escalar: fluido, pero de
               cerca algo borroso. Sin él se redibuja a cada tamaño: nítido,
               pero en un iPhone (pantalla de alta densidad, Safari) trababa
               el scroll. En pantalla chica la diferencia de nitidez casi no se
               ve; en computadora se queda nítido. */
            willChange: tactil ? "transform" : undefined,
          }}
        >
          <img src={FACHADA.src} alt="" className="absolute inset-0 h-full w-full" draggable="false" />
          <div
            className="absolute overflow-hidden"
            style={{
              left: `${(PUERTA.x0 / FACHADA.w) * 100}%`,
              top: `${(PUERTA.y0 / FACHADA.h) * 100}%`,
              width: `${PUERTA_W * 100}%`,
              height: `${PUERTA_H * 100}%`,
            }}
          >
            {/* La foto del pasillo con su proporción real (3:2), centrada y
                cubriendo el alto de la puerta. */}
            <div ref={interiorRef} className="absolute inset-0" style={{ willChange: tactil ? "transform" : undefined }}>
              <div
                className="absolute left-1/2 top-0 h-full -translate-x-1/2 bg-[length:100%_100%]"
                style={{ backgroundImage: `url('${ELEGIDA.pasillo}')`, aspectRatio: `${PASILLO.w} / ${PASILLO.h}` }}
              >
              </div>
            </div>
            {/*
              Entonado desde la calle: un poco más oscuro, para que no brille
              más que la noche de afuera, y una sombra bajo el dintel, que es
              lo que hace que se lea como un hueco en la pared y no como una
              estampa. Se va poco a poco mientras se cruza la puerta.
            */}
            {/*
              Una sola capa que multiplica directo sobre el pasillo: gris (lo
              oscurece sin cambiarle el color) y negro arriba (la sombra del
              dintel). Va sola y con su propia opacidad a propósito: cuando
              estas capas vivían dentro de un contenedor con opacity, el
              navegador las mezclaba dentro del contenedor y no con el pasillo,
              y a media transición se veían como un velo gris o café encima.
            */}
            <div
              ref={gradoRef}
              className="absolute inset-0 mix-blend-multiply"
              style={{
                background: ELEGIDA.oscurecerInterior
                  ? "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 22%), #c4c4c4"
                  : "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 18%)",
              }}
            />
          </div>
        </div>

        {/* La toma de cerca del rack, para el conteo. Más ancha que la
            pantalla para poder correrla de lado. */}
        <div
          ref={cercaRef}
          className="absolute left-1/2 top-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url('${ELEGIDA.rack}')`, aspectRatio: "3 / 2", opacity: 0, willChange: "transform, opacity" }}
        />

        {/* Al cruzar, la escena se oscurece un poco: ya no es la calle. */}
        <div ref={velo} className="pointer-events-none absolute inset-0 bg-[#070b12]" style={{ opacity: 0 }} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(4,7,12,0.65)_100%)]" />

        {/* El dron. La perspectiva es la que deja ver el cabeceo hacia adelante. */}
        <div className="pointer-events-none absolute inset-0 z-[11] flex items-center justify-center" style={{ perspective: "900px" }}>
          <div ref={dronRef} style={{ willChange: "transform, opacity" }}>
            <div ref={balanceoRef} className="relative" style={{ width: anchoDron, aspectRatio: "16 / 9", translate: CENTRADO_RENDER }}>
              <ScrollSequence
                progress={fotograma}
                frameCount={frameCount}
                srcFor={srcFor}
                cropFor={cropFor}
                startFrame={movil ? 30 : 60}
                onLoadProgress={(f) => {
                  cargaRef.current.fotogramas = f;
                  avisarCarga();
                }}
                sourceWidth={movil ? 960 : 1920}
                sourceHeight={movil ? 540 : 1080}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>

        {/* Piso oscurecido bajo los textos: el reflejo naranja de la puerta
            y el pie del rack les quitaban contraste. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(0deg,rgba(5,8,14,0.85)_0%,rgba(5,8,14,0.5)_45%,transparent_100%)]" />

        {/* Rack apagado para la escena del sistema. */}
        <div ref={apagadoRef} className="pointer-events-none absolute inset-0 bg-[#05080e]" style={{ opacity: 0 }} />

        {/* Las palabras-obstáculo, en 3D sobre el pasillo. Van detrás del dron
            (él lleva z-[11]) y se desvanecen antes de alcanzar su
            profundidad, así que nunca lo tapan. */}
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          style={{ perspective: `${PERSPECTIVA}px`, perspectiveOrigin: "50% 47%" }}
        >
          {PALABRAS.map((w, i) => (
            <div
              key={i}
              ref={(el) => (palabrasRef.current[i] = el)}
              className="absolute left-1/2 top-1/2 whitespace-nowrap text-[clamp(52px,10vw,150px)] font-semibold leading-none tracking-tight text-white [text-shadow:0_8px_40px_rgba(0,0,0,0.55)]"
              style={{ opacity: 0, visibility: "hidden", willChange: "transform, opacity" }}
            >
              {lista("obstaculos")[i]}
            </div>
          ))}
        </div>

        {/*
          Cada escena tiene su propia composición, para que no sean todas el
          mismo título abajo a la izquierda: el gancho y el problema abajo a la
          izquierda sobre el piso; "Conoce…" a la derecha, del lado contrario a
          donde vuela el dron; "Tu turno sigue" centrado, como remate del pasillo.
        */}
        <div ref={(el) => (textosRef.current.gancho = el)} className="ah-container pointer-events-none absolute inset-x-0 bottom-14 z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">{tx("kicker")}</p>
          {/* Una frase por renglón, sin partir: "10,000" solo en su línea
              pierde la comparación con "9,214". */}
          <h1 className="mt-4 text-[1.7rem] font-semibold leading-[1.1] sm:text-6xl">
            <span className="block sm:whitespace-nowrap">{tx("gancho_1")}</span>
            <span className="block text-white/50 sm:whitespace-nowrap">{tx("gancho_2")}</span>
          </h1>
          <p className="mt-4 max-w-md text-base text-white/70">{tx("gancho_sub")}</p>
        </div>

        <div ref={(el) => (textosRef.current.problema = el)} className="ah-container pointer-events-none absolute inset-x-0 bottom-14 z-10" style={{ opacity: 0, visibility: "hidden" }}>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">{tx("problema_kicker")}</p>
          <ul className="mt-5 grid max-w-5xl gap-5 sm:grid-cols-3 sm:gap-10">
            {lista("problemas").map((item, i) => (
              <li key={i} ref={(el) => (problemasRef.current[i] = el)} className="border-l-2 border-[#f5b549]/70 pl-4" style={{ opacity: 0 }}>
                <p className="text-2xl font-semibold leading-tight sm:whitespace-nowrap sm:text-3xl">{item.dato}</p>
                <p className="mt-1 text-sm leading-snug text-white/65">{item.texto}</p>
              </li>
            ))}
          </ul>
        </div>

        <div ref={(el) => (textosRef.current.conoce = el)} className="ah-container pointer-events-none absolute inset-x-0 bottom-14 z-10 flex flex-col items-end text-right" style={{ opacity: 0, visibility: "hidden" }}>
          <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-5xl">{tx("conoce_titulo")}</h2>
          <p className="mt-3 max-w-md text-base text-white/70">{tx("conoce_texto")}</p>
        </div>

        <div ref={(el) => (textosRef.current.sinParar = el)} className="ah-container pointer-events-none absolute inset-x-0 bottom-14 z-10 flex flex-col items-center text-center" style={{ opacity: 0, visibility: "hidden" }}>
          <h2 className="text-4xl font-semibold leading-tight sm:text-6xl">{tx("sin_parar_titulo")}</h2>
          <p className="mt-3 max-w-md text-base text-white/70">{tx("sin_parar_texto")}</p>
        </div>

        {/* Conteo: el titular abajo, los contadores arriba a la derecha y cada
            lectura brotando junto al dron. */}
        <div ref={(el) => (textosRef.current.cuenta = el)} className="pointer-events-none absolute inset-0 z-10" style={{ opacity: 0, visibility: "hidden" }}>
          <div className="ah-container absolute inset-x-0 bottom-14">
            <h2 className="max-w-xl text-3xl font-semibold leading-tight sm:text-5xl">{tx("cuenta_titulo")}</h2>
          </div>
          <div className="absolute inset-x-4 top-20 rounded-2xl bg-[#070b12]/85 p-4 ring-1 ring-white/10 md:left-auto md:right-8 md:top-24 md:w-[15rem]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/50">{tx("cuenta_rack")}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p ref={etiquetasRef} className="font-mono text-3xl font-semibold tabular-nums">0</p>
                <p className="text-[0.7rem] text-white/55">{tx("cuenta_etiquetas")}</p>
              </div>
              <div>
                <p ref={ubicacionesRef} className="font-mono text-3xl font-semibold tabular-nums">0</p>
                <p className="text-[0.7rem] text-white/55">{tx("cuenta_ubicaciones")}</p>
              </div>
            </div>
            <p ref={alertaRef} className="mt-3 border-t border-white/10 pt-3 text-[0.75rem] font-medium text-[#f5b549]" style={{ opacity: 0 }}>
              {tx("cuenta_alerta")}
            </p>
          </div>
          {/* Las lecturas salen arriba a la derecha del dron, que en esta
              escena está fijo al centro: la cámara es la que se mueve. */}
          {/* En celular salen centradas bajo el panel de contadores: a la
              derecha del dron se encimaban con el panel y se salían de la
              pantalla. */}
          <div className="absolute left-1/2 top-[37%] md:top-[34%] md:ml-[9vw]">
            {LECTURAS.map((l, i) => (
              <div
                key={l.ubicacion}
                ref={(el) => (lecturasRef.current[i] = el)}
                className={`absolute left-0 top-0 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full md:translate-x-0 px-3 py-1.5 text-[0.78rem] font-medium ring-1 ${
                  l.bien ? "bg-[#0d1524]/85 text-white ring-white/15" : "bg-[#3a2a0c]/90 text-[#f5c86b] ring-[#f5b549]/40"
                }`}
                style={{ opacity: 0 }}
              >
                <span className="font-mono">{l.ubicacion}</span>
                <span className="text-white/60">·</span>
                <span>{lista("lecturas")[i]}</span>
                <span>{l.bien ? "✓" : "⚠"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Del vuelo al sistema. */}
        <div ref={sistemaRef} className="pointer-events-none absolute inset-0 z-10 overflow-y-auto" style={{ opacity: 0, visibility: "hidden" }}>
          <div className="ah-container flex min-h-full flex-col justify-center gap-5 py-16 sm:gap-8 sm:py-24">
            <div ref={(el) => (textosRef.current.sistema = el)}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">{tx("sistema_kicker")}</p>
              <h2 className="mt-3 max-w-2xl text-[1.7rem] font-semibold leading-tight sm:text-5xl">
                {tx("sistema_titulo_1")}
                <br />
                <span className="text-[#7fa2ff]">{tx("sistema_titulo_2")}</span>
              </h2>
              {/* En pantallas bajas se omite: sin él la escena cabe en cualquier
                  teléfono, y el titular y la tarjeta ya cuentan la idea. */}
              <p className="mt-3 max-w-lg text-sm text-white/70 sm:text-base [@media(max-height:760px)]:hidden">
                {tx("sistema_texto")}
              </p>
            </div>
            <div className="flex flex-wrap items-start gap-6">
              <div className="hidden md:block">
                <TarjetaConteo porRevisar={DIFERENCIAS.length} />
              </div>
              <article className="w-full max-w-[26rem] rounded-2xl bg-[#0d1524] p-5 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(150deg,#3f6ddb,#2b50ac)] text-sm font-semibold">IA</span>
                  <div>
                    <p className="text-sm font-semibold">{tx("agente_nombre")}</p>
                    <p className="text-[0.7rem] text-white/50">{tx("agente_vuelo")}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-3">
                  {DIFERENCIAS.map((d, i) => (
                    <li key={d.ubicacion} ref={(el) => (diferenciasRef.current[i] = el)} data-hecha="false" className="group rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[0.78rem] text-white/85">{d.ubicacion}</span>
                        <span className="rounded-md bg-[#f5b549]/15 px-2 py-0.5 text-[0.65rem] font-semibold text-[#f5b549] group-data-[hecha=true]:hidden">{tx("detectada")}</span>
                        <span className="hidden rounded-md bg-[#54b385]/15 px-2 py-0.5 text-[0.65rem] font-semibold text-[#6fd3a2] group-data-[hecha=true]:inline">{tx("resuelta")}</span>
                      </div>
                      <p className="mt-1 text-[0.78rem] text-white/60">{lista("diferencias")[i].problema}</p>
                      <p className="mt-1 hidden text-[0.78rem] text-[#6fd3a2] group-data-[hecha=true]:block">→ {lista("diferencias")[i].accion}</p>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Resultados />
    <Llamado />
    </main>
  );
};

/* ---------- Después del recorrido: la prueba y el siguiente paso ---------- */

/** Resultados: rangos de la industria, no de un cliente. */
const Resultados = () => {
  const { t } = useTranslation();
  return (
    /* data-ah-no-reveal: sin la animación de entrada, que la dejaba
       transparente un instante y se veía el fondo blanco de la página. */
    <section data-ah-no-reveal className="bg-[#070b12] py-24 text-white sm:py-32">
      <div className="ah-container">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">{t("inicio.resultado_kicker")}</p>
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-5xl">{t("inicio.resultado_titulo")}</h2>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-3">
          {t("inicio.resultados", { returnObjects: true }).map((r) => (
            <div key={r.que} className="bg-[#0a101b] p-8">
              <p className="text-sm text-white/45 line-through decoration-white/30">{r.antes}</p>
              <p className="mt-1 text-5xl font-semibold tracking-tight text-[#7fa2ff]">{r.despues}</p>
              <p className="mt-4 text-sm text-white/70">{r.que}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Llamado = () => {
  const { t } = useTranslation();
  return (
  // Mide al menos una pantalla y centra su contenido: más bajo que la
  // pantalla, al llegar al fondo se asomaba arriba el final de los resultados.
  <section data-ah-no-reveal className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#070b12] py-28 text-white sm:py-40">
    {/* El pasillo de nuevo, muy apagado: cierra donde empezó la historia. */}
    <div className="absolute inset-0 bg-[url('/pasillo-racks.webp')] bg-cover bg-center opacity-20" />
    <div className="absolute inset-0 bg-[linear-gradient(180deg,#070b12_0%,rgba(7,11,18,0.6)_50%,#070b12_100%)]" />
    <div className="ah-container relative w-full text-center">
      <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">{t("inicio.llamado_titulo")}</h2>
      <p className="mx-auto mt-5 max-w-xl text-base text-white/70">
        {t("inicio.llamado_texto")}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/diagnostico-gratis"
          className="inline-flex items-center gap-2 rounded-full bg-[#2A47F6] px-7 py-3.5 text-sm font-semibold shadow-[0_10px_30px_rgba(42,71,246,0.45)] transition hover:bg-[#3d5aff]"
        >
          {t("inicio.llamado_boton")} <ArrowRight size={16} />
        </Link>
        <a
          href="https://wa.me/528116070330"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full px-6 py-3.5 text-sm font-semibold text-white/80 ring-1 ring-white/20 transition hover:bg-white/5"
        >
          {t("inicio.llamado_whatsapp")}
        </a>
      </div>
    </div>
  </section>
  );
};

export default EntradaAlmacen;
