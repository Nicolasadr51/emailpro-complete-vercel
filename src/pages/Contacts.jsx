import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Upload, MoreHorizontal, Edit, Trash2, Mail, UserPlus, Users, UserX, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardLayout from '@/components/layout/DashboardLayout';

const ContactsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [currentTab, setCurrentTab] = useState('all');

  // Données simulées pour les contacts
  const [contacts, setContacts] = useState([
    {
      id: '1',
      email: 'jean.dupont@example.com',
      firstName: 'Jean',
      lastName: 'Dupont',
      company: 'Tech Corp',
      phone: '+33 1 23 45 67 89',
      status: 'active',
      tags: ['vip', 'newsletter'],
      createdAt: '2024-09-15T10:00:00Z'
    },
    {
      id: '2',
      email: 'marie.martin@example.com',
      firstName: 'Marie',
      lastName: 'Martin',
      company: 'Design Studio',
      phone: '+33 1 98 76 54 32',
      status: 'active',
      tags: ['client', 'design'],
      createdAt: '2024-09-14T14:30:00Z'
    },
    {
      id: '3',
      email: 'pierre.bernard@example.com',
      firstName: 'Pierre',
      lastName: 'Bernard',
      company: 'Marketing Plus',
      phone: '+33 1 11 22 33 44',
      status: 'unsubscribed',
      tags: ['prospect'],
      createdAt: '2024-09-13T09:15:00Z'
    }
  ]);

  // Formulaire pour nouveau contact
  const [newContact, setNewContact] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    tags: '',
    customFields: {}
  });

  // Statistiques calculées
  const stats = {
    total: contacts.length,
    active: contacts.filter(c => c.status === 'active').length,
    unsubscribed: contacts.filter(c => c.status === 'unsubscribed').length,
    bounced: contacts.filter(c => c.status === 'bounced').length
  };

  // Fonctions de gestion
  const handleCreateContact = (e) => {
    e.preventDefault();
    const contact = {
      id: Date.now().toString(),
      ...newContact,
      status: 'active',
      tags: newContact.tags ? newContact.tags.split(',').map(tag => tag.trim()) : [],
      createdAt: new Date().toISOString()
    };
    
    setContacts([...contacts, contact]);
    setNewContact({
      email: '',
      firstName: '',
      lastName: '',
      company: '',
      phone: '',
      tags: '',
      customFields: {}
    });
    setIsCreateDialogOpen(false);
  };

  const handleEditContact = (contact) => {
    setEditingContact({
      ...contact,
      tags: contact.tags ? contact.tags.join(', ') : ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateContact = (e) => {
    e.preventDefault();
    const updatedContacts = contacts.map(contact => 
      contact.id === editingContact.id 
        ? {
            ...editingContact,
            tags: editingContact.tags ? editingContact.tags.split(',').map(tag => tag.trim()) : []
          }
        : contact
    );
    
    setContacts(updatedContacts);
    setIsEditDialogOpen(false);
    setEditingContact(null);
  };

  const handleDeleteContact = (contactId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      setContacts(contacts.filter(contact => contact.id !== contactId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Actif', variant: 'success' },
      unsubscribed: { label: 'Désabonné', variant: 'secondary' },
      bounced: { label: 'Rebond', variant: 'destructive' },
      complained: { label: 'Plainte', variant: 'destructive' }
    };

    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filtrage des contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchTerm || 
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
            <p className="text-muted-foreground">
              Gérez votre base de contacts et leurs informations
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau contact
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Créer un nouveau contact</DialogTitle>
                  <DialogDescription>
                    Ajoutez un nouveau contact à votre base de données.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateContact}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="email" className="text-right">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={newContact.email}
                        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="firstName" className="text-right">
                        Prénom
                      </Label>
                      <Input
                        id="firstName"
                        value={newContact.firstName}
                        onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="lastName" className="text-right">
                        Nom
                      </Label>
                      <Input
                        id="lastName"
                        value={newContact.lastName}
                        onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="company" className="text-right">
                        Entreprise
                      </Label>
                      <Input
                        id="company"
                        value={newContact.company}
                        onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tags" className="text-right">
                        Tags
                      </Label>
                      <Input
                        id="tags"
                        value={newContact.tags}
                        onChange={(e) => setNewContact({ ...newContact, tags: e.target.value })}
                        className="col-span-3"
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      Créer le contact
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
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contacts Actifs</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Désabonnés</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.unsubscribed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rebonds</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.bounced}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, email..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="unsubscribed">Désabonnés</SelectItem>
                  <SelectItem value="bounced">Rebonds</SelectItem>
                  <SelectItem value="complained">Plaintes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredContacts.length === 0 ? (
              <div className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-muted-foreground">Aucun contact</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Commencez par ajouter votre premier contact.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Ajouté le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {contact.firstName} {contact.lastName}
                        </div>
                        {contact.company && (
                          <div className="text-sm text-muted-foreground">
                            {contact.company}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{getStatusBadge(contact.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contact.tags?.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{contact.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(contact.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditContact(contact)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Envoyer email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteContact(contact.id)}
                              className="text-red-600"
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
            )}
          </CardContent>
        </Card>

        {/* Dialog d'édition */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Modifier le contact</DialogTitle>
              <DialogDescription>
                Modifiez les informations du contact.
              </DialogDescription>
            </DialogHeader>
            {editingContact && (
              <form onSubmit={handleUpdateContact}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-email" className="text-right">
                      Email *
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingContact.email}
                      onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-firstName" className="text-right">
                      Prénom
                    </Label>
                    <Input
                      id="edit-firstName"
                      value={editingContact.firstName || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, firstName: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-lastName" className="text-right">
                      Nom
                    </Label>
                    <Input
                      id="edit-lastName"
                      value={editingContact.lastName || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, lastName: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-company" className="text-right">
                      Entreprise
                    </Label>
                    <Input
                      id="edit-company"
                      value={editingContact.company || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, company: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-phone" className="text-right">
                      Téléphone
                    </Label>
                    <Input
                      id="edit-phone"
                      value={editingContact.phone || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-tags" className="text-right">
                      Tags
                    </Label>
                    <Input
                      id="edit-tags"
                      value={editingContact.tags || ''}
                      onChange={(e) => setEditingContact({ ...editingContact, tags: e.target.value })}
                      className="col-span-3"
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    Mettre à jour
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ContactsPage;
