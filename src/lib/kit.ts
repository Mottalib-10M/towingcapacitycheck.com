/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P                     params-2026.json (tongue shares, hitch weights, brake thresholds, sources)
 *   K.M(id)                 a model: make, model, class, years[] (latest first), included (people the rating assumes)
 *   K.Y(id, year?)          a model year: max, min, maxFw, maxGn, maxPl, src {title,url,copy,pages}, notes, rows
 *   K.max(id, year?)        the year's highest conventional rating (number); K.min(id, year?)
 *   K.top(id, year?)        the row that reaches it (l label, e engine, ax axle, pk package, gcwr, t, gvwr, pl, cw, p page)
 *   K.engines(id, year?)    [{engine, max, min, n}] highest first; K.axles(id, year?) [{axle, max, min, n}]
 *   K.name(id)              "Ford F-150"; K.years(id) [2026, 2025, ...]; K.rank() every model by latest max
 *   K.tool(kind, args)      the result of a calculator of tool-specs.ts with these inputs
 *   formats                 K.lb(11600) "11,600 lb", K.num, K.dec, K.pct, K.day("2026-10-20") "October 20, 2026"
 */
import P from '../data/params-2026.json';
import { MODELS, modelOf, yearOf, latest, topRow, byEngine, byAxle, ranking, fullName, RETRIEVED, RETRIEVED_FROM, CLASS_LABEL } from './data';
import { lb, pct, getTool, longDate } from './tool-specs';
import { formatNumber, formatDecimal } from './format';
import type { V } from './tool-types';

function tool(kind: string, args: V = {}) {
  const spec = getTool(kind, args);
  const v: V = { ...Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])), ...args };
  return spec.run(v);
}
const Y = (id: string, year?: number) => (year ? yearOf(modelOf(id), year) : latest(modelOf(id)));

export const KIT = {
  P, MODELS, RETRIEVED, CLASS_LABEL,
  M: modelOf, Y,
  max: (id: string, year?: number) => Y(id, year).max,
  min: (id: string, year?: number) => Y(id, year).min,
  top: (id: string, year?: number) => topRow(Y(id, year)),
  engines: (id: string, year?: number) => byEngine(Y(id, year)),
  axles: (id: string, year?: number) => byAxle(Y(id, year)),
  name: (id: string) => fullName(modelOf(id)),
  years: (id: string) => modelOf(id).years.map((y) => y.year),
  rank: ranking,
  /** "October 20 to 21, 2026" when the documents were read over two days, else one date. */
  readSpan: () => (RETRIEVED_FROM === RETRIEVED ? longDate(RETRIEVED)
    : RETRIEVED_FROM.slice(0, 7) === RETRIEVED.slice(0, 7) ? `${longDate(RETRIEVED_FROM).replace(/, \d{4}$/, '')} to ${Number(RETRIEVED.slice(8))}, ${RETRIEVED.slice(0, 4)}`
    : `${longDate(RETRIEVED_FROM)} to ${longDate(RETRIEVED)}`),
  tool,
  lb, pct, num: (x: number) => formatNumber(x, 0), dec: (x: number, d = 1) => formatDecimal(x, d), day: longDate,
};
export type Kit = typeof KIT;
