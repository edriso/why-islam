import { useMemo, useState } from 'react'
import { Shuffle } from 'lucide-react'
import { Link } from 'react-router'
import { Quiz } from '@/components/content/Quiz'
import { useLang } from '@/hooks/useLang'
import { usePageTitle } from '@/hooks/usePageTitle'
import { allQuestions, pickQuestions } from '@/lib/quiz'

const ROUND_SIZE = 10

export function Practice() {
  const { lang, s, p } = useLang()
  usePageTitle(s.practice.title)
  // The seed is what decides which questions come up. Changing it is the whole
  // of «new questions»; the Quiz below remounts because its key changes.
  const [seed, setSeed] = useState(1)

  const bank = useMemo(() => allQuestions(lang), [lang])
  const questions = useMemo(() => pickQuestions(bank, ROUND_SIZE, seed), [bank, seed])

  return (
    <div>
      <header className="border-b border-ink-200 pb-8 dark:border-ink-800">
        <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl dark:text-ink-50">
          <span aria-hidden="true">🎯</span> {s.practice.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-600 dark:text-ink-400">
          {s.practice.intro(ROUND_SIZE)}
        </p>
        <p className="mt-3 text-sm text-ink-600 dark:text-ink-400">
          {s.practice.bankSize(bank.length)}
        </p>
      </header>

      {/*
        «New questions» swaps the whole round while focus stays on the button,
        so without this a screen-reader user gets no signal that anything
        changed. Always rendered, so the region is in the tree before it has
        anything to say, and it carries the round number: identical text would
        not be re-announced on the third round and after.
      */}
      <p role="status" className="sr-only">
        {seed > 1 ? s.practice.roundStatus(seed, ROUND_SIZE) : ''}
      </p>

      {bank.length === 0 ? (
        <p className="mt-10 text-ink-600 dark:text-ink-400">{s.practice.noQuestions}</p>
      ) : (
        <>
          <Quiz key={seed} questions={questions} title={s.practice.roundTitle} headingLevel="h2" />

          <div className="text-center">
            <button
              type="button"
              onClick={() => setSeed((value) => value + 1)}
              className="inline-flex items-center gap-2 rounded-full bg-accent-700 px-6 py-3 font-bold text-white shadow-soft transition hover:bg-accent-800 dark:bg-accent-600 dark:hover:bg-accent-500"
            >
              <Shuffle size={18} aria-hidden="true" />
              {s.practice.newRound}
            </button>
          </div>
        </>
      )}

      <p className="mt-10 text-center text-ink-600 dark:text-ink-400">
        {s.practice.missedOne}
        <Link to={p('/')} className="font-bold text-accent-700 hover:underline dark:text-accent-400">
          {s.practice.missedOneLink}
        </Link>
        {s.practice.missedOneTail}
      </p>
    </div>
  )
}
