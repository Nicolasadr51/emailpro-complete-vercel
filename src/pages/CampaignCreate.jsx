import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CampaignStepper from '@/components/campaigns/CampaignStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { senderOptions } from '@/lib/campaignData';
import { validateCampaignStep1 } from '@/types/campaigns';

const CampaignCreate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Données du formulaire
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    preheader: '',
    sender: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const validation = validateCampaignStep1(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      setErrors({});
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Voulez-vous vraiment annuler ? Toutes les données non sauvegardées seront perdues.')) {
      navigate('/campaigns');
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Campagne sauvegardée en tant que brouillon !');
    setIsLoading(false);
    navigate('/campaigns');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card data-testid="step-1-content">
            <CardHeader>
              <CardTitle>Informations de la campagne</CardTitle>
              <CardDescription>
                Définissez les informations de base de votre campagne
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name">Nom de la campagne *</Label>
                <Input 
                  id="name"
                  placeholder="Ex: Newsletter Décembre 2024"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                  data-testid="campaign-name-input"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1" data-testid="name-error">
                    {errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="subject">Objet de l'email *</Label>
                <Input 
                  id="subject"
                  placeholder="Ex: Découvrez nos nouveautés de décembre"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className={`mt-1 ${errors.subject ? 'border-red-500' : ''}`}
                  data-testid="campaign-subject-input"
                />
                {errors.subject && (
                  <p className="text-sm text-red-600 mt-1" data-testid="subject-error">
                    {errors.subject}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Recommandé : 30-50 caractères ({formData.subject.length}/50)
                </p>
              </div>
              
              <div>
                <Label htmlFor="preheader">Pré-header (optionnel)</Label>
                <Input 
                  id="preheader"
                  placeholder="Texte d'aperçu affiché dans la boîte de réception"
                  value={formData.preheader}
                  onChange={(e) => handleInputChange('preheader', e.target.value)}
                  className={`mt-1 ${errors.preheader ? 'border-red-500' : ''}`}
                  data-testid="campaign-preheader-input"
                />
                {errors.preheader && (
                  <p className="text-sm text-red-600 mt-1" data-testid="preheader-error">
                    {errors.preheader}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Recommandé : 40-90 caractères ({formData.preheader.length}/90)
                </p>
              </div>
              
              <div>
                <Label htmlFor="sender">Expéditeur *</Label>
                <Select 
                  value={formData.sender} 
                  onValueChange={(value) => handleInputChange('sender', value)}
                >
                  <SelectTrigger 
                    className={`mt-1 ${errors.sender ? 'border-red-500' : ''}`}
                    data-testid="campaign-sender-select"
                  >
                    <SelectValue placeholder="Sélectionner un expéditeur" />
                  </SelectTrigger>
                  <SelectContent>
                    {senderOptions.map((sender) => (
                      <SelectItem key={sender.value} value={sender.value}>
                        {sender.label} &lt;{sender.email}&gt;
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sender && (
                  <p className="text-sm text-red-600 mt-1" data-testid="sender-error">
                    {errors.sender}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
        
      case 2:
        return (
          <Card data-testid="step-2-content">
            <CardHeader>
              <CardTitle>Sélection des destinataires</CardTitle>
              <CardDescription>
                Choisissez qui recevra votre campagne
              </CardDescription>
            </CardHeader>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">👥</div>
                <p>Sélection des destinataires - À implémenter</p>
              </div>
            </CardContent>
          </Card>
        );
        
      case 3:
        return (
          <Card data-testid="step-3-content">
            <CardHeader>
              <CardTitle>Contenu de la campagne</CardTitle>
              <CardDescription>
                Créez le contenu de votre email
              </CardDescription>
            </CardHeader>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">✉️</div>
                <p>Contenu et design - À implémenter</p>
              </div>
            </CardContent>
          </Card>
        );
        
      case 4:
        return (
          <Card data-testid="step-4-content">
            <CardHeader>
              <CardTitle>Programmation et envoi</CardTitle>
              <CardDescription>
                Définissez quand envoyer votre campagne
              </CardDescription>
            </CardHeader>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">📅</div>
                <p>Programmation et envoi - À implémenter</p>
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8" data-testid="campaign-create-page">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nouvelle Campagne</h1>
            <p className="text-gray-600 mt-1">Créez une nouvelle campagne d'emailing</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleCancel}
            data-testid="cancel-button"
          >
            Annuler
          </Button>
        </div>

        {/* Stepper */}
        <CampaignStepper currentStep={currentStep} />

        {/* Contenu de l'étape */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200" data-testid="step-navigation">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading}
              data-testid="save-draft-button"
            >
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder le brouillon'}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              data-testid="previous-button"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Précédent
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                data-testid="next-button"
              >
                Suivant
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  alert('Fonctionnalité à implémenter: Envoi de la campagne');
                }}
                className="bg-green-600 hover:bg-green-700"
                data-testid="send-button"
              >
                Envoyer la campagne
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampaignCreate;