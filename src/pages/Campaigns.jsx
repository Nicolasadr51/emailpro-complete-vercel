import React, { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CampaignFilters from '@/components/campaigns/CampaignFilters';
import CampaignTable from '@/components/campaigns/CampaignTable';
import BulkActions from '@/components/campaigns/BulkActions';
import { Button } from '@/components/ui/button';
import api from '@/lib/api-mock';
import { CAMPAIGN_ACTIONS } from '@/types/campaigns';
import { useNavigate } from 'react-router-dom';

const Campaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  
  // Filtres
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Charger les campagnes depuis l'API
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.campaigns.getAllCampaigns({
          skip: 0,
          limit: 1000, // Load all campaigns for client-side filtering
          status: statusFilter !== 'all' ? statusFilter : undefined
        });
        
        if (response.success) {
          setCampaigns(response.data || []);
        } else {
          setError('Erreur lors du chargement des campagnes');
        }
      } catch (err) {
        setError('Erreur lors du chargement des campagnes');
        console.error('Error loading campaigns:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCampaigns();
  }, [statusFilter]);

  // Filtrer les campagnes
  const filteredCampaigns = useMemo(() => {
    let filtered = campaigns;
    
    // Filtre par statut rapide
    if (activeStatusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === activeStatusFilter);
    }
    
    // Filtre par statut avancé (surcharge le filtre rapide)
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    
    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.subject.toLowerCase().includes(query)
      );
    }
    
    // Filtre par date (simulation basique)
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(c => {
        if (c.date === '-' || !c.createdAt) return dateFilter === 'all';
        
        const campaignDate = new Date(c.createdAt);
        
        switch (dateFilter) {
          case 'today':
            return campaignDate >= today;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return campaignDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return campaignDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [campaigns, activeStatusFilter, statusFilter, searchQuery, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const paginatedCampaigns = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCampaigns, currentPage, itemsPerPage]);

  // Gestionnaires d'événements
  const handleNewCampaign = () => {
    navigate('/campaigns/new');
  };

  const handleCampaignAction = async (action, campaignId) => {
    switch (action) {
      case CAMPAIGN_ACTIONS.VIEW:
        console.log(`Voir campagne ${campaignId}`);
        navigate(`/campaigns/${campaignId}`);
        break;
      case CAMPAIGN_ACTIONS.EDIT:
        console.log(`Modifier campagne ${campaignId}`);
        navigate(`/campaigns/${campaignId}/edit`);
        break;
      case CAMPAIGN_ACTIONS.DUPLICATE:
        navigate(`/campaigns/${campaignId}/duplicate`);
        break;
      case CAMPAIGN_ACTIONS.STATS:
        navigate(`/campaigns/${campaignId}/stats`);
        break;
      case CAMPAIGN_ACTIONS.DELETE:
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
          try {
            const response = await api.campaigns.deleteCampaign(campaignId);
            if (response.success) {
              setCampaigns(campaigns.filter(c => c.id !== campaignId));
              setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaignId));
              alert('Campagne supprimée avec succès');
            }
          } catch (err) {
            alert('Erreur lors de la suppression');
            console.error('Error deleting campaign:', err);
          }
        }
        break;
      default:
        console.log(`Action non gérée: ${action}`);
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case CAMPAIGN_ACTIONS.DUPLICATE:
        console.log(`Dupliquer ${selectedCampaigns.length} campagnes`);
        alert(`Fonctionnalité à implémenter: Dupliquer ${selectedCampaigns.length} campagnes`);
        break;
      case CAMPAIGN_ACTIONS.ARCHIVE:
        console.log(`Archiver ${selectedCampaigns.length} campagnes`);
        alert(`Fonctionnalité à implémenter: Archiver ${selectedCampaigns.length} campagnes`);
        break;
      case CAMPAIGN_ACTIONS.DELETE:
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedCampaigns.length} campagnes ?`)) {
          // TODO: Implement bulk delete API call
          setCampaigns(campaigns.filter(c => !selectedCampaigns.includes(c.id)));
          setSelectedCampaigns([]);
          alert(`${selectedCampaigns.length} campagnes supprimées`);
        }
        break;
      default:
        console.log(`Action en lot non gérée: ${action}`);
    }
  };

  const handleStatusFilterChange = (status) => {
    setActiveStatusFilter(status);
    setStatusFilter('all'); // Reset le filtre avancé
    setCurrentPage(1);
  };

  const handleAdvancedStatusChange = (status) => {
    setStatusFilter(status);
    setActiveStatusFilter('all'); // Reset le filtre rapide
    setCurrentPage(1);
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium mb-2">Erreur</div>
            <div className="text-gray-600 mb-4">{error}</div>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600"
            >
              Recharger
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6" data-testid="campaigns-page">
        {/* En-tête de page */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campagnes</h1>
            <p className="text-gray-600 mt-1">Gérez vos campagnes d'emailing</p>
          </div>
          <Button 
            onClick={handleNewCampaign}
            className="bg-blue-500 hover:bg-blue-600"
            size="lg"
            data-testid="new-campaign-button"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Campagne
          </Button>
        </div>

        {/* Filtres */}
        <CampaignFilters
          activeStatusFilter={activeStatusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onAdvancedStatusChange={handleAdvancedStatusChange}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />

        {/* Actions en lot */}
        <BulkActions
          selectedCount={selectedCampaigns.length}
          onBulkAction={handleBulkAction}
          onClearSelection={() => setSelectedCampaigns([])}
        />

        {/* Tableau des campagnes */}
        <CampaignTable
          campaigns={paginatedCampaigns}
          isLoading={isLoading}
          selectedCampaigns={selectedCampaigns}
          onSelectionChange={setSelectedCampaigns}
          onCampaignAction={handleCampaignAction}
        />

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between" data-testid="pagination">
            <div className="text-sm text-gray-700">
              Affichage de {((currentPage - 1) * itemsPerPage) + 1} à{' '}
              {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)} sur{' '}
              {filteredCampaigns.length} campagnes
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                data-testid="prev-page"
              >
                Précédent
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    data-testid={`page-${page}`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                data-testid="next-page"
              >
                Suivant
              </Button>
            </div>
          </div>
        )}

        {/* Message si aucune campagne */}
        {!isLoading && filteredCampaigns.length === 0 && (
          <div className="text-center py-12" data-testid="no-campaigns">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m0 0L7 9l4-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune campagne trouvée
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all' 
                ? "Aucune campagne ne correspond à vos critères de recherche."
                : "Vous n'avez pas encore créé de campagne."}
            </p>
            {(!searchQuery && statusFilter === 'all' && dateFilter === 'all') && (
              <Button onClick={handleNewCampaign}>
                <Plus className="mr-2 h-4 w-4" />
                Créer ma première campagne
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Campaigns;