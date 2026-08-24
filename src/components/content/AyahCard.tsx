import { Fragment, useId } from 'react'
import { ExternalLink } from 'lucide-react'
import { AudioButton } from './AudioButton'
import { useLang } from '@/hooks/useLang'
import { getAyah, getSpan, quranComUrl, surahName } from '@/lib/quran'

export interface AyahSpec {
  /** «2:19», surah:ayah. */
  ref: string
  /** Show only this part of a long verse. Written without tashkeel. */
  show?: string
  /** The words the lesson is pointing at. Written without tashkeel. */
  highlight?: string | string[]
  /** One line explaining what to notice. Plain text, no Markdown. */
  note?: string
  /**
   * An explanatory rendering of the meaning, shown under the verse. English
   * lessons use it so a reader who cannot read the Arabic still gets the
   * verse; it is the author's explanation, labeled as such, not a canonical
   * translation; the quran.com link alongside carries those.
   */
  translation?: string
}

interface Segment {
  text: string
  marked?: boolean
}

/**
 * Cut the verse into plain and highlighted segments.
 * Every range was resolved and checked by `npm run quran:build`, so anything
 * that fails to resolve here means the generated data is stale: we then show
 * the verse unhighlighted rather than showing it wrong.
 */
function toSegments(text: string, ref: string, phrases: string[], from: number, to: number): Segment[] {
  const ranges = phrases
    .map((phrase) => getSpan(ref, phrase))
    .filter((span): span is [number, number] => span !== undefined)
    .filter((span) => span[0] >= from && span[1] <= to)
    .sort((a, b) => a[0] - b[0])

  const segments: Segment[] = []
  let cursor = from

  for (const span of ranges) {
    // Skip a range that overlaps the previous one instead of slicing mid-letter.
    if (span[0] < cursor) continue
    if (span[0] > cursor) segments.push({ text: text.slice(cursor, span[0]) })
    segments.push({ text: text.slice(span[0], span[1]), marked: true })
    cursor = span[1]
  }
  if (cursor < to) segments.push({ text: text.slice(cursor, to) })

  return segments
}

export function AyahCard({ spec }: { spec: AyahSpec }) {
  const captionId = useId()
  const { lang, s } = useLang()
  const ayah = getAyah(spec.ref)
  if (!ayah) {
    // Only reachable if the generated data is out of date; `npm run quran:build`
    // fixes it. Never render a guess in place of a verse.
    return (
      <p className="my-6 rounded-card border border-danger/40 bg-danger/5 p-4 text-sm text-danger">
        <bdi>{spec.ref}</bdi> {s.ayah.staleData} <code>npm run quran:build</code>.
      </p>
    )
  }

  const highlights = Array.isArray(spec.highlight)
    ? spec.highlight
    : spec.highlight
      ? [spec.highlight]
      : []

  const showSpan = spec.show ? getSpan(spec.ref, spec.show) : undefined
  const [from, to] = showSpan ?? [0, ayah.text.length]
  const isPartial = from > 0 || to < ayah.text.length

  const segments = toSegments(ayah.text, spec.ref, highlights, from, to)

  return (
    <figure
      aria-labelledby={captionId}
      className="my-7 overflow-hidden rounded-card border border-ink-200 bg-white shadow-soft dark:border-ink-800 dark:bg-ink-900"
    >
      <div className="border-b border-gold-200/70 bg-gold-100/40 px-4 py-2.5 dark:border-gold-900/60 dark:bg-gold-900/15">
        <div className="flex items-center justify-between gap-3">
          <p id={captionId} className="text-sm font-semibold text-ink-700 dark:text-ink-300">
            {s.ayah.surah} {surahName(ayah, lang)}
            {/* The spaces around the separator are explicit: the dot is
                aria-hidden and JSX drops the surrounding newline whitespace, so
                without them the accessible name reads the surah name and the
                verse word as one word on every card. */}
            {' '}
            <span className="mx-1.5 text-ink-400" aria-hidden="true">
              ·
            </span>
            {' '}
            {s.ayah.verse} {s.digits(ayah.ayah)}
            {isPartial && (
              <span className="text-ink-600 dark:text-ink-400">{s.ayah.partOfIt}</span>
            )}
          </p>
          <div className="flex items-center gap-1.5">
            <AudioButton ayah={ayah} />
            <a
              href={quranComUrl(ayah)}
              target="_blank"
              rel="noreferrer"
              title={s.ayah.openInContext}
              className="inline-flex size-10 items-center justify-center rounded-full text-ink-600 transition hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-50"
            >
              <ExternalLink size={16} aria-hidden="true" />
              <span className="sr-only">
                {s.ayah.openInContext} (<span lang="en">quran.com</span>)
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Always Arabic, whatever the page language: this is the verse itself. */}
      <p lang="ar" dir="rtl" className="quran px-5 py-6 text-center">
        {isPartial && (
          <span className="text-ink-400" aria-hidden="true">
            …{' '}
          </span>
        )}
        {/*
          The <mark> carries no font weight: Amiri Quran ships one 400 face, so
          asking for more would render the highlighted stretch in the Cairo
          fallback during the font swap: a visible weight seam inside a verse.
          The accent colour carries the emphasis on its own.
        */}
        {segments.map((segment, index) => (
          <Fragment key={index}>
            {segment.marked ? <mark>{segment.text}</mark> : segment.text}
          </Fragment>
        ))}
        {isPartial && (
          <span className="text-ink-400" aria-hidden="true">
            {' '}
            …
          </span>
        )}
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
