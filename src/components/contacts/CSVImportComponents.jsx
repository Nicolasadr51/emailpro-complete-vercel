import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api-mock';

const CSVImportDropzone = ({ onFileUploaded, isLoading }) => {
  const [dragError, setDragError] = useState('');

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    setDragError('');
    
    if (rejectedFiles.length > 0) {
      setDragError('Seuls les fichiers CSV sont acceptés');
      return;
    }

    if (acceptedFiles.length === 0) {
      setDragError('Aucun fichier valide sélectionné');
      return;
    }

    const file = acceptedFiles[0];
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setDragError('Le fichier est trop volumineux (max 10MB)');
      return;
    }

    try {
      await onFileUploaded(file);
    } catch (error) {
      setDragError(error.message || 'Erreur lors de l\'upload du fichier');
    }
  }, [onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <Card className="border-2 border-dashed">
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={`
            flex flex-col items-center justify-center text-center cursor-pointer transition-colors
            ${isDragActive ? 'bg-blue-50 border-blue-300' : ''}
            ${isDragReject ? 'bg-red-50 border-red-300' : ''}
            ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="mb-4">
            {isLoading ? (
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full" />
            ) : (
              <Upload className={`w-12 h-12 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            )}
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isLoading ? 'Upload en cours...' : 'Glissez votre fichier CSV ici'}
          </h3>
          
          <p className="text-gray-600 mb-4">
            ou <span className="text-blue-500 font-medium">cliquez pour sélectionner</span>
          </p>
          
          <div className="text-sm text-gray-500">
            <p>Format accepté: CSV (max 10MB)</p>
            <p>Exemple: email, prénom, nom, entreprise...</p>
          </div>
          
          {dragError && (
            <Alert className="mt-4 max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-600">
                {dragError}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CSVPreviewTable = ({ headers, rows, className = '' }) => {
  if (!headers || !rows || rows.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        Aucune donnée à afficher
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 border-r border-gray-300 text-left text-sm font-medium text-gray-900"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 10).map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {headers.map((header, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-2 border-r border-gray-300 text-sm text-gray-900"
                >
                  {row[header] || ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {rows.length > 10 && (
        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 border-t">
          ... et {rows.length - 10} autres lignes
        </div>
      )}
    </div>
  );
};

const ColumnMapping = ({ headers, suggestedMapping, onMappingChange, contactFields }) => {
  const [mapping, setMapping] = useState(suggestedMapping || {});

  const handleMappingChange = (csvColumn, contactField) => {
    const newMapping = { ...mapping };
    
    if (contactField === '') {
      delete newMapping[csvColumn];
    } else {
      newMapping[csvColumn] = contactField;
    }
    
    setMapping(newMapping);
    onMappingChange(newMapping);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Correspondance des colonnes</h3>
      <p className="text-sm text-gray-600">
        Associez chaque colonne de votre fichier CSV avec les champs de contact correspondants.
        L'email est obligatoire.
      </p>
      
      <div className="grid gap-4">
        {headers.map((header) => (
          <div key={header} className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                {header}
                {mapping[header] === 'email' && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>
            </div>
            
            <div className="flex-1">
              <select
                value={mapping[header] || ''}
                onChange={(e) => handleMappingChange(header, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Ignorer cette colonne --</option>
                {Object.entries(contactFields).map(([field, label]) => (
                  <option key={field} value={field}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-400" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">
              Conseils pour un import réussi
            </h4>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>L'email est obligatoire pour chaque contact</li>
                <li>Les doublons seront détectés automatiquement</li>
                <li>Les données invalides seront signalées avant l'import</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ValidationSummary = ({ validCount, invalidCount, duplicates, validRows, invalidRows }) => {
  const totalRows = validCount + invalidCount;
  
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Résumé de validation</h3>
      
      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{totalRows}</div>
            <div className="text-sm text-gray-600">Total lignes</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{validCount}</div>
            <div className="text-sm text-gray-600">Valides</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{invalidCount}</div>
            <div className="text-sm text-gray-600">Erreurs</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {(duplicates?.database?.length || 0) + (duplicates?.internal?.length || 0)}
            </div>
            <div className="text-sm text-gray-600">Doublons</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Invalid rows details */}
      {invalidCount > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                {invalidCount} lignes contiennent des erreurs et ne seront pas importées :
              </p>
              <div className="max-h-40 overflow-y-auto">
                {invalidRows.slice(0, 10).map((row, index) => (
                  <div key={index} className="text-sm bg-red-50 p-2 rounded mb-1">
                    <strong>Ligne {row.row_number}:</strong> {row.errors.join(', ')}
                  </div>
                ))}
                {invalidRows.length > 10 && (
                  <p className="text-sm text-gray-600">
                    ... et {invalidRows.length - 10} autres erreurs
                  </p>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Duplicates warning */}
      {duplicates && (duplicates.database?.length > 0 || duplicates.internal?.length > 0) && (
        <Alert>
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium text-yellow-700">Doublons détectés :</p>
              {duplicates.database?.length > 0 && (
                <p className="text-sm text-yellow-700">
                  • {duplicates.database.length} emails existent déjà dans la base de données
                </p>
              )}
              {duplicates.internal?.length > 0 && (
                <p className="text-sm text-yellow-700">
                  • {duplicates.internal.length} doublons dans le fichier CSV
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export { CSVImportDropzone, CSVPreviewTable, ColumnMapping, ValidationSummary };