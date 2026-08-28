import React, { useState } from 'react';
import { Users, Calendar, Eye, EyeOff, ShieldAlert, Sparkles, MessageCircle, Lock } from 'lucide-react';

export const BookClubsView = () => {
  const [revealedSpoilers, setRevealedSpoilers] = useState([]);

  const toggleSpoiler = (id) => {
    setRevealedSpoilers(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const clubs = [
    {
      id: 1,
      name: 'Starling Hollow Explorers',
      bookTitle: 'The Whispering Woods & The Lost Lantern',
      members: 42,
      schedule: 'Chapter 3 unlocks Friday at 5:00 PM',
      icon: '🌲'
    },
    {
      id: 2,
      name: 'Cosmic Space Cadets',
      bookTitle: "Oliver's Cosmic Rocketship",
      members: 38,
      schedule: 'Live Read-Along Saturday 10:00 AM',
      icon: '🚀'
    }
  ];

  const reviews = [
    {
      id: 'r1',
      author: 'Leo (Age 8)',
      rating: '⭐⭐⭐⭐⭐',
      chapter: 'Chapter 4',
      isSpoiler: true,
      text: 'I loved when Barnaby answered "Friendship!" to the Water Maiden and the whole forest burst into golden light!',
      nonSpoilerPreview: 'The ending riddle challenge was so exciting!'
    },
    {
      id: 'r2',
      author: 'Maya (Age 11)',
      rating: '⭐⭐⭐⭐⭐',
      chapter: 'Chapter 2',
      isSpoiler: false,
      text: 'The zero gravity scenes in Starhopper-9 were so funny. Swimming through juice boxes made me laugh!'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 rounded-3xl p-6 md:p-10 text-white shadow-cozy flex items-center justify-between">
        <div className="space-y-3 max-w-xl">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
            Community Reading Hub
          </span>
          <h1 className="font-playful text-3xl sm:text-4xl font-extrabold tracking-tight">
            Digital Book Clubs & Reviews 👥
          </h1>
          <p className="text-white/90 text-sm sm:text-base">
            Join synchronous reading groups, follow chapter schedules, and read spoiler-protected plot reviews!
          </p>
        </div>

        <div className="hidden md:block text-7xl transform hover:scale-110 transition-transform">
          📖
        </div>
      </div>

      {/* Synchronized Book Clubs Section */}
      <div className="space-y-4">
        <h2 className="font-playful text-2xl font-bold text-cozy-text flex items-center gap-2">
          <Users className="w-6 h-6 text-peach-500" /> Active Synchronized Book Clubs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clubs.map(club => (
            <div key={club.id} className="p-6 rounded-3xl bg-white border border-cozy-border shadow-cozy hover:shadow-cozy-hover transition-all space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-peach-100 text-3xl flex items-center justify-center">
                  {club.icon}
                </div>
                <div>
                  <h3 className="font-playful text-lg font-bold text-slate-900">{club.name}</h3>
                  <p className="text-xs font-semibold text-peach-600">Reading: {club.bookTitle}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-cozy-bg border border-cozy-border text-xs text-cozy-muted flex items-center gap-2 font-medium">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{club.schedule}</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-bold text-slate-500">{club.members} Readers Active</span>
                <button className="px-4 py-2 rounded-xl bg-peach-500 hover:bg-peach-600 text-white font-bold text-xs shadow transition-colors">
                  Join Read-Along
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spoiler-Protected Community Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-playful text-2xl font-bold text-cozy-text flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-500" /> Community Reviews (Spoiler Protected)
          </h2>
          <span className="text-xs font-bold text-cozy-muted">Tap blurred cards to reveal spoilers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(review => {
            const isRevealed = revealedSpoilers.includes(review.id);

            return (
              <div key={review.id} className="p-6 rounded-3xl bg-white border border-cozy-border shadow-cozy space-y-3 relative overflow-hidden">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{review.author}</h4>
                    <span className="text-xs text-amber-500 font-bold">{review.rating}</span>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                    {review.chapter}
                  </span>
                </div>

                {/* Review Text with Spoiler Blur Protection */}
                {review.isSpoiler ? (
                  <div
                    onClick={() => toggleSpoiler(review.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                      isRevealed
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-slate-100 border-slate-200 text-slate-800 backdrop-blur-md'
                    }`}
                  >
                    {!isRevealed ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <EyeOff className="w-4 h-4 text-amber-600 animate-pulse" />
                          <span className="text-xs font-bold text-amber-900">Contains Plot Twist Spoiler (Click to Reveal)</span>
                        </div>
                        <Lock className="w-4 h-4 text-slate-400" />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                          <span>Spoiler Unlocked</span>
                          <Eye className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs leading-relaxed">{review.text}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600 leading-relaxed p-4 bg-cozy-bg rounded-2xl border border-cozy-border">
                    "{review.text}"
                  </p>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
