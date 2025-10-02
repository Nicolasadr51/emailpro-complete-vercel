import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, User, Mail, Bell, Shield, Palette, 
  Globe, Database, Key, CreditCard, Users, Zap, Save, 
  Eye, EyeOff, Plus, Trash2, Edit2, Check, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import DashboardLayout from '@/components/layout/DashboardLayout';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    // Profil utilisateur
    profile: {
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie@emailpro.com',
      company: 'EmailPro',
      phone: '+33 1 23 45 67 89',
      timezone: 'Europe/Paris',
      language: 'fr'
    },
    
    // Configuration email
    email: {
      fromName: 'EmailPro',
      fromEmail: 'noreply@emailpro.com',
      replyToEmail: 'support@emailpro.com',
      trackingDomain: 'track.emailpro.com',
      unsubscribeText: 'Se désabonner de cette liste',
      footerText: '© 2024 EmailPro. Tous droits réservés.',
      enableDoubleOptin: true,
      enableUnsubscribeLink: true
    },
    
    // Notifications
    notifications: {
      emailReports: true,
      campaignAlerts: true,
      listGrowth: false,
      systemUpdates: true,
      weeklyDigest: true,
      realTimeAlerts: false
    },
    
    // Sécurité
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 60,
      ipWhitelist: [],
      apiAccess: true,
      webhookUrl: ''
    },
    
    // Apparence
    appearance: {
      theme: 'light',
      primaryColor: '#3B82F6',
      compactMode: false,
      showAnimations: true
    },
    
    // Intégrations
    integrations: {
      googleAnalytics: '',
      facebookPixel: '',
      zapierWebhook: '',
      slackWebhook: ''
    }
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState('');
  const [isEditing, setIsEditing] = useState({});

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Simuler la sauvegarde
    alert('Paramètres sauvegardés avec succès !');
  };

  const addIpAddress = () => {
    if (newIpAddress.trim()) {
      handleSettingChange('security', 'ipWhitelist', [
        ...settings.security.ipWhitelist,
        newIpAddress.trim()
      ]);
      setNewIpAddress('');
    }
  };

  const removeIpAddress = (index) => {
    const newList = settings.security.ipWhitelist.filter((_, i) => i !== index);
    handleSettingChange('security', 'ipWhitelist', newList);
  };

  const generateApiKey = () => {
    const newKey = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    alert(`Nouvelle clé API générée: ${newKey}`);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-6xl">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
            <p className="text-muted-foreground">
              Gérez vos préférences et la configuration de votre compte
            </p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Apparence
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Intégrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={settings.profile.firstName}
                      onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={settings.profile.lastName}
                      onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Entreprise</Label>
                    <Input
                      id="company"
                      value={settings.profile.company}
                      onChange={(e) => handleSettingChange('profile', 'company', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={settings.profile.phone}
                      onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select
                      value={settings.profile.timezone}
                      onValueChange={(value) => handleSettingChange('profile', 'timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <Select
                      value={settings.profile.language}
                      onValueChange={(value) => handleSettingChange('profile', 'language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration par défaut</CardTitle>
                <CardDescription>
                  Paramètres par défaut pour vos campagnes email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromName">Nom de l'expéditeur</Label>
                    <Input
                      id="fromName"
                      value={settings.email.fromName}
                      onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromEmail">Email de l'expéditeur</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="replyToEmail">Email de réponse</Label>
                  <Input
                    id="replyToEmail"
                    type="email"
                    value={settings.email.replyToEmail}
                    onChange={(e) => handleSettingChange('email', 'replyToEmail', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="trackingDomain">Domaine de tracking</Label>
                  <Input
                    id="trackingDomain"
                    value={settings.email.trackingDomain}
                    onChange={(e) => handleSettingChange('email', 'trackingDomain', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="footerText">Texte de pied de page</Label>
                  <Textarea
                    id="footerText"
                    value={settings.email.footerText}
                    onChange={(e) => handleSettingChange('email', 'footerText', e.target.value)}
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableDoubleOptin">Double opt-in</Label>
                      <p className="text-sm text-gray-500">Demander confirmation avant inscription</p>
                    </div>
                    <Switch
                      id="enableDoubleOptin"
                      checked={settings.email.enableDoubleOptin}
                      onCheckedChange={(checked) => handleSettingChange('email', 'enableDoubleOptin', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enableUnsubscribeLink">Lien de désabonnement</Label>
                      <p className="text-sm text-gray-500">Inclure automatiquement le lien de désabonnement</p>
                    </div>
                    <Switch
                      id="enableUnsubscribeLink"
                      checked={settings.email.enableUnsubscribeLink}
                      onCheckedChange={(checked) => handleSettingChange('email', 'enableUnsubscribeLink', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>
                  Choisissez les notifications que vous souhaitez recevoir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailReports">Rapports par email</Label>
                      <p className="text-sm text-gray-500">Recevoir les rapports de campagne par email</p>
                    </div>
                    <Switch
                      id="emailReports"
                      checked={settings.notifications.emailReports}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'emailReports', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="campaignAlerts">Alertes de campagne</Label>
                      <p className="text-sm text-gray-500">Notifications pour les événements de campagne</p>
                    </div>
                    <Switch
                      id="campaignAlerts"
                      checked={settings.notifications.campaignAlerts}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'campaignAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="listGrowth">Croissance des listes</Label>
                      <p className="text-sm text-gray-500">Notifications sur la croissance de vos listes</p>
                    </div>
                    <Switch
                      id="listGrowth"
                      checked={settings.notifications.listGrowth}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'listGrowth', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="systemUpdates">Mises à jour système</Label>
                      <p className="text-sm text-gray-500">Notifications sur les nouvelles fonctionnalités</p>
                    </div>
                    <Switch
                      id="systemUpdates"
                      checked={settings.notifications.systemUpdates}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'systemUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyDigest">Résumé hebdomadaire</Label>
                      <p className="text-sm text-gray-500">Résumé des performances de la semaine</p>
                    </div>
                    <Switch
                      id="weeklyDigest"
                      checked={settings.notifications.weeklyDigest}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'weeklyDigest', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="realTimeAlerts">Alertes temps réel</Label>
                      <p className="text-sm text-gray-500">Notifications instantanées pour les événements critiques</p>
                    </div>
                    <Switch
                      id="realTimeAlerts"
                      checked={settings.notifications.realTimeAlerts}
                      onCheckedChange={(checked) => handleSettingChange('notifications', 'realTimeAlerts', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentification</CardTitle>
                <CardDescription>
                  Paramètres de sécurité et d'authentification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorEnabled">Authentification à deux facteurs</Label>
                    <p className="text-sm text-gray-500">Ajouter une couche de sécurité supplémentaire</p>
                  </div>
                  <Switch
                    id="twoFactorEnabled"
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorEnabled', checked)}
                  />
                </div>

                <div>
                  <Label>Timeout de session (minutes)</Label>
                  <div className="mt-2">
                    <Slider
                      value={[settings.security.sessionTimeout]}
                      onValueChange={(value) => handleSettingChange('security', 'sessionTimeout', value[0])}
                      max={240}
                      min={15}
                      step={15}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {settings.security.sessionTimeout} minutes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accès API</CardTitle>
                <CardDescription>
                  Gérez vos clés API et les accès
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="apiAccess">Accès API activé</Label>
                    <p className="text-sm text-gray-500">Permettre l'accès via API</p>
                  </div>
                  <Switch
                    id="apiAccess"
                    checked={settings.security.apiAccess}
                    onCheckedChange={(checked) => handleSettingChange('security', 'apiAccess', checked)}
                  />
                </div>

                <div>
                  <Label>Clé API</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value="sk_1234567890abcdef"
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={generateApiKey}>
                      Régénérer
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Adresses IP autorisées</Label>
                  <div className="space-y-2 mt-2">
                    {settings.security.ipWhitelist.map((ip, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input value={ip} readOnly className="font-mono" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeIpAddress(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="192.168.1.1"
                        value={newIpAddress}
                        onChange={(e) => setNewIpAddress(e.target.value)}
                        className="font-mono"
                      />
                      <Button onClick={addIpAddress}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thème et apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de votre interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="theme">Thème</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) => handleSettingChange('appearance', 'theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="auto">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input
                      type="color"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.appearance.primaryColor}
                      onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compactMode">Mode compact</Label>
                    <p className="text-sm text-gray-500">Interface plus dense avec moins d'espacement</p>
                  </div>
                  <Switch
                    id="compactMode"
                    checked={settings.appearance.compactMode}
                    onCheckedChange={(checked) => handleSettingChange('appearance', 'compactMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showAnimations">Animations</Label>
                    <p className="text-sm text-gray-500">Activer les animations et transitions</p>
                  </div>
                  <Switch
                    id="showAnimations"
                    checked={settings.appearance.showAnimations}
                    onCheckedChange={(checked) => handleSettingChange('appearance', 'showAnimations', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Intégrations tierces</CardTitle>
                <CardDescription>
                  Connectez EmailPro avec vos outils préférés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                  <Input
                    id="googleAnalytics"
                    placeholder="GA-XXXXXXXXX-X"
                    value={settings.integrations.googleAnalytics}
                    onChange={(e) => handleSettingChange('integrations', 'googleAnalytics', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                  <Input
                    id="facebookPixel"
                    placeholder="123456789012345"
                    value={settings.integrations.facebookPixel}
                    onChange={(e) => handleSettingChange('integrations', 'facebookPixel', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="zapierWebhook">Zapier Webhook URL</Label>
                  <Input
                    id="zapierWebhook"
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    value={settings.integrations.zapierWebhook}
                    onChange={(e) => handleSettingChange('integrations', 'zapierWebhook', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
                  <Input
                    id="slackWebhook"
                    placeholder="https://hooks.slack.com/services/..."
                    value={settings.integrations.slackWebhook}
                    onChange={(e) => handleSettingChange('integrations', 'slackWebhook', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>
                  Configurez des webhooks pour recevoir des notifications en temps réel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="webhookUrl">URL du webhook</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://votre-site.com/webhook"
                    value={settings.security.webhookUrl}
                    onChange={(e) => handleSettingChange('security', 'webhookUrl', e.target.value)}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Événements disponibles</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Badge variant="outline">campaign.sent</Badge>
                    <Badge variant="outline">email.opened</Badge>
                    <Badge variant="outline">email.clicked</Badge>
                    <Badge variant="outline">contact.subscribed</Badge>
                    <Badge variant="outline">contact.unsubscribed</Badge>
                    <Badge variant="outline">email.bounced</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
