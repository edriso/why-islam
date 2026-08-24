/** One place for the values that appear in more than one component. */
import type { Localized } from './i18n'

/** The site's name per language; the interface reads it via strings.ts. */
export const SITE_NAME: Localized = { ar: 'لماذا الإسلام؟', en: 'Why Islam?' }

/**
 * Where this copy's source lives. Worked out at build time from the repository
 * itself, never written down, so a fork's footer sends its readers to the
 * fork. Empty when it cannot be determined, and the footer then shows no link.
 * See `repoUrl()` in site.config.mjs and `define` in vite.config.ts.
 */
declare const __REPO_URL__: string
export const REPO_URL = __REPO_URL__
