import Tesseract from 'tesseract.js';

export interface OcrResult {
  text: string;
  confidence: number;
}

export const performOcr = async (
  imageSource: string | HTMLImageElement | HTMLCanvasElement, 
  onProgress?: (progress: number) => void
): Promise<OcrResult> => {
  try {
    const worker = await Tesseract.createWorker('eng', 1, {
      logger: m => {
        if (m.status === 'recognizing text' && onProgress) {
          onProgress(m.progress);
        }
      }
    });

    const { data: { text, confidence } } = await worker.recognize(imageSource);
    await worker.terminate();

    return { text, confidence };
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error('Failed to extract text from the image. Please try again.');
  }
};
