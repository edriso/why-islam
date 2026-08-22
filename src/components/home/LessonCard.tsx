import { Check, Clock } from 'lucide-react'
import { Link } from 'react-router'
import { useLang } from '@/hooks/useLang'
import type { Lesson, LessonWords } from '@/lib/lessons'
import { cn } from '@/lib/utils'

export function LessonCard({
  lesson,
  words,
  number,
  done,
}: {
  lesson: Lesson
  /** The lesson's title and description in the page's language. */
  words: LessonWords
  /** Position in the whole curriculum, shown so the order is obvious. */
  number: number
  done: boolean
}) {
  const { s, p } = useLang()
  return (
    <Link
      to={p(`/lessons/${lesson.slug}`)}
      className={cn(
        'group flex gap-4 rounded-card border bg-white p-4 transition hover:shadow-soft dark:bg-ink-900',
        done
          ? 'border-accent-300 dark:border-accent-800'
          : 'border-ink-200 hover:border-accent-400 dark:border-ink-800 dark:hover:border-accent-700',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
          done
            ? 'bg-accent-600 text-white'
            : 'bg-ink-100 text-ink-600 group-hover:bg-accent-100 group-hover:text-accent-800 dark:bg-ink-800 dark:text-ink-400 dark:group-hover:bg-accent-950 dark:group-hover:text-accent-300',
        )}
      >
        {done ? <Check size={18} strokeWidth={3} /> : s.digits(number)}
      </span>
      <span className="sr-only">{s.home.lessonN(number)}</span>

      <div className="min-w-0">
        {/* h4, not h3: this card sits inside a unit whose title is the h3, so an
            h3 here would make every lesson a sibling of its own unit. */}
        <h4 className="font-bold text-ink-900 group-hover:text-accent-800 dark:text-ink-50 dark:group-hover:text-accent-300">
          <span aria-hidden="true">{lesson.emoji}</span> {words.title}
          {done && <span className="sr-only">{s.home.doneSr}</span>}
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-ink-600 dark:text-ink-400">
          {words.description}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-600 dark:text-ink-400">
          <Clock size={13} aria-hidden="true" />
          {s.lesson.minutesRead(lesson.minutes)}
        </p>
      </div>
    </Link>
  )
}
