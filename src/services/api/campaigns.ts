// Service API pour la gestion des campagnes
import BaseApiService from './base';
import type {
  Campaign,
  CampaignStatus,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  SendCampaignRequest,
  CampaignPreview,
  CampaignStats,
  EmailSend,
  ABTestConfig
} from '@/types/campaign';
import type { ApiResponse, PaginatedResponse, BaseQueryParams } from '@/types/api';

interface CampaignQueryParams extends BaseQueryParams {
  status?: CampaignStatus;
  type?: 'regular' | 'automation' | 'ab_test';
  createdBy?: string;
  startDate?: Date;
  endDate?: Date;
}

class CampaignsApiService extends BaseApiService {
  private readonly endpoint = '/campaigns';

  // Obtenir toutes les campagnes avec filtres et pagination
  async getCampaigns(
    params: CampaignQueryParams = {}
  ): Promise<PaginatedResponse<Campaign>> {
    const queryParams = this.buildQueryParams({
      page: params.page || 1,
      limit: params.limit || 25,
      search: params.search,
      status: params.status,
      type: params.type,
      createdBy: params.createdBy,
      startDate: params.startDate,
      endDate: params.endDate,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc'
    });

    return this.get<PaginatedResponse<Campaign>>(this.endpoint, queryParams);
  }

  // Obtenir une campagne spécifique
  async getCampaign(id: string): Promise<ApiResponse<Campaign>> {
    return this.get<ApiResponse<Campaign>>(`${this.endpoint}/${id}`);
  }

  // Créer une nouvelle campagne
  async createCampaign(data: CreateCampaignRequest): Promise<ApiResponse<Campaign>> {
    return this.post<ApiResponse<Campaign>>(this.endpoint, data);
  }

  // Mettre à jour une campagne
  async updateCampaign(
    id: string, 
    data: UpdateCampaignRequest
  ): Promise<ApiResponse<Campaign>> {
    return this.put<ApiResponse<Campaign>>(`${this.endpoint}/${id}`, data);
  }

  // Supprimer une campagne
  async deleteCampaign(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  // Dupliquer une campagne
  async duplicateCampaign(id: string, name?: string): Promise<ApiResponse<Campaign>> {
    return this.post<ApiResponse<Campaign>>(`${this.endpoint}/${id}/duplicate`, {
      name: name || `Copie de campagne ${id}`
    });
  }

  // Envoyer une campagne
  async sendCampaign(
    id: string, 
    options: SendCampaignRequest = {}
  ): Promise<ApiResponse<void>> {
    return this.post<ApiResponse<void>>(`${this.endpoint}/${id}/send`, options);
  }

  // Programmer une campagne
  async scheduleCampaign(
    id: string, 
    scheduledAt: Date
  ): Promise<ApiResponse<Campaign>> {
    return this.post<ApiResponse<Campaign>>(`${this.endpoint}/${id}/schedule`, {
      scheduledAt
    });
  }

  // Mettre en pause une campagne en cours d'envoi
  async pauseCampaign(id: string): Promise<ApiResponse<Campaign>> {
    return this.post<ApiResponse<Campaign>>(`${this.endpoint}/${id}/pause`);
  }

  // Reprendre une campagne en pause
  async resumeCampaign(id: string): Promise<ApiResponse<Campaign>> {
    return this.post<ApiResponse<Campaign>>(`${this.endpoint}/${id}/resume`);
  }

  // Annuler une campagne programmée
  async cancelCampaign(id: string): Promise<ApiResponse<Campaign>> {
    return this.post<ApiResponse<Campaign>>(`${this.endpoint}/${id}/cancel`);
  }

  // Obtenir les statistiques d'une campagne
  async getCampaignStats(id: string): Promise<ApiResponse<CampaignStats>> {
    return this.get<ApiResponse<CampaignStats>>(`${this.endpoint}/${id}/stats`);
  }

  // Obtenir les emails envoyés pour une campagne
  async getCampaignEmails(
    id: string,
    params: BaseQueryParams = {}
  ): Promise<PaginatedResponse<EmailSend>> {
    const queryParams = this.buildQueryParams({
      page: params.page || 1,
      limit: params.limit || 25,
      search: params.search,
      sortBy: params.sortBy || 'sentAt',
      sortOrder: params.sortOrder || 'desc'
    });

    return this.get<PaginatedResponse<EmailSend>>(
      `${this.endpoint}/${id}/emails`,
      queryParams
    );
  }

  // Prévisualiser une campagne
  async previewCampaign(
    id: string,
    contactId?: string
  ): Promise<ApiResponse<CampaignPreview>> {
    const params = contactId ? { contactId } : {};
    return this.get<ApiResponse<CampaignPreview>>(
      `${this.endpoint}/${id}/preview`,
      params
    );
  }

  // Envoyer des emails de test
  async sendTestEmails(
    id: string,
    emails: string[]
  ): Promise<ApiResponse<void>> {
    return this.post<ApiResponse<void>>(`${this.endpoint}/${id}/test`, {
      emails
    });
  }

  // Obtenir les rapports de délivrabilité
  async getDeliverabilityReport(id: string): Promise<ApiResponse<any>> {
    return this.get<ApiResponse<any>>(`${this.endpoint}/${id}/deliverability`);
  }

  // Configurer un test A/B
  async setupABTest(
    id: string,
    config: ABTestConfig
  ): Promise<ApiResponse<Campaign>> {
    return this.post<ApiResponse<Campaign>>(`${this.endpoint}/${id}/ab-test`, config);
  }

  // Sélectionner le gagnant d'un test A/B
  async selectABTestWinner(
    id: string,
    winnerVariantId: string
  ): Promise<ApiResponse<Campaign>> {
    return this.post<ApiResponse<Campaign>>(
      `${this.endpoint}/${id}/ab-test/winner`,
      { winnerVariantId }
    );
  }

  // Exporter les données d'une campagne
  async exportCampaignData(
    id: string,
    format: 'csv' | 'xlsx' | 'json' = 'csv'
  ): Promise<Blob> {
    const response = await this.client.get(`${this.endpoint}/${id}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  }

  // Obtenir les statistiques globales des campagnes
  async getGlobalStats(params: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'week' | 'month';
  } = {}): Promise<ApiResponse<any>> {
    const queryParams = this.buildQueryParams(params);
    return this.get<ApiResponse<any>>('/campaigns/stats/global', queryParams);
  }

  // Obtenir les meilleures performances
  async getTopPerformers(params: {
    metric?: 'open_rate' | 'click_rate' | 'conversion_rate';
    limit?: number;
    period?: 'week' | 'month' | 'quarter' | 'year';
  } = {}): Promise<ApiResponse<Campaign[]>> {
    const queryParams = this.buildQueryParams({
      metric: params.metric || 'open_rate',
      limit: params.limit || 10,
      period: params.period || 'month'
    });
    return this.get<ApiResponse<Campaign[]>>('/campaigns/top-performers', queryParams);
  }
}

export default new CampaignsApiService();