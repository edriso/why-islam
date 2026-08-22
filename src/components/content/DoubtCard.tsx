import { Check, MessageCircleQuestion } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

export interface DoubtSpec {
  /** The objection, stated in its strongest form — see docs/writing-lessons.md. */
  claim: string
  /** The answer, in a paragraph or two. */
  answer: string
}

/**
 * An objection and its answer, side by side. The signature block of this site.
 *
 * The claim is worded the way its holder would word it, not a caricature: a
 * reader who has heard the strong version of the objection and finds only a
 * weak one here will rightly conclude we could not answer the strong one.
 * The icons carry the meaning together with the labels, so the card never
 * relies on colour alone.
 */
export function DoubtCard({ spec }: { spec: DoubtSpec }) {
  const { s } = useLang()

  return (
    <div className="my-7 overflow-hidden rounded-card border border-ink-200 bg-white shadow-soft dark:border-ink-800 dark:bg-ink-900">
      <div className="border-b border-ink-200 bg-ink-100/60 p-4 dark:border-ink-800 dark:bg-ink-800/40">
        <p className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-ink-800 dark:text-ink-200">
          <MessageCircleQuestion size={16} aria-hidden="true" />
          {s.doubt.claim}
        </p>
        <p className="text-ink-700 dark:text-ink-300">{spec.claim}</p>
      </div>
      <div className="p-4">
        <p className="mb-1.5 flex items-center gap-1.5 text-sm font-bold text-accent-700 dark:text-accent-400">
          <Check size={16} strokeWidth={3} aria-hidden="true" />
          {s.doubt.answer}
        </p>
        <p className="whitespace-pre-line text-ink-700 dark:text-ink-300">{spec.answer}</p>
      </div>
    </div>
  )
}
