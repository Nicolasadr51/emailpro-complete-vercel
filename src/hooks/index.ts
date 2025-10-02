// Export centralisé de tous les hooks personnalisés

// Hooks génériques
export { useApi, usePaginatedApi, useMutation } from './useApi';

// Hooks spécialisés
export * from './useCampaigns';
export * from './useContacts';
export * from './useTemplates';

// Types ré-exportés pour facilité d'utilisation
export type {
  UseDataResult,
  UseListResult,
  UseMutationResult
} from '@/types';

// Note: Les hooks utilitaires supplémentaires comme useForm, useDebounce, 
// useLocalStorage, useNotifications, usePermissions seraient implémentés 
// dans des fichiers séparés selon les besoins spécifiques de l'application