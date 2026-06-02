import { describe, it, expect } from 'vitest'
import { jsonToTsTypes } from './ts-types'

describe('ts-types', () => {
  it('단순 객체 — 기본 인터페이스', () => {
    const code = jsonToTsTypes('{"name":"a","age":1,"active":true}')
    expect(code).toContain('export interface Root')
    expect(code).toContain('name: string')
    expect(code).toContain('age: number')
    expect(code).toContain('active: boolean')
  })

  it('null 처리', () => {
    const code = jsonToTsTypes('{"value":null}')
    expect(code).toContain('value: null')
  })

  it('동일 타입 배열', () => {
    const code = jsonToTsTypes('{"tags":["a","b","c"]}')
    expect(code).toContain('tags: string[]')
  })

  it('혼합 타입 배열 → union', () => {
    const code = jsonToTsTypes('{"mix":[1,"a",true]}')
    expect(code).toMatch(/mix: \(.+\|.+\|.+\)\[\]/)
  })

  it('중첩 객체 → 별도 인터페이스', () => {
    const code = jsonToTsTypes('{"user":{"name":"a","email":"b@c"}}')
    expect(code).toContain('export interface User')
    expect(code).toContain('user: User')
  })

  it('비식별자 키는 따옴표', () => {
    const code = jsonToTsTypes('{"a-b":1}')
    expect(code).toContain('"a-b": number')
  })

  it('rootName 옵션', () => {
    const code = jsonToTsTypes('{"x":1}', { rootName: 'Config' })
    expect(code).toContain('export interface Config')
  })

  it('빈 배열 → unknown[]', () => {
    const code = jsonToTsTypes('{"empty":[]}')
    expect(code).toContain('empty: unknown[]')
  })

  it('루트가 배열 → type alias', () => {
    const code = jsonToTsTypes('[1,2,3]')
    expect(code).toContain('export type Root = number[]')
  })

  it('잘못된 JSON → throw', () => {
    expect(() => jsonToTsTypes('{not json')).toThrow()
  })
})
