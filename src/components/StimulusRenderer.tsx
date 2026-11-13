import React, { useId } from 'react';
import {
  AsymmetricGlyphOption,
  ClockRingOption,
  CubeSymbol,
  CubeViewOption,
  DualTokenGridOption,
  FillMode,
  MatrixCellData,
  OptionPayload,
  PaperFoldOption,
  PolyominoOption,
  QuadrantDialOption,
  SequenceSlotsOption,
  ShapeKind,
  StimulusPayload,
} from '../types/iq';

function ShapePrimitive({
  shape,
  fill,
  patternId,
  dots,
  needleAngle,
  size = 100,
}: {
  shape: ShapeKind;
  fill: FillMode;
  patternId: string;
  dots?: number;
  needleAngle?: number;
  size?: number;
}) {
  const c = size / 2;
  const r = size * 0.34;

  const fillAttr =
    fill === 'solid'
      ? '#0F172A'
      : fill === 'striped'
        ? `url(#${patternId})`
        : '#FFFFFF';
  const strokeAttr = '#0F172A';
  const dotColor = fill === 'solid' ? '#FFFFFF' : '#0F172A';

  const renderBaseShape = () => {
    switch (shape) {
      case 'circle':
        return (
          <circle
            cx={c}
            cy={c}
            r={r}
            fill={fillAttr}
            stroke={strokeAttr}
            strokeWidth={2.5}
          />
        );
      case 'square':
        return (
          <rect
            x={c - r * 0.9}
            y={c - r * 0.9}
            width={r * 1.8}
            height={r * 1.8}
            rx={2}
            fill={fillAttr}
            stroke={strokeAttr}
            strokeWidth={2.5}
          />
        );
      case 'diamond':
        return (
          <polygon
            points={`${c},${c - r * 1.05} ${c + r * 1.05},${c} ${c},${c + r * 1.05} ${c - r * 1.05},${c}`}
            fill={fillAttr}
            stroke={strokeAttr}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        );
      case 'triangle': {
        const h = r * 1.05;
        return (
          <polygon
            points={`${c},${c - h} ${c + h * 0.96},${c + h * 0.8} ${c - h * 0.96},${c + h * 0.8}`}
            fill={fillAttr}
            stroke={strokeAttr}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        );
      }
      case 'pentagon': {
        const pts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const angle = (-90 + i * 72) * (Math.PI / 180);
          pts.push(
            `${(c + r * Math.cos(angle)).toFixed(1)},${(c + r * Math.sin(angle)).toFixed(1)}`
          );
        }
        return (
          <polygon
            points={pts.join(' ')}
            fill={fillAttr}
            stroke={strokeAttr}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        );
      }
      case 'hexagon': {
        const pts: string[] = [];
        for (let i = 0; i < 6; i++) {
          const angle = (-90 + i * 60) * (Math.PI / 180);
          pts.push(
            `${(c + r * Math.cos(angle)).toFixed(1)},${(c + r * Math.sin(angle)).toFixed(1)}`
          );
        }
        return (
          <polygon
            points={pts.join(' ')}
            fill={fillAttr}
            stroke={strokeAttr}
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
        );
      }
    }
  };

  const renderDots = () => {
    if (!dots) return null;
    const dotBg = fill === 'striped' ? '#FFFFFF' : undefined;
    const positions: [number, number][] =
      dots === 1
        ? [[c, c + (shape === 'triangle' ? 6 : 0)]]
        : dots === 2
          ? [
              [c - 7, c + (shape === 'triangle' ? 7 : 0)],
              [c + 7, c + (shape === 'triangle' ? 7 : 0)],
            ]
          : [
              [c, c - 6 + (shape === 'triangle' ? 5 : 0)],
              [c - 7, c + 6 + (shape === 'triangle' ? 5 : 0)],
              [c + 7, c + 6 + (shape === 'triangle' ? 5 : 0)],
            ];

    return (
      <g>
        {dotBg && (
          <circle
            cx={c}
            cy={c + (shape === 'triangle' ? 5 : 0)}
            r={13}
            fill="#FFFFFF"
          />
        )}
        {positions.map(([dx, dy], idx) => (
          <circle key={idx} cx={dx} cy={dy} r={3.4} fill={dotColor} />
        ))}
      </g>
    );
  };

  const renderNeedle = () => {
    if (needleAngle === undefined) return null;
    const needleColor = fill === 'solid' ? '#FFFFFF' : '#1D4ED8';
    const centerBg = fill === 'solid' ? '#0F172A' : '#FFFFFF';
    const rad = ((needleAngle - 90) * Math.PI) / 180;
    const tipX = c + Math.cos(rad) * 20;
    const tipY = c + Math.sin(rad) * 20;
    return (
      <g>
        <circle cx={c} cy={c} r={4.5} fill={centerBg} stroke={needleColor} strokeWidth={2} />
        <line
          x1={c}
          y1={c}
          x2={tipX}
          y2={tipY}
          stroke={needleColor}
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        <circle cx={tipX} cy={tipY} r={3.2} fill={needleColor} />
      </g>
    );
  };

  return (
    <g>
      {renderBaseShape()}
      {renderDots()}
      {renderNeedle()}
    </g>
  );
}

function MatrixCellView({ cell, size = 100 }: { cell: MatrixCellData; size?: number }) {
  const uid = useId().replace(/:/g, '');
  const patternId = `hatch-${uid}`;

  if (cell.kind === 'dotgrid') {
    const activeSet = new Set(cell.active);
    const coords = [24, 50, 76];
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => {
            const idx = row * 3 + col;
            const isActive = activeSet.has(idx);
            return (
              <circle
                key={idx}
                cx={coords[col]}
                cy={coords[row]}
                r={isActive ? 8.5 : 4}
                fill={isActive ? '#1D4ED8' : '#E2E8F0'}
                stroke={isActive ? '#0F172A' : '#CBD5E1'}
                strokeWidth={1.5}
              />
            );
          })
        )}
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
      <defs>
        <pattern
          id={patternId}
          width="6"
          height="6"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="6" height="6" fill="#FFFFFF" />
          <line x1="0" y1="0" x2="0" y2="6" stroke="#0F172A" strokeWidth="2.2" />
        </pattern>
      </defs>
      <ShapePrimitive
        shape={cell.shape}
        fill={cell.fill}
        patternId={patternId}
        dots={cell.dots}
        needleAngle={cell.needleAngle}
        size={size}
      />
    </svg>
  );
}

function PolyominoView({ data }: { data: PolyominoOption }) {
  const cellSize = 26;
  const offset = 11;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`${c}-${r}`}
            x={offset + c * cellSize}
            y={offset + r * cellSize}
            width={cellSize}
            height={cellSize}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={1}
          />
        ))
      )}
      {data.cells.map(([cx, cy], idx) => {
        const isAnchor = cx === data.anchor[0] && cy === data.anchor[1];
        return (
          <g key={idx}>
            <rect
              x={offset + cx * cellSize + 1.5}
              y={offset + cy * cellSize + 1.5}
              width={cellSize - 3}
              height={cellSize - 3}
              rx={3}
              fill={isAnchor ? '#1D4ED8' : '#334155'}
              stroke="#0F172A"
              strokeWidth={1.6}
            />
            {isAnchor && (
              <circle
                cx={offset + cx * cellSize + cellSize / 2}
                cy={offset + cy * cellSize + cellSize / 2}
                r={4.5}
                fill="#FFFFFF"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function PaperFoldOptionView({ data }: { data: PaperFoldOption }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect
        x={10}
        y={10}
        width={80}
        height={80}
        fill="#F8FAFC"
        stroke="#0F172A"
        strokeWidth={2}
        rx={2}
      />
      <line
        x1={50}
        y1={10}
        x2={50}
        y2={90}
        stroke="#CBD5E1"
        strokeWidth={1.2}
        strokeDasharray="3 3"
      />
      <line
        x1={10}
        y1={50}
        x2={90}
        y2={50}
        stroke="#CBD5E1"
        strokeWidth={1.2}
        strokeDasharray="3 3"
      />
      {data.holes.map(([hx, hy], idx) => {
        const sx = 10 + (hx / 100) * 80;
        const sy = 10 + (hy / 100) * 80;
        return (
          <circle
            key={idx}
            cx={sx}
            cy={sy}
            r={5}
            fill="#1D4ED8"
            stroke="#0F172A"
            strokeWidth={1.2}
          />
        );
      })}
    </svg>
  );
}

function CubeFaceSymbol({ symbol, size = 36 }: { symbol: CubeSymbol; size?: number }) {
  const c = size / 2;
  switch (symbol) {
    case 'filled-circle':
      return <circle cx={c} cy={c} r={size * 0.25} fill="#0F172A" />;
    case 'diagonal-slash':
      return (
        <line
          x1={size * 0.22}
          y1={size * 0.78}
          x2={size * 0.78}
          y2={size * 0.22}
          stroke="#0F172A"
          strokeWidth={3.4}
          strokeLinecap="round"
        />
      );
    case 'square-outline':
      return (
        <rect
          x={size * 0.25}
          y={size * 0.25}
          width={size * 0.5}
          height={size * 0.5}
          fill="none"
          stroke="#1D4ED8"
          strokeWidth={3}
        />
      );
    case 'triangle-up':
      return (
        <polygon
          points={`${c},${size * 0.2} ${size * 0.8},${size * 0.78} ${size * 0.2},${size * 0.78}`}
          fill="#0F172A"
        />
      );
    case 'cross-plus':
      return (
        <g stroke="#0F172A" strokeWidth={3.2} strokeLinecap="round">
          <line x1={c} y1={size * 0.22} x2={c} y2={size * 0.78} />
          <line x1={size * 0.22} y1={c} x2={size * 0.78} y2={c} />
        </g>
      );
    case 'two-dots':
      return (
        <g fill="#0F172A">
          <circle cx={size * 0.32} cy={size * 0.32} r={4} />
          <circle cx={size * 0.68} cy={size * 0.68} r={4} />
        </g>
      );
  }
}

function CubeViewOptionSvg({ data }: { data: CubeViewOption }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon
        points="50,12 86,29 50,46 14,29"
        fill="#F8FAFC"
        stroke="#0F172A"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <polygon
        points="14,29 50,46 50,88 14,71"
        fill="#FFFFFF"
        stroke="#0F172A"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <polygon
        points="50,46 86,29 86,71 50,88"
        fill="#F1F5F9"
        stroke="#0F172A"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <g transform="translate(50, 29) scale(0.95, 0.55) translate(-18, -18)">
        <CubeFaceSymbol symbol={data.top} size={36} />
      </g>
      <g transform="translate(32, 58) skewY(25) scale(0.85, 0.92) translate(-18, -18)">
        <CubeFaceSymbol symbol={data.front} size={36} />
      </g>
      <g transform="translate(68, 58) skewY(-25) scale(0.85, 0.92) translate(-18, -18)">
        <CubeFaceSymbol symbol={data.right} size={36} />
      </g>
    </svg>
  );
}

function AsymmetricGlyphSvg({ data }: { data: AsymmetricGlyphOption }) {
  const dotMap = {
    tl: [22, 22],
    tr: [78, 22],
    bl: [22, 78],
    br: [78, 78],
  };
  const [dx, dy] = dotMap[data.dotPos];
  const flagX = data.flagSide === 'right' ? 74 : 26;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect
        x={8}
        y={8}
        width={84}
        height={84}
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth={1.5}
        rx={6}
      />
      <circle cx={dx} cy={dy} r={6} fill="#1D4ED8" />
      <g transform={`rotate(${data.stemDir} 50 50)`}>
        <line
          x1={50}
          y1={72}
          x2={50}
          y2={22}
          stroke="#0F172A"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <polygon points="50,14 42,27 58,27" fill="#0F172A" />
        <line
          x1={50}
          y1={36}
          x2={flagX}
          y2={36}
          stroke="#0F172A"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <rect
          x={flagX > 50 ? flagX - 6 : flagX}
          y={36}
          width={6}
          height={10}
          fill="#0F172A"
        />
      </g>
    </svg>
  );
}

function SequenceSlotsSvg({ data }: { data: SequenceSlotsOption }) {
  return (
    <svg viewBox="0 0 150 56" className="w-full h-full">
      {data.slots.map((slot, idx) => {
        const cx = 25 + idx * 50;
        const cy = 28;
        const fill = slot.fill === 'solid' ? '#0F172A' : '#FFFFFF';
        return (
          <g key={idx}>
            {slot.shape === 'circle' && (
              <circle
                cx={cx}
                cy={cy}
                r={14}
                fill={fill}
                stroke="#0F172A"
                strokeWidth={2.5}
              />
            )}
            {slot.shape === 'square' && (
              <rect
                x={cx - 13}
                y={cy - 13}
                width={26}
                height={26}
                rx={2}
                fill={fill}
                stroke="#0F172A"
                strokeWidth={2.5}
              />
            )}
            {slot.shape === 'triangle' && (
              <polygon
                points={`${cx},${cy - 15} ${cx + 15},${cy + 12} ${cx - 15},${cy + 12}`}
                fill={fill}
                stroke="#0F172A"
                strokeWidth={2.5}
                strokeLinejoin="round"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function QuadrantDialSvg({ data }: { data: QuadrantDialOption }) {
  const quads = [
    { x: 14, y: 14 }, // 0 TL
    { x: 50, y: 14 }, // 1 TR
    { x: 50, y: 50 }, // 2 BR
    { x: 14, y: 50 }, // 3 BL
  ];
  const active = quads[data.quadrant];
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x={14} y={14} width={72} height={72} rx={6} fill="#FFFFFF" stroke="#0F172A" strokeWidth={2.2} />
      <rect x={active.x} y={active.y} width={36} height={36} fill="#DBEAFE" />
      <line x1={50} y1={14} x2={50} y2={86} stroke="#0F172A" strokeWidth={1.6} />
      <line x1={14} y1={50} x2={86} y2={50} stroke="#0F172A" strokeWidth={1.6} />
      <rect x={14} y={14} width={72} height={72} rx={6} fill="none" stroke="#0F172A" strokeWidth={2.2} />
      <circle cx={50} cy={50} r={15} fill="#FFFFFF" stroke="#0F172A" strokeWidth={2} />
      {data.centerShape === 'circle' && <circle cx={50} cy={50} r={6} fill="#1D4ED8" />}
      {data.centerShape === 'square' && <rect x={44} y={44} width={12} height={12} fill="#1D4ED8" />}
      {data.centerShape === 'triangle' && (
        <polygon points="50,42 57,55 43,55" fill="#1D4ED8" />
      )}
    </svg>
  );
}

function DualTokenGridSvg({ data }: { data: DualTokenGridOption }) {
  const cellSize = 26;
  const offset = 11;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => {
          const idx = row * 3 + col;
          const x = offset + col * cellSize;
          const y = offset + row * cellSize;
          return (
            <g key={idx}>
              <rect
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                fill={idx === 4 ? '#F1F5F9' : '#FFFFFF'}
                stroke="#CBD5E1"
                strokeWidth={1.5}
              />
              {data.squarePos === idx && (
                <rect
                  x={x + 5}
                  y={y + 5}
                  width={cellSize - 10}
                  height={cellSize - 10}
                  rx={2}
                  fill="#0F172A"
                />
              )}
              {data.circlePos === idx && (
                <circle
                  cx={x + cellSize / 2}
                  cy={y + cellSize / 2}
                  r={7.5}
                  fill="#1D4ED8"
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                />
              )}
            </g>
          );
        })
      )}
    </svg>
  );
}

function ClockRingSvg({ data }: { data: ClockRingOption }) {
  const cx = 50;
  const cy = 50;
  const r = 36;
  const centerFill = data.centerFill === 'solid' ? '#0F172A' : '#FFFFFF';
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#CBD5E1" strokeWidth={2} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
        const rad = ((idx * 45 - 90) * Math.PI) / 180;
        const px = cx + r * Math.cos(rad);
        const py = cy + r * Math.sin(rad);
        const isActive = idx === data.pos;
        return (
          <circle
            key={idx}
            cx={px}
            cy={py}
            r={isActive ? 7.5 : 3.2}
            fill={isActive ? '#1D4ED8' : '#CBD5E1'}
            stroke={isActive ? '#0F172A' : 'none'}
            strokeWidth={1.5}
          />
        );
      })}
      {data.centerShape === 'circle' && (
        <circle cx={cx} cy={cy} r={11} fill={centerFill} stroke="#0F172A" strokeWidth={2.4} />
      )}
      {data.centerShape === 'square' && (
        <rect x={cx - 10} y={cy - 10} width={20} height={20} rx={2} fill={centerFill} stroke="#0F172A" strokeWidth={2.4} />
      )}
      {data.centerShape === 'triangle' && (
        <polygon points={`${cx},${cy - 12} ${cx + 12},${cy + 9} ${cx - 12},${cy + 9}`} fill={centerFill} stroke="#0F172A" strokeWidth={2.4} strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function OptionGlyphRenderer({ option }: { option: OptionPayload }) {
  switch (option.kind) {
    case 'shape':
    case 'dotgrid':
      return (
        <div className="w-13 h-13 sm:w-20 sm:h-20 mx-auto">
          <MatrixCellView cell={option} />
        </div>
      );
    case 'polyomino':
      return (
        <div className="w-13 h-13 sm:w-20 sm:h-20 mx-auto">
          <PolyominoView data={option} />
        </div>
      );
    case 'paperfold':
      return (
        <div className="w-13 h-13 sm:w-20 sm:h-20 mx-auto">
          <PaperFoldOptionView data={option} />
        </div>
      );
    case 'cubeview':
      return (
        <div className="w-15 h-15 sm:w-22 sm:h-22 mx-auto">
          <CubeViewOptionSvg data={option} />
        </div>
      );
    case 'asymmetric':
      return (
        <div className="w-13 h-13 sm:w-20 sm:h-20 mx-auto">
          <AsymmetricGlyphSvg data={option} />
        </div>
      );
    case 'slots':
      return (
        <div className="w-full max-w-[92px] sm:max-w-[140px] h-9 sm:h-14 mx-auto">
          <SequenceSlotsSvg data={option} />
        </div>
      );
    case 'quadrant':
      return (
        <div className="w-13 h-13 sm:w-20 sm:h-20 mx-auto">
          <QuadrantDialSvg data={option} />
        </div>
      );
    case 'dualtoken':
      return (
        <div className="w-13 h-13 sm:w-20 sm:h-20 mx-auto">
          <DualTokenGridSvg data={option} />
        </div>
      );
    case 'clockring':
      return (
        <div className="w-13 h-13 sm:w-20 sm:h-20 mx-auto">
          <ClockRingSvg data={option} />
        </div>
      );
    case 'text':
      return (
        <div className="flex flex-col items-center justify-center min-h-[2.5rem] sm:min-h-[3.5rem] px-1 text-center">
          <span className="font-mono text-xs sm:text-lg font-semibold text-slate-900 tabular-nums leading-tight">
            {option.label}
          </span>
          {option.sublabel && (
            <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-mono">
              {option.sublabel}
            </span>
          )}
        </div>
      );
  }
}

function WeightIcon({ kind }: { kind: 'circle' | 'square' | 'triangle' }) {
  if (kind === 'circle') {
    return (
      <svg viewBox="0 0 28 28" className="w-5 h-5 sm:w-6 sm:h-6">
        <circle cx={14} cy={14} r={10} fill="#1D4ED8" stroke="#0F172A" strokeWidth={2} />
      </svg>
    );
  }
  if (kind === 'square') {
    return (
      <svg viewBox="0 0 28 28" className="w-5 h-5 sm:w-6 sm:h-6">
        <rect x={4} y={4} width={20} height={20} rx={2} fill="#0F172A" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 28 28" className="w-5 h-5 sm:w-6 sm:h-6">
      <polygon points="14,3 25,24 3,24" fill="#0891B2" stroke="#0F172A" strokeWidth={1.8} strokeLinejoin="round" />
    </svg>
  );
}

export function StimulusRenderer({ stimulus }: { stimulus: StimulusPayload }) {
  switch (stimulus.type) {
    case 'matrix3x3': {
      return (
        <div
          className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full max-w-[186px] sm:max-w-[300px] mx-auto"
          aria-label="3×3 görsel mantık matrisi"
        >
          {stimulus.cells.map((cell, idx) => (
            <div
              key={idx}
              className="aspect-square bg-white border border-slate-200 rounded-md sm:rounded-lg p-1 sm:p-2 flex items-center justify-center"
            >
              <MatrixCellView cell={cell} />
            </div>
          ))}
          <div className="aspect-square bg-blue-50/70 border-2 border-dashed border-blue-500 rounded-md sm:rounded-lg flex items-center justify-center">
            <span className="font-mono text-lg sm:text-2xl font-bold text-blue-700">?</span>
          </div>
        </div>
      );
    }

    case 'odd-one-out': {
      return (
        <div className="text-center max-w-sm py-3 sm:py-8 px-3">
          <div className="font-mono text-xs uppercase tracking-wider text-blue-700 font-semibold">
            Görsel Ayırt Etme
          </div>
          <p className="text-xs sm:text-sm text-slate-700 mt-1.5 leading-relaxed">
            {stimulus.caption}
          </p>
        </div>
      );
    }

    case 'rotation': {
      return (
        <div className="flex flex-col items-center gap-2 py-1">
          <div className="w-28 h-28 sm:w-40 sm:h-40 bg-white border border-slate-200 rounded-xl p-2 sm:p-3">
            <PolyominoView data={stimulus.reference} />
          </div>
          <p className="text-[11px] sm:text-xs font-mono text-slate-600">{stimulus.instruction}</p>
        </div>
      );
    }

    case 'mirror': {
      return (
        <div className="flex items-center justify-center gap-4 sm:gap-6 py-1 sm:py-3">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-24 h-24 sm:w-36 sm:h-36 bg-white border border-slate-200 rounded-xl p-1.5 sm:p-2">
              <AsymmetricGlyphSvg data={stimulus.reference} />
            </div>
            <span className="text-[11px] font-mono text-slate-500">Referans</span>
          </div>
          {stimulus.axis === 'vertical' ? (
            <div className="flex flex-col items-center gap-1">
              <div className="h-24 sm:h-32 border-l-2 border-dashed border-blue-600" />
              <span className="text-[11px] font-mono text-blue-700 font-semibold">Ayna</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono text-lg sm:text-xl text-blue-700 font-bold">↻ 180°</span>
              <span className="text-[11px] font-mono text-slate-500">Yarım Tur</span>
            </div>
          )}
        </div>
      );
    }

    case 'paperfold': {
      if (stimulus.folds === 'one-fold-r') {
        return (
          <div className="flex items-center justify-center gap-3 sm:gap-5 py-1 sm:py-3">
            <div className="flex flex-col items-center gap-1">
              <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-28 sm:h-28 bg-white border border-slate-200 rounded-lg p-1">
                <rect x={12} y={12} width={76} height={76} fill="#F8FAFC" stroke="#0F172A" strokeWidth={2} />
                <line x1={50} y1={12} x2={50} y2={88} stroke="#1D4ED8" strokeWidth={2} strokeDasharray="4 3" />
                <path d="M 22 50 L 44 50 M 39 45 L 44 50 L 39 55" stroke="#1D4ED8" strokeWidth={2} fill="none" />
              </svg>
              <span className="text-[11px] sm:text-xs font-mono text-slate-500">1. Sağa katla</span>
            </div>
            <span className="text-slate-400 font-mono" aria-hidden="true">→</span>
            <div className="flex flex-col items-center gap-1">
              <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-28 sm:h-28 bg-white border border-slate-200 rounded-lg p-1">
                <rect x={12} y={12} width={38} height={76} fill="none" stroke="#CBD5E1" strokeWidth={1.2} strokeDasharray="3 3" />
                <rect x={50} y={12} width={38} height={76} fill="#DBEAFE" stroke="#0F172A" strokeWidth={2} />
                <circle cx={69} cy={31} r={4.5} fill="#1D4ED8" stroke="#0F172A" strokeWidth={1.2} />
                <circle cx={59} cy={67} r={4.5} fill="#1D4ED8" stroke="#0F172A" strokeWidth={1.2} />
              </svg>
              <span className="text-[11px] sm:text-xs font-mono text-slate-500">2. İki delik aç</span>
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-1 sm:py-3">
          <div className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 100 100" className="w-18 h-18 sm:w-24 sm:h-24 bg-white border border-slate-200 rounded-lg p-1">
              <rect x={12} y={12} width={76} height={76} fill="#F8FAFC" stroke="#0F172A" strokeWidth={2} />
              <line x1={12} y1={50} x2={88} y2={50} stroke="#1D4ED8" strokeWidth={2} strokeDasharray="4 3" />
              <path d="M 50 22 L 50 42 M 45 37 L 50 42 L 55 37" stroke="#1D4ED8" strokeWidth={2} fill="none" />
            </svg>
            <span className="text-[10px] sm:text-xs font-mono text-slate-500">1. Aşağı</span>
          </div>
          <span className="text-slate-400 font-mono text-xs" aria-hidden="true">→</span>
          <div className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 100 100" className="w-18 h-18 sm:w-24 sm:h-24 bg-white border border-slate-200 rounded-lg p-1">
              <rect x={12} y={12} width={76} height={38} fill="none" stroke="#CBD5E1" strokeWidth={1.2} strokeDasharray="3 3" />
              <rect x={12} y={50} width={76} height={38} fill="#EFF6FF" stroke="#0F172A" strokeWidth={2} />
              <line x1={50} y1={50} x2={50} y2={88} stroke="#1D4ED8" strokeWidth={2} strokeDasharray="4 3" />
              <path d="M 24 69 L 44 69 M 39 64 L 44 69 L 39 74" stroke="#1D4ED8" strokeWidth={2} fill="none" />
            </svg>
            <span className="text-[10px] sm:text-xs font-mono text-slate-500">2. Sağa</span>
          </div>
          <span className="text-slate-400 font-mono text-xs" aria-hidden="true">→</span>
          <div className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 100 100" className="w-18 h-18 sm:w-24 sm:h-24 bg-white border border-slate-200 rounded-lg p-1">
              <rect x={12} y={12} width={76} height={76} fill="none" stroke="#E2E8F0" strokeWidth={1.2} strokeDasharray="3 3" />
              <rect x={50} y={50} width={38} height={38} fill="#DBEAFE" stroke="#0F172A" strokeWidth={2} />
              <circle cx={59} cy={59} r={4.5} fill="#1D4ED8" stroke="#0F172A" strokeWidth={1} />
              <circle cx={79} cy={79} r={4.5} fill="#1D4ED8" stroke="#0F172A" strokeWidth={1} />
            </svg>
            <span className="text-[10px] sm:text-xs font-mono text-slate-500">3. Delik aç</span>
          </div>
        </div>
      );
    }

    case 'cubenet': {
      const f = stimulus.faces;
      const cellBox = (sym: CubeSymbol, label?: string) => (
        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white border border-slate-800 flex items-center justify-center relative">
          <svg viewBox="0 0 36 36" className="w-7 h-7 sm:w-10 sm:h-10">
            <CubeFaceSymbol symbol={sym} size={36} />
          </svg>
          {label && (
            <span className="hidden sm:inline absolute bottom-0.5 right-1 text-[9px] font-mono text-slate-500">
              {label}
            </span>
          )}
        </div>
      );
      return (
        <div className="flex flex-col items-center py-1">
          <div className="grid grid-cols-3 gap-0 w-fit">
            <div className="w-10 h-10 sm:w-14 sm:h-14" />
            {cellBox(f.top, 'Üst')}
            <div className="w-10 h-10 sm:w-14 sm:h-14" />

            {cellBox(f.left, 'Sol')}
            {cellBox(f.center, 'Ön')}
            {cellBox(f.right, 'Sağ')}

            <div className="w-10 h-10 sm:w-14 sm:h-14" />
            {cellBox(f.bottom, 'Alt')}
            <div className="w-10 h-10 sm:w-14 sm:h-14" />

            <div className="w-10 h-10 sm:w-14 sm:h-14" />
            {cellBox(f.back, 'Arka')}
            <div className="w-10 h-10 sm:w-14 sm:h-14" />
          </div>
        </div>
      );
    }

    case 'numseq': {
      return (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 py-2 sm:py-6">
          {stimulus.values.map((val, idx) => {
            const isUnknown = val === '?';
            return (
              <React.Fragment key={idx}>
                <div
                  className={`min-w-[2.5rem] sm:min-w-[3.5rem] h-10 sm:h-14 px-2 sm:px-3 rounded-lg flex items-center justify-center font-mono text-base sm:text-xl font-semibold tabular-nums ${
                    isUnknown
                      ? 'bg-blue-50 border-2 border-dashed border-blue-500 text-blue-700'
                      : 'bg-white border border-slate-200 text-slate-900'
                  }`}
                >
                  {val}
                </div>
                {idx < stimulus.values.length - 1 && (
                  <span className="text-slate-400 font-mono text-xs sm:text-base" aria-hidden="true">
                    ,
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      );
    }

    case 'nummatrix': {
      return (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 w-full max-w-[180px] sm:max-w-[260px] mx-auto my-1">
          {stimulus.values.map((val, idx) => (
            <div
              key={idx}
              className="aspect-square bg-white border border-slate-200 rounded-md sm:rounded-lg flex items-center justify-center font-mono text-lg sm:text-2xl font-semibold text-slate-900 tabular-nums"
            >
              {val}
            </div>
          ))}
          <div className="aspect-square bg-blue-50/70 border-2 border-dashed border-blue-500 rounded-md sm:rounded-lg flex items-center justify-center font-mono text-lg sm:text-2xl font-bold text-blue-700">
            ?
          </div>
        </div>
      );
    }

    case 'numtriangles': {
      return (
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-1 sm:py-3">
          {stimulus.triangles.map((t, idx) => (
            <svg key={idx} viewBox="0 0 130 115" className="w-24 h-20 sm:w-32 sm:h-28">
              <polygon
                points="20,24 110,24 65,98"
                fill="#FFFFFF"
                stroke="#0F172A"
                strokeWidth={2}
                strokeLinejoin="round"
              />
              <circle cx={20} cy={24} r={14} fill="#F1F5F9" stroke="#0F172A" strokeWidth={1.8} />
              <text x={20} y={29} textAnchor="middle" className="fill-slate-900 font-mono text-[13px] font-semibold">
                {t.left}
              </text>
              <circle cx={110} cy={24} r={14} fill="#F1F5F9" stroke="#0F172A" strokeWidth={1.8} />
              <text x={110} y={29} textAnchor="middle" className="fill-slate-900 font-mono text-[13px] font-semibold">
                {t.right}
              </text>
              <circle cx={65} cy={98} r={14} fill="#F1F5F9" stroke="#0F172A" strokeWidth={1.8} />
              <text x={65} y={103} textAnchor="middle" className="fill-slate-900 font-mono text-[13px] font-semibold">
                {t.bottom}
              </text>
              <text
                x={65}
                y={54}
                textAnchor="middle"
                className={`font-mono text-[18px] font-bold ${t.center === '?' ? 'fill-blue-700' : 'fill-slate-900'}`}
              >
                {t.center}
              </text>
            </svg>
          ))}
        </div>
      );
    }

    case 'scale': {
      return (
        <div className="flex flex-col gap-1.5 sm:gap-3 max-w-md w-full mx-auto py-1">
          {stimulus.equations.map((eq, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-3 py-1.5 sm:px-4 sm:py-3 bg-white border border-slate-200 rounded-lg"
            >
              <div className="flex items-center gap-1 min-w-[72px] justify-center">
                {eq.left.map((item, i) => (
                  <WeightIcon key={i} kind={item} />
                ))}
              </div>
              <span className="font-mono text-base sm:text-lg font-semibold text-slate-400">=</span>
              <div className="flex items-center gap-1 min-w-[72px] justify-center">
                {eq.right.map((item, i) => (
                  <WeightIcon key={i} kind={item} />
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-1.5 sm:px-4 sm:py-3 bg-blue-50/50 border border-blue-300 rounded-lg">
            <div className="flex items-center gap-1 min-w-[72px] justify-center">
              {stimulus.targetLeft.map((item, i) => (
                <WeightIcon key={i} kind={item} />
              ))}
            </div>
            <span className="font-mono text-base sm:text-lg font-semibold text-blue-600">=</span>
            <div className="min-w-[72px] flex justify-center">
              <span className="font-mono text-lg sm:text-xl font-bold text-blue-700">?</span>
            </div>
          </div>
        </div>
      );
    }

    case 'quadrant-seq': {
      return (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-1 sm:py-4">
          {stimulus.steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white border border-slate-200 rounded-lg sm:rounded-xl p-1">
                <QuadrantDialSvg data={step} />
              </div>
              <span className="text-slate-400 font-mono text-xs sm:text-sm" aria-hidden="true">→</span>
            </React.Fragment>
          ))}
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50/70 border-2 border-dashed border-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
            <span className="font-mono text-lg sm:text-xl font-bold text-blue-700">?</span>
          </div>
        </div>
      );
    }

    case 'cipher-ops': {
      return (
        <div className="flex flex-col items-center gap-3 sm:gap-6 py-1 sm:py-4 w-full">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-md">
            {stimulus.legend.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-lg p-2 sm:p-3 flex flex-col items-center gap-1"
              >
                <WeightIcon kind={item.symbol} />
                <span className="font-mono text-[11px] sm:text-xs font-semibold text-slate-800 whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-mono text-base sm:text-xl font-bold text-slate-900">
              {stimulus.startValue}
            </div>
            {stimulus.chain.map((sym, idx) => (
              <React.Fragment key={idx}>
                <span className="text-slate-400 font-mono text-xs sm:text-base" aria-hidden="true">→</span>
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                  <WeightIcon kind={sym} />
                </div>
              </React.Fragment>
            ))}
            <span className="text-slate-400 font-mono text-xs sm:text-base" aria-hidden="true">=</span>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg bg-blue-50 border-2 border-dashed border-blue-500 flex items-center justify-center font-mono text-base sm:text-xl font-bold text-blue-700">
              ?
            </div>
          </div>
        </div>
      );
    }

    case 'gridpath': {
      const cols = ['A', 'B', 'C', 'D'] as const;
      const rows = [1, 2, 3, 4] as const;
      return (
        <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 py-1 w-full">
          <div className="bg-white border border-slate-200 rounded-lg sm:rounded-xl p-1.5 sm:p-3 shrink-0">
            <div className="grid grid-cols-5 gap-0.5 sm:gap-1 text-center font-mono text-[10px] sm:text-xs">
              <div className="w-4 h-4 sm:w-7 sm:h-6" />
              {cols.map((c) => (
                <div key={c} className="w-6 h-4 sm:w-9 sm:h-6 flex items-center justify-center text-slate-500 font-semibold">
                  {c}
                </div>
              ))}
              {rows.map((r) => (
                <React.Fragment key={r}>
                  <div className="w-4 h-6 sm:w-7 sm:h-9 flex items-center justify-center text-slate-500 font-semibold">
                    {r}
                  </div>
                  {cols.map((c) => {
                    const isStart = c === stimulus.startCol && r === stimulus.startRow;
                    return (
                      <div
                        key={`${c}${r}`}
                        className={`w-6 h-6 sm:w-9 sm:h-9 rounded border flex items-center justify-center text-xs ${
                          isStart
                            ? 'bg-blue-700 border-blue-800 text-white font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-300'
                        }`}
                      >
                        {isStart ? '↑' : ''}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1 sm:gap-2 min-w-0">
            {stimulus.commands.map((cmd, idx) => (
              <div
                key={idx}
                className="px-2 py-1 sm:px-3.5 sm:py-2 bg-white border border-slate-200 rounded-md sm:rounded-lg text-[11px] sm:text-sm text-slate-800 leading-tight"
              >
                {cmd}
              </div>
            ))}
          </div>
        </div>
      );
    }

    case 'slots-seq': {
      return (
        <div className="flex flex-col gap-1.5 sm:gap-3 w-full max-w-sm py-1">
          {stimulus.steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-3 py-1 sm:px-4 sm:py-2 bg-white border border-slate-200 rounded-lg sm:rounded-xl"
            >
              <span className="font-mono text-[11px] sm:text-xs text-slate-500">
                {idx + 1}. Adım
              </span>
              <div className="w-28 h-8 sm:w-36 sm:h-12">
                <SequenceSlotsSvg data={step} />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between px-3 py-1.5 sm:px-4 sm:py-2.5 bg-blue-50/60 border-2 border-dashed border-blue-400 rounded-lg sm:rounded-xl">
            <span className="font-mono text-[11px] sm:text-xs text-blue-700 font-semibold">
              4. Adım
            </span>
            <span className="font-mono text-base sm:text-xl font-bold text-blue-700 pr-10 sm:pr-14">?</span>
          </div>
        </div>
      );
    }

    case 'dualtoken-seq': {
      return (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-1 sm:py-4">
          {stimulus.steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white border border-slate-200 rounded-lg sm:rounded-xl p-1">
                <DualTokenGridSvg data={step} />
              </div>
              <span className="text-slate-400 font-mono text-xs sm:text-sm" aria-hidden="true">→</span>
            </React.Fragment>
          ))}
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50/70 border-2 border-dashed border-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
            <span className="font-mono text-lg sm:text-xl font-bold text-blue-700">?</span>
          </div>
        </div>
      );
    }

    case 'clockring-seq': {
      return (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-1 sm:py-4">
          {stimulus.steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white border border-slate-200 rounded-lg sm:rounded-xl p-1">
                <ClockRingSvg data={step} />
              </div>
              <span className="text-slate-400 font-mono text-xs sm:text-sm" aria-hidden="true">→</span>
            </React.Fragment>
          ))}
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-50/70 border-2 border-dashed border-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center">
            <span className="font-mono text-lg sm:text-xl font-bold text-blue-700">?</span>
          </div>
        </div>
      );
    }
  }
}
