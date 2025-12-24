import { useState, useEffect, useRef, useCallback } from 'react';
import { PUNCTUATION_DELAYS } from '../constants';

export const useRSVPEngine = (text: string, initialWpm: number) => {
  const [words, setWords] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(initialWpm);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Parse text into words
  useEffect(() => {
    // Split by whitespace but keep punctuation attached to the word
    const cleaned = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWords(cleaned);
    setIndex(0);
    setIsPlaying(false);
  }, [text]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const changeSpeed = useCallback((delta: number) => {
    setWpm(prev => {
      const next = prev + delta;
      return Math.max(100, Math.min(1000, next));
    });
  }, []);

  const seek = useCallback((delta: number) => {
    setIndex(prev => {
      const next = prev + delta;
      return Math.max(0, Math.min(words.length - 1, next));
    });
  }, [words.length]);

  const restart = useCallback(() => {
    setIndex(0);
    setIsPlaying(false);
  }, []);

  // Engine Tick
  useEffect(() => {
    if (!isPlaying || index >= words.length) {
      if (index >= words.length && isPlaying) {
        setIsPlaying(false);
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const currentWord = words[index];
    const baseDelay = 60000 / wpm;
    let delay = baseDelay;

    // Smart Pausing Logic
    const lastChar = currentWord.slice(-1);
    if (PUNCTUATION_DELAYS[lastChar]) {
      delay = baseDelay * PUNCTUATION_DELAYS[lastChar];
    }

    timerRef.current = setTimeout(() => {
      setIndex(prev => prev + 1);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, index, words, wpm]);

  return {
    words,
    currentIndex: index,
    currentWord: words[index] || '',
    isPlaying,
    wpm,
    progress: words.length > 0 ? (index / words.length) * 100 : 0,
    togglePlay,
    changeSpeed,
    seek,
    restart,
    setWpm
  };
};