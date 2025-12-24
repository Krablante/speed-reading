import React, { useMemo } from 'react';
import { ORP_SCALE } from '../constants';
import { WordSplit } from '../types';

interface ReaderDisplayProps {
  word: string;
}

const ReaderDisplay: React.FC<ReaderDisplayProps> = ({ word }) => {
  const split: WordSplit = useMemo(() => {
    if (!word) return { left: '', pivot: '', right: '' };
    
    // Calculate ORP index
    // Length 1 -> 0
    // Length 2-5 -> 1
    // Length > 5 -> 35%
    let pivotIndex = 0;
    const len = word.length;
    
    if (len === 1) pivotIndex = 0;
    else if (len >= 2 && len <= 5) pivotIndex = 1;
    else pivotIndex = Math.ceil((len - 1) * ORP_SCALE);

    // Safety clamp
    if (pivotIndex >= len) pivotIndex = len - 1;

    // Handle punctuation being stripped for ORP calculation? 
    // Ideally we highlight the letter, not punctuation.
    // But simplistic ORP on raw string is usually fine for RSVP.
    
    return {
      left: word.slice(0, pivotIndex),
      pivot: word[pivotIndex],
      right: word.slice(pivotIndex + 1),
    };
  }, [word]);

  return (
    <div className="relative w-full max-w-4xl h-64 flex items-center justify-center select-none overflow-hidden">
      {/* ORP Guidelines (Visual Aid - optional, kept minimal) */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-200 dark:bg-gray-800 opacity-20 transform -translate-x-1/2"></div>
      <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-200 dark:bg-gray-800 opacity-20 transform -translate-y-1/2"></div>

      {/* Word Container */}
      {/* 
        We use a grid with two columns.
        Left col: justifies end (aligns right).
        Right col: justifies start (aligns left).
        This puts the boundary exactly in the center.
        We place the Pivot Character in the Right Column, but we need to offset it slightly 
        so the center of the Pivot Character aligns with the center line.
        Alternatively, simpler logic:
        Flex container. 
        Left part: flex-1, text-right.
        Pivot: w-auto, but monospaced looks best. 
        If sans-serif is required:
        We can use specific relative positioning.
      */}
      
      <div className="flex items-baseline w-full text-5xl md:text-7xl font-bold leading-none tracking-wide text-gray-800 dark:text-gray-100 font-sans">
        
        {/* Left Side */}
        <div className="flex-1 text-right pr-1">
          {split.left}
        </div>

        {/* Pivot */}
        <div className="flex-none text-red-500 dark:text-red-400 font-extrabold mx-px">
          {split.pivot}
        </div>

        {/* Right Side */}
        <div className="flex-1 text-left pl-1">
          {split.right}
        </div>
      </div>
    </div>
  );
};

export default ReaderDisplay;
