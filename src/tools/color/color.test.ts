import { describe, it, expect } from 'vitest'
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  parseColor,
  rgbToOklch,
  oklchToRgb,
  formatOklch,
  scheme,
  ramp,
  contrastRatio,
  wcag,
  relativeLuminance,
} from './color'

describe('color', () => {
  it('hex 3자리/6자리', () => {
    expect(hexToRgb('#abc')).toEqual({ r: 170, g: 187, b: 204 })
    expect(hexToRgb('#7c3aed')).toEqual({ r: 124, g: 58, b: 237 })
  })

  it('hex 잘못된 형식 → 한국어 오류', () => {
    expect(() => hexToRgb('#xyz')).toThrow(/HEX/)
  })

  it('rgb ↔ hex round-trip', () => {
    const rgb = { r: 124, g: 58, b: 237 }
    expect(rgbToHex(rgb)).toBe('#7c3aed')
    expect(hexToRgb('#7c3aed')).toEqual(rgb)
  })

  it('회색은 hsl s=0', () => {
    expect(rgbToHsl({ r: 128, g: 128, b: 128 })).toEqual({ h: 0, s: 0, l: 50 })
    expect(hslToRgb({ h: 0, s: 0, l: 50 })).toEqual({ r: 128, g: 128, b: 128 })
  })

  it('parseColor 자동 감지 — HEX/RGB/HSL', () => {
    expect(parseColor('#7c3aed')).toEqual({ r: 124, g: 58, b: 237 })
    expect(parseColor('rgb(124,58,237)')).toEqual({ r: 124, g: 58, b: 237 })
    expect(parseColor('124,58,237')).toEqual({ r: 124, g: 58, b: 237 })
    // hsl(262, 83%, 58%) ≈ #7c3aed 근사
    const fromHsl = parseColor('hsl(262,83%,58%)')
    expect(fromHsl.r).toBeGreaterThan(100)
  })

  it('parseColor 잘못된 입력 → 한국어 오류', () => {
    expect(() => parseColor('not-a-color')).toThrow(/형식/)
  })

  it('OKLCH round-trip — 대표 색상 4종', () => {
    const colors = [
      { r: 124, g: 58, b: 237 }, // violet
      { r: 255, g: 0, b: 0 }, // pure red
      { r: 0, g: 128, b: 0 }, // green
      { r: 200, g: 200, b: 200 }, // light gray
    ]
    for (const c of colors) {
      const o = rgbToOklch(c)
      const back = oklchToRgb(o)
      // OKLCH 는 부동소수점 변환이라 ±1 허용
      expect(Math.abs(back.r - c.r)).toBeLessThanOrEqual(1)
      expect(Math.abs(back.g - c.g)).toBeLessThanOrEqual(1)
      expect(Math.abs(back.b - c.b)).toBeLessThanOrEqual(1)
    }
  })

  it('formatOklch — CSS 표준 형식', () => {
    const o = rgbToOklch({ r: 124, g: 58, b: 237 })
    const s = formatOklch(o)
    expect(s).toMatch(/^oklch\(\d*\.?\d+ \d*\.?\d+ \d*\.?\d+\)$/)
  })

  it('parseColor — OKLCH', () => {
    const rgb = parseColor('oklch(0.6 0.24 293)')
    // 보라 계열 결과
    expect(rgb.r).toBeGreaterThan(0)
    expect(rgb.b).toBeGreaterThan(rgb.g)
  })

  it('scheme — 보색은 2색 (베이스 + 반대편)', () => {
    const r = scheme('complementary', { r: 124, g: 58, b: 237 })
    expect(r).toHaveLength(2)
  })

  it('scheme — 삼각 3색, 사각 4색, 유사 3색', () => {
    const base = { r: 124, g: 58, b: 237 }
    expect(scheme('triadic', base)).toHaveLength(3)
    expect(scheme('tetradic', base)).toHaveLength(4)
    expect(scheme('analogous', base)).toHaveLength(3)
    expect(scheme('split', base)).toHaveLength(3)
    expect(scheme('monochromatic', base)).toHaveLength(5)
  })

  it('ramp — 11단계, 500이 베이스에 가장 가까움', () => {
    const base = { r: 124, g: 58, b: 237 }
    const steps = ramp(base)
    expect(steps).toHaveLength(11)
    expect(steps.map((s) => s.step)).toEqual([
      50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
    ])
    // 가장 밝은 단계는 가장 어두운 단계보다 명도가 높아야 함
    expect(relativeLuminance(steps[0].rgb)).toBeGreaterThan(
      relativeLuminance(steps[10].rgb),
    )
  })

  it('WCAG 대비 — 흰색 vs 검정 = 21:1', () => {
    const r = contrastRatio({ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 })
    expect(r).toBeCloseTo(21, 0)
  })

  it('WCAG — 동일 색상 = 1:1, 모두 실패', () => {
    const c = { r: 124, g: 58, b: 237 }
    const result = wcag(c, c)
    expect(result.ratio).toBeCloseTo(1, 1)
    expect(result.aaNormal).toBe(false)
    expect(result.aaaNormal).toBe(false)
  })

  it('WCAG — 흰 배경 + 진한 보라 = AA 통과', () => {
    const r = wcag({ r: 109, g: 40, b: 217 }, { r: 255, g: 255, b: 255 })
    expect(r.aaNormal).toBe(true)
  })
})
