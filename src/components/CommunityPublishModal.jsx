import React, { useState } from 'react';
import { useReading } from '../context/ReadingContext';
import { supabaseClient } from '../utils/supabaseClient';
import { X, Share2, Sparkles, Check, Globe } from 'lucide-react';

export const CommunityPublishModal = () => {
  const { isPublishModalOpen, setIsPublishModalOpen, currentBook, showToast } = useReading();
  
  const [handle, setHandle] = useState('raza_author');
  const [ageRating, setAgeRating] = useState('Ages 8–10');
  const [genreTag, setGenreTag] = useState('Fantasy');
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isPublishModalOpen) return null;

  const targetStory = currentBook || {
    id: `pub-${Date.now()}`,
    title: 'The Eclipse of Eldoria',
    author: handle,
    genre: genreTag,
    readingLevel: ageRating,
    description: 'An enchanting tale published directly to the OpenTale community library.'
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setIsPublishing(true);

    const communityItem = {
      id: `comm-${Date.now()}`,
      title: targetStory.title,
      author: `@${handle}`,
      genre: genreTag,
      readingLevel: ageRating,
      publishedAt: new Date().toISOString(),
      likes: 1,
      reads: 1,
      story: targetStory
    };

    await supabaseClient.publishToCommunity(communityItem);
    setIsPublishing(false);
    setIsPublishModalOpen(false);
    showToast(`"${targetStory.title}" published to OpenTale Community!`, '🚀');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl border border-cozy-border shadow-2xl overflow-hidden space-y-6 p-6 md:p-8 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cozy-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-playful font-extrabold text-lg text-slate-800">
                1-Click Community Publish
              </h3>
              <p className="text-xs text-cozy-muted">Share story to the public OpenTale reader community</p>
            </div>
          </div>
          <button 
            onClick={() => setIsPublishModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handlePublish} className="space-y-4">
          
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 block">Publishing Story</span>
            <h4 className="font-serif font-bold text-base text-slate-900">{targetStory.title}</h4>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">Author Handle</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-cozy-muted">@</span>
              <input
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 bg-cozy-bg/60 border border-cozy-border rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">Reading Age</label>
              <select
                value={ageRating}
                onChange={(e) => setAgeRating(e.target.value)}
                className="w-full px-3 py-2 bg-cozy-bg border border-cozy-border rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="Ages 6–8">Ages 6–8</option>
                <option value="Ages 8–10">Ages 8–10</option>
                <option value="Ages 10–12">Ages 10–12</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">Genre</label>
              <select
                value={genreTag}
                onChange={(e) => setGenreTag(e.target.value)}
                className="w-full px-3 py-2 bg-cozy-bg border border-cozy-border rounded-xl text-xs font-semibold text-slate-800"
              >
                <option value="Fantasy">Fantasy</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Fairy Tale">Fairy Tale</option>
                <option value="Adventure">Adventure</option>
                <option value="Mystery">Mystery</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPublishing}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-peach-500 hover:from-amber-600 hover:to-peach-600 text-white font-playful font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" /> {isPublishing ? 'Publishing...' : 'Publish to Community'}
          </button>

        </form>

      </div>
    </div>
  );
};
