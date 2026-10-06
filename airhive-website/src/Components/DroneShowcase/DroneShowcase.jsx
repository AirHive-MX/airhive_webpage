import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
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
 * - el panel de texto se coloca solo del lado contrario,
 * - los globos se apartan cuando el dron se les echa encima,
 * - en móvil, la cámara lo sigue para tenerlo centrado.
 *
 * Antes también lo encuadraba una retícula (cuatro esquinas) con una línea
 * guía hasta el panel; se quitaron.
 *
 * Nada de eso está a mano: si cambia la animación se regenera droneTrack.js y
 * el encuadre se reacomoda solo.
 */

const TOTAL_FRAMES = 360;

/**
 * Fotograma donde arranca el recorrido.
 *
 * Los renders traen una vuelta entera en los fotogramas 0-120, empezando de
 * espaldas: el dron queda de frente en el 60 y de vuelta de espaldas en el
 * 120, justo donde enciende motores. Arrancando en el 60 se abre con el dron
 * de frente y el giro queda en media vuelta, 180°, que enlaza igual con el
 * despegue. Los fotogramas 0-59 ni se descargan.
 */
const INICIO = 60;

/**
 * El almacén entra cuando el dron deja de girar y se pone a escanear: antes es
 * una pieza de hardware sobre fondo neutro, a partir de aquí está trabajando.
 */
const SCENE_FROM = 120; // fotograma en que empieza a aparecer el almacén
const SCENE_FADE = 18; // fotogramas que tarda en asentar

/**
 * La nave se va ANTES de que entren los racks, no a la vez. Cruzándolas se
 * ven las dos fotos superpuestas a media opacidad y parece doble exposición;
 * así, entre una y otra queda un instante del fondo oscuro de la sección, que
 * se lee como corte y no como mezcla.
 */
const NAVE_FADE = 18; // fotogramas que tarda en irse, terminando en SCENE_FROM

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
/* La nave acompaña el giro; los racks entran cuando empieza el escaneo. Se
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
 * Sin backdrop-blur: a 90% de opacidad el desenfoque no se nota, y obligaba a
 * recalcular el fondo detrás de cada globo en cada fotograma mientras suben.
 *
 * El color no va en el fondo ni en el borde: va en un filo de 3px a la
 * izquierda. Es lo único que cambia de un acto a otro y basta para
 * identificarlo, sin teñir el texto ni encerrarlo.
 */
const GLOBO =
  "relative overflow-hidden rounded-[14px] shadow-[0_26px_70px_-28px_rgba(0,0,0,0.85)] ring-1 transition-colors duration-700";

/**
 * La superficie cambia con el fondo que hay detrás.
 *
 * Medida sobre las propias fotos: la nave de carga promedia un gris frío
 * (#50626E) y los racks uno cálido (#836E60), porque son cartón. El azul muy
 * oscuro se apoya bien en el primero, pero sobre el segundo se lee como un
 * recorte de la escena anterior pegado encima: es el color complementario
 * justo del fondo. Del acto 2 en adelante la superficie pasa a un grafito
 * cálido, que es lo que se pone en impresión sobre una imagen cálida. Sigue
 * siendo casi negro, pero pertenece a la foto en vez de discutir con ella.
 *
 * El cambio cae en el fotograma 120, que es donde entra el almacén y donde el
 * panel cambia de texto de todas formas: se releva junto con el contenido, no
 * como un recoloreado a media frase.
 */
const SUPERFICIE = {
  nave: "bg-[#0A1322]/90 ring-white/[0.07]",
  almacen: "bg-[#17130F]/92 ring-white/[0.10]",
};

/** Los globos del epílogo no pertenecen a ningún acto: llevan el azul de marca. */
const ACENTO_EPILOGO = "#2A47F6";

/**
 * Lo que la pantalla de carga espera antes de retirarse: todo.
 *
 * Antes se iba con la primera pasada del precargador, un fotograma de cada 16.
 * Con eso ya se podía hacer scroll, pero los 12 MB restantes seguían entrando
 * por detrás: se enseñaba el 100% y la página seguía cargando, que es justo lo
 * que hace que el número no signifique nada.
 *
 * Ahora la cuenta es la de verdad: los 360 fotogramas y las dos fotos de
 * fondo. Son 13.4 MB, entre 1 y 4 segundos en una conexión normal, y en las
 * visitas siguientes casi nada porque ya están en caché —los encabezados que
 * lo permiten van en vercel.json; sin ellos Vercel revalida los 360 archivos
 * en cada visita, que era la otra mitad del problema—. En móvil son 5.1 MB.
 *
 * Los pesos salen de lo que ocupa cada parte, no a ojo, para que el número
 * suba parejo en vez de a saltos.
 */
const CARGA_PESO_FRAMES = 0.88; // 3.2 MB de 3.7
const CARGA_PESO_FONDOS = 0.12; // 0.47 MB entre las dos fotos

/*
 * Pero "todo" resultó demasiado: 13 MB son más de 6 s en cada recarga, y la
 * pantalla de carga se volvía lo más lento de la página. Ahora espera a la
 * pasada de un fotograma de cada CARGA_PASADA (75 de los 300 que se usan, unos 3 MB). Con eso
 * la vuelta completa ya se ve fluida, porque ScrollSequence pinta el más
 * cercano que haya; el resto llega por detrás y solo afina el giro. El 100%
 * sigue siendo verdad en lo que importa: el recorrido entero ya se puede ver.
 */
const CARGA_PASADA = 4;

const SCENE_ZOOM = "120%";
const SCENE_POS = "33%";

/**
 * En móvil la foto se aleja todo lo que se puede.
 *
 * El alto de la foto manda el ancho de una estantería en pantalla, así que
 * cuanto más alta, menos cajas caben. A 120% en un teléfono se veía poco más
 * de una estantería y parecía estar pegado a ella. 100% es el tope: por debajo
 * la foto deja de cubrir el alto y, como solo se repite en horizontal,
 * aparecerían franjas vacías arriba y abajo.
 *
 * Al no sobrar alto, la posición vertical deja de tener efecto y se ve la foto
 * entera: las tres bandas de cajas, con el dron a la altura de la del medio.
 */
const SCENE_ZOOM_MOVIL = "100%";

/**
 * El dron se dibuja un 28% más grande que el escenario, para que domine sobre
 * la mercancía. 1.28 es el tope: por encima, en su punto más bajo se sale por
 * abajo de la pantalla en las resoluciones cortas.
 */
const DRONE_SCALE = 1.28;

/**
 * En móvil la cámara sigue al dron.
 *
 * Con el encuadre fijo de escritorio, en una pantalla vertical el dron salía a
 * menos de la mitad del ancho, con media pantalla de piso vacío debajo, y al
 * desplazarse en el vuelo se pegaba al borde y perdía una hélice. Aquí se
 * dibuja bastante más grande y el lienzo se desplaza para que el dron se quede
 * cerca del centro: en horizontal casi del todo, en vertical solo en parte,
 * para que la bajada al rack se siga leyendo como bajada. El fondo se corre en
 * la misma dirección pero menos, así que el vuelo se siente por paralaje en
 * vez de por el dron cruzando la pantalla.
 *
 * DRONE_SCALE_MOVIL es el tamaño: con 2.2 el dron ocupa unos cuatro quintos
 * del ancho. SIGUE_X y SIGUE_Y son cuánto del desplazamiento absorbe la cámara
 * (1 = el dron no se mueve en pantalla). ALTURA_DRON_MOVIL es dónde reposa
 * su centro, como fracción del alto: por encima de la franja de los globos y
 * por debajo del titular. PARALAJE es cuánto acompaña el fondo a la cámara.
 */
const DRONE_SCALE_MOVIL = 2.2;
const SIGUE_X = 0.95;
const SIGUE_Y = 0.75;
const ALTURA_DRON_MOVIL = 0.46;
const PARALAJE = 0.5;

/**
 * Barrido del conteo: mientras el dron cuenta cajas, el pasillo pasa por detrás.
 *
 * Los renders tienen al dron quieto frente al rack durante el conteo, así que
 * el desplazamiento lateral se hace con la cámara: la foto de los racks (que se
 * repite en horizontal) se corre BARRIDO_TRAMOS veces su ancho entre
 * BARRIDO_DESDE y BARRIDO_HASTA, y el dron se inclina hasta INCLINACION_MAX
 * grados hacia donde avanza, como hace uno de verdad al trasladarse. Al acabar
 * el fondo se queda donde llegó, sin volver.
 *
 * RACKS_PROPORCION es ancho entre alto de fondo-racks.webp (2132x1888).
 */
const BARRIDO_DESDE = 178; // arranca el acto del conteo
const BARRIDO_HASTA = 214; // y termina con él
const BARRIDO_TRAMOS = 1;
const INCLINACION_MAX = 4;
const RACKS_PROPORCION = 2132 / 1888;
const MOBILE_FRAMES = 180; // Un fotograma de cada dos: la mitad de bytes en móvil.

/**
 * Capítulos alineados a la coreografía real, no repartidos en cuartos iguales.
 * `until` es el fotograma donde termina cada uno.
 */
const CHAPTERS = [
  { key: "inspection", until: 120, accent: "#2A47F6", readout: null },
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
  { hasta: INICIO + 12, peso: 1.8 }, // el titular, antes de que empiece a girar
  { hasta: 108, peso: 1.0 }, // la media vuelta, de frente a espaldas
  { hasta: 132, peso: 1.7 }, // se va la nave y entran los racks
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
  let desde = INICIO;
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
/**
 * Actos en que el globo va donde está el dron, no enfrente.
 *
 * La regla de abajo lo manda al cuadrante contrario para que no se tapen. En
 * el acto 4 interesa justo lo contrario: el dron gana altura por la derecha, y
 * dejándole el globo en mitad de la subida el texto pasa a ser el obstáculo.
 * Se queda parado el rato de lectura y, en cuanto puede, se quita porque el
 * dron se le echa encima.
 */
const EN_EL_PASO = new Set([3]);

const CHAPTER_SIDES = CHAPTERS.map((chapter, index) => {
  const from = index === 0 ? INICIO : CHAPTERS[index - 1].until;
  const frames = DRONE_TRACK.slice(from, chapter.until);
  const avg = frames.reduce((sum, box) => sum + centerOf(box)[0], 0) / frames.length;
  const dondeVaElDron = avg > 0.5 ? "right" : "left";
  const enfrente = avg > 0.5 ? "left" : "right";
  return EN_EL_PASO.has(index) ? dondeVaElDron : enfrente;
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
    desde: index === 0 ? INICIO : CHAPTERS[index - 1].until,
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
 * Lo que se le reserva a un globo que aparca fuera del centro: abajo la barra
 * de los actos, arriba la franja de la navegación.
 */
const SUELO_CREDITO = 100;
const TECHO_CREDITO = 84;

/**
 * En móvil los globos no hacen el recorrido de créditos.
 *
 * Allí no hay dos columnas: el globo cruza por donde vuela el dron y lo tapa
 * medio trayecto, por mucho que se le busque sitio para aparcar. Así que en
 * pantalla estrecha se quedan en una franja fija abajo y se relevan en el
 * sitio: se va uno y entra el siguiente, con el dron siempre despejado arriba.
 *
 * SUELO_MOVIL es lo que se reserva por debajo. Ya no hay barra de actos que
 * librar, solo el aire del borde y la pista de scroll.
 * ENTRADA_MOVIL es la parte del tramo que se usa para aparecer y para
 * desaparecer. Como los tramos van pegados, al terminar uno su opacidad vale
 * cero justo cuando la del siguiente empieza a subir: nunca se solapan dos.
 */
const SUELO_MOVIL = 44;
const ENTRADA_MOVIL = 0.08; // corto: a media opacidad el texto se encima con la foto y se lee sucio
const DESLIZ_MOVIL = 12; // el pelín que sube al entrar y al salir

/**
 * Dónde se planta cada globo mientras se lee. Si no está aquí, en el centro.
 *
 * Los que comparten carril con el dron no pueden quedarse en medio, porque ahí
 * los tapa. Medido sobre la trayectoria: en el acto 4 el dron ocupa de y 228 a
 * 596 de 729, y en el epílogo de 331 a 605, así que un globo centrado queda
 * dentro de su caja en los dos casos. Apartándolos al borde que el dron deja
 * libre quedan holguras de 45 px arriba en el epílogo y el roce de las patas
 * abajo en el acto 4: se siguen rozando, que es lo que se busca, pero ya no se
 * tapan.
 */
const REPOSO = { "acto-3": "abajo", "nota-0": "arriba", "nota-1": "arriba" };

/**
 * Fotograma en que el titular de portada se va, en móvil.
 *
 * En escritorio dura todo el acto 1 y no estorba: el globo vive en la columna
 * de la derecha y el titular en la izquierda. En móvil comparten la única
 * columna que hay, y el primer globo le subía por encima. Aquí se retira justo
 * antes de que asome, que además es lo que hace que el globo se lea como lo que
 * viene después y no como algo encimado.
 */
const TITULO_HASTA_MOVIL = INICIO + 14;

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
 * A qué distancia, en píxeles entre las dos cajas, el globo da por hecho que
 * el dron se le viene encima. Medido sobre la trayectoria real: en el acto 1
 * el dron pasa a 116 px del globo de la derecha y en el epílogo las notas se
 * solapan con él directamente, así que 130 recoge los roces de verdad y deja
 * fuera los acercamientos que no se leerían como tales.
 */
const ROCE = 130;

/** Lo mínimo que sube antes de poder huir: ningún globo entra y sale de golpe. */
const SUBIDA_MIN = 0.18;

/**
 * Parte lineal de la salida cuando huye, o sea la velocidad con la que sale.
 *
 * Es lo único que distingue irse porque toca de quitarse de en medio: con 0 la
 * salida arranca desde parado y el globo se despega despacio; con 0.6 sale ya
 * lanzado desde el primer píxel. Sube recto y nada más — se probó ladearlo y
 * apartarlo hacia un lado para marcar de dónde venía el empujón, y lo que se
 * leía era un globo torcido, no un globo esquivando.
 */
const ARRANQUE = 0.6;

/** Dónde termina la pausa si al globo no lo espanta nadie. */
const SALIDA_POR_RELOJ = (1 + PAUSA) / 2;

/**
 * Scroll dentro del tramo -> posición en el trayecto, los dos de 0 a 1.
 *
 * `salida` es el punto en que se acaba la pausa, y es lo que permite que un
 * globo se quite justo cuando el dron le llega encima en vez de a su hora. La
 * pausa mide siempre PAUSA, así que mover la salida cambia cuándo se lee, no
 * cuánto: lo que se reparte distinto es el trecho de subida y el de bajada.
 *
 * Las dos mitades que se mueven llevan su propia curva para que la parada no
 * se note como un frenazo: la de subida llega al centro con velocidad cero y
 * la de salida arranca desde cero, así que en las costuras de la pausa no hay
 * tirón... salvo cuando `arranque` es mayor que cero. Eso añade un término
 * lineal a la salida, o sea velocidad inicial, o sea un respingo: es la
 * diferencia entre irse porque toca e irse porque casi te dan.
 */
const recorrido = (p, salida = SALIDA_POR_RELOJ, arranque = 0) => {
  const subida = salida - PAUSA;
  const bajada = 1 - salida;
  if (p <= subida) {
    const x = subida > 0 ? p / subida : 1;
    return 0.5 * (1 - (1 - x) * (1 - x)); // llega al centro y se detiene
  }
  if (p < salida) return 0.5; // quieto en mitad de la pantalla
  const x = bajada > 0 ? (p - salida) / bajada : 1;
  return 0.5 + 0.5 * (arranque * x + (1 - arranque) * x * x);
};

/** Dónde cruza cada globo: el carril es fijo, solo cambia la altura. */
const carrilDe = (globo, enMovil) => {
  if (enMovil) return "inset-x-6";  // un solo carril: no hay sitio para dos
  if (globo.tipo === "tarjeta") return "left-6 lg:left-[5%]";
  if (globo.tipo === "nota") return "right-6 w-[17rem] lg:right-[5%]";
  const lado = CHAPTER_SIDES[globo.indice] === "right" ? "right-6 lg:right-[5%]" : "left-6 lg:left-[5%]";
  /* Los que van en el paso del dron son más estrechos: a 22rem el carril
     empieza donde el dron todavía tiene brazo, y a 17rem lo libera. Las dos
     clases van escritas enteras porque Tailwind lee el código fuente: una
     interpolación aquí dentro no le genera nada. */
  /* La variante por alto es para el móvil en horizontal: ahí sobra ancho y
     falta alto, así que el globo se estrecha para no comerse la escena. */
  const ancho = EN_EL_PASO.has(globo.indice)
    ? "w-[min(17rem,calc(100%-3rem))] [@media(max-height:520px)]:w-[min(15rem,calc(100%-3rem))]"
    : "w-[min(22rem,calc(100%-3rem))] [@media(max-height:520px)]:w-[min(17rem,calc(100%-3rem))]";
  return `${lado} ${ancho}`;
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
      className={`${GLOBO} ${
        indice === 0 ? SUPERFICIE.nave : SUPERFICIE.almacen
      } px-6 py-5 [@media(max-height:520px)]:px-5 [@media(max-height:520px)]:py-3.5`}
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
      <h3 className="mt-3 text-[1.3rem] font-semibold leading-[1.18] tracking-[-0.015em] sm:text-[1.45rem] [@media(max-height:520px)]:mt-2 [@media(max-height:520px)]:text-[1.05rem]">
        {t(`showcase.chapters.${acto.key}.title`)}
      </h3>
      <p className="mt-2.5 text-[0.85rem] leading-[1.65] text-white/60 [@media(max-height:520px)]:mt-1.5 [@media(max-height:520px)]:text-[0.74rem] [@media(max-height:520px)]:leading-[1.5]">
        {t(`showcase.chapters.${acto.key}.text`)}
      </p>
    </div>
  );
};

/** El globo del epílogo: qué es lo que enseña la tarjeta de al lado. */
const GloboNota = ({ pasos }) => (
  <div
    className={`${GLOBO} ${SUPERFICIE.almacen} px-5 py-4 [@media(max-height:520px)]:px-4 [@media(max-height:520px)]:py-3`}
  >
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
        <li
          key={paso}
          className="flex gap-3 py-2.5 first:pt-0 last:pb-0 [@media(max-height:520px)]:py-1.5"
        >
          <span
            className="mt-px shrink-0 font-mono text-[0.62rem] tabular-nums"
            style={{ color: ACENTO_EPILOGO }}
          >
            {pad(i + 1).slice(2)}
          </span>
          <p className="text-[0.8rem] leading-[1.5] text-white/70 [@media(max-height:520px)]:text-[0.72rem]">
            {paso}
          </p>
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
  const pathDotRef = useRef(null);
  const sceneRef = useRef(null);
  const racksRef = useRef(null); // la foto de los racks, que se corre con la cámara en móvil
  const naveRef = useRef(null);

  const layoutRef = useRef(null); // dónde queda dibujado el render dentro del canvas
  // Altura a la que reposa el dron, en píxeles del viewport. La caída de luz del
  // fondo se centra ahí, así que hace falta en el render y por eso vive en estado.
  const [horizonte, setHorizonte] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const movilRef = useRef(false); // el mismo dato, para los callbacks
  const [portada, setPortada] = useState(true);
  const [chapter, setChapter] = useState(0);

  /* La capa de créditos y cada globo dentro de ella. */
  const capaRef = useRef(null);
  const globosRef = useRef({});
  const altosRef = useRef({}); // alto de cada globo, cacheado
  const salidasRef = useRef({}); // dónde se le acaba la pausa a cada globo
  const recalculoRef = useRef(0); // rAF pendiente del recálculo de salidas
  const firmaRef = useRef(""); // encuadre con el que se calcularon
  const frameRef = useRef(0); // último fotograma pintado, para recolocar al redimensionar

  const tarjetasRef = useRef({});
  const [escalas, setEscalas] = useState({ 0: 1, 1: 1 });
  const fondosRef = useRef(0); // fotos de fondo ya descargadas, de 2
  const fraccionRef = useRef(0); // parte de los fotogramas ya descargada
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
   * `scrollYProgress`, para que la secuencia, los fondos y las
   * tarjetas vayan todos por la misma curva.
   */
  const avanceCrudo = useTransform(scrollYProgress, avanceDelScroll);

  /*
   * Y de ahí a un muelle, que es lo que hace que el vuelo se vea fluido.
   *
   * El scroll no llega continuo: una muesca de rueda es un salto instantáneo
   * de 100 px, o sea cinco fotogramas de golpe, y el dron daba el tirón entero
   * en una sola pintada. El muelle persigue ese destino en vez de saltar a él,
   * así que los cinco fotogramas se reparten entre las pintadas siguientes.
   *
   * Está justo por encima del amortiguamiento crítico (ζ≈1.05): se asienta en
   * unos 120 ms y, sobre todo, no rebota. Un muelle con rebote aquí haría que
   * el dron se pasara de fotograma y volviera, que es peor que el tirón.
   *
   * Lo gobierna todo, no solo la secuencia: la cámara, los globos y los
   * fondos cuelgan del mismo valor, así que suavizan a la vez y nada se
   * desincroniza.
   */
  const avanceSuave = useSpring(avanceCrudo, {
    stiffness: 300,
    damping: 20,
    mass: 0.3,
    restDelta: 0.0002, // muy por debajo de un fotograma (1/360 = 0.0028)
  });

  // Con movimiento reducido no se interpola nada: el scroll manda directo.
  const avance = reduceMotion ? avanceCrudo : avanceSuave;

  /** Punto del minimapa. Vive en el mismo 0..1 del viewBox. */
  const placeDot = useCallback((cx, cy) => {
    if (!pathDotRef.current) return;
    pathDotRef.current.setAttribute("cx", cx.toFixed(4));
    pathDotRef.current.setAttribute("cy", cy.toFixed(4));
  }, []);

  /**
   * Cámara de móvil: desplaza el lienzo para mantener al dron cerca del centro.
   *
   * Recibe el fotograma sin redondear e interpola la caja entre los dos
   * fotogramas vecinos, para que el encuadre se deslice en vez de ir a
   * escalones. Escribe `transform` y no `translate`, que es la propiedad que
   * usan las clases de Tailwind que centran el lienzo: así no se pisan.
   */
  const placeCamara = useCallback((exacto) => {
    const field = fieldRef.current;
    const stage = stageRef.current;
    const layout = layoutRef.current;
    const racks = racksRef.current;
    if (!field || !stage || !layout) return;

    const f0 = Math.min(TOTAL_FRAMES - 1, Math.max(INICIO, Math.floor(exacto)));
    const f1 = Math.min(TOTAL_FRAMES - 1, f0 + 1);
    const k = exacto - f0;
    const [ax, ay] = centerOf(DRONE_TRACK[f0]);
    const [bx, by] = centerOf(DRONE_TRACK[f1]);
    const cx = ax + (bx - ax) * k;
    const cy = ay + (by - ay) * k;

    /*
     * Barrido lateral del conteo: los racks pasan por detrás y el dron se
     * inclina hacia donde avanza, así que se lee como un vuelo de lado a lo
     * largo del pasillo. Corre en escritorio y en móvil.
     */
    const t = clamp01((exacto - BARRIDO_DESDE) / (BARRIDO_HASTA - BARRIDO_DESDE));
    const suave = t * t * (3 - 2 * t); // arranca y frena, sin tirones
    const altoRacks = racks?.clientHeight ?? window.innerHeight;
    const zoom = parseFloat(movilRef.current ? SCENE_ZOOM_MOVIL : SCENE_ZOOM) / 100;
    const anchoFoto = RACKS_PROPORCION * altoRacks * zoom;
    const barrido = -suave * BARRIDO_TRAMOS * anchoFoto;
    const inclinacion = INCLINACION_MAX * Math.sin(Math.PI * t);

    // El dron gira sobre su propio centro, no sobre el del lienzo.
    const ox = layout.x + cx * layout.width;
    const oy = layout.y + cy * layout.height;
    field.style.transformOrigin = `${ox.toFixed(1)}px ${oy.toFixed(1)}px`;
    const giro = `rotate(${inclinacion.toFixed(2)}deg)`;

    if (!movilRef.current) {
      field.style.transform = inclinacion ? giro : "";
      if (racks) racks.style.backgroundPosition = `calc(50% + ${barrido.toFixed(1)}px) ${SCENE_POS}`;
      return;
    }

    // Dónde cae el dron respecto al centro del lienzo, sin cámara.
    const fw = field.offsetWidth;
    const fh = field.offsetHeight;
    const dx = ox - fw / 2;
    const dy = oy - fh / 2;

    // El centro del lienzo coincide con el del escenario.
    const centroY = stage.offsetTop + stage.clientHeight / 2;
    const objetivoY = window.innerHeight * ALTURA_DRON_MOVIL;
    // 0.5 es la altura a la que reposa mientras gira: ese es el punto fijo.
    const reposoY = layout.y + 0.5 * layout.height - fh / 2;

    const panX = -dx * SIGUE_X;
    const panY = objetivoY - centroY - reposoY - (dy - reposoY) * SIGUE_Y;

    field.style.transform = `translate3d(${panX.toFixed(1)}px, ${panY.toFixed(1)}px, 0) ${giro}`;
    if (racks) {
      racks.style.backgroundPosition = `calc(50% + ${(panX * PARALAJE + barrido).toFixed(1)}px) ${SCENE_POS}`;
    }
  }, []);

  /**
   * Esquina del render dibujado, en coordenadas de la capa de créditos.
   *
   * Se calcula una vez y no por fotograma. Leer offsetLeft o clientWidth
   * obliga al navegador a recalcular la maquetación, y hacerlo dentro de un
   * bucle de 360 iteraciones por ocho globos, justo después de haber escrito
   * transforms, bloqueaba el hilo principal. Con el origen fuera, dentro del
   * bucle solo queda aritmética.
   */
  const origenDron = useCallback(() => {
    const layout = layoutRef.current;
    const stage = stageRef.current;
    const field = fieldRef.current;
    if (!layout || !stage || !field) return null;
    return {
      x: stage.offsetLeft + (stage.clientWidth - field.clientWidth) / 2 + layout.x,
      y: stage.offsetTop + (stage.clientHeight - field.clientHeight) / 2 + layout.y,
      w: layout.width,
      h: layout.height,
    };
  }, []);

  /**
   * Decide, para cada globo, en qué punto de su tramo se le acaba la pausa.
   *
   * La idea es que el texto haga de obstáculo: se queda parado hasta que el
   * dron se le echa encima y entonces se quita. Así que se recorre su tramo
   * buscando el primer fotograma en que el dron le pasa a menos de ROCE, y ese
   * es el punto de salida. Si el dron nunca se le acerca, se va a su hora.
   *
   * Se compara contra la caja del globo APARCADO, no contra dónde esté en ese
   * momento. Si se midiera la posición real, al apartarse dejaría de haber
   * roce, volvería a bajar, y entraría en bucle.
   *
   * Depende del encuadre, así que se recalcula cuando cambia la maquetación y
   * no una vez al montar.
   */
  const calcularSalidas = useCallback(() => {
    const capa = capaRef.current;
    const origen = origenDron();
    if (!capa || !origen) return;
    const alto = capa.clientHeight;

    /* Los roces solo cambian si cambia el encuadre. Sin esta firma se repetía
       el barrido de 360 fotogramas por globo en cada aviso del observador. */
    const firma = [alto, origen.x, origen.y, origen.w, origen.h, movilRef.current].join("|");
    if (firma === firmaRef.current) return;

    /* Todas las lecturas del DOM, de golpe y antes de los bucles. */
    const cajas = GLOBOS.map((globo) => {
      const el = globosRef.current[globo.key];
      const h = altosRef.current[globo.key];
      if (!el || !h) return null;
      return { x0: el.offsetLeft, x1: el.offsetLeft + el.offsetWidth, alto: h };
    });

    /*
     * La firma solo se da por buena si salieron todos. En la primera pasada
     * puede faltar el alto de alguno —la foto del bin llega por red—, y
     * guardándola igualmente ese globo se quedaba sin calcular para siempre:
     * las llamadas siguientes se salían por el atajo antes de volver a verlo.
     */
    if (cajas.every(Boolean)) firmaRef.current = firma;

    GLOBOS.forEach((globo, i) => {
      const caja = cajas[i];
      if (!caja) return;
      const { x0: gx0, x1: gx1 } = caja;
      const [desde, hasta] = tramoDe(globo, movilRef.current);

      const centro = (alto - caja.alto) / 2;
      const sitio = REPOSO[globo.key];
      const reposo =
        sitio === "abajo"
          ? Math.max(alto - caja.alto - SUELO_CREDITO, centro)
          : sitio === "arriba"
            ? Math.min(TECHO_CREDITO, centro)
            : centro;
      const gy0 = reposo;
      const gy1 = reposo + caja.alto;
      let salida = SALIDA_POR_RELOJ;
      let arranque = 0;

      for (let f = desde; f < hasta; f += 1) {
        const p = (f - desde) / (hasta - desde);
        if (p < PAUSA + SUBIDA_MIN) continue; // todavía está subiendo
        if (p > 0.9) break; // tan tarde que ya no se leería como huida

        const [l, t, r, b] = DRONE_TRACK[f] ?? DRONE_TRACK[0];
        const dx0 = origen.x + l * origen.w;
        const dx1 = origen.x + r * origen.w;
        const dy0 = origen.y + t * origen.h;
        const dy1 = origen.y + b * origen.h;

        const hueco =
          Math.max(gx0 - dx1, dx0 - gx1, 0) + Math.max(gy0 - dy1, dy0 - gy1, 0);
        if (hueco <= ROCE) {
          salida = p;
          arranque = ARRANQUE;
          break;
        }
      }

      salidasRef.current[globo.key] = { salida, arranque, reposo };
    });
  }, [origenDron]);

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
    // `frame` llega sin redondear: de eso depende que los globos no vayan a
    // saltos de fotograma entero.
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

      /*
       * Móvil: franja fija abajo y relevo en el sitio, sin recorrido. El globo
       * entra y sale por opacidad, con un desliz de doce píxeles que da vida
       * sin leerse como viaje. Nada de esto toca a escritorio.
       */
      if (movilRef.current) {
        const base = Math.max(TECHO_CREDITO, alto - h - SUELO_MOVIL);
        let opacidad = 1;
        let desliz = 0;
        if (p < ENTRADA_MOVIL) {
          const x = p / ENTRADA_MOVIL;
          opacidad = x;
          desliz = (1 - x) * DESLIZ_MOVIL;
        } else if (p > 1 - ENTRADA_MOVIL) {
          const x = (1 - p) / ENTRADA_MOVIL;
          opacidad = x;
          desliz = -(1 - x) * DESLIZ_MOVIL;
        }
        if (el.style.visibility === "hidden") el.style.visibility = "visible";
        el.style.transform = `translate3d(0, ${(base + desliz).toFixed(2)}px, 0)`;
        el.style.opacity = opacidad.toFixed(3);
        continue;
      }

      const { salida = SALIDA_POR_RELOJ, arranque = 0, reposo } =
        salidasRef.current[globo.key] ?? {};
      const q = recorrido(p, salida, arranque);

      /*
       * q = 0 justo debajo del escenario, q = 0.5 aparcado, q = 1 justo
       * encima. El punto de aparcado no es siempre el centro, así que el
       * trayecto son dos rectas y no una: de abajo al reposo y del reposo a
       * arriba.
       */
      const parada = reposo ?? (alto - h) / 2;
      const abajo = alto + MARGEN_CREDITO;
      const arriba = -(h + MARGEN_CREDITO);
      const y = q <= 0.5 ? abajo + (parada - abajo) * (q / 0.5) : parada + (arriba - parada) * ((q - 0.5) / 0.5);

      if (el.style.visibility === "hidden") el.style.visibility = "visible";
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
      el.style.opacity = Math.min(q / FUNDIDO, (1 - q) / FUNDIDO, 1).toFixed(3);
    }
  }, []);

  /**
   * Pide un recálculo para el siguiente fotograma de pintado.
   *
   * calcularSalidas lee del DOM, y quien lo manda llamar son un ResizeObserver
   * y el onLayout del canvas, que son sitios donde justo se acaba de escribir.
   * Leer ahí mismo obliga a recalcular la maquetación en medio del callback, y
   * con el observador vigilando esos mismos elementos se realimenta hasta
   * colgar la pestaña. Aplazándolo a un rAF se lee una vez, ya asentado, y de
   * paso se agrupan los avisos que lleguen a la vez.
   */
  const recalcularSalidas = useCallback(() => {
    if (recalculoRef.current) return;
    recalculoRef.current = requestAnimationFrame(() => {
      recalculoRef.current = 0;
      calcularSalidas();
      colocarGlobos(frameRef.current);
    });
  }, [calcularSalidas, colocarGlobos]);

  useEffect(() => () => cancelAnimationFrame(recalculoRef.current), []);

  const frameFromProgress = useCallback(
    (value) => Math.min(TOTAL_FRAMES - 1, Math.floor(clamp01(value) * TOTAL_FRAMES)),
    []
  );

  /**
   * El mismo punto del recorrido pero sin redondear.
   *
   * El dron tiene que ir a fotograma entero: es una secuencia de imágenes y no
   * existe nada entre la 100 y la 101. Pero los globos y los fundidos de fondo
   * son CSS, y redondearlos los ataba a esos 360 escalones sin motivo: un globo
   * que cruza 1400 px en 120 fotogramas se movía a saltos de 12 px, y un
   * fundido de 18 fotogramas subía la opacidad de 5 en 5 por ciento, que se ve
   * como bandas. Con el valor exacto se mueven todo lo fino que dé la pantalla.
   */
  const exactoDeProgreso = useCallback((value) => clamp01(value) * TOTAL_FRAMES, []);

  const handleLayout = useCallback(
    (layout) => {
      layoutRef.current = layout;
      const stage = stageRef.current;
      const field = fieldRef.current;
      if (stage && field) {
        const desfase = (stage.clientHeight - field.clientHeight) / 2;
        const y = movilRef.current
          ? window.innerHeight * ALTURA_DRON_MOVIL // ahí lo deja la cámara
          : (stage.offsetTop ?? 84) + desfase + layout.y + 0.502 * layout.height;
        setHorizonte((prev) => (Math.abs(prev - y) < 0.5 ? prev : y));
      }
      placeCamara(exactoDeProgreso(avance.get()));
      // El encuadre acaba de cambiar: con él cambian los roces.
      recalcularSalidas();
    },
    [recalcularSalidas, exactoDeProgreso, placeCamara, avance]
  );

  useMotionValueEvent(avance, "change", (value) => {
    const frame = frameFromProgress(value);
    const exacto = exactoDeProgreso(value);
    const [cx, cy] = centerOf(DRONE_TRACK[frame] ?? DRONE_TRACK[0]);
    const next = chapterAt(frame);

    frameRef.current = exacto;
    placeCamara(exacto);
    colocarGlobos(exacto);

    placeDot(cx, cy);

    const entrada = clamp01((exacto - SCENE_FROM) / SCENE_FADE);
    if (sceneRef.current) sceneRef.current.style.opacity = entrada.toFixed(3);
    if (naveRef.current) {
      naveRef.current.style.opacity = clamp01((SCENE_FROM - exacto) / NAVE_FADE).toFixed(3);
    }

    setChapter((current) => (current === next ? current : next));
    const enPortada = movilRef.current ? frame < TITULO_HASTA_MOVIL : next === 0;
    setPortada((current) => (current === enPortada ? current : enPortada));
  });

  useEffect(() => {
    const frame = frameFromProgress(avance.get());
    const exacto = exactoDeProgreso(avance.get());
    const [cx, cy] = centerOf(DRONE_TRACK[frame] ?? DRONE_TRACK[0]);
    placeDot(cx, cy);

    const entrada = clamp01((exacto - SCENE_FROM) / SCENE_FADE);
    if (sceneRef.current) sceneRef.current.style.opacity = entrada.toFixed(3);
    if (naveRef.current) {
      naveRef.current.style.opacity = clamp01((SCENE_FROM - exacto) / NAVE_FADE).toFixed(3);
    }
    placeCamara(exacto);
    frameRef.current = exacto;
    colocarGlobos(exacto);
  }, [colocarGlobos, exactoDeProgreso, frameFromProgress, placeCamara, placeDot, avance, isMobile]);

  /** Reporta a la pantalla de carga y la retira cuando está todo. */
  const avisarCarga = useCallback(() => {
    const carga = window.__ahCarga;
    if (!carga || cerradaRef.current) return;
    const total =
      fraccionRef.current * CARGA_PESO_FRAMES +
      (fondosRef.current / 2) * CARGA_PESO_FONDOS;
    carga.progreso(total);
    if (total >= 0.999) {
      cerradaRef.current = true;
      carga.cerrar();
    }
  }, []);

  /* Los fondos son imágenes de CSS y no disparan evento de carga, así que se
     piden aparte solo para saber cuándo terminaron. El navegador reusa la
     descarga: no se baja nada dos veces. */
  useEffect(() => {
    const pedir = (src) => {
      const img = new Image();
      const marcar = () => {
        fondosRef.current += 1;
        avisarCarga();
      };
      img.onload = marcar;
      img.onerror = marcar; // si falla, no vale la pena retener la pantalla
      img.src = src;
    };
    pedir("/fondo-nave.webp");
    pedir("/fondo-racks.webp");
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

      recalcularSalidas();
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
  }, [recalcularSalidas]);

  const frameCount = isMobile ? MOBILE_FRAMES : TOTAL_FRAMES;

  const srcFor = useCallback(
    (index) =>
      isMobile
        ? `/renders/drone/mobile/${pad(index * 2 + 1)}.webp`
        : `/renders/drone/desktop/${pad(index + 1)}.webp`,
    [isMobile]
  );

  // La caja del dron en cada fotograma, para que la secuencia guarde solo eso.
  // En móvil va uno de cada dos, igual que en srcFor.
  const cropFor = useCallback(
    (index) => DRONE_TRACK[isMobile ? index * 2 : index],
    [isMobile]
  );

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
        {/* La nave de carga, durante el giro.

            El degradado vertical no es decorativo: lo marca la foto. Medida
            por bandas, la parte alta (techo y cerchas) baja hasta luminancia
            56 y el suelo sube a 120, al revés que la foto de ciudad que había
            antes. Así que arriba basta con poco oscurecido para el titular, y
            abajo hace falta bastante más para que la barra de los actos no se
            pierda sobre el hormigón. */}
        <div ref={naveRef} aria-hidden="true" className="absolute inset-0" style={{ opacity: 1, willChange: "opacity" }}>
          <div className="absolute inset-0 bg-[url('/fondo-nave.webp')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,17,28,0.55)_0%,rgba(10,17,28,0.30)_30%,rgba(10,17,28,0.34)_58%,rgba(10,17,28,0.74)_100%)]" />
        </div>

        {/* Los racks, durante el escaneo. Entran según se va la nave. */}
        <div ref={sceneRef} aria-hidden="true" className="absolute inset-0" style={{ opacity: 0, willChange: "opacity" }}>
          <div
            ref={racksRef}
            className="absolute inset-0 bg-[url('/fondo-racks.webp')] bg-repeat-x"
            style={{
              backgroundSize: `auto ${isMobile ? SCENE_ZOOM_MOVIL : SCENE_ZOOM}`,
              backgroundPosition: `center ${SCENE_POS}`,
            }}
          />
        </div>

        {/* Aquí vivían un degradado índigo y un halo del color del capítulo.
            Sobre fondo liso funcionaban, pero encima de una foto se leen como
            una mancha azul en el centro. El acento del capítulo se sigue viendo
            donde toca: número del panel y minimapa. */}

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
          className={`ah-container pointer-events-none relative z-10 pt-[84px] transition-opacity duration-700 [@media(max-height:520px)]:pt-[64px] ${
            portada ? "opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
            {t("showcase.kicker")}
          </p>
          <h1 className="mt-3 max-w-lg text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem] [@media(max-height:520px)]:mt-1.5 [@media(max-height:520px)]:max-w-sm [@media(max-height:520px)]:text-xl">
            {t("showcase.title")}
          </h1>
        </div>

        {/* Escenario: el canvas y todo lo que se le monta encima comparten el
            mismo sistema de coordenadas. */}
        <div
          ref={stageRef}
          /*
           * El recorte de abajo es lo que coloca al dron en vertical: al
           * dibujarse centrado en el escenario, cuanto menos se recorta más
           * baja. Medido en móvil, el centro del dron sale en 0.5·alto + 120,
           * así que de 40vh a 32vh baja unos 26 px y queda mucho más cerca de
           * la mitad de la pantalla. Más abajo no cabe: se le echaría encima
           * de la franja de los globos.
           */
          className="absolute inset-x-0 bottom-[32vh] top-[84px] sm:bottom-[24vh] lg:bottom-[16vh]"
        >
          {/* El canvas va más grande que el escenario y centrado en él, para
              que el dron gane presencia frente a la mercancía. El panel se queda
              fuera, atado al viewport. */}
          <div
            ref={fieldRef}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${(isMobile ? DRONE_SCALE_MOVIL : DRONE_SCALE) * 100}%`,
              height: `${(isMobile ? DRONE_SCALE_MOVIL : DRONE_SCALE) * 100}%`,
              willChange: isMobile ? "transform" : undefined,
            }}
          >
            <ScrollSequence
              progress={avance}
              frameCount={frameCount}
              srcFor={srcFor}
              cropFor={cropFor}
              startFrame={isMobile ? INICIO / 2 : INICIO}
              sourceWidth={isMobile ? 960 : 1920}
              sourceHeight={isMobile ? 540 : 1080}
              onLoadProgress={(f) => {
                // La carga cuenta hasta la pasada de CARGA_PASADA, no hasta el final.
                fraccionRef.current = Math.min(1, f * CARGA_PASADA);
                avisarCarga();
              }}
              onLayout={handleLayout}
              className="h-full w-full"
            />

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
        {/* z-20, por encima de la barra de los actos: los globos la cruzan al
            entrar y al salir, y compartiendo z-10 la barra se dibujaba encima
            —la lectura de rotación salía sobre el texto del globo—. Pasando
            por delante tapan la barra un instante, que es lo que se espera de
            algo que cruza por encima. */}
        <div ref={capaRef} className="pointer-events-none absolute inset-0 z-20">
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

        {/* Barra inferior: lectura de rotación o trayectoria, y la salida.
            Antes llevaba también los guiones de los actos y el rótulo "Acto N
            · ...": se quitaron, el recorrido no necesita decir en qué etapa va.
            En móvil la lectura no se muestra, así que ahí la barra queda vacía
            y los globos aprovechan ese sitio. */}
        <div className="ah-container absolute inset-x-0 bottom-10 z-10 flex items-end justify-end gap-6 sm:bottom-8">
          <div className="flex items-center gap-6">
            {/* La lectura de trayectoria, del despegue en adelante. Durante el
                giro iba una de grados ("0° Rotación"); se quitó. */}
            <div className="hidden text-right sm:block">
              {active.readout === "path" && (
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
