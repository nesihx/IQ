import React, { useMemo, useState } from 'react';
import { Trophy, Trash2 } from 'lucide-react';
import { LeaderboardEntry, PsychometricResult } from '../types/iq';
import { BENCHMARK_LEADERBOARD } from '../engine/psychometrics';

interface LeaderboardTableProps {
  userHistory: PsychometricResult[];
  currentResultId?: string;
  onOpenResult?: (result: PsychometricResult) => void;
  onClearHistory?: () => void;
}

export function LeaderboardTable({
  userHistory,
  currentResultId,
  onOpenResult,
  onClearHistory,
}: LeaderboardTableProps) {
  const [filter, setFilter] = useState<'all' | 'mine'>('all');

  const entries = useMemo<LeaderboardEntry[]>(() => {
    const userEntries: LeaderboardEntry[] = userHistory.map((r) => ({
      id: r.id,
      name: r.participantName,
      iq: r.iq,
      percentile: r.percentile,
      correctCount: r.correctCount,
      totalCount: r.totalCount,
      totalTimeSec: r.totalTimeSec,
      mode: r.mode,
      completedAt: r.completedAt,
      isBenchmark: false,
      result: r,
    }));

    const combined =
      filter === 'mine'
        ? userEntries
        : [...userEntries, ...BENCHMARK_LEADERBOARD];

    return combined.sort((a, b) => {
      if (b.iq !== a.iq) return b.iq - a.iq;
      return a.totalTimeSec - b.totalTimeSec;
    });
  }, [userHistory, filter]);

  const currentRank = useMemo(() => {
    if (!currentResultId) return null;
    const idx = entries.findIndex((e) => e.id === currentResultId);
    return idx >= 0 ? idx + 1 : null;
  }, [entries, currentResultId]);

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m} dk ${s} sn` : `${s} sn`;
  };

  return (
    <section
      id="liderlik-tablosu"
      className="bg-white border border-slate-200 rounded-xl overflow-hidden"
    >
      <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-blue-700" aria-hidden="true" />
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
              Liderlik Tablosu
            </h2>
          </div>
          {currentRank !== null && (
            <p className="text-xs text-slate-500 mt-1">
              Sıranız: {entries.length} katılımcı içinde {currentRank}.
            </p>
          )}
        </div>

        <div className="no-print flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Liderlik tablosu filtresi"
            className="inline-flex p-1 bg-slate-100 border border-slate-200 rounded-lg"
          >
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü
            </button>
            <button
              type="button"
              onClick={() => setFilter('mine')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap ${
                filter === 'mine'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Katılımlar ({userHistory.length})
            </button>
          </div>

          {userHistory.length > 0 && onClearHistory && (
            <button
              type="button"
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-lg bg-white transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Temizle</span>
            </button>
          )}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">
          Henüz kayıtlı bir test sonucu bulunmuyor.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-mono text-slate-500">
                <th className="py-3 px-4 sm:px-5 font-medium">Sıra</th>
                <th className="py-3 px-4 font-medium">Katılımcı</th>
                <th className="py-3 px-4 font-medium">IQ Skoru</th>
                <th className="py-3 px-4 font-medium">Doğru</th>
                <th className="py-3 px-4 font-medium">Süre</th>
                <th className="py-3 px-4 sm:px-5 font-medium text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry, idx) => {
                const isCurrent = entry.id === currentResultId;
                return (
                  <tr
                    key={entry.id}
                    className={
                      isCurrent
                        ? 'bg-blue-50/70'
                        : 'hover:bg-slate-50/70 transition-colors'
                    }
                  >
                    <td className="py-3 px-4 sm:px-5 font-mono text-xs font-semibold text-slate-700 tabular-nums whitespace-nowrap">
                      #{idx + 1}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 whitespace-nowrap">
                      <span>{entry.name}</span>
                      {isCurrent && (
                        <span className="ml-2 text-xs font-mono text-blue-700 font-semibold">
                          (Siz)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 tabular-nums">
                      {entry.iq}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-700 tabular-nums">
                      {entry.correctCount} / {entry.totalCount}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                      {formatDuration(entry.totalTimeSec)}
                    </td>
                    <td className="py-3 px-4 sm:px-5 text-right whitespace-nowrap">
                      {entry.result && onOpenResult && !isCurrent ? (
                        <button
                          type="button"
                          onClick={() => onOpenResult(entry.result!)}
                          className="text-xs font-semibold text-blue-700 hover:text-blue-900 hover:underline underline-offset-4 cursor-pointer"
                        >
                          Aç
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-slate-400">
                          {entry.isBenchmark ? '—' : 'Aktif'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
