// Types et interfaces pour le tableau de bord EmailPro

// Status des campagnes
export const CAMPAIGN_STATUS = {
  SENT: 'sent',
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  SENDING: 'sending',
  FAILED: 'failed'
};

// Labels pour les status
export const CAMPAIGN_STATUS_LABELS = {
  [CAMPAIGN_STATUS.SENT]: 'Envoyé',
  [CAMPAIGN_STATUS.DRAFT]: 'Brouillon',
  [CAMPAIGN_STATUS.SCHEDULED]: 'Programmé',
  [CAMPAIGN_STATUS.SENDING]: 'En cours',
  [CAMPAIGN_STATUS.FAILED]: 'Échec'
};

// Couleurs pour les badges de status
export const CAMPAIGN_STATUS_COLORS = {
  [CAMPAIGN_STATUS.SENT]: 'success',
  [CAMPAIGN_STATUS.DRAFT]: 'secondary',
  [CAMPAIGN_STATUS.SCHEDULED]: 'warning',
  [CAMPAIGN_STATUS.SENDING]: 'info',
  [CAMPAIGN_STATUS.FAILED]: 'destructive'
};

// Navigation principale
export const MAIN_NAVIGATION = [
  { label: 'Tableau de bord', href: '/dashboard', icon: 'BarChart3' },
  { label: 'Campagnes', href: '/campaigns', icon: 'Mail' },
  { label: 'Contacts', href: '/contacts', icon: 'Users' },
  { label: 'Templates', href: '/templates', icon: 'FileText' },
  { label: 'Statistiques', href: '/stats', icon: 'TrendingUp' }
];

// Actions rapides du tableau de bord
export const QUICK_ACTIONS = [
  {
    id: 'new-campaign',
    label: 'Nouvelle Campagne',
    description: 'Créer une nouvelle campagne email',
    icon: 'Plus',
    color: 'bg-blue-500 hover:bg-blue-600',
    action: 'createCampaign'
  },
  {
    id: 'add-contact',
    label: 'Ajouter Contact',
    description: 'Ajouter un nouveau contact',
    icon: 'UserPlus',
    color: 'bg-green-500 hover:bg-green-600',
    action: 'addContact'
  },
  {
    id: 'new-template',
    label: 'Nouveau Template',
    description: 'Créer un nouveau template',
    icon: 'FileText',
    color: 'bg-violet-500 hover:bg-violet-600',
    action: 'createTemplate'
  },
  {
    id: 'view-stats',
    label: 'Voir Statistiques',
    description: 'Consulter les statistiques détaillées',
    icon: 'BarChart',
    color: 'bg-orange-500 hover:bg-orange-600',
    action: 'viewStats'
  }
];

// Métriques du tableau de bord
export const METRICS_CONFIG = [
  {
    key: 'emailsSent',
    title: 'Emails Envoyés',
    icon: 'Mail',
    formatter: (value) => value.toLocaleString('fr-FR')
  },
  {
    key: 'openRate',
    title: 'Taux d\'Ouverture',
    icon: 'Eye',
    formatter: (value) => `${value}%`
  },
  {
    key: 'clickRate',
    title: 'Taux de Clic',
    icon: 'MousePointer',
    formatter: (value) => `${value}%`
  },
  {
    key: 'activeContacts',
    title: 'Contacts Actifs',
    icon: 'Users',
    formatter: (value) => value.toLocaleString('fr-FR')
  }
];

// Utilitaires pour les dates
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatShortDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    month: 'short',
    day: 'numeric'
  });
};

// Utilitaires pour les nombres
export const formatNumber = (number) => {
  return number.toLocaleString('fr-FR');
};

export const formatPercentage = (number) => {
  return `${number}%`;
};