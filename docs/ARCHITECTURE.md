# Money Manager India - Architecture Guide

This document provides a comprehensive overview of the system architecture, design decisions, and implementation details for Money Manager India.

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture Diagram](#system-architecture-diagram)
4. [Data Flow](#data-flow)
5. [Database Schema](#database-schema)
6. [API Design](#api-design)
7. [Authentication & Authorization](#authentication--authorization)
8. [External Data Integration](#external-data-integration)
9. [Security Design](#security-design)
10. [Analytics & Event Tracking](#analytics--event-tracking)
11. [Deployment Architecture](#deployment-architecture)
12. [Scaling Considerations](#scaling-considerations)

## System Overview

Money Manager India is a personal finance management application built with modern web technologies. It provides comprehensive tools for Indian users to manage budgets, track expenses, calculate EMIs, analyze taxes, and gain financial insights.

### Core Objectives

- Provide an intuitive interface for managing personal finances
- Support Indian-specific financial products and calculations
- Ensure data security and user privacy
- Enable offline-first functionality where possible
- Provide actionable financial insights through analytics

### Key Features

- Budget management with category-based tracking
- Expense tracking with filtering and search
- Income management and salary analysis
- EMI calculator with multiple loan types
- Tax calculator with Indian tax slab support
- Investment portfolio tracking
- Financial reports and exports
- Multi-account management

## Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3 + custom Indian theme
- **State Management**: React Hooks + Context API
- **Charts**: Recharts 2
- **Forms**: React Hook Form + Zod validation
- **UI Components**: Radix UI + custom components
- **Icons**: Lucide React
- **Table**: TanStack React Table

### Backend

- **Framework**: Next.js 14 API Routes + Server Actions
- **Database**: PostgreSQL 15+ (via Supabase)
- **ORM**: Supabase API (direct SQL/PostgREST)
- **Real-time**: Supabase Realtime (WebSocket)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (for exports)

### DevOps & Hosting

- **Hosting**: Vercel
- **Database Hosting**: Supabase (AWS-managed PostgreSQL)
- **CDN**: Vercel Edge Network
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics, Error tracking (optional: Sentry)
- **Email**: SendGrid (optional, for notifications)

### Development Tools

- **Package Manager**: npm
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + TypeScript
- **Code Formatting**: Prettier
- **Version Control**: Git + GitHub

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Web Browser (React 18 + Next.js 14)                      │  │
│  │ - Dashboard                                              │  │
│  │ - Budgets, Expenses, Income                              │  │
│  │ - Calculators (EMI, Tax, Salary)                        │  │
│  │ - Reports & Analytics                                    │  │
│  │ - Settings & Profile                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┬┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │    HTTPS     │ │  WebSocket   │ │   HTTPS      │
    │   (REST API)  │ │ (Realtime)   │ │ (Server Act.)│
    └──────────────┘ └──────────────┘ └──────────────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      Server Layer (Next.js 14)                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ API Routes (/api)                                        │  │
│  │ - Authentication endpoints                               │  │
│  │ - CRUD endpoints (budgets, expenses, etc.)              │  │
│  │ - Report generation                                      │  │
│  │ - Data export (PDF, CSV)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Server Actions                                           │  │
│  │ - Form submissions                                       │  │
│  │ - Server-side calculations                              │  │
│  │ - Data mutations                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Background Jobs                                          │  │
│  │ - Loan rate scraping                                     │  │
│  │ - Tax content syncing                                    │  │
│  │ - Report generation (async)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┬┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ PostgREST    │ │ Supabase     │ │ Supabase     │
    │ (CRUD API)   │ │ Auth         │ │ Storage      │
    └──────────────┘ └──────────────┘ └──────────────┘
              │               │               │
              └───────────────┼───────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer (Supabase)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ PostgreSQL Database (AWS RDS)                            │  │
│  │ - User accounts & profiles                               │  │
│  │ - Budgets & budget items                                │  │
│  │ - Expenses & categories                                  │  │
│  │ - Income sources                                         │  │
│  │ - Investments                                            │  │
│  │ - Tax records                                            │  │
│  │ - Loan rate history                                      │  │
│  │ - Audit logs                                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ RLS (Row Level Security) Policies                        │  │
│  │ - Users can only access their own data                   │  │
│  │ - Encrypted sensitive fields                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Registration & Authentication Flow

```
┌─────────────┐
│   Sign Up   │
│   Screen    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Submit form                    │
│  (email, password)              │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Server Action: auth/register   │
│  - Validate input               │
│  - Hash password                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Supabase Auth.signUp()         │
│  - Create auth user             │
│  - Send verification email      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Create User Profile            │
│  - Insert into users table      │
│  - RLS ensures isolation        │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Return session token           │
│  - Set secure HTTP cookie       │
│  - Redirect to dashboard        │
└─────────────────────────────────┘
```

### Expense Tracking Flow

```
┌──────────────────┐
│  Expense Form    │
│  - Amount        │
│  - Category      │
│  - Date          │
│  - Description   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│ Form Validation (Zod)        │
│ - Type validation            │
│ - Range validation           │
│ - Required fields check      │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Server Action: createExpense │
│ - Extract session user       │
│ - Encrypt sensitive fields   │
│ - Validate ownership         │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Database Insert              │
│ INSERT INTO expenses (...)   │
│ - RLS: user_id = current_uid │
│ - Trigger: update budget    │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Return created expense       │
│ - Update client state        │
│ - Show success toast         │
│ - Refresh budget view        │
└──────────────────────────────┘
```

## Database Schema

### Core Tables

#### `users` Table
```sql
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  currency text DEFAULT 'INR',
  timezone text DEFAULT 'Asia/Kolkata',
  preferences jsonb DEFAULT '{}',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

#### `budgets` Table
```sql
CREATE TABLE budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  total_amount decimal(15, 2) NOT NULL,
  start_date date NOT NULL,
  end_date date,
  status text DEFAULT 'active',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE(user_id, name, start_date)
);
```

#### `budget_items` Table
```sql
CREATE TABLE budget_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id uuid NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  category text NOT NULL,
  allocated_amount decimal(15, 2) NOT NULL,
  spent_amount decimal(15, 2) DEFAULT 0,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

#### `expenses` Table
```sql
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  budget_id uuid REFERENCES budgets(id) ON DELETE SET NULL,
  amount decimal(15, 2) NOT NULL,
  category text NOT NULL,
  description text,
  expense_date date NOT NULL,
  payment_method text,
  tags text[],
  is_recurring boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

#### `income` Table
```sql
CREATE TABLE income (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_name text NOT NULL,
  amount decimal(15, 2) NOT NULL,
  frequency text NOT NULL, -- monthly, yearly, one-time
  income_date date NOT NULL,
  is_taxable boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

#### `investments` Table
```sql
CREATE TABLE investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL, -- stocks, mutual_funds, bonds, ppf, nps, etc
  amount decimal(15, 2) NOT NULL,
  current_value decimal(15, 2),
  investment_date date NOT NULL,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

#### `loan_rates` Table
```sql
CREATE TABLE loan_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_type text NOT NULL, -- home_loan, car_loan, personal_loan, education_loan
  bank_name text NOT NULL,
  interest_rate decimal(5, 2) NOT NULL,
  processing_fee decimal(5, 2),
  min_amount decimal(15, 2),
  max_amount decimal(15, 2),
  last_updated timestamp DEFAULT now(),
  source_url text
);
```

### Row-Level Security Policies

All tables have RLS enabled with policies like:

```sql
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_can_read_own_expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_can_delete_own_expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);
```

## API Design

### Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "session": {
    "accessToken": "jwt_token",
    "expiresIn": 3600
  }
}
```

#### POST /api/auth/login
Login existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:** (same as register)

#### POST /api/auth/logout
Logout current user.

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Budget Endpoints

#### GET /api/budgets
List all budgets for current user.

**Query Parameters:**
- `status`: Filter by status (active, archived)
- `startDate`: Filter from date
- `endDate`: Filter to date

**Response:**
```json
{
  "budgets": [
    {
      "id": "uuid",
      "name": "Monthly Budget",
      "totalAmount": 50000,
      "startDate": "2024-01-01",
      "endDate": "2024-01-31",
      "spent": 35000,
      "remaining": 15000,
      "items": [...]
    }
  ]
}
```

#### POST /api/budgets
Create new budget.

**Request:**
```json
{
  "name": "February Budget",
  "totalAmount": 50000,
  "startDate": "2024-02-01",
  "endDate": "2024-02-29",
  "items": [
    {
      "category": "Food & Groceries",
      "allocatedAmount": 10000
    }
  ]
}
```

**Response:** (created budget object)

#### GET /api/budgets/:id
Get specific budget with details.

**Response:**
```json
{
  "id": "uuid",
  "name": "February Budget",
  "totalAmount": 50000,
  "spent": 35000,
  "remaining": 15000,
  "items": [
    {
      "id": "uuid",
      "category": "Food & Groceries",
      "allocated": 10000,
      "spent": 8500,
      "percentage": 85
    }
  ],
  "expenses": [...]
}
```

#### PATCH /api/budgets/:id
Update budget.

**Request:**
```json
{
  "name": "Updated Budget Name",
  "totalAmount": 55000
}
```

#### DELETE /api/budgets/:id
Delete budget.

### Expense Endpoints

#### GET /api/expenses
List expenses with filtering.

**Query Parameters:**
- `category`: Filter by category
- `dateFrom`: Start date
- `dateTo`: End date
- `minAmount`: Minimum amount
- `maxAmount`: Maximum amount
- `sortBy`: Sort field (date, amount)
- `sortOrder`: asc/desc
- `limit`: Results per page
- `offset`: Pagination offset

**Response:**
```json
{
  "expenses": [...],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

#### POST /api/expenses
Create expense.

**Request:**
```json
{
  "amount": 500,
  "category": "Food & Groceries",
  "description": "Weekly groceries",
  "expenseDate": "2024-02-15",
  "paymentMethod": "credit_card",
  "tags": ["groceries", "essentials"]
}
```

#### GET /api/expenses/:id
Get specific expense.

#### PATCH /api/expenses/:id
Update expense.

#### DELETE /api/expenses/:id
Delete expense.

### Calculator Endpoints

#### POST /api/calculators/emi
Calculate EMI for a loan.

**Request:**
```json
{
  "principal": 500000,
  "annualRate": 7.5,
  "tenureYears": 5,
  "processingFee": 5000
}
```

**Response:**
```json
{
  "monthlyEmi": 9911.75,
  "totalAmount": 594705,
  "totalInterest": 94705,
  "amortizationSchedule": [
    {
      "month": 1,
      "payment": 9911.75,
      "principal": 6829.79,
      "interest": 3081.96,
      "remainingBalance": 493170.21
    }
  ]
}
```

#### POST /api/calculators/tax
Calculate income tax.

**Request:**
```json
{
  "annualIncome": 750000,
  "age": 35,
  "investments": {
    "section80C": 150000,
    "section80D": 25000,
    "section80E": 50000
  },
  "financialYear": 2023
}
```

**Response:**
```json
{
  "grossIncome": 750000,
  "deductions": 225000,
  "taxableIncome": 525000,
  "incomeTax": 42562.50,
  "surcharge": 0,
  "cessTax": 0,
  "totalTax": 42562.50,
  "effectiveRate": 5.67,
  "breakdown": {...}
}
```

### Report Endpoints

#### GET /api/reports/summary
Get financial summary.

**Query Parameters:**
- `startDate`: Period start
- `endDate`: Period end

**Response:**
```json
{
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-02-29"
  },
  "income": {
    "total": 150000,
    "sources": {...}
  },
  "expenses": {
    "total": 85000,
    "byCategory": {...}
  },
  "savings": 65000,
  "savingsRate": 43.33
}
```

#### GET /api/reports/export/pdf
Export report as PDF.

**Query Parameters:**
- `type`: report type (summary, detailed)
- `startDate`, `endDate`: Period

#### GET /api/reports/export/csv
Export data as CSV.

## Authentication & Authorization

### Authentication Flow

Money Manager India uses Supabase Auth for secure user authentication:

1. **Sign Up/Login**: User credentials sent to Supabase Auth
2. **Token Generation**: Supabase returns JWT token
3. **Session Management**: JWT stored in HTTP-only cookie
4. **Verification**: Supabase middleware verifies token on each request

### Authorization

#### Row-Level Security (RLS)

Every data table has RLS policies enforcing that:
- Users can only see their own data
- Users can only modify their own data
- Service role bypasses RLS (for admin operations)

#### API Route Protection

```typescript
// Example API route with auth
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // RLS automatically filters data to current user
  const { data: budgets } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)

  return Response.json({ budgets })
}
```

## External Data Integration

### Loan Rate Scraping

**Strategy**: Periodic batch scraping of loan rates from official sources.

**Schedule**: Every 6 hours (configurable via environment)

**Implementation**:
```
1. Trigger: Scheduled job or webhook
2. Scrape: RBI, MCLR data, bank websites
3. Parse: Extract rates and terms
4. Validate: Compare with historical data
5. Store: Update loan_rates table with timestamp
6. Notify: Update clients via Realtime subscription
```

**Database Update**:
```sql
-- Update with new rates
INSERT INTO loan_rates (loan_type, bank_name, interest_rate, last_updated)
VALUES ('home_loan', 'HDFC Bank', 7.45, now())
ON CONFLICT (loan_type, bank_name) DO UPDATE
SET interest_rate = 7.45, last_updated = now()
```

### Tax Content Sync

**Strategy**: Periodically sync official tax information and slab changes.

**Schedule**: Daily at 2 AM IST, or after notification of changes

**Sources**:
- Income Tax Department official portal
- CBDT announcements
- RBI circulars

**Implementation**:
```
1. Check: Monitor for tax rate changes
2. Parse: Extract updated slabs and rules
3. Validate: Cross-check against previous data
4. Update: Store in tax_content table
5. Cache: Invalidate frontend cache
6. Notify: Alert users of significant changes
```

## Security Design

### Transport Security

- **HTTPS Only**: All communications encrypted with TLS 1.3
- **HSTS**: HTTP Strict-Transport-Security header set
- **CSP**: Content Security Policy headers configured
- **CORS**: Strict CORS policies configured

### Authentication Security

- **JWT Tokens**: Secure JWT issued by Supabase
- **HTTP-Only Cookies**: Auth tokens in HTTP-only, secure cookies
- **Token Refresh**: Automatic token refresh before expiry
- **Session Timeout**: 7-day session with optional re-authentication

### Data Security

- **Encryption at Rest**: Database encryption enabled
- **Encryption in Transit**: All data encrypted during transmission
- **Field-Level Encryption**: Sensitive fields encrypted at application level
- **RLS Enforcement**: All tables have RLS policies
- **Audit Logging**: All data modifications logged

### Input Validation

- **Frontend Validation**: Zod schemas for all inputs
- **Server Validation**: Re-validate all inputs on server
- **SQL Injection Prevention**: Parameterized queries
- **XSS Prevention**: React automatic escaping
- **CSRF Protection**: SameSite cookie attributes

### API Security

- **Rate Limiting**: 100 requests per minute per user
- **API Keys**: Never exposed, always server-side
- **Service Role Key**: Only used server-side
- **Request Signing**: Optional request signing for sensitive operations

### Password Security

- **Hashing**: bcrypt with 12 salt rounds (Supabase Auth)
- **Minimum Requirements**: At least 8 characters, mixed case and numbers
- **Reset Flow**: Secure token-based password reset
- **No Reset Emails**: Password reset link expires in 1 hour

## Analytics & Event Tracking

### Event Tracking

Events are tracked for:
- User sign-up/login
- Feature usage (budgets, expenses, calculators)
- Report generation
- Data exports
- Error events

**Implementation**:
```typescript
// Event tracking
import { trackEvent } from '@/lib/analytics'

trackEvent('budget_created', {
  budgetAmount: 50000,
  itemCount: 5,
  timestamp: new Date()
})
```

### Dashboard Metrics

Tracked metrics include:
- Daily/monthly active users
- Feature adoption rates
- Calculator usage patterns
- Report generation frequency
- User retention rates

### Privacy Considerations

- No personally identifiable information in analytics
- Anonymous event tracking with user IDs hashed
- User can opt-out of analytics
- Analytics data not shared with third parties

## Deployment Architecture

### Environment Strategy

#### Development
- Local development with Supabase local setup
- Hot reload enabled
- Verbose logging
- No rate limiting

#### Staging
- Staging Supabase project
- Same infrastructure as production
- Full test data set
- Monitoring enabled

#### Production
- Production Supabase project
- Vercel production deployment
- CDN enabled
- Full monitoring and alerting

### Deployment Pipeline

```
Git Push (main)
    ↓
GitHub Actions CI/CD
    ├─ Lint
    ├─ Type Check
    ├─ Tests
    └─ Build
    ↓
Build Successful?
    ├─ Yes → Vercel Auto Deploy
    │         ├─ Build Next.js
    │         ├─ Run migrations (if needed)
    │         └─ Deploy to Edge
    └─ No → Notification to team
```

### Database Migrations

Migrations are managed via Supabase migrations:

```bash
# Create migration
supabase migration new add_new_table

# Run migrations
supabase db push

# Deploy migrations
# Automatic with Vercel deployment
```

## Scaling Considerations

### Current Architecture

- Suitable for up to 100k users
- Database connection pooling enabled
- CDN caching for static assets
- API rate limiting per user

### Scaling Strategies

#### Horizontal Scaling
1. **Database**: Enable read replicas for reporting queries
2. **Cache**: Redis cache for frequently accessed data
3. **Queue**: Bull/BullMQ for background jobs

#### Vertical Scaling
1. **Database**: Upgrade Supabase tier
2. **Vercel**: Increase function timeout and memory
3. **CDN**: Enhanced caching rules

#### Data Optimization
1. **Archiving**: Move old data to cold storage
2. **Indexing**: Add indexes on frequently queried columns
3. **Partitioning**: Partition large tables by date

### Performance Optimization

- NextImage optimization
- Code splitting and lazy loading
- Compression of API responses
- Browser caching headers
- Database query optimization

## Monitoring & Observability

### Health Checks

- Endpoint availability monitoring
- Database connectivity checks
- Auth service health
- Third-party service status

### Logging

- Application logs: Vercel built-in logging
- Error tracking: Sentry (optional)
- Database logs: Supabase logs
- Access logs: Vercel analytics

### Alerting

Alerts for:
- High error rates (>1%)
- Database performance degradation
- Auth service outages
- Disk space issues
- Memory leaks

---

For more detailed information, see:
- [API Reference](./API.md)
- [Contributing Guidelines](../CONTRIBUTING.md)
- [Release Checklist](../RELEASE_CHECKLIST.md)
