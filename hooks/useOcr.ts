import { useState, useCallback } from 'react';
import { performOcr, type OcrResult } from '../services/ocr';

export const useOcr = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (imageSource: string): Promise<OcrResult | null> => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const result = await performOcr(imageSource, (p) => setProgress(p));
      if (result.confidence < 30) {
        throw new Error("Text detection confidence is very low. Please try capturing a clearer image.");
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during OCR.');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return { processImage, isProcessing, progress, error };
};
