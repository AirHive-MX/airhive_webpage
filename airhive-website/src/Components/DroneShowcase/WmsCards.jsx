import { Camera, Clock, MapPin, Plane, Tag } from "lucide-react";

/**
 * Los dos paneles del WMS, redibujados con HTML y CSS.
 *
 * No son capturas: se reconstruyeron elemento a elemento para que se puedan
 * animar, escalar y leer con lupa sin que se vean pixeles. Los colores salen de
 * muestrear las imágenes originales, no a ojo:
 *   verde #54B385   azul #3560CE   chip verde #D7E9E2
 *
 * Lo único que sigue siendo imagen es la foto del bin, porque es una foto.
 *
 * Respecto al original se recortó el cromo de navegación (volver, pestañas,
 * paginador, el campo para capturar a mano). Eso es interfaz de trabajo, no
 * demostración: aquí lo que tiene que quedar claro es qué leyó el dron y que
 * cuadra con el sistema. Los datos son los del vuelo real, y las etiquetas que
 * lista la segunda tarjeta son las mismas que se ven en el rack del fondo.
 *
 * El texto va en español y sin pasar por i18n a propósito: no es copy de la
 * web, es la interfaz del producto. Una captura tampoco se traduciría.
 */

const CARD =
  "w-[21rem] overflow-hidden rounded-2xl border border-[#162A42]/10 bg-white shadow-[0_18px_44px_rgba(9,16,26,0.22)]";

/** Anillo de cobertura. */
const Donut = ({ valor }) => {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0 -rotate-90">
      <circle cx="32" cy="32" r={r} fill="none" stroke="#e9e9ec" strokeWidth="7" />
      <circle
        cx="32" cy="32" r={r} fill="none" stroke="#54b385" strokeWidth="7"
        strokeLinecap="round" strokeDasharray={`${(c * valor) / 100} ${c}`}
      />
    </svg>
  );
};

const Dato = ({ valor, etiqueta, ambar }) => (
  <div>
    <p className={`text-xl font-semibold leading-none ${ambar ? "text-[#c77a10]" : "text-[#101828]"}`}>
      {valor}
    </p>
    <p className="mt-1.5 text-[0.6rem] font-medium uppercase tracking-[0.1em] text-[#101828]/45">
      {etiqueta}
    </p>
  </div>
);

/** `porRevisar` deja que quien la usa cuadre la cifra con su propia historia. */
export const TarjetaConteo = ({ porRevisar = 1 }) => (
  <article className={CARD}>
    <div className="flex items-start gap-3 px-5 pt-5">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[linear-gradient(150deg,#3f6ddb,#2b50ac)]">
        <span className="grid grid-cols-2 gap-[3px]">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-[6px] w-[6px] rounded-[1.5px] bg-white/90" />
          ))}
        </span>
      </span>
      <div className="min-w-0">
        <h3 className="text-[1.05rem] font-semibold leading-tight text-[#101828]">Conteo Cíclico</h3>
        <span className="mt-1.5 inline-block rounded-md bg-[#e9ecfa] px-2 py-0.5 text-[0.6rem] font-semibold text-[#4a5a8c]">
          RFID
        </span>
      </div>
    </div>

    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 pt-3 text-[0.72rem] text-[#101828]/60">
      <span className="flex items-center gap-1"><MapPin size={12} /> CEDIS GG</span>
      <span className="flex items-center gap-1"><Plane size={12} /> Rack 1</span>
      <span className="flex items-center gap-1"><Clock size={12} /> 16:45</span>
    </div>

    <div className="flex items-center gap-4 px-5 pt-4">
      <div className="relative grid place-items-center">
        <Donut valor={57} />
        <span className="absolute text-[0.95rem] font-semibold text-[#101828]">
          57<span className="text-[0.6rem] font-medium">%</span>
        </span>
      </div>
      <div>
        <p className="text-[0.8rem] font-medium text-[#101828]/75">Cobertura</p>
        <p className="mt-0.5 text-[0.75rem] text-[#101828]/55">41 de 72 posiciones leídas</p>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-y-3 border-t border-[#101828]/8 px-5 pb-5 pt-4">
      <Dato valor="117" etiqueta="Etiquetas" />
      <Dato valor="41" etiqueta="Bins leídos" />
      <Dato valor={String(porRevisar)} etiqueta="Por revisar" ambar />
      <Dato valor="0" etiqueta="Sin ubicar" />
    </div>
  </article>
);

/* Los mismos códigos que llevan las cajas del rack del fondo. */
const ETIQUETAS = ["A1", "A2", "A3", "C1"];

export const TarjetaLecturas = () => (
  <article className={CARD}>
    <div className="px-5 pt-5">
      <h3 className="text-[1.05rem] font-semibold leading-tight text-[#101828]">Lecturas del vuelo</h3>
      <p className="mt-1 text-[0.72rem] text-[#101828]/55">Bin 8 de 42 · 117 etiquetas</p>
    </div>

    <p className="px-5 pt-4 font-mono text-[0.95rem] font-semibold tracking-tight text-[#101828]">
      Z-A.R01.L.N01-C07
    </p>
    <p className="px-5 pt-1 text-[0.72rem] text-[#101828]/55">Rack 1 · Nivel 1 · Columna 7</p>

    <div className="flex gap-2 px-5 pt-3 text-[0.68rem] font-medium">
      <span className="flex items-center gap-1.5 rounded-md bg-[#d7e9e2] px-2 py-1 text-[#2f6b52]">
        <Tag size={11} /> 4 etiquetas
      </span>
      <span className="flex items-center gap-1.5 rounded-md bg-[#eeeef1] px-2 py-1 text-[#101828]/60">
        <Camera size={11} /> 1 foto
      </span>
    </div>

    <div className="mx-5 mt-3 rounded-r-lg border-l-[3px] border-[#54b385] bg-[#f4f4f7] px-3 py-2.5">
      <p className="text-[0.78rem] font-semibold text-[#101828]">Coincide</p>
      <p className="mt-0.5 text-[0.72rem] text-[#101828]/65">
        <span className="font-medium">Según el WMS:</span> CAJ-COR · 4 cajas
      </p>
    </div>

    <div className="relative mx-5 mt-3 overflow-hidden rounded-lg">
      <img src="/wms-bin-foto.webp" alt="Foto del bin" className="w-full" />
      <span className="absolute bottom-1.5 left-2 text-[0.6rem] text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,0.8)]">
        09:37:25 p.m.
      </span>
    </div>

    <p className="px-5 pt-4 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[#101828]/50">
      Etiquetas leídas aquí
    </p>
    <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 px-5 pb-5 pt-2">
      {ETIQUETAS.map((code) => (
        <li key={code} className="flex items-center gap-2 text-[0.72rem] text-[#101828]/70">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#54b385]" />
          <span className="font-mono">ITEM CODE: {code}</span>
        </li>
      ))}
    </ul>
  </article>
);
