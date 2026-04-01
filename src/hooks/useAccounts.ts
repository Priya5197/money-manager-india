/**
 * useAccounts Hook
 * CRUD operations for accounts with Supabase
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: "savings" | "checking" | "credit_card" | "investment" | "loan";
  bank?: string;
  accountNumber?: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UseAccountsState {
  accounts: Account[];
  loading: boolean;
  error: PostgrestError | null;
}

export interface UseAccountsActions {
  fetchAccounts: (includeInactive?: boolean) => Promise<void>;
  createAccount: (data: Omit<Account, "id" | "createdAt" | "updatedAt">) => Promise<Account | null>;
  updateAccount: (id: string, data: Partial<Account>) => Promise<Account | null>;
  deleteAccount: (id: string) => Promise<boolean>;
  getAccountById: (id: string) => Promise<Account | null>;
  getAccountsByType: (type: Account["type"]) => Promise<Account[]>;
  updateAccountBalance: (id: string, newBalance: number) => Promise<Account | null>;
  getTotalBalance: () => number;
  getActiveAccounts: () => Account[];
  deactivateAccount: (id: string) => Promise<boolean>;
}

export type UseAccountsReturn = UseAccountsState & UseAccountsActions;

/**
 * useAccounts Hook
 */
export function useAccounts(userId: string): UseAccountsReturn {
  const [state, setState] = useState<UseAccountsState>({
    accounts: [],
    loading: true,
    error: null,
  });

  const supabase = createClient();

  // Fetch accounts
  const fetchAccounts = useCallback(
    async (includeInactive: boolean = false) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        let query = supabase
          .from("accounts")
          .select("*")
          .eq("user_id", userId);

        if (!includeInactive) {
          query = query.eq("is_active", true);
        }

        const { data, error } = await query.order("created_at", {
          ascending: false,
        });

        if (error) {
          setState((prev) => ({ ...prev, error }));
        } else {
          setState({
            accounts: data || [],
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch accounts" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
      }
    },
    [userId, supabase]
  );

  // Load accounts on mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Create account
  const createAccount = useCallback(
    async (data: Omit<Account, "id" | "createdAt" | "updatedAt">) => {
      try {
        const { data: createdData, error } = await supabase
          .from("accounts")
          .insert([
            {
              user_id: data.userId,
              name: data.name,
              type: data.type,
              bank: data.bank,
              account_number: data.accountNumber,
              balance: data.balance,
              currency: data.currency,
              is_active: data.isActive,
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
          accounts: [createdData, ...prev.accounts],
        }));

        return createdData;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to create account" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return null;
      }
    },
    [supabase]
  );

  // Update account
  const updateAccount = useCallback(
    async (id: string, data: Partial<Account>) => {
      try {
        const updateData: Record<string, unknown> = {};

        if (data.name) updateData.name = data.name;
        if (data.type) updateData.type = data.type;
        if (data.bank !== undefined) updateData.bank = data.bank;
        if (data.accountNumber !== undefined) updateData.account_number = data.accountNumber;
        if (data.balance !== undefined) updateData.balance = data.balance;
        if (data.currency) updateData.currency = data.currency;
        if (data.isActive !== undefined) updateData.is_active = data.isActive;

        const { data: updatedData, error } = await supabase
          .from("accounts")
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
          accounts: prev.accounts.map((acc) =>
            acc.id === id ? updatedData : acc
          ),
        }));

        return updatedData;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to update account" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return null;
      }
    },
    [supabase]
  );

  // Delete account
  const deleteAccount = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from("accounts")
          .delete()
          .eq("id", id)
          .eq("user_id", userId);

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return false;
        }

        setState((prev) => ({
          ...prev,
          accounts: prev.accounts.filter((acc) => acc.id !== id),
        }));

        return true;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to delete account" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return false;
      }
    },
    [userId, supabase]
  );

  // Get account by ID
  const getAccountById = useCallback(
    async (id: string) => {
      try {
        const { data, error } = await supabase
          .from("accounts")
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
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch account" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return null;
      }
    },
    [userId, supabase]
  );

  // Get accounts by type
  const getAccountsByType = useCallback(
    async (type: Account["type"]) => {
      try {
        const { data, error } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", userId)
          .eq("type", type)
          .eq("is_active", true);

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return [];
        }

        return data || [];
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch accounts" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return [];
      }
    },
    [userId, supabase]
  );

  // Update account balance
  const updateAccountBalance = useCallback(
    async (id: string, newBalance: number) => {
      return updateAccount(id, { balance: newBalance });
    },
    [updateAccount]
  );

  // Get total balance across all active accounts
  const getTotalBalance = useCallback(() => {
    return state.accounts
      .filter((acc) => acc.isActive)
      .reduce((sum, acc) => sum + acc.balance, 0);
  }, [state.accounts]);

  // Get active accounts
  const getActiveAccounts = useCallback(() => {
    return state.accounts.filter((acc) => acc.isActive);
  }, [state.accounts]);

  // Deactivate account
  const deactivateAccount = useCallback(
    async (id: string) => {
      return updateAccount(id, { isActive: false }).then((result) => result !== null);
    },
    [updateAccount]
  );

  return {
    ...state,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getAccountById,
    getAccountsByType,
    updateAccountBalance,
    getTotalBalance,
    getActiveAccounts,
    deactivateAccount,
  };
}
