import { useState, useMemo, useEffect } from 'react';
import { calculateFreelanceRates } from './lib/freelance-engine';
import type { FreelanceInfo } from './lib/freelance-engine';
import { 
  Plus,
  Minus,
  LayoutGrid,
  Euro, 
  Clock, 
  Briefcase, 
  Target, 
  Info,
  Calculator,
  History,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Moon,
  Sun,
  ChevronDown,
  Download,
  Share2,
  Globe
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  ResponsiveContainer, 
  Tooltip, 
  Treemap
} from 'recharts';
import { ZenInput } from './components/ZenInput';
import { exportToPDF } from './lib/PDFGenerator';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [info, setInfo] = useState<FreelanceInfo>({
    personalExpenses: {
      rent: 900,
      utilities: 150,
      food: 400,
      transport: 40,
      leisure: 300,
      savings: 500,
      other: 200,
    },
    businessExpenses: {
      autonomoFee: 320,
      software: 50,
      advisor: 60,
      other: 100,
    },
    taxation: {
      irpfRate: 0.20,
    },
    workingTime: {
      vacationWeeks: 4,
      holidaysDays: 14,
      sickDays: 5,
      dailyHours: 8,
      billablePercent: 0.75,
    },
    targetGross: 45000,
  });

  const result = useMemo(() => calculateFreelanceRates(info), [info]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);


  return (
    <div className="min-h-screen relative overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-500/30 transition-colors duration-500 font-sans pb-20">
      {/* Background Animated Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 dark:bg-blue-600/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-emerald-400/20 dark:bg-emerald-600/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[40%] bg-purple-400/20 dark:bg-purple-600/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-12 animate-fadeIn">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
              <Calculator size={20} />
            </div>
            <a href="https://borjafelixrojas.odoo.com/" target="_blank" rel="noopener noreferrer" className="text-sm font-black tracking-[0.3em] hidden sm:block hover:text-blue-500 transition-colors">
              BFR · ESTRATEGIA & GESTIí“N
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://borjafelixrojas.odoo.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-110 hover:text-blue-500 transition-all focus:outline-none"
              title="Visitar Web"
            >
              <Globe size={20} />
            </a>
            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-110 transition-all focus:outline-none"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
            <button 
              onClick={async () => {
                setIsExporting(true);
                await new Promise(r => setTimeout(r, 800)); // Relajamos el tiempo para renderizado
                await exportToPDF('freelance-app-content', 'Informe-Tarifa-Freelance-BFR');
                setIsExporting(false);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50"
              disabled={isExporting}
            >
              <Download size={18} className={cn(isExporting && "animate-bounce")} />
              <span className="hidden sm:inline">{isExporting ? 'Generando...' : 'Exportar Informe'}</span>
            </button>
          </div>
        </div>

        <div id="freelance-app-content" className="bg-slate-50 dark:bg-slate-950 rounded-[3rem] p-4 sm:p-8 lg:p-12 mb-8">
          <header className="mb-16 text-center animate-fadeIn animation-delay-200">
            {isExporting && (
              <div className="mb-12 p-6 rounded-3xl border-2 border-blue-600/20 inline-flex items-center gap-4 bg-white dark:bg-slate-900 mx-auto shadow-2xl">
                <Calculator className="text-blue-600" size={32} />
                <div className="text-left leading-none">
                  <span className="text-xs font-black tracking-[0.3em] text-slate-400 block mb-1">BORJA FELIX ROJAS</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">Ingeniería de lo Cotidiano</span>
                </div>
              </div>
            )}
            <h1 className="text-5xl lg:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-400 dark:to-white tracking-tight leading-tight">
              Tarifa Freelance <span className="text-blue-600 dark:text-blue-400">Zen</span>
            </h1>
            <p className="mt-8 text-slate-500 dark:text-slate-400 text-lg sm:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
              Diseña tu libertad financiera. Calcula tu valor basándote en la realidad, no en el miedo.
            </p>
          </header>

          <main className="grid lg:grid-cols-12 gap-8 items-start animate-fadeIn animation-delay-500">
            <div className="lg:col-span-12 grid md:grid-cols-3 gap-8 mb-4">
              <div className="glass-card p-10 flex flex-col justify-between group overflow-hidden relative border-blue-500/10 dark:border-blue-500/20 bg-blue-600/5">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <ShieldCheck size={220} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-200 dark:border-blue-800">Salud Financiera</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black mt-6 leading-tight dark:text-white uppercase tracking-tighter italic">Seguridad <span className="text-blue-600 block text-4xl sm:text-5xl not-italic">Financiera</span></h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-4 max-w-[280px] font-medium leading-relaxed">Resistencia ante caídas de ingresos.</p>
                  </div>
                  <div className="mt-12 relative z-10">
                    <div className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-slate-800 dark:text-white flex items-baseline gap-2 leading-tight">
                      {result.safetyMargin.toFixed(0)}<span className="text-2xl text-blue-500 font-black italic ml-2">%</span>
                    </div>
                    <div className="mt-8 flex items-center gap-3 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-[0.15em]">
                      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/40">
                          <History size={18} />
                      </div>
                      <span>Runway: {result.runwayMonths.toFixed(1)} meses de vida</span>
                    </div>
                  </div>
              </div>

              <div className="glass-card p-10 flex flex-col justify-between group overflow-hidden relative border-emerald-500/10 dark:border-emerald-500/20">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                    <Target size={220} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-200 dark:border-emerald-800">Punto de Equilibrio</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black mt-6 leading-tight dark:text-white uppercase tracking-tighter italic">Suelo de <span className="text-emerald-600 block text-4xl sm:text-5xl not-italic">Ingresos</span></h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-4 max-w-[280px] font-medium leading-relaxed">Mínimo para cubrir vida y negocio.</p>
                  </div>
                  <div className="mt-12 relative z-10">
                    <div className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-slate-800 dark:text-white flex items-baseline gap-2 leading-tight">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(result.breakEvenMonthly)}
                    </div>
                    <div className="mt-8 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-[0.15em]">
                      <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                          <CheckCircle2 size={18} />
                      </div>
                      <span>Tarifa base: {result.bottomUpRate.toFixed(1)}€/h</span>
                    </div>
                  </div>
              </div>

              <div className="glass-card p-10 bg-slate-900 border-2 border-blue-500/30 flex flex-col justify-between group overflow-hidden relative shadow-2xl shadow-blue-500/10 h-full">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                    <TrendingUp size={180} />
                  </div>
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/30">Ambición Zen</span>
                      <div className="flex gap-2">
                         <button 
                           onClick={() => setInfo({...info, targetGross: (info.targetGross || 0) - 1000})}
                           className="p-2 rounded-lg bg-slate-800 text-white hover:bg-red-500/20 transition-colors border border-slate-700"
                           title="Restar 1.000€"
                         >
                           <Minus size={14} />
                         </button>
                         <button 
                           onClick={() => setInfo({...info, targetGross: (info.targetGross || 0) + 1000})}
                           className="p-2 rounded-lg bg-slate-800 text-white hover:bg-emerald-500/20 transition-colors border border-slate-700"
                           title="Sumar 1.000€"
                         >
                           <Plus size={14} />
                         </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bruto Anual Objetivo</label>
                        <div className="flex items-baseline gap-2 group/input">
                          <input 
                            type="number"
                            value={info.targetGross}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => setInfo({...info, targetGross: parseFloat(e.target.value)})}
                            className="bg-transparent text-5xl lg:text-6xl font-black outline-none border-b-2 border-slate-800 focus:border-blue-500 transition-all w-full text-white tracking-tighter"
                          />
                          <span className="text-3xl font-black text-blue-500">€</span>
                        </div>
                    </div>
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Tarifa Sugerida</span>
                    <div className="text-5xl lg:text-7xl font-black tracking-tighter text-white flex items-baseline gap-1 animate-pulse-slow">
                      {result.suggestedRate?.toFixed(2)}<span className="text-xl text-blue-500 italic">€/h</span>
                    </div>
                  </div>
              </div>
            </div>
            <div className="lg:col-span-12">
              <div className="glass-card p-10 flex flex-col items-center">
                  <h3 className="text-xl font-black mb-8 dark:text-white uppercase tracking-widest flex items-center gap-4 self-start">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/10">
                        <LayoutGrid size={20} />
                    </div>
                    Composición Jerárquica del Esfuerzo
                  </h3>
                  <div className="w-full h-[500px] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800">
                      <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                          data={result.chartBreakdown}
                          dataKey="value"
                          stroke="#fff"
                          fill="#8884d8"
                          content={(props: any) => {
                             const { x, y, width, height, name, color, value } = props;
                             if (width < 40 || height < 40) return null;
                             return (
                               <g>
                                 <rect x={x} y={y} width={width} height={height} style={{ fill: color, stroke: '#fff', strokeWidth: 2, fillOpacity: 0.8 }} />
                                 <text x={x + width / 2} y={y + height / 2 - 10} textAnchor="middle" fill="#fff" fontSize={12} fontWeight="900" className="uppercase tracking-widest">
                                   {name}
                                 </text>
                                 <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="#fff" fontSize={10} fontWeight="500">
                                   {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)}
                                 </text>
                               </g>
                             );
                          }}
                        >
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff' }}
                            formatter={(value: any) => [new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value)]}
                          />
                        </Treemap>
                      </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-8 w-full">
                      {result.chartBreakdown.map((entry) => (
                          <div key={entry.name} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                              <span className="text-[10px] font-black uppercase tracking-tight text-slate-500">{entry.name}</span>
                          </div>
                      ))}
                  </div>
              </div>
            </div>

            <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <InputSection 
                    title="Coste Vida" 
                    icon={<Euro size={20}/>}
                    bg="bg-emerald-500/5"
                    iconColor="text-emerald-500"
                    defaultOpen={true}
                  >
                      <div className="space-y-6">
                          <ZenInput 
                            label="Alquiler / Hipoteca" 
                            value={info.personalExpenses.rent} 
                            onChange={(v) => setInfo({...info, personalExpenses: {...info.personalExpenses, rent: v}})}
                          />
                          <ZenInput 
                            label="Ahorro Mensual" 
                            value={info.personalExpenses.savings} 
                            onChange={(v) => setInfo({...info, personalExpenses: {...info.personalExpenses, savings: v}})}
                          />
                          <ZenInput 
                            label="Alimentación y Gastos" 
                            value={info.personalExpenses.food + info.personalExpenses.utilities} 
                            onChange={(v) => setInfo({...info, personalExpenses: {...info.personalExpenses, food: v}})}
                          />
                          <ZenInput 
                            label="Ocio y Otros" 
                            value={info.personalExpenses.leisure + info.personalExpenses.other} 
                            onChange={(v) => setInfo({...info, personalExpenses: {...info.personalExpenses, other: v}})}
                          />
                      </div>
                  </InputSection>

                  <InputSection 
                    title="Estructura" 
                    icon={<Briefcase size={20}/>}
                    bg="bg-blue-500/5"
                    iconColor="text-blue-500"
                  >
                      <div className="space-y-6">
                          <ZenInput 
                            label="Cuota Autónomos" 
                            value={info.businessExpenses.autonomoFee} 
                            onChange={(v) => setInfo({...info, businessExpenses: {...info.businessExpenses, autonomoFee: v}})}
                          />
                          <ZenInput 
                            label="Software / Tools" 
                            value={info.businessExpenses.software} 
                            onChange={(v) => setInfo({...info, businessExpenses: {...info.businessExpenses, software: v}})}
                          />
                          <ZenInput 
                            label="Asesoría" 
                            value={info.businessExpenses.advisor} 
                            onChange={(v) => setInfo({...info, businessExpenses: {...info.businessExpenses, advisor: v}})}
                          />
                          <ZenInput 
                            label="Otros Profesionales" 
                            value={info.businessExpenses.other} 
                            onChange={(v) => setInfo({...info, businessExpenses: {...info.businessExpenses, other: v}})}
                          />
                      </div>
                  </InputSection>

                  <InputSection 
                    title="Disponibilidad" 
                    icon={<Clock size={20}/>}
                    bg="bg-amber-500/5"
                    iconColor="text-amber-500"
                  >
                      <div className="space-y-6">
                          <ZenInput 
                            label="Horas por Día" 
                            value={info.workingTime.dailyHours} 
                            onChange={(v) => setInfo({...info, workingTime: {...info.workingTime, dailyHours: v}})}
                            step={1}
                          />
                          <ZenInput 
                            label="Vacaciones (Semanas)" 
                            value={info.workingTime.vacationWeeks} 
                            onChange={(v) => setInfo({...info, workingTime: {...info.workingTime, vacationWeeks: v}})}
                            step={1}
                          />
                          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center px-1">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Ratio Producción</label>
                              <span className="text-sm font-black text-amber-500">{(info.workingTime.billablePercent * 100).toFixed(0)}%</span>
                            </div>
                            <input 
                              type="range" min="0" max="1" step="0.05"
                              value={info.workingTime.billablePercent}
                              onChange={(e) => setInfo({...info, workingTime: {...info.workingTime, billablePercent: parseFloat(e.target.value)}})}
                              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-amber-500"
                            />
                            <p className="text-[9px] text-slate-400 font-medium italic text-center leading-tight">Tiempo facturable vs. gestión propia.</p>
                          </div>
                      </div>
                  </InputSection>
            </div>
            
            <div className="lg:col-span-12">
              <InsightPanel result={result} info={info} />
            </div>
          </main>

          <footer className="mt-20 py-12 text-center border-t border-slate-100 dark:border-slate-900">
            {isExporting && (
              <div className="mb-12">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Simulación Generada el {new Date().toLocaleDateString('es-ES')}</p>
                <a 
                  href="https://borjafelixrojas.odoo.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2 rounded-full border border-blue-600/20 inline-block text-blue-600 font-black text-sm tracking-tighter hover:bg-blue-600/5 transition-colors"
                >
                  BORJAFELIXROJAS.ODOO.COM
                </a>
              </div>
            )}
            <p className="text-slate-300 dark:text-slate-700 text-[10px] tracking-[0.6em] font-black uppercase">
              ESTRATEGIA · TECNOLOGíA · DATOS · 2026
            </p>
          </footer>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20">
         <div className="glass-card p-12 border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
               <div className="space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Ficha Técnica del Proyecto <span className="text-blue-500 font-light italic">Showcase</span></h3>
                  <div className="flex flex-wrap gap-3">
                     {['React 19', 'Vite', 'Tailwind v4', 'Lucide', 'html2canvas', 'Vibe Coding'].map(tech => (
                        <span key={ tech } className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-700">{tech}</span>
                     ))}
                  </div>
               </div>
               <div className="max-w-md text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed italic">
                  Solución técnica diseñada bajo el marco de "Control de Gestión" para profesionales independientes. Arquitectura modular React 19 con estilizado atómico en Tailwind v4. Un desarrollo Antigravity enfocado en la transparencia de costes.
               </div>
            </div>
         </div>
      </div>

      <div className="py-12 flex justify-center gap-6 animate-fadeIn">
          <a href="https://borjafelixrojas.odoo.com/" title="Compartir Simulación" className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-blue-500 hover:scale-110 transition-all shadow-xl shadow-slate-200 dark:shadow-none">
            <Share2 size={24} />
          </a>
      </div>
    </div>
  );
}

function InputSection({ title, children, icon, bg, iconColor, defaultOpen = false }: any) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden transition-all shadow-xl shadow-slate-200/50 dark:shadow-none", bg)}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-10 flex items-center justify-between group hover:bg-white/50 dark:hover:bg-slate-900/50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-5">
          <div className={cn("p-5 rounded-3xl shadow-2xl transition-transform group-hover:scale-110 bg-white dark:bg-slate-900", iconColor)}>
            {icon}
          </div>
          <h3 className="font-black text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
            {title}
          </h3>
        </div>
        <ChevronDown className={cn("text-slate-300 transition-transform duration-700", isOpen && "rotate-180")} size={24} />
      </button>
      
      <div className={cn(
        "transition-all duration-700 ease-in-out px-10 pb-10",
        isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 pointer-events-none overflow-hidden"
      )}>
        {children}
      </div>
    </div>
  );
}

function InsightPanel({ result, info }: { result: any, info: FreelanceInfo }) {
  const hourly = result.bottomUpRate;
  const lifestyleCost = 50 / hourly; 
  
  return (
    <div className="glass-card p-12 sm:p-20 overflow-hidden relative group mt-16 bg-blue-600/[0.03] dark:bg-blue-600/[0.05] border-blue-500/10 shadow-blue-500/5">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000 pointer-events-none">
         <History size={320} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-6 mb-20">
          <div className="p-6 bg-blue-600 rounded-3xl text-white shadow-2xl shadow-blue-500/40 transform -rotate-12">
            <Info size={32} />
          </div>
          <h3 className="text-5xl sm:text-7xl font-black tracking-tighter dark:text-white uppercase">Control de <span className="text-blue-600 italic">Gestión</span></h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 lg:gap-24 items-start">
           <div className="space-y-8 p-8 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800/20 backdrop-blur-sm shadow-sm group/card hover:-translate-y-2 transition-transform">
              <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
                <Clock size={20} className="group-hover/card:text-blue-500 transition-colors" />
                <h4 className="font-black text-xs uppercase tracking-[0.3em]">Tu Hora de Vida</h4>
              </div>
              <div className="space-y-4">
                <p className="text-6xl font-black dark:text-white tracking-tighter">{result.suggestedRate.toFixed(2)}<span className="text-lg italic ml-1">€</span></p>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-bold italic tracking-tight">
                  Trabajarás <b>{result.annualBillableHours.toFixed(0)} horas</b> reales este año. Cada gasto de 50€ supone <b>{lifestyleCost.toFixed(1)} horas</b> de tu vida profesional.
                </p>
              </div>
           </div>

           <div className="space-y-8 p-8 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800/20 backdrop-blur-sm shadow-sm group/card hover:-translate-y-2 transition-transform">
              <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
                <ShieldCheck size={20} className="group-hover/card:text-emerald-500 transition-colors" />
                <h4 className="font-black text-xs uppercase tracking-[0.3em]">Carga Impositiva</h4>
              </div>
              <div className="space-y-4">
                <p className="text-6xl font-black dark:text-white tracking-tighter">{ (info.taxation.irpfRate * 100).toFixed(0) }<span className="text-lg italic ml-1">%</span></p>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-bold italic tracking-tight">
                  Fiscalidad incluida. El Estado es tu socio mayoritario y sus gastos están integrados en tu tarifa "Bottom-Up" desde el primer céntimo.
                </p>
              </div>
           </div>

           <div className="space-y-8 p-8 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-white/20 dark:border-slate-800/20 backdrop-blur-sm shadow-sm group/card hover:-translate-y-2 transition-transform">
              <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
                <Briefcase size={20} className="group-hover/card:text-amber-500 transition-colors" />
                <h4 className="font-black text-xs uppercase tracking-[0.3em]">Riesgo Negocio</h4>
              </div>
              <div className="space-y-4">
                <p className="text-6xl font-black dark:text-white tracking-tighter">{(100 - info.workingTime.billablePercent * 100).toFixed(0)}<span className="text-lg italic ml-1">%</span></p>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-bold italic tracking-tight">
                  Gestión no facturable. Tu tarifa subsidia tus horas de ventas y administración para que nunca regales tu tiempo al mercado.
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
