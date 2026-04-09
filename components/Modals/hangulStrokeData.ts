export type HangulStrokeGlyph = {
  strokes: string[];
  strokeWidth?: number;
};

const line = (x1: number, y1: number, x2: number, y2: number) => `M ${x1} ${y1} L ${x2} ${y2}`;
const poly = (...points: [number, number][]) =>
  points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
const arcDown = (x: number, y1: number, y2: number, hook = -6) =>
  `M ${x} ${y1} Q ${x + hook} ${y1 + 8} ${x} ${y1 + 16} L ${x} ${y2}`;
const arcRight = (x1: number, y: number, x2: number, lift = 0) =>
  `M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + lift} ${x2} ${y}`;
const leftDiag = (x1: number, y1: number, x2: number, y2: number, cx?: number, cy?: number) =>
  `M ${x1} ${y1} Q ${cx ?? x1 - 10} ${cy ?? (y1 + y2) / 2} ${x2} ${y2}`;
const rightDiag = (x1: number, y1: number, x2: number, y2: number, cx?: number, cy?: number) =>
  `M ${x1} ${y1} Q ${cx ?? x2 + 4} ${cy ?? (y1 + y2) / 2} ${x2} ${y2}`;
const circleStroke = () =>
  'M 60 22 C 38 22 22 40 22 60 C 22 82 38 98 60 98 C 82 98 98 82 98 60 C 98 40 82 22 60 22';

export const HANGUL_STROKE_DATA: Record<string, HangulStrokeGlyph> = {
  '\u3131': { strokes: ['M 24 25 Q 58 10 85 25 Q 105 45 55 95'] },
  '\u3132': { strokes: ['M 15 25 Q 60 15 60 30 Q 60 70 30 95', 'M 70 25 Q 100 15 108 30 Q 110 70 70 95' ] },
  '\u3134': { strokes: ['M 25 25 Q 18 80 40 80 Q 80 80 90 73'] },
  '\u3137': { strokes: [arcRight(25, 23, 92), 'M 25 25 Q 18 80 40 80 Q 80 80 90 73'] },
  '\u3138': { 
    strokes: [
      arcRight(10, 23, 45), 
      'M 10 25 Q 12 80 15 75 Q 15 80 50 75',
      arcRight(70, 23, 105), 
      'M 70 25 Q 72 80 72 75 Q 72 80 108 75',
    ] },
  '\u3139': {
    strokes: [
        'M 28 22 Q 58 8 82 22 Q 98 35 80 50',
        'M 32 50 Q 55 42 80 50',
        'M 32 50 Q 18 85 45 92 Q 75 95 92 82'
    ],
  },
  '\u3141': {
    strokes: [
    'M 25 25 Q 15 60 25 92',
    'M 25 25 Q 65 15 88 30 Q 100 60 88 92',
    'M 25 92 Q 60 100 88 92'
    ],
  },
  '\u3142': {
    strokes: [
      'M 30 30 Q 40 20 30 95', 
      'M 90 30 Q 100 30 90 95', 
      arcRight(35, 60, 88),
      arcRight(32, 95, 88),
    ],
  },
  '\u3143': {
    strokes: [
      'M 10 30 Q 20 20 10 95', 
      'M 50 30 Q 60 30 50 95', 
      arcRight(15, 60, 45),
      arcRight(13, 95, 47),
      'M 70 30 Q 80 20 70 95', 
      'M 108 30 Q 116 30 110 95', 
      arcRight(75, 60, 110),
      arcRight(73, 95, 106),

    ],
  },
'\u3145': {
  strokes: [
    'M 70 15 Q 85 45 25 95', 
    'M 68 48 Q 75 75 92 92',
  ],
},
  '\u3146': {
    strokes: [
      'M 30 20 Q 40 55 15 95', 
      'M 34 48 Q 45 75 60 75',
      'M 85 20 Q 90 55 68 95', 
      'M 86 48 Q 95 80 110 82',

    ],
  },
  '\u3147': { strokes: [circleStroke()] },
  '\u3148': {
    strokes: [
      'M 25 22 Q 60 25 95 20',
      'M 60 30 Q 65 80 30 95', 
      'M 61 48 Q 65 75 92 92',
    ],
  },
  '\u3149': {
    strokes: [
      'M 10 30 Q 15 33 50 30',
      'M 28 35 Q 25 80 10 95', 
      'M 27 48 Q 28 75 50 88',
      'M 75 30 Q 85 33 110 30',
      'M 95 35 Q 94 80 75 95', 
      'M 94 48 Q 98 88 110 92',

    ],
  },
  '\u314A': {
    strokes: [
      line(50, 7, 70, 10),
      'M 25 30 Q 60 35 95 25',
      'M 60 33 Q 65 80 30 95', 
      'M 61 48 Q 65 75 92 92',
    ],
  },
  '\u314B': { strokes: [arcRight(25, 23, 80), arcRight(25, 50, 70), 'M 25 25 Q 18 80 40 80 Q 80 80 90 73' ] },
  '\u314C': {
    strokes: [
      'M 25 22 Q 60 30 95 22',
      line(42, 30, 42, 80),
      line(78, 30, 78, 80),
      'M 28 92 Q 58 78 95 92',
    ],
  },
  '\u314D': {
    strokes: [
      line(50, 20, 65, 25),
      'M 30 35 Q 60 45 90 35',
      'M 60 55 Q 38 55 38 75 Q 38 95 60 95 Q 82 95 82 75 Q 82 55 60 55',
    ],
    strokeWidth: 11,
  },

  '\u314F': { strokes: [line(60, 20, 60, 100), arcRight(60, 58, 94)] },
  '\u3150': { strokes: [line(50, 20, 50, 100), arcRight(50, 58, 72), line(82, 20, 82, 100)] },
  '\u3151': { strokes: [line(56, 20, 56, 100), arcRight(56, 42, 90), arcRight(56, 72, 90)] },
  '\u3152': { strokes: [line(40, 20, 40, 100), arcRight(40, 42, 66), arcRight(40, 72, 66), line(75, 20, 75, 100)] },
  '\u3153': { strokes: [arcRight(24, 58, 58), line(60, 20, 60, 100)] },
  '\u3154': { strokes: [arcRight(24, 58, 58), line(60, 20, 60, 100), line(82, 20, 82, 100)] },
  '\u3155': { strokes: [arcRight(24, 42, 58), arcRight(24, 72, 58), line(60, 20, 60, 100)] },
  '\u3156': { strokes: [arcRight(30, 42, 52), arcRight(30, 72, 52), line(60, 20, 60, 100), line(84, 20, 84, 100)] },
  '\u3157': { strokes: [line(60, 24, 60, 54), arcRight(22, 56, 98)] },
  '\u3158': { strokes: [line(40, 50, 40, 80), arcRight(18, 80, 70), line(88, 20, 88, 100), arcRight(88, 58, 102)] },
  '\u3159': {
    strokes: [line(40, 50, 40, 80), arcRight(18, 80, 65), line(78, 20, 78, 100), arcRight(78, 60, 96), line(96, 20, 96, 100)],
  },
  '\u315A': { strokes: [line(40, 50, 40, 80), arcRight(18, 80, 65), line(85, 20, 85, 100)] },
  '\u315B': { strokes: [line(44, 24, 44, 54), line(76, 24, 76, 54), arcRight(18, 58, 102)] },
  '\u315C': { strokes: [arcRight(22, 50, 98), line(60, 50, 60, 85)] },
  '\u315D': { strokes: [arcRight(22, 60, 80), line(50, 60, 50, 90), arcRight(65, 80, 98), line(98, 20, 98, 100)] },
  '\u315E': {
    strokes: [arcRight(15, 60, 60), line(40, 60, 40, 90),  arcRight(54, 75, 82), line(82, 20, 82, 100), line(100, 20, 100, 100)],
  },
  '\u315F': { strokes: [arcRight(22, 60, 75), line(50, 60, 50, 90),  line(92, 20, 92, 100)] },
  '\u3160': { strokes: [arcRight(18, 50, 102), line(46, 50, 46, 100), line(76, 50, 76, 100)] },
  '\u3161': { strokes: [arcRight(24, 60, 96)] },
  '\u3162': { strokes: [arcRight(24, 80, 70), line(88, 20, 88, 100)] },
  '\u3163': { strokes: [line(60, 20, 60, 100)] },
};
