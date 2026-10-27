import React, { useMemo } from 'react';
import { Play, Pause, Square, Rewind, Settings, Share, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSpeech } from '../../hooks/useSpeech';
import { useSettings } from '../../context/SettingsContext';

interface ReadingViewProps {
  text: string;
  onRescan: () => void;
  onOpenSettings: () => void;
  onExport: () => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({ text, onRescan, onOpenSettings, onExport }) => {
  const { settings } = useSettings();
  const { play, pause, stop, isPlaying, isPaused, currentWordIndex } = useSpeech({ 
    text, 
    speed: settings.readingSpeed 
  });

  const words = useMemo(() => text.split(/\s+/), [text]);

  const getTextSizeClass = () => {
    switch(settings.textSize) {
      case 'small': return 'text-lg md:text-xl';
      case 'large': return 'text-3xl md:text-4xl';
      case 'extra-large': return 'text-4xl md:text-5xl';
      case 'medium':
      default: return 'text-xl md:text-2xl';
    }
  };

  const getLineSpacingClass = () => {
    switch(settings.lineSpacing) {
      case 'relaxed': return 'leading-relaxed';
      case 'loose': return 'leading-loose';
      case 'normal':
      default: return 'leading-normal';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-background-light dark:bg-background-dark h-screen max-h-[100dvh]">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center p-4 border-b border-border-light dark:border-border-dark">
        <button 
          onClick={onRescan}
          className="flex items-center gap-2 text-primary hover:text-primary-hover font-medium px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
        >
          <Camera className="w-5 h-5" />
          <span>New Scan</span>
        </button>
        <div className="flex gap-2">
          <button 
            onClick={onExport}
            className="p-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
            aria-label="Export or share"
          >
            <Share className="w-5 h-5" />
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-2 text-text-light-secondary dark:text-text-dark-secondary hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Waveform Area */}
      <div className="h-24 md:h-32 bg-surface-light dark:bg-surface-dark flex items-center justify-center border-b border-border-light dark:border-border-dark overflow-hidden relative">
        {isPlaying ? (
          <div className="flex items-center gap-1">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 md:w-3 bg-primary rounded-full origin-bottom"
                animate={{ 
                  height: ['10%', '100%', '10%'] 
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + Math.random() * 0.5,
                  delay: Math.random() * 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1 opacity-20">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-2 md:w-3 h-4 bg-text-light-tertiary dark:bg-text-dark-tertiary rounded-full" />
            ))}
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="flex-grow overflow-y-auto p-6 md:p-10">
        <div className={`max-w-3xl mx-auto font-sans text-text-light-primary dark:text-text-dark-primary ${getTextSizeClass()} ${getLineSpacingClass()}`}>
          {words.map((word, index) => (
            <span
              key={index}
              className={`inline-block mr-[0.25em] mb-[0.2em] px-1 rounded transition-colors duration-150 ${
                index === currentWordIndex 
                  ? 'bg-primary/20 text-primary dark:text-primary-light border-b-2 border-primary' 
                  : ''
              }`}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="p-6 pb-8 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
        <div className="max-w-md mx-auto flex items-center justify-center gap-6">
          <button
            onClick={() => { stop(); play(); }}
            className="p-3 text-text-light-secondary dark:text-text-dark-secondary hover:text-primary transition-colors"
            aria-label="Restart from beginning"
          >
            <Rewind className="w-7 h-7" />
          </button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={isPlaying && !isPaused ? pause : play}
            className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center shadow-glow hover:bg-primary-hover transition-colors"
            aria-label={isPlaying && !isPaused ? "Pause" : "Play"}
          >
            {isPlaying && !isPaused ? (
              <Pause className="w-10 h-10 fill-current" />
            ) : (
              <Play className="w-10 h-10 fill-current ml-2" />
            )}
          </motion.button>
          
          <button
            onClick={stop}
            disabled={!isPlaying && !isPaused}
            className={`p-3 transition-colors ${isPlaying || isPaused ? 'text-status-error hover:bg-status-error/10 rounded-full' : 'text-text-light-tertiary dark:text-text-dark-tertiary opacity-50 cursor-not-allowed'}`}
            aria-label="Stop playback"
          >
            <Square className="w-7 h-7 fill-current" />
          </button>
        </div>
      </div>
      
    </div>
  );
};
