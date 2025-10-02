// Service API de base pour la plateforme EmailPro
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { ApiResponse, PaginatedResponse, RequestConfig } from '@/types/api';

class BaseApiService {
  protected client: AxiosInstance;
  protected baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
    
    this.client = axios.create({
      baseURL: `${this.baseURL}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor pour ajouter le token d'authentification
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor pour gérer les erreurs globales
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        
        // Formater l'erreur pour une meilleure gestion
        const apiError = {
          message: error.response?.data?.message || error.message,
          code: error.response?.data?.code || error.code,
          status: error.response?.status,
          details: error.response?.data?.details,
        };
        
        return Promise.reject(apiError);
      }
    );
  }

  // Méthodes HTTP génériques
  protected async get<T>(
    url: string, 
    params?: any, 
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.client.get(url, { 
      params, 
      ...this.buildAxiosConfig(config) 
    });
    return response.data;
  }

  protected async post<T>(
    url: string, 
    data?: any, 
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.client.post(url, data, this.buildAxiosConfig(config));
    return response.data;
  }

  protected async put<T>(
    url: string, 
    data?: any, 
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.client.put(url, data, this.buildAxiosConfig(config));
    return response.data;
  }

  protected async patch<T>(
    url: string, 
    data?: any, 
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.client.patch(url, data, this.buildAxiosConfig(config));
    return response.data;
  }

  protected async delete<T>(
    url: string, 
    config?: RequestConfig
  ): Promise<T> {
    const response = await this.client.delete(url, this.buildAxiosConfig(config));
    return response.data;
  }

  // Upload de fichiers
  protected async upload<T>(
    url: string,
    file: File,
    data?: any,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
    }

    const response = await this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  }

  private buildAxiosConfig(config?: RequestConfig): AxiosRequestConfig {
    return {
      timeout: config?.timeout,
      headers: config?.headers,
      withCredentials: config?.withCredentials,
    };
  }

  // Utilitaires pour construire les paramètres de requête
  protected buildQueryParams(params: Record<string, any>): Record<string, any> {
    const cleanParams: Record<string, any> = {};
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          cleanParams[key] = value.join(',');
        } else if (value instanceof Date) {
          cleanParams[key] = value.toISOString();
        } else {
          cleanParams[key] = value;
        }
      }
    });
    
    return cleanParams;
  }

  // Gestion des erreurs standardisée
  protected handleError(error: any): never {
    console.error('API Error:', error);
    
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Une erreur est survenue');
    }
    
    if (error.message) {
      throw new Error(error.message);
    }
    
    throw new Error('Une erreur inattendue est survenue');
  }

  // Méthode pour vérifier si l'API est accessible
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch {
      return false;
    }
  }

  // Méthode pour obtenir les informations de version de l'API
  async getVersion(): Promise<{ version: string; build: string }> {
    return this.get('/version');
  }
}

export default BaseApiService;