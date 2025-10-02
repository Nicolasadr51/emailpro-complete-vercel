// Données de test étendues pour la gestion des campagnes

// Campagnes complètes avec plus de détails
export const allCampaigns = [
  {
    id: 1,
    name: "Newsletter Décembre",
    subject: "Découvrez nos nouveautés de décembre",
    preheader: "Ne manquez pas nos dernières tendances et offres exclusives",
    status: "sent",
    statusLabel: "Envoyée",
    recipients: 5420,
    openRate: 28.5,
    clickRate: 4.2,
    date: "15 déc. 2024",
    createdAt: "2024-12-15T10:00:00Z",
    sender: "EmailPro <noreply@emailpro.com>",
    tags: ["newsletter", "produits"]
  },
  {
    id: 2,
    name: "Promotion Black Friday",
    subject: "🔥 -50% sur tout le site !",
    preheader: "Profitez de nos meilleures offres de l'année",
    status: "sent",
    statusLabel: "Envoyée", 
    recipients: 8930,
    openRate: 35.2,
    clickRate: 8.7,
    date: "29 nov. 2024",
    createdAt: "2024-11-29T08:00:00Z",
    sender: "EmailPro <promo@emailpro.com>",
    tags: ["promotion", "soldes"]
  },
  {
    id: 3,
    name: "Campagne de relance",
    subject: "N'oubliez pas votre panier",
    preheader: "Finalisez votre commande avant qu'il ne soit trop tard",
    status: "scheduled",
    statusLabel: "Programmée",
    recipients: 1250,
    openRate: 0,
    clickRate: 0,
    date: "20 déc. 2024",
    createdAt: "2024-12-18T14:30:00Z",
    sender: "EmailPro <noreply@emailpro.com>",
    tags: ["relance", "panier"]
  },
  {
    id: 4,
    name: "Enquête satisfaction",
    subject: "Votre avis nous intéresse",
    preheader: "Aidez-nous à améliorer nos services",
    status: "draft",
    statusLabel: "Brouillon",
    recipients: 0,
    openRate: 0,
    clickRate: 0,
    date: "-",
    createdAt: "2024-12-18T16:00:00Z",
    sender: "Support <support@emailpro.com>",
    tags: ["enquête", "feedback"]
  },
  {
    id: 5,
    name: "Bienvenue nouveaux clients",
    subject: "Bienvenue chez EmailPro !",
    preheader: "Découvrez comment tirer le meilleur parti de nos services",
    status: "sent",
    statusLabel: "Envoyée",
    recipients: 340,
    openRate: 42.1,
    clickRate: 12.3,
    date: "10 déc. 2024",
    createdAt: "2024-12-10T09:15:00Z",
    sender: "EmailPro <welcome@emailpro.com>",
    tags: ["onboarding", "bienvenue"]
  },
  {
    id: 6,
    name: "Rappel événement webinaire",
    subject: "🎯 Webinaire demain à 14h",
    preheader: "Ne manquez pas notre session sur les meilleures pratiques",
    status: "scheduled",
    statusLabel: "Programmée",
    recipients: 2100,
    openRate: 0,
    clickRate: 0,
    date: "22 déc. 2024",
    createdAt: "2024-12-19T11:00:00Z",
    sender: "Events <events@emailpro.com>",
    tags: ["webinaire", "événement"]
  },
  {
    id: 7,
    name: "Newsletter hebdomadaire",
    subject: "Vos actualités de la semaine",
    preheader: "Restez informé des dernières nouveautés",
    status: "draft",
    statusLabel: "Brouillon",
    recipients: 0,
    openRate: 0,
    clickRate: 0,
    date: "-",
    createdAt: "2024-12-19T15:30:00Z",
    sender: "EmailPro <noreply@emailpro.com>",
    tags: ["newsletter", "hebdomadaire"]
  },
  {
    id: 8,
    name: "Offre spéciale VIP",
    subject: "Exclusif : Votre offre personnalisée",
    preheader: "En tant que client VIP, profitez de cette offre unique", 
    status: "sending",
    statusLabel: "En cours d'envoi",
    recipients: 450,
    openRate: 0,
    clickRate: 0,
    date: "19 déc. 2024",
    createdAt: "2024-12-19T16:45:00Z",
    sender: "VIP <vip@emailpro.com>",
    tags: ["vip", "exclusive"]
  },
  {
    id: 9,
    name: "Rappel renouvellement",
    subject: "Votre abonnement expire bientôt",
    preheader: "Renouvelez maintenant pour continuer à profiter de nos services",
    status: "failed",
    statusLabel: "Échec",
    recipients: 1800,
    openRate: 0,
    clickRate: 0,
    date: "18 déc. 2024",
    createdAt: "2024-12-18T10:20:00Z",
    sender: "Billing <billing@emailpro.com>",
    tags: ["renouvellement", "facturation"]
  },
  {
    id: 10,
    name: "Test A/B Objet",
    subject: "Version A : Nouveau produit disponible",
    preheader: "Découvrez notre dernière innovation",
    status: "draft",
    statusLabel: "Brouillon",
    recipients: 0,
    openRate: 0,
    clickRate: 0,
    date: "-",
    createdAt: "2024-12-19T17:00:00Z",
    sender: "Marketing <marketing@emailpro.com>",
    tags: ["test-ab", "produit"]
  }
];

// Statistiques des campagnes par statut
export const campaignStats = {
  all: allCampaigns.length,
  draft: allCampaigns.filter(c => c.status === 'draft').length,
  scheduled: allCampaigns.filter(c => c.status === 'scheduled').length,
  sent: allCampaigns.filter(c => c.status === 'sent').length,
  sending: allCampaigns.filter(c => c.status === 'sending').length,
  failed: allCampaigns.filter(c => c.status === 'failed').length
};

// Options pour les filtres
export const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'draft', label: 'Brouillon' },
  { value: 'scheduled', label: 'Programmée' },
  { value: 'sending', label: 'En cours d\'envoi' },
  { value: 'sent', label: 'Envoyée' },
  { value: 'failed', label: 'Échec' }
];

export const dateOptions = [
  { value: 'all', label: 'Toutes les dates' },
  { value: 'today', label: 'Aujourd\'hui' },
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
  { value: 'quarter', label: 'Ce trimestre' }
];

// Expéditeurs disponibles
export const senderOptions = [
  { value: 'default', label: 'EmailPro', email: 'noreply@emailpro.com' },
  { value: 'support', label: 'Support', email: 'support@emailpro.com' },
  { value: 'marketing', label: 'Marketing', email: 'marketing@emailpro.com' },
  { value: 'events', label: 'Events', email: 'events@emailpro.com' },
  { value: 'vip', label: 'VIP', email: 'vip@emailpro.com' }
];

// Templates de campagne
export const campaignTemplates = [
  {
    id: 1,
    name: "Newsletter Standard",
    description: "Template classique pour vos newsletters",
    thumbnail: "https://via.placeholder.com/200x150?text=Newsletter"
  },
  {
    id: 2,
    name: "Promotion",
    description: "Idéal pour vos offres spéciales",
    thumbnail: "https://via.placeholder.com/200x150?text=Promo"
  },
  {
    id: 3,
    name: "Événement",
    description: "Pour annoncer vos événements",
    thumbnail: "https://via.placeholder.com/200x150?text=Event"
  }
];