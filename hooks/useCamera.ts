import { useState, useEffect, useRef, useCallback } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasTorch, setHasTorch] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check for torch support
      const track = mediaStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities?.();
      // @ts-ignore - TS doesn't have torch capability typed properly
      if (capabilities && capabilities.torch) {
        setHasTorch(true);
      }

    } catch (err) {
      setError('Camera access denied or unavailable. Please check permissions.');
      console.error(err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const toggleTorch = useCallback(async () => {
    if (!stream || !hasTorch) return;
    const track = stream.getVideoTracks()[0];
    try {
      // @ts-ignore
      await track.applyConstraints({ advanced: [{ torch: !isTorchOn }] });
      setIsTorchOn(!isTorchOn);
    } catch (err) {
      console.error('Failed to toggle torch', err);
    }
  }, [stream, hasTorch, isTorchOn]);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return { videoRef, startCamera, stopCamera, captureImage, error, hasTorch, isTorchOn, toggleTorch };
};
