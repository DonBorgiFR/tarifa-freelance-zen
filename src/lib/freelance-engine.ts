export interface FreelanceInfo {
  personalExpenses: {
    rent: number;
    utilities: number;
    food: number;
    transport: number;
    leisure: number;
    savings: number;
    other: number;
  };
  businessExpenses: {
    autonomoFee: number;
    software: number;
    advisor: number;
    other: number;
  };
  taxation: {
    irpfRate: number; // e.g., 0.20 for 20%
  };
  workingTime: {
    vacationWeeks: number;
    holidaysDays: number;
    sickDays: number;
    dailyHours: number;
    billablePercent: number; // e.g., 0.75 for 75%
  };
  targetGross?: number; // For Top-Down
}

export interface FreelanceResult {
  annualBillableHours: number;
  monthlyPersonalNet: number;
  annualPersonalNet: number;
  monthlyBusinessExpenses: number;
  annualBusinessExpenses: number;
  requiredAnnualGross: number;
  bottomUpRate: number;
  topDownRate?: number;
  suggestedRate: number;
  // Nuevas métricas
  breakEvenMonthly: number;
  safetyMargin: number; // Porcentaje de seguridad
  runwayMonths: number; // Meses de vida con ahorros
  monthlyTaxRetention: number;
  profitMargin: number;
  chartBreakdown: {
    name: string;
    value: number;
    color: string;
  }[];
}

export function calculateFreelanceRates(info: FreelanceInfo): FreelanceResult {
  // 1. Working Time Calculation
  const weeksYear = 52;
  const workingWeeks = weeksYear - info.workingTime.vacationWeeks;
  const workingDays = (workingWeeks * 5) - info.workingTime.holidaysDays - info.workingTime.sickDays;
  const dailyBillableHours = info.workingTime.dailyHours * info.workingTime.billablePercent;
  const annualBillableHours = workingDays * dailyBillableHours;

  // 2. Personal Expenses
  const p = info.personalExpenses;
  const monthlyPersonalNet = p.rent + p.utilities + p.food + p.transport + p.leisure + p.savings + p.other;
  const annualPersonalNet = monthlyPersonalNet * 12;

  // 3. Business Expenses
  const b = info.businessExpenses;
  const monthlyBusinessExpenses = b.autonomoFee + b.software + b.advisor + b.other;
  const annualBusinessExpenses = monthlyBusinessExpenses * 12;

  // 4. Bottom-Up Calculation (The "Minimum" for your life)
  const requiredAnnualGross = (annualPersonalNet / (1 - info.taxation.irpfRate)) + annualBusinessExpenses;
  const bottomUpRate = requiredAnnualGross / annualBillableHours;

  // 5. Top-Down Calculation (Aspirational)
  let topDownRate = undefined;
  if (info.targetGross && info.targetGross > 0) {
    topDownRate = info.targetGross / annualBillableHours;
  }

  // 6. Final Suggested Rate
  const suggestedRate = topDownRate ? (bottomUpRate * 0.4 + topDownRate * 0.6) : bottomUpRate;

  // 7. Advanced Metrics
  const breakEvenMonthly = requiredAnnualGross / 12;
  const currentTotalMonthly = (suggestedRate * annualBillableHours) / 12;
  
  // El margen de seguridad debe medir cuánto superamos el mínimo vital (bottom-up)
  // No debe elevarse "locamente" si subimos la aspiración, sino reflejar la salud real.
  const safetyMargin = ((suggestedRate - bottomUpRate) / bottomUpRate) * 100;
  
  // Asumiendo que el ahorro personal es parte del "neto", 
  // el runway se calcula sobre ese ahorro acumulado proyectado vs gastos fijos.
  const monthlyFixedCosts = (annualBusinessExpenses / 12) + p.rent + p.utilities + p.food;
  const annualProjectedSavings = p.savings * 12;
  const runwayMonths = annualProjectedSavings / monthlyFixedCosts;
  
  const monthlyTaxRetention = (currentTotalMonthly * info.taxation.irpfRate);
  const profitMargin = ((currentTotalMonthly - breakEvenMonthly) / currentTotalMonthly) * 100;

  // Chart Breakdown for more utility
  const chartBreakdown = [
    { name: 'Vida', value: annualPersonalNet - (p.savings * 12), color: '#3b82f6' },
    { name: 'IRPF', value: requiredAnnualGross - annualPersonalNet - annualBusinessExpenses, color: '#f59e0b' },
    { name: 'Negocio', value: annualBusinessExpenses, color: '#6366f1' },
    { name: 'Ahorro', value: p.savings * 12, color: '#10b981' },
    { name: 'Seguridad', value: Math.max(0, (suggestedRate * annualBillableHours) - requiredAnnualGross), color: '#8b5cf6' }
  ];

  return {
    annualBillableHours,
    monthlyPersonalNet,
    annualPersonalNet,
    monthlyBusinessExpenses,
    annualBusinessExpenses,
    requiredAnnualGross,
    bottomUpRate,
    topDownRate,
    suggestedRate,
    breakEvenMonthly,
    safetyMargin,
    runwayMonths,
    monthlyTaxRetention,
    profitMargin,
    chartBreakdown
  };
}
