#!/usr/bin/env node
/**
 * Generates src/content/lessons.index.json: the frontmatter of every lesson in
 * both languages, merged by slug, and nothing else.
 *
 * Why this file exists. Lessons are loaded with an eager `import.meta.glob` of
 * the Markdown, which is what makes "drop a file in src/content/lessons/ and it
 * appears" true with no code change. But a raw import is all-or-nothing: the
 * home page only needs each lesson's title, description and unit, and pulling
 * every lesson body into the entry chunk to get them cost learn-tajweed 60 KB
 * gzipped before the split. So the metadata is generated here and imported as
 * JSON by src/lib/lessons.ts, while the bodies stay behind
 * src/lib/lesson-content.ts, which only the lazy routes import.
 *
 * The bilingual contract this file enforces:
 *
 * - Every lesson is a PAIR: ar/<slug>.md and en/<slug>.md. A slug present in
 *   one language and missing from the other fails the build, because a reader
 *   who switches language on a lesson page must never land on a 404.
 * - The Arabic file is canonical for `unit`, `order`, `minutes` and `emoji`.
 *   The English file carries only its own words (title, description, tags,
 *   videos, resources); if it declares the structural fields too, that is two
 *   places to disagree, so the build refuses.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const LESSONS = resolve(ROOT, 'src/content/lessons')
const OUT = resolve(ROOT, 'src/content/lessons.index.json')
const UNITS = new Set(
  JSON.parse(await readFile(resolve(ROOT, 'src/content/units.json'), 'utf8')).map(
    (unit) => unit.id,
  ),
)

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

async function readMeta(lang, file) {
  const raw = await readFile(resolve(LESSONS, lang, file), 'utf8')
  const match = raw.match(FRONTMATTER)
  if (!match) {
    console.error(`✗ ${lang}/${file} is missing its frontmatter block.`)
    process.exit(1)
  }
  try {
    return parse(match[1])
  } catch (error) {
    console.error(`✗ ${lang}/${file}: broken YAML frontmatter: ${error.message}`)
    console.error('  (An Arabic sentence containing «:» must be wrapped in single quotes.)')
    process.exit(1)
  }
}

async function slugsOf(lang) {
  const files = await readdir(resolve(LESSONS, lang))
  return files
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))
    .sort()
}

const [arSlugs, enSlugs] = await Promise.all([slugsOf('ar'), slugsOf('en')])

const missingEn = arSlugs.filter((slug) => !enSlugs.includes(slug))
const missingAr = enSlugs.filter((slug) => !arSlugs.includes(slug))
if (missingEn.length || missingAr.length) {
  for (const slug of missingEn) console.error(`✗ ${slug}: exists in ar/ but not in en/.`)
  for (const slug of missingAr) console.error(`✗ ${slug}: exists in en/ but not in ar/.`)
  console.error('  Every lesson is a pair: the language switch on a lesson page must never 404.')
  process.exit(1)
}

const STRUCTURAL = ['unit', 'order', 'minutes', 'emoji']
const REQUIRED_AR = ['title', 'description', ...STRUCTURAL]

const index = []
const orders = new Map()

for (const slug of arSlugs) {
  const ar = await readMeta('ar', `${slug}.md`)
  const en = await readMeta('en', `${slug}.md`)

  for (const field of REQUIRED_AR) {
    if (ar[field] === undefined) {
      console.error(`✗ ar/${slug}.md: missing required frontmatter field «${field}».`)
      process.exit(1)
    }
  }
  for (const field of ['title', 'description']) {
    if (en[field] === undefined) {
      console.error(`✗ en/${slug}.md: missing required frontmatter field «${field}».`)
      process.exit(1)
    }
  }
  for (const field of STRUCTURAL) {
    if (en[field] !== undefined) {
      console.error(
        `✗ en/${slug}.md declares «${field}», which belongs to the Arabic file alone. ` +
          `Remove it there; two declarations is two places to disagree.`,
      )
      process.exit(1)
    }
  }
  if (!UNITS.has(ar.unit)) {
    console.error(`✗ ar/${slug}.md: unknown unit «${ar.unit}»; see src/content/units.json.`)
    process.exit(1)
  }
  if (orders.has(ar.order)) {
    console.error(`✗ ${slug}: order ${ar.order} is already used by ${orders.get(ar.order)}.`)
    process.exit(1)
  }
  orders.set(ar.order, slug)

  const langMeta = (meta) => {
    const entry = { title: meta.title, description: meta.description }
    if (meta.tags) entry.tags = meta.tags
    if (meta.videos) entry.videos = meta.videos
    if (meta.resources) entry.resources = meta.resources
    return entry
  }

  index.push({
    slug,
    unit: ar.unit,
    order: ar.order,
    minutes: ar.minutes,
    emoji: ar.emoji,
    ar: langMeta(ar),
    en: langMeta(en),
  })
}

// Stable order in, stable diff out.
index.sort((a, b) => a.order - b.order)
await writeFile(OUT, `${JSON.stringify(index, null, 2)}\n`, 'utf8')

console.log(`✓ src/content/lessons.index.json: ${index.length} lessons × 2 languages (metadata only).`)
