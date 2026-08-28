import React from 'react';
import { useReading } from '../context/ReadingContext';
import { OpenTaleAppIcon } from './OpenTaleLogo';
import { 
  BookOpen, Sparkles, Award, BookMarked, Database 
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    unlockedBadgeIds, 
    vocabVault,
    setIsImportModalOpen
  } = useReading();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo (Sleek & Proportional) */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none py-1"
        >
          <OpenTaleAppIcon className="w-9 h-9 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform duration-300 shadow-sm" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-xl sm:text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                OpenTale
              </span>
              <span className="px-2 py-0.5 rounded-full bg-peach-100 text-peach-800 text-[10px] font-bold shadow-2xs border border-peach-200/60">
                by Raza
              </span>
            </div>
            <p className="text-[10px] text-cozy-muted font-sans font-medium tracking-wide leading-none">Interactive Reading Platform</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1.5 bg-cozy-card/90 p-1.5 rounded-full border border-cozy-border shadow-inner-soft">
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'landing' ? 'bg-peach-500 text-white shadow-sm' : 'text-cozy-muted hover:text-cozy-text'
            }`}
          >
            <Sparkles className="w-4 h-4" /> Explore
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'library' || activeTab === 'reader' ? 'bg-peach-500 text-white shadow-sm' : 'text-cozy-muted hover:text-cozy-text'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Library
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'vocab' ? 'bg-peach-500 text-white shadow-sm' : 'text-cozy-muted hover:text-cozy-text'
            }`}
          >
            <BookMarked className="w-4 h-4" /> Vocab ({vocabVault.length})
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'badges' ? 'bg-peach-500 text-white shadow-sm' : 'text-cozy-muted hover:text-cozy-text'
            }`}
          >
            <Award className="w-4 h-4" /> Badges ({unlockedBadgeIds.length})
          </button>
        </nav>

        {/* Action Button: Sync/Export */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-peach-100 text-peach-800 hover:bg-peach-200 transition-colors text-xs font-bold shadow-xs"
            title="Import EPUB/PDF or Export Notes"
          >
            <Database className="w-4 h-4 text-peach-600" /> Sync / Export
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
          onClick={() => setActiveTab('vocab')}
          className={`flex flex-col items-center gap-1 text-xs font-medium ${activeTab === 'vocab' ? 'text-peach-600 font-bold' : 'text-cozy-muted'}`}
        >
          <BookMarked className="w-4 h-4" /> Vocab ({vocabVault.length})
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
