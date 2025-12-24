import React, { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { InputType } from '../types';

interface InputManagerProps {
  onStartReading: (text: string) => void;
}

const InputManager: React.FC<InputManagerProps> = ({ onStartReading }) => {
  const [activeTab, setActiveTab] = useState<InputType>(InputType.PASTE);
  const [inputText, setInputText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Allow text/plain or .txt extension to be more permissible with file types
      const isTextFile = file.type === "text/plain" || file.name.toLowerCase().endsWith('.txt');

      if (isTextFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const buffer = event.target?.result as ArrayBuffer;
          let content = "";
          
          // Encoding detection heuristic:
          // 1. Try UTF-8 with fatal: true. This throws error if invalid byte sequences are found.
          // 2. If it throws, it's likely a legacy encoding. Try Windows-1251 (standard for Russian).
          // 3. If all else fails, fallback to loose UTF-8 (replaces errors with ).
          
          try {
            const decoder = new TextDecoder("utf-8", { fatal: true });
            content = decoder.decode(buffer);
          } catch (e) {
            try {
               // Fallback for Cyrillic/Legacy files
               const decoder = new TextDecoder("windows-1251", { fatal: true });
               content = decoder.decode(buffer);
            } catch (e2) {
               // Final fallback
               const decoder = new TextDecoder("utf-8");
               content = decoder.decode(buffer);
            }
          }
          
          onStartReading(content);
        };
        
        reader.onerror = () => {
          alert("Error reading file");
        };

        // Read as ArrayBuffer to allow manual decoding
        reader.readAsArrayBuffer(file);
      } else {
        alert("Please upload a valid .txt file");
      }
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

      </div>
    </div>
  );
};

export default InputManager;