import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Type,
  ImageIcon,
  MousePointer,
  Minus,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const SortableEmailBlock = ({ 
  block, 
  isSelected, 
  onSelect, 
  onUpdate, 
  onDelete, onDuplicate, 
  previewMode 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
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
  };

  const handleToggleVisibility = () => {
    onUpdate(block.id, { isVisible: !block.isVisible });
  };

  const handleDuplicate = () => {
    console.log('Duplicating block:', block.id);
    if (onDuplicate) {
      onDuplicate(block.id);
    } else {
      console.error('onDuplicate function not provided');
    }
  };

  const renderBlockContent = () => {
    const { content, style: blockStyle } = block;
    
    const baseStyle = {
      padding: `${blockStyle.spacing?.paddingTop || 10}px ${blockStyle.spacing?.paddingRight || 10}px ${blockStyle.spacing?.paddingBottom || 10}px ${blockStyle.spacing?.paddingLeft || 10}px`,
      backgroundColor: blockStyle.colors?.background || '#ffffff',
      color: blockStyle.colors?.text || '#000000',
      fontFamily: blockStyle.typography?.fontFamily || 'Arial, sans-serif',
      fontSize: `${blockStyle.typography?.fontSize || 14}px`,
      fontWeight: blockStyle.typography?.fontWeight || 'normal',
      textAlign: blockStyle.textAlign || 'left',
      lineHeight: blockStyle.typography?.lineHeight || 1.5,
      opacity: block.isVisible ? 1 : 0.5
    };

    switch (block.type) {
      case 'text':
        return (
          <div style={baseStyle}>
            {content.isRichText ? (
              <div 
                dangerouslySetInnerHTML={{ __html: content.text || '<p>Texte vide</p>' }}
              />
            ) : (
              <p>{content.text || 'Texte vide'}</p>
            )}
          </div>
        );

      case 'image':
        return (
          <div style={baseStyle}>
            {content.src ? (
              <img 
                src={content.src}
                alt={content.alt || 'Image'}
                style={{
                  maxWidth: '100%',
                  width: content.width || 'auto',
                  height: content.height || 'auto',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Cliquez pour ajouter une image</p>
              </div>
            )}
          </div>
        );

      case 'button':
        return (
          <div style={baseStyle}>
            <div style={{ textAlign: blockStyle.textAlign || 'center' }}>
              <a
                href={content.link || '#'}
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  backgroundColor: content.style === 'solid' ? (blockStyle.colors?.background || '#2563eb') : 'transparent',
                  color: content.style === 'solid' ? (blockStyle.colors?.text || '#ffffff') : (blockStyle.colors?.text || '#2563eb'),
                  border: content.style === 'outline' ? `2px solid ${blockStyle.colors?.text || '#2563eb'}` : 'none',
                  borderRadius: `${blockStyle.border?.radius || 4}px`,
                  textDecoration: content.style === 'link' ? 'underline' : 'none',
                  fontWeight: 'bold',
                  fontSize: `${blockStyle.typography?.fontSize || 14}px`
                }}
              >
                {content.text || 'Bouton'}
              </a>
            </div>
          </div>
        );

      case 'divider':
        return (
          <div style={baseStyle}>
            <hr
              style={{
                border: 'none',
                borderTop: `${content.thickness || 1}px ${content.style || 'solid'} ${content.color || '#cccccc'}`,
                margin: 0,
                width: '100%'
              }}
            />
          </div>
        );

      case 'spacer':
        return (
          <div 
            style={{
              ...baseStyle,
              height: `${content.height || 20}px`,
              minHeight: `${content.height || 20}px`
            }}
          >
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              Espacement ({content.height || 20}px)
            </div>
          </div>
        );

      case 'social':
        return (
          <div style={baseStyle}>
            <div className="flex justify-center space-x-4 py-4">
              {content.socialLinks && content.socialLinks.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                  <img src={link.icon} alt={link.platform} className="w-8 h-8" />
                </a>
              ))}
              {!content.socialLinks || content.socialLinks.length === 0 && (
                <p className="text-gray-500 text-sm">Ajoutez des liens sociaux</p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div style={baseStyle}>
            <div className="text-center text-gray-500 py-4">
              Bloc type "{block.type}" non supporté
            </div>
          </div>
        );
    }
  };

  const getBlockIcon = () => {
    switch (block.type) {
      case 'text': return Type;
      case 'image': return ImageIcon;
      case 'button': return MousePointer;
      case 'divider': return Minus;
      case 'social': return Share2;
      default: return Type;
    }
  };

  const BlockIcon = getBlockIcon();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isDragging ? 'opacity-50 scale-105 shadow-xl z-50' : ''}
        ${isHovered ? 'shadow-md' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Block content */}
      <div className="cursor-pointer">
        {renderBlockContent()}
      </div>

      {/* Block overlay with controls */}
      {(isSelected || isHovered) && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-10 pointer-events-none">
          {/* Top bar with controls */}
          <div className="absolute -top-10 left-0 right-0 flex items-center justify-between bg-white border border-gray-200 rounded-lg shadow-lg px-2 py-1 pointer-events-auto">
            <div className="flex items-center space-x-1">
              {/* Drag handle */}
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab hover:cursor-grabbing p-1 hover:bg-gray-100 rounded"
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>
              
              {/* Block type icon */}
              <div className="p-1">
                <BlockIcon className="w-4 h-4 text-gray-600" />
              </div>
              
              {/* Block name */}
              <span className="text-xs font-medium text-gray-700 capitalize">
                {block.type}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              {/* Toggle visibility */}
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleVisibility();
                }}
              >
                {block.isVisible ? (
                  <Eye className="w-4 h-4 text-gray-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </Button>
              
              {/* Duplicate */}
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDuplicate();
                }}
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </Button>
              
              {/* Delete */}
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-auto hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bloc ?')) {
                    onDelete();
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                Sélectionné
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SortableEmailBlock;