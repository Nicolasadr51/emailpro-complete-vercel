/**
 * Exemple d'utilisation de la structure TypeScript EmailPro
 * Ce fichier démontre l'utilisation correcte de tous les types, services et hooks
 */

import React, { useState, useEffect } from 'react';
import {
  // Types principaux
  Campaign,
  Contact,
  EmailTemplate,
  User,
  CampaignStatus,
  ContactStatus,
  TemplateCategory,
  
  // Types API
  ApiResponse,
  PaginatedResponse,
  CreateCampaignRequest,
  CreateContactRequest,
  CreateTemplateRequest,
  
  // Types utilitaires
  ValidationResult,
  FormState
} from '@/types';

import {
  // Services API
  campaignsApi,
  contactsApi,
  templatesApi
} from '@/services/api';

import {
  // Services de validation
  ValidationService
} from '@/services/validation';

import {
  // Services de formatage
  FormattingService
} from '@/services/formatting';

import {
  // Constantes
  CONSTANTS,
  ENTITY_STATUSES,
  STATUS_LABELS,
  STATUS_COLORS
} from '@/services/constants';

import {
  // Hooks personnalisés
  useCampaigns,
  useCreateCampaign,
  useCampaignActions,
  useContacts,
  useCreateContact,
  useTemplates,
  useApi
} from '@/hooks';

// =====================================
// 1. EXEMPLE D'UTILISATION DES TYPES
// =====================================

// Type strict pour une campagne
const exampleCampaign: Campaign = {
  id: '12345',
  name: 'Newsletter Janvier 2025',
  subject: 'Bonne année et nouveautés !',
  preheader: 'Découvrez ce qui vous attend cette année',
  status: ENTITY_STATUSES.CAMPAIGN.DRAFT,
  type: 'regular',
  htmlContent: '<h1>Bonne année !</h1><p>Contenu de la newsletter...</p>',
  textContent: 'Bonne année ! Contenu de la newsletter...',
  senderName: 'EmailPro',
  senderEmail: 'noreply@emailpro.com',
  contactListIds: ['list-1', 'list-2'],
  excludedContactIds: [],
  stats: {
    totalSent: 0,
    totalDelivered: 0,
    totalBounced: 0,
    totalOpened: 0,
    totalClicked: 0,
    totalUnsubscribed: 0,
    totalComplaints: 0,
    deliveryRate: 0,
    openRate: 0,
    clickRate: 0,
    unsubscribeRate: 0,
    complaintRate: 0,
    clickToOpenRate: 0
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'user-123'
};

// Type strict pour un contact
const exampleContact: Contact = {
  id: 'contact-456',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  company: 'Acme Corp',
  phone: '+33123456789',
  status: ENTITY_STATUSES.CONTACT.ACTIVE,
  tags: ['vip', 'newsletter'],
  customFields: {
    industry: 'Technology',
    company_size: 'Medium',
    interests: ['AI', 'Marketing']
  },
  source: 'form',
  createdAt: new Date(),
  updatedAt: new Date(),
  totalEmailsSent: 45,
  totalEmailsOpened: 32,
  totalEmailsClicked: 8,
  averageOpenRate: 71.1,
  averageClickRate: 17.8,
  listIds: ['list-1']
};

// =====================================
// 2. COMPOSANT AVEC HOOKS PERSONNALISÉS
// =====================================

const CampaignManagementExample: React.FC = () => {
  // State local
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateCampaignRequest>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationResult | null>(null);

  // Hooks pour les campagnes
  const {
    campaigns,
    total,
    page,
    setPage,
    isLoading,
    error,
    stats,
    refetch
  } = useCampaigns({
    // status: 'draft', // Remplacer par un statut valide ou supprimer cette ligne
    page: 1,
    limit: 10
  });

  // Hook pour créer une campagne
  const {
    createCampaign,
    isLoading: isCreating,
    error: createError,
    isSuccess: createSuccess
  } = useCreateCampaign();

  // Hook pour les actions sur campagnes
  const {
    pauseCampaign,
    resumeCampaign,
    isLoading: isActioning
  } = useCampaignActions();

  // Hook pour les contacts
  const {
    contacts,
    isLoading: contactsLoading
  } = useContacts({ status: 'active', limit: 5 });

  // =====================================
  // 3. UTILISATION DES SERVICES
  // =====================================

  // Validation avec TypeScript strict
  const validateCampaignData = (data: Partial<CreateCampaignRequest>): boolean => {
    if (!data.name || !data.subject || !data.senderEmail) {
      return false;
    }

    const validation = ValidationService.campaign.validateCreateCampaign(data as CreateCampaignRequest);
    setValidationErrors(validation);
    
    return validation.isValid;
  };

  // Formatage des données
  const formatCampaignStats = (campaign: Campaign) => {
    const stats = FormattingService.email.formatEmailStats({
      sent: campaign.stats.totalSent,
      opened: campaign.stats.totalOpened,
      clicked: campaign.stats.totalClicked,
      bounced: campaign.stats.totalBounced,
      unsubscribed: campaign.stats.totalUnsubscribed
    });

    return {
      ...stats,
      createdAt: FormattingService.date.formatDate(campaign.createdAt, 'MEDIUM'),
      updatedAt: FormattingService.date.formatRelativeTime(campaign.updatedAt)
    };
  };

  // =====================================
  // 4. GESTION DES ÉVÉNEMENTS
  // =====================================

  const handleCreateCampaign = async () => {
    if (!validateCampaignData(formData)) {
      return;
    }

    try {
      const newCampaign = await createCampaign(formData as CreateCampaignRequest);
      if (newCampaign) {
        console.log('Campagne créée:', newCampaign);
        refetch(); // Rafraîchir la liste
        setFormData({}); // Reset du formulaire
      }
    } catch (error) {
      console.error('Erreur création:', error);
    }
  };

  const handleCampaignAction = async (action: string, campaignId: string) => {
    try {
      switch (action) {
        case 'pause':
          await pauseCampaign(campaignId);
          break;
        case 'resume':
          await resumeCampaign(campaignId);
          break;
        default:
          console.log(`Action ${action} non gérée`);
      }
      refetch(); // Rafraîchir après action
    } catch (error) {
      console.error(`Erreur ${action}:`, error);
    }
  };

  // =====================================
  // 5. UTILISATION DIRECTE DES APIS
  // =====================================

  const fetchCampaignDetails = async (campaignId: string) => {
    try {
      const response: ApiResponse<Campaign> = await campaignsApi.getCampaign(campaignId);
      
      if (response.success && response.data) {
        console.log('Détails campagne:', response.data);
        setSelectedCampaignId(campaignId);
      } else {
        console.error('Erreur récupération:', response.error);
      }
    } catch (error) {
      console.error('Erreur API:', error);
    }
  };

  const exportCampaignData = async (campaignId: string) => {
    try {
      const blob = await campaignsApi.exportCampaignData(campaignId, 'csv');
      
      // Télécharger le fichier
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `campaign-${campaignId}-export.csv`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur export:', error);
    }
  };

  // =====================================
  // 6. RENDU DU COMPOSANT
  // =====================================

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Exemple TypeScript EmailPro</h1>
      
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600">Total Campagnes</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600">Brouillons</h3>
          <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600">Envoyées</h3>
          <p className="text-2xl font-bold text-green-600">{stats.sent}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-gray-600">Contacts Actifs</h3>
          <p className="text-2xl font-bold text-purple-600">
            {contactsLoading ? 'Chargement...' : contacts.length}
          </p>
        </div>
      </div>

      {/* Liste des campagnes */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Campagnes Récentes</h2>
        </div>
        
        {isLoading ? (
          <div className="p-6 text-center">Chargement des campagnes...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">Erreur: {error}</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {campaigns.map((campaign) => {
              const formattedStats = formatCampaignStats(campaign);
              
              return (
                <div key={campaign.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{campaign.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{campaign.subject}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Créée le {formattedStats.createdAt}</span>
                        <span>Modifiée {formattedStats.updatedAt}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS.CAMPAIGN[campaign.status]
                        }`}
                      >
                        {STATUS_LABELS.CAMPAIGN[campaign.status]}
                      </span>
                      
                      {campaign.status === 'sent' && (
                        <div className="text-sm text-gray-600">
                          <div>Taux d'ouverture: {formattedStats.openRate}</div>
                          <div>Taux de clic: {formattedStats.clickRate}</div>
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => fetchCampaignDetails(campaign.id)}
                          className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          Voir
                        </button>
                        
                        {campaign.status === 'sending' && (
                          <button
                            onClick={() => handleCampaignAction('pause', campaign.id)}
                            disabled={isActioning}
                            className="px-3 py-1 text-orange-600 hover:bg-orange-50 rounded disabled:opacity-50"
                          >
                            Pause
                          </button>
                        )}
                        
                        {campaign.status === 'paused' && (
                          <button
                            onClick={() => handleCampaignAction('resume', campaign.id)}
                            disabled={isActioning}
                            className="px-3 py-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                          >
                            Reprendre
                          </button>
                        )}
                        
                        {campaign.status === 'sent' && (
                          <button
                            onClick={() => exportCampaignData(campaign.id)}
                            className="px-3 py-1 text-purple-600 hover:bg-purple-50 rounded"
                          >
                            Export
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Formulaire de création */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Créer une Nouvelle Campagne</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la campagne *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Newsletter Février 2025"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objet de l'email *
            </label>
            <input
              type="text"
              value={formData.subject || ''}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Découvrez nos nouveautés de février"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email expéditeur *
            </label>
            <input
              type="email"
              value={formData.senderEmail || ''}
              onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="noreply@emailpro.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom expéditeur *
            </label>
            <input
              type="text"
              value={formData.senderName || ''}
              onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="EmailPro"
            />
          </div>
        </div>
        
        {/* Erreurs de validation */}
        {validationErrors && !validationErrors.isValid && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-red-800 font-medium mb-2">Erreurs de validation:</h4>
            <ul className="text-red-600 text-sm space-y-1">
              {validationErrors.errors.map((error, index) => (
                <li key={index}>• {error.message}</li>
              ))}
            </ul>
          </div>
        )}
        
        <button
          onClick={handleCreateCampaign}
          disabled={isCreating}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Création...' : 'Créer la Campagne'}
        </button>
        
        {createError && (
          <p className="mt-2 text-red-600 text-sm">Erreur: {createError}</p>
        )}
        
        {createSuccess && (
          <p className="mt-2 text-green-600 text-sm">Campagne créée avec succès !</p>
        )}
      </div>

      {/* Informations de débogage */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Informations TypeScript</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Types compilés sans erreur ✓</p>
          <p>• Services API typés strictement ✓</p>
          <p>• Hooks personnalisés avec gestion d'état ✓</p>
          <p>• Validation et formatage intégrés ✓</p>
          <p>• Constantes et configuration centralisées ✓</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignManagementExample;