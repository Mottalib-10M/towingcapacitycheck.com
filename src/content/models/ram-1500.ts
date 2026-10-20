import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Row } from '../../lib/data';

const ID = 'ram-1500';
const y = K.Y(ID);
const y26 = K.Y(ID, 2026);
const y25 = K.Y(ID, 2025);
const y24 = K.Y(ID, 2024);
const top = K.top(ID);
const top26 = K.top(ID, 2026);
const top24 = K.top(ID, 2024);
const low = y.rows.find((r) => r.t === y.min)!;
const eng = K.engines(ID);
const axles = K.axles(ID);
const a392 = axles.find((a) => a.axle === '3.92')!;
const a355 = axles.find((a) => a.axle === '3.55')!;
const a321 = axles.find((a) => a.axle === '3.21')!;
const pent = eng.find((e) => e.engine.startsWith('3.6L'))!;
const hemi = eng.find((e) => e.engine === '5.7L HEMI V8')!;
const sc = eng.find((e) => e.engine.startsWith('6.2L'))!;
/** The top row's truck with another axle ratio. */
const sameTruck = (ax: string) => y.rows.find((r) => r.e === top.e && r.d === top.d && r.cab === top.cab && r.tb === top.tb && r.ax === ax)!;
const t321 = sameTruck('3.21');
const room = top.gcwr! - top.t! - top.cw!;
const plRow = y.rows.find((r) => r.pl === y.maxPl)!;
const cap = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
const trim = (r: Row) => cap(r.tb!.split(' ')[0]);
const box = (r: Row) => r.tb!.match(/\d+'\d+"/)?.[0] ?? '';
const RA = K.P.ramAssumptions;
// 2024 Ram 1500 Towing Charts, note 9: "Weight Distributing Hitch is recommended for trailers over 5,000 lb."
const WD_ABOVE = 5000;
// 2024 Ram 1500 Towing Charts, note 8: "The recommended tongue weight for a conventional hitch is 10 percent of the gross trailer weight."
const RAM_TONGUE = 10;

export default defineModel({
  id: ID,
  order: 2,
  title: `Ram 1500 Towing Capacity 2026 and ${y.year}: Every Configuration`,
  description: `Ram 1500 towing capacity 2026 and ${y.year}: ${K.lb(y.min)} to ${K.lb(y.max)} in Ram's own chart, why the 3.92 axle adds so much, and what the printed base weight leaves out.`,
  h1: `Ram 1500 towing capacity, ${y.year} chart and the years before`,
  intro: `Pick your engine, drive, cab, box and axle ratio: the checker reads the matching line of Ram's ${y.year} towing chart and weighs your trailer, people and cargo against it.`,
  resume: `The ${y.year} Ram 1500 is rated to tow between ${K.lb(y.min)} and ${K.lb(y.max)}, across the ${K.num(y.rows.length)} lines of Ram's ${y.year} Trailer Towing Charts. The top figure belongs to the ${top.e} in a ${top.d} ${top.cab}, ${trim(top)} trim with the ${box(top)} box and the ${top.ax} rear axle, on a GCWR of ${K.lb(top.gcwr!)}. The axle ratio is the biggest single lever in this chart: the very same truck with the ${t321.ax} axle is rated ${K.lb(t321.t!)}, because Ram gives it a GCWR of only ${K.lb(t321.gcwr!)}. The bottom line, ${K.lb(low.t!)}, is the ${low.e} ${low.d} ${low.cab} on the ${low.ax} axle. Ram prints a base weight on each line, not a curb weight with people aboard, and its notes recommend a weight-distributing hitch above ${K.lb(WD_ABOVE)}. The ${y26.year} chart peaked at ${K.lb(y26.max)} and the ${y24.year} chart at ${K.lb(y24.max)}, so the current trucks are rated a little lower than the ones of a few years ago.`,
  body: (h) => `
<h2>Three axle ratios, three ceilings</h2>
<p>Ram sells the 1500 with three rear axle ratios in the ${y.year} chart, and the ratio decides the GCWR that Ram assigns to the truck. Every ${a392.axle} line sits between ${K.lb(a392.min)} and ${K.lb(a392.max)}. The ${a355.axle} lines run from ${K.lb(a355.min)} to ${K.lb(a355.max)}, and the ${a321.axle} lines from ${K.lb(a321.min)} to ${K.lb(a321.max)}. The gap is not a matter of trim or cab: the ${top.e} ${top.d} ${top.cab} with the ${box(top)} box loses ${K.lb(top.t! - t321.t!)} of rating when the ${top.ax} axle is swapped for the ${t321.ax}, with the same base weight of ${K.lb(top.cw!)} printed on both lines (${h.doc(ID, y.year, `${y.year} chart`)}, p. ${top.p}).</p>
<p>A numerically higher ratio turns the driveshaft more times for each turn of the wheels, which lets the engine pull a heavy combination up a grade without running out of breath. Ram reflects that in the GCWR, and the trailer rating follows from it. The window sticker or the axle code on the build sheet tells you which ratio your truck has; the ${h.a('axle-ratio-towing', 'axle ratio guide')} explains how to read it.</p>
${h.mini('axle', { t: 'Ram 1500 ratings by axle ratio', p: ['y'], d: { m: ID } })}
<h2>What the printed base weight leaves out</h2>
<p>Ford and Chevrolet print a trailer rating already reduced by a driver and a passenger. Ram works the other way round: each line shows a base weight, a GVWR, a GCWR and a payload, and the 2025 chart spells out its arithmetic in note 6, where the combined weight equals base weight plus EPA options, the trailer package, the maximum trailer and ${K.num(RA.passengers)} lb of driver and passenger (${h.doc(ID, 2025, `${y25.year} chart notes`)}). On the top ${y.year} line, GCWR minus rating minus base weight leaves ${K.lb(room)}. That small margin is all there is for the occupants, the options and the tow hardware; Ram's heavy duty charts list ${K.num(RA.passengers)} lb for passengers and ${K.num(RA.options)} lb for options in the same calculation (${h.src('ram_hd_2025', 'Ram heavy duty chart notes')}).</p>
<p>So a crew cab with four adults, a cooler and a toolbox in the bed eats into the trailer allowance pound for pound once it passes those assumptions. Put your own figures in below: the GCWR and base weight are those of the top ${y.year} line, and the tool shows the trailer still allowed by the GCWR.</p>
${h.mini('gcwr', { t: 'Ram 1500: trailer left under the GCWR', d: { gc: top.gcwr!, cw: top.cw! } })}
<h2>Payload, tongue load and the hitch</h2>
<p>The largest payload in the ${y.year} chart is ${K.lb(y.maxPl!)}, on the ${plRow.e} ${plRow.d} ${plRow.cab}; most crew cabs print a few hundred pounds less. The 2024 chart notes say that payload and trailer weight rating are mutually exclusive, which means you cannot fill the bed to the payload figure and hitch the maximum trailer at the same time. With Ram's recommended tongue load of ${RAM_TONGUE}% for a conventional hitch, a trailer at the ${K.lb(top.t!)} rating presses ${K.lb((top.t! * RAM_TONGUE) / 100)} on the ball, and that counts against payload. Ram recommends a weight-distributing hitch for trailers over ${K.lb(WD_ABOVE)} (${h.doc(ID, 2024, `${y24.year} chart`)}, notes 6, 8 and 9); the ${h.a('weight-distribution-hitch', 'weight distribution page')} covers the setup, and the ${h.a('payload-capacity', 'payload guide')} the door label.</p>
<h2>Why the newer charts print less</h2>
<p>The ${y24.year} chart reached ${K.lb(y24.max)} with the ${top24.e} on a GCWR of ${K.lb(top24.gcwr!)}. From ${y25.year} the top line belongs to the ${top.e} and stays near ${K.lb(y25.max)}: ${K.lb(y26.max)} in ${y26.year}, ${K.lb(y.max)} in ${y.year}. Between the last two charts the top truck's base weight went from ${K.lb(top26.cw!)} to ${K.lb(top.cw!)}, the GCWR stayed at ${K.lb(top.gcwr!)}, and the rating fell by ${K.lb(top26.t! - top.t!)}. Ram does not explain the change in its notes, so read the chart of your own model year rather than a figure quoted for another one. The ${sc.engine} lines stop at ${K.lb(sc.max)}, and the ${hemi.engine} reaches ${K.lb(hemi.max)}. For a side by side with the other half-tons, see the ${h.a('model:f-150', 'F-150')} and ${h.a('model:silverado-1500', 'Silverado 1500')} pages, or the ${h.a('method', 'method')} behind these tables.</p>
`,
  faqs: [
    { q: 'Which axle ratio should a Ram 1500 have for towing?', a: `The ${a392.axle}. In the ${y.year} chart every ${a392.axle} line is rated between ${K.lb(a392.min)} and ${K.lb(a392.max)}, while the ${a321.axle} lines never pass ${K.lb(a321.max)}. On the ${top.e} the switch alone is worth ${K.lb(top.t! - t321.t!)}, since Ram raises the GCWR with the shorter gearing. Check the axle code on the build sheet before trusting any figure.` },
    { q: 'Why is the 2027 Ram 1500 rated below the 2024 truck?', a: `The ${y24.year} chart topped out at ${K.lb(y24.max)} with the ${top24.e} and a GCWR of ${K.lb(top24.gcwr!)}. The ${y.year} chart stops at ${K.lb(y.max)} with the ${top.e} and a GCWR of ${K.lb(top.gcwr!)}. Ram gives no reason in its notes; the lower combined rating and a slightly heavier base weight account for the gap line by line.` },
    { q: 'Does the base weight in the Ram chart include passengers?', a: `No. The base weight is the truck alone. Ram adds the occupants when it computes the rating: ${K.num(RA.passengers)} lb of driver and passenger, plus options and the trailer package, according to its chart notes. Anyone or anything beyond that, such as rear passengers or a bed load, has to come out of the trailer allowance or the payload.` },
    { q: 'How much can a Ram 1500 with the 3.6L V6 eTorque pull?', a: `Between ${K.lb(pent.min)} and ${K.lb(pent.max)} in the ${y.year} chart, across ${K.num(pent.n)} lines. The highest figure needs the ${a355.axle} axle; with the ${a321.axle} axle the V6 stays in the lower part of that range. For campers near the top of the range, the ${top.e} lines offer far more headroom.` },
  ],
  related: ['model:f-150', 'model:silverado-1500', 'model:ram-2500', 'axle-ratio-towing', 'gvwr-vs-gcwr', 'payload-capacity'],
  trailer: 8000,
});
