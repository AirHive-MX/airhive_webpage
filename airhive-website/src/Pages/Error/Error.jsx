import { useEffect } from "react";
import { Link } from "react-router-dom";

const Error = () => {
  /* El resto del sitio está en español; antes esta página estaba en inglés. */
  useEffect(() => {
    const antes = document.title;
    document.title = "Página no encontrada | Air Hive";
    return () => {
      document.title = antes;
    };
  }, []);

  return (
    <main className="ah-page flex min-h-[70vh] items-center justify-center px-6 pt-32">
      <section className="ah-surface max-w-xl p-8 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1501A5]/75">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-[#162A42] sm:text-4xl">Página no encontrada</h1>
        <p className="mt-3 text-sm text-[#202020]/72 sm:text-base">
          La página que buscas no existe o cambió de dirección.
        </p>
        <Link to="/" className="ah-button ah-button-primary mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold">
          Volver al inicio
        </Link>
      </section>
    </main>
  );
};

export default Error;
