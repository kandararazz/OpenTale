import React from 'react';
import { useReading } from '../context/ReadingContext';
import { X, BookOpen, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const TableOfContentsDrawer = ({ isOpen, onClose }) => {
  const { currentBook, activePageIndex, openBookInReader, readingProgress } = useReading();

  if (!isOpen || !currentBook) return null;

  const totalPages = currentBook.pages.length;
  const highestPageVisited = readingProgress[currentBook.id] || 0;

  const handleSelectChapter = (idx) => {
    openBookInReader(currentBook, idx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl text-slate-800 dark:text-slate-100 animate-in slide-in-from-left duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-peach-500" />
            <h3 className="font-playful text-lg font-bold">Table of Contents</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Title Info */}
        <div className="p-5 bg-peach-50/50 dark:bg-peach-950/20 border-b border-peach-100 dark:border-peach-900/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-peach-600 dark:text-peach-400 block">
            {currentBook.genre} • {totalPages} Chapters
          </span>
          <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-white truncate">
            {currentBook.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">By {currentBook.author}</p>
        </div>

        {/* Chapter List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {currentBook.pages.map((page, idx) => {
            const isActive = idx === activePageIndex;
            const isRead = idx <= highestPageVisited;
            const estMinutes = Math.max(1, Math.ceil(page.text.split(/\s+/).length / 200));

            return (
              <div
                key={idx}
                onClick={() => handleSelectChapter(idx)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isActive 
                    ? 'bg-amber-500 text-white border-amber-500 shadow-md scale-[1.01]' 
                    : isRead 
                      ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-amber-400' 
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-75 hover:opacity-100 hover:border-amber-300'
                }`}
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      Chapter {idx + 1}
                    </span>
                    {isRead && !isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {page.title || `Chapter ${idx + 1}`}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-xs">
                  <span className={`text-[11px] font-medium flex items-center gap-1 ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    <Clock className="w-3 h-3" /> {estMinutes}m
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
          Click any chapter to jump directly
        </div>
      </div>
    </div>
  );
};
