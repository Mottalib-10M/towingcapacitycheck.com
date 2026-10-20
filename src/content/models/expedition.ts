import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ID = 'expedition';
const y = K.Y(ID);
const y24 = K.Y(ID, 2024);
const top = K.top(ID);
const low = y.rows.find((r) => r.t === y.min)!;
const is4x4 = (r: { d?: string }) => r.d === '4x4';
const max4x2 = (yr: number) => Math.max(...K.Y(ID, yr).rows.filter((r) => r.d === '4x2').map((r) => r.t!));
const maxRow = y.rows.find((r) => is4x4(r) && r.l.includes('MAX'))!;
const wheels = y.rows.find((r) => r.n?.includes('24"'))!;
const top24 = K.top(ID, 2024);
const FT = K.P.fordTongue;
const ALT = K.P.altitude.percentPer1000ft;
const BR = K.P.brakes.find((b) => b.who.startsWith('Ford'))!;
// 2026 Ford RV & Trailer Towing Guide, p. 38: Expedition hitch receiver, weight-carrying 7,000 lbs./700 tongue (SWB and MAX);
// weight-distributing 9,600/960 (SWB) and 9,000/900 (MAX). Ratings over 7,000 lbs. require a weight-distributing hitch (p. 38, footnote 2).
const WC = { trailer: 7000, tongue: 700 };
const WD = { swb: 9600, swbTongue: 960, max: 9000, maxTongue: 900 };
// 2024 Ford RV & Trailer Towing Guide, p. 40: weight-carrying 6,000/600, weight-distributing 9,300/930 (Expedition).
const WC24 = { trailer: 6000, tongue: 600 };
// 2026 guide, notes of the Expedition table: frontal area 55 sq. ft. without, 60 sq. ft. with Heavy-Duty Trailer Tow.
const AREA = { without: 55, with: 60 };
// 2026 guide, row note p. 38: the 9,200 line also prints 9,300 for the Tremor High Output engine.
const TREMOR_ALT = 9300;

export default defineModel({
  id: ID,
  order: 7,
  title: `Expedition Towing Capacity ${y.year}: SWB, MAX and Hitch Rules`,
  description: `Expedition towing capacity ${y.year}: ${K.lb(y.min)} to ${K.lb(y.max)} by drive and length, the ${K.lb(WC.trailer)} ceiling without load bars and the Heavy-Duty Trailer Tow rule.`,
  h1: `Ford Expedition towing capacity, ${y.year} and earlier`,
  intro: `Choose drive, wheelbase and axle: the checker reads the matching line of Ford's ${y.year} towing guide for the Expedition and tests your trailer and load against it.`,
  resume: `Ford's ${y.year} RV and Trailer Towing Guide gives the Expedition just ${K.num(y.rows.length)} lines, from ${K.lb(y.min)} to ${K.lb(y.max)}, all with the ${top.e}. The ${K.lb(y.max)} maximum belongs to the regular-length Expedition with four-wheel drive and the ${top.ax} axle, on a GCWR of ${K.lb(top.gcwr!)}; the long Expedition MAX tops out at ${K.lb(maxRow.t!)}. Two-wheel-drive versions stop at ${K.lb(max4x2(y.year))}, because the heavy-duty towing equipment is tied to four-wheel drive in this guide. Without load bars the receiver is good for ${K.lb(WC.trailer)} and ${K.lb(WC.tongue)} of tongue weight; anything heavier needs a weight-distributing hitch and the Class IV Heavy-Duty Trailer Tow equipment. Ford computes each rating with a ${K.num(K.P.gmIncluded.driver)} lb driver and passenger, a ${FT.conventional}% tongue load and SAE J2807. The ${y24.year} guide topped out at ${K.lb(y24.max)} and allowed that on two-wheel drive.`,
  body: (h) => `
<h2>Four-wheel drive or a ${K.lb(max4x2(y.year))} ceiling</h2>
<p>The ${y.year} table splits the Expedition into two groups. The four-wheel-drive trucks on the ${top.ax} axle are rated ${K.lb(maxRow.t!)} to ${K.lb(y.max)}. The two-wheel-drive trucks on the ${low.ax} axle are rated ${K.lb(y.min)} and ${K.lb(max4x2(y.year))}, the longer MAX getting the higher figure (${h.doc(ID, y.year, `${y.year} guide`)}, p. ${top.p}). Ford's notes say that trailers over ${K.lb(WC.trailer)} require the Class IV Heavy-Duty Trailer Tow equipment, and the ${y.year - 1} guide adds that it is standard on the 4x4 and needs an aftermarket weight-distributing hitch. That is why no two-wheel-drive line reaches it.</p>
<p>It was different a few years ago. The ${y24.year} guide rated a two-wheel-drive Expedition with the Class IV Heavy-Duty Trailer Tow Package (536) and the ${top24.ax} axle at ${K.lb(y24.max)}, its highest figure that year (${h.doc(ID, y24.year, `${y24.year} guide`)}, p. ${top24.p}). If you shop for a used two-wheel-drive Expedition, the model year changes the answer by thousands of pounds.</p>
${h.mini('cap', { t: 'Expedition maximum by model year', p: ['y'], d: { m: ID } })}
<h2>The hitch: ${K.lb(WC.trailer)} on the ball, more with bars</h2>
<p>The receiver carries its own limits, printed on p. 38. As a weight-carrying hitch it is rated ${K.lb(WC.trailer)} with ${K.lb(WC.tongue)} of tongue, on both lengths. With a weight-distributing hitch, the regular Expedition goes to ${K.lb(WD.swb)} and ${K.lb(WD.swbTongue)}, the MAX to ${K.lb(WD.max)} and ${K.lb(WD.maxTongue)}, which match the table. The weight-carrying limit rose over the years: the ${y24.year} guide set it at ${K.lb(WC24.trailer)} and ${K.lb(WC24.tongue)}. Ford also assumes a frontal area of ${AREA.without} square feet without the heavy-duty equipment and ${AREA.with} with it, so a tall, blunt trailer may need a lower load than the table suggests. The ${h.a('weight-distribution-hitch', 'weight distribution guide')} explains the bars; the ${h.a('hitch-class', 'hitch class guide')} explains receiver classes.</p>
${h.mini('tongue', { t: 'Expedition: tongue load for your trailer', d: { tw: WC.trailer } })}
<h2>Wheels, Tremor and altitude</h2>
<p>One four-wheel-drive line prints two values. The regular Expedition on 24-inch wheels is rated ${K.lb(wheels.t!)}, and the same cell gives ${K.lb(TREMOR_ALT)} for the Tremor with its High Output engine; the checker keeps ${K.lb(wheels.t!)}, the lower value, since the two footnotes share a cell. A Tremor owner should read p. ${wheels.p} directly. Altitude lowers every figure: Ford asks drivers to reduce the gross vehicle and gross combination weights by ${ALT}% for each 1,000 feet of elevation (${h.src('ford_2026', 'Ford guide, p. 9')}), so a family heading to a mountain campground with a trailer near ${K.lb(y.max)} needs margin. Trailers over ${K.lb(BR.above)} loaded need their own brakes. The ${h.a('model:tahoe', 'Tahoe')} page covers the Chevrolet rival, and the ${h.a('model:f-150', 'F-150')} page the half-ton pickup rated in the same Ford guide.</p>
`,
  faqs: [
    { q: `Can a two-wheel-drive Expedition tow ${K.lb(maxRow.t!)}?`, a: `Not a ${y.year} model. Ford's ${y.year} guide rates the two-wheel-drive Expedition at ${K.lb(y.min)} and the 2WD MAX at ${K.lb(max4x2(y.year))}, because trailers over ${K.lb(WC.trailer)} need heavy-duty towing equipment printed only on four-wheel-drive lines. The ${y24.year} guide was different and rated a 2WD Expedition with package 536 at ${K.lb(y24.max)}.` },
    { q: 'Does the Expedition MAX tow less than the regular length?', a: `Yes, at the top. With four-wheel drive and the ${top.ax} axle, the regular Expedition is rated ${K.lb(y.max)} and the MAX ${K.lb(maxRow.t!)} in the ${y.year} guide, and the weight-distributing receiver follows the same split. In two-wheel drive it is the reverse, ${K.lb(max4x2(y.year))} for the MAX against ${K.lb(y.min)}.` },
    { q: 'What tongue weight does Ford expect behind an Expedition?', a: `${FT.conventional}% of the loaded trailer, the share Ford uses for its ratings. The receiver accepts ${K.lb(WC.tongue)} as a weight-carrying hitch and up to ${K.lb(WD.swbTongue)} with load bars on the regular length. Every pound of tongue also counts against the payload on the door label, together with passengers and cargo.` },
  ],
  related: ['model:tahoe', 'model:f-150', 'model:explorer', 'weight-distribution-hitch', 'suv-towing-capacity', 'hitch-class'],
  trailer: 7000,
});
