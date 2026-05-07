import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./FlujoOperativo.css";

const stepIcons = [
  <svg key="1" className="ah-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V12M12 12L8 16M12 12L16 16" /><circle cx="12" cy="6" r="4" />
  </svg>,
  <svg key="2" className="ah-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="6" height="16" /><rect x="15" y="4" width="6" height="16" />
    <line x1="3" y1="10" x2="9" y2="10" /><line x1="15" y1="10" x2="21" y2="10" />
    <line x1="3" y1="16" x2="9" y2="16" /><line x1="15" y1="16" x2="21" y2="16" />
  </svg>,
  <svg key="3" className="ah-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="4" x2="4" y2="20" /><line x1="7" y1="4" x2="7" y2="20" />
    <line x1="11" y1="4" x2="11" y2="20" /><line x1="14" y1="4" x2="14" y2="20" />
    <line x1="17" y1="4" x2="17" y2="20" /><line x1="20" y1="4" x2="20" y2="20" />
  </svg>,
  <svg key="4" className="ah-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12a8 8 0 0116 0" /><path d="M7 12a5 5 0 0110 0" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>,
  <svg key="5" className="ah-step-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="7" y1="14" x2="7" y2="17" /><line x1="12" y1="10" x2="12" y2="17" /><line x1="17" y1="7" x2="17" y2="17" />
  </svg>,
];

const FlujoOperativo = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const countRef = useRef(0);
  const [count, setCount] = useState(0);

  const stepKeys = [
    { titleKey: "home_redesign.flujo_step1_title", descKey: "home_redesign.flujo_step1_desc" },
    { titleKey: "home_redesign.flujo_step2_title", descKey: "home_redesign.flujo_step2_desc" },
    { titleKey: "home_redesign.flujo_step3_title", descKey: "home_redesign.flujo_step3_desc" },
    { titleKey: "home_redesign.flujo_step4_title", descKey: "home_redesign.flujo_step4_desc" },
    { titleKey: "home_redesign.flujo_step5_title", descKey: "home_redesign.flujo_step5_desc" },
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stepKeys.length);
    }, 2400);

    const counterInterval = setInterval(() => {
      countRef.current += Math.floor(Math.random() * 7) + 3;
      if (countRef.current > 9999) countRef.current = 0;
      setCount(countRef.current);
    }, 400);

    return () => {
      clearInterval(stepInterval);
      clearInterval(counterInterval);
    };
  }, []);

  return (
    <div className="ah-wrap" aria-label="Flujo operativo del dron Air Hive">
      <div className="ah-stage">
        <div className="ah-grid" />

        <div className="ah-status">
          <span className="ah-dot" />
          {t("home_redesign.flujo_status")}
        </div>

        <div className="ah-counter">
          <div className="ah-counter-label">{t("home_redesign.flujo_counter_label")}</div>
          <div className="ah-counter-value">{count.toLocaleString("es-MX")}</div>
        </div>

        <svg className="ah-warehouse" viewBox="0 0 680 320" preserveAspectRatio="none" width="100%" height="100%">
          <g opacity="0.5">
            {[80, 200, 320, 440, 560].map((x) => (
              <g key={x}>
                <rect x={x} y="190" width="80" height="100" fill="none" stroke="#94A3B8" strokeWidth="1" />
                <line x1={x} y1="223" x2={x + 80} y2="223" stroke="#94A3B8" strokeWidth="0.5" />
                <line x1={x} y1="256" x2={x + 80} y2="256" stroke="#94A3B8" strokeWidth="0.5" />
                <rect x={x + 6}  y="196" width="32" height="22" fill="#CBD5E1" opacity="0.6" />
                <rect x={x + 44} y="196" width="32" height="22" fill="#CBD5E1" opacity="0.6" />
                <rect x={x + 6}  y="229" width="32" height="22" fill="#CBD5E1" opacity="0.6" />
                <rect x={x + 44} y="229" width="32" height="22" fill="#CBD5E1" opacity="0.6" />
                <rect x={x + 6}  y="262" width="32" height="22" fill="#CBD5E1" opacity="0.6" />
                <rect x={x + 44} y="262" width="32" height="22" fill="#CBD5E1" opacity="0.6" />
              </g>
            ))}
          </g>
          <line x1="40" y1="292" x2="640" y2="292" stroke="#CBD5E1" strokeWidth="1" />

          {[80, 200, 320, 440, 560].map((x, i) => {
            const cx = x + 40;
            const delay = `${i * 0.35}s`;
            return (
              <g key={`signal-${x}`}>
                <path
                  d={`M ${cx} 185 L ${cx} 95`}
                  fill="none" stroke="#6443DB" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round"
                  style={{ animation: "ah-data 1.5s linear infinite", animationDelay: delay }}
                />
                <circle cx={cx} cy="185" r="3" fill="#6443DB" opacity="0.8" />
                <g style={{ animation: "ah-signal 2s ease-in-out infinite", animationDelay: delay }}>
                  <path d={`M ${cx - 8} 99 Q ${cx} 91 ${cx + 8} 99`} fill="none" stroke="#6443DB" strokeWidth="1.5" strokeLinecap="round" />
                  <path d={`M ${cx - 13} 94 Q ${cx} 82 ${cx + 13} 94`} fill="none" stroke="#6443DB" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                </g>
              </g>
            );
          })}
        </svg>

        <div className="ah-drone-track">
          <div className="ah-drone">
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle className="ah-scan-ring" cx="30" cy="30" r="14" fill="none" stroke="#2A47F6" strokeWidth="1.5" opacity="0.6" />
              <circle className="ah-scan-ring" cx="30" cy="30" r="14" fill="none" stroke="#2A47F6" strokeWidth="1.5" opacity="0.6" style={{ animationDelay: "0.8s" }} />
              <line x1="30" y1="30" x2="14" y2="14" stroke="#162A42" strokeWidth="2" strokeLinecap="round" />
              <line x1="30" y1="30" x2="46" y2="14" stroke="#162A42" strokeWidth="2" strokeLinecap="round" />
              <line x1="30" y1="30" x2="14" y2="46" stroke="#162A42" strokeWidth="2" strokeLinecap="round" />
              <line x1="30" y1="30" x2="46" y2="46" stroke="#162A42" strokeWidth="2" strokeLinecap="round" />
              <circle cx="30" cy="30" r="6" fill="#162A42" />
              <circle cx="30" cy="30" r="3" fill="#2A47F6" />
              {[{ cx: 14, cy: 14 }, { cx: 46, cy: 14 }, { cx: 14, cy: 46 }, { cx: 46, cy: 46 }].map(({ cx, cy }) => (
                <ellipse key={`${cx}-${cy}`} className="ah-prop" cx={cx} cy={cy} rx="8" ry="1.5" fill="#2A47F6" opacity="0.4" style={{ transformOrigin: `${cx}px ${cy}px` }} />
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="ah-steps">
        {stepKeys.map((step, idx) => (
          <div key={idx} className={`ah-step${activeStep === idx ? " ah-active" : ""}`}>
            <div className="ah-step-num">{idx + 1}</div>
            {stepIcons[idx]}
            <div className="ah-step-title">{t(step.titleKey)}</div>
            <div className="ah-step-desc">{t(step.descKey)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlujoOperativo;
