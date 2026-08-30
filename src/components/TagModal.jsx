import React, { useState, useEffect } from 'react';
import { useReading } from '../context/ReadingContext';
import { X, Tag, Sparkles, Check, Trash2 } from 'lucide-react';

const PRESET_TAG_COLORS = [
  { name: 'Red', color: '#ef4444', bgClass: 'bg-red-100', textClass: 'text-red-700', borderClass: 'border-red-300' },
  { name: 'Purple', color: '#8b5cf6', bgClass: 'bg-purple-100', textClass: 'text-purple-700', borderClass: 'border-purple-300' },
  { name: 'Blue', color: '#3b82f6', bgClass: 'bg-blue-100', textClass: 'text-blue-700', borderClass: 'border-blue-300' },
  { name: 'Emerald', color: '#10b981', bgClass: 'bg-emerald-100', textClass: 'text-emerald-700', borderClass: 'border-emerald-300' },
  { name: 'Amber', color: '#f59e0b', bgClass: 'bg-amber-100', textClass: 'text-amber-700', borderClass: 'border-amber-300' },
  { name: 'Pink', color: '#ec4899', bgClass: 'bg-pink-100', textClass: 'text-pink-700', borderClass: 'border-pink-300' },
  { name: 'Cyan', color: '#06b6d4', bgClass: 'bg-cyan-100', textClass: 'text-cyan-700', borderClass: 'border-cyan-300' },
  { name: 'Indigo', color: '#6366f1', bgClass: 'bg-indigo-100', textClass: 'text-indigo-700', borderClass: 'border-indigo-300' }
];

export const TagModal = () => {
  const { 
    isTagModalOpen, 
    setIsTagModalOpen, 
    editingTag, 
    setEditingTag, 
    createTag, 
    updateTag, 
    deleteTag 
  } = useReading();

  const [name, setName] = useState('');
  const [selectedColorObj, setSelectedColorObj] = useState(PRESET_TAG_COLORS[0]);

  useEffect(() => {
    if (editingTag) {
      setName(editingTag.name || '');
      const found = PRESET_TAG_COLORS.find(c => c.color === editingTag.color) || {
        name: 'Custom',
        color: editingTag.color,
        bgClass: editingTag.bgClass || 'bg-slate-100',
        textClass: editingTag.textClass || 'text-slate-700',
        borderClass: editingTag.borderClass || 'border-slate-300'
      };
      setSelectedColorObj(found);
    } else {
      setName('');
      setSelectedColorObj(PRESET_TAG_COLORS[0]);
    }
  }, [editingTag, isTagModalOpen]);

  if (!isTagModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tagData = {
      name: name.trim(),
      color: selectedColorObj.color,
      bgClass: selectedColorObj.bgClass,
      textClass: selectedColorObj.textClass,
      borderClass: selectedColorObj.borderClass
    };

    if (editingTag) {
      updateTag(editingTag.id, tagData);
    } else {
      createTag(tagData);
    }

    setIsTagModalOpen(false);
    setEditingTag(null);
  };

  const handleDelete = () => {
    if (editingTag) {
      deleteTag(editingTag.id);
      setIsTagModalOpen(false);
      setEditingTag(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl border border-cozy-border shadow-2xl overflow-hidden space-y-6 p-6 md:p-8 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cozy-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-playful font-extrabold text-lg text-slate-800">
                {editingTag ? 'Edit Tag' : 'Create Custom Tag'}
              </h3>
              <p className="text-xs text-cozy-muted">Color-coded labels for quick story categorization</p>
            </div>
          </div>
          <button 
            onClick={() => { setIsTagModalOpen(false); setEditingTag(null); }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">Tag Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Must Re-read, Sci-Fi Epic, Bedtime, 5-Stars..."
              className="w-full px-4 py-3 bg-cozy-bg/50 border border-cozy-border rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-peach-400 focus:bg-white transition-all"
            />
          </div>

          {/* Color Swatches */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-cozy-muted block">Color Palette</label>
            <div className="grid grid-cols-4 gap-2.5">
              {PRESET_TAG_COLORS.map(c => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => setSelectedColorObj(c)}
                  className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${c.bgClass} ${c.textClass} ${c.borderClass} ${
                    selectedColorObj.color === c.color ? 'ring-2 ring-offset-2 ring-slate-800 scale-105 shadow-sm font-bold' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-[11px] font-semibold">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Tag Preview */}
          <div className="p-4 bg-slate-900 rounded-2xl text-white flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Tag Preview:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${selectedColorObj.bgClass} ${selectedColorObj.textClass} ${selectedColorObj.borderClass}`}>
              🏷️ {name || 'Tag Name'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            {editingTag && (
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
              {editingTag ? 'Save Tag' : 'Create Tag'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
