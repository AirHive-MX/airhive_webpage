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

const MAX_PARALLEL = 6;

/** Orden de carga: pasadas de stride decreciente, para refinar de grueso a fino. */
const buildLoadOrder = (count) => {
  const order = [];
  const seen = new Set();
  for (let stride = 16; stride >= 1; stride = Math.floor(stride / 2)) {
    for (let i = 0; i < count; i += stride) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
    if (stride === 1) break;
  }
  return order;
};

const ScrollSequence = ({
  progress,
  frameCount,
  srcFor,
  width = 1920,
  height = 1080,
  className = "",
  onLoadProgress,
  onLayout,
}) => {
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const targetRef = useRef(0);
  const rafRef = useRef(0);
  const drawnRef = useRef(-1);
  const [firstReady, setFirstReady] = useState(false);
  const reduceMotion = useReducedMotion();

  // Vía refs para que el efecto de precarga no dependa de la identidad de las
  // props: una función inline del padre reiniciaría la carga en cada render.
  const srcForRef = useRef(srcFor);
  const onLoadProgressRef = useRef(onLoadProgress);
  const onLayoutRef = useRef(onLayout);
  srcForRef.current = srcFor;
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

    const index = nearestLoaded(targetRef.current);
    if (index < 0 || index === drawnRef.current) return;

    const bitmap = framesRef.current[index];
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const ch = canvas.height;

    // El render trae alpha: hay que limpiar, no sobreescribir.
    ctx.clearRect(0, 0, cw, ch);

    const scale = Math.min(cw / width, ch / height);
    const dw = width * scale;
    const dh = height * scale;
    ctx.drawImage(bitmap, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
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
    setFirstReady(false);

    const load = (index) =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => {
          if (cancelled) return resolve();
          // createImageBitmap decodifica fuera del hilo principal: drawImage
          // queda instantáneo y el scroll no se atora en el primer pase.
          if (typeof createImageBitmap === "function") {
            createImageBitmap(img)
              .then((bitmap) => {
                if (!cancelled) framesRef.current[index] = bitmap;
                resolve();
              })
              .catch(() => {
                if (!cancelled) framesRef.current[index] = img;
                resolve();
              });
          } else {
            framesRef.current[index] = img;
            resolve();
          }
        };
        img.onerror = () => resolve();
        img.src = srcForRef.current(index);
      });

    const run = async () => {
      // Un frame visible cuanto antes; el resto puede llegar después.
      await load(0);
      if (cancelled) return;
      setFirstReady(true);
      schedule();

      if (reduceMotion) {
        onLoadProgressRef.current?.(1);
        return;
      }

      const queue = buildLoadOrder(frameCount).filter((i) => i !== 0);
      let cursor = 0;
      let done = 1;

      const worker = async () => {
        while (!cancelled && cursor < queue.length) {
          const index = queue[cursor];
          cursor += 1;
          await load(index);
          done += 1;
          if (cancelled) return;
          onLoadProgressRef.current?.(done / frameCount);
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
      framesRef.current.forEach((frame) => frame?.close?.());
      framesRef.current = [];
    };
  }, [frameCount, reduceMotion, schedule]);

  /* Scroll -> frame. */
  useMotionValueEvent(progress, "change", (value) => {
    if (reduceMotion) return;
    const clamped = Math.min(Math.max(value, 0), 0.9999);
    const next = Math.floor(clamped * frameCount);
    if (next === targetRef.current) return;
    targetRef.current = next;
    schedule();
  });

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity: firstReady ? 1 : 0, transition: "opacity 600ms ease" }}
      role="img"
      aria-label="Dron Air Hive en vista 360°"
    />
  );
};

export default ScrollSequence;
