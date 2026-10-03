import { useEffect, useRef, useState } from "react";

/**
 * Header que se esconde al bajar y vuelve al subir o al acercar el cursor.
 *
 * Reglas:
 * - Arriba del todo siempre se ve.
 * - Scroll hacia abajo lo esconde; hacia arriba lo devuelve y ahí se queda.
 * - Con el cursor en la franja superior aparece aunque estés bajando, y se
 *   vuelve a ir al salir de esa franja (solo si lo último que hiciste fue bajar:
 *   si habías subido, se queda).
 *
 * `pinned` lo fuerza visible (por ejemplo con el menú móvil abierto) y
 * `resetKey` lo devuelve a la vista al cambiar de ruta, donde no hay un scroll
 * que lo destape.
 */

const HIDE_AFTER = 80; // no se esconde antes de este scroll
const HOVER_ZONE = 72; // franja superior sensible al cursor
const DEADBAND = 6; // micro-movimientos que no cuentan como dirección

const useAutoHideHeader = ({ pinned = false, resetKey } = {}) => {
  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);
  const goingDownRef = useRef(false);
  const nearTopRef = useRef(false);
  const pinnedRef = useRef(pinned);
  pinnedRef.current = pinned;

  useEffect(() => {
    lastYRef.current = window.scrollY;
    let raf = 0;

    const evaluate = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - lastYRef.current;
      if (Math.abs(delta) < DEADBAND) return; // el resto se acumula
      goingDownRef.current = delta > 0;
      lastYRef.current = y;
      setVisible(
        pinnedRef.current ||
          nearTopRef.current ||
          y <= HIDE_AFTER ||
          !goingDownRef.current
      );
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(evaluate);
    };

    const onMove = (event) => {
      const near = event.clientY <= HOVER_ZONE;
      if (near === nearTopRef.current) return;
      nearTopRef.current = near;
      if (near) {
        setVisible(true);
      } else if (goingDownRef.current && window.scrollY > HIDE_AFTER && !pinnedRef.current) {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  useEffect(() => {
    if (pinned) setVisible(true);
  }, [pinned]);

  // Cambiar de ruta no dispara scroll si ya estabas arriba: sin esto el header
  // se quedaría escondido en la página nueva.
  useEffect(() => {
    lastYRef.current = window.scrollY;
    goingDownRef.current = false;
    setVisible(true);
  }, [resetKey]);

  return visible;
};

export default useAutoHideHeader;
