// Types génériques pour les APIs de la plateforme EmailPro

// Réponses API standard
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  error?: string;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  field?: string; // Pour les erreurs de validation
  timestamp?: string;
}

// Paramètres de requête communs
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRangeFilter {
  startDate?: Date | string;
  endDate?: Date | string;
}

// Types pour les filtres avancés
export interface FilterParam {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'nin';
  value: any;
}

export interface AdvancedQueryParams extends BaseQueryParams {
  filters?: FilterParam[];
  include?: string[]; // Relations à inclure
  fields?: string[]; // Champs à retourner
}

// Types pour les opérations en lot
export interface BulkOperation<T = any> {
  operation: 'create' | 'update' | 'delete';
  data: T[];
}

export interface BulkOperationResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  errors: BulkOperationError[];
}

export interface BulkOperationError {
  index: number;
  id?: string;
  error: string;
  data?: any;
}

// Types pour l'upload de fichiers
export interface FileUpload {
  file: File;
  field?: string;
  metadata?: Record<string, any>;
}

export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

// Types pour les webhooks
export interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  headers?: Record<string, string>;
  retryPolicy?: RetryPolicy;
}

export interface RetryPolicy {
  maxRetries: number;
  retryDelay: number; // en ms
  backoffMultiplier?: number;
}

export interface WebhookEvent {
  id: string;
  event: string;
  data: any;
  timestamp: Date;
  webhookId: string;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  lastAttempt?: Date;
  response?: {
    status: number;
    body: string;
    headers: Record<string, string>;
  };
}

// Types pour l'authentification
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Types pour les statistiques et analytics
export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface StatsResponse {
  period: {
    start: Date;
    end: Date;
  };
  metrics: Record<string, number>;
  timeSeries?: Record<string, TimeSeriesData[]>;
  compareToPrevious?: {
    period: {
      start: Date;
      end: Date;
    };
    metrics: Record<string, number>;
    changes: Record<string, {
      value: number;
      percentage: number;
      trend: 'up' | 'down' | 'stable';
    }>;
  };
}

// Configuration des requêtes HTTP
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

// Types pour la validation côté client
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Types pour les notifications en temps réel
export interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: Date;
  userId?: string;
}

export interface RealtimeConnection {
  isConnected: boolean;
  lastHeartbeat?: Date;
  reconnectAttempts: number;
}

// Utilitaires de type
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ApiEndpoint = string;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiClient {
  get<T>(url: string, params?: any, config?: RequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  patch<T>(url: string, data?: any, config?: RequestConfig): Promise<T>;
  delete<T>(url: string, config?: RequestConfig): Promise<T>;
}