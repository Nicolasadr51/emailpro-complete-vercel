// Service API pour la gestion des templates d'emails
import BaseApiService from './base';
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
import type { ApiResponse, PaginatedResponse, BaseQueryParams } from '@/types/api';

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

class TemplatesApiService extends BaseApiService {
  private readonly endpoint = '/templates';
  private readonly blocksEndpoint = '/content-blocks';

  // === GESTION DES TEMPLATES ===
  
  // Obtenir tous les templates avec filtres et pagination
  async getTemplates(
    params: TemplateQueryParams = {}
  ): Promise<PaginatedResponse<EmailTemplate>> {
    const queryParams = this.buildQueryParams({
      page: params.page || 1,
      limit: params.limit || 25,
      search: params.search,
      category: params.category,
      isPublic: params.isPublic,
      createdBy: params.createdBy,
      tags: params.tags,
      sortBy: params.sortBy || 'updatedAt',
      sortOrder: params.sortOrder || 'desc'
    });

    return this.get<PaginatedResponse<EmailTemplate>>(this.endpoint, queryParams);
  }

  // Obtenir un template spécifique
  async getTemplate(id: string): Promise<ApiResponse<EmailTemplate>> {
    return this.get<ApiResponse<EmailTemplate>>(`${this.endpoint}/${id}`);
  }

  // Créer un nouveau template
  async createTemplate(data: CreateTemplateRequest): Promise<ApiResponse<EmailTemplate>> {
    return this.post<ApiResponse<EmailTemplate>>(this.endpoint, data);
  }

  // Mettre à jour un template
  async updateTemplate(
    id: string,
    data: UpdateTemplateRequest
  ): Promise<ApiResponse<EmailTemplate>> {
    return this.put<ApiResponse<EmailTemplate>>(`${this.endpoint}/${id}`, data);
  }

  // Supprimer un template
  async deleteTemplate(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  // Dupliquer un template
  async duplicateTemplate(
    id: string, 
    name?: string
  ): Promise<ApiResponse<EmailTemplate>> {
    return this.post<ApiResponse<EmailTemplate>>(`${this.endpoint}/${id}/duplicate`, {
      name: name || `Copie de template ${id}`
    });
  }

  // Prévisualiser un template avec des variables
  async previewTemplate(
    id: string,
    variables: Record<string, any> = {}
  ): Promise<ApiResponse<TemplatePreview>> {
    return this.post<ApiResponse<TemplatePreview>>(
      `${this.endpoint}/${id}/preview`,
      { variables }
    );
  }

  // Obtenir les templates les plus utilisés
  async getPopularTemplates(
    limit: number = 10
  ): Promise<ApiResponse<EmailTemplate[]>> {
    return this.get<ApiResponse<EmailTemplate[]>>(
      `${this.endpoint}/popular`,
      { limit }
    );
  }

  // Obtenir les templates par catégorie
  async getTemplatesByCategory(
    category: TemplateCategory
  ): Promise<ApiResponse<EmailTemplate[]>> {
    return this.get<ApiResponse<EmailTemplate[]>>(
      `${this.endpoint}/category/${category}`
    );
  }

  // Rechercher des templates par contenu
  async searchTemplatesByContent(
    query: string,
    params: { limit?: number; category?: TemplateCategory } = {}
  ): Promise<ApiResponse<EmailTemplate[]>> {
    const queryParams = this.buildQueryParams({
      q: query,
      limit: params.limit || 20,
      category: params.category
    });

    return this.get<ApiResponse<EmailTemplate[]>>(
      `${this.endpoint}/search`,
      queryParams
    );
  }

  // Importer un template depuis une source externe
  async importTemplate(
    importData: TemplateImport
  ): Promise<ApiResponse<EmailTemplate>> {
    const formData = new FormData();
    
    if (importData.source === 'file' && importData.data instanceof File) {
      formData.append('file', importData.data);
    } else {
      formData.append('data', importData.data as string);
    }
    
    formData.append('source', importData.source);
    
    if (importData.options) {
      Object.keys(importData.options).forEach(key => {
        formData.append(`options[${key}]`, String(importData.options![key as keyof typeof importData.options]));
      });
    }

    return this.post<ApiResponse<EmailTemplate>>(
      `${this.endpoint}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  }

  // Exporter un template
  async exportTemplate(
    id: string,
    format: 'html' | 'json' | 'mjml' = 'html'
  ): Promise<Blob> {
    const response = await this.client.get(`${this.endpoint}/${id}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }

  // Obtenir l'historique des versions d'un template
  async getTemplateVersions(
    id: string
  ): Promise<ApiResponse<Array<{
    version: number;
    createdAt: Date;
    createdBy: string;
    changes: string[];
  }>>> {
    return this.get<ApiResponse<any>>(`${this.endpoint}/${id}/versions`);
  }

  // Restaurer une version spécifique d'un template
  async restoreTemplateVersion(
    id: string,
    version: number
  ): Promise<ApiResponse<EmailTemplate>> {
    return this.post<ApiResponse<EmailTemplate>>(
      `${this.endpoint}/${id}/versions/${version}/restore`
    );
  }

  // === GESTION DES BLOCS DE CONTENU ===
  
  // Obtenir tous les blocs de contenu
  async getContentBlocks(
    params: ContentBlockQueryParams = {}
  ): Promise<PaginatedResponse<ContentBlock>> {
    const queryParams = this.buildQueryParams({
      page: params.page || 1,
      limit: params.limit || 25,
      search: params.search,
      type: params.type,
      category: params.category,
      isPublic: params.isPublic,
      sortBy: params.sortBy || 'updatedAt',
      sortOrder: params.sortOrder || 'desc'
    });

    return this.get<PaginatedResponse<ContentBlock>>(this.blocksEndpoint, queryParams);
  }

  // Obtenir un bloc de contenu spécifique
  async getContentBlock(id: string): Promise<ApiResponse<ContentBlock>> {
    return this.get<ApiResponse<ContentBlock>>(`${this.blocksEndpoint}/${id}`);
  }

  // Créer un nouveau bloc de contenu
  async createContentBlock(
    data: CreateContentBlockRequest
  ): Promise<ApiResponse<ContentBlock>> {
    return this.post<ApiResponse<ContentBlock>>(this.blocksEndpoint, data);
  }

  // Mettre à jour un bloc de contenu
  async updateContentBlock(
    id: string,
    data: UpdateContentBlockRequest
  ): Promise<ApiResponse<ContentBlock>> {
    return this.put<ApiResponse<ContentBlock>>(`${this.blocksEndpoint}/${id}`, data);
  }

  // Supprimer un bloc de contenu
  async deleteContentBlock(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`${this.blocksEndpoint}/${id}`);
  }

  // Obtenir les blocs de contenu par type
  async getContentBlocksByType(
    type: BlockType
  ): Promise<ApiResponse<ContentBlock[]>> {
    return this.get<ApiResponse<ContentBlock[]>>(
      `${this.blocksEndpoint}/type/${type}`
    );
  }

  // === UTILITAIRES ET OUTILS ===
  
  // Valider le HTML d'un template
  async validateTemplateHtml(
    html: string
  ): Promise<ApiResponse<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  }>> {
    return this.post<ApiResponse<any>>('/templates/validate-html', { html });
  }

  // Optimiser les images d'un template
  async optimizeTemplateImages(
    id: string
  ): Promise<ApiResponse<{
    originalSize: number;
    optimizedSize: number;
    savings: number;
    optimizedImages: string[];
  }>> {
    return this.post<ApiResponse<any>>(`${this.endpoint}/${id}/optimize-images`);
  }

  // Tester la compatibilité avec les clients email
  async testEmailClientCompatibility(
    id: string,
    clients?: string[]
  ): Promise<ApiResponse<{
    results: Array<{
      client: string;
      version: string;
      score: number;
      issues: string[];
    }>;
    overallScore: number;
  }>> {
    return this.post<ApiResponse<any>>(
      `${this.endpoint}/${id}/compatibility-test`,
      { clients }
    );
  }

  // Générer automatiquement le contenu texte depuis le HTML
  async generateTextContent(
    html: string
  ): Promise<ApiResponse<{ textContent: string }>> {
    return this.post<ApiResponse<{ textContent: string }>>(
      '/templates/generate-text',
      { html }
    );
  }

  // Obtenir les statistiques d'utilisation des templates
  async getTemplateUsageStats(
    id?: string
  ): Promise<ApiResponse<{
    totalUsage: number;
    recentUsage: Array<{
      date: string;
      count: number;
    }>;
    topTemplates?: Array<{
      id: string;
      name: string;
      usage: number;
    }>;
  }>> {
    const endpoint = id 
      ? `${this.endpoint}/${id}/usage-stats`
      : '/templates/usage-stats';
    
    return this.get<ApiResponse<any>>(endpoint);
  }
}

export default new TemplatesApiService();