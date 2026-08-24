/**
 * The lesson bodies, both languages.
 *
 * Kept apart from src/lib/lessons.ts on purpose. This module eagerly imports
 * every Markdown file in both languages, so whatever imports it pulls every
 * lesson into its chunk. Only the lazy routes may: the lesson page, and the
 * practice page by way of src/lib/quiz.ts. The home page must not, or the
 * entry chunk grows by the whole curriculum to render a list of titles.
 *
 * If you find yourself importing this from something the home page reaches,
 * you probably want `lessons` from ./lessons instead; it has everything except
 * the bodies.
 */
import type { Lang } from './i18n'

const FILES: Record<Lang, Record<string, string>> = {
  // Two literal globs rather than one with a variable: Vite resolves
  // import.meta.glob statically, so the paths cannot be built from `lang`.
  ar: import.meta.glob('../content/lessons/ar/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>,
  en: import.meta.glob('../content/lessons/en/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>,
}

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n?([\s\S]*)$/

const BY_LANG: Record<Lang, Map<string, string>> = { ar: new Map(), en: new Map() }

for (const lang of ['ar', 'en'] as const) {
  for (const [path, raw] of Object.entries(FILES[lang])) {
    const slug = path.split('/').pop()!.replace(/\.md$/, '')
    const match = raw.match(FRONTMATTER)
    if (!match) {
      throw new Error(`Lesson "${lang}/${slug}.md" is missing its frontmatter block.`)
    }
    BY_LANG[lang].set(slug, match[1].trim())
  }
}

/** The Markdown body of one language of a lesson, without its frontmatter. */
export function getLessonContent(lang: Lang, slug: string): string | undefined {
  return BY_LANG[lang].get(slug)
}

/** Every lesson body of one language, keyed by slug. Used by the quiz bank. */
export function allLessonContent(lang: Lang): ReadonlyMap<string, string> {
  return BY_LANG[lang]
}
