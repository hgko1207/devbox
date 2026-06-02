import { describe, it, expect } from 'vitest'
import { validateBrn, formatBrn, generateBrn } from './brn'

describe('brn', () => {
  it('유효한 BRN (1000000009) 검증', () => {
    // 자릿수: 1,0,0,0,0,0,0,0,0,?
    // 가중치 합: 1×1 = 1, extra = 0, 체크 = (10-1)%10 = 9
    const r = validateBrn('100-00-00009')
    expect(r.ok).toBe(true)
    expect(r.normalized).toBe('1000000009')
    expect(r.computedCheck).toBe(9)
  })

  it('하이픈 없이도 동일 결과', () => {
    expect(validateBrn('1000000009').ok).toBe(true)
  })

  it('잘못된 체크섬은 실패', () => {
    const r = validateBrn('100-00-00000')
    expect(r.ok).toBe(false)
    expect(r.reason).toMatch(/체크섬/)
  })

  it('자릿수 부족', () => {
    const r = validateBrn('1234567')
    expect(r.ok).toBe(false)
    expect(r.reason).toMatch(/10자리/)
  })

  it('빈 입력', () => {
    const r = validateBrn('')
    expect(r.ok).toBe(false)
    expect(r.reason).toMatch(/입력/)
  })

  it('비숫자 문자 자동 제거', () => {
    expect(validateBrn(' 100. 00. 00009 ').ok).toBe(true)
  })

  it('formatBrn 단계별 포맷', () => {
    expect(formatBrn('1')).toBe('1')
    expect(formatBrn('100')).toBe('100')
    expect(formatBrn('10000')).toBe('100-00')
    expect(formatBrn('1000000009')).toBe('100-00-00009')
    expect(formatBrn('1000000009999')).toBe('100-00-00009') // 10자리로 제한
  })

  it('generateBrn 결과는 항상 유효', () => {
    for (let i = 0; i < 20; i++) {
      const brn = generateBrn()
      expect(validateBrn(brn).ok).toBe(true)
    }
  })

  it('사업자 종류 디코딩', () => {
    // 4-5번 자리: 81 → 영리법인 본점 (체크섬 계산 결과 8)
    const r = validateBrn('100-81-00008')
    expect(r.ok).toBe(true)
    expect(r.businessType).toMatch(/영리법인 본점/)
    // 4-5번 자리: 90 → 면세사업자 (체크섬 0)
    const r2 = validateBrn('100-90-00000')
    expect(r2.ok).toBe(true)
    expect(r2.businessType).toMatch(/면세/)
  })

  it('단계별 검증 과정이 노출됨', () => {
    const r = validateBrn('100-00-00009')
    expect(r.steps).toHaveLength(9)
    expect(r.steps?.[0]).toEqual({ digit: 1, weight: 1, product: 1 })
  })
})
