import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORIES, BADGES } from '../data/stories';
import { ambientAudio } from '../utils/ambientAudio';
import confetti from 'canvas-confetti';

const ReadingContext = createContext(null);

export const ReadingProvider = ({ children }) => {
  // Saved Custom Books from Local Storage
  const [customBooks, setCustomBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('opentale_user_books');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const allAvailableBooks = [...STORIES, ...customBooks];

  // Navigation & Active View State
  const [activeTab, setActiveTab] = useState('landing'); // 'landing' | 'library' | 'reader' | 'vocab' | 'badges'
  
  // Auto-Save Active Book & Chapter Index
  const [currentBook, setCurrentBook] = useState(() => {
    try {
      const savedBookId = localStorage.getItem('opentale_current_book_id');
      if (savedBookId) {
        const found = allAvailableBooks.find(b => b.id === savedBookId);
        if (found) return found;
      }
    } catch (e) {}
    return STORIES[0];
  });

  const [activePageIndex, setActivePageIndex] = useState(() => {
    try {
      const savedPage = localStorage.getItem('opentale_active_page_index');
      return savedPage !== null ? parseInt(savedPage, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  // Saved Reader Settings
  const [readerSettings, setReaderSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('opentale_reader_settings');
      return saved ? JSON.parse(saved) : {
        readerTheme: 'sepia',
        fontStyle: 'serif',
        fontSizePercent: 110,
        lineHeightClass: 'leading-relaxed',
        columnWidthPx: 720
      };
    } catch (e) {
      return {
        readerTheme: 'sepia',
        fontStyle: 'serif',
        fontSizePercent: 110,
        lineHeightClass: 'leading-relaxed',
        columnWidthPx: 720
      };
    }
  });

  // Customization & Accessibility Preferences
  const [themeMode, setThemeMode] = useState('light'); // 'light' | 'sepia' | 'dark' | 'sand' | 'eink' | 'oled'
  const [fontSize, setFontSize] = useState('md'); // 'sm' | 'md' | 'lg' | 'xl'
  const [fontFamily, setFontFamily] = useState('sans'); // 'sans' | 'playful' | 'dyslexic'
  const [readingMode, setReadingMode] = useState('standard'); // 'standard' | 'bionic' | 'minimal' | 'rsvp'
  const [lineHeight, setLineHeight] = useState('1.8');
  const [letterSpacing, setLetterSpacing] = useState('0');

  // Ambient Audio State
  const [ambientTrack, setAmbientTrack] = useState('none');
  const [ambientVolume, setAmbientVolume] = useState(0.4);

  // Gamification & User Stats State
  const [readingProgress, setReadingProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('opentale_progress');
      return saved ? JSON.parse(saved) : { 'whispering-woods': 1, 'cosmic-rocket': 0 };
    } catch (e) {
      return { 'whispering-woods': 1 };
    }
  });

  const [completedBookIds, setCompletedBookIds] = useState(['whispering-woods']);
  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState(['first-story', 'night-reader']);
  
  const [bookmarks, setBookmarks] = useState([
    { bookId: 'whispering-woods', pageIndex: 1, title: 'The Path of Glowing Fungi', bookTitle: 'The Whispering Woods & The Lost Lantern' }
  ]);

  const [vocabVault, setVocabVault] = useState([
    {
      word: 'glimmering',
      phonetic: 'glim-er-ing',
      definition: 'Shining with a soft, sparkling, slightly flickering light.',
      sentence: 'The fireflies were glimmering softly among the tall oak trees.',
      bookTitle: 'The Whispering Woods & The Lost Lantern'
    },
    {
      word: 'nebula',
      phonetic: 'neb-u-la',
      definition: 'A giant cloud of dust and gas in space where new stars are born.',
      sentence: 'The rocket sailed through a bright purple nebula that smelled like bubblegum.',
      bookTitle: "Oliver's Cosmic Rocketship"
    }
  ]);

  // Audio Speech Synthesis Narrator State
  const [isNarrating, setIsNarrating] = useState(false);
  const [narratorSpeed, setNarratorSpeed] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Daily Reading Tracker State
  const [dailyTracker, setDailyTracker] = useState(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      const saved = localStorage.getItem('opentale_daily_tracker');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayStr) {
          return parsed;
        } else {
          return { date: todayStr, minutes: 0, target: 20 };
        }
      }
    } catch (e) {}
    return { date: todayStr, minutes: 12, target: 20 };
  });

  const todayMinutesRead = dailyTracker.minutes;
  const targetMinutes = dailyTracker.target;

  // Auto Night Shift State (Sun set / Night dimming)
  const [isAutoNightShift, setIsAutoNightShift] = useState(() => {
    try {
      const saved = localStorage.getItem('opentale_auto_night_shift');
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });

  // Active Reading Minute Accumulator
  useEffect(() => {
    let interval = null;
    if (activeTab === 'reader') {
      interval = setInterval(() => {
        setDailyTracker(prev => {
          const updated = { ...prev, minutes: prev.minutes + 1 };
          try {
            localStorage.setItem('opentale_daily_tracker', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
      }, 60000); // Increment 1 minute every 60s spent reading
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  // Automatic Night Shift sunset check
  useEffect(() => {
    if (isAutoNightShift) {
      const currentHour = new Date().getHours();
      // If between 7 PM (19:00) and 7 AM (07:00), apply warm sepia or oled
      if (currentHour >= 19 || currentHour < 7) {
        setReaderSettings(prev => ({
          ...prev,
          readerTheme: prev.readerTheme === 'white' ? 'sepia' : prev.readerTheme
        }));
      }
    }
  }, [isAutoNightShift]);

  // Save Auto Night Shift Setting
  useEffect(() => {
    try {
      localStorage.setItem('opentale_auto_night_shift', JSON.stringify(isAutoNightShift));
    } catch (e) {}
  }, [isAutoNightShift]);

  // Modals & Drawers
  const [activeVocabTooltip, setActiveVocabTooltip] = useState(null);
  const [activeQuizModalBook, setActiveQuizModalBook] = useState(null);
  const [isPRDModalOpen, setIsPRDModalOpen] = useState(false);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [doubleTapWord, setDoubleTapWord] = useState(null);
  const [isMarginaliaOpen, setIsMarginaliaOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAICatchUpOpen, setIsAICatchUpOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);

  const [celebrationToast, setCelebrationToast] = useState(null);

  // Auto-Save active book ID & active page index
  useEffect(() => {
    if (currentBook?.id) {
      try {
        localStorage.setItem('opentale_current_book_id', currentBook.id);
        localStorage.setItem('opentale_active_page_index', activePageIndex.toString());
      } catch (e) {}
    }
  }, [currentBook, activePageIndex]);

  // Auto-Save custom uploaded user books
  useEffect(() => {
    try {
      localStorage.setItem('opentale_user_books', JSON.stringify(customBooks));
    } catch (e) {}
  }, [customBooks]);

  // Auto-Save reader customization settings
  useEffect(() => {
    try {
      localStorage.setItem('opentale_reader_settings', JSON.stringify(readerSettings));
    } catch (e) {}
  }, [readerSettings]);

  // Helper to add custom imported book and open immediately
  const addCustomBook = (parsedBook) => {
    setCustomBooks(prev => [parsedBook, ...prev.filter(b => b.id !== parsedBook.id)]);
    openBookInReader(parsedBook, 0);
    showToast(`"${parsedBook.title}" imported & opened!`, '📖');
  };

  // Audio ambient track change handler
  const changeAmbientTrack = (trackName) => {
    setAmbientTrack(trackName);
    if (trackName === 'none') {
      ambientAudio.stop();
    } else {
      ambientAudio.playTrack(trackName);
    }
  };

  const changeAmbientVolume = (vol) => {
    setAmbientVolume(vol);
    ambientAudio.setVolume(vol);
  };

  // Initialize Speech Synthesis Voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Karen'))) || voices[0];
        if (englishVoice) setSelectedVoice(englishVoice);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem('opentale_progress', JSON.stringify(readingProgress));
    } catch (e) {}
  }, [readingProgress]);

  // Helper trigger confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF7B54', '#84B59F', '#579BB1', '#F5D061', '#A888E0']
    });
  };

  // Toast notification
  const showToast = (message, icon = '✨') => {
    setCelebrationToast({ message, icon });
    setTimeout(() => {
      setCelebrationToast(null);
    }, 4000);
  };

  // Unlock Badge
  const unlockBadge = (badgeId) => {
    if (!unlockedBadgeIds.includes(badgeId)) {
      setUnlockedBadgeIds(prev => [...prev, badgeId]);
      const badge = BADGES.find(b => b.id === badgeId);
      if (badge) {
        showToast(badge.unlockedText, badge.icon);
        triggerConfetti();
      }
    }
  };

  // Select Book
  const openBookInReader = (book, pageIdx = 0) => {
    setCurrentBook(book);
    setActivePageIndex(pageIdx);
    setActiveTab('reader');
    stopSpeech();
  };

  // Page Navigation
  const goToNextPage = () => {
    if (!currentBook) return;
    if (activePageIndex < currentBook.pages.length - 1) {
      const newIndex = activePageIndex + 1;
      setActivePageIndex(newIndex);
      
      setReadingProgress(prev => ({
        ...prev,
        [currentBook.id]: Math.max(prev[currentBook.id] || 0, newIndex)
      }));

      stopSpeech();

      if (newIndex === currentBook.pages.length - 1) {
        if (!completedBookIds.includes(currentBook.id)) {
          setCompletedBookIds(prev => [...prev, currentBook.id]);
          unlockBadge('first-story');
        }
      }
    } else {
      setActiveQuizModalBook(currentBook);
    }
  };

  const goToPrevPage = () => {
    if (activePageIndex > 0) {
      setActivePageIndex(prev => prev - 1);
      stopSpeech();
    }
  };

  // Bookmark Toggle
  const toggleBookmark = () => {
    if (!currentBook) return;
    const exists = bookmarks.some(b => b.bookId === currentBook.id && b.pageIndex === activePageIndex);
    if (exists) {
      setBookmarks(prev => prev.filter(b => !(b.bookId === currentBook.id && b.pageIndex === activePageIndex)));
      showToast('Bookmark removed');
    } else {
      const pageTitle = currentBook.pages[activePageIndex]?.title || `Page ${activePageIndex + 1}`;
      setBookmarks(prev => [...prev, {
        bookId: currentBook.id,
        pageIndex: activePageIndex,
        title: pageTitle,
        bookTitle: currentBook.title
      }]);
      showToast('Page bookmarked!', '🔖');
    }
  };

  const isCurrentPageBookmarked = () => {
    if (!currentBook) return false;
    return bookmarks.some(b => b.bookId === currentBook.id && b.pageIndex === activePageIndex);
  };

  // Vocabulary Management
  const addWordToVocabVault = (vocabObj) => {
    const wordKey = vocabObj.word.toLowerCase();
    if (!vocabVault.some(v => v.word.toLowerCase() === wordKey)) {
      setVocabVault(prev => [...prev, { ...vocabObj, bookTitle: currentBook?.title || 'OpenTale' }]);
      showToast(`"${vocabObj.word}" added to your Vocab Vault!`, '📚');
      
      if (vocabVault.length + 1 >= 3) {
        unlockBadge('vocab-master');
      }
    } else {
      showToast(`"${vocabObj.word}" is already in your Vocab Vault!`, '💡');
    }
  };

  // Audio Speech Synthesis Controls
  const speakCurrentPage = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Speech narration is not supported in this browser.', '⚠️');
      return;
    }

    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    const currentPage = currentBook?.pages[activePageIndex];
    if (!currentPage) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(currentPage.text);
    utterance.rate = narratorSpeed;
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => setIsNarrating(true);
    utterance.onend = () => setIsNarrating(false);
    utterance.onerror = () => setIsNarrating(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsNarrating(false);
  };

  return (
    <ReadingContext.Provider value={{
      activeTab,
      setActiveTab,
      currentBook,
      setCurrentBook,
      activePageIndex,
      setActivePageIndex,
      openBookInReader,
      goToNextPage,
      goToPrevPage,
      allAvailableBooks,
      customBooks,
      addCustomBook,
      readerSettings,
      setReaderSettings,
      themeMode,
      setThemeMode,
      fontSize,
      setFontSize,
      fontFamily,
      setFontFamily,
      readingMode,
      setReadingMode,
      lineHeight,
      setLineHeight,
      letterSpacing,
      setLetterSpacing,
      ambientTrack,
      changeAmbientTrack,
      ambientVolume,
      changeAmbientVolume,
      readingProgress,
      completedBookIds,
      unlockedBadgeIds,
      unlockBadge,
      bookmarks,
      toggleBookmark,
      isCurrentPageBookmarked,
      vocabVault,
      addWordToVocabVault,
      isNarrating,
      speakCurrentPage,
      stopSpeech,
      narratorSpeed,
      setNarratorSpeed,
      availableVoices,
      selectedVoice,
      setSelectedVoice,
      activeVocabTooltip,
      setActiveVocabTooltip,
      activeQuizModalBook,
      setActiveQuizModalBook,
      isPRDModalOpen,
      setIsPRDModalOpen,
      isRSVPOpen,
      setIsRSVPOpen,
      doubleTapWord,
      setDoubleTapWord,
      isMarginaliaOpen,
      setIsMarginaliaOpen,
      isImportModalOpen,
      setIsImportModalOpen,
      isAICatchUpOpen,
      setIsAICatchUpOpen,
      isSearchModalOpen,
      setIsSearchModalOpen,
      isTocOpen,
      setIsTocOpen,
      todayMinutesRead,
      targetMinutes,
      isAutoNightShift,
      setIsAutoNightShift,
      celebrationToast,
      triggerConfetti,
      showToast
    }}>
      {children}
    </ReadingContext.Provider>
  );
};

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReading must be used within a ReadingProvider');
  }
  return context;
};
