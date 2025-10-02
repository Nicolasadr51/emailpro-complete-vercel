import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricsCards from '@/components/dashboard/MetricsCards';
import ActivityChart from '@/components/dashboard/ActivityChart';
import RecentCampaigns from '@/components/dashboard/RecentCampaigns';
import QuickActions from '@/components/dashboard/QuickActions';
import api from '@/lib/api-mock';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Charger les données du tableau de bord
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Charger toutes les données en parallèle
        const [metricsResponse, activityResponse, campaignsResponse] = await Promise.all([
          api.dashboard.getMetrics(),
          api.dashboard.getActivityData(),
          api.dashboard.getRecentCampaigns()
        ]);

        if (metricsResponse.success) {
          setMetrics(metricsResponse.data);
        }
        
        if (activityResponse.success) {
          setActivityData(activityResponse.data);
        }
        
        if (campaignsResponse.success) {
          setCampaigns(campaignsResponse.data);
        }
        
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Erreur Dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Gestionnaires d'événements pour les actions rapides
  const handleQuickAction = (actionType, actionId) => {
    switch (actionType) {
      case 'createCampaign':
        console.log('Redirection vers création de campagne');
        // Dans une vraie app: navigate('/campaigns/new')
        navigate("/campaigns/new");
        break;
      case 'addContact':
        console.log('Redirection vers ajout de contact');
        navigate("/contacts");
        break;
      case 'createTemplate':
        console.log('Redirection vers création de template');
        navigate("/templates");
        break;
      case 'viewStats':
        console.log('Redirection vers statistiques');
        navigate("/statistics");
        break;
      default:
        console.log(`Action non reconnue: ${actionType}`);
    }
  };

  // Gestionnaires pour les actions sur les campagnes
  const handleViewCampaign = (campaignId) => {
    console.log(`Voir campagne ${campaignId}`);
    alert(`Fonctionnalité à implémenter: Voir campagne ${campaignId}`);
  };

  const handleEditCampaign = (campaignId) => {
    console.log(`Modifier campagne ${campaignId}`);
    alert(`Fonctionnalité à implémenter: Modifier campagne ${campaignId}`);
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm('\u00cates-vous s\u00fbr de vouloir supprimer cette campagne ?')) {
      try {
        const response = await api.campaigns.deleteCampaign(campaignId);
        if (response.success) {
          // Retirer la campagne de la liste locale
          setCampaigns(campaigns.filter(c => c.id !== campaignId));
          alert('Campagne supprimée avec succès');
        }
      } catch (err) {
        alert('Erreur lors de la suppression');
        console.error('Erreur suppression:', err);
      }
    }
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium mb-2">Erreur</div>
            <div className="text-gray-600">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Recharger
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8" data-testid="dashboard-page">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de Bord
          </h1>
          <p className="text-gray-600">
            Suivi des performances de votre plateforme d'emailing
          </p>
        </div>

        {/* Métriques principales */}
        <MetricsCards metrics={metrics} isLoading={isLoading} />
        
        {/* Graphique et Actions rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActivityChart 
            data={activityData} 
            isLoading={isLoading} 
          />
          <QuickActions onAction={handleQuickAction} />
        </div>
        
        {/* Campagnes récentes */}
        <RecentCampaigns 
          campaigns={campaigns}
          isLoading={isLoading}
          onViewCampaign={handleViewCampaign}
          onEditCampaign={handleEditCampaign}
          onDeleteCampaign={handleDeleteCampaign}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;