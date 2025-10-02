import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download, Upload, Check, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CSVImportDropzone, 
  CSVPreviewTable, 
  ColumnMapping, 
  ValidationSummary 
} from '@/components/contacts/CSVImportComponents';
import api from '@/lib/api-mock';

const CSVImportPage = () => {
  const navigate = useNavigate();
  
  // States for wizard steps
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Mapping, 3: Validation, 4: Import, 5: Results
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Upload step
  const [uploadData, setUploadData] = useState(null);
  const [contactFields, setContactFields] = useState({});
  
  // Mapping step  
  const [columnMapping, setColumnMapping] = useState({});
  
  // Validation step
  const [validationData, setValidationData] = useState(null);
  const [duplicateAction, setDuplicateAction] = useState('skip');
  const [selectedList, setSelectedList] = useState('');
  const [contactLists, setContactLists] = useState([]);
  
  // Import results
  const [importResults, setImportResults] = useState(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load contact fields options
        const fieldsResponse = await api.contacts.getColumnOptions();
        if (fieldsResponse.success) {
          setContactFields(fieldsResponse.data.import_fields);
        }
        
        // Load contact lists
        const listsResponse = await api.contacts.getContactLists();
        if (listsResponse.success) {
          setContactLists(listsResponse.data);
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    };
    
    loadInitialData();
  }, []);

  const handleFileUploaded = async (file) => {
    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.contacts.uploadCSV(formData);
      
      if (response.success) {
        setUploadData(response.data);
        setColumnMapping(response.data.suggested_mapping || {});
        setCurrentStep(2);
      } else {
        setError(response.message || 'Erreur lors de l\'upload du fichier');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'upload du fichier');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMappingSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.contacts.previewCSV({
        file_id: uploadData.file_id,
        mapping: columnMapping,
        preview_only: true
      });
      
      if (response.success) {
        setValidationData(response);
        setCurrentStep(3);
      } else {
        setError(response.message || 'Erreur lors de la validation');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la validation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportSubmit = async () => {
    setIsLoading(true);
    setError('');
    setCurrentStep(4); // Show progress
    
    try {
      const response = await api.contacts.importCSV({
        file_id: uploadData.file_id,
        mapping: columnMapping,
        list_id: selectedList || undefined,
        duplicate_action: duplicateAction
      });
      
      if (response.success) {
        setImportResults(response.data);
        setCurrentStep(5);
      } else {
        setError(response.message || 'Erreur lors de l\'import');
        setCurrentStep(3); // Back to validation step
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'import');
      setCurrentStep(3); // Back to validation step
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUploadData(null);
    setColumnMapping({});
    setValidationData(null);
    setImportResults(null);
    setError('');
  };

  const canProceedToMapping = uploadData && Object.keys(columnMapping).some(key => columnMapping[key] === 'email');
  const canProceedToImport = validationData && validationData.data.valid_count > 0;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/contacts')}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Retour aux contacts
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Import CSV de Contacts</h1>
              <p className="text-gray-600">Importez vos contacts depuis un fichier CSV</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate('/contacts/export')}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {[
                { step: 1, title: 'Upload', icon: Upload },
                { step: 2, title: 'Mapping', icon: Upload },
                { step: 3, title: 'Validation', icon: Check },
                { step: 4, title: 'Import', icon: Upload },
                { step: 5, title: 'Résultats', icon: Check }
              ].map(({ step, title, icon: Icon }, index) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                        ${currentStep >= step
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                        }
                      `}
                    >
                      {currentStep > step ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span
                      className={`
                        mt-2 text-sm font-medium
                        ${currentStep >= step ? 'text-blue-600' : 'text-gray-500'}
                      `}
                    >
                      {title}
                    </span>
                  </div>
                  {index < 4 && (
                    <div
                      className={`
                        flex-1 h-0.5 mx-4 transition-colors
                        ${currentStep > step ? 'bg-blue-500' : 'bg-gray-300'}
                      `}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>1. Upload du fichier CSV</CardTitle>
            </CardHeader>
            <CardContent>
              <CSVImportDropzone
                onFileUploaded={handleFileUploaded}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && uploadData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>2. Correspondance des colonnes</CardTitle>
              </CardHeader>
              <CardContent>
                <ColumnMapping
                  headers={uploadData.headers || []}
                  suggestedMapping={uploadData.suggested_mapping || {}}
                  onMappingChange={setColumnMapping}
                  contactFields={contactFields}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prévisualisation des données</CardTitle>
              </CardHeader>
              <CardContent>
                <CSVPreviewTable
                  headers={uploadData.headers || []}
                  rows={uploadData.preview_rows || []}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Précédent
              </Button>
              <Button
                onClick={handleMappingSubmit}
                disabled={!canProceedToMapping || isLoading}
                className="flex items-center"
              >
                {isLoading && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />}
                Valider le mapping
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && validationData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>3. Validation des données</CardTitle>
              </CardHeader>
              <CardContent>
                <ValidationSummary
                  validCount={validationData.data.valid_count}
                  invalidCount={validationData.data.invalid_count}
                  duplicates={validationData.duplicates}
                  validRows={validationData.valid_rows}
                  invalidRows={validationData.invalid_rows}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Options d'import</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liste de destination (optionnel)
                  </label>
                  <Select value={selectedList} onValueChange={setSelectedList}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une liste" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucune liste spécifique</SelectItem>
                      {contactLists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name} ({list.contactCount} contacts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action pour les doublons
                  </label>
                  <Select value={duplicateAction} onValueChange={setDuplicateAction}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skip">Ignorer les doublons</SelectItem>
                      <SelectItem value="replace">Remplacer les données existantes</SelectItem>
                      <SelectItem value="merge">Fusionner les données</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Précédent
              </Button>
              <Button
                onClick={handleImportSubmit}
                disabled={!canProceedToImport || isLoading}
                className="flex items-center"
              >
                {isLoading && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />}
                Lancer l'import
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>4. Import en cours...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">
                  Import des contacts en cours
                </p>
                <p className="text-gray-600">
                  Veuillez patienter, cette opération peut prendre quelques instants...
                </p>
              </div>
              
              <Progress value={75} className="w-full" />
              
              <div className="text-center text-sm text-gray-500">
                Traitement des données...
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 5 && importResults && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Check className="h-6 w-6 text-green-500 mr-2" />
                  Import terminé avec succès !
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{importResults.total}</div>
                    <div className="text-sm text-gray-600">Total traités</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{importResults.imported}</div>
                    <div className="text-sm text-gray-600">Importés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{importResults.updated}</div>
                    <div className="text-sm text-gray-600">Mis à jour</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-600">{importResults.skipped}</div>
                    <div className="text-sm text-gray-600">Ignorés</div>
                  </div>
                </div>

                {importResults.errors && importResults.errors.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">
                          {importResults.errors.length} erreurs lors de l'import :
                        </p>
                        <div className="max-h-40 overflow-y-auto">
                          {importResults.errors.slice(0, 5).map((error, index) => (
                            <div key={index} className="text-sm bg-red-50 p-2 rounded mb-1">
                              Ligne {error.row}: {error.error}
                            </div>
                          ))}
                          {importResults.errors.length > 5 && (
                            <p className="text-sm text-gray-600">
                              ... et {importResults.errors.length - 5} autres erreurs
                            </p>
                          )}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate('/contacts')}>
                Voir les contacts
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Nouvel import
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CSVImportPage;