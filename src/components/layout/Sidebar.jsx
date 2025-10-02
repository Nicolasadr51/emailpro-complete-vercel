import React from 'react';
import { cn } from '@/lib/utils';
import { MAIN_NAVIGATION } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import ActiveNavigation from './ActiveNavigation';

const Sidebar = ({ isOpen, className }) => {
  
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-gray-50 border-r border-gray-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
      data-testid="main-sidebar"
    >
      <div className="flex flex-col h-full pt-16 md:pt-0">
        {/* Logo sur mobile - masqué sur desktop car déjà dans Header */}
        <div className="md:hidden flex items-center gap-2 p-6 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">EP</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">EmailPro</h1>
        </div>

        {/* Navigation */}
        <ActiveNavigation navigation={MAIN_NAVIGATION} />

        {/* Pied de sidebar */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-1">
              Besoin d'aide ?
            </h3>
            <p className="text-xs text-blue-700 mb-3">
              Contactez notre équipe support pour toute question.
            </p>
            <Button 
              size="sm" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              data-testid="sidebar-support-button"
            >
              Contacter le support
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;