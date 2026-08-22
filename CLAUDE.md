# CLAUDE.md

Guidance for Claude Code (and for humans) working in this repository.

## What this project is

A free, fully bilingual guide to the foundations of Islamic belief (عقيدة): does the
universe have a Creator, why is there suffering, why Islam, and the evidence that
Muhammad ﷺ is truly a messenger. Thirty lessons in nine units, ordered as one
continuous argument. Arabic (easy MSA) is the first language and lives at `/`;
English lives under `/en/`.

- **Live site:** https://edriso.github.io/why-islam/
- **Repo:** https://github.com/edriso/why-islam

The audience includes atheists and doubters reading with their guard up. Correctness
beats everything, and *tone* is part of correctness: one sneer, one weak hadith, or
one overreached claim costs the site its whole case.

This repository began as a fork of [learn-tajweed](https://github.com/edriso/learn-tajweed)
and inherits its architecture and its hard-won rules; where a rule below says "this
was a real bug", the bug may have happened there.

## Read these first

| File | When |
| --- | --- |
| [docs/curriculum.md](./docs/curriculum.md) | Before adding or reordering lessons |
| [docs/writing-lessons.md](./docs/writing-lessons.md) | Before touching any file in `src/content/` |
| [docs/quran-pipeline.md](./docs/quran-pipeline.md) | Before touching `scripts/` or anything about Qur'anic text |

## Commands

```bash
npm run dev          # verify the text, then start the dev server
npm run build        # verify + tsc + vite build + pre-render every route
npm run check        # verify + lint + type-check, no build
npm run og           # regenerate the share card and the PNG icons (needs Chrome)
npm run quran:find -- "من غير شيء"   # find which verse contains a phrase
```

Always run `npm run check` before pushing.

## The rules that matter most

### 1. Never type a Qur'anic verse

Reference it (`ref: 52:35`) and the build inserts the exact text from the pinned
Uthmani corpus. If a verse must appear in running prose, wrap it in `«…»` and the
build checks it character by character — **including every haraka**, so an
untashkeeled quotation fails on purpose. Guillemets are reserved for the mushaf;
quote hadith and everything else with ordinary quotes. Deliberate departures go in
`DELIBERATE` in `scripts/build-quran.mjs` with a reason; do not weaken the check.

### 2. No weak sources, ever

- **Hadith:** Bukhari and Muslim by default; anything else must carry a mainstream
  sahih/hasan grading, linked (sunnah.com / dorar.net), and the matn verified
  against the collection before commit. No weak narration however beloved.
- **No weak إعجاز علمي claims.** A scientific fact may illustrate a verse; no
  argument may *rest* on a strained scientific reading of one.
- **Tafsir claims cite tafsir** — al-Tabari, Ibn Kathir, al-Saʿdi, al-Muyassar.

### 3. Never present a contested point as settled

Where qualified scholarship genuinely differs — evolution and the creation of Adam,
dating details of the Rome prophecy, attributions of famous reports — the lesson
names the positions and who holds them. Flattening a real disagreement is a defect
even if the answer picked is the majority one. (Inherited from learn-tajweed, where
the same rule governs tajweed's genuine disputes.)

### 4. State every objection at full strength

A `doubt` block's `claim` must be worded the way its holders word it. If an atheist
reader looks at the claim and says "that's not our argument", the lesson has failed
before its answer starts. Answering the strongest version is the whole genre of
this site; answering caricatures is what it exists to replace.

### 5. The tone is fixed, and it is 16:125

Show that a position fails; never mock the person holding it. No dunking, no
triumphalism, no «انظر كيف أفحمنا». The reader this site is written for is exactly
the one watching how we treat their side.

### 6. Both languages are first-class, and the pair is enforced

Every lesson is `ar/<slug>.md` + `en/<slug>.md`; the build fails on a missing half,
because the header's language switch must never 404. The Arabic file is canonical
for `unit`/`order`/`minutes`/`emoji`; the English file carries only its own words,
written as natural English, never translationese. English verse renderings are the
author's explanation labeled "Meaning:", not a canonical translation — quran.com is
linked for those.

### 7. Arabic typography has three hard rules

These are not preferences. Each one was a real bug before it was a rule.

- **Never put a `text-*` utility on `.quran`.** Tailwind's size utilities set a
  line-height too, so `text-2xl` silently clamps the line box and clips the
  tashkeel. Use `.quran-md` or `.quran-sm`, which change only the size.
- **Never set a line-height below `normal` on Qur'anic text.** Amiri Quran has a
  2.45em content area because it reserves room for stacked marks. `.quran` pins 2.5.
- **Never use `letter-spacing` on Arabic.** It is a joined script. The
  `--tracking-*` tokens are zeroed in `src/index.css` so a stray `tracking-tight`
  cannot reintroduce it.

Related, and RTL/LTR-specific to this repo: prefer logical properties (`ps-`,
`pe-`, `ms-`, `me-`, `start-`, `end-`, `text-start`, `border-e`) everywhere — the
same components render both directions. Directional arrow icons must be chosen from
`dir` (see `Forward`/`Back` in Home and LessonPage). Large Arabic headings need an
explicit `leading-*` because Tailwind's size utilities clamp line-height below what
Arabic ascenders and hamzas need — the hero collided before `leading-[1.3]` fixed it.
Qur'anic text and hadith text are always `lang="ar" dir="rtl"`, even on English pages.

### 8. Arabic character classes get `\uXXXX` escapes

In `scripts/` and in `src/lib/arabic.ts`, never type Arabic letters inside a regular
expression. A bidirectional editor reorders ranges on screen, so a range can be
saved completely differently from how it reads, silently. The self-test in
`build-quran.mjs` exists because this actually happened.

### 9. Nothing haram, and videos verified

No images of people, no music, no channels that mix teaching with entertainment.
Verify a video id before embedding it.

### 10. No reward mechanics. This was considered and rejected on the evidence

**Do not add points, scores, streaks, badges, levels, leaderboards, daily goals, or
a celebration for finishing a single lesson.** Inherited from learn-tajweed with its
evidence, which is *about religious learning* and applies here with more force, not
less: gamification of sacred learning raised engagement without reaching learning
(R² = 0.021), leaderboards were actively negative, and extrinsic rewards risk
displacing the intrinsic motive — see the sources in learn-tajweed's CLAUDE.md
rule 7. A reader circling the biggest question of their life must not be drip-fed
dopamine for it. Progress is **reported, not rewarded**, in three tiers:

| Tier | How often | What happens |
| --- | --- | --- |
| A lesson ticked | 30× | The button fills in; the progress bar appears. No animation. |
| A unit finished | 9× | One line naming the unit, gold-bordered, fading in. |
| The guide finished | 1× | `CompletionCard` with the burst, once — and it says plainly that the honest next steps cannot be read off a screen. |

All three hang off `markedAt` in `LessonPage` (the slug ticked *on this page*), so
nothing congratulates a reader for last week. One live region carries all three
announcements. Do not flatten the tiers, and do not promote tier one.

### 11. Anything third-party gets an entry in NOTICE

Everything written for this repository is [0BSD](./LICENSE): no attribution, no
conditions, deliberately. Do not add a licence header to a file, and do not add a
credit-us line anywhere. Material this repository only redistributes (the Tanzil
Qur'an text — CC BY 3.0, surah-name data, recitation audio, the OFL fonts) is
listed in [NOTICE](./NOTICE); if you bring in a new corpus, dataset, font or audio
source, add it there in the same pass.

## Architecture

The site is content-driven. Lessons are Markdown; React is the shell that renders
them. The language is a **pure function of the URL** — Arabic at `/`, English under
`/en/` — so there is no language provider, no stored preference, and no first-render
race; a shared link opens in the language it was read in, and every prerendered
route declares its own `lang`/`dir` plus `hreflang` alternates.

```
data/                     the mushaf text + surah names (ar/en), pinned by checksum
docs/                     curriculum plan, authoring guide, pipeline internals
scripts/                  fetch, verify, generate, prerender, share card
src/
  content/lessons/{ar,en}/*.md   THE CONTENT. One lesson = one pair, no code change.
  content/pages/{ar,en}/*.md     the summary sheet and the about page, same pairing
  content/units.json      the nine units — JSON so the prerender reads the same file
  content/quran.generated.json   generated, never edit by hand
  content/lessons.index.json     generated, never edit by hand
  lib/i18n.ts             Lang, path helpers: langOfPath / pathFor / switchLangPath
  lib/strings.ts          every interface string, both languages, grammar included
  lib/lessons.ts          lesson metadata (both languages' words). NO bodies.
  lib/lesson-content.ts   the lesson bodies, both languages. Lazy routes only.
  lib/quran.ts            verse lookup over the generated JSON
  lib/glossary.ts         bilingual terms
  hooks/useLang.ts        { lang, dir, s, p, l } — every component's one i18n door
  components/content/     the custom blocks (ayah, hadith, doubt, compare, quiz, callouts)
  components/layout/      header (with language switch), footer, settings, theme
  pages/                  Home, LessonPage, Practice, Cheatsheet, Glossary, About, …
```

Decisions worth keeping (several inherited from learn-tajweed, still load-bearing):

- **Tailwind CSS v4, CSS-first.** Tokens live in the `@theme` block of
  `src/index.css`. The accent is lapis blue — one hue number (262) recolours the
  site. Gold stays for the singular: ayah-card headers, the completion card.
- **`lib/lessons.ts` (metadata) and `lib/lesson-content.ts` (bodies) are separate
  on purpose.** Anything that imports the bodies pulls **every lesson in both
  languages** into its chunk; only the lesson page and the practice page (via
  `lib/quiz.ts`) may.
- **No address is hardcoded anywhere** — `site.config.mjs` derives it from
  `GITHUB_REPOSITORY`, so a fork is correct with zero configuration; deviations are
  environment variables (`SITE_URL`, `SITE_CANONICAL`). The CI test is "what does a
  fork with no settings do?" — the answer must be "the right thing, silently". The
  optional mirror job is gated on `vars.MIRROR_REPO` (the `secrets` context is not
  available in a job-level `if`).
- **Deep links get a real 200.** `scripts/prerender-routes.mjs` writes every route
  in both languages with its own title, description, canonical, `hreflang` pair
  (x-default = Arabic), JSON-LD and font preloads, and localises `<html lang dir>`,
  the boot text and `og:locale` for the `/en/` tree. If `index.html`'s head
  changes, the script fails loudly rather than shipping pages that all claim to be
  the home page.
- **Scrolling on a route change is instant** (`scroll-behavior: smooth` stays off
  `<html>`); smooth is opt-in per action where it can check
  `prefers-reduced-motion`. In-page jumps are `Link`s, never bare `<a href="#…">`.
  `<ScrollRestoration>` keys carry the path.
- **When the code owns the scroll, `focus()` passes `preventScroll: true`** — the
  back-to-top button and the route-change focus in `Layout` were both real bugs in
  the parent repo. The completion card scrolls itself into view with
  `block: 'nearest'` and no `focus()`.
- **A stale build must not become a broken link.** The `errorElement` recognises a
  dead-chunk import and reloads once (sessionStorage-guarded). Never call
  `preventDefault()` on Vite's `vite:preloadError`.
- **No backend, no accounts, no analytics.** Progress is `localStorage`
  (`why-islam-progress`), language-independent — a lesson ticked in English is
  ticked in Arabic. Export/import is a small JSON file; import is a **union**,
  unknown slugs dropped.

## Adding a lesson

1. Add the slug to the plan in `docs/curriculum.md` (or take the next unwritten one).
2. Write `src/content/lessons/ar/<slug>.md` — canonical frontmatter lives here.
3. Write `src/content/lessons/en/<slug>.md` — its own natural-English words.
4. `npm run check` verifies the pair, the order, the unit, every verse and every
   YAML block.

## Git conventions

- Short imperative subjects. A conventional prefix (`feat:`, `fix:`, `docs:`,
  `content:`) is welcome.
- **No AI signatures.** Do not add "Generated with Claude" lines or
  `Co-Authored-By: Claude` trailers.
- Content changes can go straight to `main`. Use a branch for anything risky.
- Pushing to `main` deploys (`.github/workflows/deploy.yml`).
