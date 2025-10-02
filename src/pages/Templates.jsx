import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Copy, Trash2, MoreHorizontal, Layout, Mail, ShoppingCart, FileText, Star, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import DashboardLayout from '@/components/layout/DashboardLayout';

const TemplatesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Formulaire pour nouveau template
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: 'newsletter',
    tags: '',
    htmlContent: '',
    isPublic: false
  });

  // Templates par défaut pour la démo
  const [templates, setTemplates] = useState([
    {
      id: 'template-1',
      name: 'Newsletter Moderne',
      description: 'Template moderne pour newsletter avec design épuré',
      category: 'newsletter',
      tags: ['moderne', 'newsletter', 'épuré'],
      thumbnail: 'gradient-blue',
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'template-2',
      name: 'Promotion E-commerce',
      description: 'Template pour promotions et ventes e-commerce',
      category: 'promotional',
      tags: ['e-commerce', 'promotion', 'vente'],
      thumbnail: 'gradient-red',
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'template-3',
      name: 'Email Transactionnel',
      description: 'Template pour emails de confirmation et transactions',
      category: 'transactional',
      tags: ['transaction', 'confirmation', 'simple'],
      thumbnail: 'gradient-green',
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'template-4',
      name: 'Annonce Événement',
      description: 'Template pour annonces d\'événements et invitations',
      category: 'event',
      tags: ['événement', 'invitation', 'annonce'],
      thumbnail: 'gradient-purple',
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'template-5',
      name: 'Bienvenue Utilisateur',
      description: 'Template d\'accueil pour nouveaux utilisateurs',
      category: 'welcome',
      tags: ['bienvenue', 'onboarding', 'accueil'],
      thumbnail: 'gradient-orange',
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'template-6',
      name: 'Rapport Mensuel',
      description: 'Template pour rapports et analyses mensuelles',
      category: 'newsletter',
      tags: ['rapport', 'analyse', 'mensuel'],
      thumbnail: 'gradient-indigo',
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  // Fonctions de gestion
  const handleCreateTemplate = (e) => {
    e.preventDefault();
    const template = {
      id: `template-${Date.now()}`,
      ...newTemplate,
      tags: newTemplate.tags ? newTemplate.tags.split(',').map(tag => tag.trim()) : [],
      thumbnail: 'https://via.placeholder.com/300x400/6B7280/FFFFFF?text=New',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTemplates([...templates, template]);
    setNewTemplate({
      name: '',
      description: '',
      category: 'newsletter',
      tags: '',
      htmlContent: '',
      isPublic: false
    });
    setIsCreateDialogOpen(false);
  };

  const handlePreviewTemplate = (template) => {
    setPreviewTemplate(template);
    setIsPreviewDialogOpen(true);
  };

  const handleEditTemplate = (template) => {
    // Rediriger vers l'éditeur d'email avec l'ID du template
    console.log('Navigating to template editor:', template.id);
    navigate(`/email-editor/${template.id}`);
  };

  const handleDuplicateTemplate = (template) => {
    const duplicatedTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copie)`,
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTemplates([...templates, duplicatedTemplate]);
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      setTemplates(templates.filter(template => template.id !== templateId));
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      newsletter: Mail,
      promotional: ShoppingCart,
      transactional: FileText,
      event: Layout,
      welcome: Star
    };
    const Icon = icons[category] || Mail;
    return <Icon className="h-4 w-4" />;
  };

  const getCategoryBadge = (category) => {
    const categoryConfig = {
      newsletter: { label: 'Newsletter', variant: 'default' },
      promotional: { label: 'Promotion', variant: 'secondary' },
      transactional: { label: 'Transaction', variant: 'outline' },
      event: { label: 'Événement', variant: 'destructive' },
      welcome: { label: 'Bienvenue', variant: 'default' }
    };

    const config = categoryConfig[category] || { label: category, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGradientClass = (thumbnail) => {
    const gradients = {
      'gradient-blue': 'bg-gradient-to-br from-blue-500 to-blue-600',
      'gradient-red': 'bg-gradient-to-br from-red-500 to-red-600',
      'gradient-green': 'bg-gradient-to-br from-green-500 to-green-600',
      'gradient-purple': 'bg-gradient-to-br from-purple-500 to-purple-600',
      'gradient-orange': 'bg-gradient-to-br from-orange-500 to-orange-600',
      'gradient-indigo': 'bg-gradient-to-br from-indigo-500 to-indigo-600'
    };
    return gradients[thumbnail] || 'bg-gradient-to-br from-gray-500 to-gray-600';
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
            <p className="text-muted-foreground">
              Gérez vos modèles d'emails et créez de nouveaux designs
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau template
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau template</DialogTitle>
                  <DialogDescription>
                    Créez un nouveau modèle d'email personnalisé.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTemplate}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Nom *
                      </Label>
                      <Input
                        id="name"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={newTemplate.description}
                        onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                        className="col-span-3"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Catégorie
                      </Label>
                      <Select
                        value={newTemplate.category}
                        onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                          <SelectItem value="promotional">Promotion</SelectItem>
                          <SelectItem value="transactional">Transaction</SelectItem>
                          <SelectItem value="event">Événement</SelectItem>
                          <SelectItem value="welcome">Bienvenue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tags" className="text-right">
                        Tags
                      </Label>
                      <Input
                        id="tags"
                        value={newTemplate.tags}
                        onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
                        className="col-span-3"
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      Créer le template
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
              <Layout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredTemplates.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Newsletters</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {filteredTemplates.filter(t => t.category === 'newsletter').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promotions</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {filteredTemplates.filter(t => t.category === 'promotional').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publics</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {filteredTemplates.filter(t => t.isPublic).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et contrôles */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher des templates..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promotion</SelectItem>
                    <SelectItem value="transactional">Transaction</SelectItem>
                    <SelectItem value="event">Événement</SelectItem>
                    <SelectItem value="welcome">Bienvenue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ToggleGroup type="single" value={viewMode} onValueChange={setViewMode}>
                <ToggleGroupItem value="grid" aria-label="Vue grille">
                  <Grid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="Vue liste">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8">
                <Layout className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-muted-foreground">Aucun template</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Commencez par créer votre premier template.
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[3/4] relative">
                      <div
                        className={`w-full h-full flex items-center justify-center text-white font-semibold text-lg ${getGradientClass(template.thumbnail)}`}
                      >
                        {template.name.split(' ')[0]}
                      </div>
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePreviewTemplate(template)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Aperçu
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTemplate(template.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {template.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryBadge(template.category)}
                          {template.isPublic && (
                            <Badge variant="outline">Public</Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreviewTemplate(template)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Créé le {formatDate(template.createdAt)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-20 rounded flex-shrink-0 flex items-center justify-center text-white font-semibold ${getGradientClass(template.thumbnail)}`}>
                          {template.name.split(' ')[0].charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{template.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                {template.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                {getCategoryBadge(template.category)}
                                {template.isPublic && (
                                  <Badge variant="outline">Public</Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(template.createdAt)}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreviewTemplate(template)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditTemplate(template)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Dupliquer
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteTemplate(template.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog de prévisualisation */}
        <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Aperçu du template</DialogTitle>
              <DialogDescription>
                {previewTemplate?.name} - {previewTemplate?.description}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              {previewTemplate && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="bg-white border rounded-lg p-6 max-w-md mx-auto">
                    <div className="text-center">
                      <h2 className="text-xl font-bold mb-4">{previewTemplate.name}</h2>
                      <p className="text-gray-600 mb-6">{previewTemplate.description}</p>
                      <div className="space-y-4">
                        <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-gray-500">Contenu de l'email</span>
                        </div>
                        <div className="h-16 bg-blue-50 rounded flex items-center justify-center">
                          <span className="text-blue-600">Call to Action</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
                Fermer
              </Button>
              <Button onClick={() => handleEditTemplate(previewTemplate)}>
                Modifier ce template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TemplatesPage;
