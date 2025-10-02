import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { userProfile } from '@/lib/data';

const Header = ({ onToggleSidebar, isSidebarOpen }) => {
  const [notifications] = useState(3); // Simulé pour la démo
  const location = useLocation();

  const isActiveRoute = (itemHref) => {
    // Cas spécial pour le dashboard
    if (itemHref === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    
    // Cas spécial pour les statistiques
    if (itemHref === '/stats') {
      return location.pathname === '/stats' || location.pathname === '/statistics';
    }
    
    // Cas général - correspondance exacte
    return location.pathname === itemHref;
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between" data-testid="main-header">
      {/* Logo et navigation mobile */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onToggleSidebar}
          data-testid="mobile-menu-toggle"
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">EP</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900" data-testid="app-logo">EmailPro</h1>
        </div>
      </div>

      {/* Navigation principale - masquée sur mobile */}
      <nav className="hidden lg:flex items-center gap-6" data-testid="main-navigation">
        <Link 
          to="/dashboard" 
          className={isActiveRoute('/dashboard') 
            ? "text-blue-600 font-medium hover:text-blue-700 transition-colors" 
            : "text-gray-600 hover:text-gray-900 transition-colors"
          }
          data-testid="nav-dashboard"
        >
          Tableau de bord
        </Link>
        <Link 
          to="/campaigns" 
          className={isActiveRoute('/campaigns') 
            ? "text-blue-600 font-medium hover:text-blue-700 transition-colors" 
            : "text-gray-600 hover:text-gray-900 transition-colors"
          }
          data-testid="nav-campaigns"
        >
          Campagnes
        </Link>
        <Link 
          to="/contacts" 
          className={isActiveRoute('/contacts') 
            ? "text-blue-600 font-medium hover:text-blue-700 transition-colors" 
            : "text-gray-600 hover:text-gray-900 transition-colors"
          }
          data-testid="nav-contacts"
        >
          Contacts
        </Link>
        <Link 
          to="/templates" 
          className={isActiveRoute('/templates') 
            ? "text-blue-600 font-medium hover:text-blue-700 transition-colors" 
            : "text-gray-600 hover:text-gray-900 transition-colors"
          }
          data-testid="nav-templates"
        >
          Templates
        </Link>
        <Link 
          to="/stats" 
          className={isActiveRoute('/stats') 
            ? "text-blue-600 font-medium hover:text-blue-700 transition-colors" 
            : "text-gray-600 hover:text-gray-900 transition-colors"
          }
          data-testid="nav-stats"
        >
          Statistiques
        </Link>
      </nav>

      {/* Actions utilisateur */}
      <div className="flex items-center gap-3">
        {/* Recherche - masquée sur mobile */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="search-input"
          />
        </div>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          data-testid="notifications-button"
        >
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              data-testid="notification-badge"
            >
              {notifications}
            </Badge>
          )}
        </Button>

        {/* Profil utilisateur */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-2" data-testid="user-profile-button">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                  <p className="text-xs text-gray-500">{userProfile.role}</p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" data-testid="user-profile-menu">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userProfile.name}</p>
                <p className="text-xs text-gray-500">{userProfile.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="profile-menu-account">
              Mon compte
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="profile-menu-settings">
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuItem data-testid="profile-menu-support">
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" data-testid="profile-menu-logout">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;