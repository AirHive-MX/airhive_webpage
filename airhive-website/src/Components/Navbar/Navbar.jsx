import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa";
import { Sun, Moon } from "lucide-react";
import logo from "/logo sin fondo.png";

const productItems = [
  { key: "drone_inventory", to: "/products#drone-inventory" },
  { key: "ai_agents", to: "/products#ai-agents" },
  { key: "other_products", to: "/products#other-products" },
];

const aerpItems = [
  { key: "tracking", to: "/a-erp#tracking" },
  { key: "crm", to: "/a-erp#crm" },
  { key: "wms", to: "/a-erp#wms" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const { t } = useTranslation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const stored = localStorage.getItem("airhive_theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
      return;
    }
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = systemPrefersDark ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("airhive_theme", theme);
  }, [theme]);

  useEffect(() => {
    setIsOpen(false);
    setProductsOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparentHeader = isHome && !scrolled;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <nav
          className={`flex w-full items-center justify-between px-4 py-3 transition-all duration-500 sm:px-6 lg:px-10 ${
            transparentHeader
              ? "bg-white/8 text-[#162A42] shadow-[0_10px_34px_rgba(0,0,0,0.18)] backdrop-blur-md"
              : "bg-white/92 text-[#162A42] shadow-[0_18px_60px_rgba(22,42,66,0.14)] backdrop-blur-xl"
          }`}
        >
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Air Hive"
              className="h-9 w-auto transition duration-500"
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
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <Link
                to="/products"
                className="flex items-center gap-1 transition duration-300 hover:-translate-y-0.5 hover:text-[#2A47F6] hover:[text-shadow:0_0_14px_rgba(42,71,246,0.35)]"
              >
                {t("navbar.cases")}
                <span className={`text-xs transition duration-300 ${productsOpen ? "rotate-180" : ""}`}>▼</span>
              </Link>

              <div
                className={`absolute left-0 top-full mt-3 w-72 rounded-xl border p-2 pt-4 shadow-2xl transition-all duration-300 before:absolute before:-top-3 before:left-0 before:h-3 before:w-full ${
                  theme === "dark"
                    ? "border-white/10 bg-[#1a1a2e] text-[#2A47F6]"
                    : "border-[#162A42]/10 bg-white text-[#162A42]"
                } ${
                  productsOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
                }`}
              >
                {productItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    className={`block rounded-lg px-3 py-2.5 text-sm transition hover:text-[#2A47F6] ${
                      theme === "dark" ? "hover:bg-white/10" : "hover:bg-[#162A42]/5"
                    }`}
                  >
                    {t(`products.${item.key}.title`)}
                  </Link>
                ))}
                <div className={`my-1 border-t ${theme === "dark" ? "border-white/10" : "border-[#162A42]/10"}`} />
                <p className={`px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-[0.2em] ${theme === "dark" ? "text-white/50" : "text-[#162A42]/50"}`}>A-ERP</p>
                {aerpItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    className={`block rounded-lg px-3 py-2.5 text-sm transition hover:text-[#2A47F6] ${
                      theme === "dark" ? "hover:bg-white/10" : "hover:bg-[#162A42]/5"
                    }`}
                  >
                    {t(`products.${item.key}.title`)}
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

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`rounded-full p-2 transition-all duration-300 hover:bg-[#162A42]/10 ${
                scrolled ? "pointer-events-none w-0 scale-0 opacity-0" : "w-auto scale-100 opacity-100"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <a
              href="https://wa.me/528116070330"
              target="_blank"
              rel="noopener noreferrer"
              className="ah-nav-cta inline-block rounded-full bg-[#2A47F6] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(42,71,246,0.35)] transition duration-500 hover:bg-[#6443DB]"
            >
              {t("navbar.schedule_diagnostic")}
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className={`rounded-full p-2 transition-all duration-300 hover:bg-[#162A42]/10 ${
                scrolled ? "pointer-events-none scale-0 opacity-0" : "scale-100 opacity-100"
              }`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`rounded-lg border p-2 ${
              transparentHeader ? "border-[#162A42]/20 text-[#162A42]" : "border-[#162A42]/15 text-[#162A42]"
            }`}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
          </div>
        </nav>

        {isOpen && (
          <div className="w-full border-t border-[#162A42]/12 bg-white/95 p-4 text-[#162A42] backdrop-blur-xl lg:hidden">
            <ul className="flex flex-col gap-2 text-sm font-medium">
              <li>
                <Link to="/" className="block rounded-lg px-3 py-2 hover:bg-[#162A42]/5">
                  {t("navbar.home_short")}
                </Link>
              </li>
              <li className="rounded-lg border border-[#162A42]/10 px-3 py-2">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#162A42]/65">{t("navbar.cases")}</p>
                <div className="space-y-1">
                  {productItems.map((item) => (
                    <Link key={item.key} to={item.to} className="block rounded-md px-2 py-1.5 text-sm hover:bg-[#162A42]/5">
                      {t(`products.${item.key}.title`)}
                    </Link>
                  ))}
                </div>
                <div className="my-2 border-t border-[#162A42]/10" />
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#162A42]/65">A-ERP</p>
                <div className="space-y-1">
                  {aerpItems.map((item) => (
                    <Link key={item.key} to={item.to} className="block rounded-md px-2 py-1.5 text-sm hover:bg-[#162A42]/5">
                      {t(`products.${item.key}.title`)}
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
