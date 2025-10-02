// Services de formatage pour la plateforme EmailPro

// Formatage des dates
export class DateFormatter {
  // Formats de date disponibles
  static readonly FORMATS = {
    SHORT: 'short',           // 15/12/24
    MEDIUM: 'medium',         // 15 déc. 2024
    LONG: 'long',            // 15 décembre 2024
    FULL: 'full',            // dimanche 15 décembre 2024
    ISO: 'iso',              // 2024-12-15
    DATETIME: 'datetime',     // 15/12/24 14:30
    TIME: 'time'             // 14:30
  } as const;

  static formatDate(
    date: Date | string | null | undefined, 
    format: keyof typeof DateFormatter.FORMATS = 'MEDIUM',
    locale: string = 'fr-FR'
  ): string {
    if (!date) return '-';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return 'Date invalide';

    switch (format) {
      case 'SHORT':
        return dateObj.toLocaleDateString(locale, {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit'
        });
      
      case 'MEDIUM':
        return dateObj.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      
      case 'LONG':
        return dateObj.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      
      case 'FULL':
        return dateObj.toLocaleDateString(locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      
      case 'ISO':
        return dateObj.toISOString().split('T')[0];
      
      case 'DATETIME':
        return dateObj.toLocaleString(locale, {
          year: '2-digit',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      
      case 'TIME':
        return dateObj.toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit'
        });
      
      default:
        return dateObj.toLocaleDateString(locale);
    }
  }

  // Formatage relatif (il y a X jours)
  static formatRelativeTime(
    date: Date | string,
    locale: string = 'fr-FR'
  ): string {
    if (!date) return '-';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Il y a quelques secondes';
    }

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    }

    if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    }

    if (diffInSeconds < 2592000) {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    }

    if (diffInSeconds < 31536000) {
      return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    }

    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }

  // Durée entre deux dates
  static formatDuration(
    startDate: Date | string,
    endDate: Date | string,
    unit: 'minutes' | 'hours' | 'days' | 'auto' = 'auto'
  ): string {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    const diffInMs = end.getTime() - start.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (unit === 'minutes') {
      return `${diffInMinutes} min`;
    }
    
    if (unit === 'hours') {
      return `${diffInHours}h`;
    }
    
    if (unit === 'days') {
      return `${diffInDays}j`;
    }

    // Auto: choisir la meilleure unité
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ${diffInMinutes % 60}min`;
    } else {
      return `${diffInDays}j ${diffInHours % 24}h`;
    }
  }
}

// Formatage des nombres
export class NumberFormatter {
  static formatNumber(
    num: number | null | undefined,
    decimals: number = 0,
    locale: string = 'fr-FR'
  ): string {
    if (num === null || num === undefined || isNaN(num)) return '-';
    
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  }

  static formatPercentage(
    num: number | null | undefined,
    decimals: number = 1,
    locale: string = 'fr-FR'
  ): string {
    if (num === null || num === undefined || isNaN(num)) return '-';
    
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num / 100);
  }

  static formatCurrency(
    amount: number | null | undefined,
    currency: string = 'EUR',
    locale: string = 'fr-FR'
  ): string {
    if (amount === null || amount === undefined || isNaN(amount)) return '-';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount);
  }

  // Formatage compact (1K, 1M, etc.)
  static formatCompactNumber(
    num: number | null | undefined,
    locale: string = 'fr-FR'
  ): string {
    if (num === null || num === undefined || isNaN(num)) return '-';
    
    return new Intl.NumberFormat(locale, {
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(num);
  }

  // Formatage de taille de fichier
  static formatFileSize(bytes: number | null | undefined): string {
    if (bytes === null || bytes === undefined || isNaN(bytes)) return '-';
    
    if (bytes === 0) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  // Formatage de durée en secondes
  static formatDuration(seconds: number | null | undefined): string {
    if (seconds === null || seconds === undefined || isNaN(seconds)) return '-';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}min ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}min ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }
}

// Formatage du texte
export class TextFormatter {
  static truncateText(
    text: string | null | undefined,
    length: number,
    suffix: string = '...'
  ): string {
    if (!text) return '';
    
    if (text.length <= length) return text;
    
    return text.substring(0, length - suffix.length) + suffix;
  }

  static capitalizeFirst(text: string | null | undefined): string {
    if (!text) return '';
    
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  static capitalizeWords(text: string | null | undefined): string {
    if (!text) return '';
    
    return text.replace(/\w\S*/g, (word) => 
      word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    );
  }

  static slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-z0-9 -]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/-+/g, '-') // Supprimer les tirets multiples
      .trim()
      .replace(/^-+|-+$/g, ''); // Supprimer les tirets en début/fin
  }

  static extractInitials(
    firstName?: string,
    lastName?: string
  ): string {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    
    return (first + last) || '?';
  }

  static formatPhoneNumber(
    phone: string | null | undefined,
    country: string = 'FR'
  ): string {
    if (!phone) return '';
    
    // Supprimer tous les caractères non numériques
    const cleaned = phone.replace(/\D/g, '');
    
    if (country === 'FR' && cleaned.length === 10) {
      // Format français: 01 23 45 67 89
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    
    // Format international basique
    if (cleaned.length >= 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(.*)/, '$1 $2 $3 $4 $5 $6');
    }
    
    return phone;
  }

  // Extraire le nom d'affichage complet
  static formatFullName(
    firstName?: string,
    lastName?: string,
    format: 'first-last' | 'last-first' | 'first-only' | 'last-only' = 'first-last'
  ): string {
    const first = firstName?.trim() || '';
    const last = lastName?.trim() || '';
    
    switch (format) {
      case 'first-last':
        return [first, last].filter(Boolean).join(' ') || 'Utilisateur';
      case 'last-first':
        return [last, first].filter(Boolean).join(', ') || 'Utilisateur';
      case 'first-only':
        return first || 'Utilisateur';
      case 'last-only':
        return last || 'Utilisateur';
      default:
        return [first, last].filter(Boolean).join(' ') || 'Utilisateur';
    }
  }

  // Masquer partiellement un email
  static maskEmail(email: string | null | undefined): string {
    if (!email) return '';
    
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    
    const maskedLocal = localPart.length > 2 
      ? localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.charAt(localPart.length - 1)
      : localPart.charAt(0) + '*';
    
    return `${maskedLocal}@${domain}`;
  }
}

// Formatage spécifique aux emails
export class EmailFormatter {
  static formatEmailStats(stats: {
    sent?: number;
    opened?: number;
    clicked?: number;
    bounced?: number;
    unsubscribed?: number;
  }): {
    openRate: string;
    clickRate: string;
    bounceRate: string;
    unsubscribeRate: string;
    clickToOpenRate: string;
  } {
    const { sent = 0, opened = 0, clicked = 0, bounced = 0, unsubscribed = 0 } = stats;
    
    const openRate = sent > 0 ? (opened / sent) * 100 : 0;
    const clickRate = sent > 0 ? (clicked / sent) * 100 : 0;
    const bounceRate = sent > 0 ? (bounced / sent) * 100 : 0;
    const unsubscribeRate = sent > 0 ? (unsubscribed / sent) * 100 : 0;
    const clickToOpenRate = opened > 0 ? (clicked / opened) * 100 : 0;
    
    return {
      openRate: NumberFormatter.formatPercentage(openRate, 1),
      clickRate: NumberFormatter.formatPercentage(clickRate, 1),
      bounceRate: NumberFormatter.formatPercentage(bounceRate, 1),
      unsubscribeRate: NumberFormatter.formatPercentage(unsubscribeRate, 1),
      clickToOpenRate: NumberFormatter.formatPercentage(clickToOpenRate, 1)
    };
  }

  static getEngagementLevel(
    openRate: number,
    clickRate: number
  ): 'excellent' | 'good' | 'average' | 'poor' {
    if (openRate >= 25 && clickRate >= 3) return 'excellent';
    if (openRate >= 20 && clickRate >= 2) return 'good';
    if (openRate >= 15 && clickRate >= 1) return 'average';
    return 'poor';
  }

  static formatEngagementLevel(level: ReturnType<typeof EmailFormatter.getEngagementLevel>): {
    label: string;
    color: string;
    description: string;
  } {
    const levels = {
      excellent: {
        label: 'Excellent',
        color: 'text-green-600',
        description: 'Performance exceptionnelle'
      },
      good: {
        label: 'Bon',
        color: 'text-blue-600',
        description: 'Performance au-dessus de la moyenne'
      },
      average: {
        label: 'Moyen',
        color: 'text-yellow-600',
        description: 'Performance dans la moyenne'
      },
      poor: {
        label: 'Faible',
        color: 'text-red-600',
        description: 'Performance à améliorer'
      }
    };
    
    return levels[level];
  }
}

// Export du service de formatage principal
export const FormattingService = {
  date: DateFormatter,
  number: NumberFormatter,
  text: TextFormatter,
  email: EmailFormatter
};

export default FormattingService;