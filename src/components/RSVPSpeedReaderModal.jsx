import React, { useState, useEffect } from 'react';
import { useReading } from '../context/ReadingContext';
import { Play, Pause, RotateCcw, X, Gauge, Zap } from 'lucide-react';

export const RSVPSpeedReaderModal = ({ text, isOpen, onClose }) => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(300);

  useEffect(() => {
    if (text) {
      const parsedWords = text.split(/\s+/).filter(Boolean);
      setWords(parsedWords);
      setCurrentIndex(0);
      setIsPlaying(false);
    }
  }, [text, isOpen]);

  useEffect(() => {
    let timer = null;
    if (isPlaying && currentIndex < words.length) {
      const intervalMs = (60 / wpm) * 1000;
      timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, intervalMs);
    } else if (currentIndex >= words.length) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, words, wpm]);

  if (!isOpen || words.length === 0) return null;

  const currentWord = words[currentIndex] || '';
  
  // Highlight middle focal character
  const middleIdx = Math.floor(currentWord.length / 2);
  const leftChunk = currentWord.substring(0, middleIdx);
  const focalChar = currentWord[middleIdx] || '';
  const rightChunk = currentWord.substring(middleIdx + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-confetti-bounce">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-xl w-full text-white shadow-2xl space-y-8 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-playful text-lg font-bold">RSVP Speed Reader</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Speed Reader Canvas */}
        <div className="h-48 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center relative overflow-hidden select-none">
          {/* Focal Guides */}
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-peach-500/30 -translate-x-1/2 pointer-events-none"></div>
          
          <div className="font-mono text-4xl sm:text-5xl font-bold tracking-wider flex items-center justify-center">
            <span className="text-slate-400 text-right w-36 sm:w-44">{leftChunk}</span>
            <span className="text-peach-400 text-6xl sm:text-7xl font-extrabold mx-0.5">{focalChar}</span>
            <span className="text-slate-200 text-left w-36 sm:w-44">{rightChunk}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400 font-semibold">
            <span>Word {currentIndex + 1} of {words.length}</span>
            <span>{Math.round(((currentIndex + 1) / words.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-peach-500 rounded-full transition-all duration-150"
              style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between pt-2">
          
          {/* WPM Selector */}
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-400">Speed:</span>
            {[200, 300, 450, 600].map(speed => (
              <button
                key={speed}
                onClick={() => setWpm(speed)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-colors ${
                  wpm === speed ? 'bg-peach-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {speed} WPM
              </button>
            ))}
          </div>

          {/* Play / Pause / Reset */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setCurrentIndex(0); setIsPlaying(false); }}
              className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-6 py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              {isPlaying ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> Start</>}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
