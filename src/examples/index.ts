// Export de tous les exemples d'utilisation

export { default as TypeScriptUsageExample } from './TypeScriptUsageExample';

// Exemple d'utilisation complète dans une page
export const USAGE_EXAMPLES = {
  // Import des types
  types: `
import type {
  Campaign,
  Contact,
  EmailTemplate,
  CreateCampaignRequest,
  ApiResponse,
  PaginatedResponse
} from '@/types';
  `,
  
  // Import des services
  services: `
import {
  campaignsApi,
  contactsApi,
  templatesApi,
  ValidationService,
  FormattingService
} from '@/services';
  `,
  
  // Import des hooks
  hooks: `
import {
  useCampaigns,
  useCreateCampaign,
  useCampaignActions,
  useContacts,
  useTemplates
} from '@/hooks';
  `,
  
  // Utilisation basique
  basicUsage: `
const CampaignsPage = () => {
  // Hook pour la liste des campagnes
  const { campaigns, isLoading, error, refetch } = useCampaigns();
  
  // Hook pour créer une campagne
  const { createCampaign, isLoading: isCreating } = useCreateCampaign();
  
  // Validation
  const handleCreate = (data: CreateCampaignRequest) => {
    const validation = ValidationService.campaign.validateCreateCampaign(data);
    if (validation.isValid) {
      createCampaign(data);
    }
  };
  
  return (
    <div>
      {campaigns.map(campaign => (
        <div key={campaign.id}>
          {campaign.name} - {FormattingService.date.formatDate(campaign.createdAt)}
        </div>
      ))}
    </div>
  );
};
  `,
  
  // Utilisation avancée
  advancedUsage: `
const AdvancedCampaignManager = () => {
  // État local typé
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [filters, setFilters] = useState<CampaignQueryParams>({
    status: 'all',
    page: 1,
    limit: 25
  });
  
  // Multiple hooks avec gestion d'état
  const campaigns = useCampaigns(filters);
  const campaignActions = useCampaignActions();
  const { mutate: deleteCampaign } = useDeleteCampaign();
  
  // Actions en lot typées
  const handleBulkAction = async (action: 'delete' | 'duplicate' | 'archive') => {
    for (const campaignId of selectedCampaigns) {
      switch (action) {
        case 'delete':
          await deleteCampaign(campaignId);
          break;
        case 'duplicate':
          await campaignsApi.duplicateCampaign(campaignId);
          break;
        // ...
      }
    }
    campaigns.refetch();
  };
  
  // Export avec types
  const handleExport = async (format: 'csv' | 'xlsx' | 'json') => {
    for (const campaignId of selectedCampaigns) {
      const blob = await campaignsApi.exportCampaignData(campaignId, format);
      // Téléchargement...
    }
  };
};
  `
};

// Configuration d'exemple pour tsconfig.json
export const TYPESCRIPT_CONFIG = {
  compilerOptions: {
    target: "es5",
    lib: ["dom", "dom.iterable", "es6"],
    strict: true,
    noImplicitAny: true,
    strictNullChecks: true,
    strictFunctionTypes: true,
    baseUrl: ".",
    paths: {
      "@/*": ["src/*"],
      "@/types/*": ["src/types/*"],
      "@/services/*": ["src/services/*"],
      "@/hooks/*": ["src/hooks/*"]
    }
  }
};

// Documentation des bonnes pratiques
export const BEST_PRACTICES = {
  types: [
    "Toujours importer les types avec 'import type' pour éviter l'inclusion au runtime",
    "Utiliser des interfaces plutôt que des types pour les objets extensibles",
    "Préfixer les types d'événements avec 'on' (ex: onSuccess, onError)",
    "Utiliser des unions littérales pour les énumérations (ex: 'draft' | 'sent')",
    "Toujours typer les paramètres optionnels avec '?' ou '| undefined'"
  ],
  
  hooks: [
    "Utiliser les hooks personnalisés plutôt que les appels API directs",
    "Toujours vérifier 'isLoading' avant d'afficher les données",
    "Gérer les erreurs avec des messages utilisateur friendly",
    "Utiliser 'useCallback' pour les fonctions passées aux enfants",
    "Préférer les hooks composites pour les opérations complexes"
  ],
  
  services: [
    "Valider toujours les données avant les appels API",
    "Utiliser les services de formatage pour l'affichage",
    "Centraliser les constantes et éviter les magic numbers",
    "Implémenter une gestion d'erreurs robuste",
    "Documenter les APIs avec JSDoc"
  ],
  
  performance: [
    "Utiliser la pagination pour les grandes listes",
    "Implémenter le debouncing pour les recherches",
    "Mettre en cache les données fréquemment utilisées",
    "Optimiser les re-renders avec React.memo",
    "Utiliser les imports dynamiques pour le code splitting"
  ]
};