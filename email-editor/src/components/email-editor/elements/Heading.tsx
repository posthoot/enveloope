
import React, { useState } from 'react';
import { HeadingElement } from './index';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface HeadingElementProps {
  element: HeadingElement;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (element: HeadingElement) => void;
}

// Define the heading levels type explicitly to avoid complex union type
type HeadingLevel = 'h1' | 'h2' | 'h3';

export const HeadingElementComponent: React.FC<HeadingElementProps> = ({
  element,
  isSelected,
  onClick,
  onUpdate,
}) => {
  const { content, level, fontSize, fontWeight, color, align, fontFamily } = element.settings;
  const [editMode, setEditMode] = useState(false);
  const [editableContent, setEditableContent] = useState(content);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableContent(e.target.value);
  };

  const handleContentBlur = () => {
    setEditMode(false);
    if (editableContent !== content) {
      const updatedElement = {
        ...element,
        settings: {
          ...element.settings,
          content: editableContent
        }
      };
      onUpdate(updatedElement);
    }
  };

  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const renderHeading = () => {
    const headingProps = {
      className: cn(
        align === 'center' && 'text-center',
        align === 'right' && 'text-right'
      ),
      style: {
        fontSize: `${fontSize}px`,
        fontWeight,
        color,
        fontFamily
      }
    };

    if (editMode) {
      return (
        <Input
          value={editableContent}
          onChange={handleContentChange}
          onBlur={handleContentBlur}
          onKeyDown={handleContentKeyDown}
          autoFocus
          className="w-full"
          style={headingProps.style}
        />
      );
    }

    // Use a switch statement for heading level to avoid complex union type
    switch (level as HeadingLevel) {
      case 'h1':
        return <h1 {...headingProps}>{content}</h1>;
      case 'h2':
        return <h2 {...headingProps}>{content}</h2>;
      case 'h3':
        return <h3 {...headingProps}>{content}</h3>;
      default:
        return <h1 {...headingProps}>{content}</h1>;
    }
  };

  return (
    <div
      className={cn(
        'email-element group cursor-pointer py-2 px-1',
        isSelected && 'selected'
      )}
      style={{ width: element.width }}
      onClick={onClick}
      onDoubleClick={() => setEditMode(true)}
    >
      {renderHeading()}
    </div>
  );
};
