import { ArrowLeft, ArrowRight, ListChecks, Scale, Volume2 } from 'lucide-react'
import { Link } from 'react-router'
import { CompletionCard } from '@/components/CompletionCard'
import { LessonCard } from '@/components/home/LessonCard'
import { ProgressBar } from '@/components/ProgressBar'
import { useLang } from '@/hooks/useLang'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useProgress } from '@/hooks/useProgress'
import { lessons, lessonsOfUnit, lessonWords } from '@/lib/lessons'
import { UNITS } from '@/lib/units'

const HOW_TO_USE_ICONS = [Scale, Volume2, ListChecks]

export function Home() {
  usePageTitle()
  const { lang, dir, s, p, l } = useLang()
  const { isDone, completed, total, percent, finished, nextLesson } = useProgress()
  const started = completed > 0

  // The forward arrow points against the reading direction's start side, so it
  // has to follow the page's language rather than a fixed side.
  const Forward = dir === 'rtl' ? ArrowLeft : ArrowRight

  /*
   * Three states, not two. A reader who has finished everything has no «where
   * they stopped» to be taken back to, and `nextLesson` is undefined, so the
   * button would keep promising to continue and then quietly drop them at
   * lesson one. Restarting is a fine thing for it to offer; saying so is the
   * part that matters.
   */
  const first = lessons[0]?.slug ?? ''
  const cta = finished
    ? { to: p(`/lessons/${first}`), label: s.home.ctaRestart }
    : started
      ? { to: p(`/lessons/${nextLesson?.slug ?? first}`), label: s.home.ctaContinue }
      : { to: p(`/lessons/${first}`), label: s.home.ctaStart }

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="py-6 text-center sm:py-10">
        <p className="text-sm font-bold text-accent-700 dark:text-accent-400">{s.home.kicker}</p>
        <h1 className="mt-3 text-3xl leading-[1.35] font-extrabold text-ink-900 sm:text-5xl sm:leading-[1.3] dark:text-ink-50">
          {s.home.title}
          <span className="mt-1 block text-accent-700 dark:text-accent-400">
            {s.home.titleAccent}
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-600 dark:text-ink-400">
          {s.home.intro}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={cta.to}
            className="inline-flex items-center gap-2 rounded-full bg-accent-700 px-6 py-3 font-bold text-white shadow-soft transition hover:bg-accent-800 dark:bg-accent-600 dark:hover:bg-accent-500"
          >
            {cta.label}
            <Forward size={18} aria-hidden="true" />
          </Link>
          <Link
            to={p('/cheatsheet')}
            className="inline-flex items-center gap-2 rounded-full border border-ink-500 px-6 py-3 font-bold text-ink-700 transition hover:border-accent-400 hover:text-accent-800 dark:border-ink-500 dark:text-ink-300 dark:hover:border-accent-700 dark:hover:text-accent-300"
          >
            {s.home.ctaCheatsheet}
          </Link>
        </div>

        <p className="mt-5 text-sm text-ink-600 dark:text-ink-400">
          {s.home.stats(total, UNITS.length)}
        </p>
      </section>

      {/* At 100% the bar has nothing left to say, so the completion card takes
          its place, and keeps it, for as long as progress stays there. The
          burst is not played here: it belongs to the moment of ticking the last
          lesson, on the lesson page. */}
      {finished ? (
        <CompletionCard total={total} className="mt-4" />
      ) : started ? (
        <section className="mt-4 rounded-card border border-ink-200 bg-white p-5 shadow-soft dark:border-ink-800 dark:bg-ink-900">
          <ProgressBar completed={completed} total={total} percent={percent} />
        </section>
      ) : null}

      {/* ── How to use it ────────────────────────────────────────────── */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-ink-900 dark:text-ink-50">{s.home.howToUseTitle}</h2>
        <ul role="list" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {s.home.howToUse.map(({ title, body }, index) => {
            const Icon = HOW_TO_USE_ICONS[index]
            return (
              <li
                key={title}
                className="rounded-card border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900"
              >
                <Icon
                  size={22}
                  className="text-accent-700 dark:text-accent-400"
                  aria-hidden="true"
                />
                <h3 className="mt-3 font-bold text-ink-900 dark:text-ink-50">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
                  {body}
                </p>
              </li>
            )
          })}
        </ul>
      </section>

      {/* ── The curriculum ───────────────────────────────────────────── */}
      <section className="mt-14">
        <h2 className="text-2xl font-extrabold text-ink-900 dark:text-ink-50">
          {s.home.curriculumTitle}
        </h2>
        <p className="mt-2 text-ink-600 dark:text-ink-400">{s.home.curriculumIntro}</p>

        {/* Nine units make a long page, so let readers jump straight to one.
            These must be `Link`s, not plain `<a href="#…">`. A bare fragment
            link is a navigation the browser performs itself, and the history
            entry it creates carries none of the router's state, so the router
            reads it as a return to the entry the page was opened on and
            restores that entry's saved scroll position, cancelling the jump.
            A `Link` pushes a location the router owns, and its scroll
            restoration then honours the hash. */}
        <nav aria-label={s.home.jumpToUnit} className="mt-5">
          <ul role="list" className="flex flex-wrap gap-2">
            {UNITS.map((unit, unitIndex) => (
              <li key={unit.id}>
                <Link
                  to={`#unit-${unit.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-500 bg-white px-3 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-400 hover:text-accent-800 dark:border-ink-500 dark:bg-ink-900 dark:text-ink-300 dark:hover:border-accent-700 dark:hover:text-accent-300"
                >
                  <span className="text-ink-600 dark:text-ink-400">{s.digits(unitIndex + 1)}</span>
                  {l(unit.title)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ol role="list" className="mt-8 space-y-12">
          {UNITS.map((unit, unitIndex) => {
            const unitLessons = lessonsOfUnit(unit.id)
            if (unitLessons.length === 0) return null

            // No `scroll-mt` on the <li>: `html` already sets
            // `scroll-padding-top` to clear the sticky header, and the two add
            // up; the unit landed a hand's width down, with nothing above it.
            return (
              <li key={unit.id} id={`unit-${unit.id}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    {unit.emoji}
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold text-ink-900 dark:text-ink-50">
                      <span className="text-accent-700 dark:text-accent-400">
                        {s.home.unitN(unitIndex + 1)}
                      </span>
                      {l(unit.title)}
                    </h3>
                    <p className="mt-1 text-ink-600 dark:text-ink-400">{l(unit.description)}</p>
                  </div>
                </div>

                <ul role="list" className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {unitLessons.map((lesson) => (
                    <li key={lesson.slug}>
                      <LessonCard
                        lesson={lesson}
                        words={lessonWords(lesson, lang)}
                        number={lessons.indexOf(lesson) + 1}
                        done={isDone(lesson.slug)}
                      />
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
