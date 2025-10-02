// Hook spécialisé pour la gestion des campagnes
import { useCallback, useMemo } from 'react';
import { useApi, usePaginatedApi, useMutation } from './useApi';
import { campaignsApi } from '@/services/api';
import type {
  Campaign,
  CampaignStatus,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  SendCampaignRequest,
  CampaignStats
} from '@/types/campaign';
import type { BaseQueryParams } from '@/types/api';

// Paramètres de requête spécifiques aux campagnes
interface CampaignQueryParams extends BaseQueryParams {
  status?: CampaignStatus;
  type?: 'regular' | 'automation' | 'ab_test';
  createdBy?: string;
  startDate?: Date;
  endDate?: Date;
}

// Hook principal pour les campagnes
export function useCampaigns(params?: CampaignQueryParams) {
  const {
    data: campaigns,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    isLoading,
    error,
    isSuccess,
    execute,
    setPage,
    setLimit,
    loadMore,
    refresh,
    reset
  } = usePaginatedApi(
    (queryParams) => campaignsApi.getCampaigns(queryParams),
    {
      immediate: true,
      initialPage: 1,
      initialLimit: 25
    }
  );

  // Exécuter avec les nouveaux paramètres
  const refetch = useCallback((newParams?: CampaignQueryParams) => {
    execute({ ...params, ...newParams });
  }, [execute, params]);

  // Statistiques calculées
  const stats = useMemo(() => {
    if (!campaigns.length) {
      return {
        total: 0,
        draft: 0,
        scheduled: 0,
        sending: 0,
        sent: 0,
        paused: 0,
        failed: 0
      };
    }

    return campaigns.reduce((acc, campaign) => {
      acc.total++;
      acc[campaign.status as keyof typeof acc]++;
      return acc;
    }, {
      total: 0,
      draft: 0,
      scheduled: 0,
      sending: 0,
      sent: 0,
      paused: 0,
      cancelled: 0,
      failed: 0
    });
  }, [campaigns]);

  return {
    campaigns,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    isLoading,
    error,
    isSuccess,
    stats,
    setPage,
    setLimit,
    loadMore,
    refresh,
    refetch,
    reset
  };
}

// Hook pour une campagne spécifique
export function useCampaign(id: string) {
  const {
    data: campaign,
    isLoading,
    error,
    isSuccess,
    execute,
    refresh,
    reset
  } = useApi(
    () => campaignsApi.getCampaign(id),
    {
      immediate: !!id,
      transform: (data) => data
    }
  );

  return {
    campaign,
    isLoading,
    error,
    isSuccess,
    refresh,
    reset,
    refetch: execute
  };
}

// Hook pour les statistiques d'une campagne
export function useCampaignStats(id: string) {
  const {
    data: stats,
    isLoading,
    error,
    isSuccess,
    execute,
    refresh
  } = useApi<CampaignStats>(
    () => campaignsApi.getCampaignStats(id),
    {
      immediate: !!id
    }
  );

  return {
    stats,
    isLoading,
    error,
    isSuccess,
    refresh,
    refetch: execute
  };
}

// Hook pour la création de campagne
export function useCreateCampaign() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    data,
    reset
  } = useMutation(
    (data: CreateCampaignRequest) => campaignsApi.createCampaign(data)
  );

  const createCampaign = useCallback(async (campaignData: CreateCampaignRequest) => {
    return mutateAsync(campaignData);
  }, [mutateAsync]);

  return {
    createCampaign,
    mutate,
    isLoading,
    error,
    isSuccess,
    campaign: data,
    reset
  };
}

// Hook pour la mise à jour de campagne
export function useUpdateCampaign() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    data,
    reset
  } = useMutation(
    ({ id, data }: { id: string; data: UpdateCampaignRequest }) => 
      campaignsApi.updateCampaign(id, data)
  );

  const updateCampaign = useCallback(async (id: string, campaignData: UpdateCampaignRequest) => {
    return mutateAsync({ id, data: campaignData });
  }, [mutateAsync]);

  return {
    updateCampaign,
    mutate,
    isLoading,
    error,
    isSuccess,
    campaign: data,
    reset
  };
}

// Hook pour la suppression de campagne
export function useDeleteCampaign() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    reset
  } = useMutation(
    (id: string) => campaignsApi.deleteCampaign(id)
  );

  const deleteCampaign = useCallback(async (id: string) => {
    return mutateAsync(id);
  }, [mutateAsync]);

  return {
    deleteCampaign,
    mutate,
    isLoading,
    error,
    isSuccess,
    reset
  };
}

// Hook pour l'envoi de campagne
export function useSendCampaign() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    reset
  } = useMutation(
    ({ id, options }: { id: string; options?: SendCampaignRequest }) => 
      campaignsApi.sendCampaign(id, options)
  );

  const sendCampaign = useCallback(async (id: string, options?: SendCampaignRequest) => {
    return mutateAsync({ id, options });
  }, [mutateAsync]);

  return {
    sendCampaign,
    mutate,
    isLoading,
    error,
    isSuccess,
    reset
  };
}

// Hook pour la duplication de campagne
export function useDuplicateCampaign() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    data,
    reset
  } = useMutation(
    ({ id, name }: { id: string; name?: string }) => 
      campaignsApi.duplicateCampaign(id, name)
  );

  const duplicateCampaign = useCallback(async (id: string, name?: string) => {
    return mutateAsync({ id, name });
  }, [mutateAsync]);

  return {
    duplicateCampaign,
    mutate,
    isLoading,
    error,
    isSuccess,
    campaign: data,
    reset
  };
}

// Hook pour les actions de campagne (pause, reprise, annulation)
export function useCampaignActions() {
  const pause = useMutation(
    (id: string) => campaignsApi.pauseCampaign(id)
  );

  const resume = useMutation(
    (id: string) => campaignsApi.resumeCampaign(id)
  );

  const cancel = useMutation(
    (id: string) => campaignsApi.cancelCampaign(id)
  );

  const schedule = useMutation(
    ({ id, scheduledAt }: { id: string; scheduledAt: Date }) => 
      campaignsApi.scheduleCampaign(id, scheduledAt)
  );

  const pauseCampaign = useCallback(async (id: string) => {
    return pause.mutateAsync(id);
  }, [pause.mutateAsync]);

  const resumeCampaign = useCallback(async (id: string) => {
    return resume.mutateAsync(id);
  }, [resume.mutateAsync]);

  const cancelCampaign = useCallback(async (id: string) => {
    return cancel.mutateAsync(id);
  }, [cancel.mutateAsync]);

  const scheduleCampaign = useCallback(async (id: string, scheduledAt: Date) => {
    return schedule.mutateAsync({ id, scheduledAt });
  }, [schedule.mutateAsync]);

  const isLoading = pause.isLoading || resume.isLoading || cancel.isLoading || schedule.isLoading;
  const error = pause.error || resume.error || cancel.error || schedule.error;

  return {
    pauseCampaign,
    resumeCampaign,
    cancelCampaign,
    scheduleCampaign,
    isLoading,
    error,
    reset: () => {
      pause.reset();
      resume.reset();
      cancel.reset();
      schedule.reset();
    }
  };
}

// Hook pour les emails de test
export function useSendTestEmails() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    reset
  } = useMutation(
    ({ id, emails }: { id: string; emails: string[] }) => 
      campaignsApi.sendTestEmails(id, emails)
  );

  const sendTestEmails = useCallback(async (id: string, emails: string[]) => {
    return mutateAsync({ id, emails });
  }, [mutateAsync]);

  return {
    sendTestEmails,
    mutate,
    isLoading,
    error,
    isSuccess,
    reset
  };
}

// Hook pour les statistiques globales
export function useGlobalCampaignStats(params?: {
  startDate?: Date;
  endDate?: Date;
  groupBy?: 'day' | 'week' | 'month';
}) {
  const {
    data: stats,
    isLoading,
    error,
    isSuccess,
    execute,
    refresh
  } = useApi(
    () => campaignsApi.getGlobalStats(params),
    {
      immediate: true
    }
  );

  const refetch = useCallback((newParams?: typeof params) => {
    execute({ ...params, ...newParams });
  }, [execute, params]);

  return {
    stats,
    isLoading,
    error,
    isSuccess,
    refresh,
    refetch
  };
}

// Export du hook composite principal
export function useCampaignManagement() {
  const createCampaign = useCreateCampaign();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const duplicateCampaign = useDuplicateCampaign();
  const sendCampaign = useSendCampaign();
  const campaignActions = useCampaignActions();
  const sendTestEmails = useSendTestEmails();

  return {
    create: createCampaign,
    update: updateCampaign,
    delete: deleteCampaign,
    duplicate: duplicateCampaign,
    send: sendCampaign,
    actions: campaignActions,
    testEmails: sendTestEmails
  };
}