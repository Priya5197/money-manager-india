-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');
CREATE TYPE account_type AS ENUM ('cash', 'bank', 'credit_card', 'wallet', 'investment', 'loan');
CREATE TYPE payment_mode AS ENUM ('cash', 'upi', 'card', 'netbanking', 'cheque', 'wallet', 'other');
CREATE TYPE theme_preference AS ENUM ('light', 'dark', 'system');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text,
  city text,
  state text,
  currency text DEFAULT 'INR' NOT NULL,
  marketing_consent boolean DEFAULT false,
  marketing_consent_at timestamptz,
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz,
  CONSTRAINT currency_valid CHECK (currency IN ('INR', 'USD', 'EUR', 'GBP')),
  CONSTRAINT marketing_consent_requires_timestamp CHECK (
    (marketing_consent = false AND marketing_consent_at IS NULL) OR
    (marketing_consent = true AND marketing_consent_at IS NOT NULL)
  )
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type transaction_type NOT NULL,
  icon text NOT NULL DEFAULT '📁',
  color text NOT NULL DEFAULT '#6B7280',
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  is_default boolean DEFAULT false,
  is_archived boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT user_or_default CHECK ((user_id IS NULL AND is_default = true) OR user_id IS NOT NULL),
  CONSTRAINT category_name_unique_per_user UNIQUE NULLS NOT DISTINCT (user_id, name, type),
  CONSTRAINT color_format CHECK (color ~ '^\#[0-9A-Fa-f]{6}$')
);

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type account_type NOT NULL,
  balance decimal(15, 2) NOT NULL DEFAULT 0.00,
  icon text NOT NULL DEFAULT '💳',
  color text NOT NULL DEFAULT '#6B7280',
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT account_name_unique_per_user UNIQUE (user_id, name),
  CONSTRAINT color_format CHECK (color ~ '^\#[0-9A-Fa-f]{6}$'),
  CONSTRAINT balance_valid CHECK (type = 'loan' OR balance >= 0)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  type transaction_type NOT NULL,
  amount decimal(15, 2) NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  tags text[] DEFAULT '{}',
  payment_mode payment_mode DEFAULT 'cash',
  merchant text,
  is_recurring boolean DEFAULT false,
  recurring_config jsonb,
  transfer_to_account_id uuid REFERENCES accounts(id) ON DELETE RESTRICT,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT amount_positive CHECK (amount > 0),
  CONSTRAINT transfer_has_target CHECK (
    (type != 'transfer' AND transfer_to_account_id IS NULL) OR
    (type = 'transfer' AND transfer_to_account_id IS NOT NULL)
  ),
  CONSTRAINT transfer_different_accounts CHECK (
    type != 'transfer' OR account_id != transfer_to_account_id
  ),
  CONSTRAINT recurring_config_when_recurring CHECK (
    (is_recurring = false AND recurring_config IS NULL) OR
    (is_recurring = true AND recurring_config IS NOT NULL)
  )
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  amount decimal(15, 2) NOT NULL,
  month integer NOT NULL,
  year integer NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_month CHECK (month >= 1 AND month <= 12),
  CONSTRAINT valid_year CHECK (year >= 1900 AND year <= 2100),
  CONSTRAINT amount_positive CHECK (amount > 0),
  UNIQUE (user_id, category_id, month, year)
);

-- Salary history table
CREATE TABLE IF NOT EXISTS salary_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year integer NOT NULL,
  month integer NOT NULL,
  gross_salary decimal(15, 2) NOT NULL,
  net_salary decimal(15, 2) NOT NULL,
  employer text,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT valid_month CHECK (month >= 1 AND month <= 12),
  CONSTRAINT valid_year CHECK (year >= 1900 AND year <= 2100),
  CONSTRAINT salary_positive CHECK (gross_salary > 0 AND net_salary > 0),
  CONSTRAINT net_less_than_gross CHECK (net_salary <= gross_salary),
  UNIQUE (user_id, year, month)
);

-- Loan rates table (reference data for all users)
CREATE TABLE IF NOT EXISTS loan_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL,
  loan_type text NOT NULL,
  min_rate decimal(5, 2) NOT NULL,
  max_rate decimal(5, 2) NOT NULL,
  processing_fee text,
  source_url text,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT rate_valid CHECK (min_rate >= 0 AND max_rate >= min_rate),
  UNIQUE (bank_name, loan_type, fetched_at)
);

-- Tax content table (reference data for all users)
CREATE TABLE IF NOT EXISTS tax_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  source_url text,
  financial_year text,
  last_verified_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Consent log table
CREATE TABLE IF NOT EXISTS consent_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type text NOT NULL,
  consented boolean NOT NULL,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme theme_preference DEFAULT 'light' NOT NULL,
  notifications_enabled boolean DEFAULT true,
  default_account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for frequently queried columns
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_user_account ON transactions(user_id, account_id);
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category_id);
CREATE INDEX idx_transactions_user_type ON transactions(user_id, type);
CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_categories_user ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);
CREATE INDEX idx_categories_default ON categories(is_default) WHERE is_default = true;
CREATE INDEX idx_budgets_user_month_year ON budgets(user_id, month, year);
CREATE INDEX idx_salary_history_user_year_month ON salary_history(user_id, year, month);
CREATE INDEX idx_profiles_deleted_at ON profiles(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_accounts_user_archived ON accounts(user_id, is_archived);
CREATE INDEX idx_categories_user_archived ON categories(user_id, is_archived);
CREATE INDEX idx_consent_log_user ON consent_log(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for categories
CREATE POLICY "Users can view their own categories and defaults"
  ON categories FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for accounts
CREATE POLICY "Users can view their own accounts"
  ON accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own accounts"
  ON accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
  ON accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
  ON accounts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for budgets
CREATE POLICY "Users can view their own budgets"
  ON budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budgets"
  ON budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
  ON budgets FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
  ON budgets FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for salary_history
CREATE POLICY "Users can view their own salary history"
  ON salary_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own salary history"
  ON salary_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own salary history"
  ON salary_history FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own salary history"
  ON salary_history FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for consent_log
CREATE POLICY "Users can view their own consent logs"
  ON consent_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consent logs"
  ON consent_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for loan_rates (readable by all authenticated users)
CREATE POLICY "Authenticated users can view loan rates"
  ON loan_rates FOR SELECT
  USING (auth.role() = 'authenticated');

-- RLS Policies for tax_content (readable by all authenticated users)
CREATE POLICY "Authenticated users can view tax content"
  ON tax_content FOR SELECT
  USING (auth.role() = 'authenticated');

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (new.id, new.email, now(), now());

  INSERT INTO public.user_preferences (user_id, created_at, updated_at)
  VALUES (new.id, now(), now());

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to soft delete a user
CREATE OR REPLACE FUNCTION soft_delete_user(user_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET deleted_at = now(), updated_at = now()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at column
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
  BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_content_updated_at
  BEFORE UPDATE ON tax_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
