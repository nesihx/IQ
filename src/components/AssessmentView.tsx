import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Clock, X } from 'lucide-react';
import { IQQuestion, UserResponse } from '../types/iq';
import { OptionGlyphRenderer, StimulusRenderer } from './StimulusRenderer';

interface AssessmentViewProps {
  participantName: string;
  questions: IQQuestion[];
  onComplete: (responses: UserResponse[]) => void;
  onCancel: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export function AssessmentView({
  participantName,
  questions,
  onComplete,
  onCancel,
}: AssessmentViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [totalElapsedSec, setTotalElapsedSec] = useState(0);
  const [confirmExit, setConfirmExit] = useState(false);

  const itemEnteredAtRef = useRef<number>(Date.now());
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const commitItemTime = (qId: string) => {
    const now = Date.now();
    const delta = Math.max(0, now - itemEnteredAtRef.current);
    itemEnteredAtRef.current = now;
    setTimeSpent((prev) => ({
      ...prev,
      [qId]: (prev[qId] ?? 0) + delta,
    }));
    return delta;
  };

  const goToIndex = (nextIdx: number) => {
    if (nextIdx < 0 || nextIdx >= questions.length || nextIdx === currentIndex) {
      return;
    }
    commitItemTime(currentQuestion.id);
    setCurrentIndex(nextIdx);
  };

  const handleSelectOption = (optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIdx,
    }));
  };

  const handleNextOrFinish = () => {
    if (currentIndex < questions.length - 1) {
      goToIndex(currentIndex + 1);
      return;
    }

    const now = Date.now();
    const lastDelta = Math.max(0, now - itemEnteredAtRef.current);
    const finalResponses: UserResponse[] = questions.map((q) => {
      const baseTime = timeSpent[q.id] ?? 0;
      const totalForItem = q.id === currentQuestion.id ? baseTime + lastDelta : baseTime;
      return {
        questionId: q.id,
        selectedIndex: answers[q.id] ?? null,
        timeSpentMs: totalForItem,
      };
    });
    onComplete(finalResponses);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (confirmExit) return;
      if (e.key >= '1' && e.key <= '6') {
        const idx = Number(e.key) - 1;
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: idx,
        }));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleNextOrFinish();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const remainingCount = questions.length - (currentIndex + 1);
  const progressPct = ((currentIndex + 1) / questions.length) * 100;
  const selectedOption = answers[currentQuestion.id] ?? null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Compact Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-6 h-12 sm:h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs font-mono min-w-0">
            <span className="font-display text-base font-bold text-slate-900 shrink-0">
              Kognitiva
            </span>
            <span className="text-slate-300" aria-hidden="true">
              /
            </span>
            <span className="text-slate-700 font-semibold tabular-nums whitespace-nowrap">
              Soru {currentIndex + 1} / {questions.length}
            </span>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <span className="hidden md:inline text-xs font-medium text-slate-600 truncate max-w-[160px]">
              {participantName}
            </span>
            <div
              className="flex items-center gap-1 font-mono text-xs text-slate-700 tabular-nums"
              aria-label="Geçen toplam süre"
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>{formatTime(totalElapsedSec)}</span>
            </div>

            {!confirmExit ? (
              <button
                type="button"
                onClick={() => setConfirmExit(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Çık</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded cursor-pointer whitespace-nowrap"
                >
                  Onayla
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmExit(false)}
                  className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded cursor-pointer whitespace-nowrap"
                >
                  İptal
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="h-1 bg-slate-100 w-full">
          <div
            className="h-full bg-blue-700 transition-transform duration-200 origin-left"
            style={{ transform: `scaleX(${progressPct / 100})` }}
          />
        </div>
      </header>

      {/* Main Assessment Stage: Question + Options simultaneously visible on mobile & desktop */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-3 sm:px-6 py-2.5 sm:py-6 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-stretch">
          {/* Question & Visual Stimulus */}
          <section
            aria-label="Soru uyaran alanı"
            className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-3.5 sm:p-6 flex flex-col justify-between gap-2.5 sm:gap-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs font-mono">
                <span className="font-semibold text-blue-700 tabular-nums">
                  Soru {currentIndex + 1} / {questions.length}
                </span>
                <span className="text-slate-500 tabular-nums">
                  {remainingCount > 0 ? `${remainingCount} soru kaldı` : 'Son soru'}
                </span>
              </div>
              <h1 className="font-display text-base sm:text-2xl font-bold text-slate-900 mt-1 sm:mt-2 leading-tight">
                {currentQuestion.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug sm:leading-relaxed mt-1 sm:mt-1.5">
                {currentQuestion.prompt}
              </p>
            </div>

            <div className="bg-slate-50/80 lab-grid-bg border border-slate-200 rounded-xl p-2.5 sm:p-5 flex items-center justify-center min-h-[165px] sm:min-h-[260px]">
              <StimulusRenderer stimulus={currentQuestion.stimulus} />
            </div>
          </section>

          {/* 6 Options + Controls */}
          <section
            aria-label="Yanıt seçenekleri"
            className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-3.5 sm:p-6 flex flex-col justify-between gap-3"
          >
            <div className="flex-1 flex flex-col justify-center">
              <div className="hidden sm:flex items-center justify-between text-xs text-slate-500 mb-3.5">
                <span className="font-medium text-slate-700">
                  Doğru Seçeneği İşaretleyin
                </span>
                <span className="font-mono">Kısayol: 1–6 tuşları</span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const letter = OPTION_LETTERS[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      aria-pressed={isSelected}
                      aria-label={`Seçenek ${letter}`}
                      className={`group relative rounded-lg sm:rounded-xl border p-2 sm:p-3.5 flex flex-col items-center justify-center transition-colors cursor-pointer min-h-[78px] sm:min-h-[124px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-700 ring-1 ring-blue-700'
                          : 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50/60'
                      }`}
                    >
                      <span
                        className={`absolute top-1.5 left-2 sm:top-2.5 sm:left-2.5 font-mono text-[11px] sm:text-xs font-semibold ${
                          isSelected ? 'text-blue-700' : 'text-slate-400'
                        }`}
                      >
                        {letter}
                      </span>
                      {isSelected && (
                        <Check
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700 absolute top-1.5 right-2 sm:top-2.5 sm:right-2.5"
                          aria-hidden="true"
                        />
                      )}
                      <div className="mt-2 sm:mt-2 w-full">
                        <OptionGlyphRenderer option={option} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Controls */}
            <div className="pt-2.5 sm:pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => goToIndex(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="inline-flex items-center justify-center gap-1 px-3 sm:px-4 h-10 sm:h-11 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Önceki</span>
              </button>

              <div className="flex items-center gap-2">
                {currentIndex < questions.length - 1 && selectedOption === null && (
                  <button
                    type="button"
                    onClick={() => goToIndex(currentIndex + 1)}
                    className="px-3 sm:px-4 h-10 sm:h-11 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors whitespace-nowrap shrink-0"
                  >
                    Geç
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNextOrFinish}
                  className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 h-10 sm:h-11 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <span>
                    {currentIndex === questions.length - 1
                      ? 'Testi Bitir'
                      : 'Sonraki'}
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
