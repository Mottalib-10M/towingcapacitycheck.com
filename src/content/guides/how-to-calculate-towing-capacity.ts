import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { checkTow, type CheckId } from '../../lib/engine/towing';

const P = K.P;
const id = 'silverado-1500';
const y = K.Y(id);
const row = K.top(id);
const incl = K.M(id).included ?? 0;
const implied = (row.gcwr ?? 0) - (row.t ?? 0) - incl;

// Worked example (example figures, not ratings): a 7,000 lb travel trailer and a door label of 1,750 lb.
const ex = { trailer: 7000, tongue: 840, people: 600, cargo: 200, hitch: P.hitchWeight.conventional };
const door = 1750;
const res = checkTow({ trailer: row.t ?? 0, gcwr: row.gcwr, payload: door, included: incl }, ex, P.tongue.conventional, 10);
const c = (k: CheckId) => res.checks.find((x) => x.id === k)!;
const share = (ex.tongue / ex.trailer) * 100;
const NAME: Record<CheckId, string> = { trailer: 'Trailer vs rating', tongue: 'Tongue share', payload: 'Load on the truck vs payload', gvwr: 'Truck vs GVWR', gcwr: 'Truck and trailer vs GCWR' };
const by: Record<CheckId, string> = { trailer: 'the trailer rating', tongue: 'the tongue share', payload: 'the payload', gvwr: 'the GVWR', gcwr: 'the GCWR' };
const verdict = res.verdict === 'over' ? 'over a limit' : res.verdict === 'tight' ? 'within every limit, but with less than a 10% margin on at least one' : 'within every limit';

export default defineGuide({
  id: 'how-to-calculate-towing-capacity',
  group: 'ratings',
  order: 12,
  slug: 'how-to-calculate-towing-capacity',
  nav: 'Calculate it',
  card: 'Six steps from the maker\'s row to the trailer your loaded truck can really pull.',
  title: `Towing Capacity Calculation ${P.year}: Six Steps, One Example`,
  description: `Towing capacity calculation ${P.year}: find your row, weigh the trailer, then test tongue, payload, GVWR and GCWR. A ${y.year} Silverado 1500 shows which limit binds.`,
  h1: 'How to calculate towing capacity for your own truck and trailer',
  intro: `The calculator is set on the ${y.year} Silverado 1500 and a ${K.lb(ex.trailer)} trailer. Pick your configuration, enter your trailer, people and cargo, and it runs the six steps below at once.`,
  resume: `Calculating your real towing capacity takes six steps. Find the row of the maker's towing table that matches your engine, drive, cab and package. Weigh the trailer loaded as you travel, not dry. Check that the tongue is ${P.tongue.conventional.min} to ${P.tongue.conventional.max}% of it. Add people, cargo, hitch hardware and tongue, and keep the total within the payload on your door label. Keep the loaded truck within its GVWR. Finally, keep truck plus trailer within the GCWR of your row. In the example worked below, a ${y.year} Silverado 1500 rated ${K.lb(row.t ?? 0)} pulls a ${K.lb(ex.trailer)} trailer with ${K.lb(ex.people)} of people and ${K.lb(ex.cargo)} of cargo: the trailer uses barely half of the rating, yet the load on the truck reaches ${K.lb(c('payload').used)} against a ${K.lb(door)} label, and the heaviest trailer this load allows is ${K.lb(res.maxTrailer)}, set by ${by[res.maxBy]}.`,
  body: (h) => `
<h2>Step 1: find your row, not your model</h2>
<p>A towing rating belongs to a configuration. Chevrolet's ${h.src('gm_2026', 'trailering guide')} prints ${K.num(y.rows.length)} rows for the ${y.year} Silverado 1500, from ${K.lb(y.min)} to ${K.lb(y.max)}, split by engine, drive, cab, bed and package. Match yours with the window sticker or build sheet; the engine and the package codes are the ones that move the figure most. For this example we take the top row: the ${row.e ?? 'diesel'}, ${row.d ?? ''} ${row.cab ?? ''}, ${row.pk ?? 'tow package'}, rated ${K.lb(row.t ?? 0)} with a GCWR of ${K.lb(row.gcwr ?? 0)} (p. ${row.p ?? y.src.pages}). The vehicle pages, such as the ${h.a('model:silverado-1500', 'Silverado 1500 page')}, list every row.</p>
<h2>Step 2: weigh the trailer as you will tow it</h2>
<p>The dry weight on a trailer brochure leaves out water, propane, batteries, food and gear. Use the loaded weight: a scale ticket is best, and the trailer's own GVWR on its label is the safe upper bound if you cannot weigh it. Our example trailer weighs ${K.lb(ex.trailer)} loaded. The ${h.a('travel-trailer-weight', 'travel trailer weight page')} shows how far dry and loaded weights drift apart.</p>
${h.mini('camper', { t: 'From dry weight to loaded weight', d: { dw: 5600, wa: 20, gr: 800, gv: ex.trailer } })}
<h2>Step 3: check the tongue share</h2>
<p>Chevrolet asks for ${P.tongue.conventional.min} to ${P.tongue.conventional.max}% of the loaded trailer on the hitch. Our example tongue of ${K.lb(ex.tongue)} is ${K.dec(share)}% of the trailer, ${c('tongue').ok ? 'inside the range' : 'outside the range'}. Below the range the trailer is prone to sway; above it the rear of the truck is overloaded. The tongue weight is also the figure that carries into the next two steps.</p>
<h2>Step 4: add up the payload</h2>
<p>People ${K.lb(ex.people)}, cargo ${K.lb(ex.cargo)}, hitch hardware ${K.lb(ex.hitch)} and the tongue ${K.lb(ex.tongue)} make ${K.lb(c('payload').used)} on the truck. The Silverado guide prints no payload, so the figure comes from the placard on the door pillar, which states the combined weight of occupants and cargo for your own truck (${h.src('cfr_571_110', '49 CFR 571.110')}); we use ${K.lb(door)} as an example. Result: ${c('payload').ok ? `within, with ${K.lb(c('payload').spare ?? 0)} to spare` : `over by ${K.lb(-(c('payload').spare ?? 0))}`}.</p>
<h2>Steps 5 and 6: GVWR and GCWR</h2>
<p>The GVWR test adds the same load to the curb weight and compares it with the GVWR on the certification label (${h.src('cfr_567_4', '49 CFR 567.4')}). It needs a real curb weight, which only a scale gives for your truck, so the example leaves it open. The GCWR test can be run from the guide alone. Chevrolet derives each rating as the GCWR minus the curb weight, counting ${K.num(P.gmIncluded.driver)} lb each for a driver and a front passenger (p. 7). Read backwards, our row implies a curb weight of ${K.lb(implied)}. Truck, people, cargo, hitch and trailer then weigh ${K.lb(c('gcwr').used)} against the ${K.lb(c('gcwr').limit ?? 0)} GCWR: ${c('gcwr').ok ? `within, with ${K.lb(c('gcwr').spare ?? 0)} to spare` : 'over'}.</p>
${h.table(['Check', 'Used', 'Limit', 'Result'], (['trailer', 'payload', 'gcwr'] as CheckId[]).map((k) => [NAME[k], K.lb(c(k).used), K.lb(c(k).limit ?? 0), c(k).ok ? 'within' : 'over']), 'The worked example, limit by limit (payload is an example door label).', ['l', 'r', 'r', 'l'])}
<h2>Reading the result</h2>
<p>The example is ${verdict}. The heaviest trailer this truck could pull with the same people, cargo and tongue share is ${K.lb(res.maxTrailer)}, set by ${by[res.maxBy]}, against a headline of ${K.lb(row.t ?? 0)}. That is the number to compare with trailers you are shopping for. Two habits keep it honest: recalculate when the load in the cab changes, since a fifth passenger or a full bed moves the answer, and keep a margin rather than towing at exactly the limit. Ford adds a reduction of ${P.altitude.percentPer1000ft}% of GVW and GCW per 1,000 ft of elevation for its own vehicles (${h.src('ford_2026', 'Ford guide')}, p. 9). The ${h.a('home', 'checker')} and the ${h.a('method', 'method page')} use the same arithmetic.</p>
`,
  faqs: [
    { q: 'What is the formula for towing capacity?', a: 'The maker\'s rating for your configuration is the ceiling. Below it, the trailer you may pull is the GCWR minus the loaded weight of your truck, and the tongue plus everything aboard must fit within the payload. The lowest of those results is your real capacity. No single formula replaces the five checks done together.' },
    { q: 'Should I use the dry weight or the GVWR of my trailer?', a: 'Use the loaded weight from a scale if you can. If not, the trailer\'s GVWR, printed on its own label, is the safe figure, because a trailer should never weigh more than that. The dry weight leaves out water, propane, batteries and every piece of gear, and understates the tow by hundreds of pounds or more.' },
    { q: 'Why does my calculated capacity come out lower than the advertised one?', a: 'Because the advertised figure is computed for the most favorable configuration, with only a driver and one passenger aboard and no cargo. Your passengers, your gear, your hitch and your tongue weight all come out of the payload and the GCWR, so the trailer you may pull drops as the truck fills up.' },
  ],
  tool: 'tow',
  toolArg: { m: id, tw: ex.trailer },
  related: ['gvwr-vs-gcwr', 'payload-capacity', 'tongue-weight', 'travel-trailer-weight', 'towing-capacity-chart'],
  sources: ['gm_2026', 'cfr_571_110', 'cfr_567_4', 'ford_2026'],
});
