import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QUICK_ACTIONS } from '@/types/dashboard';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

const QuickActions = ({ onAction }) => {
  const handleAction = (actionType, actionId) => {
    if (onAction) {
      onAction(actionType, actionId);
    } else {
      // Actions par défaut pour la demo
      switch (actionType) {
        case 'createCampaign':
          console.log('Création d\'une nouvelle campagne...');
          // Redirection vers /campaigns/new
          break;
        case 'addContact':
          console.log('Ajout d\'un nouveau contact...');
          // Redirection vers /contacts/new
          break;
        case 'createTemplate':
          console.log('Création d\'un nouveau template...');
          // Redirection vers /templates/new
          break;
        case 'viewStats':
          console.log('Affichage des statistiques...');
          // Redirection vers /stats
          break;
        default:
          console.log(`Action non reconnue: ${actionType}`);
      }
    }
  };

  return (
    <Card data-testid="quick-actions">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Actions Rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUICK_ACTIONS.map((action) => {
            const IconComponent = LucideIcons[action.icon];
            
            return (
              <Button
                key={action.id}
                variant="outline"
                className={cn(
                  "h-auto p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all duration-200",
                  "border-2 hover:border-transparent"
                )}
                style={{
                  '--hover-bg': action.color.replace('bg-', '').replace('hover:bg-', '')
                }}
                onClick={() => handleAction(action.action, action.id)}
                data-testid={`quick-action-${action.id}`}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors",
                  action.color
                )}>
                  {IconComponent && <IconComponent className="h-6 w-6" />}
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900 mb-1">
                    {action.label}
                  </div>
                  <div className="text-xs text-gray-500 leading-tight">
                    {action.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
        
        {/* Version mobile - Stack vertical */}
        <div className="sm:hidden mt-4">
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const IconComponent = LucideIcons[action.icon];
              
              return (
                <Button
                  key={`mobile-${action.id}`}
                  variant="outline"
                  className="h-20 flex flex-col items-center gap-2 p-3"
                  onClick={() => handleAction(action.action, action.id)}
                  data-testid={`quick-action-mobile-${action.id}`}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white",
                    action.color
                  )}>
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">
                    {action.label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;