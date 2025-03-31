import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { EmailElement } from './elements';
import { TextElementComponent } from './elements/Text';
import { ImageElementComponent } from './elements/Image';
import { ButtonElementComponent } from './elements/Button';
import { DividerElementComponent } from './elements/Divider';
import { SpacerElementComponent } from './elements/Spacer';
import { HeadingElementComponent } from './elements/Heading';
import { SocialElementComponent } from './elements/Social';
import { VideoElementComponent } from './elements/Video';
import { HtmlElementComponent } from './elements/Html';
import { ColumnsElementComponent } from './elements/Columns';
import { EyeOff, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  elements: EmailElement[];
  width: number;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, elements, width }) => {
  const [isMobileView, setIsMobileView] = useState(false);
  
  const renderElement = (element: EmailElement) => {
    if (element.settings.hideOnMobile && isMobileView) return null;
    if (element.settings.hideOnDesktop && !isMobileView) return null;
    
    // Dummy handlers - preview is read-only
    const noop = () => {};
    
    switch (element.type) {
      case 'text':
        return (
          <TextElementComponent
            key={element.id}
            element={element}
            isSelected={false}
            onClick={noop}
            onUpdate={noop}
          />
        );
      case 'heading':
        return (
          <HeadingElementComponent
            key={element.id}
            element={element}
            isSelected={false}
            onClick={noop}
            onUpdate={noop}
          />
        );
      case 'image':
        return (
          <ImageElementComponent
            key={element.id}
            element={element}
            isSelected={false}
            onClick={noop}
            onUpdate={noop}
          />
        );
      case 'button':
        return (
          <ButtonElementComponent
            key={element.id}
            element={element}
            isSelected={false}
            onClick={noop}
            onUpdate={noop}
          />
        );
      case 'divider':
        return (
          <DividerElementComponent
            key={element.id}
            element={element}
            isSelected={false}
            onClick={noop}
          />
        );
      case 'spacer':
        return (
          <SpacerElementComponent
            key={element.id}
            element={element}
            isSelected={false}
            onClick={noop}
          />
        );
      case 'social':
        return (
          <SocialElementComponent
            key={element.id}
            element={element}
            isSelected={false}
            onClick={noop}
            onUpdate={noop}
          />
        );
      case 'video':
        return (
          <VideoElementComponent
            key={element.id}
            element={element}
            isSelected={false}
            onClick={noop}
            onUpdate={noop}
          />
        );
      case 'html':
        return (
          <HtmlElementComponent
            key={element.id}
            element={element}
            isSelected={false}
            onClick={noop}
            onUpdate={noop}
          />
        );
      case 'columns':
        // Find child elements for this column
        const childElements = elements.filter(e => e.parentId === element.id);
        return (
          <ColumnsElementComponent
            key={element.id}
            element={element}
            isSelected={false}
            onClick={noop}
            onUpdate={noop}
            childElements={childElements}
            onAddToColumn={noop}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="text-lg font-medium">Email Preview</div>
          <div className="flex items-center gap-2">
            <Button
              variant={isMobileView ? "outline" : "secondary"}
              size="sm"
              onClick={() => setIsMobileView(false)}
              className={cn("gap-2", !isMobileView && "bg-primary/10")}
            >
              <Monitor size={16} />
              <span>Desktop</span>
            </Button>
            <Button
              variant={!isMobileView ? "outline" : "secondary"}
              size="sm"
              onClick={() => setIsMobileView(true)}
              className={cn("gap-2", isMobileView && "bg-primary/10")}
            >
              <Smartphone size={16} />
              <span>Mobile</span>
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 bg-slate-100 rounded-md">
          <div 
            className={cn(
              "mx-auto bg-white rounded-md shadow-md overflow-auto transition-all duration-300",
              isMobileView && "max-w-[375px]"
            )}
            style={{ width: isMobileView ? '375px' : `${width}px`, maxWidth: '100%' }}
          >
            {elements.length === 0 ? (
              <div className="p-8 text-center">
                <EyeOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">No content to preview</h3>
                <p className="text-sm text-muted-foreground">
                  Add elements to your email to see a preview.
                </p>
              </div>
            ) : (
              <div className="p-4">
                {elements
                  .filter(e => !e.parentId) // Only render top-level elements
                  .sort((a, b) => a.y - b.y)
                  .map(renderElement)}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
