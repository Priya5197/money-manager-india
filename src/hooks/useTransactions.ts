/**
 * useTransactions Hook
 * CRUD operations for transactions with Supabase
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  category: string;
  type: "expense" | "income" | "transfer";
  amount: number;
  date: string;
  description?: string;
  paymentMethod?: string;
  tags?: string[];
  receipt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: "expense" | "income" | "transfer";
  accountId?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface UseTransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: PostgrestError | null;
}

export interface UseTransactionsActions {
  fetchTransactions: (filter?: TransactionFilter) => Promise<void>;
  createTransaction: (data: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => Promise<Transaction | null>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<Transaction | null>;
  deleteTransaction: (id: string) => Promise<boolean>;
  bulkDeleteTransactions: (ids: string[]) => Promise<boolean>;
  getTransactionById: (id: string) => Promise<Transaction | null>;
  getTransactionsByAccount: (accountId: string) => Promise<Transaction[]>;
  getTransactionsByCategory: (category: string) => Promise<Transaction[]>;
}

export type UseTransactionsReturn = UseTransactionsState & UseTransactionsActions;

/**
 * useTransactions Hook
 */
export function useTransactions(userId: string): UseTransactionsReturn {
  const [state, setState] = useState<UseTransactionsState>({
    transactions: [],
    loading: true,
    error: null,
  });

  const supabase = createClient();

  // Fetch transactions
  const fetchTransactions = useCallback(
    async (filter?: TransactionFilter) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        let query = supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId);

        // Apply filters
        if (filter?.accountId) {
          query = query.eq("account_id", filter.accountId);
        }
        if (filter?.category) {
          query = query.eq("category", filter.category);
        }
        if (filter?.type) {
          query = query.eq("type", filter.type);
        }
        if (filter?.startDate) {
          query = query.gte("date", filter.startDate);
        }
        if (filter?.endDate) {
          query = query.lte("date", filter.endDate);
        }
        if (filter?.minAmount !== undefined) {
          query = query.gte("amount", filter.minAmount);
        }
        if (filter?.maxAmount !== undefined) {
          query = query.lte("amount", filter.maxAmount);
        }

        const { data, error } = await query.order("date", { ascending: false });

        if (error) {
          setState((prev) => ({ ...prev, error }));
        } else {
          setState({
            transactions: data || [],
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch transactions" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
      }
    },
    [userId, supabase]
  );

  // Load transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Create transaction
  const createTransaction = useCallback(
    async (data: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => {
      try {
        const { data: createdData, error } = await supabase
          .from("transactions")
          .insert([
            {
              user_id: data.userId,
              account_id: data.accountId,
              category: data.category,
              type: data.type,
              amount: data.amount,
              date: data.date,
              description: data.description,
              payment_method: data.paymentMethod,
              tags: data.tags,
              receipt: data.receipt,
            },
          ])
          .select()
          .single();

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return null;
        }

        setState((prev) => ({
          ...prev,
          transactions: [createdData, ...prev.transactions],
        }));

        return createdData;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to create transaction" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return null;
      }
    },
    [supabase]
  );

  // Update transaction
  const updateTransaction = useCallback(
    async (id: string, data: Partial<Transaction>) => {
      try {
        const updateData: Record<string, unknown> = {};

        if (data.category) updateData.category = data.category;
        if (data.type) updateData.type = data.type;
        if (data.amount !== undefined) updateData.amount = data.amount;
        if (data.date) updateData.date = data.date;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.paymentMethod) updateData.payment_method = data.paymentMethod;
        if (data.tags) updateData.tags = data.tags;
        if (data.receipt) updateData.receipt = data.receipt;

        const { data: updatedData, error } = await supabase
          .from("transactions")
          .update(updateData)
          .eq("id", id)
          .select()
          .single();

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return null;
        }

        setState((prev) => ({
          ...prev,
          transactions: prev.transactions.map((tx) =>
            tx.id === id ? updatedData : tx
          ),
        }));

        return updatedData;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to update transaction" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return null;
      }
    },
    [supabase]
  );

  // Delete transaction
  const deleteTransaction = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from("transactions")
          .delete()
          .eq("id", id);

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return false;
        }

        setState((prev) => ({
          ...prev,
          transactions: prev.transactions.filter((tx) => tx.id !== id),
        }));

        return true;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to delete transaction" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return false;
      }
    },
    [supabase]
  );

  // Bulk delete transactions
  const bulkDeleteTransactions = useCallback(
    async (ids: string[]) => {
      try {
        const { error } = await supabase
          .from("transactions")
          .delete()
          .in("id", ids);

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return false;
        }

        setState((prev) => ({
          ...prev,
          transactions: prev.transactions.filter((tx) => !ids.includes(tx.id)),
        }));

        return true;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to delete transactions" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return false;
      }
    },
    [supabase]
  );

  // Get transaction by ID
  const getTransactionById = useCallback(
    async (id: string) => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("id", id)
          .eq("user_id", userId)
          .single();

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return null;
        }

        return data;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch transaction" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return null;
      }
    },
    [userId, supabase]
  );

  // Get transactions by account
  const getTransactionsByAccount = useCallback(
    async (accountId: string) => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .eq("account_id", accountId)
          .order("date", { ascending: false });

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return [];
        }

        return data || [];
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch transactions" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return [];
      }
    },
    [userId, supabase]
  );

  // Get transactions by category
  const getTransactionsByCategory = useCallback(
    async (category: string) => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .eq("category", category)
          .order("date", { ascending: false });

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return [];
        }

        return data || [];
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch transactions" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return [];
      }
    },
    [userId, supabase]
  );

  return {
    ...state,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    bulkDeleteTransactions,
    getTransactionById,
    getTransactionsByAccount,
    getTransactionsByCategory,
  };
}
