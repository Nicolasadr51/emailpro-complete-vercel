import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { 
  Settings, 
  Type, 
  Palette, 
  Layout, 
  Link,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ColorPicker = ({ label, color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Label className="text-sm font-medium">{label}</Label>
      <div className="mt-1 relative">
        <button
          type="button"
          className="w-full h-10 border border-gray-300 rounded-md flex items-center px-3 space-x-2 hover:border-gray-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div 
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm text-gray-700">{color}</span>
        </button>
        
        {isOpen && (
          <div className="absolute top-12 left-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
            <HexColorPicker color={color} onChange={onChange} />
            <div className="mt-3 flex justify-end">
              <Button size="sm" onClick={() => setIsOpen(false)}>
                Fermer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BlockPropertiesPanel = ({ 
  block, 
  emailDesign, 
  onUpdateBlock, 
  onUpdateDesign 
}) => {
  if (!block && !emailDesign) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Sélectionnez un bloc pour modifier ses propriétés</p>
      </div>
    );
  }

  const updateBlockContent = (updates) => {
    if (!block) return;
    onUpdateBlock(block.id, {
      content: { ...block.content, ...updates }
    });
  };

  const updateBlockStyle = (updates) => {
    if (!block) return;
    onUpdateBlock(block.id, {
      style: { ...block.style, ...updates }
    });
  };

  const updateStyleProperty = (category, updates) => {
    if (!block) return;
    onUpdateBlock(block.id, {
      style: {
        ...block.style,
        [category]: { ...block.style[category], ...updates }
      }
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {block ? `Propriétés - ${block.type}` : 'Propriétés du design'}
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {!block && emailDesign && (
          // Email design properties
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuration de l'email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email-name">Nom du design</Label>
                <Input
                  id="email-name"
                  value={emailDesign.name || ''}
                  onChange={(e) => onUpdateDesign({ name: e.target.value })}
                  placeholder="Nom du design"
                />
              </div>
              
              <div>
                <Label htmlFor="email-subject">Sujet de l'email</Label>
                <Input
                  id="email-subject"
                  value={emailDesign.subject || ''}
                  onChange={(e) => onUpdateDesign({ subject: e.target.value })}
                  placeholder="Sujet de l'email"
                />
              </div>
              
              <div>
                <Label htmlFor="email-preheader">Preheader</Label>
                <Input
                  id="email-preheader"
                  value={emailDesign.preheader || ''}
                  onChange={(e) => onUpdateDesign({ preheader: e.target.value })}
                  placeholder="Texte d'aperçu"
                />
              </div>
              
              <div>
                <Label htmlFor="container-width">Largeur du conteneur (px)</Label>
                <Input
                  id="container-width"
                  type="number"
                  value={emailDesign.containerWidth || 600}
                  onChange={(e) => onUpdateDesign({ containerWidth: parseInt(e.target.value) })}
                  min="320"
                  max="800"
                />
              </div>
              
              <ColorPicker
                label="Couleur de fond"
                color={emailDesign.backgroundColor || '#f5f5f5'}
                onChange={(color) => onUpdateDesign({ backgroundColor: color })}
              />
            </CardContent>
          </Card>
        )}

        {block && (
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Contenu</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              {/* Content properties based on block type */}
              {block.type === 'text' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Type className="w-4 h-4 mr-2" />
                      Contenu texte
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="text-content">Texte</Label>
                      <ReactQuill
                        theme="snow"
                        ref={(el) => { this.quillRef = el; }}
                        value={block.content.text || ''}
                        onChange={(value) => updateBlockContent({ text: value })}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        HTML supporté: &lt;p&gt;, &lt;h1-h6&gt;, &lt;strong&gt;, &lt;em&gt;, etc.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {block.type === 'image' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Configuration image
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="image-src">URL de l'image</Label>
                      <Input
                        id="image-src"
                        type="url"
                        value={block.content.src || ''}
                        onChange={(e) => updateBlockContent({ src: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="image-alt">Texte alternatif</Label>
                      <Input
                        id="image-alt"
                        value={block.content.alt || ''}
                        onChange={(e) => updateBlockContent({ alt: e.target.value })}
                        placeholder="Description de l'image"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="image-link">Lien (optionnel)</Label>
                      <Input
                        id="image-link"
                        type="url"
                        value={block.content.link || ''}
                        onChange={(e) => updateBlockContent({ link: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="image-width">Largeur</Label>
                        <Input
                          id="image-width"
                          value={block.content.width || '100%'}
                          onChange={(e) => updateBlockContent({ width: e.target.value })}
                          placeholder="100%"
                        />
                      </div>
                      <div>
                        <Label htmlFor="image-height">Hauteur</Label>
                        <Input
                          id="image-height"
                          value={block.content.height || 'auto'}
                          onChange={(e) => updateBlockContent({ height: e.target.value })}
                          placeholder="auto"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {block.type === 'button' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Link className="w-4 h-4 mr-2" />
                      Configuration bouton
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="button-text">Texte du bouton</Label>
                      <Input
                        id="button-text"
                        ref={(el) => { this.quillRef = el; }}
                        value={block.content.text || ''}
                        onChange={(e) => updateBlockContent({ text: e.target.value })}
                        placeholder="Cliquez ici"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="button-link">Lien</Label>
                      <Input
                        id="button-link"
                        type="url"
                        value={block.content.link || ''}
                        onChange={(e) => updateBlockContent({ link: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="button-style">Style</Label>
                      <Select
                        value={block.content.style || 'solid'}
                        onValueChange={(value) => updateBlockContent({ style: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Plein</SelectItem>
                          <SelectItem value="outline">Contour</SelectItem>
                          <SelectItem value="link">Lien simple</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {block.type === 'divider' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Configuration séparateur</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="divider-style">Style</Label>
                      <Select
                        value={block.content.style || 'solid'}
                        onValueChange={(value) => updateBlockContent({ style: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Plein</SelectItem>
                          <SelectItem value="dashed">Pointillé</SelectItem>
                          <SelectItem value="dotted">Points</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="divider-thickness">Épaisseur (px)</Label>
                      <Input
                        id="divider-thickness"
                        type="number"
                        value={block.content.thickness || 1}
                        onChange={(e) => updateBlockContent({ thickness: parseInt(e.target.value) })}
                        min="1"
                        max="10"
                      />
                    </div>
                    
                    <ColorPicker
                      label="Couleur"
                      color={block.content.color || '#cccccc'}
                      onChange={(color) => updateBlockContent({ color })}
                    />
                  </CardContent>
                </Card>
              )}

              {block.type === 'spacer' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Configuration espacement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="spacer-height">Hauteur (px)</Label>
                      <Input
                        id="spacer-height"
                        type="number"
                        value={block.content.height || 20}
                        onChange={(e) => updateBlockContent({ height: parseInt(e.target.value) })}
                        min="1"
                        max="200"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="style" className="space-y-4">
              {/* Typography */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Type className="w-4 h-4 mr-2" />
                    Typographie
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="font-family">Police</Label>
                    <Select
                      value={block.style.typography?.fontFamily || 'Arial, sans-serif'}
                      onValueChange={(value) => updateStyleProperty('typography', { fontFamily: value })}
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
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="font-size">Taille (px)</Label>
                      <Input
                        id="font-size"
                        type="number"
                        value={block.style.typography?.fontSize || 14}
                        onChange={(e) => updateStyleProperty('typography', { fontSize: parseInt(e.target.value) })}
                        min="8"
                        max="72"
                      />
                    </div>
                    <div>
                      <Label htmlFor="font-weight">Graisse</Label>
                      <Select
                        value={block.style.typography?.fontWeight || 'normal'}
                        onValueChange={(value) => updateStyleProperty('typography', { fontWeight: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="bold">Gras</SelectItem>
                          <SelectItem value="lighter">Léger</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="line-height">Hauteur de ligne</Label>
                      <Input
                        id="line-height"
                        type="number"
                        step="0.1"
                        value={block.style.typography?.lineHeight || 1.5}
                        onChange={(e) => updateStyleProperty('typography', { lineHeight: parseFloat(e.target.value) })}
                        min="1"
                        max="3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="letter-spacing">Espacement (px)</Label>
                      <Input
                        id="letter-spacing"
                        type="number"
                        step="0.1"
                        value={block.style.typography?.letterSpacing || 0}
                        onChange={(e) => updateStyleProperty('typography', { letterSpacing: parseFloat(e.target.value) })}
                        min="-2"
                        max="10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Colors */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    Couleurs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ColorPicker
                    label="Couleur de fond"
                    color={block.style.colors?.background || '#ffffff'}
                    onChange={(color) => updateStyleProperty('colors', { background: color })}
                  />
                  <ColorPicker
                    label="Couleur du texte"
                    color={block.style.colors?.text || '#000000'}
                    onChange={(color) => updateStyleProperty('colors', { text: color })}
                  />
                </CardContent>
              </Card>

              {/* Border */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bordure</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="border-width">Largeur (px)</Label>
                      <Input
                        id="border-width"
                        type="number"
                        value={block.style.border?.width || 0}
                        onChange={(e) => updateStyleProperty('border', { width: parseInt(e.target.value) })}
                        min="0"
                        max="20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="border-radius">Rayon (px)</Label>
                      <Input
                        id="border-radius"
                        type="number"
                        value={block.style.border?.radius || 0}
                        onChange={(e) => updateStyleProperty('border', { radius: parseInt(e.target.value) })}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="border-style">Style</Label>
                    <Select
                      value={block.style.border?.style || 'solid'}
                      onValueChange={(value) => updateStyleProperty('border', { style: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Plein</SelectItem>
                        <SelectItem value="dashed">Pointillé</SelectItem>
                        <SelectItem value="dotted">Points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <ColorPicker
                    label="Couleur de bordure"
                    color={block.style.border?.color || '#cccccc'}
                    onChange={(color) => updateStyleProperty('border', { color })}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="layout" className="space-y-4">
              {/* Spacing */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Layout className="w-4 h-4 mr-2" />
                    Espacement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm font-medium">Padding (intérieur)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="padding-top">Haut</Label>
                      <Input id="padding-top" type="number" value={block.style.spacing?.paddingTop || 10} onChange={(e) => updateStyleProperty('spacing', { paddingTop: parseInt(e.target.value) })} />
                    </div>
                    <div>
                      <Label htmlFor="padding-bottom">Bas</Label>
                      <Input id="padding-bottom" type="number" value={block.style.spacing?.paddingBottom || 10} onChange={(e) => updateStyleProperty('spacing', { paddingBottom: parseInt(e.target.value) })} />
                    </div>
                    <div>
                      <Label htmlFor="padding-left">Gauche</Label>
                      <Input id="padding-left" type="number" value={block.style.spacing?.paddingLeft || 10} onChange={(e) => updateStyleProperty('spacing', { paddingLeft: parseInt(e.target.value) })} />
                    </div>
                    <div>
                      <Label htmlFor="padding-right">Droite</Label>
                      <Input id="padding-right" type="number" value={block.style.spacing?.paddingRight || 10} onChange={(e) => updateStyleProperty('spacing', { paddingRight: parseInt(e.target.value) })} />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <p className="text-sm font-medium">Margin (extérieur)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="margin-top">Haut</Label>
                      <Input id="margin-top" type="number" value={block.style.spacing?.marginTop || 0} onChange={(e) => updateStyleProperty('spacing', { marginTop: parseInt(e.target.value) })} />
                    </div>
                    <div>
                      <Label htmlFor="margin-bottom">Bas</Label>
                      <Input id="margin-bottom" type="number" value={block.style.spacing?.marginBottom || 0} onChange={(e) => updateStyleProperty('spacing', { marginBottom: parseInt(e.target.value) })} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alignment */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Alignement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-around">
                    <Button variant={block.style.textAlign === 'left' ? 'default' : 'outline'} size="icon" onClick={() => updateBlockStyle({ textAlign: 'left' })}>
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button variant={block.style.textAlign === 'center' ? 'default' : 'outline'} size="icon" onClick={() => updateBlockStyle({ textAlign: 'center' })}>
                      <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button variant={block.style.textAlign === 'right' ? 'default' : 'outline'} size="icon" onClick={() => updateBlockStyle({ textAlign: 'right' })}>
                      <AlignRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default BlockPropertiesPanel;

