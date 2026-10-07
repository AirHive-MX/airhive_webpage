import { useEffect } from "react";

/**
 * Scroll guiado para pantallas táctiles, al estilo de hextronics.com.
 *
 * Se deja el scroll nativo del teléfono, con su inercia; no hay paradas
 * rígidas (scroll-snap) que lo frenen a cada rato. Lo que se hace es repartir
 * el recorrido en ESCENAS —tramos de descanso donde se puede leer— y lo que
 * hay entre ellas son transiciones:
 *
 * 1. Si se suelta el dedo a mitad de una transición, se termina sola: el
 *    scroll se desliza hasta la escena siguiente en la dirección en que se
 *    iba, o a la más cercana si no había dirección. Nunca queda a medias.
 * 2. Si un deslizón fuerte, ya en inercia, cruza el centro de una escena, se
 *    le corta la inercia ahí (overflow: hidden un instante, que es lo único
 *    que la detiene en iOS) y se acomoda en esa escena. Así no se brinca
 *    ninguna.
 *
 * Solo actúa dentro del recorrido (`seccionRef`); fuera de él el scroll es el
 * normal. Cualquier toque nuevo cancela el deslizamiento automático.
 *
 * `escenas` son pares [desde, hasta] en fracción del recorrido (0..1).
 */

const QUIETO_MS = 140; // sin eventos de scroll durante esto = se detuvo
const VELOCIDAD_ATRAPA = 1.1; // pantallas por segundo a partir de la que se atrapa

const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export default function useScrollGuiado(seccionRef, escenas, activo) {
  useEffect(() => {
    if (!activo) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let tocando = false;
    let animacion = 0;
    let quieto = 0;
    let anteriorY = window.scrollY;
    let anteriorT = performance.now();
    let direccion = 0;
    let velocidad = 0; // pantallas por segundo, con signo

    /* Conversión entre scroll de la página y avance del recorrido. */
    const medidas = () => {
      const s = seccionRef.current;
      if (!s) return null;
      const inicio = s.getBoundingClientRect().top + window.scrollY;
      const rango = s.offsetHeight - window.innerHeight;
      return rango > 0 ? { inicio, rango } : null;
    };
    const avanceDe = (y, m) => (y - m.inicio) / m.rango;
    const yDe = (p, m) => m.inicio + p * m.rango;

    const cancelar = () => {
      if (animacion) cancelAnimationFrame(animacion);
      animacion = 0;
    };

    /* Desliza la página hasta `destino`, con duración según la distancia. */
    const deslizar = (destino) => {
      cancelar();
      const desde = window.scrollY;
      const distancia = destino - desde;
      if (Math.abs(distancia) < 2) return;
      const pantallas = Math.abs(distancia) / window.innerHeight;
      const duracion = Math.min(1100, Math.max(420, 380 + pantallas * 320));
      const t0 = performance.now();
      const paso = (ahora) => {
        const k = Math.min(1, (ahora - t0) / duracion);
        window.scrollTo({ top: desde + distancia * suave(k), behavior: "instant" });
        animacion = k < 1 ? requestAnimationFrame(paso) : 0;
      };
      animacion = requestAnimationFrame(paso);
    };

    /* La escena que contiene p, o las vecinas si p cae en una transición. */
    const ubicar = (p) => {
      for (let i = 0; i < escenas.length; i += 1) {
        const [a, b] = escenas[i];
        if (p >= a && p <= b) return { dentro: i };
        if (p < a) return { antes: escenas[i - 1] ?? null, despues: escenas[i] };
      }
      return { antes: escenas[escenas.length - 1], despues: null };
    };

    /* Al detenerse: si quedó en una transición, la termina. */
    const asentar = () => {
      if (tocando || animacion) return;
      const m = medidas();
      if (!m) return;
      const p = avanceDe(window.scrollY, m);
      if (p <= 0 || p >= 1) return;
      const lugar = ubicar(p);
      if (lugar.dentro !== undefined) return;
      const { antes, despues } = lugar;
      let destino;
      if (direccion > 0 && despues) destino = despues[0];
      else if (direccion < 0 && antes) destino = antes[1];
      else {
        const aAntes = antes ? p - antes[1] : Infinity;
        const aDespues = despues ? despues[0] - p : Infinity;
        destino = aAntes <= aDespues ? antes[1] : despues[0];
      }
      deslizar(yDe(destino, m));
    };

    /* Corta la inercia (en iOS solo overflow: hidden la detiene) y se
       acomoda en la escena que se estaba cruzando.
       Ojo: en Safari de iPhone, poner overflow: hidden a veces brinca la
       página al inicio. Se guarda la posición antes y, si al soltar ya no es
       la misma, se devuelve ahí antes de deslizar (lo mismo que hace
       hextronics). Sin esto, a veces aparecía la fachada con el dron de
       espaldas, a medio actualizar. */
    const atrapar = (p, m) => {
      const html = document.documentElement;
      const y = window.scrollY;
      html.style.overflow = "hidden";
      requestAnimationFrame(() => {
        html.style.overflow = "";
        if (Math.abs(window.scrollY - y) > 1) window.scrollTo({ top: y, behavior: "instant" });
        deslizar(yDe(p, m));
      });
    };

    const alScroll = () => {
      const ahora = performance.now();
      const y = window.scrollY;
      const dt = Math.max(1, ahora - anteriorT);
      const dy = y - anteriorY;
      if (Math.abs(dy) > 0.5) direccion = Math.sign(dy);
      velocidad = (dy / window.innerHeight) / (dt / 1000);

      /* Un brinco de varias pantallas de un evento a otro no es un deslizón:
         es un salto hecho por código (el botón de Inicio). No se atrapa. */
      const salto = Math.abs(dy) > window.innerHeight * 2;

      /* En inercia y rápido: si se cruzó el centro de una escena, atrapar. */
      if (!salto && !tocando && !animacion && Math.abs(velocidad) > VELOCIDAD_ATRAPA) {
        const m = medidas();
        if (m) {
          const p0 = avanceDe(anteriorY, m);
          const p1 = avanceDe(y, m);
          for (const [a, b] of escenas) {
            const centro = (a + b) / 2;
            const cruzo = (p0 < centro && p1 >= centro) || (p0 > centro && p1 <= centro);
            if (cruzo && centro > 0 && centro < 1) {
              anteriorY = y;
              anteriorT = ahora;
              atrapar(centro, m);
              return;
            }
          }
        }
      }

      anteriorY = y;
      anteriorT = ahora;
      clearTimeout(quieto);
      quieto = setTimeout(asentar, QUIETO_MS);
    };

    const alTocar = () => {
      tocando = true;
      cancelar();
    };
    const alSoltar = (e) => {
      if (e.touches && e.touches.length > 0) return;
      tocando = false;
      clearTimeout(quieto);
      quieto = setTimeout(asentar, QUIETO_MS);
    };

    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("touchstart", alTocar, { passive: true });
    window.addEventListener("touchend", alSoltar, { passive: true });
    window.addEventListener("touchcancel", alSoltar, { passive: true });
    return () => {
      cancelar();
      clearTimeout(quieto);
      document.documentElement.style.overflow = "";
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("touchstart", alTocar);
      window.removeEventListener("touchend", alSoltar);
      window.removeEventListener("touchcancel", alSoltar);
    };
  }, [seccionRef, escenas, activo]);
}
