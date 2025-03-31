import React from 'react';
import { TextElement } from './index';
import { cn } from '@/lib/utils';

interface TextElementProps {
  element: TextElement;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (element: TextElement) => void;
  isDragging?: boolean;
  isDropTarget?: boolean;
}

export const TextElementComponent: React.FC<TextElementProps> = ({
  element,
  isSelected,
  onClick,
  onUpdate,
  isDragging = false,
  isDropTarget = false,
}) => {
  const { content, fontSize, fontWeight, color, align, fontFamily } = element.settings;

  return (
    <div
      className={cn(
        'email-element group cursor-pointer transition-all duration-150 relative',
        isSelected && 'selected',
        isDragging && 'select-none',
        isDropTarget && 'before:absolute before:inset-0 before:bg-primary/10 before:border-2 before:border-dashed before:border-primary/30 before:rounded-md before:pointer-events-none'
      )}
      onClick={onClick}
      style={{
        width: element.width === -1 ? '100%' : `${element.width}px`,
        height: element.height === -1 ? 'auto' : `${element.height}px`,
        minHeight: '1em',
      }}
    >
      <div
        contentEditable={!isDragging}
        suppressContentEditableWarning
        onBlur={(e) => {
          if (isDragging) return;
          const newContent = e.currentTarget.innerText;
          if (newContent !== content) {
            onUpdate({
              ...element,
              settings: {
                ...element.settings,
                content: newContent,
              },
            });
          }
        }}
        style={{
          fontSize: `${fontSize}px`,
          fontWeight,
          color,
          textAlign: align,
          fontFamily,
          width: '100%',
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          // Gmail-safe styles
          lineHeight: '1.5',
          margin: 0,
          padding: 0,
          userSelect: isDragging ? 'none' : 'text',
          cursor: isDragging ? 'move' : 'text',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {content}
      </div>
    </div>
  );
};
