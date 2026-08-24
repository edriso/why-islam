import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Link } from 'react-router'
import { useLang } from '@/hooks/useLang'
import { usePageTitle } from '@/hooks/usePageTitle'
import { foldArabic } from '@/lib/arabic'
import { TERMS } from '@/lib/glossary'

/** Case- and diacritic-insensitive match that works for both languages. */
function fold(value: string): string {
  return foldArabic(value).toLowerCase()
}

export function Glossary() {
  const { lang, s, p, l } = useLang()
  usePageTitle(s.glossary.title)
  const [query, setQuery] = useState('')

  const allTerms = useMemo(
    () =>
      TERMS.slice().sort((a, b) =>
        l(a.term).localeCompare(l(b.term), lang === 'ar' ? 'ar' : 'en'),
      ),
    [l, lang],
  )

  const results = useMemo(() => {
    const needle = fold(query)
    if (!needle) return allTerms
    return allTerms.filter(
      (entry) => fold(l(entry.term)).includes(needle) || fold(l(entry.definition)).includes(needle),
    )
  }, [query, allTerms, l])

  return (
    <div>
      <header className="border-b border-ink-200 pb-8 dark:border-ink-800">
        <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl dark:text-ink-50">
          <span aria-hidden="true">📖</span> {s.glossary.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-600 dark:text-ink-400">
          {s.glossary.intro}
        </p>

        <div className="relative mt-6">
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 start-4 -translate-y-1/2 text-ink-400"
            aria-hidden="true"
          />
          {/* The border is the only thing that marks where the field is, so it
              has to clear 3:1 (WCAG 1.4.11) rather than merely be visible. */}
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={s.glossary.searchPlaceholder}
            aria-label={s.glossary.searchLabel}
            className="w-full rounded-full border border-ink-500 bg-white py-3 ps-12 pe-4 text-ink-900 placeholder:text-ink-600 focus:border-accent-500 dark:border-ink-500 dark:bg-ink-900 dark:text-ink-50 dark:placeholder:text-ink-400"
          />
        </div>
        <p className="mt-3 text-sm text-ink-600 dark:text-ink-400" role="status">
          {s.glossary.countStatus(results.length, allTerms.length)}
        </p>
      </header>

      {results.length === 0 ? (
        <p className="mt-10 text-center text-ink-600 dark:text-ink-400">{s.glossary.noMatch}</p>
      ) : (
        <dl className="mt-8 space-y-4">
          {results.map((entry) => (
            <div
              key={entry.term.ar}
              className="rounded-card border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900"
            >
              <dt className="text-lg font-extrabold text-ink-900 dark:text-ink-50">
                {l(entry.term)}
              </dt>
              {/* No `leading-relaxed` here: some definitions quote a verse in
                  «…», and 1.625 is below Cairo's own `normal` of 1.874, the
                  one place Qur'anic text would sit under a tightened line box. */}
              <dd className="mt-1.5 text-ink-600 dark:text-ink-400">
                {l(entry.definition)}
                {entry.lesson && (
                  <Link
                    to={p(`/lessons/${entry.lesson}`)}
                    className="mt-2 block text-sm font-bold text-accent-700 hover:underline dark:text-accent-400"
                  >
                    {s.glossary.readLesson}
                  </Link>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}
