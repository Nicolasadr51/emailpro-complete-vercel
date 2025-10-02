import React from 'react';
import { Button } from '@/components/ui/button';
import { BULK_ACTIONS } from '@/types/campaigns';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

const BulkActions = ({ selectedCount, onBulkAction, onClearSelection }) => {
  if (selectedCount === 0) return null;

  return (
    <div 
      className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6"
      data-testid="bulk-actions"
    >
      <span className="text-sm text-blue-700 font-medium">
        {selectedCount} campagne{selectedCount > 1 ? 's' : ''} sélectionnée{selectedCount > 1 ? 's' : ''}
      </span>
      
      <div className="flex gap-2">
        {BULK_ACTIONS.map((action) => {
          const IconComponent = LucideIcons[action.icon];
          
          return (
            <Button
              key={action.id}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={() => onBulkAction(action.id)}
              className={cn(
                "h-8",
                action.className
              )}
              data-testid={`bulk-action-${action.id}`}
            >
              {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
              {action.label}
            </Button>
          );
        })}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className="ml-auto text-blue-600 hover:text-blue-700"
        data-testid="clear-selection"
      >
        Annuler la sélection
      </Button>
    </div>
  );
};

export default BulkActions;