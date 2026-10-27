export interface HistoryItem {
  id: string;
  timestamp: number;
  originalText: string;
  simplifiedText?: string;
  imageUrl?: string;
  bookmarked?: boolean;
}

export interface UserSettings {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  theme: 'system' | 'light' | 'dark';
  dyslexicFont: boolean;
  lineSpacing: 'normal' | 'loose' | 'very-loose';
  defaultSpeed: number;
}

const HISTORY_KEY = 'readit_history_v2';
const SETTINGS_KEY = 'readit_settings_v2';

const DEFAULT_SETTINGS: UserSettings = {
  fontSize: 'medium',
  theme: 'system',
  dyslexicFont: false,
  lineSpacing: 'normal',
  defaultSpeed: 1.0,
};

// --- History ---
export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(item: HistoryItem): void {
  try {
    const history = getHistory();
    const index = history.findIndex(i => i.id === item.id);
    if (index !== -1) {
      history[index] = { ...history[index], ...item };
    } else {
      history.unshift(item);
    }
    if (history.length > 100) history.pop();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

export function deleteFromHistory(id: string): void {
  try {
    const history = getHistory().filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

export function toggleBookmark(id: string): void {
  try {
    const history = getHistory();
    const index = history.findIndex(i => i.id === id);
    if (index !== -1) {
      history[index].bookmarked = !history[index].bookmarked;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  } catch (err) {
    console.error("Storage error:", err);
  }
}

export function clearHistory(): void {
  try {
    // preserve bookmarks
    const history = getHistory().filter(i => i.bookmarked);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error("Storage error:", err);
  }
}

// --- Settings ---
export function getSettings(): UserSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function updateSettings(settings: Partial<UserSettings>): UserSettings {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Storage error:", err);
    return DEFAULT_SETTINGS;
  }
}
