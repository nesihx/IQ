import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BENCHMARK_LEADERBOARD,
  calculatePsychometricResult,
  estimateThetaEAP,
  getWechslerClassification,
  iqToPercentile,
  normalCdf,
} from './psychometrics';
import { getQuestionsForMode, IQ_QUESTIONS } from '../data/iqQuestions';
import { UserResponse } from '../types/iq';

test('normalCdf matches standard normal distribution reference points', () => {
  assert.ok(Math.abs(normalCdf(0) - 0.5) < 1e-6);
  assert.ok(Math.abs(normalCdf(1) - 0.8413447) < 1e-4);
  assert.ok(Math.abs(normalCdf(-1) - 0.1586553) < 1e-4);
  assert.ok(Math.abs(normalCdf(2) - 0.9772499) < 1e-4);
});

test('iqToPercentile maps 100 to 50% and 130 to ~97.7%', () => {
  assert.equal(iqToPercentile(100), 50);
  assert.ok(iqToPercentile(130) >= 97.6 && iqToPercentile(130) <= 97.8);
  assert.ok(iqToPercentile(70) >= 2.2 && iqToPercentile(70) <= 2.4);
});

test('Wechsler classification boundaries return accurate Turkish labels', () => {
  assert.equal(getWechslerClassification(135).label, 'Çok Üstün Düzey');
  assert.equal(getWechslerClassification(122).label, 'Üstün Düzey');
  assert.equal(getWechslerClassification(114).label, 'Yüksek Ortalama');
  assert.equal(getWechslerClassification(100).label, 'Ortalama Düzey');
  assert.equal(getWechslerClassification(85).label, 'Düşük Ortalama');
});

test('EAP IRT scoring preserves participantName and is strictly monotonic', () => {
  const allWrong: UserResponse[] = IQ_QUESTIONS.map((q) => ({
    questionId: q.id,
    selectedIndex: (q.correctIndex + 1) % 6,
    timeSpentMs: 25000,
  }));

  const halfCorrect: UserResponse[] = IQ_QUESTIONS.map((q, idx) => ({
    questionId: q.id,
    selectedIndex: idx % 2 === 0 ? q.correctIndex : (q.correctIndex + 1) % 6,
    timeSpentMs: 25000,
  }));

  const allCorrect: UserResponse[] = IQ_QUESTIONS.map((q) => ({
    questionId: q.id,
    selectedIndex: q.correctIndex,
    timeSpentMs: 25000,
  }));

  const resWrong = calculatePsychometricResult(IQ_QUESTIONS, allWrong, 'standard', 'Ali Veli');
  const resHalf = calculatePsychometricResult(IQ_QUESTIONS, halfCorrect, 'standard', 'Ayşe Kaya');
  const resAll = calculatePsychometricResult(IQ_QUESTIONS, allCorrect, 'standard', 'Zeynep Ak');

  assert.equal(resWrong.participantName, 'Ali Veli');
  assert.equal(resHalf.participantName, 'Ayşe Kaya');
  assert.equal(resAll.participantName, 'Zeynep Ak');

  assert.ok(resWrong.iq < resHalf.iq);
  assert.ok(resHalf.iq < resAll.iq);
  assert.ok(resAll.iq >= 132 && resAll.iq <= 145);
  assert.ok(resWrong.iq >= 65 && resWrong.iq <= 80);
  assert.ok(resHalf.ciLow < resHalf.iq && resHalf.iq < resHalf.ciHigh);
  assert.equal(resHalf.domainScores.length, 4);
  assert.equal(resAll.correctCount, 24);

  const { seTheta } = estimateThetaEAP(IQ_QUESTIONS, allCorrect);
  assert.ok(seTheta > 0 && seTheta < 1.5);
});

test('Question bank integrity: 24 unique items, 6 per domain, 6 distinct options each', () => {
  assert.equal(IQ_QUESTIONS.length, 24);

  const seenIds = new Set<string>();
  const domainCounts: Record<string, number> = { Gf: 0, Gv: 0, Gq: 0, Gwm: 0 };

  for (const q of IQ_QUESTIONS) {
    assert.ok(!seenIds.has(q.id), `Duplicate question id: ${q.id}`);
    seenIds.add(q.id);

    domainCounts[q.domain] = (domainCounts[q.domain] ?? 0) + 1;

    assert.equal(q.options.length, 6, `Question ${q.id} must have 6 options`);
    assert.ok(
      q.correctIndex >= 0 && q.correctIndex < 6,
      `Question ${q.id} has invalid correctIndex`
    );
    assert.ok(q.explanation.trim().length > 25, `Question ${q.id} needs explanation`);

    const serialized = new Set(q.options.map((o) => JSON.stringify(o)));
    assert.equal(
      serialized.size,
      6,
      `Question ${q.id} has duplicate option payloads`
    );
  }

  assert.deepEqual(domainCounts, { Gf: 6, Gv: 6, Gq: 6, Gwm: 6 });
  assert.equal(getQuestionsForMode('quick').length, 12);
  assert.equal(getQuestionsForMode('standard').length, 24);
  assert.ok(BENCHMARK_LEADERBOARD.length >= 5);
});
