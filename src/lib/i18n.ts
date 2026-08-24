/**
 * The two languages of the site, and how a URL says which one it is in.
 *
 * Arabic is the first language and lives at the root: `/lessons/from-nothing`.
 * English lives under `/en/`: `/en/lessons/from-nothing`. The language is in
 * the URL rather than in localStorage because a shared link must open in the
 * language it was read in, and because the prerendered copy of each route has
 * to declare one `lang`/`dir` to crawlers, which never run the JavaScript that
 * could read a stored preference.
 *
 * Nothing here touches React: the language is a pure function of the pathname,
 * so there is no provider, no context, and no first-render race. Components go
 * through src/hooks/useLang.ts, which feeds these helpers the current location.
 */

export type Lang = 'ar' | 'en'

export const LANGS: readonly Lang[] = ['ar', 'en']

export const DIR: Record<Lang, 'rtl' | 'ltr'> = { ar: 'rtl', en: 'ltr' }

/** Endonym of each language, shown on the switcher, never translated. */
export const LANG_NAME: Record<Lang, string> = { ar: 'العربية', en: 'English' }

/** The language a router pathname (without the Vite base) is in. */
export function langOfPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ar'
}

/**
 * A language-neutral path («/lessons/x», «/», «/about») made concrete for one
 * language. Every internal <Link> goes through this, so no component ever
 * writes «/en/» by hand.
 */
export function pathFor(lang: Lang, path: string): string {
  if (lang === 'ar') return path
  return path === '/' ? '/en' : `/en${path}`
}

/** The same page in the other language, for the header's language switch. */
export function switchLangPath(pathname: string): string {
  if (langOfPath(pathname) === 'en') {
    const bare = pathname.slice('/en'.length)
    return bare === '' ? '/' : bare
  }
  return pathFor('en', pathname)
}

/** Strip the language prefix: «/en/lessons/x» → «/lessons/x». */
export function neutralPath(pathname: string): string {
  if (langOfPath(pathname) === 'ar') return pathname
  const bare = pathname.slice('/en'.length)
  return bare === '' ? '/' : bare
}

/** A value that exists in both languages, resolved by the `l()` helper. */
export interface Localized<T = string> {
  ar: T
  en: T
}
