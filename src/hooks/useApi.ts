// Hook générique pour les appels API avec gestion d'état
import { useState, useCallback, useRef, useEffect } from 'react';
import type { ApiResponse, PaginatedResponse } from '@/types/api';

// Configuration du hook
interface UseApiConfig {
  immediate?: boolean; // Exécuter immédiatement au montage
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  transform?: (data: any) => any; // Transformer les données
}

// État du hook
interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  isCalled: boolean;
}

// Actions du hook
interface UseApiActions<TParams> {
  execute: (params?: TParams) => Promise<void>;
  reset: () => void;
  refresh: () => Promise<void>;
}

// Hook principal
export function useApi<TData = any, TParams = any>(
  apiCall: (params?: TParams) => Promise<ApiResponse<TData>>,
  config: UseApiConfig = {}
): UseApiState<TData> & UseApiActions<TParams> {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    isLoading: false,
    error: null,
    isSuccess: false,
    isCalled: false
  });

  const lastParamsRef = useRef<TParams | undefined>(undefined);
  const mountedRef = useRef(true);

  const execute = useCallback(async (params?: TParams) => {
    if (!mountedRef.current) return;
    
    lastParamsRef.current = params;
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isSuccess: false,
      isCalled: true
    }));

    try {
      const response = await apiCall(params);
      
      if (!mountedRef.current) return;
      
      if (response.success) {
        const transformedData = config.transform 
          ? config.transform(response.data)
          : response.data;
        
        setState({
          data: transformedData,
          isLoading: false,
          error: null,
          isSuccess: true,
          isCalled: true
        });
        
        config.onSuccess?.(transformedData);
      } else {
        const errorMessage = response.error || 'Une erreur est survenue';
        setState({
          data: null,
          isLoading: false,
          error: errorMessage,
          isSuccess: false,
          isCalled: true
        });
        
        config.onError?.(errorMessage);
      }
    } catch (error: any) {
      if (!mountedRef.current) return;
      
      const errorMessage = error.message || 'Une erreur inattendue est survenue';
      setState({
        data: null,
        isLoading: false,
        error: errorMessage,
        isSuccess: false,
        isCalled: true
      });
      
      config.onError?.(errorMessage);
    }
  }, [apiCall, config]);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      isSuccess: false,
      isCalled: false
    });
    lastParamsRef.current = undefined;
  }, []);

  const refresh = useCallback(async () => {
    if (lastParamsRef.current !== undefined) {
      await execute(lastParamsRef.current);
    }
  }, [execute]);

  // Exécution automatique au montage
  useEffect(() => {
    if (config.immediate) {
      execute(undefined);
    }
  }, [config.immediate, execute]);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    execute,
    reset,
    refresh
  };
}

// Hook spécialisé pour les listes paginées
interface UsePaginatedApiConfig extends UseApiConfig {
  initialPage?: number;
  initialLimit?: number;
}

interface PaginatedState<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

interface PaginatedActions<TParams> {
  execute: (params?: TParams) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

export function usePaginatedApi<TData = any, TParams = any>(
  apiCall: (params?: TParams & { page?: number; limit?: number }) => Promise<PaginatedResponse<TData>>,
  config: UsePaginatedApiConfig = {}
): PaginatedState<TData> & PaginatedActions<TParams> {
  const [state, setState] = useState<PaginatedState<TData>>({
    data: [],
    total: 0,
    page: config.initialPage || 1,
    limit: config.initialLimit || 25,
    totalPages: 0,
    hasMore: false,
    isLoading: false,
    error: null,
    isSuccess: false
  });

  const lastParamsRef = useRef<TParams | undefined>(undefined);
  const mountedRef = useRef(true);

  const execute = useCallback(async (params?: TParams, append: boolean = false) => {
    if (!mountedRef.current) return;
    
    lastParamsRef.current = params;
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const response = await apiCall({
        ...params,
        page: state.page,
        limit: state.limit
      } as TParams & { page: number; limit: number });
      
      if (!mountedRef.current) return;
      
      if (response.success) {
        const transformedData = config.transform 
          ? response.data.map((item: any) => config.transform!(item))
          : response.data;
        
        setState(prev => ({
          ...prev,
          data: append ? [...prev.data, ...transformedData] : transformedData,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
          hasMore: response.pagination.hasNext,
          isLoading: false,
          error: null,
          isSuccess: true
        }));
        
        config.onSuccess?.(transformedData);
      } else {
        const errorMessage = response.error || 'Une erreur est survenue';
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          isSuccess: false
        }));
        
        config.onError?.(errorMessage);
      }
    } catch (error: any) {
      if (!mountedRef.current) return;
      
      const errorMessage = error.message || 'Une erreur inattendue est survenue';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isSuccess: false
      }));
      
      config.onError?.(errorMessage);
    }
  }, [apiCall, config, state.page, state.limit]);

  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setState(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const loadMore = useCallback(async () => {
    if (state.hasMore && !state.isLoading) {
      const nextPage = state.page + 1;
      setState(prev => ({ ...prev, page: nextPage }));
      
      // Attendre que l'état soit mis à jour puis exécuter
      setTimeout(() => {
        execute(lastParamsRef.current, true);
      }, 0);
    }
  }, [state.hasMore, state.isLoading, state.page, execute]);

  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, page: 1 }));
    await execute(lastParamsRef.current, false);
  }, [execute]);

  const reset = useCallback(() => {
    setState({
      data: [],
      total: 0,
      page: config.initialPage || 1,
      limit: config.initialLimit || 25,
      totalPages: 0,
      hasMore: false,
      isLoading: false,
      error: null,
      isSuccess: false
    });
    lastParamsRef.current = undefined;
  }, [config.initialPage, config.initialLimit]);

  // Re-exécuter quand page ou limit change
  useEffect(() => {
    if (lastParamsRef.current !== undefined || config.immediate) {
      execute(lastParamsRef.current, false);
    }
  }, [state.page, state.limit]);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    execute: (params?: TParams) => execute(params, false),
    setPage,
    setLimit,
    loadMore,
    refresh,
    reset
  };
}

// Hook pour les mutations (POST, PUT, DELETE)
interface UseMutationConfig<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: string, variables: TVariables) => void;
  onSettled?: (data: TData | null, error: string | null, variables: TVariables) => void;
}

interface MutationState<TData> {
  data: TData | null;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  isError: boolean;
}

interface MutationActions<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  config: UseMutationConfig<TData, TVariables> = {}
): MutationState<TData> & MutationActions<TData, TVariables> {
  const [state, setState] = useState<MutationState<TData>>({
    data: null,
    isLoading: false,
    error: null,
    isSuccess: false,
    isError: false
  });

  const mountedRef = useRef(true);

  const mutate = useCallback(async (variables: TVariables): Promise<TData | null> => {
    if (!mountedRef.current) return null;
    
    setState({
      data: null,
      isLoading: true,
      error: null,
      isSuccess: false,
      isError: false
    });

    try {
      const response = await mutationFn(variables);
      
      if (!mountedRef.current) return null;
      
      if (response.success) {
        setState({
          data: response.data || null,
          isLoading: false,
          error: null,
          isSuccess: true,
          isError: false
        });
        
        config.onSuccess?.(response.data!, variables);
        config.onSettled?.(response.data || null, null, variables);
        
        return response.data || null;
      } else {
        const errorMessage = response.error || 'Une erreur est survenue';
        setState({
          data: null,
          isLoading: false,
          error: errorMessage,
          isSuccess: false,
          isError: true
        });
        
        config.onError?.(errorMessage, variables);
        config.onSettled?.(null, errorMessage, variables);
        
        return null;
      }
    } catch (error: any) {
      if (!mountedRef.current) return null;
      
      const errorMessage = error.message || 'Une erreur inattendue est survenue';
      setState({
        data: null,
        isLoading: false,
        error: errorMessage,
        isSuccess: false,
        isError: true
      });
      
      config.onError?.(errorMessage, variables);
      config.onSettled?.(null, errorMessage, variables);
      
      return null;
    }
  }, [mutationFn, config]);

  const mutateAsync = useCallback(async (variables: TVariables): Promise<TData> => {
    const result = await mutate(variables);
    if (result === null) {
      throw new Error(state.error || 'La mutation a échoué');
    }
    return result;
  }, [mutate, state.error]);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
      isSuccess: false,
      isError: false
    });
  }, []);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    ...state,
    mutate,
    mutateAsync,
    reset
  };
}