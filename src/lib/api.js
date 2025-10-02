// API endpoints pour la plateforme EmailPro - REAL API CALLS
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Generic API call handler
const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Endpoints du tableau de bord
export const dashboardApi = {
  // Récupérer les métriques principales
  getMetrics: async () => {
    return apiCall('/dashboard/metrics');
  },

  // Récupérer les données du graphique d'activité
  getActivityData: async () => {
    return apiCall('/dashboard/activity');
  },

  // Récupérer les campagnes récentes
  getRecentCampaigns: async () => {
    return apiCall('/dashboard/campaigns');
  },

  // Récupérer le profil utilisateur
  getUserProfile: async () => {
    return apiCall('/dashboard/profile');
  }
};

// Endpoints des campagnes
export const campaignApi = {
  // Récupérer toutes les campagnes
  getAllCampaigns: async (params = {}) => {
    const queryString = new URLSearchParams({
      skip: params.skip || 0,
      limit: params.limit || 100,
      ...(params.status && { status: params.status })
    }).toString();
    
    return apiCall(`/campaigns${queryString ? '?' + queryString : ''}`);
  },

  // Récupérer une campagne spécifique
  getCampaign: async (campaignId) => {
    return apiCall(`/campaigns/${campaignId}`);
  },

  // Créer une nouvelle campagne
  createCampaign: async (campaignData) => {
    return apiCall('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  },

  // Mettre à jour une campagne
  updateCampaign: async (campaignId, campaignData) => {
    return apiCall(`/campaigns/${campaignId}`, {
      method: 'PUT',
      body: JSON.stringify(campaignData),
    });
  },

  // Supprimer une campagne
  deleteCampaign: async (campaignId) => {
    return apiCall(`/campaigns/${campaignId}`, {
      method: 'DELETE',
    });
  }
};

// Endpoints des contacts
export const contactApi = {
  // Récupérer tous les contacts
  getContacts: async (params = {}) => {
    const queryString = new URLSearchParams({
      skip: params.skip || 0,
      limit: params.limit || 100,
      ...(params.status && { status: params.status })
    }).toString();
    
    return apiCall(`/contacts${queryString ? '?' + queryString : ''}`);
  },

  // Ajouter un nouveau contact
  addContact: async (contactData) => {
    return apiCall('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  // Récupérer toutes les listes de contacts
  getContactLists: async () => {
    return apiCall('/contact-lists');
  },

  // Créer une nouvelle liste de contacts
  createContactList: async (listData) => {
    return apiCall('/contact-lists', {
      method: 'POST',
      body: JSON.stringify(listData),
    });
  },

  // CSV Import/Export endpoints
  uploadCSV: async (formData) => {
    return apiCall('/contacts/csv/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove content-type to let browser set multipart boundary
    });
  },

  previewCSV: async (requestData) => {
    return apiCall('/contacts/csv/preview', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  importCSV: async (requestData) => {
    return apiCall('/contacts/csv/import', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  exportCSV: async (requestData) => {
    const response = await fetch(`${API_BASE}/contacts/csv/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Return blob for file download
    return response.blob();
  },

  getColumnOptions: async () => {
    return apiCall('/contacts/csv/column-options');
  }
};

// Endpoints des templates
export const templateApi = {
  // Récupérer tous les templates
  getTemplates: async (params = {}) => {
    const queryString = new URLSearchParams({
      skip: params.skip || 0,
      limit: params.limit || 100,
      ...(params.category && { category: params.category })
    }).toString();
    
    return apiCall(`/templates${queryString ? '?' + queryString : ''}`);
  },

  // Récupérer un template spécifique
  getTemplate: async (templateId) => {
    return apiCall(`/templates/${templateId}`);
  },

  // Créer un nouveau template
  createTemplate: async (templateData) => {
    return apiCall('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }
};

// Endpoints Email Editor
export const emailEditorApi = {
  // Designs
  createDesign: async (designData) => {
    return apiCall('/email-editor/designs', {
      method: 'POST',
      body: JSON.stringify(designData),
    });
  },

  getDesigns: async (params = {}) => {
    const queryString = new URLSearchParams({
      skip: params.skip || 0,
      limit: params.limit || 100,
      ...(params.created_by && { created_by: params.created_by })
    }).toString();
    
    return apiCall(`/email-editor/designs${queryString ? '?' + queryString : ''}`);
  },

  getDesign: async (designId) => {
    return apiCall(`/email-editor/designs/${designId}`);
  },

  updateDesign: async (designId, designData) => {
    return apiCall(`/email-editor/designs/${designId}`, {
      method: 'PUT',
      body: JSON.stringify(designData),
    });
  },

  deleteDesign: async (designId) => {
    return apiCall(`/email-editor/designs/${designId}`, {
      method: 'DELETE',
    });
  },

  duplicateDesign: async (designId, newName) => {
    return apiCall(`/email-editor/designs/${designId}/duplicate`, {
      method: 'POST',
      body: JSON.stringify({ new_name: newName }),
    });
  },

  // Blocks
  addBlock: async (blockData) => {
    return apiCall('/email-editor/blocks', {
      method: 'POST',
      body: JSON.stringify(blockData),
    });
  },

  updateBlock: async (blockData) => {
    return apiCall('/email-editor/blocks', {
      method: 'PUT',
      body: JSON.stringify(blockData),
    });
  },

  deleteBlock: async (designId, blockId) => {
    return apiCall(`/email-editor/designs/${designId}/blocks/${blockId}`, {
      method: 'DELETE',
    });
  },

  reorderBlocks: async (designId, blockOrders) => {
    return apiCall(`/email-editor/designs/${designId}/blocks/reorder`, {
      method: 'PUT',
      body: JSON.stringify(blockOrders),
    });
  },

  // Templates
  getTemplates: async (templateType) => {
    const queryString = templateType ? `?template_type=${templateType}` : '';
    return apiCall(`/email-editor/templates${queryString}`);
  },

  getTemplate: async (templateId) => {
    return apiCall(`/email-editor/templates/${templateId}`);
  },

  // Rendering
  renderEmail: async (renderData) => {
    return apiCall('/email-editor/render', {
      method: 'POST',
      body: JSON.stringify(renderData),
    });
  },

  // Utility
  getBlockTypes: async () => {
    return apiCall('/email-editor/block-types');
  },

  getTemplateTypes: async () => {
    return apiCall('/email-editor/template-types');
  },

  autoSave: async (designId, blocks) => {
    return apiCall(`/email-editor/auto-save/${designId}`, {
      method: 'POST',
      body: JSON.stringify(blocks),
    });
  },

  initializeTemplates: async () => {
    return apiCall('/email-editor/init-templates', {
      method: 'POST',
    });
  }
};

// Export par défaut avec toutes les APIs
const api = {
  dashboard: dashboardApi,
  campaigns: campaignApi,
  contacts: contactApi,
  templates: templateApi,
  emailEditor: emailEditorApi
};

export default api;