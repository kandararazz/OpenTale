import React from 'react';
import logoIconImg from '../assets/logo-icon.png';
import logoFullImg from '../assets/opentale-logo.png';

export const OpenTaleLogoIcon = ({ className = "w-12 h-12", useImage = true, showGlow = true }) => {
  if (useImage) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {showGlow && (
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-300/40 via-emerald-200/30 to-amber-300/40 rounded-2xl blur-md transform scale-110 pointer-events-none"></div>
        )}
        <img 
          src={logoIconImg} 
          alt="OpenTale Logo" 
          className="w-full h-full object-contain relative z-10 filter drop-shadow-sm scale-110 transition-transform duration-300" 
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Background Soft Glow */}
      {showGlow && (
        <div className="absolute inset-0 bg-gradient-to-r from-teal-300/40 via-emerald-200/30 to-amber-300/40 rounded-2xl blur-md transform scale-110 pointer-events-none"></div>
      )}

      {/* Main Vector SVG Logo */}
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full relative z-10 filter drop-shadow-sm" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="openTaleTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4BBBB0" />
            <stop offset="100%" stopColor="#77D3BF" />
          </linearGradient>

          <linearGradient id="openTaleOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3AD54" />
            <stop offset="100%" stopColor="#F6BF76" />
          </linearGradient>

          <linearGradient id="openTaleArrowGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#6BBF9B" />
            <stop offset="100%" stopColor="#EBB35D" />
          </linearGradient>
        </defs>

        <path
          d="M 46 76 C 34 72 20 62 20 38 C 32 43 42 46 46 48 M 46 76 L 46 48 M 46 76 C 34 72 20 62 20 38 L 20 34 C 20 34 32 38 46 43"
          stroke="url(#openTaleTealGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 26 40 C 34 43 41 45 46 47 L 46 70 C 41 68 34 65 26 62 Z"
          stroke="url(#openTaleTealGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 54 76 C 66 72 80 62 80 38 C 68 43 58 46 54 48 M 54 76 L 54 48 M 54 76 C 66 72 80 62 80 38 L 80 34 C 80 34 68 38 54 43"
          stroke="url(#openTaleOrangeGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 74 40 C 66 43 59 45 54 47 L 54 70 C 59 68 66 65 74 62 Z"
          stroke="url(#openTaleOrangeGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M 50 82 L 50 28 M 38 40 L 50 28 L 62 40"
          stroke="url(#openTaleArrowGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const OpenTaleAppIcon = ({ className = "w-14 h-14", useImage = true }) => {
  return (
    <div className={`rounded-2xl bg-white p-0 flex items-center justify-center overflow-hidden transition-all ${className}`}>
      <OpenTaleLogoIcon className="w-full h-full" useImage={useImage} showGlow={false} />
    </div>
  );
};

export const OpenTaleFullLogo = ({ className = "h-14" }) => {
  return (
    <img 
      src={logoFullImg} 
      alt="OpenTale" 
      className={`object-contain ${className}`}
    />
  );
};
