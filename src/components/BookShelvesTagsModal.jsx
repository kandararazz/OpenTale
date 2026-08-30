import React from 'react';
import { useReading } from '../context/ReadingContext';
import { X, Folder, Tag, Plus, Check } from 'lucide-react';

export const BookShelvesTagsModal = () => {
  const { 
    targetBookForShelvesTags, 
    setTargetBookForShelvesTags, 
    shelves, 
    tags, 
    bookShelfMap, 
    toggleBookShelf, 
    bookTagMap, 
    toggleBookTag, 
    setIsShelfModalOpen, 
    setEditingShelf, 
    setIsTagModalOpen, 
    setEditingTag 
  } = useReading();

  if (!targetBookForShelvesTags) return null;

  const bookId = targetBookForShelvesTags.id;
  const currentShelfIds = bookShelfMap[bookId] || [];
  const currentTagIds = bookTagMap[bookId] || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-cozy-border shadow-2xl overflow-hidden space-y-6 p-6 md:p-8 animate-scale-up max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cozy-border pb-4 shrink-0">
          <div>
            <h3 className="font-playful font-extrabold text-lg text-slate-800 line-clamp-1">
              Manage Shelves & Tags
            </h3>
            <p className="text-xs text-peach-600 font-semibold line-clamp-1">
              "{targetBookForShelvesTags.title}"
            </p>
          </div>
          <button 
            onClick={() => setTargetBookForShelvesTags(null)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-6 pr-1 flex-1">
          
          {/* Shelves Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-peach-500" /> Custom Shelves
              </h4>
              <button
                onClick={() => {
                  setEditingShelf(null);
                  setIsShelfModalOpen(true);
                }}
                className="text-xs font-bold text-peach-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Shelf
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {shelves.map(shelf => {
                const isSelected = currentShelfIds.includes(shelf.id);
                return (
                  <button
                    key={shelf.id}
                    onClick={() => toggleBookShelf(bookId, shelf.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected 
                        ? 'bg-peach-500/10 border-peach-400 text-peach-900 font-bold shadow-xs' 
                        : 'bg-cozy-bg/40 border-cozy-border text-slate-700 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{shelf.icon || '📚'}</span>
                      <span className="text-xs font-semibold">{shelf.name}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected ? 'bg-peach-500 border-peach-500 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color-Coded Tags Section */}
          <div className="space-y-3 border-t border-cozy-border pt-5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-500" /> Color-Coded Tags
              </h4>
              <button
                onClick={() => {
                  setEditingTag(null);
                  setIsTagModalOpen(true);
                }}
                className="text-xs font-bold text-peach-600 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map(tag => {
                const isSelected = currentTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleBookTag(bookId, tag.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
                      isSelected 
                        ? `${tag.bgClass} ${tag.textClass} ${tag.borderClass} ring-2 ring-peach-400 shadow-xs scale-[1.02]` 
                        : 'bg-cozy-bg/50 border-cozy-border text-slate-600 hover:bg-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: tag.color || '#f59e0b' }} />
                    <span>{tag.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-cozy-border pt-4 shrink-0 flex justify-end">
          <button
            onClick={() => setTargetBookForShelvesTags(null)}
            className="px-6 py-2.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-xs shadow-md transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
