#!/usr/bin/env node
/**
 * Writes a copy of dist/index.html at every route the site has — in both
 * languages — so GitHub Pages answers a deep link with 200 instead of 404, and
 * gives each copy its own head.
 *
 * GitHub Pages serves static files only: it knows nothing about client-side
 * routing. The usual fix is to copy index.html to 404.html, and that does make
 * deep links work, but the response still carries a 404 status. Search engines
 * and link previews treat that as a dead page, and a lesson nobody can share is
 * a lesson nobody reads.
 *
 * Three things each copy gets:
 *
 * 1. Its own <title>, description, Open Graph tags and canonical, from the
 *    lesson's own frontmatter — in the language of the route. React sets
 *    `document.title` on navigation, but the crawlers behind a WhatsApp or
 *    Telegram link preview do not run JavaScript: they read the HTML as served.
 *
 * 2. The right `<html lang dir>` pair, plus `hreflang` alternates pointing at
 *    the same page in the other language. Arabic lives at the root and English
 *    under /en/; the x-default is the Arabic page, because Arabic is this
 *    site's first language. English copies also get their boot placeholder and
 *    og:locale swapped, so nothing on a prerendered /en/ page claims to be
 *    Arabic.
 *
 * 3. JSON-LD: a breadcrumb per lesson, and the site identity on each home page.
 *
 * What this deliberately does NOT do is write a static copy of the lesson into
 * #root — see learn-tajweed, where that was tried: `createRoot` replaces #root
 * wholesale on mount, so every visitor watched a wall of unstyled text turn
 * into the actual page.
 *
 * Every URL here ends in a slash. GitHub Pages serves a directory index only at
 * the trailing-slash form and 301s the bare form, so a canonical without it
 * points every crawler and every shared card at a redirect.
 */
import { execFile } from 'node:child_process'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { parse } from 'yaml'
import { BASE, CANONICAL_URL, IS_CANONICAL, SITE_URL } from '../site.config.mjs'

const run = promisify(execFile)

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = resolve(ROOT, 'dist')
const SOURCE = resolve(DIST, 'index.html')

const LANGS = ['ar', 'en']

/** Kept in step with SITE_NAME in src/lib/site.ts. */
const SITE_NAME = { ar: 'لماذا الإسلام؟', en: 'Why Islam?' }

const TAGLINE = {
  ar: 'دليلٌ هادئ من السؤال إلى اليقين',
  en: 'A calm guide from question to certainty',
}

const HOME_DESCRIPTION = {
  ar: 'هل للكون خالق؟ ولماذا الشرّ؟ وما الدليل على صدق محمّدٍ ﷺ؟ دليلٌ مجّانيّ يجيب عن أسئلة الوجود الكبرى بالعقل والقرآن، خطوةً خطوة، باحترامٍ لعقل السائل.',
  en: 'Does the universe have a Creator? Why suffering? How do we know Muhammad ﷺ told the truth? A free guide answering the big questions with reason and the Qur’an, step by step, respecting the questioner’s mind.',
}

const OG_LOCALE = { ar: 'ar_AR', en: 'en_US' }

const BOOT_TEXT = { ar: 'جارٍ تحميل الدليل…', en: 'Loading the guide…' }

/**
 * The two pages that are code rather than content have no frontmatter to read,
 * so their descriptions live here. Everything else takes its text from the
 * Markdown file, which keeps the content the single source of truth.
 */
const CODE_PAGES = {
  practice: {
    ar: {
      title: 'مراجعةٌ مختلطة',
      description:
        'أسئلةٌ من كلّ دروس الدليل في مكانٍ واحد، تُعرض بترتيبٍ مختلف كلّ مرّة، لتختبر ما رسخ من الحجّة كاملةً.',
    },
    en: {
      title: 'Mixed review',
      description:
        'Questions from every lesson of the guide in one place, shuffled each round, to test how much of the whole argument stuck.',
    },
  },
  glossary: {
    ar: {
      title: 'معجم المصطلحات',
      description:
        'شرحٌ موجزٌ للمصطلحات الواردة في الدليل — الفطرة والتوحيد والوحي والإعجاز وغيرها — مرتَّبةً للرجوع السريع.',
    },
    en: {
      title: 'Glossary',
      description:
        'Short definitions of the terms this guide uses — fitrah, tawhid, revelation, iʿjaz and more — arranged for quick reference.',
    },
  },
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

async function readDoc(file) {
  const raw = await readFile(file, 'utf8')
  const match = raw.match(FRONTMATTER)
  if (!match) throw new Error(`${file}: missing its frontmatter block.`)
  return { meta: parse(match[1]), body: match[2].trim() }
}

/** The units in curriculum order, for the lesson breadcrumbs. */
const units = new Map(
  JSON.parse(await readFile(resolve(ROOT, 'src/content/units.json'), 'utf8')).map((unit) => [
    unit.id,
    unit,
  ]),
)

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function jsonLd(data) {
  // </script> inside a JSON-LD block would close it early.
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
}

const lessonSlugs = (await readdir(resolve(ROOT, 'src/content/lessons/ar')))
  .filter((file) => file.endsWith('.md'))
  .map((file) => file.replace(/\.md$/, ''))
  .sort()

/**
 * Every route to write, one entry per (page, language). `neutral` is the
 * language-free path («lessons/x», '' for home), from which both concrete
 * paths — and therefore the hreflang pair — are derived.
 */
const routes = []

function langPath(lang, neutral) {
  if (lang === 'ar') return neutral
  return neutral === '' ? 'en' : `en/${neutral}`
}

for (const lang of LANGS) {
  for (const [slug, texts] of Object.entries(CODE_PAGES)) {
    routes.push({ lang, neutral: slug, ...texts[lang], ogType: 'website' })
  }

  for (const slug of ['cheatsheet', 'about']) {
    const file = `src/content/pages/${lang}/${slug}.md`
    const { meta } = await readDoc(resolve(ROOT, file))
    routes.push({
      lang,
      neutral: slug,
      title: meta.title,
      description: meta.description,
      ogType: 'article',
      file,
    })
  }

  for (const slug of lessonSlugs) {
    const file = `src/content/lessons/${lang}/${slug}.md`
    const { meta } = await readDoc(resolve(ROOT, file))
    const unit = units.get(meta.unit ?? '')
    routes.push({
      lang,
      neutral: `lessons/${slug}`,
      title: meta.title,
      description: meta.description,
      ogType: 'article',
      unit: unit?.title?.[lang],
      file,
    })
  }
}

/**
 * Preload the two Arabic faces.
 *
 * Both are declared `font-display: swap`, and the browser only discovers them
 * after it has fetched and parsed the stylesheet — so the first paint used a
 * fallback and the text visibly reflowed when Cairo and Amiri Quran arrived.
 * Preloading starts both in parallel with the CSS instead. Only the Arabic
 * subsets — English pages still quote the Qur'an in Arabic on their first
 * screen, and Cairo's Arabic file also carries the interface's Latin fallback
 * duty until the Latin subset arrives with the stylesheet.
 *
 * The filenames carry a content hash, so they are read back out of the build
 * rather than written down anywhere.
 */
async function fontPreloads() {
  const assets = await readdir(resolve(DIST, 'assets'))
  const wanted = ['cairo-arabic-wght-normal', 'amiri-quran-arabic-400-normal']
  const links = []
  for (const stem of wanted) {
    const file = assets.find((name) => name.startsWith(stem) && name.endsWith('.woff2'))
    if (!file) {
      throw new Error(
        `prerender: font file «${stem}*.woff2» not found in dist/assets. ` +
          `The font packages probably renamed their files — update scripts/prerender-routes.mjs.`,
      )
    }
    links.push(
      `<link rel="preload" as="font" type="font/woff2" crossorigin href="${BASE}assets/${file}" />`,
    )
  }
  return links.join('\n    ')
}

const preloads = await fontPreloads()

const withPreloads = (await readFile(SOURCE, 'utf8')).replace(
  '</head>',
  `  ${preloads}\n  </head>`,
)

// This pass rewrites dist/index.html in place, so running it twice over the same
// dist would stack a second canonical on top of the first. Vite regenerates the
// file on every build, so this only catches the script being run on its own.
if (withPreloads.includes('rel="canonical"')) {
  throw new Error(
    'prerender: dist/index.html has already been processed. Run the full `npm run build` instead of this script alone.',
  )
}

/**
 * Swaps one tag in the head. Throws rather than returning the input unchanged:
 * a silent miss here would ship every page claiming to be the home page, and
 * nothing downstream would notice.
 */
function replaceTag(html, pattern, replacement, label) {
  if (!pattern.test(html)) {
    throw new Error(
      `prerender: tag «${label}» not found in dist/index.html. ` +
        `index.html probably changed — update scripts/prerender-routes.mjs to match.`,
    )
  }
  return html.replace(pattern, replacement)
}

/**
 * og:image is inserted here rather than written in index.html, because it has
 * to be absolute — a link-preview crawler has no base to resolve against — and
 * the origin is known only to site.config.mjs.
 *
 * This one is SITE_URL, not CANONICAL_URL: it points at the copy this build
 * serves, so link previews keep working even if a second address the canonicals
 * name is unreachable.
 */
const template = replaceTag(
  withPreloads,
  /<meta\s+property="og:image:width"[\s\S]*?\/>/,
  (tag) => `<meta property="og:image" content="${SITE_URL}og.png" />\n    ${tag}`,
  'og:image:width',
)

/** The Arabic template turned into its English counterpart. */
function toEnglish(html) {
  let out = html.replace('<html lang="ar" dir="rtl">', '<html lang="en" dir="ltr">')
  if (out === html) {
    throw new Error('prerender: could not find <html lang="ar" dir="rtl"> to localise.')
  }
  out = out.replace(
    `<span class="boot-text">${BOOT_TEXT.ar}</span>`,
    `<span class="boot-text">${BOOT_TEXT.en}</span>`,
  )
  out = out.replace(
    `<meta property="og:site_name" content="${SITE_NAME.ar}" />`,
    `<meta property="og:site_name" content="${SITE_NAME.en}" />`,
  )
  return out
}

const templates = { ar: template, en: toEnglish(template) }

/** The alternate-language links every page carries, both ways plus x-default. */
function hreflangLinks(neutral) {
  const ar = `${CANONICAL_URL}${langPath('ar', neutral)}${neutral ? '/' : ''}`
  const enPath = langPath('en', neutral)
  const en = `${CANONICAL_URL}${enPath}/`
  return (
    `<link rel="alternate" hreflang="ar" href="${ar}" />\n    ` +
    `<link rel="alternate" hreflang="en" href="${en}" />\n    ` +
    `<link rel="alternate" hreflang="x-default" href="${ar}" />`
  )
}

function render(route) {
  const { lang, neutral, title, description, ogType } = route
  const path = langPath(lang, neutral)
  const fullTitle = `${title} · ${SITE_NAME[lang]}`
  const url = `${CANONICAL_URL}${path}${path ? '/' : ''}`
  const t = escapeHtml(fullTitle)
  const d = escapeHtml(description)

  let html = templates[lang]
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`, 'title')
  html = replaceTag(
    html,
    /<meta\s+name="description"[\s\S]*?\/>/,
    `<meta name="description" content="${d}" />`,
    'description',
  )
  html = replaceTag(
    html,
    /<meta\s+property="og:locale"[\s\S]*?\/>/,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`,
    'og:locale',
  )
  html = replaceTag(
    html,
    /<meta\s+property="og:title"[\s\S]*?\/>/,
    `<meta property="og:title" content="${t}" />`,
    'og:title',
  )
  html = replaceTag(
    html,
    /<meta\s+property="og:description"[\s\S]*?\/>/,
    `<meta property="og:description" content="${d}" />`,
    'og:description',
  )
  html = replaceTag(
    html,
    /<meta\s+property="og:type"[\s\S]*?\/>/,
    `<meta property="og:type" content="${ogType}" />\n    ` +
      `<meta property="og:url" content="${url}" />\n    ` +
      `<link rel="canonical" href="${url}" />\n    ` +
      hreflangLinks(neutral),
    'og:type',
  )

  const crumbs = [{ name: SITE_NAME[lang], item: `${CANONICAL_URL}${langPath(lang, '')}` }]
  if (route.unit && route.unit !== title) crumbs.push({ name: route.unit })
  crumbs.push({ name: title, item: url })

  const ld = jsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.item ? { item: crumb.item } : {}),
    })),
  })
  html = html.replace('</head>', `  ${ld}\n  </head>`)
  return html
}

for (const route of routes) {
  const path = langPath(route.lang, route.neutral)
  const target = resolve(DIST, path, 'index.html')
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, render(route), 'utf8')
}

// The two home pages: canonical, hreflang pair, and the site identity.
function renderHome(lang) {
  const path = langPath(lang, '')
  const url = `${CANONICAL_URL}${path}${path ? '/' : ''}`

  let html = templates[lang]
  if (lang === 'en') {
    const t = escapeHtml(`${SITE_NAME.en} · ${TAGLINE.en}`)
    const d = escapeHtml(HOME_DESCRIPTION.en)
    html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${t}</title>`, 'title')
    html = replaceTag(
      html,
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${d}" />`,
      'description',
    )
    html = replaceTag(
      html,
      /<meta\s+property="og:locale"[\s\S]*?\/>/,
      `<meta property="og:locale" content="${OG_LOCALE.en}" />`,
      'og:locale',
    )
    html = replaceTag(
      html,
      /<meta\s+property="og:title"[\s\S]*?\/>/,
      `<meta property="og:title" content="${t}" />`,
      'og:title',
    )
    html = replaceTag(
      html,
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${d}" />`,
      'og:description',
    )
  }

  html = replaceTag(
    html,
    /<meta\s+property="og:type"[\s\S]*?\/>/,
    `<meta property="og:type" content="website" />\n    ` +
      `<meta property="og:url" content="${url}" />\n    ` +
      `<link rel="canonical" href="${url}" />\n    ` +
      hreflangLinks(''),
    'og:type',
  )

  const ld = jsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name: SITE_NAME[lang],
        inLanguage: lang,
        description: HOME_DESCRIPTION[lang],
        // The guide itself, code and lessons alike, is 0BSD — see LICENSE. This
        // says nothing about the Qur'anic text it quotes, which stays under the
        // Tanzil terms recorded in NOTICE and is not ours to relicense.
        license: 'https://opensource.org/license/0bsd',
        isAccessibleForFree: true,
      },
    ],
  })
  return html.replace('</head>', `  ${ld}\n  </head>`)
}

// Arabic home IS dist/index.html; the English one is a directory copy.
await writeFile(SOURCE, renderHome('ar'), 'utf8')
await mkdir(resolve(DIST, 'en'), { recursive: true })
await writeFile(resolve(DIST, 'en', 'index.html'), renderHome('en'), 'utf8')

// The fallback for anything genuinely missing. It gets its own title so a
// mistyped link does not preview as the home page, and no canonical. One file
// serves both languages, so the title carries both.
await writeFile(
  resolve(DIST, '404.html'),
  replaceTag(
    template,
    /<title>[\s\S]*?<\/title>/,
    `<title>الصفحة غير موجودة · Page not found · ${SITE_NAME.ar}</title>`,
    'title',
  ),
  'utf8',
)

/**
 * Last commit date per content file, for <lastmod>. One `git log` call per file
 * is fine at build time. Needs full history: the deploy workflow sets
 * fetch-depth: 0 for exactly this. Without git, lastmod is simply omitted —
 * a wrong date is worse than none, since Google only trusts it when accurate.
 */
async function lastModified(file) {
  if (!file) return undefined
  try {
    const { stdout } = await run('git', ['log', '-1', '--format=%cs', '--', file], { cwd: ROOT })
    return stdout.trim() || undefined
  } catch {
    return undefined
  }
}

const entries = [
  { lang: 'ar', neutral: '', file: 'src/pages/Home.tsx' },
  { lang: 'en', neutral: '', file: 'src/pages/Home.tsx' },
  ...routes,
]
const urls = []
for (const entry of entries) {
  const path = langPath(entry.lang, entry.neutral)
  const lastmod = await lastModified(entry.file)
  const loc = `${CANONICAL_URL}${path}${path ? '/' : ''}`
  urls.push(`  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`)
}

await writeFile(
  resolve(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
  'utf8',
)

/*
 * Crawling stays allowed on every copy of the site, but only the canonical
 * build advertises the sitemap: from a second address that line would name
 * URLs on another host, served from a path Google does not read robots.txt at
 * anyway. A missing robots.txt means allow-all regardless, so writing this
 * costs nothing either way.
 */
await writeFile(
  resolve(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\n` +
    (IS_CANONICAL ? `\nSitemap: ${CANONICAL_URL}sitemap.xml\n` : ''),
  'utf8',
)

console.log(
  `✓ Pre-rendered ${routes.length + 2} routes plus the 404 fallback: own title, canonical, ` +
    `hreflang pair, JSON-LD and font preloads. Wrote sitemap.xml and robots.txt.`,
)
// Printed because these are the two things that silently ruin a deploy: a build
// served from one address while claiming another shows a working site whose
// every canonical points somewhere else, and nothing else reports it.
console.log(`  served from : ${SITE_URL}`)
console.log(`  claims to be: ${CANONICAL_URL}${IS_CANONICAL ? '' : '  (this copy is not the canonical one)'}`)
