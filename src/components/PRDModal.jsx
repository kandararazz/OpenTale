import React, { useState } from 'react';
import { useReading } from '../context/ReadingContext';
import { X, FileText, Users, Flame, Shield, CreditCard, Sparkles, Check } from 'lucide-react';

export const PRDModal = () => {
  const { isPRDModalOpen, setIsPRDModalOpen } = useReading();
  const [activeTab, setActiveTab] = useState('overview');

  if (!isPRDModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-confetti-bounce">
      <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-peach-500 flex items-center justify-center text-white font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-playful text-xl font-bold">OpenTale — Product Requirements Document (PRD)</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                  v2.4 Approved
                </span>
              </div>
              <p className="text-xs text-slate-400">Senior Product Manager Specification (EdTech Platform, Ages 6–12)</p>
            </div>
          </div>

          <button
            onClick={() => setIsPRDModalOpen(false)}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRD Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-100 border-b border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setActiveTab('personas')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'personas' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            User Personas
          </button>
          <button
            onClick={() => setActiveTab('engagement')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'engagement' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Engagement Loops
          </button>
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'accessibility' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Accessibility Specs
          </button>
          <button
            onClick={() => setActiveTab('monetization')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'monetization' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Monetization Model
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm leading-relaxed">
          
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="font-playful text-xl font-bold text-slate-900">1. Executive Summary & Vision</h3>
              <p>
                <strong>OpenTale</strong> is an interactive digital children's storybook platform designed to make reading engaging, accessible, and habitual for young learners aged 6–12. By marrying warm pastel aesthetics, interactive 3D flip-book interfaces, Web Speech narration, and gamified streak rewards, OpenTale targets a 40% increase in weekly reading volume for reluctant readers.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-peach-50 border border-peach-200">
                  <h4 className="font-bold text-peach-700">Target Audience</h4>
                  <p className="text-xs text-slate-600 mt-1">Children 6–12, Parents, and Elementary Educators.</p>
                </div>
                <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200">
                  <h4 className="font-bold text-sage-700">Core Value Prop</h4>
                  <p className="text-xs text-slate-600 mt-1">Zero-distraction interactive reader with audio & dyslexic support.</p>
                </div>
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                  <h4 className="font-bold text-sky-700">Key Metric</h4>
                  <p className="text-xs text-slate-600 mt-1">7-day active reading retention & Vocab Vault growth.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personas' && (
            <div className="space-y-4">
              <h3 className="font-playful text-xl font-bold text-slate-900">2. Core User Personas</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎒</span>
                    <h4 className="font-bold text-slate-900">Persona A: Early Reader Leo (Age 7)</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Needs:</strong> Audio assistance, phonetics for unfamiliar words, immediate visual encouragement, short 5-minute story sessions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚀</span>
                    <h4 className="font-bold text-slate-900">Persona B: Independent Explorer Maya (Age 10)</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Needs:</strong> Genre variety (Sci-Fi/Mystery), streak rewards, customizable reading themes (Dark/Sepia), and quiz badges.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏡</span>
                    <h4 className="font-bold text-slate-900">Persona C: Parent Buyer Sarah</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Needs:</strong> Ad-free COPPA compliant environment, dyslexic-friendly font options, weekly reading progress reports.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'engagement' && (
            <div className="space-y-4">
              <h3 className="font-playful text-xl font-bold text-slate-900">3. Key Engagement Loops</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h4 className="font-bold text-slate-900">Streak Mechanics</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Daily reading goal triggers a flame streak counter. Missing 1 day triggers a "Streak Freeze" grace period to preserve momentum.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <h4 className="font-bold text-slate-900">Vocab Vault Mini-Games</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Saved tricky words populate interactive flashcard challenges and end-of-story quizzes to earn reader XP.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-4">
              <h3 className="font-playful text-xl font-bold text-slate-900">4. Accessibility & Neurodiversity Features</h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <strong>Dyslexic-Friendly Typography:</strong> One-click toggle for Lexend & OpenDyslexic heavy-bottom fonts with increased letter spacing.
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <strong>Web Speech Narration:</strong> Native browser text-to-speech with speed controls (0.8x - 1.2x) for auditory learners.
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <strong>Visual Comfort Modes:</strong> Sepia warmth mode to reduce screen eye strain during night bedtime reading.
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'monetization' && (
            <div className="space-y-4">
              <h3 className="font-playful text-xl font-bold text-slate-900">5. High-Level Monetization Strategy</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-xs">Freemium Tier</span>
                  <h4 className="font-bold text-slate-900 text-base">Free Starter Pass</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• Access to 5 starter storybooks</li>
                    <li>• Basic Web Speech audio narration</li>
                    <li>• Up to 10 saved Vocab Vault words</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl border-2 border-peach-400 bg-peach-50 space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-peach-500 text-white font-bold text-xs">Family Subscription</span>
                  <h4 className="font-bold text-peach-900 text-base">$7.99 / month</h4>
                  <ul className="text-xs text-peach-900 space-y-1">
                    <li>• Unlimited access to 100+ storybooks</li>
                    <li>• Multi-child profile tracking (up to 4 children)</li>
                    <li>• Offline reading mode & printable activity packs</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsPRDModalOpen(false)}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition-colors"
          >
            Close Document
          </button>
        </div>

      </div>
    </div>
  );
};
