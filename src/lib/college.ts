// Inputs for the 529 College Savings Calculator, persisted per household.

export interface CollegeInputs {
  monthlyContribution: number;
  initialDeposit: number;
  expectedReturn: number;
  years: number;
}

export const COLLEGE_DEFAULTS: CollegeInputs = {
  monthlyContribution: 250,
  initialDeposit: 0,
  expectedReturn: 7,
  years: 18,
};

export function collegeInputsFromRow(
  row: Record<string, unknown> | null | undefined
): CollegeInputs {
  if (!row) return COLLEGE_DEFAULTS;
  return {
    monthlyContribution: Number(row.monthly_contribution ?? COLLEGE_DEFAULTS.monthlyContribution),
    initialDeposit: Number(row.initial_deposit ?? COLLEGE_DEFAULTS.initialDeposit),
    expectedReturn: Number(row.expected_return ?? COLLEGE_DEFAULTS.expectedReturn),
    years: Number(row.years ?? COLLEGE_DEFAULTS.years),
  };
}

export function rowFromCollegeInputs(i: CollegeInputs): Record<string, unknown> {
  return {
    monthly_contribution: i.monthlyContribution,
    initial_deposit: i.initialDeposit,
    expected_return: i.expectedReturn,
    years: i.years,
  };
}
