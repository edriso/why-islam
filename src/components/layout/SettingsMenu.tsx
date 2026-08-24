import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Settings2 } from 'lucide-react'
import { ProgressTransfer } from './ProgressTransfer'
import { useLang } from '@/hooks/useLang'
import { getReciter, RECITERS, setReciter } from '@/lib/settings'
import { cn } from '@/lib/utils'

/**
 * The reader's own choices in one small panel: which reciter the verse play
 * buttons use, and where their progress is kept.
 *
 * This is a **disclosure**, not a dialog: focus is not trapped and the page
 * behind it stays live, so it is deliberately not announced as one. Escape
 * closes it and returns focus to the button that opened it.
 */
export function SettingsMenu() {
  const { l, s } = useLang()
  const [open, setOpen] = useState(false)
  const [reciter, setReciterState] = useState(getReciter)
  const boxRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  const close = useCallback((returnFocus = false) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent) {
      if (!boxRef.current?.contains(event.target as Node)) close()
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') close(true)
    }
    // Tabbing past the last control should dismiss it, as a menu would.
    function onFocusOut(event: FocusEvent) {
      // A null relatedTarget means focus was dropped rather than moved
      // somewhere else: clicking the panel's own description text, or switching
      // windows. `contains(null)` is false, so without this the panel closed
      // under the reader's cursor and was gone again after every alt-tab.
      if (event.relatedTarget === null) return
      if (!boxRef.current?.contains(event.relatedTarget as Node)) close()
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    boxRef.current?.addEventListener('focusout', onFocusOut)
    const box = boxRef.current
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      box?.removeEventListener('focusout', onFocusOut)
    }
  }, [open, close])

  function chooseReciter(id: string) {
    setReciter(id)
    setReciterState(id)
  }

  return (
    <div ref={boxRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        // aria-controls only while the panel exists: it is unmounted when
        // closed, so an unconditional one is a dangling IDREF.
        {...(open ? { 'aria-controls': panelId } : {})}
        aria-label={s.settings.label}
        title={s.settings.label}
        className="rounded-full p-2 text-ink-600 sm:p-2.5 transition hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-50"
      >
        <Settings2 size={18} />
      </button>

      {open && (
        /*
         * The trigger sits near the edge of the header, so a panel anchored to
         * it would hang off the side of a phone. Below `sm` it is pinned to the
         * viewport instead, just under the header; from `sm` up it goes back to
         * being a popover anchored to the button.
         *
         * It scrolls inside itself because neither position can be scrolled by
         * the page: on a phone held sideways the last control fell past the
         * fold with no way at all to reach it.
         */
        <div
          id={panelId}
          className="fixed inset-x-3 top-16 z-40 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain rounded-card border border-ink-200 bg-white p-4 shadow-lift sm:absolute sm:inset-x-auto sm:top-full sm:end-0 sm:mt-2 sm:w-80 dark:border-ink-700 dark:bg-ink-900"
        >
          {/*
            Real radio inputs rather than buttons with `aria-pressed`: the three
            reciters are mutually exclusive, and a fieldset of radios gets the
            grouping, the arrow-key behaviour and the announcement for free.
          */}
          <fieldset>
            <legend className="mb-2 text-sm font-bold text-ink-900 dark:text-ink-50">
              {s.settings.reciterLegend}
            </legend>
            <div className="space-y-1.5">
              {RECITERS.map((option) => {
                const active = option.id === reciter
                return (
                  <label
                    key={option.id}
                    className={cn(
                      'flex cursor-pointer gap-2.5 rounded-xl border p-2.5 transition',
                      active
                        ? 'border-accent-500 bg-accent-50 dark:border-accent-700 dark:bg-accent-950'
                        : 'border-transparent hover:bg-ink-100 dark:hover:bg-ink-800',
                    )}
                  >
                    <input
                      type="radio"
                      name="reciter"
                      value={option.id}
                      checked={active}
                      onChange={() => chooseReciter(option.id)}
                      className="mt-1.5 size-4 shrink-0 accent-accent-700 dark:accent-accent-500"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-ink-900 dark:text-ink-50">
                        {l(option.name)}
                      </span>
                      <span className="block text-sm text-ink-600 dark:text-ink-400">
                        {l(option.note)}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <hr className="my-3 border-ink-200 dark:border-ink-800" />

          <ProgressTransfer />
        </div>
      )}
    </div>
  )
}
