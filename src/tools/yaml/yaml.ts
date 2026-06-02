// JSON ↔ YAML 변환 (js-yaml 기반).
import * as yaml from 'js-yaml'
import { parseJson } from '@/tools/json/lib/parser'

export function jsonToYaml(input: string): string {
  // parseJson 은 네이티브 JSON.parse 가 빠른 경로, 실패 시 위치 추적 파서가 한국어로 에러를 던진다.
  const v = parseJson(input)
  return yaml.dump(v, { indent: 2, noRefs: true, lineWidth: 120 })
}

export function yamlToJson(input: string, indent: 2 | 4 = 2): string {
  try {
    const v = yaml.load(input, { schema: yaml.JSON_SCHEMA })
    return JSON.stringify(v, null, indent)
  } catch (e) {
    if (e instanceof yaml.YAMLException) {
      const line = (e.mark?.line ?? 0) + 1
      const col = (e.mark?.column ?? 0) + 1
      throw new Error(`YAML 파싱 실패: ${e.reason} (줄 ${line}, 열 ${col})`)
    }
    throw new Error('YAML 파싱 실패: ' + (e instanceof Error ? e.message : String(e)))
  }
}
