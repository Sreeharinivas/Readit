import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ProcessingStateProps {
  status: 'ocr' | 'simplifying';
  progress?: number;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ status, progress }) => {
  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 bg-background-light dark:bg-background-dark min-h-[400px]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-display font-semibold text-text-light-primary dark:text-text-dark-primary mb-1">
            {status === 'ocr' ? 'Reading Text' : 'Making it clearer'}
          </h2>
          <p className="text-text-light-secondary dark:text-text-dark-secondary">
            {status === 'ocr' 
              ? `Extracting words from image... ${progress ? Math.round(progress * 100) + '%' : ''}`
              : 'Applying simplification...'}
          </p>
        </div>
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </motion.div>

      {/* Skeleton Text Blocks */}
      <div className="space-y-4 flex-grow overflow-hidden relative" aria-hidden="true">
        <motion.div 
          className="w-3/4 h-8 skeleton rounded-lg"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-full h-4 skeleton rounded"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-full h-4 skeleton rounded"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, ease: "easeInOut" }}
        />
        <motion.div 
          className="w-5/6 h-4 skeleton rounded"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.6, ease: "easeInOut" }}
        />
        
        <div className="pt-6 space-y-4">
          <motion.div 
            className="w-full h-4 skeleton rounded"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.8, ease: "easeInOut" }}
          />
          <motion.div 
            className="w-4/5 h-4 skeleton rounded"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 1.0, ease: "easeInOut" }}
          />
        </div>
        
        {/* Fade out bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background-light dark:from-background-dark to-transparent" />
      </div>
    </div>
  );
};
