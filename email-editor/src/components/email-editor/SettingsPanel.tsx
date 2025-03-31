import React from 'react';
import { cn } from '@/lib/utils';
import type { EmailElement } from './elements';
import type { BodySettings } from './types';
import { ElementSettings } from './ElementSettings';

interface SettingsPanelProps {
  selectedElement: EmailElement | null;
  bodySettings: BodySettings;
  onUpdateElement: (element: EmailElement) => void;
  onUpdateBodySettings: (settings: Partial<BodySettings>) => void;
  handleDeleteElement: () => void;
}

type Tab = 'styles' | 'inspect';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedElement,
  bodySettings,
  onUpdateElement,
  onUpdateBodySettings,
  handleDeleteElement,
}) => {
  const [activeTab, setActiveTab] = React.useState<Tab>('styles');

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tab Headers */}
      <div className="flex border-b">
        <button
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'styles'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setActiveTab('styles')}
        >
          Styles
        </button>
        <button
          className={cn(
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            activeTab === 'inspect'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setActiveTab('inspect')}
        >
          Inspect
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'styles' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium mb-4">GLOBAL</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Backdrop color</label>
                  <input
                    type="color"
                    value={bodySettings.backdropColor}
                    onChange={(e) => onUpdateBodySettings({ backdropColor: e.target.value })}
                    className="block w-full h-10 mt-1 rounded-md border"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Canvas color</label>
                  <input
                    type="color"
                    value={bodySettings.backgroundColor}
                    onChange={(e) => onUpdateBodySettings({ backgroundColor: e.target.value })}
                    className="block w-full h-10 mt-1 rounded-md border"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Canvas border color</label>
                  <input
                    type="color"
                    value={bodySettings.borderColor || '#e5e7eb'}
                    onChange={(e) => onUpdateBodySettings({ borderColor: e.target.value })}
                    className="block w-full h-10 mt-1 rounded-md border"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Canvas border radius</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="20"
                      value={bodySettings.borderRadius || 0}
                      onChange={(e) => onUpdateBodySettings({ borderRadius: Number(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-16">
                      {bodySettings.borderRadius || 0}px
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Font family</label>
                  <select
                    value={bodySettings.fontFamily}
                    onChange={(e) => onUpdateBodySettings({ fontFamily: e.target.value })}
                    className="block w-full h-10 mt-1 rounded-md border bg-background px-3"
                  >
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Helvetica, sans-serif">Helvetica</option>
                    <option value="Times New Roman, serif">Times New Roman</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="monospace">Monospace</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Text color</label>
                  <input
                    type="color"
                    value={bodySettings.textColor}
                    onChange={(e) => onUpdateBodySettings({ textColor: e.target.value })}
                    className="block w-full h-10 mt-1 rounded-md border"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inspect' && selectedElement && (
          <ElementSettings
            selectedElement={selectedElement}
            onUpdateElement={onUpdateElement}
            handleDeleteElement={handleDeleteElement}
          />
        )}
        {
          activeTab === 'inspect' && !selectedElement && (
            <div>
              <h2 className="text-sm font-medium mb-4">INSPECT</h2>
              <p className="text-sm text-muted-foreground">No element selected</p>
            </div>
          )
        }
      </div>
    </div>
  );
}; 