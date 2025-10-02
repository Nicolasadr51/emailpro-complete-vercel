// Hook spécialisé pour la gestion des templates
import { useCallback, useMemo } from 'react';
import { useApi, usePaginatedApi, useMutation } from './useApi';
import { templatesApi } from '@/services/api';
import type {
  EmailTemplate,
  TemplateCategory,
  ContentBlock,
  BlockType,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  CreateContentBlockRequest,
  UpdateContentBlockRequest,
  TemplatePreview,
  TemplateImport
} from '@/types/template';
import type { BaseQueryParams } from '@/types/api';

// Paramètres de requête spécifiques aux templates
interface TemplateQueryParams extends BaseQueryParams {
  category?: TemplateCategory;
  isPublic?: boolean;
  createdBy?: string;
  tags?: string[];
}

interface ContentBlockQueryParams extends BaseQueryParams {
  type?: BlockType;
  category?: string;
  isPublic?: boolean;
}

// Hook principal pour les templates
export function useTemplates(params?: TemplateQueryParams) {
  const {
    data: templates,
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
    (queryParams) => templatesApi.getTemplates(queryParams),
    {
      immediate: true,
      initialPage: 1,
      initialLimit: 25
    }
  );

  // Exécuter avec les nouveaux paramètres
  const refetch = useCallback((newParams?: TemplateQueryParams) => {
    execute({ ...params, ...newParams });
  }, [execute, params]);

  // Statistiques calculées
  const stats = useMemo(() => {
    if (!templates.length) {
      return {
        total: 0,
        byCategory: {} as Record<TemplateCategory, number>,
        public: 0,
        private: 0
      };
    }

    const byCategory = templates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1;
      return acc;
    }, {} as Record<TemplateCategory, number>);

    const publicCount = templates.filter(t => t.isPublic).length;
    const privateCount = templates.length - publicCount;

    return {
      total: templates.length,
      byCategory,
      public: publicCount,
      private: privateCount
    };
  }, [templates]);

  return {
    templates,
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

// Hook pour un template spécifique
export function useTemplate(id: string) {
  const {
    data: template,
    isLoading,
    error,
    isSuccess,
    execute,
    refresh,
    reset
  } = useApi(
    () => templatesApi.getTemplate(id),
    {
      immediate: !!id,
      transform: (data) => data
    }
  );

  return {
    template,
    isLoading,
    error,
    isSuccess,
    refresh,
    reset,
    refetch: execute
  };
}

// Hook pour la prévisualisation d'un template
export function useTemplatePreview(id: string) {
  const {
    data: preview,
    isLoading,
    error,
    isSuccess,
    execute,
    reset
  } = useApi<TemplatePreview, Record<string, any>>(
    (variables = {}) => templatesApi.previewTemplate(id, variables),
    {
      immediate: false
    }
  );

  const generatePreview = useCallback((variables: Record<string, any> = {}) => {
    execute(variables);
  }, [execute]);

  return {
    preview,
    isLoading,
    error,
    isSuccess,
    generatePreview,
    reset
  };
}

// Hook pour la création de template
export function useCreateTemplate() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    data,
    reset
  } = useMutation(
    (data: CreateTemplateRequest) => templatesApi.createTemplate(data)
  );

  const createTemplate = useCallback(async (templateData: CreateTemplateRequest) => {
    return mutateAsync(templateData);
  }, [mutateAsync]);

  return {
    createTemplate,
    mutate,
    isLoading,
    error,
    isSuccess,
    template: data,
    reset
  };
}

// Hook pour la mise à jour de template
export function useUpdateTemplate() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    data,
    reset
  } = useMutation(
    ({ id, data }: { id: string; data: UpdateTemplateRequest }) => 
      templatesApi.updateTemplate(id, data)
  );

  const updateTemplate = useCallback(async (id: string, templateData: UpdateTemplateRequest) => {
    return mutateAsync({ id, data: templateData });
  }, [mutateAsync]);

  return {
    updateTemplate,
    mutate,
    isLoading,
    error,
    isSuccess,
    template: data,
    reset
  };
}

// Hook pour la suppression de template
export function useDeleteTemplate() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    reset
  } = useMutation(
    (id: string) => templatesApi.deleteTemplate(id)
  );

  const deleteTemplate = useCallback(async (id: string) => {
    return mutateAsync(id);
  }, [mutateAsync]);

  return {
    deleteTemplate,
    mutate,
    isLoading,
    error,
    isSuccess,
    reset
  };
}

// Hook pour la duplication de template
export function useDuplicateTemplate() {
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
      templatesApi.duplicateTemplate(id, name)
  );

  const duplicateTemplate = useCallback(async (id: string, name?: string) => {
    return mutateAsync({ id, name });
  }, [mutateAsync]);

  return {
    duplicateTemplate,
    mutate,
    isLoading,
    error,
    isSuccess,
    template: data,
    reset
  };
}

// Hook pour l'import de template
export function useImportTemplate() {
  const {
    mutate,
    mutateAsync,
    isLoading,
    error,
    isSuccess,
    data,
    reset
  } = useMutation(
    (importData: TemplateImport) => templatesApi.importTemplate(importData)
  );

  const importTemplate = useCallback(async (importData: TemplateImport) => {
    return mutateAsync(importData);
  }, [mutateAsync]);

  return {
    importTemplate,
    mutate,
    isLoading,
    error,
    isSuccess,
    template: data,
    reset
  };
}

// Hook pour les templates populaires
export function usePopularTemplates(limit: number = 10) {
  const {
    data: templates,
    isLoading,
    error,
    isSuccess,
    execute,
    refresh
  } = useApi(
    () => templatesApi.getPopularTemplates(limit),
    {
      immediate: true
    }
  );

  return {
    templates,
    isLoading,
    error,
    isSuccess,
    refresh,
    refetch: execute
  };
}

// Hook pour les templates par catégorie
export function useTemplatesByCategory(category: TemplateCategory) {
  const {
    data: templates,
    isLoading,
    error,
    isSuccess,
    execute,
    refresh
  } = useApi(
    () => templatesApi.getTemplatesByCategory(category),
    {
      immediate: !!category
    }
  );

  return {
    templates,
    isLoading,
    error,
    isSuccess,
    refresh,
    refetch: execute
  };
}

// Hook pour les blocs de contenu
export function useContentBlocks(params?: ContentBlockQueryParams) {
  const {
    data: blocks,
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
    (queryParams) => templatesApi.getContentBlocks(queryParams),
    {
      immediate: true,
      initialPage: 1,
      initialLimit: 25
    }
  );

  const refetch = useCallback((newParams?: ContentBlockQueryParams) => {
    execute({ ...params, ...newParams });
  }, [execute, params]);

  return {
    blocks,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    isLoading,
    error,
    isSuccess,
    setPage,
    setLimit,
    loadMore,
    refresh,
    refetch,
    reset
  };
}

// Hook pour la gestion des blocs de contenu
export function useContentBlockManagement() {
  const createBlock = useMutation(
    (data: CreateContentBlockRequest) => templatesApi.createContentBlock(data)
  );

  const updateBlock = useMutation(
    ({ id, data }: { id: string; data: UpdateContentBlockRequest }) => 
      templatesApi.updateContentBlock(id, data)
  );

  const deleteBlock = useMutation(
    (id: string) => templatesApi.deleteContentBlock(id)
  );

  return {
    createBlock: createBlock.mutateAsync,
    updateBlock: (id: string, data: UpdateContentBlockRequest) => 
      updateBlock.mutateAsync({ id, data }),
    deleteBlock: deleteBlock.mutateAsync,
    isLoading: createBlock.isLoading || updateBlock.isLoading || deleteBlock.isLoading,
    error: createBlock.error || updateBlock.error || deleteBlock.error
  };
}

// Hook pour les statistiques d'utilisation des templates
export function useTemplateUsageStats(id?: string) {
  const {
    data: stats,
    isLoading,
    error,
    isSuccess,
    execute,
    refresh
  } = useApi(
    () => templatesApi.getTemplateUsageStats(id),
    {
      immediate: true
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

// Hook pour les utilitaires de template
export function useTemplateUtils() {
  const validateHtml = useMutation(
    (html: string) => templatesApi.validateTemplateHtml(html)
  );

  const optimizeImages = useMutation(
    (id: string) => templatesApi.optimizeTemplateImages(id)
  );

  const testCompatibility = useMutation(
    ({ id, clients }: { id: string; clients?: string[] }) => 
      templatesApi.testEmailClientCompatibility(id, clients)
  );

  const generateText = useMutation(
    (html: string) => templatesApi.generateTextContent(html)
  );

  return {
    validateHtml: validateHtml.mutateAsync,
    optimizeImages: optimizeImages.mutateAsync,
    testCompatibility: (id: string, clients?: string[]) => 
      testCompatibility.mutateAsync({ id, clients }),
    generateText: generateText.mutateAsync,
    isLoading: validateHtml.isLoading || optimizeImages.isLoading || 
               testCompatibility.isLoading || generateText.isLoading,
    error: validateHtml.error || optimizeImages.error || 
           testCompatibility.error || generateText.error
  };
}

// Export du hook composite principal
export function useTemplateManagement() {
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();
  const duplicateTemplate = useDuplicateTemplate();
  const importTemplate = useImportTemplate();
  const blockManagement = useContentBlockManagement();
  const utils = useTemplateUtils();

  return {
    create: createTemplate,
    update: updateTemplate,
    delete: deleteTemplate,
    duplicate: duplicateTemplate,
    import: importTemplate,
    blocks: blockManagement,
    utils
  };
}