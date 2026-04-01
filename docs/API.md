# Money Manager India - API Reference

Complete API documentation for Money Manager India backend endpoints.

## Table of Contents

1. [Authentication](#authentication)
2. [Budgets](#budgets)
3. [Expenses](#expenses)
4. [Income](#income)
5. [Investments](#investments)
6. [Calculators](#calculators)
7. [Reports](#reports)
8. [User Profile](#user-profile)
9. [Settings](#settings)
10. [Error Handling](#error-handling)
11. [Rate Limiting](#rate-limiting)

## Base URL

```
Development: http://localhost:3000/api
Production: https://money-manager-india.vercel.app/api
```

## Authentication

All endpoints require authentication via HTTP-only cookie session or Bearer token.

### Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "John Doe",
    "createdAt": "2024-02-15T10:30:00Z"
  },
  "session": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

**Error Responses**:
- 400: Invalid input or email already exists
- 422: Validation error

---

### Login User

Authenticate and create session.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "John Doe"
  },
  "session": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

**Error Responses**:
- 401: Invalid credentials
- 404: User not found

---

### Logout User

Invalidate current session.

**Endpoint**: `POST /api/auth/logout`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

### Refresh Token

Get new access token using refresh token.

**Endpoint**: `POST /api/auth/refresh`

**Response** (200 OK):
```json
{
  "success": true,
  "session": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

---

### Reset Password

Request password reset token.

**Endpoint**: `POST /api/auth/reset-password`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### Confirm Password Reset

Confirm password reset with token.

**Endpoint**: `POST /api/auth/reset-password/confirm`

**Request Body**:
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewSecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## Budgets

### List Budgets

Get all budgets for authenticated user with optional filtering.

**Endpoint**: `GET /api/budgets`

**Query Parameters**:
- `status` (optional): Filter by status - `active`, `archived`, `completed`
- `startDate` (optional): Filter budgets starting from date (YYYY-MM-DD)
- `endDate` (optional): Filter budgets ending before date (YYYY-MM-DD)
- `sortBy` (optional): Sort field - `name`, `amount`, `createdAt` (default: createdAt)
- `sortOrder` (optional): `asc` or `desc` (default: desc)
- `limit` (optional): Results per page (default: 20, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example**: `GET /api/budgets?status=active&sortBy=name&limit=10`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "budgets": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "February 2024 Budget",
        "totalAmount": 50000,
        "spent": 35000,
        "remaining": 15000,
        "startDate": "2024-02-01",
        "endDate": "2024-02-29",
        "status": "active",
        "progress": 70,
        "createdAt": "2024-02-01T09:00:00Z",
        "updatedAt": "2024-02-15T14:30:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "pageSize": 20,
      "hasMore": false
    }
  }
}
```

---

### Get Budget Details

Get specific budget with all associated items and recent expenses.

**Endpoint**: `GET /api/budgets/:budgetId`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "February 2024 Budget",
    "totalAmount": 50000,
    "spent": 35000,
    "remaining": 15000,
    "startDate": "2024-02-01",
    "endDate": "2024-02-29",
    "status": "active",
    "progress": 70,
    "items": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "category": "Food & Groceries",
        "allocatedAmount": 10000,
        "spent": 8500,
        "remaining": 1500,
        "progress": 85,
        "expenses": 12
      },
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "category": "Transportation",
        "allocatedAmount": 8000,
        "spent": 6500,
        "remaining": 1500,
        "progress": 81,
        "expenses": 8
      }
    ],
    "recentExpenses": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440000",
        "amount": 500,
        "category": "Food & Groceries",
        "description": "Weekly groceries",
        "expenseDate": "2024-02-15"
      }
    ],
    "createdAt": "2024-02-01T09:00:00Z",
    "updatedAt": "2024-02-15T14:30:00Z"
  }
}
```

**Error Responses**:
- 404: Budget not found
- 403: Not authorized to view this budget

---

### Create Budget

Create new budget with items.

**Endpoint**: `POST /api/budgets`

**Request Body**:
```json
{
  "name": "March 2024 Budget",
  "totalAmount": 55000,
  "startDate": "2024-03-01",
  "endDate": "2024-03-31",
  "items": [
    {
      "category": "Food & Groceries",
      "allocatedAmount": 12000
    },
    {
      "category": "Transportation",
      "allocatedAmount": 8000
    },
    {
      "category": "Entertainment",
      "allocatedAmount": 5000
    }
  ]
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "name": "March 2024 Budget",
    "totalAmount": 55000,
    "spent": 0,
    "remaining": 55000,
    "startDate": "2024-03-01",
    "endDate": "2024-03-31",
    "status": "active",
    "progress": 0,
    "items": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440000",
        "category": "Food & Groceries",
        "allocatedAmount": 12000,
        "spent": 0,
        "remaining": 12000,
        "progress": 0
      }
    ],
    "createdAt": "2024-02-15T15:00:00Z"
  }
}
```

**Error Responses**:
- 400: Invalid data or duplicate budget name
- 422: Validation error

---

### Update Budget

Update budget details and items.

**Endpoint**: `PATCH /api/budgets/:budgetId`

**Request Body** (all optional):
```json
{
  "name": "Updated Budget Name",
  "totalAmount": 60000,
  "status": "archived",
  "items": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "category": "Food & Groceries",
      "allocatedAmount": 13000
    }
  ]
}
```

**Response** (200 OK): Updated budget object

---

### Delete Budget

Delete budget and associated items.

**Endpoint**: `DELETE /api/budgets/:budgetId`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Budget deleted successfully"
}
```

**Error Responses**:
- 404: Budget not found
- 403: Not authorized

---

## Expenses

### List Expenses

Get all expenses with advanced filtering.

**Endpoint**: `GET /api/expenses`

**Query Parameters**:
- `budgetId` (optional): Filter by budget
- `category` (optional): Filter by category
- `dateFrom` (optional): Start date (YYYY-MM-DD)
- `dateTo` (optional): End date (YYYY-MM-DD)
- `minAmount` (optional): Minimum amount
- `maxAmount` (optional): Maximum amount
- `paymentMethod` (optional): Filter by payment method
- `tags` (optional): Comma-separated tags
- `search` (optional): Search in description
- `sortBy` (optional): `date`, `amount`, `category` (default: date)
- `sortOrder` (optional): `asc` or `desc` (default: desc)
- `limit` (optional): Results per page (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

**Example**: `GET /api/expenses?category=Food&dateFrom=2024-02-01&dateTo=2024-02-29&sortBy=amount&sortOrder=desc`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "id": "bb0e8400-e29b-41d4-a716-446655440000",
        "amount": 750,
        "category": "Food & Groceries",
        "description": "Weekly groceries from BigBasket",
        "expenseDate": "2024-02-15",
        "paymentMethod": "credit_card",
        "tags": ["groceries", "weekly"],
        "budgetId": "550e8400-e29b-41d4-a716-446655440000",
        "createdAt": "2024-02-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "pageSize": 50,
      "hasMore": false
    },
    "summary": {
      "totalExpenses": 35000,
      "count": 45,
      "average": 777.78,
      "byCategory": {
        "Food & Groceries": 8500,
        "Transportation": 6500,
        "Entertainment": 5000
      }
    }
  }
}
```

---

### Get Expense Details

Get specific expense.

**Endpoint**: `GET /api/expenses/:expenseId`

**Response** (200 OK): Single expense object

---

### Create Expense

Create new expense.

**Endpoint**: `POST /api/expenses`

**Request Body**:
```json
{
  "amount": 500,
  "category": "Food & Groceries",
  "description": "Dinner at restaurant",
  "expenseDate": "2024-02-15",
  "paymentMethod": "credit_card",
  "budgetId": "550e8400-e29b-41d4-a716-446655440000",
  "tags": ["dining", "weekly"]
}
```

**Response** (201 Created): Created expense object

**Error Responses**:
- 400: Invalid data
- 422: Validation error

---

### Update Expense

Update expense details.

**Endpoint**: `PATCH /api/expenses/:expenseId`

**Request Body** (all optional):
```json
{
  "amount": 600,
  "category": "Food & Groceries",
  "description": "Updated description",
  "paymentMethod": "debit_card",
  "tags": ["dining", "social"]
}
```

**Response** (200 OK): Updated expense object

---

### Delete Expense

Delete expense.

**Endpoint**: `DELETE /api/expenses/:expenseId`

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

---

### Bulk Delete Expenses

Delete multiple expenses.

**Endpoint**: `POST /api/expenses/bulk-delete`

**Request Body**:
```json
{
  "expenseIds": [
    "bb0e8400-e29b-41d4-a716-446655440000",
    "cc0e8400-e29b-41d4-a716-446655440000"
  ]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "deleted": 2,
  "message": "2 expenses deleted successfully"
}
```

---

## Income

### List Income Sources

Get all income records.

**Endpoint**: `GET /api/income`

**Query Parameters**:
- `dateFrom` (optional): Start date
- `dateTo` (optional): End date
- `frequency` (optional): Filter by frequency (monthly, yearly, one-time)
- `sortBy` (optional): `date`, `amount` (default: date)
- `sortOrder` (optional): `asc` or `desc` (default: desc)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "income": [
      {
        "id": "dd0e8400-e29b-41d4-a716-446655440000",
        "sourceName": "Salary",
        "amount": 100000,
        "frequency": "monthly",
        "incomeDate": "2024-02-01",
        "isTaxable": true,
        "createdAt": "2024-02-01T09:00:00Z"
      },
      {
        "id": "ee0e8400-e29b-41d4-a716-446655440000",
        "sourceName": "Freelance Project",
        "amount": 25000,
        "frequency": "one-time",
        "incomeDate": "2024-02-10",
        "isTaxable": true,
        "createdAt": "2024-02-10T14:00:00Z"
      }
    ],
    "summary": {
      "totalIncome": 125000,
      "byFrequency": {
        "monthly": 100000,
        "yearly": 0,
        "one-time": 25000
      },
      "monthlyAverage": 108333.33
    }
  }
}
```

---

### Create Income

Add new income source.

**Endpoint**: `POST /api/income`

**Request Body**:
```json
{
  "sourceName": "Bonus",
  "amount": 50000,
  "frequency": "one-time",
  "incomeDate": "2024-02-20",
  "isTaxable": true
}
```

**Response** (201 Created): Created income object

---

### Update Income

Update income record.

**Endpoint**: `PATCH /api/income/:incomeId`

**Response** (200 OK): Updated income object

---

### Delete Income

Delete income record.

**Endpoint**: `DELETE /api/income/:incomeId`

**Response** (200 OK): Success message

---

## Investments

### List Investments

Get all investments.

**Endpoint**: `GET /api/investments`

**Query Parameters**:
- `type` (optional): Filter by type (stocks, mutual_funds, bonds, ppf, nps)
- `sortBy` (optional): `date`, `amount`, `value` (default: date)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "investments": [
      {
        "id": "ff0e8400-e29b-41d4-a716-446655440000",
        "name": "Axis Bluechip Fund",
        "type": "mutual_funds",
        "amount": 50000,
        "currentValue": 56000,
        "gain": 6000,
        "gainPercentage": 12,
        "investmentDate": "2023-01-15",
        "createdAt": "2023-01-15T10:00:00Z"
      }
    ],
    "summary": {
      "totalInvested": 150000,
      "totalCurrentValue": 175000,
      "totalGain": 25000,
      "gainPercentage": 16.67,
      "byType": {
        "mutual_funds": 100000,
        "stocks": 50000
      }
    }
  }
}
```

---

### Create Investment

Add new investment.

**Endpoint**: `POST /api/investments`

**Request Body**:
```json
{
  "name": "Reliance Industries",
  "type": "stocks",
  "amount": 25000,
  "investmentDate": "2024-02-15"
}
```

**Response** (201 Created): Created investment object

---

### Update Investment Value

Update current investment value.

**Endpoint**: `PATCH /api/investments/:investmentId`

**Request Body**:
```json
{
  "currentValue": 28000
}
```

**Response** (200 OK): Updated investment object

---

### Delete Investment

Delete investment record.

**Endpoint**: `DELETE /api/investments/:investmentId`

**Response** (200 OK): Success message

---

## Calculators

### EMI Calculator

Calculate EMI for loans.

**Endpoint**: `POST /api/calculators/emi`

**Request Body**:
```json
{
  "principal": 2500000,
  "annualRate": 7.5,
  "tenureYears": 20,
  "processingFee": 50000,
  "loanType": "home_loan"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "inputs": {
      "principal": 2500000,
      "processingFee": 50000,
      "totalLoanAmount": 2550000,
      "annualRate": 7.5,
      "monthlyRate": 0.625,
      "tenure": 20,
      "totalMonths": 240
    },
    "results": {
      "monthlyEmi": 18030.90,
      "totalPayment": 4327416,
      "totalInterest": 1777416
    },
    "breakdown": {
      "principal": 2550000,
      "interest": 1777416,
      "processingFee": 50000,
      "totalAmount": 4377416
    },
    "amortizationSchedule": [
      {
        "month": 1,
        "payment": 18030.90,
        "principal": 2656.90,
        "interest": 15374,
        "remainingBalance": 2547343.10
      }
    ]
  }
}
```

---

### Tax Calculator

Calculate income tax based on Indian tax slabs.

**Endpoint**: `POST /api/calculators/tax`

**Request Body**:
```json
{
  "annualIncome": 750000,
  "age": 35,
  "regime": "new",
  "financialYear": 2024,
  "deductions": {
    "section80C": 150000,
    "section80D": 25000,
    "section80E": 50000
  },
  "capitalGains": {
    "longTerm": 100000,
    "shortTerm": 50000
  }
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "inputs": {
      "annualIncome": 750000,
      "age": 35,
      "regime": "new",
      "financialYear": "2023-24"
    },
    "deductions": {
      "section80C": 150000,
      "section80D": 25000,
      "section80E": 50000,
      "totalDeductions": 225000,
      "taxableIncome": 525000
    },
    "taxCalculation": {
      "slab": "5-10 lakhs",
      "incomeTax": 42562.50,
      "surcharge": 0,
      "cess": 2562.50,
      "totalTax": 45125
    },
    "summary": {
      "grossIncome": 750000,
      "deductions": 225000,
      "taxableIncome": 525000,
      "totalTax": 45125,
      "effectiveTaxRate": 6.02,
      "afterTaxIncome": 704875
    }
  }
}
```

---

### Salary Analyzer

Break down salary components.

**Endpoint**: `POST /api/calculators/salary-analyzer`

**Request Body**:
```json
{
  "baseSalary": 60000,
  "houseRentAllowance": 15000,
  "dearessAllowance": 10000,
  "conveyanceAllowance": 2000,
  "medicalAllowance": 3000,
  "other": 10000,
  "pfContribution": 10000,
  "gratuity": 5000,
  "monthlyFrequency": true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "components": {
      "gross": {
        "baseSalary": 60000,
        "allowances": 40000,
        "totalGross": 100000
      },
      "deductions": {
        "pfContribution": 10000,
        "incomeTax": 8000,
        "otherDeductions": 2000,
        "totalDeductions": 20000
      }
    },
    "netSalary": 80000,
    "annual": {
      "grossSalary": 1200000,
      "totalDeductions": 240000,
      "netSalary": 960000
    }
  }
}
```

---

## Reports

### Financial Summary

Get summary of finances for period.

**Endpoint**: `GET /api/reports/summary`

**Query Parameters**:
- `startDate` (optional): Period start (default: first of month)
- `endDate` (optional): Period end (default: today)
- `period` (optional): `week`, `month`, `quarter`, `year`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-02-01",
      "endDate": "2024-02-29",
      "days": 29
    },
    "income": {
      "total": 125000,
      "sources": {
        "Salary": 100000,
        "Freelance": 25000
      }
    },
    "expenses": {
      "total": 85000,
      "byCategory": {
        "Food & Groceries": 15000,
        "Transportation": 12000,
        "Entertainment": 8000,
        "Utilities": 6000,
        "Other": 44000
      }
    },
    "savings": 40000,
    "savingsRate": 32,
    "budgetStatus": {
      "budgets": 1,
      "onTrack": 1,
      "overBudget": 0,
      "completed": 0
    }
  }
}
```

---

### Category Analysis

Get detailed expense analysis by category.

**Endpoint**: `GET /api/reports/category-analysis`

**Query Parameters**:
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category": "Food & Groceries",
        "total": 15000,
        "count": 32,
        "average": 468.75,
        "percentage": 17.6,
        "trend": "up"
      }
    ],
    "totalExpenses": 85000,
    "chartData": [
      {
        "name": "Food & Groceries",
        "value": 15000
      }
    ]
  }
}
```

---

### Export to PDF

Export financial report as PDF.

**Endpoint**: `GET /api/reports/export/pdf`

**Query Parameters**:
- `type`: Report type - `summary`, `detailed`, `tax`, `budget`
- `startDate` (optional): Start date
- `endDate` (optional): End date
- `format` (optional): `portrait`, `landscape` (default: portrait)

**Response**: PDF file (Content-Type: application/pdf)

---

### Export to CSV

Export data as CSV.

**Endpoint**: `GET /api/reports/export/csv`

**Query Parameters**:
- `dataType`: `expenses`, `income`, `budgets`, `investments`
- `startDate` (optional): Start date
- `endDate` (optional): End date

**Response**: CSV file (Content-Type: text/csv)

---

## User Profile

### Get Current User

Get authenticated user profile.

**Endpoint**: `GET /api/user/profile`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatarUrl": "https://...",
    "currency": "INR",
    "timezone": "Asia/Kolkata",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

### Update User Profile

Update user information.

**Endpoint**: `PATCH /api/user/profile`

**Request Body**:
```json
{
  "fullName": "John Doe Updated",
  "avatarUrl": "https://...",
  "timezone": "Asia/Kolkata"
}
```

**Response** (200 OK): Updated user object

---

### Change Password

Change account password.

**Endpoint**: `POST /api/user/change-password`

**Request Body**:
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### Delete Account

Delete user account and all data.

**Endpoint**: `DELETE /api/user/account`

**Request Body**:
```json
{
  "password": "AccountPassword123!",
  "confirm": true
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## Settings

### Get Settings

Get user preferences and settings.

**Endpoint**: `GET /api/settings`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "notifications": {
      "emailAlerts": true,
      "budgetAlerts": true,
      "expenseReminders": true
    },
    "privacy": {
      "profilePublic": false,
      "shareAnalytics": true
    },
    "display": {
      "theme": "light",
      "dateFormat": "DD/MM/YYYY",
      "currency": "INR"
    }
  }
}
```

---

### Update Settings

Update user settings.

**Endpoint**: `PATCH /api/settings`

**Request Body**:
```json
{
  "notifications": {
    "emailAlerts": false
  },
  "display": {
    "theme": "dark"
  }
}
```

**Response** (200 OK): Updated settings object

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes

- **200 OK**: Successful GET request
- **201 Created**: Successful POST request
- **204 No Content**: Successful DELETE request
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Not authorized for resource
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict
- **422 Unprocessable Entity**: Validation error
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error
- **503 Service Unavailable**: Service temporarily unavailable

---

## Rate Limiting

API requests are rate-limited to prevent abuse.

**Limits**:
- 100 requests per minute per user
- 1000 requests per hour per user
- 10000 requests per day per user

**Headers**:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp of reset time

When rate limit exceeded:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```

---

## Pagination

List endpoints support pagination.

**Default**: 20 items per page, maximum 100.

**Response**:
```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "hasMore": true
  }
}
```

**Query Parameters**:
- `limit`: Items per page (1-100)
- `offset`: Number of items to skip

---

For more information, see [ARCHITECTURE.md](./ARCHITECTURE.md)
