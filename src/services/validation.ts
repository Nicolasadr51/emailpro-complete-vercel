// Services de validation pour la plateforme EmailPro
import type { ValidationResult, ValidationError } from '@/types/api';
import type { 
  CreateCampaignRequest, 
  UpdateCampaignRequest,
  CampaignStatus 
} from '@/types/campaign';
import type { 
  CreateContactRequest, 
  UpdateContactRequest,
  ContactStatus 
} from '@/types/contact';
import type { 
  CreateTemplateRequest, 
  UpdateTemplateRequest,
  TemplateVariable 
} from '@/types/template';

// Utilitaires de validation de base
export class EmailValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly DISPOSABLE_DOMAINS = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'tempmail.org',
    'yopmail.com',
    'temp-mail.org'
  ];

  static isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    return this.EMAIL_REGEX.test(email.trim().toLowerCase());
  }

  static isDomainValid(domain: string): boolean {
    if (!domain) return false;
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  }

  static isDisposableEmail(email: string): boolean {
    if (!this.isValidEmail(email)) return false;
    const domain = email.split('@')[1].toLowerCase();
    return this.DISPOSABLE_DOMAINS.includes(domain);
  }

  static extractDomain(email: string): string | null {
    if (!this.isValidEmail(email)) return null;
    return email.split('@')[1].toLowerCase();
  }

  static suggestEmailCorrection(email: string): string | null {
    if (!email) return null;
    
    const commonDomains = {
      'gmail.com': ['gmial.com', 'gmai.com', 'gmail.co'],
      'yahoo.com': ['yaho.com', 'yahoo.co', 'yahooo.com'],
      'hotmail.com': ['hotmial.com', 'hotmal.com', 'hotmil.com'],
      'outlook.com': ['outlok.com', 'outloo.com', 'outlook.co']
    };

    const [localPart, domain] = email.split('@');
    if (!domain) return null;

    for (const [correctDomain, typos] of Object.entries(commonDomains)) {
      if (typos.includes(domain.toLowerCase())) {
        return `${localPart}@${correctDomain}`;
      }
    }

    return null;
  }
}

// Validation des campagnes
export class CampaignValidator {
  static validateCreateCampaign(data: CreateCampaignRequest): ValidationResult {
    const errors: ValidationError[] = [];

    // Validation du nom
    if (!data.name || data.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Le nom de la campagne est requis',
        code: 'REQUIRED'
      });
    } else if (data.name.length > 100) {
      errors.push({
        field: 'name',
        message: 'Le nom ne doit pas dépasser 100 caractères',
        code: 'MAX_LENGTH'
      });
    }

    // Validation de l'objet
    if (!data.subject || data.subject.trim().length === 0) {
      errors.push({
        field: 'subject',
        message: 'L\'objet de l\'email est requis',
        code: 'REQUIRED'
      });
    } else if (data.subject.length > 150) {
      errors.push({
        field: 'subject',
        message: 'L\'objet ne doit pas dépasser 150 caractères',
        code: 'MAX_LENGTH'
      });
    }

    // Validation du pré-header
    if (data.preheader && data.preheader.length > 250) {
      errors.push({
        field: 'preheader',
        message: 'Le pré-header ne doit pas dépasser 250 caractères',
        code: 'MAX_LENGTH'
      });
    }

    // Validation de l'expéditeur
    if (!data.senderEmail || !EmailValidator.isValidEmail(data.senderEmail)) {
      errors.push({
        field: 'senderEmail',
        message: 'L\'email de l\'expéditeur est invalide',
        code: 'INVALID_EMAIL'
      });
    }

    if (!data.senderName || data.senderName.trim().length === 0) {
      errors.push({
        field: 'senderName',
        message: 'Le nom de l\'expéditeur est requis',
        code: 'REQUIRED'
      });
    }

    // Validation du contenu
    if (!data.htmlContent || data.htmlContent.trim().length === 0) {
      errors.push({
        field: 'htmlContent',
        message: 'Le contenu HTML est requis',
        code: 'REQUIRED'
      });
    }

    // Validation des listes de contacts
    if (!data.contactListIds || data.contactListIds.length === 0) {
      errors.push({
        field: 'contactListIds',
        message: 'Au moins une liste de contacts doit être sélectionnée',
        code: 'REQUIRED'
      });
    }

    // Validation de la date de programmation
    if (data.scheduledAt) {
      const scheduledDate = new Date(data.scheduledAt);
      const now = new Date();
      
      if (scheduledDate <= now) {
        errors.push({
          field: 'scheduledAt',
          message: 'La date de programmation doit être dans le futur',
          code: 'INVALID_DATE'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateCampaignStatus(status: CampaignStatus): boolean {
    const validStatuses: CampaignStatus[] = [
      'draft', 'scheduled', 'sending', 'sent', 'paused', 'cancelled', 'failed'
    ];
    return validStatuses.includes(status);
  }

  static canEditCampaign(status: CampaignStatus): boolean {
    return ['draft', 'scheduled', 'paused'].includes(status);
  }

  static canSendCampaign(status: CampaignStatus): boolean {
    return ['draft', 'scheduled'].includes(status);
  }

  static canDeleteCampaign(status: CampaignStatus): boolean {
    return ['draft', 'failed', 'cancelled'].includes(status);
  }
}

// Validation des contacts
export class ContactValidator {
  static validateCreateContact(data: CreateContactRequest): ValidationResult {
    const errors: ValidationError[] = [];

    // Validation de l'email (requis)
    if (!data.email || data.email.trim().length === 0) {
      errors.push({
        field: 'email',
        message: 'L\'adresse email est requise',
        code: 'REQUIRED'
      });
    } else if (!EmailValidator.isValidEmail(data.email)) {
      errors.push({
        field: 'email',
        message: 'L\'adresse email n\'est pas valide',
        code: 'INVALID_EMAIL'
      });
    } else if (EmailValidator.isDisposableEmail(data.email)) {
      errors.push({
        field: 'email',
        message: 'Les adresses email temporaires ne sont pas autorisées',
        code: 'DISPOSABLE_EMAIL'
      });
    }

    // Validation du prénom
    if (data.firstName && data.firstName.length > 50) {
      errors.push({
        field: 'firstName',
        message: 'Le prénom ne doit pas dépasser 50 caractères',
        code: 'MAX_LENGTH'
      });
    }

    // Validation du nom
    if (data.lastName && data.lastName.length > 50) {
      errors.push({
        field: 'lastName',
        message: 'Le nom ne doit pas dépasser 50 caractères',
        code: 'MAX_LENGTH'
      });
    }

    // Validation de l'entreprise
    if (data.company && data.company.length > 100) {
      errors.push({
        field: 'company',
        message: 'Le nom de l\'entreprise ne doit pas dépasser 100 caractères',
        code: 'MAX_LENGTH'
      });
    }

    // Validation du téléphone
    if (data.phone && !this.isValidPhoneNumber(data.phone)) {
      errors.push({
        field: 'phone',
        message: 'Le numéro de téléphone n\'est pas valide',
        code: 'INVALID_PHONE'
      });
    }

    // Validation des tags
    if (data.tags) {
      for (const tag of data.tags) {
        if (tag.length > 30) {
          errors.push({
            field: 'tags',
            message: 'Les tags ne doivent pas dépasser 30 caractères',
            code: 'MAX_LENGTH'
          });
          break;
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private static isValidPhoneNumber(phone: string): boolean {
    // Regex basique pour validation de numéro de téléphone international
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,14}\d$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  static validateContactStatus(status: ContactStatus): boolean {
    const validStatuses: ContactStatus[] = [
      'active', 'unsubscribed', 'bounced', 'complained'
    ];
    return validStatuses.includes(status);
  }

  static canEmailContact(status: ContactStatus): boolean {
    return status === 'active';
  }
}

// Validation des templates
export class TemplateValidator {
  static validateCreateTemplate(data: CreateTemplateRequest): ValidationResult {
    const errors: ValidationError[] = [];

    // Validation du nom
    if (!data.name || data.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Le nom du template est requis',
        code: 'REQUIRED'
      });
    } else if (data.name.length > 100) {
      errors.push({
        field: 'name',
        message: 'Le nom ne doit pas dépasser 100 caractères',
        code: 'MAX_LENGTH'
      });
    }

    // Validation de la catégorie
    const validCategories = [
      'newsletter', 'promotion', 'transactional', 'welcome', 
      'announcement', 'event', 'survey', 'other'
    ];
    if (!data.category || !validCategories.includes(data.category)) {
      errors.push({
        field: 'category',
        message: 'Une catégorie valide doit être sélectionnée',
        code: 'INVALID_CATEGORY'
      });
    }

    // Validation du contenu HTML
    if (!data.htmlContent || data.htmlContent.trim().length === 0) {
      errors.push({
        field: 'htmlContent',
        message: 'Le contenu HTML est requis',
        code: 'REQUIRED'
      });
    } else {
      const htmlValidation = this.validateHtmlContent(data.htmlContent);
      if (!htmlValidation.isValid) {
        errors.push(...htmlValidation.errors);
      }
    }

    // Validation de l'objet
    if (!data.subject || data.subject.trim().length === 0) {
      errors.push({
        field: 'subject',
        message: 'L\'objet par défaut est requis',
        code: 'REQUIRED'
      });
    }

    // Validation des variables
    if (data.variables) {
      const variableValidation = this.validateTemplateVariables(data.variables);
      if (!variableValidation.isValid) {
        errors.push(...variableValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateHtmlContent(html: string): ValidationResult {
    const errors: ValidationError[] = [];

    // Vérifications basiques HTML
    if (!html.includes('<html') && !html.includes('<body')) {
      errors.push({
        field: 'htmlContent',
        message: 'Le HTML doit contenir au moins une structure de base',
        code: 'INVALID_HTML_STRUCTURE'
      });
    }

    // Vérifier les balises ouvrantes/fermantes basiques
    const tagRegex = /<(\w+)[^>]*>/g;
    const closingTagRegex = /<\/(\w+)>/g;
    
    const openTags: string[] = [];
    const closeTags: string[] = [];
    
    let match;
    while ((match = tagRegex.exec(html)) !== null) {
      openTags.push(match[1].toLowerCase());
    }
    
    tagRegex.lastIndex = 0; // Reset regex index
    
    while ((match = closingTagRegex.exec(html)) !== null) {
      closeTags.push(match[1].toLowerCase());
    }
    
    const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
    const tagsNeedingClosure = openTags.filter(tag => !selfClosingTags.includes(tag));
    
    for (const tag of tagsNeedingClosure) {
      if (!closeTags.includes(tag)) {
        errors.push({
          field: 'htmlContent',
          message: `Balise <${tag}> non fermée`,
          code: 'UNCLOSED_TAG'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateTemplateVariables(variables: TemplateVariable[]): ValidationResult {
    const errors: ValidationError[] = [];
    const variableNames = new Set<string>();

    for (let i = 0; i < variables.length; i++) {
      const variable = variables[i];
      
      // Vérifier le nom unique
      if (variableNames.has(variable.name)) {
        errors.push({
          field: `variables[${i}].name`,
          message: `Le nom de variable "${variable.name}" est déjà utilisé`,
          code: 'DUPLICATE_VARIABLE'
        });
      }
      variableNames.add(variable.name);

      // Vérifier le format du nom
      if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(variable.name)) {
        errors.push({
          field: `variables[${i}].name`,
          message: `Le nom de variable "${variable.name}" n'est pas valide`,
          code: 'INVALID_VARIABLE_NAME'
        });
      }

      // Vérifier le type
      const validTypes = ['text', 'number', 'date', 'boolean', 'url', 'email', 'select', 'image'];
      if (!validTypes.includes(variable.type)) {
        errors.push({
          field: `variables[${i}].type`,
          message: `Type de variable invalide: ${variable.type}`,
          code: 'INVALID_VARIABLE_TYPE'
        });
      }

      // Vérifier les options pour le type select
      if (variable.type === 'select' && (!variable.options || variable.options.length === 0)) {
        errors.push({
          field: `variables[${i}].options`,
          message: `Les variables de type "select" doivent avoir des options`,
          code: 'MISSING_SELECT_OPTIONS'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export du service de validation principal
export const ValidationService = {
  email: EmailValidator,
  campaign: CampaignValidator,
  contact: ContactValidator,
  template: TemplateValidator
};

export default ValidationService;