import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ID = 'ram-2500';
const y = K.Y(ID);
const y26 = K.Y(ID, 2026);
const y25 = K.Y(ID, 2025);
const top = K.top(ID);
const low = y.rows.find((r) => r.t === y.min)!;
const eng = K.engines(ID);
const cum = eng.find((e) => e.engine.includes('Cummins'))!;
const hemi = eng.find((e) => e.engine.includes('HEMI'))!;
const cumAx = [...new Set(y.rows.filter((r) => r.e === cum.engine).map((r) => r.ax))];
const hemiAx = [...new Set(y.rows.filter((r) => r.e === hemi.engine).map((r) => r.ax))].sort();
const plRow = y.rows.find((r) => r.pl === y.maxPl)!;
/** One truck printed three times, once per GVWR. */
const trio = y.rows.filter((r) => r.e === cum.engine && r.d === '4x4' && r.cab === 'Crew Cab' && r.tb === `TRADESMAN 8'0" BOX`).sort((a, b) => b.gvwr! - a.gvwr!);
const [g1, g2, g3] = trio;
const megaCw = Math.max(...y.rows.filter((r) => r.e === cum.engine).map((r) => r.cw!));
const cap = (x: string) => x.charAt(0) + x.slice(1).toLowerCase();
const trimOf = (tb: string) => `${cap(tb.split(/[ /]/)[0])}${tb.includes('RAMBOX') ? ' with RamBox' : ''}`;
/** 2026: the same Cummins crew cab across trims, one GVWR. */
const ex26 = y26.rows.filter((r) => r.e === cum.engine && r.d === '4x4' && r.cab === 'Crew Cab' && r.ax === '3.42' && r.tb?.includes(`6'4"`) && r.gvwr === g1.gvwr).sort((a, b) => b.t! - a.t!);
const e26hi = ex26[0], e26lo = ex26[ex26.length - 1];
const RA = K.P.ramAssumptions;
const HW = K.P.hitchWeight;
const RH = K.P.ramHdHitch;
// 2025 Ram Heavy Duty Towing Charts, note 13: tongue weight 10 percent of the gross trailer weight for a conventional hitch, 15 percent for a 5th wheel.
const RAM_TONGUE = { conventional: 10, fifthWheel: 15 };
const tongueTop = (top.t! * RAM_TONGUE.conventional) / 100;

export default defineModel({
  id: ID,
  order: 5,
  title: `Ram 2500 Towing Capacity 2026 and ${y.year}: Payload and GVWR`,
  description: `Ram 2500 towing capacity 2026 and ${y.year}: ${K.lb(y.min)} to ${K.lb(y.max)} by engine, cab and box, with payloads up to ${K.lb(y.maxPl!)} and why one truck gets three ratings.`,
  h1: `Ram 2500 Heavy Duty towing capacity, ${y.year} chart and earlier`,
  intro: `Choose your Ram 2500 by engine, drive, cab, box, axle and GVWR: the checker reads that line of Ram's ${y.year} heavy duty chart and tests your trailer and payload against it.`,
  resume: `Ram's ${y.year} heavy duty towing chart rates the Ram 2500 between ${K.lb(y.min)} and ${K.lb(y.max)} with a conventional hitch, over ${K.num(y.rows.length)} lines. The ${K.lb(y.max)} maximum belongs to the ${cum.engine} in a ${top.d} ${top.cab} with the 8-foot box and the ${top.ax} axle, a light Tradesman with a base weight of ${K.lb(top.cw!)} and a GCWR of ${K.lb(top.gcwr!)}. The ${hemi.engine} gas engine spans ${K.lb(hemi.min)} to ${K.lb(hemi.max)}, and the lowest line is the Power Wagon at ${K.lb(low.t!)}. Ram prints payload on every line, up to ${K.lb(y.maxPl!)}, and the GVWR you order changes both payload and, on some trucks, the trailer rating. Ram's notes treat payload and trailer rating as mutually exclusive figures, count ${K.num(RA.passengers)} lb of passengers and ${K.num(RA.options)} lb of options, and add ${K.num(HW.conventional)} lb for a conventional hitch.`,
  body: (h) => `
<h2>One truck, three GVWRs, three answers</h2>
<p>The 2500 chart repeats many configurations once per gross vehicle weight rating. Take the ${cum.engine} ${g1.d} ${g1.cab} with the 8-foot box: at a GVWR of ${K.lb(g1.gvwr!)} it is printed with a payload of ${K.lb(g1.pl!)} and a trailer rating of ${K.lb(g1.t!)}; at ${K.lb(g2.gvwr!)}, ${K.lb(g2.pl!)} and ${K.lb(g2.t!)}; at ${K.lb(g3.gvwr!)}, ${K.lb(g3.pl!)} and ${K.lb(g3.t!)} (${h.doc(ID, y.year, `${y.year} chart`)}, p. ${g1.p}). The base weight barely moves between the three. What changes is the weight the truck is certified to carry, and on the lowest step the GCWR that Ram assigns as well.</p>
<p>So the GVWR on your door label is the first thing to read, before the engine or the trim. The ${h.a('gvwr-vs-gcwr', 'GVWR and GCWR guide')} explains what each label figure caps; two trucks that look identical in the yard can carry different limits.</p>
<h2>Payload is the real advantage of a three-quarter ton</h2>
<p>A half-ton runs out of payload long before it runs out of trailer rating. A 2500 does not: the ${plRow.e} ${plRow.d} ${plRow.cab} with the payload upgrade prints ${K.lb(plRow.pl!)} of payload and still a ${K.lb(plRow.t!)} trailer rating. Ram's notes say that payload and trailer rating are mutually exclusive, which means the two figures are each computed on their own, and that GAWR, GVWR and GCWR must never be exceeded (${h.doc(ID, y25.year, `${y25.year} heavy duty chart`)}, notes 7 and 8). At Ram's ${RAM_TONGUE.conventional}% tongue share, the top ${K.lb(top.t!)} trailer puts ${K.lb(tongueTop)} on the hitch, plus ${K.num(HW.conventional)} lb of hitch hardware that Ram counts separately. On the ${K.lb(top.t!)} truck, with ${K.lb(top.pl!)} of payload, that leaves room for people and tools. The tool below starts with that payload.</p>
${h.mini('payload', { t: 'Ram 2500: payload left for the trailer tongue', d: { pl: top.pl!, hz: HW.conventional } })}
<h2>Cummins or HEMI, and the axle that comes with each</h2>
<p>In the ${y.year} chart the ${cum.engine} is printed only with the ${cumAx.join(' and ')} axle and rates between ${K.lb(cum.min)} and ${K.lb(cum.max)}. The ${hemi.engine} comes with the ${hemiAx.join(' or ')} axle and rates between ${K.lb(hemi.min)} and ${K.lb(hemi.max)}; on the gas engine the numerically higher axle matters, because the GCWR rises with it. The Mega Cab Laramie carries the heaviest diesel base weight, ${K.lb(megaCw)}, and holds the bottom of the Cummins range; the Power Wagon, on the ${low.ax} axle with a GCWR of ${K.lb(low.gcwr!)}, holds the lowest line of all. The ${y26.year} chart was far longer, ${K.num(y26.rows.length)} lines against ${K.num(y.rows.length)}, because it listed each trim one by one. On the Cummins 4x4 Crew Cab with the 6'4" box and a GVWR of ${K.lb(g1.gvwr!)}, its ratings ran from ${K.lb(e26hi.t!)} for the ${trimOf(e26hi.tb!)} to ${K.lb(e26lo.t!)} for the ${trimOf(e26lo.tb!)}, all on a GCWR of ${K.lb(e26hi.gcwr!)}: every pound of trim came off the trailer.</p>
${h.mini('cap', { t: 'Ram 2500 maximum by model year', p: ['y'], d: { m: ID } })}
<h2>Fifth wheel and gooseneck thresholds</h2>
<p>The heavy duty chart notes require a fifth-wheel hitch for trailers over ${K.lb(RH.fifthWheelAbove)} and a gooseneck over ${K.lb(RH.gooseneckAbove)} (${h.src('ram_hd_2025', 'Ram heavy duty notes 16 and 17')}). Those thresholds serve the whole heavy duty family, the 3500 included, and both sit above every Ram 2500 conventional rating. Ram counts ${K.num(HW.fifthWheel)} lb for a fifth-wheel hitch and ${K.num(HW.gooseneck)} lb for a gooseneck, with ${RAM_TONGUE.fifthWheel}% of the trailer on the pin. Our data do not include fifth-wheel ratings for the 2500, so the checker covers conventional towing only. Compare with the ${h.a('model:f-250', 'F-250')}, which prints all three hitch types, and read the ${h.a('fifth-wheel-vs-gooseneck', 'fifth wheel versus gooseneck guide')} before choosing a bed hitch.</p>
`,
  faqs: [
    { q: `Why is my Ram 2500 rated well below ${K.lb(y.max)}?`, a: `That figure is the best line of the chart, ${K.lb(y.max)} on a light ${top.d} ${top.cab} with the Cummins. A crew cab, four-wheel drive, a heavier trim or a lower GVWR each pull the figure down; the chart goes as low as ${K.lb(y.min)}. Ram also notes that its maximum represents a properly equipped base trim configuration.` },
    { q: 'Does the GVWR package change what a Ram 2500 can tow?', a: `Sometimes. On the ${cum.engine} ${g1.d} ${g1.cab} with the 8-foot box, the ${y.year} chart prints ${K.lb(g1.t!)} at ${K.lb(g1.gvwr!)} or ${K.lb(g2.gvwr!)} of GVWR, but ${K.lb(g3.t!)} at ${K.lb(g3.gvwr!)}. Payload changes on every GVWR step: ${K.lb(g1.pl! - g3.pl!)} separates the highest and lowest versions of that truck.` },
    { q: 'How much tongue weight can a Ram 2500 carry?', a: `Ram computes conventional towing with ${RAM_TONGUE.conventional}% of the trailer on the tongue, so ${K.lb(tongueTop)} for a ${K.lb(top.t!)} trailer. That load, plus ${K.num(HW.conventional)} lb of hitch hardware, people and cargo, must fit within the payload printed for your line and within the rear GAWR on the door label.` },
    { q: 'Is the Ram 2500 HEMI enough for a heavy travel trailer?', a: `The ${hemi.engine} is rated ${K.lb(hemi.min)} to ${K.lb(hemi.max)} in the ${y.year} chart. The best figures need the ${hemiAx[hemiAx.length - 1]} axle, which carries a GCWR of ${K.lb(Math.max(...y.rows.filter((r) => r.e === hemi.engine).map((r) => r.gcwr!)))}. Its payload ratings are the highest of the chart, which helps with the tongue of a long trailer. Check the GCWR of your own line, since it is lower than on most diesel lines.` },
  ],
  related: ['model:f-250', 'model:ram-1500', 'fifth-wheel-vs-gooseneck', 'payload-capacity', 'half-ton-vs-three-quarter-ton', 'hitch-class'],
  trailer: 14000,
});
