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

/* Three cases recomputed by hand on 2026-10-21 against the makers' rows, run through the checker as a reader would
 * use it (tool 'tow', configuration 0 = the top row of the year, sorted heaviest first). */
describe('checker, three cases worked by hand', () => {
  const run = (v: Record<string, string | number>) => {
    const spec = getTool('tow', { m: String(v.m) });
    const out = spec.run({ ...Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])), ...v });
    return { value: out.value, rows: Object.fromEntries(out.rows.map((r) => [r[0], r[1]])), sub: out.sub };
  };
  it('2026 Toyota Tundra SR5 Double Cab 4x2 (12,000 lb, GCWR 17,250, GVWR 7,035, payload 1,940, curb 5,215; Toyota sheet p. 6)', () => {
    // 9,000 lb trailer, 1,080 lb tongue (12%), 350 lb people, 150 lb cargo, 75 lb hitch.
    // Payload 350+150+75+1,080 = 1,655 of 1,940. GVWR 5,215+1,655 = 6,870 of 7,035 (97.7%, past the 10% margin: tight).
    // GCWR 5,215+350+150+75+9,000 = 14,790 of 17,250. Heaviest trailer: GVWR (7,035-5,215-575)/0.12 = 10,375.
    const r = run({ m: 'tundra', y: '2026', c: '0', tw: 9000, tg: 1080, pp: 350, cg: 150, hz: 75, mg: 10 });
    expect(r.sub).toContain('12,000 lb');
    expect(r.value).toBe('Within, little margin');
    expect(r.rows['Load on the vehicle vs payload']).toBe('1,655 lb of 1,940 lb ✓');
    expect(r.rows['Vehicle weight vs GVWR']).toBe('6,870 lb of 7,035 lb ✓');
    expect(r.rows['Truck plus trailer vs GCWR']).toBe('14,790 lb of 17,250 lb ✓');
    expect(r.rows['Heaviest trailer with this load (set by GVWR)']).toBe('10,375 lb');
  });
  it('2026 Ford F-150 top row (13,500 lb, GCWR 19,400; Ford guide p. 16) with a 1,800 lb door-label payload', () => {
    // 10,000 lb trailer, 1,000 lb tongue (10%), 600 lb people, 200 lb cargo, 75 lb hitch.
    // Payload 600+200+75+1,000 = 1,875 of 1,800: over by 75. Implied curb 19,400-13,500-300 = 5,600;
    // GCWR 5,600+600+200+75+10,000 = 16,475 of 19,400. Heaviest trailer: payload (1,800-875)/0.10 = 9,250.
    const r = run({ m: 'f-150', y: '2026', c: '0', tw: 10000, tg: 1000, pp: 600, cg: 200, hz: 75, pl: 1800 });
    expect(r.value).toBe('Over by 75 lb');
    expect(r.rows['Truck plus trailer vs GCWR (curb implied by the rating)']).toBe('16,475 lb of 19,400 lb ✓');
    expect(r.rows['Heaviest trailer with this load (set by payload)']).toBe('9,250 lb');
  });
  it('2026 Chevrolet Silverado 1500 top row (13,300 lb, GCWR 19,000; Chevrolet guide p. 26) behind a 13,500 lb trailer', () => {
    // Trailer 13,500 of 13,300: over by 200. Implied curb 19,000-13,300-300 = 5,400;
    // GCWR 5,400+300+0+75+13,500 = 19,275 of 19,000: over. Heaviest trailer: GCWR 19,000-5,775 = 13,225.
    const r = run({ m: 'silverado-1500', y: '2026', c: '0', tw: 13500, tg: 1350, pp: 300, cg: 0, hz: 75 });
    expect(r.value).toBe('Over by 200 lb');
    expect(r.rows['Trailer vs trailer weight rating']).toBe('13,500 lb of 13,300 lb ✗');
    expect(r.rows['Truck plus trailer vs GCWR (curb implied by the rating)']).toBe('19,275 lb of 19,000 lb ✗');
    expect(r.rows['Heaviest trailer with this load (set by GCWR)']).toBe('13,225 lb');
  });
});
