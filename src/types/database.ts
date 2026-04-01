export type TransactionType = 'income' | 'expense' | 'transfer';
export type AccountType = 'cash' | 'bank' | 'credit_card' | 'wallet' | 'investment' | 'loan';
export type PaymentMode = 'cash' | 'upi' | 'card' | 'netbanking' | 'cheque' | 'wallet' | 'other';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          city: string | null;
          state: string | null;
          currency: string;
          marketing_consent: boolean;
          marketing_consent_at: string | null;
          terms_accepted_at: string | null;
          privacy_accepted_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          city?: string | null;
          state?: string | null;
          currency?: string;
          marketing_consent?: boolean;
          marketing_consent_at?: string | null;
          terms_accepted_at?: string | null;
          privacy_accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          city?: string | null;
          state?: string | null;
          currency?: string;
          marketing_consent?: boolean;
          marketing_consent_at?: string | null;
          terms_accepted_at?: string | null;
          privacy_accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          type: TransactionType;
          icon: string;
          color: string;
          parent_id: string | null;
          is_default: boolean;
          is_archived: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          type: TransactionType;
          icon?: string;
          color?: string;
          parent_id?: string | null;
          is_default?: boolean;
          is_archived?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          type?: TransactionType;
          icon?: string;
          color?: string;
          parent_id?: string | null;
          is_default?: boolean;
          is_archived?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: AccountType;
          balance: string;
          icon: string;
          color: string;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: AccountType;
          balance?: string;
          icon?: string;
          color?: string;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          type?: AccountType;
          balance?: string;
          icon?: string;
          color?: string;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string;
          category_id: string;
          type: TransactionType;
          amount: string;
          date: string;
          notes: string | null;
          tags: string[];
          payment_mode: PaymentMode;
          merchant: string | null;
          is_recurring: boolean;
          recurring_config: Record<string, any> | null;
          transfer_to_account_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id: string;
          category_id: string;
          type: TransactionType;
          amount: string;
          date?: string;
          notes?: string | null;
          tags?: string[];
          payment_mode?: PaymentMode;
          merchant?: string | null;
          is_recurring?: boolean;
          recurring_config?: Record<string, any> | null;
          transfer_to_account_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string;
          category_id?: string;
          type?: TransactionType;
          amount?: string;
          date?: string;
          notes?: string | null;
          tags?: string[];
          payment_mode?: PaymentMode;
          merchant?: string | null;
          is_recurring?: boolean;
          recurring_config?: Record<string, any> | null;
          transfer_to_account_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          amount: string;
          month: number;
          year: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id?: string | null;
          amount: string;
          month: number;
          year: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string | null;
          amount?: string;
          month?: number;
          year?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      salary_history: {
        Row: {
          id: string;
          user_id: string;
          year: number;
          month: number;
          gross_salary: string;
          net_salary: string;
          employer: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          year: number;
          month: number;
          gross_salary: string;
          net_salary: string;
          employer?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          year?: number;
          month?: number;
          gross_salary?: string;
          net_salary?: string;
          employer?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      loan_rates: {
        Row: {
          id: string;
          bank_name: string;
          loan_type: string;
          min_rate: string;
          max_rate: string;
          processing_fee: string | null;
          source_url: string | null;
          fetched_at: string;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          bank_name: string;
          loan_type: string;
          min_rate: string;
          max_rate: string;
          processing_fee?: string | null;
          source_url?: string | null;
          fetched_at?: string;
          verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          bank_name?: string;
          loan_type?: string;
          min_rate?: string;
          max_rate?: string;
          processing_fee?: string | null;
          source_url?: string | null;
          fetched_at?: string;
          verified?: boolean;
          created_at?: string;
        };
      };
      tax_content: {
        Row: {
          id: string;
          section: string;
          title: string;
          content: string;
          source_url: string | null;
          financial_year: string | null;
          last_verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section: string;
          title: string;
          content: string;
          source_url?: string | null;
          financial_year?: string | null;
          last_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section?: string;
          title?: string;
          content?: string;
          source_url?: string | null;
          financial_year?: string | null;
          last_verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      consent_log: {
        Row: {
          id: string;
          user_id: string;
          consent_type: string;
          consented: boolean;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          consent_type: string;
          consented: boolean;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          consent_type?: string;
          consented?: boolean;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: ThemePreference;
          notifications_enabled: boolean;
          default_account_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          theme?: ThemePreference;
          notifications_enabled?: boolean;
          default_account_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          theme?: ThemePreference;
          notifications_enabled?: boolean;
          default_account_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      handle_new_user: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      soft_delete_user: {
        Args: {
          user_uuid: string;
        };
        Returns: void;
      };
      update_updated_at_column: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
    Enums: {
      transaction_type: TransactionType;
      account_type: AccountType;
      payment_mode: PaymentMode;
      theme_preference: ThemePreference;
    };
  };
}

// Helper types for row-level operations
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export type Account = Database['public']['Tables']['accounts']['Row'];
export type AccountInsert = Database['public']['Tables']['accounts']['Insert'];
export type AccountUpdate = Database['public']['Tables']['accounts']['Update'];

export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert'];
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export type Budget = Database['public']['Tables']['budgets']['Row'];
export type BudgetInsert = Database['public']['Tables']['budgets']['Insert'];
export type BudgetUpdate = Database['public']['Tables']['budgets']['Update'];

export type SalaryHistory = Database['public']['Tables']['salary_history']['Row'];
export type SalaryHistoryInsert = Database['public']['Tables']['salary_history']['Insert'];
export type SalaryHistoryUpdate = Database['public']['Tables']['salary_history']['Update'];

export type LoanRate = Database['public']['Tables']['loan_rates']['Row'];
export type LoanRateInsert = Database['public']['Tables']['loan_rates']['Insert'];
export type LoanRateUpdate = Database['public']['Tables']['loan_rates']['Update'];

export type TaxContent = Database['public']['Tables']['tax_content']['Row'];
export type TaxContentInsert = Database['public']['Tables']['tax_content']['Insert'];
export type TaxContentUpdate = Database['public']['Tables']['tax_content']['Update'];

export type ConsentLog = Database['public']['Tables']['consent_log']['Row'];
export type ConsentLogInsert = Database['public']['Tables']['consent_log']['Insert'];
export type ConsentLogUpdate = Database['public']['Tables']['consent_log']['Update'];

export type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];
export type UserPreferencesInsert = Database['public']['Tables']['user_preferences']['Insert'];
export type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update'];

// Decimal number type for financial data
export type Decimal = string | number;

// Numeric conversion helper
export const toDecimal = (value: Decimal): number => {
  return typeof value === 'string' ? parseFloat(value) : value;
};

export const fromDecimal = (value: number): string => {
  return value.toFixed(2);
};
