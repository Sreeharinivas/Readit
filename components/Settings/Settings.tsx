import React from 'react';
import { useSettings, type TextSize, type Theme } from '../../context/SettingsContext';
import { Moon, Sun, Type, FastForward, AlignLeft } from 'lucide-react';

interface SettingsProps {
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { settings, updateSettings } = useSettings();

  return (
    <div className="fixed inset-0 bg-background-light dark:bg-background-dark z-50 overflow-y-auto">
      <div className="p-6 md:p-10 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-border-light dark:border-border-dark pb-4">
          <h1 className="text-3xl font-display font-bold text-text-light-primary dark:text-text-dark-primary">
            Personalization
          </h1>
          <button 
            onClick={onClose}
            className="text-primary hover:bg-primary/10 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>

        <div className="space-y-10 text-text-light-primary dark:text-text-dark-primary">
          
          {/* Text Size */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Type className="text-primary w-6 h-6" />
              <h2 className="text-xl font-semibold">Text Size</h2>
            </div>
            <div className="grid grid-cols-4 gap-2 bg-surface-light dark:bg-surface-dark p-2 rounded-xl border border-border-light dark:border-border-dark">
              {(['small', 'medium', 'large', 'extra-large'] as TextSize[]).map(size => (
                <button
                  key={size}
                  onClick={() => updateSettings({ textSize: size })}
                  className={`py-3 rounded-lg capitalize font-medium transition-colors ${settings.textSize === size ? 'bg-primary text-white shadow-soft' : 'hover:bg-primary/5 dark:hover:bg-primary/20'}`}
                >
                  {size.replace('-', ' ')}
                </button>
              ))}
            </div>
          </section>

          {/* Dyslexic Font */}
          <section>
            <div className="flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-light dark:border-border-dark">
              <div>
                <h2 className="text-xl font-semibold mb-1">Dyslexia-friendly Font</h2>
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Use OpenDyslexic font everywhere.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.useDyslexicFont}
                  onChange={(e) => updateSettings({ useDyslexicFont: e.target.checked })}
                  aria-label="Toggle dyslexia-friendly font"
                />
                <div className="w-14 h-8 bg-border-light dark:bg-border-dark peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary shadow-inner"></div>
              </label>
            </div>
          </section>

          {/* Line Spacing */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlignLeft className="text-primary w-6 h-6" />
              <h2 className="text-xl font-semibold">Line Spacing</h2>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-surface-light dark:bg-surface-dark p-2 rounded-xl border border-border-light dark:border-border-dark">
              {(['normal', 'relaxed', 'loose'] as const).map(spacing => (
                <button
                  key={spacing}
                  onClick={() => updateSettings({ lineSpacing: spacing })}
                  className={`py-3 rounded-lg capitalize font-medium transition-colors ${settings.lineSpacing === spacing ? 'bg-primary text-white shadow-soft' : 'hover:bg-primary/5 dark:hover:bg-primary/20'}`}
                >
                  {spacing}
                </button>
              ))}
            </div>
          </section>

          {/* Reading Speed */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FastForward className="text-primary w-6 h-6" />
              <h2 className="text-xl font-semibold">Reading Speed</h2>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl border border-border-light dark:border-border-dark">
              <div className="flex justify-between text-sm text-text-light-secondary dark:text-text-dark-secondary mb-2 font-medium">
                <span>Slow (0.5x)</span>
                <span>Normal (1.0x)</span>
                <span>Fast (2.0x)</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.1" 
                value={settings.readingSpeed}
                onChange={(e) => updateSettings({ readingSpeed: parseFloat(e.target.value) })}
                className="w-full h-3 bg-border-light dark:bg-border-dark rounded-lg appearance-none cursor-pointer accent-primary"
                aria-label="Adjust reading speed"
              />
            </div>
          </section>

          {/* Theme */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Sun className="text-primary w-6 h-6 dark:hidden" />
              <Moon className="text-primary w-6 h-6 hidden dark:block" />
              <h2 className="text-xl font-semibold">Theme</h2>
            </div>
            <div className="grid grid-cols-3 gap-2 bg-surface-light dark:bg-surface-dark p-2 rounded-xl border border-border-light dark:border-border-dark">
              {(['light', 'dark', 'system'] as Theme[]).map(theme => (
                <button
                  key={theme}
                  onClick={() => updateSettings({ theme })}
                  className={`py-3 rounded-lg capitalize font-medium transition-colors ${settings.theme === theme ? 'bg-primary text-white shadow-soft' : 'hover:bg-primary/5 dark:hover:bg-primary/20'}`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
};
