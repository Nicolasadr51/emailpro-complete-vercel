export const filterCampaigns = (campaigns, filters) => {
  const { searchQuery, statusFilter, dateFilter } = filters;
  
  return campaigns.filter(campaign => {
    // Filtre par recherche
    if (searchQuery && !campaign.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filtre par statut
    if (statusFilter !== 'all' && campaign.status !== statusFilter) {
      return false;
    }
    
    // Filtre par date
    if (dateFilter !== 'all') {
      const now = new Date();
      const campaignDate = new Date(campaign.createdAt || campaign.scheduledAt);
      
      switch (dateFilter) {
        case 'today':
          return campaignDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return campaignDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return campaignDate >= monthAgo;
        default:
          return true;
      }
    }
    
    return true;
  });
};

export const sortCampaigns = (campaigns, sortBy, sortOrder = 'desc') => {
  return [...campaigns].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Gestion des dates
    if (sortBy.includes('Date') || sortBy.includes('At')) {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // Gestion des chaînes
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};
