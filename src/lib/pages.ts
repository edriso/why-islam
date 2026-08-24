import { parse } from 'yaml'
import type { Lang } from './i18n'

/**
 * Standalone pages (the summary sheet, the about page) written as Markdown in
 * src/content/pages/{ar,en}/. They use exactly the same blocks as the lessons,
 * so `​```ayah` and friends work there too. Like lessons, every page is a
 * pair: one file per language, same slug.
 */

export interface PageMeta {
  title: string
  description: string
  emoji: string
}

export interface Page extends PageMeta {
  slug: string
  content: string
}

const FILES: Record<Lang, Record<string, string>> = {
  ar: import.meta.glob('../content/pages/ar/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>,
  en: import.meta.glob('../content/pages/en/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>,
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

function pagesOf(lang: Lang): Map<string, Page> {
  return new Map(
    Object.entries(FILES[lang]).map(([path, raw]) => {
      const slug = path.split('/').pop()!.replace(/\.md$/, '')
      const match = raw.match(FRONTMATTER)
      if (!match) throw new Error(`Page "${lang}/${slug}.md" is missing its frontmatter block.`)
      const meta = parse(match[1]) as PageMeta
      return [slug, { ...meta, slug, content: match[2].trim() }]
    }),
  )
}

const PAGES: Record<Lang, Map<string, Page>> = { ar: pagesOf('ar'), en: pagesOf('en') }

export function getPage(lang: Lang, slug: string): Page | undefined {
  return PAGES[lang].get(slug)
}
