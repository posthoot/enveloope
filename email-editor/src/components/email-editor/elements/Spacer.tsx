
import React from 'react';
import { SpacerElement } from './index';
import { cn } from '@/lib/utils';

interface SpacerElementProps {
  element: SpacerElement;
  isSelected: boolean;
  onClick: () => void;
}

export const SpacerElementComponent: React.FC<SpacerElementProps> = ({
  element,
  isSelected,
  onClick,
}) => {
  const { height } = element.settings;

  return (
    <div
      className={cn(
        'email-element group cursor-pointer transition-all duration-150 border border-dashed border-gray-200', 
        isSelected && 'selected'
      )}
      style={{ 
        width: element.width, 
        height: `${height}px`,
      }}
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-full text-gray-400 text-xs">
        {height}px
      </div>
    </div>
  );
};
