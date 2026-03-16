import { useState, useMemo, useEffect } from 'react';
import { calculateFreelanceRates } from './lib/freelance-engine';
import type { FreelanceInfo } from './lib/freelance-engine';
import { 
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
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
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

  const chartData = [
    { name: 'Sueldo Neto', value: result.annualPersonalNet, color: '#10b981' },
    { name: 'Gastos Negocio', value: result.annualBusinessExpenses, color: '#3b82f6' },
    { name: 'Impuestos (IRPF)', value: result.requiredAnnualGross - result.annualPersonalNet - result.annualBusinessExpenses, color: '#f59e0b' },
  ];

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
              BFR · ESTRATEGIA & GESTIÓN
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
                await new Promise(r => setTimeout(r, 100));
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
            <div className="lg:col-span-12 grid md:grid-cols-2 gap-8 mb-4">
              <div className="glass-card p-10 flex flex-col justify-between group overflow-hidden relative border-emerald-500/10 dark:border-emerald-500/20">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                    <Target size={220} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-200 dark:border-emerald-800">Cifra de Supervivencia</span>
                    </div>
                    <h2 className="text-3xl font-black mt-6 leading-tight dark:text-white uppercase tracking-tighter">Tarifa <br/><span className="text-7xl text-emerald-600">Bottom-Up</span></h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-4 max-w-[320px] font-medium leading-relaxed">Lo mínimo absoluto para cubrir tu vida, ahorros y gastos de negocio libres de impuestos.</p>
                  </div>
                  <div className="mt-12 relative z-10">
                    <div className="text-9xl font-black tracking-tighter text-slate-800 dark:text-white flex items-baseline gap-2">
                      {result.bottomUpRate.toFixed(2)}<span className="text-3xl text-slate-400 font-light tracking-normal italic ml-2">€/h</span>
                    </div>
                    <div className="mt-8 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-[0.15em]">
                      <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                          <CheckCircle2 size={18} />
                      </div>
                      <span>Saldrás ganando {info.personalExpenses.savings}€ limpios/mes</span>
                    </div>
                  </div>
              </div>

              <div className="glass-card p-10 bg-blue-600/5 dark:bg-blue-600/10 border-blue-500/20 flex flex-col justify-between group overflow-hidden relative shadow-blue-500/10">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-1000">
                    <TrendingUp size={220} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-200 dark:border-blue-800">Objetivo Ambicioso</span>
                    </div>
                    <h2 className="text-3xl font-black mt-6 leading-tight dark:text-white uppercase tracking-tighter">Tarifa de <br/><span className="text-7xl text-blue-600 dark:text-blue-400">Mercado</span></h2>
                    <div className="mt-12 flex flex-col gap-3">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Facturación Bruta Anual Deseada</label>
                        <div className="relative max-w-xs">
                          <input 
                            type="number"
                            value={info.targetGross}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => setInfo({...info, targetGross: parseFloat(e.target.value)})}
                            className="bg-transparent text-6xl font-black outline-none border-b-2 border-slate-200 dark:border-slate-800 focus:border-blue-500 transition-all py-4 w-full pr-16 dark:text-white tracking-tighter"
                          />
                          <span className="absolute right-0 bottom-6 text-3xl font-black text-slate-300 dark:text-slate-700 italic">€</span>
                        </div>
                    </div>
                  </div>
                  <div className="mt-12 text-right relative z-10">
                    <div className="text-9xl font-black tracking-tighter text-blue-600 dark:text-blue-400 flex items-baseline justify-end gap-2 leading-none">
                      {result.topDownRate?.toFixed(2)}<span className="text-3xl text-blue-400/50 font-light tracking-normal italic ml-2">€/h</span>
                    </div>
                  </div>
              </div>
            </div>
            <div className="lg:col-span-12">
              <div className="glass-card p-10 flex flex-col items-center">
                  <h3 className="text-2xl font-black mb-10 dark:text-white uppercase tracking-tighter flex items-center gap-4 self-start">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shadow-sm border border-blue-500/5">
                        <ShieldCheck size={20} />
                    </div>
                    Distribución del Esfuerzo Anual
                  </h3>
                  <div className="w-full flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-grow w-full h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F033" />
                          <XAxis 
                            dataKey="name" 
                            stroke="#94A3B8" 
                            fontSize={11} 
                            axisLine={false} 
                            tickLine={false}
                            dy={10}
                          />
                          <YAxis hide />
                          <Tooltip 
                            cursor={{fill: isDark ? '#1e293b55' : '#f1f5f9'}} 
                            contentStyle={{ 
                              borderRadius: '24px', 
                              border: 'none', 
                              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', 
                              backgroundColor: isDark ? '#0f172a' : '#ffffff',
                              fontWeight: '900',
                              fontSize: '12px',
                              color: isDark ? '#fff' : '#000'
                            }}
                          />
                          <Bar dataKey="value" radius={[14, 14, 14, 14]} barSize={80}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="shrink-0 flex flex-col gap-6 p-8 rounded-[2rem] bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 min-w-[280px]">
                      {chartData.map((d) => (
                          <div key={d.name} className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}} />
                              <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">{d.name}</span>
                            </div>
                            <div className="text-2xl font-black dark:text-white pl-6">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(d.value)}
                            </div>
                          </div>
                      ))}
                    </div>
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
                  BORJAFELIXROJAS.COM
                </a>
              </div>
            )}
            <p className="text-slate-300 dark:text-slate-700 text-[10px] tracking-[0.6em] font-black uppercase">
              ESTRATEGIA · TECNOLOGÍA · DATOS · 2026
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
