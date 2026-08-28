import React, { useState, useRef } from 'react';
import { useReading } from '../context/ReadingContext';
import { parseUploadedFile } from '../utils/fileParser';
import { STORIES } from '../data/stories';
import { Search, Filter, BookOpen, Bookmark, Star, Clock, Sparkles, Upload, FileText, Loader2 } from 'lucide-react';

export const LibraryDashboard = () => {
  const { openBookInReader, readingProgress, bookmarks, toggleBookmark, allAvailableBooks, addCustomBook, showToast } = useReading();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
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
      showToast('Failed to parse file. Please try another text, epub, or pdf document.', '⚠️');
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
      
      {/* Header Banner */}
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

      {/* Direct Dropzone Banner */}
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

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-6 rounded-3xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer ${
          dragActive 
            ? 'border-peach-500 bg-peach-100/60 shadow-lg scale-[1.01]' 
            : 'border-peach-300/80 bg-peach-50/40 hover:border-peach-500 hover:bg-peach-50/80'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-peach-500 text-white shadow-sm">
            {isParsing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800">
              {isParsing ? 'Parsing uploaded file...' : 'Drop your EPUB, PDF, or TXT file here'}
            </h4>
            <p className="text-xs text-cozy-muted">Zero setup required • Parses instantly into chapters & auto-saves spot</p>
          </div>
        </div>
        <button 
          className="px-4 py-2 rounded-2xl bg-white border border-peach-200 text-peach-700 font-bold text-xs shadow-xs hover:bg-peach-100 transition-colors shrink-0"
        >
          Browse Local Files
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-6 rounded-3xl border border-cozy-border shadow-cozy space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Search Bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-cozy-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search story titles, keywords, or topics..."
              className="w-full pl-12 pr-4 py-3 bg-cozy-bg/60 border border-cozy-border rounded-2xl text-cozy-text text-sm focus:outline-none focus:ring-2 focus:ring-peach-400 focus:bg-white transition-all"
            />
          </div>

          {/* Genre Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-4 py-3 bg-cozy-bg/60 border border-cozy-border rounded-2xl text-cozy-text text-sm focus:outline-none focus:ring-2 focus:ring-peach-400 font-medium"
            >
              <option value="All">All Genres</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Fairy Tale">Fairy Tale</option>
              <option value="Adventure">Adventure</option>
            </select>
          </div>

          {/* Level Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-3 bg-cozy-bg/60 border border-cozy-border rounded-2xl text-cozy-text text-sm focus:outline-none focus:ring-2 focus:ring-peach-400 font-medium"
            >
              <option value="All">All Reading Levels</option>
              <option value="Ages 6–8">Ages 6–8 (Beginner)</option>
              <option value="Ages 8–10">Ages 8–10 (Intermediate)</option>
              <option value="Ages 10–12">Ages 10–12 (Explorer)</option>
            </select>
          </div>

        </div>

        {/* Quick Genre Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <span className="text-xs font-bold text-cozy-muted uppercase tracking-wider mr-2">Genres:</span>
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === g
                  ? 'bg-peach-500 text-white shadow-sm'
                  : 'bg-cozy-bg text-cozy-muted hover:text-cozy-text hover:bg-cozy-border/50'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

      </div>

      {/* Book Grid */}
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map(book => {
            const pageProgress = readingProgress[book.id] || 0;
            const totalPages = book.pages.length;
            const progressPercent = Math.round((pageProgress / (totalPages - 1)) * 100) || 0;

            return (
              <div
                key={book.id}
                className="bg-white rounded-3xl border border-cozy-border shadow-cozy hover:shadow-cozy-hover transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1.5"
              >
                {/* Book Cover Visual (Editorial Typography Card) */}
                <div 
                  className="relative p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white min-h-[160px] flex flex-col justify-between cursor-pointer border-b border-slate-700/50" 
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

                  <div className="absolute top-3 right-3 opacity-10 text-6xl pointer-events-none font-serif">
                    📖
                  </div>
                </div>

                {/* Book Info & Progress */}
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

                  {/* Reading Progress Bar */}
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

                  {/* Card Actions */}
                  <div className="pt-1">
                    <button
                      onClick={() => openBookInReader(book, pageProgress > 0 ? pageProgress : 0)}
                      className="w-full py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-playful font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      {progressPercent > 0 ? 'Continue Reading' : 'Start Reading'}
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
