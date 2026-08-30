import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORIES, BADGES } from '../data/stories';
import { ambientAudio } from '../utils/ambientAudio';
import { supabaseClient } from '../utils/supabaseClient';
import confetti from 'canvas-confetti';

const ReadingContext = createContext(null);

export const DEFAULT_SHELVES = [
  { id: 'favorites', name: 'Favorites', icon: '❤️', color: 'rose' },
  { id: 'currently-reading', name: 'Currently Reading', icon: '📖', color: 'amber' },
  { id: 'to-read-2026', name: 'To Read 2026', icon: '🎯', color: 'emerald' },
  { id: 'reference', name: 'Reference', icon: '🔖', color: 'sky' }
];

export const DEFAULT_TAGS = [
  { id: 'must-reread', name: 'Must Re-read', color: '#ef4444', bgClass: 'bg-red-100', textClass: 'text-red-700', borderClass: 'border-red-300' },
  { id: 'scifi-epic', name: 'Sci-Fi Epic', color: '#8b5cf6', bgClass: 'bg-purple-100', textClass: 'text-purple-700', borderClass: 'border-purple-300' },
  { id: 'bedtime', name: 'Bedtime', color: '#3b82f6', bgClass: 'bg-blue-100', textClass: 'text-blue-700', borderClass: 'border-blue-300' },
  { id: 'quick-read', name: 'Quick Read', color: '#10b981', bgClass: 'bg-emerald-100', textClass: 'text-emerald-700', borderClass: 'border-emerald-300' },
  { id: '5-stars', name: '5-Stars', color: '#f59e0b', bgClass: 'bg-amber-100', textClass: 'text-amber-700', borderClass: 'border-amber-300' }
];

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

  // Navigation & Active View State ('landing' | 'library' | 'reader' | 'vocab' | 'badges' | 'author')
  const [activeTab, setActiveTab] = useState('landing');
  
  // Custom Shelves State
  const [shelves, setShelves] = useState(() => {
    try {
      const saved = localStorage.getItem('opentale_custom_shelves');
      return saved ? JSON.parse(saved) : DEFAULT_SHELVES;
    } catch (e) {
      return DEFAULT_SHELVES;
    }
  });

  // Custom Tags State
  const [tags, setTags] = useState(() => {
    try {
      const saved = localStorage.getItem('opentale_custom_tags');
      return saved ? JSON.parse(saved) : DEFAULT_TAGS;
    } catch (e) {
      return DEFAULT_TAGS;
    }
  });

  // Mappings: Book ID -> Array of Shelf IDs
  const [bookShelfMap, setBookShelfMap] = useState(() => {
    try {
      const saved = localStorage.getItem('opentale_book_shelf_mappings');
      return saved ? JSON.parse(saved) : {
        'whispering-woods': ['favorites', 'currently-reading'],
        'cosmic-rocket': ['to-read-2026'],
        'enchanted-bakery': ['favorites']
      };
    } catch (e) {
      return {
        'whispering-woods': ['favorites', 'currently-reading'],
        'cosmic-rocket': ['to-read-2026'],
        'enchanted-bakery': ['favorites']
      };
    }
  });

  // Mappings: Book ID -> Array of Tag IDs
  const [bookTagMap, setBookTagMap] = useState(() => {
    try {
      const saved = localStorage.getItem('opentale_book_tag_mappings');
      return saved ? JSON.parse(saved) : {
        'whispering-woods': ['bedtime', '5-stars'],
        'cosmic-rocket': ['scifi-epic', 'quick-read'],
        'enchanted-bakery': ['5-stars']
      };
    } catch (e) {
      return {
        'whispering-woods': ['bedtime', '5-stars'],
        'cosmic-rocket': ['scifi-epic', 'quick-read'],
        'enchanted-bakery': ['5-stars']
      };
    }
  });

  // Active Shelf and Tag filters in Library
  const [selectedShelfId, setSelectedShelfId] = useState('all'); // 'all' | shelfId
  const [selectedTagIds, setSelectedTagIds] = useState([]); // array of tagIds

  // Character & Lore Wiki (Book ID -> Array of Lore Items)
  const [loreWikiMap, setLoreWikiMap] = useState(() => {
    try {
      const saved = localStorage.getItem('opentale_lore_wiki_map');
      return saved ? JSON.parse(saved) : {
        'whispering-woods': [
          { id: 'l-1', name: 'Oliver', category: 'Character', description: 'Curious young boy with a magical glowing lantern.', icon: '🧑' },
          { id: 'l-2', name: 'Whispering Woods', category: 'Location', description: 'Ancient magical forest where trees speak in twilight.', icon: '🌲' }
        ]
      };
    } catch (e) {
      return {};
    }
  });

  // Community Stories
  const [communityStories, setCommunityStories] = useState([]);

  // Load Community Stories on start
  useEffect(() => {
    const fetchCommunity = async () => {
      const stories = await supabaseClient.getCommunityStories();
      setCommunityStories(stories);
    };
    fetchCommunity();
  }, []);

  // Save Shelves, Tags & Mappings to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('opentale_custom_shelves', JSON.stringify(shelves));
    } catch (e) {}
  }, [shelves]);

  useEffect(() => {
    try {
      localStorage.setItem('opentale_custom_tags', JSON.stringify(tags));
    } catch (e) {}
  }, [tags]);

  useEffect(() => {
    try {
      localStorage.setItem('opentale_book_shelf_mappings', JSON.stringify(bookShelfMap));
    } catch (e) {}
  }, [bookShelfMap]);

  useEffect(() => {
    try {
      localStorage.setItem('opentale_book_tag_mappings', JSON.stringify(bookTagMap));
    } catch (e) {}
  }, [bookTagMap]);

  useEffect(() => {
    try {
      localStorage.setItem('opentale_lore_wiki_map', JSON.stringify(loreWikiMap));
    } catch (e) {}
  }, [loreWikiMap]);

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
  const [themeMode, setThemeMode] = useState('light');
  const [fontSize, setFontSize] = useState('md');
  const [fontFamily, setFontFamily] = useState('sans');
  const [readingMode, setReadingMode] = useState('standard');
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

  // Auto Night Shift State
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
      }, 60000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);

  // Automatic Night Shift check
  useEffect(() => {
    if (isAutoNightShift) {
      const currentHour = new Date().getHours();
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

  // New Modals for Shelves, Tags, Authoring & Publishing
  const [isShelfModalOpen, setIsShelfModalOpen] = useState(false);
  const [editingShelf, setEditingShelf] = useState(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [targetBookForShelvesTags, setTargetBookForShelvesTags] = useState(null);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [targetBookForExport, setTargetBookForExport] = useState(null);

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
    supabaseClient.saveStory(parsedBook);
    openBookInReader(parsedBook, 0);
    showToast(`"${parsedBook.title}" saved & opened!`, '📖');
  };

  // SHELVES HANDLERS
  const createShelf = (newShelf) => {
    const id = newShelf.id || `shelf-${Date.now()}`;
    const created = { id, ...newShelf };
    setShelves(prev => [...prev.filter(s => s.id !== id), created]);
    showToast(`Shelf "${created.name}" created!`, '📁');
  };

  const updateShelf = (shelfId, updates) => {
    setShelves(prev => prev.map(s => s.id === shelfId ? { ...s, ...updates } : s));
    showToast('Shelf updated!', '✨');
  };

  const deleteShelf = (shelfId) => {
    setShelves(prev => prev.filter(s => s.id !== shelfId));
    // Remove from book mappings
    setBookShelfMap(prev => {
      const copy = { ...prev };
      Object.keys(copy).forEach(bId => {
        copy[bId] = copy[bId].filter(id => id !== shelfId);
      });
      return copy;
    });
    if (selectedShelfId === shelfId) setSelectedShelfId('all');
    showToast('Shelf removed', '🗑️');
  };

  const toggleBookShelf = (bookId, shelfId) => {
    setBookShelfMap(prev => {
      const currentShelves = prev[bookId] || [];
      const exists = currentShelves.includes(shelfId);
      const updated = exists ? currentShelves.filter(id => id !== shelfId) : [...currentShelves, shelfId];
      return { ...prev, [bookId]: updated };
    });
  };

  // TAGS HANDLERS
  const createTag = (newTag) => {
    const id = newTag.id || `tag-${Date.now()}`;
    const created = { id, ...newTag };
    setTags(prev => [...prev.filter(t => t.id !== id), created]);
    showToast(`Tag "${created.name}" created!`, '🏷️');
  };

  const updateTag = (tagId, updates) => {
    setTags(prev => prev.map(t => t.id === tagId ? { ...t, ...updates } : t));
    showToast('Tag updated!', '✨');
  };

  const deleteTag = (tagId) => {
    setTags(prev => prev.filter(t => t.id !== tagId));
    setBookTagMap(prev => {
      const copy = { ...prev };
      Object.keys(copy).forEach(bId => {
        copy[bId] = copy[bId].filter(id => id !== tagId);
      });
      return copy;
    });
    setSelectedTagIds(prev => prev.filter(id => id !== tagId));
    showToast('Tag deleted', '🗑️');
  };

  const toggleBookTag = (bookId, tagId) => {
    setBookTagMap(prev => {
      const currentTags = prev[bookId] || [];
      const exists = currentTags.includes(tagId);
      const updated = exists ? currentTags.filter(id => id !== tagId) : [...currentTags, tagId];
      return { ...prev, [bookId]: updated };
    });
  };

  // LORE WIKI HANDLERS
  const addLoreItem = (bookId, loreObj) => {
    setLoreWikiMap(prev => {
      const existing = prev[bookId] || [];
      const newItem = { id: `lore-${Date.now()}`, ...loreObj };
      return { ...prev, [bookId]: [...existing, newItem] };
    });
    showToast('Lore item pinned to Wiki!', '📜');
  };

  const deleteLoreItem = (bookId, loreId) => {
    setLoreWikiMap(prev => {
      const existing = prev[bookId] || [];
      return { ...prev, [bookId]: existing.filter(l => l.id !== loreId) };
    });
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
      shelves,
      createShelf,
      updateShelf,
      deleteShelf,
      tags,
      createTag,
      updateTag,
      deleteTag,
      bookShelfMap,
      toggleBookShelf,
      bookTagMap,
      toggleBookTag,
      selectedShelfId,
      setSelectedShelfId,
      selectedTagIds,
      setSelectedTagIds,
      loreWikiMap,
      addLoreItem,
      deleteLoreItem,
      communityStories,
      setCommunityStories,
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
      isShelfModalOpen,
      setIsShelfModalOpen,
      editingShelf,
      setEditingShelf,
      isTagModalOpen,
      setIsTagModalOpen,
      editingTag,
      setEditingTag,
      targetBookForShelvesTags,
      setTargetBookForShelvesTags,
      isCoverModalOpen,
      setIsCoverModalOpen,
      isPublishModalOpen,
      setIsPublishModalOpen,
      isExportModalOpen,
      setIsExportModalOpen,
      targetBookForExport,
      setTargetBookForExport,
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
