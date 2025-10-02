# Services EmailPro - Architecture et Utilisation

Cette documentation décrit l'architecture des services pour la plateforme EmailPro.

## 🏗️ **Architecture Globale**

```
src/services/
├── api/
│   ├── base.ts           # Service API de base
│   ├── campaigns.ts      # API Campagnes
│   ├── contacts.ts       # API Contacts
│   ├── templates.ts      # API Templates
│   └── index.ts          # Export centralisé
├── validation.ts      # Services de validation
├── formatting.ts      # Services de formatage
└── constants.ts       # Constantes de l'application
```

## 🔌 **Services API**

### BaseApiService

Classe de base pour tous les services API avec :
- Configuration Axios centralisée
- Gestion automatique des tokens d'authentification
- Intercepteurs pour les erreurs globales
- Méthodes HTTP génériques (GET, POST, PUT, DELETE)
- Upload de fichiers
- Gestion des timeouts et retry

```typescript
class BaseApiService {
  protected client: AxiosInstance;
  
  // Méthodes HTTP génériques
  protected async get<T>(url: string, params?: any): Promise<T>
  protected async post<T>(url: string, data?: any): Promise<T>
  protected async put<T>(url: string, data?: any): Promise<T>
  protected async delete<T>(url: string): Promise<T>
  
  // Upload de fichiers avec progress
  protected async upload<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T>
}
```

### CampaignsApiService

Service spécialisé pour la gestion des campagnes :

```typescript
class CampaignsApiService extends BaseApiService {
  // CRUD de base
  async getCampaigns(params?: CampaignQueryParams): Promise<PaginatedResponse<Campaign>>
  async getCampaign(id: string): Promise<ApiResponse<Campaign>>
  async createCampaign(data: CreateCampaignRequest): Promise<ApiResponse<Campaign>>
  async updateCampaign(id: string, data: UpdateCampaignRequest): Promise<ApiResponse<Campaign>>
  async deleteCampaign(id: string): Promise<ApiResponse<void>>
  
  // Actions spécifiques
  async sendCampaign(id: string, options?: SendCampaignRequest): Promise<ApiResponse<void>>
  async scheduleCampaign(id: string, scheduledAt: Date): Promise<ApiResponse<Campaign>>
  async pauseCampaign(id: string): Promise<ApiResponse<Campaign>>
  async resumeCampaign(id: string): Promise<ApiResponse<Campaign>>
  async duplicateCampaign(id: string, name?: string): Promise<ApiResponse<Campaign>>
  
  // Statistiques et rapports
  async getCampaignStats(id: string): Promise<ApiResponse<CampaignStats>>
  async getCampaignEmails(id: string, params?: BaseQueryParams): Promise<PaginatedResponse<EmailSend>>
  async getDeliverabilityReport(id: string): Promise<ApiResponse<any>>
  
  // Tests A/B
  async setupABTest(id: string, config: ABTestConfig): Promise<ApiResponse<Campaign>>
  async selectABTestWinner(id: string, winnerVariantId: string): Promise<ApiResponse<Campaign>>
  
  // Utilitaires
  async previewCampaign(id: string, contactId?: string): Promise<ApiResponse<CampaignPreview>>
  async sendTestEmails(id: string, emails: string[]): Promise<ApiResponse<void>>
  async exportCampaignData(id: string, format?: 'csv' | 'xlsx' | 'json'): Promise<Blob>
}
```

### ContactsApiService

Service spécialisé pour la gestion des contacts :

```typescript
class ContactsApiService extends BaseApiService {
  // CRUD contacts
  async getContacts(params?: ContactQueryParams): Promise<PaginatedResponse<Contact>>
  async getContact(id: string): Promise<ApiResponse<Contact>>
  async createContact(data: CreateContactRequest): Promise<ApiResponse<Contact>>
  async updateContact(id: string, data: UpdateContactRequest): Promise<ApiResponse<Contact>>
  async deleteContact(id: string): Promise<ApiResponse<void>>
  async deleteContacts(ids: string[]): Promise<ApiResponse<{ deleted: number }>>
  
  // Actions sur contacts
  async unsubscribeContact(id: string): Promise<ApiResponse<Contact>>
  async resubscribeContact(id: string): Promise<ApiResponse<Contact>>
  async addTagsToContact(id: string, tags: string[]): Promise<ApiResponse<Contact>>
  async removeTagsFromContact(id: string, tags: string[]): Promise<ApiResponse<Contact>>
  
  // Activité et historique
  async getContactActivity(id: string, params?: BaseQueryParams): Promise<PaginatedResponse<any>>
  
  // Import/Export
  async importContacts(file: File, options?: any, onProgress?: (progress: number) => void): Promise<ApiResponse<ImportResult>>
  async exportContacts(params?: any): Promise<Blob>
  
  // Gestion des listes
  async getContactLists(params?: BaseQueryParams): Promise<PaginatedResponse<ContactList>>
  async createContactList(data: CreateContactListRequest): Promise<ApiResponse<ContactList>>
  async updateContactList(id: string, data: UpdateContactListRequest): Promise<ApiResponse<ContactList>>
  async deleteContactList(id: string): Promise<ApiResponse<void>>
  async addContactsToList(listId: string, contactIds: string[]): Promise<ApiResponse<{ added: number }>>
  async removeContactsFromList(listId: string, contactIds: string[]): Promise<ApiResponse<{ removed: number }>>
  
  // Segmentation
  async getContactSegments(params?: BaseQueryParams): Promise<PaginatedResponse<ContactSegment>>
  async createContactSegment(data: any): Promise<ApiResponse<ContactSegment>>
  async previewSegment(filters: any[]): Promise<ApiResponse<{ count: number; preview: Contact[] }>>
  
  // Statistiques et utilitaires
  async getContactStats(): Promise<ApiResponse<any>>
  async getTopTags(limit?: number): Promise<ApiResponse<Array<{ tag: string; count: number }>>>
  async validateEmail(email: string): Promise<ApiResponse<any>>
  async cleanupInactiveContacts(params: any): Promise<ApiResponse<any>>
}
```

### TemplatesApiService

Service spécialisé pour la gestion des templates :

```typescript
class TemplatesApiService extends BaseApiService {
  // CRUD templates
  async getTemplates(params?: TemplateQueryParams): Promise<PaginatedResponse<EmailTemplate>>
  async getTemplate(id: string): Promise<ApiResponse<EmailTemplate>>
  async createTemplate(data: CreateTemplateRequest): Promise<ApiResponse<EmailTemplate>>
  async updateTemplate(id: string, data: UpdateTemplateRequest): Promise<ApiResponse<EmailTemplate>>
  async deleteTemplate(id: string): Promise<ApiResponse<void>>
  
  // Actions spécifiques
  async duplicateTemplate(id: string, name?: string): Promise<ApiResponse<EmailTemplate>>
  async previewTemplate(id: string, variables?: Record<string, any>): Promise<ApiResponse<TemplatePreview>>
  
  // Recherche et découverte
  async getPopularTemplates(limit?: number): Promise<ApiResponse<EmailTemplate[]>>
  async getTemplatesByCategory(category: TemplateCategory): Promise<ApiResponse<EmailTemplate[]>>
  async searchTemplatesByContent(query: string, params?: any): Promise<ApiResponse<EmailTemplate[]>>
  
  // Import/Export
  async importTemplate(importData: TemplateImport): Promise<ApiResponse<EmailTemplate>>
  async exportTemplate(id: string, format?: 'html' | 'json' | 'mjml'): Promise<Blob>
  
  // Versioning
  async getTemplateVersions(id: string): Promise<ApiResponse<any[]>>
  async restoreTemplateVersion(id: string, version: number): Promise<ApiResponse<EmailTemplate>>
  
  // Blocs de contenu
  async getContentBlocks(params?: ContentBlockQueryParams): Promise<PaginatedResponse<ContentBlock>>
  async createContentBlock(data: CreateContentBlockRequest): Promise<ApiResponse<ContentBlock>>
  async updateContentBlock(id: string, data: UpdateContentBlockRequest): Promise<ApiResponse<ContentBlock>>
  async deleteContentBlock(id: string): Promise<ApiResponse<void>>
  
  // Utilitaires et outils
  async validateTemplateHtml(html: string): Promise<ApiResponse<any>>
  async optimizeTemplateImages(id: string): Promise<ApiResponse<any>>
  async testEmailClientCompatibility(id: string, clients?: string[]): Promise<ApiResponse<any>>
  async generateTextContent(html: string): Promise<ApiResponse<{ textContent: string }>>
  async getTemplateUsageStats(id?: string): Promise<ApiResponse<any>>
}
```

## ✓ **Services de Validation**

### EmailValidator

```typescript
class EmailValidator {
  static isValidEmail(email: string): boolean
  static isDomainValid(domain: string): boolean
  static isDisposableEmail(email: string): boolean
  static extractDomain(email: string): string | null
  static suggestEmailCorrection(email: string): string | null
}
```

### CampaignValidator

```typescript
class CampaignValidator {
  static validateCreateCampaign(data: CreateCampaignRequest): ValidationResult
  static validateCampaignStatus(status: CampaignStatus): boolean
  static canEditCampaign(status: CampaignStatus): boolean
  static canSendCampaign(status: CampaignStatus): boolean
  static canDeleteCampaign(status: CampaignStatus): boolean
}
```

### ContactValidator

```typescript
class ContactValidator {
  static validateCreateContact(data: CreateContactRequest): ValidationResult
  static validateContactStatus(status: ContactStatus): boolean
  static canEmailContact(status: ContactStatus): boolean
}
```

### TemplateValidator

```typescript
class TemplateValidator {
  static validateCreateTemplate(data: CreateTemplateRequest): ValidationResult
  static validateHtmlContent(html: string): ValidationResult
  static validateTemplateVariables(variables: TemplateVariable[]): ValidationResult
}
```

## 🎨 **Services de Formatage**

### DateFormatter

```typescript
class DateFormatter {
  static formatDate(date: Date | string, format?: string, locale?: string): string
  static formatRelativeTime(date: Date | string, locale?: string): string
  static formatDuration(startDate: Date, endDate: Date, unit?: string): string
}
```

### NumberFormatter

```typescript
class NumberFormatter {
  static formatNumber(num: number, decimals?: number, locale?: string): string
  static formatPercentage(num: number, decimals?: number, locale?: string): string
  static formatCurrency(amount: number, currency?: string, locale?: string): string
  static formatCompactNumber(num: number, locale?: string): string
  static formatFileSize(bytes: number): string
  static formatDuration(seconds: number): string
}
```

### TextFormatter

```typescript
class TextFormatter {
  static truncateText(text: string, length: number, suffix?: string): string
  static capitalizeFirst(text: string): string
  static capitalizeWords(text: string): string
  static slugify(text: string): string
  static extractInitials(firstName?: string, lastName?: string): string
  static formatPhoneNumber(phone: string, country?: string): string
  static formatFullName(firstName?: string, lastName?: string, format?: string): string
  static maskEmail(email: string): string
}
```

### EmailFormatter

```typescript
class EmailFormatter {
  static formatEmailStats(stats: any): any
  static getEngagementLevel(openRate: number, clickRate: number): 'excellent' | 'good' | 'average' | 'poor'
  static formatEngagementLevel(level: string): { label: string; color: string; description: string }
}
```

## 📊 **Constantes**

### Configuration de l'Application

```typescript
export const APP_CONFIG = {
  NAME: 'EmailPro',
  VERSION: '1.0.0',
  SUPPORT_EMAIL: 'support@emailpro.com',
  DOCUMENTATION_URL: 'https://docs.emailpro.com'
};

export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  SUPPORTED_FILE_TYPES: ['csv', 'xlsx', 'txt', 'html', 'mjml']
};
```

### Statuts et Labels

```typescript
export const ENTITY_STATUSES = {
  CAMPAIGN: {
    DRAFT: 'draft',
    SCHEDULED: 'scheduled',
    SENDING: 'sending',
    SENT: 'sent',
    PAUSED: 'paused',
    CANCELLED: 'cancelled',
    FAILED: 'failed'
  },
  // ... autres entités
};

export const STATUS_LABELS = {
  CAMPAIGN: {
    'draft': 'Brouillon',
    'scheduled': 'Programmée',
    'sending': 'En cours d\'envoi',
    'sent': 'Envoyée',
    // ... autres statuts
  }
};
```

### Permissions et Rôles

```typescript
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer'
};

export const PERMISSIONS = {
  CAMPAIGNS: {
    VIEW: 'campaigns:view',
    CREATE: 'campaigns:create',
    EDIT: 'campaigns:edit',
    DELETE: 'campaigns:delete',
    SEND: 'campaigns:send'
  },
  // ... autres permissions
};
```

## 🚀 **Utilisation**

### Import des Services

```typescript
// Import direct
import { campaignsApi, contactsApi, templatesApi } from '@/services/api';

// Import des services de validation
import { ValidationService } from '@/services/validation';

// Import des services de formatage
import { FormattingService } from '@/services/formatting';

// Import des constantes
import { CONSTANTS, ENTITY_STATUSES, STATUS_LABELS } from '@/services/constants';
```

### Utilisation dans les Composants

```typescript
// Avec les hooks (recommandé)
import { useCampaigns, useCreateCampaign } from '@/hooks';

const CampaignsPage = () => {
  const { campaigns, isLoading, error } = useCampaigns();
  const { createCampaign, isLoading: isCreating } = useCreateCampaign();
  
  const handleCreate = async (data: CreateCampaignRequest) => {
    // Validation
    const validation = ValidationService.campaign.validateCreateCampaign(data);
    if (!validation.isValid) {
      console.error(validation.errors);
      return;
    }
    
    // Création
    await createCampaign(data);
  };
  
  return (
    <div>
      {campaigns.map(campaign => (
        <div key={campaign.id}>
          <h3>{campaign.name}</h3>
          <span className={STATUS_COLORS.CAMPAIGN[campaign.status]}>
            {STATUS_LABELS.CAMPAIGN[campaign.status]}
          </span>
          <p>Créée le {FormattingService.date.formatDate(campaign.createdAt)}</p>
        </div>
      ))}
    </div>
  );
};
```

### Utilisation Directe des APIs

```typescript
// Pour des cas spécifiques sans hooks
import { campaignsApi } from '@/services/api';

const exportCampaignData = async (campaignId: string) => {
  try {
    const blob = await campaignsApi.exportCampaignData(campaignId, 'csv');
    // Télécharger le fichier
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${campaignId}.csv`;
    a.click();
  } catch (error) {
    console.error('Erreur export:', error);
  }
};
```

## 🔒 **Sécurité**

- **Authentification automatique** : Les tokens sont ajoutés automatiquement aux requêtes
- **Gestion des erreurs 401** : Redirection automatique vers la page de connexion
- **Validation côté client** : Validation systématique avant envoi
- **Sanitisation des données** : Nettoyage automatique des paramètres

## 🛠️ **Configuration et Extensibilité**

- **Configuration centralisée** : Toutes les configurations dans `constants.ts`
- **Services extensibles** : Facile d'ajouter de nouveaux endpoints
- **Types stricts** : Sécurité TypeScript sur toutes les interfaces
- **Gestion d'erreurs robuste** : Intercepteurs et gestion centralisée

Cette architecture fournit une base solide et maintenable pour toutes les interactions avec les APIs de la plateforme EmailPro.