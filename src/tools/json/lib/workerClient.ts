// Web Worker 를 약속(Promise) 기반으로 감싼 클라이언트.
// 요청마다 고유 id 를 부여하고 응답을 매칭한다.
import type { Indent, ValidationResult } from './parser'
import type { DiffEntry } from './diff'
import type { WorkerError, WorkerRequest, WorkerResponse } from '../worker/protocol'

export class JsonWorkerError extends Error {
  workerError: WorkerError
  constructor(workerError: WorkerError) {
    super(workerError.kind === 'json' ? workerError.detail.message : workerError.message)
    this.name = 'JsonWorkerError'
    this.workerError = workerError
  }
}

interface Pending {
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}

let worker: Worker | null = null
let seq = 0
const pending = new Map<number, Pending>()

function getWorker(): Worker {
  if (worker) return worker
  worker = new Worker(new URL('../worker/json.worker.ts', import.meta.url), {
    type: 'module',
  })
  worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
    const res = e.data
    const p = pending.get(res.id)
    if (!p) return
    pending.delete(res.id)
    if (res.ok) p.resolve(res.result)
    else p.reject(new JsonWorkerError(res.error))
  }
  worker.onerror = (event) => {
    const err = new Error(`워커 오류: ${event.message}`)
    for (const p of pending.values()) p.reject(err)
    pending.clear()
  }
  return worker
}

function call<T>(req: WorkerRequest): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    pending.set(req.id, { resolve: resolve as (value: unknown) => void, reject })
    getWorker().postMessage(req)
  })
}

const nextId = () => ++seq

export function formatJsonAsync(text: string, indent: Indent): Promise<string> {
  return call<string>({ id: nextId(), op: 'format', text, indent })
}

export function minifyJsonAsync(text: string): Promise<string> {
  return call<string>({ id: nextId(), op: 'minify', text })
}

export function validateJsonAsync(text: string): Promise<ValidationResult> {
  return call<ValidationResult>({ id: nextId(), op: 'validate', text })
}

export function diffJsonAsync(left: string, right: string): Promise<DiffEntry[]> {
  return call<DiffEntry[]>({ id: nextId(), op: 'diff', left, right })
}
