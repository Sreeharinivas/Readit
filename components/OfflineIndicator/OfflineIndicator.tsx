import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-surface-dark text-text-dark-primary px-4 py-3 flex items-center justify-center shadow-soft-dark"
          role="alert"
          aria-live="assertive"
        >
          <WifiOff className="w-5 h-5 mr-3 text-primary" aria-hidden="true" />
          <div className="text-sm">
            <span className="font-semibold block sm:inline">You are offline. </span>
            <span className="text-text-dark-secondary">Basic capture works, but advanced simplification requires an internet connection.</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
