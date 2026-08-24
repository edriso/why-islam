import { Link } from 'react-router'
import { GitHubIcon } from './GitHubIcon'
import { useLang } from '@/hooks/useLang'
import { getAyah, getSpan } from '@/lib/quran'
import { REPO_URL } from '@/lib/site'

/**
 * The verse that names what this whole site is doing: He shows His signs in
 * the horizons and in ourselves until it is plain that He is real. It is
 * looked up rather than typed: `npm run quran:build` sees this call and checks
 * the phrase against the mushaf, exactly as it does for a lesson.
 */
function FooterAyah() {
  const { s } = useLang()
  const ayah = getAyah('41:53')
  // Two spans, one slice. The stretch between them holds words plain text
  // cannot query: «حتى» is written with a dagger alef, and «آياتنا» and
  // «الآفاق» spell their alef madda two incompatible ways. So a short phrase
  // anchors each end and the text between comes along inside the slice, every
  // letter still from the corpus.
  const start = getSpan('41:53', 'سنريهم آياتنا')
  const end = getSpan('41:53', 'يتبين لهم أنه الحق')
  if (!ayah || !start || !end) return null

  return (
    <>
      <p lang="ar" dir="rtl" className="quran quran-sm text-center text-accent-700 dark:text-accent-300">
        {ayah.text.slice(start[0], end[1])}
      </p>
      <p className="mt-2 text-center text-sm text-ink-600 dark:text-ink-400">
        {s.footer.verseCaption(ayah.surahName, ayah.ayah)}
      </p>
    </>
  )
}

export function Footer() {
  const { s, p } = useLang()
  return (
    <footer className="mt-16 border-t border-ink-200 bg-ink-100/60 dark:border-ink-800 dark:bg-ink-900/40">
      {/* Extra bottom room below `xl`: the back-to-top button is fixed in the
          bottom corner, and at the end of the page it sat on top of the GitHub
          link and swallowed its clicks. The overlap only stops once the centred
          896px column is pushed clear of the button, at about 1090px wide. */}
      <div className="mx-auto max-w-4xl px-4 pt-10 pb-24 xl:pb-10">
        <FooterAyah />

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-ink-200 pt-6 text-sm text-ink-600 dark:text-ink-400 sm:flex-row sm:justify-between dark:border-ink-800 dark:text-ink-400">
          <p>
            {s.footer.line}
            <Link
              to={p('/about')}
              className="font-semibold text-accent-700 hover:underline dark:text-accent-400"
            >
              {s.footer.aboutSources}
            </Link>
          </p>
          {/* Omitted rather than broken: REPO_URL is derived, and a copy built
              outside both CI and a git clone has nothing to point at. */}
          {REPO_URL && (
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition hover:text-ink-900 dark:hover:text-ink-50"
            >
              <GitHubIcon size={16} />
              {s.footer.contribute}
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
