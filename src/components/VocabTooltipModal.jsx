import React from 'react';
import { useReading } from '../context/ReadingContext';
import { Volume2, BookmarkPlus, X, Sparkles } from 'lucide-react';

export const VocabTooltipModal = () => {
  const { activeVocabTooltip, setActiveVocabTooltip, addWordToVocabVault } = useReading();

  if (!activeVocabTooltip) return null;

  const speakWord = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeVocabTooltip.word);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-confetti-bounce">
      
      <div className="bg-white rounded-3xl border-2 border-peach-300 shadow-2xl p-6 sm:p-8 max-w-md w-full relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveVocabTooltip(null)}
          className="absolute top-4 right-4 p-2 rounded-full bg-cozy-bg text-cozy-muted hover:text-cozy-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Word Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-butter-100 border border-butter-300 text-amber-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Vocabulary Spotlight
          </div>
          
          <div className="flex items-center gap-3">
            <h3 className="font-playful text-3xl font-bold text-peach-600 capitalize">
              {activeVocabTooltip.word}
            </h3>

            {/* Audio Pronunciation Button */}
            <button
              onClick={speakWord}
              className="p-2.5 rounded-2xl bg-peach-100 hover:bg-peach-200 text-peach-700 transition-colors shadow-sm"
              title="Hear Pronunciation"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
            </button>
          </div>

          <p className="text-xs font-semibold text-cozy-muted tracking-wide">
            Phonetic: <span className="font-bold text-sage-600">[{activeVocabTooltip.phonetic}]</span>
          </p>
        </div>

        {/* Definition Card */}
        <div className="p-4 rounded-2xl bg-cozy-bg border border-cozy-border space-y-2">
          <p className="text-xs uppercase tracking-wider font-bold text-cozy-muted">Meaning:</p>
          <p className="text-sm sm:text-base text-cozy-text font-medium leading-relaxed">
            {activeVocabTooltip.definition}
          </p>
        </div>

        {/* Example Sentence Card */}
        <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 space-y-1">
          <p className="text-xs uppercase tracking-wider font-bold text-sage-700">In a Sentence:</p>
          <p className="text-sm text-sage-900 italic">
            "{activeVocabTooltip.sentence}"
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              addWordToVocabVault(activeVocabTooltip);
              setActiveVocabTooltip(null);
            }}
            className="flex-1 py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-playful font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <BookmarkPlus className="w-4 h-4" /> Save to Vocab Vault
          </button>

          <button
            onClick={() => setActiveVocabTooltip(null)}
            className="px-5 py-3 rounded-2xl bg-cozy-bg hover:bg-cozy-border/50 text-cozy-text font-bold text-sm transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
