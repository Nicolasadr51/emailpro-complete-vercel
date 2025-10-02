import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { campaignStats, statusOptions, dateOptions } from '@/lib/campaignData';
import { cn } from '@/lib/utils';

const CampaignFilters = ({ 
  activeStatusFilter, 
  onStatusFilterChange, 
  searchQuery, 
  onSearchChange,
  statusFilter,
  onAdvancedStatusChange,
  dateFilter,
  onDateFilterChange
}) => {
  const quickFilters = [
    { 
      key: 'all', 
      label: `Toutes (${campaignStats.all})`,
      count: campaignStats.all 
    },
    { 
      key: 'draft', 
      label: `Brouillons (${campaignStats.draft})`,
      count: campaignStats.draft 
    },
    { 
      key: 'scheduled', 
      label: `Programmées (${campaignStats.scheduled})`,
      count: campaignStats.scheduled 
    },
    { 
      key: 'sent', 
      label: `Envoyées (${campaignStats.sent})`,
      count: campaignStats.sent 
    }
  ];

  return (
    <div className="space-y-4" data-testid="campaign-filters">
      {/* Filtres rapides */}
      <div className="flex flex-wrap gap-2" data-testid="quick-filters">
        {quickFilters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onStatusFilterChange(filter.key)}
            className={cn(
              "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              activeStatusFilter === filter.key
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
            )}
            data-testid={`filter-${filter.key}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Barre de recherche et filtres avancés */}
      <div className="flex flex-col md:flex-row gap-4" data-testid="advanced-filters">
        {/* Recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Rechercher une campagne..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            data-testid="search-input"
          />
        </div>

        {/* Filtre par statut */}
        <Select value={statusFilter} onValueChange={onAdvancedStatusChange}>
          <SelectTrigger className="w-full md:w-48" data-testid="status-filter">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre par date */}
        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-full md:w-48" data-testid="date-filter">
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            {dateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CampaignFilters;