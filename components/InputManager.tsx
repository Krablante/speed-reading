import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, Search, BrainCircuit, X } from 'lucide-react';
import { InputType } from '../types';
import { generateContentWithSearch, generateDeepContent } from '../services/geminiService';

interface InputManagerProps {
  onStartReading: (text: string) => void;
}

const InputManager: React.FC<InputManagerProps> = ({ onStartReading }) => {
  const [activeTab, setActiveTab] = useState<InputType>(InputType.PASTE);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState<'search' | 'think'>('search');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          onStartReading(content);
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a valid .txt file");
      }
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    setAiError(null);
    try {
      let content = '';
      if (aiMode === 'search') {
        content = await generateContentWithSearch(inputText);
      } else {
        content = await generateDeepContent(inputText);
      }
      onStartReading(content);
    } catch (err: any) {
      setAiError(err.message || "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Tabs */}
      <div className="flex border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setActiveTab(InputType.PASTE)}
          className={`flex-1 py-4 flex items-center justify-center space-x-2 text-sm font-medium transition-colors ${
            activeTab === InputType.PASTE 
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <FileText size={18} />
          <span>Paste Text</span>
        </button>
        <button
          onClick={() => setActiveTab(InputType.FILE)}
          className={`flex-1 py-4 flex items-center justify-center space-x-2 text-sm font-medium transition-colors ${
            activeTab === InputType.FILE 
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <Upload size={18} />
          <span>Upload File</span>
        </button>
        <button
          onClick={() => setActiveTab(InputType.AI)}
          className={`flex-1 py-4 flex items-center justify-center space-x-2 text-sm font-medium transition-colors ${
            activeTab === InputType.AI 
              ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/10' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          <Sparkles size={18} />
          <span>Generate AI</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 min-h-[300px] flex flex-col">
        
        {activeTab === InputType.PASTE && (
          <div className="flex-1 flex flex-col space-y-4">
            <textarea
              className="flex-1 w-full p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
              placeholder="Paste your text here to begin reading..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={() => onStartReading(inputText)}
              disabled={!inputText.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Start Reading
            </button>
          </div>
        )}

        {activeTab === InputType.FILE && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl hover:border-indigo-500 transition-colors bg-gray-50 dark:bg-gray-950/50">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-full shadow-sm">
              <Upload size={40} className="text-indigo-500" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select a .txt file</h3>
              <p className="text-sm text-gray-500 mt-1">Plain text files only</p>
            </div>
            <input
              type="file"
              accept=".txt"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              Choose File
            </button>
          </div>
        )}

        {activeTab === InputType.AI && (
          <div className="flex-1 flex flex-col space-y-6">
             <div className="flex space-x-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg self-start">
               <button
                 onClick={() => setAiMode('search')}
                 className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-all ${
                   aiMode === 'search' 
                   ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-white' 
                   : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                 }`}
               >
                 <Search size={16} />
                 <span>Search & Read</span>
               </button>
               <button
                 onClick={() => setAiMode('think')}
                 className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition-all ${
                   aiMode === 'think' 
                   ? 'bg-white dark:bg-gray-700 shadow-sm text-purple-600 dark:text-purple-300' 
                   : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                 }`}
               >
                 <BrainCircuit size={16} />
                 <span>Deep Thinking</span>
               </button>
             </div>

             <div className="relative flex-1">
                <textarea
                  className="w-full h-full min-h-[150px] p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                  placeholder={aiMode === 'search' ? "Enter a topic to search for (e.g., 'Recent breakthroughs in fusion energy')..." : "Enter a complex topic to explain (e.g., 'Explain Quantum Entanglement like I'm 5')..."}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isGenerating}
                />
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {aiMode === 'search' ? 'Searching web & summarizing...' : 'Thinking deeply & generating...'}
                    </p>
                  </div>
                )}
             </div>

             {aiError && (
               <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center justify-between">
                 <span>{aiError}</span>
                 <button onClick={() => setAiError(null)}><X size={16}/></button>
               </div>
             )}

            <button
              onClick={handleGenerate}
              disabled={!inputText.trim() || isGenerating}
              className={`w-full py-3 font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 ${
                aiMode === 'think' 
                ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Sparkles size={18} />
              <span>Generate Content</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default InputManager;
