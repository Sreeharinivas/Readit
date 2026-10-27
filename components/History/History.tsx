import React from 'react';
import { useHistory, type HistoryItem } from '../../context/HistoryContext';
import { Clock, Star, Trash2, PlayCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryProps {
  onSelect: (item: HistoryItem) => void;
  onClose: () => void;
}

export const History: React.FC<HistoryProps> = ({ onSelect, onClose }) => {
  const { history, removeHistoryItem, toggleBookmark } = useHistory();

  const todayCount = history.filter(h => {
    const today = new Date();
    const itemDate = new Date(h.timestamp);
    return itemDate.getDate() === today.getDate() &&
           itemDate.getMonth() === today.getMonth() &&
           itemDate.getFullYear() === today.getFullYear();
  }).length;

  return (
    <div className="fixed inset-0 bg-background-light dark:bg-background-dark z-40 overflow-y-auto">
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold text-text-light-primary dark:text-text-dark-primary">
            Your Library
          </h1>
          <button 
            onClick={onClose}
            className="text-primary hover:bg-primary/10 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>

        {/* Session Summary */}
        {todayCount > 0 && (
          <div className="mb-8 p-6 bg-primary/10 rounded-2xl flex items-center gap-4 text-text-light-primary dark:text-text-dark-primary">
            <div className="p-3 bg-primary text-white rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Great job today!</h2>
              <p className="opacity-80">You've read {todayCount} {todayCount === 1 ? 'item' : 'items'}.</p>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <div className="text-center py-20 text-text-light-tertiary dark:text-text-dark-tertiary">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No past readings yet.</p>
            <p>Your captured text will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {history.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-border-light dark:border-border-dark flex gap-4 shadow-sm relative group"
                >
                  <div 
                    className="w-24 h-24 rounded-lg bg-border-light dark:bg-border-dark flex-shrink-0 bg-cover bg-center cursor-pointer"
                    style={{ backgroundImage: `url(${item.thumbnail})` }}
                    onClick={() => onSelect(item)}
                  />
                  
                  <div className="flex-grow flex flex-col min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-text-light-tertiary dark:text-text-dark-tertiary mb-1">
                        {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
                        className="p-1 text-text-light-tertiary hover:text-primary transition-colors"
                        aria-label={item.isBookmarked ? "Remove bookmark" : "Add bookmark"}
                      >
                        <Star className={`w-5 h-5 ${item.isBookmarked ? 'fill-primary text-primary' : ''}`} />
                      </button>
                    </div>
                    
                    <p 
                      className="text-text-light-primary dark:text-text-dark-primary font-medium line-clamp-2 cursor-pointer flex-grow"
                      onClick={() => onSelect(item)}
                    >
                      {item.simplifiedText || item.rawText}
                    </p>
                    
                    <div className="flex justify-between items-center mt-2">
                      <button 
                        onClick={() => onSelect(item)}
                        className="text-primary flex items-center gap-1 text-sm font-medium hover:underline"
                      >
                        <PlayCircle className="w-4 h-4" /> Listen
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeHistoryItem(item.id); }}
                        className="text-status-error opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        aria-label="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
