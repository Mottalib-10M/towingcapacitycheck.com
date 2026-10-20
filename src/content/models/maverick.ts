import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ID = 'maverick';
const y = K.Y(ID);
const years = K.years(ID);
const y24 = K.Y(ID, 2024);
const pack = y.rows.filter((r) => r.pk?.includes('53Q'));
const eco = pack.find((r) => r.e?.startsWith('2.0L'))!;
const hyb = pack.find((r) => r.e?.includes('Hybrid'))!;
const ecoBase = y.rows.find((r) => r.e === eco.e && r.d === eco.d && !r.pk && r.ax === eco.ax)!;
const fwdMax = Math.max(...y.rows.filter((r) => r.d === 'FWD').map((r) => r.t!));
const hybMax = (yr: number) => Math.max(...K.Y(ID, yr).rows.filter((r) => r.e?.includes('Hybrid')).map((r) => r.t!));
const firstHyb4k = [...years].reverse().find((yr) => hybMax(yr) === y.max);
const inc = K.M(ID).included!;
const BR = K.P.brakes.find((b) => b.who.startsWith('Ford'))!;
const FT = K.P.fordTongue;
// 2026 Ford RV & Trailer Towing Guide, p. 28 (Maverick notes): trailers over 2,000 lbs. require the 4K Tow Package (53Q);
// hitch receiver 4,000 lbs./400 tongue; frontal area 29 sq. ft. without, 40 sq. ft. with the 4K Tow Package.
const RECEIVER_TONGUE = 400;
const AREA = { without: 29, with: 40 };

export default defineModel({
  id: ID,
  order: 11,
  title: `Maverick Towing Capacity ${y.year} and the 4K Tow Package`,
  description: `Maverick towing capacity ${y.year}: ${K.lb(y.min)} as built or ${K.lb(y.max)} with the 4K Tow Package on AWD, which engines qualify, the GCWR behind it and your trailer checked.`,
  h1: `Ford Maverick towing capacity, ${y.year} and earlier`,
  intro: `Choose your Maverick's engine, drive and package: the checker reads that line of Ford's ${y.year} towing guide and tests your trailer, passengers and cargo against it.`,
  resume: `Ford's ${y.year} RV and Trailer Towing Guide gives the Maverick two possible ratings and nothing in between: ${K.lb(y.min)} or ${K.lb(y.max)}. The higher figure needs the 4K Tow Package (53Q) and all-wheel drive, and both engines can have it in ${y.year}: the ${eco.e} on the ${eco.ax} axle and the ${hyb.e} on the ${hyb.ax} axle. Every front-wheel-drive Maverick is rated ${K.lb(fwdMax)}, and so is an all-wheel-drive one without the package. Ford's note is blunt: any trailer above ${K.lb(y.min)} requires the 4K package. The receiver that comes with it is rated ${K.lb(y.max)} and ${K.lb(RECEIVER_TONGUE)} of tongue load. The package raises the GCWR by exactly the rating difference, ${K.lb(eco.gcwr! - ecoBase.gcwr!)} on the EcoBoost. ${firstHyb4k ? `The hybrid has qualified since the ${firstHyb4k} guide; in ${y24.year} it was rated ${K.lb(hybMax(y24.year))} only.` : ''} Ford counts a ${K.num(K.P.gmIncluded.driver)} lb driver and passenger in each rating.`,
  body: (h) => `
<h2>Two ratings and a package between them</h2>
<p>The Maverick table has ${K.num(y.rows.length)} lines in ${y.year}, and only two numbers appear in the rating column. ${K.num(pack.length)} lines carry the 4K Tow Package (53Q) and read ${K.lb(y.max)}; the rest read ${K.lb(y.min)} (${h.doc(ID, y.year, `${y.year} guide`)}, p. ${eco.p}). No engine, axle or trim gets anything in between. The package is the whole story, and it is offered in this table only with all-wheel drive.</p>
<p>The GCWR shows what the package does. On the ${eco.e} with all-wheel drive, Ford prints ${K.lb(ecoBase.gcwr!)} without it and ${K.lb(eco.gcwr!)} with it, a difference equal to the extra trailer weight allowed. The truck itself is unchanged as far as the rating is concerned; the package certifies the combination for more weight, with its own hitch receiver. Ford also assumes a frontal area of ${AREA.without} square feet for trailers without it and ${AREA.with} with it, so a taller trailer belongs with the package even when it is light.</p>
${h.mini('gcwr', { t: 'Maverick: trailer allowed by the GCWR', d: { gc: eco.gcwr!, cw: eco.gcwr! - eco.t! - inc } })}
<h2>Hybrid or EcoBoost</h2>
<p>For years the choice of a Maverick hybrid meant giving up the higher rating. The ${y24.year} guide lists the hybrid only with front-wheel drive and ${K.lb(hybMax(y24.year))} (${h.doc(ID, y24.year, `${y24.year} guide`)}, p. ${y24.rows[0].p}).${firstHyb4k ? ` From ${firstHyb4k}, an all-wheel-drive hybrid with the 4K package is rated ${K.lb(y.max)}, on a GCWR of ${K.lb(hyb.gcwr!)}, a little above the EcoBoost's ${K.lb(eco.gcwr!)}.` : ''} If you shop for a used hybrid, the model year and the drive decide whether ${K.lb(y.max)} is possible at all.</p>
<p>The axle ratio comes with the engine and plays no part in the rating: the EcoBoost uses ${eco.ax}, the hybrid ${hyb.ax}, and both reach the same figure. The ${h.a('axle-ratio-towing', 'axle ratio guide')} explains why that is unusual.</p>
<h2>Small trailers still need brakes</h2>
<p>A ${K.lb(y.min)} limit sounds like a utility trailer and nothing more, but Ford asks for separate trailer brakes on any trailer over ${K.lb(BR.above)} loaded, well under the Maverick's own ratings. A small teardrop camper or a jet-ski trailer with fuel and gear can cross that line. The tongue load should be ${FT.conventional}% of the trailer, ${K.lb((y.max * FT.conventional) / 100)} at the top rating, which matches the receiver's ${K.lb(RECEIVER_TONGUE)}. Check the trailer below, and see the ${h.a('trailer-brakes', 'trailer brakes guide')} and the ${h.a('travel-trailer-weight', 'travel trailer weight guide')} for what a loaded camper really weighs. The ${h.a('model:ranger', 'Ranger')} is the next step up in Ford's range.</p>
${h.mini('brakes', { t: 'Maverick: does this trailer need brakes?', d: { tw: y.min } })}
`,
  faqs: [
    { q: `Can a front-wheel-drive Maverick get the ${K.lb(y.max)} rating?`, a: `No. In Ford's ${y.year} guide every front-wheel-drive Maverick is rated ${K.lb(fwdMax)}, and the 4K Tow Package appears only on all-wheel-drive lines. A trailer above ${K.lb(y.min)} requires that package, so a front-wheel-drive truck stays with light trailers whatever hitch is bolted on.` },
    { q: `Is the Maverick hybrid rated to tow ${K.lb(y.max)}?`, a: `${firstHyb4k ? `Since the ${firstHyb4k} guide, yes, with all-wheel drive and the 4K Tow Package (53Q); its GCWR is ${K.lb(hyb.gcwr!)}.` : 'Not in the guides read for this site.'} Earlier hybrids were front-wheel drive only and rated ${K.lb(hybMax(y24.year))}. Check the drive on the window sticker before assuming the higher figure applies to a used truck.` },
    { q: 'What does the Maverick 4K Tow Package change?', a: `It raises the GCWR by ${K.lb(eco.gcwr! - ecoBase.gcwr!)} on the EcoBoost, which doubles the trailer rating from ${K.lb(y.min)} to ${K.lb(y.max)}, and it brings a receiver rated ${K.lb(y.max)} with ${K.lb(RECEIVER_TONGUE)} of tongue load. Ford's ratings also assume a larger trailer frontal area with the package fitted.` },
  ],
  related: ['model:ranger', 'model:colorado', 'model:explorer', 'trailer-brakes', 'travel-trailer-weight', 'hitch-class'],
  trailer: 3000,
});
