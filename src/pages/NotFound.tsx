import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { useLang } from '@/hooks/useLang'
import { usePageTitle } from '@/hooks/usePageTitle'

export function NotFound() {
  const { dir, s, p } = useLang()
  usePageTitle(s.notFound.title)
  const Back = dir === 'rtl' ? ArrowRight : ArrowLeft

  return (
    <div className="py-20 text-center">
      <p className="text-6xl" aria-hidden="true">
        🧭
      </p>
      <h1 className="mt-6 text-3xl font-extrabold text-ink-900 dark:text-ink-50">
        {s.notFound.title}
      </h1>
      <p className="mt-3 text-ink-600 dark:text-ink-400">{s.notFound.body}</p>
      <Link
        to={p('/')}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent-700 px-6 py-3 font-bold text-white transition hover:bg-accent-800 dark:bg-accent-600 dark:hover:bg-accent-500"
      >
        <Back size={18} aria-hidden="true" />
        {s.notFound.backHome}
      </Link>
    </div>
  )
}
