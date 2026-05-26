import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Editor } from './components/Editor'
import { StatusBar } from './components/StatusBar'
import { TreeView } from './components/TreeView'
import { DiffView } from './components/DiffView'
import { JsonParseError, parseJson, type Indent, type ValidationResult } from './lib/parser'
import type { DiffEntry } from './lib/diff'
import {
  JsonWorkerError,
  diffJsonAsync,
  formatJsonAsync,
  minifyJsonAsync,
  validateJsonAsync,
} from './lib/workerClient'
import { useDebounced } from '@/lib/useDebounced'
import {
  BracesIcon,
  CheckIcon,
  CopyIcon,
  DiffIcon,
  MinifyIcon,
  TrashIcon,
  TreeIcon,
  WandIcon,
} from '@/components/icons'

const SAMPLE = `{
  "name": "devbox",
  "version": "0.1.0",
  "private": true,
  "tools": [
    { "id": "json", "path": "/json", "enabled": true }
  ],
  "config": {
    "darkMode": true,
    "locale": "ko-KR",
    "maxFileSizeMB": 10
  },
  "tags": ["json", "format", "diff", null]
}`

type Mode = 'format' | 'diff'

const encoder = new TextEncoder()

// 이 크기를 넘으면 입력마다 자동 검사(워커 왕복)를 멈추고 수동 검사 버튼을 제공한다.
const LARGE_INPUT_BYTES = 5 * 1024 * 1024

const TABS: { value: Mode; label: string; icon: React.ReactNode }[] = [
  { value: 'format', label: '포맷 / 검사', icon: <WandIcon className="h-4 w-4" /> },
  { value: 'diff', label: '비교 (Diff)', icon: <DiffIcon className="h-4 w-4" /> },
]

export default function JsonToolPage() {
  const [mode, setMode] = useState<Mode>('format')

  return (
    <div className="space-y-5">
      <header>
        <div className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:underline">
            홈
          </Link>{' '}
          / JSON 도구
        </div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-600 text-white">
            <BracesIcon className="h-4 w-4" />
          </span>
          JSON 도구
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          포맷팅·압축·유효성 검사, 트리 뷰, 두 JSON 비교. 모든 처리는 브라우저에서만 이루어집니다.
        </p>
      </header>

      {/* 모드 탭 */}
      <div
        role="tablist"
        aria-label="JSON 도구 모드"
        className="inline-flex rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault()
            setMode((m) => (m === 'format' ? 'diff' : 'format'))
          }
        }}
      >
        {TABS.map((t) => (
          <TabButton
            key={t.value}
            selected={mode === t.value}
            id={`tab-${t.value}`}
            controls={`panel-${t.value}`}
            icon={t.icon}
            onSelect={() => setMode(t.value)}
          >
            {t.label}
          </TabButton>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${mode}`} aria-labelledby={`tab-${mode}`}>
        {mode === 'format' ? <FormatMode /> : <DiffMode />}
      </div>
    </div>
  )
}

function TabButton({
  selected,
  id,
  controls,
  onSelect,
  icon,
  children,
}: {
  selected: boolean
  id: string
  controls: string
  onSelect: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-controls={controls}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={onSelect}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        selected
          ? 'bg-brand-600 text-white'
          : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

// ── 포맷 / 검사 모드 ───────────────────────────────────────────────────────────

function FormatMode() {
  const [text, setText] = useState('')
  const [indent, setIndent] = useState<Indent>(2)
  const [showTree, setShowTree] = useState(false)
  const [validation, setValidation] = useState<ValidationResult>({ status: 'empty' })
  const [running, setRunning] = useState<null | 'format' | 'minify'>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const busy = running !== null

  const debounced = useDebounced(text, 300)

  // 입력이 잠잠해지면 백그라운드(워커)에서 검증
  useEffect(() => {
    let cancelled = false
    if (debounced.trim() === '') {
      setValidation({ status: 'empty' })
      return
    }
    if (encoder.encode(debounced).length > LARGE_INPUT_BYTES) {
      // 대용량: 입력마다 워커 왕복(structuredClone) 비용이 커서 자동 검사를 건너뛴다(수동 검사 제공).
      setValidation({ status: 'empty' })
      return
    }
    validateJsonAsync(debounced)
      .then((result) => {
        if (!cancelled) setValidation(result)
      })
      .catch(() => {
        /* 워커 오류는 무시 (다음 입력에서 복구) */
      })
    return () => {
      cancelled = true
    }
  }, [debounced])

  // 크기 정보 (디바운스된 값 기준으로만 계산)
  const byteCount = useMemo(() => encoder.encode(debounced).length, [debounced])
  const isLarge = byteCount > LARGE_INPUT_BYTES

  // 트리: 트리 보기가 켜져 있고 입력이 있을 때만 메인 스레드에서 파싱 (네이티브 파서는 빠름)
  const tree = useMemo<
    { ok: true; value: unknown } | { ok: false; message: string | null }
  >(() => {
    if (!showTree || debounced.trim() === '') return { ok: false, message: null }
    try {
      return { ok: true, value: parseJson(debounced) }
    } catch (e) {
      const message =
        e instanceof JsonParseError
          ? `${e.detail.message} (줄 ${e.detail.line}, 열 ${e.detail.column})`
          : '유효하지 않은 JSON 입니다.'
      return { ok: false, message }
    }
  }, [showTree, debounced])

  const onChangeText = useCallback((value: string) => setText(value), [])

  const handleError = useCallback((e: unknown) => {
    if (e instanceof JsonWorkerError && e.workerError.kind === 'json') {
      setValidation({ status: 'invalid', error: e.workerError.detail })
    } else {
      // 워커 타임아웃·크래시 등 JSON 위치 오류가 아닌 경우는 배너로 보여준다.
      setActionError(e instanceof Error ? e.message : '처리 중 오류가 발생했습니다.')
    }
  }, [])

  const runFormat = useCallback(async () => {
    if (text.trim() === '') return
    setRunning('format')
    setActionError(null)
    try {
      setText(await formatJsonAsync(text, indent))
    } catch (e) {
      handleError(e)
    } finally {
      setRunning(null)
    }
  }, [text, indent, handleError])

  const runMinify = useCallback(async () => {
    if (text.trim() === '') return
    setRunning('minify')
    setActionError(null)
    try {
      setText(await minifyJsonAsync(text))
    } catch (e) {
      handleError(e)
    } finally {
      setRunning(null)
    }
  }, [text, handleError])

  const copy = useCallback(async () => {
    if (text === '') return
    try {
      if (!navigator.clipboard) throw new Error('clipboard unavailable')
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setCopyFailed(false)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // 비보안 컨텍스트(http)·권한 거부: 텍스트를 선택해 두어 사용자가 직접 복사하게 한다.
      taRef.current?.focus()
      taRef.current?.select()
      setCopyFailed(true)
      setTimeout(() => setCopyFailed(false), 4000)
    }
  }, [text])

  const jumpToError = useCallback((offset: number) => {
    const ta = taRef.current
    if (!ta) return
    ta.focus()
    ta.setSelectionRange(offset, Math.min(offset + 1, ta.value.length))
  }, [])

  // 대용량 입력에서 자동 검사를 멈춘 경우, 사용자가 직접 한 번 검사할 수 있게 한다.
  const manualValidate = useCallback(async () => {
    if (debounced.trim() === '') return
    try {
      setValidation(await validateJsonAsync(debounced))
    } catch (e) {
      handleError(e)
    }
  }, [debounced, handleError])

  return (
    <div className="space-y-3">
      {/* 툴바 */}
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-primary" onClick={runFormat} disabled={busy || text === ''}>
          <WandIcon className="h-4 w-4" />
          {running === 'format' ? '정렬 중…' : '정렬'}
        </button>
        <button type="button" className="btn" onClick={runMinify} disabled={busy || text === ''}>
          <MinifyIcon className="h-4 w-4" />
          {running === 'minify' ? '압축 중…' : '압축'}
        </button>

        <label className="ml-1 flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          들여쓰기
          <select
            value={String(indent)}
            onChange={(e) =>
              setIndent(e.target.value === 'tab' ? 'tab' : (Number(e.target.value) as Indent))
            }
            className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="2">2칸</option>
            <option value="4">4칸</option>
            <option value="tab">탭</option>
          </select>
        </label>

        <div className="flex-1" />
        <div className="mx-1 hidden h-6 w-px bg-zinc-200 sm:block dark:bg-zinc-800" aria-hidden="true" />

        <button
          type="button"
          className={`btn ${showTree ? 'btn-primary' : ''}`}
          onClick={() => setShowTree((s) => !s)}
          aria-pressed={showTree}
        >
          <TreeIcon className="h-4 w-4" />
          트리 보기
        </button>
        <button type="button" className="btn" onClick={copy} disabled={text === ''}>
          {copied ? <CheckIcon className="h-4 w-4 text-emerald-500" /> : <CopyIcon className="h-4 w-4" />}
          {copied ? '복사됨' : copyFailed ? '직접 선택됨' : '복사'}
        </button>
        <button type="button" className="btn" onClick={() => setText(SAMPLE)}>
          예제
        </button>
        <button type="button" className="btn" onClick={() => setText('')} disabled={text === ''}>
          <TrashIcon className="h-4 w-4" />
          지우기
        </button>
      </div>

      {isLarge && (
        <div
          role="status"
          className="flex flex-wrap items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-2.5 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        >
          <span>
            입력이 큽니다(약 {Math.max(1, Math.round(byteCount / (1024 * 1024)))}MB). 매 입력마다 자동
            검사를 멈췄습니다 — 정렬·압축은 그대로 동작합니다.
          </span>
          <button
            type="button"
            onClick={manualValidate}
            className="rounded border border-amber-300 px-2 py-0.5 text-xs font-medium hover:bg-amber-100 dark:border-amber-800 dark:hover:bg-amber-900"
          >
            지금 검사
          </button>
        </div>
      )}

      {(actionError || copyFailed) && (
        <div
          role="alert"
          className={
            actionError
              ? 'rounded-md border border-red-200 bg-red-50 p-2.5 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300'
              : 'rounded-md border border-amber-200 bg-amber-50 p-2.5 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
          }
        >
          {actionError ??
            '클립보드를 사용할 수 없어 텍스트를 선택해 두었습니다. Ctrl/⌘+C 로 복사하세요.'}
        </div>
      )}

      {/* 에디터 + (선택) 트리 */}
      <div className={`grid gap-3 ${showTree ? 'lg:grid-cols-2' : ''}`}>
        <div className="h-[60dvh] min-h-[320px]">
          <Editor
            ref={taRef}
            value={text}
            onChange={onChangeText}
            ariaLabel="JSON 입력"
            placeholder={'여기에 JSON 을 붙여넣으세요.\n예제 버튼으로 샘플을 불러올 수 있습니다.'}
          />
        </div>
        {showTree && (
          <div className="h-[60dvh] min-h-[320px] overflow-auto rounded-lg border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {tree.ok ? (
              <TreeView data={tree.value} />
            ) : (
              <div className="p-3 text-sm text-zinc-500 dark:text-zinc-400">
                {tree.message ?? '유효한 JSON 을 입력하면 트리가 표시됩니다.'}
              </div>
            )}
          </div>
        )}
      </div>

      <StatusBar
        validation={validation}
        charCount={debounced.length}
        byteCount={byteCount}
        onJumpToError={jumpToError}
      />
    </div>
  )
}

// ── 비교(Diff) 모드 ────────────────────────────────────────────────────────────

function DiffMode() {
  const [left, setLeft] = useState('')
  const [right, setRight] = useState('')
  const [result, setResult] = useState<DiffEntry[] | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onLeft = useCallback((v: string) => setLeft(v), [])
  const onRight = useCallback((v: string) => setRight(v), [])

  const runDiff = useCallback(async () => {
    if (left.trim() === '' || right.trim() === '') {
      setError('비교하려면 양쪽 모두 JSON 을 입력하세요.')
      setResult(null)
      return
    }
    setBusy(true)
    setError(null)
    try {
      setResult(await diffJsonAsync(left, right))
    } catch (e) {
      setResult(null)
      if (e instanceof JsonWorkerError && e.workerError.kind === 'json') {
        const sideLabel = e.workerError.side === 'right' ? '오른쪽' : '왼쪽'
        const d = e.workerError.detail
        setError(`${sideLabel} JSON 오류: ${d.message} (줄 ${d.line}, 열 ${d.column})`)
      } else {
        setError('비교 중 오류가 발생했습니다.')
      }
    } finally {
      setBusy(false)
    }
  }, [left, right])

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-primary" onClick={runDiff} disabled={busy}>
          <DiffIcon className="h-4 w-4" />
          {busy ? '비교 중…' : '비교하기'}
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setLeft('')
            setRight('')
            setResult(null)
            setError(null)
          }}
          disabled={left === '' && right === ''}
        >
          <TrashIcon className="h-4 w-4" />
          지우기
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">왼쪽 (변경 전)</span>
          <div className="h-[40dvh] min-h-[240px]">
            <Editor value={left} onChange={onLeft} ariaLabel="왼쪽 JSON" placeholder="변경 전 JSON" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">오른쪽 (변경 후)</span>
          <div className="h-[40dvh] min-h-[240px]">
            <Editor value={right} onChange={onRight} ariaLabel="오른쪽 JSON" placeholder="변경 후 JSON" />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      )}

      {result && <DiffView entries={result} />}
    </div>
  )
}
