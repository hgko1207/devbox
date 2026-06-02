// JSON 샘플 → TypeScript 인터페이스 생성. 의존성 없음.
import { parseJson } from '@/tools/json/lib/parser'

export interface TsTypesOptions {
  rootName?: string
}

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)

function pascalCase(s: string): string {
  const parts = s
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => cap(w.toLowerCase()))
  return parts.join('') || 'Unknown'
}

function needsQuotes(key: string): boolean {
  return !/^[A-Za-z_$][\w$]*$/.test(key)
}

function singular(name: string): string {
  return name.endsWith('s') && name.length > 1 ? name.slice(0, -1) : name + 'Item'
}

export function jsonToTsTypes(jsonString: string, opts: TsTypesOptions = {}): string {
  const value = parseJson(jsonString)
  const rootName = pascalCase(opts.rootName ?? 'Root')
  const interfaces: { name: string; body: string }[] = []
  const used = new Set<string>()

  function reserveName(base: string): string {
    const candidate = pascalCase(base)
    if (!used.has(candidate)) {
      used.add(candidate)
      return candidate
    }
    let n = 2
    while (used.has(candidate + n)) n++
    const name = candidate + n
    used.add(name)
    return name
  }

  function infer(v: unknown, hint: string): string {
    if (v === null) return 'null'
    if (Array.isArray(v)) {
      if (v.length === 0) return 'unknown[]'
      const childHint = singular(hint)
      const elemTypes = new Set(v.map((x) => infer(x, childHint)))
      const elems = [...elemTypes].sort()
      return elemTypes.size === 1 ? `${elems[0]}[]` : `(${elems.join(' | ')})[]`
    }
    if (typeof v === 'object') {
      const obj = v as Record<string, unknown>
      const name = reserveName(hint)
      const lines: string[] = []
      for (const [k, val] of Object.entries(obj)) {
        const propKey = needsQuotes(k) ? `"${k}"` : k
        lines.push(`  ${propKey}: ${infer(val, k)}`)
      }
      interfaces.push({ name, body: `{\n${lines.join('\n')}\n}` })
      return name
    }
    return typeof v
  }

  const rootType = infer(value, rootName)

  if (interfaces.length === 0) {
    return `export type ${rootName} = ${rootType}`
  }

  // 루트 인터페이스가 먼저 오도록 정렬
  const sorted = [
    ...interfaces.filter((i) => i.name === rootType),
    ...interfaces.filter((i) => i.name !== rootType),
  ]
  const interfaceCode = sorted.map((i) => `export interface ${i.name} ${i.body}`).join('\n\n')
  const rootIsInterface = interfaces.some((i) => i.name === rootType)
  return rootIsInterface
    ? interfaceCode
    : `${interfaceCode}\n\nexport type ${rootName} = ${rootType}`
}
