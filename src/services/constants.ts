// Constantes pour la plateforme EmailPro

// Configuration de l'application
export const APP_CONFIG = {
  NAME: 'EmailPro',
  VERSION: '1.0.0',
  DESCRIPTION: 'Plateforme d\'emailing professionnelle',
  SUPPORT_EMAIL: 'support@emailpro.com',
  DOCUMENTATION_URL: 'https://docs.emailpro.com',
  CHANGELOG_URL: 'https://changelog.emailpro.com'
} as const;

// Configuration des APIs
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 secondes
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 seconde
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: ['csv', 'xlsx', 'txt', 'html', 'mjml'],
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 60000 // 1 minute
} as const;

// Configuration de la pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  INFINITE_SCROLL_THRESHOLD: 0.8
} as const;

// Configuration des formulaires
export const FORM_CONFIG = {
  DEBOUNCE_DELAY: 300, // ms
  AUTO_SAVE_DELAY: 5000, // 5 secondes
  MAX_TEXT_LENGTH: {
    SHORT: 50,
    MEDIUM: 100,
    LONG: 500,
    EXTENDED: 2000
  },
  VALIDATION_DELAY: 500 // ms
} as const;

// Status et états des entités
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
  CONTACT: {
    ACTIVE: 'active',
    UNSUBSCRIBED: 'unsubscribed',
    BOUNCED: 'bounced',
    COMPLAINED: 'complained'
  },
  EMAIL_SEND: {
    PENDING: 'pending',
    SENT: 'sent',
    DELIVERED: 'delivered',
    BOUNCED: 'bounced',
    FAILED: 'failed',
    COMPLAINED: 'complained',
    UNSUBSCRIBED: 'unsubscribed'
  }
} as const;

// Labels en français pour les statuts
export const STATUS_LABELS = {
  CAMPAIGN: {
    [ENTITY_STATUSES.CAMPAIGN.DRAFT]: 'Brouillon',
    [ENTITY_STATUSES.CAMPAIGN.SCHEDULED]: 'Programmée',
    [ENTITY_STATUSES.CAMPAIGN.SENDING]: 'En cours d\'envoi',
    [ENTITY_STATUSES.CAMPAIGN.SENT]: 'Envoyée',
    [ENTITY_STATUSES.CAMPAIGN.PAUSED]: 'En pause',
    [ENTITY_STATUSES.CAMPAIGN.CANCELLED]: 'Annulée',
    [ENTITY_STATUSES.CAMPAIGN.FAILED]: 'Échec'
  },
  CONTACT: {
    [ENTITY_STATUSES.CONTACT.ACTIVE]: 'Actif',
    [ENTITY_STATUSES.CONTACT.UNSUBSCRIBED]: 'Désabonné',
    [ENTITY_STATUSES.CONTACT.BOUNCED]: 'Rejeté',
    [ENTITY_STATUSES.CONTACT.COMPLAINED]: 'Plainte'
  },
  EMAIL_SEND: {
    [ENTITY_STATUSES.EMAIL_SEND.PENDING]: 'En attente',
    [ENTITY_STATUSES.EMAIL_SEND.SENT]: 'Envoyé',
    [ENTITY_STATUSES.EMAIL_SEND.DELIVERED]: 'Délivré',
    [ENTITY_STATUSES.EMAIL_SEND.BOUNCED]: 'Rejeté',
    [ENTITY_STATUSES.EMAIL_SEND.FAILED]: 'Échec',
    [ENTITY_STATUSES.EMAIL_SEND.COMPLAINED]: 'Plainte',
    [ENTITY_STATUSES.EMAIL_SEND.UNSUBSCRIBED]: 'Désabonné'
  }
} as const;

// Couleurs pour les statuts (classes Tailwind)
export const STATUS_COLORS = {
  CAMPAIGN: {
    [ENTITY_STATUSES.CAMPAIGN.DRAFT]: 'bg-gray-100 text-gray-800',
    [ENTITY_STATUSES.CAMPAIGN.SCHEDULED]: 'bg-blue-100 text-blue-800',
    [ENTITY_STATUSES.CAMPAIGN.SENDING]: 'bg-yellow-100 text-yellow-800',
    [ENTITY_STATUSES.CAMPAIGN.SENT]: 'bg-green-100 text-green-800',
    [ENTITY_STATUSES.CAMPAIGN.PAUSED]: 'bg-orange-100 text-orange-800',
    [ENTITY_STATUSES.CAMPAIGN.CANCELLED]: 'bg-gray-100 text-gray-800',
    [ENTITY_STATUSES.CAMPAIGN.FAILED]: 'bg-red-100 text-red-800'
  },
  CONTACT: {
    [ENTITY_STATUSES.CONTACT.ACTIVE]: 'bg-green-100 text-green-800',
    [ENTITY_STATUSES.CONTACT.UNSUBSCRIBED]: 'bg-gray-100 text-gray-800',
    [ENTITY_STATUSES.CONTACT.BOUNCED]: 'bg-red-100 text-red-800',
    [ENTITY_STATUSES.CONTACT.COMPLAINED]: 'bg-orange-100 text-orange-800'
  },
  EMAIL_SEND: {
    [ENTITY_STATUSES.EMAIL_SEND.PENDING]: 'bg-gray-100 text-gray-800',
    [ENTITY_STATUSES.EMAIL_SEND.SENT]: 'bg-blue-100 text-blue-800',
    [ENTITY_STATUSES.EMAIL_SEND.DELIVERED]: 'bg-green-100 text-green-800',
    [ENTITY_STATUSES.EMAIL_SEND.BOUNCED]: 'bg-red-100 text-red-800',
    [ENTITY_STATUSES.EMAIL_SEND.FAILED]: 'bg-red-100 text-red-800',
    [ENTITY_STATUSES.EMAIL_SEND.COMPLAINED]: 'bg-orange-100 text-orange-800',
    [ENTITY_STATUSES.EMAIL_SEND.UNSUBSCRIBED]: 'bg-gray-100 text-gray-800'
  }
} as const;

// Catégories et types
export const CATEGORIES = {
  TEMPLATE: {
    NEWSLETTER: 'newsletter',
    PROMOTION: 'promotion',
    TRANSACTIONAL: 'transactional',
    WELCOME: 'welcome',
    ANNOUNCEMENT: 'announcement',
    EVENT: 'event',
    SURVEY: 'survey',
    OTHER: 'other'
  },
  CAMPAIGN: {
    REGULAR: 'regular',
    AUTOMATION: 'automation',
    AB_TEST: 'ab_test'
  },
  BLOCK: {
    HEADER: 'header',
    FOOTER: 'footer',
    HERO: 'hero',
    TEXT: 'text',
    IMAGE: 'image',
    BUTTON: 'button',
    SOCIAL: 'social',
    PRODUCT: 'product',
    TESTIMONIAL: 'testimonial'
  }
} as const;

// Labels pour les catégories
export const CATEGORY_LABELS = {
  TEMPLATE: {
    [CATEGORIES.TEMPLATE.NEWSLETTER]: 'Newsletter',
    [CATEGORIES.TEMPLATE.PROMOTION]: 'Promotion',
    [CATEGORIES.TEMPLATE.TRANSACTIONAL]: 'Transactionnel',
    [CATEGORIES.TEMPLATE.WELCOME]: 'Bienvenue',
    [CATEGORIES.TEMPLATE.ANNOUNCEMENT]: 'Annonce',
    [CATEGORIES.TEMPLATE.EVENT]: 'Événement',
    [CATEGORIES.TEMPLATE.SURVEY]: 'Enquête',
    [CATEGORIES.TEMPLATE.OTHER]: 'Autre'
  },
  CAMPAIGN: {
    [CATEGORIES.CAMPAIGN.REGULAR]: 'Campagne classique',
    [CATEGORIES.CAMPAIGN.AUTOMATION]: 'Automation',
    [CATEGORIES.CAMPAIGN.AB_TEST]: 'Test A/B'
  },
  BLOCK: {
    [CATEGORIES.BLOCK.HEADER]: 'En-tête',
    [CATEGORIES.BLOCK.FOOTER]: 'Pied de page',
    [CATEGORIES.BLOCK.HERO]: 'Hero',
    [CATEGORIES.BLOCK.TEXT]: 'Texte',
    [CATEGORIES.BLOCK.IMAGE]: 'Image',
    [CATEGORIES.BLOCK.BUTTON]: 'Bouton',
    [CATEGORIES.BLOCK.SOCIAL]: 'Réseaux sociaux',
    [CATEGORIES.BLOCK.PRODUCT]: 'Produit',
    [CATEGORIES.BLOCK.TESTIMONIAL]: 'Témoignage'
  }
} as const;

// Rôles et permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VIEWER: 'viewer'
} as const;

export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrateur',
  [USER_ROLES.USER]: 'Utilisateur',
  [USER_ROLES.VIEWER]: 'Observateur'
} as const;

export const PERMISSIONS = {
  CAMPAIGNS: {
    VIEW: 'campaigns:view',
    CREATE: 'campaigns:create',
    EDIT: 'campaigns:edit',
    DELETE: 'campaigns:delete',
    SEND: 'campaigns:send'
  },
  CONTACTS: {
    VIEW: 'contacts:view',
    CREATE: 'contacts:create',
    EDIT: 'contacts:edit',
    DELETE: 'contacts:delete',
    IMPORT: 'contacts:import',
    EXPORT: 'contacts:export'
  },
  TEMPLATES: {
    VIEW: 'templates:view',
    CREATE: 'templates:create',
    EDIT: 'templates:edit',
    DELETE: 'templates:delete'
  },
  ADMIN: {
    VIEW_USERS: 'admin:view_users',
    MANAGE_USERS: 'admin:manage_users',
    VIEW_SETTINGS: 'admin:view_settings',
    MANAGE_SETTINGS: 'admin:manage_settings'
  }
} as const;

// Permissions par rôle
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: Object.values(PERMISSIONS).flatMap(p => Object.values(p)),
  [USER_ROLES.USER]: [
    ...Object.values(PERMISSIONS.CAMPAIGNS),
    ...Object.values(PERMISSIONS.CONTACTS),
    ...Object.values(PERMISSIONS.TEMPLATES)
  ],
  [USER_ROLES.VIEWER]: [
    PERMISSIONS.CAMPAIGNS.VIEW,
    PERMISSIONS.CONTACTS.VIEW,
    PERMISSIONS.TEMPLATES.VIEW
  ]
} as const;

// Configuration des notifications
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;

export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000, // 5 secondes
  MAX_NOTIFICATIONS: 5,
  POSITION: 'top-right',
  ANIMATIONS: {
    ENTER: 'slideInRight',
    EXIT: 'slideOutRight'
  }
} as const;

// Configuration du thème
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: '#3B82F6',
    PRIMARY_DARK: '#1E40AF',
    SECONDARY: '#10B981',
    ACCENT: '#8B5CF6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#3B82F6'
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  },
  ANIMATION_DURATION: {
    FAST: '150ms',
    NORMAL: '200ms',
    SLOW: '300ms'
  }
} as const;

// Messages d'erreur communs
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  VALIDATION_ERROR: 'Les données saisies ne sont pas valides.',
  UNAUTHORIZED: 'Vous n\'avez pas l\'autorisation d\'accéder à cette ressource.',
  NOT_FOUND: 'La ressource demandée n\'a pas été trouvée.',
  RATE_LIMIT: 'Trop de requêtes. Veuillez patienter avant de réessayer.',
  FILE_TOO_LARGE: 'Le fichier est trop volumineux.',
  INVALID_FILE_TYPE: 'Type de fichier non supporté.',
  GENERIC: 'Une erreur inattendue s\'est produite.'
} as const;

// Messages de succès communs
export const SUCCESS_MESSAGES = {
  CREATED: 'Créé avec succès',
  UPDATED: 'Mis à jour avec succès',
  DELETED: 'Supprimé avec succès',
  SAVED: 'Sauvegardé avec succès',
  SENT: 'Envoyé avec succès',
  IMPORTED: 'Importé avec succès',
  EXPORTED: 'Exporté avec succès'
} as const;

// Configuration des statistiques par défaut
export const STATS_CONFIG = {
  GOOD_OPEN_RATE: 20, // %
  EXCELLENT_OPEN_RATE: 25, // %
  GOOD_CLICK_RATE: 2, // %
  EXCELLENT_CLICK_RATE: 3, // %
  MAX_BOUNCE_RATE: 5, // %
  MAX_UNSUBSCRIBE_RATE: 1, // %
  CHART_COLORS: {
    PRIMARY: '#3B82F6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    NEUTRAL: '#6B7280'
  }
} as const;

// Export des constantes groupées
export const CONSTANTS = {
  APP_CONFIG,
  API_CONFIG,
  PAGINATION_CONFIG,
  FORM_CONFIG,
  ENTITY_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS,
  CATEGORIES,
  CATEGORY_LABELS,
  USER_ROLES,
  ROLE_LABELS,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  NOTIFICATION_TYPES,
  NOTIFICATION_CONFIG,
  THEME_CONFIG,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STATS_CONFIG
} as const;

export default CONSTANTS;