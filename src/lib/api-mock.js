// API Mock pour la plateforme EmailPro - Données simulées
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Données simulées
const mockData = {
  metrics: {
    totalCampaigns: 24,
    totalContacts: 1250,
    openRate: 42.5,
    clickRate: 8.3,
    totalSent: 15420,
    totalOpened: 6553,
    totalClicked: 1280,
    totalBounced: 154
  },
  
  activityData: [
    { date: '2024-09-24', envois: 1200, ouvertures: 480, clics: 96 },
    { date: '2024-09-25', envois: 1350, ouvertures: 540, clics: 108 },
    { date: '2024-09-26', envois: 1100, ouvertures: 440, clics: 88 },
    { date: '2024-09-27', envois: 1450, ouvertures: 580, clics: 116 },
    { date: '2024-09-28', envois: 1300, ouvertures: 520, clics: 104 },
    { date: '2024-09-29', envois: 1600, ouvertures: 640, clics: 128 },
    { date: '2024-09-30', envois: 1250, ouvertures: 500, clics: 100 }
  ],
  
  campaigns: [
    {
      id: '1',
      name: 'Newsletter Septembre 2024',
      status: 'sent',
      sentAt: '2024-09-28T10:00:00Z',
      recipients: 2500,
      openRate: 45.2,
      clickRate: 9.1,
      subject: 'Découvrez nos nouveautés de septembre'
    },
    {
      id: '2',
      name: 'Promotion Rentrée',
      status: 'sent',
      sentAt: '2024-09-25T14:30:00Z',
      recipients: 1800,
      openRate: 38.7,
      clickRate: 7.3,
      subject: 'Offres spéciales rentrée - 30% de réduction'
    },
    {
      id: '3',
      name: 'Webinar Invitation',
      status: 'draft',
      createdAt: '2024-09-30T09:15:00Z',
      recipients: 1200,
      subject: 'Rejoignez notre webinar exclusif'
    }
  ],
  
  contacts: [
    {
      id: '1',
      email: 'jean.dupont@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      company: 'Tech Corp',
      phone: '+33 1 23 45 67 89',
      status: 'active',
      tags: ['vip', 'newsletter'],
      createdAt: '2024-09-15T10:00:00Z'
    },
    {
      id: '2',
      email: 'marie.martin@example.com',
      firstName: 'Marie',
      lastName: 'Martin',
      company: 'Design Studio',
      phone: '+33 1 98 76 54 32',
      status: 'active',
      tags: ['client', 'design'],
      createdAt: '2024-09-14T14:30:00Z'
    },
    {
      id: '3',
      email: 'pierre.bernard@example.com',
      firstName: 'Pierre',
      lastName: 'Bernard',
      company: 'Marketing Plus',
      phone: '+33 1 11 22 33 44',
      status: 'unsubscribed',
      tags: ['prospect'],
      createdAt: '2024-09-13T09:15:00Z'
    }
  ],
  
  templates: [
    {
      id: 'template-1',
      name: 'Newsletter Moderne',
      description: 'Template moderne pour newsletter avec design épuré',
      category: 'newsletter',
      tags: ['moderne', 'newsletter', 'épuré'],
      thumbnail: 'https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=Newsletter',
      isPublic: true,
      createdAt: '2024-09-20T10:00:00Z',
      updatedAt: '2024-09-20T10:00:00Z'
    },
    {
      id: 'template-2',
      name: 'Promotion E-commerce',
      description: 'Template pour promotions et ventes e-commerce',
      category: 'promotional',
      tags: ['e-commerce', 'promotion', 'vente'],
      thumbnail: 'https://via.placeholder.com/300x400/EF4444/FFFFFF?text=Promo',
      isPublic: true,
      createdAt: '2024-09-19T14:30:00Z',
      updatedAt: '2024-09-19T14:30:00Z'
    }
  ]
};

// Mock API functions
export const dashboardApi = {
  getMetrics: async () => {
    await delay(500);
    return { success: true, data: mockData.metrics };
  },

  getActivityData: async () => {
    await delay(300);
    return { success: true, data: mockData.activityData };
  },

  getRecentCampaigns: async () => {
    await delay(400);
    return { success: true, data: mockData.campaigns };
  },

  getUserProfile: async () => {
    await delay(200);
    return { 
      success: true, 
      data: { 
        name: 'Marie Dubois', 
        email: 'marie@example.com',
        role: 'Gestionnaire Marketing'
      }
    };
  }
};

export const campaignApi = {
  getAllCampaigns: async (params = {}) => {
    await delay(600);
    return { success: true, data: mockData.campaigns };
  },

  getCampaign: async (campaignId) => {
    await delay(300);
    const campaign = mockData.campaigns.find(c => c.id === campaignId);
    return { success: true, data: campaign };
  },

  createCampaign: async (campaignData) => {
    await delay(800);
    const newCampaign = {
      id: Date.now().toString(),
      ...campaignData,
      status: 'draft',
      createdAt: new Date().toISOString()
    };
    mockData.campaigns.push(newCampaign);
    return { success: true, data: newCampaign };
  },

  updateCampaign: async (campaignId, campaignData) => {
    await delay(500);
    const index = mockData.campaigns.findIndex(c => c.id === campaignId);
    if (index !== -1) {
      mockData.campaigns[index] = { ...mockData.campaigns[index], ...campaignData };
      return { success: true, data: mockData.campaigns[index] };
    }
    return { success: false, error: 'Campaign not found' };
  },

  deleteCampaign: async (campaignId) => {
    await delay(300);
    const index = mockData.campaigns.findIndex(c => c.id === campaignId);
    if (index !== -1) {
      mockData.campaigns.splice(index, 1);
      return { success: true };
    }
    return { success: false, error: 'Campaign not found' };
  }
};

export const contactApi = {
  getContacts: async (params = {}) => {
    await delay(500);
    return { success: true, data: mockData.contacts };
  },

  addContact: async (contactData) => {
    await delay(400);
    const newContact = {
      id: Date.now().toString(),
      ...contactData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    mockData.contacts.push(newContact);
    return { success: true, data: newContact };
  },

  getContactLists: async () => {
    await delay(300);
    return { 
      success: true, 
      data: [
        { id: '1', name: 'Newsletter Subscribers', count: 1250 },
        { id: '2', name: 'VIP Customers', count: 85 },
        { id: '3', name: 'Prospects', count: 340 }
      ]
    };
  },

  createContactList: async (listData) => {
    await delay(400);
    return { success: true, data: { id: Date.now().toString(), ...listData } };
  },

  uploadCSV: async (formData) => {
    await delay(1000);
    return { success: true, data: { uploadId: Date.now().toString() } };
  },

  previewCSV: async (requestData) => {
    await delay(800);
    return { 
      success: true, 
      data: {
        preview: [
          { email: 'test1@example.com', firstName: 'Test', lastName: 'User1' },
          { email: 'test2@example.com', firstName: 'Test', lastName: 'User2' }
        ],
        totalRows: 100
      }
    };
  },

  importCSV: async (requestData) => {
    await delay(1500);
    return { success: true, data: { imported: 100, errors: 0 } };
  },

  exportCSV: async (requestData) => {
    await delay(1000);
    // Simuler un blob CSV
    const csvContent = "email,firstName,lastName\ntest@example.com,Test,User";
    return new Blob([csvContent], { type: 'text/csv' });
  },

  getColumnOptions: async () => {
    await delay(200);
    return { 
      success: true, 
      data: ['email', 'firstName', 'lastName', 'company', 'phone', 'tags']
    };
  }
};

export const templateApi = {
  getTemplates: async (params = {}) => {
    await delay(400);
    return { success: true, data: mockData.templates };
  },

  getTemplate: async (templateId) => {
    await delay(300);
    const template = mockData.templates.find(t => t.id === templateId);
    return { success: true, data: template };
  },

  createTemplate: async (templateData) => {
    await delay(600);
    const newTemplate = {
      id: `template-${Date.now()}`,
      ...templateData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockData.templates.push(newTemplate);
    return { success: true, data: newTemplate };
  }
};

export const emailEditorApi = {
  createDesign: async (designData) => {
    await delay(500);
    return { success: true, data: { id: Date.now().toString(), ...designData } };
  },

  getDesigns: async (params = {}) => {
    await delay(400);
    return { success: true, data: [] };
  },

  getDesign: async (designId) => {
    await delay(300);
    return { success: true, data: { id: designId, blocks: [] } };
  },

  updateDesign: async (designId, designData) => {
    await delay(400);
    return { success: true, data: { id: designId, ...designData } };
  },

  deleteDesign: async (designId) => {
    await delay(300);
    return { success: true };
  },

  duplicateDesign: async (designId, newName) => {
    await delay(500);
    return { success: true, data: { id: Date.now().toString(), name: newName } };
  },

  addBlock: async (blockData) => {
    await delay(200);
    return { success: true, data: { id: Date.now().toString(), ...blockData } };
  },

  updateBlock: async (blockData) => {
    await delay(200);
    return { success: true, data: blockData };
  },

  deleteBlock: async (designId, blockId) => {
    await delay(200);
    return { success: true };
  },

  reorderBlocks: async (designId, blockOrders) => {
    await delay(300);
    return { success: true };
  },

  getTemplates: async (templateType) => {
    await delay(400);
    return { success: true, data: mockData.templates };
  },

  getTemplate: async (templateId) => {
    await delay(300);
    const template = mockData.templates.find(t => t.id === templateId);
    return { success: true, data: template };
  },

  renderEmail: async (renderData) => {
    await delay(800);
    return { success: true, data: { html: '<div>Email rendu</div>' } };
  },

  getBlockTypes: async () => {
    await delay(200);
    return { 
      success: true, 
      data: [
        { type: 'text', name: 'Texte', description: 'Ajouter du texte', icon: 'type', defaultContent: 'Ceci est un bloc de texte. Cliquez pour modifier.' },
        { type: 'image', name: 'Image', description: 'Insérer une image', icon: 'image', defaultContent: 'https://via.placeholder.com/300x200?text=Votre+Image' },
        { type: 'button', name: 'Bouton', description: 'Bouton cliquable', icon: 'mouse-pointer', defaultContent: 'Cliquez ici' },
        { type: 'divider', name: 'Séparateur', description: 'Ligne de séparation', icon: 'minus', defaultContent: '' },
        { type: 'spacer', name: 'Espacement', description: 'Espace vertical', icon: 'move-vertical', defaultContent: '' },
        { type: 'social', name: 'Réseaux Sociaux', description: 'Liens sociaux', icon: 'share2', defaultContent: '' }
      ]
    };
  },

  getTemplateTypes: async () => {
    await delay(200);
    return { 
      success: true, 
      data: ['newsletter', 'promotional', 'transactional', 'welcome']
    };
  },

  autoSave: async (designId, blocks) => {
    await delay(100);
    return { success: true };
  },

  initializeTemplates: async () => {
    await delay(1000);
    return { success: true };
  }
};

// Export par défaut avec toutes les APIs mock
const api = {
  dashboard: dashboardApi,
  campaigns: campaignApi,
  contacts: contactApi,
  templates: templateApi,
  emailEditor: emailEditorApi
};

export default api;
