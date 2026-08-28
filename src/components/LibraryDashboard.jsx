import React, { useState, useRef } from 'react';
import { useReading } from '../context/ReadingContext';
import { parseUploadedFile } from '../utils/fileParser';
import { STORIES } from '../data/stories';
import { 
  Search, Filter, BookOpen, Bookmark, Star, Clock, Sparkles, Upload, 
  FileText, Loader2, LayoutGrid, List, Check, ArrowRight
} from 'lucide-react';

export const LibraryDashboard = () => {
  const { 
    openBookInReader, 
    readingProgress, 
    bookmarks, 
    allAvailableBooks, 
    addCustomBook, 
    showToast 
  } = useReading();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef(null);

  const booksToDisplay = allAvailableBooks || STORIES;

  const genres = ['All', 'Fantasy', 'Sci-Fi', 'Fairy Tale', 'Adventure', 'Personal Upload', 'EPUB Book', 'PDF Document'];
  const levels = ['All', 'Ages 6–8', 'Ages 8–10', 'Ages 10–12', 'Custom'];

  const filteredBooks = booksToDisplay.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          book.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || book.genre === selectedGenre;
    const matchesLevel = selectedLevel === 'All' || book.readingLevel === selectedLevel;
    return matchesSearch && matchesGenre && matchesLevel;
  });

  const handleProcessFile = async (file) => {
    if (!file) return;
    setIsParsing(true);
    try {
      const parsedBook = await parseUploadedFile(file);
      addCustomBook(parsedBook);
    } catch (e) {
      console.error(e);
      showToast('Failed to parse file. Try another document.', '⚠️');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-peach-500 via-peach-400 to-butter-300 rounded-3xl p-6 md:p-10 text-white shadow-cozy relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-10 -translate-y-10 text-white/10 text-9xl pointer-events-none select-none">
          📚
        </div>
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
            OpenTale Library
          </span>
          <h1 className="font-playful text-3xl sm:text-4xl font-extrabold tracking-tight">
            Discover Your Next Magical Adventure
          </h1>
          <p className="text-white/90 text-sm sm:text-base">
            Filter by age, genre, or search for your favorite topics. Drag & drop your own EPUB, PDF, or TXT files to read instantly!
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".epub,.pdf,.txt,.md"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleProcessFile(e.target.files[0]);
          }
        }}
      />

      {/* 2. Responsive Layout: Sidebar Filters + Main Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDEBAR FILTERS (Desktop Sticky) */}
        <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
          
          {/* Quick Upload Dropzone Card */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-5 rounded-3xl border-2 border-dashed transition-all text-center space-y-2 cursor-pointer ${
              dragActive 
                ? 'border-peach-500 bg-peach-100/60 shadow-lg scale-[1.01]' 
                : 'border-peach-300 bg-peach-50/50 hover:border-peach-500 hover:bg-peach-100/40'
            }`}
          >
            {isParsing ? (
              <div className="py-2 space-y-2">
                <Loader2 className="w-6 h-6 text-peach-500 mx-auto animate-spin" />
                <p className="text-xs font-bold text-slate-700">Parsing document...</p>
              </div>
            ) : (
              <>
                <Upload className="w-6 h-6 text-peach-500 mx-auto animate-bounce" />
                <h4 className="font-bold text-xs text-slate-800">Drag & Drop Book Here</h4>
                <p className="text-[11px] text-cozy-muted">EPUB, PDF, TXT or Markdown</p>
              </>
            )}
          </div>

          {/* Filter Options Card */}
          <div className="bg-white p-6 rounded-3xl border border-cozy-border shadow-cozy space-y-6">
            <div className="flex items-center justify-between border-b border-cozy-border pb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Filter className="w-4 h-4 text-peach-500" /> Filter Stories
              </h3>
              {(selectedGenre !== 'All' || selectedLevel !== 'All' || searchQuery) && (
                <button 
                  onClick={() => { setSelectedGenre('All'); setSelectedLevel('All'); setSearchQuery(''); }}
                  className="text-[11px] font-bold text-peach-600 hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Reading Level Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-cozy-muted uppercase tracking-wider block">Reading Level</label>
              <div className="space-y-1">
                {levels.map(level => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedLevel === level ? 'bg-peach-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{level}</span>
                    {selectedLevel === level && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Selection */}
            <div className="space-y-2 border-t border-cozy-border pt-4">
              <label className="text-xs font-bold text-cozy-muted uppercase tracking-wider block">Genres</label>
              <div className="flex flex-wrap gap-1.5">
                {genres.map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedGenre === g 
                        ? 'bg-peach-500 text-white font-bold shadow-xs' 
                        : 'bg-cozy-bg text-cozy-muted hover:text-cozy-text hover:bg-cozy-border/50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Top Search & View Mode Toolbar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-cozy-border shadow-cozy flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-cozy-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titles, topics, keywords..."
                className="w-full pl-11 pr-4 py-2.5 bg-cozy-bg/60 border border-cozy-border rounded-2xl text-cozy-text text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-peach-400 focus:bg-white transition-all"
              />
            </div>

            {/* View Mode Controls (Grid vs Compact List) */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-xs font-bold text-cozy-muted mr-1">{filteredBooks.length} Stories</span>
              <div className="flex items-center bg-cozy-bg p-1 rounded-2xl border border-cozy-border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-peach-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                  title="Grid Cards Layout"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-peach-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'}`}
                  title="Compact List Layout"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Book Cards Grid / List Display */}
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-cozy-border p-8 space-y-4">
              <span className="text-5xl">🔍</span>
              <h3 className="font-playful text-xl font-bold text-cozy-text">No stories found</h3>
              <p className="text-cozy-muted text-sm">Try adjusting your search terms or filters.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedGenre('All'); setSelectedLevel('All'); }}
                className="px-4 py-2 bg-peach-100 text-peach-700 font-bold rounded-2xl text-xs hover:bg-peach-200"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBooks.map(book => {
                const pageProgress = readingProgress[book.id] || 0;
                const totalPages = book.pages.length;
                const progressPercent = Math.round((pageProgress / (totalPages - 1)) * 100) || 0;

                return (
                  <div
                    key={book.id}
                    className="bg-white rounded-3xl border border-cozy-border shadow-cozy hover:shadow-cozy-hover transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1.5"
                  >
                    {/* Book Cover */}
                    <div 
                      className="relative p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white min-h-[150px] flex flex-col justify-between cursor-pointer border-b border-slate-700/50" 
                      onClick={() => openBookInReader(book)}
                    >
                      <div className="flex items-center justify-between gap-2 z-10">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-amber-200 text-[11px] font-semibold border border-white/10">
                          {book.readingLevel}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-peach-500/90 backdrop-blur-md text-white text-[11px] font-semibold shadow-sm">
                          {book.genre}
                        </span>
                      </div>

                      <div className="space-y-1 pt-4">
                        <h3 className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-peach-300 transition-colors line-clamp-2 leading-tight">
                          {book.title}
                        </h3>
                        <p className="text-xs text-slate-300 font-medium">By {book.author}</p>
                      </div>
                    </div>

                    {/* Book Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-cozy-muted font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-peach-500" /> {book.estimatedMinutes} min read
                          </span>
                          <span>{totalPages} Pages</span>
                        </div>
                        <p className="text-xs text-cozy-muted line-clamp-3 leading-relaxed">
                          {book.description}
                        </p>
                      </div>

                      {/* Progress */}
                      <div className="space-y-1.5 pt-2 border-t border-cozy-border/60">
                        <div className="flex items-center justify-between text-xs font-semibold text-cozy-muted">
                          <span>Reading Progress</span>
                          <span className="text-peach-600 font-bold">{progressPercent}%</span>
                        </div>
                        <div className="w-full h-2 bg-cozy-bg rounded-full overflow-hidden border border-cozy-border/50">
                          <div
                            className="h-full bg-gradient-to-r from-peach-400 to-peach-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(5, progressPercent)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Button */}
                      <button
                        onClick={() => openBookInReader(book, pageProgress > 0 ? pageProgress : 0)}
                        className="w-full py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-playful font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        {progressPercent > 0 ? 'Continue Reading' : 'Start Reading'}
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* COMPACT LIST VIEW */
            <div className="space-y-3">
              {filteredBooks.map(book => {
                const pageProgress = readingProgress[book.id] || 0;
                const totalPages = book.pages.length;
                const progressPercent = Math.round((pageProgress / (totalPages - 1)) * 100) || 0;

                return (
                  <div
                    key={book.id}
                    onClick={() => openBookInReader(book, pageProgress > 0 ? pageProgress : 0)}
                    className="p-4 sm:p-5 rounded-3xl bg-white border border-cozy-border shadow-cozy hover:shadow-cozy-hover transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-peach-100 text-peach-700 text-[10px] font-bold">
                          {book.genre}
                        </span>
                        <span className="text-xs text-cozy-muted font-medium">
                          {book.readingLevel} • {book.estimatedMinutes}m read • {totalPages} Pages
                        </span>
                      </div>
                      <h4 className="font-serif text-base font-bold text-slate-800 group-hover:text-peach-600 transition-colors">
                        {book.title}
                      </h4>
                      <p className="text-xs text-cozy-muted line-clamp-1">
                        {book.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-cozy-border">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-bold text-peach-600 block">{progressPercent}% read</span>
                        <span className="text-[10px] text-cozy-muted">Page {pageProgress + 1}/{totalPages}</span>
                      </div>
                      <button className="px-4 py-2 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Read <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
