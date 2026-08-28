import React from 'react';
import { useReading } from '../context/ReadingContext';
import { STORIES } from '../data/stories';
import { Sparkles, BookOpen, Volume2, Award, ArrowRight, ShieldCheck, Heart, Smile, Clock } from 'lucide-react';

export const HeroLanding = () => {
  const { setActiveTab, openBookInReader } = useReading();
  const featuredBook = STORIES[0];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-12 md:pb-24">
        {/* Soft Background Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-peach-200/50 via-butter-100/60 to-sage-100/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* Badge Pills */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-peach-100 border border-peach-200 text-peach-700 text-xs sm:text-sm font-semibold shadow-sm">
                <Sparkles className="w-4 h-4 text-peach-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Next-Gen EdTech Reading Platform</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-playful text-4xl sm:text-5xl lg:text-6xl font-extrabold text-cozy-text leading-tight tracking-tight">
                Where Passionate Readers <br />
                <span className="bg-gradient-to-r from-peach-600 via-amber-500 to-sage-600 bg-clip-text text-transparent">
                  Fall in Love with Literature
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-lg sm:text-xl text-cozy-muted font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                OpenTale brings fairy tales, space adventures, and classic stories to life with an Apple Books and Medium inspired editorial reader, speech narration, and instant definitions.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => openBookInReader(featuredBook)}
                  className="w-full sm:w-auto px-8 py-4 rounded-3xl bg-gradient-to-r from-peach-500 to-peach-600 hover:from-peach-600 hover:to-peach-700 text-white font-playful font-bold text-lg shadow-cozy hover:shadow-cozy-hover hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group"
                >
                  <BookOpen className="w-6 h-6 transform group-hover:-rotate-12 transition-transform" />
                  Start Reading Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveTab('library')}
                  className="w-full sm:w-auto px-8 py-4 rounded-3xl bg-white hover:bg-cozy-bg text-cozy-text font-sans font-bold text-base border-2 border-cozy-border shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Explore Story Library
                </button>
              </div>

              {/* Trust Indicators / Stats */}
              <div className="pt-6 border-t border-cozy-border/60 grid grid-cols-2 gap-4 text-center lg:text-left max-w-md mx-auto lg:mx-0">
                <div>
                  <p className="font-playful text-2xl font-bold text-peach-600">100%</p>
                  <p className="text-xs text-cozy-muted font-medium">Distraction-Free & Ad-Free</p>
                </div>
                <div>
                  <p className="font-playful text-2xl font-bold text-sage-600">Serif & Sans</p>
                  <p className="text-xs text-cozy-muted font-medium">Apple & Kindle Typography</p>
                </div>
              </div>

            </div>

            {/* Right Side: Editorial Featured Showcase Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              
              {/* Main Featured Book Showcase Card */}
              <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-950 text-white flex flex-col justify-between p-8 min-h-[380px] group transform hover:rotate-1 transition-transform duration-500">
                <div className="space-y-3 z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-peach-500/90 text-white text-xs font-bold">
                      {featuredBook.readingLevel}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-slate-200 text-xs font-medium border border-white/10">
                      ⏱️ {featuredBook.estimatedMinutes} min read
                    </span>
                  </div>

                  <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block pt-2">Featured Selection</span>
                  <h3 className="font-serif text-3xl font-bold text-white group-hover:text-amber-200 transition-colors leading-tight">
                    {featuredBook.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">By {featuredBook.author}</p>
                </div>

                <div className="space-y-4 pt-6 z-10">
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {featuredBook.description}
                  </p>

                  <button
                    onClick={() => openBookInReader(featuredBook)}
                    className="w-full py-3 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 shadow"
                  >
                    <BookOpen className="w-4 h-4 text-peach-600" /> Open Reader View
                  </button>
                </div>

                <div className="absolute right-4 bottom-12 text-9xl opacity-5 font-serif select-none pointer-events-none">
                  📖
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-playful text-3xl sm:text-4xl font-bold text-cozy-text">
            Designed for Pure Reading Pleasure
          </h2>
          <p className="text-cozy-muted text-base max-w-xl mx-auto">
            Focus on what matters most — beautiful prose, immersive ambient sounds, and elegant editorial typography.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Editorial Reader View */}
          <div className="p-6 rounded-3xl bg-white border border-cozy-border shadow-cozy hover:shadow-cozy-hover transition-all duration-300 space-y-4 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-peach-100 text-peach-600 flex items-center justify-center text-xl font-bold">
              📖
            </div>
            <h3 className="font-playful text-xl font-bold text-cozy-text">Editorial Reader View</h3>
            <p className="text-sm text-cozy-muted leading-relaxed">
              Distraction-free reading canvas with Pure White, Warm Sepia, and OLED Dark themes, serif typography & column width toggles.
            </p>
          </div>

          {/* Card 2: Narration & Soundscapes */}
          <div className="p-6 rounded-3xl bg-white border border-cozy-border shadow-cozy hover:shadow-cozy-hover transition-all duration-300 space-y-4 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-xl font-bold">
              🔊
            </div>
            <h3 className="font-playful text-xl font-bold text-cozy-text">Voice Narration & Audio</h3>
            <p className="text-sm text-cozy-muted leading-relaxed">
              Real-time speech narration with speed controls (1x, 1.25x, 1.5x) and curated ambient soundscapes (Rain, Fireplace, White Noise).
            </p>
          </div>

          {/* Card 3: Instant Dictionary & Definitions */}
          <div className="p-6 rounded-3xl bg-white border border-cozy-border shadow-cozy hover:shadow-cozy-hover transition-all duration-300 space-y-4 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-butter-100 text-amber-700 flex items-center justify-center text-xl font-bold">
              💡
            </div>
            <h3 className="font-playful text-xl font-bold text-cozy-text">Instant Dictionary</h3>
            <p className="text-sm text-cozy-muted leading-relaxed">
              Tap or select any word to get instant contextual definitions, etymology, and note highlights.
            </p>
          </div>

          {/* Card 4: Comprehension & Badges */}
          <div className="p-6 rounded-3xl bg-white border border-cozy-border shadow-cozy hover:shadow-cozy-hover transition-all duration-300 space-y-4 hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-600 flex items-center justify-center text-xl font-bold">
              🏆
            </div>
            <h3 className="font-playful text-xl font-bold text-cozy-text">Badges & Quizzes</h3>
            <p className="text-sm text-cozy-muted leading-relaxed">
              Unlock reading achievement badges and test your understanding with interactive end-of-story comprehension quizzes.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Storybooks Carousel Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-playful text-3xl font-bold text-cozy-text">Explore Popular Stories</h2>
            <p className="text-sm text-cozy-muted">Handcrafted stories for readers of all ages</p>
          </div>
          <button
            onClick={() => setActiveTab('library')}
            className="text-peach-600 font-bold text-sm hover:underline flex items-center gap-1"
          >
            View All Library ({STORIES.length}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STORIES.map(book => (
            <div
              key={book.id}
              onClick={() => openBookInReader(book)}
              className="bg-white rounded-3xl overflow-hidden border border-cozy-border shadow-cozy hover:shadow-cozy-hover transition-all duration-300 cursor-pointer group hover:-translate-y-1 flex flex-col"
            >
              {/* Sleek Editorial Book Header Cover */}
              <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white min-h-[140px] flex flex-col justify-between border-b border-slate-700/50">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-amber-200 text-[11px] font-semibold">
                    {book.readingLevel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-peach-500/90 text-white text-[11px] font-semibold">
                    {book.genre}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-white group-hover:text-peach-300 transition-colors line-clamp-1 leading-snug pt-3">
                  {book.title}
                </h3>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <p className="text-xs text-slate-500 font-medium">By {book.author}</p>
                  <p className="text-xs text-cozy-muted line-clamp-2 mt-1">
                    {book.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-cozy-border/60 text-xs font-medium text-cozy-muted">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-peach-500" /> {book.estimatedMinutes} min</span>
                  <span className="text-peach-600 font-bold group-hover:translate-x-1 transition-transform">Read Story →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
