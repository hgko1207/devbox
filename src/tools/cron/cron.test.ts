import { describe, it, expect } from 'vitest'
import { parseCron, describeCron, nextRuns } from './cron'

describe('cron parse', () => {
  it('매분', () => {
    const p = parseCron('* * * * *')
    expect(p.minute).toHaveLength(60)
    expect(p.hour).toHaveLength(24)
  })

  it('0 */2 * * *  — 2시간마다 0분', () => {
    const p = parseCron('0 */2 * * *')
    expect(p.minute).toEqual([0])
    expect(p.hour).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22])
  })

  it('0 9 * * 1-5 — 평일 9시', () => {
    const p = parseCron('0 9 * * 1-5')
    expect(p.dow).toEqual([1, 2, 3, 4, 5])
    expect(p.hour).toEqual([9])
  })

  it('5,10,15 * * * * — 리스트', () => {
    expect(parseCron('5,10,15 * * * *').minute).toEqual([5, 10, 15])
  })

  it('일요일은 0 또는 7 둘 다 허용', () => {
    expect(parseCron('0 0 * * 0').dow).toEqual([0])
    expect(parseCron('0 0 * * 7').dow).toEqual([0])
  })

  it('필드 5개 아니면 오류', () => {
    expect(() => parseCron('0 9 *')).toThrow(/5개/)
  })

  it('범위 초과 오류', () => {
    expect(() => parseCron('0 25 * * *')).toThrow(/범위/)
  })
})

describe('cron describe', () => {
  it('매분', () => {
    expect(describeCron(parseCron('* * * * *'))).toContain('매분')
  })

  it('2시간마다 0분', () => {
    const d = describeCron(parseCron('0 */2 * * *'))
    expect(d).toContain('2시간마다')
    expect(d).toContain('0분')
  })

  it('평일 9시 — 월~금 표기', () => {
    const d = describeCron(parseCron('0 9 * * 1-5'))
    expect(d).toMatch(/월.{0,5}금/)
    expect(d).toContain('9시')
  })
})

describe('cron nextRuns', () => {
  it('매시 정각 — 다음 3건', () => {
    const from = new Date('2026-01-01T10:30:00')
    const next = nextRuns(parseCron('0 * * * *'), from, 3)
    expect(next).toHaveLength(3)
    expect(next[0].getMinutes()).toBe(0)
    expect(next[0].getHours()).toBe(11)
    expect(next[1].getHours()).toBe(12)
    expect(next[2].getHours()).toBe(13)
  })

  it('평일 9시 — 첫 결과가 평일', () => {
    const from = new Date('2026-01-01T00:00:00') // 목요일
    const next = nextRuns(parseCron('0 9 * * 1-5'), from, 1)
    expect(next).toHaveLength(1)
    expect(next[0].getHours()).toBe(9)
    expect([1, 2, 3, 4, 5]).toContain(next[0].getDay())
  })
})
