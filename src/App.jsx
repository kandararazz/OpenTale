import React from 'react';
import { ReadingProvider, useReading } from './context/ReadingContext';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { LibraryDashboard } from './components/LibraryDashboard';
import { ReaderView } from './components/ReaderView';
import { VocabVault } from './components/VocabVault';
import { AchievementsView } from './components/AchievementsView';
import { AuthorStudioView } from './components/AuthorStudioView';
import { VocabTooltipModal } from './components/VocabTooltipModal';
import { ComprehensionQuizModal } from './components/ComprehensionQuizModal';
import { RSVPSpeedReaderModal } from './components/RSVPSpeedReaderModal';
import { DoubleTapLookupModal } from './components/DoubleTapLookupModal';
import { SocialMarginaliaDrawer } from './components/SocialMarginaliaDrawer';
import { LibraryImportModal } from './components/LibraryImportModal';
import { AICatchUpModal } from './components/AICatchUpModal';
import { InBookSearchModal } from './components/InBookSearchModal';
import { TableOfContentsDrawer } from './components/TableOfContentsDrawer';
import { ShelfModal } from './components/ShelfModal';
import { TagModal } from './components/TagModal';
import { BookShelvesTagsModal } from './components/BookShelvesTagsModal';
import { CoverGeneratorModal } from './components/CoverGeneratorModal';
import { CommunityPublishModal } from './components/CommunityPublishModal';
import { ExportModal } from './components/ExportModal';
import { OpenTaleAppIcon } from './components/OpenTaleLogo';
import { Heart, Shield } from 'lucide-react';

const MainAppContent = () => {
  const { 
    activeTab, 
    celebrationToast, 
    isRSVPOpen,
    setIsRSVPOpen,
    currentBook,
    activePageIndex,
    doubleTapWord,
    setDoubleTapWord,
    isMarginaliaOpen,
    setIsMarginaliaOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    isAICatchUpOpen,
    setIsAICatchUpOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isTocOpen,
    setIsTocOpen
  } = useReading();

  const currentPage = currentBook?.pages[activePageIndex];

  return (
    <div className="min-h-screen flex flex-col justify-between">
      
      {/* Top Header Navbar */}
      <Navbar />

      {/* Celebration / Action Toast Notification */}
      {celebrationToast && (
        <div className="fixed top-24 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-peach-400/40 flex items-center gap-3 animate-confetti-bounce">
          <span className="text-2xl">{celebrationToast.icon || '✨'}</span>
          <p className="text-xs sm:text-sm font-bold">{celebrationToast.message}</p>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'landing' && <HeroLanding />}
        {activeTab === 'library' && <LibraryDashboard />}
        {activeTab === 'reader' && <ReaderView />}
        {activeTab === 'vocab' && <VocabVault />}
        {activeTab === 'badges' && <AchievementsView />}
        {activeTab === 'author' && <AuthorStudioView />}
      </main>

      {/* Global Interactive Modals & Drawers */}
      <VocabTooltipModal />
      <ComprehensionQuizModal />
      
      <RSVPSpeedReaderModal 
        text={currentPage?.text || ''} 
        isOpen={isRSVPOpen} 
        onClose={() => setIsRSVPOpen(false)} 
      />

      <DoubleTapLookupModal
        word={doubleTapWord}
        isOpen={!!doubleTapWord}
        onClose={() => setDoubleTapWord(null)}
      />

      <SocialMarginaliaDrawer
        isOpen={isMarginaliaOpen}
        onClose={() => setIsMarginaliaOpen(false)}
        paragraphTitle={currentPage?.title}
      />

      <LibraryImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <AICatchUpModal
        bookTitle={currentBook?.title}
        pageIndex={activePageIndex}
        isOpen={isAICatchUpOpen}
        onClose={() => setIsAICatchUpOpen(false)}
      />

      <InBookSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      <TableOfContentsDrawer
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
      />

      {/* New Custom Shelves & Tags, Cover, Community & Export Modals */}
      <ShelfModal />
      <TagModal />
      <BookShelvesTagsModal />
      <CoverGeneratorModal />
      <CommunityPublishModal />
      <ExportModal />

      {/* Footer */}
      <footer className="bg-white border-t border-cozy-border py-8 mt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <OpenTaleAppIcon className="w-10 h-10" />
            <div>
              <span className="font-sans text-xl font-extrabold text-slate-800">OpenTale</span>
              <p className="text-xs text-cozy-muted font-medium">
                Created by <strong className="text-peach-600 font-bold">Raza</strong> • Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500 mx-0.5" /> for passionate readers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-cozy-muted">
            <span className="flex items-center gap-1 text-sage-600 font-bold">
              <Shield className="w-3.5 h-3.5" /> 100% Distraction-Free & Ad-Free
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <ReadingProvider>
      <MainAppContent />
    </ReadingProvider>
  );
}
