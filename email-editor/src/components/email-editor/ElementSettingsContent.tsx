import React from "react";
import { EmailElement } from "./elements";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ColorPicker } from "../ui/color-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ElementSettingsContentProps {
  element: EmailElement;
  onSettingsChange: (key: string, value: any) => void;
}

export const ElementSettingsContent: React.FC<ElementSettingsContentProps> = ({
  element,
  onSettingsChange,
}) => {
  const renderTextSettings = () => {
    if (element.type !== "text" && element.type !== "heading") return null;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Text Content</Label>
          <Textarea
            value={element.settings.content || ""}
            onChange={(e) => onSettingsChange("content", e.target.value)}
            placeholder="Enter text content..."
          />
        </div>
        <div className="space-y-2">
          <Label>Text Color</Label>
          <ColorPicker
            color={element.settings.color || "#000000"}
            onChange={(color) => onSettingsChange("color", color)}
          />
        </div>
        <div className="space-y-2">
          <Label>Font Size</Label>
          <Input
            type="number"
            value={element.settings.fontSize || 16}
            onChange={(e) => onSettingsChange("fontSize", parseInt(e.target.value))}
          />
        </div>
      </div>
    );
  };

  const renderImageSettings = () => {
    if (element.type !== "image") return null;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Image URL</Label>
          <Input
            value={element.settings.src || ""}
            onChange={(e) => onSettingsChange("src", e.target.value)}
            placeholder="Enter image URL..."
          />
        </div>
        <div className="space-y-2">
          <Label>Alt Text</Label>
          <Input
            value={element.settings.alt || ""}
            onChange={(e) => onSettingsChange("alt", e.target.value)}
            placeholder="Enter alt text..."
          />
        </div>
      </div>
    );
  };

  const renderButtonSettings = () => {
    if (element.type !== "button") return null;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Button Text</Label>
          <Input
            value={element.settings.text || ""}
            onChange={(e) => onSettingsChange("text", e.target.value)}
            placeholder="Enter button text..."
          />
        </div>
        <div className="space-y-2">
          <Label>Button URL</Label>
          <Input
            value={element.settings.url || ""}
            onChange={(e) => onSettingsChange("url", e.target.value)}
            placeholder="Enter button URL..."
          />
        </div>
        <div className="space-y-2">
          <Label>Background Color</Label>
          <ColorPicker
            color={element.settings.backgroundColor || "#000000"}
            onChange={(color) => onSettingsChange("backgroundColor", color)}
          />
        </div>
        <div className="space-y-2">
          <Label>Text Color</Label>
          <ColorPicker
            color={element.settings.color || "#ffffff"}
            onChange={(color) => onSettingsChange("color", color)}
          />
        </div>
      </div>
    );
  };

  const renderDividerSettings = () => {
    if (element.type !== "divider") return null;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Color</Label>
          <ColorPicker
            color={element.settings.color || "#000000"}
            onChange={(color) => onSettingsChange("color", color)}
          />
        </div>
        <div className="space-y-2">
          <Label>Thickness</Label>
          <Input
            type="number"
            value={element.settings.thickness || 1}
            onChange={(e) => onSettingsChange("thickness", parseInt(e.target.value))}
          />
        </div>
      </div>
    );
  };

  const renderSpacerSettings = () => {
    if (element.type !== "spacer") return null;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Height</Label>
          <Input
            type="number"
            value={element.settings.height || 20}
            onChange={(e) => onSettingsChange("height", parseInt(e.target.value))}
          />
        </div>
      </div>
    );
  };

  const renderSocialSettings = () => {
    if (element.type !== "social") return null;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Icon Size</Label>
          <Input
            type="number"
            value={element.settings.iconSize || 24}
            onChange={(e) => onSettingsChange("iconSize", parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label>Icon Color</Label>
          <ColorPicker
            color={element.settings.iconColor || "#000000"}
            onChange={(color) => onSettingsChange("iconColor", color)}
          />
        </div>
      </div>
    );
  };

  const renderVideoSettings = () => {
    if (element.type !== "video") return null;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Video URL</Label>
          <Input
            value={element.settings.embedUrl || ""}
            onChange={(e) => onSettingsChange("embedUrl", e.target.value)}
            placeholder="Enter video URL..."
          />
        </div>
      </div>
    );
  };

  const renderHtmlSettings = () => {
    if (element.type !== "html") return null;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Custom HTML</Label>
          <Textarea
            value={element.settings.code || ""}
            onChange={(e) => onSettingsChange("code", e.target.value)}
            placeholder="Enter custom HTML..."
          />
        </div>
      </div>
    );
  };

  const renderColumnsSettings = () => {
    if (element.type !== "columns") return null;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Number of Columns</Label>
          <Select
            value={String(element.settings.columns || 2)}
            onValueChange={(value) => onSettingsChange("columns", parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select number of columns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Columns</SelectItem>
              <SelectItem value="3">3 Columns</SelectItem>
              <SelectItem value="4">4 Columns</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Column Gap</Label>
          <Input
            type="number"
            value={element.settings.columnGap || 20}
            onChange={(e) => onSettingsChange("columnGap", parseInt(e.target.value))}
          />
        </div>
      </div>
    );
  };

  switch (element.type) {
    case "text":
    case "heading":
      return renderTextSettings();
    case "image":
      return renderImageSettings();
    case "button":
      return renderButtonSettings();
    case "divider":
      return renderDividerSettings();
    case "spacer":
      return renderSpacerSettings();
    case "social":
      return renderSocialSettings();
    case "video":
      return renderVideoSettings();
    case "html":
      return renderHtmlSettings();
    case "columns":
      return renderColumnsSettings();
    default:
      return null;
  }
}; 