import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Save, Eye, Smartphone, Monitor, Settings, ArrowLeft, Plus, Undo, Redo } from 'lucide-react';
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

const EmailEditorPage = () => {
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
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, mobile, preview
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

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Load available block types
        const blockTypesResponse = await api.emailEditor.getBlockTypes();
        if (blockTypesResponse.success) {
          setAvailableBlockTypes(blockTypesResponse.data);
        }
        
        // Load templates
        const templatesResponse = await api.emailEditor.getTemplates();
        if (templatesResponse.success) {
          setTemplates(templatesResponse.data);
        }
        
        if (isEditMode && designId) {
          // Load existing design
          const designResponse = await api.emailEditor.getDesign(designId);
          if (designResponse.success) {
            setEmailDesign(designResponse.data);
            setBlocks(designResponse.data.blocks || []);
            setHistory([designResponse.data.blocks || []]);
            setHistoryIndex(0);
          } else {
            setError('Design non trouvé');
          }
        } else {
          // Create new design
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
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(err.message || 'Erreur lors du chargement des données');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Add a small delay to ensure proper component mounting
    const timer = setTimeout(loadInitialData, 100);
    
    return () => clearTimeout(timer);
  }, [designId, isEditMode]);

  // Auto-save functionality
  useEffect(() => {
    if (!emailDesign || !hasUnsavedChanges) return;
    
    const autoSaveTimer = setTimeout(async () => {
      if (emailDesign.id && blocks.length > 0) {
        try {
          await api.emailEditor.autoSave(emailDesign.id, blocks);
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
        } catch (err) {
          console.error('Auto-save failed:', err);
        }
      }
    }, 2000); // Auto-save after 2 seconds of inactivity
    
    return () => clearTimeout(autoSaveTimer);
  }, [emailDesign, blocks, hasUnsavedChanges]);

  // Handle drag end for reordering blocks
  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setBlocks((prevBlocks) => {
        const oldIndex = prevBlocks.findIndex(block => block.id === active.id);
        const newIndex = prevBlocks.findIndex(block => block.id === over.id);
        
        const newBlocks = arrayMove(prevBlocks, oldIndex, newIndex);
        
        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newBlocks);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        
        setHasUnsavedChanges(true);
        return newBlocks;
      });
    }
  }, [history, historyIndex]);

  // Add block to canvas
  const handleAddBlock = useCallback((blockType) => {
    const blockTypeData = availableBlockTypes.find(bt => bt.type === blockType);
    if (!blockTypeData) return;
    
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
      
      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newBlocks);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      setHasUnsavedChanges(true);
      return newBlocks;
    });
  }, [history, historyIndex]);

  // Delete block
  const handleDeleteBlock = useCallback((blockId) => {
    setBlocks(prevBlocks => {
      const newBlocks = prevBlocks.filter(block => block.id !== blockId);
      
      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newBlocks);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      setHasUnsavedChanges(true);
      return newBlocks;
    });
    
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  }, [selectedBlock, history, historyIndex]);

  // Undo/Redo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setBlocks(history[historyIndex - 1]);
      setHasUnsavedChanges(true);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setBlocks(history[historyIndex + 1]);
      setHasUnsavedChanges(true);
    }
  }, [history, historyIndex]);

  // Save design
  const handleSave = async () => {
    if (!emailDesign) return;
    
    setIsSaving(true);
    setError('');
    
    try {
      if (isEditMode) {
        // Update existing design
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
        // Create new design
        const response = await api.emailEditor.createDesign({
          name: emailDesign.name,
          subject: emailDesign.subject,
          preheader: emailDesign.preheader
        });
        
        if (response.success) {
          setEmailDesign(response.data);
          // Redirect to edit mode
          navigate(`/email-editor/${response.data.id}`, { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'éditeur...</p>
          <p className="text-gray-400 text-sm mt-2">Initialisation des composants...</p>
        </div>
      </div>
    );
  }

  if (error && (!emailDesign || availableBlockTypes.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Recharger la page
              </Button>
              <Button variant="outline" onClick={() => navigate('/campaigns')} className="w-full">
                Retour aux campagnes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ensure we have minimum required data before rendering the editor
  if (!emailDesign || availableBlockTypes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Finalisation du chargement...</p>
        </div>
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
              onClick={() => navigate('/campaigns')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
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
            {/* Undo/Redo */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
            >
              <Redo className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6" />
            
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
        <Alert variant="destructive" className="m-6">
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

export default EmailEditorPage;