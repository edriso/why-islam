import { Markdown } from './Markdown'
import { useLang } from '@/hooks/useLang'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getPage } from '@/lib/pages'
import { NotFound } from '@/pages/NotFound'

/** Renders one of the Markdown files in src/content/pages/{ar,en}/. */
export function MarkdownPage({ slug }: { slug: string }) {
  const { lang } = useLang()
  const page = getPage(lang, slug)

  usePageTitle(page?.title)

  if (!page) return <NotFound />

  return (
    <div>
      <header className="border-b border-ink-200 pb-8 dark:border-ink-800">
        <h1 className="flex flex-wrap items-center gap-3 text-3xl font-extrabold text-ink-900 sm:text-4xl dark:text-ink-50">
          <span aria-hidden="true">{page.emoji}</span>
          {page.title}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-600 dark:text-ink-400">
          {page.description}
        </p>
      </header>
      <Markdown slug={page.slug}>{page.content}</Markdown>
    </div>
  )
}
