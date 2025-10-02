// Types et utilitaires pour la gestion des campagnes

// Status des campagnes avec leurs couleurs
export const CAMPAIGN_STATUSES = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled', 
  SENDING: 'sending',
  SENT: 'sent',
  PAUSED: 'paused',
  FAILED: 'failed'
};

// Labels pour les statuts
export const CAMPAIGN_STATUS_LABELS = {
  [CAMPAIGN_STATUSES.DRAFT]: 'Brouillon',
  [CAMPAIGN_STATUSES.SCHEDULED]: 'Programmée',
  [CAMPAIGN_STATUSES.SENDING]: 'En cours d\'envoi',
  [CAMPAIGN_STATUSES.SENT]: 'Envoyée',
  [CAMPAIGN_STATUSES.PAUSED]: 'En pause',
  [CAMPAIGN_STATUSES.FAILED]: 'Échec'
};

// Couleurs pour les badges de statut
export const CAMPAIGN_STATUS_COLORS = {
  [CAMPAIGN_STATUSES.DRAFT]: 'bg-gray-100 text-gray-800',
  [CAMPAIGN_STATUSES.SCHEDULED]: 'bg-blue-100 text-blue-800',
  [CAMPAIGN_STATUSES.SENDING]: 'bg-yellow-100 text-yellow-800',
  [CAMPAIGN_STATUSES.SENT]: 'bg-green-100 text-green-800',
  [CAMPAIGN_STATUSES.PAUSED]: 'bg-orange-100 text-orange-800',
  [CAMPAIGN_STATUSES.FAILED]: 'bg-red-100 text-red-800'
};

// Variantes pour les badges (mapping vers les variantes du composant Badge)
export const CAMPAIGN_STATUS_VARIANTS = {
  [CAMPAIGN_STATUSES.DRAFT]: 'secondary',
  [CAMPAIGN_STATUSES.SCHEDULED]: 'default',
  [CAMPAIGN_STATUSES.SENDING]: 'outline',
  [CAMPAIGN_STATUSES.SENT]: 'default',
  [CAMPAIGN_STATUSES.PAUSED]: 'outline',
  [CAMPAIGN_STATUSES.FAILED]: 'destructive'
};

// Étapes de création de campagne
export const CAMPAIGN_CREATION_STEPS = [
  {
    id: 1,
    name: 'Informations',
    description: 'Informations de base',
    href: '#step-1'
  },
  {
    id: 2,
    name: 'Destinataires',
    description: 'Sélection des contacts',
    href: '#step-2'
  },
  {
    id: 3,
    name: 'Contenu',
    description: 'Design et contenu',
    href: '#step-3'
  },
  {
    id: 4,
    name: 'Envoi',
    description: 'Programmation et envoi',
    href: '#step-4'
  }
];

// Actions possibles sur les campagnes
export const CAMPAIGN_ACTIONS = {
  VIEW: 'view',
  EDIT: 'edit',
  DUPLICATE: 'duplicate',
  STATS: 'stats',
  PAUSE: 'pause',
  RESUME: 'resume',
  DELETE: 'delete',
  ARCHIVE: 'archive'
};

// Actions en lot
export const BULK_ACTIONS = [
  {
    id: CAMPAIGN_ACTIONS.DUPLICATE,
    label: 'Dupliquer',
    icon: 'Copy',
    variant: 'outline'
  },
  {
    id: CAMPAIGN_ACTIONS.ARCHIVE,
    label: 'Archiver',
    icon: 'Archive',
    variant: 'outline'
  },
  {
    id: CAMPAIGN_ACTIONS.DELETE,
    label: 'Supprimer',
    icon: 'Trash',
    variant: 'outline',
    className: 'text-red-600 hover:text-red-700'
  }
];

// Utilitaires pour les dates
export const formatCampaignDate = (dateString) => {
  if (!dateString || dateString === '-') return '-';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatCampaignDateTime = (dateString) => {
  if (!dateString || dateString === '-') return '-';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Utilitaires pour les statistiques
export const formatPercentage = (value) => {
  if (value === 0 || value === null || value === undefined) return '-';
  return `${value}%`;
};

export const formatNumber = (value) => {
  if (value === 0 || value === null || value === undefined) return '0';
  return value.toLocaleString('fr-FR');
};

// Validation des données de campagne
export const validateCampaignStep1 = (data) => {
  const errors = {};
  
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Le nom de la campagne est requis';
  }
  
  if (!data.subject || data.subject.trim().length === 0) {
    errors.subject = 'L\'objet de l\'email est requis';
  }
  
  if (data.subject && data.subject.length > 100) {
    errors.subject = 'L\'objet ne doit pas dépasser 100 caractères';
  }
  
  if (data.preheader && data.preheader.length > 90) {
    errors.preheader = 'Le pré-header ne doit pas dépasser 90 caractères';
  }
  
  if (!data.sender) {
    errors.sender = 'L\'expéditeur est requis';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};