import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa";
import logo from "/Air Hive Log.png";

const solutionItems = [
  { key: "sales", to: "/services#ventas" },
  { key: "operations", to: "/services#operacion" },
  { key: "logistics", to: "/services#logistica" },
  { key: "inspection", to: "/services#inspeccion" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    setIsOpen(false);
    setSolutionsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparentHeader = isHome && !scrolled;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
        <nav
          className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-500 sm:px-6 ${
            transparentHeader
              ? "border-white/25 bg-white/8 text-[#162A42] shadow-[0_10px_34px_rgba(0,0,0,0.18)] backdrop-blur-md"
              : "border-[#162A42]/15 bg-white/92 text-[#162A42] shadow-[0_18px_60px_rgba(22,42,66,0.14)] backdrop-blur-xl"
          }`}
        >
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Air Hive"
              className="h-9 w-auto transition duration-500 [filter:hue-rotate(220deg)_saturate(1.15)_brightness(0.85)]"
            />
          </Link>

          <ul className="hidden items-center gap-6 text-sm font-medium lg:flex">
            <li>
              <Link to="/" className="transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">
                {t("navbar.home_short")}
              </Link>
            </li>

            <li
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button
                type="button"
                onClick={() => setSolutionsOpen((prev) => !prev)}
                className="flex items-center gap-1 transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]"
              >
                {t("navbar.solutions")}
                <span className={`text-xs transition duration-300 ${solutionsOpen ? "rotate-180" : ""}`}>▼</span>
              </button>

              <div
                className={`absolute left-0 top-full mt-3 w-72 rounded-xl border border-[#162A42]/10 bg-white p-2 text-[#162A42] shadow-2xl transition-all duration-300 ${
                  solutionsOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
                }`}
              >
                {solutionItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    className="block rounded-lg px-3 py-2.5 text-sm transition hover:bg-[#162A42]/5 hover:text-[#2A47F6]"
                  >
                    {t(`navbar.solution_items.${item.key}`)}
                  </Link>
                ))}
              </div>
            </li>

            <li>
              <Link to="/services#como-trabajamos" className="transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">
                {t("navbar.how_we_work")}
              </Link>
            </li>
            <li>
              <Link to="/products" className="transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">
                {t("navbar.cases")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">
                {t("navbar.about")}
              </Link>
            </li>
            <li>
              <Link to="/diagnostico-gratis" className="transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]">
                {t("navbar.free_diagnostic")}
              </Link>
            </li>
          </ul>

          <div className="hidden items-end gap-4 lg:flex">
            <div className="text-right">
              <a
                href="https://wa.me/528116070330"
                target="_blank"
                rel="noopener noreferrer"
                className="ah-nav-cta inline-block rounded-full bg-[#2A47F6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(42,71,246,0.35)] transition duration-500 hover:bg-[#6443DB]"
              >
                {t("navbar.schedule_diagnostic")}
              </a>
            </div>
          </div>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`rounded-lg border p-2 lg:hidden ${
              transparentHeader ? "border-[#162A42]/20 text-[#162A42]" : "border-[#162A42]/15 text-[#162A42]"
            }`}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </nav>

        {isOpen && (
          <div className="mx-auto mt-2 w-full max-w-7xl rounded-2xl border border-[#162A42]/12 bg-white/95 p-4 text-[#162A42] backdrop-blur-xl lg:hidden">
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li>
                <Link to="/" className="block rounded-lg px-3 py-2 hover:bg-[#162A42]/5">
                  {t("navbar.home_short")}
                </Link>
              </li>
              <li className="rounded-lg border border-[#162A42]/10 px-3 py-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#162A42]/65">{t("navbar.solutions")}</p>
                <div className="space-y-1">
                  {solutionItems.map((item) => (
                    <Link key={item.key} to={item.to} className="block rounded-md px-2 py-1.5 text-sm hover:bg-[#162A42]/5">
                      {t(`navbar.solution_items.${item.key}`)}
                    </Link>
                  ))}
                </div>
              </li>
              <li>
                <Link to="/services#como-trabajamos" className="block rounded-lg px-3 py-2 hover:bg-[#162A42]/5">
                  {t("navbar.how_we_work")}
                </Link>
              </li>
              <li>
                <Link to="/products" className="block rounded-lg px-3 py-2 hover:bg-[#162A42]/5">
                  {t("navbar.cases")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="block rounded-lg px-3 py-2 hover:bg-[#162A42]/5">
                  {t("navbar.about")}
                </Link>
              </li>
              <li>
                <Link to="/diagnostico-gratis" className="block rounded-lg px-3 py-2 hover:bg-[#162A42]/5">
                  {t("navbar.free_diagnostic")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="ah-nav-cta mt-2 block rounded-full bg-[#2A47F6] px-4 py-2.5 text-center font-semibold text-white transition duration-500 hover:bg-[#6443DB]"
                >
                  {t("navbar.schedule_diagnostic")}
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/528116070330"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center justify-center gap-2 rounded-full border border-[#162A42]/15 px-4 py-2 text-sm"
                >
                  <FaWhatsapp />
                  {t("navbar.whatsapp")}
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      <a
        href="https://wa.me/528116070330"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 rounded-full bg-[#25D366] p-3 text-white shadow-xl transition duration-500 hover:scale-105 lg:hidden"
        aria-label="WhatsApp"
      >
        <FaWhatsapp className="h-6 w-6" />
      </a>
    </>
  );
};

export default Navbar;
