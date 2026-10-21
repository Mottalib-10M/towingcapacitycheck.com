import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { checkTow } from '../../lib/engine/towing';

const P = K.P;
const ry = K.Y('ram-1500');
const r = K.top('ram-1500');
const gvwr = r.gvwr ?? 0, gcwr = r.gcwr ?? 0, curb = r.cw ?? 0, pl = r.pl ?? 0, rating = r.t ?? 0;
const gap = gcwr - curb - rating;
const sample = [...ry.rows].filter((x) => x.t && x.gvwr && x.cw).sort((a, b) => (b.t ?? 0) - (a.t ?? 0)).filter((x, i, a) => a.findIndex((y) => y.e === x.e) === i);

// Worked example: a trailer under the rating that still breaks the GVWR.
const exT = 10000, exTg = 1200, exPp = 500, exCg = 200;
const res = checkTow({ trailer: rating, gcwr, gvwr, payload: pl, curb }, { trailer: exT, tongue: exTg, people: exPp, cargo: exCg, hitch: P.hitchWeight.conventional }, P.tongue.conventional);
const cG = res.checks.find((c) => c.id === 'gvwr')!;
const cC = res.checks.find((c) => c.id === 'gcwr')!;
const cP = res.checks.find((c) => c.id === 'payload')!;

const s = K.top('silverado-1500');
const sIncl = P.gmIncluded.driver + P.gmIncluded.passenger;
const sCurb = (s.gcwr ?? 0) - (s.t ?? 0) - sIncl;
const alt = 5000;
const altCut = gcwr * P.altitude.percentPer1000ft * (alt / 1000) / 100;

export default defineGuide({
  id: 'gvwr-vs-gcwr',
  group: 'ratings',
  order: 10,
  slug: 'gvwr-vs-gcwr',
  nav: 'GVWR vs GCWR',
  card: 'The truck alone against the whole rig: two limits, and which one you hit first.',
  title: `GVWR vs GCWR ${P.year}: Two Limits Every Tow Must Respect`,
  description: `GVWR vs GCWR ${P.year}: the GVWR caps the loaded truck, the GCWR truck and trailer together. A ${ry.year} Ram 1500 row shows both; the calculator gives the trailer left.`,
  h1: 'GVWR vs GCWR: the truck alone, and the whole rig',
  intro: `Enter a GCWR and a curb weight, then the people and cargo: the calculator returns the heaviest trailer the combined rating leaves. The defaults are the ${ry.year} Ram 1500 row with the top trailer rating.`,
  resume: `The GVWR, gross vehicle weight rating, is the most the truck itself may weigh, loaded with people, cargo, hitch hardware and the tongue weight of the trailer. It is printed on the certification label on the door pillar, together with the front and rear axle ratings. The GCWR, gross combined weight rating, is the most the truck and the loaded trailer may weigh together; the maker prints it in its towing guide. On the ${ry.year} Ram 1500 row that reaches ${K.lb(rating)}, the GVWR is ${K.lb(gvwr)} and the GCWR ${K.lb(gcwr)}, with a base weight of ${K.lb(curb)}. The two limits fail in different ways. A heavy tongue and a full cab can push the truck over its GVWR with a trailer well under the rating. A heavy trailer behind a loaded truck can break the GCWR while the truck itself is fine. A legal tow respects both, and the axle ratings too.`,
  body: (h) => `
<h2>Where each rating is written</h2>
<p>Federal rules require every vehicle to carry a certification label listing its GVWR and the gross axle weight rating, GAWR, of each axle (${h.src('cfr_567_4', '49 CFR 567.4')}). That label sits on the driver's door edge or pillar and describes your own truck, options included. Next to it, the tire and loading placard states the combined weight of occupants and cargo that should never be exceeded (${h.src('cfr_571_110', '49 CFR 571.110')}), which is the payload in plain words. The GCWR is not on either label: it lives in the maker's towing guide or chart, one value per configuration, and it changes with the engine and the axle ratio.</p>
<h2>One Ram row, every number</h2>
<p>Ram is the only maker here that prints all of them on one line, axle ratings included (Toyota's Tundra sheet comes close, without the axles), which makes its charts a good place to see how they relate. The table gives the best-rated row of each engine for ${ry.year} (${h.doc('ram-1500', ry.year, 'Ram chart')}).</p>
${h.table(['Engine', 'Trailer rating', 'GVWR', 'GCWR', 'Base weight', 'Payload', 'Rear GAWR'], sample.map((x) => [x.e ?? x.l, K.lb(x.t ?? 0), K.lb(x.gvwr ?? 0), K.lb(x.gcwr ?? 0), K.lb(x.cw ?? 0), x.pl ? K.lb(x.pl) : 'not printed', x.rg ? K.lb(x.rg) : 'not printed']), `Ram 1500, ${ry.year}: best-rated row of each engine.`, ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Take the first row. The GVWR minus the base weight, ${K.lb(gvwr)} minus ${K.lb(curb)}, gives ${K.lb(gvwr - curb)}, and Ram prints a payload of ${K.lb(pl)}: the chart notes define payload as GVWR minus base weight, rounded to the nearest 10 lb. The GCWR minus the base weight minus the trailer rating leaves ${K.lb(gap)}. That remainder is what Ram's formula reserves for the occupants and equipment: the notes of its ${h.doc('ram-1500', 2025, '2025 chart')} build the combined weight from the base weight, the options, the tow package, the maximum trailer and ${K.num(P.ramAssumptions.passengers)} lb for driver and passenger.</p>
<h2>How Ford and Chevrolet get from GCWR to rating</h2>
<p>Ford and Chevrolet print the GCWR and the trailer rating but no curb weight per row. Chevrolet states the rule on page 7 of its ${h.src('gm_2026', 'trailering guide')}: the maximum trailer weight is the GCWR minus the curb weight, with ${K.num(P.gmIncluded.driver)} lb each for a driver and a front passenger. Read backwards, the Silverado 1500 row rated ${K.lb(s.t ?? 0)} with a GCWR of ${K.lb(s.gcwr ?? 0)} implies a curb weight of ${K.lb(sCurb)}. Every pound you add beyond those two people, and every option heavier than the base build, comes straight off the trailer you may pull. The ${h.a('home', 'checker')} recovers the curb weight this way when the guide prints none.</p>
<h2>Which one stops you first</h2>
<p>Back to the Ram row, with an example load: a ${K.lb(exT)} trailer, under the ${K.lb(rating)} rating, with ${K.lb(exTg)} on the tongue, ${K.lb(exPp)} of people and ${K.lb(exCg)} of cargo. The truck then weighs ${K.lb(cG.used)} against its GVWR of ${K.lb(cG.limit ?? 0)}: ${cG.ok ? 'within' : `over by ${K.lb(-(cG.spare ?? 0))}`}, and the ${K.lb(cP.used)} it carries ${cP.ok ? 'fits' : 'also exceeds'} the ${K.lb(pl)} payload. The whole rig weighs ${K.lb(cC.used)} against a GCWR of ${K.lb(cC.limit ?? 0)}: ${cC.ok ? 'within' : 'over'}. The GVWR breaks first because the tongue and the people sit on the truck. Move weight out of the cab and into the trailer, keeping the tongue in range, and the GCWR becomes the limit instead. That trade-off is why the ${h.a('tongue-weight', 'tongue weight')} matters for both ratings.</p>
${h.mini('tongue', { t: 'Tongue weight that lands on the GVWR', p: ['tw', 'tg'], d: { tw: exT, tg: exTg } })}
<h2>Altitude and the axle ratings</h2>
<p>Ford asks owners to reduce GVW and GCW by ${P.altitude.percentPer1000ft}% for every 1,000 ft of elevation (${h.src('ford_2026', 'Ford guide')}, p. 9). On a ${K.lb(gcwr)} combined rating, a pass at ${K.num(alt)} ft would take ${K.lb(altCut)} off, if the same rule applied to that truck; Ford states it for its own vehicles. The axle ratings are the last check: the rear GAWR in the table caps the weight on the rear axle, which carries most of the tongue. A truck can be under its GVWR and still over its rear GAWR with a heavy tongue and a loaded bed. A public scale with separate pads gives the axle weights. The ${h.a('payload-capacity', 'payload page')} and the ${h.a('how-to-calculate-towing-capacity', 'step-by-step calculation')} take it from there.</p>
`,
  faqs: [
    { q: 'Is GCWR minus GVWR the trailer I can tow?', a: `No. That subtraction assumes the truck is loaded to its GVWR and ignores how the maker built its rating. On the ${ry.year} Ram 1500 top row it would give ${K.lb(gcwr - gvwr)}, while the printed rating is ${K.lb(rating)}, computed from a much lighter truck. Use GCWR minus the real loaded weight of your truck, and never more than the printed rating.` },
    { q: 'Where do I find the GCWR of my truck?', a: 'In the maker\'s towing guide or towing chart for your model year, on the row that matches your engine, drive, cab and axle ratio. It is not on the door label, which gives the GVWR and the axle ratings. Some owner\'s manuals repeat the table; the vehicle pages here link each maker\'s document with its page.' },
    { q: 'Does the trailer count against the GVWR?', a: 'Only its tongue or pin weight does, because that is the part resting on the truck. The rest of the trailer is carried by its own axles and counts against the trailer\'s own GVWR and against the combined GCWR of the rig. A heavier tongue therefore loads the truck\'s GVWR and its rear axle at the same time.' },
  ],
  tool: 'gcwr',
  toolArg: { gc: gcwr, cw: curb },
  related: ['payload-capacity', 'how-to-calculate-towing-capacity', 'tongue-weight', 'half-ton-vs-three-quarter-ton', 'axle-ratio-towing'],
  sources: ['cfr_567_4', 'cfr_571_110', 'gm_2026', 'ford_2026', 'ram1500_2026', 'ram_hd_2025'],
});
