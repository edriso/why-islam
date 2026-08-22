import { cn } from '@/lib/utils'

export interface CompareColumn {
  title: string
  points: string[]
}

export interface CompareSpec {
  columns: CompareColumn[]
}

/**
 * Two or three positions side by side — a worldview against a worldview, an
 * objection against its answer — so the difference is visible in one glance
 * instead of buried in prose.
 */
export function Compare({ spec }: { spec: CompareSpec }) {
  return (
    <div
      className={cn(
        'my-7 grid grid-cols-1 gap-4',
        spec.columns.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
      )}
    >
      {spec.columns.map((column) => (
        <div
          key={column.title}
          className="rounded-card border border-ink-200 bg-white p-4 shadow-soft dark:border-ink-800 dark:bg-ink-900"
        >
          <h3 className="inline-flex rounded-full bg-ink-100 px-3 py-1 text-base font-bold text-ink-800 dark:bg-ink-800 dark:text-ink-200">
            {column.title}
          </h3>
          <ul role="list" className="mt-3 list-none space-y-2 ps-0 text-ink-700 dark:text-ink-300">
            {column.points.map((point) => (
              <li key={point} className="flex gap-2">
                <span
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-ink-400"
                  aria-hidden="true"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
