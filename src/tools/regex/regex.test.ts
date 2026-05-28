import { describe, it, expect } from 'vitest'
import { findMatches } from './regex'

describe('regex', () => {
  it('단순 매치', () => {
    const m = findMatches('\\d+', '', 'abc 12 def 345')
    expect(m).toHaveLength(2)
    expect(m[0].match).toBe('12')
    expect(m[1].match).toBe('345')
  })

  it('캡처 그룹', () => {
    const m = findMatches('(\\w+)=(\\d+)', '', 'a=1 b=22')
    expect(m).toHaveLength(2)
    expect(m[0].groups).toEqual(['a', '1'])
    expect(m[1].groups).toEqual(['b', '22'])
  })

  it('i 플래그 — 대소문자 무시', () => {
    const m = findMatches('hello', 'i', 'Hello HELLO hello')
    expect(m).toHaveLength(3)
  })

  it('잘못된 패턴 → 한국어 오류', () => {
    expect(() => findMatches('[', '', 'x')).toThrow(/정규식 오류/)
  })

  it('zero-width 무한루프 방지', () => {
    const m = findMatches('a*', '', 'bbb')
    expect(m.length).toBeLessThanOrEqual(1)
  })
})
