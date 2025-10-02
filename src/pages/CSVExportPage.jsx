import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download, Filter, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api-mock';

const CSVExportPage = () => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactLists, setContactLists] = useState([]);
  
  // Export options
  const [selectedColumns, setSelectedColumns] = useState([
    'email', 'firstName', 'lastName', 'company', 'phone', 'status', 'createdAt'
  ]);
  const [filters, setFilters] = useState({
    status: '',
    listIds: [],
    tags: [],
    dateRange: { start: '', end: '' }
  });
  
  const availableColumns = [
    { id: 'email', label: 'Email', required: true },
    { id: 'firstName', label: 'Prénom' },
    { id: 'lastName', label: 'Nom de famille' },
    { id: 'company', label: 'Entreprise' },
    { id: 'phone', label: 'Téléphone' },
    { id: 'status', label: 'Statut' },
    { id: 'tags', label: 'Tags' },
    { id: 'customFields', label: 'Champs personnalisés' },
    { id: 'source', label: 'Source' },
    { id: 'createdAt', label: 'Date de création' },
    { id: 'listIds', label: 'Listes' }
  ];

  // Load contact lists
  useEffect(() => {
    const loadContactLists = async () => {
      try {
        const response = await api.contacts.getContactLists();
        if (response.success) {
          setContactLists(response.data);
        }
      } catch (err) {
        console.error('Error loading contact lists:', err);
      }
    };
    
    loadContactLists();
  }, []);

  const handleColumnToggle = (columnId) => {
    if (columnId === 'email') return; // Email is required
    
    setSelectedColumns(prev => 
      prev.includes(columnId)
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleListFilterToggle = (listId) => {
    setFilters(prev => ({
      ...prev,
      listIds: prev.listIds.includes(listId)
        ? prev.listIds.filter(id => id !== listId)
        : [...prev.listIds, listId]
    }));
  };

  const handleExport = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const exportRequest = {
        columns: selectedColumns,
        filters: {
          ...(filters.status && filters.status !== 'all' && { status: filters.status }),
          ...(filters.listIds.length > 0 && { listIds: filters.listIds }),
          ...(filters.tags.length > 0 && { tags: filters.tags }),
          ...(filters.dateRange.start || filters.dateRange.end) && {
            dateRange: {
              ...(filters.dateRange.start && { start: filters.dateRange.start }),
              ...(filters.dateRange.end && { end: filters.dateRange.end })
            }
          }
        },
        format: 'csv'
      };
      
      const blob = await api.contacts.exportCSV(exportRequest);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'export');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedListsCount = filters.listIds.length;
  const totalSelectedColumns = selectedColumns.length;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
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
              <h1 className="text-2xl font-bold text-gray-900">Export CSV de Contacts</h1>
              <p className="text-gray-600">Exportez vos contacts au format CSV</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => navigate('/contacts/import')}
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Importer
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Column Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Colonnes à exporter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Sélectionnez les colonnes que vous souhaitez inclure dans votre export CSV.
                L'email est toujours inclus.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableColumns.map((column) => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${column.id}`}
                      checked={selectedColumns.includes(column.id)}
                      onCheckedChange={() => handleColumnToggle(column.id)}
                      disabled={column.required}
                    />
                    <label
                      htmlFor={`column-${column.id}`}
                      className={`text-sm font-medium ${
                        column.required ? 'text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {column.label}
                      {column.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>{totalSelectedColumns}</strong> colonne(s) sélectionnée(s)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtres d'export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut des contacts
              </label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="unsubscribed">Désabonnés</SelectItem>
                  <SelectItem value="bounced">Rejetés</SelectItem>
                  <SelectItem value="complained">Plaintes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Lists filter */}
            {contactLists.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listes de contacts
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all-lists"
                      checked={filters.listIds.length === 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters(prev => ({ ...prev, listIds: [] }));
                        }
                      }}
                    />
                    <label htmlFor="all-lists" className="text-sm font-medium text-gray-900">
                      Toutes les listes
                    </label>
                  </div>
                  
                  {contactLists.map((list) => (
                    <div key={list.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`list-${list.id}`}
                        checked={filters.listIds.includes(list.id)}
                        onCheckedChange={() => handleListFilterToggle(list.id)}
                      />
                      <label htmlFor={`list-${list.id}`} className="text-sm text-gray-900">
                        {list.name}
                        <span className="text-gray-500 ml-1">({list.contactCount} contacts)</span>
                      </label>
                    </div>
                  ))}
                </div>
                
                {selectedListsCount > 0 && (
                  <div className="bg-green-50 p-2 rounded-md">
                    <p className="text-sm text-green-700">
                      <strong>{selectedListsCount}</strong> liste(s) sélectionnée(s)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Date range filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Période de création
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date de début</label>
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Date de fin</label>
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Summary & Action */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Prêt pour l'export</h3>
                <p className="text-sm text-gray-600">
                  {totalSelectedColumns} colonnes • 
                  {selectedListsCount > 0 ? ` ${selectedListsCount} listes` : ' Toutes les listes'} •
                  {filters.status ? ` Statut: ${filters.status}` : ' Tous les statuts'}
                </p>
              </div>
              
              <Button
                onClick={handleExport}
                disabled={isLoading || selectedColumns.length === 0}
                className="flex items-center"
              >
                {isLoading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Export en cours...' : 'Exporter CSV'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Help */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Aide</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Le fichier CSV sera téléchargé automatiquement une fois l'export terminé</p>
              <p>• L'email est toujours inclus dans l'export</p>
              <p>• Les tags et champs personnalisés sont formatés pour faciliter l'import</p>
              <p>• Vous pouvez filtrer par statut, listes ou période de création</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CSVExportPage;