import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableEmailBlock from './SortableEmailBlock';

const EmailCanvas = ({ 
  blocks, 
  selectedBlock, 
  onSelectBlock, 
  onUpdateBlock, 
  onDeleteBlock, onDuplicateBlock,
  previewMode,
  emailDesign 
}) => {
  const canvasWidth = previewMode === 'mobile' ? '320px' : '600px';
  const containerStyle = {
    width: canvasWidth,
    maxWidth: '100%',
    margin: '0 auto',
    backgroundColor: emailDesign?.backgroundColor || '#f5f5f5',
    minHeight: '400px'
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-medium text-gray-900">
          {emailDesign?.name || 'Nouveau design'}
        </h3>
        {emailDesign?.subject && (
          <p className="text-sm text-gray-600">Sujet: {emailDesign.subject}</p>
        )}
        <div className="text-xs text-gray-500 mt-1">
          {previewMode === 'mobile' ? 'Vue mobile (320px)' : 'Vue desktop (600px)'}
        </div>
      </div>

      <div 
        className="relative bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden"
        style={containerStyle}
      >
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Commencez votre design
            </h3>
            <p className="text-gray-500 text-sm max-w-xs">
              Utilisez la palette de blocs à gauche pour ajouter du contenu à votre email
            </p>
          </div>
        ) : (
          <SortableContext items={blocks.map(block => block.id)} strategy={verticalListSortingStrategy}>
            {blocks
              .sort((a, b) => a.order - b.order)
              .map((block) => (
                <SortableEmailBlock
                  key={block.id}
                  block={block}
                  isSelected={selectedBlock?.id === block.id}
                  onSelect={() => onSelectBlock(block)}
                  onUpdate={onUpdateBlock}
                  onDelete={() => onDeleteBlock(block.id)}
                  onDuplicate={onDuplicateBlock}
                  previewMode={previewMode}
                />
              ))}
          </SortableContext>
        )}
      </div>

      {/* Email metadata */}
      {emailDesign && (
        <div className="mt-4 text-xs text-gray-500 text-center max-w-md">
          <div className="space-y-1">
            {emailDesign.preheader && (
              <div>Preheader: {emailDesign.preheader}</div>
            )}
            <div>
              {blocks.length} bloc{blocks.length !== 1 ? 's' : ''} • 
              Dernière modification: {new Date(emailDesign.updatedAt || Date.now()).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailCanvas;