import React, { useState, useEffect, useRef } from 'react';
import { useReading } from '../context/ReadingContext';
import { Search, X, BookOpen, ArrowRight, CornerDownLeft } from 'lucide-react';

export const InBookSearchModal = ({ isOpen, onClose }) => {
  const { currentBook, openBookInReader, activePageIndex } = useReading();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Execute instant full-text search across all pages/chapters of currentBook
  useEffect(() => {
    if (!query.trim() || !currentBook?.pages) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase().trim();
    const searchMatches = [];

    currentBook.pages.forEach((page, pageIdx) => {
      const text = page.text;
      const lowerText = text.toLowerCase();
      let pos = 0;

      while ((pos = lowerText.indexOf(searchQuery, pos)) !== -1) {
        // Extract surrounding snippet context
        const start = Math.max(0, pos - 40);
        const end = Math.min(text.length, pos + searchQuery.length + 45);
        const prefix = start > 0 ? '...' : '';
        const suffix = end < text.length ? '...' : '';
        const snippet = prefix + text.slice(start, end) + suffix;

        searchMatches.push({
          pageIndex: pageIdx,
          chapterTitle: page.title || `Chapter ${pageIdx + 1}`,
          snippet,
          matchTerm: text.slice(pos, pos + searchQuery.length),
          matchOffset: pos
        });

        pos += searchQuery.length;
        if (searchMatches.length >= 40) break; // Limit to top 40 matches for performance
      }
    });

    setResults(searchMatches);
  }, [query, currentBook]);

  if (!isOpen) return null;

  const handleSelectResult = (result) => {
    openBookInReader(currentBook, result.pageIndex);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[80vh] text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-peach-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search keywords in "${currentBook?.title || 'Book'}"...`}
            className="w-full bg-transparent border-none focus:outline-none text-base sm:text-lg font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
          />
          {query && (
            <button 
              onClick={() => setQuery('')} 
              className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {!query.trim() ? (
            <div className="text-center py-12 text-slate-400 text-xs sm:text-sm space-y-2">
              <BookOpen className="w-8 h-8 mx-auto opacity-40 text-peach-500" />
              <p>Type a keyword or phrase to search instantly across all chapters.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No matching occurrences found for <span className="font-bold text-slate-700 dark:text-slate-200">"{query}"</span>.
            </div>
          ) : (
            <div className="space-y-2">
              <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 flex justify-between">
                <span>{results.length} Occurrences Found</span>
                <span>Press Enter or Click to Jump</span>
              </div>

              {results.map((res, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectResult(res)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    res.pageIndex === activePageIndex 
                      ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700' 
                      : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800 hover:bg-peach-50/60 dark:hover:bg-slate-800 hover:border-peach-300'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-peach-500/10 text-peach-600 dark:text-peach-400 text-[11px] font-bold">
                        {res.chapterTitle} (Page {res.pageIndex + 1})
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {res.snippet.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')).map((part, pIdx) => 
                        part.toLowerCase() === query.toLowerCase() ? (
                          <mark key={pIdx} className="bg-amber-300 dark:bg-amber-600 text-slate-900 dark:text-white px-0.5 rounded font-semibold">
                            {part}
                          </mark>
                        ) : part
                      )}
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-peach-500 shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Jump to matched chapter instantly</span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3.5 h-3.5" /> Quick Jump
          </span>
        </div>
      </div>
    </div>
  );
};
