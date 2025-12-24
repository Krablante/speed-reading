import React, { useState, useEffect } from 'react';
import { Moon, Sun, ArrowLeft, BookOpen } from 'lucide-react';
import { useRSVPEngine } from './hooks/useRSVPEngine';
import ReaderDisplay from './components/ReaderDisplay';
import ControlPanel from './components/ControlPanel';
import InputManager from './components/InputManager';
import { DEFAULT_WPM, SAMPLE_TEXT } from './constants';
import { ReaderMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<ReaderMode>(ReaderMode.INPUT);
  const [textContent, setTextContent] = useState<string>(SAMPLE_TEXT);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Hook into the RSVP engine
  const engine = useRSVPEngine(textContent, DEFAULT_WPM);

  // Theme Toggle Logic
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleStartReading = (text: string) => {
    if (!text.trim()) return;
    setTextContent(text);
    setMode(ReaderMode.READING);
  };

  const handleBack = () => {
    engine.restart(); // Stop reading
    setMode(ReaderMode.INPUT);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50 to-transparent dark:from-slate-900/50 dark:to-transparent -z-10" />
      
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
           <div className="p-2 bg-indigo-600 rounded-lg text-white">
             <BookOpen size={24} />
           </div>
           <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
             Zen<span className="text-indigo-600 dark:text-indigo-400">Reader</span>
           </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
        
        {mode === ReaderMode.INPUT ? (
          <div className="w-full flex flex-col items-center animate-fade-in">
             <div className="text-center mb-10 max-w-xl">
               <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                 Master the Art of Speed Reading
               </h2>
               <p className="text-lg text-gray-500 dark:text-gray-400">
                 Read documents, books, and articles 3x faster with our RSVP engine. Paste text, upload files, or ask AI to generate content for you.
               </p>
             </div>
             <InputManager onStartReading={handleStartReading} />
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-between min-h-[60vh] max-w-5xl animate-fade-in">
            
            {/* Top Bar Reading Mode */}
            <div className="w-full flex justify-between items-center mb-8 opacity-50 hover:opacity-100 transition-opacity">
              <button 
                onClick={handleBack}
                className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Choose new text</span>
              </button>
              <div className="text-sm font-mono text-gray-400">
                {engine.currentIndex + 1} / {engine.words.length}
              </div>
            </div>

            {/* RSVP Display */}
            <div className="flex-1 flex items-center justify-center w-full my-8">
              <ReaderDisplay word={engine.currentWord} />
            </div>

            {/* Controls */}
            <div className="w-full flex justify-center mt-12">
               <ControlPanel 
                 isPlaying={engine.isPlaying}
                 wpm={engine.wpm}
                 progress={engine.progress}
                 onTogglePlay={engine.togglePlay}
                 onRestart={engine.restart}
                 onSeek={engine.seek}
                 onChangeSpeed={engine.changeSpeed}
               />
            </div>
            
            {/* Keyboard Guide */}
            <div className="mt-12 text-center text-xs text-gray-400 dark:text-gray-600 hidden md:block">
              <span className="mx-2"><kbd className="font-sans px-1 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">Space</kbd> Play/Pause</span>
              <span className="mx-2"><kbd className="font-sans px-1 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">↑</kbd> Speed Up</span>
              <span className="mx-2"><kbd className="font-sans px-1 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">↓</kbd> Slow Down</span>
              <span className="mx-2"><kbd className="font-sans px-1 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">←</kbd> Back 10</span>
              <span className="mx-2"><kbd className="font-sans px-1 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">→</kbd> Fwd 10</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-sm text-gray-400 dark:text-gray-600">
        <p>&copy; {new Date().getFullYear()} ZenReader. Built with React & Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
