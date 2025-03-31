import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Eye, Code, Smartphone, Monitor, PanelRightClose, PanelRightOpen, Download, Upload, FileJson, FileCode, Sparkles } from 'lucide-react';
import { DeviceView } from './types';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface TopBarProps {
  view: 'edit' | 'preview' | 'code';
  deviceView: DeviceView;
  isRightSidebarOpen: boolean;
  codeView: 'html' | 'json';
  onViewChange: (view: 'edit' | 'preview' | 'code') => void;
  onDeviceViewChange: (view: DeviceView) => void;
  onRightSidebarToggle: () => void;
  onCodeViewChange: (view: 'html' | 'json') => void;
  onExport: (format: 'json' | 'html') => void;
  onImport: (file: File) => void;
  onPreview?: () => void;
  onSave?: () => void;
  onGenerateTemplate?: (prompt: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  view,
  deviceView,
  isRightSidebarOpen,
  codeView,
  onViewChange,
  onDeviceViewChange,
  onRightSidebarToggle,
  onCodeViewChange,
  onExport,
  onImport,
  onPreview,
  onSave,
  onGenerateTemplate
}) => {
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const htmlInputRef = useRef<HTMLInputElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleJsonImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      event.target.value = '';
    }
  };

  const handleHtmlImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const htmlFile = new File([content], file.name, { type: 'text/html' });
        onImport(htmlFile);
      };
      reader.readAsText(file);
      event.target.value = '';
    }
  };

  const handleGenerateTemplate = async () => {
    if (!prompt.trim() || !onGenerateTemplate) return;
    
    setIsGenerating(true);
    try {
      await onGenerateTemplate(prompt);
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  return (
    <div className="flex items-center justify-between px-4 h-12 bg-background border-b">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onViewChange('edit')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md',
            view === 'edit' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
          )}
        >
          <Code size={16} />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onViewChange('preview')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md',
            view === 'preview' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
          )}
        >
          <Eye size={16} />
          <span>Preview</span>
        </button>
        <button
          onClick={() => onViewChange('code')}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md',
            view === 'code' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
          )}
        >
          <Code size={16} />
          <span>Code</span>
        </button>
      </div>

      <div className="flex items-center space-x-2">
        {/* AI Template Generator */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-muted"
              title="Generate with AI"
            >
              <Sparkles size={16} className="text-primary" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Generate Email Template with AI</DialogTitle>
              <DialogDescription>
                Describe the type of email template you want to create. Be specific about the content, style, and purpose.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="E.g., Create a welcome email template for new users signing up to our fitness app. Include a warm greeting, key features, and next steps."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-32"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleGenerateTemplate}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin mr-2">⚡</span>
                    Generating...
                  </>
                ) : (
                  'Generate Template'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Export Options */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-muted"
              title="Export template"
            >
              <Download size={16} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" align="end">
            <div className="space-y-1">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
                onClick={() => onExport('json')}
              >
                <FileJson size={16} />
                <span>Export JSON</span>
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
                onClick={() => onExport('html')}
              >
                <FileCode size={16} />
                <span>Export HTML</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Import Options */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-muted"
              title="Import template"
            >
              <Upload size={16} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2" align="end">
            <div className="space-y-1">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
                onClick={() => jsonInputRef.current?.click()}
              >
                <FileJson size={16} />
                <span>Import JSON</span>
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent"
                onClick={() => htmlInputRef.current?.click()}
              >
                <FileCode size={16} />
                <span>Import HTML</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <input
          ref={jsonInputRef}
          type="file"
          accept=".json"
          onChange={handleJsonImport}
          className="hidden"
        />
        <input
          ref={htmlInputRef}
          type="file"
          accept=".html"
          onChange={handleHtmlImport}
          className="hidden"
        />

        {/* Rest of the buttons */}
        {view === 'code' && (
          <>
            <button
              onClick={() => onCodeViewChange('html')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md',
                codeView === 'html' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              HTML
            </button>
            <button
              onClick={() => onCodeViewChange('json')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md',
                codeView === 'json' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              JSON
            </button>
          </>
        )}

        {(view === 'edit' || view === 'preview') && (
          <>
            <button
              onClick={() => onDeviceViewChange('desktop')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md',
                deviceView === 'desktop' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              <Monitor size={16} />
            </button>
            <button
              onClick={() => onDeviceViewChange('mobile')}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md',
                deviceView === 'mobile' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
              )}
            >
              <Smartphone size={16} />
            </button>
          </>
        )}

        <button
          onClick={onRightSidebarToggle}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-muted'
          )}
        >
          {isRightSidebarOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
        </button>
      </div>
    </div>
  );
}; 