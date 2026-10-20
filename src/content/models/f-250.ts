import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ID = 'f-250';
const y = K.Y(ID);
const top = K.top(ID);
const eng = K.engines(ID);
const ho = eng.find((e) => e.engine.includes('H.O.'))!;
const dsl = eng.find((e) => e.engine === '6.7L V8 Turbo Diesel')!;
const g73 = eng.find((e) => e.engine.startsWith('7.3L'))!;
const g68 = eng.find((e) => e.engine.startsWith('6.8L'))!;
const pack = y.rows.filter((r) => r.pk?.includes('(535)'));
const noPack = y.rows.filter((r) => !r.pk);
const noPackMax = Math.max(...noPack.map((r) => r.t!));
const gnTop = y.rows.find((r) => r.gn === y.maxGn)!;
const fwOver = y.rows.filter((r) => (r.fw ?? 0) > r.t!).length;
const alt9900 = y.rows.filter((r) => r.n?.includes('9,900')).length;
const tremor = y.rows.filter((r) => r.n?.includes('Tremor'));
const FT = K.P.fordTongue;
// 2026 Ford RV & Trailer Towing Guide (notes of the F-250 table): "Conventional towing greater than 18,200 lbs. requires F-250 High-Capacity Axle Upgrade Package (535)".
const HC_ABOVE = 18200;
// Same guide, p. 26: F-250 hitch receiver, weight-carrying and weight-distributing, 22,000 lbs. / 2,200 lbs. tongue.
const RECEIVER = { trailer: 22000, tongue: 2200 };
// Same guide, notes: "F-250/F-350 Tremor hitch receiver limited to 18,200 lbs./1,820 tongue".
const TREMOR = { trailer: 18200, tongue: 1820 };
// Same guide, notes: with load bars Ford recommends 50% front axle load restoration (FALR).
const FALR = 50;
// Same guide, F-250 table p. 20 (row notes): some lines print a second value for trucks with a "Fixed 9,900 GVWR".
const FIXED_GVWR = 9900;
const stdGcwr = pack.find((r) => r.e === dsl.engine)!.gcwr!;

export default defineModel({
  id: ID,
  order: 4,
  title: `F-250 Towing Capacity ${y.year} with Fifth Wheel and Gooseneck`,
  description: `F-250 towing capacity ${y.year}: ${K.lb(y.min)} to ${K.lb(y.max)} on a ball hitch, up to ${K.lb(y.maxFw!)} fifth wheel and ${K.lb(y.maxGn!)} gooseneck, and when the 535 package is required.`,
  h1: `Ford F-250 Super Duty towing capacity, ${y.year} and earlier`,
  intro: `Find your F-250 by engine, cab, box and axle: the checker reads the conventional rating of that line in Ford's ${y.year} towing guide and tests your trailer and load against it.`,
  resume: `Ford's ${y.year} RV and Trailer Towing Guide rates the F-250 Super Duty between ${K.lb(y.min)} and ${K.lb(y.max)} with a conventional ball hitch, over ${K.num(y.rows.length)} configurations. Bed-mounted hitches go further on some trucks: up to ${K.lb(y.maxFw!)} with a fifth wheel and ${K.lb(y.maxGn!)} with a gooseneck, both on a ${gnTop.d} ${gnTop.cab} with the ${gnTop.e}. The ${K.lb(y.max)} conventional maximum needs a diesel and the High-Capacity Axle Upgrade Package (535), because Ford requires that package for any conventional trailer over ${K.lb(HC_ABOVE)}. The 7.3L gas V8 stops at ${K.lb(g73.max)} and the 6.8L at ${K.lb(g68.max)}. Ford counts a ${K.num(K.P.gmIncluded.driver)} lb driver and passenger in each rating, and its receiver is rated ${K.lb(RECEIVER.trailer)} with ${K.lb(RECEIVER.tongue)} of tongue, the same with or without load bars. The Tremor's receiver is limited to ${K.lb(TREMOR.trailer)}.`,
  body: (h) => `
<h2>Ball hitch, fifth wheel or gooseneck</h2>
<p>The F-250 table prints three numbers for most configurations: a conventional rating, a fifth-wheel rating and a gooseneck rating (${h.doc(ID, y.year, `${y.year} guide`)}, pp. ${y.src.pages}). They are not always in the order people expect. On ${K.num(fwOver)} of the ${K.num(y.rows.length)} lines the fifth-wheel figure is higher than the conventional one, and the gap is widest on the lighter trucks. The ${gnTop.d} ${gnTop.cab} with the ${gnTop.e} and the 535 package is rated ${K.lb(gnTop.t!)} on the ball, ${K.lb(gnTop.fw!)} on a fifth wheel and ${K.lb(gnTop.gn!)} on a gooseneck. A crew cab with a long box can show the reverse, with the conventional rating on top.</p>
<p>The reason is weight placement. A pin above the rear axle loads the truck's own frame and axle, while a ball behind the bumper levers weight off the front axle. Ford computes a fifth-wheel or gooseneck tow with ${FT.kingPin}% of the trailer on the pin, against ${FT.conventional}% on a conventional tongue, and with a larger frontal area for the taller trailer. The ${h.a('fifth-wheel-vs-gooseneck', 'fifth wheel versus gooseneck guide')} compares the two hitches.</p>
${h.mini('tongue', { t: 'F-250: tongue and pin load for your trailer', d: { tw: HC_ABOVE } })}
<h2>The 535 package and the ${K.lb(HC_ABOVE)} line</h2>
<p>${K.num(pack.length)} lines of the ${y.year} table carry the F-250 High-Capacity Axle Upgrade Package (535), all of them diesels on the 3.31 or 3.55 axle. Without it, no F-250 is rated above ${K.lb(noPackMax)} conventional, whatever the engine. Ford's note ties the package to specific tires as well, the 18-inch all-season or 20-inch all-terrain. With the package, the ${ho.engine} and the ${dsl.engine} both reach ${K.lb(y.max)}; the high-output diesel is printed with a GCWR of ${K.lb(top.gcwr!)}, ${K.lb(top.gcwr! - stdGcwr)} more than the standard diesel, which leaves more room for passengers and cargo with the same trailer.</p>
<p>The ${K.lb(y.max)} ceiling is also the limit of the receiver: Ford rates it ${K.lb(RECEIVER.trailer)} and ${K.lb(RECEIVER.tongue)} of tongue load whether you use a weight-carrying or a weight-distributing setup, and it prints the same trailer values for both. With load bars, it asks for ${FALR}% front axle load restoration. On a Tremor, the receiver drops to ${K.lb(TREMOR.trailer)} and ${K.lb(TREMOR.tongue)}; the ${K.num(tremor.length)} Tremor lines of the table are rated ${K.lb(Math.max(...tremor.map((r) => r.t!)))} conventional.</p>
<h2>Gas engines and axle ratios</h2>
<p>The two gas V8s run on numerically higher axles, 3.73 or 4.30, and never get the 535 package. The ${g73.engine} spans ${K.lb(g73.min)} to ${K.lb(g73.max)} and the ${g68.engine} ${K.lb(g68.min)} to ${K.lb(g68.max)}. Their fifth-wheel figures stay close to the conventional ones. Diesels use the 3.31 or 3.55 axle, and on every 535 package line both ratios carry the same rating, so the axle is not the lever it is on a half-ton.</p>
${h.mini('axle', { t: 'F-250 ratings by axle ratio', p: ['y'], d: { m: ID } })}
<h2>Lines printed with two values</h2>
<p>${K.num(alt9900)} lines of the ${y.year} table print a separate figure, marked by a footnote, for trucks with a fixed ${K.lb(FIXED_GVWR)} GVWR, and a few add a third one for a heavier GVWR package. The checker keeps the first value printed on each line. If your door label shows ${K.lb(FIXED_GVWR)}, look up your line in the guide and use the value carrying that footnote, which is usually the lower one. For the step up from a half-ton, see the ${h.a('half-ton-vs-three-quarter-ton', 'half-ton versus three-quarter-ton guide')}, the ${h.a('model:ram-2500', 'Ram 2500')} page for its closest rival, and the ${h.a('hitch-class', 'hitch class guide')} for receivers.</p>
`,
  faqs: [
    { q: 'Does the F-250 tow more with a gooseneck than with a ball hitch?', a: `On many lines, yes. In the ${y.year} guide the highest gooseneck rating is ${K.lb(y.maxGn!)} against ${K.lb(y.max)} conventional, and ${K.num(fwOver)} lines rate the fifth wheel above the ball hitch. The difference is largest on regular cabs. On crew cabs with a long box the conventional rating can be the higher one, so check your own line.` },
    { q: 'When does an F-250 need the High-Capacity Axle Upgrade Package?', a: `For any conventional trailer above ${K.lb(HC_ABOVE)}, according to Ford's ${y.year} guide. The package, coded 535, appears only on diesel lines with the 3.31 or 3.55 axle and specific tires, and it brings the rating up to ${K.lb(y.max)}. Without it, ${K.lb(noPackMax)} is the most any F-250 may pull on a ball hitch.` },
    { q: 'How much can the 7.3L gas F-250 tow?', a: `Between ${K.lb(g73.min)} and ${K.lb(g73.max)} conventional in the ${y.year} guide, depending on the cab, box, drive and the 3.73 or 4.30 axle. It cannot reach the diesel figures, since the 535 package appears on no gas line of the table. The 6.8L gas V8 is lower again, at ${K.lb(g68.min)} to ${K.lb(g68.max)}.` },
  ],
  related: ['model:ram-2500', 'model:f-150', 'fifth-wheel-vs-gooseneck', 'half-ton-vs-three-quarter-ton', 'hitch-class', 'tongue-weight'],
  trailer: 15000,
});
