/**
 * The data asset: src/data/towing.json, built by scripts/build-data.py from data/facts/<model>.json (one row per
 * configuration printed in the maker's towing guide or specification sheet, read on 2026-10-20).
 * Short keys keep the file small, since the calculators ship it to the browser:
 *   l label · e engine · d drive · ax axle ratio · pk package or trim · tb trim/box/bed · cab cab
 *   t trailer weight rating (conventional) · fw fifth-wheel · gn gooseneck · gcwr · gvwr · pl payload
 *   cw curb or base weight · rg rear GAWR · p page of the document · n note
 */
import RAW from '../data/towing.json';

export interface Row { l: string; e?: string; d?: string; ax?: string; pk?: string; tb?: string; cab?: string; t?: number; fw?: number; gn?: number; gcwr?: number; gvwr?: number; pl?: number; cw?: number; rg?: number; p?: number | string; n?: string }
export interface Src { title: string; url: string; copy: string | null; pages: string; read: string }
export interface Year { year: number; max: number; min: number; maxFw: number | null; maxGn: number | null; maxPl: number | null; src: Src; notes: string[]; rows: Row[] }
export interface Model { id: string; slug: string; make: string; model: string; class: string; included: number | null; years: Year[] }

export const MODELS = (RAW as unknown as { models: Model[] }).models;
export const RETRIEVED = (RAW as unknown as { retrieved: string }).retrieved;
export const MODEL_IDS = MODELS.map((m) => m.id);

export const modelOf = (id: string) => { const m = MODELS.find((x) => x.id === id); if (!m) throw new Error(`Unknown model ${id}`); return m; };
export const hasModel = (id: string) => MODELS.some((x) => x.id === id);
/** "Ford F-150", "Ram 1500", "Chevrolet Silverado 1500". */
export const fullName = (m: Model) => (m.model.startsWith(m.make) ? m.model : `${m.make} ${m.model}`);
/** Latest model year with data first. */
export const latest = (m: Model) => m.years[0];
export const yearOf = (m: Model, y: number) => m.years.find((x) => x.year === y) ?? m.years[0];
/** The row that reaches the year's maximum (first one in the table order). */
export const topRow = (y: Year) => y.rows.find((r) => r.t === y.max) ?? y.rows[0];
/** Ratings of the year, highest first, one entry per distinct engine. */
export function byEngine(y: Year) {
  const map = new Map<string, { engine: string; max: number; min: number; n: number }>();
  for (const r of y.rows) {
    if (!r.t) continue;
    const k = r.e ?? 'n/a';
    const o = map.get(k) ?? { engine: k, max: 0, min: Infinity, n: 0 };
    o.max = Math.max(o.max, r.t); o.min = Math.min(o.min, r.t); o.n++;
    map.set(k, o);
  }
  return [...map.values()].sort((a, b) => b.max - a.max);
}
/** Ratings of the year by axle ratio (rows that print one). */
export function byAxle(y: Year) {
  const map = new Map<string, { axle: string; max: number; min: number; n: number }>();
  for (const r of y.rows) {
    if (!r.t || !r.ax) continue;
    const o = map.get(r.ax) ?? { axle: r.ax, max: 0, min: Infinity, n: 0 };
    o.max = Math.max(o.max, r.t); o.min = Math.min(o.min, r.t); o.n++;
    map.set(r.ax, o);
  }
  return [...map.values()].sort((a, b) => Number(a.axle) - Number(b.axle));
}
/** Every model with its latest maximum, heaviest first. */
export const ranking = () => MODELS.map((m) => ({ m, y: latest(m) })).sort((a, b) => b.y.max - a.y.max);
export const CLASS_LABEL: Record<string, string> = {
  'half-ton pickup': 'Half-ton pickup', 'heavy duty pickup': 'Heavy duty pickup', 'midsize pickup': 'Midsize pickup',
  'compact pickup': 'Compact pickup', 'full-size SUV': 'Full-size SUV', 'midsize SUV': 'Midsize SUV', 'three-row SUV': 'Three-row SUV',
};
/** "p. 19" for a page number, the text as is otherwise ("specifications table"). */
export const pagesText = (pages: string) => (/^\d/.test(pages) ? `p. ${pages}` : pages);
