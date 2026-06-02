// 색상 — HEX / RGB / HSL / OKLCH 변환 + 자동 배색 + 명도 단계 + WCAG 대비.

export interface Rgb {
  r: number
  g: number
  b: number
}

export interface Hsl {
  h: number
  s: number
  l: number
}

/** OKLCH — L: 0~1, C: 0~0.4 정도, h: 0~360 (도). */
export interface Oklch {
  l: number
  c: number
  h: number
}

// ─── HEX ↔ RGB ────────────────────────────────────────────────────────────

export function hexToRgb(input: string): Rgb {
  let s = input.trim().replace(/^#/, '')
  if (s.length === 3) {
    s = s
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (!/^[0-9a-fA-F]{6}$/.test(s)) {
    throw new Error('HEX 형식이 아닙니다 (예: #7c3aed 또는 #abc)')
  }
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16),
  }
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const to2 = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return '#' + to2(r) + to2(g) + to2(b)
}

// ─── RGB ↔ HSL ────────────────────────────────────────────────────────────

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const R = r / 255
  const G = g / 255
  const B = b / 255
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const l = (max + min) / 2
  let s = 0
  let h = 0
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === R) h = (G - B) / d + (G < B ? 6 : 0)
    else if (max === G) h = (B - R) / d + 2
    else h = (R - G) / d + 4
    h /= 6
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const H = (((h % 360) + 360) % 360) / 360
  const S = Math.max(0, Math.min(100, s)) / 100
  const L = Math.max(0, Math.min(100, l)) / 100
  if (S === 0) {
    const v = Math.round(L * 255)
    return { r: v, g: v, b: v }
  }
  const q = L < 0.5 ? L * (1 + S) : L + S - L * S
  const p = 2 * L - q
  const hue = (t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return {
    r: Math.round(hue(H + 1 / 3) * 255),
    g: Math.round(hue(H) * 255),
    b: Math.round(hue(H - 1 / 3) * 255),
  }
}

// ─── RGB ↔ OKLCH (Björn Ottosson 변환식) ──────────────────────────────────
// 지각적 균일 색공간. CSS Color 4 표준.

function srgbToLinear(c: number): number {
  const x = c / 255
  return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
}

function linearToSrgb(x: number): number {
  const y = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055
  return Math.round(Math.max(0, Math.min(1, y)) * 255)
}

export function rgbToOklch({ r, g, b }: Rgb): Oklch {
  const lr = srgbToLinear(r)
  const lg = srgbToLinear(g)
  const lb = srgbToLinear(b)

  const lp = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const mp = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const sp = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)

  const L = 0.2104542553 * lp + 0.793617785 * mp - 0.0040720468 * sp
  const A = 1.9779984951 * lp - 2.428592205 * mp + 0.4505937099 * sp
  const B = 0.0259040371 * lp + 0.7827717662 * mp - 0.808675766 * sp

  const c = Math.sqrt(A * A + B * B)
  let h = (Math.atan2(B, A) * 180) / Math.PI
  if (h < 0) h += 360

  return { l: L, c, h }
}

export function oklchToRgb({ l, c, h }: Oklch): Rgb {
  const hr = (h * Math.PI) / 180
  const A = Math.cos(hr) * c
  const B = Math.sin(hr) * c

  const lp = l + 0.3963377774 * A + 0.2158037573 * B
  const mp = l - 0.1055613458 * A - 0.0638541728 * B
  const sp = l - 0.0894841775 * A - 1.291485548 * B

  const lr_ = lp * lp * lp
  const lg_ = mp * mp * mp
  const lb_ = sp * sp * sp

  return {
    r: linearToSrgb(4.0767416621 * lr_ - 3.3077115913 * lg_ + 0.2309699292 * lb_),
    g: linearToSrgb(-1.2684380046 * lr_ + 2.6097574011 * lg_ - 0.3413193965 * lb_),
    b: linearToSrgb(-0.0041960863 * lr_ - 0.7034186147 * lg_ + 1.707614701 * lb_),
  }
}

/** CSS 표준 형식: `oklch(0.61 0.241 293.5)` — 소수점 셋째 자리. */
export function formatOklch({ l, c, h }: Oklch): string {
  return `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 1)})`
}

// ─── 통합 파서 ─────────────────────────────────────────────────────────────

/** 어떤 형식이든 자동 감지해 RGB 로 변환. 잘못된 입력이면 한국어 오류. */
export function parseColor(input: string): Rgb {
  const s = input.trim()
  if (s === '') throw new Error('색상을 입력하세요.')
  if (/^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(s)) return hexToRgb(s)

  const rgb =
    s.match(/^rgb\(?\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*\)?$/i) ||
    s.match(/^(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})$/)
  if (rgb) {
    const r = +rgb[1]
    const g = +rgb[2]
    const b = +rgb[3]
    if ([r, g, b].some((v) => v < 0 || v > 255)) {
      throw new Error('RGB 값은 0~255 사이여야 합니다.')
    }
    return { r, g, b }
  }

  const hsl = s.match(/^hsl\(?\s*(\d{1,3})\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?\s*\)?$/i)
  if (hsl) {
    const h = +hsl[1]
    const sat = +hsl[2]
    const l = +hsl[3]
    if (h < 0 || h > 360 || sat < 0 || sat > 100 || l < 0 || l > 100) {
      throw new Error('HSL 범위 오류 (H 0~360, S/L 0~100).')
    }
    return hslToRgb({ h, s: sat, l })
  }

  const oklch = s.match(
    /^oklch\(?\s*(\d*\.?\d+)%?\s*[, ]\s*(\d*\.?\d+)\s*[, ]\s*(\d*\.?\d+)\s*\)?$/i,
  )
  if (oklch) {
    let L = +oklch[1]
    if (s.includes('%')) L = L / 100
    const C = +oklch[2]
    const H = +oklch[3]
    if (L < 0 || L > 1 || C < 0 || H < 0 || H > 360) {
      throw new Error('OKLCH 범위 오류 (L 0~1, C ≥ 0, h 0~360).')
    }
    return oklchToRgb({ l: L, c: C, h: H })
  }

  throw new Error(
    '색상 형식을 인식할 수 없습니다. 예: #7c3aed · rgb(124,58,237) · hsl(262,83%,58%) · oklch(0.5 0.24 293)',
  )
}

// ─── 자동 배색 (배색 이론 6종) ─────────────────────────────────────────────

export type SchemeKind =
  | 'complementary'
  | 'triadic'
  | 'analogous'
  | 'split'
  | 'tetradic'
  | 'monochromatic'

export const SCHEME_LABELS: Record<SchemeKind, string> = {
  complementary: '보색',
  triadic: '삼각 배색',
  analogous: '유사색',
  split: '분할 보색',
  tetradic: '사각 배색',
  monochromatic: '단색조',
}

function rotate(hsl: Hsl, deltaH: number): Hsl {
  return { h: (((hsl.h + deltaH) % 360) + 360) % 360, s: hsl.s, l: hsl.l }
}

export function scheme(kind: SchemeKind, base: Rgb): Rgb[] {
  const baseHsl = rgbToHsl(base)
  const make = (deltas: number[]): Rgb[] =>
    [0, ...deltas].map((d) => hslToRgb(rotate(baseHsl, d)))

  switch (kind) {
    case 'complementary':
      return make([180])
    case 'triadic':
      return make([120, 240])
    case 'analogous':
      return make([-30, 30])
    case 'split':
      return make([150, 210])
    case 'tetradic':
      return make([60, 180, 240])
    case 'monochromatic': {
      // 같은 색상에서 명도만 변화 — 5단계
      const ls = [-30, -15, 0, 15, 30]
      return ls.map((dl) =>
        hslToRgb({
          h: baseHsl.h,
          s: baseHsl.s,
          l: Math.max(5, Math.min(95, baseHsl.l + dl)),
        }),
      )
    }
  }
}

// ─── 명도 단계 (Tailwind-style 11 ramp) ────────────────────────────────────

export interface RampStep {
  step: number
  rgb: Rgb
  hex: string
}

/** 50/100/200/.../900/950 — 베이스 색상을 500 자리에 두는 근사 램프. */
export function ramp(base: Rgb): RampStep[] {
  const { h, s } = rgbToHsl(base)
  // Tailwind 스타일 lightness 분포 (대략)
  const steps: { step: number; l: number; sScale: number }[] = [
    { step: 50, l: 97, sScale: 0.5 },
    { step: 100, l: 94, sScale: 0.65 },
    { step: 200, l: 86, sScale: 0.8 },
    { step: 300, l: 76, sScale: 0.9 },
    { step: 400, l: 64, sScale: 0.95 },
    { step: 500, l: 52, sScale: 1.0 },
    { step: 600, l: 44, sScale: 1.0 },
    { step: 700, l: 36, sScale: 0.95 },
    { step: 800, l: 28, sScale: 0.85 },
    { step: 900, l: 18, sScale: 0.7 },
    { step: 950, l: 10, sScale: 0.55 },
  ]
  return steps.map(({ step, l, sScale }) => {
    const rgb = hslToRgb({ h, s: Math.round(s * sScale), l })
    return { step, rgb, hex: rgbToHex(rgb) }
  })
}

// ─── WCAG 대비 (W3C 2.x) ───────────────────────────────────────────────────

export function relativeLuminance({ r, g, b }: Rgb): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

/** W3C WCAG 2.x 대비비. 1 (동일) ~ 21 (검정 vs 흰색). */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export interface WcagResult {
  ratio: number
  /** 일반 텍스트 (4.5:1) */
  aaNormal: boolean
  /** 큰 텍스트 (3:1) */
  aaLarge: boolean
  /** UI 컴포넌트·그래픽 (3:1) */
  aaUi: boolean
  /** AAA 일반 (7:1) */
  aaaNormal: boolean
  /** AAA 큰 텍스트 (4.5:1) */
  aaaLarge: boolean
}

export function wcag(fg: Rgb, bg: Rgb): WcagResult {
  const r = contrastRatio(fg, bg)
  return {
    ratio: r,
    aaNormal: r >= 4.5,
    aaLarge: r >= 3,
    aaUi: r >= 3,
    aaaNormal: r >= 7,
    aaaLarge: r >= 4.5,
  }
}

// ─── 헬퍼 ──────────────────────────────────────────────────────────────────

function round(n: number, digits: number): number {
  const k = Math.pow(10, digits)
  return Math.round(n * k) / k
}
