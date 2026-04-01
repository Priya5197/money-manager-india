/**
 * useCategories Hook
 * CRUD operations for categories with Supabase
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "@/constants/categories";

export interface Category {
  id: string;
  userId?: string;
  name: string;
  type: "income" | "expense";
  icon?: string;
  color?: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface UseCategoriesState {
  categories: Category[];
  loading: boolean;
  error: PostgrestError | null;
}

export interface UseCategoriesActions {
  fetchCategories: (type?: "income" | "expense") => Promise<void>;
  createCategory: (data: Omit<Category, "id" | "createdAt">) => Promise<Category | null>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  getCategoryById: (id: string) => Promise<Category | null>;
  getCategoriesByType: (type: "income" | "expense") => Promise<Category[]>;
  searchCategories: (query: string) => Promise<Category[]>;
  initializeDefaultCategories: () => Promise<boolean>;
}

export type UseCategoriesReturn = UseCategoriesState & UseCategoriesActions;

/**
 * useCategories Hook
 */
export function useCategories(userId: string): UseCategoriesReturn {
  const [state, setState] = useState<UseCategoriesState>({
    categories: [],
    loading: true,
    error: null,
  });

  const supabase = createClient();

  // Fetch categories
  const fetchCategories = useCallback(
    async (type?: "income" | "expense") => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        let query = supabase
          .from("categories")
          .select("*")
          .or(`user_id.eq.${userId},is_default.eq.true`);

        if (type) {
          query = query.eq("type", type);
        }

        const { data, error } = await query.order("name", { ascending: true });

        if (error) {
          setState((prev) => ({ ...prev, error }));
        } else {
          setState({
            categories: data || [],
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch categories" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
      }
    },
    [userId, supabase]
  );

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Create category
  const createCategory = useCallback(
    async (data: Omit<Category, "id" | "createdAt">) => {
      try {
        const { data: createdData, error } = await supabase
          .from("categories")
          .insert([
            {
              user_id: data.userId || userId,
              name: data.name,
              type: data.type,
              icon: data.icon,
              color: data.color,
              is_default: data.isDefault || false,
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
          categories: [...prev.categories, createdData].sort((a, b) =>
            a.name.localeCompare(b.name)
          ),
        }));

        return createdData;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to create category" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return null;
      }
    },
    [userId, supabase]
  );

  // Update category
  const updateCategory = useCallback(
    async (id: string, data: Partial<Category>) => {
      try {
        const updateData: Record<string, unknown> = {};

        if (data.name) updateData.name = data.name;
        if (data.type) updateData.type = data.type;
        if (data.icon !== undefined) updateData.icon = data.icon;
        if (data.color !== undefined) updateData.color = data.color;
        if (data.isDefault !== undefined) updateData.is_default = data.isDefault;

        const { data: updatedData, error } = await supabase
          .from("categories")
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
          categories: prev.categories.map((c) =>
            c.id === id ? updatedData : c
          ),
        }));

        return updatedData;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to update category" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return null;
      }
    },
    [supabase]
  );

  // Delete category
  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from("categories")
          .delete()
          .eq("id", id)
          .eq("user_id", userId);

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return false;
        }

        setState((prev) => ({
          ...prev,
          categories: prev.categories.filter((c) => c.id !== id),
        }));

        return true;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to delete category" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return false;
      }
    },
    [userId, supabase]
  );

  // Get category by ID
  const getCategoryById = useCallback(
    async (id: string) => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return null;
        }

        return data;
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch category" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return null;
      }
    },
    [supabase]
  );

  // Get categories by type
  const getCategoriesByType = useCallback(
    async (type: "income" | "expense") => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("type", type)
          .or(`user_id.eq.${userId},is_default.eq.true`);

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return [];
        }

        return data || [];
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to fetch categories" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return [];
      }
    },
    [userId, supabase]
  );

  // Search categories
  const searchCategories = useCallback(
    async (query: string) => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .or(`user_id.eq.${userId},is_default.eq.true`)
          .ilike("name", `%${query}%`);

        if (error) {
          setState((prev) => ({ ...prev, error }));
          return [];
        }

        return data || [];
      } catch (error) {
        const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to search categories" };
        setState((prev) => ({ ...prev, error: postgrestError as any }));
        return [];
      }
    },
    [userId, supabase]
  );

  // Initialize default categories for new users
  const initializeDefaultCategories = useCallback(async () => {
    try {
      const allDefaults = [
        ...DEFAULT_EXPENSE_CATEGORIES,
        ...DEFAULT_INCOME_CATEGORIES,
      ];

      const { error } = await supabase.from("categories").insert(
        allDefaults.map((cat) => ({
          id: cat.id,
          name: cat.name,
          type: cat.type,
          icon: cat.icon,
          color: cat.color,
          is_default: true,
        }))
      );

      if (error) {
        setState((prev) => ({ ...prev, error }));
        return false;
      }

      setState((prev) => ({
        ...prev,
        categories: [
          ...prev.categories,
          ...allDefaults.filter(
            (cat) => !prev.categories.some((c) => c.id === cat.id)
          ),
        ],
      }));

      return true;
    } catch (error) {
      const postgrestError = error instanceof Error ? { message: error.message } : { message: "Failed to initialize categories" };
      setState((prev) => ({ ...prev, error: postgrestError as any }));
      return false;
    }
  }, [supabase]);

  return {
    ...state,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoriesByType,
    searchCategories,
    initializeDefaultCategories,
  };
}
