import React, { useState } from 'react';
import { Sparkles, Bot, ArrowRight, X, ShieldCheck } from 'lucide-react';

export const AICatchUpModal = ({ bookTitle, pageIndex, isOpen, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState(null);

  if (!isOpen) return null;

  const generateRecap = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSummary(
        `Catch-Up Recap for "${bookTitle}": In the previous chapters, Barnaby the squirrel set out into the glowing Starling Hollow woods with his brass lantern. Guided by Pip the owl and glowing moss fungi, he reached Willow Creek to solve the Water Maiden's riddle.`
      );
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-confetti-bounce">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-purple-300 shadow-2xl p-6 sm:p-8 max-w-md w-full relative space-y-6 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cozy-border pb-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-500" />
            <h3 className="font-playful text-xl font-bold">AI Chapter Catch-Up</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-cozy-bg dark:bg-slate-800 text-cozy-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!summary ? (
          <div className="text-center py-6 space-y-4">
            <Sparkles className="w-10 h-10 text-purple-500 mx-auto animate-pulse" />
            <div>
              <h4 className="font-playful text-lg font-bold">Welcome Back to OpenTale!</h4>
              <p className="text-xs text-cozy-muted max-w-xs mx-auto mt-1">
                Generates a quick, spoiler-free recap of previous chapters so you never lose your place.
              </p>
            </div>
            <button
              onClick={generateRecap}
              disabled={isGenerating}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-playful font-bold text-sm shadow transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {isGenerating ? 'Synthesizing Recap...' : 'Generate Catch-Up Summary'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 leading-relaxed space-y-2">
              <span className="font-bold uppercase tracking-wider block text-purple-700">Spoiler-Free Summary:</span>
              <p>{summary}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-playful font-bold text-sm shadow transition-colors"
            >
              Continue Reading
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
