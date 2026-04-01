/**
 * EMI Calculator for Money Manager India
 * All calculations follow standard financial mathematics
 */

export interface EMICalculationResult {
  emi: number;
  totalRepayment: number;
  totalInterest: number;
  monthlyBreakdown: EMIMonthDetail[];
}

export interface EMIMonthDetail {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
  prepayment?: number;
}

export interface LoanOffer {
  name: string;
  principal: number;
  rate: number;
  tenureMonths: number;
  processingFee?: number;
  insurance?: number;
}

export interface LoanComparison {
  offer: LoanOffer;
  emi: number;
  totalInterest: number;
  totalRepayment: number;
  effectiveRate: number;
}

export interface CibilRateConfig {
  scoreRange: [number, number];
  rate: number;
  loanTypes: {
    personal: number;
    home: number;
    auto: number;
  };
}

/**
 * Calculate EMI using standard formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
 * @param principal - Loan amount in INR
 * @param annualRate - Annual interest rate (percentage)
 * @param tenureMonths - Loan tenure in months
 * @returns Monthly EMI amount in INR
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  if (principal <= 0 || annualRate < 0 || tenureMonths <= 0) {
    throw new Error("Invalid loan parameters");
  }

  // Convert annual rate to monthly rate (percentage to decimal)
  const monthlyRate = annualRate / 100 / 12;

  // Handle 0% interest
  if (monthlyRate === 0) {
    return principal / tenureMonths;
  }

  // EMI = P * r * (1+r)^n / ((1+r)^n - 1)
  const powerFactor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * powerFactor) / (powerFactor - 1);

  return Math.round(emi * 100) / 100; // Round to 2 decimals
}

/**
 * Calculate total interest paid over loan tenure
 */
export function calculateTotalInterest(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const totalRepayment = emi * tenureMonths;
  return Math.round((totalRepayment - principal) * 100) / 100;
}

/**
 * Calculate total repayment including fees and insurance
 */
export function calculateTotalRepayment(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  processingFee: number = 0,
  insurance: number = 0
): number {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const totalEMI = emi * tenureMonths;

  // Processing fee is usually charged upfront
  const totalWithFees = totalEMI + processingFee + insurance;

  return Math.round(totalWithFees * 100) / 100;
}

/**
 * Generate full amortization schedule with optional prepayments
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  prepayments: Map<number, number> = new Map()
): EMIMonthDetail[] {
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const monthlyRate = annualRate / 100 / 12;

  const schedule: EMIMonthDetail[] = [];
  let remainingBalance = principal;

  for (let month = 1; month <= tenureMonths && remainingBalance > 0; month++) {
    // Calculate interest on remaining balance
    const interestPayment = Math.round(remainingBalance * monthlyRate * 100) / 100;

    // Calculate principal component
    const principalPayment = Math.min(
      Math.round((emi - interestPayment) * 100) / 100,
      remainingBalance
    );

    // Handle prepayment if any
    const prepayment = prepayments.get(month) || 0;
    const totalPayment = principalPayment + prepayment;

    // Update balance
    remainingBalance = Math.max(
      0,
      Math.round((remainingBalance - totalPayment) * 100) / 100
    );

    schedule.push({
      month,
      emi: emi + prepayment,
      principal: totalPayment,
      interest: interestPayment,
      balance: remainingBalance,
      prepayment: prepayment > 0 ? prepayment : undefined,
    });

    // If prepayment exhausts the loan, break
    if (remainingBalance === 0) {
      break;
    }
  }

  return schedule;
}

/**
 * Compare multiple loan offers and return sorted results
 */
export function compareLoanOffers(offers: LoanOffer[]): LoanComparison[] {
  return offers
    .map((offer) => {
      const emi = calculateEMI(
        offer.principal,
        offer.rate,
        offer.tenureMonths
      );
      const totalInterest = calculateTotalInterest(
        offer.principal,
        offer.rate,
        offer.tenureMonths
      );
      const totalRepayment = calculateTotalRepayment(
        offer.principal,
        offer.rate,
        offer.tenureMonths,
        offer.processingFee,
        offer.insurance
      );

      // Calculate effective annual rate considering fees and insurance
      const totalFees = (offer.processingFee || 0) + (offer.insurance || 0);
      const effectiveRate =
        ((totalRepayment - offer.principal) / offer.principal / offer.tenureMonths) *
        12 *
        100;

      return {
        offer,
        emi,
        totalInterest,
        totalRepayment,
        effectiveRate: Math.round(effectiveRate * 100) / 100,
      };
    })
    .sort((a, b) => a.emi - b.emi);
}

/**
 * Estimate interest rate based on CIBIL score and loan type
 */
export function estimateRateByScore(
  cibilScore: number,
  loanType: "personal" | "home" | "auto" = "personal"
): number {
  const rateConfigs: CibilRateConfig[] = [
    {
      scoreRange: [750, 900],
      rate: 8.5,
      loanTypes: { personal: 8.5, home: 6.5, auto: 7.5 },
    },
    {
      scoreRange: [700, 749],
      rate: 10.5,
      loanTypes: { personal: 10.5, home: 7.5, auto: 8.5 },
    },
    {
      scoreRange: [650, 699],
      rate: 12.5,
      loanTypes: { personal: 12.5, home: 8.5, auto: 10.5 },
    },
    {
      scoreRange: [600, 649],
      rate: 15.0,
      loanTypes: { personal: 15.0, home: 10.0, auto: 12.5 },
    },
    {
      scoreRange: [0, 599],
      rate: 18.0,
      loanTypes: { personal: 18.0, home: 12.0, auto: 15.0 },
    },
  ];

  const config = rateConfigs.find(
    (cfg) =>
      cibilScore >= cfg.scoreRange[0] && cibilScore <= cfg.scoreRange[1]
  );

  if (!config) {
    return 15.0; // Default rate
  }

  return config.loanTypes[loanType];
}

/**
 * Calculate loan tenure based on EMI affordability
 */
export function calculateTenureByEMI(
  principal: number,
  annualRate: number,
  maxMonthlyEMI: number
): number | null {
  if (maxMonthlyEMI <= 0 || principal <= 0 || annualRate < 0) {
    return null;
  }

  // Use binary search to find appropriate tenure
  let minTenure = 1;
  let maxTenure = 360; // 30 years max

  while (minTenure <= maxTenure) {
    const midTenure = Math.floor((minTenure + maxTenure) / 2);
    const emi = calculateEMI(principal, annualRate, midTenure);

    if (Math.abs(emi - maxMonthlyEMI) < 1) {
      return midTenure;
    }

    if (emi > maxMonthlyEMI) {
      minTenure = midTenure + 1;
    } else {
      maxTenure = midTenure - 1;
    }
  }

  const tenure = Math.ceil((minTenure + maxTenure) / 2);
  return tenure <= 360 ? tenure : null;
}

/**
 * Calculate loan affordability based on income
 * Typically: EMI should not exceed 50% of monthly income
 */
export function calculateLoanAffordability(
  monthlyIncome: number,
  annualRate: number,
  maxEMIPercent: number = 50
): { maxPrincipal: number; maxTenureMonths: number } {
  const maxEMI = (monthlyIncome * maxEMIPercent) / 100;

  // For 12-month tenure, find max principal
  const maxPrincipal = (maxEMI * 12) / (1 + (annualRate / 100) * (12 / 24));

  return {
    maxPrincipal: Math.floor(maxPrincipal),
    maxTenureMonths: 240, // Default to 20 years
  };
}
