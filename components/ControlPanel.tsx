import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Rewind, SkipBack, SkipForward, ChevronUp, ChevronDown } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  wpm: number;
  progress: number;
  onTogglePlay: () => void;
  onRestart: () => void;
  onSeek: (delta: number) => void;
  onChangeSpeed: (delta: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  wpm,
  progress,
  onTogglePlay,
  onRestart,
  onSeek,
  onChangeSpeed,
}) => {

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onTogglePlay();
          break;
        case 'ArrowLeft':
          onSeek(-10);
          break;
        case 'ArrowRight':
          onSeek(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          onChangeSpeed(25);
          break;
        case 'ArrowDown':
          e.preventDefault();
          onChangeSpeed(-25);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, onSeek, onChangeSpeed]);

  return (
    <div className="w-full max-w-2xl flex flex-col items-center space-y-6 animate-fade-in-up">
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-6">
        
        {/* Rewind Group */}
        <div className="flex items-center space-x-2">
           <button 
            onClick={onRestart}
            className="p-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            title="Restart"
          >
            <RotateCcw size={20} />
          </button>
          <button 
            onClick={() => onSeek(-50)}
            className="p-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            title="-50 words"
          >
            <SkipBack size={20} />
          </button>
          <button 
            onClick={() => onSeek(-10)}
            className="p-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            title="-10 words"
          >
            <Rewind size={24} />
          </button>
        </div>

        {/* Play/Pause Button (Hero) */}
        <button 
          onClick={onTogglePlay}
          className="p-6 bg-gray-900 text-white dark:bg-white dark:text-black rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
        >
          {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        {/* Forward Group */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onSeek(10)}
            className="p-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            title="+10 words"
          >
            <FastForward size={24} />
          </button>
          <button 
            onClick={() => onSeek(50)}
            className="p-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            title="+50 words"
          >
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      {/* Speed Control */}
      <div className="flex flex-col items-center">
        <span className="text-xs uppercase tracking-wider text-gray-400 mb-1">Speed</span>
        <div className="flex items-center space-x-4 bg-white dark:bg-gray-900 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => onChangeSpeed(-25)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <ChevronDown size={20} />
          </button>
          <span className="text-xl font-bold font-mono min-w-[3ch] text-center">{wpm}</span>
          <span className="text-sm text-gray-500">WPM</span>
          <button 
            onClick={() => onChangeSpeed(25)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <ChevronUp size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ControlPanel;
