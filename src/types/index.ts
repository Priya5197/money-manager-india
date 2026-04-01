import { Decimal, TransactionType, AccountType, PaymentMode, Category, Account, Transaction, Budget, SalaryHistory, LoanRate, Profile, UserPreferences } from './database';

// Extended Transaction with joined data
export interface TransactionWithDetails extends Transaction {
  category: Category | null;
  account: Account | null;
  transfer_to_account?: Account | null;
}

// Budget with actual spending
export interface BudgetWithSpent extends Budget {
  category: Category | null;
  spent: Decimal;
  remaining: Decimal;
  percentage: number;
}

// Category tree structure with subcategories
export interface CategoryWithSubcategories extends Category {
  subcategories: CategoryWithSubcategories[];
  transactionCount?: number;
}

// Monthly summary for transactions
export interface MonthlySummary {
  month: number;
  year: number;
  income: Decimal;
  expense: Decimal;
  net: Decimal;
  byCategory: Record<string, Decimal>;
}

// Tax-related types
export interface TaxBracket {
  minIncome: Decimal;
  maxIncome: Decimal;
  rate: number;
  surcharge?: number;
  cess?: number;
}

export interface TaxCalculation {
  grossIncome: Decimal;
  deductions: Decimal;
  taxableIncome: Decimal;
  incomeTax: Decimal;
  surcharge: Decimal;
  cess: Decimal;
  totalTax: Decimal;
  netIncome: Decimal;
}

export interface TaxDeduction {
  section: string;
  name: string;
  amount: Decimal;
  maxLimit: Decimal;
}

export interface InvestmentTaxCalculation extends TaxCalculation {
  ltcgTax: Decimal;
  stcgTax: Decimal;
  capitalGains: Decimal;
}

// EMI (Equated Monthly Installment) calculation
export interface EMICalculation {
  principal: Decimal;
  ratePerAnnum: Decimal;
  tenureMonths: number;
  processingFee?: Decimal;
  totalEMI: Decimal;
  monthlyEMI: Decimal;
  totalInterest: Decimal;
  totalAmount: Decimal;
  emiSchedule: EMIScheduleItem[];
}

export interface EMIScheduleItem {
  month: number;
  openingBalance: Decimal;
  emi: Decimal;
  principal: Decimal;
  interest: Decimal;
  closingBalance: Decimal;
}

export interface LoanComparison {
  bank: string;
  loanType: string;
  minRate: Decimal;
  maxRate: Decimal;
  processingFee: string;
  monthlyEMI: Decimal;
  totalInterest: Decimal;
  totalAmount: Decimal;
}

// Salary analysis types
export interface SalaryPrediction {
  month: number;
  year: number;
  predictedGrossSalary: Decimal;
  predictedNetSalary: Decimal;
  confidence: number;
}

export interface SalaryStatistics {
  averageGrossSalary: Decimal;
  averageNetSalary: Decimal;
  minSalary: Decimal;
  maxSalary: Decimal;
  medianSalary: Decimal;
  growthTrend: number;
  latestSalary: SalaryHistory | null;
}

export interface SalaryTrend {
  month: number;
  year: number;
  grossSalary: Decimal;
  netSalary: Decimal;
  deductions: Decimal;
  deductionPercentage: number;
}

// Recurring transaction types
export interface RecurringConfig {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'halfyearly' | 'yearly';
  startDate: string;
  endDate?: string;
  nextOccurrence: string;
  occurrences?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
}

export interface RecurringTransactionWithOccurrences extends TransactionWithDetails {
  recurring_config: RecurringConfig;
  nextDueDate: string;
  occurrencesRemaining?: number;
}

// Report and filtering types
export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  accountIds?: string[];
  categoryIds?: string[];
  types?: TransactionType[];
  paymentModes?: PaymentMode[];
  tags?: string[];
  merchantSearch?: string;
  minAmount?: Decimal;
  maxAmount?: Decimal;
  isRecurring?: boolean;
}

export interface TransactionReport {
  totalTransactions: number;
  totalIncome: Decimal;
  totalExpense: Decimal;
  netCashFlow: Decimal;
  transactionsByType: Record<TransactionType, number>;
  transactionsByCategory: Record<string, number>;
  transactionsByPaymentMode: Record<PaymentMode, number>;
  topMerchants: MerchantSummary[];
  transactions: TransactionWithDetails[];
}

export interface MerchantSummary {
  merchant: string;
  count: number;
  totalAmount: Decimal;
  averageAmount: Decimal;
  lastTransaction: string;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: (Decimal | null)[];
  backgroundColor?: string;
  borderColor?: string;
  fill?: boolean;
  borderWidth?: number;
  tension?: number;
}

export interface PieChartData {
  labels: string[];
  data: Decimal[];
  backgroundColor: string[];
  borderColor?: string[];
}

export interface CategorySpendingChart extends PieChartData {
  categories: Category[];
  total: Decimal;
}

export interface IncomeVsExpenseChart {
  months: string[];
  income: Decimal[];
  expense: Decimal[];
  net: Decimal[];
}

export interface AccountBalanceChart {
  accounts: Account[];
  balances: Decimal[];
  total: Decimal;
  trend?: Decimal[];
}

// Dashboard summary types
export interface DashboardSummary {
  totalIncome: Decimal;
  totalExpense: Decimal;
  netCashFlow: Decimal;
  savingsRate: number;
  topExpenseCategory: Category | null;
  topExpenseAmount: Decimal;
  accountsCount: number;
  totalAssets: Decimal;
  totalLiabilities: Decimal;
  netWorth: Decimal;
  budgetStatus: 'on_track' | 'at_risk' | 'exceeded';
  budgetPercentage: number;
}

// Account summary with balance changes
export interface AccountSummary extends Account {
  previousBalance?: Decimal;
  balanceChange?: Decimal;
  percentageChange?: number;
  transactionCount?: number;
  lastTransactionDate?: string;
}

// Investment tracking
export interface Investment {
  id: string;
  accountId: string;
  type: 'sip' | 'lumpsum' | 'dividend' | 'interest';
  amount: Decimal;
  units: Decimal;
  unitPrice: Decimal;
  currentPrice?: Decimal;
  currentValue?: Decimal;
  returns?: Decimal;
  returnsPercentage?: number;
  date: string;
  notes?: string;
}

export interface PortfolioSummary {
  totalInvested: Decimal;
  currentValue: Decimal;
  totalReturns: Decimal;
  returnsPercentage: number;
  holdings: Investment[];
  byType: Record<string, Decimal>;
  topPerformers: Investment[];
}

// Goal tracking types
export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: Decimal;
  currentAmount: Decimal;
  targetDate: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalProgress {
  goal: SavingsGoal;
  progress: number;
  amountRemaining: Decimal;
  monthlyTarget: Decimal;
  onTrack: boolean;
  daysRemaining: number;
}

// Notification types
export interface NotificationEvent {
  id: string;
  type: 'budget_exceeded' | 'goal_milestone' | 'recurring_transaction' | 'expense_alert' | 'income_received';
  title: string;
  message: string;
  userId: string;
  read: boolean;
  data: Record<string, any>;
  createdAt: string;
}

// User profile extended
export interface UserProfile extends Profile {
  preferences: UserPreferences | null;
  accountCount?: number;
  lastTransactionDate?: string;
}

// Bulk transaction import
export interface BulkTransactionImport {
  accountId: string;
  transactions: {
    date: string;
    amount: Decimal;
    description: string;
    category?: string;
    paymentMode?: PaymentMode;
    notes?: string;
  }[];
}

export interface BulkImportResult {
  successCount: number;
  failureCount: number;
  failedTransactions: {
    transaction: BulkTransactionImport['transactions'][0];
    error: string;
  }[];
}

// API response wrappers
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

// Form validation types
export interface FormError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormError[];
}

// State management types
export interface AppState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  lastSyncTime?: string;
}

export interface TransactionState {
  transactions: TransactionWithDetails[];
  selectedTransaction?: TransactionWithDetails;
  isLoading: boolean;
  error: string | null;
  filters: ReportFilters;
}

export interface BudgetState {
  budgets: BudgetWithSpent[];
  isLoading: boolean;
  error: string | null;
  selectedPeriod: {
    month: number;
    year: number;
  };
}

// Common utility types
export type Maybe<T> = T | null | undefined;
export type Optional<T> = T | undefined;

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface CurrencyFormat {
  symbol: string;
  code: string;
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

// Supported currencies in India context
export const SUPPORTED_CURRENCIES: Record<string, CurrencyFormat> = {
  INR: {
    symbol: '₹',
    code: 'INR',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  USD: {
    symbol: '$',
    code: 'USD',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  EUR: {
    symbol: '€',
    code: 'EUR',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
  },
  GBP: {
    symbol: '£',
    code: 'GBP',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
};

// Indian financial year type
export interface FinancialYear {
  year: number;
  startDate: string;
  endDate: string;
  fiscalYear: string;
}

export const getCurrentFinancialYear = (): FinancialYear => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  if (currentMonth < 3) {
    return {
      year: currentYear - 1,
      startDate: `${currentYear - 1}-04-01`,
      endDate: `${currentYear}-03-31`,
      fiscalYear: `${currentYear - 1}-${currentYear}`,
    };
  } else {
    return {
      year: currentYear,
      startDate: `${currentYear}-04-01`,
      endDate: `${currentYear + 1}-03-31`,
      fiscalYear: `${currentYear}-${currentYear + 1}`,
    };
  }
};
