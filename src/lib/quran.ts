import data from '@/content/quran.generated.json'
import type { Lang } from './i18n'

/**
 * Qur'anic text used by the lessons.
 *
 * IMPORTANT: nothing here is typed by hand. `src/content/quran.generated.json`
 * is produced by `npm run quran:build`, which reads every `ref:` in the lesson
 * files and copies the verses out of the checked-in Uthmani text in
 * `data/quran-uthmani.txt`. The build fails if a reference does not resolve,
 * so a lesson can never ship a verse that is missing, misspelt or invented.
 *
 * See docs/quran-pipeline.md for the whole flow.
 */

export interface QuranAyah {
  surah: number
  ayah: number
  /** Arabic surah name without the word «سورة», e.g. «البقرة». */
  surahName: string
  /** English transliteration, quran.com spelling, e.g. "Al-Baqarah". */
  surahNameEn: string
  /** The exact Uthmani text of the verse. */
  text: string
}

interface QuranData {
  /** Where the text came from, shown in «عن الدليل». */
  source: string
  ayat: Record<string, QuranAyah>
  /**
   * Resolved character ranges for every `show:` / `highlight:` phrase used in a
   * lesson, keyed as "<ref>|<phrase>". Matching happens once at build time so
   * the browser never has to guess.
   */
  spans: Record<string, [number, number]>
}

// TypeScript reads the generated JSON as `number[]` for the span pairs; the
// build script guarantees they are always exactly two numbers.
const QURAN = data as unknown as QuranData

export const QURAN_SOURCE = QURAN.source

/** `2:19` -> the verse. Returns undefined only if the build data is stale. */
export function getAyah(ref: string): QuranAyah | undefined {
  return QURAN.ayat[ref]
}

/** Character range of a phrase inside a verse, resolved at build time. */
export function getSpan(ref: string, phrase: string): [number, number] | undefined {
  return QURAN.spans[`${ref}|${phrase}`]
}

/** The surah's name in the page's language. */
export function surahName(ayah: QuranAyah, lang: Lang): string {
  return lang === 'ar' ? ayah.surahName : ayah.surahNameEn
}

/** Deep link to the verse on quran.com, for readers who want the context. */
export function quranComUrl(ayah: QuranAyah): string {
  return `https://quran.com/${ayah.surah}/${ayah.ayah}`
}
