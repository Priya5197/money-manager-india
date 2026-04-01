/**
 * useAuth Hook
 * Provides authentication functionality with Supabase
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export interface UseAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export interface UseAuthActions {
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ user: User | null; error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (
    newPassword: string
  ) => Promise<{ error: AuthError | null }>;
  updateProfile: (data: {
    fullName?: string;
    email?: string;
  }) => Promise<{ error: AuthError | null }>;
  refreshSession: () => Promise<void>;
}

export type UseAuthReturn = UseAuthState & UseAuthActions;

/**
 * useAuth Hook - Get auth state and functions
 */
export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  const supabase = createClient();

  // Check current session on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error,
          }));
        } else {
          setState({
            user: session?.user ?? null,
            session: session ?? null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        const authError =
          error instanceof Error ? new Error(error.message) : null;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: authError as any,
        }));
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setState({
        user: session?.user ?? null,
        session: session ?? null,
        loading: false,
        error: null,
      });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  // Sign up
  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          return { user: null, error };
        }

        return { user: data.user, error: null };
      } catch (error) {
        const authError = error instanceof Error ? error : new Error("Sign up failed");
        return { user: null, error: authError as any };
      }
    },
    [supabase]
  );

  // Sign in
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return { user: null, error };
        }

        return { user: data.user, error: null };
      } catch (error) {
        const authError = error instanceof Error ? error : new Error("Sign in failed");
        return { user: null, error: authError as any };
      }
    },
    [supabase]
  );

  // Sign out
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setState({
        user: null,
        session: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      const authError = error instanceof Error ? error : new Error("Sign out failed");
      setState((prev) => ({ ...prev, error: authError as any }));
    }
  }, [supabase]);

  // Reset password
  const resetPassword = useCallback(
    async (email: string) => {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        return { error };
      } catch (error) {
        const authError = error instanceof Error ? error : new Error("Reset password failed");
        return { error: authError as any };
      }
    },
    [supabase]
  );

  // Update password
  const updatePassword = useCallback(
    async (newPassword: string) => {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        return { error };
      } catch (error) {
        const authError = error instanceof Error ? error : new Error("Update password failed");
        return { error: authError as any };
      }
    },
    [supabase]
  );

  // Update profile
  const updateProfile = useCallback(
    async (data: { fullName?: string; email?: string }) => {
      try {
        const updateData: Record<string, unknown> = {};

        if (data.fullName) {
          updateData.data = { full_name: data.fullName };
        }

        if (data.email) {
          updateData.email = data.email;
        }

        const { error } = await supabase.auth.updateUser(updateData);

        return { error };
      } catch (error) {
        const authError = error instanceof Error ? error : new Error("Update profile failed");
        return { error: authError as any };
      }
    },
    [supabase]
  );

  // Refresh session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        setState((prev) => ({
          ...prev,
          error,
        }));
      } else {
        setState({
          user: data.session?.user ?? null,
          session: data.session ?? null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      const authError = error instanceof Error ? error : new Error("Refresh session failed");
      setState((prev) => ({
        ...prev,
        error: authError as any,
      }));
    }
  }, [supabase]);

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshSession,
  };
}

/**
 * useAuthUser Hook - Get current user (with suspense support)
 */
export function useAuthUser() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user;
}

/**
 * useAuthSession Hook - Get current session
 */
export function useAuthSession() {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  return session;
}
