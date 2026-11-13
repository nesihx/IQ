import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { IQQuestion, PsychometricResult } from '../types/iq';
import { OptionGlyphRenderer, StimulusRenderer } from './StimulusRenderer';
import { LeaderboardTable } from './LeaderboardTable';

interface ResultsViewProps {
  result: PsychometricResult;
  questions: IQQuestion[];
  history: PsychometricResult[];
  onOpenHistoryResult: (result: PsychometricResult) => void;
  onClearHistory: () => void;
  onRetake: () => void;
  onBackHome: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

export function ResultsView({
  result,
  questions,
  history,
  onOpenHistoryResult,
  onClearHistory,
  onRetake,
  onBackHome,
}: ResultsViewProps) {
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const questionMap = new Map(questions.map((q) => [q.id, q]));

  const filteredDiagnostics = result.diagnostics.filter((d) => {
    if (reviewFilter === 'correct') return d.isCorrect;
    if (reviewFilter === 'incorrect') return !d.isCorrect;
    return true;
  });

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m} dk ${s} sn` : `${s} sn`;
  };

  return (
    <main className="max-w-[960px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* 1. Simple IQ Score Summary */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-mono text-slate-500">
              {result.participantName}
            </div>
            <div className="flex items-baseline gap-3 mt-1.5">
              <span className="font-mono text-5xl sm:text-6xl font-bold text-blue-700 tabular-nums">
                {result.iq}
              </span>
              <span className="text-sm font-mono font-semibold text-slate-500">
                IQ SKORU
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">
                {result.classification}
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="font-mono text-xs sm:text-sm tabular-nums">
                {result.correctCount} / {result.totalCount} Doğru
              </span>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="font-mono text-xs sm:text-sm tabular-nums">
                {formatDuration(result.totalTimeSec)}
              </span>
            </div>
          </div>

          <div className="no-print flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Testi Tekrarla</span>
            </button>
            <button
              type="button"
              onClick={onBackHome}
              className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              Ana Sayfa
            </button>
          </div>
        </div>
      </section>

      {/* 2. Leaderboard */}
      <LeaderboardTable
        userHistory={history}
        currentResultId={result.id}
        onOpenResult={onOpenHistoryResult}
        onClearHistory={onClearHistory}
      />

      {/* 3. Question Answer Key */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
            Soru Çözüm Anahtarı
          </h2>

          <div
            role="group"
            aria-label="Soru filtresi"
            className="no-print inline-flex p-1 bg-slate-100 border border-slate-200 rounded-lg self-start"
          >
            <button
              type="button"
              onClick={() => setReviewFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                reviewFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü ({result.diagnostics.length})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('correct')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                reviewFilter === 'correct'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Doğru ({result.correctCount})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('incorrect')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                reviewFilter === 'incorrect'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yanlış ({result.totalCount - result.correctCount})
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-200 mt-1">
          {filteredDiagnostics.map((diag, idx) => {
            const q = questionMap.get(diag.questionId);
            if (!q) return null;
            const isExpanded = expandedItemId === q.id;
            const userLetter =
              diag.selectedIndex !== null
                ? OPTION_LETTERS[diag.selectedIndex]
                : 'Boş';
            const correctLetter = OPTION_LETTERS[diag.correctIndex];

            return (
              <div key={q.id} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setExpandedItemId(isExpanded ? null : q.id)}
                  aria-expanded={isExpanded}
                  className="w-full flex flex-wrap items-center justify-between gap-3 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700 rounded p-1"
                >
                  <div className="flex items-center gap-3">
                    {diag.isCorrect ? (
                      <CheckCircle2
                        className="w-5 h-5 text-emerald-600 shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <XCircle
                        className="w-5 h-5 text-rose-600 shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-sm font-semibold text-slate-900">
                      {String(diag.order || idx + 1).padStart(2, '0')}. {q.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span
                      className={
                        diag.isCorrect
                          ? 'text-emerald-700 font-semibold'
                          : 'text-rose-700 font-semibold'
                      }
                    >
                      {diag.isCorrect
                        ? `Doğru (${correctLetter})`
                        : `Yanıt: ${userLetter} · Doğru: ${correctLetter}`}
                    </span>
                    <span className="text-blue-700 font-medium">
                      {isExpanded ? 'Gizle' : 'Çözüm'}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                    <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <StimulusRenderer stimulus={q.stimulus} />
                    </div>
                    <div className="lg:col-span-6 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="border border-slate-200 rounded-lg p-3 bg-white">
                          <div className="text-xs font-mono text-slate-500 mb-2">
                            Yanıtınız ({userLetter})
                          </div>
                          {diag.selectedIndex !== null ? (
                            <OptionGlyphRenderer
                              option={q.options[diag.selectedIndex]}
                            />
                          ) : (
                            <div className="h-16 flex items-center justify-center text-xs font-mono text-slate-400">
                              Boş
                            </div>
                          )}
                        </div>
                        <div className="border border-emerald-300 rounded-lg p-3 bg-emerald-50/30">
                          <div className="text-xs font-mono text-emerald-700 font-semibold mb-2">
                            Doğru Yanıt ({correctLetter})
                          </div>
                          <OptionGlyphRenderer
                            option={q.options[diag.correctIndex]}
                          />
                        </div>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
