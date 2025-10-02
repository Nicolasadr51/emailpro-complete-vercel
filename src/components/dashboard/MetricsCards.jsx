import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { METRICS_CONFIG } from '@/types/dashboard';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

const MetricsCards = ({ metrics, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" data-testid="metrics-cards">
      {METRICS_CONFIG.map((config) => {
        const metricData = metrics[config.key];
        const IconComponent = LucideIcons[config.icon];
        
        if (!metricData) return null;
        
        return (
          <Card 
            key={config.key} 
            className="hover:shadow-md transition-shadow duration-200"
            data-testid={`metric-card-${config.key}`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {IconComponent && (
                    <IconComponent className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  metricData.isPositive 
                    ? "text-green-700 bg-green-100" 
                    : "text-red-700 bg-red-100"
                )}>
                  {metricData.trend}
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-600">
                  {config.title}
                </h3>
                <p 
                  className="text-2xl font-bold text-gray-900"
                  data-testid={`metric-value-${config.key}`}
                >
                  {config.formatter(metricData.value)}
                </p>
                <p className="text-xs text-gray-500">
                  {metricData.trend} {metricData.label}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MetricsCards;