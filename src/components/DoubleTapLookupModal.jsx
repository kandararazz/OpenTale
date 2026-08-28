import React from 'react';
import { getWordLookup } from '../utils/readingEngine';
import { BookOpen, Sparkles, X, History, User, Compass } from 'lucide-react';

export const DoubleTapLookupModal = ({ word, isOpen, onClose }) => {
  if (!isOpen || !word) return null;

  const data = getWordLookup(word);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-confetti-bounce">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-sage-300 shadow-2xl p-6 sm:p-8 max-w-md w-full relative space-y-6 text-slate-800 dark:text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-cozy-bg dark:bg-slate-800 text-cozy-muted hover:text-cozy-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Word Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-bold">
            <Compass className="w-3.5 h-3.5 text-sage-600" />
            Instant Literary Context
          </div>
          <h3 className="font-playful text-3xl font-extrabold text-peach-600 capitalize">
            {data.word}
          </h3>
          <p className="text-xs font-semibold text-sage-600">{data.phonetic}</p>
        </div>

        {/* Definition */}
        <div className="p-4 rounded-2xl bg-cozy-bg dark:bg-slate-800 border border-cozy-border dark:border-slate-700 space-y-1">
          <span className="text-xs uppercase tracking-wider font-bold text-cozy-muted">Definition:</span>
          <p className="text-sm font-medium leading-relaxed">{data.definition}</p>
        </div>

        {/* Etymology & Root History */}
        <div className="p-4 rounded-2xl bg-butter-50 dark:bg-amber-900/30 border border-butter-200 dark:border-amber-700 space-y-1 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            <History className="w-4 h-4" /> Etymology & Word Origin
          </div>
          <p className="text-xs leading-relaxed">{data.etymology}</p>
        </div>

        {/* Historical Context & Character Recap */}
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-700 space-y-2 text-sky-900 dark:text-sky-200">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
            <User className="w-4 h-4" /> Story Character & Historical Context
          </div>
          <p className="text-xs leading-relaxed">
            <strong>Context:</strong> {data.historicalContext}
          </p>
          <p className="text-xs leading-relaxed border-t border-sky-200/60 pt-1.5">
            <strong>OpenTale Recap:</strong> {data.characterRecap}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-playful font-bold text-sm shadow transition-colors"
        >
          Resume Reading
        </button>

      </div>
    </div>
  );
};
