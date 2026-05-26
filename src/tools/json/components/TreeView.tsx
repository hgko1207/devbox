import { memo, useState } from 'react'

// 한 노드에서 한 번에 렌더링할 자식 수. 큰 컬렉션은 "더 보기"로 점진 렌더한다.
const CHUNK = 100
// 깊이당 들여쓰기(px)
const INDENT = 14

function Leaf({ value }: { value: unknown }) {
  if (value === null) return <span className="italic text-zinc-500 dark:text-zinc-400">null</span>
  switch (typeof value) {
    case 'string':
      return <span className="whitespace-pre-wrap break-all text-emerald-600 dark:text-emerald-400">"{value}"</span>
    case 'number':
      return <span className="text-blue-600 dark:text-blue-400">{String(value)}</span>
    case 'boolean':
      return <span className="text-purple-600 dark:text-purple-400">{String(value)}</span>
    default:
      return <span className="text-zinc-500">{String(value)}</span>
  }
}

function PropLabel({ name }: { name: string }) {
  return (
    <span className="mr-1 shrink-0 text-zinc-700 dark:text-zinc-300">
      {name}
      <span className="text-zinc-400">:</span>
    </span>
  )
}

function IndexLabel({ i }: { i: number }) {
  return <span className="mr-1 shrink-0 text-zinc-500 dark:text-zinc-400">{i}:</span>
}

function Caret({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mr-1 inline-block w-3 shrink-0 select-none text-zinc-400 transition-transform ${open ? 'rotate-90' : ''}`}
    >
      ▶
    </span>
  )
}

interface NodeProps {
  label?: React.ReactNode
  value: unknown
  depth: number
  initiallyOpen?: boolean
}

const TreeNode = memo(function TreeNode({ label, value, depth, initiallyOpen }: NodeProps) {
  const isContainer = value !== null && typeof value === 'object'
  const [open, setOpen] = useState(initiallyOpen ?? depth < 1)
  const [visible, setVisible] = useState(CHUNK)

  if (!isContainer) {
    return (
      <div
        className="flex items-start py-0.5"
        style={{ paddingLeft: depth * INDENT + 16 }}
      >
        {label}
        <Leaf value={value} />
      </div>
    )
  }

  const isArray = Array.isArray(value)
  const entries: Array<[string | number, unknown]> = isArray
    ? (value as unknown[]).map((v, i) => [i, v])
    : Object.entries(value as Record<string, unknown>)
  const count = entries.length
  const [openBracket, closeBracket] = isArray ? ['[', ']'] : ['{', '}']

  if (count === 0) {
    return (
      <div className="flex items-center py-0.5" style={{ paddingLeft: depth * INDENT + 16 }}>
        {label}
        <span className="text-zinc-400">
          {openBracket}
          {closeBracket} <span className="text-xs">비어 있음</span>
        </span>
      </div>
    )
  }

  return (
    <div>
      <div
        className="flex cursor-pointer items-center rounded py-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
        style={{ paddingLeft: depth * INDENT }}
        onClick={() => setOpen((o) => !o)}
        role="treeitem"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((o) => !o)
          }
        }}
      >
        <Caret open={open} />
        {label}
        <span className="text-zinc-400">
          {open ? openBracket : `${openBracket} … ${closeBracket}`}
          <span className="ml-1 text-xs">
            {count}
            {isArray ? '개' : '개 항목'}
          </span>
        </span>
      </div>
      {open && (
        <div>
          {entries.slice(0, visible).map(([key, val]) => (
            <TreeNode
              key={String(key)}
              label={isArray ? <IndexLabel i={key as number} /> : <PropLabel name={String(key)} />}
              value={val}
              depth={depth + 1}
            />
          ))}
          {visible < count && (
            <button
              type="button"
              onClick={() => setVisible((v) => Math.min(count, v + CHUNK))}
              className="my-0.5 rounded px-2 py-0.5 text-xs font-medium text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-950"
              style={{ marginLeft: (depth + 1) * INDENT + 16 }}
            >
              + {(count - visible).toLocaleString()}개 더 보기
            </button>
          )}
          <div className="py-0.5 text-zinc-400" style={{ paddingLeft: depth * INDENT + 16 }}>
            {closeBracket}
          </div>
        </div>
      )}
    </div>
  )
})

export function TreeView({ data }: { data: unknown }) {
  return (
    <div className="font-mono text-[13px] leading-relaxed" role="tree" aria-label="JSON 트리">
      <TreeNode value={data} depth={0} initiallyOpen />
    </div>
  )
}
