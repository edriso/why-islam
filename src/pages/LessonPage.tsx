import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock, PlayCircle, Sparkles } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { CompletionCard } from '@/components/CompletionCard'
import { Markdown } from '@/components/content/Markdown'
import { ProgressBar } from '@/components/ProgressBar'
import { useLang } from '@/hooks/useLang'
import { useProgress } from '@/hooks/useProgress'
import { getLessonContent } from '@/lib/lesson-content'
import { getLesson, lessonsOfUnit, lessonWords, neighbours } from '@/lib/lessons'
import { getUnit } from '@/lib/units'
import { cn } from '@/lib/utils'
import { NotFound } from './NotFound'

export function LessonPage() {
  const { slug = '' } = useParams()
  const { lang, dir, s, p, l } = useLang()
  const lesson = getLesson(slug)
  const { isDone, toggle, completed, total, percent, finished } = useProgress()

  /*
   * The slug the reader ticked on this page, or null.
   *
   * This is what separates «the reader just did this» from «this was already
   * true when the page opened», and everything below that greets the reader
   * hangs off it. The stored state cannot answer the question: `finished`, and a
   * completed unit, both stay true afterwards, so a page opened later would
   * congratulate them again for something they did last week. Storing the slug
   * rather than a boolean also stops the greeting following them to the next
   * lesson — react-router reuses this route component across slugs, so a boolean
   * would survive the navigation that a keyed value cannot.
   */
  const [markedAt, setMarkedAt] = useState<string | null>(null)

  const words = lesson ? lessonWords(lesson, lang) : undefined

  // The site is a single page app, so the tab title has to be set by hand.
  useEffect(() => {
    document.title = words ? `${words.title} · ${s.site.name}` : s.site.name
    return () => {
      document.title = s.site.name
    }
  }, [words, s])

  if (!lesson || !words) return <NotFound />

  // Previous/next point along the reading direction, which follows the page's
  // language: back is the start side, forward is the end side.
  const Back = dir === 'rtl' ? ArrowRight : ArrowLeft
  const Forward = dir === 'rtl' ? ArrowLeft : ArrowRight

  const unit = getUnit(lesson.unit)
  const { prev, next } = neighbours(lesson.slug)
  const done = isDone(lesson.slug)

  /*
   * Three tiers, and the difference between them is the whole design.
   *
   * Marking a lesson done gets no celebration: the button fills in, and the bar
   * at the foot of the page moves. That is information, and information is what
   * a reader who ticked a box asked for. A burst thirty times over would cost
   * the thirtieth one its meaning. This was argued out and settled on the
   * evidence — see rule «No reward mechanics» in CLAUDE.md.
   *
   * Finishing a whole unit gets a line naming it. Nine times, no animation
   * beyond a fade, no score.
   *
   * Finishing the guide gets the card and the burst, once.
   */
  const justMarked = markedAt === slug
  const unitDone = lessonsOfUnit(lesson.unit).every((one) => isDone(one.slug))
  const finishedGuideNow = justMarked && finished
  // Not both: the last lesson of the guide is also the last of its unit, and the
  // card already says everything the unit line would.
  const finishedUnitNow = justMarked && unitDone && !finished

  /**
   * Record the tick; forget it on an un-tick, which makes any claim resting on
   * it false again. Everything derived above reads the *post*-toggle state, so
   * there is no arithmetic here to keep in step with the hook.
   *
   * It works on `slug` rather than `lesson.slug` — the same string, since the
   * lesson was looked up by it — because narrowing `lesson` away from
   * `undefined` above does not reach inside this closure.
   */
  function markDone() {
    setMarkedAt(done ? null : slug)
    toggle(slug)
  }

  const announcement = !done
    ? ''
    : finishedGuideNow
      ? s.lesson.announceGuideDone
      : finishedUnitNow && unit
        ? s.lesson.announceUnitDone(l(unit.title))
        : s.lesson.announceDone(completed, total)

  return (
    <div>
      <Link
        to={p('/')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 transition hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-50"
      >
        <Back size={16} aria-hidden="true" />
        {s.lesson.allLessons}
      </Link>

      <header className="mt-6 border-b border-ink-200 pb-8 dark:border-ink-800">
        {unit && (
          <p className="text-sm font-bold text-accent-700 dark:text-accent-400">{l(unit.title)}</p>
        )}
        <h1 className="mt-2 flex flex-wrap items-center gap-3 text-3xl font-extrabold text-ink-900 sm:text-4xl dark:text-ink-50">
          <span aria-hidden="true">{lesson.emoji}</span>
          {words.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-600 dark:text-ink-400">
          {words.description}
        </p>
        <p className="mt-4 flex items-center gap-1.5 text-sm text-ink-600 dark:text-ink-400">
          <Clock size={14} aria-hidden="true" />
          {s.lesson.minutesRead(lesson.minutes)}
        </p>
      </header>

      <Markdown slug={lesson.slug}>{getLessonContent(lang, lesson.slug) ?? ''}</Markdown>

      {/* ── Watch ────────────────────────────────────────────────────── */}
      {words.videos && words.videos.length > 0 && (
        <section className="mt-14">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-ink-900 dark:text-ink-50">
            <PlayCircle
              size={22}
              className="text-accent-700 dark:text-accent-400"
              aria-hidden="true"
            />
            {s.lesson.watch}
          </h2>
          <div className="mt-4 space-y-6">
            {words.videos.map((video) => (
              <figure key={video.youtubeId}>
                <div className="overflow-hidden rounded-card border border-ink-200 dark:border-ink-800">
                  <iframe
                    // youtube-nocookie does not set tracking cookies until play.
                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}${
                      video.start ? `?start=${video.start}` : ''
                    }`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="aspect-video w-full"
                  />
                </div>
                <figcaption className="mt-2 text-sm text-ink-600 dark:text-ink-400">
                  {video.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ── Go deeper ────────────────────────────────────────────────── */}
      {words.resources && words.resources.length > 0 && (
        <section className="mt-14">
          <h2 className="flex items-center gap-2 text-2xl font-extrabold text-ink-900 dark:text-ink-50">
            <BookOpen
              size={22}
              className="text-accent-700 dark:text-accent-400"
              aria-hidden="true"
            />
            {s.lesson.goDeeper}
          </h2>
          <ul role="list" className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {words.resources.map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-full flex-col rounded-card border border-ink-200 bg-white p-4 transition hover:border-accent-400 hover:shadow-soft dark:border-ink-800 dark:bg-ink-900 dark:hover:border-accent-700"
                >
                  <span className="font-bold text-ink-900 dark:text-ink-50">{resource.title}</span>
                  {resource.note && (
                    <span className="mt-1 text-sm text-ink-600 dark:text-ink-400">
                      {resource.note}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Mark as done ─────────────────────────────────────────────── */}
      <div className="mt-14 rounded-card border border-ink-200 bg-white p-5 text-center dark:border-ink-800 dark:bg-ink-900">
        {/* No `aria-pressed` alongside a label that flips wording: a toggle
            button is supposed to keep one name and let the pressed state change.
            Announcing both at once contradicts itself, and giving it a fixed
            aria-label over a changing visible label would break Label in Name.
            The wording, the fill and the check together carry the state. */}
        <button
          type="button"
          onClick={markDone}
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold transition',
            done
              ? 'bg-accent-700 text-white hover:bg-accent-800 dark:bg-accent-600 dark:hover:bg-accent-500'
              : 'border border-ink-500 text-ink-700 hover:border-accent-400 hover:text-accent-800 dark:border-ink-500 dark:text-ink-300 dark:hover:border-accent-700 dark:hover:text-accent-300',
          )}
        >
          <Check size={18} strokeWidth={3} aria-hidden="true" />
          {done ? s.lesson.markedDone : s.lesson.markDone}
        </button>
        {/* The label changes while the button keeps focus, and VoiceOver often
            does not re-announce that. Same treatment as the audio button.

            This one region carries all three tiers, rather than each of them
            bringing its own: it is mounted before there is anything to say, and
            a region created in the same tick as its text is the race screen
            readers lose. It is also the only place a screen-reader user is told
            the count, since the bar below reports through `aria-valuetext` on a
            progressbar they would have to go looking for. */}
        <span role="status" className="sr-only">
          {announcement}
        </span>

        {/* Tier one, and the only thing most ticks produce: the bar moves. It
            appears only once the lesson is ticked, so it reads as the answer to
            something the reader just did rather than as a meter watching them
            read. */}
        {done && (
          <div className="mx-auto mt-5 max-w-sm">
            <ProgressBar completed={completed} total={total} percent={percent} />
          </div>
        )}

        <p className={cn('text-sm text-ink-600 dark:text-ink-400', done ? 'mt-4' : 'mt-2')}>
          {s.lesson.savedLocally}
        </p>
      </div>

      {/* Tier two: a unit finished. One line, gold-bordered, fading in. */}
      {finishedUnitNow && unit && (
        <p className="khatm-note mt-6 flex items-center justify-center gap-2 rounded-card border border-gold-300 bg-gold-100/50 px-5 py-4 text-center font-bold text-ink-800 dark:border-gold-800 dark:bg-gold-900/20 dark:text-ink-100">
          <Sparkles
            size={18}
            className="shrink-0 text-gold-700 dark:text-gold-300"
            aria-hidden="true"
          />
          {s.lesson.unitDoneLine(l(unit.title))}
        </p>
      )}

      {/* Tier three: the whole guide, finished on this click. Nothing but the
          tick that completes it puts this here — see `markedAt`. */}
      {finishedGuideNow && (
        <CompletionCard total={total} celebrate showLessonsLink className="mt-6" />
      )}

      {/* ── Previous / next ──────────────────────────────────────────── */}
      <nav
        aria-label={s.lesson.lessonNav}
        className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {prev ? (
          <Link
            to={p(`/lessons/${prev.slug}`)}
            className="group flex items-center gap-3 rounded-card border border-ink-200 bg-white p-4 transition hover:border-accent-400 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-accent-700"
          >
            <Back
              size={18}
              className="shrink-0 text-ink-400 transition group-hover:text-accent-700 dark:group-hover:text-accent-400"
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="block text-sm text-ink-600 dark:text-ink-400">
                {s.lesson.prevLesson}
              </span>
              <span className="block truncate font-bold text-ink-900 dark:text-ink-50">
                {lessonWords(prev, lang).title}
              </span>
            </span>
          </Link>
        ) : (
          <span />
        )}

        {next && (
          <Link
            to={p(`/lessons/${next.slug}`)}
            className="group flex items-center justify-end gap-3 rounded-card border border-ink-200 bg-white p-4 text-end transition hover:border-accent-400 sm:col-start-2 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-accent-700"
          >
            <span className="min-w-0">
              <span className="block text-sm text-ink-600 dark:text-ink-400">
                {s.lesson.nextLesson}
              </span>
              <span className="block truncate font-bold text-ink-900 dark:text-ink-50">
                {lessonWords(next, lang).title}
              </span>
            </span>
            <Forward
              size={18}
              className="shrink-0 text-ink-400 transition group-hover:text-accent-700 dark:group-hover:text-accent-400"
              aria-hidden="true"
            />
          </Link>
        )}
      </nav>
    </div>
  )
}
