// Types pour les templates d'emails

export interface EmailTemplate {
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
  
  // Design
  thumbnail?: string;
  previewImages?: string[];
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  usageCount: number;
  lastUsedAt?: Date;
  
  // Tags pour l'organisation
  tags: string[];
}

export type TemplateCategory = 
  | 'newsletter' 
  | 'promotion' 
  | 'transactional' 
  | 'welcome' 
  | 'announcement'
  | 'event'
  | 'survey'
  | 'other';

export interface TemplateVariable {
  name: string;
  type: VariableType;
  defaultValue?: string;
  description?: string;
  required: boolean;
  options?: string[]; // Pour les variables de type select
  validation?: VariableValidation;
}

export type VariableType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'boolean' 
  | 'url'
  | 'email'
  | 'select'
  | 'image';

export interface VariableValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string; // Regex pattern
  min?: number; // Pour les nombres
  max?: number; // Pour les nombres
}

// Bloc de contenu réutilisable
export interface ContentBlock {
  id: string;
  name: string;
  description?: string;
  type: BlockType;
  htmlContent: string;
  variables?: TemplateVariable[];
  category: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

export type BlockType =
  | 'header'
  | 'footer'
  | 'hero'
  | 'text'
  | 'image'
  | 'button'
  | 'social'
  | 'product'
  | 'testimonial';

// Requests pour les API
export interface CreateTemplateRequest {
  name: string;
  description?: string;
  category: TemplateCategory;
  htmlContent: string;
  textContent: string;
  subject: string;
  preheader?: string;
  variables?: TemplateVariable[];
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateTemplateRequest extends Partial<CreateTemplateRequest> {}

export interface CreateContentBlockRequest {
  name: string;
  description?: string;
  type: BlockType;
  htmlContent: string;
  variables?: TemplateVariable[];
  category: string;
  isPublic?: boolean;
}

export interface UpdateContentBlockRequest extends Partial<CreateContentBlockRequest> {}

export interface TemplatePreview {
  htmlPreview: string;
  textPreview: string;
  subjectPreview: string;
  preheaderPreview: string;
  variableValues: Record<string, any>;
}

export interface TemplateImport {
  source: 'file' | 'url' | 'mailchimp' | 'constantcontact';
  data: string | File;
  options?: {
    preserveStyles?: boolean;
    extractVariables?: boolean;
    category?: TemplateCategory;
  };
}

// Constantes
export const TEMPLATE_CATEGORIES: Record<TemplateCategory, string> = {
  newsletter: 'Newsletter',
  promotion: 'Promotion',
  transactional: 'Transactionnel',
  welcome: 'Bienvenue',
  announcement: 'Annonce',
  event: 'Événement',
  survey: 'Enquête',
  other: 'Autre'
};

export const VARIABLE_TYPES: Record<VariableType, string> = {
  text: 'Texte',
  number: 'Nombre',
  date: 'Date',
  boolean: 'Booléen',
  url: 'URL',
  email: 'Email',
  select: 'Liste déroulante',
  image: 'Image'
};

export const BLOCK_TYPES: Record<BlockType, string> = {
  header: 'En-tête',
  footer: 'Pied de page',
  hero: 'Hero',
  text: 'Texte',
  image: 'Image',
  button: 'Bouton',
  social: 'Réseaux sociaux',
  product: 'Produit',
  testimonial: 'Témoignage'
};