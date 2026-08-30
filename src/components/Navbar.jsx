import React from 'react';
import { useReading } from '../context/ReadingContext';
import { OpenTaleAppIcon } from './OpenTaleLogo';
import { 
  BookOpen, Sparkles, Award, BookMarked, Database, PenTool 
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    unlockedBadgeIds, 
    vocabVault,
    setIsImportModalOpen,
    todayMinutesRead,
    targetMinutes
  } = useReading();

  const minutesPercent = Math.min(100, Math.round((todayMinutesRead / targetMinutes) * 100));

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 transition-colors duration-300 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none py-1"
        >
          <OpenTaleAppIcon className="w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform duration-300 shadow-sm" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800">
                OpenTale
              </span>
            </div>
            <p className="text-[10px] text-cozy-muted font-sans font-medium tracking-wide leading-none">Interactive Reading Platform</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60 shadow-inner-soft">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'landing' ? 'bg-peach-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Explore
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'library' || activeTab === 'reader' ? 'bg-peach-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Library
          </button>

          <button
            onClick={() => setActiveTab('author')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'author' ? 'bg-peach-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Author Studio
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'vocab' ? 'bg-peach-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" /> Vocab ({vocabVault.length})
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'badges' ? 'bg-peach-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Badges ({unlockedBadgeIds.length})
          </button>
        </nav>

        {/* Action Button & Reading Timer Pill */}
        <div className="flex items-center gap-3">
          
          {/* Subtle Today Reading Time Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">
            <span>{todayMinutesRead}m read today</span>
            <div className="w-8 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-peach-500 rounded-full transition-all duration-500" 
                style={{ width: `${minutesPercent}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-peach-500 hover:bg-peach-600 text-white transition-colors text-xs font-bold shadow-xs"
            title="Import EPUB/PDF or Export Notes"
          >
            <Database className="w-3.5 h-3.5 text-white" /> Sync / Export
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-2.5 px-4 bg-cozy-card/95 border-t border-cozy-border">
        <button 
          onClick={() => setActiveTab('landing')}
          className={`flex flex-col items-center gap-1 text-xs font-medium ${activeTab === 'landing' ? 'text-peach-600 font-bold' : 'text-cozy-muted'}`}
        >
          <Sparkles className="w-4 h-4" /> Home
        </button>
        <button 
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center gap-1 text-xs font-medium ${activeTab === 'library' || activeTab === 'reader' ? 'text-peach-600 font-bold' : 'text-cozy-muted'}`}
        >
          <BookOpen className="w-4 h-4" /> Library
        </button>
        <button 
          onClick={() => setActiveTab('author')}
          className={`flex flex-col items-center gap-1 text-xs font-medium ${activeTab === 'author' ? 'text-peach-600 font-bold' : 'text-cozy-muted'}`}
        >
          <PenTool className="w-4 h-4" /> Author
        </button>
        <button 
          onClick={() => setActiveTab('vocab')}
          className={`flex flex-col items-center gap-1 text-xs font-medium ${activeTab === 'vocab' ? 'text-peach-600 font-bold' : 'text-cozy-muted'}`}
        >
          <BookMarked className="w-4 h-4" /> Vocab
        </button>
        <button 
          onClick={() => setActiveTab('badges')}
          className={`flex flex-col items-center gap-1 text-xs font-medium ${activeTab === 'badges' ? 'text-peach-600 font-bold' : 'text-cozy-muted'}`}
        >
          <Award className="w-4 h-4" /> Badges
        </button>
      </div>
    </header>
  );
};
