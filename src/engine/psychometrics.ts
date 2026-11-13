import {
  AssessmentMode,
  CognitiveDomain,
  DomainScore,
  IQQuestion,
  ItemDiagnostic,
  PsychometricResult,
  UserResponse,
} from '../types/iq';

export const DOMAIN_META: Record<
  CognitiveDomain,
  { label: string; shortLabel: string; theoryRef: string; description: string }
> = {
  Gf: {
    label: 'Akışkan Zekâ (Gf)',
    shortLabel: 'Akışkan Zekâ',
    theoryRef: 'Raven İlerleyen Matrisleri',
    description:
      'Önceden öğrenilmiş bilgiye dayanmaksızın yeni örüntüleri sezme, soyut kurallar çıkarma ve tümevarımsal akıl yürütme kapasitesi.',
  },
  Gv: {
    label: 'Görsel-Uzamsal İşlemleme (Gv)',
    shortLabel: 'Uzamsal İşlemleme',
    theoryRef: 'Shepard-Metzler & VZ-2',
    description:
      'İki ve üç boyutlu geometrik yapıları zihinde döndürme, yansıtma, katlama ve uzamsal ilişkileri koruma becerisi.',
  },
  Gq: {
    label: 'Nicel Akıl Yürütme (Gq)',
    shortLabel: 'Nicel Akıl Yürütme',
    theoryRef: 'Cattell-Horn Nicel İlişkiler',
    description:
      'Sayısal diziler, matris aritmetiği ve sembolik denklik sistemleri üzerinden mantıksal çıkarım yapabilme yeteneği.',
  },
  Gwm: {
    label: 'Çalışma Belleği ve Kural Takibi (Gwm)',
    shortLabel: 'Çalışma Belleği',
    theoryRef: 'Baddeley Yürütücü Kontrol',
    description:
      'Birden fazla kuralı ve dönüşüm durumunu zihinde aktif tutarak ardışık işlemleri hatasız yürütme kapasitesi.',
  },
};

/** Standard Normal Probability Density Function */
export function normalPdf(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

/**
 * Standard Normal Cumulative Distribution Function
 * Abramowitz & Stegun (1964) rational approximation (max error < 7.5e-8)
 */
export function normalCdf(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;

  const t = 1 / (1 + 0.3275911 * x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const erf =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * erf);
}

export function iqToZScore(iq: number): number {
  return (iq - 100) / 15;
}

export function iqToPercentile(iq: number): number {
  const p = normalCdf(iqToZScore(iq)) * 100;
  return Math.min(99.9, Math.max(0.1, Number(p.toFixed(1))));
}

export function getWechslerClassification(iq: number): {
  label: string;
  description: string;
} {
  if (iq >= 130) {
    return {
      label: 'Çok Üstün Düzey',
      description:
        'Popülasyonun en üst %2.3’lük diliminde yer alan yüksek soyutlama ve örüntü sentezleme performansı.',
    };
  }
  if (iq >= 120) {
    return {
      label: 'Üstün Düzey',
      description:
        'Karmaşık çok değişkenli matrislerde ve uzamsal dönüşümlerde norm ortalamasının belirgin şekilde üzerinde performans.',
    };
  }
  if (iq >= 110) {
    return {
      label: 'Yüksek Ortalama',
      description:
        'Genel bilişsel normun üzerinde, analitik örüntü tanıma ve mantıksal tutarlılık açısından güçlü profil.',
    };
  }
  if (iq >= 90) {
    return {
      label: 'Ortalama Düzey',
      description:
        'Standart popülasyon dağılımının merkez (%50’lik) bandında dengeli bilişsel işlemleme düzeyi.',
    };
  }
  if (iq >= 80) {
    return {
      label: 'Düşük Ortalama',
      description:
        'Temel örüntü ve ardışık kural maddelerinde tutarlı, yüksek zorluk dereceli soyutlamalarda gelişime açık profil.',
    };
  }
  return {
    label: 'Sınır / Gelişim Bandı',
    description:
      'Süre baskısı veya dikkati dağıtan unsurlar altında performans düşüşü yaşanmış olabilir; sakin koşullarda tekrar önerilir.',
  };
}

/**
 * 2-Parameter Logistic (2PL) Item Response Theory probability
 * P(correct | theta, a, b) = 1 / (1 + exp(-a * (theta - b)))
 * Includes a subtle guessing lower asymptote c = 1/6 (6 options) for 3PL-like realism
 * when calculating expected posterior likelihood.
 */
export function irtItemProbability(
  theta: number,
  discrimination: number,
  difficulty: number,
  guessing = 1 / 6
): number {
  const logistic = 1 / (1 + Math.exp(-discrimination * (theta - difficulty)));
  return guessing + (1 - guessing) * logistic;
}

/**
 * Expected A Posteriori (EAP) Bayesian IRT ability estimation over quadrature grid [-3.5, +3.5]
 * with standard normal prior N(0, 1).
 * Returns posterior mean theta and posterior standard error seTheta.
 */
export function estimateThetaEAP(
  questions: IQQuestion[],
  responses: UserResponse[]
): { theta: number; seTheta: number } {
  const responseMap = new Map<string, UserResponse>();
  for (const r of responses) {
    responseMap.set(r.questionId, r);
  }

  const gridSteps = 141; // -3.5 to +3.5 step 0.05
  const thetas: number[] = [];
  const logPosteriors: number[] = [];

  for (let i = 0; i < gridSteps; i++) {
    const theta = -3.5 + i * 0.05;
    thetas.push(theta);

    // Log-prior N(0, 1)
    let logP = -0.5 * theta * theta;

    for (const q of questions) {
      const resp = responseMap.get(q.id);
      const isAnswered = resp !== undefined && resp.selectedIndex !== null;
      // Unanswered items are treated as incorrect in standardized timed testing,
      // though with slightly softer weight if test was quick-terminated?
      // Standard psychometric rule: omitted items score 0.
      const isCorrect = isAnswered && resp!.selectedIndex === q.correctIndex;
      const p = irtItemProbability(theta, q.discrimination, q.difficulty);
      const clampedP = Math.min(0.9999, Math.max(0.0001, p));
      logP += isCorrect ? Math.log(clampedP) : Math.log(1 - clampedP);
    }

    logPosteriors.push(logP);
  }

  // Log-sum-exp normalization
  const maxLog = Math.max(...logPosteriors);
  const weights = logPosteriors.map((lp) => Math.exp(lp - maxLog));
  const sumWeights = weights.reduce((acc, w) => acc + w, 0);
  const probs = weights.map((w) => w / sumWeights);

  let meanTheta = 0;
  for (let i = 0; i < gridSteps; i++) {
    meanTheta += thetas[i] * probs[i];
  }

  let variance = 0;
  for (let i = 0; i < gridSteps; i++) {
    const diff = thetas[i] - meanTheta;
    variance += diff * diff * probs[i];
  }

  const seTheta = Math.sqrt(variance);
  return { theta: meanTheta, seTheta };
}

export function calculatePsychometricResult(
  questions: IQQuestion[],
  responses: UserResponse[],
  mode: AssessmentMode,
  participantName = 'Katılımcı',
  completedAt = new Date().toISOString()
): PsychometricResult {
  const responseMap = new Map<string, UserResponse>();
  for (const r of responses) {
    responseMap.set(r.questionId, r);
  }

  let correctCount = 0;
  let totalTimeMs = 0;

  const diagnostics: ItemDiagnostic[] = questions.map((q) => {
    const resp = responseMap.get(q.id);
    const selectedIndex = resp?.selectedIndex ?? null;
    const isCorrect = selectedIndex === q.correctIndex;
    const timeSpentMs = resp?.timeSpentMs ?? 0;

    if (isCorrect) correctCount += 1;
    totalTimeMs += timeSpentMs;

    return {
      questionId: q.id,
      order: q.order,
      domain: q.domain,
      title: q.title,
      difficulty: q.difficulty,
      selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect,
      timeSpentMs,
    };
  });

  // Compute EAP theta
  const { theta: rawTheta, seTheta } = estimateThetaEAP(questions, responses);

  const accuracy = questions.length > 0 ? correctCount / questions.length : 0;

  const avgTimeSec =
    questions.length > 0 ? totalTimeMs / 1000 / questions.length : 0;
  let fluencyAdjustment = 0;
  if (accuracy >= 0.5 && avgTimeSec > 3 && avgTimeSec < 35) {
    fluencyAdjustment = ((35 - avgTimeSec) / 35) * 0.12;
  }

  const calibratedTheta = Math.max(
    -2.3,
    Math.min(2.85, rawTheta + fluencyAdjustment)
  );

  const rawIq = Math.round(100 + 15 * calibratedTheta);
  const iq = Math.max(65, Math.min(145, rawIq));

  const sem = Math.max(3, Math.min(11, Math.round(15 * seTheta)));
  const margin95 = Math.round(1.96 * sem * 0.55);
  const ciLow = Math.max(60, iq - Math.max(4, margin95));
  const ciHigh = Math.min(150, iq + Math.max(4, margin95));

  const zScore = Number(iqToZScore(iq).toFixed(2));
  const percentile = iqToPercentile(iq);
  const { label: classification, description: classificationDesc } =
    getWechslerClassification(iq);

  const domains: CognitiveDomain[] = ['Gf', 'Gv', 'Gq', 'Gwm'];
  const domainScores: DomainScore[] = domains.map((domain) => {
    const domainQs = questions.filter((q) => q.domain === domain);
    const domainResps = domainQs.map((q) => responseMap.get(q.id));
    const domainCorrect = domainQs.filter((q, idx) => {
      const r = domainResps[idx];
      return r !== undefined && r.selectedIndex === q.correctIndex;
    }).length;
    const domainTimeMs = domainResps.reduce(
      (sum, r) => sum + (r?.timeSpentMs ?? 0),
      0
    );

    let maxWeight = 0;
    let earnedWeight = 0;
    for (let i = 0; i < domainQs.length; i++) {
      const w = 1 + (domainQs[i].difficulty + 1.5) * 0.35;
      maxWeight += w;
      if (domainResps[i]?.selectedIndex === domainQs[i].correctIndex) {
        earnedWeight += w;
      }
    }

    const weightedRatio = maxWeight > 0 ? earnedWeight / maxWeight : 0;
    const scaledScore = Math.round(weightedRatio * 100);
    const domainIq = Math.max(
      70,
      Math.min(145, Math.round(74 + weightedRatio * 68))
    );

    return {
      domain,
      label: DOMAIN_META[domain].label,
      shortLabel: DOMAIN_META[domain].shortLabel,
      correctCount: domainCorrect,
      totalCount: domainQs.length,
      accuracy: domainQs.length > 0 ? domainCorrect / domainQs.length : 0,
      scaledScore,
      domainIq,
      avgTimeSec:
        domainQs.length > 0
          ? Number((domainTimeMs / 1000 / domainQs.length).toFixed(1))
          : 0,
    };
  });

  const cleanName = participantName.trim() || 'Katılımcı';

  return {
    id: `cog-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    participantName: cleanName,
    completedAt,
    mode,
    iq,
    ciLow,
    ciHigh,
    sem,
    zScore,
    percentile,
    classification,
    classificationDesc,
    theta: Number(calibratedTheta.toFixed(2)),
    correctCount,
    totalCount: questions.length,
    totalTimeSec: Math.round(totalTimeMs / 1000),
    avgTimeSec: Number(avgTimeSec.toFixed(1)),
    domainScores,
    diagnostics,
  };
}

export const BENCHMARK_LEADERBOARD = [
  {
    id: 'bench-1',
    name: 'Kerem Aydın',
    iq: 132,
    percentile: 98.4,
    correctCount: 23,
    totalCount: 24,
    totalTimeSec: 412,
    mode: 'standard' as AssessmentMode,
    completedAt: '2026-11-10T09:15:00.000Z',
    isBenchmark: true,
  },
  {
    id: 'bench-2',
    name: 'Selin Yılmaz',
    iq: 123,
    percentile: 93.7,
    correctCount: 20,
    totalCount: 24,
    totalTimeSec: 485,
    mode: 'standard' as AssessmentMode,
    completedAt: '2026-11-11T14:20:00.000Z',
    isBenchmark: true,
  },
  {
    id: 'bench-3',
    name: 'Mert Kaya',
    iq: 114,
    percentile: 82.5,
    correctCount: 17,
    totalCount: 24,
    totalTimeSec: 530,
    mode: 'standard' as AssessmentMode,
    completedAt: '2026-11-11T18:40:00.000Z',
    isBenchmark: true,
  },
  {
    id: 'bench-4',
    name: 'Deniz Tunç',
    iq: 105,
    percentile: 63.1,
    correctCount: 13,
    totalCount: 24,
    totalTimeSec: 610,
    mode: 'standard' as AssessmentMode,
    completedAt: '2026-11-12T11:05:00.000Z',
    isBenchmark: true,
  },
  {
    id: 'bench-5',
    name: 'Ece Demir',
    iq: 96,
    percentile: 39.5,
    correctCount: 10,
    totalCount: 24,
    totalTimeSec: 590,
    mode: 'standard' as AssessmentMode,
    completedAt: '2026-11-12T16:50:00.000Z',
    isBenchmark: true,
  },
];
