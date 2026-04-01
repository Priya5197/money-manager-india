/**
 * Savings Analysis and Guidance
 * Detects spending patterns and generates actionable insights
 */

export interface Transaction {
  id: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
  type: "expense" | "income";
}

export interface Budget {
  category: string;
  limit: number;
  period: "monthly" | "yearly";
}

export interface SpendingPattern {
  category: string;
  totalSpend: number;
  budgetLimit: number;
  percentageOfBudget: number;
  isExceeded: boolean;
  amount: number; // How much under/over budget
}

export interface SavingsInsight {
  type:
    | "budget-exceeded"
    | "high-discretionary"
    | "savings-opportunity"
    | "positive-trend";
  category: string;
  message: string;
  amount: number;
  suggestion: string;
  projectedYearlySaving: number;
  priority: "high" | "medium" | "low";
}

export interface SavingsProjectionResult {
  mode: "pure_saving" | "fd" | "sip";
  monthlyAmount: number;
  years: number;
  futureValue: number;
  totalContribution: number;
  interest: number;
  rate: number;
  disclaimer: string;
}

/**
 * Detect spending patterns compared to budgets
 */
export function detectSpendingPatterns(
  transactions: Transaction[],
  budgets: Budget[]
): SpendingPattern[] {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Filter transactions for current month
  const monthlyTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return (
      txDate.getMonth() + 1 === currentMonth &&
      txDate.getFullYear() === currentYear &&
      tx.type === "expense"
    );
  });

  // Group spending by category
  const categorySpending: Record<string, number> = {};
  for (const tx of monthlyTransactions) {
    categorySpending[tx.category] =
      (categorySpending[tx.category] || 0) + tx.amount;
  }

  // Compare with budgets
  const patterns: SpendingPattern[] = [];

  for (const budget of budgets) {
    const spent = categorySpending[budget.category] || 0;
    const percentage = (spent / budget.limit) * 100;
    const isExceeded = spent > budget.limit;
    const amount = isExceeded ? spent - budget.limit : budget.limit - spent;

    patterns.push({
      category: budget.category,
      totalSpend: spent,
      budgetLimit: budget.limit,
      percentageOfBudget: Math.round(percentage * 100) / 100,
      isExceeded,
      amount: Math.round(amount * 100) / 100,
    });
  }

  return patterns.sort((a, b) => b.percentageOfBudget - a.percentageOfBudget);
}

/**
 * Generate actionable savings insights
 */
export function generateSavingsInsights(
  transactions: Transaction[],
  budgets: Budget[]
): SavingsInsight[] {
  const patterns = detectSpendingPatterns(transactions, budgets);
  const insights: SavingsInsight[] = [];

  // Analyze each spending pattern
  for (const pattern of patterns) {
    if (pattern.isExceeded) {
      // Budget exceeded
      const monthlyExcess = pattern.amount;
      const yearlyExcess = monthlyExcess * 12;

      insights.push({
        type: "budget-exceeded",
        category: pattern.category,
        message: `You've exceeded your ${pattern.category} budget by ${formatCurrency(monthlyExcess)} this month.`,
        amount: monthlyExcess,
        suggestion: `Try to limit ${pattern.category} spending to ${formatCurrency(pattern.budgetLimit)} per month.`,
        projectedYearlySaving: yearlyExcess,
        priority: "high",
      });
    } else if (pattern.percentageOfBudget > 80) {
      // Close to budget limit
      const saved = pattern.amount;

      insights.push({
        type: "savings-opportunity",
        category: pattern.category,
        message: `You're at ${pattern.percentageOfBudget}% of your ${pattern.category} budget.`,
        amount: saved,
        suggestion: `You have ${formatCurrency(saved)} remaining. Be cautious in the last days of the month.`,
        projectedYearlySaving: saved * 12,
        priority: "medium",
      });
    } else if (pattern.percentageOfBudget < 50 && pattern.totalSpend > 0) {
      // Positive trend
      const underSpent = pattern.amount;
      const yearlyUnderSpent = underSpent * 12;

      insights.push({
        type: "positive-trend",
        category: pattern.category,
        message: `Great job! You're only at ${pattern.percentageOfBudget}% of your ${pattern.category} budget.`,
        amount: underSpent,
        suggestion: `Continue this disciplined spending pattern to maximize savings.`,
        projectedYearlySaving: yearlyUnderSpent,
        priority: "low",
      });
    }
  }

  // Analyze high discretionary spending
  const discretionaryCategories = ["Entertainment", "Dining", "Shopping"];
  const discretionarySpending = patterns.filter((p) =>
    discretionaryCategories.includes(p.category)
  );

  for (const spending of discretionarySpending) {
    if (spending.totalSpend > spending.budgetLimit * 0.5) {
      insights.push({
        type: "high-discretionary",
        category: spending.category,
        message: `${spending.category} spending is quite high at ${formatCurrency(spending.totalSpend)}.`,
        amount: spending.totalSpend,
        suggestion: `Consider reducing discretionary spending by 10-20% to increase savings.`,
        projectedYearlySaving: spending.totalSpend * 0.15 * 12,
        priority: "medium",
      });
    }
  }

  // Sort by priority and amount
  return insights
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.amount - a.amount;
    })
    .slice(0, 5); // Return top 5 insights
}

/**
 * Calculate savings projection for different investment modes
 * Modes: pure_saving, fd (Fixed Deposit), sip (Systematic Investment Plan)
 */
export function calculateSavingsProjection(
  monthlySavings: number,
  years: number,
  mode: "pure_saving" | "fd" | "sip" = "pure_saving"
): SavingsProjectionResult {
  if (monthlySavings <= 0 || years <= 0) {
    throw new Error("Monthly savings and years must be positive");
  }

  const totalContribution = monthlySavings * 12 * years;
  let futureValue = totalContribution;
  let rate = 0;
  let disclaimer = "";

  if (mode === "pure_saving") {
    // Just accumulation without interest
    futureValue = totalContribution;
    rate = 0;
    disclaimer =
      "This is simple accumulation without any interest or returns. Consider investing for better returns.";
  } else if (mode === "fd") {
    // Fixed Deposit with typical 6-7% annual interest
    rate = 6.5; // Average FD rate for individuals
    disclaimer =
      "Based on average FD rate of 6.5% p.a. Actual rates may vary by bank and tenure. This assumes monthly deposits compounded quarterly.";

    // Calculate future value with regular deposits
    const monthlyRate = rate / 100 / 12;
    let fv = 0;

    for (let month = 0; month < 12 * years; month++) {
      fv = (fv + monthlySavings) * (1 + monthlyRate);
    }

    futureValue = Math.round(fv * 100) / 100;
  } else if (mode === "sip") {
    // SIP with typical 12% annual return (stock market average)
    rate = 12; // Historical stock market average
    disclaimer =
      "Based on historical market average of 12% p.a. Past performance is not a guarantee of future results. Markets are volatile and returns can vary significantly.";

    // Calculate future value with SIP formula
    const monthlyRate = rate / 100 / 12;
    const months = 12 * years;

    // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    const fv =
      (monthlySavings *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)) *
      (1 + monthlyRate);

    futureValue = Math.round(fv * 100) / 100;
  }

  const interest = futureValue - totalContribution;

  return {
    mode,
    monthlyAmount: monthlySavings,
    years,
    futureValue,
    totalContribution,
    interest: Math.round(interest * 100) / 100,
    rate,
    disclaimer,
  };
}

/**
 * Calculate monthly savings target based on income
 */
export function calculateSavingsTarget(
  monthlyIncome: number,
  targetPercentage: number = 20
): number {
  return Math.round((monthlyIncome * targetPercentage) / 100);
}

/**
 * Analyze actual vs target savings
 */
export function analyzeSavingsPerformance(
  monthlyIncome: number,
  transactions: Transaction[],
  targetPercentage: number = 20
): {
  targetSavings: number;
  actualSavings: number;
  performance: number; // Percentage of target achieved
  message: string;
} {
  const target = calculateSavingsTarget(monthlyIncome, targetPercentage);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Calculate actual savings (income - expenses)
  let monthlyIncome_ = 0;
  let monthlyExpenses = 0;

  for (const tx of transactions) {
    const txDate = new Date(tx.date);
    if (
      txDate.getMonth() + 1 === currentMonth &&
      txDate.getFullYear() === currentYear
    ) {
      if (tx.type === "income") {
        monthlyIncome_ += tx.amount;
      } else {
        monthlyExpenses += tx.amount;
      }
    }
  }

  const actualSavings = monthlyIncome_ - monthlyExpenses;
  const performance =
    target > 0 ? Math.round((actualSavings / target) * 100) : 0;

  let message = "";
  if (performance >= 100) {
    message = `Great! You've achieved ${performance}% of your savings target.`;
  } else if (performance >= 75) {
    message = `Good progress! You're at ${performance}% of your savings target.`;
  } else if (performance >= 50) {
    message = `You're halfway there at ${performance}% of your savings target.`;
  } else if (performance > 0) {
    message = `You're at ${performance}% of your savings target. Increase efforts to reach your goal.`;
  } else {
    message = "You're not on track with your savings goal. Review your spending.";
  }

  return {
    targetSavings: target,
    actualSavings: Math.round(actualSavings * 100) / 100,
    performance: Math.max(0, Math.min(200, performance)),
    message,
  };
}

/**
 * Helper function to format currency
 */
function formatCurrency(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/**
 * Get spending category breakdown
 */
export function getCategoryBreakdown(
  transactions: Transaction[]
): Record<string, number> {
  const breakdown: Record<string, number> = {};

  for (const tx of transactions) {
    if (tx.type === "expense") {
      breakdown[tx.category] = (breakdown[tx.category] || 0) + tx.amount;
    }
  }

  return breakdown;
}

/**
 * Calculate expense ratio by category
 */
export function getCategoryExpenseRatio(
  transactions: Transaction[]
): Array<{ category: string; amount: number; percentage: number }> {
  const breakdown = getCategoryBreakdown(transactions);
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  if (total === 0) return [];

  return Object.entries(breakdown)
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      percentage: Math.round((amount / total) * 100 * 100) / 100,
    }))
    .sort((a, b) => b.amount - a.amount);
}
