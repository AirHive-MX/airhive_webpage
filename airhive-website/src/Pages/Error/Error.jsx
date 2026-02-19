import { Link } from "react-router-dom";

const Error = () => {
  return (
    <main className="ah-page flex min-h-[70vh] items-center justify-center px-6 pt-32">
      <section className="ah-surface max-w-xl p-8 text-center sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1501A5]/75">404</p>
        <h1 className="mt-4 text-3xl font-semibold text-[#162A42] sm:text-4xl">Page not found</h1>
        <p className="mt-3 text-sm text-[#202020]/72 sm:text-base">
          The page you requested is not available. Go back to explore Air Hive solutions.
        </p>
        <Link to="/" className="ah-button ah-button-primary mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold">
          Back to Home
        </Link>
      </section>
    </main>
  );
};

export default Error;
