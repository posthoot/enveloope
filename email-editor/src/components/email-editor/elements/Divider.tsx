
import React from 'react';
import { DividerElement } from './index';
import { cn } from '@/lib/utils';

interface DividerElementProps {
  element: DividerElement;
  isSelected: boolean;
  onClick: () => void;
}

export const DividerElementComponent: React.FC<DividerElementProps> = ({
  element,
  isSelected,
  onClick,
}) => {
  const { color, thickness, style } = element.settings;

  return (
    <div
      className={cn(
        'email-element group cursor-pointer transition-all duration-150 py-4', 
        isSelected && 'selected'
      )}
      style={{ 
        width: element.width, 
      }}
      onClick={onClick}
    >
      <div 
        className="w-full" 
        style={{ 
          borderTop: `${thickness}px ${style} ${color}`,
        }}
      />
    </div>
  );
};
