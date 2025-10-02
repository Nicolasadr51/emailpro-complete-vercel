import React, { useState, useEffect } from 'react';
import { X, Save, Send, Eye, Users, Calendar, Clock, Target, Settings, Image, Type, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { DatePicker } from '@/components/ui/date-picker';

const CampaignModal = ({ campaign, isOpen, onClose, onSave, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    preheader: '',
    fromName: 'EmailPro',
    fromEmail: 'noreply@emailpro.com',
    replyTo: '',
    templateId: '',
    contactLists: [],
    scheduledAt: null,
    isScheduled: false,
    trackOpens: true,
    trackClicks: true,
    enableAnalytics: true,
    content: {
      html: '',
      text: ''
    },
    settings: {
      timezone: 'Europe/Paris',
      sendRate: 100,
      retryFailed: true,
      unsubscribeLink: true
    }
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [previewMode, setPreviewMode] = useState('desktop');

  useEffect(() => {
    if (campaign && mode === 'edit') {
      setFormData({
        ...formData,
        ...campaign
      });
    }
  }, [campaign, mode]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleSendTest = () => {
    // Logique pour envoyer un email de test
    alert('Email de test envoyé !');
  };

  const handleSchedule = () => {
    if (formData.scheduledAt) {
      onSave({ ...formData, status: 'scheduled' });
      onClose();
    }
  };

  const handleSendNow = () => {
    onSave({ ...formData, status: 'sending', sentAt: new Date().toISOString() });
    onClose();
  };

  // Données simulées
  const availableTemplates = [
    { id: 'template-1', name: 'Newsletter Moderne', category: 'newsletter' },
    { id: 'template-2', name: 'Promotion E-commerce', category: 'promotional' },
    { id: 'template-3', name: 'Email Transactionnel', category: 'transactional' }
  ];

  const availableLists = [
    { id: 'list-1', name: 'Newsletter Subscribers', count: 1250 },
    { id: 'list-2', name: 'VIP Customers', count: 85 },
    { id: 'list-3', name: 'Prospects', count: 340 }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div>
            <h2 className="text-xl font-semibold">
              {mode === 'create' ? 'Nouvelle Campagne' : 'Modifier la Campagne'}
            </h2>
            <p className="text-gray-600 text-sm">
              {mode === 'create' ? 'Créez une nouvelle campagne email' : 'Modifiez les paramètres de votre campagne'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleSendTest}>
              <Send className="h-4 w-4 mr-2" />
              Test
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex h-[calc(95vh-140px)]">
          {/* Panneau de configuration */}
          <div className="w-1/2 border-r overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Général</TabsTrigger>
                <TabsTrigger value="content">Contenu</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Type className="h-5 w-5 mr-2" />
                      Informations de base
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom de la campagne *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Ex: Newsletter Octobre 2024"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Objet de l'email *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="Ex: Découvrez nos nouveautés d'octobre"
                      />
                    </div>

                    <div>
                      <Label htmlFor="preheader">Texte de prévisualisation</Label>
                      <Input
                        id="preheader"
                        value={formData.preheader}
                        onChange={(e) => setFormData({...formData, preheader: e.target.value})}
                        placeholder="Texte affiché dans l'aperçu de l'email"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fromName">Nom de l'expéditeur</Label>
                        <Input
                          id="fromName"
                          value={formData.fromName}
                          onChange={(e) => setFormData({...formData, fromName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fromEmail">Email de l'expéditeur</Label>
                        <Input
                          id="fromEmail"
                          type="email"
                          value={formData.fromEmail}
                          onChange={(e) => setFormData({...formData, fromEmail: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="replyTo">Email de réponse (optionnel)</Label>
                      <Input
                        id="replyTo"
                        type="email"
                        value={formData.replyTo}
                        onChange={(e) => setFormData({...formData, replyTo: e.target.value})}
                        placeholder="support@emailpro.com"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Planification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isScheduled"
                        checked={formData.isScheduled}
                        onCheckedChange={(checked) => setFormData({...formData, isScheduled: checked})}
                      />
                      <Label htmlFor="isScheduled">Programmer l'envoi</Label>
                    </div>

                    {formData.isScheduled && (
                      <div>
                        <Label>Date et heure d'envoi</Label>
                        <DatePicker
                          value={formData.scheduledAt}
                          onChange={(date) => setFormData({...formData, scheduledAt: date})}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="content" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Image className="h-5 w-5 mr-2" />
                      Template
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="template">Choisir un template</Label>
                      <Select
                        value={formData.templateId}
                        onValueChange={(value) => setFormData({...formData, templateId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un template" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTemplates.map((template) => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contenu personnalisé</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="htmlContent">Contenu HTML</Label>
                      <Textarea
                        id="htmlContent"
                        value={formData.content.html}
                        onChange={(e) => setFormData({
                          ...formData,
                          content: {...formData.content, html: e.target.value}
                        })}
                        rows={8}
                        placeholder="<html>...</html>"
                      />
                    </div>

                    <div>
                      <Label htmlFor="textContent">Version texte</Label>
                      <Textarea
                        id="textContent"
                        value={formData.content.text}
                        onChange={(e) => setFormData({
                          ...formData,
                          content: {...formData.content, text: e.target.value}
                        })}
                        rows={6}
                        placeholder="Version texte de votre email..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audience" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Listes de contacts
                    </CardTitle>
                    <CardDescription>
                      Sélectionnez les listes de contacts pour cette campagne
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {availableLists.map((list) => (
                        <div key={list.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={`list-${list.id}`}
                              checked={formData.contactLists.includes(list.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    contactLists: [...formData.contactLists, list.id]
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    contactLists: formData.contactLists.filter(id => id !== list.id)
                                  });
                                }
                              }}
                              className="rounded"
                            />
                            <div>
                              <Label htmlFor={`list-${list.id}`} className="font-medium">
                                {list.name}
                              </Label>
                              <p className="text-sm text-gray-500">{list.count} contacts</p>
                            </div>
                          </div>
                          <Badge variant="outline">{list.count}</Badge>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Total estimé:</strong> {
                          availableLists
                            .filter(list => formData.contactLists.includes(list.id))
                            .reduce((sum, list) => sum + list.count, 0)
                        } destinataires
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Suivi et analytiques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="trackOpens">Suivi des ouvertures</Label>
                        <p className="text-sm text-gray-500">Suivre quand les destinataires ouvrent l'email</p>
                      </div>
                      <Switch
                        id="trackOpens"
                        checked={formData.trackOpens}
                        onCheckedChange={(checked) => setFormData({...formData, trackOpens: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="trackClicks">Suivi des clics</Label>
                        <p className="text-sm text-gray-500">Suivre les clics sur les liens</p>
                      </div>
                      <Switch
                        id="trackClicks"
                        checked={formData.trackClicks}
                        onCheckedChange={(checked) => setFormData({...formData, trackClicks: checked})}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableAnalytics">Analytiques avancées</Label>
                        <p className="text-sm text-gray-500">Activer les rapports détaillés</p>
                      </div>
                      <Switch
                        id="enableAnalytics"
                        checked={formData.enableAnalytics}
                        onCheckedChange={(checked) => setFormData({...formData, enableAnalytics: checked})}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Paramètres d'envoi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Vitesse d'envoi (emails/heure)</Label>
                      <div className="mt-2">
                        <Slider
                          value={[formData.settings.sendRate]}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            settings: {...formData.settings, sendRate: value[0]}
                          })}
                          max={1000}
                          min={10}
                          step={10}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          {formData.settings.sendRate} emails par heure
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="timezone">Fuseau horaire</Label>
                      <Select
                        value={formData.settings.timezone}
                        onValueChange={(value) => setFormData({
                          ...formData,
                          settings: {...formData.settings, timezone: value}
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                          <SelectItem value="Europe/London">Europe/London</SelectItem>
                          <SelectItem value="America/New_York">America/New_York</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="retryFailed">Réessayer les échecs</Label>
                        <p className="text-sm text-gray-500">Réessayer automatiquement les envois échoués</p>
                      </div>
                      <Switch
                        id="retryFailed"
                        checked={formData.settings.retryFailed}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          settings: {...formData.settings, retryFailed: checked}
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Panneau de prévisualisation */}
          <div className="w-1/2 bg-gray-50">
            <div className="p-6 border-b bg-white">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Prévisualisation</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    Desktop
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    Mobile
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6 h-full overflow-y-auto">
              <div className={`mx-auto bg-white border rounded-lg shadow-sm ${
                previewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'
              }`}>
                {/* En-tête de l'email */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="text-sm">
                    <strong>De:</strong> {formData.fromName} &lt;{formData.fromEmail}&gt;
                  </div>
                  <div className="text-sm">
                    <strong>Objet:</strong> {formData.subject || 'Objet de l\'email'}
                  </div>
                  {formData.preheader && (
                    <div className="text-sm text-gray-600 mt-1">
                      {formData.preheader}
                    </div>
                  )}
                </div>

                {/* Contenu de l'email */}
                <div className="p-6">
                  {formData.content.html ? (
                    <div dangerouslySetInnerHTML={{ __html: formData.content.html }} />
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Sélectionnez un template ou ajoutez du contenu pour voir la prévisualisation</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de page avec actions */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {formData.contactLists.length > 0 && (
              <span>
                Sera envoyé à {
                  availableLists
                    .filter(list => formData.contactLists.includes(list.id))
                    .reduce((sum, list) => sum + list.count, 0)
                } destinataires
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            {formData.isScheduled ? (
              <Button onClick={handleSchedule} disabled={!formData.scheduledAt}>
                <Clock className="h-4 w-4 mr-2" />
                Programmer
              </Button>
            ) : (
              <Button onClick={handleSendNow}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer maintenant
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignModal;
