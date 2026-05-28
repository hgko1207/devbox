import { useMemo, useState } from 'react'
import { ToolHeader } from '@/components/ToolHeader'
import { CopyButton } from '@/components/CopyButton'
import { PaletteIcon } from '@/components/icons'
import { parseColor, rgbToHex, rgbToHsl } from './color'

export default function ColorPage() {
  const [input, setInput] = useState('#7c3aed')

  const result = useMemo(() => {
    if (input.trim() === '') return null
    try {
      const rgb = parseColor(input)
      return {
        ok: true as const,
        rgb,
        hex: rgbToHex(rgb),
        hsl: rgbToHsl(rgb),
      }
    } catch (e) {
      return { ok: false as const, err: e instanceof Error ? e.message : '변환에 실패했습니다.' }
    }
  }, [input])

  return (
    <div className="space-y-5">
      <ToolHeader
        name="색상 변환"
        description="HEX ↔ RGB ↔ HSL 자동 변환. 어느 형식이든 그대로 붙여넣으세요. 모든 처리는 브라우저에서만."
        icon={PaletteIcon}
      />

      <div className="flex flex-wrap items-center gap-3">
        <input
          className="field min-w-[220px] flex-1 font-mono"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#7c3aed · rgb(124,58,237) · hsl(262,83%,58%)"
          aria-label="색상 입력"
        />
        {result?.ok && (
          <div
            className="h-12 w-12 shrink-0 rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-800"
            style={{ backgroundColor: result.hex }}
            aria-label="색상 미리보기"
            title={result.hex}
          />
        )}
      </div>

      {result?.ok === false && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {result.err}
        </p>
      )}

      {result?.ok && (
        <dl className="space-y-2">
          <Row label="HEX" value={result.hex} />
          <Row label="RGB" value={`rgb(${result.rgb.r}, ${result.rgb.g}, ${result.rgb.b})`} />
          <Row label="HSL" value={`hsl(${result.hsl.h}, ${result.hsl.s}%, ${result.hsl.l}%)`} />
        </dl>
      )}

      {result?.ok && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          힌트: 위 입력에 RGB나 HSL을 붙여넣어도 자동으로 인식해 모든 형식으로 변환합니다.
        </p>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <span className="w-12 shrink-0 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <code className="flex-1 break-all font-mono text-sm text-zinc-800 dark:text-zinc-200">
        {value}
      </code>
      <CopyButton text={value} className="btn !px-2 !py-1 text-xs" />
    </div>
  )
}
