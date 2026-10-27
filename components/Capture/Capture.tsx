import React, { useEffect, useState, useRef } from 'react';
import { Camera, Image as ImageIcon, Zap, ZapOff, RefreshCcw } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { motion } from 'framer-motion';

interface CaptureProps {
  onCapture: (imageSource: string) => void;
}

export const Capture: React.FC<CaptureProps> = ({ onCapture }) => {
  const { videoRef, startCamera, stopCamera, captureImage, error, hasTorch, isTorchOn, toggleTorch } = useCamera();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    const initCam = async () => {
      await startCamera();
      setIsCameraActive(true);
    };
    initCam();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCaptureClick = () => {
    const imageSrc = captureImage();
    if (imageSrc) {
      // Haptic feedback if supported
      if (navigator.vibrate) navigator.vibrate(50);
      onCapture(imageSrc);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCapture(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[600px] bg-background-dark overflow-hidden rounded-2xl shadow-soft flex flex-col">
      
      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
        <button 
          onClick={toggleTorch}
          disabled={!hasTorch}
          className={`p-3 rounded-full backdrop-blur-md transition-colors ${hasTorch ? 'bg-surface-dark/50 text-white hover:bg-surface-dark/80' : 'bg-surface-dark/20 text-gray-500 cursor-not-allowed'}`}
          aria-label={isTorchOn ? "Turn off flash" : "Turn on flash"}
        >
          {isTorchOn ? <Zap className="w-6 h-6 text-primary" /> : <ZapOff className="w-6 h-6" />}
        </button>
        
        <button 
          onClick={() => {
            stopCamera();
            setTimeout(startCamera, 500);
          }}
          className="p-3 rounded-full bg-surface-dark/50 text-white backdrop-blur-md hover:bg-surface-dark/80 transition-colors"
          aria-label="Restart camera"
        >
          <RefreshCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Camera View */}
      <div className="relative flex-grow flex items-center justify-center bg-black">
        {error ? (
          <div className="text-center p-6 text-white max-w-sm">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-primary text-white rounded-full font-medium shadow-soft hover:bg-primary-hover transition-colors"
            >
              Upload an Image Instead
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted
              className="absolute inset-0 w-full h-full object-cover"
              aria-label="Camera viewfinder"
            />
            {/* Framing Guide */}
            <div className="absolute inset-8 md:inset-16 border-2 border-white/50 rounded-xl pointer-events-none flex flex-col justify-between">
              <div className="flex justify-between w-full p-[-2px]">
                <div className="w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl -mt-1 -ml-1"></div>
                <div className="w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl -mt-1 -mr-1"></div>
              </div>
              <div className="flex justify-between w-full p-[-2px]">
                <div className="w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl -mb-1 -ml-1"></div>
                <div className="w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl -mb-1 -mr-1"></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 flex justify-center items-center gap-8 bg-gradient-to-t from-black/80 to-transparent z-10">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="p-4 rounded-full bg-surface-dark/50 text-white backdrop-blur-md hover:bg-surface-dark/80 transition-colors focus:ring-4 focus:ring-primary/50 outline-none"
          aria-label="Upload image from gallery"
        >
          <ImageIcon className="w-7 h-7" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
          aria-hidden="true"
        />
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleCaptureClick}
          disabled={!isCameraActive || !!error}
          className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center shadow-glow focus:outline-none focus:ring-4 focus:ring-primary/50 transition-transform ${!isCameraActive || error ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Capture text"
        >
          <div className="w-16 h-16 bg-white rounded-full transition-transform hover:scale-95" />
        </motion.button>

        <div className="w-[60px]" aria-hidden="true"></div> {/* Spacer for balance */}
      </div>
    </div>
  );
};
