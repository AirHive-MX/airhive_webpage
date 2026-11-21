# Air Hive website: contexto para agentes

## Qué es Air Hive

Empresa de **physical AI** de Monterrey, México. Automatiza el inventario de
almacenes con **drones autónomos indoor** (vuelan sin GPS y leen cada ubicación
del rack) conectados a un **WMS propio con agentes de IA** que resuelven las
diferencias contra el sistema. También RFID, escáneres y básculas IoT.
No es una empresa de drones recreativos, eventos ni baterías (eso fue el sitio
viejo). El resumen público para LLMs está en `public/llms.txt`.

Sitio: https://www.airhive.si · Deploy: Vercel (proyecto `airhive-webpage`).
Flujo de ramas: `feat/*` → PR a `develop` → PR de `develop` a `main` (producción).

## Stack

React 19 + Vite 6, Tailwind v4, Framer Motion (scroll), React Router 6,
i18next (es por defecto; en existe pero el selector está apagado),
Google Analytics 4 + Microsoft Clarity (src/analitica.js), Inter servida con `@fontsource-variable/inter`.

## Páginas (src/MainLayout/MainLayout.jsx)

- `/` → `Pages/Home` → `Components/EntradaAlmacen`: el recorrido del dron entrando
  al almacén. Es casi todo el sitio.
- `/diagnostico-gratis` → `Pages/Diagnostic`: formulario (Formspree, enviado con
  fetch; la confirmación se queda en el sitio).
- `*` → `Pages/Error`. En producción las rutas inexistentes responden 404 real:
  `vite.config.js` genera `dist/404.html` y `vercel.json` solo reescribe
  `/diagnostico-gratis`. **Una ruta nueva hay que agregarla en `vercel.json`**
  (y en `public/sitemap.xml`), si no Vercel la sirve como 404.

## El recorrido (EntradaAlmacen.jsx)

- Una sección alta (750svh en celular, 1300vh en computadora) con un escenario
  `sticky` de `100lvh`. Todo se mueve con `aplicar(p)`, p = avance 0..1.
- El dron es una secuencia de renders (`ScrollSequence`, canvas):
  `public/renders/atlas2/{desktop,movil}/NNNN.webp`. Se usan los índices 58..120
  (giro 59→120 y bucle de hélices 116→121); los demás no se bajan.
- En táctil: `RITMO_TACTIL` reparte el scroll entre escenas, el giro va lineal
  con el dedo desde el primer pixel, y `useScrollGuiado` (con `atrapar: false`)
  solo termina una transición si se suelta a medias. **No usar scroll-snap ni
  cortar la inercia**: los dos se probaron y se sentían trabados (ver
  comentarios en el archivo).
- Las palabras-obstáculo del pasillo representan el obstacle avoidance: el dron
  las esquiva (de lado en computadora, en vertical en celular). No quitarlo.
- Antes de cambiar algo del recorrido en celular, probarlo emulando un iPhone
  con táctil (Playwright con `hasTouch`, `isMobile`, CPU 4x): el comportamiento
  táctil no se ve en un navegador de escritorio.

## SEO / LLMs

- `index.html` lleva título, descripción, Open Graph, JSON-LD y, dentro de
  `#root`, una versión en texto de la página para crawlers sin JavaScript
  (React la reemplaza al montar). **Si cambia el mensaje del home, actualizar
  ese bloque y `public/llms.txt`.**
- `public/robots.txt` permite explícitamente los bots de IA.

## Reglas

- Todo lo que está en `public/` es público en www.airhive.si, y el repo de
  GitHub es público. No poner ahí documentos internos, capturas ni fotos que no
  use la página.
- Comentarios y textos en español, explicando el porqué.
- Eventos de analítica con `evento()` de `src/analitica.js`: `recorrido`
  (25/50/75/100), `cta_diagnostico`, `whatsapp_click`, `diagnostico_enviado`,
  `diagnostico_error`.
