import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { className?: string }

function Base({ children, className, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  )
}

export function BracesIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1" />
      <path d="M16 3h1a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2 2 2 0 0 0-2 2v5a2 2 0 0 1-2 2h-1" />
    </Base>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </Base>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </Base>
  )
}

export function MonitorIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </Base>
  )
}

export function CopyIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Base>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M20 6 9 17l-5-5" />
    </Base>
  )
}

export function TrashIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    </Base>
  )
}

export function WandIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m3 21 12-12M14 4l1.5 1.5M19 9l1.5 1.5M18 3l.7 1.8L20.5 5.5l-1.8.7L18 8l-.7-1.8L15.5 5.5l1.8-.7Z" />
    </Base>
  )
}

export function MinifyIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 9h16M4 15h16M9 4l3 3 3-3M9 20l3-3 3 3" />
    </Base>
  )
}

export function TreeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <path d="M6 9v6a2 2 0 0 0 2 2h7M18 9v3" />
    </Base>
  )
}

export function DiffIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3v18M5 8H1m4-3v6M19 16h4m-4-3v6" />
    </Base>
  )
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m9 18 6-6-6-6" />
    </Base>
  )
}

export function GithubIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </Base>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </Base>
  )
}

export function CodeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4" />
    </Base>
  )
}

export function LinkIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </Base>
  )
}

export function KeyIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="7.5" cy="15.5" r="4" />
      <path d="m10.5 12.5 9-9M16 5l3 3M18 7l2-2" />
    </Base>
  )
}

export function ClockIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Base>
  )
}

export function HashIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
    </Base>
  )
}

export function FingerprintIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 11a8 8 0 0 1 16 0v1" />
      <path d="M7 13c0-2.8 2.2-5 5-5s5 2.2 5 5v1" />
      <path d="M10 16c0-1.1.9-2 2-2" />
      <path d="M12 19v-3" />
    </Base>
  )
}

export function PaletteIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 22a10 10 0 1 1 10-10c0 1.5-1.5 3-3 3h-2a3 3 0 0 0-3 3v2c0 1.5-1.5 2-2 2Z" />
      <circle cx="7" cy="11" r="1.2" />
      <circle cx="9" cy="6" r="1.2" />
      <circle cx="14" cy="6" r="1.2" />
      <circle cx="17" cy="9" r="1.2" />
    </Base>
  )
}

export function RegexIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m6 7-3 5 3 5" />
      <path d="m18 7 3 5-3 5" />
      <path d="M12 9v6M9.5 10.5l5 3M14.5 10.5l-5 3" />
    </Base>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </Base>
  )
}

export function StarIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m12 3 2.5 5.8 6.5.6-5 4.4 1.5 6.3L12 17l-5.5 3.1L8 13.8 3 9.4l6.5-.6Z" />
    </Base>
  )
}

export function StarFilledIcon({ className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="m12 3 2.5 5.8 6.5.6-5 4.4 1.5 6.3L12 17l-5.5 3.1L8 13.8 3 9.4l6.5-.6Z" />
    </svg>
  )
}

export function MenuIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </Base>
  )
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m15 18-6-6 6-6" />
    </Base>
  )
}

export function XIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </Base>
  )
}
