import React, { useState } from 'react';
import { MessageSquare, Heart, Send, X, User, Sparkles } from 'lucide-react';

export const SocialMarginaliaDrawer = ({ isOpen, onClose, paragraphTitle }) => {
  const [comments, setComments] = useState([
    { id: 1, author: 'Sophie (Age 9)', text: 'I love how Barnaby holds his little lantern!', likes: 14, time: '2h ago' },
    { id: 2, author: 'Parent Reader Mark', text: 'Great vocabulary choice with "canopy". Reading this together at bedtime!', likes: 8, time: '5h ago' }
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  if (!isOpen) return null;

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setComments(prev => [
      ...prev,
      {
        id: Date.now(),
        author: 'You (Reader)',
        text: newCommentText.trim(),
        likes: 1,
        time: 'Just now'
      }
    ]);
    setNewCommentText('');
  };

  const handleLike = (id) => {
    setComments(prev => prev.map(c => c.id === id ? { ...c, likes: c.likes + 1 } : c));
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl border-l border-cozy-border dark:border-slate-800 flex flex-col justify-between animate-confetti-bounce">
      
      {/* Drawer Header */}
      <div className="p-5 border-b border-cozy-border dark:border-slate-800 flex items-center justify-between bg-cozy-bg/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-peach-500" />
          <div>
            <h3 className="font-playful text-base font-bold text-slate-900 dark:text-white">Paragraph Marginalia</h3>
            <p className="text-xs text-cozy-muted line-clamp-1">{paragraphTitle || 'Chapter Discussion'}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-cozy-bg dark:hover:bg-slate-800 text-cozy-muted">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Comments List */}
      <div className="p-5 flex-1 overflow-y-auto space-y-4">
        {comments.map(c => (
          <div key={c.id} className="p-4 rounded-2xl bg-cozy-bg dark:bg-slate-800/60 border border-cozy-border dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-peach-500" /> {c.author}
              </span>
              <span className="text-cozy-muted">{c.time}</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
              "{c.text}"
            </p>
            <button
              onClick={() => handleLike(c.id)}
              className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 pt-1"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500" /> {c.likes} likes
            </button>
          </div>
        ))}
      </div>

      {/* Comment Input */}
      <form onSubmit={handleAddComment} className="p-4 border-t border-cozy-border dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Share your thought on this paragraph..."
          className="flex-1 px-4 py-2.5 rounded-2xl bg-cozy-bg dark:bg-slate-800 border border-cozy-border dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-peach-400"
        />
        <button
          type="submit"
          className="p-2.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white shadow transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
