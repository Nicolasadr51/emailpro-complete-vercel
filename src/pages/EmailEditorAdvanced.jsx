import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ArrowLeft, Save, Eye, Undo, Redo, ZoomIn, ZoomOut, Moon, Sun,
  Type, Image, MousePointer, Minus, Columns, Video, Code, Share2,
  Smartphone, Monitor, Tablet, Download, Upload, Copy, Trash2,
  Settings, Palette, Grid, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Types de blocs disponibles
const BLOCK_TYPES = [
  { 
    type: 'text', 
    name: 'Texte', 
    icon: Type, 
    category: 'content',
    description: 'Bloc de texte riche avec formatage'
  },
  { 
    type: 'image', 
    name: 'Image', 
    icon: Image, 
    category: 'media',
    description: 'Image avec options d\'alignement'
  },
  { 
    type: 'button', 
    name: 'Bouton', 
    icon: MousePointer, 
    category: 'interactive',
    description: 'Bouton d\'action personnalisable'
  },
  { 
    type: 'divider', 
    name: 'Séparateur', 
    icon: Minus, 
    category: 'layout',
    description: 'Ligne de séparation'
  },
  { 
    type: 'columns', 
    name: 'Colonnes', 
    icon: Columns, 
    category: 'layout',
    description: 'Mise en page en colonnes'
  },
  { 
    type: 'video', 
    name: 'Vidéo', 
    icon: Video, 
    category: 'media',
    description: 'Intégration vidéo YouTube/Vimeo'
  },
  { 
    type: 'html', 
    name: 'HTML', 
    icon: Code, 
    category: 'advanced',
    description: 'Code HTML personnalisé'
  },
  { 
    type: 'social', 
    name: 'Réseaux Sociaux', 
    icon: Share2, 
    category: 'interactive',
    description: 'Liens vers réseaux sociaux'
  }
];

// Composant Block individuel
const Block = ({ block, isSelected, onSelect, onUpdate }) => {
  const renderBlockContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <div 
            className="prose max-w-none"
            style={{
              fontSize: block.style?.fontSize || '16px',
              color: block.style?.color || '#000000',
              textAlign: block.style?.textAlign || 'left',
              fontFamily: block.style?.fontFamily || 'Arial, sans-serif',
              lineHeight: block.style?.lineHeight || '1.5'
            }}
          >
            {isSelected ? (
              <textarea
                value={block.content}
                onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                className="w-full p-2 border rounded resize-none bg-transparent"
                rows={Math.max(2, block.content.split('\n').length)}
                style={{ 
                  fontSize: 'inherit', 
                  color: 'inherit', 
                  textAlign: 'inherit',
                  fontFamily: 'inherit'
                }}
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br>') }} />
            )}
          </div>
        );
      
      case 'image':
        return (
          <div style={{ textAlign: block.style?.textAlign || 'center' }}>
            {isSelected && (
              <Input
                type="url"
                value={block.content}
                onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                placeholder="URL de l'image"
                className="mb-2"
              />
            )}
            <img 
              src={block.content || 'https://via.placeholder.com/400x200?text=Image'} 
              alt={block.alt || 'Email content'} 
              className="max-w-full h-auto rounded"
              style={{
                width: block.style?.width || 'auto',
                height: block.style?.height || 'auto',
                borderRadius: block.style?.borderRadius || '0px'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x200?text=Image+non+trouvée';
              }}
            />
          </div>
        );
      
      case 'button':
        return (
          <div style={{ textAlign: block.style?.textAlign || 'center' }}>
            {isSelected && (
              <div className="space-y-2 mb-2">
                <Input
                  value={block.content}
                  onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                  placeholder="Texte du bouton"
                />
                <Input
                  value={block.href || ''}
                  onChange={(e) => onUpdate(block.id, { href: e.target.value })}
                  placeholder="Lien (URL)"
                />
              </div>
            )}
            <button 
              className="px-6 py-3 rounded font-medium transition-colors"
              style={{
                backgroundColor: block.style?.backgroundColor || '#3b82f6',
                color: block.style?.color || '#ffffff',
                borderRadius: block.style?.borderRadius || '6px',
                fontSize: block.style?.fontSize || '16px',
                border: block.style?.border || 'none'
              }}
            >
              {block.content || 'Cliquez ici'}
            </button>
          </div>
        );
      
      case 'divider':
        return (
          <hr 
            style={{
              border: 'none',
              height: block.style?.height || '1px',
              backgroundColor: block.style?.color || '#e5e7eb',
              margin: `${block.style?.marginTop || 20}px 0 ${block.style?.marginBottom || 20}px 0`
            }}
          />
        );
      
      case 'columns':
        return (
          <div 
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${block.columns || 2}, 1fr)`
            }}
          >
            {Array.from({ length: block.columns || 2 }).map((_, index) => (
              <div key={index} className="p-4 border-2 border-dashed border-gray-300 rounded">
                <p className="text-gray-500 text-center">Colonne {index + 1}</p>
              </div>
            ))}
          </div>
        );
      
      case 'video':
        return (
          <div style={{ textAlign: block.style?.textAlign || 'center' }}>
            {isSelected && (
              <Input
                value={block.content}
                onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                placeholder="URL YouTube ou Vimeo"
                className="mb-2"
              />
            )}
            <div className="bg-gray-200 rounded p-8 text-center">
              <Video className="h-12 w-12 mx-auto mb-2 text-gray-500" />
              <p className="text-gray-600">Vidéo: {block.content || 'Aucune URL'}</p>
            </div>
          </div>
        );
      
      case 'html':
        return (
          <div>
            {isSelected ? (
              <textarea
                value={block.content}
                onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                className="w-full p-2 border rounded font-mono text-sm"
                rows={6}
                placeholder="<div>Votre code HTML ici...</div>"
              />
            ) : (
              <div 
                className="border-2 border-dashed border-gray-300 p-4 rounded"
                dangerouslySetInnerHTML={{ __html: block.content || '<p>Code HTML personnalisé</p>' }}
              />
            )}
          </div>
        );
      
      case 'social':
        const socialLinks = [
          { name: 'Facebook', color: '#1877f2' },
          { name: 'Twitter', color: '#1da1f2' },
          { name: 'Instagram', color: '#e4405f' },
          { name: 'LinkedIn', color: '#0077b5' }
        ];
        
        return (
          <div style={{ textAlign: block.style?.textAlign || 'center' }}>
            <div className="flex justify-center space-x-4">
              {socialLinks.map((social) => (
                <div
                  key={social.name}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: social.color }}
                >
                  <Share2 className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return <div className="p-4 bg-gray-100 rounded">Bloc inconnu</div>;
    }
  };

  return (
    <div
      className={`relative p-4 border-2 transition-all cursor-pointer ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-lg' 
          : 'border-transparent hover:border-gray-300'
      }`}
      onClick={onSelect}
      style={{
        margin: `${block.style?.marginTop || 0}px ${block.style?.marginRight || 0}px ${block.style?.marginBottom || 0}px ${block.style?.marginLeft || 0}px`,
        padding: `${block.style?.paddingTop || 16}px ${block.style?.paddingRight || 16}px ${block.style?.paddingBottom || 16}px ${block.style?.paddingLeft || 16}px`,
        backgroundColor: block.style?.backgroundColor || 'transparent',
        borderRadius: block.style?.borderRadius || '0px'
      }}
    >
      {renderBlockContent()}
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 flex space-x-1">
          <Badge variant="secondary" className="text-xs">
            {BLOCK_TYPES.find(t => t.type === block.type)?.name}
          </Badge>
        </div>
      )}
    </div>
  );
};

// Composant SortableBlock
const SortableBlock = ({ block, isSelected, onSelect, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Block
        block={block}
        isSelected={isSelected}
        onSelect={onSelect}
        onUpdate={onUpdate}
      />
    </div>
  );
};

// Composant principal EmailEditorAdvanced
const EmailEditorAdvanced = () => {
  const navigate = useNavigate();
  const { designId } = useParams();
  const location = useLocation();
  
  // États principaux
  const [emailDesign, setEmailDesign] = useState({
    name: `Design ${new Date().toLocaleDateString()}`,
    subject: '',
    preheader: '',
    blocks: [],
    globalStyles: {
      backgroundColor: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      lineHeight: '1.5',
      color: '#000000'
    }
  });
  
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, tablet, mobile
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Sensors pour drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Logs de débogage
  useEffect(() => {
    console.log('EmailEditor Advanced monté avec:', {
      designId,
      locationState: location.state,
      pathname: location.pathname
    });
  }, [designId, location]);

  // Gestion de l'historique
  const addToHistory = useCallback((state) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(state)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setEmailDesign(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setEmailDesign(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Fonctions de gestion des blocs
  const addBlock = useCallback((blockType) => {
    const newBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      content: getDefaultContent(blockType),
      style: getDefaultStyle(blockType)
    };
    
    const newState = {
      ...emailDesign,
      blocks: [...emailDesign.blocks, newBlock]
    };
    
    setEmailDesign(newState);
    addToHistory(emailDesign);
    setSelectedBlockId(newBlock.id);
  }, [emailDesign, addToHistory]);

  const updateBlock = useCallback((blockId, updates) => {
    const newState = {
      ...emailDesign,
      blocks: emailDesign.blocks.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    };
    
    setEmailDesign(newState);
  }, [emailDesign]);

  const deleteBlock = useCallback((blockId) => {
    const newState = {
      ...emailDesign,
      blocks: emailDesign.blocks.filter(block => block.id !== blockId)
    };
    
    setEmailDesign(newState);
    addToHistory(emailDesign);
    setSelectedBlockId(null);
  }, [emailDesign, addToHistory]);

  const duplicateBlock = useCallback((blockId) => {
    const blockToDuplicate = emailDesign.blocks.find(block => block.id === blockId);
    if (blockToDuplicate) {
      const duplicatedBlock = {
        ...blockToDuplicate,
        id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      const blockIndex = emailDesign.blocks.findIndex(block => block.id === blockId);
      const newBlocks = [...emailDesign.blocks];
      newBlocks.splice(blockIndex + 1, 0, duplicatedBlock);
      
      const newState = { ...emailDesign, blocks: newBlocks };
      setEmailDesign(newState);
      addToHistory(emailDesign);
    }
  }, [emailDesign, addToHistory]);

  // Gestion du drag & drop
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = emailDesign.blocks.findIndex(block => block.id === active.id);
      const newIndex = emailDesign.blocks.findIndex(block => block.id === over.id);
      
      const newBlocks = arrayMove(emailDesign.blocks, oldIndex, newIndex);
      const newState = { ...emailDesign, blocks: newBlocks };
      
      setEmailDesign(newState);
      addToHistory(emailDesign);
    }
  }, [emailDesign, addToHistory]);

  // Export HTML
  const exportHTML = useCallback(() => {
    const html = generateEmailHTML(emailDesign);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${emailDesign.name}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [emailDesign]);

  // Export JSON
  const exportJSON = useCallback(() => {
    const json = JSON.stringify(emailDesign, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${emailDesign.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [emailDesign]);

  const selectedBlock = emailDesign.blocks.find(block => block.id === selectedBlockId);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header/Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/templates')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
            
            <Input
              value={emailDesign.name}
              onChange={(e) => setEmailDesign(prev => ({ ...prev, name: e.target.value }))}
              className="text-lg font-medium w-64"
              placeholder="Nom du design"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Contrôles d'historique */}
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>
            
            {/* Contrôles de zoom */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            {/* Mode sombre */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {/* Prévisualisation */}
            <div className="flex border rounded">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Actions */}
            <Button variant="outline" size="sm" onClick={exportHTML}>
              <Download className="h-4 w-4 mr-1" />
              HTML
            </Button>
            <Button variant="outline" size="sm" onClick={exportJSON}>
              <Download className="h-4 w-4 mr-1" />
              JSON
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
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
          <Tabs defaultValue="blocks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="blocks">Blocs</TabsTrigger>
              <TabsTrigger value="styles">Styles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="blocks" className="space-y-4">
              <div>
                <h3 className="font-medium mb-3">Contenu</h3>
                <div className="space-y-2">
                  {BLOCK_TYPES.filter(block => block.category === 'content').map((blockType) => {
                    const IconComponent = blockType.icon;
                    return (
                      <Button
                        key={blockType.type}
                        variant="outline"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => addBlock(blockType.type)}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium text-sm">{blockType.name}</div>
                            <div className="text-xs text-gray-500">{blockType.description}</div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Média</h3>
                <div className="space-y-2">
                  {BLOCK_TYPES.filter(block => block.category === 'media').map((blockType) => {
                    const IconComponent = blockType.icon;
                    return (
                      <Button
                        key={blockType.type}
                        variant="outline"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => addBlock(blockType.type)}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium text-sm">{blockType.name}</div>
                            <div className="text-xs text-gray-500">{blockType.description}</div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Mise en page</h3>
                <div className="space-y-2">
                  {BLOCK_TYPES.filter(block => block.category === 'layout').map((blockType) => {
                    const IconComponent = blockType.icon;
                    return (
                      <Button
                        key={blockType.type}
                        variant="outline"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => addBlock(blockType.type)}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium text-sm">{blockType.name}</div>
                            <div className="text-xs text-gray-500">{blockType.description}</div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Interactif</h3>
                <div className="space-y-2">
                  {BLOCK_TYPES.filter(block => block.category === 'interactive').map((blockType) => {
                    const IconComponent = blockType.icon;
                    return (
                      <Button
                        key={blockType.type}
                        variant="outline"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => addBlock(blockType.type)}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium text-sm">{blockType.name}</div>
                            <div className="text-xs text-gray-500">{blockType.description}</div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Avancé</h3>
                <div className="space-y-2">
                  {BLOCK_TYPES.filter(block => block.category === 'advanced').map((blockType) => {
                    const IconComponent = blockType.icon;
                    return (
                      <Button
                        key={blockType.type}
                        variant="outline"
                        className="w-full justify-start h-auto p-3"
                        onClick={() => addBlock(blockType.type)}
                      >
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-5 w-5" />
                          <div className="text-left">
                            <div className="font-medium text-sm">{blockType.name}</div>
                            <div className="text-xs text-gray-500">{blockType.description}</div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="styles" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Styles globaux</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Couleur de fond</label>
                    <Input
                      type="color"
                      value={emailDesign.globalStyles.backgroundColor}
                      onChange={(e) => setEmailDesign(prev => ({
                        ...prev,
                        globalStyles: { ...prev.globalStyles, backgroundColor: e.target.value }
                      }))}
                      className="h-10"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Police</label>
                    <Select
                      value={emailDesign.globalStyles.fontFamily}
                      onValueChange={(value) => setEmailDesign(prev => ({
                        ...prev,
                        globalStyles: { ...prev.globalStyles, fontFamily: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                        <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
                        <SelectItem value="Georgia, serif">Georgia</SelectItem>
                        <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
                        <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Taille de police</label>
                    <Input
                      value={emailDesign.globalStyles.fontSize}
                      onChange={(e) => setEmailDesign(prev => ({
                        ...prev,
                        globalStyles: { ...prev.globalStyles, fontSize: e.target.value }
                      }))}
                      placeholder="16px"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas principal */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div 
            className={`mx-auto transition-all duration-300 ${
              previewMode === 'mobile' ? 'max-w-sm' :
              previewMode === 'tablet' ? 'max-w-2xl' : 'max-w-4xl'
            }`}
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <Card className="shadow-lg">
              <CardHeader className="space-y-4">
                <Input
                  placeholder="Objet de l'email"
                  value={emailDesign.subject}
                  onChange={(e) => setEmailDesign(prev => ({ ...prev, subject: e.target.value }))}
                  className="text-lg font-medium"
                />
                <Input
                  placeholder="Texte de prévisualisation"
                  value={emailDesign.preheader}
                  onChange={(e) => setEmailDesign(prev => ({ ...prev, preheader: e.target.value }))}
                />
              </CardHeader>
              
              <CardContent>
                <div 
                  className="min-h-96 rounded-lg"
                  style={{ backgroundColor: emailDesign.globalStyles.backgroundColor }}
                >
                  {emailDesign.blocks.length === 0 ? (
                    <div className="flex items-center justify-center h-96 text-gray-500">
                      <div className="text-center">
                        <Grid className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Glissez des blocs ici pour commencer</p>
                        <p className="text-sm">ou cliquez sur un bloc dans la palette</p>
                      </div>
                    </div>
                  ) : (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={emailDesign.blocks.map(block => block.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-1">
                          {emailDesign.blocks.map((block) => (
                            <SortableBlock
                              key={block.id}
                              block={block}
                              isSelected={selectedBlockId === block.id}
                              onSelect={() => setSelectedBlockId(block.id)}
                              onUpdate={updateBlock}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Panneau de propriétés */}
        {selectedBlock && (
          <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Propriétés</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateBlock(selectedBlock.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteBlock(selectedBlock.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Badge variant="secondary" className="w-fit">
                  {BLOCK_TYPES.find(t => t.type === selectedBlock.type)?.name}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Propriétés spécifiques au type de bloc */}
                {selectedBlock.type === 'text' && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Taille de police</label>
                      <Input
                        value={selectedBlock.style?.fontSize || '16px'}
                        onChange={(e) => updateBlock(selectedBlock.id, {
                          style: { ...selectedBlock.style, fontSize: e.target.value }
                        })}
                        placeholder="16px"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Couleur</label>
                      <Input
                        type="color"
                        value={selectedBlock.style?.color || '#000000'}
                        onChange={(e) => updateBlock(selectedBlock.id, {
                          style: { ...selectedBlock.style, color: e.target.value }
                        })}
                        className="h-10"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Alignement</label>
                      <div className="flex space-x-1">
                        <Button
                          variant={selectedBlock.style?.textAlign === 'left' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateBlock(selectedBlock.id, {
                            style: { ...selectedBlock.style, textAlign: 'left' }
                          })}
                        >
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={selectedBlock.style?.textAlign === 'center' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateBlock(selectedBlock.id, {
                            style: { ...selectedBlock.style, textAlign: 'center' }
                          })}
                        >
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={selectedBlock.style?.textAlign === 'right' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateBlock(selectedBlock.id, {
                            style: { ...selectedBlock.style, textAlign: 'right' }
                          })}
                        >
                          <AlignRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                
                {selectedBlock.type === 'button' && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Couleur de fond</label>
                      <Input
                        type="color"
                        value={selectedBlock.style?.backgroundColor || '#3b82f6'}
                        onChange={(e) => updateBlock(selectedBlock.id, {
                          style: { ...selectedBlock.style, backgroundColor: e.target.value }
                        })}
                        className="h-10"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Couleur du texte</label>
                      <Input
                        type="color"
                        value={selectedBlock.style?.color || '#ffffff'}
                        onChange={(e) => updateBlock(selectedBlock.id, {
                          style: { ...selectedBlock.style, color: e.target.value }
                        })}
                        className="h-10"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Bordure arrondie</label>
                      <Input
                        value={selectedBlock.style?.borderRadius || '6px'}
                        onChange={(e) => updateBlock(selectedBlock.id, {
                          style: { ...selectedBlock.style, borderRadius: e.target.value }
                        })}
                        placeholder="6px"
                      />
                    </div>
                  </>
                )}
                
                {selectedBlock.type === 'columns' && (
                  <div>
                    <label className="text-sm font-medium">Nombre de colonnes</label>
                    <Select
                      value={selectedBlock.columns?.toString() || '2'}
                      onValueChange={(value) => updateBlock(selectedBlock.id, {
                        columns: parseInt(value)
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 colonnes</SelectItem>
                        <SelectItem value="3">3 colonnes</SelectItem>
                        <SelectItem value="4">4 colonnes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Propriétés communes */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Espacement</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs">Marge haut</label>
                      <Input
                        type="number"
                        value={selectedBlock.style?.marginTop || 0}
                        onChange={(e) => updateBlock(selectedBlock.id, {
                          style: { ...selectedBlock.style, marginTop: parseInt(e.target.value) || 0 }
                        })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Marge bas</label>
                      <Input
                        type="number"
                        value={selectedBlock.style?.marginBottom || 0}
                        onChange={(e) => updateBlock(selectedBlock.id, {
                          style: { ...selectedBlock.style, marginBottom: parseInt(e.target.value) || 0 }
                        })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Padding haut</label>
                      <Input
                        type="number"
                        value={selectedBlock.style?.paddingTop || 16}
                        onChange={(e) => updateBlock(selectedBlock.id, {
                          style: { ...selectedBlock.style, paddingTop: parseInt(e.target.value) || 0 }
                        })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <label className="text-xs">Padding bas</label>
                      <Input
                        type="number"
                        value={selectedBlock.style?.paddingBottom || 16}
                        onChange={(e) => updateBlock(selectedBlock.id, {
                          style: { ...selectedBlock.style, paddingBottom: parseInt(e.target.value) || 0 }
                        })}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Couleur de fond</label>
                  <Input
                    type="color"
                    value={selectedBlock.style?.backgroundColor || 'transparent'}
                    onChange={(e) => updateBlock(selectedBlock.id, {
                      style: { ...selectedBlock.style, backgroundColor: e.target.value }
                    })}
                    className="h-10"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Fonctions utilitaires
function getDefaultContent(blockType) {
  switch (blockType) {
    case 'text':
      return 'Votre texte ici...';
    case 'image':
      return 'https://via.placeholder.com/400x200?text=Votre+Image';
    case 'button':
      return 'Cliquez ici';
    case 'video':
      return '';
    case 'html':
      return '<div>Votre code HTML ici...</div>';
    default:
      return '';
  }
}

function getDefaultStyle(blockType) {
  switch (blockType) {
    case 'text':
      return {
        fontSize: '16px',
        color: '#000000',
        textAlign: 'left',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.5'
      };
    case 'button':
      return {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        borderRadius: '6px',
        fontSize: '16px',
        textAlign: 'center'
      };
    case 'image':
      return {
        textAlign: 'center'
      };
    default:
      return {};
  }
}

function generateEmailHTML(emailDesign) {
  const { blocks, globalStyles } = emailDesign;
  
  let html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${emailDesign.subject}</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: ${globalStyles.fontFamily};
            font-size: ${globalStyles.fontSize};
            line-height: ${globalStyles.lineHeight};
            color: ${globalStyles.color};
            background-color: ${globalStyles.backgroundColor};
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: ${globalStyles.backgroundColor};
        }
    </style>
</head>
<body>
    <div class="email-container">
`;

  blocks.forEach(block => {
    html += generateBlockHTML(block);
  });

  html += `
    </div>
</body>
</html>`;

  return html;
}

function generateBlockHTML(block) {
  const style = block.style || {};
  const styleString = Object.entries(style)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ');

  switch (block.type) {
    case 'text':
      return `<div style="${styleString}">${block.content.replace(/\n/g, '<br>')}</div>`;
    case 'image':
      return `<div style="text-align: ${style.textAlign || 'center'}"><img src="${block.content}" alt="${block.alt || ''}" style="max-width: 100%; height: auto; ${styleString}" /></div>`;
    case 'button':
      return `<div style="text-align: ${style.textAlign || 'center'}"><a href="${block.href || '#'}" style="display: inline-block; padding: 12px 24px; text-decoration: none; ${styleString}">${block.content}</a></div>`;
    case 'divider':
      return `<hr style="${styleString}" />`;
    default:
      return `<div style="${styleString}">${block.content}</div>`;
  }
}

export default EmailEditorAdvanced;
