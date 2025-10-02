// Types pour la gestion des contacts

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  status: ContactStatus;
  tags: string[];
  customFields: Record<string, any>;
  source: ContactSource;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt?: Date;
  
  // Statistiques d'engagement
  totalEmailsSent: number;
  totalEmailsOpened: number;
  totalEmailsClicked: number;
  averageOpenRate: number;
  averageClickRate: number;
  
  // Relations
  listIds: string[];
}

export type ContactStatus = 'active' | 'unsubscribed' | 'bounced' | 'complained';
export type ContactSource = 'import' | 'form' | 'api' | 'manual';

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  contactCount: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations (optionnelles pour éviter les chargements inutiles)
  contacts?: Contact[];
}

export interface ContactActivity {
  id: string;
  contactId: string;
  type: 'email_sent' | 'email_opened' | 'email_clicked' | 'unsubscribed' | 'subscribed';
  campaignId?: string;
  details?: Record<string, any>;
  createdAt: Date;
}

export interface ContactSegment {
  id: string;
  name: string;
  description?: string;
  filters: SegmentFilter[];
  contactCount: number;
  isAutoUpdate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SegmentFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export type FilterOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with' 
  | 'greater_than' 
  | 'less_than' 
  | 'is_empty' 
  | 'is_not_empty'
  | 'in'
  | 'not_in';

// Requests pour les API
export interface CreateContactRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  listIds?: string[];
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {
  status?: ContactStatus;
}

export interface CreateContactListRequest {
  name: string;
  description?: string;
}

export interface UpdateContactListRequest extends Partial<CreateContactListRequest> {}

export interface ImportContactsRequest {
  contacts: CreateContactRequest[];
  listId?: string;
  updateExisting?: boolean;
  source?: ContactSource;
}

export interface ImportResult {
  totalProcessed: number;
  imported: number;
  updated: number;
  skipped: number;
  errors: ImportError[];
}

export interface ImportError {
  row: number;
  email: string;
  error: string;
}

// Constantes
export const CONTACT_STATUSES: Record<ContactStatus, string> = {
  active: 'Actif',
  unsubscribed: 'Désabonné',
  bounced: 'Rejeté',
  complained: 'Plainte'
};

export const CONTACT_SOURCES: Record<ContactSource, string> = {
  import: 'Import CSV',
  form: 'Formulaire',
  api: 'API',
  manual: 'Saisie manuelle'
};

export const FILTER_OPERATORS: Record<FilterOperator, string> = {
  equals: 'Égal à',
  not_equals: 'Différent de',
  contains: 'Contient',
  not_contains: 'Ne contient pas',
  starts_with: 'Commence par',
  ends_with: 'Finit par',
  greater_than: 'Supérieur à',
  less_than: 'Inférieur à',
  is_empty: 'Est vide',
  is_not_empty: 'N\'est pas vide',
  in: 'Dans la liste',
  not_in: 'Pas dans la liste'
};