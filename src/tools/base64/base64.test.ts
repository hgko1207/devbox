import { describe, it, expect } from 'vitest'
import { encodeBase64, decodeBase64 } from './base64'

describe('base64', () => {
  it('ASCII round-trip', () => {
    expect(encodeBase64('hello')).toBe('aGVsbG8=')
    expect(decodeBase64('aGVsbG8=')).toBe('hello')
  })

  it('UTF-8 한글·이모지 round-trip', () => {
    const s = '안녕하세요 😀'
    expect(decodeBase64(encodeBase64(s))).toBe(s)
  })

  it('URL-safe: +/ 제거 + 패딩 제거, 디코드 시 복원', () => {
    const s = '???>>>'
    const std = encodeBase64(s)
    const safe = encodeBase64(s, true)
    expect(safe).not.toContain('+')
    expect(safe).not.toContain('/')
    expect(safe).not.toContain('=')
    expect(decodeBase64(safe)).toBe(s)
    expect(decodeBase64(std)).toBe(s)
  })

  it('공백 무시', () => {
    expect(decodeBase64('aGVs bG8=\n')).toBe('hello')
  })

  it('잘못된 문자 → 한국어 오류', () => {
    expect(() => decodeBase64('@@@@')).toThrow(/Base64 가 아닌/)
  })

  it('잘못된 길이 → 한국어 오류', () => {
    expect(() => decodeBase64('aGVsbG8')).not.toThrow() // pad 3 보정됨
    expect(() => decodeBase64('a')).toThrow(/길이/)
  })
})
