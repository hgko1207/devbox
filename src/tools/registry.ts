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

export function getToolByPath(path: string): ToolMeta | undefined {
  return tools.find((tool) => tool.path === path)
}
