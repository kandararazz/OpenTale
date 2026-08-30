import React, { useState, useEffect } from 'react';
import { useReading } from '../context/ReadingContext';
import { supabaseClient } from '../utils/supabaseClient';
import { 
  PenTool, Sparkles, BookOpen, Users, Wand2, RefreshCw, Plus, Trash2, 
  Save, Share2, Download, FileText, Shield, Clock, Hash
} from 'lucide-react';

const GENRE_PROMPTS = [
  'Fantasy & Magic', 'Sci-Fi Cyberpunk', 'Fairy Tale & Folklore', 
  'Cozy Mystery', 'Classic Noir', 'High Adventure', 'Modern Editorial'
];

const TONE_STYLES = [
  { id: 'classic-noir', name: 'Classic Noir', desc: 'Moody, dramatic, shadow-heavy descriptions.' },
  { id: 'modern-editorial', name: 'Modern Editorial', desc: 'Sleek, crisp, fast-paced contemporary prose.' },
  { id: 'high-fantasy', name: 'High Fantasy', desc: 'Epic, mythical, lyrical & world-building rich.' },
  { id: 'cozy-mystery', name: 'Cozy Mystery', desc: 'Warm, whimsical, intriguing & light-hearted.' },
  { id: 'scifi-thriller', name: 'Sci-Fi Thriller', desc: 'Futuristic, high-stakes & techno-immersive.' }
];

export const AuthorStudioView = () => {
  const { 
    addCustomBook, 
    showToast, 
    loreWikiMap, 
    addLoreItem, 
    deleteLoreItem,
    setIsCoverModalOpen,
    setIsPublishModalOpen,
    setIsExportModalOpen,
    setTargetBookForExport
  } = useReading();

  // Authoring Tabs: 'editor' | 'ideation' | 'multiplayer'
  const [studioTab, setStudioTab] = useState('editor');

  // Story Metadata State
  const [title, setTitle] = useState('The Eclipse of Eldoria');
  const [author, setAuthor] = useState('Raza');
  const [genre, setGenre] = useState('Fantasy & Magic');
  const [selectedTone, setSelectedTone] = useState('high-fantasy');

  // Story Content State (Chapter Text)
  const [chapters, setChapters] = useState([
    {
      id: 'chap-1',
      title: 'Chapter 1: The Whispering Twilight',
      text: `The sun sank beneath the jagged peaks of Mount Eldoria, casting long indigo shadows across the ancient cobblestone valley. Oliver held the silver compass tightly in his palm. The needle spun wildly, pointing not toward magnetic north, but toward the glowing fungi deep inside the Whispering Woods.\n\n"We cannot go further tonight," whispered Lyra, pulling her velvet cloak closer around her shoulders. "The twilight beasts awaken when the second moon rises."\n\nOliver smiled, his fingers tracing the ancient runes etched into the compass face. "That is precisely when the lantern leads the way."`
    }
  ]);
  const [activeChapIndex, setActiveChapIndex] = useState(0);

  // Ideation Form State (Plot & Character Builder)
  const [builderGenre, setBuilderGenre] = useState('Fantasy & Magic');
  const [mainChar, setMainChar] = useState('Oliver the Star-Seeker');
  const [conflict, setConflict] = useState('A mysterious eclipse freezing the ancient clockwork forest');
  const [setting, setSetting] = useState('The floating sky-island of Aethelgard');
  const [isGeneratingPlot, setIsGeneratingPlot] = useState(false);

  // AI Assistant Floating Action State
  const [selectedText, setSelectedText] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [whatIfInput, setWhatIfInput] = useState('');
  const [showWhatIfBox, setShowWhatIfBox] = useState(false);

  // Lore Wiki State
  const [newLoreName, setNewLoreName] = useState('');
  const [newLoreCategory, setNewLoreCategory] = useState('Character');
  const [newLoreDesc, setNewLoreDesc] = useState('');
  const [newLoreIcon, setNewLoreIcon] = useState('🧑');

  // Multiplayer Simulation State
  const [isMultiplayerActive, setIsMultiplayerActive] = useState(false);
  const [coAuthors, setCoAuthors] = useState([
    { id: 'ca-1', name: 'Sophia M.', avatar: '👩‍🎨', color: 'bg-emerald-500', cursorLine: 'Line 14', status: 'Editing Chapter 1' },
    { id: 'ca-2', name: 'Liam K.', avatar: '👨‍💻', color: 'bg-indigo-500', cursorLine: 'Line 22', status: 'Adding Lore Profile' }
  ]);
  const [versionHistory, setVersionHistory] = useState([
    { time: '10 mins ago', author: 'Raza (You)', note: 'Drafted Chapter 1 opening scene' },
    { time: '5 mins ago', author: 'Sophia M.', note: 'Polished twilight dialogue' }
  ]);

  const activeChapter = chapters[activeChapIndex] || chapters[0];

  // Text Stats
  const fullStoryText = chapters.map(c => c.text).join(' ');
  const totalWords = fullStoryText.trim() ? fullStoryText.trim().split(/\s+/).length : 0;
  const totalChars = fullStoryText.length;
  const readingTimeMins = Math.max(1, Math.ceil(totalWords / 200));

  // Current Book ID for Lore
  const currentLoreBookId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const activeLoreItems = loreWikiMap[currentLoreBookId] || [
    { id: 'l-default-1', name: mainChar, category: 'Character', description: 'Protagonist with Star Compass', icon: '🌟' },
    { id: 'l-default-2', name: setting, category: 'Location', description: 'Realm of eternal twilight clockworks', icon: '🏰' }
  ];

  // Handlers for Chapter Text Edits
  const handleTextChange = (val) => {
    setChapters(prev => prev.map((c, i) => i === activeChapIndex ? { ...c, text: val } : c));
  };

  const handleTitleChange = (val) => {
    setChapters(prev => prev.map((c, i) => i === activeChapIndex ? { ...c, title: val } : c));
  };

  const addNewChapter = () => {
    const newChap = {
      id: `chap-${chapters.length + 1}`,
      title: `Chapter ${chapters.length + 1}: The Uncharted Path`,
      text: `Write your next chapter content here...`
    };
    setChapters(prev => [...prev, newChap]);
    setActiveChapIndex(chapters.length);
    showToast('New chapter added!', '📝');
  };

  // AI Inline Writing Tools (Expand, Shorten, Fix Pacing)
  const handleAiWritingTool = (mode) => {
    setIsAiProcessing(true);
    setTimeout(() => {
      let currentText = activeChapter.text;
      if (mode === 'expand') {
        const expansion = `\n\nA crisp wind whispered through the towering canopy above, carrying the distant scent of pine resin and old parchment. Every stone beneath their boots hummed with ancient resonant magic, echoing the secrets of forgotten ages.`;
        handleTextChange(currentText + expansion);
        showToast('Scene expanded with sensory depth!', '✨');
      } else if (mode === 'shorten') {
        const shortened = currentText.replace(/\b(very|extremely|really|quite|kind of|sort of)\b\s*/gi, '');
        handleTextChange(shortened);
        showToast('Dialogue and pacing tightened!', '⚡');
      } else if (mode === 'pacing') {
        const transition = `\n\nMinutes melted into hours as night fell. Without another word, they picked up their lanterns and pressed forward into the mist.`;
        handleTextChange(currentText + transition);
        showToast('Pacing smoothed with transition!', '🌊');
      }
      setIsAiProcessing(false);
    }, 800);
  };

  // "What If?" Branching AI Generator
  const handleWhatIfBranching = () => {
    if (!whatIfInput.trim()) return;
    setIsAiProcessing(true);
    setTimeout(() => {
      const branchText = `\n\n--- 🔀 "WHAT IF?" ALTERNATE BRANCH ---\n[What If: ${whatIfInput}]\n\nSuddenly, the star compass in Oliver's hand pulsed with a brilliant azure flash! Instead of pointing deeper into the forest, the needle rotated backwards and opened a shimmering rift in the air right before their eyes. Lyra gasped as a silver creature stepped out from the light...`;
      handleTextChange(activeChapter.text + branchText);
      setWhatIfInput('');
      setShowWhatIfBox(false);
      setIsAiProcessing(false);
      showToast('Alternate storyline branch generated!', '🔀');
    }, 1000);
  };

  // Plot Builder Form Submission
  const handleGeneratePlotOutline = (e) => {
    e.preventDefault();
    setIsGeneratingPlot(true);
    setTimeout(() => {
      const newTitle = `The Legend of ${mainChar.split(' ')[0]}`;
      setTitle(newTitle);
      setGenre(builderGenre);

      const generatedChapters = [
        {
          id: 'chap-1',
          title: 'Chapter 1: The Inciting Incident',
          text: `In the realm of ${setting}, ${mainChar} spent their days studying ancient scrolls. Everything changed when ${conflict}. The air shimmered with unexpected energy, forcing a choice that could never be undone.`
        },
        {
          id: 'chap-2',
          title: 'Chapter 2: The Journey Begins',
          text: `With only a satchel of supplies and unshakeable resolve, ${mainChar} set out past the high border guards. Shadows loomed in the distance, but the quest was now underway.`
        },
        {
          id: 'chap-3',
          title: 'Chapter 3: The Climax & Resolution',
          text: `At the highest tower in ${setting}, the ultimate confrontation took place. ${mainChar} drew upon every lesson learned to resolve ${conflict}, restoring balance across the land.`
        }
      ];

      setChapters(generatedChapters);
      setActiveChapIndex(0);
      setIsGeneratingPlot(false);
      setStudioTab('editor');
      showToast('Custom story generated from Plot Builder!', '🪄');
    }, 1200);
  };

  // Save Book to Library & Local Storage
  const handleSaveToLibrary = () => {
    const bookObj = {
      id: `authored-${Date.now()}`,
      title,
      author: author || 'OpenTale Author',
      genre,
      readingLevel: 'Custom Authoring',
      estimatedMinutes: readingTimeMins,
      description: `Authored story created in OpenTale Studio (${totalWords} words, ${chapters.length} chapters).`,
      isCustom: true,
      pages: chapters
    };
    addCustomBook(bookObj);
    supabaseClient.saveStory(bookObj);
  };

  // Add Lore Item
  const handleAddLore = (e) => {
    e.preventDefault();
    if (!newLoreName.trim()) return;
    addLoreItem(currentLoreBookId, {
      name: newLoreName.trim(),
      category: newLoreCategory,
      description: newLoreDesc.trim() || 'No description provided.',
      icon: newLoreIcon
    });
    setNewLoreName('');
    setNewLoreDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-peach-500/20 backdrop-blur-md rounded-full text-xs font-bold text-peach-300 border border-peach-400/30 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5" /> Authoring & AI Story Studio
            </span>
            {isMultiplayerActive && (
              <span className="px-3 py-1 bg-emerald-500/20 rounded-full text-xs font-bold text-emerald-300 border border-emerald-400/30 animate-pulse flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Live Multiplayer
              </span>
            )}
          </div>
          <h1 className="font-playful text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Draft, Ideate & Publish Your Masterpiece
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Distraction-free Markdown editor, AI scene expanders, "What If?" branching, character lore wiki, and instant EPUB/PDF publishing.
          </p>
        </div>

        {/* Toolbar Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          <button
            onClick={() => setIsCoverModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Cover Art
          </button>
          <button
            onClick={handleSaveToLibrary}
            className="px-4 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save to Library
          </button>
          <button
            onClick={() => {
              setTargetBookForExport({
                title, author, genre, estimatedMinutes: readingTimeMins, pages: chapters
              });
              setIsExportModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export EPUB/PDF
          </button>
          <button
            onClick={() => setIsPublishModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-peach-500 hover:from-amber-600 hover:to-peach-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" /> 1-Click Publish
          </button>
        </div>

      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center justify-between border-b border-cozy-border pb-4 gap-4 flex-wrap">
        
        <div className="flex items-center gap-2 bg-cozy-bg p-1 rounded-2xl border border-cozy-border">
          <button
            onClick={() => setStudioTab('editor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              studioTab === 'editor' ? 'bg-white text-peach-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" /> Writing Canvas
          </button>
          <button
            onClick={() => setStudioTab('ideation')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              studioTab === 'ideation' ? 'bg-white text-peach-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wand2 className="w-4 h-4 text-purple-500" /> Plot & Character Builder
          </button>
          <button
            onClick={() => setStudioTab('multiplayer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              studioTab === 'multiplayer' ? 'bg-white text-peach-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" /> Co-Writing (Multiplayer)
          </button>
        </div>

        {/* Live Story Statistics Counter */}
        <div className="flex items-center gap-4 text-xs font-semibold text-cozy-muted">
          <span className="flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-peach-500" /> {totalWords} Words
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> ~{readingTimeMins} min read
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-sky-500" /> {chapters.length} Chapters
          </span>
        </div>

      </div>

      {/* VIEW 1: MINIMALIST WRITING CANVAS & INLINE AI TOOLS */}
      {studioTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* MAIN EDITOR COLUMN */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Story Title & Style Controls Card */}
            <div className="bg-white p-6 rounded-3xl border border-cozy-border shadow-cozy space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-7 space-y-1">
                  <label className="text-[11px] font-bold text-cozy-muted uppercase tracking-wider block">Book Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-serif font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-cozy-border focus:border-peach-400 focus:outline-none transition-all py-1"
                    placeholder="Enter Story Title..."
                  />
                </div>
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[11px] font-bold text-cozy-muted uppercase tracking-wider block">Writing Style & Tone Matcher</label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full px-3 py-2 bg-cozy-bg border border-cozy-border rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-peach-400"
                  >
                    {TONE_STYLES.map(t => (
                      <option key={t.id} value={t.id}>{t.name} — {t.desc}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chapter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-cozy-border pb-1">
                {chapters.map((chap, idx) => (
                  <button
                    key={chap.id}
                    onClick={() => setActiveChapIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                      activeChapIndex === idx 
                        ? 'bg-peach-500 text-white shadow-xs' 
                        : 'bg-cozy-bg text-cozy-muted hover:text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    Chapter {idx + 1}
                  </button>
                ))}
                <button
                  onClick={addNewChapter}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-peach-100 text-peach-700 hover:bg-peach-200 shrink-0 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Chapter
                </button>
              </div>

            </div>

            {/* Inline AI Assistant Toolbar */}
            <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-4 rounded-3xl text-white shadow-lg space-y-3 border border-purple-800/40">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Inline AI Assistant
                </span>
                
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleAiWritingTool('expand')}
                    disabled={isAiProcessing}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold border border-white/15 transition-all flex items-center gap-1 disabled:opacity-50"
                  >
                    ✨ Expand Scene
                  </button>
                  <button
                    onClick={() => handleAiWritingTool('shorten')}
                    disabled={isAiProcessing}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold border border-white/15 transition-all flex items-center gap-1 disabled:opacity-50"
                  >
                    ⚡ Shorten Dialogue
                  </button>
                  <button
                    onClick={() => handleAiWritingTool('pacing')}
                    disabled={isAiProcessing}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold border border-white/15 transition-all flex items-center gap-1 disabled:opacity-50"
                  >
                    🌊 Fix Pacing
                  </button>
                  <button
                    onClick={() => setShowWhatIfBox(!showWhatIfBox)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs shadow-xs transition-all flex items-center gap-1"
                  >
                    🔀 "What If?" Branch
                  </button>
                </div>
              </div>

              {/* What If input expansion box */}
              {showWhatIfBox && (
                <div className="pt-3 border-t border-white/10 flex items-center gap-2 animate-fade-in">
                  <input
                    type="text"
                    value={whatIfInput}
                    onChange={(e) => setWhatIfInput(e.target.value)}
                    placeholder="e.g. What if Oliver accidentally activates a dormant stargate?"
                    className="flex-1 px-4 py-2 bg-black/40 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    onClick={handleWhatIfBranching}
                    disabled={isAiProcessing}
                    className="px-4 py-2 bg-amber-500 text-slate-900 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors"
                  >
                    Generate Branch
                  </button>
                </div>
              )}
            </div>

            {/* Textarea Editor Canvas */}
            <div className="bg-white rounded-3xl border border-cozy-border shadow-cozy p-6 sm:p-8 space-y-4">
              
              <input
                type="text"
                value={activeChapter.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-lg font-serif font-bold text-peach-600 border-b border-cozy-border pb-2 focus:outline-none focus:border-peach-400"
                placeholder="Chapter Title..."
              />

              <textarea
                rows={18}
                value={activeChapter.text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Write your story content here in Markdown format..."
                className="w-full font-serif text-slate-800 text-base leading-relaxed focus:outline-none resize-y transition-colors p-2"
              ></textarea>

              <div className="flex items-center justify-between text-xs text-cozy-muted border-t border-cozy-border pt-4">
                <span>Markdown Supported: **bold**, *italic*, # Heading</span>
                <span>{activeChapter.text.trim().split(/\s+/).length} Words in Chapter</span>
              </div>

            </div>

          </main>

          {/* RIGHT SIDEBAR: LORE & CHARACTER WIKI */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Character & Lore Wiki Card */}
            <div className="bg-white p-6 rounded-3xl border border-cozy-border shadow-cozy space-y-6">
              
              <div className="flex items-center justify-between border-b border-cozy-border pb-3">
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-peach-500" /> Lore & Character Wiki
                </h3>
                <span className="text-[11px] font-bold text-peach-600 bg-peach-50 px-2 py-0.5 rounded-full">
                  {activeLoreItems.length} Pinned
                </span>
              </div>

              {/* Lore Items List */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {activeLoreItems.map(item => (
                  <div key={item.id} className="p-3 bg-cozy-bg/60 rounded-2xl border border-cozy-border/60 space-y-1.5 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.icon || '📜'}</span>
                        <h4 className="font-bold text-xs text-slate-800">{item.name}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-cozy-muted border border-cozy-border">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-cozy-muted line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <button
                      onClick={() => deleteLoreItem(currentLoreBookId, item.id)}
                      className="absolute top-2 right-2 p-1 text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Lore Item Form */}
              <form onSubmit={handleAddLore} className="space-y-3 pt-3 border-t border-cozy-border">
                <h4 className="text-xs font-bold text-slate-800">Pin New Lore Profile</h4>
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Name (e.g. Lyra)"
                    value={newLoreName}
                    onChange={(e) => setNewLoreName(e.target.value)}
                    className="px-3 py-2 bg-cozy-bg border border-cozy-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-peach-400"
                  />
                  <select
                    value={newLoreCategory}
                    onChange={(e) => setNewLoreCategory(e.target.value)}
                    className="px-3 py-2 bg-cozy-bg border border-cozy-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-peach-400"
                  >
                    <option value="Character">Character</option>
                    <option value="Location">Location</option>
                    <option value="Magic System">Magic System</option>
                    <option value="Artifact">Artifact</option>
                  </select>
                </div>

                <textarea
                  rows={2}
                  placeholder="Key traits, history, or rules..."
                  value={newLoreDesc}
                  onChange={(e) => setNewLoreDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-cozy-bg border border-cozy-border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-peach-400"
                ></textarea>

                <button
                  type="submit"
                  className="w-full py-2 bg-peach-500 hover:bg-peach-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Pin to AI Lore Wiki
                </button>
              </form>

            </div>

          </aside>

        </div>
      )}

      {/* VIEW 2: PLOT & CHARACTER BUILDER (IDEATION WIZARD) */}
      {studioTab === 'ideation' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-cozy-border shadow-cozy space-y-8 max-w-3xl mx-auto">
          
          <div className="text-center space-y-2 border-b border-cozy-border pb-6">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto text-xl">
              🪄
            </div>
            <h2 className="font-playful text-2xl font-extrabold text-slate-800">Guided Plot & Character Builder</h2>
            <p className="text-xs text-cozy-muted max-w-md mx-auto">
              Fill out key story anchors and let AI construct a multi-chapter outline with character arcs and narrative tension.
            </p>
          </div>

          <form onSubmit={handleGeneratePlotOutline} className="space-y-6">
            
            {/* Genre */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">1. Story Genre</label>
              <div className="flex flex-wrap gap-2">
                {GENRE_PROMPTS.map(g => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setBuilderGenre(g)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all ${
                      builderGenre === g ? 'bg-purple-600 text-white shadow-xs scale-105' : 'bg-cozy-bg text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Character */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">2. Main Character & Trait</label>
              <input
                type="text"
                required
                value={mainChar}
                onChange={(e) => setMainChar(e.target.value)}
                placeholder="e.g. Oliver, a curious clockmaker with a star compass"
                className="w-full px-4 py-3 bg-cozy-bg/60 border border-cozy-border rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Setting */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">3. World & Setting</label>
              <input
                type="text"
                required
                value={setting}
                onChange={(e) => setSetting(e.target.value)}
                placeholder="e.g. The floating sky-island of Aethelgard"
                className="w-full px-4 py-3 bg-cozy-bg/60 border border-cozy-border rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Conflict */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">4. Inciting Conflict / Goal</label>
              <textarea
                rows={3}
                required
                value={conflict}
                onChange={(e) => setConflict(e.target.value)}
                placeholder="e.g. A mysterious twilight eclipse threatens to freeze the ancient gears..."
                className="w-full px-4 py-3 bg-cozy-bg/60 border border-cozy-border rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isGeneratingPlot}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-playful font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingPlot ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Constructing Narrative Outline...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generate Full Story Chapters
                </>
              )}
            </button>

          </form>

        </div>
      )}

      {/* VIEW 3: MULTIPLAYER CO-WRITING SIMULATOR */}
      {studioTab === 'multiplayer' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cozy-border shadow-cozy space-y-6">
          
          <div className="flex items-center justify-between border-b border-cozy-border pb-4 flex-wrap gap-4">
            <div>
              <h2 className="font-playful text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" /> Collaborative Co-Writing (Multiplayer)
              </h2>
              <p className="text-xs text-cozy-muted">Real-time co-author presence, active cursors, and live version history.</p>
            </div>

            <button
              onClick={() => setIsMultiplayerActive(!isMultiplayerActive)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                isMultiplayerActive ? 'bg-emerald-500 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <UserPlus className="w-4 h-4" /> {isMultiplayerActive ? 'Multiplayer Active' : 'Start Session'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Active Co-Authors List */}
            <div className="space-y-4 bg-cozy-bg/50 p-5 rounded-2xl border border-cozy-border">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Active Co-Authors Online</h3>
              <div className="space-y-3">
                {coAuthors.map(ca => (
                  <div key={ca.id} className="p-3 bg-white rounded-xl border border-cozy-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{ca.avatar}</span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">{ca.name}</h4>
                        <span className="text-[10px] text-emerald-600 font-semibold">{ca.status}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${ca.color}`}>
                      {ca.cursorLine}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Version History Log */}
            <div className="space-y-4 bg-cozy-bg/50 p-5 rounded-2xl border border-cozy-border">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Real-Time Version History</h3>
              <div className="space-y-3">
                {versionHistory.map((vh, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-cozy-border space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <strong className="text-slate-800">{vh.author}</strong>
                      <span className="text-cozy-muted">{vh.time}</span>
                    </div>
                    <p className="text-xs text-cozy-muted">{vh.note}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
