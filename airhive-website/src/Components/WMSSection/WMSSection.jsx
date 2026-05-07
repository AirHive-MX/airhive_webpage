import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Warehouse, ArrowDownToLine, ArrowUpFromLine, MapPin, GitBranch, Activity, Bell, BarChart3, TrendingUp, Box, AlertCircle, CheckCircle2, Clock, Layers, Eye, Zap, Shield, Radio, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WMSSection() {
  const { t } = useTranslation();
  const [accuracy, setAccuracy] = useState(94.2);
  const [fillRate, setFillRate] = useState(91);
  const [discrepancies, setDiscrepancies] = useState(12);
  const [productivity, setProductivity] = useState(78);
  const [occupancy, setOccupancy] = useState(67);
  const [rotation, setRotation] = useState(4.2);
  const [opTime, setOpTime] = useState(3.4);
  const [chartData, setChartData] = useState([45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 79, 88]);
  const [pulseIdx, setPulseIdx] = useState(0);
  const [rackHighlight, setRackHighlight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAccuracy(prev => Math.min(99.8, prev + (Math.random() * 0.4 - 0.1)));
      setFillRate(prev => Math.min(98, prev + (Math.random() * 0.6 - 0.2)));
      setDiscrepancies(prev => Math.max(2, prev - (Math.random() * 0.3)));
      setProductivity(prev => Math.min(96, prev + (Math.random() * 0.8 - 0.2)));
      setOccupancy(() => 67 + Math.sin(Date.now() / 2000) * 3);
      setRotation(prev => Math.min(6.8, prev + (Math.random() * 0.05 - 0.01)));
      setOpTime(prev => Math.max(1.8, prev - (Math.random() * 0.02)));
      setChartData(prev => [...prev.slice(1), Math.min(95, prev[prev.length - 1] + (Math.random() * 8 - 3))]);
      setPulseIdx(prev => (prev + 1) % 8);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const rackInterval = setInterval(() => setRackHighlight(prev => (prev + 1) % 4), 1500);
    return () => clearInterval(rackInterval);
  }, []);

  const controlItems = [
    { icon: Box,             label: t('wms_section.ctrl_1_label'), desc: t('wms_section.ctrl_1_desc') },
    { icon: ArrowDownToLine, label: t('wms_section.ctrl_2_label'), desc: t('wms_section.ctrl_2_desc') },
    { icon: ArrowUpFromLine, label: t('wms_section.ctrl_3_label'), desc: t('wms_section.ctrl_3_desc') },
    { icon: MapPin,          label: t('wms_section.ctrl_4_label'), desc: t('wms_section.ctrl_4_desc') },
    { icon: GitBranch,       label: t('wms_section.ctrl_5_label'), desc: t('wms_section.ctrl_5_desc') },
    { icon: Activity,        label: t('wms_section.ctrl_6_label'), desc: t('wms_section.ctrl_6_desc') },
    { icon: Bell,            label: t('wms_section.ctrl_7_label'), desc: t('wms_section.ctrl_7_desc') },
    { icon: BarChart3,       label: t('wms_section.ctrl_8_label'), desc: t('wms_section.ctrl_8_desc') },
  ];

  const capabilities = [
    { icon: Eye,      title: t('wms_section.cap_1_title'), desc: t('wms_section.cap_1_desc') },
    { icon: GitBranch,title: t('wms_section.cap_2_title'), desc: t('wms_section.cap_2_desc') },
    { icon: Radio,    title: t('wms_section.cap_3_title'), desc: t('wms_section.cap_3_desc') },
    { icon: BarChart3,title: t('wms_section.cap_4_title'), desc: t('wms_section.cap_4_desc') },
  ];

  const layoutItems = [
    { Icon: Boxes,  val: 2,   label: t('wms_section.zones') },
    { Icon: Layers, val: 4,   label: t('wms_section.racks') },
    { Icon: GitBranch, val: 4, label: t('wms_section.aisles') },
    { Icon: Box,    val: 560, label: t('wms_section.positions') },
  ];

  return (
    <div className="py-24 px-6 md:px-12 lg:px-20 overflow-hidden" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div className="max-w-7xl mx-auto">

        {/* MAIN HERO */}
        <div className="mb-32 relative">
          <div className="absolute -top-8 -right-8 w-72 h-72 bg-indigo-100 rounded-full blur-3xl opacity-40 animate-pulse-slow" />
          <div className="absolute -bottom-12 left-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30" />
          <div className="relative">
            <h2 className="text-3xl font-semibold text-slate-900 leading-tight mb-6 sm:text-4xl">
              <span className="relative inline-block">
                WMS<span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-grow-line" />
              </span>
            </h2>
            <p className="text-xl md:text-2xl font-semibold text-slate-700 mb-3 tracking-tight">
              {t('wms_section.hero_subtitle')}
            </p>
            <p className="text-base text-slate-500 max-w-2xl leading-relaxed">
              {t('wms_section.hero_desc')}
            </p>
          </div>
        </div>

        {/* CONTROL CENTER */}
        <div className="mb-32">
          <p className="text-xs font-bold tracking-[0.2em] text-indigo-600 mb-4">{t('wms_section.control_kicker')}</p>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-3 tracking-tight">
            {t('wms_section.control_title')}
          </h3>
          <p className="text-base text-slate-500 max-w-2xl mb-12">
            {t('wms_section.control_desc')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {controlItems.map((item, i) => {
              const Icon = item.icon;
              const isPulsing = pulseIdx === i;
              return (
                <div key={i} className="group bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(15,27,61,0.06)] border border-slate-100 hover:shadow-[0_12px_40px_rgba(79,70,229,0.15)] hover:-translate-y-2 hover:border-indigo-200 transition-all duration-500 cursor-default relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 to-indigo-50/0 group-hover:from-indigo-50/50 group-hover:to-blue-50/30 transition-all duration-500" />
                  <div className={`relative w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center mb-5 transition-all duration-500 group-hover:bg-indigo-600 group-hover:scale-110 ${isPulsing ? 'ring-4 ring-indigo-200' : ''}`}>
                    <Icon className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors duration-500" strokeWidth={2.2} />
                    {isPulsing && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                      </span>
                    )}
                  </div>
                  <h4 className="relative font-bold text-slate-900 mb-2 text-base">{item.label}</h4>
                  <p className="relative text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* IN ACTION */}
        <div className="mb-32">
          <p className="text-xs font-bold tracking-[0.2em] text-indigo-600 mb-4">{t('wms_section.action_kicker')}</p>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-12 tracking-tight">
            {t('wms_section.action_title')}
          </h3>
          <div className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_8px_40px_rgba(15,27,61,0.08)] border border-slate-100 relative overflow-hidden">
            <div className="relative flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-sm font-semibold text-slate-700">{t('wms_section.dashboard_live')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Clock className="w-3 h-3" />
                {t('wms_section.updated_realtime')}
              </div>
            </div>

            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <KPICard label={t('wms_section.kpi_accuracy')}     value={accuracy.toFixed(1)}    suffix="%" trend="+2.4" color="emerald" />
              <KPICard label={t('wms_section.kpi_fillrate')}     value={fillRate.toFixed(0)}    suffix="%" trend="+5.1" color="indigo" />
              <KPICard label={t('wms_section.kpi_productivity')} value={productivity.toFixed(0)} suffix="%" trend="+8.2" color="indigo" />
              <KPICard label={t('wms_section.kpi_optime')}       value={opTime.toFixed(1)}      suffix="min" trend="-12%" color="emerald" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-8 w-1 h-1 bg-indigo-300 rounded-full animate-twinkle" />
                  <div className="absolute top-12 right-16 w-1 h-1 bg-indigo-300 rounded-full animate-twinkle" style={{ animationDelay: '0.5s' }} />
                  <div className="absolute bottom-8 left-24 w-1 h-1 bg-indigo-300 rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
                </div>
                <div className="relative flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-indigo-300 tracking-wider mb-1">{t('wms_section.chart_kicker')}</p>
                    <p className="text-2xl font-bold tabular-nums">+487 {t('wms_section.chart_in')} <span className="text-slate-400 text-base font-normal">/ 352 {t('wms_section.chart_out')}</span></p>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-semibold bg-emerald-400/10 px-2.5 py-1 rounded-md">
                    <TrendingUp className="w-4 h-4" />
                    +18%
                  </div>
                </div>
                <svg viewBox="0 0 400 120" className="w-full h-32 relative" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="url(#chartGrad)"
                    stroke="none"
                    points={`0,120 ${chartData.map((v, i) => `${(i / (chartData.length - 1)) * 400},${120 - v}`).join(' ')} 400,120`}
                    style={{ transition: 'all 0.8s ease-out' }}
                  />
                  <polyline
                    fill="none"
                    stroke="#a5b4fc"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartData.map((v, i) => `${(i / (chartData.length - 1)) * 400},${120 - v}`).join(' ')}
                    style={{ transition: 'all 0.8s ease-out', filter: 'drop-shadow(0 0 4px #818cf8)' }}
                  />
                  {chartData.map((v, i) => i === chartData.length - 1 && (
                    <g key={i}>
                      <circle cx={(i / (chartData.length - 1)) * 400} cy={120 - v} r="6" fill="#a5b4fc" opacity="0.3" style={{ transition: 'all 0.8s ease-out' }}>
                        <animate attributeName="r" values="6;14;6" dur="1.8s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="1.8s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={(i / (chartData.length - 1)) * 400} cy={120 - v} r="4" fill="#a5b4fc" style={{ transition: 'all 0.8s ease-out' }} />
                    </g>
                  ))}
                </svg>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>{t('wms_section.chart_label_1')}</span>
                  <span>{t('wms_section.chart_label_2')}</span>
                  <span>{t('wms_section.chart_label_3')}</span>
                  <span>{t('wms_section.chart_label_4')}</span>
                  <span>{t('wms_section.chart_today')}</span>
                </div>
              </div>
              <div className="space-y-4">
                <SmallKPI icon={Layers}       label={t('wms_section.kpi_occupancy')}     value={occupancy.toFixed(0)}    suffix="%" color="indigo" />
                <SmallKPI icon={Activity}     label={t('wms_section.kpi_rotation')}      value={rotation.toFixed(1)}     suffix="x" color="emerald" subtitle={t('wms_section.months')} />
                <SmallKPI icon={AlertCircle}  label={t('wms_section.kpi_discrepancies')} value={discrepancies.toFixed(0)} color="amber" subtitle={t('wms_section.open')} />
              </div>
            </div>

            <div className="relative mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              <AlertRow color="emerald" icon={CheckCircle2} text={t('wms_section.alert_1')} time={t('wms_section.time_2m')} />
              <AlertRow color="indigo"  icon={Box}          text={t('wms_section.alert_2')} time={t('wms_section.time_5m')} />
              <AlertRow color="amber"   icon={AlertCircle}  text={t('wms_section.alert_3')} time={t('wms_section.time_12m')} />
            </div>
          </div>
        </div>

        {/* SMART 3D */}
        <div className="mb-32">
          <p className="text-xs font-bold tracking-[0.2em] text-indigo-600 mb-4">{t('wms_section.smart3d_kicker')}</p>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-3 tracking-tight">
            {t('wms_section.smart3d_title')}
          </h3>
          <p className="text-base text-slate-500 max-w-2xl mb-12">
            {t('wms_section.smart3d_desc')}
          </p>
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-3xl p-6 md:p-10 border border-slate-100 relative overflow-hidden">
            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold tracking-wider text-slate-400 mb-3">{t('wms_section.utilization')}</p>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-4xl font-bold text-slate-900 tabular-nums">{occupancy.toFixed(0)}</span>
                    <span className="text-xl text-slate-500 font-medium">%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-1000" style={{ width: `${occupancy}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {layoutItems.map(({ Icon, val, label }) => (
                    <div key={label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                      <Icon className="w-5 h-5 text-indigo-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-slate-900 tabular-nums">{val}</div>
                      <div className="text-xs text-slate-500 font-medium">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold tracking-wider text-slate-400 mb-3">{t('wms_section.position_status')}</p>
                  <div className="space-y-2 text-sm">
                    <StatusRow color="emerald" label={t('wms_section.available')} value="553" />
                    <StatusRow color="indigo"  label={t('wms_section.occupied')}  value="7" />
                    <StatusRow color="red"     label={t('wms_section.blocked')}   value="0" />
                    <StatusRow color="amber"   label={t('wms_section.quarantine')} value="0" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm min-h-[400px] relative overflow-hidden">
                <svg viewBox="0 0 600 400" className="w-full h-full">
                  <defs>
                    <linearGradient id="rackTop" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                    <linearGradient id="rackTopHL" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#4338ca" />
                    </linearGradient>
                    <pattern id="floorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect x="0" y="0" width="600" height="400" fill="url(#floorGrid)" />
                  {[0, 1, 2, 3].map(i => {
                    const x = 80 + i * 110;
                    const isHL = rackHighlight === i;
                    return (
                      <g key={i} style={{ transition: 'all 0.5s' }}>
                        <ellipse cx={x + 40} cy={340} rx="55" ry="8" fill="#0F1B3D" opacity="0.1" />
                        <polygon points={`${x},120 ${x + 80},120 ${x + 80},320 ${x},320`} fill={isHL ? '#4338ca' : '#1e293b'} style={{ transition: 'fill 0.5s' }} />
                        <polygon points={`${x + 80},120 ${x + 95},105 ${x + 95},305 ${x + 80},320`} fill={isHL ? '#3730a3' : '#0f172a'} style={{ transition: 'fill 0.5s' }} />
                        <polygon points={`${x},120 ${x + 80},120 ${x + 95},105 ${x + 15},105`} fill={isHL ? 'url(#rackTopHL)' : 'url(#rackTop)'} style={{ transition: 'fill 0.5s' }} />
                        {[0, 1, 2].map(level => (
                          <g key={level}>
                            {[0, 1, 2, 3].map(col => {
                              const occupied = (i + col + level) % 3 !== 0;
                              const cellX = x + 8 + col * 17;
                              const cellY = 135 + level * 60;
                              return (
                                <rect key={col} x={cellX} y={cellY} width="14" height="50"
                                  fill={occupied ? (isHL ? '#a5b4fc' : '#10b981') : 'transparent'}
                                  stroke={isHL ? '#c7d2fe' : '#475569'} strokeWidth="0.5"
                                  opacity={occupied ? 0.85 : 0.3} style={{ transition: 'all 0.5s' }}
                                />
                              );
                            })}
                          </g>
                        ))}
                        <text x={x + 40} y={365} textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="600">
                          Rack {i + 1}
                        </text>
                      </g>
                    );
                  })}
                  {[0, 1, 2, 3].map(i => rackHighlight === i && (
                    <g key={`beam-${i}`}>
                      <line x1={80 + i * 110 + 40} y1="40" x2={80 + i * 110 + 40} y2="120"
                        stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" opacity="0.8">
                        <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="0.8s" repeatCount="indefinite" />
                      </line>
                      <circle cx={80 + i * 110 + 40} cy="40" r="6" fill="#818cf8">
                        <animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={80 + i * 110 + 40} cy="40" r="3" fill="white" />
                    </g>
                  ))}
                  <g>
                    <rect x="450" y="20" width="130" height="40" rx="8" fill="white" stroke="#e2e8f0" />
                    <text x="465" y="38" fill="#64748b" fontSize="9" fontWeight="700" letterSpacing="1">{t('wms_section.scanning')}</text>
                    <text x="465" y="54" fill="#0f172a" fontSize="14" fontWeight="700">{t('wms_section.rack_of', { n: rackHighlight + 1 })}</text>
                  </g>
                </svg>
                <div className="absolute bottom-4 left-6 flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-500 rounded-sm" />{t('wms_section.available')}</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-indigo-400 rounded-sm" />{t('wms_section.active_scan')}</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 border border-slate-400 rounded-sm" />{t('wms_section.empty')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CAPABILITIES */}
        <div className="mb-20">
          <p className="text-xs font-bold tracking-[0.2em] text-indigo-600 mb-4">{t('wms_section.cap_kicker')}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-10 tracking-tight">
            {t('wms_section.cap_title')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {capabilities.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div key={i} className="group bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_24px_rgba(15,27,61,0.06)] hover:shadow-[0_12px_40px_rgba(79,70,229,0.12)] hover:-translate-y-1 hover:border-indigo-200 transition-all duration-500">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-500">
                    <Icon className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors duration-500" strokeWidth={2.2} />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1.5 text-sm">{cap.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="py-12">
          <Link to="/contact" className="ah-button ah-button-primary mt-7 inline-block rounded-full px-6 py-3 text-sm font-semibold">
            {t('products.cta_button')}
          </Link>
        </div>

      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes grow-line {
          from { transform: scaleX(0); transform-origin: left; }
          to { transform: scaleX(1); transform-origin: left; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-grow-line { animation: grow-line 1.2s ease-out 0.3s both; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function KPICard({ label, value, suffix, trend, color }) {
  const colors = {
    emerald: { trendBg: 'bg-emerald-50', trendText: 'text-emerald-600', dot: 'bg-emerald-500' },
    indigo:  { trendBg: 'bg-indigo-50',  trendText: 'text-indigo-600',  dot: 'bg-indigo-500'  },
    amber:   { trendBg: 'bg-amber-50',   trendText: 'text-amber-600',   dot: 'bg-amber-500'   },
  };
  const c = colors[color];
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md group">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{label}</p>
        <div className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      </div>
      <div className="flex items-baseline gap-1.5 mb-2">
        <span className="text-3xl md:text-4xl font-bold text-slate-900 tabular-nums tracking-tight group-hover:text-indigo-700 transition-colors">{value}</span>
        <span className="text-lg text-slate-500 font-medium">{suffix}</span>
      </div>
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${c.trendBg} ${c.trendText} text-xs font-semibold`}>
        <TrendingUp className="w-3 h-3" />
        {trend}
      </div>
    </div>
  );
}

function SmallKPI({ icon: Icon, label, value, suffix, subtitle, color }) {
  const colors = {
    indigo:  'text-indigo-600 bg-indigo-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    amber:   'text-amber-600 bg-amber-50',
  };
  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-3 hover:border-indigo-200 hover:bg-white transition-all duration-300 group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]} group-hover:scale-110 transition-transform`}>
        <Icon className="w-4 h-4" strokeWidth={2.4} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-medium mb-0.5 truncate">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-slate-900 tabular-nums">{value}{suffix}</span>
          {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}

function AlertRow({ color, icon: Icon, text, time }) {
  const colors = {
    emerald: 'text-emerald-600 bg-emerald-50',
    indigo:  'text-indigo-600 bg-indigo-50',
    amber:   'text-amber-600 bg-amber-50',
  };
  return (
    <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all duration-300">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon className="w-4 h-4" strokeWidth={2.4} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-700 truncate">{text}</p>
        <p className="text-[11px] text-slate-400 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          {time}
        </p>
      </div>
    </div>
  );
}

function StatusRow({ color, label, value }) {
  const dotColors = {
    emerald: 'bg-emerald-500',
    indigo:  'bg-indigo-500',
    red:     'bg-red-500',
    amber:   'bg-amber-500',
  };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${dotColors[color]}`} />
        <span className="text-slate-600">{label}</span>
      </div>
      <span className="font-bold text-slate-900 tabular-nums">{value}</span>
    </div>
  );
}
