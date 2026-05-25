// 메인 스레드 ↔ Web Worker 간 메시지 프로토콜.
import type { Indent, JsonErrorDetail, ValidationResult } from '../lib/parser'
import type { DiffEntry } from '../lib/diff'

export type { ValidationResult, DiffEntry }

export type WorkerRequest =
  | { id: number; op: 'format'; text: string; indent: Indent }
  | { id: number; op: 'minify'; text: string }
  | { id: number; op: 'validate'; text: string }
  | { id: number; op: 'diff'; left: string; right: string }

export type WorkerError =
  | { kind: 'json'; detail: JsonErrorDetail; side?: 'left' | 'right' }
  | { kind: 'generic'; message: string }

export type WorkerResponse =
  | { id: number; ok: true; result: unknown }
  | { id: number; ok: false; error: WorkerError }
