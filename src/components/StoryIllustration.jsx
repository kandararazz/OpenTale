import React from 'react';

export const StoryIllustration = ({ type, variant = 'cover', className = '' }) => {
  if (type === 'woods' || type === 'forest-night' || type === 'glowing-mushrooms' || type === 'river-sparkle' || type === 'festival-celebration') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-teal-900 via-emerald-800 to-slate-950 flex items-center justify-center ${className}`}>
        {/* Glowing Moon */}
        <div className="absolute top-6 right-8 w-20 h-20 bg-amber-100 rounded-full shadow-[0_0_50px_rgba(253,238,220,0.6)] opacity-90 animate-pulse-subtle">
          <div className="absolute top-2 left-3 w-4 h-4 bg-amber-200/40 rounded-full"></div>
        </div>

        {/* Floating Magic Stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="absolute top-8 left-10 text-amber-200 text-lg animate-float">✨</span>
          <span className="absolute top-16 left-1/3 text-amber-300 text-sm animate-float-slow">🌟</span>
          <span className="absolute top-12 right-1/4 text-emerald-200 text-xl animate-float">✨</span>
          <span className="absolute bottom-20 left-12 text-teal-200 text-base animate-float-slow">💫</span>
        </div>

        {/* Tree Silhouettes */}
        <svg className="absolute bottom-0 w-full h-3/5 text-emerald-950/80" viewBox="0 0 400 200" fill="currentColor">
          <path d="M0,200 L0,120 L40,80 L80,120 L120,60 L160,110 L200,50 L240,100 L280,70 L320,120 L360,90 L400,130 L400,200 Z" />
        </svg>

        {/* Glowing Mushrooms & Lantern Scene */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
          <div className="relative">
            <div className="text-7xl mb-2 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)] transform hover:scale-110 transition-transform duration-300">
              🐿️
            </div>
            <div className="absolute -bottom-1 -right-3 text-3xl animate-bounce">
              🏮
            </div>
          </div>
          {variant === 'cover' && (
            <div className="mt-4 px-4 py-1.5 bg-emerald-900/80 backdrop-blur-md rounded-full border border-emerald-400/30 text-amber-200 font-playful text-sm tracking-wide shadow-lg">
              ✨ Starling Hollow Woods
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === 'space' || type === 'rocket-launch' || type === 'zero-gravity' || type === 'asteroid-field' || type === 'cozy-bedroom-landing') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-950 flex items-center justify-center ${className}`}>
        {/* Cosmic Nebula Swirls */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>

        {/* Constellations */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-6 left-12 text-purple-200 text-lg animate-float">⭐</span>
          <span className="absolute top-20 right-10 text-pink-200 text-xl animate-float-slow">🪐</span>
          <span className="absolute bottom-16 left-8 text-amber-200 text-base animate-float">✨</span>
          <span className="absolute top-1/3 left-1/4 text-indigo-200 text-sm">🌌</span>
        </div>

        {/* Rocket Scene */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
          <div className="text-8xl mb-2 transform -rotate-12 filter drop-shadow-[0_15px_25px_rgba(168,136,224,0.4)] animate-float">
            🚀
          </div>
          {variant === 'cover' && (
            <div className="mt-2 px-4 py-1.5 bg-purple-950/80 backdrop-blur-md rounded-full border border-purple-400/30 text-purple-200 font-playful text-sm tracking-wide shadow-lg">
              🌌 Sector 4 Galaxy
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === 'kitchen-dragon' || type === 'dragon-kitchen' || type === 'sad-king' || type === 'flipping-pancakes' || type === 'pancake-feast') {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-amber-500 via-orange-400 to-rose-500 flex items-center justify-center ${className}`}>
        {/* Warm Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          <span className="absolute top-8 left-8 text-amber-100 text-xl animate-float">✨</span>
          <span className="absolute top-12 right-12 text-butter-200 text-2xl animate-float-slow">🥞</span>
          <span className="absolute bottom-12 left-10 text-orange-100 text-lg animate-float">🍯</span>
        </div>

        {/* Kitchen Steam & Flames */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-rose-950/60 to-transparent"></div>

        {/* Dragon & Pancakes */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-7xl filter drop-shadow-md animate-float">🐉</span>
            <span className="text-5xl filter drop-shadow-md animate-bounce">🥞</span>
          </div>
          {variant === 'cover' && (
            <div className="mt-2 px-4 py-1.5 bg-orange-950/60 backdrop-blur-md rounded-full border border-butter-300/40 text-butter-100 font-playful text-sm tracking-wide shadow-lg">
              👨‍🍳 Chef Puff's Kitchen
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default Clockwork / Mystery Illustration
  return (
    <div className={`relative w-full h-full overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 flex items-center justify-center ${className}`}>
      {/* Gears & Time Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <span className="absolute top-6 left-6 text-sky-200 text-3xl animate-spin" style={{ animationDuration: '20s' }}>⚙️</span>
        <span className="absolute bottom-8 right-8 text-indigo-300 text-4xl animate-spin" style={{ animationDuration: '30s' }}>⚙️</span>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-7xl filter drop-shadow-lg animate-float">🐱</span>
          <span className="text-4xl animate-pulse">⏳</span>
        </div>
        {variant === 'cover' && (
          <div className="mt-2 px-4 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-full border border-sky-400/30 text-sky-200 font-playful text-sm tracking-wide shadow-lg">
            ⚙️ Chronometer Mystery
          </div>
        )}
      </div>
    </div>
  );
};
