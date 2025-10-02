import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { CAMPAIGN_STATUS_LABELS, CAMPAIGN_STATUS_COLORS, formatDate } from '@/types/dashboard';

const RecentCampaigns = ({ campaigns, isLoading = false, onViewCampaign, onEditCampaign, onDeleteCampaign }) => {
  const getBadgeVariant = (status) => {
    const colorMap = {
      'success': 'default',
      'secondary': 'secondary', 
      'warning': 'outline',
      'info': 'outline',
      'destructive': 'destructive'
    };
    return colorMap[CAMPAIGN_STATUS_COLORS[status]] || 'secondary';
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-3">
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-6"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="recent-campaigns">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Campagnes Récentes
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            data-testid="view-all-campaigns"
          >
            Voir tout
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom de la campagne</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Destinataires</TableHead>
                <TableHead className="text-right">Taux d'ouverture</TableHead>
                <TableHead>Date d'envoi</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.slice(0, 5).map((campaign) => (
                <TableRow key={campaign.id} data-testid={`campaign-row-${campaign.id}`}>
                  <TableCell className="font-medium">
                    {campaign.name}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getBadgeVariant(campaign.status)}
                      data-testid={`campaign-status-${campaign.id}`}
                    >
                      {CAMPAIGN_STATUS_LABELS[campaign.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.recipients.toLocaleString('fr-FR')}
                  </TableCell>
                  <TableCell className="text-right">
                    {campaign.status === 'sent' ? `${campaign.openRate}%` : '-'}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(campaign.sentDate)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          data-testid={`campaign-actions-${campaign.id}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => onViewCampaign?.(campaign.id)}
                          data-testid={`view-campaign-${campaign.id}`}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onEditCampaign?.(campaign.id)}
                          data-testid={`edit-campaign-${campaign.id}`}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDeleteCampaign?.(campaign.id)}
                          className="text-red-600"
                          data-testid={`delete-campaign-${campaign.id}`}
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
        <div className="md:hidden space-y-3">
          {campaigns.slice(0, 5).map((campaign) => (
            <div 
              key={campaign.id} 
              className="p-4 border border-gray-200 rounded-lg"
              data-testid={`campaign-mobile-${campaign.id}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                <Badge variant={getBadgeVariant(campaign.status)}>
                  {CAMPAIGN_STATUS_LABELS[campaign.status]}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Destinataires:</span>
                  <br />
                  {campaign.recipients.toLocaleString('fr-FR')}
                </div>
                <div>
                  <span className="font-medium">Taux d'ouverture:</span>
                  <br />
                  {campaign.status === 'sent' ? `${campaign.openRate}%` : '-'}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {formatDate(campaign.sentDate)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentCampaigns;