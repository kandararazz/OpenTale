import React, { useState } from 'react';
import { useReading } from '../context/ReadingContext';
import { CheckCircle, XCircle, Trophy, ArrowRight, X, Sparkles } from 'lucide-react';

export const ComprehensionQuizModal = () => {
  const { activeQuizModalBook, setActiveQuizModalBook, unlockBadge, triggerConfetti } = useReading();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!activeQuizModalBook || !activeQuizModalBook.quiz) return null;

  const questions = activeQuizModalBook.quiz;
  const currentQuestion = questions[currentQuestionIdx];

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOptionIdx(index);
    setIsAnswered(true);

    if (index === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      if (score + (selectedOptionIdx === currentQuestion.correctIndex ? 0 : 0) === questions.length) {
        unlockBadge('quiz-whiz');
      }
      triggerConfetti();
    }
  };

  const closeModal = () => {
    setActiveQuizModalBook(null);
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-confetti-bounce">
      <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-2xl p-6 sm:p-8 max-w-lg w-full relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-cozy-bg text-cozy-muted hover:text-cozy-text transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!quizFinished ? (
          <>
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                Story Comprehension Quiz
              </div>
              <h3 className="font-playful text-2xl font-bold text-cozy-text">
                {activeQuizModalBook.title}
              </h3>
              <p className="text-xs text-cozy-muted font-semibold">
                Question {currentQuestionIdx + 1} of {questions.length}
              </p>
            </div>

            {/* Question Text */}
            <div className="p-4 rounded-2xl bg-cozy-bg border border-cozy-border font-playful text-lg font-bold text-cozy-text">
              {currentQuestion.question}
            </div>

            {/* Options Grid */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let btnStyle = "bg-white border-cozy-border text-cozy-text hover:border-peach-400";
                if (isAnswered) {
                  if (idx === currentQuestion.correctIndex) {
                    btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-900 font-bold";
                  } else if (idx === selectedOptionIdx) {
                    btnStyle = "bg-rose-100 border-rose-400 text-rose-900 font-bold";
                  } else {
                    btnStyle = "bg-cozy-bg opacity-50 border-cozy-border";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-medium text-sm transition-all flex items-center justify-between shadow-sm ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && idx === currentQuestion.correctIndex && (
                      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                    {isAnswered && idx === selectedOptionIdx && idx !== currentQuestion.correctIndex && (
                      <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box on answer */}
            {isAnswered && (
              <div className="p-4 rounded-2xl bg-butter-50 border border-butter-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold text-amber-800 uppercase tracking-wider block">Explanation:</span>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNextQuestion}
                className="w-full py-3.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-playful font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {currentQuestionIdx < questions.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </>
        ) : (
          /* Quiz Results View */
          <div className="text-center py-4 space-y-6">
            <div className="text-6xl animate-bounce">
              {score === questions.length ? '🌟' : '🎉'}
            </div>
            <div className="space-y-2">
              <h3 className="font-playful text-3xl font-extrabold text-cozy-text">
                {score === questions.length ? 'Perfect Score!' : 'Great Reading Job!'}
              </h3>
              <p className="text-sm font-semibold text-cozy-muted">
                You answered <span className="text-peach-600 font-bold">{score} out of {questions.length}</span> questions correctly!
              </p>
            </div>

            {score === questions.length && (
              <div className="p-4 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Badge Unlocked: Quiz Champion 🏆
              </div>
            )}

            <button
              onClick={closeModal}
              className="w-full py-3.5 rounded-2xl bg-peach-500 hover:bg-peach-600 text-white font-playful font-bold text-sm shadow-md transition-colors"
            >
              Back to OpenTale Library
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
