import React from 'react';
import { iqToPercentile, iqToZScore, normalPdf } from '../engine/psychometrics';

interface BellCurveChartProps {
  iq: number;
  ciLow?: number;
  ciHigh?: number;
  interactive?: boolean;
  onIqChange?: (iq: number) => void;
}

export function BellCurveChart({
  iq,
  ciLow,
  ciHigh,
  interactive = false,
  onIqChange,
}: BellCurveChartProps) {
  const width = 560;
  const height = 250;
  const padL = 28;
  const padR = 28;
  const padT = 28;
  const padB = 46;

  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const minIq = 55;
  const maxIq = 145;
  const maxPdf = normalPdf(0);

  const toX = (val: number) =>
    padL + ((val - minIq) / (maxIq - minIq)) * plotW;
  const toY = (pdf: number) => padT + plotH - (pdf / maxPdf) * plotH * 0.92;

  // Build curve points
  const curvePoints: { x: number; y: number; iqVal: number }[] = [];
  for (let val = minIq; val <= maxIq; val += 1) {
    const z = iqToZScore(val);
    curvePoints.push({
      x: toX(val),
      y: toY(normalPdf(z)),
      iqVal: val,
    });
  }

  const linePath = curvePoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ');

  // Shaded area from minIq up to current iq
  const shadedPoints = curvePoints.filter((p) => p.iqVal <= iq);
  const lastShadedX = toX(iq);
  const lastShadedY = toY(normalPdf(iqToZScore(iq)));
  const baselineY = padT + plotH;

  const areaPath =
    shadedPoints.length > 0
      ? [
          `M ${toX(minIq).toFixed(1)} ${baselineY}`,
          ...shadedPoints.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
          `L ${lastShadedX.toFixed(1)} ${lastShadedY.toFixed(1)}`,
          `L ${lastShadedX.toFixed(1)} ${baselineY}`,
          'Z',
        ].join(' ')
      : '';

  const ticks = [
    { val: 55, label: '55', sigma: '-3σ' },
    { val: 70, label: '70', sigma: '-2σ' },
    { val: 85, label: '85', sigma: '-1σ' },
    { val: 100, label: '100', sigma: 'μ' },
    { val: 115, label: '115', sigma: '+1σ' },
    { val: 130, label: '130', sigma: '+2σ' },
    { val: 145, label: '145', sigma: '+3σ' },
  ];

  const z = iqToZScore(iq);
  const percentile = iqToPercentile(iq);

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label={`Normal dağılım eğrisi üzerinde IQ ${iq} konumu, yüzdelik dilim %${percentile}`}
      >
        {/* Subtle sigma guide lines */}
        {ticks.map((t) => {
          const tx = toX(t.val);
          return (
            <g key={t.val}>
              <line
                x1={tx}
                y1={padT}
                x2={tx}
                y2={baselineY}
                stroke={t.val === 100 ? '#94A3B8' : '#E2E8F0'}
                strokeWidth={t.val === 100 ? 1.2 : 1}
                strokeDasharray={t.val === 100 ? '4 3' : '2 3'}
              />
              <text
                x={tx}
                y={baselineY + 16}
                textAnchor="middle"
                className="fill-slate-700 font-mono text-[11px] font-medium"
              >
                {t.label}
              </text>
              <text
                x={tx}
                y={baselineY + 30}
                textAnchor="middle"
                className="fill-slate-400 font-mono text-[10px]"
              >
                {t.sigma}
              </text>
            </g>
          );
        })}

        {/* 95% CI Band if provided */}
        {ciLow !== undefined && ciHigh !== undefined && (
          <g>
            <rect
              x={toX(Math.max(minIq, ciLow))}
              y={padT}
              width={Math.max(
                4,
                toX(Math.min(maxIq, ciHigh)) - toX(Math.max(minIq, ciLow))
              )}
              height={plotH}
              fill="#0891B2"
              fillOpacity={0.1}
            />
            <line
              x1={toX(Math.max(minIq, ciLow))}
              y1={baselineY - 6}
              x2={toX(Math.min(maxIq, ciHigh))}
              y2={baselineY - 6}
              stroke="#0891B2"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Shaded cumulative percentile region */}
        {areaPath && <path d={areaPath} fill="#2563EB" fillOpacity={0.14} />}

        {/* Gaussian Curve */}
        <path
          d={linePath}
          fill="none"
          stroke="#0F172A"
          strokeWidth={2.2}
          strokeLinejoin="round"
        />

        {/* Baseline */}
        <line
          x1={padL}
          y1={baselineY}
          x2={width - padR}
          y2={baselineY}
          stroke="#CBD5E1"
          strokeWidth={1.5}
        />

        {/* Active IQ vertical marker */}
        <line
          x1={lastShadedX}
          y1={padT - 6}
          x2={lastShadedX}
          y2={baselineY}
          stroke="#1D4ED8"
          strokeWidth={2}
        />
        <circle
          cx={lastShadedX}
          cy={lastShadedY}
          r={5}
          fill="#1D4ED8"
          stroke="#FFFFFF"
          strokeWidth={2}
        />

        {/* Top marker label */}
        <text
          x={Math.min(width - 70, Math.max(70, lastShadedX))}
          y={16}
          textAnchor="middle"
          className="fill-blue-700 font-mono text-[11px] font-semibold"
        >
          IQ {iq} (z={z >= 0 ? `+${z.toFixed(2)}` : z.toFixed(2)})
        </text>
      </svg>

      {interactive && onIqChange && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <label htmlFor="iq-explorer-slider" className="font-medium text-slate-700">
              Dağılım Simülatörü (Wechsler μ=100, σ=15)
            </label>
            <span className="font-mono tabular-nums text-slate-600">
              IQ {iq} · Yüzdelik %{percentile.toFixed(1)}
            </span>
          </div>
          <input
            id="iq-explorer-slider"
            type="range"
            min={70}
            max={145}
            step={1}
            value={iq}
            onChange={(e) => onIqChange(Number(e.target.value))}
            className="w-full accent-blue-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
          />
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2">
              <div className="text-slate-500">Standart Sapma (z)</div>
              <div className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                {z >= 0 ? `+${z.toFixed(2)}σ` : `${z.toFixed(2)}σ`}
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2">
              <div className="text-slate-500">Yüzdelik Dilim</div>
              <div className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                %{percentile.toFixed(1)}
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2">
              <div className="text-slate-500">Nadirlik</div>
              <div className="font-mono font-semibold text-slate-900 tabular-nums mt-0.5">
                1 / {Math.max(1, Math.round(100 / Math.max(0.1, 100 - percentile)))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
