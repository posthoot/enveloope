import React from 'react';
import { ColumnsElement, EmailElement, ElementType } from './index';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Type, Image, AtSign, SeparatorHorizontal, ArrowDown, Heading, Youtube, Code, Share2 } from 'lucide-react';
import { useDrop } from 'react-dnd';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColumnsElementProps {
  element: ColumnsElement;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (element: ColumnsElement) => void;
  childElements: EmailElement[];
  onAddToColumn: (parentId: string, type: ElementType, columnIndex: number) => void;
  children?: React.ReactNode;
}

const elementTypes: Array<{ type: ElementType; icon: React.ReactNode; label: string }> = [
  { type: 'heading', icon: <Heading size={16} />, label: 'Heading' },
  { type: 'text', icon: <Type size={16} />, label: 'Text' },
  { type: 'image', icon: <Image size={16} />, label: 'Image' },
  { type: 'button', icon: <AtSign size={16} />, label: 'Button' },
  { type: 'divider', icon: <SeparatorHorizontal size={16} />, label: 'Divider' },
  { type: 'spacer', icon: <ArrowDown size={16} />, label: 'Spacer' },
  { type: 'social', icon: <Share2 size={16} />, label: 'Social' },
  { type: 'video', icon: <Youtube size={16} />, label: 'Video' },
  { type: 'html', icon: <Code size={16} />, label: 'HTML' },
];

const ColumnDropZone: React.FC<{
  columnIndex: number;
  parentId: string;
  isSelected: boolean;
  onAddToColumn: (parentId: string, type: ElementType, columnIndex: number) => void;
  children: React.ReactNode;
}> = ({ columnIndex, parentId, isSelected, onAddToColumn, children }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'element',
    drop: (item: { type: ElementType; index?: number }, monitor) => {
      if (monitor.didDrop()) return;
      
      if (item.type) {
        onAddToColumn(parentId, item.type, columnIndex);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  }), [columnIndex, parentId, onAddToColumn]);

  return (
    <div
      ref={drop}
      className={cn(
        "relative min-h-[100px] rounded p-4",
        isSelected && "outline-dashed outline-1 outline-primary/50",
        isOver && canDrop && "bg-primary/5",
        !children && "flex flex-col items-center justify-center"
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children || (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {isOver ? "Drop element here" : "Empty Column"}
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Element
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="center">
              <div className="grid grid-cols-2 gap-1">
                {elementTypes.map((option) => (
                  <button
                    key={option.type}
                    className="flex flex-col items-center gap-1 p-2 rounded hover:bg-accent text-sm"
                    onClick={() => onAddToColumn(parentId, option.type, columnIndex)}
                  >
                    {option.icon}
                    <span className="text-xs">{option.label}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      {children && isSelected && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="absolute left-1/2 -bottom-4 -translate-x-1/2 p-1 bg-primary rounded-full shadow hover:bg-primary/90 text-white z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <Plus className="h-4 w-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="center">
            <div className="grid grid-cols-2 gap-1">
              {elementTypes.map((option) => (
                <button
                  key={option.type}
                  className="flex flex-col items-center gap-1 p-2 rounded hover:bg-accent text-sm"
                  onClick={() => onAddToColumn(parentId, option.type, columnIndex)}
                >
                  {option.icon}
                  <span className="text-xs">{option.label}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export const ColumnsElementComponent: React.FC<ColumnsElementProps> = ({
  element,
  isSelected,
  onClick,
  onUpdate,
  childElements,
  onAddToColumn,
  children
}) => {
  const { columns, columnGap, backgroundColor, padding, borderRadius } = element.settings;

  const handleColumnClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <div
      className={cn(
        "relative p-4 rounded-md transition-all",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
      style={{
        backgroundColor,
        padding,
        borderRadius,
      }}
      onClick={handleColumnClick}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${columnGap}px`,
        }}
      >
        {Array.from({ length: columns }, (_, i) => {
          const columnChildElements = childElements.filter(el => el.columnIndex === i);
          return (
            <ColumnDropZone
              key={i}
              columnIndex={i}
              parentId={element.id}
              isSelected={isSelected}
              onAddToColumn={onAddToColumn}
            >
              {columnChildElements.length > 0 && (
                <div className="space-y-4">
                  {children}
                </div>
              )}
            </ColumnDropZone>
          );
        })}
      </div>
    </div>
  );
};

export default ColumnsElementComponent;
