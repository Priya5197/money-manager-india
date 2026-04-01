/**
 * useBudgets Hook
 * CRUD operations for budgets with Supabase
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
  period: "weekly" | "monthly" | "quarterly" | "yearly";
  month?: number;
  year?: number;
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export interface UseBudgetsState {
  budgets: Budget[];
  loading: boolean;
  error: PostgrestError | null;
}

export interface UseBudgetsActions {
  fetchBudgets: (period?: string) => Promise<void>;
  createBudget: (data: Omit<Budget, "id" | "createdAt" | "updatedAt">) => Promise<Budget | null>;
  updateBudget: (id: string, data: Partial<Budget>) => Promise<Budget | null>;
  deleteBudget: (id: string) => Promise<boolean>;
  getBudgetById: (id: string) => Promise<Budget | null>;
  getBudgetsByCategory: (category: string) => Promise<Budget[]>;
  getBudgetsByPeriod: (period: string) => Promise<Budget[]>;
  checkBudgetAlert: (categoryId: string, spent: number) => Promise<boolean>;
}

export type UseBudgetsReturn = UseBudgetsState & UseBudgetsActions;

/**
 * useBudgets Hook
 */
export function useBudgets(userId: string): UseBudgetsReturn {
  const [state, setState] = useState<UseBudgetsState>({
    budgets: [],
    loading: true,
    error: null,
  });

  const supabase = createClient();

  // Fetch budgets
  const fetchBudgets = useCallback(
    async (period?: string) => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        let query = supabase
          .from("budgets")
          .select("*")
          .eq("user_id", userId);

        if (period) {
          query = query.eq("period", period);
        }

        const { data, error } = await query.order("created_at", {
          ascending: false,
        });

        if (error) {
          setState((prev) => ({ ...prev, error }));
        } else {
          setState({
            budgets: data || [],
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch budgets" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
      }
    },
    [userId, supabase]
  );

  // Load budgets on mount
  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  // Create budget
  const createBudget = useCallback(
    async (data: Omit<Budget, "id" | "createdAt" | "updatedAt">) => {
      try {
        const { data: createdData, error } = await supabase
          .from("budgets")
          .insert([
            {
              user_id: data.userId,
              category: data.category,
              limit: data.limit,
              period: data.period,
              month: data.month,
              year: data.year,
              alert_threshold: data.alertThreshold,
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
          budgets: [createdData, ...prev.budgets],
        }));

        return createdData;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to create budget" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return null;
      }
    },
    [supabase]
  );

  // Update budget
  const updateBudget = useCallback(
    async (id: string, data: Partial<Budget>) => {
      try {
        const updateData: Record<string, unknown> = {};

        if (data.category) updateData.category = data.category;
        if (data.limit !== undefined) updateData.limit = data.limit;
        if (data.period) updateData.period = data.period;
        if (data.month !== undefined) updateData.month = data.month;
        if (data.year !== undefined) updateData.year = data.year;
        if (data.alertThreshold !== undefined) updateData.alert_threshold = data.alertThreshold;

        const { data: updatedData, error } = await supabase
          .from("budgets")
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
          budgets: prev.budgets.map((b) => (b.id === id ? updatedData : b)),
        }));

        return updatedData;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to update budget" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return null;
      }
    },
    [supabase]
  );

  // Delete budget
  const deleteBudget = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from("budgets")
          .delete()
          .eq("id", id);

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return false;
        }

        setState((prev) => ({
          ...prev,
          budgets: prev.budgets.filter((b) => b.id !== id),
        }));

        return true;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to delete budget" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return false;
      }
    },
    [supabase]
  );

  // Get budget by ID
  const getBudgetById = useCallback(
    async (id: string) => {
      try {
        const { data, error } = await supabase
          .from("budgets")
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
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch budget" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return null;
      }
    },
    [userId, supabase]
  );

  // Get budgets by category
  const getBudgetsByCategory = useCallback(
    async (category: string) => {
      try {
        const { data, error } = await supabase
          .from("budgets")
          .select("*")
          .eq("user_id", userId)
          .eq("category", category);

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return [];
        }

        return data || [];
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch budgets" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return [];
      }
    },
    [userId, supabase]
  );

  // Get budgets by period
  const getBudgetsByPeriod = useCallback(
    async (period: string) => {
      try {
        const { data, error } = await supabase
          .from("budgets")
          .select("*")
          .eq("user_id", userId)
          .eq("period", period);

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return [];
        }

        return data || [];
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch budgets" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return [];
      }
    },
    [userId, supabase]
  );

  // Check if budget alert should be triggered
  const checkBudgetAlert = useCallback(
    (categoryId: string, spent: number) => {
      const budget = state.budgets.find((b) => b.category === categoryId);
      if (!budget) return false;

      const percentageUsed = (spent / budget.limit) * 100;
      return percentageUsed >= budget.alertThreshold;
    },
    [state.budgets]
  );

  return {
    ...state,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetById,
    getBudgetsByCategory,
    getBudgetsByPeriod,
    checkBudgetAlert,
  };
}
