import React, { useState, useEffect } from 'react';
import { Eye, Code, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import api from '@/lib/api-mock';

const PreviewPanel = ({ blocks, emailDesign, previewMode }) => {
  const [renderedEmail, setRenderedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [testVariables, setTestVariables] = useState({
    firstName: 'Jean',
    lastName: 'Dupont',
    company_name: 'EmailPro',
    newsletter_title: 'Newsletter de test',
    newsletter_content: 'Ceci est un exemple de contenu de newsletter.',
    cta_text: 'En savoir plus',
    cta_url: 'https://example.com',
    company_address: '123 Rue de la Tech, 75001 Paris',
    unsubscribe_url: 'https://example.com/unsubscribe'
  });

  useEffect(() => {
    if (emailDesign && emailDesign.id) {
      renderEmailPreview();
    }
  }, [blocks, emailDesign, testVariables, previewMode]);

  const renderEmailPreview = async () => {
    if (!emailDesign || !emailDesign.id) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.emailEditor.renderEmail({
        designId: emailDesign.id,
        variables: testVariables,
        previewMode: previewMode
      });
      
      if (response.success) {
        setRenderedEmail(response.data);
      } else {
        setError('Erreur lors du rendu de l\'email');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du rendu');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Génération de la prévisualisation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-600 text-center">{error}</p>
        <Button onClick={renderEmailPreview} className="mt-4">
          Réessayer
        </Button>
      </div>
    );
  }

  if (!renderedEmail) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Eye className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500">Aucune prévisualisation disponible</p>
        <p className="text-gray-400 text-sm mt-2">Ajoutez des blocs à votre design pour voir la prévisualisation</p>
      </div>
    );
  }

  const canvasWidth = previewMode === 'mobile' ? '320px' : '600px';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          Prévisualisation - {emailDesign?.name || 'Design'}
        </h3>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          {previewMode === 'mobile' ? (
            <>
              <Smartphone className="w-4 h-4" />
              <span>Vue mobile (320px)</span>
            </>
          ) : (
            <>
              <Monitor className="w-4 h-4" />
              <span>Vue desktop (600px)</span>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Prévisualisation</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="text">Texte</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preview" className="space-y-4">
          {/* Email metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations de l'email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-medium">Sujet:</span> {renderedEmail.subject || 'Aucun sujet'}
              </div>
              {renderedEmail.preheader && (
                <div>
                  <span className="font-medium">Preheader:</span> {renderedEmail.preheader}
                </div>
              )}
              <div className="text-sm text-gray-500">
                Variables utilisées: {renderedEmail.variables_used.join(', ') || 'Aucune'}
              </div>
            </CardContent>
          </Card>

          {/* Email preview */}
          <div className="flex justify-center">
            <div 
              className="bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden"
              style={{ width: canvasWidth, maxWidth: '100%' }}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: renderedEmail.html }}
                className="email-preview"
              />
            </div>
          </div>

          {/* Test variables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Variables de test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(testVariables).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-gray-700">
                      {key}:
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setTestVariables(prev => ({
                        ...prev,
                        [key]: e.target.value
                      }))}
                      className="mt-1 w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                ))}
              </div>
              <Button 
                onClick={renderEmailPreview}
                size="sm"
                className="mt-4"
              >
                Actualiser la prévisualisation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="html" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Code className="w-4 h-4 mr-2" />
                Code HTML généré
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto">
                <code>{renderedEmail.html}</code>
              </pre>
              <div className="mt-4 flex space-x-2">
                <Button 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(renderedEmail.html);
                    alert('HTML copié dans le presse-papier');
                  }}
                >
                  Copier HTML
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([renderedEmail.html], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${emailDesign?.name || 'email'}.html`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Télécharger HTML
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Version texte</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap">{renderedEmail.text}</pre>
              </div>
              <Button 
                size="sm"
                className="mt-4"
                onClick={() => {
                  navigator.clipboard.writeText(renderedEmail.text);
                  alert('Texte copié dans le presse-papier');
                }}
              >
                Copier texte
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <style jsx>{`
        .email-preview {
          font-family: Arial, sans-serif;
        }
        .email-preview table {
          width: 100%;
        }
        .email-preview img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
    </div>
  );
};

export default PreviewPanel;