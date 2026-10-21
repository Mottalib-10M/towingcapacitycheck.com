/**
 * The calculators of the site, rendered by components/calc/SpecTool.tsx (full tool) and MiniSim.tsx (mini-simulator).
 * Every rating comes from src/data/towing.json (makers' towing guides and spec sheets); the reader adds only what
 * no maker can know: the trailer, its tongue weight, the people and cargo aboard, the hitch hardware.
 * This file ships to the browser.
 */
import LITE from '../data/towing-lite.json';
import P from '../data/params-2026.json';
import type { ToolSpec, V, Input, ToolOut } from './tool-types';
import { formatNumber, formatPercent } from './format';
import { checkTow, tongueRange, payloadLeft, trailerByGcwr, type Check, type CheckId } from './engine/towing';
import type { Model, Row, Year } from './data';

/** The browser copy of the ratings (scripts/build-data.py): labels in one table, rows as arrays. */
interface Lite { L: string[]; M: Array<{ id: string; mk: string; md: string; in: number | null; Y: Array<{ y: number; st: string; sp: string; R: Array<[number, number, number, number, number, number, number, string]> }> }> }
const LT = LITE as unknown as Lite;
const z = (x: number) => (x ? x : undefined);
const MODELS: Model[] = LT.M.map((m) => ({
  id: m.id, slug: '', make: m.mk, model: m.md, class: '', included: m.in,
  years: m.Y.map((y) => {
    const rows: Row[] = y.R.map(([l, t, gcwr, gvwr, pl, cw, p, ax]) => ({ l: LT.L[l], t: z(t), gcwr: z(gcwr), gvwr: z(gvwr), pl: z(pl), cw: z(cw), p: z(p), ax: ax || undefined }));
    const ts = rows.map((r) => r.t ?? 0).filter((x) => x > 0);
    return { year: y.y, max: Math.max(...ts), min: Math.min(...ts), maxFw: null, maxGn: null, maxPl: null, src: { title: y.st, url: '', copy: null, pages: y.sp, read: '' }, notes: [], rows };
  }),
}));
export const lb = (x: number) => `${formatNumber(Math.round(x), 0)} lb`;
export const pct = (x: number, d = 1) => formatPercent(x, d);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const longDate = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`;
const TONGUE = P.tongue.conventional as { min: number; max: number };
const FIFTH = P.tongue.fifthWheel as { min: number; max: number };

const M = (id: string) => MODELS.find((m) => m.id === id) ?? MODELS[0];
const Y = (m: Model, y: string | number) => m.years.find((x) => String(x.year) === String(y)) ?? m.years[0];
const pg = (x: string | number) => (/^\d/.test(String(x)) ? `p. ${x}` : String(x));
const name = (m: Model) => (m.model.startsWith(m.make) ? m.model : `${m.make} ${m.model}`);
const modelOpts = MODELS.map((m) => ({ value: m.id, label: name(m) }));
const yearOpts = (m: Model) => m.years.map((y) => ({ value: String(y.year), label: String(y.year) }));
/** Configurations of a year, as select options; the value is the row index in the year's table. */
const rowLabel = (r: Row) => `${r.l} · ${lb(r.t ?? 0)}`;
const cfgOpts = (y: Year) => y.rows.map((r, i) => ({ value: String(i), label: rowLabel(r) })).filter((_, i) => y.rows[i].t);

const modelIn = (def: string, adv = false): Input => ({ kind: 'select', id: 'm', label: 'Vehicle', def, options: modelOpts, adv });
const yearIn = (mid: string, def?: number): Input => ({ kind: 'select', id: 'y', label: 'Model year', def: String(def ?? M(mid).years[0].year), options: yearOpts(M(mid)), dyn: (v) => yearOpts(M(s(v, 'm') || mid)) });
const cfgIn = (mid: string): Input => ({ kind: 'select', id: 'c', label: 'Configuration (engine · drive · cab · axle · package)', def: '0', options: cfgOpts(M(mid).years[0]), dyn: (v) => cfgOpts(Y(M(s(v, 'm') || mid), s(v, 'y'))), wide: true, help: 'Heaviest rating first; match your door label and window sticker' });

const CHECK_LABEL: Record<CheckId, string> = {
  trailer: 'Trailer vs trailer weight rating', tongue: 'Tongue weight share', payload: 'Load on the vehicle vs payload',
  gvwr: 'Vehicle weight vs GVWR', gcwr: 'Truck plus trailer vs GCWR',
};
function checkRow(c: Check): [string, string, number?] {
  if (c.id === 'tongue') return [CHECK_LABEL.tongue, `${formatNumber(c.used, 1)}% (${formatNumber(c.low ?? 0, 0)} to ${formatNumber(c.limit ?? 0, 0)}%)${c.ok === false ? ' ✗' : c.ok ? ' ✓' : ''}`];
  if (c.limit === null) return [CHECK_LABEL[c.id], c.id === 'payload' ? 'enter your door-label payload' : c.id === 'gvwr' ? 'enter GVWR and curb weight' : 'not printed for this vehicle'];
  const mark = c.ok ? '✓' : '✗';
  return [`${CHECK_LABEL[c.id]}${c.basis === 'implied-by-rating' ? ' (curb implied by the rating)' : ''}`, `${lb(c.used)} of ${lb(c.limit)} ${mark}`, c.used];
}

/** The configuration a reader picked, with the door-label figures he typed in place of missing ones. */
function ratingsOf(m: Model, y: Year, r: Row, v: V) {
  const gv = n(v, 'gv'), pl = n(v, 'pl'), cw = n(v, 'cw');
  return {
    trailer: r.t ?? 0, gcwr: r.gcwr ?? null,
    gvwr: gv > 0 ? gv : r.gvwr ?? null, payload: pl > 0 ? pl : r.pl ?? null,
    curb: cw > 0 ? cw : r.cw ?? null, included: m.included,
  };
}

function towOut(v: V, lockModel?: string): ToolOut {
  const m = M(lockModel ?? s(v, 'm')), y = Y(m, s(v, 'y'));
  const r = y.rows[Number(s(v, 'c'))] ?? y.rows[0];
  const res = checkTow(ratingsOf(m, y, r, v), { trailer: n(v, 'tw'), tongue: n(v, 'tg'), people: n(v, 'pp'), cargo: n(v, 'cg'), hitch: n(v, 'hz') }, TONGUE, n(v, 'mg'));
  const over = res.checks.find((c) => c.ok === false && c.id !== 'tongue');
  const value = res.verdict === 'over' ? (over ? `Over by ${lb(-(over.spare ?? 0))}` : 'Tongue share off') : res.verdict === 'tight' ? 'Within, little margin' : res.checks.some((c) => c.ok === null) ? 'Within the ratings checked' : 'Within every rating';
  const rows = res.checks.map(checkRow);
  rows.push([`Heaviest trailer with this load (set by ${res.maxBy === 'gcwr' ? 'GCWR' : res.maxBy === 'gvwr' ? 'GVWR' : res.maxBy})`, lb(res.maxTrailer)]);
  return {
    label: `${y.year} ${name(m)}: can it tow ${lb(n(v, 'tw'))}?`,
    value,
    sub: `Rating for this configuration: ${lb(r.t ?? 0)}${r.gcwr ? `, GCWR ${lb(r.gcwr)}` : ''}. ${y.src.title}, ${pg(r.p ?? y.src.pages)}.`,
    rows,
    note: res.curbBasis === 'implied' ? `No curb weight in the ${m.make} guide: the GCWR test uses GCWR minus the rating minus the ${lb(m.included ?? 0)} of people the rating assumes.` : undefined,
  };
}

const PEOPLE: Input = { id: 'pp', label: 'Driver and passengers', def: 350, unit: 'lb', max: 3000, help: 'Everyone aboard, weighed' };
const CARGO: Input = { id: 'cg', label: 'Cargo in the vehicle', def: 150, unit: 'lb', max: 10000, help: 'Gear, cooler, bed load, accessories' };
const HITCH: Input = { id: 'hz', label: 'Hitch hardware', def: P.hitchWeight.conventional, unit: 'lb', max: 1000, adv: true, help: 'Ball mount, bars; Ram counts 75 lb' };

function towSpec(a: V = {}): ToolSpec {
  const mid = String(a.m ?? 'f-150');
  const lock = a.lock ? mid : undefined;
  const tw = Number(a.tw ?? 7000);
  const inputs: Input[] = [
    ...(lock ? [] : [modelIn(mid)]), yearIn(mid, a.y ? Number(a.y) : undefined), cfgIn(mid),
    { id: 'tw', label: 'Loaded trailer weight', def: tw, unit: 'lb', max: 40000, help: 'Ready to travel: water, gear, propane' },
    { id: 'tg', label: 'Tongue weight', def: Math.round(tw * 0.12), unit: 'lb', max: 6000, help: `Makers ask ${TONGUE.min} to ${TONGUE.max}% of the trailer` },
    PEOPLE, CARGO, HITCH,
    { id: 'pl', label: 'Payload on your door label', def: 0, unit: 'lb', max: 10000, adv: true, help: '0 = the maker’s figure if printed' },
    { id: 'gv', label: 'GVWR on your door label', def: 0, unit: 'lb', max: 20000, adv: true, help: '0 = the maker’s figure if printed' },
    { id: 'cw', label: 'Curb weight (scale ticket)', def: 0, unit: 'lb', max: 15000, adv: true, help: '0 = the maker’s figure if printed' },
    { id: 'mg', label: 'Margin you want to keep', def: 10, unit: '%', max: 50, adv: true, help: 'Your choice, not a legal rule' },
  ];
  if (lock) inputs.unshift({ kind: 'select', id: 'm', label: 'Vehicle', def: mid, options: modelOpts.filter((o) => o.value === mid), adv: true });
  return { inputs, run: (v) => towOut(v, lock) };
}

/** Mini: a model's maximum for a year, and the spread between its configurations. */
function capSpec(a: V = {}): ToolSpec {
  const mid = String(a.m ?? 'f-150');
  return {
    inputs: [modelIn(mid), yearIn(mid)],
    run: (v) => {
      const m = M(s(v, 'm')), y = Y(m, s(v, 'y'));
      const top = y.rows.find((r) => r.t === y.max) ?? y.rows[0];
      const low = y.rows.find((r) => r.t === y.min) ?? y.rows[0];
      return {
        label: `${y.year} ${name(m)} maximum towing capacity`, value: lb(y.max),
        rows: [['Reached by', top.l, y.max], ['Lowest rating printed', `${lb(y.min)} (${low.l})`, y.min], ['Configurations in the table', formatNumber(y.rows.length, 0)], ['Source', `${y.src.title}, ${pg(y.src.pages)}`]],
      };
    },
  };
}

/** Mini: tongue weight range for a trailer. */
function tongueSpec(a: V = {}): ToolSpec {
  return {
    inputs: [{ id: 'tw', label: 'Loaded trailer weight', def: Number(a.tw ?? 6000), unit: 'lb', max: 40000 }, { id: 'tg', label: 'Tongue weight you measured', def: Number(a.tg ?? 0), unit: 'lb', max: 6000, help: '0 if not weighed yet' }],
    run: (v) => {
      const { lo, hi } = tongueRange(n(v, 'tw'), TONGUE);
      const sh = n(v, 'tw') > 0 ? (n(v, 'tg') / n(v, 'tw')) * 100 : 0;
      const rows: ToolOut['rows'] = [[`At ${TONGUE.min}% of the trailer`, lb(lo), lo], [`At ${TONGUE.max}% of the trailer`, lb(hi), hi], ['Fifth wheel or gooseneck (pin weight)', `${lb((n(v, 'tw') * FIFTH.min) / 100)} to ${lb((n(v, 'tw') * FIFTH.max) / 100)}`]];
      if (n(v, 'tg') > 0) rows.unshift(['Your tongue share', `${formatNumber(sh, 1)}% ${sh < TONGUE.min ? '(too light: sway risk)' : sh > TONGUE.max ? '(too heavy for the range)' : '(in range)'}`]);
      return { label: 'Tongue weight for this trailer', value: `${lb(lo)} to ${lb(hi)}`, rows };
    },
  };
}

/** Mini: payload left for the tongue, and the trailer it allows. */
function payloadSpec(a: V = {}): ToolSpec {
  return {
    inputs: [{ id: 'pl', label: 'Payload on the door label', def: Number(a.pl ?? 1800), unit: 'lb', max: 10000 }, PEOPLE, CARGO, { ...HITCH, adv: false }],
    run: (v) => {
      const left = payloadLeft(n(v, 'pl'), n(v, 'pp'), n(v, 'cg'), n(v, 'hz'));
      const shareMid = 12;
      return {
        label: 'Payload left for the trailer tongue', value: lb(Math.max(0, left)),
        rows: [['Payload', lb(n(v, 'pl')), n(v, 'pl')], ['People, cargo and hitch', lb(n(v, 'pp') + n(v, 'cg') + n(v, 'hz')), n(v, 'pp') + n(v, 'cg') + n(v, 'hz')], [`Heaviest trailer at ${TONGUE.min}% tongue`, lb(Math.max(0, (left * 100) / TONGUE.min))], [`At ${shareMid}% tongue`, lb(Math.max(0, (left * 100) / shareMid))]],
        note: left < 0 ? 'The vehicle is over its payload before any trailer is hitched.' : undefined,
      };
    },
  };
}

/** Mini: trailer allowed by the GCWR. */
function gcwrSpec(a: V = {}): ToolSpec {
  return {
    inputs: [{ id: 'gc', label: 'GCWR', def: Number(a.gc ?? 17000), unit: 'lb', max: 45000 }, { id: 'cw', label: 'Curb weight', def: Number(a.cw ?? 5100), unit: 'lb', max: 15000 }, PEOPLE, CARGO],
    run: (v) => {
      const x = trailerByGcwr(n(v, 'gc'), n(v, 'cw'), n(v, 'pp'), n(v, 'cg'), P.hitchWeight.conventional);
      return {
        label: 'Heaviest trailer the GCWR allows', value: lb(Math.max(0, x)),
        rows: [['GCWR', lb(n(v, 'gc')), n(v, 'gc')], ['Vehicle as loaded', lb(n(v, 'cw') + n(v, 'pp') + n(v, 'cg') + P.hitchWeight.conventional), n(v, 'cw') + n(v, 'pp') + n(v, 'cg')], [`Hitch hardware counted`, lb(P.hitchWeight.conventional)]],
      };
    },
  };
}

/** Mini: loaded weight of a camper from its dry weight. */
function camperSpec(a: V = {}): ToolSpec {
  return {
    inputs: [{ id: 'dw', label: 'Dry (unloaded) weight', def: Number(a.dw ?? 5200), unit: 'lb', max: 30000 }, { id: 'wa', label: 'Fresh water carried', def: Number(a.wa ?? 20), unit: 'gal', max: 200 }, { id: 'gr', label: 'Gear, food, propane, battery', def: Number(a.gr ?? 900), unit: 'lb', max: 10000 }, { id: 'gv', label: 'Trailer GVWR (its own label)', def: Number(a.gv ?? 7000), unit: 'lb', max: 30000 }],
    run: (v) => {
      const water = n(v, 'wa') * P.waterLbPerGallon;
      const loaded = n(v, 'dw') + water + n(v, 'gr');
      return {
        label: 'Loaded camper weight to compare with your rating', value: lb(loaded),
        rows: [['Dry weight', lb(n(v, 'dw')), n(v, 'dw')], [`Water (${formatNumber(P.waterLbPerGallon, 2)} lb a gallon)`, lb(water), water], ['Gear and supplies', lb(n(v, 'gr')), n(v, 'gr')], ['Trailer GVWR, the most it may weigh', `${lb(n(v, 'gv'))}${loaded > n(v, 'gv') ? ' (exceeded)' : ''}`], [`Tongue at ${TONGUE.min} to ${TONGUE.max}%`, `${lb((loaded * TONGUE.min) / 100)} to ${lb((loaded * TONGUE.max) / 100)}`]],
      };
    },
  };
}

/** Mini: the maker's ratings of a model year by axle ratio. */
function axleSpec(a: V = {}): ToolSpec {
  const mid = String(a.m ?? 'ram-1500');
  return {
    inputs: [modelIn(mid), yearIn(mid)],
    run: (v) => {
      const m = M(s(v, 'm')), y = Y(m, s(v, 'y'));
      const ax = new Map<string, number[]>();
      for (const r of y.rows) if (r.t && r.ax) ax.set(r.ax, [...(ax.get(r.ax) ?? []), r.t]);
      const list = [...ax.entries()].sort((p, q) => Number(p[0]) - Number(q[0]));
      if (!list.length) return { label: `${y.year} ${name(m)} by axle ratio`, value: 'not printed', rows: [['Axle ratio', 'the source does not list it for this vehicle']] };
      const best = list.reduce((p, q) => (Math.max(...q[1]) > Math.max(...p[1]) ? q : p));
      return {
        label: `${y.year} ${name(m)}: best axle ratio for towing`, value: `${best[0]} axle`,
        rows: list.map(([k, xs]) => [`${k} axle`, Math.min(...xs) === Math.max(...xs) ? lb(Math.max(...xs)) : `${lb(Math.min(...xs))} to ${lb(Math.max(...xs))}`, Math.max(...xs)] as [string, string, number]),
      };
    },
  };
}

/** Mini: trailer brakes, by the makers' own thresholds. */
function brakesSpec(a: V = {}): ToolSpec {
  const B = P.brakes as Array<{ who: string; above: number }>;
  return {
    inputs: [{ id: 'tw', label: 'Loaded trailer weight', def: Number(a.tw ?? 2500), unit: 'lb', max: 40000 }],
    run: (v) => {
      const need = B.filter((b) => n(v, 'tw') > b.above);
      return {
        label: 'Does this trailer need its own brakes?', value: need.length === B.length ? 'Yes, by Ford and Chevrolet' : need.length ? 'Yes, for some of their models' : 'Not by Ford or Chevrolet',
        rows: B.map((b) => [b.who, n(v, 'tw') > b.above ? `required above ${lb(b.above)}` : `not required up to ${lb(b.above)}`] as [string, string]),
        note: 'Ram, Jeep, Kia and Toyota print no threshold in the documents read. State laws set their own; check your state too.',
      };
    },
  };
}


/** Mini: minimum hitch class for a trailer weight (Chevrolet trailering guide, p. 7). */
function hitchSpec(a: V = {}): ToolSpec {
  const C = P.trailerClasses as Array<{ cls: string; name: string; upTo: number | null; hitch: string }>;
  return {
    inputs: [{ id: 'tw', label: 'Loaded trailer weight', def: Number(a.tw ?? 4500), unit: 'lb', max: 40000 }],
    run: (v) => {
      const w = n(v, 'tw');
      const c = C.find((x) => x.upTo === null || w <= x.upTo)!;
      return {
        label: 'Minimum hitch class for this trailer', value: `Class ${c.cls}`,
        rows: [['Class name', c.name], ['Hitch types', c.hitch], ...C.map((x) => [`Class ${x.cls}`, x.upTo === null ? `above ${lb(C[C.length - 2].upTo!)}` : `up to ${lb(x.upTo)}`] as [string, string])],
        note: 'The receiver, ball mount and ball each carry their own rating; the lowest one counts.',
      };
    },
  };
}

const TOOLS: Record<string, (a?: V) => ToolSpec> = { tow: towSpec, cap: capSpec, tongue: tongueSpec, payload: payloadSpec, gcwr: gcwrSpec, camper: camperSpec, axle: axleSpec, brakes: brakesSpec, hitch: hitchSpec };
export const TOOL_KINDS = Object.keys(TOOLS);
export function getTool(kind: string, args?: V): ToolSpec {
  const f = TOOLS[kind];
  if (!f) throw new Error(`Unknown tool ${kind}`);
  return f(args);
}
