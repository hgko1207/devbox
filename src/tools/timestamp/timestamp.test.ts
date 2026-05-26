import { describe, it, expect } from 'vitest'
import { fromEpoch, fromDate } from './timestamp'

describe('timestamp', () => {
  it('초 단위 epoch → 날짜', () => {
    const t = fromEpoch('1516239022')
    expect(t.iso).toBe('2018-01-18T01:30:22.000Z')
    expect(t.unixSec).toBe(1516239022)
    expect(t.unixMs).toBe(1516239022000)
  })

  it('밀리초 단위 자동 감지(13자리)', () => {
    const t = fromEpoch('1516239022000')
    expect(t.unixSec).toBe(1516239022)
    expect(t.iso).toBe('2018-01-18T01:30:22.000Z')
  })

  it('정수 아님 → 한국어 오류', () => {
    expect(() => fromEpoch('abc')).toThrow(/타임스탬프/)
    expect(() => fromEpoch('1.5')).toThrow(/타임스탬프/)
  })

  it('fromDate ISO → epoch', () => {
    expect(fromDate('2018-01-18T01:30:22Z').unixSec).toBe(1516239022)
  })

  it('fromDate 잘못된 날짜 → 오류', () => {
    expect(() => fromDate('not-a-date')).toThrow(/날짜/)
  })
})
