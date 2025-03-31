import React from 'react';
import { SocialElement } from './';
import { cn } from '@/lib/utils';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface SocialElementComponentProps {
  element: SocialElement;
  isSelected: boolean;
  onClick: () => void;
  onUpdate?: (element: SocialElement) => void;
}

const iconMap = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
};

export const SocialElementComponent: React.FC<SocialElementComponentProps> = ({
  element,
  isSelected,
  onClick,
  onUpdate,
}) => {
  const { networks, iconSize, iconSpacing, align, iconColor } = element.settings;

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
        textAlign: align,
      }}
    >
      <div
        className="flex gap-2 items-center"
        style={{
          justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
          gap: `${iconSpacing}px`,
        }}
      >
        {networks.map((network, index) => {
          const Icon = iconMap[network.type];
          return (
            <a
              key={index}
              href={network.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              onClick={(e) => {
                if (onUpdate) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <Icon
                size={iconSize}
                color={iconColor}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialElementComponent;
