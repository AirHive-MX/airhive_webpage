import { Fragment } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Soluciones from "../../Components/Soluciones/Soluciones";

const Services = () => {
  const { t } = useTranslation();

return (
    <main className="ah-page pt-28">
      <section id="como-trabajamos" className="scroll-mt-28 py-16" style={{ background: "linear-gradient(180deg,#FFFFFF 0%,#F5F6FA 100%)" }}>
        <div className="ah-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1501A5]/70">
              {t("services_redesign.process_kicker")}
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-[#0A1A3F] sm:text-4xl" style={{ letterSpacing: "-0.5px" }}>
              {t("services_redesign.process_title")}
            </h2>
          </motion.div>

          {/* Desktop */}
          <div className="hidden md:grid items-stretch" style={{ gridTemplateColumns: "1fr 28px 1fr 28px 1fr 28px 1fr", gap: 0 }}>
            {[
              { titleKey: "services_redesign.process_1_title", descKey: "services_redesign.process_1_desc", icon: (
                <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="22" cy="22" r="10"/><path d="M30 30 L40 40"/><path d="M22 17 L22 22 L26 24"/>
                </svg>
              )},
              { titleKey: "services_redesign.process_2_title", descKey: "services_redesign.process_2_desc", icon: (
                <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 36 L12 14 L26 14"/><path d="M12 24 L22 24"/><circle cx="32" cy="14" r="4"/><circle cx="32" cy="34" r="4"/><path d="M32 18 L32 30"/>
                </svg>
              )},
              { titleKey: "services_redesign.process_3_title", descKey: "services_redesign.process_3_desc", icon: (
                <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M24 6 L24 30"/><path d="M16 14 L24 6 L32 14"/><rect x="10" y="32" width="28" height="10" rx="2"/>
                </svg>
              )},
              { titleKey: "services_redesign.process_4_title", descKey: "services_redesign.process_4_desc", icon: (
                <svg width="56" height="56" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 36 L8 12"/><path d="M8 36 L40 36"/><path d="M14 30 L20 22 L26 26 L36 14"/><path d="M30 14 L36 14 L36 20"/>
                </svg>
              )},
            ].map(({ titleKey, descKey, icon }, idx) => {
              const isActive = idx === 2;
              return (
                <Fragment key={idx}>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: idx * 0.12 }}
                    whileHover={{
                      boxShadow: isActive
                        ? "0 12px 40px rgba(45,63,231,0.7), 0 0 0 1px rgba(91,79,224,0.5)"
                        : "0 8px 32px rgba(45,63,231,0.55), 0 0 0 1px rgba(45,63,231,0.35)",
                      y: -4,
                    }}
                    className="relative flex flex-col items-center rounded-2xl px-5 py-8"
                    style={{
                      background: isActive ? "linear-gradient(180deg,#3D4FF0 0%,#1E2FD8 100%)" : "#0A1A3F",
                      boxShadow: isActive ? "0 8px 24px rgba(45,63,231,0.35)" : "0 4px 16px rgba(10,26,63,0.12)",
                      minHeight: "240px", color: "#FFFFFF",
                    }}
                  >
                    <span className="absolute left-4 top-3.5 text-xs font-semibold tracking-wide"
                      style={{ color: isActive ? "rgba(255,255,255,0.7)" : "#5B4FE0" }}>
                      0{idx + 1}
                    </span>
                    <div className="mt-5">{icon}</div>
                    <div className="mt-auto pt-4 text-center">
                      <p className="text-lg font-bold">{t(titleKey)}</p>
                      <div className="mx-auto my-2 h-[2px] w-7 rounded-full"
                        style={{ background: isActive ? "#FFFFFF" : "#2D3FE7" }} />
                      <p className="text-xs leading-relaxed"
                        style={{ color: isActive ? "#E0E5FF" : "#A8B2CC" }}>{t(descKey)}</p>
                    </div>
                  </motion.div>
                  {idx < 3 && (
                    <div className="flex items-center justify-center" style={{ color: "#2D3FE7" }}>
                      <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8 L12 8"/><path d="M9 5 L12 8 L9 11"/>
                      </svg>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>

          {/* Mobile */}
          <div className="flex flex-col items-center gap-3 md:hidden">
            {[
              { titleKey: "services_redesign.process_1_title", descKey: "services_redesign.process_1_desc" },
              { titleKey: "services_redesign.process_2_title", descKey: "services_redesign.process_2_desc" },
              { titleKey: "services_redesign.process_3_title", descKey: "services_redesign.process_3_desc" },
              { titleKey: "services_redesign.process_4_title", descKey: "services_redesign.process_4_desc" },
            ].map(({ titleKey, descKey }, idx) => {
              const isActive = idx === 2;
              return (
                <Fragment key={idx}>
                  <div className="w-full rounded-2xl px-5 py-6 text-white"
                    style={{
                      background: isActive ? "linear-gradient(180deg,#3D4FF0 0%,#1E2FD8 100%)" : "#0A1A3F",
                      boxShadow: isActive ? "0 8px 24px rgba(45,63,231,0.35)" : "0 4px 16px rgba(10,26,63,0.12)",
                    }}>
                    <span className="text-xs font-semibold tracking-wide" style={{ color: isActive ? "rgba(255,255,255,0.7)" : "#5B4FE0" }}>0{idx + 1}</span>
                    <p className="mt-2 text-base font-bold">{t(titleKey)}</p>
                    <div className="my-2 h-[2px] w-7 rounded-full" style={{ background: isActive ? "#FFFFFF" : "#2D3FE7" }} />
                    <p className="text-xs leading-relaxed" style={{ color: isActive ? "#E0E5FF" : "#A8B2CC" }}>{t(descKey)}</p>
                  </div>
                  {idx < 3 && (
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#2D3FE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(90deg)" }}>
                      <path d="M3 8 L12 8"/><path d="M9 5 L12 8 L9 11"/>
                    </svg>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      </section>

      <Soluciones />

    </main>
  );
};

export default Services;
