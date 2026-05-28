// 색상 변환 (HEX / RGB / HSL).

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

  throw new Error(
    '색상 형식을 인식할 수 없습니다. 예: #7c3aed · rgb(124,58,237) · hsl(262,83%,58%)',
  )
}
