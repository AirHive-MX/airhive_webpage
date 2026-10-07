import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion } from "framer-motion";

/**
 * Secuencia de imágenes dibujada en canvas y controlada por una MotionValue 0..1.
 *
 * Por qué canvas y no <img src={...}> ni <video>:
 * - Cambiar el src de un <img> en cada frame provoca parpadeo mientras decodifica.
 * - Un video no conserva el canal alpha de forma confiable entre navegadores
 *   (WebM/VP9 con alpha no reproduce en Safari), y estos renders son transparentes.
 *
 * La precarga es progresiva: primero un frame visible, luego pasadas cada vez más
 * finas (stride 16 -> 8 -> 4 -> 2 -> 1). Así la rotación se ve completa desde el
 * inicio y se va refinando, en vez de quedarse en blanco hasta tener los 120.
 */

/*
 * Descargas a la vez. Con 6 se dejaba capacidad sin usar: sobre HTTP/2, que es
 * lo que sirve Vercel, las peticiones van multiplexadas por una sola conexión y
 * no cuesta abrir más. Son 360 archivos de 35 KB, así que lo que manda es el
 * número de idas y vueltas, no el ancho de banda.
 */
const MAX_PARALLEL = 10;

/** Orden de carga: pasadas de stride decreciente, para refinar de grueso a fino. */
const buildLoadOrder = (count, start = 0) => {
  const order = [];
  const seen = new Set();
  for (let stride = 16; stride >= 1; stride = Math.floor(stride / 2)) {
    for (let i = start; i < count; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
    if (stride === 1) break;
  }
  return order;
};

/*
 * Píxeles de holgura alrededor del recorte, en píxeles de la imagen. La caja
 * viene medida del alpha, pero el antialiasing del canto puede quedar a un
 * píxel; así no se come el borde del dron.
 */
const HOLGURA_RECORTE = 4;

const ScrollSequence = ({
  progress,
  frameCount,
  srcFor,
  cropFor,
  startFrame = 0, // los anteriores no se muestran nunca, así que ni se bajan
  bucle = null, // bucle de hélices por tiempo (ver el efecto más abajo)
  tint, // MotionValue 0..1 opcional: cuánto se tiñe el render con la luz de la escena
  tintTop = "rgb(120, 150, 215)", // cielo de noche
  tintBottom = "rgb(255, 170, 110)", // luz cálida de la puerta
  width = 1920,
  height = 1080,
  sourceWidth = width,
  sourceHeight = height,
  className = "",
  onLoadProgress,
  onLayout,
}) => {
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const targetRef = useRef(startFrame);
  const rafRef = useRef(0);
  const drawnRef = useRef(-1);
  const [firstReady, setFirstReady] = useState(false);
  const reduceMotion = useReducedMotion();

  // Vía refs para que el efecto de precarga no dependa de la identidad de las
  // props: una función inline del padre reiniciaría la carga en cada render.
  const srcForRef = useRef(srcFor);
  const cropForRef = useRef(cropFor);
  const onLoadProgressRef = useRef(onLoadProgress);
  const onLayoutRef = useRef(onLayout);
  srcForRef.current = srcFor;
  const tintRef = useRef(tint);
  const bucleRef = useRef(bucle);
  bucleRef.current = bucle;
  const tintTopRef = useRef(tintTop);
  const tintBottomRef = useRef(tintBottom);
  tintRef.current = tint;
  tintTopRef.current = tintTop;
  tintBottomRef.current = tintBottom;
  cropForRef.current = cropFor;
  onLoadProgressRef.current = onLoadProgress;
  onLayoutRef.current = onLayout;

  /** Busca hacia afuera el frame cargado más cercano al pedido. */
  const nearestLoaded = useCallback(
    (index) => {
      const frames = framesRef.current;
      if (frames[index]) return index;
      for (let d = 1; d < frameCount; d += 1) {
        if (frames[index - d]) return index - d;
        if (frames[index + d]) return index + d;
      }
      return -1;
    },
    [frameCount]
  );

  const paint = useCallback(() => {
    rafRef.current = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Mientras corre el bucle de hélices, él pinta; el scroll no lo pisa.
    if (bucleRef.current?.activo?.get?.() > 0) return;

    const index = nearestLoaded(targetRef.current);
    if (index < 0 || index === drawnRef.current) return;

    const { bitmap, x, y, w, h } = framesRef.current[index];
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;

    // El render trae alpha: hay que limpiar, no sobreescribir.
    ctx.clearRect(0, 0, cw, ch);

    // x, y, w, h son el recorte dentro de la imagen de width x height; se
    // dibuja en su sitio del encuadre completo, como si fuera la imagen entera.
    const scale = Math.min(cw / width, ch / height);
    const ox = (cw - width * scale) / 2;
    const oy = (ch - height * scale) / 2;
    const dx = ox + x * scale;
    const dy = oy + y * scale;
    const dw = w * scale;
    const dh = h * scale;
    ctx.drawImage(bitmap, dx, dy, dw, dh);

    /*
     * Luz de la escena sobre el render. Los renders traen luz de estudio,
     * neutra; aquí se le multiplica un degradado de tintTop a tintBottom, que
     * es como se tiñe algo con la luz que le llega: los claros toman el color
     * y los negros siguen negros. (Pintando encima con "source-atop" los negros
     * se aclaraban y el dron se veía deslavado.) Como multiplicar también
     * pinta el fondo transparente, después se recorta con el mismo render.
     * `tint` (0..1) es cuánto.
     */
    const cuanto = tintRef.current?.get?.() ?? 0;
    if (cuanto > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.globalAlpha = Math.min(cuanto, 1);
      const degradado = ctx.createLinearGradient(0, dy, 0, dy + dh);
      degradado.addColorStop(0, tintTopRef.current);
      degradado.addColorStop(1, tintBottomRef.current);
      ctx.fillStyle = degradado;
      ctx.fillRect(dx, dy, dw, dh);
      ctx.globalCompositeOperation = "destination-in";
      ctx.globalAlpha = 1;
      ctx.drawImage(bitmap, dx, dy, dw, dh);
      ctx.restore();
    }

    drawnRef.current = index;
  }, [height, nearestLoaded, width]);

  const schedule = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(paint);
  }, [paint]);

  /* Canvas a resolución real del dispositivo, y redibujo al cambiar de tamaño. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      /*
       * El buffer se limita a lo que el render puede llenar.
       *
       * El canvas se dibuja en "contain", así que de sus píxeles solo se usan
       * los del rectángulo donde cabe el render. A densidad 2 ese rectángulo
       * salía bastante más grande que los 1920x1080 de la fuente: se ampliaba
       * la imagen, que no añade un solo detalle, y se pagaba el relleno en cada
       * fotograma. Topando la densidad donde el dibujo queda 1:1 con la fuente
       * se pinta igual de nítido con un 40% menos de píxeles.
       */
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const encaje = Math.min(rect.width / width, rect.height / height);
      const justa = encaje > 0 ? 1 / encaje : dpr;
      const densidad = Math.max(1, Math.min(dpr, justa));

      canvas.width = Math.round(rect.width * densidad);
      canvas.height = Math.round(rect.height * densidad);
      drawnRef.current = -1; // el buffer se limpió al redimensionar
      paint();

      // "contain" deja franjas vacías: quien dibuje encima necesita saber dónde
      // quedó el render de verdad, no dónde está el canvas.
      const fit = Math.min(rect.width / width, rect.height / height);
      onLayoutRef.current?.({
        x: (rect.width - width * fit) / 2,
        y: (rect.height - height * fit) / 2,
        width: width * fit,
        height: height * fit,
      });
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [height, paint, width]);

  /* Precarga progresiva. */
  useEffect(() => {
    let cancelled = false;
    framesRef.current = new Array(frameCount);
    drawnRef.current = -1;
    /* El destino se recalcula con el progreso, no se arrastra: al cambiar
       frameCount (el home arranca como escritorio, 180, y en celular pasa a
       90) el índice viejo apunta a otro fotograma. El 58 de 180 es el dron de
       frente; el 58 de 90 ya es de espaldas, y ahí se quedaba hasta el
       primer scroll. */
    const inicial = Math.min(Math.max(progress?.get?.() ?? 0, 0), 0.9999);
    targetRef.current = Math.max(startFrame, Math.floor(inicial * frameCount));
    setFirstReady(false);

    /*
     * Recorte a la caja del dron, en píxeles de la imagen fuente.
     *
     * Decodificado, cada fotograma de 1920x1080 ocupa 8 MB, y son 360: casi
     * 3 GB. El navegador no los aguanta en memoria, los tira y los vuelve a
     * decodificar al pasar por ellos, y eso es el tirón del scroll. Pero el
     * dron solo ocupa ~14% de cada fotograma; el resto es transparente.
     * Guardando solo su caja (medida del alpha, la misma de droneTrack) la
     * memoria baja a una sexta parte sin perder un píxel.
     */
    const recorte = (index, iw, ih) => {
      const caja = cropForRef.current?.(index);
      if (!caja) return { sx: 0, sy: 0, sw: iw, sh: ih };
      const [l, t, r, b] = caja;
      const holgura = HOLGURA_RECORTE * (iw / width);
      const sx = Math.max(0, Math.floor(l * iw - holgura));
      const sy = Math.max(0, Math.floor(t * ih - holgura));
      return {
        sx,
        sy,
        sw: Math.min(iw, Math.ceil(r * iw + holgura)) - sx,
        sh: Math.min(ih, Math.ceil(b * ih + holgura)) - sy,
      };
    };

    /** Lo que guarda framesRef: el bitmap y dónde va dentro del encuadre. */
    const fotograma = (bitmap, { sx, sy, sw, sh }, iw, ih) => ({
      bitmap,
      x: (sx / iw) * width,
      y: (sy / ih) * height,
      w: (sw / iw) * width,
      h: (sh / ih) * height,
    });

    /*
     * Camino rápido: fetch y createImageBitmap sobre el Blob.
     *
     * Con un <img> de por medio, Chrome decodifica en el hilo principal al
     * recortar, y con 90 fotogramas en cola eso se comía más de un segundo
     * mientras la pantalla de carga esperaba: cada archivo bajaba en 3 ms y
     * luego hacía fila para decodificarse. Desde un Blob la decodificación va
     * en otro hilo. Hace falta saber el tamaño de la fuente antes de abrirla,
     * por eso llega como prop.
     */
    const cargarBlob = async (index) => {
      const respuesta = await fetch(srcForRef.current(index));
      if (!respuesta.ok) throw new Error(respuesta.status);
      const blob = await respuesta.blob();
      const caja = recorte(index, sourceWidth, sourceHeight);
      const bitmap = await createImageBitmap(blob, caja.sx, caja.sy, caja.sw, caja.sh);
      return fotograma(bitmap, caja, sourceWidth, sourceHeight);
    };

    /* Camino de respaldo, para navegadores sin createImageBitmap. */
    const cargarImg = (index) =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve({ bitmap: img, x: 0, y: 0, w: width, h: height });
        img.onerror = () => resolve(null);
        img.src = srcForRef.current(index);
      });

    const load = async (index) => {
      let frame = null;
      if (typeof createImageBitmap === "function") {
        try {
          frame = await cargarBlob(index);
        } catch {
          frame = null;
        }
      }
      if (!frame && !cancelled) frame = await cargarImg(index);
      if (cancelled) {
        frame?.bitmap?.close?.();
        return;
      }
      if (frame) framesRef.current[index] = frame;
    };

    const run = async () => {
      // Un frame visible cuanto antes; el resto puede llegar después.
      await load(startFrame);
      if (cancelled) return;
      setFirstReady(true);
      schedule();

      if (reduceMotion) {
        onLoadProgressRef.current?.(1);
        return;
      }

      const queue = buildLoadOrder(frameCount, startFrame).filter((i) => i !== startFrame);
      let cursor = 0;
      let done = 1;

      const worker = async () => {
        while (!cancelled && cursor < queue.length) {
          const index = queue[cursor];
          cursor += 1;
          await load(index);
          done += 1;
          if (cancelled) return;
          onLoadProgressRef.current?.(done / (frameCount - startFrame));
          schedule();
        }
      };

      await Promise.all(
        Array.from({ length: MAX_PARALLEL }, () => worker())
      );
    };

    run();

    return () => {
      cancelled = true;
      framesRef.current.forEach((frame) => frame?.bitmap?.close?.());
      framesRef.current = [];
    };
  }, [frameCount, height, progress, reduceMotion, schedule, sourceHeight, sourceWidth, startFrame, width]);

  /* Scroll -> frame. */
  useMotionValueEvent(progress, "change", (value) => {
    if (reduceMotion) return;
    const clamped = Math.min(Math.max(value, 0), 0.9999);
    const next = Math.max(startFrame, Math.floor(clamped * frameCount));
    if (next === targetRef.current) return;
    targetRef.current = next;
    schedule();
  });

  /*
   * Bucle de hélices: { desde, hasta, fps, activo } (desde/hasta en índices
   * de esta secuencia; activo, MotionValue 0/1).
   *
   * Recorre por tiempo un tramo donde el cuerpo no se mueve y solo cambian las
   * aspas, para que las hélices giren mientras el dron vuela, igual que giran
   * durante el giro cuando el scroll pasa los fotogramas. No salta de un
   * fotograma al siguiente: los funde (el siguiente encima, con opacidad que
   * sube de 0 a 1). Saltando, las aspas parpadeaban; fundidas pasan de un
   * ángulo al otro con algo de estela, como en video. El cuerpo queda igual
   * porque es el mismo en todos los fotogramas del tramo.
   */
  useEffect(() => {
    if (!bucle) return undefined;
    let raf = 0;
    let antes = false;
    const n = bucle.hasta - bucle.desde + 1;
    const lazo = (ahora) => {
      const activo = bucle.activo.get() > 0;
      const canvas = canvasRef.current;
      if (activo && canvas) {
        const t = (ahora / 1000) * bucle.fps;
        const i = Math.floor(t) % n;
        const f = t - Math.floor(t);
        const a = framesRef.current[bucle.desde + i];
        const b = framesRef.current[bucle.desde + ((i + 1) % n)];
        if (a && b) {
          const ctx = canvas.getContext("2d");
          const cw = canvas.width;
          const ch = canvas.height;
          const scale = Math.min(cw / width, ch / height);
          const ox = (cw - width * scale) / 2;
          const oy = (ch - height * scale) / 2;
          const dibuja = (fr, alpha) => {
            ctx.globalAlpha = alpha;
            ctx.drawImage(fr.bitmap, ox + fr.x * scale, oy + fr.y * scale, fr.w * scale, fr.h * scale);
          };
          ctx.clearRect(0, 0, cw, ch);
          dibuja(a, 1);
          dibuja(b, f * f * (3 - 2 * f));
          ctx.globalAlpha = 1;
          drawnRef.current = -1; // al salir del bucle, el scroll vuelve a pintar
        }
      } else if (antes && !activo) {
        drawnRef.current = -1;
        schedule();
      }
      antes = activo;
      raf = requestAnimationFrame(lazo);
    };
    raf = requestAnimationFrame(lazo);
    return () => cancelAnimationFrame(raf);
  }, [bucle, schedule, width, height]);

  /* Si cambia el tinte hay que repintar aunque el fotograma sea el mismo. */
  useEffect(() => {
    if (!tint?.on) return undefined;
    return tint.on("change", () => {
      drawnRef.current = -1;
      schedule();
    });
  }, [tint, schedule]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity: firstReady ? 1 : 0, transition: "opacity 600ms ease" }}
      role="img"
      aria-label="Dron Air Hive en vuelo"
    />
  );
};

export default ScrollSequence;
