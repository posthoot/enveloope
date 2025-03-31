import React, { useState, memo, useCallback } from "react";
import {
  Trash2,
  Type,
  Image,
  AtSign,
  Maximize2,
  SeparatorHorizontal,
  ArrowDown,
  Heading,
  Youtube,
  Code,
  LayoutGrid,
  Share2,
  Palette,
  Grid,
  Layout,
  Square,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  EmailElement,
  TextElement,
  ImageElement,
  ButtonElement,
  DividerElement,
  SpacerElement,
  HeadingElement,
  SocialElement,
  VideoElement,
  HtmlElement,
  ColumnsElement,
  ElementType,
} from "./elements";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ElementSettingsContent } from "./ElementSettingsContent";
interface CanvasBackgroundSettings {
  type: 'color' | 'pattern' | 'image';
  value: string;
  opacity?: number;
}

interface ElementSettingsProps {
  selectedElement: EmailElement | null;
  onUpdateElement: (updatedElement: EmailElement) => void;
  handleDeleteElement: () => void;
  canvasBackground?: CanvasBackgroundSettings;
  onUpdateCanvasBackground?: (settings: CanvasBackgroundSettings) => void;
  bodySettings?: {
    backgroundColor: string;
    fontFamily: string;
    textColor: string;
    width: number;
    padding: number;
    backdropColor: string;
  };
  onUpdateBodySettings?: (settings: any) => void;
}

const ResponsiveSettings = ({
  hideOnMobile,
  hideOnDesktop,
  onChange,
}: {
  hideOnMobile: boolean;
  hideOnDesktop: boolean;
  onChange: (key: string, value: boolean) => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hide-on-mobile"
          checked={hideOnMobile}
          onCheckedChange={(checked) => onChange('hideOnMobile', checked as boolean)}
        />
        <Label htmlFor="hide-on-mobile" className="text-sm cursor-pointer">
          Hide on Mobile
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="hide-on-desktop"
          checked={hideOnDesktop}
          onCheckedChange={(checked) => onChange('hideOnDesktop', checked as boolean)}
        />
        <Label htmlFor="hide-on-desktop" className="text-sm cursor-pointer">
          Hide on Desktop
        </Label>
      </div>
    </div>
  );
};

const DimensionSettings = ({
  width,
  height,
  onChange,
}: {
  width: number;
  height: number;
  onChange: (key: string, value: number | 'auto') => void;
}) => {
  const [isAutoWidth, setIsAutoWidth] = useState(width === 0);
  const [isAutoHeight, setIsAutoHeight] = useState(height === 0);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Width</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto-width"
              checked={isAutoWidth}
              onCheckedChange={(checked) => {
                setIsAutoWidth(!!checked);
                onChange('width', checked ? -1 : width || 400);
              }}
            />
            <Label htmlFor="auto-width" className="text-sm cursor-pointer">
              Auto
            </Label>
          </div>
        </div>
        {!isAutoWidth && (
          <div className="flex items-center gap-2">
            <Slider
              value={[width > 0 ? width : 400]}
              min={100}
              max={800}
              step={10}
              onValueChange={(value) => onChange('width', value[0])}
            />
            <span className="w-12 text-sm">{width > 0 ? width : 400}px</span>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Height</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto-height"
              checked={isAutoHeight}
              onCheckedChange={(checked) => {
                setIsAutoHeight(!!checked);
                onChange('height', checked ? -1 : height || 40);
              }}
            />
            <Label htmlFor="auto-height" className="text-sm cursor-pointer">
              Auto
            </Label>
          </div>
        </div>
        {!isAutoHeight && (
          <div className="flex items-center gap-2">
            <Slider
              value={[height > 0 ? height : 40]}
              min={20}
              max={800}
              step={10}
              onValueChange={(value) => onChange('height', value[0])}
            />
            <span className="w-12 text-sm">{height > 0 ? height : 40}px</span>
          </div>
        )}
      </div>
    </div>
  );
};

const CanvasBackgroundSettings: React.FC<{
  settings: CanvasBackgroundSettings;
  onChange: (settings: CanvasBackgroundSettings) => void;
}> = ({ settings, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>Background Type</Label>
        <Select
          value={settings.type}
          onValueChange={(value: 'color' | 'pattern' | 'image') => 
            onChange({ ...settings, type: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="color">
              <div className="flex items-center gap-2">
                <Palette size={16} />
                <span>Solid Color</span>
              </div>
            </SelectItem>
            <SelectItem value="pattern">
              <div className="flex items-center gap-2">
                <Grid size={16} />
                <span>Pattern</span>
              </div>
            </SelectItem>
            <SelectItem value="image">
              <div className="flex items-center gap-2">
                <Image size={16} />
                <span>Image</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {settings.type === 'color' && (
        <div>
          <Label>Color</Label>
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={settings.value}
              onChange={(e) => onChange({ ...settings, value: e.target.value })}
              className="w-12 h-8 p-1"
            />
            <Input
              type="text"
              value={settings.value}
              onChange={(e) => onChange({ ...settings, value: e.target.value })}
              className="flex-1"
              placeholder="#000000"
            />
          </div>
        </div>
      )}

      {settings.type === 'pattern' && (
        <div>
          <Label>Pattern</Label>
          <Select
            value={settings.value}
            onValueChange={(value) => onChange({ ...settings, value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select pattern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="repeating-conic-gradient(#f8fafc 0% 25%, #f1f5f9 0% 50%) 50px 50px / 100px 100px">
                Checkerboard Light
              </SelectItem>
              <SelectItem value="repeating-linear-gradient(45deg, #f1f5f9 25%, transparent 25%, transparent 75%, #f1f5f9 75%, #f1f5f9) 0 0 / 60px 60px">
                Diagonal Lines
              </SelectItem>
              <SelectItem value="radial-gradient(#f1f5f9 2px, transparent 2px) 0 0 / 40px 40px">
                Dots
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {settings.type === 'image' && (
        <div>
          <Label>Image URL</Label>
          <Input
            type="text"
            value={settings.value}
            onChange={(e) => onChange({ ...settings, value: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      <div>
        <Label>Opacity</Label>
        <div className="flex items-center gap-2">
          <Slider
            value={[settings.opacity ?? 1]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={(value) => onChange({ ...settings, opacity: value[0] })}
          />
          <span className="w-12 text-sm">{(settings.opacity ?? 1) * 100}%</span>
        </div>
      </div>
    </div>
  );
};

export const ElementSettings: React.FC<ElementSettingsProps> = memo(({
  selectedElement,
  onUpdateElement,
  handleDeleteElement,
}) => {
  const handleSettingsChange = useCallback((key: string, value: any) => {
    if (!selectedElement) return;

    const updatedElement = {
      ...selectedElement,
      settings: {
        ...selectedElement.settings,
        [key]: value,
      },
    } as EmailElement;

    onUpdateElement(updatedElement);
  }, [selectedElement, onUpdateElement]);

  if (!selectedElement) return null;

  return (
    <div className="h-full flex flex-col">
      <div className="h-14 border-b flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          {getElementIcon(selectedElement.type)}
          <span className="font-medium">{getElementLabel(selectedElement.type)}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={handleDeleteElement}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Common Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Element Settings</h3>
            <ElementSettingsContent
              element={selectedElement}
              onSettingsChange={handleSettingsChange}
            />
          </div>

          {/* Responsive Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Responsive Settings</h3>
            <ResponsiveSettings
              hideOnMobile={selectedElement.settings.hideOnMobile || false}
              hideOnDesktop={selectedElement.settings.hideOnDesktop || false}
              onChange={handleSettingsChange}
            />
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Dimensions</h3>
            <DimensionSettings
              width={selectedElement.width}
              height={selectedElement.height}
              onChange={(key, value) => {
                const updatedElement = {
                  ...selectedElement,
                  [key]: value,
                } as EmailElement;
                onUpdateElement(updatedElement);
              }}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
});

const getElementLabel = (type: ElementType): string => {
  switch (type) {
    case "text":
      return "Text Block";
    case "heading":
      return "Heading";
    case "image":
      return "Image";
    case "button":
      return "Button";
    case "divider":
      return "Divider";
    case "spacer":
      return "Spacer";
    case "social":
      return "Social Links";
    case "video":
      return "Video";
    case "html":
      return "Custom HTML";
    case "columns":
      return "Columns";
    default:
      return "Element";
  }
};

const getElementIcon = (type: ElementType) => {
  switch (type) {
    case "text":
      return <Type className="h-4 w-4" />;
    case "heading":
      return <Heading className="h-4 w-4" />;
    case "image":
      return <Image className="h-4 w-4" />;
    case "button":
      return <Square className="h-4 w-4" />;
    case "divider":
      return <SeparatorHorizontal className="h-4 w-4" />;
    case "spacer":
      return <ArrowDown className="h-4 w-4" />;
    case "social":
      return <Share2 className="h-4 w-4" />;
    case "video":
      return <Youtube className="h-4 w-4" />;
    case "html":
      return <Code className="h-4 w-4" />;
    case "columns":
      return <LayoutGrid className="h-4 w-4" />;
    default:
      return null;
  }
};
