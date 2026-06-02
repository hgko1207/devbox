import { describe, it, expect } from 'vitest'
import { romanize, romanizeName } from './romaja'

describe('romaja — 기본 변환', () => {
  it('단순 음절', () => {
    expect(romanize('가')).toBe('ga')
    expect(romanize('나')).toBe('na')
    expect(romanize('어')).toBe('eo')
  })

  it('받침 연음 (한국어 → hangugeo)', () => {
    expect(romanize('한국어')).toBe('hangugeo')
  })

  it('받침이 종료 위치 (한국 → hanguk)', () => {
    expect(romanize('한국')).toBe('hanguk')
  })

  it('자음 동화: ㄴ + ㄹ → ㄹㄹ (신라 → silla)', () => {
    expect(romanize('신라')).toBe('silla')
  })

  it('자음 동화: ㄹ + ㄴ → ㄹㄹ (칼날 → kallal)', () => {
    expect(romanize('칼날')).toBe('kallal')
  })

  it('자음 동화: ㄱ + ㄴ → ㅇ + ㄴ (작년 → jangnyeon)', () => {
    expect(romanize('작년')).toBe('jangnyeon')
  })

  it('자음 동화 끄기 — 음절 그대로', () => {
    // 신라 → 단순 변환은 sinra
    expect(romanize('신라', { assimilate: false })).toBe('sinra')
  })

  it('지명: 동대문 → dongdaemun', () => {
    expect(romanize('동대문')).toBe('dongdaemun')
  })

  it('비한글 문자는 그대로', () => {
    expect(romanize('Hello 안녕!')).toBe('Hello annyeong!')
  })

  it('빈 문자열', () => {
    expect(romanize('')).toBe('')
  })
})

describe('romaja — 인명', () => {
  it('관용 표기 (기본): 홍길동 → Hong Gildong', () => {
    expect(romanizeName('홍길동')).toBe('Hong Gildong')
  })

  it('관용 표기: 김민수 → Kim Minsu', () => {
    expect(romanizeName('김민수')).toBe('Kim Minsu')
  })

  it('관용 표기: 이지원 → Lee Jiwon', () => {
    expect(romanizeName('이지원')).toBe('Lee Jiwon')
  })

  it('표준 표기: 김민수 → Gim Minsu', () => {
    expect(romanizeName('김민수', { surname: 'standard' })).toBe('Gim Minsu')
  })

  it('하이픈 형식: 홍길동 → Hong Gil-Dong', () => {
    expect(romanizeName('홍길동', { given: 'hyphen' })).toBe('Hong Gil-Dong')
  })

  it('성씨만: 박 → Park', () => {
    expect(romanizeName('박')).toBe('Park')
  })

  it('빈 입력', () => {
    expect(romanizeName('')).toBe('')
  })

  it('공백 제거', () => {
    expect(romanizeName(' 홍 길동 ')).toBe('Hong Gildong')
  })
})
