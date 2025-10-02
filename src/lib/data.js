// Données de test pour la plateforme EmailPro

// Métriques principales du tableau de bord
export const dashboardMetrics = {
  emailsSent: {
    value: 45231,
    trend: "+12%",
    isPositive: true,
    label: "ce mois"
  },
  openRate: {
    value: 24.8,
    trend: "+2.3%",
    isPositive: true,
    label: "ce mois"
  },
  clickRate: {
    value: 3.2,
    trend: "-0.5%",
    isPositive: false,
    label: "ce mois"
  },
  activeContacts: {
    value: 12847,
    trend: "+156",
    isPositive: true,
    label: "ce mois"
  }
};

// Données pour le graphique d'activité des 30 derniers jours
export const activityData = [
  { date: "2024-11-20", emails: 1200 },
  { date: "2024-11-21", emails: 1450 },
  { date: "2024-11-22", emails: 1100 },
  { date: "2024-11-23", emails: 1680 },
  { date: "2024-11-24", emails: 1320 },
  { date: "2024-11-25", emails: 1750 },
  { date: "2024-11-26", emails: 1890 },
  { date: "2024-11-27", emails: 1420 },
  { date: "2024-11-28", emails: 1650 },
  { date: "2024-11-29", emails: 2100 },
  { date: "2024-11-30", emails: 1580 },
  { date: "2024-12-01", emails: 1720 },
  { date: "2024-12-02", emails: 1350 },
  { date: "2024-12-03", emails: 1920 },
  { date: "2024-12-04", emails: 1680 },
  { date: "2024-12-05", emails: 1440 },
  { date: "2024-12-06", emails: 1780 },
  { date: "2024-12-07", emails: 1590 },
  { date: "2024-12-08", emails: 1830 },
  { date: "2024-12-09", emails: 1720 },
  { date: "2024-12-10", emails: 1650 },
  { date: "2024-12-11", emails: 1890 },
  { date: "2024-12-12", emails: 1520 },
  { date: "2024-12-13", emails: 1760 },
  { date: "2024-12-14", emails: 1680 },
  { date: "2024-12-15", emails: 1940 },
  { date: "2024-12-16", emails: 1820 },
  { date: "2024-12-17", emails: 1750 },
  { date: "2024-12-18", emails: 1860 },
  { date: "2024-12-19", emails: 1800 }
];

// Campagnes récentes
export const recentCampaigns = [
  {
    id: 1,
    name: "Newsletter Décembre",
    status: "sent",
    recipients: 5420,
    openRate: 28.5,
    sentDate: "2024-12-15"
  },
  {
    id: 2,
    name: "Promotion Black Friday",
    status: "sent",
    recipients: 8930,
    openRate: 35.2,
    sentDate: "2024-11-29"
  },
  {
    id: 3,
    name: "Bienvenue Nouveaux Clients",
    status: "draft",
    recipients: 1250,
    openRate: 0,
    sentDate: "2024-12-20"
  },
  {
    id: 4,
    name: "Rappel Webinaire",
    status: "scheduled",
    recipients: 3400,
    openRate: 0,
    sentDate: "2024-12-22"
  },
  {
    id: 5,
    name: "Enquête Satisfaction",
    status: "sent",
    recipients: 6780,
    openRate: 22.1,
    sentDate: "2024-12-10"
  }
];

// Données utilisateur pour le profil
export const userProfile = {
  name: "Marie Dubois",
  email: "marie.dubois@emailpro.com",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=32&h=32&fit=crop&crop=face",
  role: "Gestionnaire Marketing",
  company: "EmailPro"
};