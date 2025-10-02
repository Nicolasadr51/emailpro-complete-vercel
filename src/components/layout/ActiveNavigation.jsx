import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

const ActiveNavigation = ({ navigation }) => {
  const location = useLocation();
  
  const isActiveRoute = (itemHref, currentPath) => {
    // Cas spécial pour le dashboard
    if (itemHref === '/dashboard') {
      return currentPath === '/' || currentPath === '/dashboard';
    }
    
    // Cas spécial pour les statistiques
    if (itemHref === '/stats') {
      return currentPath === '/stats' || currentPath === '/statistics';
    }
    
    // Cas général - correspondance exacte
    return currentPath === itemHref;
  };

  return (
    <nav className="flex-1 p-4 space-y-1" data-testid="sidebar-navigation">
      {navigation.map((item) => {
        const IconComponent = LucideIcons[item.icon];
        const isActive = isActiveRoute(item.href, location.pathname);
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
            data-testid={`sidebar-nav-${item.label.toLowerCase().replace(' ', '-')}`}
          >
            {IconComponent && <IconComponent className="h-4 w-4" />}
            <span>{item.label}</span>

          </Link>
        );
      })}
    </nav>
  );
};

export default ActiveNavigation;
