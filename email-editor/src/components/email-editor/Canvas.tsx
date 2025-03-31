import React, { forwardRef, useRef, useState, useImperativeHandle, useCallback, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { EmailElement, ElementType, createNewElement } from './elements';
import { TextElementComponent } from './elements/Text';
import { HeadingElementComponent } from './elements/Heading';
import { ImageElementComponent } from './elements/Image';
import { ButtonElementComponent } from './elements/Button';
import { DividerElementComponent } from './elements/Divider';
import { SpacerElementComponent } from './elements/Spacer';
import { ColumnsElementComponent } from './elements/Columns';
import { HtmlElementComponent } from './elements/Html';
import { SocialElementComponent } from './elements/Social';
import { VideoElementComponent } from './elements/Video';
import { ChevronUp, ChevronDown, Plus, Trash2, Type, Image, Square, SeparatorHorizontal, ArrowDown, Share2, Youtube, Code, LayoutGrid, Heading } from 'lucide-react';
import type { BodySettings } from './types';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface CanvasProps {
  onSelectElement: (element: EmailElement | null) => void;
  selectedElementId: string | null;
  onElementsChange: (elements: EmailElement[]) => void;
  elements: EmailElement[];
  bodySettings: BodySettings;
  deviceView: 'mobile' | 'desktop';
}

export interface CanvasHandle {
  addElement: (type: ElementType, x: number, y: number) => void;
  updateElement: (element: EmailElement) => void;
  deleteElement: (id: string) => void;
  getCanvasElement: () => HTMLDivElement | null;
  getBoundingClientRect: () => DOMRect;
  scrollTop: number;
  updateBodySettings: (settings: BodySettings) => void;
}

const elementComponents: Record<ElementType, React.ComponentType<any>> = {
  text: TextElementComponent,
  heading: HeadingElementComponent,
  image: ImageElementComponent,
  button: ButtonElementComponent,
  divider: DividerElementComponent,
  spacer: SpacerElementComponent,
  columns: ColumnsElementComponent,
  html: HtmlElementComponent,
  social: SocialElementComponent,
  video: VideoElementComponent,
};

interface DraggableElementWrapperProps {
  element: EmailElement;
  index: number;
  elements: EmailElement[];
  onElementsChange: (elements: EmailElement[]) => void;
  onSelectElement: (element: EmailElement | null) => void;
  isSelected: boolean;
  children: React.ReactNode;
}

interface AddElementButtonProps {
  index: number;
  elements: EmailElement[];
  onElementsChange: (elements: EmailElement[]) => void;
  onSelectElement: (element: EmailElement | null) => void;
}

const elementOptions = [
  { type: 'text' as ElementType, icon: Type, label: 'Text' },
  { type: 'heading' as ElementType, icon: Heading, label: 'Heading' },
  { type: 'image' as ElementType, icon: Image, label: 'Image' },
  { type: 'button' as ElementType, icon: Square, label: 'Button' },
  { type: 'divider' as ElementType, icon: SeparatorHorizontal, label: 'Divider' },
  { type: 'spacer' as ElementType, icon: ArrowDown, label: 'Spacer' },
  { type: 'social' as ElementType, icon: Share2, label: 'Social Links' },
  { type: 'video' as ElementType, icon: Youtube, label: 'Video' },
  { type: 'html' as ElementType, icon: Code, label: 'Custom HTML' },
  { type: 'columns' as ElementType, icon: LayoutGrid, label: 'Columns' },
];

const AddElementButton: React.FC<AddElementButtonProps> = ({ index, elements, onElementsChange, onSelectElement }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="absolute left-1/2 -bottom-4 -translate-x-1/2 p-1 bg-primary rounded-full shadow hover:bg-primary/90 text-white z-10"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Plus className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="center">
        <div className="grid grid-cols-2 gap-1">
          {elementOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                className="flex flex-col items-center gap-1 p-2 rounded hover:bg-accent text-sm"
                onClick={() => {
                  const newElement = createNewElement(option.type, 0, 0);
                  const newElements = [...elements];
                  newElements.splice(index + 1, 0, newElement);
                  onElementsChange(newElements);
                  onSelectElement(newElement);
                }}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{option.label}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const DraggableElementWrapper: React.FC<DraggableElementWrapperProps> = ({
  element,
  index,
  elements,
  onElementsChange,
  onSelectElement,
  isSelected,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'element',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'element',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const newElements = [...elements];
      const [draggedElement] = newElements.splice(dragIndex, 1);
      newElements.splice(hoverIndex, 0, draggedElement);
      onElementsChange(newElements);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const moveUp = () => {
    if (index === 0) return;
    const newElements = [...elements];
    const [element] = newElements.splice(index, 1);
    newElements.splice(index - 1, 0, element);
    onElementsChange(newElements);
  };

  const moveDown = () => {
    if (index === elements.length - 1) return;
    const newElements = [...elements];
    const [element] = newElements.splice(index, 1);
    newElements.splice(index + 1, 0, element);
    onElementsChange(newElements);
  };

  const deleteElement = () => {
    const newElements = [...elements];
    newElements.splice(index, 1);
    onElementsChange(newElements);
    onSelectElement(null);
  };

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cn(
        "relative",
        isDragging && "opacity-50",
        isSelected && "ring-2 ring-primary ring-offset-2",
        isOver && "after:absolute after:inset-0 after:border-2 after:border-primary after:rounded"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelectElement(element);
      }}
    >
      {isSelected && (
        <>
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1">
            <button
              className="p-1 bg-primary rounded hover:bg-primary/90 text-white"
              onClick={(e) => {
                e.stopPropagation();
                moveUp();
              }}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              className="p-1 bg-primary rounded hover:bg-primary/90 text-white"
              onClick={(e) => {
                e.stopPropagation();
                moveDown();
              }}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              className="p-1 bg-destructive rounded hover:bg-destructive/90 text-white"
              onClick={(e) => {
                e.stopPropagation();
                deleteElement();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <AddElementButton
            index={index}
            elements={elements}
            onElementsChange={onElementsChange}
            onSelectElement={onSelectElement}
          />
        </>
      )}
      {children}
    </div>
  );
};

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(
  ({ onSelectElement, selectedElementId, onElementsChange, elements, bodySettings, deviceView }, ref) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [dropTarget, setDropTarget] = useState<number | null>(null);

    const getChildElements = useCallback((parentId: string) => {
      return elements.filter(el => el.parentId === parentId);
    }, [elements]);

    const handleAddToColumn = useCallback((parentId: string, type: ElementType, columnIndex: number) => {
      const newElement = createNewElement(type, 0, 0);
      newElement.parentId = parentId;
      newElement.columnIndex = columnIndex;
      const newElements = [...elements, newElement];
      onElementsChange(newElements);
      onSelectElement(newElement);
    }, [elements, onElementsChange, onSelectElement]);

    const moveElement = useCallback((dragIndex: number, hoverIndex: number) => {
      const newElements = [...elements];
      const draggedElement = newElements[dragIndex];
      newElements.splice(dragIndex, 1);
      newElements.splice(hoverIndex, 0, draggedElement);
      onElementsChange(newElements);
    }, [elements, onElementsChange]);

    const addElementBelow = useCallback((index: number) => {
      const dropPosition = index + 1;
      setDropTarget(dropPosition);
    }, []);

    const moveElementUp = useCallback((index: number) => {
      if (index === 0) return;
      moveElement(index, index - 1);
    }, [moveElement]);

    const moveElementDown = useCallback((index: number) => {
      if (index === elements.length - 1) return;
      moveElement(index, index + 1);
    }, [moveElement, elements.length]);

    const deleteElement = useCallback((index: number) => {
      const newElements = [...elements];
      newElements.splice(index, 1);
      onElementsChange(newElements);
      onSelectElement(null);
    }, [elements, onElementsChange, onSelectElement]);

    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'element',
      drop: (item: { type: ElementType, index?: number }, monitor) => {
        const didDrop = monitor.didDrop();
        if (didDrop) return;

        const offset = monitor.getClientOffset();
        if (offset && canvasRef.current) {
          const canvasRect = canvasRef.current.getBoundingClientRect();
          const x = offset.x - canvasRect.left;
          const y = offset.y - canvasRect.top + canvasRef.current.scrollTop;
          
          if (typeof item.index === 'number') {
            // Reordering existing element
            const targetIndex = dropTarget ?? elements.length;
            moveElement(item.index, targetIndex);
          } else {
            // Adding new element from sidebar
            const newElement = createNewElement(item.type, x, y);
            const targetIndex = dropTarget ?? elements.length;
            const newElements = [...elements];
            newElements.splice(targetIndex, 0, newElement);
            onElementsChange(newElements);
            onSelectElement(newElement);
          }
        }
        setDropTarget(null);
      },
      hover: (item, monitor) => {
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset || !canvasRef.current) return;

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const y = clientOffset.y - canvasRect.top + canvasRef.current.scrollTop;
        
        // Find the closest element based on Y position
        let targetIndex = elements.length;
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const elementMiddle = element.y + element.height / 2;
          if (y < elementMiddle) {
            targetIndex = i;
            break;
          }
        }
        setDropTarget(targetIndex);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
    }), [elements, dropTarget, moveElement, onElementsChange, onSelectElement]);

    useImperativeHandle(ref, () => ({
      addElement: (type: ElementType, x: number, y: number) => {
        const newElement = createNewElement(type, x, y);
        const newElements = [...elements, newElement];
        onElementsChange(newElements);
        onSelectElement(newElement);
      },
      updateElement: (element: EmailElement) => {
        const newElements = elements.map(el => 
          el.id === element.id ? element : el
        );
        onElementsChange(newElements);
      },
      deleteElement: (id: string) => {
        const newElements = elements.filter(el => el.id !== id);
        onElementsChange(newElements);
        onSelectElement(null);
      },
      getCanvasElement: () => canvasRef.current,
      getBoundingClientRect: () => canvasRef.current?.getBoundingClientRect() ?? new DOMRect(),
      get scrollTop() {
        return canvasRef.current?.scrollTop ?? 0;
      },
      updateBodySettings: (settings: BodySettings) => {
        // This should be handled by the parent component through onUpdateBodySettings
        // The canvas just receives and applies the settings
      },
    }), [elements, onElementsChange, onSelectElement]);

    return (
      <div
        ref={drop}
        className={cn(
          "relative flex-1 min-h-screen max-h-screen overflow-y-auto p-8 bg-muted",
          isOver && "bg-primary/5"
        )}
        style={{ backgroundColor: bodySettings.backdropColor }}
      >
        <div
          ref={canvasRef}
          className={cn(
            "mx-auto bg-background shadow-lg transition-all duration-200 min-h-[500px] relative",
            deviceView === 'mobile' ? 'max-w-[375px]' : ''
          )}
          style={{
            width: deviceView === 'mobile' ? 375 : bodySettings.width,
            backgroundColor: bodySettings.backgroundColor,
            color: bodySettings.textColor,
            fontFamily: bodySettings.fontFamily,
            padding: bodySettings.padding,
            borderRadius: bodySettings.borderRadius,
            borderColor: bodySettings.borderColor,
            borderWidth: bodySettings.borderColor ? 1 : 0,
            borderStyle: 'solid',
          }}
          onClick={() => onSelectElement(null)}
        >
          {elements.filter(el => !el.parentId).map((element, index) => {
            const Component = elementComponents[element.type];
            const isDropTarget = dropTarget === index;
            
            if (element.type === 'columns') {
              // For columns, we need to render both the column container and its children
              const columnChildElements = elements.filter(el => el.parentId === element.id);
              
              return (
                <React.Fragment key={element.id}>
                  {isDropTarget && (
                    <div className="h-2 bg-primary/20 rounded-full mx-4 my-2 transition-all duration-200" />
                  )}
                  <DraggableElementWrapper
                    element={element}
                    index={index}
                    elements={elements}
                    onElementsChange={onElementsChange}
                    onSelectElement={onSelectElement}
                    isSelected={element.id === selectedElementId}
                  >
                    <Component
                      element={element}
                      isSelected={element.id === selectedElementId}
                      onClick={() => onSelectElement(element)}
                      onUpdate={(updatedElement: EmailElement) => {
                        const newElements = [...elements];
                        newElements[index] = updatedElement;
                        onElementsChange(newElements);
                      }}
                      childElements={columnChildElements}
                      onAddToColumn={handleAddToColumn}
                    >
                      {Array.from({ length: element.settings.columns }, (_, colIndex) => {
                        const columnElements = columnChildElements.filter(el => el.columnIndex === colIndex);
                        return columnElements.map((childElement) => {
                          const ChildComponent = elementComponents[childElement.type];
                          return (
                            <DraggableElementWrapper
                              key={childElement.id}
                              element={childElement}
                              index={elements.indexOf(childElement)}
                              elements={elements}
                              onElementsChange={onElementsChange}
                              onSelectElement={onSelectElement}
                              isSelected={childElement.id === selectedElementId}
                            >
                              <ChildComponent
                                element={childElement}
                                isSelected={childElement.id === selectedElementId}
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  onSelectElement(childElement);
                                }}
                                onUpdate={(updatedElement: EmailElement) => {
                                  const newElements = [...elements];
                                  const elementIndex = elements.findIndex(el => el.id === childElement.id);
                                  newElements[elementIndex] = updatedElement;
                                  onElementsChange(newElements);
                                }}
                              />
                            </DraggableElementWrapper>
                          );
                        });
                      })}
                    </Component>
                  </DraggableElementWrapper>
                </React.Fragment>
              );
            }

            // Render non-column elements normally
            return (
              <React.Fragment key={element.id}>
                {isDropTarget && (
                  <div className="h-2 bg-primary/20 rounded-full mx-4 my-2 transition-all duration-200" />
                )}
                <DraggableElementWrapper
                  element={element}
                  index={index}
                  elements={elements}
                  onElementsChange={onElementsChange}
                  onSelectElement={onSelectElement}
                  isSelected={element.id === selectedElementId}
                >
                  <Component
                    element={element}
                    isSelected={element.id === selectedElementId}
                    onClick={() => onSelectElement(element)}
                    onUpdate={(updatedElement: EmailElement) => {
                      const newElements = [...elements];
                      newElements[index] = updatedElement;
                      onElementsChange(newElements);
                    }}
                  />
                </DraggableElementWrapper>
              </React.Fragment>
            );
          })}
          {dropTarget === elements.length && (
            <div className="h-2 bg-primary/20 rounded-full mx-4 my-2 transition-all duration-200" />
          )}
        </div>
      </div>
    );
  }
);

Canvas.displayName = 'Canvas';
