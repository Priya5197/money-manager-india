/**
 * Zod validation schemas for Money Manager India
 */

import { z } from "zod";

// Authentication schemas
export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be at most 100 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Transaction schema
export const transactionSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  accountId: z.string().uuid(),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["expense", "income", "transfer"]),
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(999999999, "Amount is too large"),
  date: z.string().or(z.date()).refine((date) => {
    const d = new Date(date);
    return !isNaN(d.getTime());
  }, "Invalid date"),
  description: z.string().max(500, "Description is too long").optional(),
  paymentMethod: z
    .enum(["cash", "card", "bank_transfer", "upi", "check"])
    .optional(),
  tags: z.array(z.string()).optional(),
  receipt: z.string().url().optional(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

// Budget schema
export const budgetSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  category: z.string().min(1, "Category is required"),
  limit: z
    .number()
    .positive("Budget limit must be positive")
    .max(999999999, "Amount is too large"),
  period: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(2000).max(2100).optional(),
  alertThreshold: z.number().min(50).max(100).default(80),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export type BudgetInput = z.infer<typeof budgetSchema>;

// Category schema
export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  name: z.string().min(1, "Category name is required").max(50),
  type: z.enum(["income", "expense"]),
  icon: z.string().optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
    .optional(),
  isDefault: z.boolean().default(false),
  createdAt: z.string().or(z.date()).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// Account schema
export const accountSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  name: z.string().min(1, "Account name is required").max(100),
  type: z.enum(["savings", "checking", "credit_card", "investment", "loan"]),
  bank: z.string().optional(),
  accountNumber: z.string().max(20).optional(),
  balance: z.number().default(0),
  currency: z.string().default("INR"),
  isActive: z.boolean().default(true),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export type AccountInput = z.infer<typeof accountSchema>;

// EMI Calculator schema
export const emiCalculatorSchema = z.object({
  principal: z
    .number()
    .positive("Principal must be positive")
    .max(999999999, "Amount is too large"),
  rate: z
    .number()
    .min(0, "Rate must be non-negative")
    .max(100, "Rate is too high"),
  tenureMonths: z
    .number()
    .int()
    .positive("Tenure must be positive")
    .max(600, "Tenure is too long"),
  processingFee: z.number().min(0).optional(),
  insurance: z.number().min(0).optional(),
});

export type EMICalculatorInput = z.infer<typeof emiCalculatorSchema>;

// Tax Calculator schema
export const taxCalculatorSchema = z.object({
  grossSalary: z
    .number()
    .positive("Gross salary must be positive")
    .max(999999999, "Amount is too large"),
  hra: z.number().min(0).optional(),
  lta: z.number().min(0).optional(),
  section80C: z.number().min(0).max(150000).optional(),
  section80D: z.number().min(0).optional(),
  section80CCD1B: z.number().min(0).max(50000).optional(),
  homeLoanInterest: z.number().min(0).optional(),
  otherDeductions: z.number().min(0).optional(),
  financialYear: z.enum(["2024-25", "2023-24"]),
  age: z.enum(["below-60", "60-80", "above-80"]),
});

export type TaxCalculatorInput = z.infer<typeof taxCalculatorSchema>;

// Salary history schema
export const salaryHistorySchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  year: z.number().min(2000).max(2100),
  salary: z
    .number()
    .positive("Salary must be positive")
    .max(999999999, "Amount is too large"),
  bonus: z.number().min(0).optional(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export type SalaryHistoryInput = z.infer<typeof salaryHistorySchema>;

// Profile schema
export const profileSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  fullName: z.string().min(1, "Full name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone must be 10 digits")
    .optional(),
  dateOfBirth: z.string().or(z.date()).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().regex(/^[0-9]{6}$/, "Pincode must be 6 digits").optional(),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/i, "Invalid PAN format")
    .optional(),
  cibilScore: z.number().min(0).max(900).optional(),
  occupation: z.string().optional(),
  monthlyIncome: z.number().min(0).optional(),
  preferredCurrency: z.string().default("INR"),
  timezone: z.string().default("Asia/Kolkata"),
  language: z.enum(["en", "hi"]).default("en"),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;

// Investment schema
export const investmentSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  type: z.enum(["sip", "lumpsum", "fd", "insurance", "gold", "real_estate"]),
  name: z.string().min(1, "Investment name is required"),
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(999999999, "Amount is too large"),
  currentValue: z.number().optional(),
  startDate: z.string().or(z.date()),
  maturityDate: z.string().or(z.date()).optional(),
  rate: z.number().min(0).max(100).optional(),
  risk: z.enum(["low", "medium", "high"]).optional(),
  notes: z.string().max(500).optional(),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export type InvestmentInput = z.infer<typeof investmentSchema>;

// Goal schema
export const goalSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  name: z.string().min(1, "Goal name is required").max(100),
  targetAmount: z
    .number()
    .positive("Target amount must be positive")
    .max(999999999, "Amount is too large"),
  currentAmount: z.number().min(0).default(0),
  targetDate: z.string().or(z.date()),
  category: z.enum(["education", "home", "car", "vacation", "emergency", "other"]),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  createdAt: z.string().or(z.date()).optional(),
  updatedAt: z.string().or(z.date()).optional(),
});

export type GoalInput = z.infer<typeof goalSchema>;
