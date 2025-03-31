export type ElementType = 'text' | 'heading' | 'image' | 'button' | 'divider' | 'spacer' | 'columns' | 'html' | 'social' | 'video';

export interface BaseSettings {
  width?: 'auto' | number;
  height?: 'auto' | number;
  verticalAlignment?: 'top' | 'middle' | 'bottom';
  horizontalAlignment?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  parentId?: string;
  columnIndex?: number;
  settings: BaseSettings & {
    [key: string]: any;
  };
}

export interface TextElement extends BaseElement {
  type: 'text';
  settings: BaseSettings & {
    content: string;
    fontSize: number;
    fontWeight: number | string;
    color: string;
    align: 'left' | 'center' | 'right';
  };
}

export interface HeadingElement extends BaseElement {
  type: 'heading';
  settings: BaseSettings & {
    content: string;
    fontSize: number;
    fontWeight: number | string;
    color: string;
    align: 'left' | 'center' | 'right';
    level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  };
}

export interface ImageElement extends BaseElement {
  type: 'image';
  settings: BaseSettings & {
    src: string;
    alt: string;
    align: 'left' | 'center' | 'right';
  };
}

export interface ButtonElement extends BaseElement {
  type: 'button';
  settings: BaseSettings & {
    text: string;
    url: string;
    backgroundColor: string;
    color: string;
    fontSize: number;
    fontWeight: number | string;
    borderRadius: number;
    align: 'left' | 'center' | 'right';
  };
}

export interface DividerElement extends BaseElement {
  type: 'divider';
  settings: BaseSettings & {
    color: string;
    thickness: number;
    style: 'solid' | 'dashed' | 'dotted';
  };
}

export interface SpacerElement extends BaseElement {
  type: 'spacer';
  settings: BaseSettings & {
    height: number;
  };
}

export interface ColumnsElement extends BaseElement {
  type: 'columns';
  settings: BaseSettings & {
    columns: number;
    columnGap: number;
    backgroundColor: string;
    borderRadius: number;
    padding: number;
  };
}

export interface HtmlElement extends BaseElement {
  type: 'html';
  settings: BaseSettings & {
    code: string;
  };
}

export interface SocialElement extends BaseElement {
  type: 'social';
  settings: BaseSettings & {
    networks: Array<{
      type: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
      url: string;
    }>;
    iconSize: number;
    iconSpacing: number;
    align: 'left' | 'center' | 'right';
    iconColor: string;
  };
}

export interface VideoElement extends BaseElement {
  type: 'video';
  settings: BaseSettings & {
    embedUrl: string;
    thumbnailUrl: string;
    altText: string;
    width: 'auto' | number;
    height: 'auto' | number;
  };
}

export type EmailElement =
  | TextElement
  | HeadingElement
  | ImageElement
  | ButtonElement
  | DividerElement
  | SpacerElement
  | ColumnsElement
  | HtmlElement
  | SocialElement
  | VideoElement;

const defaultBaseSettings: BaseSettings = {
  width: 'auto',
  height: 'auto',
  verticalAlignment: 'top',
  horizontalAlignment: 'left',
  backgroundColor: 'transparent',
  padding: {
    top: 16,
    right: 16,
    bottom: 16,
    left: 16
  },
  hideOnMobile: false,
  hideOnDesktop: false,
};

export const defaultElementSettings: Record<ElementType, Record<string, any>> = {
  text: {
    ...defaultBaseSettings,
    content: 'Edit this text',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000000',
    align: 'left',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    ...defaultBaseSettings,
    content: 'Main Heading',
    level: 'h1',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    align: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  image: {
    ...defaultBaseSettings,
    src: 'https://ouch-cdn2.icons8.com/hQYEZ_PeIWBUZl-BHUhF6T7jlvglw5CwTh1DkFfHD4I/rs:fit:455:456/czM6Ly9pY29uczgu/b3VjaC1wcm9kLmFz/c2V0cy9zdmcvOTA1/L2Q3MjdhZWI1LTdh/M2QtNDY3Ni1hNzNh/LTMzN2Q2MWNlMTZm/YS5zdmc.png',
    alt: 'Image',
    align: 'center',
  },
  button: {
    ...defaultBaseSettings,
    text: 'Click me',
    url: '#',
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    borderRadius: 4,
    fontSize: 16,
    fontWeight: 'medium',
    align: 'center',
  },
  divider: {
    ...defaultBaseSettings,
    color: '#E5E7EB',
    thickness: 1,
    style: 'solid',
  },
  spacer: {
    ...defaultBaseSettings,
    height: 24,
  },
  columns: {
    ...defaultBaseSettings,
    columns: 2,
    columnGap: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 4
  },
  html: {
    ...defaultBaseSettings,
    code: '<!-- Custom HTML code here -->',
  },
  social: {
    ...defaultBaseSettings,
    networks: [
      { type: 'facebook', url: 'https://facebook.com' },
      { type: 'twitter', url: 'https://twitter.com' },
      { type: 'instagram', url: 'https://instagram.com' },
      { type: 'linkedin', url: 'https://linkedin.com' }
    ],
    iconSize: 32,
    iconSpacing: 8,
    align: 'center',
    iconColor: '#3B82F6',
  },
  video: {
    ...defaultBaseSettings,
    embedUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    altText: 'Video preview',
    width: 'auto',
    height: 'auto',
  }
};

export const createNewElement = (type: ElementType, x: number, y: number): EmailElement => {
  const baseElement = {
    id: Math.random().toString(36).substring(2, 9),
    type,
    x,
    y,
    width: type === 'image' ? Math.min(600, window.innerWidth - 40) : 400,
    height: getDefaultHeight(type),
    settings: { ...defaultElementSettings[type] },
  };

  if (type === 'image') {
    (baseElement.settings as any).width = baseElement.width;
  }

  switch (type) {
    case 'text': return baseElement as TextElement;
    case 'heading': return baseElement as HeadingElement;
    case 'image': return baseElement as ImageElement;
    case 'button': return baseElement as ButtonElement;
    case 'divider': return baseElement as DividerElement;
    case 'spacer': return baseElement as SpacerElement;
    case 'columns': return baseElement as ColumnsElement;
    case 'html': return baseElement as HtmlElement;
    case 'social': return baseElement as SocialElement;
    case 'video': return baseElement as VideoElement;
    default: return baseElement as EmailElement;
  }
};

function getDefaultHeight(type: ElementType): number {
  switch (type) {
    case 'spacer': return 24;
    case 'image': return 400;
    case 'video': return 338; // 16:9 aspect ratio for 600px width
    case 'columns': return 200;
    case 'heading': return 60;
    case 'social': return 80;
    case 'html': return 120;
    default: return 40;
  }
}
