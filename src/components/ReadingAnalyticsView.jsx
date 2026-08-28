import React from 'react';
import { BarChart3, Clock, Zap, Sun, Moon, PieChart, Activity } from 'lucide-react';

export const ReadingAnalyticsView = () => {
  const metrics = {
    avgWpm: 245,
    totalWordsRead: 14280,
    totalMinutes: 124,
    circadian: {
      morning: '20%',
      afternoon: '35%',
      night: '45%'
    },
    genreBreakdown: [
      { name: 'Fantasy', percentage: 40, color: 'bg-emerald-500' },
      { name: 'Sci-Fi', percentage: 30, color: 'bg-purple-500' },
      { name: 'Fairy Tale', percentage: 20, color: 'bg-peach-500' },
      { name: 'Adventure', percentage: 10, color: 'bg-sky-500' }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-slate-900 rounded-3xl p-6 md:p-10 text-white shadow-cozy flex items-center justify-between">
        <div className="space-y-3 max-w-xl">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white">
            Reading Intelligence
          </span>
          <h1 className="font-playful text-3xl sm:text-4xl font-extrabold tracking-tight">
            Deep Reading Metrics 📊
          </h1>
          <p className="text-white/90 text-sm sm:text-base">
            Track your reading velocity, circadian habits, and genre breakdown in real time!
          </p>
        </div>

        <div className="hidden md:block text-7xl transform hover:scale-110 transition-transform">
          📈
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-cozy-border shadow-cozy flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl font-bold">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-cozy-muted uppercase tracking-wider">Reading Velocity</p>
            <h3 className="font-playful text-2xl font-extrabold text-purple-700">
              {metrics.avgWpm} WPM
            </h3>
            <p className="text-xs text-sage-600 font-medium">Optimal Comprehension</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cozy-border shadow-cozy flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-2xl font-bold">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-cozy-muted uppercase tracking-wider">Total Time Spent</p>
            <h3 className="font-playful text-2xl font-extrabold text-sky-700">
              {metrics.totalMinutes} Mins
            </h3>
            <p className="text-xs text-cozy-muted font-medium">~12 Story Chapters</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-cozy-border shadow-cozy flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-peach-100 text-peach-600 flex items-center justify-center text-2xl font-bold">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-cozy-muted uppercase tracking-wider">Words Processed</p>
            <h3 className="font-playful text-2xl font-extrabold text-peach-700">
              {metrics.totalWordsRead.toLocaleString()}
            </h3>
            <p className="text-xs text-sage-600 font-medium">+18% vs Last Week</p>
          </div>
        </div>

      </div>

      {/* Circadian Habits & Genre Breakdown Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Circadian Habit Card */}
        <div className="p-6 bg-white rounded-3xl border border-cozy-border shadow-cozy space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-playful text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" /> Circadian Reading Habits
            </h3>
            <span className="text-xs text-cozy-muted font-semibold">Time of Day</span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Morning (6 AM - 12 PM)</span>
                <span>{metrics.circadian.morning}</span>
              </div>
              <div className="w-full h-3 bg-cozy-bg rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: metrics.circadian.morning }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Afternoon (12 PM - 6 PM)</span>
                <span>{metrics.circadian.afternoon}</span>
              </div>
              <div className="w-full h-3 bg-cozy-bg rounded-full overflow-hidden">
                <div className="h-full bg-peach-500 rounded-full" style={{ width: metrics.circadian.afternoon }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5 text-indigo-400" /> Night Bedtime (6 PM - 10 PM)</span>
                <span className="text-indigo-600">{metrics.circadian.night}</span>
              </div>
              <div className="w-full h-3 bg-cozy-bg rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: metrics.circadian.night }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Genre Breakdown Card */}
        <div className="p-6 bg-white rounded-3xl border border-cozy-border shadow-cozy space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-playful text-lg font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" /> Annual Genre Breakdown
            </h3>
            <span className="text-xs text-cozy-muted font-semibold">Distribution</span>
          </div>

          <div className="space-y-3 pt-2">
            {metrics.genreBreakdown.map(genre => (
              <div key={genre.name}>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>{genre.name}</span>
                  <span>{genre.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-cozy-bg rounded-full overflow-hidden">
                  <div className={`h-full ${genre.color} rounded-full`} style={{ width: `${genre.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
