import { describe, it, expect } from 'vitest'
import { jsonToYaml, yamlToJson } from './yaml'

describe('yaml', () => {
  it('JSON → YAML 기본', () => {
    const out = jsonToYaml('{"name":"devbox","tools":["json","yaml"]}')
    expect(out).toContain('name: devbox')
    expect(out).toContain('- json')
    expect(out).toContain('- yaml')
  })

  it('JSON ↔ YAML round-trip (한글·배열·중첩)', () => {
    const json = '{"이름":"홍길동","tags":["a","b"],"info":{"age":25}}'
    const yamlOut = jsonToYaml(json)
    const back = yamlToJson(yamlOut)
    expect(JSON.parse(back)).toEqual(JSON.parse(json))
  })

  it('잘못된 JSON → 한국어 위치 오류', () => {
    expect(() => jsonToYaml('{a: 1}')).toThrow()
  })

  it('잘못된 YAML → 한국어 위치 오류', () => {
    expect(() => yamlToJson('foo: [1, 2,')).toThrow(/YAML 파싱/)
  })
})
