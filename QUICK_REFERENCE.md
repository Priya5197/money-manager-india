# Money Manager India - Quick Reference Guide

## File Locations & Line Counts

### Supabase Integration (117 lines total)
```
src/lib/supabase/client.ts        15 lines   - Browser client
src/lib/supabase/server.ts        33 lines   - Server-side client
src/lib/supabase/middleware.ts    69 lines   - Auth middleware
```

### Formatting Utilities (255 lines)
```
src/utils/format.ts               255 lines
- formatINR(), formatDate(), formatPercent(), formatMonth()
- formatFinancialYear(), truncateText(), formatPhoneNumber()
- formatTime(), formatDateTime(), formatCompactINR()
```

### Calculation Engines (1,337 lines total)
```
src/utils/calculations/emi.ts     307 lines
- calculateEMI(), generateAmortizationSchedule()
- compareLoanOffers(), estimateRateByScore()
- calculateLoanAffordability()

src/utils/calculations/tax.ts     310 lines
- calculateOldRegimeTax(), calculateNewRegimeTax()
- compareRegimes(), deduction limits
- Support for FY 2024-25, 2023-24, 2022-23

src/utils/calculations/salary.ts  343 lines
- analyzeSalaryGrowth(), predictSalary()
- calculateCAGR(), linear regression
- projectLifetimeEarnings()

src/utils/calculations/savings.ts 377 lines
- detectSpendingPatterns(), generateSavingsInsights()
- calculateSavingsProjection() [pure_saving, fd, sip modes]
- analyzeSavingsPerformance()
```

### Import/Export (830 lines total)
```
src/utils/csv-import.ts           471 lines
- parseTransactionCSV(), parseSalaryCSV()
- Smart column mapping, multi-format date parsing
- Detailed error reporting

src/utils/export.ts               359 lines
- exportToCSV(), exportToPDF()
- Transaction/Budget report generation
- Powered by papaparse, jspdf
```

### Data Validation (281 lines)
```
src/utils/validators.ts           281 lines
- 15+ Zod schemas for all forms
- Login, signup, transactions, budgets, tax, investments
- Full error messages and validation rules
```

### Constants & Configuration (1,040 lines total)
```
src/constants/categories.ts       365 lines
- 19 expense categories, 10 income categories
- Icons, colors, helper functions
- Search and filtering

src/constants/indian-banks.ts     331 lines
- 20+ major Indian banks with IFSC data
- IFSC validation and extraction
- Bank search and lookup

src/config/tax-slabs.ts           344 lines
- Tax configs for FY 2024-25, 2023-24, 2022-23
- Old & new regime slabs
- Surcharge and deduction limits
```

### React Hooks (1,605 lines total)
```
src/hooks/useAuth.ts              299 lines
- signUp(), signIn(), signOut()
- resetPassword(), updatePassword()
- Real-time session management

src/hooks/useTransactions.ts      360 lines
- CRUD: create, read, update, delete
- Advanced filtering, bulk operations
- Category/account-specific queries

src/hooks/useBudgets.ts           304 lines
- Budget CRUD operations
- Period-based filtering
- Budget alert checking

src/hooks/useCategories.ts        336 lines
- Category CRUD with defaults
- Default category initialization
- Search and type filtering

src/hooks/useAccounts.ts          306 lines
- Account management with balance tracking
- Account type filtering
- Total balance calculation
```

## Key Functions by Category

### Formatting
```typescript
formatINR(125000)                              // "₹1,25,000.00"
formatDate("2024-03-31")                       // "31/03/2024"
formatPercent(15.5)                            // "15.5%"
formatMonth(3, 2024)                           // "Mar 2024"
formatCompactINR(1000000)                      // "₹10L"
```

### EMI Calculations
```typescript
calculateEMI(1000000, 8.5, 240)                // Monthly EMI
generateAmortizationSchedule(...)              // Full 240-month schedule
compareLoanOffers(offers)                      // Best offer recommendation
estimateRateByScore(750, "personal")           // CIBIL-based rate
calculateLoanAffordability(50000)              // Max affordable loan
```

### Tax Calculations
```typescript
calculateOldRegimeTax({
  grossSalary: 1500000,
  section80C: 150000,
  financialYear: "2024-25",
  age: "below-60"
})

calculateNewRegimeTax({...})

compareRegimes({...})                          // Recommend best regime
```

### Salary Analysis
```typescript
analyzeSalaryGrowth(history)                   // YoY growth rates
predictSalary(history, 5)                      // 5-year forecast
calculateCAGR(500000, 1500000, 5)              // Growth rate
projectLifetimeEarnings(history, 60)           // Career earnings
```

### Savings Insights
```typescript
detectSpendingPatterns(transactions, budgets)  // Find overages
generateSavingsInsights(transactions, budgets) // Actionable tips
calculateSavingsProjection(25000, 5, "sip")    // SIP projection
analyzeSavingsPerformance(income, tx)          // vs target
```

### Export/Import
```typescript
exportToCSV(data, "export.csv")                // Generic CSV
exportTransactionsToPDF(transactions)          // PDF report
parseTransactionCSV(file)                      // Parse with validation
parseSalaryCSV(file)                           // Salary import
```

### Categories & Banks
```typescript
getCategoryById("food-dining")                 // Get category
searchCategories("food")                       // Search
getCategoriesByType("expense")                 // Filter by type
searchBanks("HDFC")                            // Find bank
validateIFSC("SBIN0001234")                    // Validate IFSC
getBankByIFSC("HDFC0001234")                   // Find by IFSC
```

## Database Interaction (via Hooks)

### useAuth
```typescript
const { user, session, signIn, signOut } = useAuth();
```

### useTransactions
```typescript
const {
  transactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  fetchTransactions,
  getTransactionsByCategory
} = useTransactions(userId);
```

### useBudgets
```typescript
const {
  budgets,
  createBudget,
  checkBudgetAlert,
  getBudgetsByPeriod
} = useBudgets(userId);
```

### useCategories
```typescript
const {
  categories,
  createCategory,
  initializeDefaultCategories
} = useCategories(userId);
```

### useAccounts
```typescript
const {
  accounts,
  createAccount,
  getTotalBalance,
  getActiveAccounts
} = useAccounts(userId);
```

## Validation Schemas (Zod)

```typescript
import {
  loginSchema,
  signupSchema,
  transactionSchema,
  budgetSchema,
  emiCalculatorSchema,
  taxCalculatorSchema
} from '@/utils/validators';

// Validate data
const validData = loginSchema.parse(formData);

// Type inference
type LoginInput = z.infer<typeof loginSchema>;
```

## Tax Configuration Examples

```typescript
import { getTaxSlabConfig, getLatestFinancialYear } from '@/config/tax-slabs';

const fy = getLatestFinancialYear();            // "2024-25"
const config = getTaxSlabConfig(fy, "old");    // Old regime config
```

## Category & Bank Constants

```typescript
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  MAJOR_INDIAN_BANKS
} from '@/constants';

// Use in forms
categories.map(cat => <option>{cat.name}</option>)

// Use in UI
<Icon name={getCategoryIcon(categoryId)} />
<div style={{background: getCategoryColor(categoryId)}}></div>
```

## Common Patterns

### Format currency for display
```typescript
import { formatINR } from '@/utils/format';
<div>{formatINR(transaction.amount)}</div>
```

### Calculate and display EMI
```typescript
import { calculateEMI, generateAmortizationSchedule } from '@/utils/calculations/emi';

const emi = calculateEMI(principal, rate, months);
const schedule = generateAmortizationSchedule(principal, rate, months);
```

### Tax comparison
```typescript
import { compareRegimes } from '@/utils/calculations/tax';

const { oldRegime, newRegime, recommendation } = compareRegimes(params);
// recommendation: "old" | "new"
```

### Create transaction with validation
```typescript
import { transactionSchema } from '@/utils/validators';
import { useTransactions } from '@/hooks/useTransactions';

const { createTransaction } = useTransactions(userId);

const validData = transactionSchema.parse(formData);
await createTransaction(validData);
```

### Salary forecast
```typescript
import { predictSalary } from '@/utils/calculations/salary';

const projection = predictSalary(salaryHistory, 5);
// Returns: baseCase, bestCase, conservative for 5 years
```

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxx
SUPABASE_SERVICE_ROLE_KEY=eyxxxx
```

## Dependencies

All utilities are built with:
- **@supabase/ssr** - Supabase client
- **zod** - Validation
- **papaparse** - CSV parsing
- **jspdf** - PDF generation
- **jspdf-autotable** - PDF tables
- **lucide-react** - Icons (for category icons)

## Test Coverage Checklist

Essential functions to test:
- [ ] formatINR with edge cases (0, negative, large numbers)
- [ ] calculateEMI with 0% interest
- [ ] Tax calculation with all deduction combinations
- [ ] CSV import with various date formats
- [ ] Salary prediction with insufficient data
- [ ] Budget alert threshold calculations
- [ ] IFSC validation for all bank codes

## Performance Optimization Tips

1. **Calculations**: All use Math operations, no loops for simple cases
2. **Formatting**: Pre-compute for lists using React.useMemo
3. **Hooks**: Auto-fetch on mount, manual refresh available
4. **Export**: Large datasets handled by papaparse worker threads
5. **Validation**: Zod schemas optimized for fast validation

## Total Utility Coverage

- **5,465 lines of production code**
- **15 primary utilities**
- **50+ exported functions**
- **25+ TypeScript types**
- **20+ validation schemas**
- **3 calculation engines**
- **5 data access hooks**
- **Full Indian finance support**

All files are complete, tested-ready, and production-grade.
