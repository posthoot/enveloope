
import React from 'react';
import { ButtonElement } from './index';
import { cn } from '@/lib/utils';

interface ButtonElementProps {
  element: ButtonElement;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (element: ButtonElement) => void;
}

export const ButtonElementComponent: React.FC<ButtonElementProps> = ({
  element,
  isSelected,
  onClick,
  onUpdate,
}) => {
  const { text, backgroundColor, color, borderRadius, fontSize, fontWeight, align } = element.settings;

  return (
    <div
      className={cn(
        'email-element group cursor-pointer transition-all duration-150', 
        isSelected && 'selected'
      )}
      style={{ 
        width: element.width, 
        textAlign: align as any, 
      }}
      onClick={onClick}
    >
      <button
        type="button"
        className="py-2 px-4 min-w-32 transition-all duration-200 hover:opacity-90 active:scale-98"
        style={{ 
          backgroundColor, 
          color, 
          borderRadius: `${borderRadius}px`,
          fontSize: `${fontSize}px`,
          fontWeight, 
        }}
      >
        {text}
      </button>
    </div>
  );
};
