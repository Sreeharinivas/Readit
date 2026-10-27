import { useState, useEffect, useCallback, useRef } from 'react';
import { getVoices } from '../services/tts';

interface UseSpeechProps {
  text: string;
  speed?: number;
}

export const useSpeech = ({ text, speed = 1.0 }: UseSpeechProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const initSpeech = useCallback(async () => {
    if (!text) return;
    
    // Attempt to load voices, mostly to ensure they are ready
    await getVoices();
    
    utteranceRef.current = new SpeechSynthesisUtterance(text);
    utteranceRef.current.rate = speed;
    
    utteranceRef.current.onboundary = (event) => {
      if (event.name === 'word') {
        // Calculate an approximate word index based on character offset
        const prefix = text.substring(0, event.charIndex);
        const wordCount = prefix.split(/\s+/).length - 1;
        setCurrentWordIndex(wordCount);
      }
    };

    utteranceRef.current.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentWordIndex(-1);
    };

    utteranceRef.current.onerror = (e) => {
      console.error("Speech error", e);
      setIsPlaying(false);
      setIsPaused(false);
    };
  }, [text, speed]);

  useEffect(() => {
    initSpeech();
    return () => {
      synthRef.current.cancel();
    };
  }, [initSpeech]);

  const play = useCallback(() => {
    if (!utteranceRef.current) return;
    
    if (isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      synthRef.current.cancel(); // Reset
      synthRef.current.speak(utteranceRef.current);
      setIsPlaying(true);
      setIsPaused(false);
    }
  }, [isPaused]);

  const pause = useCallback(() => {
    if (isPlaying) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    synthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentWordIndex(-1);
  }, []);

  return { play, pause, stop, isPlaying, isPaused, currentWordIndex };
};
