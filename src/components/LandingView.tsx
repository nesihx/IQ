import React from 'react';
import { ArrowRight } from 'lucide-react';
import { AssessmentMode } from '../types/iq';

interface LandingViewProps {
  participantName: string;
  onNameChange: (name: string) => void;
  nameError: string;
  mode: AssessmentMode;
  onModeChange: (mode: AssessmentMode) => void;
  onStartTest: (e?: React.FormEvent) => void;
  nameInputRef: React.RefObject<HTMLInputElement | null>;
}

export function LandingView({
  participantName,
  onNameChange,
  nameError,
  mode,
  onModeChange,
  onStartTest,
  nameInputRef,
}: LandingViewProps) {
  return (
    <main
      id="top"
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 py-10 lab-grid-bg"
    >
      <form
        onSubmit={onStartTest}
        noValidate
        className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs"
      >
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          IQ Testi
        </h1>

        <div className="mt-6">
          <label
            htmlFor="participant-name"
            className="block text-xs font-semibold text-slate-700 mb-1.5"
          >
            Adınız veya Takma Adınız
          </label>
          <input
            ref={nameInputRef}
            id="participant-name"
            type="text"
            value={participantName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Örn. Ahmet Yılmaz"
            maxLength={40}
            required
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? 'name-error-msg' : undefined}
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              nameError
                ? 'border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 focus:border-blue-700 focus:ring-blue-100'
            }`}
          />
          {nameError && (
            <p
              id="name-error-msg"
              role="alert"
              className="text-xs font-medium text-rose-600 mt-1.5"
            >
              {nameError}
            </p>
          )}
        </div>

        <div className="mt-5">
          <div className="text-xs font-semibold text-slate-700 mb-1.5">
            Soru Sayısı
          </div>
          <div
            role="group"
            aria-label="Test modu seçimi"
            className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg"
          >
            <button
              type="button"
              onClick={() => onModeChange('standard')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'standard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              24 Soru (Tam Test)
            </button>
            <button
              type="button"
              onClick={() => onModeChange('quick')}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                mode === 'quick'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              12 Soru (Hızlı)
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          <span>Testi Başlat</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </main>
  );
}
