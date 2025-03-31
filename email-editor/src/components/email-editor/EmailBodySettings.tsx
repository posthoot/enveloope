import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EmailBodySettingsProps {
  settings: {
    backgroundColor: string;
    fontFamily: string;
    textColor: string;
    width: number;
    padding: number;
    lineHeight?: number;
    backdropColor: string;
  };
  onUpdate: (newSettings: Partial<EmailBodySettingsProps['settings']>) => void;
}

export const EmailBodySettings: React.FC<EmailBodySettingsProps> = ({
  settings,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Email Body Settings</h3>
      </div>
      
      <div className="space-y-4 pt-2">
        <div>
          <Label>Backdrop Color</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Input
              type="color"
              value={settings.backdropColor}
              onChange={(e) => onUpdate({ backdropColor: e.target.value })}
              className="w-12 h-8 p-1"
            />
            <Input
              type="text"
              value={settings.backdropColor}
              onChange={(e) => onUpdate({ backdropColor: e.target.value })}
              className="w-full flex-1"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            The color behind the email content area
          </p>
        </div>

        <div>
          <Label>Background Color</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="w-12 h-8 p-1"
            />
            <Input
              type="text"
              value={settings.backgroundColor}
              onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
              className="w-full flex-1"
            />
          </div>
        </div>
        
        <div>
          <Label>Default Text Color</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Input
              type="color"
              value={settings.textColor}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              className="w-12 h-8 p-1"
            />
            <Input
              type="text"
              value={settings.textColor}
              onChange={(e) => onUpdate({ textColor: e.target.value })}
              className="w-full flex-1"
            />
          </div>
        </div>
        
        <div>
          <Label>Font Family</Label>
          <Select 
            value={settings.fontFamily} 
            onValueChange={(value) => onUpdate({ fontFamily: value })}
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial, sans-serif">Arial</SelectItem>
              <SelectItem value="Helvetica, sans-serif">Helvetica</SelectItem>
              <SelectItem value="Times New Roman, serif">Times New Roman</SelectItem>
              <SelectItem value="Georgia, serif">Georgia</SelectItem>
              <SelectItem value="Courier New, monospace">Courier New</SelectItem>
              <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
              <SelectItem value="Tahoma, sans-serif">Tahoma</SelectItem>
              <SelectItem value="Trebuchet MS, sans-serif">Trebuchet MS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Line Height</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Slider
              value={[settings.lineHeight || 1.5]}
              min={1}
              max={2.5}
              step={0.1}
              onValueChange={(value) => onUpdate({ lineHeight: value[0] })}
              className="flex-1"
            />
            <span className="w-12 text-sm text-right">{settings.lineHeight || 1.5}</span>
          </div>
        </div>
        
        <div>
          <Label>Email Width (px)</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Slider
              value={[settings.width]}
              min={400}
              max={800}
              step={10}
              onValueChange={(value) => onUpdate({ width: value[0] })}
              className="flex-1"
            />
            <span className="w-12 text-sm text-right">{settings.width}px</span>
          </div>
        </div>
        
        <div>
          <Label>Content Padding (px)</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <Slider
              value={[settings.padding]}
              min={0}
              max={40}
              step={2}
              onValueChange={(value) => onUpdate({ padding: value[0] })}
              className="flex-1"
            />
            <span className="w-12 text-sm text-right">{settings.padding}px</span>
          </div>
        </div>
      </div>
    </div>
  );
};
