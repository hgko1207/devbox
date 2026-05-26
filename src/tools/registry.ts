import type { ToolMeta } from './types'
import { jsonTool } from './json/meta'

/**
 * 도구 등록소.
 *
 * 새 도구를 추가하려면:
 *   1. src/tools/<도구>/ 폴더를 만들고 meta.ts 에서 ToolMeta 를 export 한다.
 *   2. 아래 배열에 import 해서 한 줄 추가한다.
 * 그러면 홈 목록과 라우팅에 자동으로 반영된다.
 */
export const tools: ToolMeta[] = [jsonTool]

/** id·path 의 고유성과 형식을 검증한다 (개발 중 실수를 일찍 잡는다). */
function validateRegistry(list: ToolMeta[]): void {
  const ids = new Set<string>()
  const paths = new Set<string>()
  for (const tool of list) {
    if (!tool.path.startsWith('/')) {
      throw new Error(`도구 "${tool.id}" 의 path 는 '/' 로 시작해야 합니다: ${tool.path}`)
    }
    if (ids.has(tool.id)) throw new Error(`도구 id 가 중복됩니다: ${tool.id}`)
    if (paths.has(tool.path)) throw new Error(`도구 path 가 중복됩니다: ${tool.path}`)
    ids.add(tool.id)
    paths.add(tool.path)
  }
}

if (import.meta.env.DEV) {
  validateRegistry(tools)
}

export function getToolByPath(path: string): ToolMeta | undefined {
  return tools.find((tool) => tool.path === path)
}
