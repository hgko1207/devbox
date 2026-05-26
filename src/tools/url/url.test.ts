import { describe, it, expect } from 'vitest'
import { encodeUrl, decodeUrl } from './url'

describe('url', () => {
  it('인코드/디코드 round-trip (한글·특수문자)', () => {
    const s = '검색어 a&b=c/?#'
    expect(decodeUrl(encodeUrl(s))).toBe(s)
  })

  it('공백 → %20', () => {
    expect(encodeUrl('a b')).toBe('a%20b')
  })

  it('잘못된 % 시퀀스 → 한국어 오류', () => {
    expect(() => decodeUrl('%zz')).toThrow(/URL 인코딩/)
  })
})
