import { describe, expect, it } from 'vitest';
import { checkTow, curbOf, payloadOf, tongueRange, payloadLeft, trailerByGcwr } from '../src/lib/engine/towing';
import { MODELS } from '../src/lib/data';
import { getTool, TOOL_KINDS } from '../src/lib/tool-specs';
import P from '../src/data/params-2026.json';

const RULE = P.tongue.conventional;
const load = (o: Partial<Parameters<typeof checkTow>[1]> = {}) => ({ trailer: 7000, tongue: 840, people: 350, cargo: 150, hitch: 75, ...o });

describe('towing engine', () => {
  it('curb weight: printed first, else GCWR minus rating minus people the rating includes', () => {
    expect(curbOf({ trailer: 13500, gcwr: 19400, included: 300 })).toEqual({ curb: 5600, basis: 'implied' });
    expect(curbOf({ trailer: 11530, gcwr: 17100, curb: 5200 })).toEqual({ curb: 5200, basis: 'printed' });
    expect(curbOf({ trailer: 6200 })).toEqual({ curb: null, basis: 'none' });
  });
  it('payload: printed, else GVWR minus a printed curb weight', () => {
    expect(payloadOf({ trailer: 1, payload: 1800 }).limit).toBe(1800);
    expect(payloadOf({ trailer: 1, gvwr: 7100, curb: 5200 })).toEqual({ limit: 1900, basis: 'gvwr-minus-curb' });
    expect(payloadOf({ trailer: 1, gvwr: 7100 }).limit).toBeNull();
  });
  it('tongue range 10 to 15%, payload left, trailer by GCWR', () => {
    expect(tongueRange(7000, RULE)).toEqual({ lo: 700, hi: 1050 });
    expect(payloadLeft(1800, 350, 150, 75)).toBe(1225);
    expect(trailerByGcwr(19400, 5600, 350, 150, 75)).toBe(13225);
  });
  it('a 7,000 lb trailer behind a 13,500 lb F-150 row: within, every limit checked', () => {
    const r = checkTow({ trailer: 13500, gcwr: 19400, payload: 1800, included: 300 }, load(), RULE, 10);
    expect(r.verdict).toBe('within');
    expect(r.checks.find((c) => c.id === 'payload')!.used).toBe(350 + 150 + 75 + 840);
    // GCWR: implied curb 5,600 + 350 people + 150 cargo + 75 hitch + 7,000 trailer = 13,175.
    expect(r.checks.find((c) => c.id === 'gcwr')!.used).toBe(13175);
    // Payload limits first: (1,800 - 575) / 0.12 = 10,208.
    expect(r.maxBy).toBe('payload');
    expect(r.maxTrailer).toBe(10208);
  });
  it('over the trailer rating, or a tongue outside the range, is flagged', () => {
    expect(checkTow({ trailer: 6200 }, load({ trailer: 7000 }), RULE).verdict).toBe('over');
    const t = checkTow({ trailer: 9000 }, load({ trailer: 7000, tongue: 500 }), RULE).checks.find((c) => c.id === 'tongue')!;
    expect(t.ok).toBe(false);
  });
  it('missing limits stay open instead of passing', () => {
    const r = checkTow({ trailer: 6200 }, load({ trailer: 5000, tongue: 600 }), RULE);
    expect(r.checks.find((c) => c.id === 'gvwr')!.ok).toBeNull();
    expect(r.checks.find((c) => c.id === 'gcwr')!.ok).toBeNull();
    expect(r.verdict).toBe('within');
  });
  it('the margin only turns within into tight', () => {
    const r = checkTow({ trailer: 7500 }, load({ trailer: 7000 }), RULE, 10);
    expect(r.verdict).toBe('tight');
    expect(checkTow({ trailer: 7500 }, load({ trailer: 7000 }), RULE, 0).verdict).toBe('within');
  });
});

describe('data', () => {
  it('13 vehicles, each year with rows, a source URL and a maximum that matches its rows', () => {
    expect(MODELS.length).toBeGreaterThanOrEqual(12);
    for (const m of MODELS) for (const y of m.years) {
      expect(y.rows.length, `${m.id} ${y.year}`).toBeGreaterThan(0);
      expect(y.src.url, `${m.id} ${y.year}`).toMatch(/^https:\/\//);
      expect(Math.max(...y.rows.map((r) => r.t ?? 0)), `${m.id} ${y.year}`).toBe(y.max);
      for (const r of y.rows) if (r.gcwr && r.t) expect(r.gcwr, `${m.id} ${y.year} ${r.l}`).toBeGreaterThan(r.t);
    }
  });
  it('figures read in the documents on 2026-10-20', () => {
    const y = (id: string, yr: number) => MODELS.find((m) => m.id === id)!.years.find((x) => x.year === yr)!;
    expect(y('f-150', 2026).max).toBe(13500);
    expect(y('silverado-1500', 2026).max).toBe(13300);
    expect(y('ram-1500', 2026).max).toBe(11610);
    expect(y('f-250', 2026).max).toBe(22000);
    expect(y('grand-cherokee', 2026).max).toBe(6200);
  });
});

describe('calculators', () => {
  it('every calculator runs on its defaults without NaN', () => {
    for (const k of TOOL_KINDS) {
      const spec = getTool(k);
      const v = Object.fromEntries(spec.inputs.map((i) => [i.id, i.def]));
      expect(JSON.stringify(spec.run(v)), k).not.toMatch(/NaN|undefined/);
    }
  });
  it('the checker runs on every model and year', () => {
    for (const m of MODELS) for (const y of m.years) {
      const spec = getTool('tow', { m: m.id, y: y.year });
      const v = { ...Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])), m: m.id, y: String(y.year) };
      expect(JSON.stringify(spec.run(v)), `${m.id} ${y.year}`).not.toMatch(/NaN|undefined/);
    }
  });
});
