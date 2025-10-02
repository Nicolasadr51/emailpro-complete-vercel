// Types pour la gestion des campagnes d'emailing

export interface Campaign {
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
  segmentFilters?: import('./contact').SegmentFilter[];
  excludedContactIds: string[];
  
  // Programmation
  scheduledAt?: Date;
  sentAt?: Date;
  
  // Test A/B (si applicable)
  abTestConfig?: ABTestConfig;
  
  // Statistiques
  stats: CampaignStats;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export type CampaignStatus = 
  | 'draft'
  | 'scheduled' 
  | 'sending'
  | 'sent'
  | 'paused'
  | 'cancelled'
  | 'failed';

export type CampaignType = 'regular' | 'automation' | 'ab_test';

export interface CampaignStats {
  totalSent: number;
  totalDelivered: number;
  totalBounced: number;
  totalOpened: number;
  totalClicked: number;
  totalUnsubscribed: number;
  totalComplaints: number;
  
  // Taux calculés (en pourcentage)
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  complaintRate: number;
  clickToOpenRate: number;
  
  // Revenus (si tracking e-commerce)
  revenue?: number;
  averageOrderValue?: number;
  conversionRate?: number;
}

export interface ABTestConfig {
  enabled: boolean;
  testType: 'subject' | 'content' | 'sender';
  variants: ABTestVariant[];
  splitPercentage: number; // Pourcentage pour le test (le reste va au gagnant)
  winnerCriteria: 'open_rate' | 'click_rate' | 'conversion_rate';
  testDuration: number; // en heures
  isWinnerSelected: boolean;
  winnerVariantId?: string;
}

export interface ABTestVariant {
  id: string;
  name: string;
  subject?: string;
  htmlContent?: string;
  senderName?: string;
  senderEmail?: string;
  stats: CampaignStats;
}

// Requests pour les API
export interface CreateCampaignRequest {
  name: string;
  subject: string;
  preheader?: string;
  type?: CampaignType;
  htmlContent: string;
  textContent: string;
  senderName: string;
  senderEmail: string;
  replyToEmail?: string;
  contactListIds: string[];
  segmentFilters?: import('./contact').SegmentFilter[];
  scheduledAt?: Date;
  templateId?: string;
}

export interface UpdateCampaignRequest extends Partial<CreateCampaignRequest> {
  status?: CampaignStatus;
  excludedContactIds?: string[];
}

export interface SendCampaignRequest {
  sendAt?: Date; // Si pas fourni, envoi immédiat
  testEmails?: string[]; // Pour les tests avant envoi
}

export interface CampaignPreview {
  htmlPreview: string;
  textPreview: string;
  subjectPreview: string;
  preheaderPreview: string;
  estimatedDelivery: Date;
  recipientCount: number;
}

// Types pour les emails individuels envoyés
export interface EmailSend {
  id: string;
  campaignId: string;
  contactId: string;
  
  // Contenu personnalisé
  subject: string;
  htmlContent: string;
  textContent: string;
  
  // Tracking
  trackingId: string;
  
  // Statut d'envoi
  status: EmailSendStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  
  // Événements de tracking
  openEvents: OpenEvent[];
  clickEvents: ClickEvent[];
  
  // Erreurs
  errorMessage?: string;
  bounceReason?: string;
  bounceType?: 'hard' | 'soft';
}

export type EmailSendStatus = 
  | 'pending'
  | 'sent' 
  | 'delivered'
  | 'bounced'
  | 'failed'
  | 'complained'
  | 'unsubscribed';

// Événements de tracking
export interface OpenEvent {
  id: string;
  emailSendId: string;
  openedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: GeoLocation;
}

export interface ClickEvent {
  id: string;
  emailSendId: string;
  url: string;
  clickedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  location?: GeoLocation;
}

export interface GeoLocation {
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
}

// Constantes
export const CAMPAIGN_STATUSES: Record<CampaignStatus, string> = {
  draft: 'Brouillon',
  scheduled: 'Programmée',
  sending: 'En cours d\'envoi',
  sent: 'Envoyée',
  paused: 'En pause',
  cancelled: 'Annulée',
  failed: 'Échec'
};

export const CAMPAIGN_TYPES: Record<CampaignType, string> = {
  regular: 'Campagne classique',
  automation: 'Automation',
  ab_test: 'Test A/B'
};

export const EMAIL_SEND_STATUSES: Record<EmailSendStatus, string> = {
  pending: 'En attente',
  sent: 'Envoyé',
  delivered: 'Délivré',
  bounced: 'Rejeté',
  failed: 'Échec',
  complained: 'Plainte',
  unsubscribed: 'Désabonné'
};