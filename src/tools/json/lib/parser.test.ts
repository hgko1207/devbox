import { describe, it, expect } from 'vitest'
import { validateJson, formatJson, minifyJson, parseJson, JsonParseError } from './parser'

describe('validateJson', () => {
  it('빈 입력/공백 → empty', () => {
    expect(validateJson('').status).toBe('empty')
    expect(validateJson('   \n\t').status).toBe('empty')
  })

  it('유효한 객체/배열/원시값 → valid', () => {
    expect(validateJson('{"a":1}').status).toBe('valid')
    expect(validateJson('[1,2,3]').status).toBe('valid')
    expect(validateJson('true').status).toBe('valid')
    expect(validateJson('"x"').status).toBe('valid')
    expect(validateJson('-12.5e3').status).toBe('valid')
  })
})

describe('에러 위치 추적', () => {
  function err(text: string) {
    const r = validateJson(text)
    if (r.status !== 'invalid') throw new Error('invalid 를 기대했지만 아님: ' + text)
    return r.error
  }

  it('객체 trailing comma → 줄 번호 정확', () => {
    const e = err('{\n  "a": 1,\n}')
    expect(e.line).toBe(3)
    expect(e.message).toContain('쉼표')
  })

  it('배열 trailing comma', () => {
    expect(err('[1, 2, ]').message).toContain('쉼표')
  })

  it('닫히지 않은 문자열', () => {
    expect(err('{"a": "open}').message).toContain('닫히지')
  })

  it('작은따옴표 안내', () => {
    expect(err("{'a':1}").message).toContain('큰따옴표')
  })

  it('잘못된 \\u 이스케이프', () => {
    expect(err('"\\uZZZZ"').message).toContain('16진수')
  })

  it('잘못된 리터럴 → 줄 번호', () => {
    const e = err('{\n  "x": tru\n}')
    expect(e.line).toBe(2)
  })

  it('값 뒤 불필요한 내용', () => {
    expect(err('{"a":1} x').message).toContain('불필요한')
  })

  it('offset 은 0-기반, line/column 은 1-기반', () => {
    const e = err('[1,]')
    expect(e.line).toBe(1)
    expect(e.column).toBeGreaterThanOrEqual(1)
    expect(e.offset).toBeGreaterThanOrEqual(0)
  })
})

describe('formatJson', () => {
  it('들여쓰기 2/4/탭', () => {
    expect(formatJson('{"a":1}', 2)).toBe('{\n  "a": 1\n}')
    expect(formatJson('{"a":1}', 4)).toBe('{\n    "a": 1\n}')
    expect(formatJson('{"a":1}', 'tab')).toBe('{\n\t"a": 1\n}')
  })

  it('키 순서 보존', () => {
    expect(formatJson('{"b":1,"a":2}', 2)).toBe('{\n  "b": 1,\n  "a": 2\n}')
  })

  it('유니코드·한글·이모지 round-trip', () => {
    const out = formatJson('{"k":"한글 😀 테스트"}', 2)
    expect(JSON.parse(out).k).toBe('한글 😀 테스트')
  })

  it('잘못된 JSON 은 JsonParseError', () => {
    expect(() => formatJson('{', 2)).toThrow(JsonParseError)
  })
})

describe('minifyJson', () => {
  it('공백 제거 + idempotent', () => {
    const m = minifyJson('{ "a" : 1 , "b" : [1, 2] }')
    expect(m).toBe('{"a":1,"b":[1,2]}')
    expect(minifyJson(m)).toBe(m)
  })
})

describe('parseJson (네이티브 경로 — 서로게이트 정확성)', () => {
  it('astral plane(이모지) round-trip', () => {
    // 실제 파싱은 네이티브 JSON.parse 가 담당하므로 서로게이트 쌍이 올바르게 복원된다.
    expect(parseJson('"\\uD83D\\uDE00"')).toBe('😀')
  })
})
