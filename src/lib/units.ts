import unitsData from '../content/units.json'
import type { Localized } from './i18n'

/**
 * The curriculum: nine units, taught in this order.
 *
 * The order is an argument, not a filing system. Units 1–3 argue for a Creator
 * from reason and observation alone; unit 4 introduces who He is; units 5–6
 * establish why revelation, and why this one; units 7–8 are the case for the
 * messenger and the Book; unit 9 is what to do about all of it. Each unit
 * assumes only what the ones before it established; see docs/curriculum.md.
 *
 * The data lives in src/content/units.json rather than in this file because
 * scripts/prerender-routes.mjs needs the same titles for breadcrumbs and page
 * heads, and a JSON file is one source both can read without parsing
 * TypeScript. A lesson names its unit in frontmatter (`unit: creator`).
 */

export interface Unit {
  /** Matches the `unit:` field in a lesson's frontmatter. */
  id: string
  title: Localized
  /** One sentence telling the reader what the unit establishes. */
  description: Localized
  emoji: string
}

export const UNITS: readonly Unit[] = unitsData

const UNIT_INDEX = new Map(UNITS.map((unit, index) => [unit.id, index]))

/** Position of a unit in the curriculum, used to sort lessons. */
export function unitOrder(id: string): number {
  return UNIT_INDEX.get(id) ?? Number.MAX_SAFE_INTEGER
}

export function getUnit(id: string): Unit | undefined {
  return UNITS.find((unit) => unit.id === id)
}
