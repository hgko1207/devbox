import { describe, it, expect } from 'vitest'
import { diffJson, summarize } from './diff'

describe('diffJson', () => {
  it('객체 add/remove/change + 중첩 경로', () => {
    const d = diffJson({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 }, e: 9 })
    const paths = d.map((x) => `${x.type}:${x.path}`).sort()
    expect(paths).toEqual(['added:e', 'changed:b.c'].sort())
  })

  it('joinKey: 비식별자 키는 ["..."] 표기', () => {
    const d = diffJson({ 'a b': 1 }, { 'a b': 2 })
    expect(d[0].path).toBe('["a b"]')
  })

  it('배열 인덱스 기반 — 맨 앞 삽입은 N개 변경으로 표시 (알려진 한계 고정)', () => {
    const d = diffJson([1, 2, 3], [0, 1, 2, 3])
    const added = d.filter((x) => x.type === 'added').length
    const changed = d.filter((x) => x.type === 'changed').length
    expect(added).toBe(1)
    expect(changed).toBe(3)
  })

  it('Object.is 엣지: NaN==NaN 차이 없음, 0 vs -0 차이 있음', () => {
    expect(diffJson(NaN, NaN)).toEqual([])
    expect(diffJson(0, -0)).toHaveLength(1)
  })

  it('동일한 값 → 빈 배열', () => {
    expect(diffJson({ a: [1, 2] }, { a: [1, 2] })).toEqual([])
  })

  it('타입이 바뀌면 changed (루트)', () => {
    const d = diffJson(1, '1')
    expect(d).toHaveLength(1)
    expect(d[0].type).toBe('changed')
  })
})

describe('summarize', () => {
  it('타입별 카운트', () => {
    // a 변경 · b 삭제 · c 추가
    const d = diffJson({ a: 1, b: 2 }, { a: 9, c: 3 })
    expect(summarize(d)).toEqual({ added: 1, removed: 1, changed: 1 })
  })
})
