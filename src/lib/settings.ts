/**
 * Reader settings: which reciter the verse play buttons use. It lives in
 * localStorage and nowhere else, and is read straight from storage at the
 * moment a play button is pressed, so an audio button never has to re-render
 * to stay in step with the settings menu.
 */
import type { Localized } from './i18n'

export interface Reciter {
  /** The directory name on everyayah.com. */
  id: string
  name: Localized
  /** One line explaining who this recording is for. */
  note: Localized
}

export const RECITERS: readonly Reciter[] = [
  {
    id: 'Minshawy_Murattal_128kbps',
    name: { ar: 'محمّد صدّيق المنشاوي · مرتَّل', en: 'Mohamed Siddiq al-Minshawi · murattal' },
    note: {
      ar: 'تلاوةٌ هادئةٌ خاشعة، وهي مألوفةٌ لكثيرين.',
      en: 'A calm, moving recitation familiar to many.',
    },
  },
  {
    id: 'Husary_128kbps',
    name: { ar: 'محمود خليل الحُصَري · مرتَّل', en: 'Mahmoud Khalil al-Husary · murattal' },
    note: {
      ar: 'التلاوة المرجعيّة في التعليم. متأنّيةٌ وواضحة.',
      en: 'The reference recording for teaching: unhurried and clear.',
    },
  },
  {
    id: 'Alafasy_128kbps',
    name: { ar: 'مشاري راشد العفاسي', en: 'Mishary Rashid Alafasy' },
    note: {
      ar: 'صوتٌ معاصرٌ واسع الانتشار، مناسبٌ لمن يسمع القرآن أوّل مرّة.',
      en: 'A widely loved contemporary voice, and a good first encounter with the Qur’an.',
    },
  },
]

export const DEFAULT_RECITER = RECITERS[0].id

const RECITER_KEY = 'why-islam-reciter'

export function getReciter(): string {
  try {
    const saved = localStorage.getItem(RECITER_KEY)
    if (saved && RECITERS.some((reciter) => reciter.id === saved)) return saved
  } catch {
    // private browsing
  }
  return DEFAULT_RECITER
}

export function setReciter(id: string) {
  try {
    localStorage.setItem(RECITER_KEY, id)
  } catch {
    // ignore write failures
  }
}
