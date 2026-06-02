import { describe, it, expect } from 'vitest'
import { generate } from './lorem'
import { SENTENCES } from './corpus'

describe('lorem 한국어', () => {
  it('문장 1개 — 코퍼스에 있는 문장', () => {
    const out = generate({ unit: 'sentence', count: 1 })
    expect(SENTENCES).toContain(out)
  })

  it('문장 3개 — 마침표 3번 이상 (각 문장 끝에 .)', () => {
    const out = generate({ unit: 'sentence', count: 3 })
    expect(out.split('.').length - 1).toBeGreaterThanOrEqual(3)
  })

  it('단락 2개 — 빈 줄로 구분', () => {
    const out = generate({ unit: 'paragraph', count: 2 })
    expect(out).toContain('\n\n')
    const paragraphs = out.split('\n\n')
    expect(paragraphs).toHaveLength(2)
  })

  it('단어 10개 — 공백으로 분리한 10어절', () => {
    const out = generate({ unit: 'word', count: 10 })
    expect(out.split(/\s+/).filter(Boolean)).toHaveLength(10)
  })

  it('단어 50개', () => {
    const out = generate({ unit: 'word', count: 50 })
    expect(out.split(/\s+/).filter(Boolean)).toHaveLength(50)
  })

  it('개수 0 → 최소 1', () => {
    const out = generate({ unit: 'sentence', count: 0 })
    expect(out.length).toBeGreaterThan(0)
  })

  it('개수 1000 → 100으로 제한', () => {
    const out = generate({ unit: 'word', count: 1000 })
    expect(out.split(/\s+/).filter(Boolean)).toHaveLength(100)
  })
})
