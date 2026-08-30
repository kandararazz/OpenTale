import React, { useState } from 'react';
import { useReading } from '../context/ReadingContext';
import { X, Image as ImageIcon, Sparkles, Check, RefreshCw, Palette, Wand2 } from 'lucide-react';

const COVER_MOOD_THEMES = [
  { 
    id: 'twilight', 
    name: 'Mystical Twilight', 
    mood: 'Whimsical & Mysterious',
    from: 'from-slate-950', 
    via: 'via-indigo-950', 
    to: 'to-purple-950', 
    accent: 'text-amber-300', 
    icon: '🌲',
    pattern: 'radial-gradient(circle at 50% 30%, rgba(168, 85, 247, 0.25), transparent 70%)'
  },
  { 
    id: 'cosmic', 
    name: 'Cosmic Starlight', 
    mood: 'Futuristic & Sci-Fi',
    from: 'from-purple-950', 
    via: 'via-slate-900', 
    to: 'to-blue-950', 
    accent: 'text-cyan-300', 
    icon: '🚀',
    pattern: 'radial-gradient(circle at 70% 20%, rgba(56, 189, 248, 0.3), transparent 60%)'
  },
  { 
    id: 'enchanted', 
    name: 'Golden Fantasy', 
    mood: 'Epic & Heroic',
    from: 'from-amber-950', 
    via: 'via-orange-950', 
    to: 'to-stone-950', 
    accent: 'text-amber-200', 
    icon: '✨',
    pattern: 'radial-gradient(circle at 30% 40%, rgba(245, 158, 11, 0.3), transparent 60%)'
  },
  { 
    id: 'oceanic', 
    name: 'Abyssal Ocean', 
    mood: 'Serene & Atmospheric',
    from: 'from-cyan-950', 
    via: 'via-blue-950', 
    to: 'to-slate-950', 
    accent: 'text-teal-300', 
    icon: '🌊',
    pattern: 'radial-gradient(circle at 50% 60%, rgba(20, 184, 166, 0.3), transparent 70%)'
  },
  { 
    id: 'noir', 
    name: 'Classic Noir', 
    mood: 'Dramatic & Suspenseful',
    from: 'from-zinc-950', 
    via: 'via-stone-900', 
    to: 'to-black', 
    accent: 'text-rose-400', 
    icon: '🎩',
    pattern: 'radial-gradient(circle at 20% 20%, rgba(244, 63, 94, 0.25), transparent 60%)'
  },
  { 
    id: 'cozy', 
    name: 'Cozy Solstice', 
    mood: 'Warm & Heartfelt',
    from: 'from-rose-950', 
    via: 'via-peach-950', 
    to: 'to-amber-950', 
    accent: 'text-peach-200', 
    icon: '🕯️',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.25), transparent 65%)'
  }
];

export const CoverGeneratorModal = () => {
  const { isCoverModalOpen, setIsCoverModalOpen, currentBook, activePageIndex, showToast } = useReading();
  const [selectedTheme, setSelectedTheme] = useState(COVER_MOOD_THEMES[0]);
  const [customArtPrompt, setCustomArtPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isCoverModalOpen || !currentBook) return null;

  const currentChapter = currentBook.pages?.[activePageIndex] || currentBook.pages?.[0] || { title: 'Chapter 1' };

  const handleGenerateArt = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      showToast('Chapter cover art generated!', '🪄');
    }, 800);
  };

  const handleApplyCover = () => {
    showToast(`Instant Cover Art applied for "${currentBook.title}"!`, '🎨');
    setIsCoverModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-cozy-border shadow-2xl overflow-hidden space-y-6 p-6 md:p-8 animate-scale-up max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cozy-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-playful font-extrabold text-lg text-slate-800">
                Instant Chapter Cover Art
              </h3>
              <p className="text-xs text-cozy-muted">Generate styled digital book covers based on theme, setting & mood</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCoverModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Cover Preview Canvas */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">Live Chapter Cover Preview</label>
          
          <div 
            className={`p-8 rounded-3xl bg-gradient-to-br ${selectedTheme.from} ${selectedTheme.via} ${selectedTheme.to} text-white text-center space-y-5 shadow-2xl border border-white/15 relative overflow-hidden transition-all duration-500`}
            style={{ backgroundImage: selectedTheme.pattern }}
          >
            <div className="flex items-center justify-between text-white/60 text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-2">
              <span>OpenTale Illustrated</span>
              <span>{selectedTheme.mood}</span>
            </div>

            <div className="my-4 space-y-2">
              <div className="text-6xl animate-bounce">{selectedTheme.icon}</div>
              <h4 className={`font-serif text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight ${selectedTheme.accent}`}>
                {currentBook.title}
              </h4>
              <p className="text-xs font-serif italic text-slate-300">
                {currentChapter.title}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>By {currentBook.author || 'Author'}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                {currentBook.genre || 'Story'}
              </span>
            </div>
          </div>
        </div>

        {/* Select Mood & Theme */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">1. Select Chapter Mood & Style</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COVER_MOOD_THEMES.map(t => (
              <button
                type="button"
                key={t.id}
                onClick={() => setSelectedTheme(t)}
                className={`p-2.5 rounded-2xl border text-left space-y-1 transition-all ${
                  selectedTheme.id === t.id ? 'border-purple-500 bg-purple-50 text-purple-900 font-bold shadow-xs scale-105' : 'bg-cozy-bg border-cozy-border text-slate-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{t.icon}</span>
                  <span className="text-xs truncate">{t.name}</span>
                </div>
                <p className="text-[10px] text-cozy-muted truncate">{t.mood}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Optional Art Prompt */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">2. Custom Visual Prompt (Optional)</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={customArtPrompt}
              onChange={(e) => setCustomArtPrompt(e.target.value)}
              placeholder="e.g. Glowing silver compass inside an ancient forest..."
              className="flex-1 px-3.5 py-2.5 bg-cozy-bg border border-cozy-border rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleGenerateArt}
              disabled={isGenerating}
              className="px-3.5 py-2.5 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1"
            >
              {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
              Generate
            </button>
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApplyCover}
          className="w-full py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-playful font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Apply Cover Art
        </button>

      </div>
    </div>
  );
};
