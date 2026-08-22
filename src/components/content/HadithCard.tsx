import { ExternalLink, ScrollText } from 'lucide-react'
import { useLang } from '@/hooks/useLang'

export interface HadithSpec {
  /** The hadith text in Arabic, quoted exactly from its source. */
  text: string
  /**
   * Attribution the reader can check: collection and number, e.g.
   * «صحيح البخاري (٦٠٩٤)» / "Sahih al-Bukhari 6094". For anything outside
   * Bukhari and Muslim it must also carry the grading — see
   * docs/writing-lessons.md, which forbids weak narrations outright.
   */
  source: string
  /** Deep link to the hadith, usually on sunnah.com. */
  url?: string
  /** English rendering, shown on English pages under the Arabic. */
  translation?: string
  /** One line of context: who said it to whom, or what to notice. */
  note?: string
}

/**
 * A hadith, visually distinct from a verse on purpose: the Qur'an card carries
 * the gold header and the mushaf font, and nothing else on the site may look
 * like it. This card is plainer — an ink border, the interface font — because
 * the difference between the Book and the reports *about* its Prophet ﷺ is a
 * distinction this site teaches.
 */
export function HadithCard({ spec }: { spec: HadithSpec }) {
  const { s } = useLang()

  return (
    <figure className="my-7 overflow-hidden rounded-card border border-ink-200 bg-white shadow-soft dark:border-ink-800 dark:bg-ink-900">
      <div className="flex items-center justify-between gap-3 border-b border-ink-200 bg-ink-100/60 px-4 py-2.5 dark:border-ink-800 dark:bg-ink-800/40">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-ink-700 dark:text-ink-300">
          <ScrollText size={15} aria-hidden="true" />
          {s.hadith.label}
        </p>
        {spec.url ? (
          <a
            href={spec.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-700 transition hover:underline dark:text-accent-400"
          >
            {spec.source}
            <ExternalLink size={13} aria-hidden="true" />
            <span className="sr-only">{s.a11y.opensNewTab}</span>
          </a>
        ) : (
          <p className="text-sm font-semibold text-ink-600 dark:text-ink-400">{spec.source}</p>
        )}
      </div>

      {/* The text itself is always Arabic, whatever the page language. A <p>,
          not <blockquote>: the .prose blockquote rules would win the
          specificity war against any utility and draw a second frame inside
          the card. */}
      <p
        lang="ar"
        dir="rtl"
        className="px-5 py-4 text-lg leading-loose font-medium text-ink-900 dark:text-ink-50"
      >
        {spec.text}
      </p>

      {(spec.translation || spec.note) && (
        <div className="space-y-2 border-t border-ink-200 px-4 py-3 dark:border-ink-800">
          {spec.translation && (
            <p className="text-sm leading-relaxed text-ink-700 dark:text-ink-300">
              <span className="font-bold text-ink-900 dark:text-ink-50">{s.ayah.meaning}: </span>
              {spec.translation}
            </p>
          )}
          {spec.note && <p className="text-sm text-ink-600 dark:text-ink-400">{spec.note}</p>}
        </div>
      )}
    </figure>
  )
}
