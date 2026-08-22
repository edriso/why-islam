import type { ReactNode } from 'react'
import { AlertTriangle, BookMarked, Lightbulb, Info } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { cn } from '@/lib/utils'

/** The four kinds of boxed note a lesson can use. */
export type CalloutKind = 'rule' | 'tip' | 'note' | 'warning'

const STYLES: Record<CalloutKind, { icon: LucideIcon; box: string; head: string }> = {
  // `rule` is the crisp statement of the lesson's argument — the one paragraph
  // to remember if the reader remembers nothing else.
  rule: {
    icon: BookMarked,
    box: 'border-accent-300 bg-accent-50 dark:border-accent-800 dark:bg-accent-950/50',
    head: 'text-accent-800 dark:text-accent-300',
  },
  tip: {
    icon: Lightbulb,
    box: 'border-gold-300 bg-gold-100/50 dark:border-gold-800 dark:bg-gold-900/20',
    head: 'text-gold-800 dark:text-gold-300',
  },
  note: {
    icon: Info,
    box: 'border-ink-300 bg-ink-100/70 dark:border-ink-700 dark:bg-ink-800/50',
    head: 'text-ink-800 dark:text-ink-200',
  },
  warning: {
    icon: AlertTriangle,
    box: 'border-danger/40 bg-danger/5 dark:border-danger-dark/40 dark:bg-danger-dark/10',
    head: 'text-danger dark:text-danger-dark',
  },
}

export function Callout({
  kind,
  title,
  children,
}: {
  kind: CalloutKind
  /** Overrides the default heading, for when the box needs its own name. */
  title?: string
  children: ReactNode
}) {
  const { s } = useLang()
  const style = STYLES[kind]
  const Icon = style.icon

  return (
    <aside className={cn('my-7 rounded-card border p-4 sm:p-5', style.box)}>
      <p className={cn('mb-2 flex items-center gap-2 font-bold', style.head)}>
        <Icon size={18} className="shrink-0" aria-hidden="true" />
        {title ?? s.callouts[kind]}
      </p>
      <div className="callout-body text-ink-700 dark:text-ink-300">{children}</div>
    </aside>
  )
}
