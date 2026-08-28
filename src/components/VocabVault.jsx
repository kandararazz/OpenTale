import React, { useState } from 'react';
import { useReading } from '../context/ReadingContext';
import { Volume2, BookMarked, Sparkles, RotateCw, CheckCircle, Brain } from 'lucide-react';

export const VocabVault = () => {
  const { vocabVault, setActiveTab } = useReading();
  const [flippedWordIndex, setFlippedWordIndex] = useState(null);
  const [practiceMode, setPracticeMode] = useState(false);

  const speakWord = (word) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-lavender-400 via-lavender-300 to-sky-300 rounded-3xl p-6 md:p-10 text-white shadow-cozy flex items-center justify-between">
        <div className="space-y-3 max-w-xl">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
            Personal Word Collection
          </span>
          <h1 className="font-playful text-3xl sm:text-4xl font-extrabold tracking-tight">
            My Vocab Vault 🧠
          </h1>
          <p className="text-white/90 text-sm sm:text-base">
            You've collected <span className="font-bold underline">{vocabVault.length} tricky words</span> from your reading adventures! Tap cards to flip between meanings and practice pronunciation.
          </p>
        </div>

        <div className="hidden md:block text-7xl transform hover:scale-110 transition-transform">
          📚
        </div>
      </div>

      {vocabVault.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-cozy-border p-8 space-y-4">
          <span className="text-5xl">💡</span>
          <h3 className="font-playful text-xl font-bold text-cozy-text">Your Vocab Vault is empty</h3>
          <p className="text-cozy-muted text-sm max-w-md mx-auto">
            While reading stories in OpenTale, click on any highlighted tricky word to learn its definition and save it here!
          </p>
          <button
            onClick={() => setActiveTab('library')}
            className="px-6 py-3 bg-peach-500 hover:bg-peach-600 text-white font-playful font-bold rounded-2xl text-sm shadow transition-colors"
          >
            Explore Library Stories
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vocabVault.map((item, idx) => {
            const isFlipped = flippedWordIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => setFlippedWordIndex(isFlipped ? null : idx)}
                className="perspective-1000 min-h-[220px] cursor-pointer group"
              >
                <div
                  className={`w-full h-full rounded-3xl p-6 border-2 transition-all duration-500 transform-style-3d flex flex-col justify-between shadow-cozy hover:shadow-cozy-hover ${
                    isFlipped
                      ? 'bg-lavender-100 border-lavender-300 text-slate-800'
                      : 'bg-white border-cozy-border hover:border-peach-300'
                  }`}
                >
                  
                  {/* Front View */}
                  {!isFlipped ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-peach-100 text-peach-700 text-xs font-bold">
                          {item.bookTitle || 'OpenTale Story'}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakWord(item.word);
                          }}
                          className="p-2 rounded-xl bg-peach-50 hover:bg-peach-100 text-peach-600 transition-colors"
                          title="Listen Pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="my-auto space-y-1 text-center py-4">
                        <h3 className="font-playful text-2xl font-bold text-peach-600 capitalize group-hover:scale-105 transition-transform">
                          {item.word}
                        </h3>
                        <p className="text-xs font-semibold text-cozy-muted">
                          [{item.phonetic}]
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-cozy-muted border-t border-cozy-border/60 pt-3">
                        <span className="flex items-center gap-1 font-semibold">
                          <RotateCw className="w-3.5 h-3.5" /> Tap card to see definition
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-butter-500" />
                      </div>
                    </>
                  ) : (
                    /* Back View (Definition) */
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-playful text-sm font-bold text-lavender-500 capitalize">
                            {item.word}
                          </span>
                          <span className="text-xs font-bold text-slate-500">Definition</span>
                        </div>
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">
                          {item.definition}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/70 border border-lavender-200 text-xs text-slate-600 italic">
                        "{item.sentence}"
                      </div>

                      <p className="text-xs text-center text-lavender-500 font-bold">
                        Tap again to flip back
                      </p>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
