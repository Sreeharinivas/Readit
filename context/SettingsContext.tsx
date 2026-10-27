import React, { createContext, useContext, useEffect, useState } from 'react';

export type TextSize = 'small' | 'medium' | 'large' | 'extra-large';
export type Theme = 'light' | 'dark' | 'system';

interface Settings {
  textSize: TextSize;
  theme: Theme;
  readingSpeed: number;
  useDyslexicFont: boolean;
  lineSpacing: 'normal' | 'relaxed' | 'loose';
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  textSize: 'medium',
  theme: 'system',
  readingSpeed: 1.0,
  useDyslexicFont: false,
  lineSpacing: 'normal',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('readit_settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('readit_settings', JSON.stringify(settings));
    
    // Apply theme
    const isDark = settings.theme === 'dark' || 
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply font
    if (settings.useDyslexicFont) {
      document.body.style.fontFamily = '"OpenDyslexic", "Inter", sans-serif';
    } else {
      document.body.style.fontFamily = '';
    }

  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
