/*
 * Analítica del sitio: Google Analytics 4 (medir) y Microsoft Clarity (ver
 * grabaciones de sesión y mapas de calor). Las dos son gratis.
 *
 * Las etiquetas se cargan en index.html (así cuentan desde el primer instante,
 * antes de que monte React). La primera vista de página la manda la etiqueta
 * de GA al cargar; las navegaciones dentro del sitio las manda vistaDePagina()
 * (MainLayout). La detección automática de GA por historial se probó y no las
 * registraba, y en el flujo está apagada para que no se cuenten doble.
 *
 * Si alguna herramienta está bloqueada (un bloqueador de anuncios, por
 * ejemplo), no pasa nada.
 *
 * Eventos que se mandan hoy:
 * - recorrido { avance: 25 | 50 | 75 | 100 }: hasta dónde llega la visita.
 * - cta_diagnostico { desde }: clic al botón del diagnóstico.
 * - whatsapp_click { desde }: clic a WhatsApp.
 * - diagnostico_enviado / diagnostico_error: el formulario.
 *
 * GA: Informes > Interacción > Eventos (tardan ~24 h en aparecer; en
 * "Tiempo real" se ven al momento). Clarity: Dashboard y Recordings, que se
 * pueden filtrar por estos mismos eventos.
 */
export const evento = (nombre, datos = {}) => {
  try {
    window.gtag?.("event", nombre, datos);
    window.clarity?.("event", nombre);
  } catch {
    /* la analítica nunca debe romper la página */
  }
};

/** Vista de página de una navegación dentro del sitio (no la primera). */
export const vistaDePagina = (ruta) => {
  try {
    window.gtag?.("event", "page_view", {
      page_path: ruta,
      page_location: window.location.origin + ruta,
      page_title: document.title,
    });
  } catch {
    /* la analítica nunca debe romper la página */
  }
};
