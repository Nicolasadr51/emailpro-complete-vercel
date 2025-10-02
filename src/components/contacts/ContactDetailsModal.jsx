import React, { useState, useEffect } from 'react';
import { X, Edit2, Save, Mail, Phone, Building, Tag, Calendar, Activity, MoreHorizontal, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ContactDetailsModal = ({ contact, isOpen, onClose, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState(contact || {});
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (contact) {
      setEditedContact(contact);
    }
  }, [contact]);

  if (!isOpen || !contact) return null;

  const handleSave = () => {
    onSave(editedContact);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContact(contact);
    setIsEditing(false);
  };

  const addTag = () => {
    if (newTag.trim() && !editedContact.tags?.includes(newTag.trim())) {
      setEditedContact({
        ...editedContact,
        tags: [...(editedContact.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setEditedContact({
      ...editedContact,
      tags: editedContact.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      unsubscribed: 'bg-red-100 text-red-800',
      bounced: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || colors.active;
  };

  // Données simulées pour l'historique des interactions
  const interactionHistory = [
    {
      id: 1,
      type: 'email_opened',
      campaign: 'Newsletter Septembre 2024',
      date: '2024-09-28T14:30:00Z',
      description: 'A ouvert l\'email de la newsletter'
    },
    {
      id: 2,
      type: 'email_clicked',
      campaign: 'Promotion Rentrée',
      date: '2024-09-25T10:15:00Z',
      description: 'A cliqué sur le lien principal'
    },
    {
      id: 3,
      type: 'subscribed',
      date: '2024-09-15T09:00:00Z',
      description: 'S\'est inscrit à la newsletter'
    }
  ];

  const campaignStats = {
    totalSent: 15,
    totalOpened: 12,
    totalClicked: 5,
    openRate: 80.0,
    clickRate: 33.3
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-blue-500 text-white">
                {getInitials(contact.firstName, contact.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                {contact.firstName} {contact.lastName}
              </h2>
              <p className="text-gray-600">{contact.email}</p>
            </div>
            <Badge className={getStatusColor(contact.status)}>
              {contact.status === 'active' ? 'Actif' : 
               contact.status === 'inactive' ? 'Inactif' :
               contact.status === 'unsubscribed' ? 'Désabonné' : 'Rebond'}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => onDelete(contact.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="details" className="p-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
              <TabsTrigger value="campaigns">Campagnes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations personnelles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        {isEditing ? (
                          <Input
                            id="firstName"
                            value={editedContact.firstName || ''}
                            onChange={(e) => setEditedContact({...editedContact, firstName: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm text-gray-900 mt-1">{contact.firstName || '-'}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        {isEditing ? (
                          <Input
                            id="lastName"
                            value={editedContact.lastName || ''}
                            onChange={(e) => setEditedContact({...editedContact, lastName: e.target.value})}
                          />
                        ) : (
                          <p className="text-sm text-gray-900 mt-1">{contact.lastName || '-'}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedContact.email || ''}
                          onChange={(e) => setEditedContact({...editedContact, email: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <p className="text-sm text-gray-900">{contact.email}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editedContact.phone || ''}
                          onChange={(e) => setEditedContact({...editedContact, phone: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <p className="text-sm text-gray-900">{contact.phone || '-'}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="company">Entreprise</Label>
                      {isEditing ? (
                        <Input
                          id="company"
                          value={editedContact.company || ''}
                          onChange={(e) => setEditedContact({...editedContact, company: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center mt-1">
                          <Building className="h-4 w-4 mr-2 text-gray-500" />
                          <p className="text-sm text-gray-900">{contact.company || '-'}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="status">Statut</Label>
                      {isEditing ? (
                        <Select
                          value={editedContact.status}
                          onValueChange={(value) => setEditedContact({...editedContact, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Actif</SelectItem>
                            <SelectItem value="inactive">Inactif</SelectItem>
                            <SelectItem value="unsubscribed">Désabonné</SelectItem>
                            <SelectItem value="bounced">Rebond</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={`${getStatusColor(contact.status)} mt-1`}>
                          {contact.status === 'active' ? 'Actif' : 
                           contact.status === 'inactive' ? 'Inactif' :
                           contact.status === 'unsubscribed' ? 'Désabonné' : 'Rebond'}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Tags et métadonnées */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Tag className="h-5 w-5 mr-2" />
                      Tags et métadonnées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(editedContact.tags || []).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center">
                            {tag}
                            {isEditing && (
                              <button
                                onClick={() => removeTag(tag)}
                                className="ml-1 text-gray-500 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {isEditing && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            placeholder="Nouveau tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          />
                          <Button onClick={addTag} size="sm">Ajouter</Button>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Date de création</Label>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <p className="text-sm text-gray-900">
                          {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label>Dernière activité</Label>
                      <div className="flex items-center mt-1">
                        <Activity className="h-4 w-4 mr-2 text-gray-500" />
                        <p className="text-sm text-gray-900">
                          {new Date(contact.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions d'édition */}
              {isEditing && (
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={handleCancel}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des interactions</CardTitle>
                  <CardDescription>
                    Toutes les interactions de ce contact avec vos campagnes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {interactionHistory.map((interaction) => (
                      <div key={interaction.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            interaction.type === 'email_opened' ? 'bg-blue-500' :
                            interaction.type === 'email_clicked' ? 'bg-green-500' :
                            'bg-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{interaction.description}</p>
                          {interaction.campaign && (
                            <p className="text-xs text-gray-500">Campagne: {interaction.campaign}</p>
                          )}
                          <p className="text-xs text-gray-400">
                            {new Date(interaction.date).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">{campaignStats.totalSent}</div>
                    <p className="text-xs text-gray-500">Emails envoyés</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">{campaignStats.totalOpened}</div>
                    <p className="text-xs text-gray-500">Emails ouverts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">{campaignStats.totalClicked}</div>
                    <p className="text-xs text-gray-500">Clics</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-orange-600">{campaignStats.openRate}%</div>
                    <p className="text-xs text-gray-500">Taux d'ouverture</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance par campagne</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Newsletter Septembre 2024</p>
                        <p className="text-sm text-gray-500">Envoyé le 28 sept. 2024</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800">Ouvert</Badge>
                        <p className="text-xs text-gray-500 mt-1">Cliqué 2 fois</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Promotion Rentrée</p>
                        <p className="text-sm text-gray-500">Envoyé le 25 sept. 2024</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-blue-100 text-blue-800">Ouvert</Badge>
                        <p className="text-xs text-gray-500 mt-1">Cliqué 1 fois</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsModal;
