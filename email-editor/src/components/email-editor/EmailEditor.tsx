import React, { useState, useRef, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sidebar } from './Sidebar';
import { Canvas, CanvasHandle } from './Canvas';
import { SettingsPanel } from './SettingsPanel';
import {
  EmailElement as ImportedEmailElement,
  ElementType,
  createNewElement,
  TextElement,
  HeadingElement,
  ImageElement,
  ButtonElement,
  DividerElement,
  SpacerElement,
  ColumnsElement,
  HtmlElement,
  SocialElement,
  VideoElement,
} from './elements';
import { TopBar } from './TopBar';
import type { BodySettings } from './types';

interface BaseSettings {
  hideOnMobile?: boolean;
  hideOnDesktop?: boolean;
}

type EmailElement = ImportedEmailElement & {
  settings: BaseSettings & ImportedEmailElement['settings'];
};

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

export interface EmailTemplate {
  version: string;
  elements: EmailElement[];
  bodySettings: BodySettings;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({
  onSave,
  onPreview,
  initialElements = [],
  initialBodySettings = {},
  onGenerateWithAI
}) => {
  const [selectedElement, setSelectedElement] = useState<EmailElement | null>(null);
  const [elements, setElements] = useState<EmailElement[]>(initialElements);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [view, setView] = useState<'edit' | 'preview' | 'code'>('edit');
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('desktop');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [codeView, setCodeView] = useState<'html' | 'json'>('html');
  const canvasRef = useRef<CanvasHandle>(null);

  const [bodySettings, setBodySettings] = useState<BodySettings>({
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    textColor: '#000000',
    width: 600,
    padding: 20,
    lineHeight: 1.5,
    backdropColor: '#f7f7f7',
    ...initialBodySettings,
  });

  const handleUpdateElement = useCallback((updatedElement: EmailElement) => {
    setSelectedElement(updatedElement);
    const newElements = elements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    );
    setElements(newElements);
  }, [elements]);

  const handleAddElement = useCallback((type: ElementType) => {
    if (!canvasRef.current) return;
    const canvasElement = canvasRef.current.getCanvasElement();
    if (!canvasElement) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scrollTop = canvasRef.current.scrollTop;

    const x = canvasRect.width / 2;
    const y = scrollTop + canvasRect.height / 2;

    canvasRef.current.addElement(type, x, y);
  }, []);

  const handleDeleteElement = useCallback(() => {
    if (selectedElement) {
      const newElements = elements.filter(el => el.id !== selectedElement.id);
      setElements(newElements);
      setSelectedElement(null);
    }
  }, [selectedElement, elements]);

  const handleLoadTemplate = useCallback((templateId: string) => {
    // Template loading logic
  }, []);

  const handleInsertVariable = useCallback((variable: string) => {
    // Variable insertion logic
  }, []);

  const updateEmailBodySettings = useCallback((newSettings: Partial<BodySettings>) => {
    setBodySettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  }, []);

  const getHTML = useCallback(() => {
    let html = '';
    elements.forEach(element => {
      const hideOnMobile = element.settings.hideOnMobile ? ' data-hide-on-mobile="true"' : '';
      const hideOnDesktop = element.settings.hideOnDesktop ? ' data-hide-on-desktop="true"' : '';

      switch (element.type) {
        case 'text': {
          const settings = element.settings as TextElement['settings'];
          html += `<p style="color: ${settings.color}; font-size: ${settings.fontSize}px; font-weight: ${settings.fontWeight}; text-align: ${settings.align};"${hideOnMobile}${hideOnDesktop}>${settings.content}</p>`;
          break;
        }
        case 'heading': {
          const settings = element.settings as HeadingElement['settings'];
          html += `<${settings.level} style="color: ${settings.color}; font-size: ${settings.fontSize}px; font-weight: ${settings.fontWeight}; text-align: ${settings.align};"${hideOnMobile}${hideOnDesktop}>${settings.content}</${settings.level}>`;
          break;
        }
        case 'image': {
          const settings = element.settings as ImageElement['settings'];
          html += `<img src="${settings.src}" alt="${settings.alt}" style="max-width: 100%; height: auto; display: block; margin: ${settings.align === 'center' ? '0 auto' : '0'};"${hideOnMobile}${hideOnDesktop} />`;
          break;
        }
        case 'button': {
          const settings = element.settings as ButtonElement['settings'];
          html += `<a href="${settings.url}" style="display: inline-block; padding: 10px 20px; background-color: ${settings.backgroundColor}; color: ${settings.color}; text-decoration: none; border-radius: ${settings.borderRadius}px; font-size: ${settings.fontSize}px; font-weight: ${settings.fontWeight}; text-align: ${settings.align};"${hideOnMobile}${hideOnDesktop}>${settings.text}</a>`;
          break;
        }
        case 'divider': {
          const settings = element.settings as DividerElement['settings'];
          html += `<hr style="border: 0; border-top: ${settings.thickness}px ${settings.style} ${settings.color};"${hideOnMobile}${hideOnDesktop} />`;
          break;
        }
        case 'spacer': {
          const settings = element.settings as SpacerElement['settings'];
          html += `<div class="spacer" style="height: ${settings.height}px;"${hideOnMobile}${hideOnDesktop}></div>`;
          break;
        }
        case 'columns': {
          const settings = element.settings as ColumnsElement['settings'];
          html += `<div class="columns" style="display: grid; grid-template-columns: repeat(${settings.columns}, 1fr); gap: ${settings.columnGap}px; background-color: ${settings.backgroundColor}; padding: ${settings.padding}px; border-radius: ${settings.borderRadius}px;"${hideOnMobile}${hideOnDesktop}></div>`;
          break;
        }
        case 'html': {
          const settings = element.settings as HtmlElement['settings'];
          html += `<div class="html"${hideOnMobile}${hideOnDesktop}>${settings.code}</div>`;
          break;
        }
        case 'social': {
          const settings = element.settings as SocialElement['settings'];
          html += `<div class="social" style="text-align: ${settings.align};"${hideOnMobile}${hideOnDesktop}>
            ${settings.networks.map(network => `
              <a href="${network.url}" style="display: inline-block; margin: 0 ${settings.iconSpacing / 2}px;">
                <img src="${getSocialIcon(network.type)}" alt="${network.type}" width="${settings.iconSize}" height="${settings.iconSize}" style="display: block;" />
              </a>
            `).join('')}
          </div>`;
          break;
        }
        case 'video': {
          const settings = element.settings as VideoElement['settings'];
          html += `<div class="video" style="position: relative; padding-bottom: 56.25%;"${hideOnMobile}${hideOnDesktop}>
            <iframe src="${settings.embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
          </div>`;
          break;
        }
      }
    });
    return html;
  }, [elements]);

  const handleExport = useCallback((format: 'json' | 'html') => {
    if (format === 'json') {
      const template: EmailTemplate = {
        version: '1.0.0',
        elements,
        bodySettings,
      };
      
      const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email-template.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const html = getHTML();
      const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
  <style>
    body {
      margin: 0;
      padding: ${bodySettings.padding}px;
      background-color: ${bodySettings.backdropColor};
      font-family: ${bodySettings.fontFamily};
      color: ${bodySettings.textColor};
    }
    .email-container {
      max-width: ${bodySettings.width}px;
      margin: 0 auto;
      background-color: ${bodySettings.backgroundColor};
      border-radius: ${bodySettings.borderRadius || 0}px;
      ${bodySettings.borderColor ? `border: 1px solid ${bodySettings.borderColor};` : ''}
    }
    @media screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
      }
      [data-hide-on-mobile="true"] {
        display: none !important;
      }
    }
    @media screen and (min-width: 601px) {
      [data-hide-on-desktop="true"] {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${html}
  </div>
</body>
</html>`;

      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'email-template.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [elements, bodySettings, getHTML]);

  const handleImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (file.type === 'application/json') {
          const template = JSON.parse(e.target?.result as string) as EmailTemplate;
          if (!template.version || !template.elements || !template.bodySettings) {
            throw new Error('Invalid template format');
          }
          setElements(template.elements);
          setBodySettings(template.bodySettings);
        } else if (file.type === 'text/html') {
          // Create a temporary DOM element to parse the HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(e.target?.result as string, 'text/html');
          
          // Extract styles from the head
          const styleTag = doc.querySelector('style');
          if (styleTag) {
            const styles = styleTag.textContent || '';
            // Parse body settings from styles
            const bodyMatch = styles.match(/body\s*{([^}]+)}/);
            if (bodyMatch) {
              const bodyStyles = bodyMatch[1];
              const padding = bodyStyles.match(/padding:\s*(\d+)px/)?.[1];
              const backgroundColor = bodyStyles.match(/background-color:\s*([^;]+)/)?.[1];
              const fontFamily = bodyStyles.match(/font-family:\s*([^;]+)/)?.[1];
              const textColor = bodyStyles.match(/color:\s*([^;]+)/)?.[1];
              
              if (padding) setBodySettings(prev => ({ ...prev, padding: parseInt(padding) }));
              if (backgroundColor) setBodySettings(prev => ({ ...prev, backgroundColor }));
              if (fontFamily) setBodySettings(prev => ({ ...prev, fontFamily }));
              if (textColor) setBodySettings(prev => ({ ...prev, textColor }));
            }
          }

          // Extract elements from the body
          const container = doc.querySelector('.email-container');
          if (container) {
            const newElements: EmailElement[] = [];
            container.childNodes.forEach((node, index) => {
              if (node instanceof Element) {
                // Convert HTML elements to EmailElements
                const element = convertHtmlToEmailElement(node, index);
                if (element) newElements.push(element);
              }
            });
            setElements(newElements);
          }
        }
      } catch (error) {
        console.error('Failed to import template:', error);
        // Here you could add a toast notification or other error feedback
      }
    };
    reader.readAsText(file);
  }, []);

  const convertHtmlToEmailElement = (element: Element, index: number): EmailElement | null => {
    const type = getElementType(element);
    if (!type) return null;

    const newElement = createNewElement(type, 0, index * 50) as EmailElement;
    
    // Set common properties
    const hideOnMobile = element.getAttribute('data-hide-on-mobile');
    const hideOnDesktop = element.getAttribute('data-hide-on-desktop');

    // Set type-specific properties
    switch (type) {
      case 'text': {
        const textElement = newElement as TextElement;
        textElement.settings.content = element.textContent || '';
        textElement.settings.color = element.getAttribute('color') || '#000000';
        if (hideOnMobile) textElement.settings.hideOnMobile = hideOnMobile === 'true';
        if (hideOnDesktop) textElement.settings.hideOnDesktop = hideOnDesktop === 'true';
        break;
      }
      case 'heading': {
        const headingElement = newElement as HeadingElement;
        headingElement.settings.content = element.textContent || '';
        headingElement.settings.color = element.getAttribute('color') || '#000000';
        if (hideOnMobile) headingElement.settings.hideOnMobile = hideOnMobile === 'true';
        if (hideOnDesktop) headingElement.settings.hideOnDesktop = hideOnDesktop === 'true';
        break;
      }
      case 'image': {
        const imageElement = newElement as ImageElement;
        if (element instanceof HTMLImageElement) {
          imageElement.settings.src = element.src;
          imageElement.settings.alt = element.alt;
        }
        if (hideOnMobile) imageElement.settings.hideOnMobile = hideOnMobile === 'true';
        if (hideOnDesktop) imageElement.settings.hideOnDesktop = hideOnDesktop === 'true';
        break;
      }
      case 'button': {
        const buttonElement = newElement as ButtonElement;
        if (element instanceof HTMLAnchorElement) {
          buttonElement.settings.url = element.href;
          buttonElement.settings.text = element.textContent || '';
        }
        if (hideOnMobile) buttonElement.settings.hideOnMobile = hideOnMobile === 'true';
        if (hideOnDesktop) buttonElement.settings.hideOnDesktop = hideOnDesktop === 'true';
        break;
      }
      // Add other element types as needed
    }

    return newElement;
  };

  const getElementType = (element: Element): ElementType | null => {
    switch (element.tagName.toLowerCase()) {
      case 'p': return 'text';
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return 'heading';
      case 'img': return 'image';
      case 'a': return 'button';
      case 'hr': return 'divider';
      case 'div':
        if (element.classList.contains('spacer')) return 'spacer';
        if (element.classList.contains('columns')) return 'columns';
        if (element.classList.contains('social')) return 'social';
        if (element.classList.contains('video')) return 'video';
        if (element.classList.contains('html')) return 'html';
        return null;
      default: return null;
    }
  };

  const getSocialIcon = (type: string): string => {
    // Replace with actual social media icon URLs
    const icons = {
      facebook: 'https://example.com/facebook-icon.png',
      twitter: 'https://example.com/twitter-icon.png',
      instagram: 'https://example.com/instagram-icon.png',
      linkedin: 'https://example.com/linkedin-icon.png',
    };
    return icons[type as keyof typeof icons] || '';
  };

  const handleGenerateTemplate = useCallback(async (prompt: string) => {
    if (!onGenerateWithAI) return;

    try {
      const result = await onGenerateWithAI(prompt);
      if (result.elements) {
        setElements(result.elements);
      }
      if (result.bodySettings) {
        setBodySettings(prev => ({
          ...prev,
          ...result.bodySettings
        }));
      }
    } catch (error) {
      console.error('Failed to generate template:', error);
      // Here you could add a toast notification or other error feedback
    }
  }, [onGenerateWithAI]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen overflow-hidden bg-background">
        <TopBar
          view={view}
          deviceView={deviceView}
          isRightSidebarOpen={isRightSidebarOpen}
          codeView={codeView}
          onViewChange={setView}
          onDeviceViewChange={setDeviceView}
          onRightSidebarToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          onCodeViewChange={setCodeView}
          onExport={handleExport}
          onImport={handleImport}
          onGenerateTemplate={onGenerateWithAI ? handleGenerateTemplate : undefined}
        />
        
        <div className="flex flex-1 overflow-hidden">
          {view === 'edit' && (
            <>
              {/* Left Sidebar */}
              <div className="w-[280px] border-r flex flex-col">
                <Sidebar
                  onAddElement={handleAddElement}
                  onLoadTemplate={handleLoadTemplate}
                  onInsertVariable={handleInsertVariable}
                />
              </div>

              {/* Main Canvas Area */}
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-hidden">
                  <Canvas
                    ref={canvasRef}
                    elements={elements}
                    onSelectElement={setSelectedElement}
                    selectedElementId={selectedElement?.id ?? null}
                    onElementsChange={setElements}
                    bodySettings={bodySettings}
                    deviceView={deviceView}
                  />
                </div>
              </div>

              {/* Right Sidebar */}
              {isRightSidebarOpen && (
                <div className="w-[300px] border-l overflow-y-auto">
                  <SettingsPanel
                    selectedElement={selectedElement}
                    bodySettings={bodySettings}
                    onUpdateElement={handleUpdateElement}
                    onUpdateBodySettings={updateEmailBodySettings}
                    handleDeleteElement={handleDeleteElement}
                  />
                </div>
              )}
            </>
          )}

          {view === 'preview' && (
            <div className="flex-1 overflow-auto p-4">
              <div 
                className="mx-auto"
                style={{ 
                  maxWidth: deviceView === 'mobile' ? '375px' : '100%',
                  backgroundColor: bodySettings.backgroundColor,
                  color: bodySettings.textColor,
                  fontFamily: bodySettings.fontFamily,
                }}
                dangerouslySetInnerHTML={{ __html: getHTML() }}
              />
            </div>
          )}

          {view === 'code' && (
            <div className="flex-1 overflow-auto p-4">
              <pre className="bg-muted p-4 rounded-lg overflow-auto">
                {codeView === 'html' ? getHTML() : JSON.stringify(elements, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default EmailEditor; 