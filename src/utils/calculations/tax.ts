/**
 * Indian Income Tax Calculator
 * Supports both Old and New regime with full deductions and surcharges
 */

export interface TaxParams {
  grossSalary: number;
  hra?: number;
  lta?: number;
  section80C?: number; // Max 150000
  section80D?: number; // Health insurance
  section80CCD1B?: number; // NPS - Max 50000 additional
  homeLoanInterest?: number;
  otherDeductions?: number;
  financialYear: "2024-25" | "2023-24";
  age: "below-60" | "60-80" | "above-80";
}

export interface TaxCalculationResult {
  grossSalary: number;
  deductions: {
    hra: number;
    lta: number;
    section80C: number;
    section80D: number;
    section80CCD1B: number;
    homeLoanInterest: number;
    other: number;
    standardDeduction: number;
  };
  taxableIncome: number;
  incomeTax: number;
  surcharge: number;
  healthEducationCess: number;
  totalTax: number;
  takeHome: number;
}

interface TaxSlab {
  min: number;
  max: number | null;
  rate: number;
}

interface TaxSlabConfig {
  slabs: TaxSlab[];
  standardDeduction: number;
  surchargeLimits: Array<{ income: number; rate: number }>;
}

// Tax slab configurations for different financial years
const TAX_SLABS: Record<"2024-25" | "2023-24", TaxSlabConfig> = {
  "2024-25": {
    standardDeduction: 75000,
    slabs: [
      { min: 0, max: 300000, rate: 0 },
      { min: 300000, max: 700000, rate: 5 },
      { min: 700000, max: 1000000, rate: 10 },
      { min: 1000000, max: 1200000, rate: 15 },
      { min: 1200000, max: 1500000, rate: 20 },
      { min: 1500000, max: null, rate: 30 },
    ],
    surchargeLimits: [
      { income: 5000000, rate: 10 },
      { income: 10000000, rate: 15 },
      { income: 20000000, rate: 25 },
      { income: Infinity, rate: 37 },
    ],
  },
  "2023-24": {
    standardDeduction: 50000,
    slabs: [
      { min: 0, max: 250000, rate: 0 },
      { min: 250000, max: 500000, rate: 5 },
      { min: 500000, max: 750000, rate: 10 },
      { min: 750000, max: 1000000, rate: 15 },
      { min: 1000000, max: 1200000, rate: 20 },
      { min: 1200000, max: 1500000, rate: 30 },
      { min: 1500000, max: null, rate: 30 },
    ],
    surchargeLimits: [
      { income: 5000000, rate: 10 },
      { income: 10000000, rate: 15 },
      { income: 20000000, rate: 25 },
      { income: Infinity, rate: 37 },
    ],
  },
};

/**
 * Calculate tax for old regime with all allowed deductions
 */
export function calculateOldRegimeTax(params: TaxParams): TaxCalculationResult {
  const config = TAX_SLABS[params.financialYear];

  // Calculate deductions
  const hra = params.hra || 0;
  const lta = params.lta || 0;
  const section80C = Math.min(params.section80C || 0, 150000);
  const section80D = params.section80D || 0;
  const section80CCD1B = Math.min(params.section80CCD1B || 0, 50000);
  const homeLoanInterest = params.homeLoanInterest || 0;
  const otherDeductions = params.otherDeductions || 0;
  const standardDeduction = config.standardDeduction;

  const totalDeductions =
    hra +
    lta +
    section80C +
    section80D +
    section80CCD1B +
    homeLoanInterest +
    otherDeductions +
    standardDeduction;

  const taxableIncome = Math.max(0, params.grossSalary - totalDeductions);

  // Calculate income tax based on slabs
  const { tax, surcharge, cess } = calculateTaxComponents(
    taxableIncome,
    params.age,
    config
  );

  return {
    grossSalary: params.grossSalary,
    deductions: {
      hra,
      lta,
      section80C,
      section80D,
      section80CCD1B,
      homeLoanInterest,
      other: otherDeductions,
      standardDeduction,
    },
    taxableIncome,
    incomeTax: tax,
    surcharge,
    healthEducationCess: cess,
    totalTax: tax + surcharge + cess,
    takeHome: params.grossSalary - (tax + surcharge + cess),
  };
}

/**
 * Calculate tax for new regime (no deductions except standard deduction)
 */
export function calculateNewRegimeTax(params: TaxParams): TaxCalculationResult {
  const config = TAX_SLABS[params.financialYear];

  // New regime: Only standard deduction is allowed
  const standardDeduction = config.standardDeduction;
  const taxableIncome = Math.max(0, params.grossSalary - standardDeduction);

  // Calculate income tax based on slabs
  const { tax, surcharge, cess } = calculateTaxComponents(
    taxableIncome,
    params.age,
    config
  );

  return {
    grossSalary: params.grossSalary,
    deductions: {
      hra: 0,
      lta: 0,
      section80C: 0,
      section80D: 0,
      section80CCD1B: 0,
      homeLoanInterest: 0,
      other: 0,
      standardDeduction,
    },
    taxableIncome,
    incomeTax: tax,
    surcharge,
    healthEducationCess: cess,
    totalTax: tax + surcharge + cess,
    takeHome: params.grossSalary - (tax + surcharge + cess),
  };
}

/**
 * Compare old and new regime and recommend the better option
 */
export function compareRegimes(
  params: TaxParams
): {
  oldRegime: TaxCalculationResult;
  newRegime: TaxCalculationResult;
  recommendation: "old" | "new";
  savings: number;
} {
  const oldRegime = calculateOldRegimeTax(params);
  const newRegime = calculateNewRegimeTax(params);

  const oldTakeHome = oldRegime.takeHome;
  const newTakeHome = newRegime.takeHome;

  return {
    oldRegime,
    newRegime,
    recommendation: oldTakeHome >= newTakeHome ? "old" : "new",
    savings: Math.abs(oldTakeHome - newTakeHome),
  };
}

/**
 * Calculate tax components: income tax, surcharge, and health education cess
 */
function calculateTaxComponents(
  taxableIncome: number,
  age: string,
  config: TaxSlabConfig
): { tax: number; surcharge: number; cess: number } {
  // Find applicable slab and calculate tax
  let tax = 0;
  const applicableSlabs = config.slabs.filter(
    (slab) => slab.min < taxableIncome
  );

  for (const slab of applicableSlabs) {
    const slabMin = slab.min;
    const slabMax = slab.max || taxableIncome;
    const slabIncome = Math.min(
      taxableIncome,
      slabMax
    ) - slabMin;

    if (slabIncome > 0) {
      tax += (slabIncome * slab.rate) / 100;
    }
  }

  tax = Math.round(tax * 100) / 100;

  // Calculate surcharge (applicable above certain income limits)
  let surcharge = 0;
  for (const limit of config.surchargeLimits) {
    if (taxableIncome > limit.income) {
      surcharge = (tax * limit.rate) / 100;
      break;
    }
  }

  surcharge = Math.round(surcharge * 100) / 100;

  // Health and Education Cess: 4% on (income tax + surcharge)
  const cess = Math.round(((tax + surcharge) * 4) / 100 * 100) / 100;

  return { tax, surcharge, cess };
}

/**
 * Calculate effective tax rate
 */
export function calculateEffectiveTaxRate(params: TaxParams): {
  oldRegime: number;
  newRegime: number;
} {
  const oldRegime = calculateOldRegimeTax(params);
  const newRegime = calculateNewRegimeTax(params);

  return {
    oldRegime: Math.round(
      (oldRegime.totalTax / params.grossSalary) * 100 * 100
    ) / 100,
    newRegime: Math.round(
      (newRegime.totalTax / params.grossSalary) * 100 * 100
    ) / 100,
  };
}

/**
 * Calculate tax rebate under Section 87A (if applicable)
 */
export function calculateSection87ARebate(
  taxableIncome: number,
  financialYear: "2024-25" | "2023-24"
): number {
  const rebateLimits: Record<"2024-25" | "2023-24", number> = {
    "2024-25": 700000, // Up to 7L in FY 2024-25
    "2023-24": 500000, // Up to 5L in FY 2023-24
  };

  const limit = rebateLimits[financialYear];

  if (taxableIncome <= limit) {
    // Full tax is rebated if income is within the limit
    return 0;
  }

  return 0; // No additional rebate beyond the slab structure
}

/**
 * Get deduction limits for the given financial year
 */
export function getDeductionLimits(
  financialYear: "2024-25" | "2023-24"
): Record<string, number> {
  return {
    section80C: 150000,
    section80D: financialYear === "2024-25" ? 100000 : 50000,
    section80CCD1B: 50000,
    section80CCD2: 150000,
    standardDeduction: TAX_SLABS[financialYear].standardDeduction,
  };
}
