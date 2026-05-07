import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./Soluciones.css";

const Soluciones = () => {
  const { t } = useTranslation();

  const [wms, setWms] = useState({ skus: 0, accuracy: 0, locations: 0 });
  const [wmsBars, setWmsBars] = useState([35, 50, 65, 78, 72, 92]);
  const [wmsOpacity, setWmsOpacity] = useState({ skus: 1, accuracy: 1, locations: 1 });

  // Count-up on mount
  useEffect(() => {
    const targets = { skus: 1247, accuracy: 99.8, locations: 432 };
    const duration = 1400;
    let startTs;
    const step = (ts) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setWms({
        skus: Math.round(targets.skus * ease),
        accuracy: targets.accuracy * ease,
        locations: Math.round(targets.locations * ease),
      });
      if (progress < 1) requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), 300);
    return () => clearTimeout(timer);
  }, []);

  // Periodic soft updates
  useEffect(() => {
    const fade = (key, getValue) => {
      setWmsOpacity(prev => ({ ...prev, [key]: 0.35 }));
      setTimeout(() => {
        setWms(prev => ({ ...prev, [key]: getValue(prev[key]) }));
        setWmsOpacity(prev => ({ ...prev, [key]: 1 }));
      }, 300);
    };
    const i1 = setInterval(() => fade('skus', v => { let n = v + Math.floor(Math.random() * 7 - 2); if (n < 1200) n = 1247; if (n > 1290) n = 1260; return n; }), 3200);
    const i2 = setInterval(() => { const opts = [99.6,99.7,99.8,99.8,99.9,99.8,99.7]; fade('accuracy', () => opts[Math.floor(Math.random() * opts.length)]); }, 2600);
    const i3 = setInterval(() => fade('locations', v => { let n = v + Math.floor(Math.random() * 5 - 2); if (n < 425) n = 432; if (n > 445) n = 435; return n; }), 4100);
    const i4 = setInterval(() => setWmsBars(prev => prev.map(h => Math.max(28, Math.min(95, h + (Math.random() * 16 - 8))))), 1800);
    return () => { clearInterval(i1); clearInterval(i2); clearInterval(i3); clearInterval(i4); };
  }, []);

  const droneAltPhase = useRef(0);
  const droneTagsCount = useRef(0);
  const [droneAlt, setDroneAlt] = useState('0.0m');
  const [droneTags, setDroneTags] = useState('0');

  useEffect(() => {
    const iv = setInterval(() => {
      droneAltPhase.current += 0.04;
      const sine = (Math.sin(droneAltPhase.current) + 1) / 2;
      const alt = sine * 2.4;
      setDroneAlt(alt.toFixed(1) + 'm');
      if (alt > 1.5 && droneTagsCount.current < 1247) {
        droneTagsCount.current = Math.min(1247, droneTagsCount.current + Math.floor(Math.random() * 4 + 1));
        setDroneTags(droneTagsCount.current.toLocaleString('en-US'));
      } else if (alt < 0.5 && droneTagsCount.current > 0) {
        droneTagsCount.current = Math.max(0, droneTagsCount.current - Math.floor(Math.random() * 80));
        setDroneTags(droneTagsCount.current.toLocaleString('en-US'));
      }
    }, 80);
    return () => clearInterval(iv);
  }, []);

  const monStartTime  = useRef(null);
  const monPalletsRef = useRef(0);
  const monAnomsRef   = useRef(0);
  const monCovStr     = useRef('0.0%');
  const [monPallets,      setMonPallets]      = useState('0');
  const [monCoverage,     setMonCoverage]     = useState('0.0%');
  const [monAnomalies,    setMonAnomalies]    = useState('0');
  const [monAnomalyColor, setMonAnomalyColor] = useState('#2D2DEB');

  useEffect(() => {
    let rafId;
    const loop = (ts) => {
      if (!monStartTime.current) monStartTime.current = ts;
      const elapsed = ts - monStartTime.current;

      const tp = Math.floor(elapsed / 350);
      if (tp > monPalletsRef.current && monPalletsRef.current < 9999) {
        monPalletsRef.current = tp;
        setMonPallets(monPalletsRef.current.toLocaleString('en-US'));
      }

      const covStr = Math.min(100, (elapsed / 25000) * 100).toFixed(1) + '%';
      if (covStr !== monCovStr.current) {
        monCovStr.current = covStr;
        setMonCoverage(covStr);
      }

      if (Math.random() < 0.0008) {
        monAnomsRef.current++;
        setMonAnomalies(String(monAnomsRef.current));
        setMonAnomalyColor('#FCD34D');
        setTimeout(() => setMonAnomalyColor('#2D2DEB'), 800);
      }

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section id="ah-solutions">
      <p className="ah-sol-kicker">{t("services_redesign.solutions_kicker")}</p>
      <h2 className="ah-sol-title">{t("services_redesign.solutions_title")}</h2>

      <div className="ah-sol-grid">

        {/* 1 — Inventory Drones */}
        <article className="ah-sol-card">
          <div className="ah-img-wrap" style={{ background:'linear-gradient(180deg,#4F46E5 0%,#6B5BE8 40%,#8B7FE8 100%)', height:260, padding:0 }}>
            {/* Badge */}
            <div className="ah-badge" style={{ top:12, left:12, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.3)', color:'white' }}>
              {t("services_redesign.solutions_b1")}
            </div>
            {/* Animated SVG */}
            <svg viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" style={{ width:'100%', height:'100%', position:'absolute', top:0, left:0 }}>
              <defs>
                <linearGradient id="ahFloorLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C7CCE5" stopOpacity="0"/>
                  <stop offset="100%" stopColor="#9CA3C7" stopOpacity="0.5"/>
                </linearGradient>
                <radialGradient id="ahScanBeam" cx="0.5" cy="0" r="0.7">
                  <stop offset="0%"   stopColor="#2D2DEB" stopOpacity="0.5"/>
                  <stop offset="60%"  stopColor="#2D2DEB" stopOpacity="0.12"/>
                  <stop offset="100%" stopColor="#2D2DEB" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="ahDroneShadow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%"   stopColor="#000" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#000" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="ahPropBlur" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%"   stopColor="#1A1F36" stopOpacity="0.5"/>
                  <stop offset="70%"  stopColor="#1A1F36" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#1A1F36" stopOpacity="0"/>
                </radialGradient>
              </defs>
              {/* Floor */}
              <g opacity="0.2">
                <line x1="0" y1="320" x2="800" y2="320" stroke="#1A1F36" strokeWidth="1"/>
                <line x1="0" y1="360" x2="800" y2="360" stroke="#1A1F36" strokeWidth="1"/>
                <line x1="0" y1="410" x2="800" y2="410" stroke="#1A1F36" strokeWidth="1.5"/>
              </g>
              <rect x="0" y="280" width="800" height="180" fill="url(#ahFloorLight)"/>
              {/* Rack left */}
              <g>
                <rect x="15"  y="120" width="12" height="245" fill="#0F1535"/>
                <rect x="100" y="120" width="12" height="245" fill="#0F1535"/>
                <rect x="185" y="120" width="12" height="245" fill="#0F1535"/>
                <rect x="15"  y="125" width="182" height="9" fill="#FCD34D"/>
                <rect x="15"  y="200" width="182" height="9" fill="#FCD34D"/>
                <rect x="15"  y="275" width="182" height="9" fill="#FCD34D"/>
                <line x1="27"  y1="134" x2="100" y2="200" stroke="#1A1F36" strokeWidth="2" opacity="0.7"/>
                <line x1="100" y1="134" x2="27"  y2="200" stroke="#1A1F36" strokeWidth="2" opacity="0.7"/>
                <line x1="112" y1="134" x2="185" y2="200" stroke="#1A1F36" strokeWidth="2" opacity="0.7"/>
                <line x1="185" y1="134" x2="112" y2="200" stroke="#1A1F36" strokeWidth="2" opacity="0.7"/>
                <rect x="32"  y="140" width="60" height="55" fill="#3B2E9A" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="35"  y="143" width="54" height="3"  fill="#1A1F36" opacity="0.5"/>
                <rect x="117" y="140" width="60" height="55" fill="#5A4FD0" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="120" y="143" width="54" height="3"  fill="#1A1F36" opacity="0.5"/>
                <rect x="32"  y="215" width="60" height="55" fill="#5A4FD0" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="35"  y="218" width="54" height="3"  fill="#1A1F36" opacity="0.5"/>
                <rect x="117" y="215" width="60" height="55" fill="#3B2E9A" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="120" y="218" width="54" height="3"  fill="#1A1F36" opacity="0.5"/>
                <rect x="32"  y="290" width="60" height="55" fill="#3B2E9A" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="35"  y="293" width="54" height="3"  fill="#1A1F36" opacity="0.5"/>
                <rect x="117" y="290" width="60" height="55" fill="#5A4FD0" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="120" y="293" width="54" height="3"  fill="#1A1F36" opacity="0.5"/>
                <rect x="10"  y="365" width="32" height="16" rx="3" fill="#FCD34D"/>
                <rect x="180" y="365" width="32" height="16" rx="3" fill="#FCD34D"/>
              </g>
              {/* Rack right */}
              <g>
                <rect x="603" y="120" width="12" height="245" fill="#0F1535"/>
                <rect x="688" y="120" width="12" height="245" fill="#0F1535"/>
                <rect x="773" y="120" width="12" height="245" fill="#0F1535"/>
                <rect x="603" y="125" width="182" height="9" fill="#FCD34D"/>
                <rect x="603" y="200" width="182" height="9" fill="#FCD34D"/>
                <rect x="603" y="275" width="182" height="9" fill="#FCD34D"/>
                <line x1="615" y1="134" x2="688" y2="200" stroke="#1A1F36" strokeWidth="2" opacity="0.7"/>
                <line x1="688" y1="134" x2="615" y2="200" stroke="#1A1F36" strokeWidth="2" opacity="0.7"/>
                <line x1="700" y1="134" x2="773" y2="200" stroke="#1A1F36" strokeWidth="2" opacity="0.7"/>
                <line x1="773" y1="134" x2="700" y2="200" stroke="#1A1F36" strokeWidth="2" opacity="0.7"/>
                <rect x="620" y="140" width="60" height="55" fill="#5A4FD0" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="623" y="143" width="54" height="3"  fill="#1A1F36" opacity="0.5"/>
                <rect x="705" y="140" width="60" height="55" fill="#3B2E9A" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="708" y="143" width="54" height="3"  fill="#1A1F36" opacity="0.5"/>
                <rect x="620" y="215" width="60" height="55" fill="#3B2E9A" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="623" y="218" width="54" height="3"  fill="#1A1F36" opacity="0.5"/>
                <rect x="705" y="215" width="60" height="55" fill="#5A4FD0" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="708" y="218" width="54" height="3"  fill="#1A1F36" opacity="0.5"/>
                <rect x="620" y="290" width="60" height="55" fill="#5A4FD0" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="623" y="293" width="54" height="3"  fill="#1A1F36" opacity="0.5"/>
                <rect x="705" y="290" width="60" height="55" fill="#3B2E9A" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="708" y="293" width="54" height="3"  fill="#1A1F36" opacity="0.5"/>
                <rect x="598" y="365" width="32" height="16" rx="3" fill="#FCD34D"/>
                <rect x="768" y="365" width="32" height="16" rx="3" fill="#FCD34D"/>
              </g>
              {/* Drone shadow */}
              <ellipse cx="400" cy="400" rx="90" ry="14" fill="url(#ahDroneShadow)">
                <animate attributeName="rx" values="90;55;50;55;90" dur="5s" repeatCount="indefinite"/>
                <animate attributeName="ry" values="14;9;8;9;14" dur="5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7;0.3;0.25;0.3;0.7" dur="5s" repeatCount="indefinite"/>
              </ellipse>
              {/* Dust particles */}
              {[
                { cx:370, cy:395, r:3,   begin:'0.2s' },
                { cx:430, cy:395, r:2.5, begin:'0.5s' },
                { cx:350, cy:400, r:2,   begin:'0.8s' },
                { cx:450, cy:400, r:2.5, begin:'1.1s' },
                { cx:385, cy:402, r:2,   begin:'1.4s' },
                { cx:415, cy:402, r:3,   begin:'1.7s' },
              ].map(({ cx, cy, r, begin }, i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill="#1A1F36" opacity="0">
                  <animate attributeName="opacity" values="0;0.35;0" dur="2s" repeatCount="indefinite" begin={begin}/>
                  <animate attributeName="cy" values={`${cy};${cy-25};${cy-35}`} dur="2s" repeatCount="indefinite" begin={begin}/>
                </circle>
              ))}
              {/* Drone group */}
              <g>
                <animateTransform attributeName="transform" type="translate"
                  values="0,0; 0,-5; 0,-90; 0,-110; 0,-95; 0,-100; 0,-85; 0,-30; 0,0"
                  keyTimes="0;0.08;0.4;0.55;0.7;0.78;0.86;0.95;1"
                  dur="5s" repeatCount="indefinite" calcMode="spline"
                  keySplines="0.4 0 0.6 1;0.4 0 0.2 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.2 1;0.4 0 0.6 1"/>
                {/* Scan beam */}
                <path d="M 400 230 L 200 460 L 600 460 Z" fill="url(#ahScanBeam)" opacity="0.5">
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite"/>
                </path>
                {/* Prop blur circles */}
                <circle cx="320" cy="190" r="34" fill="url(#ahPropBlur)"/>
                <circle cx="480" cy="190" r="34" fill="url(#ahPropBlur)"/>
                <circle cx="320" cy="270" r="34" fill="url(#ahPropBlur)"/>
                <circle cx="480" cy="270" r="34" fill="url(#ahPropBlur)"/>
                {/* Arms */}
                <line x1="400" y1="230" x2="320" y2="190" stroke="#1A1F36" strokeWidth="6" strokeLinecap="round"/>
                <line x1="400" y1="230" x2="480" y2="190" stroke="#1A1F36" strokeWidth="6" strokeLinecap="round"/>
                <line x1="400" y1="230" x2="320" y2="270" stroke="#1A1F36" strokeWidth="6" strokeLinecap="round"/>
                <line x1="400" y1="230" x2="480" y2="270" stroke="#1A1F36" strokeWidth="6" strokeLinecap="round"/>
                {/* Motor hubs */}
                <circle cx="320" cy="190" r="9" fill="#1A1F36"/>
                <circle cx="480" cy="190" r="9" fill="#1A1F36"/>
                <circle cx="320" cy="270" r="9" fill="#1A1F36"/>
                <circle cx="480" cy="270" r="9" fill="#1A1F36"/>
                {/* Spinning props */}
                <g><ellipse cx="320" cy="190" rx="32" ry="2.5" fill="#1A1F36" opacity="0.85"/><ellipse cx="320" cy="190" rx="2.5" ry="32" fill="#1A1F36" opacity="0.85"/><animateTransform attributeName="transform" type="rotate" from="0 320 190" to="360 320 190" dur="0.1s" repeatCount="indefinite"/></g>
                <g><ellipse cx="480" cy="190" rx="32" ry="2.5" fill="#1A1F36" opacity="0.85"/><ellipse cx="480" cy="190" rx="2.5" ry="32" fill="#1A1F36" opacity="0.85"/><animateTransform attributeName="transform" type="rotate" from="360 480 190" to="0 480 190" dur="0.1s" repeatCount="indefinite"/></g>
                <g><ellipse cx="320" cy="270" rx="32" ry="2.5" fill="#1A1F36" opacity="0.85"/><ellipse cx="320" cy="270" rx="2.5" ry="32" fill="#1A1F36" opacity="0.85"/><animateTransform attributeName="transform" type="rotate" from="360 320 270" to="0 320 270" dur="0.1s" repeatCount="indefinite"/></g>
                <g><ellipse cx="480" cy="270" rx="32" ry="2.5" fill="#1A1F36" opacity="0.85"/><ellipse cx="480" cy="270" rx="2.5" ry="32" fill="#1A1F36" opacity="0.85"/><animateTransform attributeName="transform" type="rotate" from="0 480 270" to="360 480 270" dur="0.1s" repeatCount="indefinite"/></g>
                {/* Body */}
                <rect x="376" y="210" width="48" height="42" rx="4" fill="#2A2F4A"/>
                <rect x="376" y="210" width="48" height="14" rx="4" fill="#1A1F36"/>
                <rect x="382" y="230" width="36" height="4"  rx="1" fill="#1A1F36"/>
                <rect x="384" y="231" width="32" height="2"  rx="1" fill="#4ADE80"/>
                <rect x="386" y="244" width="28" height="6"  rx="2" fill="#0F1535"/>
                <circle cx="394" cy="247" r="1.5" fill="#4ADE80"/>
                <circle cx="406" cy="247" r="1.5" fill="#FF5F57"/>
                {/* Landing gear */}
                <path d="M 380 250 L 360 285 L 365 290 L 388 256 Z" fill="#DC2626"/>
                <path d="M 420 250 L 440 285 L 435 290 L 412 256 Z" fill="#DC2626"/>
              </g>
            </svg>
            {/* Readouts */}
            <div style={{ position:'absolute', bottom:10, left:10, right:10, display:'flex', justifyContent:'space-between', zIndex:2 }}>
              <div style={{ background:'rgba(15,21,53,0.85)', padding:'7px 12px', borderRadius:8, color:'white' }}>
                <div style={{ fontSize:9, opacity:0.7, letterSpacing:'1px' }}>ALTITUDE</div>
                <div style={{ fontSize:14, fontWeight:600 }}>{droneAlt}</div>
              </div>
              <div style={{ background:'rgba(15,21,53,0.85)', padding:'7px 12px', borderRadius:8, color:'white', textAlign:'right' }}>
                <div style={{ fontSize:9, opacity:0.7, letterSpacing:'1px' }}>RFID TAGS</div>
                <div style={{ fontSize:14, fontWeight:600 }}>{droneTags}</div>
              </div>
            </div>
          </div>
          <div className="ah-sol-body">
            <div className="ah-sol-card-title">{t("services_redesign.solutions_t1")}</div>
            <div className="ah-sol-line" />
            <div className="ah-sol-desc">{t("services_redesign.solutions_d1")}</div>
          </div>
        </article>

        {/* 2 — WMS Platform */}
        <article className="ah-sol-card">
          <div className="ah-img-wrap" style={{ background: '#2D2DEB', padding: '14px', height: '260px', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <div className="ah-badge" style={{ background: 'rgba(26,31,54,0.85)', top: '-8px', left: '6px', zIndex: 2 }}>
                {t("services_redesign.solutions_b2")}
              </div>
              <div style={{ background: 'white', borderRadius: 14, padding: '28px 16px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {['#FF5F57','#FEBC2E','#28C840'].map(c => (
                      <span key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, display: 'inline-block' }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#1A1F36' }}>WareHive WMS</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
                  {[
                    { label: t("services_redesign.solutions_m1"), val: wms.skus.toLocaleString('en-US'), key: 'skus', color: '#1A1F36' },
                    { label: t("services_redesign.solutions_m2"), val: `${wms.accuracy.toFixed(1)}%`,   key: 'accuracy',  color: '#2D2DEB' },
                    { label: t("services_redesign.solutions_m3"), val: wms.locations,                   key: 'locations', color: '#1A1F36' },
                  ].map(({ label, val, key, color }) => (
                    <div key={key} style={{ background: '#F4F5F9', borderRadius: 10, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, color: '#6B7280', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 18, fontWeight: 600, color, transition: 'opacity 0.3s', opacity: wmsOpacity[key] }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60 }}>
                  {wmsBars.map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 6, transition: 'height 1s cubic-bezier(.4,0,.2,1)',
                      background: ['#DDDDFB','#B8B8F5','#6B6BEC','#2D2DEB','#1F1FAB','#0F1535'][i] }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="ah-sol-body">
            <div className="ah-sol-card-title">{t("services_redesign.solutions_t2")}</div>
            <div className="ah-sol-line" />
            <div className="ah-sol-desc">{t("services_redesign.solutions_d2")}</div>
          </div>
        </article>

        {/* 3 — System Integration */}
        <article className="ah-sol-card">
          <div className="ah-img-wrap" style={{ background: '#3447EB', height: '260px' }}>
            <svg viewBox="0 0 600 360" style={{ width: '100%', height: '100%' }}>
              {/* Connection lines */}
              <line x1="300" y1="50"  x2="300" y2="180" stroke="#FFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.4"/>
              <line x1="472" y1="99"  x2="300" y2="180" stroke="#FFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.4"/>
              <line x1="514" y1="209" x2="300" y2="180" stroke="#FFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.4"/>
              <line x1="395" y1="297" x2="300" y2="180" stroke="#FFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.4"/>
              <line x1="205" y1="297" x2="300" y2="180" stroke="#FFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.4"/>
              <line x1="86"  y1="209" x2="300" y2="180" stroke="#FFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.4"/>
              <line x1="128" y1="99"  x2="300" y2="180" stroke="#FFF" strokeWidth="1" strokeDasharray="3 4" opacity="0.4"/>
              {/* Animated particles */}
              <circle cx="300" cy="50"  r="2.5" fill="#FFF" className="ah-hub-particle ah-hub-p1"/>
              <circle cx="472" cy="99"  r="2.5" fill="#FFF" className="ah-hub-particle ah-hub-p2"/>
              <circle cx="514" cy="209" r="2.5" fill="#FFF" className="ah-hub-particle ah-hub-p3"/>
              <circle cx="395" cy="297" r="2.5" fill="#FFF" className="ah-hub-particle ah-hub-p4"/>
              <circle cx="205" cy="297" r="2.5" fill="#FFF" className="ah-hub-particle ah-hub-p5"/>
              <circle cx="86"  cy="209" r="2.5" fill="#FFF" className="ah-hub-particle ah-hub-p6"/>
              <circle cx="128" cy="99"  r="2.5" fill="#FFF" className="ah-hub-particle ah-hub-p7"/>
              {/* Center logo */}
              <image href="/logo%20sin%20fondo.png" x="200" y="160" width="200" height="40" className="ah-hub-logo" style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 12px rgba(255,255,255,0.4))' }}/>
              {/* Floating nodes */}
              {[
                { cx:300, cy:50,  r:32, label:'ERP',  fs:12, className:'ah-hub-float ah-hub-float-1' },
                { cx:472, cy:99,  r:28, label:'CRM',  fs:11, className:'ah-hub-float ah-hub-float-2' },
                { cx:514, cy:209, r:32, label:'SAP',  fs:12, className:'ah-hub-float ah-hub-float-3' },
                { cx:395, cy:297, r:30, label:'IoT',  fs:11, className:'ah-hub-float ah-hub-float-4' },
                { cx:205, cy:297, r:30, label:'WMS',  fs:11, className:'ah-hub-float ah-hub-float-5' },
                { cx:86,  cy:209, r:30, label:'DB',   fs:11, className:'ah-hub-float ah-hub-float-6' },
                { cx:128, cy:99,  r:30, label:'API',  fs:11, className:'ah-hub-float ah-hub-float-7' },
              ].map(({ cx, cy, r, label, fs, className }) => (
                <g key={label} className={className}>
                  <circle cx={cx} cy={cy} r={r}   fill="#fff"/>
                  <circle cx={cx} cy={cy} r={r-2} fill="#fff" stroke="#E2E8F0" strokeWidth="1"/>
                  <text x={cx} y={cy+5} textAnchor="middle" fontSize={fs} fontWeight="700" fill="#1E293B" fontFamily="system-ui">{label}</text>
                </g>
              ))}
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
          {/* Wrapper morado — respeta estructura del HTML */}
          <div style={{ background:'linear-gradient(180deg,#4F46E5 0%,#6B5BE8 40%,#8B7FE8 100%)', borderRadius:'20px 20px 0 0', padding:18, height:260, overflow:'hidden', flexShrink:0, display:'flex', flexDirection:'column', boxSizing:'border-box' }}>
            {/* Header: badge + LIVE en fila */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, padding:'0 4px', flexShrink:0 }}>
              <div style={{ background:'rgba(255,255,255,0.18)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.3)', color:'white', padding:'8px 18px', borderRadius:20, fontSize:11, fontWeight:600, letterSpacing:'1.4px' }}>
                {t("services_redesign.solutions_b4")}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(220,38,38,0.85)', padding:'6px 12px', borderRadius:20 }}>
                <span className="ah-mon-live-dot" />
                <span style={{ color:'white', fontSize:11, fontWeight:600, letterSpacing:'1px' }}>LIVE</span>
              </div>
            </div>
            {/* Recuadro blanco */}
            <div style={{ background:'white', borderRadius:16, overflow:'hidden', position:'relative', flex:1 }}>
              <div style={{ position:'relative', width:'100%', height:'100%', overflow:'hidden' }}>
            {/* SVG */}
            <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMin meet" style={{ width:'100%', height:'100%', display:'block' }}>
              <defs>
                <radialGradient id="ahMonFog" cx="0.5" cy="0.5" r="0.4">
                  <stop offset="0%"   stopColor="#C7CCE5" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0"/>
                </radialGradient>
                <linearGradient id="ahMonCone" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%"   stopColor="#2D2DEB" stopOpacity="0.35"/>
                  <stop offset="100%" stopColor="#2D2DEB" stopOpacity="0"/>
                </linearGradient>
                <radialGradient id="ahMonProp" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%"   stopColor="#1A1F36" stopOpacity="0.4"/>
                  <stop offset="70%"  stopColor="#1A1F36" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#1A1F36" stopOpacity="0"/>
                </radialGradient>
              </defs>
              {/* Ceiling */}
              <ellipse cx="400" cy="230" rx="200" ry="120" fill="url(#ahMonFog)"/>
              {/* Left racks */}
              <g opacity="0.7">
                <polygon points="200,250 320,260 320,400 200,420" fill="#A8AED0"/>
                <line x1="200" y1="280" x2="320" y2="285" stroke="#5A4FD0" strokeWidth="1.5" opacity="0.6"/>
                <line x1="200" y1="320" x2="320" y2="320" stroke="#5A4FD0" strokeWidth="1.8" opacity="0.6"/>
                <line x1="200" y1="370" x2="320" y2="365" stroke="#5A4FD0" strokeWidth="2"   opacity="0.6"/>
                <rect x="220" y="290" width="40" height="25" fill="#6B6BEC" stroke="#1A1F36" strokeWidth="1" opacity="0.85"/>
                <rect x="270" y="292" width="40" height="25" fill="#8B7FE8" stroke="#1A1F36" strokeWidth="1" opacity="0.85"/>
                <rect x="220" y="330" width="40" height="32" fill="#8B7FE8" stroke="#1A1F36" strokeWidth="1" opacity="0.85"/>
                <rect x="270" y="332" width="40" height="32" fill="#6B6BEC" stroke="#1A1F36" strokeWidth="1" opacity="0.85"/>
                <rect x="200" y="250" width="4" height="170" fill="#1A1F36"/>
                <rect x="316" y="260" width="4" height="160" fill="#1A1F36"/>
              </g>
              <g opacity="0.95">
                <polygon points="60,260 200,250 200,420 60,440" fill="#9CA3C7"/>
                <line x1="60"  y1="295" x2="200" y2="285" stroke="#5A4FD0" strokeWidth="2"   opacity="0.7"/>
                <line x1="60"  y1="345" x2="200" y2="335" stroke="#5A4FD0" strokeWidth="2.5" opacity="0.7"/>
                <line x1="60"  y1="400" x2="200" y2="385" stroke="#5A4FD0" strokeWidth="3"   opacity="0.7"/>
                <rect x="80"  y="298" width="50" height="35" fill="#6B6BEC" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="140" y="296" width="50" height="35" fill="#8B7FE8" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="80"  y="350" width="50" height="40" fill="#8B7FE8" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="140" y="348" width="50" height="40" fill="#6B6BEC" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="60"  y="260" width="5" height="180" fill="#1A1F36"/>
                <rect x="195" y="250" width="5" height="170" fill="#1A1F36"/>
                <rect x="125" y="255" width="5" height="180" fill="#1A1F36"/>
              </g>
              {/* Right racks */}
              <g opacity="0.7">
                <polygon points="600,250 480,260 480,400 600,420" fill="#A8AED0"/>
                <line x1="480" y1="285" x2="600" y2="280" stroke="#5A4FD0" strokeWidth="1.5" opacity="0.6"/>
                <line x1="480" y1="320" x2="600" y2="320" stroke="#5A4FD0" strokeWidth="1.8" opacity="0.6"/>
                <line x1="480" y1="365" x2="600" y2="370" stroke="#5A4FD0" strokeWidth="2"   opacity="0.6"/>
                <rect x="490" y="290" width="40" height="25" fill="#8B7FE8" stroke="#1A1F36" strokeWidth="1" opacity="0.85"/>
                <rect x="540" y="292" width="40" height="25" fill="#6B6BEC" stroke="#1A1F36" strokeWidth="1" opacity="0.85"/>
                <rect x="490" y="330" width="40" height="32" fill="#6B6BEC" stroke="#1A1F36" strokeWidth="1" opacity="0.85"/>
                <rect x="540" y="332" width="40" height="32" fill="#8B7FE8" stroke="#1A1F36" strokeWidth="1" opacity="0.85"/>
                <rect x="480" y="260" width="4" height="160" fill="#1A1F36"/>
                <rect x="596" y="250" width="4" height="170" fill="#1A1F36"/>
              </g>
              <g opacity="0.95">
                <polygon points="600,250 740,260 740,440 600,420" fill="#9CA3C7"/>
                <line x1="600" y1="285" x2="740" y2="295" stroke="#5A4FD0" strokeWidth="2"   opacity="0.7"/>
                <line x1="600" y1="335" x2="740" y2="345" stroke="#5A4FD0" strokeWidth="2.5" opacity="0.7"/>
                <line x1="600" y1="385" x2="740" y2="400" stroke="#5A4FD0" strokeWidth="3"   opacity="0.7"/>
                <rect x="610" y="296" width="50" height="35" fill="#8B7FE8" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="670" y="298" width="50" height="35" fill="#6B6BEC" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="610" y="348" width="50" height="40" fill="#6B6BEC" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="670" y="350" width="50" height="40" fill="#8B7FE8" stroke="#1A1F36" strokeWidth="1.5"/>
                <rect x="600" y="250" width="5" height="170" fill="#1A1F36"/>
                <rect x="735" y="260" width="5" height="180" fill="#1A1F36"/>
                <rect x="670" y="255" width="5" height="180" fill="#1A1F36"/>
              </g>
              {/* Drone */}
              <g>
                <animateTransform attributeName="transform" type="translate" values="0,0;0,8;0,-5;0,4;0,0" keyTimes="0;0.25;0.5;0.75;1" dur="3s" repeatCount="indefinite" additive="sum"/>
                <animateTransform attributeName="transform" type="translate" values="-280,0;280,0;280,0;-280,0;-280,0" keyTimes="0;0.45;0.55;0.95;1" dur="9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0 0 1 1;0.4 0 0.6 1;0 0 1 1" additive="sum"/>
                <polygon points="400,210 320,360 460,360" fill="url(#ahMonCone)" opacity="0.55">
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite"/>
                </polygon>
                <circle cx="360" cy="200" r="22" fill="url(#ahMonProp)"/>
                <circle cx="440" cy="200" r="22" fill="url(#ahMonProp)"/>
                <line x1="400" y1="215" x2="360" y2="200" stroke="#0F1535" strokeWidth="4" strokeLinecap="round"/>
                <line x1="400" y1="215" x2="440" y2="200" stroke="#0F1535" strokeWidth="4" strokeLinecap="round"/>
                <line x1="400" y1="215" x2="370" y2="230" stroke="#0F1535" strokeWidth="4" strokeLinecap="round"/>
                <line x1="400" y1="215" x2="430" y2="230" stroke="#0F1535" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="360" cy="200" r="6" fill="#0F1535"/>
                <circle cx="440" cy="200" r="6" fill="#0F1535"/>
                <circle cx="370" cy="230" r="5" fill="#0F1535"/>
                <circle cx="430" cy="230" r="5" fill="#0F1535"/>
                <g><ellipse cx="360" cy="200" rx="20" ry="1.8" fill="#0F1535" opacity="0.85"/><ellipse cx="360" cy="200" rx="1.8" ry="20" fill="#0F1535" opacity="0.85"/><animateTransform attributeName="transform" type="rotate" from="0 360 200"   to="360 360 200" dur="0.1s" repeatCount="indefinite"/></g>
                <g><ellipse cx="440" cy="200" rx="20" ry="1.8" fill="#0F1535" opacity="0.85"/><ellipse cx="440" cy="200" rx="1.8" ry="20" fill="#0F1535" opacity="0.85"/><animateTransform attributeName="transform" type="rotate" from="360 440 200" to="0 440 200"   dur="0.1s" repeatCount="indefinite"/></g>
                <g><ellipse cx="370" cy="230" rx="16" ry="1.5" fill="#0F1535" opacity="0.85"/><ellipse cx="370" cy="230" rx="1.5" ry="16" fill="#0F1535" opacity="0.85"/><animateTransform attributeName="transform" type="rotate" from="360 370 230" to="0 370 230"   dur="0.1s" repeatCount="indefinite"/></g>
                <g><ellipse cx="430" cy="230" rx="16" ry="1.5" fill="#0F1535" opacity="0.85"/><ellipse cx="430" cy="230" rx="1.5" ry="16" fill="#0F1535" opacity="0.85"/><animateTransform attributeName="transform" type="rotate" from="0 430 230"   to="360 430 230" dur="0.1s" repeatCount="indefinite"/></g>
                <rect x="385" y="208" width="30" height="20" rx="3" fill="#2A2F4A"/>
                <rect x="385" y="208" width="30" height="6"  rx="3" fill="#0F1535"/>
                <circle cx="400" cy="222" r="3"   fill="#0F1535"/>
                <circle cx="400" cy="222" r="1.5" fill="#2D2DEB">
                  <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite"/>
                </circle>
                <path d="M 388 226 L 380 240 L 384 242 L 392 228 Z" fill="#DC2626"/>
                <path d="M 412 226 L 420 240 L 416 242 L 408 228 Z" fill="#DC2626"/>
              </g>
              {/* Detection highlights */}
              {[
                { x:80,  y:298, w:50, h:35, k:'0;0;0.9;0.9;0', kt:'0;0.05;0.1;0.18;0.25' },
                { x:140, y:296, w:50, h:35, k:'0;0;0.9;0.9;0', kt:'0;0.1;0.15;0.22;0.28' },
                { x:80,  y:350, w:50, h:40, k:'0;0;0.9;0.9;0', kt:'0;0.08;0.13;0.2;0.27' },
                { x:220, y:290, w:40, h:25, k:'0;0;0.9;0.9;0', kt:'0;0.2;0.25;0.32;0.4'  },
                { x:540, y:332, w:40, h:32, k:'0;0;0.9;0.9;0', kt:'0;0.55;0.6;0.67;0.75' },
                { x:610, y:296, w:50, h:35, k:'0;0;0.9;0.9;0', kt:'0;0.7;0.75;0.82;0.88' },
                { x:670, y:298, w:50, h:35, k:'0;0;0.9;0.9;0', kt:'0;0.78;0.83;0.9;0.95' },
                { x:610, y:348, w:50, h:40, k:'0;0;0.9;0.9;0', kt:'0;0.72;0.77;0.85;0.92' },
              ].map(({ x, y, w, h, k, kt }, i) => (
                <rect key={i} x={x} y={y} width={w} height={h} fill="none" stroke="#2D2DEB" strokeWidth="2" rx="2" opacity="0">
                  <animate attributeName="opacity" values={k} keyTimes={kt} dur="9s" repeatCount="indefinite"/>
                </rect>
              ))}
              {/* HUD: PALLETS SCANNED — top-left */}
              <g>
                <rect x="8" y="8" width="230" height="90" rx="10" fill="rgba(15,21,53,0.88)"/>
                <text x="22" y="30" fontSize="18" fill="rgba(255,255,255,0.6)" fontFamily="system-ui,sans-serif" letterSpacing="1.5">PALLETS SCANNED</text>
                <text x="22" y="72" fontSize="36" fontWeight="700" fill="white" fontFamily="system-ui,sans-serif">{monPallets}</text>
              </g>
              {/* HUD: COVERAGE — top-right izquierda */}
              <g>
                <rect x="468" y="8" width="158" height="90" rx="10" fill="rgba(15,21,53,0.88)"/>
                <text x="480" y="30" fontSize="18" fill="rgba(255,255,255,0.6)" fontFamily="system-ui,sans-serif" letterSpacing="1.5">COVERAGE</text>
                <text x="480" y="72" fontSize="32" fontWeight="700" fill="white" fontFamily="system-ui,sans-serif">{monCoverage}</text>
              </g>
              {/* HUD: ANOMALIES — top-right derecha, al lado de COVERAGE */}
              <g>
                <rect x="634" y="8" width="158" height="90" rx="10" fill="rgba(15,21,53,0.88)"/>
                <text x="646" y="30" fontSize="18" fill="rgba(255,255,255,0.6)" fontFamily="system-ui,sans-serif" letterSpacing="1.5">ANOMALIES</text>
                <text x="646" y="72" fontSize="32" fontWeight="700" fontFamily="system-ui,sans-serif" fill={monAnomalyColor}>{monAnomalies}</text>
              </g>
            </svg>
              </div>{/* /stage */}
            </div>{/* /white canvas */}
          </div>{/* /purple wrapper */}
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
