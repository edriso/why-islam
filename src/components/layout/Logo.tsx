/**
 * The site mark: a crescent with a small star in the gold accent.
 * Pure geometry, no text, so it stays sharp at any size and needs no font.
 * The crescent is a single arc-to-arc path (a waning moon), deep enough to
 * still read as a crescent at header size rather than as a filled circle.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
        fill="currentColor"
      />
      <path
        d="M18.5 2.2l0.95 1.85L21.3 5l-1.85 0.95L18.5 7.8l-0.95-1.85L15.7 5l1.85-0.95Z"
        className="fill-gold-500"
      />
    </svg>
  )
}
