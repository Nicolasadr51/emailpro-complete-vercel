import React from 'react';
import { ChevronRight } from 'lucide-react';
import { CAMPAIGN_CREATION_STEPS } from '@/types/campaigns';
import { cn } from '@/lib/utils';

const CampaignStepper = ({ currentStep = 1 }) => {
  return (
    <div className="mb-8" data-testid="campaign-stepper">
      <nav className="flex items-center justify-center">
        <ol className="flex items-center space-x-4">
          {CAMPAIGN_CREATION_STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const isUpcoming = step.id > currentStep;
            
            return (
              <React.Fragment key={step.id}>
                <li className="flex items-center" data-testid={`step-${step.id}`}>
                  <span 
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                      isActive && "bg-blue-500 text-white",
                      isCompleted && "bg-green-500 text-white",
                      isUpcoming && "bg-gray-200 text-gray-600"
                    )}
                  >
                    {step.id}
                  </span>
                  <span 
                    className={cn(
                      "ml-2 text-sm font-medium transition-colors",
                      isActive && "text-blue-600",
                      isCompleted && "text-green-600", 
                      isUpcoming && "text-gray-500"
                    )}
                  >
                    {step.name}
                  </span>
                </li>
                {index < CAMPAIGN_CREATION_STEPS.length - 1 && (
                  <ChevronRight className="text-gray-400 h-4 w-4" />
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default CampaignStepper;