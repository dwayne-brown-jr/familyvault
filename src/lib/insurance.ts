// Single source of truth for the insurance gap calculation, shared by the
// Insurance Gap page and the Dashboard so they never disagree.

export interface InsuranceInputs {
  annualSalary: number;
  yearsUntilChildIndependent: number;
  numberOfChildren: number;
  monthlyExpenses: number;
  supplementalCoverage: number;
  spouseCoverage: number;
}

export const INSURANCE_DEFAULTS: InsuranceInputs = {
  annualSalary: 75000,
  yearsUntilChildIndependent: 22,
  numberOfChildren: 1,
  monthlyExpenses: 10000,
  supplementalCoverage: 0,
  spouseCoverage: 0,
};

// Employer life benefit as a multiple of salary (e.g. 2x salary).
export const EMPLOYER_MULTIPLIER = 2;

export function computeInsurance(i: InsuranceInputs) {
  const employerCoverage = i.annualSalary * EMPLOYER_MULTIPLIER;
  const currentCoverage = employerCoverage + i.supplementalCoverage + i.spouseCoverage;

  const incomeReplacement = i.annualSalary * i.yearsUntilChildIndependent;
  const debtPayoff = 15000;
  const collegeFunding = 250000 * i.numberOfChildren;
  const emergencyFund = i.monthlyExpenses * 12;
  const funeralCosts = 20000;
  const recommendedTotal =
    incomeReplacement + debtPayoff + collegeFunding + emergencyFund + funeralCosts;

  const gap = recommendedTotal - currentCoverage;
  const coveragePercent =
    recommendedTotal > 0 ? Math.min((currentCoverage / recommendedTotal) * 100, 100) : 0;

  return {
    employerCoverage,
    currentCoverage,
    incomeReplacement,
    debtPayoff,
    collegeFunding,
    emergencyFund,
    funeralCosts,
    recommendedTotal,
    gap,
    coveragePercent,
  };
}

// Maps typed inputs back to insurance_calculator columns.
export function rowFromInputs(i: InsuranceInputs): Record<string, unknown> {
  return {
    annual_salary: i.annualSalary,
    years_until_child_independent: i.yearsUntilChildIndependent,
    number_of_children: i.numberOfChildren,
    monthly_expenses: i.monthlyExpenses,
    supplemental_coverage: i.supplementalCoverage,
    spouse_coverage: i.spouseCoverage,
  };
}

// Maps a raw insurance_calculator DB row to typed inputs (with defaults).
export function inputsFromRow(row: Record<string, unknown> | null | undefined): InsuranceInputs {
  if (!row) return INSURANCE_DEFAULTS;
  return {
    annualSalary: Number(row.annual_salary ?? INSURANCE_DEFAULTS.annualSalary),
    yearsUntilChildIndependent: Number(
      row.years_until_child_independent ?? INSURANCE_DEFAULTS.yearsUntilChildIndependent
    ),
    numberOfChildren: Number(row.number_of_children ?? INSURANCE_DEFAULTS.numberOfChildren),
    monthlyExpenses: Number(row.monthly_expenses ?? INSURANCE_DEFAULTS.monthlyExpenses),
    supplementalCoverage: Number(row.supplemental_coverage ?? INSURANCE_DEFAULTS.supplementalCoverage),
    spouseCoverage: Number(row.spouse_coverage ?? INSURANCE_DEFAULTS.spouseCoverage),
  };
}
