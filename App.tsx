import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding/Onboarding';
import { Capture } from './components/Capture/Capture';
import { ProcessingState } from './components/ProcessingState/ProcessingState';
import { ReadingView } from './components/ReadingView/ReadingView';
import { History } from './components/History/History';
import { Settings } from './components/Settings/Settings';
import { OfflineIndicator } from './components/OfflineIndicator/OfflineIndicator';
import { SettingsProvider } from './context/SettingsContext';
import { HistoryProvider, useHistory } from './context/HistoryContext';
import { useOcr } from './hooks/useOcr';
import { simplifyText } from './services/ai';
import { exportText } from './services/tts';
import { BookMarked } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type AppState = 'onboarding' | 'capture' | 'processing' | 'reading';

const MainApp: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('capture');
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [processingStatus, setProcessingStatus] = useState<'ocr' | 'simplifying'>('ocr');
  const [currentText, setCurrentText] = useState('');
  
  const { processImage, progress, error: ocrError } = useOcr();
  const { addHistoryItem } = useHistory();

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('readit_onboarded');
    if (!hasOnboarded) {
      setAppState('onboarding');
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('readit_onboarded', 'true');
    setAppState('capture');
  };

  const handleCapture = async (imageSource: string) => {
    setAppState('processing');
    setProcessingStatus('ocr');
    
    const ocrResult = await processImage(imageSource);
    
    if (ocrResult) {
      setProcessingStatus('simplifying');
      const simplified = await simplifyText(ocrResult.text);
      setCurrentText(simplified);
      
      addHistoryItem({
        rawText: ocrResult.text,
        simplifiedText: simplified,
        thumbnail: imageSource
      });
      
      setAppState('reading');
    } else {
      // Revert to capture on error (error handled by useOcr hook, 
      // but in a real app we'd display it via a toast. We can pass it to Capture)
      setAppState('capture');
      alert(ocrError || 'Failed to read text. Please try again.');
    }
  };

  const handleExport = () => {
    exportText(currentText);
  };



  return (
    <div className="w-full h-full min-h-[100dvh] bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary font-sans relative">
      <OfflineIndicator />
      
      {/* Top Navigation for Capture State */}
      {appState === 'capture' && (
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none">
          <h1 className="text-2xl font-display font-bold text-white drop-shadow-md">ReadIt</h1>
          <button 
            onClick={() => setShowHistory(true)}
            className="pointer-events-auto p-3 rounded-full bg-surface-dark/50 text-white backdrop-blur-md hover:bg-surface-dark/80 transition-colors"
            aria-label="View history"
          >
            <BookMarked className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full h-[100dvh]">
        <AnimatePresence mode="wait">
          {appState === 'onboarding' && (
            <motion.div key="onboarding" className="w-full h-full" exit={{ opacity: 0 }}>
              <Onboarding onComplete={handleOnboardingComplete} />
            </motion.div>
          )}
          
          {appState === 'capture' && (
            <motion.div key="capture" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Capture onCapture={handleCapture} />
            </motion.div>
          )}
          
          {appState === 'processing' && (
            <motion.div key="processing" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ProcessingState status={processingStatus} progress={progress} />
            </motion.div>
          )}
          
          {appState === 'reading' && (
            <motion.div key="reading" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ReadingView 
                text={currentText} 
                onRescan={() => setAppState('capture')}
                onOpenSettings={() => setShowSettings(true)}
                onExport={handleExport}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Overlays */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40"
          >
            <History 
              onClose={() => setShowHistory(false)} 
              onSelect={(item) => {
                setCurrentText(item.simplifiedText || item.rawText);
                setShowHistory(false);
                setAppState('reading');
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50"
          >
            <Settings onClose={() => setShowSettings(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <HistoryProvider>
        <MainApp />
      </HistoryProvider>
    </SettingsProvider>
  );
}

export default App;
