import { useEffect, useRef, useState } from 'react'
import { Languages, Menu, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router'
import { Logo } from './Logo'
import { SettingsMenu } from './SettingsMenu'
import { ThemeToggle } from './ThemeToggle'
import { useLang } from '@/hooks/useLang'
import { LANG_NAME } from '@/lib/i18n'
import { cn } from '@/lib/utils'

function navClasses({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-full px-3 py-2.5 text-sm font-semibold transition',
    isActive
      ? 'bg-accent-100 text-accent-800 dark:bg-accent-950 dark:text-accent-200'
      : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-50',
  )
}

/**
 * The switch to the other language. It names its destination in that
 * language — «العربية» on English pages, “English” on Arabic ones — because the
 * reader it exists for is precisely the one who may not read the language the
 * rest of the header is in.
 */
function LanguageToggle() {
  const { lang, s, otherLangPath } = useLang()
  const other = lang === 'ar' ? 'en' : 'ar'
  return (
    <Link
      to={otherLangPath}
      lang={other}
      aria-label={s.a11y.switchLanguage}
      title={s.a11y.switchLanguage}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-ink-600 transition hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-50"
    >
      <Languages size={16} aria-hidden="true" />
      {LANG_NAME[other]}
    </Link>
  )
}

export function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { s, p } = useLang()
  const toggleRef = useRef<HTMLButtonElement>(null)

  const nav = [
    { to: p('/'), label: s.nav.lessons, end: true },
    { to: p('/practice'), label: s.nav.practice },
    { to: p('/cheatsheet'), label: s.nav.cheatsheet },
    { to: p('/glossary'), label: s.nav.glossary },
    { to: p('/about'), label: s.nav.about },
  ]

  // Close the mobile menu whenever the reader navigates somewhere.
  useEffect(() => setOpen(false), [pathname])

  // Escape closes it, matching the settings panel.
  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200 bg-ink-50/85 backdrop-blur dark:border-ink-800 dark:bg-ink-950/85">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
        <Link
          to={p('/')}
          className="flex shrink-0 items-center gap-2 font-extrabold text-ink-900 dark:text-ink-50"
        >
          <Logo className="size-8 text-accent-600 dark:text-accent-400" />
          <span className="text-lg">{s.site.name}</span>
        </Link>

        <nav aria-label={s.a11y.mainNav} className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClasses}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* No repository link up here. It is a link for the handful of readers
            who want the source, and the footer already carries it; in the header
            it competed for space with the settings, the theme toggle and the
            menu button on exactly the narrow screens that could least spare it. */}
        <div className="flex items-center gap-1.5">
          <LanguageToggle />
          <SettingsMenu />
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? s.a11y.closeMenu : s.a11y.openMenu}
            className="rounded-full p-2.5 text-ink-600 transition hover:bg-ink-100 hover:text-ink-900 md:hidden dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-50"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label={s.a11y.mainNav}
          className="border-t border-ink-200 px-4 py-3 md:hidden dark:border-ink-800"
        >
          <ul role="list" className="mx-auto flex max-w-4xl flex-col gap-1">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => cn(navClasses({ isActive }), 'block')}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
