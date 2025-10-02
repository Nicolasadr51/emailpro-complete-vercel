import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Plus, Type, Image, MousePointer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const EmailEditorSimple = () => {
  const navigate = useNavigate();
  const { designId } = useParams();
  const location = useLocation();
  
  const [emailDesign, setEmailDesign] = useState({
    name: `Design ${new Date().toLocaleDateString()}`,
    subject: '',
    preheader: '',
    blocks: []
  });
  
  const [selectedBlock, setSelectedBlock] = useState(null);

  // Logs de débogage
  useEffect(() => {
    console.log('EmailEditor Simple monté avec:', {
      designId,
      locationState: location.state,
      pathname: location.pathname
    });
  }, [designId, location]);

  const blockTypes = [
    { type: 'text', name: 'Texte', icon: Type, content: 'Votre texte ici...' },
    { type: 'image', name: 'Image', icon: Image, content: 'https://via.placeholder.com/400x200' },
    { type: 'button', name: 'Bouton', icon: MousePointer, content: 'Cliquez ici' }
  ];

  const addBlock = (blockType) => {
    const newBlock = {
      id: `block_${Date.now()}`,
      type: blockType.type,
      content: blockType.content,
      style: {
        padding: '10px',
        margin: '5px 0',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '4px'
      }
    };
    
    setEmailDesign(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  const updateBlock = (blockId, newContent) => {
    setEmailDesign(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId 
          ? { ...block, content: newContent }
          : block
      )
    }));
  };

  const deleteBlock = (blockId) => {
    setEmailDesign(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId)
    }));
    setSelectedBlock(null);
  };

  const renderBlock = (block) => {
    const isSelected = selectedBlock?.id === block.id;
    
    return (
      <div
        key={block.id}
        className={`relative p-4 border-2 cursor-pointer transition-all ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => setSelectedBlock(block)}
        style={block.style}
      >
        {block.type === 'text' && (
          <div className="prose">
            {isSelected ? (
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                className="w-full p-2 border rounded resize-none"
                rows={3}
              />
            ) : (
              <p>{block.content}</p>
            )}
          </div>
        )}
        
        {block.type === 'image' && (
          <div>
            {isSelected ? (
              <input
                type="url"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                placeholder="URL de l'image"
                className="w-full p-2 border rounded mb-2"
              />
            ) : null}
            <img 
              src={block.content} 
              alt="Email content" 
              className="max-w-full h-auto"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x200?text=Image+non+trouvée';
              }}
            />
          </div>
        )}
        
        {block.type === 'button' && (
          <div className="text-center">
            {isSelected ? (
              <input
                type="text"
                value={block.content}
                onChange={(e) => updateBlock(block.id, e.target.value)}
                className="p-2 border rounded mb-2"
              />
            ) : null}
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              {block.content}
            </button>
          </div>
        )}
        
        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteBlock(block.id);
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/templates')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour aux templates
            </Button>
            
            <Input
              value={emailDesign.name}
              onChange={(e) => setEmailDesign(prev => ({ ...prev, name: e.target.value }))}
              className="text-lg font-medium"
              placeholder="Nom du design"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Aperçu
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-1" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Palette de blocs */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Blocs disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {blockTypes.map((blockType) => {
                const IconComponent = blockType.icon;
                return (
                  <Button
                    key={blockType.type}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => addBlock(blockType)}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {blockType.name}
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Canvas principal */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <Input
                    placeholder="Objet de l'email"
                    value={emailDesign.subject}
                    onChange={(e) => setEmailDesign(prev => ({ ...prev, subject: e.target.value }))}
                  />
                  <Input
                    placeholder="Texte de prévisualisation"
                    value={emailDesign.preheader}
                    onChange={(e) => setEmailDesign(prev => ({ ...prev, preheader: e.target.value }))}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-96 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                  {emailDesign.blocks.length === 0 ? (
                    <div className="flex items-center justify-center h-96 text-gray-500">
                      <div className="text-center">
                        <Plus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Ajoutez des blocs pour commencer à créer votre email</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {emailDesign.blocks.map(renderBlock)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Panneau de propriétés */}
        {selectedBlock && (
          <div className="w-80 bg-white border-l border-gray-200 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Propriétés du bloc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-gray-600 capitalize">{selectedBlock.type}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Contenu</label>
                  <textarea
                    value={selectedBlock.content}
                    onChange={(e) => updateBlock(selectedBlock.id, e.target.value)}
                    className="w-full p-2 border rounded mt-1"
                    rows={4}
                  />
                </div>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteBlock(selectedBlock.id)}
                  className="w-full"
                >
                  Supprimer le bloc
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailEditorSimple;
