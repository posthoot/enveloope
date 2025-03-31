import React from 'react';
import { HtmlElement } from './';
import { cn } from '@/lib/utils';

interface HtmlElementComponentProps {
  element: HtmlElement;
  isSelected: boolean;
  onClick: () => void;
  onUpdate?: (element: HtmlElement) => void;
}

export const HtmlElementComponent: React.FC<HtmlElementComponentProps> = ({
  element,
  isSelected,
  onClick,
  onUpdate,
}) => {
  const { code } = element.settings;

  return (
    <div
      className={cn(
        'relative p-4 border rounded-md',
        isSelected && 'border-primary',
        !isSelected && 'border-transparent hover:border-gray-200'
      )}
      onClick={onClick}
      style={{
        width: element.width,
        minHeight: element.height,
      }}
    >
      {/* Preview mode: render HTML directly */}
      {!onUpdate && (
        <div dangerouslySetInnerHTML={{ __html: code }} />
      )}

      {/* Edit mode: show code in pre tag */}
      {onUpdate && (
        <pre className="p-2 bg-gray-50 rounded overflow-auto text-sm">
          {code}
        </pre>
      )}
    </div>
  );
};

export default HtmlElementComponent; 