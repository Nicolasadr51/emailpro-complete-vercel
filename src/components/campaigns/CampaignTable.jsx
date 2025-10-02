import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Copy, 
  BarChart3, 
  Trash2,
  Play,
  Pause
} from 'lucide-react';
import { 
  CAMPAIGN_STATUS_COLORS, 
  CAMPAIGN_STATUS_VARIANTS,
  formatCampaignDate,
  formatPercentage,
  formatNumber
} from '@/types/campaigns';
import { cn } from '@/lib/utils';

const CampaignTable = ({ 
  campaigns, 
  isLoading = false,
  selectedCampaigns = [],
  onSelectionChange,
  onCampaignAction
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      onSelectionChange(campaigns.map(c => c.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectCampaign = (campaignId, checked) => {
    if (checked) {
      onSelectionChange([...selectedCampaigns, campaignId]);
    } else {
      onSelectionChange(selectedCampaigns.filter(id => id !== campaignId));
      setSelectAll(false);
    }
  };

  const handleAction = (action, campaignId) => {
    onCampaignAction?.(action, campaignId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="animate-pulse">
            <div className="border-b border-gray-200">
              <div className="flex items-center space-x-4 p-4">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-6 bg-gray-200 rounded"></div>
              </div>
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-gray-200 last:border-0">
                <div className="flex items-center space-x-4 p-4">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="campaigns-table">
      <CardContent className="p-0">
        {/* Version desktop */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    data-testid="select-all-checkbox"
                  />
                </TableHead>
                <TableHead>Campagne</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Destinataires</TableHead>
                <TableHead className="text-right">Taux d'ouverture</TableHead>
                <TableHead className="text-right">Taux de clic</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id} data-testid={`campaign-row-${campaign.id}`}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCampaigns.includes(campaign.id)}
                      onCheckedChange={(checked) => handleSelectCampaign(campaign.id, checked)}
                      data-testid={`select-campaign-${campaign.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">
                        {campaign.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {campaign.subject}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={CAMPAIGN_STATUS_VARIANTS[campaign.status]}
                      className={cn("font-medium", CAMPAIGN_STATUS_COLORS[campaign.status])}
                      data-testid={`status-${campaign.id}`}
                    >
                      {campaign.statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(campaign.recipients)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercentage(campaign.openRate)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercentage(campaign.clickRate)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatCampaignDate(campaign.date)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          data-testid={`actions-${campaign.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleAction('view', campaign.id)}
                          data-testid={`view-${campaign.id}`}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAction('edit', campaign.id)}
                          data-testid={`edit-${campaign.id}`}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAction('duplicate', campaign.id)}
                          data-testid={`duplicate-${campaign.id}`}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Dupliquer
                        </DropdownMenuItem>
                        {campaign.status === 'sent' && (
                          <DropdownMenuItem 
                            onClick={() => handleAction('stats', campaign.id)}
                            data-testid={`stats-${campaign.id}`}
                          >
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Statistiques
                          </DropdownMenuItem>
                        )}
                        {campaign.status === 'sending' && (
                          <DropdownMenuItem 
                            onClick={() => handleAction('pause', campaign.id)}
                            data-testid={`pause-${campaign.id}`}
                          >
                            <Pause className="mr-2 h-4 w-4" />
                            Mettre en pause
                          </DropdownMenuItem>
                        )}
                        {campaign.status === 'paused' && (
                          <DropdownMenuItem 
                            onClick={() => handleAction('resume', campaign.id)}
                            data-testid={`resume-${campaign.id}`}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Reprendre
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleAction('delete', campaign.id)}
                          className="text-red-600"
                          data-testid={`delete-${campaign.id}`}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Version mobile */}
        <div className="md:hidden">
          {campaigns.map((campaign) => (
            <div 
              key={campaign.id} 
              className="p-4 border-b border-gray-200 last:border-0"
              data-testid={`campaign-mobile-${campaign.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedCampaigns.includes(campaign.id)}
                    onCheckedChange={(checked) => handleSelectCampaign(campaign.id, checked)}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{campaign.subject}</p>
                  </div>
                </div>
                <Badge 
                  variant={CAMPAIGN_STATUS_VARIANTS[campaign.status]}
                  className={cn("text-xs", CAMPAIGN_STATUS_COLORS[campaign.status])}
                >
                  {campaign.statusLabel}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Destinataires:</span>
                  <div className="font-medium">{formatNumber(campaign.recipients)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Taux d'ouverture:</span>
                  <div className="font-medium">{formatPercentage(campaign.openRate)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Taux de clic:</span>
                  <div className="font-medium">{formatPercentage(campaign.clickRate)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <div className="font-medium">{formatCampaignDate(campaign.date)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignTable;