// Export centralisé de tous les services API

export { default as campaignsApi } from './campaigns';
export { default as contactsApi } from './contacts';
export { default as templatesApi } from './templates';
export { default as BaseApiService } from './base';

// Service API centralisé pour accès facile
export const api = {
  campaigns: () => import('./campaigns').then(m => m.default),
  contacts: () => import('./contacts').then(m => m.default),
  templates: () => import('./templates').then(m => m.default),
};

// Types ré-exportés pour facilité d'utilisation
export type {
  ApiResponse,
  PaginatedResponse,
  BaseQueryParams,
  ApiError
} from '@/types/api';

export type {
  Campaign,
  CampaignStatus,
  CreateCampaignRequest,
  UpdateCampaignRequest
} from '@/types/campaign';

export type {
  Contact,
  ContactStatus,
  ContactList,
  CreateContactRequest,
  UpdateContactRequest
} from '@/types/contact';

export type {
  EmailTemplate,
  TemplateCategory,
  CreateTemplateRequest,
  UpdateTemplateRequest
} from '@/types/template';