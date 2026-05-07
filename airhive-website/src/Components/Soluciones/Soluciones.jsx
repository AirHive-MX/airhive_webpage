import { useTranslation } from "react-i18next";
import "./Soluciones.css";

const Soluciones = () => {
  const { t } = useTranslation();

  return (
    <section id="ah-solutions">
      <p className="ah-sol-kicker">{t("services_redesign.solutions_kicker")}</p>
      <h2 className="ah-sol-title">{t("services_redesign.solutions_title")}</h2>

      <div className="ah-sol-grid">

        {/* 1 — Inventory Drones */}
        <article className="ah-sol-card">
          <div className="ah-img-wrap">
            <img src="/almacen.png" alt="" className="ah-img-drone" />
            <div className="ah-overlay ah-overlay--blue" />
            <div className="ah-badge">{t("services_redesign.solutions_b1")}</div>
          </div>
          <div className="ah-sol-body">
            <div className="ah-sol-card-title">{t("services_redesign.solutions_t1")}</div>
            <div className="ah-sol-line" />
            <div className="ah-sol-desc">{t("services_redesign.solutions_d1")}</div>
          </div>
        </article>

        {/* 2 — WMS Platform */}
        <article className="ah-sol-card">
          <div className="ah-img-wrap ah-img-wrap--gradient-blue">
            <div className="ah-mockup">
              <div className="ah-mockup-header">
                <div className="ah-mockup-dots">
                  <span style={{ background: "#FF5F57" }} />
                  <span style={{ background: "#FEBC2E" }} />
                  <span style={{ background: "#28C840" }} />
                </div>
                <div className="ah-mockup-name">WareHive WMS</div>
              </div>
              <div className="ah-mockup-stats">
                <div className="ah-stat">
                  <div className="ah-stat-label">{t("services_redesign.solutions_m1")}</div>
                  <div className="ah-stat-value">1,247</div>
                </div>
                <div className="ah-stat ah-stat--accent">
                  <div className="ah-stat-label">{t("services_redesign.solutions_m2")}</div>
                  <div className="ah-stat-value ah-stat-value--accent">99.8%</div>
                </div>
                <div className="ah-stat">
                  <div className="ah-stat-label">{t("services_redesign.solutions_m3")}</div>
                  <div className="ah-stat-value">432</div>
                </div>
              </div>
              <div className="ah-mockup-chart">
                <div style={{ height: "35%", background: "#E0E5FF" }} />
                <div style={{ height: "55%", background: "#A8B2FF" }} />
                <div style={{ height: "45%", background: "#5B4FE0" }} />
                <div style={{ height: "75%", background: "#2D3FE7" }} />
                <div style={{ height: "65%", background: "#1E2FD8" }} />
                <div style={{ height: "90%", background: "#0A1A3F" }} />
              </div>
            </div>
            <div className="ah-badge">{t("services_redesign.solutions_b2")}</div>
          </div>
          <div className="ah-sol-body">
            <div className="ah-sol-card-title">{t("services_redesign.solutions_t2")}</div>
            <div className="ah-sol-line" />
            <div className="ah-sol-desc">{t("services_redesign.solutions_d2")}</div>
          </div>
        </article>

        {/* 3 — System Integration */}
        <article className="ah-sol-card">
          <div className="ah-img-wrap ah-img-wrap--gradient-deep">
            <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" className="ah-hub-svg">
              <defs>
                <linearGradient id="ah-hub-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#5B4FE0" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#5B4FE0" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <line x1="200" y1="100" x2="70"  y2="55"  stroke="url(#ah-hub-line)" strokeWidth="1.5" />
              <line x1="200" y1="100" x2="330" y2="55"  stroke="url(#ah-hub-line)" strokeWidth="1.5" />
              <line x1="200" y1="100" x2="70"  y2="145" stroke="url(#ah-hub-line)" strokeWidth="1.5" />
              <line x1="200" y1="100" x2="330" y2="145" stroke="url(#ah-hub-line)" strokeWidth="1.5" />
              <line x1="200" y1="100" x2="200" y2="35"  stroke="url(#ah-hub-line)" strokeWidth="1.5" />
              <line x1="200" y1="100" x2="200" y2="165" stroke="url(#ah-hub-line)" strokeWidth="1.5" />
              <circle cx="200" cy="100" r="34" fill="#FFFFFF" opacity="0.12" />
              <circle cx="200" cy="100" r="24" fill="#FFFFFF" />
              <text x="200" y="106" textAnchor="middle" fill="#1E2FD8" fontSize="12" fontWeight="800">AH</text>
              <circle cx="70"  cy="55"  r="15" fill="#FFFFFF" opacity="0.95" />
              <circle cx="330" cy="55"  r="15" fill="#FFFFFF" opacity="0.95" />
              <circle cx="70"  cy="145" r="15" fill="#FFFFFF" opacity="0.95" />
              <circle cx="330" cy="145" r="15" fill="#FFFFFF" opacity="0.95" />
              <circle cx="200" cy="35"  r="13" fill="#FFFFFF" opacity="0.95" />
              <circle cx="200" cy="165" r="13" fill="#FFFFFF" opacity="0.95" />
              <text x="70"  y="59"  textAnchor="middle" fill="#0A1A3F" fontSize="9" fontWeight="700">ERP</text>
              <text x="330" y="59"  textAnchor="middle" fill="#0A1A3F" fontSize="9" fontWeight="700">SAP</text>
              <text x="70"  y="149" textAnchor="middle" fill="#0A1A3F" fontSize="9" fontWeight="700">API</text>
              <text x="330" y="149" textAnchor="middle" fill="#0A1A3F" fontSize="9" fontWeight="700">BI</text>
              <text x="200" y="38"  textAnchor="middle" fill="#0A1A3F" fontSize="8" fontWeight="700">CRM</text>
              <text x="200" y="168" textAnchor="middle" fill="#0A1A3F" fontSize="8" fontWeight="700">DB</text>
            </svg>
            <div className="ah-badge">{t("services_redesign.solutions_b3")}</div>
          </div>
          <div className="ah-sol-body">
            <div className="ah-sol-card-title">{t("services_redesign.solutions_t3")}</div>
            <div className="ah-sol-line" />
            <div className="ah-sol-desc">{t("services_redesign.solutions_d3")}</div>
          </div>
        </article>

        {/* 4 — Warehouse Monitoring */}
        <article className="ah-sol-card">
          <div className="ah-img-wrap">
            <img src="/foto almacen dron volando.png" alt="" className="ah-img-monitoring" />
            <div className="ah-overlay ah-overlay--purple" />
            <div className="ah-badge">{t("services_redesign.solutions_b4")}</div>
            <div className="ah-live-pill">
              <span className="ah-live-dot" />
              <span className="ah-live-label">{t("services_redesign.solutions_live")}</span>
            </div>
          </div>
          <div className="ah-sol-body">
            <div className="ah-sol-card-title">{t("services_redesign.solutions_t4")}</div>
            <div className="ah-sol-line" />
            <div className="ah-sol-desc">{t("services_redesign.solutions_d4")}</div>
          </div>
        </article>

      </div>
    </section>
  );
};

export default Soluciones;
