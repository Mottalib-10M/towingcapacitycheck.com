import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Row } from '../../lib/data';

const ID = 'ranger';
const y = K.Y(ID);
const y23 = K.Y(ID, 2023);
const raptor = y.rows.find((r) => r.e?.includes('Raptor'))!;
const std = y.rows.filter((r) => r !== raptor);
const inc = K.M(ID).included!;
const curb = (r: Row) => r.gcwr! - r.t! - inc;
const g23 = std.find((r) => r.e?.startsWith('2.3L') && r.d === '4x2')!;
const g27 = std.find((r) => r.e?.startsWith('2.7L'))!;
const old35 = y23.rows.filter((r) => r.t === Math.min(...y23.rows.map((x) => x.t!)));
const FT = K.P.fordTongue;
const BR = K.P.brakes.find((b) => b.who.startsWith('Ford'))!;
// 2026 Ford RV & Trailer Towing Guide, p. 27 (Ranger notes): rear step bumper 3,500 lbs./350 tongue; "Do not exceed 3,500 lbs. when towing with bumper only";
// trailers over 3,500 lbs. require Trailer Tow Package (53R); hitch receiver 7,500 lbs./750 tongue; Ranger Raptor 5,510/550.
const BUMPER = { trailer: 3500, tongue: 350 };
const RECEIVER_TONGUE = 750;
const RAPTOR_TONGUE = 550;
// Same page: frontal area 30 sq. ft. without, 55 sq. ft. with the Trailer Tow Package.
const AREA = { without: 30, with: 55 };

export default defineModel({
  id: ID,
  order: 10,
  title: `Ranger Towing Capacity ${y.year}: Bumper, Hitch and Tow Package`,
  description: `Ranger towing capacity ${y.year}: ${K.lb(BUMPER.trailer)} from the bumper, ${K.lb(y.max)} with the 53R Trailer Tow Package, ${K.lb(raptor.t!)} for the Raptor, and your own trailer checked.`,
  h1: `Ford Ranger towing capacity, ${y.year} and earlier`,
  intro: `Pick your Ranger's engine and drive: the checker reads its line in Ford's ${y.year} towing guide and tests your trailer, people and cargo against the rating and GCWR.`,
  resume: `In Ford's ${y.year} RV and Trailer Towing Guide every Ranger except the Raptor is rated ${K.lb(y.max)}, whether it has the 2.3L EcoBoost with two- or four-wheel drive or the 2.7L EcoBoost V6, always with the ${g23.ax} axle and the Trailer Tow Package (53R). The Raptor, with its ${raptor.e!.replace(/ \(.*\)/, '')} and ${raptor.ax} axle, is rated ${K.lb(raptor.t!)}. That headline figure has a condition: Ford says not to exceed ${K.lb(BUMPER.trailer)} when towing from the bumper alone, and requires the 53R package for any trailer above it. The receiver is rated ${K.lb(y.max)} with ${K.lb(RECEIVER_TONGUE)} of tongue, the step bumper ${K.lb(BUMPER.trailer)} with ${K.lb(BUMPER.tongue)}. The three standard lines differ only in GCWR, from ${K.lb(g23.gcwr!)} to ${K.lb(g27.gcwr!)}, which means the heavier trucks get more combined weight to carry the same trailer. Ford counts a ${K.num(K.P.gmIncluded.driver)} lb driver and passenger.`,
  body: (h) => `
<h2>Bumper, receiver, package</h2>
<p>A Ranger has three towing limits stacked on top of each other, and the table shows only the last one. The rear step bumper with a ball is rated ${K.lb(BUMPER.trailer)} and ${K.lb(BUMPER.tongue)} of tongue load. The receiver hitch is rated ${K.lb(y.max)} and ${K.lb(RECEIVER_TONGUE)}, or ${K.lb(raptor.t!)} and ${K.lb(RAPTOR_TONGUE)} on the Raptor. And the table's ${K.lb(y.max)} needs the Trailer Tow Package (53R), which Ford requires for every trailer above ${K.lb(BUMPER.trailer)} (${h.doc(ID, y.year, `${y.year} guide`)}, p. ${raptor.p}). A Ranger with a ball on the bumper and no package is a ${K.lb(BUMPER.trailer)} truck, however the brochure reads.</p>
<p>Ford also assumes a frontal area for the trailer: ${AREA.without} square feet without the package and ${AREA.with} with it. A tall box trailer pushes far more air than a flat utility trailer of the same weight, and the ratings assume a trailer within that area. The ${h.a('hitch-class', 'hitch class guide')} explains how bumper, Class III and Class IV receivers differ.</p>
${h.mini('tongue', { t: 'Ranger: tongue load of your trailer', d: { tw: y.max } })}
<h2>One rating, three GCWRs</h2>
<p>The three standard lines share the ${K.lb(y.max)} rating but not the GCWR: ${K.lb(g23.gcwr!)} for the 2.3L with two-wheel drive, ${K.lb(std.find((r) => r.e?.startsWith('2.3L') && r.d === '4x4')!.gcwr!)} with four-wheel drive and ${K.lb(g27.gcwr!)} for the 2.7L. Subtract the rating and Ford's ${K.num(inc)} lb of people and the implied curb weight rises from ${K.lb(curb(g23))} to ${K.lb(curb(g27))}. In effect the rating is held at the receiver's ${K.lb(y.max)} while the GCWR follows each truck's weight, so the heavier Ranger is not penalised. That holds only with two people aboard. Every extra passenger or bag in the bed eats into a margin that is the same on all three.</p>
<p>The Raptor is the exception. Its line, on the ${raptor.ax} axle, comes with a GCWR of ${K.lb(raptor.gcwr!)} and a ${K.lb(raptor.t!)} rating, and the 53R package is standard on it. For trailers between ${K.lb(raptor.t!)} and ${K.lb(y.max)}, a regular Ranger is the one rated for the job.</p>
${h.mini('gcwr', { t: 'Ranger: trailer allowed by the GCWR', d: { gc: g27.gcwr!, cw: curb(g27) } })}
<h2>The previous Ranger</h2>
<p>The ${y23.year} guide covers the previous generation, sold as SuperCab or SuperCrew with the 2.3L only. It printed ${K.num(old35.length)} lines at ${K.lb(old35[0].t!)} for trucks without the package and ${K.lb(y23.max)} with it (${h.doc(ID, y23.year, `${y23.year} guide`)}, p. ${old35[0].p}). The bumper rule was the same, so a used Ranger without the 53R hitch is limited to ${K.lb(BUMPER.trailer)} whatever its year. Ford requires trailer brakes above ${K.lb(BR.above)} loaded and computes ratings with a ${FT.conventional}% tongue. For other midsize choices see the ${h.a('model:colorado', 'Colorado')} page, and the ${h.a('model:maverick', 'Maverick')} for a smaller pickup.</p>
`,
  faqs: [
    { q: 'How much can a Ranger tow from the bumper?', a: `${K.lb(BUMPER.trailer)}, with no more than ${K.lb(BUMPER.tongue)} on the ball. Ford's ${y.year} guide says not to exceed that figure when towing from the bumper only. Anything heavier needs the Trailer Tow Package (53R) and its receiver, rated ${K.lb(y.max)} and ${K.lb(RECEIVER_TONGUE)} of tongue load.` },
    { q: 'Does the Ranger 2.7L V6 tow more than the 2.3L?', a: `No. Both are rated ${K.lb(y.max)} with the Trailer Tow Package in the ${y.year} guide. The 2.7L line has a higher GCWR, ${K.lb(g27.gcwr!)} against ${K.lb(g23.gcwr!)} for the two-wheel-drive 2.3L, which offsets its heavier weight rather than adding trailer capacity. Choose the engine for how it pulls, not for the rating.` },
    { q: 'Why is the Ranger Raptor rated lower?', a: `Ford rates it ${K.lb(raptor.t!)} with a ${K.lb(RAPTOR_TONGUE)} tongue limit, against ${K.lb(y.max)} for the other Rangers. Its line carries a ${raptor.ax} axle and a GCWR of ${K.lb(raptor.gcwr!)}, and its receiver is rated to the same lower figure. The tow package is already standard on the Raptor, so there is no option to add that would raise it.` },
  ],
  related: ['model:colorado', 'model:maverick', 'model:f-150', 'hitch-class', 'trailer-brakes', 'truck-towing-capacity'],
  trailer: 5000,
});
