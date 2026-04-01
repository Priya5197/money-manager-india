/**
 * Money Manager India - Main Export Index
 * Central location for all utilities, hooks, and constants
 */

// Formatting Utilities
export * from "@/utils/format";

// Calculation Engines
export * from "@/utils/calculations/emi";
export * from "@/utils/calculations/tax";
export * from "@/utils/calculations/salary";
export * from "@/utils/calculations/savings";

// Import/Export
export * from "@/utils/csv-import";
export * from "@/utils/export";

// Validation
export * from "@/utils/validators";

// Constants
export * from "@/constants/categories";
export * from "@/constants/indian-banks";

// Configuration
export * from "@/config/tax-slabs";

// Supabase Clients
export { createClient as createSupabaseClient } from "@/lib/supabase/client";
export { createClient as createSupabaseServerClient } from "@/lib/supabase/server";
export { updateSession as updateSupabaseSession } from "@/lib/supabase/middleware";

// React Hooks
export * from "@/hooks/useAuth";
export * from "@/hooks/useTransactions";
export * from "@/hooks/useBudgets";
export * from "@/hooks/useCategories";
export * from "@/hooks/useAccounts";

// Type exports for convenience
export type {
  Transaction,
  TransactionFilter,
  UseTransactionsReturn,
} from "@/hooks/useTransactions";

export type {
  Budget,
  UseBudgetsReturn,
} from "@/hooks/useBudgets";

export type {
  Category,
  UseCategoriesReturn,
} from "@/hooks/useCategories";

export type {
  Account,
  UseAccountsReturn,
} from "@/hooks/useAccounts";

export type {
  UseAuthState,
  UseAuthActions,
  UseAuthReturn,
} from "@/hooks/useAuth";

export type {
  EMICalculationResult,
  EMIMonthDetail,
  LoanOffer,
  LoanComparison,
  CibilRateConfig,
} from "@/utils/calculations/emi";

export type {
  TaxParams,
  TaxCalculationResult,
} from "@/utils/calculations/tax";

export type {
  SalaryHistory,
  SalaryGrowthAnalysis,
  SalaryPrediction,
  SalaryProjection,
} from "@/utils/calculations/salary";

export type {
  Transaction as SavingsTransaction,
  Budget as SavingsBudget,
  SpendingPattern,
  SavingsInsight,
  SavingsProjectionResult,
} from "@/utils/calculations/savings";

export type {
  BankInfo,
} from "@/constants/indian-banks";

export type {
  TaxSlab,
  TaxSlabConfig,
  SurchargeLimit,
} from "@/config/tax-slabs";

export type {
  ImportResult,
  ImportError,
  TransactionImport,
  SalaryImport,
} from "@/utils/csv-import";

export type {
  ExportOptions,
  PDFExportOptions,
} from "@/utils/export";

export type {
  LoginInput,
  SignupInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  TransactionInput,
  BudgetInput,
  CategoryInput,
  AccountInput,
  EMICalculatorInput,
  TaxCalculatorInput,
  SalaryHistoryInput,
  ProfileInput,
  InvestmentInput,
  GoalInput,
} from "@/utils/validators";
