/**
 * Indian Tax Slab Configuration
 * Supports multiple financial years with full slab and surcharge data
 */

export interface TaxSlab {
  min: number;
  max: number | null;
  rate: number;
}

export interface SurchargeLimit {
  income: number;
  rate: number;
}

export interface TaxSlabConfig {
  financialYear: string;
  regime: "old" | "new";
  standardDeduction: number;
  slabs: TaxSlab[];
  surchargeLimits: SurchargeLimit[];
  cessRate: number; // Health and Education Cess
  deductionLimits: {
    section80C: number;
    section80D: number;
    section80CCD1B: number;
    section80CCD2: number;
  };
  rebateLimits?: {
    section87A: number; // For new regime
  };
}

export const TAX_SLAB_CONFIGS: Record<string, TaxSlabConfig[]> = {
  "2024-25": [
    // Old Regime - FY 2024-25
    {
      financialYear: "2024-25",
      regime: "old",
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
      cessRate: 4,
      deductionLimits: {
        section80C: 150000,
        section80D: 100000,
        section80CCD1B: 50000,
        section80CCD2: 150000,
      },
    },
    // New Regime - FY 2024-25
    {
      financialYear: "2024-25",
      regime: "new",
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
      cessRate: 4,
      deductionLimits: {
        section80C: 0, // No 80C in new regime
        section80D: 0, // No 80D in new regime
        section80CCD1B: 0, // No NPS deduction in new regime
        section80CCD2: 0,
      },
      rebateLimits: {
        section87A: 700000, // Rebate up to 7L income
      },
    },
  ],
  "2023-24": [
    // Old Regime - FY 2023-24
    {
      financialYear: "2023-24",
      regime: "old",
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
      cessRate: 4,
      deductionLimits: {
        section80C: 150000,
        section80D: 50000,
        section80CCD1B: 50000,
        section80CCD2: 150000,
      },
    },
    // New Regime - FY 2023-24
    {
      financialYear: "2023-24",
      regime: "new",
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
      cessRate: 4,
      deductionLimits: {
        section80C: 0,
        section80D: 0,
        section80CCD1B: 0,
        section80CCD2: 0,
      },
      rebateLimits: {
        section87A: 500000, // Rebate up to 5L income
      },
    },
  ],
  "2022-23": [
    // Old Regime - FY 2022-23
    {
      financialYear: "2022-23",
      regime: "old",
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
      cessRate: 4,
      deductionLimits: {
        section80C: 150000,
        section80D: 25000,
        section80CCD1B: 50000,
        section80CCD2: 150000,
      },
    },
    // New Regime - FY 2022-23
    {
      financialYear: "2022-23",
      regime: "new",
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
      cessRate: 4,
      deductionLimits: {
        section80C: 0,
        section80D: 0,
        section80CCD1B: 0,
        section80CCD2: 0,
      },
      rebateLimits: {
        section87A: 500000,
      },
    },
  ],
};

/**
 * Get tax slab config for a specific financial year and regime
 */
export function getTaxSlabConfig(
  financialYear: string,
  regime: "old" | "new"
): TaxSlabConfig | null {
  const configs = TAX_SLAB_CONFIGS[financialYear];
  if (!configs) {
    return null;
  }
  return configs.find((config) => config.regime === regime) || null;
}

/**
 * Get all available financial years
 */
export function getAvailableFinancialYears(): string[] {
  return Object.keys(TAX_SLAB_CONFIGS).sort().reverse();
}

/**
 * Get latest financial year
 */
export function getLatestFinancialYear(): string {
  return getAvailableFinancialYears()[0];
}

/**
 * Get tax rate for a given income and slab config
 */
export function getTaxRateForIncome(
  income: number,
  slabs: TaxSlab[]
): number {
  for (const slab of slabs) {
    if (income >= slab.min && (slab.max === null || income < slab.max)) {
      return slab.rate;
    }
  }
  return 30; // Default to highest rate
}

/**
 * Calculate surcharge rate for given income
 */
export function getSurchargeRate(
  income: number,
  surchargeLimits: SurchargeLimit[]
): number {
  let surchargeRate = 0;
  for (const limit of surchargeLimits) {
    if (income > limit.income) {
      surchargeRate = limit.rate;
    }
  }
  return surchargeRate;
}

/**
 * Get deduction limits for a financial year and regime
 */
export function getDeductionLimits(
  financialYear: string,
  regime: "old" | "new"
): Record<string, number> | null {
  const config = getTaxSlabConfig(financialYear, regime);
  if (!config) {
    return null;
  }
  return config.deductionLimits;
}

/**
 * Check if Section 80D benefit is available
 */
export function isSection80DAvailable(
  financialYear: string,
  regime: "old" | "new",
  age: "below-60" | "60-80" | "above-80"
): boolean {
  const limits = getDeductionLimits(financialYear, regime);
  if (!limits || limits.section80D === 0) {
    return false;
  }

  // In old regime, 80D is available for all ages
  if (regime === "old") {
    return true;
  }

  // In new regime, no deductions allowed
  return false;
}

/**
 * Compare tax brackets between regimes
 */
export function compareTaxBrackets(
  financialYear: string
): {
  oldRegime: TaxSlab[];
  newRegime: TaxSlab[];
} {
  const oldConfig = getTaxSlabConfig(financialYear, "old");
  const newConfig = getTaxSlabConfig(financialYear, "new");

  return {
    oldRegime: oldConfig?.slabs || [],
    newRegime: newConfig?.slabs || [],
  };
}

/**
 * Find applicable bracket for income
 */
export function findApplicableBracket(
  income: number,
  slabs: TaxSlab[]
): TaxSlab | null {
  return (
    slabs.find(
      (slab) => income >= slab.min && (slab.max === null || income < slab.max)
    ) || null
  );
}
