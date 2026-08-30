import React, { useState } from 'react';
import { useReading } from '../context/ReadingContext';
import { X, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

const COVER_THEMES = [
  { id: 'twilight', name: 'Twilight Forest', from: 'from-slate-900', via: 'from-indigo-900', to: 'to-purple-950', accent: 'text-amber-300', icon: '🌲' },
  { id: 'cosmic', name: 'Cosmic Nebula', from: 'from-purple-950', via: 'from-pink-900', to: 'to-slate-950', accent: 'text-pink-300', icon: '🚀' },
  { id: 'enchanted', name: 'Enchanted Gold', from: 'from-amber-900', via: 'from-orange-800', to: 'to-amber-950', accent: 'text-amber-200', icon: '✨' },
  { id: 'oceanic', name: 'Deep Sea Abyss', from: 'from-cyan-950', via: 'from-blue-900', to: 'to-slate-950', accent: 'text-cyan-300', icon: '🌊' }
];

export const CoverGeneratorModal = () => {
  const { isCoverModalOpen, setIsCoverModalOpen, currentBook, showToast } = useReading();
  const [selectedTheme, setSelectedTheme] = useState(COVER_THEMES[0]);

  if (!isCoverModalOpen || !currentBook) return null;

  const handleApplyCover = () => {
    showToast('Chapter cover art generated & applied!', '🎨');
    setIsCoverModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl border border-cozy-border shadow-2xl overflow-hidden space-y-6 p-6 md:p-8 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cozy-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-playful font-extrabold text-lg text-slate-800">
                Instant Cover Art Generator
              </h3>
              <p className="text-xs text-cozy-muted">Generate styled digital book covers based on mood</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCoverModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Cover Preview */}
        <div className={`p-8 rounded-3xl bg-gradient-to-br ${selectedTheme.from} ${selectedTheme.to} text-white text-center space-y-4 shadow-xl border border-white/10 relative overflow-hidden`}>
          <div className="text-5xl">{selectedTheme.icon}</div>
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">OpenTale Edition</span>
            <h4 className={`font-serif text-2xl font-bold leading-tight ${selectedTheme.accent}`}>
              {currentBook.title}
            </h4>
            <p className="text-xs text-slate-300 font-medium">By {currentBook.author || 'Author'}</p>
          </div>
        </div>

        {/* Theme Palette Options */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">Select Artwork Theme</label>
          <div className="grid grid-cols-2 gap-2">
            {COVER_THEMES.map(t => (
              <button
                type="button"
                key={t.id}
                onClick={() => setSelectedTheme(t)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  selectedTheme.id === t.id ? 'border-purple-500 bg-purple-50 text-purple-900 font-bold' : 'bg-cozy-bg border-cozy-border text-slate-700 hover:bg-white'
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <span className="text-xs">{t.name}</span>
              </button>
            ))}
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
