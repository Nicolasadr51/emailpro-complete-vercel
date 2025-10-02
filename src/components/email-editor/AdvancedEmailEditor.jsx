import React, { useState, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { 
  Type, Image, Button as ButtonIcon, Minus, Square, Share2, 
  Palette, Settings, Eye, Save, Undo, Redo, Copy, Trash2,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  Link, Plus, GripVertical, Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const BLOCK_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  BUTTON: 'button',
  DIVIDER: 'divider',
  SPACER: 'spacer',
  SOCIAL: 'social',
  COLUMNS: 'columns'
};

// Composant pour les éléments draggables de la palette
const DraggableBlock = ({ type, icon: Icon, label }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'block',
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 border rounded-lg cursor-move hover:bg-gray-50 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex flex-col items-center space-y-2">
        <Icon className="h-6 w-6 text-gray-600" />
        <span className="text-xs font-medium text-gray-700">{label}</span>
      </div>
    </div>
  );
};

// Composant pour les blocs dans l'éditeur
const EditableBlock = ({ block, index, onUpdate, onDelete, onDuplicate, isSelected, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(block.content || {});

  const [{ isDragging }, drag] = useDrag({
    type: 'editableBlock',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'editableBlock',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        // Logique de réorganisation
      }
    },
  });

  const handleSave = () => {
    onUpdate(index, { ...block, content: localContent });
    setIsEditing(false);
  };

  const renderBlockContent = () => {
    switch (block.type) {
      case BLOCK_TYPES.TEXT:
        return isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={localContent.text || ''}
              onChange={(e) => setLocalContent({ ...localContent, text: e.target.value })}
              placeholder="Entrez votre texte..."
              rows={4}
            />
            <div className="flex items-center space-x-2">
              <Select
                value={localContent.fontSize || 'medium'}
                onValueChange={(value) => setLocalContent({ ...localContent, fontSize: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Petit</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="large">Grand</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={localContent.bold ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLocalContent({ ...localContent, bold: !localContent.bold })}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={localContent.italic ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLocalContent({ ...localContent, italic: !localContent.italic })}
              >
                <Italic className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSave}>Sauvegarder</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
            </div>
          </div>
        ) : (
          <div
            className={`p-4 min-h-[60px] ${
              localContent.fontSize === 'small' ? 'text-sm' :
              localContent.fontSize === 'large' ? 'text-lg' : 'text-base'
            } ${localContent.bold ? 'font-bold' : ''} ${localContent.italic ? 'italic' : ''}`}
            onClick={() => setIsEditing(true)}
          >
            {localContent.text || 'Cliquez pour éditer le texte...'}
          </div>
        );

      case BLOCK_TYPES.IMAGE:
        return isEditing ? (
          <div className="space-y-3">
            <div>
              <Label>URL de l'image</Label>
              <Input
                value={localContent.src || ''}
                onChange={(e) => setLocalContent({ ...localContent, src: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label>Texte alternatif</Label>
              <Input
                value={localContent.alt || ''}
                onChange={(e) => setLocalContent({ ...localContent, alt: e.target.value })}
                placeholder="Description de l'image"
              />
            </div>
            <div>
              <Label>Largeur</Label>
              <Slider
                value={[localContent.width || 100]}
                onValueChange={(value) => setLocalContent({ ...localContent, width: value[0] })}
                max={100}
                min={10}
                step={5}
              />
              <span className="text-sm text-gray-500">{localContent.width || 100}%</span>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSave}>Sauvegarder</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center" onClick={() => setIsEditing(true)}>
            {localContent.src ? (
              <img
                src={localContent.src}
                alt={localContent.alt || 'Image'}
                className="max-w-full h-auto mx-auto"
                style={{ width: `${localContent.width || 100}%` }}
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg">
                <Image className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">Cliquez pour ajouter une image</p>
              </div>
            )}
          </div>
        );

      case BLOCK_TYPES.BUTTON:
        return isEditing ? (
          <div className="space-y-3">
            <div>
              <Label>Texte du bouton</Label>
              <Input
                value={localContent.text || ''}
                onChange={(e) => setLocalContent({ ...localContent, text: e.target.value })}
                placeholder="Cliquez ici"
              />
            </div>
            <div>
              <Label>Lien</Label>
              <Input
                value={localContent.href || ''}
                onChange={(e) => setLocalContent({ ...localContent, href: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label>Style</Label>
              <Select
                value={localContent.style || 'primary'}
                onValueChange={(value) => setLocalContent({ ...localContent, style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primaire</SelectItem>
                  <SelectItem value="secondary">Secondaire</SelectItem>
                  <SelectItem value="outline">Contour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSave}>Sauvegarder</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center" onClick={() => setIsEditing(true)}>
            <Button
              className={
                localContent.style === 'secondary' ? 'bg-gray-600 hover:bg-gray-700' :
                localContent.style === 'outline' ? 'border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50' :
                'bg-blue-600 hover:bg-blue-700'
              }
            >
              {localContent.text || 'Bouton'}
            </Button>
          </div>
        );

      case BLOCK_TYPES.DIVIDER:
        return (
          <div className="p-4">
            <hr className="border-gray-300" />
          </div>
        );

      case BLOCK_TYPES.SPACER:
        return (
          <div
            className="bg-gray-50 border-2 border-dashed border-gray-300"
            style={{ height: `${localContent.height || 40}px` }}
          >
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Espace ({localContent.height || 40}px)
            </div>
          </div>
        );

      default:
        return <div className="p-4 text-gray-500">Bloc non reconnu</div>;
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative group border-2 transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onSelect(index)}
    >
      {/* Barre d'outils du bloc */}
      {isSelected && (
        <div className="absolute -top-10 left-0 right-0 flex items-center justify-between bg-blue-600 text-white px-2 py-1 rounded-t-md z-10">
          <div className="flex items-center space-x-1">
            <GripVertical className="h-4 w-4 cursor-move" />
            <span className="text-xs font-medium">
              {block.type === BLOCK_TYPES.TEXT ? 'Texte' :
               block.type === BLOCK_TYPES.IMAGE ? 'Image' :
               block.type === BLOCK_TYPES.BUTTON ? 'Bouton' :
               block.type === BLOCK_TYPES.DIVIDER ? 'Séparateur' :
               block.type === BLOCK_TYPES.SPACER ? 'Espace' : 'Bloc'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(index);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-white hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(index);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
      
      {renderBlockContent()}
    </div>
  );
};

// Zone de dépôt pour les nouveaux blocs
const DropZone = ({ onDrop, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'block',
    drop: (item) => {
      onDrop(item.type);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-[400px] border-2 border-dashed transition-colors ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      {children}
    </div>
  );
};

const AdvancedEmailEditor = ({ initialBlocks = [], onSave, onPreview }) => {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);
  const [history, setHistory] = useState([initialBlocks]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [previewMode, setPreviewMode] = useState('desktop');

  const addToHistory = useCallback((newBlocks) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleAddBlock = (type) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type)
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    addToHistory(newBlocks);
  };

  const getDefaultContent = (type) => {
    switch (type) {
      case BLOCK_TYPES.TEXT:
        return { text: 'Votre texte ici...', fontSize: 'medium' };
      case BLOCK_TYPES.IMAGE:
        return { src: '', alt: '', width: 100 };
      case BLOCK_TYPES.BUTTON:
        return { text: 'Cliquez ici', href: '#', style: 'primary' };
      case BLOCK_TYPES.SPACER:
        return { height: 40 };
      default:
        return {};
    }
  };

  const handleUpdateBlock = (index, updatedBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    setBlocks(newBlocks);
    addToHistory(newBlocks);
  };

  const handleDeleteBlock = (index) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
    setSelectedBlockIndex(null);
    addToHistory(newBlocks);
  };

  const handleDuplicateBlock = (index) => {
    const blockToDuplicate = blocks[index];
    const duplicatedBlock = {
      ...blockToDuplicate,
      id: Date.now().toString()
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, duplicatedBlock);
    setBlocks(newBlocks);
    addToHistory(newBlocks);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
    }
  };

  const generateHTML = () => {
    let html = `
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email</title>
          <style>
            body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
            .email-container { max-width: 600px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="email-container">
    `;

    blocks.forEach(block => {
      switch (block.type) {
        case BLOCK_TYPES.TEXT:
          html += `<div style="padding: 16px; font-size: ${
            block.content.fontSize === 'small' ? '14px' :
            block.content.fontSize === 'large' ? '18px' : '16px'
          }; ${block.content.bold ? 'font-weight: bold;' : ''} ${
            block.content.italic ? 'font-style: italic;' : ''
          }">${block.content.text || ''}</div>`;
          break;
        case BLOCK_TYPES.IMAGE:
          if (block.content.src) {
            html += `<div style="padding: 16px; text-align: center;">
              <img src="${block.content.src}" alt="${block.content.alt || ''}" 
                   style="max-width: ${block.content.width || 100}%; height: auto;">
            </div>`;
          }
          break;
        case BLOCK_TYPES.BUTTON:
          html += `<div style="padding: 16px; text-align: center;">
            <a href="${block.content.href || '#'}" style="
              display: inline-block; 
              padding: 12px 24px; 
              background-color: ${
                block.content.style === 'secondary' ? '#6b7280' :
                block.content.style === 'outline' ? 'transparent' : '#2563eb'
              }; 
              color: ${block.content.style === 'outline' ? '#2563eb' : 'white'}; 
              text-decoration: none; 
              border-radius: 6px;
              ${block.content.style === 'outline' ? 'border: 2px solid #2563eb;' : ''}
            ">${block.content.text || 'Bouton'}</a>
          </div>`;
          break;
        case BLOCK_TYPES.DIVIDER:
          html += `<div style="padding: 16px;"><hr style="border: none; border-top: 1px solid #d1d5db;"></div>`;
          break;
        case BLOCK_TYPES.SPACER:
          html += `<div style="height: ${block.content.height || 40}px;"></div>`;
          break;
      }
    });

    html += `
          </div>
        </body>
      </html>
    `;

    return html;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex bg-gray-100">
        {/* Palette d'outils */}
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Éléments</h3>
            <div className="grid grid-cols-2 gap-2">
              <DraggableBlock type={BLOCK_TYPES.TEXT} icon={Type} label="Texte" />
              <DraggableBlock type={BLOCK_TYPES.IMAGE} icon={Image} label="Image" />
              <DraggableBlock type={BLOCK_TYPES.BUTTON} icon={ButtonIcon} label="Bouton" />
              <DraggableBlock type={BLOCK_TYPES.DIVIDER} icon={Minus} label="Séparateur" />
              <DraggableBlock type={BLOCK_TYPES.SPACER} icon={Square} label="Espace" />
              <DraggableBlock type={BLOCK_TYPES.SOCIAL} icon={Share2} label="Réseaux" />
            </div>
          </div>
        </div>

        {/* Zone d'édition principale */}
        <div className="flex-1 flex flex-col">
          {/* Barre d'outils */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={historyIndex === 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

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

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => onPreview?.(generateHTML())}>
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </Button>
              <Button size="sm" onClick={() => onSave?.(blocks, generateHTML())}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>

          {/* Zone d'édition */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className={`mx-auto bg-white shadow-lg ${
              previewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'
            }`}>
              <DropZone onDrop={handleAddBlock}>
                {blocks.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Plus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Glissez des éléments ici pour commencer</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {blocks.map((block, index) => (
                      <EditableBlock
                        key={block.id}
                        block={block}
                        index={index}
                        onUpdate={handleUpdateBlock}
                        onDelete={handleDeleteBlock}
                        onDuplicate={handleDuplicateBlock}
                        isSelected={selectedBlockIndex === index}
                        onSelect={setSelectedBlockIndex}
                      />
                    ))}
                  </div>
                )}
              </DropZone>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default AdvancedEmailEditor;
