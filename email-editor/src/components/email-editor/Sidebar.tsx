import React from 'react';
import { ElementType } from './elements';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Type, Image, AtSign, SeparatorHorizontal, 
  MousePointerClick, ArrowRight, AlignLeft, ArrowDown,
  Copy, Variable, FileText, Heading, Youtube, Code, 
  LayoutGrid, Share2, Square, Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { emailTemplates, emailVariables } from './templates';
import { toast } from 'sonner';
import { useDrag } from 'react-dnd';
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  onAddElement: (type: ElementType) => void;
  onLoadTemplate: (templateId: string) => void;
  onInsertVariable: (variablePlaceholder: string) => void;
}

const DraggableElement = ({ type, icon: Icon, label }: { type: ElementType; icon: any; label: string }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'element',
    item: () => ({ type }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={cn(
        "flex items-center gap-2 p-2 rounded-md cursor-move hover:bg-accent/50 transition-colors",
        isDragging && "opacity-50"
      )}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  onAddElement, 
  onLoadTemplate,
  onInsertVariable 
}) => {
  return (
    <Tabs defaultValue="elements" className="h-full flex flex-col">
      <TabsList className="w-full justify-start rounded-none border-b px-4 h-14">
        <TabsTrigger value="elements" className="data-[state=active]:bg-transparent">
          Elements
        </TabsTrigger>
        <TabsTrigger value="templates" className="data-[state=active]:bg-transparent">
          Templates
        </TabsTrigger>
        <TabsTrigger value="variables" className="data-[state=active]:bg-transparent">
          Variables
        </TabsTrigger>
      </TabsList>

      <ScrollArea className="flex-1">
        <TabsContent value="elements" className="m-0 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Basic Elements</h3>
              <div className="space-y-1">
                <DraggableElement type="text" icon={Type} label="Text" />
                <DraggableElement type="heading" icon={Heading} label="Heading" />
                <DraggableElement type="image" icon={Image} label="Image" />
                <DraggableElement type="button" icon={Square} label="Button" />
                <DraggableElement type="divider" icon={SeparatorHorizontal} label="Divider" />
                <DraggableElement type="spacer" icon={ArrowDown} label="Spacer" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Advanced Elements</h3>
              <div className="space-y-1">
                <DraggableElement type="social" icon={Share2} label="Social Links" />
                <DraggableElement type="video" icon={Youtube} label="Video" />
                <DraggableElement type="html" icon={Code} label="Custom HTML" />
                <DraggableElement type="columns" icon={LayoutGrid} label="Columns" />
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="m-0 p-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose a pre-designed template to start with
            </p>
            
            <div className="grid grid-cols-1 gap-4">
              {emailTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  className="h-auto p-0 overflow-hidden hover:shadow-md transition-all duration-200"
                  onClick={() => onLoadTemplate(template.id)}
                >
                  <div className="w-full aspect-[4/3] bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col">
                      <div className="h-8 bg-primary/10 border-b border-border"></div>
                      <div className="flex-1 p-2">
                        <div className="w-full h-4 bg-primary/5 rounded mb-2"></div>
                        <div className="w-3/4 h-4 bg-primary/5 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 text-left border-t border-border">
                    <h4 className="text-sm font-medium mb-1">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="variables" className="m-0 p-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Insert dynamic content into your email
            </p>
            
            <div className="space-y-2">
              {emailVariables.map((variable) => (
                <Button
                  key={variable.id}
                  variant="outline"
                  className="w-full justify-start gap-2 h-auto py-2"
                  onClick={() => onInsertVariable(variable.placeholder)}
                >
                  <Variable className="h-4 w-4 text-muted-foreground" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{variable.name}</div>
                    <div className="text-xs text-muted-foreground">{variable.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
};
