import React, { useState, useEffect, useRef } from 'react';
import { useReading } from '../context/ReadingContext';
import { parseUploadedFile } from '../utils/fileParser';
import { calculateBookReadingTime } from '../utils/readingEngine';
import {
  ArrowLeft, ArrowRight, Bookmark, Volume2, VolumeX, Play, Pause,
  X, HelpCircle, Highlighter, MessageSquare,
  Search, Upload, Loader2, List, Copy, Moon, Sun
} from 'lucide-react';

export const ReaderView = () => {
  const {
    currentBook,
    activePageIndex,
    setActivePageIndex,



    goToNextPage,
    goToPrevPage,
    setActiveTab,
    toggleBookmark,
    isCurrentPageBookmarked,
    isNarrating,
    speakCurrentPage,
    narratorSpeed,
    setNarratorSpeed,
    ambientTrack,
    changeAmbientTrack,
    setActiveVocabTooltip,
    setDoubleTapWord,
    setIsMarginaliaOpen,
    setIsSearchModalOpen,
    setIsTocOpen,
    addCustomBook,
    readerSettings,
    setReaderSettings,
    isAutoNightShift,
    setIsAutoNightShift,
    showToast
  } = useReading();

  // Reading Canvas Settings State
  const [readerTheme, setReaderTheme] = useState(readerSettings?.readerTheme || 'sepia'); // 'white' | 'sepia' | 'oled'
  const [fontStyle, setFontStyle] = useState(readerSettings?.fontStyle || 'serif'); // 'serif' | 'sans'
  const [fontSizePercent, setFontSizePercent] = useState(readerSettings?.fontSizePercent || 110); // 90 to 150
  const [lineHeightClass, setLineHeightClass] = useState(readerSettings?.lineHeightClass || 'leading-relaxed'); // 'leading-snug' | 'leading-relaxed' | 'leading-loose'
  const [columnWidthPx, setColumnWidthPx] = useState(readerSettings?.columnWidthPx || 720); // 480 to 1024
  const [layoutMode, setLayoutMode] = useState('single'); // 'single' | 'spread'

  // Drag and Drop & UI Popovers
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [selectionTooltipPos, setSelectionTooltipPos] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [hoveredNotchIndex, setHoveredNotchIndex] = useState(null);

  const lastScrollY = useRef(0);
  const canvasRef = useRef(null);

  const currentPage = currentBook?.pages[activePageIndex];
  const totalPages = currentBook?.pages?.length || 1;
  const progressPercent = Math.round(((activePageIndex + 1) / totalPages) * 100);
  const totalBookMinutes = calculateBookReadingTime(currentBook);
  const estMinutesLeft = Math.max(1, Math.round(((totalPages - activePageIndex) * totalBookMinutes) / totalPages));

  // Keep settings synchronized in context & localStorage
  useEffect(() => {
    setReaderSettings(prev => ({
      ...prev,
      readerTheme,
      fontStyle,
      fontSizePercent,
      lineHeightClass,
      columnWidthPx
    }));
  }, [readerTheme, fontStyle, fontSizePercent, lineHeightClass, columnWidthPx]);

  // Auto-hiding top bar on scroll down, revealing on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60 && currentScrollY > lastScrollY.current) {
        setIsHeaderVisible(false);
        setIsSettingsOpen(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hotkey navigation & accessibility: J/K, Left/Right, T (theme), F (fullscreen), Esc, ⌘F/Ctrl+F
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Instant Text Search shortcut (⌘F / Ctrl+F)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsSearchModalOpen(true);
        return;
      }

      // Next Page: J or ArrowRight / PageDown
      if (e.key === 'j' || e.key === 'J' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextPage();
      }
      // Previous Page: K or ArrowLeft / PageUp
      else if (e.key === 'k' || e.key === 'K' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevPage();
      }
      // Toggle Theme: T
      else if (e.key === 't' || e.key === 'T') {
        const themes = ['white', 'sepia', 'oled'];
        const nextTheme = themes[(themes.indexOf(readerTheme) + 1) % themes.length];
        setReaderTheme(nextTheme);
        showToast(`Theme: ${nextTheme.toUpperCase()}`, '🎨');
      }
      // Distraction-Free Fullscreen: F
      else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => { });
          showToast('Full Screen Mode', '📺');
        } else {
          document.exitFullscreen().catch(() => { });
        }
      }
      // Table of Contents Drawer: C
      else if (e.key === 'c' || e.key === 'C') {
        setIsTocOpen(prev => !prev);
      }
      // Play / Pause Speech Narration: Space
      else if (e.key === ' ') {
        e.preventDefault();
        speakCurrentPage();
      }
      // Escape: Close Settings or Return to Library Dashboard
      else if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        } else {
          setActiveTab('library');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage, speakCurrentPage, readerTheme, isSettingsOpen, setActiveTab, setIsSearchModalOpen, setIsTocOpen]);

  // Drag and Drop Overlay handlers for direct file upload in Reader
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

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setIsParsing(true);
      try {
        const parsedBook = await parseUploadedFile(e.dataTransfer.files[0]);
        addCustomBook(parsedBook);
      } catch (err) {
        console.error(err);
        showToast('Could not parse file. Try another document.', '⚠️');
      } finally {
        setIsParsing(false);
      }
    }
  };

  // Handle Text Selection for Highlight / Note Popover
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const text = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelectedText(text);
      setSelectionTooltipPos({
        top: rect.top + window.scrollY - 45,
        left: rect.left + rect.width / 2
      });
    } else {
      setTimeout(() => {
        if (!window.getSelection()?.toString().trim()) {
          setSelectionTooltipPos(null);
        }
      }, 200);
    }
  };

  // Word double-click lookup
  const handleWordDoubleClick = (e) => {
    const selection = window.getSelection();
    const word = selection?.toString().trim().replace(/[^a-zA-Z]/g, '');
    if (word && word.length > 2) {
      setDoubleTapWord(word);
    }
  };

  // Render text with interactive word spans & drop-cap
  const renderFormattedParagraphs = (text) => {
    if (!text) return null;
    const paragraphs = text.split('\n\n');

    return paragraphs.map((para, pIdx) => {
      const words = para.split(' ');

      return (
        <p key={pIdx} className={`mb-6 text-justify ${lineHeightClass} ${pIdx === 0 ? 'first-letter:float-left first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:mr-3 first-letter:leading-none' : ''}`}>
          {words.map((word, wIdx) => {
            const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
            const matchedVocab = currentPage?.vocabTooltips?.find(v => v.word.toLowerCase() === cleanWord);

            if (matchedVocab) {
              return (
                <span
                  key={wIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveVocabTooltip(matchedVocab);
                  }}
                  className="cursor-pointer border-b-2 border-amber-400 bg-amber-100/50 hover:bg-amber-200/80 px-0.5 rounded transition-colors font-semibold"
                  title="Click for definition"
                >
                  {word}{' '}
                </span>
              );
            }

            return (
              <span
                key={wIdx}
                onDoubleClick={handleWordDoubleClick}
                className="hover:bg-black/5 rounded transition-colors cursor-text"
              >
                {word}{' '}
              </span>
            );
          })}
        </p>
      );
    });
  };

  // Theme style mapping
  const themeStyles = {
    white: {
      bg: 'bg-white',
      text: 'text-slate-900',
      navBg: 'bg-white/90 border-slate-200',
      popoverBg: 'bg-white border-slate-200 text-slate-800 shadow-2xl',
      controlBg: 'bg-white/90 border-slate-200 shadow-lg text-slate-800'
    },
    sepia: {
      bg: 'bg-[#FBF0D9]',
      text: 'text-[#433422]',
      navBg: 'bg-[#F7E9CB]/90 border-[#E6D7BD]',
      popoverBg: 'bg-[#FAF3E4] border-[#E2D2B5] text-[#3D2F1E] shadow-2xl',
      controlBg: 'bg-[#F5E6C6]/95 border-[#DFCEAF] shadow-lg text-[#3D2F1E]'
    },
    oled: {
      bg: 'bg-[#121212]',
      text: 'text-[#E0E0E0]',
      navBg: 'bg-[#1A1A1A]/90 border-[#2A2A2A]',
      popoverBg: 'bg-[#1E1E1E] border-[#333333] text-[#E0E0E0] shadow-2xl',
      controlBg: 'bg-[#1A1A1A]/95 border-[#2E2E2E] shadow-lg text-[#E0E0E0]'
    }
  };

  const currentStyle = themeStyles[readerTheme];
  const isBookmarked = isCurrentPageBookmarked();

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`min-h-screen ${currentStyle.bg} ${currentStyle.text} transition-colors duration-300 relative select-text`}
    >

      {/* Drag & Drop Visual Overlay */}
      {dragActive && (
        <div className="fixed inset-0 z-50 bg-amber-500/20 backdrop-blur-md border-4 border-dashed border-amber-500 flex flex-col items-center justify-center text-amber-900 dark:text-amber-100 pointer-events-none animate-in fade-in duration-150">
          <Upload className="w-16 h-16 animate-bounce" />
          <h3 className="font-serif text-2xl font-bold mt-2">Drop EPUB, PDF, or TXT File to Read</h3>
          <p className="text-sm opacity-80">Instant zero-setup browser parsing & local spot save</p>
        </div>
      )}

      {isParsing && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex flex-col items-center justify-center text-white">
          <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-3" />
          <h3 className="font-serif text-xl font-bold">Opening Uploaded Book...</h3>
        </div>
      )}

      {/* 1. TOP FLOATING NAVIGATION BAR (Auto-Hiding) */}
      <header className={`fixed top-0 left-0 right-0 z-40 ${currentStyle.navBg} backdrop-blur-md border-b transition-transform duration-300 ease-in-out ${isHeaderVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Left: Return to Library & Book Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('library')}
              className="p-2 rounded-full hover:bg-black/10 transition-colors flex items-center gap-2 group"
              title="Return to Library (Esc)"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-bold hidden sm:inline">Library</span>
            </button>
            <div className="h-4 w-px bg-current/20 hidden sm:block"></div>
            <h2 className="font-serif text-sm sm:text-base font-bold truncate max-w-[180px] sm:max-w-xs">
              {currentBook?.title}
            </h2>
          </div>

          {/* Center: Current Chapter Title & Selector Dropdown */}
          <div className="hidden md:flex items-center gap-1">
            <select
              value={activePageIndex}
              onChange={(e) => setActivePageIndex(Number(e.target.value))}
              className="text-xs font-bold bg-black/5 hover:bg-black/10 py-1.5 px-3 rounded-full border-none focus:ring-1 focus:ring-amber-500 cursor-pointer max-w-xs truncate text-current"
            >
              {currentBook?.pages?.map((pg, idx) => (
                <option key={idx} value={idx}>
                  Chapter {idx + 1}: {pg.title || `Section ${idx + 1}`}
                </option>
              ))}
            </select>
          </div>

          {/* Right: Search, TOC, Settings, Bookmark, Audio */}
          <div className="flex items-center gap-2">

            {/* Table of Contents Button (C) */}
            <button
              onClick={() => setIsTocOpen(true)}
              className="p-2 rounded-full hover:bg-black/10 transition-all flex items-center gap-1 opacity-80 hover:opacity-100"
              title="Table of Contents (C)"
            >
              <List className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold hidden sm:inline">Contents</span>
            </button>

            {/* Instant In-Book Text Search Button (⌘F) */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 rounded-full hover:bg-black/10 transition-all flex items-center gap-1 opacity-80 hover:opacity-100"
              title="Search Book (⌘F / Ctrl+F)"
            >
              <Search className="w-4 h-4 text-peach-600 dark:text-peach-400" />
              <span className="text-xs font-bold hidden sm:inline">Search</span>
            </button>

            {/* Ambient Sound Quick Toggle */}
            <button
              onClick={() => changeAmbientTrack(ambientTrack === 'none' ? 'forest' : 'none')}
              className={`p-2 rounded-full transition-all ${ambientTrack !== 'none' ? 'bg-amber-500 text-white shadow-sm' : 'hover:bg-black/10 opacity-80'}`}
              title={ambientTrack !== 'none' ? 'Mute Ambient Audio' : 'Play Ambient Rain'}
            >
              {ambientTrack !== 'none' ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Bookmark Button */}
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-full transition-all ${isBookmarked ? 'bg-amber-400 text-slate-900 shadow-sm' : 'hover:bg-black/10 opacity-80'}`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Page'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-slate-900' : ''}`} />
            </button>

            {/* "Aa" Reading Settings Popover Trigger */}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`px-3 py-1.5 rounded-full font-serif font-bold text-sm border transition-all flex items-center gap-1.5 ${isSettingsOpen ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'border-current/30 hover:bg-black/10'}`}
            >
              Aa
            </button>

          </div>
        </div>
      </header>

      {/* 2. READING SETTINGS POPOVER ("Aa" Menu) */}
      {isSettingsOpen && (
        <div className={`fixed top-18 right-4 sm:right-12 z-50 w-80 p-5 rounded-3xl ${currentStyle.popoverBg} border space-y-5 animate-in fade-in slide-in-from-top-4 duration-200`}>

          <div className="flex items-center justify-between border-b border-current/10 pb-3">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider opacity-80">Reading Customization</h4>
            <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-full hover:bg-black/10">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Auto Night Shift Sunset Toggle */}
          <div className="flex items-center justify-between bg-black/5 p-3 rounded-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Moon className="w-4 h-4 text-amber-500" />
              <span>Auto Night Shift at Sunset</span>
            </div>
            <button
              onClick={() => {
                setIsAutoNightShift(!isAutoNightShift);
                showToast(isAutoNightShift ? 'Auto Night Shift Disabled' : 'Auto Night Shift Enabled 🌅');
              }}
              className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${isAutoNightShift ? 'bg-amber-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${isAutoNightShift ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>

          {/* Reading View Mode (Single Column vs Two-Page Book Spread) */}
          <div className="space-y-2">
            <span className="text-xs font-semibold opacity-75">Layout View Mode</span>
            <div className="grid grid-cols-2 gap-2 bg-black/5 p-1 rounded-2xl">
              <button
                onClick={() => setLayoutMode('single')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${layoutMode === 'single' ? 'bg-amber-500 text-white shadow-sm' : 'opacity-70 hover:opacity-100'}`}
              >
                Single Scroll
              </button>
              <button
                onClick={() => setLayoutMode('spread')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${layoutMode === 'spread' ? 'bg-amber-500 text-white shadow-sm' : 'opacity-70 hover:opacity-100'}`}
              >
                Book Spread 📖
              </button>
            </div>
          </div>

          {/* Theme Switcher */}
          <div className="space-y-2 border-t border-current/10 pt-3">
            <div className="flex justify-between items-center text-xs font-semibold opacity-75">
              <span>Canvas Theme</span>
              <span className="text-[10px] opacity-60">Hotkey: T</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setReaderTheme('white')}
                className={`py-2 px-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${readerTheme === 'white' ? 'ring-2 ring-amber-500 border-transparent shadow-sm' : 'border-slate-300'}`}
              >
                <div className="w-6 h-6 rounded-full bg-white border border-slate-300 shadow-xs"></div>
                <span className="text-[11px] font-bold text-slate-800">White</span>
              </button>

              <button
                onClick={() => setReaderTheme('sepia')}
                className={`py-2 px-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${readerTheme === 'sepia' ? 'ring-2 ring-amber-500 border-transparent shadow-sm' : 'border-[#E6D7BD]'}`}
              >
                <div className="w-6 h-6 rounded-full bg-[#FBF0D9] border border-[#E6D7BD]"></div>
                <span className="text-[11px] font-bold text-[#433422]">Sepia</span>
              </button>

              <button
                onClick={() => setReaderTheme('oled')}
                className={`py-2 px-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${readerTheme === 'oled' ? 'ring-2 ring-amber-500 border-transparent shadow-sm' : 'border-[#333]'}`}
              >
                <div className="w-6 h-6 rounded-full bg-[#121212] border border-[#333]"></div>
                <span className="text-[11px] font-bold text-[#E0E0E0]">OLED</span>
              </button>
            </div>
          </div>

          {/* Precise ±5% Font Scaling Controls */}
          <div className="space-y-2 border-t border-current/10 pt-3">
            <div className="flex justify-between items-center text-xs font-semibold opacity-75">
              <span>Font Size (±5% Zoom)</span>
              <span>{fontSizePercent}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSizePercent(prev => Math.max(80, prev - 5))}
                className="w-10 h-10 rounded-2xl bg-black/5 hover:bg-black/10 flex items-center justify-center font-bold text-xs"
                title="-5% Font Size"
              >
                -5%
              </button>
              <input
                type="range"
                min="80"
                max="180"
                step="5"
                value={fontSizePercent}
                onChange={(e) => setFontSizePercent(Number(e.target.value))}
                className="flex-1 accent-amber-500 cursor-pointer"
              />
              <button
                onClick={() => setFontSizePercent(prev => Math.min(180, prev + 5))}
                className="w-10 h-10 rounded-2xl bg-black/5 hover:bg-black/10 flex items-center justify-center font-bold text-xs"
                title="+5% Font Size"
              >
                +5%
              </button>
            </div>
            <div className="flex items-center justify-between gap-1 pt-1">
              {[100, 125, 150].map(sz => (
                <button
                  key={sz}
                  onClick={() => setFontSizePercent(sz)}
                  className={`flex-1 py-1 rounded-xl text-[10px] font-bold transition-colors ${fontSizePercent === sz ? 'bg-amber-500 text-white shadow-2xs' : 'bg-black/5 opacity-70 hover:opacity-100'}`}
                >
                  {sz}%
                </button>
              ))}
            </div>
          </div>

          {/* Line Height Control */}
          <div className="border-t border-current/10 pt-3">
            <span className="text-[11px] font-semibold opacity-75 block mb-1">Line Height</span>
            <select
              value={lineHeightClass}
              onChange={(e) => setLineHeightClass(e.target.value)}
              className="w-full text-xs font-bold p-2 rounded-xl bg-black/5 border-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="leading-snug font-normal">Tight (Compact)</option>
              <option value="leading-relaxed font-normal">Normal (Editorial)</option>
              <option value="leading-loose font-normal">Relaxed (Spacious)</option>
            </select>
          </div>

        </div>
      )}

      {/* 3. CORE EDITORIAL READING CANVAS */}
      <main className="pt-24 pb-36 px-4 sm:px-6">
        {layoutMode === 'single' ? (
          /* Single Column Editorial Layout */
          <div
            ref={canvasRef}
            onMouseUp={handleMouseUp}
            className={`mx-auto transition-all duration-300 ${fontStyle === 'serif' ? 'font-serif' : 'font-sans'}`}
            style={{
              maxWidth: `${columnWidthPx}px`,
              fontSize: `${fontSizePercent}%`
            }}
          >
            {/* Chapter Opening Header */}
            <div className="text-center space-y-3 mb-12 pb-8 border-b border-current/10">
              <span className="text-xs uppercase tracking-widest font-bold opacity-60">
                Page {activePageIndex + 1} of {totalPages}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {currentPage?.title || `Chapter ${activePageIndex + 1}`}
              </h1>
            </div>

            {/* Chapter Body Text */}
            <div className="prose max-w-none text-current font-normal tracking-normal">
              {renderFormattedParagraphs(currentPage?.text)}
            </div>
          </div>
        ) : (
          /* Two-Page Book Spread Layout (Simulates Physical Book / E-Reader) */
          <div
            ref={canvasRef}
            onMouseUp={handleMouseUp}
            className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative p-6 sm:p-10 rounded-3xl shadow-xl border border-current/10 bg-current/5 transition-all duration-300 ${fontStyle === 'serif' ? 'font-serif' : 'font-sans'}`}
            style={{ fontSize: `${fontSizePercent}%` }}
          >
            {/* Center Gutter Spine Line */}
            <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-current/20 shadow-xs pointer-events-none"></div>

            {/* Left Page */}
            <div className="space-y-6">
              <div className="text-center pb-4 border-b border-current/10">
                <span className="text-[11px] uppercase tracking-widest font-bold opacity-60">
                  Left Page • Page {activePageIndex + 1}
                </span>
                <h3 className="font-serif text-2xl font-bold mt-1">
                  {currentPage?.title || `Chapter ${activePageIndex + 1}`}
                </h3>
              </div>
              <div className="prose max-w-none text-current font-normal leading-relaxed">
                {renderFormattedParagraphs(currentPage?.text)}
              </div>
            </div>

            {/* Right Page (Next Chapter / Section if available) */}
            <div className="space-y-6 hidden md:block border-t md:border-t-0 pt-6 md:pt-0 border-current/10">
              {activePageIndex + 1 < totalPages ? (
                <>
                  <div className="text-center pb-4 border-b border-current/10">
                    <span className="text-[11px] uppercase tracking-widest font-bold opacity-60">
                      Right Page • Page {activePageIndex + 2}
                    </span>
                    <h3 className="font-serif text-2xl font-bold mt-1">
                      {currentBook?.pages[activePageIndex + 1]?.title || `Chapter ${activePageIndex + 2}`}
                    </h3>
                  </div>
                  <div className="prose max-w-none text-current font-normal leading-relaxed">
                    {renderFormattedParagraphs(currentBook?.pages[activePageIndex + 1]?.text)}
                  </div>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60 space-y-3">
                  <span className="text-4xl">🎉</span>
                  <h4 className="font-serif text-xl font-bold">End of Story</h4>
                  <p className="text-xs">You have reached the final page of this adventure!</p>
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Text Selection Floating Action Tooltip */}
      {selectionTooltipPos && (
        <div
          style={{ top: `${selectionTooltipPos.top}px`, left: `${selectionTooltipPos.left}px` }}
          className="fixed z-50 -translate-x-1/2 bg-slate-950 text-white px-3 py-1.5 rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            onClick={() => {
              setDoubleTapWord(selectedText);
              setSelectionTooltipPos(null);
            }}
            className="hover:text-amber-300 flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> Define
          </button>
          <div className="w-px h-3 bg-slate-700"></div>
          <button
            onClick={() => {
              showToast(`Highlighted: "${selectedText.slice(0, 20)}..."`, '🖍️');
              setSelectionTooltipPos(null);
            }}
            className="hover:text-amber-300 flex items-center gap-1"
          >
            <Highlighter className="w-3.5 h-3.5 text-yellow-400" /> Highlight
          </button>
          <button
            onClick={() => {
              const citation = `“${selectedText}”\n— ${currentBook?.title || 'OpenTale'}, ${currentPage?.title || 'Chapter ' + (activePageIndex + 1)} (By ${currentBook?.author || 'Author'})`;
              navigator.clipboard.writeText(citation);
              showToast('Quote copied with citation! 📋', '📋');
              setSelectionTooltipPos(null);
            }}
            className="hover:text-amber-300 flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-400" /> Copy Quote
          </button>
          <div className="w-px h-3 bg-slate-700"></div>
          <button
            onClick={() => {
              setIsMarginaliaOpen(true);
              setSelectionTooltipPos(null);
            }}
            className="hover:text-amber-300 flex items-center gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" /> Note
          </button>
        </div>
      )}

      {/* 4. FLOATING BOTTOM CONTROL BAR WITH CHAPTER MARKERS & SCRUB BAR */}
      <div className="fixed bottom-6 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center">
        <div className={`pointer-events-auto px-5 py-3 rounded-full ${currentStyle.controlBg} border backdrop-blur-xl flex flex-wrap items-center justify-between gap-4 max-w-3xl w-full shadow-2xl transition-all duration-300`}>

          {/* Left: Previous Page */}
          <button
            onClick={goToPrevPage}
            disabled={activePageIndex === 0}
            className={`p-2 rounded-full transition-colors flex items-center gap-1 text-xs font-bold ${activePageIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/10'}`}
            title="Previous Chapter (K or Left Arrow)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Center: Reading Progress Bar with Chapter Markers & Scrub Notches */}
          <div className="flex-1 max-w-md mx-auto space-y-1.5 text-center">
            <div className="flex items-center justify-between text-[11px] font-bold opacity-75">
              <span className="truncate max-w-[150px]">
                {hoveredNotchIndex !== null
                  ? currentBook?.pages[hoveredNotchIndex]?.title || `Chapter ${hoveredNotchIndex + 1}`
                  : `Page ${activePageIndex + 1} of ${totalPages}`
                }
              </span>
              <span>{progressPercent}% • {estMinutesLeft}m left</span>
            </div>

            {/* Scrub Bar Container with Chapter Break Notches */}
            <div
              className="relative w-full h-3 bg-black/10 rounded-full flex items-center cursor-pointer group px-0.5"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                const targetIdx = Math.min(totalPages - 1, Math.floor(ratio * totalPages));
                setActivePageIndex(targetIdx);
              }}
            >
              {/* Active Fill */}
              <div
                className="h-1.5 bg-amber-500 rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              ></div>

              {/* Vertical Chapter Break Notches */}
              {totalPages > 1 && Array.from({ length: totalPages }).map((_, idx) => {
                const notchPosPercent = (idx / (totalPages - 1)) * 100;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredNotchIndex(idx)}
                    onMouseLeave={() => setHoveredNotchIndex(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePageIndex(idx);
                    }}
                    style={{ left: `${notchPosPercent}%` }}
                    className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-3 rounded-full transition-all cursor-pointer z-10 ${idx === activePageIndex
                        ? 'bg-amber-600 ring-2 ring-amber-300 scale-125'
                        : 'bg-black/30 hover:bg-amber-500 hover:scale-125'
                      }`}
                    title={currentBook?.pages[idx]?.title || `Chapter ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Narration & Ambient Controls */}
          <div className="flex items-center gap-2">

            {/* Search Trigger Shortcut */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 rounded-full hover:bg-black/10 transition-colors hidden sm:flex items-center justify-center"
              title="Instant Text Search (⌘F)"
            >
              <Search className="w-4 h-4 text-peach-600 dark:text-peach-400" />
            </button>

            {/* Play/Pause Narration */}
            <button
              onClick={speakCurrentPage}
              className={`p-2 rounded-full transition-all flex items-center justify-center ${isNarrating ? 'bg-amber-500 text-white shadow-sm animate-pulse' : 'hover:bg-black/10'}`}
              title={isNarrating ? 'Pause Voice Narration (Space)' : 'Play Voice Narration (Space)'}
            >
              {isNarrating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Narration Speed */}
            <button
              onClick={() => {
                const speeds = [1.0, 1.25, 1.5];
                const nextIdx = (speeds.indexOf(narratorSpeed) + 1) % speeds.length;
                setNarratorSpeed(speeds[nextIdx]);
              }}
              className="px-2 py-1 rounded-lg bg-black/5 hover:bg-black/10 text-[11px] font-bold"
              title="Change Speech Speed"
            >
              {narratorSpeed}x
            </button>

          </div>

          {/* Right: Next Page */}
          <button
            onClick={goToNextPage}
            className="p-2 rounded-full hover:bg-black/10 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Next Chapter (J or Right Arrow)"
          >
            <span className="hidden sm:inline">{activePageIndex === totalPages - 1 ? 'Finish' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
};
