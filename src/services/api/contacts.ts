// Service API pour la gestion des contacts
import BaseApiService from './base';
import type {
  Contact,
  ContactStatus,
  ContactList,
  ContactSegment,
  CreateContactRequest,
  UpdateContactRequest,
  CreateContactListRequest,
  UpdateContactListRequest,
  ImportContactsRequest,
  ImportResult
} from '@/types/contact';
import type { ApiResponse, PaginatedResponse, BaseQueryParams } from '@/types/api';

interface ContactQueryParams extends BaseQueryParams {
  status?: ContactStatus;
  listId?: string;
  tags?: string[];
  segmentId?: string;
  source?: string;
  hasActivity?: boolean;
  lastActivityBefore?: Date;
  lastActivityAfter?: Date;
}

class ContactsApiService extends BaseApiService {
  private readonly endpoint = '/contacts';
  private readonly listsEndpoint = '/contact-lists';
  private readonly segmentsEndpoint = '/contact-segments';

  // === GESTION DES CONTACTS ===
  
  // Obtenir tous les contacts avec filtres et pagination
  async getContacts(
    params: ContactQueryParams = {}
  ): Promise<PaginatedResponse<Contact>> {
    const queryParams = this.buildQueryParams({
      page: params.page || 1,
      limit: params.limit || 25,
      search: params.search,
      status: params.status,
      listId: params.listId,
      tags: params.tags,
      segmentId: params.segmentId,
      source: params.source,
      hasActivity: params.hasActivity,
      lastActivityBefore: params.lastActivityBefore,
      lastActivityAfter: params.lastActivityAfter,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc'
    });

    return this.get<PaginatedResponse<Contact>>(this.endpoint, queryParams);
  }

  // Obtenir un contact spécifique
  async getContact(id: string): Promise<ApiResponse<Contact>> {
    return this.get<ApiResponse<Contact>>(`${this.endpoint}/${id}`);
  }

  // Créer un nouveau contact
  async createContact(data: CreateContactRequest): Promise<ApiResponse<Contact>> {
    return this.post<ApiResponse<Contact>>(this.endpoint, data);
  }

  // Mettre à jour un contact
  async updateContact(
    id: string, 
    data: UpdateContactRequest
  ): Promise<ApiResponse<Contact>> {
    return this.put<ApiResponse<Contact>>(`${this.endpoint}/${id}`, data);
  }

  // Supprimer un contact
  async deleteContact(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
  }

  // Supprimer plusieurs contacts
  async deleteContacts(ids: string[]): Promise<ApiResponse<{ deleted: number }>> {
    return this.post<ApiResponse<{ deleted: number }>>(
      `${this.endpoint}/bulk-delete`,
      { ids }
    );
  }

  // Désabonner un contact
  async unsubscribeContact(id: string): Promise<ApiResponse<Contact>> {
    return this.post<ApiResponse<Contact>>(`${this.endpoint}/${id}/unsubscribe`);
  }

  // Réabonner un contact
  async resubscribeContact(id: string): Promise<ApiResponse<Contact>> {
    return this.post<ApiResponse<Contact>>(`${this.endpoint}/${id}/resubscribe`);
  }

  // Ajouter des tags à un contact
  async addTagsToContact(id: string, tags: string[]): Promise<ApiResponse<Contact>> {
    return this.post<ApiResponse<Contact>>(`${this.endpoint}/${id}/tags`, { tags });
  }

  // Supprimer des tags d'un contact
  async removeTagsFromContact(id: string, tags: string[]): Promise<ApiResponse<Contact>> {
    const response = await this.client.delete(`${this.endpoint}/${id}/tags`, {
      data: { tags }
    });
    return response.data;
  }

  // Obtenir l'historique d'activité d'un contact
  async getContactActivity(
    id: string,
    params: BaseQueryParams = {}
  ): Promise<PaginatedResponse<any>> {
    const queryParams = this.buildQueryParams({
      page: params.page || 1,
      limit: params.limit || 25,
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc'
    });

    return this.get<PaginatedResponse<any>>(
      `${this.endpoint}/${id}/activity`,
      queryParams
    );
  }

  // Importer des contacts depuis un fichier CSV
  async importContacts(
    file: File,
    options: {
      listId?: string;
      mapping?: Record<string, string>;
      updateExisting?: boolean;
      source?: string;
    } = {},
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<ImportResult>> {
    return this.upload<ApiResponse<ImportResult>>(
      `${this.endpoint}/import`,
      file,
      options,
      onProgress
    );
  }

  // Exporter des contacts
  async exportContacts(
    params: {
      format?: 'csv' | 'xlsx';
      listId?: string;
      segmentId?: string;
      status?: ContactStatus;
      tags?: string[];
    } = {}
  ): Promise<Blob> {
    const queryParams = this.buildQueryParams({
      format: params.format || 'csv',
      listId: params.listId,
      segmentId: params.segmentId,
      status: params.status,
      tags: params.tags
    });

    const response = await this.client.get(`${this.endpoint}/export`, {
      params: queryParams,
      responseType: 'blob'
    });
    return response.data;
  }

  // === GESTION DES LISTES DE CONTACTS ===
  
  // Obtenir toutes les listes de contacts
  async getContactLists(
    params: BaseQueryParams = {}
  ): Promise<PaginatedResponse<ContactList>> {
    const queryParams = this.buildQueryParams({
      page: params.page || 1,
      limit: params.limit || 25,
      search: params.search,
      sortBy: params.sortBy || 'name',
      sortOrder: params.sortOrder || 'asc'
    });

    return this.get<PaginatedResponse<ContactList>>(this.listsEndpoint, queryParams);
  }

  // Obtenir une liste de contacts spécifique
  async getContactList(id: string): Promise<ApiResponse<ContactList>> {
    return this.get<ApiResponse<ContactList>>(`${this.listsEndpoint}/${id}`);
  }

  // Créer une nouvelle liste de contacts
  async createContactList(
    data: CreateContactListRequest
  ): Promise<ApiResponse<ContactList>> {
    return this.post<ApiResponse<ContactList>>(this.listsEndpoint, data);
  }

  // Mettre à jour une liste de contacts
  async updateContactList(
    id: string,
    data: UpdateContactListRequest
  ): Promise<ApiResponse<ContactList>> {
    return this.put<ApiResponse<ContactList>>(`${this.listsEndpoint}/${id}`, data);
  }

  // Supprimer une liste de contacts
  async deleteContactList(id: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(`${this.listsEndpoint}/${id}`);
  }

  // Ajouter des contacts à une liste
  async addContactsToList(
    listId: string,
    contactIds: string[]
  ): Promise<ApiResponse<{ added: number }>> {
    return this.post<ApiResponse<{ added: number }>>(
      `${this.listsEndpoint}/${listId}/contacts`,
      { contactIds }
    );
  }

  // Supprimer des contacts d'une liste
  async removeContactsFromList(
    listId: string,
    contactIds: string[]
  ): Promise<ApiResponse<{ removed: number }>> {
    const response = await this.client.delete(`${this.listsEndpoint}/${listId}/contacts`, {
      data: { contactIds }
    });
    return response.data;
  }

  // === GESTION DES SEGMENTS ===
  
  // Obtenir tous les segments
  async getContactSegments(
    params: BaseQueryParams = {}
  ): Promise<PaginatedResponse<ContactSegment>> {
    const queryParams = this.buildQueryParams({
      page: params.page || 1,
      limit: params.limit || 25,
      search: params.search,
      sortBy: params.sortBy || 'name',
      sortOrder: params.sortOrder || 'asc'
    });

    return this.get<PaginatedResponse<ContactSegment>>(this.segmentsEndpoint, queryParams);
  }

  // Créer un nouveau segment
  async createContactSegment(
    data: Omit<ContactSegment, 'id' | 'contactCount' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<ContactSegment>> {
    return this.post<ApiResponse<ContactSegment>>(this.segmentsEndpoint, data);
  }

  // Prévisualiser un segment (obtenir le nombre de contacts correspondants)
  async previewSegment(
    filters: any[]
  ): Promise<ApiResponse<{ count: number; preview: Contact[] }>> {
    return this.post<ApiResponse<{ count: number; preview: Contact[] }>>(
      `${this.segmentsEndpoint}/preview`,
      { filters }
    );
  }

  // === STATISTIQUES ET ANALYTICS ===
  
  // Obtenir les statistiques globales des contacts
  async getContactStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    unsubscribed: number;
    bounced: number;
    complained: number;
    growth: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  }>> {
    return this.get<ApiResponse<any>>('/contacts/stats');
  }

  // Obtenir les tags les plus utilisés
  async getTopTags(limit: number = 20): Promise<ApiResponse<Array<{
    tag: string;
    count: number;
  }>>> {
    return this.get<ApiResponse<any>>('/contacts/tags/top', { limit });
  }

  // Valider une adresse email
  async validateEmail(email: string): Promise<ApiResponse<{
    isValid: boolean;
    isDisposable: boolean;
    isDomainValid: boolean;
    suggestion?: string;
  }>> {
    return this.post<ApiResponse<any>>('/contacts/validate-email', { email });
  }

  // Nettoyer les contacts inactifs
  async cleanupInactiveContacts(
    params: {
      lastActivityBefore: Date;
      dryRun?: boolean;
    }
  ): Promise<ApiResponse<{ contactsToCleanup: number; cleaned?: number }>> {
    return this.post<ApiResponse<any>>('/contacts/cleanup', params);
  }
}

export default new ContactsApiService();