import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Row } from '../../lib/data';

const ID = 'colorado';
const y = K.Y(ID);
const y25 = K.Y(ID, 2025);
const y23 = K.Y(ID, 2023);
const top = K.top(ID);
const base = y.rows.find((r) => r.t === y.min)!;
const zr2 = y.rows.find((r) => r.e?.includes('ZR2'))!;
const bison = y25.rows.find((r) => r.e?.includes('Bison'));
const inc = K.M(ID).included!;
const curb = (r: Row) => r.gcwr! - r.t! - inc;
const curbs = y.rows.map(curb);
const top23 = K.top(ID, 2023);
const BR = K.P.brakes.find((b) => b.who.includes('Colorado'))!;
const T = K.P.tongue.conventional;
// 2026 Chevrolet Trailering Guide, p. 41 (Colorado notes): tongue weight 10% to 15% of the loaded trailer, "up to 770 lbs."
const MAX_TONGUE = 770;

export default defineModel({
  id: ID,
  order: 9,
  title: `Colorado Towing Capacity ${y.year} by Package, Trim and GCWR`,
  description: `Colorado towing capacity ${y.year}: ${K.lb(y.min)} as built, ${K.lb(zr2.t!)} for the ZR2 and ${K.lb(y.max)} with the Trailering Package, plus the GCWR that sets every figure.`,
  h1: `Chevrolet Colorado towing capacity, ${y.year} and earlier`,
  intro: `Choose the version of your Colorado: the checker reads its line in Chevrolet's ${y.year} Trailering Guide and tests your trailer, passengers and cargo against the rating and GCWR.`,
  resume: `Chevrolet's ${y.year} Trailering Guide gives the Colorado three ratings, all for the crew cab with the ${top.e} and the ${top.ax} axle. With the Trailering Package it is rated ${K.lb(y.max)} on a GCWR of ${K.lb(top.gcwr!)}. The ZR2 is rated ${K.lb(zr2.t!)}, and a Colorado without the package ${K.lb(y.min)}, a figure that still requires the accessory trailer hitch and wiring harness. The engine is the same in all three; what changes is the gross combination weight rating Chevrolet assigns, from ${K.lb(base.gcwr!)} to ${K.lb(top.gcwr!)}. Chevrolet derives each rating from that GCWR minus the curb weight and ${K.num(inc)} lb for a driver and a front passenger. The tongue should be ${T.min} to ${T.max}% of the loaded trailer and no more than ${K.lb(MAX_TONGUE)}. Trailers above ${K.lb(BR.above)} need their own brakes by Chevrolet's rule for the Colorado, a lower threshold than for the Silverado.`,
  body: (h) => `
<h2>Same truck, three GCWRs</h2>
<p>The Colorado table is the clearest example of how Chevrolet builds a trailer rating. Subtract each rating and the ${K.num(inc)} lb of people from its GCWR and the curb weight left over is almost the same on all three lines, between ${K.lb(Math.min(...curbs))} and ${K.lb(Math.max(...curbs))} (${h.doc(ID, y.year, `${y.year} Trailering Guide`)}, p. ${top.p}). The truck hardly changes weight. What changes is the GCWR, ${K.lb(base.gcwr!)} without the package, ${K.lb(zr2.gcwr!)} for the ZR2 and ${K.lb(top.gcwr!)} with the Trailering Package, and the rating follows it pound for pound.</p>
<p>The GCWR is the most the loaded truck and the loaded trailer may weigh together. Chevrolet sets it for each version of the truck, and it is the figure the trailer rating is built from. The ${h.a('gvwr-vs-gcwr', 'GVWR and GCWR guide')} explains how it relates to the door label. Put your own truck weight and load into the tool: it starts from the top line.</p>
${h.mini('gcwr', { t: 'Colorado: trailer allowed by the GCWR', d: { gc: top.gcwr!, cw: curb(top) } })}
<h2>The Trailering Package, the ZR2 and the base truck</h2>
<p>The jump from ${K.lb(y.min)} to ${K.lb(y.max)} is the Trailering Package. The ${K.lb(y.min)} line carries a footnote of its own: even that rating requires the available accessory trailer hitch and trailer wiring harness, so a Colorado with no hitch at all has no rating to use. The ZR2 sits in between at ${K.lb(zr2.t!)}.${bison ? ` The ${y25.year} guide also printed a ZR2 Bison line at ${K.lb(bison.t!)}, which the ${y.year} guide no longer lists.` : ''} The guide prints one column for the crew cab and does not split two-wheel and four-wheel drive, so the same figure applies to both.</p>
<p>The guide's footnote on maximum ratings applies here as on every Chevrolet: the figures are for comparison, and passengers, cargo and accessories reduce them. A Colorado with four adults and a loaded bed has used part of its GCWR before the trailer is counted.</p>
<h2>Tongue weight and brakes on a midsize truck</h2>
<p>Chevrolet caps the Colorado tongue at ${K.lb(MAX_TONGUE)}, which is ${T.min}% of the ${K.lb(y.max)} rating. A trailer at the maximum must therefore carry the low end of the ${T.min} to ${T.max}% range on its tongue; at ${T.max}% the cap is reached with a trailer of about ${K.lb(Math.floor((MAX_TONGUE * 100) / T.max / 100) * 100)}. The tongue also counts against the payload on the door pillar. Brakes are required above ${K.lb(BR.above)} on the Colorado, against ${K.lb(K.P.brakes.find((b) => b.who.startsWith('Chevrolet Silverado'))!.above)} on the larger Chevrolets (${h.src('gm_2026', 'Chevrolet guide, p. 6')}), so even a small enclosed trailer may need them. The ${h.a('trailer-brakes', 'trailer brakes guide')} covers controllers.</p>
${h.mini('brakes', { t: 'Colorado: does your trailer need brakes?', d: { tw: y.min } })}
<h2>A misprint in the ${y23.year} chart</h2>
<p>The ${y23.year} Colorado chart prints a GCWR of ${K.lb(top23.gcwr!)} on its ${K.lb(top23.t!)} lines, which would leave almost nothing for the truck itself; the ${y.year} guide prints ${K.lb(top.gcwr!)} for the same rating. We copy the ${y23.year} figure as printed but would not rely on it: if you own a ${y23.year} Colorado, check the owner's manual. For a rival, see the ${h.a('model:ranger', 'Ranger')}, rated similarly with its tow package, and the ${h.a('truck-towing-capacity', 'truck towing guide')}.</p>
`,
  faqs: [
    { q: 'What does the Colorado Trailering Package add?', a: `A higher GCWR, and with it the rating. In the ${y.year} guide the Colorado goes from ${K.lb(y.min)} to ${K.lb(y.max)} with the package, as its GCWR rises from ${K.lb(base.gcwr!)} to ${K.lb(top.gcwr!)}. The truck weighs about the same either way; Chevrolet simply certifies the combination for more weight once the towing hardware is fitted.` },
    { q: 'How much can a Colorado ZR2 tow?', a: `${K.lb(zr2.t!)} in Chevrolet's ${y.year} Trailering Guide, on a GCWR of ${K.lb(zr2.gcwr!)}. That is ${K.lb(y.max - zr2.t!)} less than a Colorado with the Trailering Package, with the same engine and axle ratio. If the ZR2 is the trim you want, size the trailer to that lower figure.` },
    { q: 'Can a Colorado tow anything without a hitch package?', a: `It is rated ${K.lb(y.min)} without the Trailering Package, but Chevrolet's footnote says that figure requires the available accessory trailer hitch and wiring harness. In other words, a hitch is needed in every case, and the package is what moves the rating to ${K.lb(y.max)}.` },
  ],
  related: ['model:ranger', 'model:silverado-1500', 'model:maverick', 'truck-towing-capacity', 'gvwr-vs-gcwr', 'trailer-brakes'],
  trailer: 5000,
});
