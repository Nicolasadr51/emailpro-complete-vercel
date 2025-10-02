import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Save, Eye, Smartphone, Monitor, Settings, ArrowLeft, Plus, Undo, Redo, AlertCircle, Download, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

import BlockPalette from '@/components/email-editor/BlockPalette';
import EmailCanvas from '@/components/email-editor/EmailCanvas';
import BlockPropertiesPanel from '@/components/email-editor/BlockPropertiesPanel';
import PreviewPanel from '@/components/email-editor/PreviewPanel';
import api from '@/lib/api-mock';

const EmailEditorPageStandalone = () => {
  const navigate = useNavigate();
  const { designId } = useParams();
  const isEditMode = Boolean(designId);

  // Editor state
  const [emailDesign, setEmailDesign] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [availableBlockTypes, setAvailableBlockTypes] = useState([]);
  const [templates, setTemplates] = useState([]);
  
  // Editor mode states
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showPreview, setShowPreview] = useState(false);
  const [showProperties, setShowProperties] = useState(true);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  
  // Auto-save
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // History for undo/redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Safe API call wrapper to prevent redirects on errors
  const safeApiCall = async (apiFunction, fallbackData = null, errorMessage = "Erreur API") => {
    try {
      const response = await apiFunction();
      return { success: true, data: response };
    } catch (err) {
      console.warn(`${errorMessage}:`, err);
      return { success: false, error: err.message, data: fallbackData };
    }
  };

  // Load initial data with robust error handling
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Load block types with fallback
        const blockTypesResult = await safeApiCall(
          () => api.emailEditor.getBlockTypes(),
          [
            { type: 'text', name: 'Texte', description: 'Block de texte', icon: 'type', defaultContent: { text: 'Votre texte ici...', isRichText: true }},
            { type: 'image', name: 'Image', description: 'Block image', icon: 'image', defaultContent: { src: '', alt: 'Image', width: '100%' }},
            { type: 'button', name: 'Bouton', description: 'Bouton d\'action', icon: 'mouse-pointer', defaultContent: { text: 'Cliquez ici', link: '#', style: 'solid' }},
            { type: 'divider', name: 'Séparateur', description: 'Ligne de séparation', icon: 'minus', defaultContent: { style: 'solid', thickness: 1, color: '#cccccc' }},
            { type: 'spacer', name: 'Espacement', description: 'Espace vertical', icon: 'move-vertical', defaultContent: { height: 20 }},
            { type: 'social', name: 'Réseaux Sociaux', description: 'Liens sociaux', icon: 'share2', defaultContent: { socialLinks: [{ platform: 'facebook', url: '#', icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png' }, { platform: 'twitter', url: '#', icon: 'https://cdn-icons-png.flaticon.com/512/124/124021.png' }, { platform: 'instagram', url: '#', icon: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' }] }}
          ],
          "Erreur lors du chargement des types de blocks"
        );
        
        if (blockTypesResult.success && blockTypesResult.data?.success) {
          setAvailableBlockTypes(blockTypesResult.data.data);
        } else {
          setAvailableBlockTypes(blockTypesResult.data);
        }
        
        // Load templates with fallback
        const templatesResult = await safeApiCall(
          () => api.emailEditor.getTemplates(),
          [],
          "Erreur lors du chargement des templates"
        );
        
        if (templatesResult.success && templatesResult.data?.success) {
          setTemplates(templatesResult.data.data);
        } else {
          setTemplates(templatesResult.data || []);
        }
        
        if (isEditMode && designId) {
          // Load existing design
          const designResult = await safeApiCall(
            () => api.emailEditor.getDesign(designId),
            null,
            "Erreur lors du chargement du design"
          );
          
          if (designResult.success && designResult.data?.success) {
            const designData = designResult.data.data;
            setEmailDesign(designData);
            setBlocks(designData.blocks || []);
            setHistory([designData.blocks || []]);
            setHistoryIndex(0);
          } else {
            setError('Design non trouvé - création d\'un nouveau design');
            // Fallback to new design
            createNewDesign();
          }
        } else {
          // Create new design
          createNewDesign();
        }
      } catch (err) {
        console.error('Erreur fatale lors du chargement:', err);
        setError('Erreur de chargement - Mode dégradé activé');
        // Activate degraded mode
        createNewDesign();
        if (availableBlockTypes.length === 0) {
          setAvailableBlockTypes([
            { type: 'text', name: 'Texte', description: 'Block de texte', icon: 'type', defaultContent: { text: 'Votre texte ici...', isRichText: true }}
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    const createNewDesign = () => {
      const newDesign = {
        name: `Design ${new Date().toLocaleDateString()}`,
        subject: '',
        preheader: '',
        blocks: [],
        variables: [],
        containerWidth: 600,
        backgroundColor: '#f5f5f5'
      };
      setEmailDesign(newDesign);
      setBlocks([]);
      setHistory([[]]);
      setHistoryIndex(0);
    };
    
    // Delay to ensure component is mounted properly
    const timer = setTimeout(loadInitialData, 100);
    return () => clearTimeout(timer);
  }, [designId, isEditMode]);

  // Auto-save functionality with error handling
  useEffect(() => {
    if (!emailDesign || !hasUnsavedChanges || !emailDesign.id) return;
    
    const autoSaveTimer = setTimeout(async () => {
      try {
        await api.emailEditor.autoSave(emailDesign.id, blocks);
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (err) {
        console.warn('Auto-save échoué:', err);
        // Don't show error to user for auto-save failures
      }
    }, 3000);
    
    return () => clearTimeout(autoSaveTimer);
  }, [emailDesign, blocks, hasUnsavedChanges]);

  // Handle drag end for reordering blocks
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    console.log('handleDragEnd called:', { active: active?.id, over: over?.id });
    
    if (!over) {
      console.log('No drop target found');
      return;
    }
    
    // Handle adding new blocks from palette
    if (active.data.current?.type === 'block-type') {
      const blockType = active.data.current.blockType;
      console.log('Adding new block from palette:', blockType);
      handleAddBlock(blockType);
      return;
    }
    
    // Handle reordering existing blocks
    if (active.id !== over.id) {
      console.log('Reordering blocks');
      setBlocks((prevBlocks) => {
        const oldIndex = prevBlocks.findIndex(block => block.id === active.id);
        const newIndex = prevBlocks.findIndex(block => block.id === over.id);
        
        console.log('Moving from index', oldIndex, 'to index', newIndex);
        
        if (oldIndex === -1 || newIndex === -1) {
          console.error('Invalid indices:', { oldIndex, newIndex });
          return prevBlocks;
        }
        
        const newBlocks = arrayMove(prevBlocks, oldIndex, newIndex).map((block, index) => ({ ...block, order: index }));
        
        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newBlocks);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        
        setHasUnsavedChanges(true);
        return newBlocks;
      });
    }
  }, [history, historyIndex, handleAddBlock]);

  // Add block to canvas
  const handleAddBlock = useCallback((blockType) => {
    console.log('handleAddBlock called with:', blockType);
    console.log('availableBlockTypes:', availableBlockTypes);
    const blockTypeData = availableBlockTypes.find(bt => bt.type === blockType);
    console.log('blockTypeData found:', blockTypeData);
    if (!blockTypeData) {
      console.error('Block type not found:', blockType);
      return;
    }
    
    const newBlock = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      content: blockTypeData.defaultContent,
      style: {
        colors: { background: '#ffffff', text: '#000000', border: '#cccccc' },
        typography: { fontFamily: 'Arial, sans-serif', fontSize: 14, fontWeight: 'normal', lineHeight: 1.5, letterSpacing: 0 },
        spacing: { paddingTop: 10, paddingRight: 10, paddingBottom: 10, paddingLeft: 10, marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0 },
        border: { width: 0, style: 'solid', color: '#cccccc', radius: 0 },
        width: '100%',
        height: null,
        textAlign: 'left'
      },
      order: blocks.length,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    setSelectedBlock(newBlock);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newBlocks);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    setHasUnsavedChanges(true);
  }, [blocks, availableBlockTypes, history, historyIndex]);

  // Update block
  const handleUpdateBlock = useCallback((blockId, updates) => {
    setBlocks(prevBlocks => {
      const newBlocks = prevBlocks.map(block => 
        block.id === blockId 
          ? { ...block, ...updates, updatedAt: new Date().toISOString() }
          : block
      );
      
      setHasUnsavedChanges(true);
      return newBlocks;
    });
  }, []);

  // Delete block
  const handleDeleteBlock = useCallback((blockId) => {
    setBlocks(prevBlocks => {
      const newBlocks = prevBlocks.filter(block => block.id !== blockId);
      setHasUnsavedChanges(true);
      return newBlocks;
    });
    
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  }, [selectedBlock]);

  // Duplicate block
  const handleDuplicateBlock = useCallback((duplicatedBlock) => {
    setBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks, duplicatedBlock].sort((a, b) => a.order - b.order);
      setHasUnsavedChanges(true);
      return newBlocks;
    });
  }, []);

  // Save design
  const handleSave = async () => {
    if (!emailDesign) return;
    
    setIsSaving(true);
    setError('');
    
    try {
      if (isEditMode) {
        const response = await api.emailEditor.updateDesign(designId, {
          name: emailDesign.name,
          subject: emailDesign.subject,
          preheader: emailDesign.preheader,
          blocks: blocks
        });
        
        if (response.success) {
          setEmailDesign(response.data);
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
        }
      } else {
        const response = await api.emailEditor.createDesign({
          name: emailDesign.name,
          subject: emailDesign.subject,
          preheader: emailDesign.preheader
        });
        
        if (response.success) {
          setEmailDesign(response.data);
          navigate(`/email-editor/${response.data.id}`, { replace: true });
        }
      }
    } catch (err) {
      setError('Erreur lors de la sauvegarde - les données sont conservées localement');
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'éditeur d'email...</p>
          <p className="text-gray-400 text-sm mt-2">Initialisation des composants...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (!emailDesign || availableBlockTypes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <AlertCircle className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">
              {error || "Impossible de charger l'éditeur d'email"}
            </p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Recharger la page
              </Button>
              <Button variant="outline" onClick={() => console.log('Retour aux campagnes')} className="w-full">
                Retour aux campagnes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('Retour aux campagnes')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour aux campagnes
            </Button>
            
            <div className="flex flex-col">
              <Input
                value={emailDesign?.name || ''}
                onChange={(e) => {
                  setEmailDesign(prev => ({ ...prev, name: e.target.value }));
                  setHasUnsavedChanges(true);
                }}
                className="text-lg font-medium border-none shadow-none p-0 h-auto"
                placeholder="Nom du design"
              />
              <div className="flex items-center text-xs text-gray-500 mt-1">
                {lastSaved && (
                  <span>Dernière sauvegarde: {lastSaved.toLocaleTimeString()}</span>
                )}
                {hasUnsavedChanges && (
                  <span className="text-orange-500 ml-2">• Modifications non sauvegardées</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Preview modes */}
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
            <Button
              variant={showPreview ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
            {/* Properties panel toggle */}
            <Button
              variant={showProperties ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowProperties(!showProperties)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            
            {/* Save button */}
            <Button onClick={handleExportHtml} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Exporter HTML
            </Button>
            <Button onClick={handleImportHtml} className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Importer HTML
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="flex items-center">
              {isSaving ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <Alert className="m-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Editor layout */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Panel - Block Palette */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Blocs</h3>
            <BlockPalette
              blockTypes={availableBlockTypes}
              onAddBlock={handleAddBlock}
            />
          </div>
        </div>

        {/* Center - Email Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            {!showPreview ? (
              <EmailCanvas
                blocks={blocks}
                selectedBlock={selectedBlock}
                onSelectBlock={setSelectedBlock}
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
            onDuplicateBlock={handleDuplicateBlock}
                previewMode={previewMode}
                emailDesign={emailDesign}
              />
            ) : (
              <PreviewPanel
                blocks={blocks}
                emailDesign={emailDesign}
                previewMode={previewMode}
              />
            )}
          </DndContext>
        </div>

        {/* Right Panel - Properties */}
        {showProperties && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <BlockPropertiesPanel
              block={selectedBlock}
              emailDesign={emailDesign}
              onUpdateBlock={handleUpdateBlock}
              onUpdateDesign={(updates) => {
                setEmailDesign(prev => ({ ...prev, ...updates }));
                setHasUnsavedChanges(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailEditorPageStandalone;


  // Export HTML
  const handleExportHtml = () => {
    const html = document.getElementById("email-canvas").innerHTML;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import HTML
  const handleImportHtml = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".html";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const html = e.target.result;
        // This is a simplified import, a real implementation would need to parse the HTML and convert it to blocks
        console.log("Imported HTML:", html);
      };
      reader.readAsText(file);
    };
    input.click();
  };

