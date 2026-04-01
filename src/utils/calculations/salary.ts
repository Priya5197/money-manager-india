/**
 * Salary Analysis and Prediction
 * Uses CAGR and linear regression for forecasting
 */

export interface SalaryHistory {
  year: number;
  salary: number;
}

export interface SalaryGrowthAnalysis {
  year: number;
  salary: number;
  growthRate: number; // Year-over-year percentage
}

export interface SalaryPrediction {
  year: number;
  baseCase: number;
  bestCase: number;
  conservative: number;
}

export interface SalaryProjection {
  predictions: SalaryPrediction[];
  cagr: number;
  averageGrowthRate: number;
  assumptions: {
    method: "cagr-based" | "regression-based";
    baselineCAGR: number;
    conservativeReduce: number;
    aggressiveIncrease: number;
    dataPoints: number;
    timeSpan: number;
  };
}

/**
 * Analyze salary growth year-over-year
 */
export function analyzeSalaryGrowth(
  history: SalaryHistory[]
): SalaryGrowthAnalysis[] {
  if (history.length === 0) return [];

  // Sort by year
  const sorted = [...history].sort((a, b) => a.year - b.year);

  return sorted.map((item, index) => ({
    ...item,
    growthRate:
      index === 0
        ? 0
        : ((item.salary - sorted[index - 1].salary) /
            sorted[index - 1].salary) *
          100,
  }));
}

/**
 * Calculate Compound Annual Growth Rate (CAGR)
 * Formula: CAGR = (EndValue / StartValue)^(1/Years) - 1
 */
export function calculateCAGR(
  startValue: number,
  endValue: number,
  years: number
): number {
  if (startValue <= 0 || years <= 0) {
    return 0;
  }

  const cagr = Math.pow(endValue / startValue, 1 / years) - 1;
  return Math.round(cagr * 100 * 100) / 100; // As percentage
}

/**
 * Simple Linear Regression
 * Returns slope (m) and intercept (b) for y = mx + b
 */
function linearRegression(
  data: Array<[number, number]>
): { slope: number; intercept: number; r2: number } {
  const n = data.length;

  if (n < 2) {
    return { slope: 0, intercept: data[0]?.[1] || 0, r2: 0 };
  }

  // Calculate means
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (const [x, y] of data) {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
    sumY2 += y * y;
  }

  const meanX = sumX / n;
  const meanY = sumY / n;

  // Calculate slope and intercept
  const numerator = n * sumXY - sumX * sumY;
  const denominator = n * sumX2 - sumX * sumX;

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = meanY - slope * meanX;

  // Calculate R-squared (coefficient of determination)
  const ssRes = data.reduce(
    (sum, [x, y]) => sum + Math.pow(y - (slope * x + intercept), 2),
    0
  );
  const ssTot = data.reduce((sum, [, y]) => sum + Math.pow(y - meanY, 2), 0);
  const r2 = ssTot !== 0 ? 1 - ssRes / ssTot : 0;

  return { slope, intercept, r2: Math.max(0, Math.min(1, r2)) };
}

/**
 * Predict future salary using multiple methods
 */
export function predictSalary(
  history: SalaryHistory[],
  yearsToPredict: number = 5
): SalaryProjection {
  if (history.length === 0) {
    throw new Error("No salary history provided");
  }

  const sorted = [...history].sort((a, b) => a.year - b.year);
  const dataPoints = sorted.length;

  // Get current year (last year in history)
  const currentYear = sorted[sorted.length - 1].year;
  const currentSalary = sorted[sorted.length - 1].salary;

  // Calculate CAGR
  const startYear = sorted[0].year;
  const startSalary = sorted[0].salary;
  const yearsSpan = currentYear - startYear;
  const cagr = calculateCAGR(startSalary, currentSalary, yearsSpan) / 100;

  // Prepare data for regression (use array index as x to avoid large numbers)
  const regressionData: Array<[number, number]> = sorted.map((item, index) => [
    index,
    item.salary,
  ]);
  const regression = linearRegression(regressionData);

  // Calculate average YoY growth rate
  const growthAnalysis = analyzeSalaryGrowth(sorted);
  const growthRates = growthAnalysis.slice(1).map((item) => item.growthRate);
  const averageGrowthRate =
    growthRates.length > 0
      ? growthRates.reduce((a, b) => a + b, 0) / growthRates.length
      : cagr * 100;

  // Generate predictions
  const predictions: SalaryPrediction[] = [];

  for (let i = 1; i <= yearsToPredict; i++) {
    const forecastYear = currentYear + i;

    // Base case: use average of CAGR and YoY growth
    const avgGrowth = (cagr + averageGrowthRate / 100) / 2;
    const baseCase = Math.round(currentSalary * Math.pow(1 + avgGrowth, i));

    // Best case: slightly higher growth (1.5x of base)
    const bestCaseGrowth = avgGrowth * 1.5;
    const bestCase = Math.round(
      currentSalary * Math.pow(1 + bestCaseGrowth, i)
    );

    // Conservative case: 50% of base growth
    const conservativeGrowth = avgGrowth * 0.5;
    const conservative = Math.round(
      currentSalary * Math.pow(1 + conservativeGrowth, i)
    );

    predictions.push({
      year: forecastYear,
      baseCase,
      bestCase,
      conservative,
    });
  }

  return {
    predictions,
    cagr: Math.round(cagr * 100 * 100) / 100,
    averageGrowthRate: Math.round(averageGrowthRate * 100) / 100,
    assumptions: {
      method: cagr > 0 ? "cagr-based" : "regression-based",
      baselineCAGR: Math.round(cagr * 100 * 100) / 100,
      conservativeReduce: 50, // Reduce to 50% of growth rate
      aggressiveIncrease: 150, // Increase to 150% of growth rate
      dataPoints,
      timeSpan: yearsSpan,
    },
  };
}

/**
 * Calculate salary growth consistency score (0-100)
 * Higher score means more consistent growth
 */
export function calculateGrowthConsistency(
  history: SalaryHistory[]
): number {
  if (history.length < 2) return 0;

  const sorted = [...history].sort((a, b) => a.year - b.year);
  const growthAnalysis = analyzeSalaryGrowth(sorted);
  const growthRates = growthAnalysis.slice(1).map((item) => item.growthRate);

  if (growthRates.length === 0) return 0;

  // Calculate coefficient of variation
  const meanGrowth = growthRates.reduce((a, b) => a + b, 0) / growthRates.length;
  const variance =
    growthRates.reduce((sum, rate) => sum + Math.pow(rate - meanGrowth, 2), 0) /
    growthRates.length;
  const stdDev = Math.sqrt(variance);

  // Convert to consistency score (0-100)
  // Lower std dev = higher consistency
  const cv = meanGrowth !== 0 ? stdDev / Math.abs(meanGrowth) : stdDev;
  const consistency = Math.max(0, 100 - cv * 100);

  return Math.round(consistency * 100) / 100;
}

/**
 * Calculate salary percentiles based on age and experience
 */
export function analyzeSalaryGrowthPattern(
  history: SalaryHistory[]
): {
  pattern: "steady" | "accelerating" | "decelerating" | "fluctuating";
  description: string;
  confidence: number;
} {
  if (history.length < 3) {
    return {
      pattern: "steady",
      description: "Insufficient data",
      confidence: 0,
    };
  }

  const sorted = [...history].sort((a, b) => a.year - b.year);
  const growthAnalysis = analyzeSalaryGrowth(sorted);
  const growthRates = growthAnalysis.slice(1).map((item) => item.growthRate);

  if (growthRates.length < 2) {
    return {
      pattern: "steady",
      description: "Only one growth data point",
      confidence: 25,
    };
  }

  // Calculate second derivative to detect acceleration
  const secondDerivatives = [];
  for (let i = 1; i < growthRates.length; i++) {
    secondDerivatives.push(growthRates[i] - growthRates[i - 1]);
  }

  const avgSecondDerivative =
    secondDerivatives.reduce((a, b) => a + b, 0) /
    secondDerivatives.length;
  const growthVariance =
    growthRates.reduce((a, b) => a + b, 0) / growthRates.length;

  let pattern: "steady" | "accelerating" | "decelerating" | "fluctuating";
  let description = "";

  if (Math.abs(avgSecondDerivative) < 1) {
    pattern = "steady";
    description = "Consistent growth rate over time";
  } else if (avgSecondDerivative > 1) {
    pattern = "accelerating";
    description = "Growth rate is increasing over time";
  } else if (avgSecondDerivative < -1) {
    pattern = "decelerating";
    description = "Growth rate is slowing down over time";
  } else {
    pattern = "fluctuating";
    description = "Growth rate varies significantly";
  }

  const consistency = calculateGrowthConsistency(sorted);
  const confidence = Math.round((consistency / 100) * 100);

  return { pattern, description, confidence };
}

/**
 * Project lifetime earnings
 */
export function projectLifetimeEarnings(
  history: SalaryHistory[],
  retirementAge: number = 60
): {
  totalEarnings: number;
  averageAnnualSalary: number;
  yearsToRetirement: number;
} {
  if (history.length === 0) {
    return { totalEarnings: 0, averageAnnualSalary: 0, yearsToRetirement: 0 };
  }

  const sorted = [...history].sort((a, b) => a.year - b.year);
  const currentYear = sorted[sorted.length - 1].year;
  const currentSalary = sorted[sorted.length - 1].salary;

  const yearsToRetirement = Math.max(0, retirementAge - currentYear);

  // Use average growth rate to project
  const projection = predictSalary(history, yearsToRetirement);
  const avgGrowth = projection.averageGrowthRate / 100;

  let totalEarnings = 0;
  for (let i = 0; i <= yearsToRetirement; i++) {
    totalEarnings += Math.round(currentSalary * Math.pow(1 + avgGrowth, i));
  }

  const averageAnnualSalary =
    yearsToRetirement > 0 ? totalEarnings / (yearsToRetirement + 1) : currentSalary;

  return {
    totalEarnings,
    averageAnnualSalary: Math.round(averageAnnualSalary),
    yearsToRetirement,
  };
}
