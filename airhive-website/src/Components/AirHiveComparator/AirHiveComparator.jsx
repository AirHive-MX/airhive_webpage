import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./AirHiveComparator.css";

const AirHiveComparator = () => {
  const { t } = useTranslation();
  const wrapRef = useRef(null);
  const stageRef = useRef(null);
  const handleRef = useRef(null);
  const afterRef = useRef(null);
  const labelBeforeRef = useRef(null);
  const labelAfterRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const handle = handleRef.current;
    const after = afterRef.current;
    const labelBefore = labelBeforeRef.current;
    const labelAfter = labelAfterRef.current;

    let isDragging = false;
    let introInterval = null;

    function updatePos(percent) {
      const pos = Math.max(0, Math.min(100, percent));
      handle.style.left = pos + "%";
      after.style.clipPath = "inset(0 0 0 " + pos + "%)";
      if (pos >= 55) {
        labelBefore.classList.add("ah-active");
        labelAfter.classList.remove("ah-active");
      } else if (pos <= 45) {
        labelAfter.classList.add("ah-active");
        labelBefore.classList.remove("ah-active");
      } else {
        labelBefore.classList.remove("ah-active");
        labelAfter.classList.remove("ah-active");
      }
    }

    function getPercent(clientX) {
      const rect = stage.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    }

    const onMouseDown = (e) => { isDragging = true; updatePos(getPercent(e.clientX)); };
    const onMouseMove = (e) => { if (isDragging) updatePos(getPercent(e.clientX)); };
    const onMouseUp = () => { isDragging = false; };
    const onTouchStart = (e) => { isDragging = true; updatePos(getPercent(e.touches[0].clientX)); };
    const onTouchMove = (e) => { if (isDragging) updatePos(getPercent(e.touches[0].clientX)); };
    const onTouchEnd = () => { isDragging = false; };

    stage.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);

    const introTimeout = setTimeout(() => {
      let step = 0;
      introInterval = setInterval(() => {
        step++;
        if (step <= 50) {
          const prog = step / 50;
          const eased = 0.5 - 0.5 * Math.cos(prog * Math.PI * 2);
          updatePos(15 + eased * 70);
        } else if (step <= 70) {
          const prog = (step - 50) / 20;
          updatePos(15 + (50 - 15) * prog);
        } else {
          clearInterval(introInterval);
          updatePos(50);
        }
      }, 40);
    }, 600);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (wrapRef.current) {
          wrapRef.current.classList.toggle("ah-paused", !entry.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );
    if (wrapRef.current) observer.observe(wrapRef.current);

    return () => {
      stage.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      stage.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      clearTimeout(introTimeout);
      if (introInterval) clearInterval(introInterval);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="ah-compare" ref={wrapRef}>
      <div className="ah-c-header">
        <span className="ah-c-eyebrow">{t("comparator.eyebrow")}</span>
        <h2 className="ah-c-title">{t("comparator.title")}</h2>
      </div>

      <div className="ah-c-stage" ref={stageRef}>

        {/* ========== ANTES ========== */}
        <div className="ah-c-scene ah-c-before">
          <svg viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid meet">
            <rect width="1200" height="675" fill="#F8F9FB" />
            <rect width="1200" height="675" fill="#0A1530" opacity="0.03" />
            <defs>
              <pattern id="ah-grid-b" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#9CA3AF" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="1200" height="675" fill="url(#ah-grid-b)" opacity="0.2" />
            <rect x="0" y="540" width="1200" height="135" fill="#E5E7EB" />
            <line x1="0" y1="540" x2="1200" y2="540" stroke="#9CA3AF" strokeWidth="1" />

            {/* Badge 1 */}
            <g transform="translate(60, 110)">
              <rect x="0" y="0" width="180" height="46" rx="8" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.5" />
              <circle cx="22" cy="23" r="11" fill="#DC2626" />
              <text x="22" y="28" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff">!</text>
              <text x="40" y="19" fontSize="12" fontWeight="700" fill="#7F1D1D">{t("comparator.before_b1_l1")}</text>
              <text x="40" y="34" fontSize="12" fontWeight="700" fill="#7F1D1D">{t("comparator.before_b1_l2")}</text>
            </g>
            {/* Badge 2 */}
            <g transform="translate(280, 110)">
              <rect x="0" y="0" width="170" height="46" rx="8" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.5" />
              <circle cx="22" cy="23" r="11" fill="#DC2626" />
              <text x="22" y="28" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff">×</text>
              <text x="40" y="19" fontSize="12" fontWeight="700" fill="#7F1D1D">{t("comparator.before_b2_l1")}</text>
              <text x="40" y="34" fontSize="12" fontWeight="700" fill="#7F1D1D">{t("comparator.before_b2_l2")}</text>
            </g>
            {/* Badge 3 */}
            <g transform="translate(960, 110)">
              <rect x="0" y="0" width="180" height="46" rx="8" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.5" />
              <circle cx="22" cy="23" r="11" fill="#DC2626" />
              <text x="22" y="28" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff">⚠</text>
              <text x="40" y="19" fontSize="12" fontWeight="700" fill="#7F1D1D">{t("comparator.before_b3_l1")}</text>
              <text x="40" y="34" fontSize="12" fontWeight="700" fill="#7F1D1D">{t("comparator.before_b3_l2")}</text>
            </g>

            {/* Floating message */}
            <g transform="translate(600, 240)" className="ah-msg-pulse">
              <rect x="-230" y="-45" width="460" height="100" rx="14" fill="#fff" stroke="#DC2626" strokeWidth="2" />
              <text x="0" y="-12" textAnchor="middle" fontSize="22" fontWeight="800" fill="#7F1D1D">{t("comparator.before_msg_title")}</text>
              <text x="0" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="#9CA3AF">{t("comparator.before_msg_sub")}</text>
              <text x="0" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="#DC2626">{t("comparator.before_msg_stat")}</text>
            </g>

            {/* Left rack */}
            <g transform="translate(60, 350)">
              <rect x="0" y="0" width="14" height="200" fill="#0A1530" />
              <rect x="14" y="0" width="6" height="200" fill="#1E2B4D" />
              <rect x="180" y="0" width="14" height="200" fill="#0A1530" />
              <rect x="194" y="0" width="6" height="200" fill="#1E2B4D" />
              <rect x="0" y="20" width="200" height="14" fill="#6B7280" />
              <rect x="0" y="88" width="200" height="6" fill="#6B7280" />
              <rect x="0" y="148" width="200" height="6" fill="#6B7280" />
              <g transform="translate(22, 40)">
                <g transform="rotate(-6) translate(0, 3)" className="ah-shake">
                  <rect x="0" y="0" width="38" height="46" fill="#A78B71" stroke="#6B5340" strokeWidth="0.8" />
                  <rect x="0" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" />
                  <g opacity="0.5"><rect x="6" y="30" width="1.5" height="12" fill="#0A1530" /><rect x="9" y="30" width="0.8" height="12" fill="#0A1530" /><rect x="11" y="30" width="2" height="12" fill="#0A1530" /></g>
                </g>
                <rect x="42" y="0" width="38" height="46" fill="none" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 2" />
                <text x="61" y="28" textAnchor="middle" fontSize="9" fontWeight="900" fill="#DC2626">{t("comparator.before_empty")}</text>
                <rect x="84" y="-4" width="38" height="50" fill="#B89978" stroke="#6B5340" strokeWidth="0.8" />
                <rect x="84" y="-4" width="38" height="2" fill="#6B5340" opacity="0.4" />
                <g transform="rotate(8 145 23)"><rect x="126" y="0" width="38" height="46" fill="#C9B49C" stroke="#6B5340" strokeWidth="0.8" /><rect x="126" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" /></g>
              </g>
              <g transform="translate(22, 100)">
                <rect x="0" y="0" width="38" height="46" fill="#B89978" stroke="#6B5340" strokeWidth="0.8" />
                <rect x="0" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" />
                <g opacity="0.5"><rect x="6" y="30" width="1.5" height="12" fill="#0A1530" /><rect x="9" y="30" width="0.8" height="12" fill="#0A1530" /></g>
                <g transform="rotate(-4 61 23)"><rect x="42" y="0" width="38" height="46" fill="#A78B71" stroke="#6B5340" strokeWidth="0.8" /><rect x="42" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" /></g>
                <rect x="84" y="0" width="38" height="46" fill="none" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 2" />
                <text x="103" y="28" textAnchor="middle" fontSize="9" fontWeight="900" fill="#DC2626">{t("comparator.before_empty")}</text>
                <rect x="126" y="0" width="38" height="46" fill="#C9B49C" stroke="#6B5340" strokeWidth="0.8" />
                <rect x="126" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" />
              </g>
              <g transform="translate(22, 149)">
                <rect x="0" y="0" width="38" height="46" fill="#A78B71" stroke="#6B5340" strokeWidth="0.8" />
                <rect x="0" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" />
                <g opacity="0.5"><rect x="6" y="30" width="1.5" height="12" fill="#0A1530" /><rect x="9" y="30" width="0.8" height="12" fill="#0A1530" /><rect x="11" y="30" width="2" height="12" fill="#0A1530" /></g>
                <g transform="rotate(6 61 23)"><rect x="42" y="0" width="38" height="46" fill="#B89978" stroke="#6B5340" strokeWidth="0.8" /><rect x="42" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" /><g opacity="0.5"><rect x="48" y="30" width="1.5" height="12" fill="#0A1530" /><rect x="51" y="30" width="2" height="12" fill="#0A1530" /></g></g>
                <rect x="126" y="0" width="38" height="46" fill="#C9B49C" stroke="#6B5340" strokeWidth="0.8" />
                <rect x="126" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" />
                <g opacity="0.5"><rect x="132" y="30" width="1.5" height="12" fill="#0A1530" /><rect x="135" y="30" width="2" height="12" fill="#0A1530" /></g>
              </g>
            </g>

            {/* Fallen boxes */}
            <g transform="translate(290, 580) rotate(-15)">
              <rect x="0" y="0" width="50" height="40" fill="#A78B71" stroke="#6B5340" strokeWidth="0.8" />
              <rect x="0" y="0" width="50" height="3" fill="#6B5340" opacity="0.4" />
              <g opacity="0.4"><rect x="8" y="20" width="2" height="14" fill="#0A1530" /><rect x="12" y="20" width="1" height="14" fill="#0A1530" /><rect x="15" y="20" width="3" height="14" fill="#0A1530" /></g>
            </g>
            <g transform="translate(360, 605) rotate(20)">
              <rect x="0" y="0" width="40" height="32" fill="#C9B49C" stroke="#6B5340" strokeWidth="0.8" />
              <rect x="0" y="0" width="40" height="2.5" fill="#6B5340" opacity="0.4" />
            </g>
            <g transform="translate(330, 555) rotate(-8)">
              <rect x="0" y="0" width="45" height="28" fill="#B89978" stroke="#6B5340" strokeWidth="0.8" />
              <rect x="0" y="0" width="45" height="3" fill="#6B5340" opacity="0.4" />
            </g>
            <g transform="translate(245, 590) rotate(-45)">
              <rect x="0" y="0" width="40" height="32" fill="#A78B71" stroke="#6B5340" strokeWidth="0.8" />
              <rect x="0" y="0" width="40" height="3" fill="#6B5340" opacity="0.4" />
            </g>
            <g transform="translate(720, 600) rotate(12)">
              <rect x="0" y="0" width="44" height="34" fill="#B89978" stroke="#6B5340" strokeWidth="0.8" />
              <rect x="0" y="0" width="44" height="3" fill="#6B5340" opacity="0.4" />
              <g opacity="0.4"><rect x="6" y="18" width="2" height="14" fill="#0A1530" /><rect x="10" y="18" width="1" height="14" fill="#0A1530" /></g>
            </g>
            <g transform="translate(770, 625) rotate(-20)">
              <rect x="0" y="0" width="36" height="28" fill="#A78B71" stroke="#6B5340" strokeWidth="0.8" />
              <rect x="0" y="0" width="36" height="3" fill="#6B5340" opacity="0.4" />
            </g>
            <g transform="translate(900, 605) rotate(15)">
              <rect x="0" y="0" width="48" height="36" fill="#A78B71" stroke="#6B5340" strokeWidth="0.8" />
              <rect x="0" y="0" width="48" height="3" fill="#6B5340" opacity="0.4" />
              <g opacity="0.4"><rect x="8" y="20" width="2" height="14" fill="#0A1530" /><rect x="12" y="20" width="1" height="14" fill="#0A1530" /><rect x="15" y="20" width="3" height="14" fill="#0A1530" /></g>
            </g>
            <g transform="translate(870, 580) rotate(-30)">
              <rect x="0" y="0" width="42" height="34" fill="#B89978" stroke="#6B5340" strokeWidth="0.8" />
              <rect x="0" y="0" width="42" height="3" fill="#6B5340" opacity="0.4" />
            </g>

            {/* Forklift */}
            <g transform="translate(440, 540)">
              <ellipse cx="120" cy="6" rx="135" ry="8" fill="#0A1530" opacity="0.18" />
              <rect x="0" y="-180" width="14" height="180" fill="#0A1530" />
              <rect x="3" y="-175" width="2" height="170" fill="#1E2B4D" />
              <rect x="9" y="-175" width="2" height="170" fill="#1E2B4D" />
              <rect x="-5" y="-100" width="24" height="50" fill="#0A1530" />
              <rect x="-2" y="-95" width="18" height="40" fill="#1E2B4D" />
              <rect x="14" y="-55" width="50" height="6" fill="#0A1530" />
              <rect x="14" y="-12" width="50" height="6" fill="#0A1530" />
              <polygon points="64,-55 74,-55 64,-49" fill="#0A1530" />
              <polygon points="64,-12 74,-12 64,-6" fill="#0A1530" />
              <path d="M 60 -120 L 60 -25 L 240 -25 L 240 -130 L 200 -130 L 195 -125 L 130 -125 L 125 -120 Z" fill="#2D4EF5" />
              <rect x="60" y="-30" width="180" height="8" fill="#1E3AC4" />
              <rect x="232" y="-220" width="10" height="100" fill="#0A1530" />
              <path d="M 60 -120 Q 60 -180 100 -210 L 232 -210 L 232 -200 L 105 -200 Q 70 -175 70 -120 Z" fill="#0A1530" />
              <path d="M 78 -125 Q 78 -175 110 -200 L 220 -200 L 220 -195 L 113 -195 Q 85 -172 85 -125 Z" fill="#F8F9FB" opacity="0.3" />
              <path d="M 175 -130 L 175 -75 L 200 -75 L 200 -135 Q 200 -140 195 -140 L 180 -140 Q 175 -140 175 -135 Z" fill="#0A1530" />
              <rect x="135" y="-78" width="65" height="10" rx="3" fill="#0A1530" />
              <g transform="translate(150, -135)">
                <path d="M 0 25 L 0 50 L 30 50 L 30 25 Q 30 18 23 18 L 7 18 Q 0 18 0 25 Z" fill="#5C7BFF" />
                <rect x="2" y="28" width="26" height="18" fill="#FCD34D" opacity="0.95" />
                <rect x="2" y="34" width="26" height="2" fill="#fff" opacity="0.8" />
                <circle cx="15" cy="10" r="9" fill="#F5C4B3" />
                <path d="M 5 8 Q 5 -2 15 -2 Q 25 -2 25 8 L 25 12 L 5 12 Z" fill="#FCD34D" />
                <rect x="5" y="11" width="20" height="2" fill="#F59E0B" />
                <line x1="10" y1="9" x2="12" y2="11" stroke="#0A1530" strokeWidth="1" strokeLinecap="round" />
                <line x1="18" y1="11" x2="20" y2="9" stroke="#0A1530" strokeWidth="1" strokeLinecap="round" />
                <ellipse cx="15" cy="15" rx="2" ry="1" fill="none" stroke="#0A1530" strokeWidth="1" />
                <rect x="-8" y="22" width="14" height="6" fill="#5C7BFF" rx="2" transform="rotate(-15 -1 25)" />
              </g>
              <g transform="translate(120, -100)">
                <line x1="0" y1="0" x2="0" y2="-15" stroke="#0A1530" strokeWidth="3" />
                <circle cx="0" cy="-18" r="8" fill="none" stroke="#0A1530" strokeWidth="3" />
                <line x1="-7" y1="-18" x2="7" y2="-18" stroke="#0A1530" strokeWidth="2" />
              </g>
              <g transform="translate(70, -25)">
                <circle cx="0" cy="0" r="25" fill="#0A1530" />
                <circle cx="0" cy="0" r="20" fill="#1E2B4D" />
                <circle cx="0" cy="0" r="13" fill="#D1D5DB" className="ah-wheel" />
                <circle cx="0" cy="0" r="5" fill="#6B7280" />
              </g>
              <g transform="translate(210, -25)">
                <circle cx="0" cy="0" r="25" fill="#0A1530" />
                <circle cx="0" cy="0" r="20" fill="#1E2B4D" />
                <circle cx="0" cy="0" r="13" fill="#D1D5DB" className="ah-wheel" />
                <circle cx="0" cy="0" r="5" fill="#6B7280" />
              </g>
            </g>

            {/* Person */}
            <g transform="translate(820, 410)">
              <ellipse cx="20" cy="125" rx="30" ry="6" fill="#0A1530" opacity="0.18" />
              <rect x="10" y="82" width="9" height="40" fill="#0A1530" rx="1" />
              <rect x="22" y="82" width="9" height="40" fill="#0A1530" rx="1" />
              <path d="M 5 46 L 5 84 L 35 84 L 35 46 Q 35 39 28 39 L 12 39 Q 5 39 5 46 Z" fill="#FFA94D" />
              <rect x="6" y="50" width="28" height="20" fill="#FCD34D" opacity="0.9" />
              <rect x="6" y="58" width="28" height="3" fill="#fff" opacity="0.7" />
              <rect x="-2" y="48" width="8" height="32" fill="#FFA94D" rx="2" />
              <rect x="34" y="48" width="8" height="28" fill="#FFA94D" rx="2" transform="rotate(-25 38 62)" />
              <circle cx="20" cy="28" r="11" fill="#F5C4B3" />
              <path d="M 10 23 Q 10 16 20 16 Q 30 16 30 23 L 30 27 Q 25 22 20 22 Q 15 22 10 27 Z" fill="#3B2918" />
              <line x1="14" y1="28" x2="17" y2="31" stroke="#0A1530" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="23" y1="31" x2="26" y2="28" stroke="#0A1530" strokeWidth="1.2" strokeLinecap="round" />
              <ellipse cx="20" cy="35" rx="2" ry="1.2" fill="none" stroke="#0A1530" strokeWidth="1" strokeLinecap="round" />
              <g transform="translate(40, 56) rotate(15)">
                <rect x="0" y="0" width="22" height="28" fill="#FFF" stroke="#6B7280" strokeWidth="0.8" />
                <rect x="6" y="-3" width="10" height="5" fill="#6B7280" />
                <line x1="3" y1="7" x2="19" y2="7" stroke="#9CA3AF" strokeWidth="0.5" />
                <line x1="3" y1="11" x2="17" y2="11" stroke="#9CA3AF" strokeWidth="0.5" />
              </g>
              <g transform="translate(20, -25)" className="ah-question-p1">
                <circle cx="0" cy="0" r="18" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2.5" />
                <text x="0" y="8" textAnchor="middle" fontSize="26" fontWeight="900" fill="#DC2626">?</text>
              </g>
            </g>

            {/* Right rack */}
            <g transform="translate(940, 350)">
              <rect x="0" y="0" width="14" height="200" fill="#0A1530" />
              <rect x="14" y="0" width="6" height="200" fill="#1E2B4D" />
              <rect x="180" y="0" width="14" height="200" fill="#0A1530" />
              <rect x="194" y="0" width="6" height="200" fill="#1E2B4D" />
              <rect x="0" y="20" width="200" height="14" fill="#6B7280" />
              <rect x="0" y="88" width="200" height="6" fill="#6B7280" />
              <rect x="0" y="148" width="200" height="6" fill="#6B7280" />
              <g transform="translate(22, 40)">
                <rect x="0" y="0" width="38" height="46" fill="#B89978" stroke="#6B5340" strokeWidth="0.8" />
                <rect x="0" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" />
                <g transform="rotate(5 61 23)"><rect x="42" y="0" width="38" height="46" fill="#C9B49C" stroke="#6B5340" strokeWidth="0.8" /><rect x="42" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" /></g>
                <rect x="84" y="-3" width="38" height="49" fill="#A78B71" stroke="#6B5340" strokeWidth="0.8" />
                <rect x="84" y="-3" width="38" height="2" fill="#6B5340" opacity="0.4" />
                <g opacity="0.5"><rect x="90" y="30" width="1.5" height="12" fill="#0A1530" /><rect x="93" y="30" width="0.8" height="12" fill="#0A1530" /></g>
                <rect x="126" y="0" width="38" height="46" fill="none" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 2" />
                <text x="145" y="28" textAnchor="middle" fontSize="9" fontWeight="900" fill="#DC2626">{t("comparator.before_empty")}</text>
              </g>
              <g transform="translate(22, 100)">
                <g transform="rotate(-7 19 23) translate(0, 2)" className="ah-shake"><rect x="0" y="0" width="38" height="46" fill="#A78B71" stroke="#6B5340" strokeWidth="0.8" /><rect x="0" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" /><g opacity="0.5"><rect x="6" y="30" width="1.5" height="12" fill="#0A1530" /><rect x="9" y="30" width="2" height="12" fill="#0A1530" /></g></g>
                <rect x="42" y="0" width="38" height="46" fill="#C9B49C" stroke="#6B5340" strokeWidth="0.8" />
                <rect x="42" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" />
                <rect x="84" y="0" width="38" height="46" fill="#B89978" stroke="#6B5340" strokeWidth="0.8" />
                <rect x="84" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" />
                <rect x="126" y="-2" width="38" height="48" fill="#A78B71" stroke="#6B5340" strokeWidth="0.8" />
                <rect x="126" y="-2" width="38" height="2" fill="#6B5340" opacity="0.4" />
              </g>
              <g transform="translate(22, 149)">
                <rect x="0" y="0" width="38" height="46" fill="#B89978" stroke="#6B5340" strokeWidth="0.8" />
                <rect x="0" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" />
                <g opacity="0.5"><rect x="6" y="30" width="1.5" height="12" fill="#0A1530" /><rect x="9" y="30" width="0.8" height="12" fill="#0A1530" /><rect x="11" y="30" width="2" height="12" fill="#0A1530" /></g>
                <rect x="42" y="0" width="38" height="46" fill="none" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 2" />
                <text x="61" y="28" textAnchor="middle" fontSize="9" fontWeight="900" fill="#DC2626">{t("comparator.before_empty")}</text>
                <rect x="84" y="0" width="38" height="46" fill="#A78B71" stroke="#6B5340" strokeWidth="0.8" />
                <rect x="84" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" />
                <g opacity="0.5"><rect x="90" y="30" width="1.5" height="12" fill="#0A1530" /><rect x="93" y="30" width="0.8" height="12" fill="#0A1530" /></g>
                <g transform="rotate(4 145 23)"><rect x="126" y="0" width="38" height="46" fill="#C9B49C" stroke="#6B5340" strokeWidth="0.8" /><rect x="126" y="0" width="38" height="2" fill="#6B5340" opacity="0.4" /><g opacity="0.5"><rect x="132" y="30" width="1.5" height="12" fill="#0A1530" /><rect x="135" y="30" width="2" height="12" fill="#0A1530" /></g></g>
              </g>
            </g>
          </svg>
        </div>

        {/* ========== DESPUÉS ========== */}
        <div className="ah-c-scene ah-c-after" ref={afterRef}>
          <svg viewBox="0 0 1200 675" preserveAspectRatio="xMidYMid meet">
            <rect width="1200" height="675" fill="#F8F9FB" />
            <rect width="1200" height="675" fill="#2D4EF5" opacity="0.02" />
            <defs>
              <pattern id="ah-grid-a" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#2D4EF5" strokeWidth="0.5" />
              </pattern>
              <radialGradient id="ah-spot" cx="50%" cy="35%" r="55%">
                <stop offset="0%" stopColor="#2D4EF5" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#2D4EF5" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1200" height="675" fill="url(#ah-grid-a)" opacity="0.25" />
            <rect width="1200" height="675" fill="url(#ah-spot)" />
            <rect x="0" y="540" width="1200" height="135" fill="#EEF2FF" />
            <line x1="0" y1="540" x2="1200" y2="540" stroke="#2D4EF5" strokeWidth="1" opacity="0.4" />

            {/* Success badge */}
            <g transform="translate(60, 110)">
              <rect x="0" y="0" width="170" height="46" rx="8" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1" />
              <circle cx="22" cy="23" r="11" fill="#16A34A" />
              <path d="M 17 23 L 21 27 L 28 19" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <text x="40" y="20" fontSize="11" fontWeight="700" fill="#14532D">{t("comparator.after_b1_l1")}</text>
              <text x="40" y="34" fontSize="11" fontWeight="700" fill="#14532D">{t("comparator.after_b1_l2")}</text>
            </g>

            {/* Dashboard card */}
            <g transform="translate(990, 110)">
              <rect x="0" y="0" width="180" height="115" rx="10" fill="#fff" stroke="#E5E7EB" strokeWidth="1" />
              <rect x="0" y="0" width="180" height="26" rx="10" fill="#0A1530" />
              <rect x="0" y="16" width="180" height="10" fill="#0A1530" />
              <circle cx="12" cy="13" r="3" fill="#22C55E" />
              <circle cx="12" cy="13" r="3" fill="#22C55E" opacity="0.4" className="ah-pulse" />
              <text x="20" y="17" fontSize="10" fontWeight="700" fill="#fff">Air Hive Dashboard</text>
              <text x="14" y="46" fontSize="8" fontWeight="700" fill="#6B7280" letterSpacing="1">{t("comparator.after_precision")}</text>
              <text x="14" y="74" fontSize="26" fontWeight="800" fill="#0A1530">99.8%</text>
              <text x="100" y="74" fontSize="10" fontWeight="700" fill="#22C55E">↑ 18%</text>
              <g transform="translate(14, 85)">
                <rect x="0" y="14" width="11" height="14" fill="#A0B4FF" className="ah-bar" />
                <rect x="15" y="10" width="11" height="18" fill="#A0B4FF" className="ah-bar" style={{ animationDelay: "0.1s" }} />
                <rect x="30" y="6" width="11" height="22" fill="#5C7BFF" className="ah-bar" style={{ animationDelay: "0.2s" }} />
                <rect x="45" y="9" width="11" height="19" fill="#5C7BFF" className="ah-bar" style={{ animationDelay: "0.3s" }} />
                <rect x="60" y="3" width="11" height="25" fill="#2D4EF5" className="ah-bar" style={{ animationDelay: "0.4s" }} />
                <rect x="75" y="0" width="11" height="28" fill="#2D4EF5" className="ah-bar" style={{ animationDelay: "0.5s" }} />
                <rect x="90" y="5" width="11" height="23" fill="#2D4EF5" className="ah-bar" style={{ animationDelay: "0.6s" }} />
              </g>
              <g transform="translate(120, 42)">
                <rect x="0" y="0" width="56" height="20" rx="4" fill="#DCFCE7" />
                <circle cx="10" cy="10" r="3" fill="#16A34A" className="ah-pulse" />
                <text x="18" y="14" fontSize="8" fontWeight="800" fill="#166534">{t("comparator.after_live")}</text>
              </g>
            </g>

            {/* Floating message */}
            <g transform="translate(600, 240)" className="ah-msg-pulse">
              <rect x="-230" y="-45" width="460" height="100" rx="14" fill="#fff" stroke="#22C55E" strokeWidth="2" />
              <text x="0" y="-12" textAnchor="middle" fontSize="22" fontWeight="800" fill="#14532D">{t("comparator.after_msg_title")}</text>
              <text x="0" y="16" textAnchor="middle" fontSize="13" fontWeight="600" fill="#9CA3AF">{t("comparator.after_msg_sub")}</text>
              <text x="0" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="#16A34A">{t("comparator.after_msg_stat")}</text>
            </g>

            {/* Items detected */}
            <g transform="translate(990, 245)">
              <rect x="0" y="0" width="180" height="50" rx="8" fill="#fff" stroke="#E5E7EB" strokeWidth="1" />
              <text x="14" y="18" fontSize="9" fontWeight="700" fill="#6B7280" letterSpacing="1">{t("comparator.after_items")}</text>
              <text x="14" y="40" fontSize="22" fontWeight="800" fill="#2D4EF5">12,847</text>
              <text x="120" y="40" fontSize="11" fontWeight="700" fill="#22C55E">↑ +247</text>
            </g>

            {/* Rack 1 */}
            <g transform="translate(60, 350)">
              <rect x="0" y="0" width="14" height="200" fill="#2D4EF5" />
              <rect x="14" y="0" width="6" height="200" fill="#1E3AC4" />
              <rect x="180" y="0" width="14" height="200" fill="#2D4EF5" />
              <rect x="194" y="0" width="6" height="200" fill="#1E3AC4" />
              <rect x="0" y="15" width="200" height="14" fill="#0A1530" />
              <rect x="0" y="15" width="200" height="3" fill="#FCD34D" />
              <rect x="0" y="26" width="200" height="3" fill="#FCD34D" />
              <rect x="0" y="85" width="200" height="6" fill="#0A1530" />
              <rect x="0" y="85" width="200" height="2" fill="#FCD34D" />
              <rect x="0" y="148" width="200" height="6" fill="#0A1530" />
              <rect x="0" y="148" width="200" height="2" fill="#FCD34D" />
              <g transform="translate(22, 36)">
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-3.5s" }} x="0" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="0" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(6, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /><rect x="5" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-3.5s" }} x="26" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-2.9s" }} x="42" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="42" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(48, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-2.9s" }} x="68" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-2.3s" }} x="84" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="84" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(90, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-2.3s" }} x="110" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-1.7s" }} x="126" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="126" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(132, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-1.7s" }} x="152" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <line className="ah-scan-line" style={{ animationDelay: "-3.5s" }} x1="0" y1="0" x2="164" y2="0" stroke="#22C55E" strokeWidth="1.5" />
              </g>
              <g transform="translate(22, 99)">
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-1.1s" }} x="0" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="0" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(6, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-1.1s" }} x="26" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-0.5s" }} x="42" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="42" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(48, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-0.5s" }} x="68" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "0.1s" }} x="84" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="84" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(90, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "0.1s" }} x="110" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "0.7s" }} x="126" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="126" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(132, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "0.7s" }} x="152" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <line className="ah-scan-line" style={{ animationDelay: "-1.1s" }} x1="0" y1="0" x2="164" y2="0" stroke="#22C55E" strokeWidth="1.5" />
              </g>
              <g transform="translate(22, 149)">
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "1.3s" }} x="0" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="0" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(6, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /><rect x="5" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "1.3s" }} x="26" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "1.9s" }} x="42" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="42" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(48, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "1.9s" }} x="68" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "2.5s" }} x="84" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="84" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(90, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "2.5s" }} x="110" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "3.1s" }} x="126" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="126" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(132, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "3.1s" }} x="152" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
              </g>
            </g>

            {/* Rack 2 */}
            <g transform="translate(420, 350)">
              <rect x="0" y="0" width="14" height="200" fill="#2D4EF5" />
              <rect x="14" y="0" width="6" height="200" fill="#1E3AC4" />
              <rect x="180" y="0" width="14" height="200" fill="#2D4EF5" />
              <rect x="194" y="0" width="6" height="200" fill="#1E3AC4" />
              <rect x="0" y="15" width="200" height="14" fill="#0A1530" />
              <rect x="0" y="15" width="200" height="3" fill="#FCD34D" />
              <rect x="0" y="26" width="200" height="3" fill="#FCD34D" />
              <rect x="0" y="85" width="200" height="6" fill="#0A1530" />
              <rect x="0" y="85" width="200" height="2" fill="#FCD34D" />
              <rect x="0" y="148" width="200" height="6" fill="#0A1530" />
              <rect x="0" y="148" width="200" height="2" fill="#FCD34D" />
              <g transform="translate(22, 36)">
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-10s" }} x="0" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="0" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(6, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-10s" }} x="26" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-9.4s" }} x="42" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="42" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(48, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-9.4s" }} x="68" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-8.8s" }} x="84" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="84" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(90, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-8.8s" }} x="110" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-8.2s" }} x="126" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="126" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(132, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-8.2s" }} x="152" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <line className="ah-scan-line" style={{ animationDelay: "-10s" }} x1="0" y1="0" x2="164" y2="0" stroke="#22C55E" strokeWidth="1.5" />
              </g>
              <g transform="translate(22, 99)">
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-7.6s" }} x="0" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="0" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(6, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-7.6s" }} x="26" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-7s" }} x="42" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="42" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(48, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-7s" }} x="68" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-6.4s" }} x="84" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="84" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(90, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-6.4s" }} x="110" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-5.8s" }} x="126" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="126" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(132, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-5.8s" }} x="152" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <line className="ah-scan-line" style={{ animationDelay: "-7.6s" }} x1="0" y1="0" x2="164" y2="0" stroke="#22C55E" strokeWidth="1.5" />
              </g>
              <g transform="translate(22, 149)">
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-5.2s" }} x="0" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="0" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(6, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /><rect x="5" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-5.2s" }} x="26" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-4.6s" }} x="42" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="42" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(48, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-4.6s" }} x="68" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-4s" }} x="84" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="84" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(90, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-4s" }} x="110" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-3.4s" }} x="126" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="126" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(132, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-3.4s" }} x="152" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
              </g>
            </g>

            {/* Rack 3 */}
            <g transform="translate(780, 350)">
              <rect x="0" y="0" width="14" height="200" fill="#2D4EF5" />
              <rect x="14" y="0" width="6" height="200" fill="#1E3AC4" />
              <rect x="180" y="0" width="14" height="200" fill="#2D4EF5" />
              <rect x="194" y="0" width="6" height="200" fill="#1E3AC4" />
              <rect x="0" y="15" width="200" height="14" fill="#0A1530" />
              <rect x="0" y="15" width="200" height="3" fill="#FCD34D" />
              <rect x="0" y="26" width="200" height="3" fill="#FCD34D" />
              <rect x="0" y="85" width="200" height="6" fill="#0A1530" />
              <rect x="0" y="85" width="200" height="2" fill="#FCD34D" />
              <rect x="0" y="148" width="200" height="6" fill="#0A1530" />
              <rect x="0" y="148" width="200" height="2" fill="#FCD34D" />
              <g transform="translate(22, 36)">
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-16.5s" }} x="0" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="0" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(6, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-16.5s" }} x="26" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-15.9s" }} x="42" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="42" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(48, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-15.9s" }} x="68" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-15.3s" }} x="84" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="84" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(90, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-15.3s" }} x="110" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-14.7s" }} x="126" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="126" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(132, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-14.7s" }} x="152" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <line className="ah-scan-line" style={{ animationDelay: "-16.5s" }} x1="0" y1="0" x2="164" y2="0" stroke="#22C55E" strokeWidth="1.5" />
              </g>
              <g transform="translate(22, 99)">
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-14.1s" }} x="0" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="0" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(6, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-14.1s" }} x="26" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-13.5s" }} x="42" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="42" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(48, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-13.5s" }} x="68" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-12.9s" }} x="84" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="84" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(90, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-12.9s" }} x="110" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-12.3s" }} x="126" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="126" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(132, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-12.3s" }} x="152" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <line className="ah-scan-line" style={{ animationDelay: "-14.1s" }} x1="0" y1="0" x2="164" y2="0" stroke="#22C55E" strokeWidth="1.5" />
              </g>
              <g transform="translate(22, 149)">
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-11.7s" }} x="0" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="0" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(6, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /><rect x="5" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-11.7s" }} x="26" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-11.1s" }} x="42" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="42" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(48, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-11.1s" }} x="68" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#5C7BFF", animationDelay: "-10.5s" }} x="84" y="0" width="38" height="46" fill="#5C7BFF" stroke="#1E3AC4" /><rect x="84" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(90, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="0.8" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-10.5s" }} x="110" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
                <g><rect className="ah-scanned" style={{ "--box-base": "#A0B4FF", animationDelay: "-9.9s" }} x="126" y="0" width="38" height="46" fill="#A0B4FF" stroke="#1E3AC4" /><rect x="126" y="0" width="38" height="2" fill="#1E3AC4" /><g transform="translate(132, 30)"><rect x="0" y="0" width="1.5" height="12" fill="#0A1530" /><rect x="3" y="0" width="2" height="12" fill="#0A1530" /></g><rect className="ah-scanned-rfid" style={{ animationDelay: "-9.9s" }} x="152" y="5" width="9" height="6" fill="#fff" stroke="#2D4EF5" rx="0.5" /></g>
              </g>
            </g>

            {/* Drone */}
            <g className="ah-drone-route">
              <ellipse cx="0" cy="80" rx="35" ry="6" fill="#0A1530" opacity="0.12" />
              <circle cx="0" cy="0" r="25" fill="none" stroke="#2D4EF5" strokeWidth="2" className="ah-scan" />
              <circle cx="0" cy="0" r="25" fill="none" stroke="#2D4EF5" strokeWidth="1.5" className="ah-scan" style={{ animationDelay: "0.5s" }} />
              <line x1="0" y1="0" x2="-32" y2="-14" stroke="#0A1530" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="0" y1="0" x2="32" y2="-14" stroke="#0A1530" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="0" y1="0" x2="-32" y2="14" stroke="#0A1530" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="0" y1="0" x2="32" y2="14" stroke="#0A1530" strokeWidth="3.5" strokeLinecap="round" />
              <ellipse cx="0" cy="0" rx="16" ry="9" fill="#0A1530" />
              <ellipse cx="0" cy="-1" rx="8" ry="4" fill="#2D4EF5" />
              <circle cx="0" cy="-1" r="2.5" fill="#A0B4FF" />
              <ellipse className="ah-prop" cx="-32" cy="-14" rx="16" ry="2.5" fill="#2D4EF5" opacity="0.55" />
              <ellipse className="ah-prop" cx="32" cy="-14" rx="16" ry="2.5" fill="#2D4EF5" opacity="0.55" />
              <ellipse className="ah-prop" cx="-32" cy="14" rx="16" ry="2.5" fill="#2D4EF5" opacity="0.55" />
              <ellipse className="ah-prop" cx="32" cy="14" rx="16" ry="2.5" fill="#2D4EF5" opacity="0.55" />
              <line x1="0" y1="9" x2="0" y2="18" stroke="#0A1530" strokeWidth="2" />
              <rect x="-7" y="18" width="14" height="5" fill="#0A1530" rx="1" />
              <line x1="0" y1="-5" x2="-25" y2="-30" stroke="#22C55E" strokeWidth="1" opacity="0.6" strokeDasharray="2 2" />
              <line x1="0" y1="-5" x2="25" y2="-30" stroke="#22C55E" strokeWidth="1" opacity="0.6" strokeDasharray="2 2" />
            </g>
          </svg>
        </div>

        <div className="ah-c-label ah-c-label-before" ref={labelBeforeRef}>
          <span className="ah-c-dot" />{t("comparator.label_before")}
        </div>
        <div className="ah-c-label ah-c-label-after ah-active" ref={labelAfterRef}>
          <span className="ah-c-dot" />{t("comparator.label_after")}
        </div>

        <div className="ah-c-handle" ref={handleRef}>
          <div className="ah-c-knob">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
              <polyline points="9 18 3 12 9 6" opacity="0.5" />
            </svg>
          </div>
        </div>
      </div>

      <p className="ah-c-hint">{t("comparator.hint")}</p>
    </div>
  );
};

export default AirHiveComparator;
