import React from 'react';
import { useReading } from '../context/ReadingContext';
import { BADGES } from '../data/stories';
import { Flame, Award, Lock, Sparkles, CheckCircle, Trophy, BookOpen } from 'lucide-react';

export const AchievementsView = () => {
  const { unlockedBadgeIds = [], todayMinutesRead = 0, targetMinutes = 20, completedBookIds = [], setActiveTab } = useReading() || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-400 to-peach-500 rounded-3xl p-6 md:p-10 text-white shadow-cozy flex items-center justify-between">
        <div className="space-y-3 max-w-xl">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
            Gamified Milestones
          </span>
          <h1 className="font-playful text-3xl sm:text-4xl font-extrabold tracking-tight">
            Reading Badges & Accomplishments 🏆
          </h1>
          <p className="text-white/90 text-sm sm:text-base">
            Keep reading daily to hit your reading goal and unlock special reader badges!
          </p>
        </div>

        <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-md text-6xl shadow-inner-soft animate-pulse">
          📖
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-cozy-border shadow-cozy flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl">
            ⏱️
          </div>
          <div>
            <p className="text-xs font-bold text-cozy-muted uppercase tracking-wider">Today's Progress</p>
            <h3 className="font-playful text-2xl font-extrabold text-orange-600">
              {todayMinutesRead} / {targetMinutes} Mins
            </h3>
            <p className="text-xs text-sage-600 font-medium">Daily Target Active</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cozy-border shadow-cozy flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl">
            🏆
          </div>
          <div>
            <p className="text-xs font-bold text-cozy-muted uppercase tracking-wider">Badges Unlocked</p>
            <h3 className="font-playful text-2xl font-extrabold text-amber-600">
              {unlockedBadgeIds.length} / {BADGES.length}
            </h3>
            <p className="text-xs text-cozy-muted font-medium">Earned by reading</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cozy-border shadow-cozy flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-peach-100 text-peach-600 flex items-center justify-center text-3xl">
            📖
          </div>
          <div>
            <p className="text-xs font-bold text-cozy-muted uppercase tracking-wider">Completed Books</p>
            <h3 className="font-playful text-2xl font-extrabold text-peach-600">
              {completedBookIds.length} Stories
            </h3>
            <p className="text-xs text-sage-600 font-medium">Starling Hollow & Beyond</p>
          </div>
        </div>

      </div>

      {/* Badges Gallery */}
      <div className="space-y-4">
        <h2 className="font-playful text-2xl font-bold text-cozy-text flex items-center gap-2">
          <Award className="w-6 h-6 text-peach-500" /> Reader Badge Showcase
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BADGES.map(badge => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-6 rounded-3xl border-2 transition-all duration-300 flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-cozy hover:shadow-cozy-hover'
                    : 'bg-cozy-bg/50 border-cozy-border opacity-60'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-amber-100 to-butter-200 text-amber-800 shadow-sm'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isUnlocked ? badge.icon : <Lock className="w-6 h-6 text-slate-400" />}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-playful text-lg font-bold ${isUnlocked ? 'text-cozy-text' : 'text-slate-500'}`}>
                      {badge.name}
                    </h3>
                    {isUnlocked && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        UNLOCKED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-cozy-muted leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
