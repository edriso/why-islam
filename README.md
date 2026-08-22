# لماذا الإسلام؟ · Why Islam?

> **الموقع → [edriso.github.io/why-islam](https://edriso.github.io/why-islam/)**

دليلٌ مجّانيٌّ مفتوح المصدر في أصل الإيمان: هل للكون خالق؟ ولماذا الشرّ؟ وما الدليل على
صدق النبيّ محمّدٍ ﷺ؟ ثلاثون درسًا في تسع وحدات، مرتَّبةً ترتيبَ حجّةٍ من السؤال إلى
اليقين — بالعربيّة الفصحى الميسَّرة وبالإنجليزيّة، وكلُّ آيةٍ فيه منسوخةٌ من المصحف
آليًّا لا مكتوبةٌ باليد.

A free, open-source, fully bilingual (Arabic-first + English) guide to the
foundations of Islamic belief: does the universe have a Creator, why is there
suffering, and how do we know Muhammad ﷺ told the truth? Thirty lessons in nine
units, ordered as one continuous argument — reason first, then authentic sources —
with every Qur'anic verse machine-copied from a checksum-pinned mushaf, never typed.

## Running it

```bash
npm install
npm run dev          # verify the text, then start the dev server
npm run build        # verify + tsc + vite build + pre-render every route
npm run check        # verify + lint + type-check, no build
npm run og           # regenerate the share card and the PNG icons (needs Chrome)
npm run quran:find -- "من غير شيء"   # find which verse contains a phrase
```

Requires Node 22+.

## What makes it trustworthy

- **No verse is ever typed.** Lessons reference verses by number
  (`ref: 52:35`) and the build copies the text from a pinned Uthmani corpus
  (Tanzil, SHA-256-verified). Even inline quotations in `«…»` are compared to the
  mushaf character by character on every build. See
  [docs/quran-pipeline.md](./docs/quran-pipeline.md).
- **No weak hadith**, however popular; Bukhari/Muslim by default, anything else
  carries its grading and a link.
- **No overreaching “scientific miracle” claims** — one refuted claim would cost
  the site every sound argument beside it.
- **Contested scholarly questions are presented as contested**, with names and
  sources, never flattened into one answer.
- **No accounts, no ads, no analytics.** Reading progress lives in the reader's
  own browser, with export/import as a small JSON file.

## Writing lessons

One lesson = two Markdown files, `src/content/lessons/ar/<slug>.md` and
`en/<slug>.md`. Adding a pair of files adds a lesson — no code change. The complete
authoring reference, including the custom blocks (`ayah`, `hadith`, `doubt`,
`compare`, `quiz`) and the sources rules, is
[docs/writing-lessons.md](./docs/writing-lessons.md). The full curriculum plan is
[docs/curriculum.md](./docs/curriculum.md).

## Found a mistake?

A mistake here is a mistake about the din, so please report it — open an issue, or
a pull request with a source. Corrections about the Qur'anic text itself are
almost certainly corrections to *references* (the text is Tanzil's, unmodified,
and checksummed); corrections about hadith or tafsir should cite the recognised
collections and commentaries.

## Forking

Everything written for this repository — app, scripts, lessons — is
[0BSD](./LICENSE): copy it, rename it, sell it, no attribution required. What is
**not** ours to give away is listed in [NOTICE](./NOTICE) (the Tanzil Qur'an text,
surah-name data, recitation audio sources, and the fonts) — those terms travel
with any fork.

The deployment is fork-safe by construction: no address is hardcoded anywhere.
`site.config.mjs` derives the site URL from the repository name at build time, so
a fork deploys correctly to its own GitHub Pages with **zero configuration** —
push to `main` with Pages set to "GitHub Actions" and it just works. To serve at a
custom domain instead, set the `SITE_URL` repository variable; to publish a second
mirror copy, set `MIRROR_REPO` and a `MIRROR_DEPLOY_KEY` secret (see
`.github/workflows/deploy.yml`, which explains both).
