import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router'
import { DIR, langOfPath, pathFor, switchLangPath, type Lang, type Localized } from '@/lib/i18n'
import { STRINGS, type Strings } from '@/lib/strings'

export interface LangContext {
  lang: Lang
  dir: 'rtl' | 'ltr'
  /** Every interface string, already in this page's language. */
  s: Strings
  /** «/lessons/x» → the same path in the current language. All links use it. */
  p: (path: string) => string
  /** Resolve a bilingual value ({ ar, en }) to this page's language. */
  l: <T>(value: Localized<T>) => T
  /** The current page's address in the other language, for the switcher. */
  otherLangPath: string
}

/**
 * The page's language, derived from the URL and nothing else.
 *
 * Arabic lives at the root, English under /en/; see src/lib/i18n.ts for why
 * the URL is the source of truth. Because the language is a pure function of
 * the pathname there is no provider and no stored state: any component that
 * calls this re-renders on navigation and always agrees with the address bar.
 */
export function useLang(): LangContext {
  const { pathname } = useLocation()
  const lang = langOfPath(pathname)

  const p = useCallback((path: string) => pathFor(lang, path), [lang])
  const l = useCallback(<T,>(value: Localized<T>): T => value[lang], [lang])

  return useMemo(
    () => ({ lang, dir: DIR[lang], s: STRINGS[lang], p, l, otherLangPath: switchLangPath(pathname) }),
    [lang, p, l, pathname],
  )
}
