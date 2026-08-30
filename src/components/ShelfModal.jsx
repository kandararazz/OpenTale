import React, { useState, useEffect } from 'react';
import { useReading } from '../context/ReadingContext';
import { X, Folder, Sparkles, Check, Trash2 } from 'lucide-react';

const EMOJI_OPTIONS = ['📚', '❤️', '📖', '🎯', '🔖', '🚀', '🧙', '💡', '⭐', '🦉', '🎨', '🌟', '🏰', '🔮', '🌿', '📜'];
const COLOR_OPTIONS = [
  { id: 'rose', name: 'Rose', bg: 'bg-rose-500', ring: 'ring-rose-400' },
  { id: 'amber', name: 'Amber', bg: 'bg-amber-500', ring: 'ring-amber-400' },
  { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-500', ring: 'ring-emerald-400' },
  { id: 'sky', name: 'Sky Blue', bg: 'bg-sky-500', ring: 'ring-sky-400' },
  { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-500', ring: 'ring-indigo-400' },
  { id: 'purple', name: 'Purple', bg: 'bg-purple-500', ring: 'ring-purple-400' },
  { id: 'pink', name: 'Pink', bg: 'bg-pink-500', ring: 'ring-pink-400' },
  { id: 'teal', name: 'Teal', bg: 'bg-teal-500', ring: 'ring-teal-400' }
];

export const ShelfModal = () => {
  const { 
    isShelfModalOpen, 
    setIsShelfModalOpen, 
    editingShelf, 
    setEditingShelf, 
    createShelf, 
    updateShelf, 
    deleteShelf 
  } = useReading();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📚');
  const [color, setColor] = useState('indigo');

  useEffect(() => {
    if (editingShelf) {
      setName(editingShelf.name || '');
      setIcon(editingShelf.icon || '📚');
      setColor(editingShelf.color || 'indigo');
    } else {
      setName('');
      setIcon('📚');
      setColor('indigo');
    }
  }, [editingShelf, isShelfModalOpen]);

  if (!isShelfModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingShelf) {
      updateShelf(editingShelf.id, { name: name.trim(), icon, color });
    } else {
      createShelf({ name: name.trim(), icon, color });
    }

    setIsShelfModalOpen(false);
    setEditingShelf(null);
  };

  const handleDelete = () => {
    if (editingShelf) {
      deleteShelf(editingShelf.id);
      setIsShelfModalOpen(false);
      setEditingShelf(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl border border-cozy-border shadow-2xl overflow-hidden space-y-6 p-6 md:p-8 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cozy-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-peach-100 flex items-center justify-center text-peach-600">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-playful font-extrabold text-lg text-slate-800">
                {editingShelf ? 'Edit Shelf' : 'Create Custom Shelf'}
              </h3>
              <p className="text-xs text-cozy-muted">Organize your books into custom collections</p>
            </div>
          </div>
          <button 
            onClick={() => { setIsShelfModalOpen(false); setEditingShelf(null); }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">Shelf Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bedtime Favorites, To Read 2026, Reference..."
              className="w-full px-4 py-3 bg-cozy-bg/50 border border-cozy-border rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-peach-400 focus:bg-white transition-all"
            />
          </div>

          {/* Emoji Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">Shelf Icon</label>
            <div className="flex flex-wrap gap-2 p-3 bg-cozy-bg/40 rounded-2xl border border-cozy-border/60">
              {EMOJI_OPTIONS.map(e => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setIcon(e)}
                  className={`w-9 h-9 text-lg rounded-xl flex items-center justify-center transition-all ${
                    icon === e ? 'bg-white shadow-md scale-110 border-2 border-peach-400' : 'hover:bg-white/60 hover:scale-105'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color Theme Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">Color Accent</label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map(c => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all text-white ${c.bg} ${
                    color === c.id ? 'ring-2 ring-offset-2 ring-slate-800 scale-105 shadow-sm' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {color === c.id && <Check className="w-3.5 h-3.5" />}
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div className="p-4 bg-slate-900 rounded-2xl text-white flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Shelf Badge Preview:</span>
            <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold flex items-center gap-2 border border-white/15">
              <span>{icon}</span>
              <span>{name || 'Shelf Name'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {editingShelf && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-playful font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {editingShelf ? 'Save Changes' : 'Create Shelf'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
