export type HangulWritingItem = {
  glyph: string;
  label: string;
};

// Kept separate from HangulLessonContent so we can drive the writing flow
// without touching the lesson content data the user already finalized.
export const HANGUL_WRITING_SEQUENCE: HangulWritingItem[] = [
  { glyph: '\u3131', label: '\u3131 (k/g)' },
  { glyph: '\u3134', label: '\u3134 (n)' },
  { glyph: '\u3137', label: '\u3137 (d/t)' },
  { glyph: '\u3139', label: '\u3139 (r/l)' },
  { glyph: '\u3141', label: '\u3141 (m)' },
  { glyph: '\u3142', label: '\u3142 (b)' },
  { glyph: '\u3145', label: '\u3145 (s)' },
  { glyph: '\u3147', label: '\u3147 (ng)' },
  { glyph: '\u3148', label: '\u3148 (j)' },
  { glyph: '\u314A', label: '\u314A (ch)' },
  { glyph: '\u3132', label: '\u3132 (k)' },
  { glyph: '\u314B', label: '\u314B (t)' },
  { glyph: '\u314C', label: '\u314C (p)' },
  { glyph: '\u314D', label: '\u314D (h)' },
  { glyph: '\u314F', label: '\u314F (a)' },
  { glyph: '\u3151', label: '\u3151 (ya)' },
  { glyph: '\u3153', label: '\u3153 (eo)' },
  { glyph: '\u3155', label: '\u3155 (yeo)' },
  { glyph: '\u3157', label: '\u3157 (o)' },
  { glyph: '\u315B', label: '\u315B (yo)' },
  { glyph: '\u315C', label: '\u315C (u)' },
  { glyph: '\u3160', label: '\u3160 (yu)' },
  { glyph: '\u3161', label: '\u3161 (eu)' },
  { glyph: '\u3163', label: '\u3163 (i)' },
  { glyph: '\u3138', label: '\u3138 (tt)' },
  { glyph: '\u3143', label: '\u3143 (pp)' },
  { glyph: '\u3146', label: '\u3146 (ss)' },
  { glyph: '\u3149', label: '\u3149 (jj)' },
  { glyph: '\u3132', label: '\u3132 (kk)' },
  { glyph: '\u3150', label: '\u3150 (ae)' },
  { glyph: '\u3152', label: '\u3152 (yae)' },
  { glyph: '\u3154', label: '\u3154 (e)' },
  { glyph: '\u3156', label: '\u3156 (ye)' },
  { glyph: '\u3158', label: '\u3158 (wa)' },
  { glyph: '\u3159', label: '\u3159 (wae)' },
  { glyph: '\u315A', label: '\u315A (oe)' },
  { glyph: '\u315D', label: '\u315D (wo)' },
  { glyph: '\u315E', label: '\u315E (we)' },
  { glyph: '\u315F', label: '\u315F (wi)' },
  { glyph: '\u3162', label: '\u3162 (ui)' },
];

export const getHangulWritingIndex = (glyph?: string, label?: string) => {
  if (label) {
    const indexByLabel = HANGUL_WRITING_SEQUENCE.findIndex((item) => item.label === label);
    if (indexByLabel >= 0) {
      return indexByLabel;
    }
  }

  if (glyph) {
    const indexByGlyph = HANGUL_WRITING_SEQUENCE.findIndex((item) => item.glyph === glyph);
    if (indexByGlyph >= 0) {
      return indexByGlyph;
    }
  }

  return 0;
};

export const getHangulWritingItemAt = (index: number) =>
  HANGUL_WRITING_SEQUENCE[Math.max(0, Math.min(index, HANGUL_WRITING_SEQUENCE.length - 1))];
