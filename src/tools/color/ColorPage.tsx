import { useMemo, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CopyButton } from '@/components/CopyButton'
import { PaletteIcon } from '@/components/icons'
import {
  formatOklch,
  parseColor,
  ramp,
  rgbToHex,
  rgbToHsl,
  rgbToOklch,
  scheme,
  SCHEME_LABELS,
  wcag,
  type Rgb,
  type SchemeKind,
} from './color'

const SCHEMES: SchemeKind[] = [
  'complementary',
  'analogous',
  'triadic',
  'split',
  'tetradic',
  'monochromatic',
]

export default function ColorPage() {
  const [input, setInput] = useState('#7c3aed')

  const parsed = useMemo(() => {
    if (input.trim() === '') return null
    try {
      return { ok: true as const, rgb: parseColor(input) }
    } catch (e) {
      return { ok: false as const, err: e instanceof Error ? e.message : '변환에 실패했습니다.' }
    }
  }, [input])

  const view = useMemo(() => {
    if (!parsed?.ok) return null
    const rgb = parsed.rgb
    return {
      rgb,
      hex: rgbToHex(rgb),
      hsl: rgbToHsl(rgb),
      oklch: rgbToOklch(rgb),
    }
  }, [parsed])

  return (
    <div className="space-y-8">
      <ToolHeader
        name="색상"
        description="HEX · RGB · HSL · OKLCH 변환, 자동 배색, 명도 단계, WCAG 대비. 모든 처리는 브라우저에서만."
        icon={PaletteIcon}
      />

      {/* 입력 + 피커 */}
      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative shrink-0">
            <input
              type="color"
              value={view?.hex ?? '#7c3aed'}
              onChange={(e) => setInput(e.target.value)}
              aria-label="컬러 피커"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <span
              className="block h-12 w-12 rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-700"
              style={{ backgroundColor: view?.hex ?? 'transparent' }}
            />
          </label>
          <input
            className="field min-w-[220px] flex-1 font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="#7c3aed · rgb(124,58,237) · hsl(262,83%,58%) · oklch(0.5 0.24 293)"
            aria-label="색상 입력"
            spellCheck={false}
          />
        </div>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          어느 형식이든 그대로 붙여넣거나 좌측 사각형으로 직접 고르세요.
        </p>

        {parsed?.ok === false && (
          <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
            {parsed.err}
          </p>
        )}
      </section>

      {view && (
        <>
          {/* 4 포맷 */}
          <section>
            <SectionHeader title="포맷" subtitle="클릭 한 번에 복사" />
            <dl className="grid gap-2 sm:grid-cols-2">
              <FormatRow label="HEX" value={view.hex} />
              <FormatRow
                label="RGB"
                value={`rgb(${view.rgb.r} ${view.rgb.g} ${view.rgb.b})`}
              />
              <FormatRow
                label="HSL"
                value={`hsl(${view.hsl.h} ${view.hsl.s}% ${view.hsl.l}%)`}
              />
              <FormatRow label="OKLCH" value={formatOklch(view.oklch)} />
            </dl>
          </section>

          {/* 자동 배색 */}
          <section>
            <SectionHeader
              title="자동 배색"
              subtitle="배색 이론 6종 — 베이스에서 자동 산출"
            />
            <div className="space-y-3">
              {SCHEMES.map((kind) => (
                <SchemeRow key={kind} kind={kind} colors={scheme(kind, view.rgb)} />
              ))}
            </div>
          </section>

          {/* 명도 단계 */}
          <section>
            <SectionHeader
              title="명도 단계"
              subtitle="Tailwind 스타일 11단계 — 디자인 시스템 램프 (근사)"
            />
            <Ramp base={view.rgb} />
          </section>

          {/* WCAG 대비 */}
          <section>
            <SectionHeader
              title="WCAG 대비"
              subtitle="이 색상을 전경/배경으로 두었을 때의 가독성"
            />
            <WcagPanel base={view.rgb} />
          </section>
        </>
      )}
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</h2>
      <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
    </div>
  )
}

function FormatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <span className="w-14 shrink-0 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <code className="flex-1 truncate font-mono text-sm text-zinc-800 dark:text-zinc-200">
        {value}
      </code>
      <CopyButton text={value} className="btn !px-2 !py-1 text-xs" />
    </div>
  )
}

function SchemeRow({ kind, colors }: { kind: SchemeKind; colors: Rgb[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="w-28 shrink-0">
        <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {SCHEME_LABELS[kind]}
        </div>
        <div className="text-[11px] text-zinc-400 dark:text-zinc-500">{kind}</div>
      </div>
      <div className="flex flex-1 flex-wrap gap-1.5">
        {colors.map((c, i) => {
          const hex = rgbToHex(c)
          return <Swatch key={`${kind}-${i}`} hex={hex} size="md" />
        })}
      </div>
    </div>
  )
}

function Ramp({ base }: { base: Rgb }) {
  const steps = useMemo(() => ramp(base), [base])
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid grid-cols-11">
        {steps.map((s) => (
          <div key={s.step} className="flex flex-col">
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(s.hex)}
              title={`${s.step} · ${s.hex} (클릭하여 복사)`}
              aria-label={`${s.step} ${s.hex} 복사`}
              className="block h-12 w-full transition-opacity hover:opacity-80"
              style={{ backgroundColor: s.hex }}
            />
            <div className="border-t border-zinc-200 py-1.5 text-center dark:border-zinc-800">
              <div className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                {s.step}
              </div>
              <code className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                {s.hex}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WcagPanel({ base }: { base: Rgb }) {
  const white: Rgb = { r: 255, g: 255, b: 255 }
  const black: Rgb = { r: 0, g: 0, b: 0 }
  const onWhite = wcag(base, white)
  const onBlack = wcag(base, black)
  const baseHex = rgbToHex(base)
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <WcagCard
        fgHex={baseHex}
        bgHex="#ffffff"
        bgLabel="흰 배경"
        result={onWhite}
      />
      <WcagCard
        fgHex={baseHex}
        bgHex="#000000"
        bgLabel="검정 배경"
        result={onBlack}
      />
    </div>
  )
}

function WcagCard({
  fgHex,
  bgHex,
  bgLabel,
  result,
}: {
  fgHex: string
  bgHex: string
  bgLabel: string
  result: ReturnType<typeof wcag>
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="p-4" style={{ backgroundColor: bgHex }}>
        <div className="text-2xl font-bold" style={{ color: fgHex }}>
          가나다라마바사
        </div>
        <div className="mt-1 text-sm" style={{ color: fgHex }}>
          본문 텍스트 — The quick brown fox.
        </div>
      </div>
      <div className="border-t border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-baseline justify-between">
          <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            {bgLabel}
          </div>
          <div className="font-mono text-lg font-bold tabular-nums">
            {result.ratio.toFixed(2)}
            <span className="ml-1 text-xs font-normal text-zinc-400">:1</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Badge label="AA 일반" pass={result.aaNormal} />
          <Badge label="AA 큰글씨" pass={result.aaLarge} />
          <Badge label="AA UI" pass={result.aaUi} />
          <Badge label="AAA 일반" pass={result.aaaNormal} />
          <Badge label="AAA 큰글씨" pass={result.aaaLarge} />
        </div>
      </div>
    </div>
  )
}

function Badge({ label, pass }: { label: string; pass: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
        pass
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
          : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500'
      }`}
    >
      <span aria-hidden="true">{pass ? '✓' : '✕'}</span>
      {label}
    </span>
  )
}

function Swatch({ hex, size }: { hex: string; size: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'h-10 w-10' : 'h-7 w-7'
  return (
    <button
      type="button"
      onClick={() => navigator.clipboard?.writeText(hex)}
      title={`${hex} (클릭하여 복사)`}
      aria-label={`${hex} 복사`}
      className={`${cls} group relative shrink-0 rounded-md border border-zinc-200 transition-transform hover:scale-105 dark:border-zinc-700`}
      style={{ backgroundColor: hex }}
    >
      <span className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] font-mono text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-900">
        {hex}
      </span>
    </button>
  )
}
