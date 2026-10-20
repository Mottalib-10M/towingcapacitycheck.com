/**
 * Towing checks, pure functions (RECETTE §4). Every rating comes from a maker's document (src/data/towing.json);
 * the load comes from the reader. Five limits are tested in turn:
 *   trailer  loaded trailer weight          <= the maker's trailer weight rating for the configuration
 *   tongue   tongue weight / trailer weight  within the share the makers ask for (params: tongue.min .. tongue.max)
 *   payload  people + cargo + hitch + tongue <= payload (printed, or GVWR - curb weight)
 *   gvwr     curb + people + cargo + hitch + tongue <= GVWR
 *   gcwr     curb + people + cargo + hitch + trailer <= GCWR
 * When a guide prints no curb weight, the vehicle weight that its rating assumes is GCWR - rating, and the
 * people that rating already counts (Ford: a 150 lb driver; Chevrolet: driver and front passenger at 150 lb
 * each) are taken out of the reader's load, so the GCWR test charges only the extra weight.
 */

export interface Ratings {
  /** Maker's trailer weight rating for this configuration (lb). */
  trailer: number;
  gcwr?: number | null;
  gvwr?: number | null;
  payload?: number | null;
  /** Curb or base weight printed by the maker (lb). */
  curb?: number | null;
  /** Weight of people the rating already includes (lb), when the maker states it and prints no curb weight. */
  included?: number | null;
}

export interface Load {
  /** Loaded trailer weight, ready to travel (lb). */
  trailer: number;
  /** Tongue weight (lb). */
  tongue: number;
  /** Driver and passengers (lb). */
  people: number;
  /** Cargo in the vehicle, accessories included (lb). */
  cargo: number;
  /** Hitch hardware: receiver insert, ball mount, weight-distributing bars (lb). */
  hitch: number;
}

export type CheckId = 'trailer' | 'tongue' | 'payload' | 'gvwr' | 'gcwr';
export interface Check {
  id: CheckId;
  /** What is weighed against the limit (lb, or the tongue share in % for 'tongue'). */
  used: number;
  /** The limit; null when the documents do not give it and the reader did not enter it. */
  limit: number | null;
  /** For 'tongue': the lower bound of the share (%). */
  low?: number;
  ok: boolean | null;
  /** limit - used (lb); negative when over. */
  spare: number | null;
  /** used / limit (0..1+). */
  share: number | null;
  /** How the limit was obtained. */
  basis: 'printed' | 'entered' | 'gvwr-minus-curb' | 'implied-by-rating' | 'guide-range' | 'missing';
}

export interface TongueRule { min: number; max: number }

export interface TowResult {
  checks: Check[];
  verdict: 'within' | 'tight' | 'over';
  /** The first failed check, or the tightest one. */
  binding: Check | null;
  /** Heaviest loaded trailer this vehicle can pull with this load and tongue share (lb). */
  maxTrailer: number;
  /** Which limit sets maxTrailer. */
  maxBy: CheckId;
  /** Curb weight used for GVWR and GCWR (printed or implied), or null. */
  curb: number | null;
  curbBasis: 'printed' | 'implied' | 'none';
}

const pos = (x: number) => (Number.isFinite(x) && x > 0 ? x : 0);

/** Curb weight used by the GCWR test: printed when the maker gives it, else GCWR - rating - people the rating includes. */
export function curbOf(r: Ratings): { curb: number | null; basis: 'printed' | 'implied' | 'none' } {
  if (r.curb && r.curb > 0) return { curb: r.curb, basis: 'printed' };
  if (r.gcwr && r.trailer && r.included != null) return { curb: r.gcwr - r.trailer - r.included, basis: 'implied' };
  return { curb: null, basis: 'none' };
}

/** Payload limit: printed, else GVWR - printed curb weight, else null. */
export function payloadOf(r: Ratings): { limit: number | null; basis: Check['basis'] } {
  if (r.payload && r.payload > 0) return { limit: r.payload, basis: 'printed' };
  if (r.gvwr && r.curb && r.curb > 0) return { limit: r.gvwr - r.curb, basis: 'gvwr-minus-curb' };
  return { limit: null, basis: 'missing' };
}

/** Tongue share of the trailer weight, in percent. */
export const tongueShare = (tongue: number, trailer: number) => (trailer > 0 ? (tongue / trailer) * 100 : 0);

/** Tongue weight range for a trailer weight (lb). */
export const tongueRange = (trailer: number, rule: TongueRule) => ({ lo: (pos(trailer) * rule.min) / 100, hi: (pos(trailer) * rule.max) / 100 });

function mk(id: CheckId, used: number, limit: number | null, basis: Check['basis']): Check {
  if (limit === null) return { id, used, limit, ok: null, spare: null, share: null, basis };
  return { id, used, limit, ok: used <= limit, spare: limit - used, share: limit > 0 ? used / limit : 1, basis };
}

/**
 * Runs the five checks. `margin` (percent of each limit kept in reserve, the reader's choice) only decides
 * between "within" and "tight"; it never turns a legal load into an overload.
 */
export function checkTow(r: Ratings, raw: Load, rule: TongueRule, margin = 0): TowResult {
  const l: Load = { trailer: pos(raw.trailer), tongue: pos(raw.tongue), people: pos(raw.people), cargo: pos(raw.cargo), hitch: pos(raw.hitch) };
  const checks: Check[] = [];
  checks.push(mk('trailer', l.trailer, r.trailer > 0 ? r.trailer : null, 'printed'));

  const sh = tongueShare(l.tongue, l.trailer);
  const tc: Check = { id: 'tongue', used: sh, limit: rule.max, low: rule.min, ok: l.trailer > 0 ? sh >= rule.min && sh <= rule.max : null, spare: null, share: null, basis: 'guide-range' };
  checks.push(tc);

  const onTruck = l.people + l.cargo + l.hitch + l.tongue;
  const pay = payloadOf(r);
  checks.push(mk('payload', onTruck, pay.limit, pay.basis));

  const { curb, basis: cb } = curbOf(r);
  const realCurb = cb === 'printed' ? curb : null;
  checks.push(mk('gvwr', (realCurb ?? 0) + onTruck, r.gvwr && realCurb ? r.gvwr : null, r.gvwr && realCurb ? 'printed' : 'missing'));

  if (r.gcwr && curb !== null) {
    // Implied curb: the rating already counts `included` lb of people, so only the people beyond it are added.
    const people = cb === 'implied' ? Math.max(0, l.people - (r.included ?? 0)) + (r.included ?? 0) : l.people;
    checks.push(mk('gcwr', curb + people + l.cargo + l.hitch + l.trailer, r.gcwr, cb === 'printed' ? 'printed' : 'implied-by-rating'));
  } else checks.push(mk('gcwr', 0, null, 'missing'));

  // Heaviest trailer: each known limit, solved for the trailer weight at the reader's tongue share.
  const share = l.trailer > 0 && l.tongue > 0 ? l.tongue / l.trailer : (rule.min + rule.max) / 200;
  const cands: Array<[CheckId, number]> = [['trailer', r.trailer]];
  if (pay.limit !== null) cands.push(['payload', (pay.limit - l.people - l.cargo - l.hitch) / share]);
  if (r.gvwr && realCurb) cands.push(['gvwr', (r.gvwr - realCurb - l.people - l.cargo - l.hitch) / share]);
  const g = checks.find((c) => c.id === 'gcwr')!;
  if (g.limit !== null) cands.push(['gcwr', g.limit - (g.used - l.trailer)]);
  let [maxBy, maxTrailer] = cands[0];
  for (const [id, x] of cands) if (x < maxTrailer) { maxBy = id; maxTrailer = x; }

  const weighed = checks.filter((c) => c.ok !== null && c.id !== 'tongue');
  const failed = checks.find((c) => c.ok === false);
  const tightest = weighed.reduce<Check | null>((a, c) => (a === null || (c.share ?? 0) > (a.share ?? 0) ? c : a), null);
  const tight = weighed.some((c) => (c.share ?? 0) > 1 - margin / 100);
  return {
    checks,
    verdict: failed ? 'over' : tight ? 'tight' : 'within',
    binding: failed ?? tightest,
    maxTrailer: Math.max(0, Math.floor(maxTrailer)),
    maxBy,
    curb,
    curbBasis: cb,
  };
}

/** Payload left for a trailer's tongue once people, cargo and hitch are aboard (lb). */
export const payloadLeft = (payload: number, people: number, cargo: number, hitch: number) => payload - pos(people) - pos(cargo) - pos(hitch);

/** Heaviest trailer allowed by the GCWR alone (lb). */
export const trailerByGcwr = (gcwr: number, curb: number, people: number, cargo: number, hitch: number) => gcwr - pos(curb) - pos(people) - pos(cargo) - pos(hitch);
