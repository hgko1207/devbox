// 케이스 변환 (camelCase · snake_case · kebab-case · 등)

const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
const lower = (s: string): string => s.toLowerCase()
const upper = (s: string): string => s.toUpperCase()

/** 입력을 토큰 배열로 쪼갠다. camelCase·snake·kebab·약어(XML→[XML])를 모두 인식. */
export function tokenize(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_\-./\s]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}

export const CASES = {
  'camelCase': (t: string[]) =>
    t.length === 0 ? '' : lower(t[0]) + t.slice(1).map(cap).join(''),
  'PascalCase': (t: string[]) => t.map(cap).join(''),
  'snake_case': (t: string[]) => t.map(lower).join('_'),
  'SCREAMING_SNAKE_CASE': (t: string[]) => t.map(upper).join('_'),
  'kebab-case': (t: string[]) => t.map(lower).join('-'),
  'Train-Case': (t: string[]) => t.map(cap).join('-'),
  'dot.case': (t: string[]) => t.map(lower).join('.'),
  'lower case': (t: string[]) => t.map(lower).join(' '),
  'UPPER CASE': (t: string[]) => t.map(upper).join(' '),
  'Sentence case': (t: string[]) =>
    t.length === 0 ? '' : cap(t[0]) + (t.length > 1 ? ' ' + t.slice(1).map(lower).join(' ') : ''),
} as const

export type CaseName = keyof typeof CASES

export const CASE_LIST: CaseName[] = [
  'camelCase',
  'PascalCase',
  'snake_case',
  'SCREAMING_SNAKE_CASE',
  'kebab-case',
  'Train-Case',
  'dot.case',
  'lower case',
  'UPPER CASE',
  'Sentence case',
]

export function convertCase(input: string, name: CaseName): string {
  return CASES[name](tokenize(input))
}
