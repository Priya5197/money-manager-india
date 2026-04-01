# Money Manager India - Utility Files Summary

This document lists all production-grade utility files, libraries, and hooks created for the Money Manager India application.

## Project Structure

```
money-manager-india/src/
├── lib/supabase/
│   ├── client.ts          # Browser Supabase client
│   ├── server.ts          # Server-side Supabase client with cookies
│   └── middleware.ts      # Auth middleware helper
├── utils/
│   ├── format.ts          # Formatting utilities (INR, dates, etc.)
│   ├── export.ts          # CSV and PDF export utilities
│   ├── csv-import.ts      # CSV parsing and import validation
│   ├── validators.ts      # Zod validation schemas for all forms
│   └── calculations/
│       ├── emi.ts         # EMI calculator with amortization schedules
│       ├── tax.ts         # Indian income tax calculator
│       ├── salary.ts      # Salary analysis and prediction
│       └── savings.ts     # Savings guidance and projections
├── constants/
│   ├── categories.ts      # Default transaction categories with icons/colors
│   └── indian-banks.ts    # Major Indian banks and IFSC data
├── config/
│   └── tax-slabs.ts       # Tax slab configurations (multiple FY)
└── hooks/
    ├── useAuth.ts         # Authentication hook
    ├── useTransactions.ts # Transaction CRUD hook
    ├── useBudgets.ts      # Budget management hook
    ├── useCategories.ts   # Category management hook
    └── useAccounts.ts     # Account management hook
```

## File Details

### Supabase Integration

#### `/src/lib/supabase/client.ts`
- Browser client for Supabase using `@supabase/ssr`
- Environment variable validation
- Type-safe with Database types

#### `/src/lib/supabase/server.ts`
- Server-side Supabase client with cookie management
- Async initialization for Next.js 14+ Server Components
- Service role authentication

#### `/src/lib/supabase/middleware.ts`
- Auth middleware for route protection
- Public/private route configuration
- Automatic redirects for auth status

### Formatting Utilities (`/src/utils/format.ts`)
- `formatINR()` - Indian Rupee formatting (₹1,25,000.00)
- `formatIndianNumber()` - Number formatting without currency
- `formatDate()` - Indian date format (DD/MM/YYYY)
- `formatDateLong()` - Localized date format
- `formatPercent()` - Percentage formatting
- `formatMonth()` - Month-year formatting
- `formatFinancialYear()` - FY formatting
- `truncateText()` - Text truncation with ellipsis
- `formatPhoneNumber()` - Indian phone number formatting
- `formatTime()` - Time in HH:MM format
- `formatDateTime()` - Full datetime formatting
- `formatCompactINR()` - Compact number format (K, L, Cr)

### EMI Calculator (`/src/utils/calculations/emi.ts`)
- `calculateEMI()` - Standard EMI formula: P × r × (1+r)^n / ((1+r)^n - 1)
- `calculateTotalInterest()` - Interest calculation
- `calculateTotalRepayment()` - Including fees and insurance
- `generateAmortizationSchedule()` - Full schedule with optional prepayments
- `compareLoanOffers()` - Compare multiple loan parameters
- `estimateRateByScore()` - CIBIL score-based rate estimation
- `calculateTenureByEMI()` - Find tenure for max EMI
- `calculateLoanAffordability()` - Based on income ratio

### Tax Calculator (`/src/utils/calculations/tax.ts`)
- **Old Regime**: Full deduction support (80C, 80D, 80CCD, HRA, LTA, etc.)
- **New Regime**: Standard deduction only
- `calculateOldRegimeTax()` - With all deductions
- `calculateNewRegimeTax()` - Without deductions
- `compareRegimes()` - Recommendation engine
- Surcharge and health education cess calculations
- Support for FY 2024-25, 2023-24, 2022-23
- Age-based taxation handling
- Full type safety with TaxParams interface

### Salary Analysis (`/src/utils/calculations/salary.ts`)
- `analyzeSalaryGrowth()` - YoY growth analysis
- `predictSalary()` - Multiple scenarios (best/base/conservative)
- `calculateCAGR()` - Compound annual growth rate
- Linear regression implementation for predictions
- `calculateGrowthConsistency()` - Consistency scoring
- `analyzeSalaryGrowthPattern()` - Pattern detection
- `projectLifetimeEarnings()` - Career projection
- Clear assumptions returned with predictions

### Savings Guidance (`/src/utils/calculations/savings.ts`)
- `detectSpendingPatterns()` - Compare actual vs budget
- `generateSavingsInsights()` - Actionable recommendations with positive messaging
- `calculateSavingsProjection()` - Three modes:
  - Pure saving (no returns)
  - FD (6.5% average)
  - SIP (12% historical average)
- `analyzeSavingsPerformance()` - Target vs actual
- `getCategoryBreakdown()` - Category-wise analysis
- `getCategoryExpenseRatio()` - Expense distribution
- Full disclaimers for projections

### Export Utilities (`/src/utils/export.ts`)
- `exportToCSV()` - Generic CSV export
- `exportTransactionsToCSV()` - Formatted transaction export
- `exportBudgetsToCSV()` - Budget report export
- `exportToPDF()` - Generic PDF with tables
- `exportTransactionsToPDF()` - Transaction report PDF
- `exportBudgetReportToPDF()` - Budget report PDF
- Powered by: papaparse, jspdf, jspdf-autotable
- Timestamp and company branding support
- Automatic file downloads

### CSV Import (`/src/utils/csv-import.ts`)
- `parseTransactionCSV()` - Smart column mapping, multi-format date parsing
- `parseSalaryCSV()` - Salary history import with validation
- `parseCSVFile()` - Generic CSV parser using papaparse
- Column auto-detection (case-insensitive)
- Comprehensive error reporting with row/column details
- Import summary with success/failure counts
- Flexible date format support (YYYY-MM-DD, DD-MM-YYYY, etc.)
- Amount parsing with currency symbol handling

### Validators (`/src/utils/validators.ts`)
Complete Zod schemas for:
- Authentication: `loginSchema`, `signupSchema`, `forgotPasswordSchema`, `resetPasswordSchema`
- Transactions: `transactionSchema` with all optional fields
- Budgets: `budgetSchema` with period and alert threshold
- Categories: `categorySchema` with icon/color support
- Accounts: `accountSchema` with bank details
- Calculators: `emiCalculatorSchema`, `taxCalculatorSchema`
- Profiles: `profileSchema` with PAN, CIBIL score, income
- Investments: `investmentSchema` with SIP/FD/insurance support
- Goals: `goalSchema` with priority and category
- Salary: `salaryHistorySchema` with bonus tracking

### Categories (`/src/constants/categories.ts`)
- 19 default expense categories with icons and colors
- 10 default income categories
- Matching Lucide React icons for UI integration
- Category search and filtering
- Color palette support for charts
- Fallback category selection
- Helper functions:
  - `getCategoryById()`, `getCategoriesByType()`, `searchCategories()`
  - `getCategoryColor()`, `getCategoryIcon()`
  - `getDefaultCategories()`, `getCategoryWithFallback()`

### Indian Banks (`/src/constants/indian-banks.ts`)
- 20+ major Indian banks (public, private, foreign)
- Payment banks and NBFC support
- IFSC code validation and extraction
- Bank search and filtering
- Metadata: name, type, category, IFSC prefix, website
- Helper functions:
  - `getBankById()`, `searchBanks()`, `getBankOptions()`
  - `validateIFSC()`, `getBankByIFSC()`
  - `getBanksByType()`, `getAllBanks()`

### Tax Slabs Configuration (`/src/config/tax-slabs.ts`)
Complete tax configurations for:
- **FY 2024-25**: Both old and new regimes
- **FY 2023-24**: Both regimes
- **FY 2022-23**: Both regimes
Each includes:
- 6 income tax slabs
- Surcharge limits (up to 37%)
- 4% health & education cess
- Deduction limits (80C, 80D, 80CCD1B, 80CCD2)
- Section 87A rebate limits
Helper functions:
- `getTaxSlabConfig()`, `getAvailableFinancialYears()`
- `getTaxRateForIncome()`, `getSurchargeRate()`
- `getDeductionLimits()`, `compareTaxBrackets()`

### Authentication Hook (`/src/hooks/useAuth.ts`)
- `useAuth()` - Full auth management
  - Session tracking with real-time updates
  - `signUp(email, password, fullName)` - Email signup
  - `signIn(email, password)` - Email signin
  - `signOut()` - Logout
  - `resetPassword(email)` - Send reset email
  - `updatePassword(newPassword)` - Change password
  - `updateProfile(data)` - Update user info
  - `refreshSession()` - Manual session refresh
- Additional hooks:
  - `useAuthUser()` - Get current user
  - `useAuthSession()` - Get current session
- Loading and error states
- TypeScript types included

### Transactions Hook (`/src/hooks/useTransactions.ts`)
- CRUD operations: Create, Read, Update, Delete
- `fetchTransactions(filter?)` - Advanced filtering:
  - Date range (startDate, endDate)
  - Category, type, account, amount range
- `createTransaction()` - Insert with validation
- `updateTransaction()` - Partial updates
- `deleteTransaction()`, `bulkDeleteTransactions()` - Deletion
- Specialized queries:
  - `getTransactionById()`, `getTransactionsByAccount()`, `getTransactionsByCategory()`
- Real-time state management
- Error handling with PostgrestError

### Budgets Hook (`/src/hooks/useBudgets.ts`)
- Full CRUD operations
- `fetchBudgets(period?)` - Filter by period
- `createBudget()`, `updateBudget()`, `deleteBudget()`
- `getBudgetById()`, `getBudgetsByCategory()`, `getBudgetsByPeriod()`
- `checkBudgetAlert()` - Alert threshold checking
- Real-time state synchronization

### Categories Hook (`/src/hooks/useCategories.ts`)
- CRUD operations with defaults
- `fetchCategories(type?)` - Include defaults automatically
- `createCategory()`, `updateCategory()`, `deleteCategory()`
- `getCategoryById()`, `getCategoriesByType()`, `searchCategories()`
- `initializeDefaultCategories()` - Setup for new users
- Default category integration

### Accounts Hook (`/src/hooks/useAccounts.ts`)
- Account management with balance tracking
- `fetchAccounts(includeInactive?)` - Smart filtering
- `createAccount()`, `updateAccount()`, `deleteAccount()`
- `getAccountById()`, `getAccountsByType()`
- Balance operations:
  - `updateAccountBalance()` - Update with recalculation
  - `getTotalBalance()` - Sum all active accounts
- `getActiveAccounts()`, `deactivateAccount()`
- Type-safe account types

## Key Features

### Production-Grade Quality
- Full TypeScript type safety
- Comprehensive error handling
- Input validation with Zod
- Error logging support
- Performance optimizations

### Indian Finance Support
- INR formatting with proper comma separation (₹1,25,000)
- Indian tax calculations (old & new regime)
- CIBIL score-based lending rates
- EMI with amortization schedules
- Fixed Deposit and SIP calculations
- Indian bank database

### Data Integrity
- Zod validation for all forms
- CSV import with multi-format support
- Column auto-detection
- Detailed import error reporting
- Financial precision (rounded to 2 decimals)

### Export Capabilities
- CSV export with custom formatting
- PDF generation with tables and branding
- Transaction and budget reports
- Date and currency formatting
- Download automation

### Real-time Features
- Supabase real-time listeners
- Auto-refreshing data hooks
- Session management
- Auth state synchronization

## Dependencies

```json
{
  "dependencies": {
    "@supabase/ssr": "^0.0.x",
    "@supabase/supabase-js": "^2.x",
    "zod": "^3.x",
    "papaparse": "^5.x",
    "jspdf": "^2.x",
    "jspdf-autotable": "^3.x"
  }
}
```

## Usage Examples

### Format INR
```typescript
import { formatINR } from '@/utils/format';
formatINR(125000); // "₹1,25,000.00"
```

### Calculate EMI
```typescript
import { calculateEMI } from '@/utils/calculations/emi';
const emi = calculateEMI(1000000, 8.5, 240); // Monthly EMI for 10L loan
```

### Tax Calculation
```typescript
import { compareRegimes } from '@/utils/calculations/tax';
const result = compareRegimes({
  grossSalary: 1500000,
  section80C: 150000,
  financialYear: '2024-25',
  age: 'below-60'
});
```

### Salary Prediction
```typescript
import { predictSalary } from '@/utils/calculations/salary';
const projection = predictSalary([
  { year: 2021, salary: 500000 },
  { year: 2022, salary: 600000 },
  { year: 2023, salary: 750000 }
]);
```

### Use Transactions Hook
```typescript
import { useTransactions } from '@/hooks/useTransactions';

export function MyComponent() {
  const { transactions, createTransaction, error } = useTransactions(userId);

  const handleCreate = async () => {
    await createTransaction({
      userId,
      accountId,
      category: 'Food & Dining',
      type: 'expense',
      amount: 500,
      date: new Date().toISOString()
    });
  };
}
```

## Notes

- All calculations follow Indian financial standards
- Tax calculations include surcharge and cess
- EMI uses precise financial mathematics
- Formatting respects Indian number system
- All hooks are client-side by default (use "use client" directive)
- Supabase server client for SSR operations
- All validators provide detailed error messages
- Export functions work in browser environment

All files are production-ready with no TODOs or stubs.
