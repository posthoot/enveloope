declare module '@email-drag-n-dropper/email-editor' {
  export type ElementType = 'text' | 'heading' | 'image' | 'button' | 'divider' | 'spacer' | 'columns' | 'html' | 'social' | 'video';

  export interface BaseElement {
    id: string;
    type: ElementType;
    x: number;
    y: number;
    width: number;
    height: number;
    parentId?: string;
    columnIndex?: number;
    settings: Record<string, any>;
  }

  export interface BodySettings {
    backgroundColor: string;
    fontFamily: string;
    textColor: string;
    width: number;
    padding: number;
    lineHeight: number;
    backdropColor: string;
  }

  export interface EmailElement extends BaseElement {
    settings: {
      content?: string;
      fontSize?: number;
      fontWeight?: number | string;
      color?: string;
      align?: 'left' | 'center' | 'right';
      level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      src?: string;
      alt?: string;
      url?: string;
      backgroundColor?: string;
      borderRadius?: number;
      text?: string;
      thickness?: number;
      height?: number;
      columns?: number;
      columnGap?: number;
      padding?: number;
      code?: string;
      hideOnMobile?: boolean;
      hideOnDesktop?: boolean;
      networks?: Array<{
        type: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
        url: string;
      }>;
      iconSize?: number;
      iconSpacing?: number;
      iconColor?: string;
      embedUrl?: string;
      thumbnailUrl?: string;
      altText?: string;
    };
  }

  export interface EmailEditorProps {
    onSave?: (elements: EmailElement[]) => void;
    onPreview?: (html: string) => void;
    initialElements?: EmailElement[];
    initialBodySettings?: Partial<BodySettings>;
    onGenerateWithAI?: (prompt: string) => Promise<{
      elements: EmailElement[];
      bodySettings?: Partial<BodySettings>;
    }>;
  }

  export const EmailEditor: React.FC<EmailEditorProps>;

  export const emailTemplates: Array<{
    id: string;
    name: string;
    thumbnail: string;
    elements: EmailElement[];
  }>;

  export function generateEmailTemplate(prompt: string): Promise<{
    elements: EmailElement[];
    bodySettings: BodySettings;
  }>;
} 