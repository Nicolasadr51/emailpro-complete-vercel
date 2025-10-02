import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  Type, 
  Image, 
  MousePointer, 
  Minus, 
  MoveVertical,
  Plus,
  Square,
  Share2
} from 'lucide-react';

const iconMap = {
  'type': Type,
  'image': Image,
  'mouse-pointer': MousePointer,
  'minus': Minus,
  'move-vertical': MoveVertical,
  'plus': Plus,
  'square': Square,
  'share2': Share2
};

const DraggableBlockItem = ({ blockType, name, description, icon, onAddBlock }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `draggable-${blockType}`,
    data: {
      type: 'block-type',
      blockType: blockType
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const IconComponent = iconMap[icon] || Square;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        opacity: isDragging ? 0.5 : 1,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      {...listeners}
      {...attributes}
      className="group"
      onClick={() => onAddBlock(blockType)}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f1f5f9';
        e.currentTarget.style.borderColor = '#3b82f6';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#f8fafc';
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0px)';
      }}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div 
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#3b82f6',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
            }}
          >
            <IconComponent 
              style={{
                width: '20px',
                height: '20px',
                color: '#ffffff'
              }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p 
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0',
              lineHeight: '1.3'
            }}
          >
            {name}
          </p>
          <p 
            style={{
              fontSize: '13px',
              color: '#64748b',
              margin: '0',
              lineHeight: '1.3',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const BlockPalette = ({ blockTypes, onAddBlock }) => {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
          Éléments de base
        </h4>
        <div className="space-y-2">
          {blockTypes.map((blockType) => (
            <DraggableBlockItem
              key={blockType.type}
              blockType={blockType.type}
              name={blockType.name}
              description={blockType.description}
              icon={blockType.icon}
              onAddBlock={onAddBlock}
            />
          ))}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">
                Comment utiliser
              </h4>
              <div className="mt-1 text-xs text-blue-700">
                <ul className="space-y-1">
                  <li>• Cliquez sur un bloc pour l'ajouter</li>
                  <li>• Glissez-déposez pour réorganiser</li>
                  <li>• Cliquez sur un bloc dans le canvas pour le sélectionner</li>
                  <li>• Utilisez le panneau de droite pour modifier les propriétés</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockPalette;