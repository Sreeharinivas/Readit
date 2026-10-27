import React, { useState } from 'react';
import { Camera, BrainCircuit, Volume2, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to ReadIt",
      description: "Your personal reading assistant. We help make text easier to read and listen to.",
      icon: <Volume2 className="w-16 h-16 text-primary mb-6" />
    },
    {
      title: "1. Capture",
      description: "Point your camera at any document, sign, or screen. We'll extract the text instantly.",
      icon: <Camera className="w-16 h-16 text-primary mb-6" />
    },
    {
      title: "2. Simplify",
      description: "Our AI cleans up mistakes and makes complex text easier to understand.",
      icon: <BrainCircuit className="w-16 h-16 text-primary mb-6" />
    },
    {
      title: "3. Listen & Read",
      description: "Read at your own pace with large, clear text, or sit back and listen.",
      icon: <Volume2 className="w-16 h-16 text-primary mb-6" />
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-6 z-50">
      <div className="w-full max-w-md flex flex-col h-[70vh] justify-between">
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-12">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-primary' : 'w-2 bg-border-light dark:bg-border-dark'}`} 
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-grow flex flex-col items-center justify-center text-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center absolute"
            >
              {steps[step].icon}
              <h1 className="text-3xl font-display font-bold text-text-light-primary dark:text-text-dark-primary mb-4">
                {steps[step].title}
              </h1>
              <p className="text-lg text-text-light-secondary dark:text-text-dark-secondary max-w-sm">
                {steps[step].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div className="mt-12 flex justify-center w-full">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="w-full py-4 bg-primary text-white rounded-xl font-semibold text-lg flex items-center justify-center shadow-soft hover:bg-primary-hover transition-colors"
          >
            {step < steps.length - 1 ? (
              <>
                Next <ChevronRight className="ml-2 w-6 h-6" />
              </>
            ) : (
              <>
                Get Started <Check className="ml-2 w-6 h-6" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
