export type CognitiveDomain = 'Gf' | 'Gv' | 'Gq' | 'Gwm';

export type AssessmentMode = 'standard' | 'quick';

export type ShapeKind =
  | 'circle'
  | 'triangle'
  | 'square'
  | 'diamond'
  | 'pentagon'
  | 'hexagon';

export type FillMode = 'outline' | 'striped' | 'solid';

export interface MatrixShapeCell {
  kind: 'shape';
  shape: ShapeKind;
  fill: FillMode;
  rotation?: number;
  dots?: number;
  needleAngle?: number;
}

export interface MatrixDotGridCell {
  kind: 'dotgrid';
  /** Active dot indices in 3x3 grid (0..8) */
  active: number[];
}

export type MatrixCellData = MatrixShapeCell | MatrixDotGridCell;

export interface PolyominoOption {
  kind: 'polyomino';
  /** Grid coordinates [col, row] in 3x3 grid */
  cells: [number, number][];
  /** Highlighted anchor block [col, row] */
  anchor: [number, number];
}

export interface PaperFoldOption {
  kind: 'paperfold';
  /** Hole coordinates [x, y] in 0..100 normalized square */
  holes: [number, number][];
}

export type CubeSymbol =
  | 'filled-circle'
  | 'diagonal-slash'
  | 'square-outline'
  | 'triangle-up'
  | 'cross-plus'
  | 'two-dots';

export interface CubeViewOption {
  kind: 'cubeview';
  front: CubeSymbol;
  top: CubeSymbol;
  right: CubeSymbol;
}

export interface AsymmetricGlyphOption {
  kind: 'asymmetric';
  /** Stem direction in degrees: 0=up, 90=right, 180=down, 270=left */
  stemDir: 0 | 90 | 180 | 270;
  /** Flag side relative to stem when looking along stemDir */
  flagSide: 'left' | 'right';
  /** Accent dot corner in normalized 0..100 space */
  dotPos: 'tl' | 'tr' | 'bl' | 'br';
}

export interface TextValueOption {
  kind: 'text';
  label: string;
  sublabel?: string;
}

export interface ShapeSlot {
  shape: 'circle' | 'triangle' | 'square';
  fill: 'solid' | 'outline';
}

export interface SequenceSlotsOption {
  kind: 'slots';
  slots: ShapeSlot[];
}

export interface QuadrantDialOption {
  kind: 'quadrant';
  /** 0=TL, 1=TR, 2=BR, 3=BL */
  quadrant: 0 | 1 | 2 | 3;
  centerShape: 'circle' | 'triangle' | 'square';
}

export interface DualTokenGridOption {
  kind: 'dualtoken';
  /** Blue circle index 0..8 */
  circlePos: number;
  /** Dark square index 0..8 */
  squarePos: number;
}

export interface ClockRingOption {
  kind: 'clockring';
  /** 0..7 clockwise starting at 12 o'clock */
  pos: number;
  centerShape: 'circle' | 'triangle' | 'square';
  centerFill: 'solid' | 'outline';
}

export type OptionPayload =
  | MatrixCellData
  | PolyominoOption
  | PaperFoldOption
  | CubeViewOption
  | AsymmetricGlyphOption
  | TextValueOption
  | SequenceSlotsOption
  | QuadrantDialOption
  | DualTokenGridOption
  | ClockRingOption;

export type StimulusPayload =
  | {
      type: 'matrix3x3';
      cells: MatrixCellData[];
    }
  | {
      type: 'odd-one-out';
      caption: string;
    }
  | {
      type: 'rotation';
      reference: PolyominoOption;
      instruction: string;
    }
  | {
      type: 'mirror';
      reference: AsymmetricGlyphOption;
      axis: 'vertical' | 'horizontal';
    }
  | {
      type: 'paperfold';
      folds: 'one-fold-r' | 'two-fold-br';
    }
  | {
      type: 'cubenet';
      faces: {
        top: CubeSymbol;
        left: CubeSymbol;
        center: CubeSymbol;
        right: CubeSymbol;
        bottom: CubeSymbol;
        back: CubeSymbol;
      };
    }
  | {
      type: 'numseq';
      values: (number | string)[];
    }
  | {
      type: 'nummatrix';
      values: number[];
    }
  | {
      type: 'numtriangles';
      triangles: {
        left: number;
        right: number;
        bottom: number;
        center: number | '?';
      }[];
    }
  | {
      type: 'scale';
      equations: {
        left: ('circle' | 'square' | 'triangle')[];
        right: ('circle' | 'square' | 'triangle')[];
      }[];
      targetLeft: ('circle' | 'square' | 'triangle')[];
    }
  | {
      type: 'quadrant-seq';
      steps: QuadrantDialOption[];
    }
  | {
      type: 'cipher-ops';
      legend: { symbol: 'triangle' | 'circle' | 'square'; label: string }[];
      startValue: number;
      chain: ('triangle' | 'circle' | 'square')[];
    }
  | {
      type: 'gridpath';
      startCol: 'A' | 'B' | 'C' | 'D';
      startRow: 1 | 2 | 3 | 4;
      startDir: 'Kuzey' | 'Doğu' | 'Güney' | 'Batı';
      commands: string[];
    }
  | {
      type: 'slots-seq';
      steps: SequenceSlotsOption[];
    }
  | {
      type: 'dualtoken-seq';
      steps: DualTokenGridOption[];
    }
  | {
      type: 'clockring-seq';
      steps: ClockRingOption[];
    };

export interface IQQuestion {
  id: string;
  order: number;
  domain: CognitiveDomain;
  difficulty: number;
  discrimination: number;
  title: string;
  prompt: string;
  stimulus: StimulusPayload;
  options: OptionPayload[];
  correctIndex: number;
  explanation: string;
  ruleTag: string;
}

export interface UserResponse {
  questionId: string;
  selectedIndex: number | null;
  timeSpentMs: number;
}

export interface DomainScore {
  domain: CognitiveDomain;
  label: string;
  shortLabel: string;
  correctCount: number;
  totalCount: number;
  accuracy: number;
  scaledScore: number;
  domainIq: number;
  avgTimeSec: number;
}

export interface ItemDiagnostic {
  questionId: string;
  order: number;
  domain: CognitiveDomain;
  title: string;
  difficulty: number;
  selectedIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  timeSpentMs: number;
}

export interface PsychometricResult {
  id: string;
  participantName: string;
  completedAt: string;
  mode: AssessmentMode;
  iq: number;
  ciLow: number;
  ciHigh: number;
  sem: number;
  zScore: number;
  percentile: number;
  classification: string;
  classificationDesc: string;
  theta: number;
  correctCount: number;
  totalCount: number;
  totalTimeSec: number;
  avgTimeSec: number;
  domainScores: DomainScore[];
  diagnostics: ItemDiagnostic[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  iq: number;
  percentile: number;
  correctCount: number;
  totalCount: number;
  totalTimeSec: number;
  mode: AssessmentMode;
  completedAt: string;
  isBenchmark?: boolean;
  result?: PsychometricResult;
}
