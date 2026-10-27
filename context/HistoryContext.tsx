import React, { createContext, useContext, useEffect, useState } from 'react';

export interface HistoryItem {
  id: string;
  timestamp: number;
  rawText: string;
  simplifiedText: string;
  thumbnail: string; // data URL
  isBookmarked: boolean;
}

interface HistoryContextType {
  history: HistoryItem[];
  addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp' | 'isBookmarked'>) => string;
  removeHistoryItem: (id: string) => void;
  toggleBookmark: (id: string) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('readit_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('readit_history', JSON.stringify(history));
  }, [history]);

  const addHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp' | 'isBookmarked'>) => {
    const id = crypto.randomUUID();
    const newItem: HistoryItem = {
      ...item,
      id,
      timestamp: Date.now(),
      isBookmarked: false,
    };
    setHistory(prev => [newItem, ...prev]);
    return id;
  };

  const removeHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const toggleBookmark = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
    ));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider value={{ history, addHistoryItem, removeHistoryItem, toggleBookmark, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
