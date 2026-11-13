import React from 'react';
import { DomainScore } from '../types/iq';

export function RadarChart({ scores }: { scores: DomainScore[] }) {
  const width = 440;
  const height = 300;
  const cx = width / 2;
  const cy = height / 2;
  const maxR = 92;

  // Map domainIq [65..145] onto radius [0.15..1.0]
  const normalize = (iq: number) => {
    const clamped = Math.max(65, Math.min(145, iq));
    return 0.15 + ((clamped - 65) / (145 - 65)) * 0.85;
  };

  const angles = scores.map((_, idx) => (-90 + idx * (360 / scores.length)) * (Math.PI / 180));
  const rings = [0.25, 0.5, 0.75, 1.0];
  const normRatio = normalize(100);

  const ringPoints = (ratio: number) =>
    angles
      .map((a) => `${(cx + Math.cos(a) * maxR * ratio).toFixed(1)},${(cy + Math.sin(a) * maxR * ratio).toFixed(1)}`)
      .join(' ');

  const userPoints = scores
    .map((s, idx) => {
      const r = maxR * normalize(s.domainIq);
      const a = angles[idx];
      return `${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-[440px] h-auto mx-auto"
      role="img"
      aria-label="CHC 4 bilişsel alan radar profili"
    >
      {/* Concentric polygon grid */}
      {rings.map((ratio, idx) => (
        <polygon
          key={idx}
          points={ringPoints(ratio)}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={1}
        />
      ))}

      {/* Norm baseline (IQ 100) */}
      <polygon
        points={ringPoints(normRatio)}
        fill="none"
        stroke="#94A3B8"
        strokeWidth={1.2}
        strokeDasharray="4 3"
      />

      {/* Radial axes */}
      {angles.map((a, idx) => (
        <line
          key={idx}
          x1={cx}
          y1={cy}
          x2={cx + Math.cos(a) * maxR}
          y2={cy + Math.sin(a) * maxR}
          stroke="#CBD5E1"
          strokeWidth={1}
        />
      ))}

      {/* User Cognitive Polygon */}
      <polygon
        points={userPoints}
        fill="#2563EB"
        fillOpacity={0.16}
        stroke="#1D4ED8"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />

      {/* Vertex points and labels */}
      {scores.map((s, idx) => {
        const a = angles[idx];
        const r = maxR * normalize(s.domainIq);
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;

        const isTop = idx === 0;
        const isRight = idx === 1;
        const isBottom = idx === 2;
        const isLeft = idx === 3;

        const labelR = isTop || isBottom ? maxR + 24 : maxR + 16;
        const lx = cx + Math.cos(a) * labelR;
        const ly = cy + Math.sin(a) * labelR;
        const textAnchor = isRight ? 'start' : isLeft ? 'end' : 'middle';
        const yOffset = isTop ? -10 : isBottom ? 12 : -2;

        return (
          <g key={s.domain}>
            <circle cx={px} cy={py} r={4.5} fill="#1D4ED8" stroke="#FFFFFF" strokeWidth={1.8} />
            <text
              x={lx}
              y={ly + yOffset}
              textAnchor={textAnchor}
              className="fill-slate-800 text-[12px] font-semibold"
            >
              {s.shortLabel}
            </text>
            <text
              x={lx}
              y={ly + yOffset + 15}
              textAnchor={textAnchor}
              className="fill-blue-700 font-mono text-[11px] font-semibold tabular-nums"
            >
              {s.domainIq} ({s.domain})
            </text>
          </g>
        );
      })}
    </svg>
  );
}
