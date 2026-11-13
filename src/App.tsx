import React, { useEffect, useRef, useState } from 'react';
import { AssessmentMode, IQQuestion, PsychometricResult, UserResponse } from './types/iq';
import { getQuestionsForMode } from './data/iqQuestions';
import { calculatePsychometricResult } from './engine/psychometrics';
import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { AssessmentView } from './components/AssessmentView';
import { ResultsView } from './components/ResultsView';

const STORAGE_KEY = 'kognitiva_history_v1';

function loadHistory(): PsychometricResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function App() {
  const isAutostart =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('autostart') === '1';

  const [view, setView] = useState<'landing' | 'assessment' | 'results'>(() =>
    isAutostart ? 'assessment' : 'landing'
  );

  const [participantName, setParticipantName] = useState<string>(() =>
    isAutostart ? 'Demo Katılımcı' : ''
  );
  const [nameError, setNameError] = useState<string>('');
  const [mode, setMode] = useState<AssessmentMode>('standard');
  const [activeQuestions, setActiveQuestions] = useState<IQQuestion[]>(() =>
    getQuestionsForMode('standard')
  );
  const [activeResult, setActiveResult] = useState<PsychometricResult | null>(null);
  const [history, setHistory] = useState<PsychometricResult[]>(() => loadHistory());

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Ignore storage quota issues gracefully
    }
  }, [history]);

  const startAssessmentIfValid = (selectedMode: AssessmentMode = mode) => {
    const trimmed = participantName.trim();
    if (!trimmed) {
      setNameError('Lütfen teste başlamadan önce adınızı veya takma adınızı girin.');
      if (view !== 'landing') {
        setView('landing');
      }
      setTimeout(() => {
        nameInputRef.current?.focus();
        nameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 40);
      return;
    }

    setNameError('');
    const questions = getQuestionsForMode(selectedMode);
    setMode(selectedMode);
    setActiveQuestions(questions);
    setView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartFormSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    startAssessmentIfValid(mode);
  };

  const handleCompleteTest = (responses: UserResponse[]) => {
    const result = calculatePsychometricResult(
      activeQuestions,
      responses,
      mode,
      participantName
    );
    setActiveResult(result);
    setHistory((prev) => [result, ...prev].slice(0, 30));
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenHistoryResult = (result: PsychometricResult) => {
    setMode(result.mode);
    setActiveQuestions(getQuestionsForMode(result.mode));
    setActiveResult(result);
    setView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  if (view === 'assessment') {
    return (
      <AssessmentView
        participantName={participantName.trim() || 'Katılımcı'}
        questions={activeQuestions}
        onComplete={handleCompleteTest}
        onCancel={() => setView('landing')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        activeView={view}
        onNavigateHome={() => setView('landing')}
        onStartAction={() => startAssessmentIfValid(mode)}
      />

      <div className="flex-1">
        {view === 'landing' && (
          <LandingView
            participantName={participantName}
            onNameChange={(val) => {
              setParticipantName(val);
              if (nameError && val.trim()) setNameError('');
            }}
            nameError={nameError}
            mode={mode}
            onModeChange={setMode}
            onStartTest={handleStartFormSubmit}
            nameInputRef={nameInputRef}
          />
        )}

        {view === 'results' && activeResult && (
          <ResultsView
            result={activeResult}
            questions={activeQuestions}
            history={history}
            onOpenHistoryResult={handleOpenHistoryResult}
            onClearHistory={handleClearHistory}
            onRetake={() => startAssessmentIfValid(mode)}
            onBackHome={() => setView('landing')}
          />
        )}
      </div>
    </div>
  );
}
