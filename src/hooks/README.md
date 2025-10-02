# Hooks React Personnalisés - EmailPro

Cette documentation décrit les hooks React personnalisés pour la plateforme EmailPro.

## 🏗️ **Architecture des Hooks**

```
src/hooks/
├── useApi.ts         # Hooks génériques pour les APIs
├── useCampaigns.ts   # Hooks spécialisés pour les campagnes
├── useContacts.ts    # Hooks spécialisés pour les contacts
├── useTemplates.ts   # Hooks spécialisés pour les templates
└── index.ts          # Export centralisé
```

## 🔧 **Hooks Génériques**

### useApi

Hook générique pour les appels API simples :

```typescript
interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  isCalled: boolean;
}

interface UseApiActions<TParams> {
  execute: (params?: TParams) => Promise<void>;
  reset: () => void;
  refresh: () => Promise<void>;
}

// Utilisation
const { data, isLoading, error, execute } = useApi(
  (id: string) => campaignsApi.getCampaign(id),
  {
    immediate: true, // Exécuter immédiatement
    onSuccess: (data) => console.log('Succès:', data),
    onError: (error) => console.error('Erreur:', error),
    transform: (data) => ({ ...data, processed: true })
  }
);
```

### usePaginatedApi

Hook spécialisé pour les listes paginées :

```typescript
interface PaginatedState<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

interface PaginatedActions<TParams> {
  execute: (params?: TParams) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

// Utilisation
const {
  data: campaigns,
  total,
  page,
  setPage,
  hasMore,
  loadMore,
  isLoading
} = usePaginatedApi(
  (params) => campaignsApi.getCampaigns(params),
  {
    immediate: true,
    initialPage: 1,
    initialLimit: 25
  }
);
```

### useMutation

Hook pour les opérations de modification (POST, PUT, DELETE) :

```typescript
interface MutationState<TData> {
  data: TData | null;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  isError: boolean;
}

interface MutationActions<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

// Utilisation
const { mutate, isLoading, error, isSuccess } = useMutation(
  (data: CreateCampaignRequest) => campaignsApi.createCampaign(data),
  {
    onSuccess: (data, variables) => {
      console.log('Campagne créée:', data);
      // Rafraîchir la liste
      refetchCampaigns();
    },
    onError: (error, variables) => {
      console.error('Erreur création:', error);
    }
  }
);
```

## 🎨 **Hooks Spécialisés - Campagnes**

### useCampaigns

Hook principal pour la gestion des campagnes :

```typescript
const {
  campaigns,        // Liste des campagnes
  total,           // Nombre total
  page,            // Page actuelle
  limit,           // Éléments par page
  totalPages,      // Nombre total de pages
  hasMore,         // Y a-t-il plus de pages
  isLoading,       // Chargement en cours
  error,           // Erreur éventuelle
  isSuccess,       // Succès du chargement
  stats,           // Statistiques calculées
  setPage,         // Changer de page
  setLimit,        // Changer le nombre par page
  loadMore,        // Charger plus (pagination infinie)
  refresh,         // Rafraîchir
  refetch,         // Recharger avec nouveaux paramètres
  reset            // Remettre à zéro
} = useCampaigns({
  status: 'sent',   // Filtres optionnels
  search: 'newsletter',
  page: 1,
  limit: 25
});

// Statistiques automatiquement calculées
stats = {
  total: 45,
  draft: 12,
  scheduled: 5,
  sending: 2,
  sent: 23,
  paused: 1,
  failed: 2
}
```

### useCampaign

Hook pour une campagne spécifique :

```typescript
const {
  campaign,        // Données de la campagne
  isLoading,      // Chargement
  error,          // Erreur
  isSuccess,      // Succès
  refresh,        // Rafraîchir
  refetch         // Recharger
} = useCampaign(campaignId);
```

### useCampaignStats

Hook pour les statistiques d'une campagne :

```typescript
const {
  stats,          // Statistiques détaillées
  isLoading,
  error,
  refresh
} = useCampaignStats(campaignId);

// stats contient :
// - totalSent, totalDelivered, totalBounced
// - totalOpened, totalClicked, totalUnsubscribed
// - deliveryRate, openRate, clickRate, etc.
```

### useCreateCampaign

Hook pour créer une campagne :

```typescript
const {
  createCampaign,  // Fonction de création
  isLoading,       // Création en cours
  error,           // Erreur de création
  isSuccess,       // Succès de création
  campaign,        // Campagne créée
  reset            // Reset de l'état
} = useCreateCampaign();

// Utilisation
const handleCreate = async () => {
  const newCampaign = await createCampaign({
    name: 'Ma nouvelle campagne',
    subject: 'Sujet de l\'email',
    htmlContent: '<h1>Contenu HTML</h1>',
    textContent: 'Contenu texte',
    senderName: 'EmailPro',
    senderEmail: 'noreply@emailpro.com',
    contactListIds: ['list-1', 'list-2']
  });
  
  if (newCampaign) {
    console.log('Campagne créée:', newCampaign);
  }
};
```

### useCampaignActions

Hook pour les actions sur les campagnes :

```typescript
const {
  pauseCampaign,      // Mettre en pause
  resumeCampaign,     // Reprendre
  cancelCampaign,     // Annuler
  scheduleCampaign,   // Programmer
  isLoading,          // Action en cours
  error,              // Erreur
  reset               // Reset
} = useCampaignActions();

// Utilisation
const handlePause = async (campaignId: string) => {
  await pauseCampaign(campaignId);
};

const handleSchedule = async (campaignId: string, date: Date) => {
  await scheduleCampaign(campaignId, date);
};
```

### useCampaignManagement

Hook composite pour toutes les opérations sur les campagnes :

```typescript
const {
  create,          // useCreateCampaign
  update,          // useUpdateCampaign
  delete: deleteCampaign,  // useDeleteCampaign
  duplicate,       // useDuplicateCampaign
  send,           // useSendCampaign
  actions,        // useCampaignActions
  testEmails      // useSendTestEmails
} = useCampaignManagement();
```

## 📞 **Hooks Spécialisés - Contacts**

### useContacts

Hook principal pour la gestion des contacts :

```typescript
const {
  contacts,        // Liste des contacts
  total,          // Nombre total
  page,           // Page actuelle
  limit,          // Éléments par page
  totalPages,     // Nombre total de pages
  hasMore,        // Y a-t-il plus de pages
  isLoading,      // Chargement en cours
  error,          // Erreur éventuelle
  stats,          // Statistiques calculées
  setPage,        // Changer de page
  setLimit,       // Changer le nombre par page
  loadMore,       // Charger plus
  refresh,        // Rafraîchir
  refetch,        // Recharger avec nouveaux paramètres
  reset           // Remettre à zéro
} = useContacts({
  status: 'active',     // Filtres optionnels
  listId: 'list-123',
  tags: ['vip', 'newsletter'],
  search: 'john@example.com'
});

// Statistiques automatiquement calculées
stats = {
  total: 1250,
  active: 1180,
  unsubscribed: 45,
  bounced: 20,
  complained: 5
}
```

### useContactActivity

Hook pour l'activité d'un contact :

```typescript
const {
  activities,      // Historique d'activité
  total,
  page,
  hasMore,
  isLoading,
  setPage,
  loadMore,
  refresh
} = useContactActivity(contactId);
```

### useContactActions

Hook pour les actions sur les contacts :

```typescript
const {
  unsubscribeContact,     // Désabonner
  resubscribeContact,     // Réabonner
  addTagsToContact,       // Ajouter des tags
  removeTagsFromContact,  // Supprimer des tags
  isLoading,              // Action en cours
  error,                  // Erreur
  reset                   // Reset
} = useContactActions();

// Utilisation
const handleAddTags = async (contactId: string, tags: string[]) => {
  await addTagsToContact(contactId, tags);
};
```

### useImportContacts

Hook pour l'import de contacts :

```typescript
const {
  importContacts,  // Fonction d'import
  isLoading,       // Import en cours
  error,           // Erreur d'import
  isSuccess,       // Succès d'import
  result,          // Résultat de l'import
  reset            // Reset de l'état
} = useImportContacts();

// Utilisation
const handleImport = async (file: File) => {
  const result = await importContacts(
    file,
    {
      listId: 'target-list-id',
      updateExisting: true,
      source: 'csv_import'
    },
    (progress) => {
      console.log(`Import: ${progress}%`);
    }
  );
  
  if (result) {
    console.log(`Import terminé: ${result.imported} contacts importés`);
  }
};
```

### useContactManagement

Hook composite pour toutes les opérations sur les contacts :

```typescript
const {
  create,          // useCreateContact
  update,          // useUpdateContact
  delete: deleteContact,  // useDeleteContact
  deleteMultiple,  // useDeleteContacts
  actions,         // useContactActions
  import: importContacts,  // useImportContacts
  lists           // useContactListManagement
} = useContactManagement();
```

## 🎨 **Hooks Spécialisés - Templates**

### useTemplates

Hook principal pour la gestion des templates :

```typescript
const {
  templates,       // Liste des templates
  total,          // Nombre total
  page,           // Page actuelle
  limit,          // Éléments par page
  totalPages,     // Nombre total de pages
  hasMore,        // Y a-t-il plus de pages
  isLoading,      // Chargement en cours
  error,          // Erreur éventuelle
  stats,          // Statistiques calculées
  setPage,        // Changer de page
  setLimit,       // Changer le nombre par page
  loadMore,       // Charger plus
  refresh,        // Rafraîchir
  refetch,        // Recharger avec nouveaux paramètres
  reset           // Remettre à zéro
} = useTemplates({
  category: 'newsletter',  // Filtres optionnels
  isPublic: true,
  tags: ['responsive'],
  search: 'holiday'
});

// Statistiques automatiquement calculées
stats = {
  total: 156,
  byCategory: {
    newsletter: 45,
    promotion: 32,
    transactional: 28,
    welcome: 15,
    // ...
  },
  public: 89,
  private: 67
}
```

### useTemplatePreview

Hook pour la prévisualisation de template :

```typescript
const {
  preview,           // Données de prévisualisation
  isLoading,         // Génération en cours
  error,             // Erreur de génération
  isSuccess,         // Succès
  generatePreview,   // Fonction de génération
  reset              // Reset
} = useTemplatePreview(templateId);

// Utilisation
const handlePreview = () => {
  generatePreview({
    firstName: 'John',
    lastName: 'Doe',
    company: 'Acme Corp',
    customField: 'Valeur personnalisée'
  });
};

// preview contient :
// - htmlPreview: HTML rendu avec variables
// - textPreview: Version texte
// - subjectPreview: Objet avec variables
// - preheaderPreview: Pré-header avec variables
```

### useTemplateUtils

Hook pour les utilitaires de template :

```typescript
const {
  validateHtml,        // Valider le HTML
  optimizeImages,      // Optimiser les images
  testCompatibility,   // Tester la compatibilité
  generateText,        // Générer le texte depuis HTML
  isLoading,           // Opération en cours
  error                // Erreur
} = useTemplateUtils();

// Utilisation
const handleValidation = async (html: string) => {
  const result = await validateHtml(html);
  if (result.isValid) {
    console.log('HTML valide');
  } else {
    console.log('Erreurs:', result.errors);
  }
};
```

### useTemplateManagement

Hook composite pour toutes les opérations sur les templates :

```typescript
const {
  create,          // useCreateTemplate
  update,          // useUpdateTemplate
  delete: deleteTemplate,  // useDeleteTemplate
  duplicate,       // useDuplicateTemplate
  import: importTemplate,  // useImportTemplate
  blocks,          // useContentBlockManagement
  utils            // useTemplateUtils
} = useTemplateManagement();
```

## 🚀 **Utilisation Pratique**

### Exemple Complet - Page de Campagnes

```typescript
import React, { useState } from 'react';
import {
  useCampaigns,
  useCreateCampaign,
  useCampaignActions,
  useDeleteCampaign
} from '@/hooks';

const CampaignsPage = () => {
  const [filters, setFilters] = useState({ status: 'all', search: '' });
  
  // Liste des campagnes avec pagination
  const {
    campaigns,
    total,
    page,
    setPage,
    isLoading,
    error,
    stats,
    refetch
  } = useCampaigns(filters);
  
  // Création de campagne
  const {
    createCampaign,
    isLoading: isCreating,
    error: createError
  } = useCreateCampaign();
  
  // Actions sur campagnes
  const {
    pauseCampaign,
    resumeCampaign,
    isLoading: isActioning
  } = useCampaignActions();
  
  // Suppression
  const {
    deleteCampaign,
    isLoading: isDeleting
  } = useDeleteCampaign();
  
  const handleCreate = async (data) => {
    const campaign = await createCampaign(data);
    if (campaign) {
      refetch(); // Rafraîchir la liste
    }
  };
  
  const handlePause = async (id) => {
    await pauseCampaign(id);
    refetch();
  };
  
  const handleDelete = async (id) => {
    if (confirm('Supprimer cette campagne ?')) {
      await deleteCampaign(id);
      refetch();
    }
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  
  return (
    <div>
      {/* Statistiques */}
      <div className="stats">
        <div>Total: {stats.total}</div>
        <div>Brouillons: {stats.draft}</div>
        <div>Envoyées: {stats.sent}</div>
      </div>
      
      {/* Filtres */}
      <div className="filters">
        <input
          value={filters.search}
          onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
          placeholder="Rechercher..."
        />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="all">Tous les statuts</option>
          <option value="draft">Brouillons</option>
          <option value="sent">Envoyées</option>
        </select>
      </div>
      
      {/* Liste */}
      <div className="campaigns">
        {campaigns.map(campaign => (
          <div key={campaign.id} className="campaign-item">
            <h3>{campaign.name}</h3>
            <p>{campaign.subject}</p>
            <span className={`status ${campaign.status}`}>
              {campaign.statusLabel}
            </span>
            
            <div className="actions">
              {campaign.status === 'sending' && (
                <button
                  onClick={() => handlePause(campaign.id)}
                  disabled={isActioning}
                >
                  Pause
                </button>
              )}
              
              {campaign.status === 'paused' && (
                <button
                  onClick={() => resumeCampaign(campaign.id)}
                  disabled={isActioning}
                >
                  Reprendre
                </button>
              )}
              
              <button
                onClick={() => handleDelete(campaign.id)}
                disabled={isDeleting}
                className="delete"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(total / 25) }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CampaignsPage;
```

## 📈 **Avantages des Hooks**

1. **Gestion d'état automatisée** : Loading, erreurs, succès gérés automatiquement
2. **Cache et optimisations** : Mise en cache des requêtes, dédoublonnage
3. **Retry automatique** : Retry intelligent en cas d'échec
4. **Annulation des requêtes** : Annulation automatique au démontage du composant
5. **TypeScript strict** : Types complets et validation au compile-time
6. **Hooks composites** : Combinaison de plusieurs opérations
7. **Optimistic updates** : Mise à jour optimiste de l'UI
8. **Pagination avancée** : Support pagination classique et infinie

Ces hooks fournissent une couche d'abstraction puissante et flexible pour toutes les interactions avec les APIs de la plateforme EmailPro.