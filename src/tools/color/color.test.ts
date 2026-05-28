import { describe, it, expect } from 'vitest'
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, parseColor } from './color'

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
})
