# Structure des Types TypeScript - EmailPro

Cette documentation décrit la structure complète des types TypeScript pour la plateforme EmailPro.

## 📚 **Vue d'ensemble**

La plateforme EmailPro utilise une architecture TypeScript strictement typée pour garantir la fiabilité et la maintenabilité du code.

### Structure des fichiers

```
src/types/
├── index.ts          # Export centralisé de tous les types
├── api.ts            # Types génériques pour les APIs
├── user.ts           # Types pour les utilisateurs
├── contact.ts        # Types pour les contacts et listes
├── campaign.ts       # Types pour les campagnes d'emailing
└── template.ts       # Types pour les templates d'emails
```

## 📝 **Types Principaux**

### 1. User (Utilisateur)

**Interface principale :**
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  preferences: UserPreferences;
}
```

**Rôles disponibles :**
- `admin` : Accès complet à toutes les fonctionnalités
- `user` : Accès standard aux campagnes, contacts et templates
- `viewer` : Accès en lecture seule

### 2. Contact

**Interface principale :**
```typescript
interface Contact {
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
}
```

**Statuts disponibles :**
- `active` : Contact actif, peut recevoir des emails
- `unsubscribed` : Contact désabonné
- `bounced` : Email rejeté (hard/soft bounce)
- `complained` : Plainte pour spam

### 3. Campaign (Campagne)

**Interface principale :**
```typescript
interface Campaign {
  id: string;
  name: string;
  subject: string;
  preheader?: string;
  status: CampaignStatus;
  type: CampaignType;
  // Contenu
  htmlContent: string;
  textContent: string;
  templateId?: string;
  // Configuration d'envoi
  senderName: string;
  senderEmail: string;
  replyToEmail?: string;
  // Destinataires
  contactListIds: string[];
  segmentFilters?: SegmentFilter[];
  excludedContactIds: string[];
  // Programmation
  scheduledAt?: Date;
  sentAt?: Date;
  // Statistiques
  stats: CampaignStats;
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
```

**Statuts de campagne :**
- `draft` : Brouillon, en cours de création
- `scheduled` : Programmée pour envoi
- `sending` : En cours d'envoi
- `sent` : Envoyée avec succès
- `paused` : En pause (envoi suspendu)
- `cancelled` : Annulée
- `failed` : Échec de l'envoi

### 4. EmailTemplate

**Interface principale :**
```typescript
interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  category: TemplateCategory;
  // Contenu
  htmlContent: string;
  textContent: string;
  subject: string;
  preheader?: string;
  // Configuration
  variables: TemplateVariable[];
  isDefault: boolean;
  isPublic: boolean;
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  usageCount: number;
  lastUsedAt?: Date;
}
```

**Catégories de templates :**
- `newsletter` : Newsletters régulières
- `promotion` : Emails promotionnels
- `transactional` : Emails transactionnels
- `welcome` : Emails de bienvenue
- `announcement` : Annonces
- `event` : Événements
- `survey` : Enquêtes
- `other` : Autres

## 🔌 **Types API**

### Réponses Standard

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  error?: string;
  message?: string;
}
```

### Pagination

```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
```

## 🛠️ **Services et Hooks**

### Structure des Services API

Chaque entité possède son service API dédié :

```typescript
// Exemple pour les campagnes
class CampaignsApiService extends BaseApiService {
  async getCampaigns(params: CampaignQueryParams): Promise<PaginatedResponse<Campaign>>
  async getCampaign(id: string): Promise<ApiResponse<Campaign>>
  async createCampaign(data: CreateCampaignRequest): Promise<ApiResponse<Campaign>>
  async updateCampaign(id: string, data: UpdateCampaignRequest): Promise<ApiResponse<Campaign>>
  async deleteCampaign(id: string): Promise<ApiResponse<void>>
  // ... autres méthodes
}
```

### Hooks React Personnalisés

Chaque service API a ses hooks correspondants :

```typescript
// Hook pour la liste des campagnes
useCampaigns(params?: CampaignQueryParams)

// Hook pour une campagne spécifique
useCampaign(id: string)

// Hook pour la création
useCreateCampaign()

// Hook pour la mise à jour
useUpdateCampaign()

// Hook composite pour toutes les opérations
useCampaignManagement()
```

## ⚙️ **Validation**

### Services de Validation

Chaque type possède ses validateurs :

```typescript
// Validation des emails
EmailValidator.isValidEmail(email: string): boolean
EmailValidator.isDisposableEmail(email: string): boolean

// Validation des campagnes
CampaignValidator.validateCreateCampaign(data: CreateCampaignRequest): ValidationResult
CampaignValidator.canEditCampaign(status: CampaignStatus): boolean

// Validation des contacts
ContactValidator.validateCreateContact(data: CreateContactRequest): ValidationResult
```

## 🎨 **Formatage**

### Services de Formatage

```typescript
// Formatage des dates
DateFormatter.formatDate(date: Date, format?: string): string
DateFormatter.formatRelativeTime(date: Date): string

// Formatage des nombres
NumberFormatter.formatNumber(num: number, decimals?: number): string
NumberFormatter.formatPercentage(num: number): string
NumberFormatter.formatCurrency(amount: number): string

// Formatage du texte
TextFormatter.truncateText(text: string, length: number): string
TextFormatter.capitalizeFirst(text: string): string
```

## 📊 **Constantes**

Toutes les constantes sont centralisées :

```typescript
// Statuts avec labels
ENTITY_STATUSES.CAMPAIGN.DRAFT // 'draft'
STATUS_LABELS.CAMPAIGN['draft'] // 'Brouillon'
STATUS_COLORS.CAMPAIGN['draft'] // 'bg-gray-100 text-gray-800'

// Configuration
API_CONFIG.TIMEOUT // 30000
PAGINATION_CONFIG.DEFAULT_PAGE_SIZE // 25
FORM_CONFIG.DEBOUNCE_DELAY // 300
```

## 🔒 **Permissions et Rôles**

```typescript
// Rôles
USER_ROLES.ADMIN // 'admin'
USER_ROLES.USER // 'user'
USER_ROLES.VIEWER // 'viewer'

// Permissions
PERMISSIONS.CAMPAIGNS.CREATE // 'campaigns:create'
PERMISSIONS.CONTACTS.EXPORT // 'contacts:export'

// Permissions par rôle
ROLE_PERMISSIONS[USER_ROLES.ADMIN] // Toutes les permissions
ROLE_PERMISSIONS[USER_ROLES.USER] // Permissions standard
```

## 🚀 **Utilisation**

### Import des Types

```typescript
// Import centralisé
import type { Campaign, Contact, EmailTemplate, User } from '@/types';

// Import spécifique
import type { CampaignStatus, CreateCampaignRequest } from '@/types/campaign';
```

### Utilisation des Services

```typescript
// Dans un composant React
import { useCampaigns, useCreateCampaign } from '@/hooks';

const CampaignsPage = () => {
  const { campaigns, isLoading, error, refetch } = useCampaigns();
  const { createCampaign, isLoading: isCreating } = useCreateCampaign();
  
  // Utilisation...
};
```

### Validation

```typescript
import { ValidationService } from '@/services/validation';

const campaignData: CreateCampaignRequest = { /* ... */ };
const validation = ValidationService.campaign.validateCreateCampaign(campaignData);

if (!validation.isValid) {
  console.log('Erreurs:', validation.errors);
}
```

## 📝 **Notes Importantes**

1. **Tous les IDs sont des strings** pour flexibilité (UUID, ObjectId, etc.)
2. **Les dates sont des objets Date** - conversion automatique depuis/vers ISO strings
3. **Validation stricte** - tous les champs requis sont vérifiés
4. **Extensibilité** - structure prête pour l'ajout de nouvelles fonctionnalités
5. **Performance** - types optimisés pour la sérialisation JSON
6. **Sécurité** - validation des données d'entrée systématique

Cette architecture TypeScript fournit une base solide et extensible pour la plateforme EmailPro, avec une gestion d'état moderne et des APIs bien typées.