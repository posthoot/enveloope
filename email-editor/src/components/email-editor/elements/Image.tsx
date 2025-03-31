import React, { useState, useRef } from 'react';
import { ImageElement } from './index';
import { cn } from '@/lib/utils';
import { Maximize2 } from 'lucide-react';

interface ImageElementProps {
  element: ImageElement;
  isSelected: boolean;
  onClick: () => void;
  onUpdate: (element: ImageElement) => void;
}

export const ImageElementComponent: React.FC<ImageElementProps> = ({
  element,
  isSelected,
  onClick,
  onUpdate,
}) => {
  const { src, alt, width, height, borderRadius } = element.settings;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  // Calculate aspect ratio for responsive scaling
  const aspectRatio = height / width;

  const handleImageError = () => {
    onUpdate({
      ...element,
      settings: {
        ...element.settings,
        src: 'https://ouch-cdn2.icons8.com/hQYEZ_PeIWBUZl-BHUhF6T7jlvglw5CwTh1DkFfHD4I/rs:fit:455:456/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvOTA1/L2Q3MjdhZWI1LTdh/M2QtNDY3Ni1hNzNh/LTMzN2Q2MWNlMTZm/YS5zdmc.png',
      },
    });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.pageX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;

      const deltaX = moveEvent.pageX - startX;
      const parentWidth = containerRef.current.parentElement?.clientWidth || 600;
      
      // Calculate new width, constrained between 100px and parent width
      const newWidth = Math.min(
        Math.max(100, startWidth + deltaX),
        Math.min(600, parentWidth) // Gmail max width constraint
      );

      // Calculate new height based on aspect ratio
      const newHeight = Math.round(newWidth * aspectRatio);

      // Update both element and settings dimensions
      onUpdate({
        ...element,
        width: newWidth,
        height: newHeight,
        settings: {
          ...element.settings,
          width: newWidth,
          height: newHeight,
        },
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'email-element group cursor-pointer transition-all duration-150',
        isSelected && 'selected',
        isResizing && 'select-none'
      )}
      onClick={onClick}
      style={{
        width: '100%',
        maxWidth: `${width}px`,
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* Gmail-like image container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: `${aspectRatio * 100}%`,
          minHeight: '50px',
          backgroundColor: '#f5f5f5'
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: `${borderRadius}px`,
            border: 0,
            display: 'block',
            outline: 'none',
            lineHeight: '100%',
            textDecoration: 'none',
            maxWidth: '100%',
            // @ts-expect-error Gmail-safe fallbacks for image rendering
            '-ms-interpolation-mode': 'bicubic',
            'font-family': 'sans-serif',
            'font-size': '15px',
            'font-weight': 'normal',
            'line-height': '15px',
            margin: 0,
            padding: 0,
          }}
          onError={handleImageError}
        />
      </div>

      {/* Resize handle */}
      {isSelected && (
        <div
          className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-sm border-2 border-white"
          onMouseDown={handleResizeStart}
        >
          <Maximize2 className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
};
