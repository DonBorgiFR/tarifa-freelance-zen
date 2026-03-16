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
  // Annual_Gross = (Annual_Personal_Net / (1 - IRPF)) + Annual_Business_Expenses
  const requiredAnnualGross = (annualPersonalNet / (1 - info.taxation.irpfRate)) + annualBusinessExpenses;
  const bottomUpRate = requiredAnnualGross / annualBillableHours;

  // 5. Top-Down Calculation (Aspirational)
  let topDownRate = undefined;
  if (info.targetGross && info.targetGross > 0) {
    topDownRate = info.targetGross / annualBillableHours;
  }

  // 6. Final Suggested Rate
  const suggestedRate = topDownRate ? (bottomUpRate + topDownRate) / 2 : bottomUpRate;

  return {
    annualBillableHours,
    monthlyPersonalNet,
    annualPersonalNet,
    monthlyBusinessExpenses,
    annualBusinessExpenses,
    requiredAnnualGross,
    bottomUpRate,
    topDownRate,
    suggestedRate
  };
}
