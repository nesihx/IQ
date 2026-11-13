import React from 'react';

interface HeaderProps {
  onNavigateHome: () => void;
  onStartAction: () => void;
  activeView: 'landing' | 'results';
}

export function Header({ onNavigateHome, onStartAction, activeView }: HeaderProps) {
  return (
    <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => {
            onNavigateHome();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-700 rounded"
        >
          Kognitiva
        </button>

        <div className="flex items-center gap-3 shrink-0">
          {activeView === 'results' && (
            <button
              type="button"
              onClick={onNavigateHome}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Ana Sayfa
            </button>
          )}
          <button
            type="button"
            onClick={onStartAction}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Testi Başlat
          </button>
        </div>
      </div>
    </header>
  );
}
