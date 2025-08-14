import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';
import { queryClient } from './query-client';

// Generic error handler for mutations
export function createMutationOptions<TData, TError, TVariables>(
  options?: Partial<UseMutationOptions<TData, TError, TVariables>>
): UseMutationOptions<TData, TError, TVariables> {
  return {
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
      options?.onError?.(error, {} as TVariables, undefined);
    },
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  };
}

// Generic success handler for mutations with toast
export function createSuccessMutationOptions<TData, TError, TVariables>(
  successMessage: string,
  options?: Partial<UseMutationOptions<TData, TError, TVariables>>
): UseMutationOptions<TData, TError, TVariables> {
  return createMutationOptions({
    onSuccess: (data, variables, context) => {
      toast.success(successMessage);
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
}

// Generic error handler for queries - Note: React Query v5 doesn't have onError for queries
// Use error boundaries or handle errors in components instead
export function createQueryOptions<TQueryFnData, TError, TData>(
  options: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryOptions<TQueryFnData, TError, TData> {
  return {
    ...options,
  };
}

// Utility to create optimistic updates
export function createOptimisticUpdate<T>(
  queryKey: unknown[],
  updateFn: (oldData: T | undefined, newData: unknown) => T
) {
  return {
    onMutate: async (newData: unknown) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<T>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData<T>(queryKey, (old) => updateFn(old, newData));

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (
      _err: unknown,
      _newData: unknown,
      context: { previousData: T } | undefined
    ) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });
    },
  };
}

// Utility for handling loading states
export function useLoadingToast(isLoading: boolean, message: string) {
  React.useEffect(() => {
    let toastId: string | number;

    if (isLoading) {
      toastId = toast.loading(message);
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [isLoading, message]);
}

// Common query configurations
export const queryConfig = {
  // For data that changes frequently
  realtime: {
    staleTime: 0,
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
  },
  // For data that rarely changes
  static: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  },
  // For user-specific data
  user: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  },
} as const;
