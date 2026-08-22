import { useEffect } from 'react'
import { useLang } from './useLang'

/**
 * Sets the tab title for a route, in the route's own language.
 *
 * The site is a single page app, so nothing changes `document.title` on its
 * own. Without this, `/practice` and `/glossary` announce and bookmark under
 * the same name as the home page, which fails WCAG 2.4.2 and makes the browser
 * history useless.
 */
export function usePageTitle(title?: string) {
  const { s } = useLang()
  useEffect(() => {
    document.title = title ? `${title} · ${s.site.name}` : `${s.site.name} · ${s.site.tagline}`
  }, [title, s])
}
