import { describe, it, expect } from 'vitest'
import { lineDiff, statsOf } from './text-diff'

describe('text-diff', () => {
  it('동일 텍스트 → 변경 0', () => {
    const d = lineDiff('a\nb\n', 'a\nb\n')
    const s = statsOf(d)
    expect(s.added).toBe(0)
    expect(s.removed).toBe(0)
  })

  it('한 줄 추가', () => {
    const d = lineDiff('a\nb\n', 'a\nb\nc\n')
    const s = statsOf(d)
    expect(s.added).toBe(1)
    expect(s.removed).toBe(0)
  })

  it('한 줄 삭제', () => {
    const d = lineDiff('a\nb\nc\n', 'a\nc\n')
    const s = statsOf(d)
    expect(s.removed).toBe(1)
    expect(s.added).toBe(0)
  })

  it('완전히 다른 텍스트', () => {
    const d = lineDiff('hello\n', 'world\n')
    const s = statsOf(d)
    expect(s.added + s.removed).toBeGreaterThanOrEqual(2)
  })

  it('한 줄 수정 (추가 1 + 삭제 1)', () => {
    const d = lineDiff('a\nb\nc\n', 'a\nB\nc\n')
    const s = statsOf(d)
    expect(s.added).toBe(1)
    expect(s.removed).toBe(1)
  })
})
