import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ID = 'f-150';
const y = K.Y(ID);
const prev = K.Y(ID, 2023);
const eng = K.engines(ID);
const top = K.top(ID);
const v8 = eng.find((e) => e.engine.startsWith('5.0L'))!;
const ecob = eng.find((e) => e.engine.startsWith('3.5L GTDI V6') && !e.engine.includes('H.O.'))!;
const small = eng.find((e) => e.engine.startsWith('2.7L'))!;
const hyb = eng.find((e) => e.engine.includes('Hybrid'))!;
const elec = eng.find((e) => e.engine.includes('Lightning'))!;
const H = K.P.f150Hitch;
const packRows = y.rows.filter((r) => r.pk?.includes('53T')).length;

export default defineModel({
  id: ID,
  order: 1,
  title: `F-150 Towing Capacity ${y.year}: Every Engine, Cab and Axle`,
  description: `F-150 towing capacity ${y.year}: all ${K.num(y.rows.length)} rows of Ford's towing guide by engine, cab and axle, ${K.lb(y.min)} to ${K.lb(y.max)}, with a check of your trailer and payload.`,
  h1: `Ford F-150 towing capacity, ${y.year} and earlier years`,
  intro: `Choose your engine, cab, wheelbase and axle ratio below: the checker reads the matching row of Ford's ${y.year} towing guide and tests your trailer against it.`,
  resume: `The ${y.year} Ford F-150 tows from ${K.lb(y.min)} to ${K.lb(y.max)} depending on the configuration, and Ford's ${y.year} RV and Trailer Towing Guide prints ${K.num(y.rows.length)} distinct rows for it. The top figure belongs to one truck only: the ${top.e} with ${top.d}, a ${top.cab} cab, the ${top.ax} axle and the ${top.pk}, rated with a GCWR of ${K.lb(top.gcwr!)}. The ${v8.engine} reaches ${K.lb(v8.max)}, the ${small.engine} stops at ${K.lb(small.max)}, and the Lightning at ${K.lb(elec.max)}. Ford computes every row with a ${K.num(K.P.gmIncluded.driver)} lb driver and passenger and no cargo, so a full cab and a loaded bed lower the trailer you may pull. Without a weight-distributing hitch the limit is ${K.lb(H.wc)}, whatever the row says. The ${prev.year} guide topped out at ${K.lb(prev.max)}, the only year the figure was higher.`,
  body: (h) => `
<h2>Which F-150 tows the most</h2>
<p>The ${K.num(packRows)} heaviest rows of the ${y.year} table share one condition: the Tow/Haul Package (53T) together with the optional Max Tow Axle. Ford's notes say so in plain words: any trailer above ${K.lb(H.maxNoPack)} needs both, and the reinforced receiver that comes with the Max Tow Axle is the part rated for the heavier loads (${h.doc(ID, y.year, `${y.year} guide`)}, p. 19). A truck without that package, even with the same engine and cab, sits in the lower half of the table.</p>
<p>The engine still sets the ceiling. The ${ecob.engine} spans ${K.lb(ecob.min)} to ${K.lb(ecob.max)}, the ${v8.engine} ${K.lb(v8.min)} to ${K.lb(v8.max)}, the ${hyb.engine} ${K.lb(hyb.min)} to ${K.lb(hyb.max)}. The axle ratio comes next: on the same cab, a 3.55 or 3.73 ratio rates higher than a 3.15 or 3.31, because shorter gearing lets the engine hold a heavy combination on a grade.</p>
${h.mini('axle', { t: 'F-150 ratings by axle ratio', p: ['y'], d: { m: ID } })}
<h2>Hitch limits that override the table</h2>
<p>The row of the table is one limit among several. Ford caps a weight-carrying hitch, the ball mount alone, at ${K.lb(H.wc)} and ${K.lb(H.wcTongue)} of tongue load; above that a weight-distributing hitch is required, rated up to ${K.lb(H.wd)} and ${K.lb(H.wdTongue)} of tongue. The receiver on your truck carries its own label, and the lower of the two numbers wins. The ${h.a('weight-distribution-hitch', 'weight distribution page')} explains how the bars move load back to the front axle.</p>
<h2>Payload is often the real limit</h2>
<p>A conventional trailer puts ${K.P.tongue.conventional.min} to ${K.P.tongue.conventional.max}% of its weight on the hitch, and that weight counts against the payload printed on the door pillar. The highest payload in Ford's ${y.year} performance table is ${K.lb(y.maxPl!)}, on a light configuration; a crew cab with a large trim level often carries a few hundred pounds less. Four adults and a loaded bed can use most of it before the trailer is hitched. Enter your own door label below to see the heaviest trailer the payload still allows.</p>
${h.mini('payload', { t: 'Payload left for the trailer tongue', d: { pl: 1800, pp: 600, cg: 200 } })}
<h2>One figure Ford prints twice</h2>
<p>The ${y.year} guide gives two maximums for the PowerBoost hybrid: ${K.lb(H.hybridSummary)} in the performance summary on p. 12 and ${K.lb(hyb.max)} in the configuration table on p. 17. The checker uses the configuration table, since it names the cab, wheelbase and axle. If your truck is a hybrid near the top of the range, read the trailer rating on your own documents before you buy a trailer that depends on the difference.</p>
`,
  faqs: [
    { q: 'What is the maximum towing capacity of the F-150?', a: `For ${y.year}, ${K.lb(y.max)}, reached only by the ${top.e} with a ${top.cab} cab, ${top.d}, the ${top.ax} axle and the Tow/Haul Package with the Max Tow Axle. Without that package the ${ecob.engine} tops out at ${K.lb(Math.max(...y.rows.filter((r) => !r.pk && r.e === ecob.engine).map((r) => r.t ?? 0)))}, and the ${small.engine} never passes ${K.lb(small.max)}, whatever the cab or axle.` },
    { q: 'How much can a 5.0L V8 F-150 tow?', a: `Between ${K.lb(v8.min)} and ${K.lb(v8.max)} in the ${y.year} guide, depending on the cab, wheelbase, drive and axle ratio. The highest V8 rows need the 3.73 axle and the Tow/Haul Package with the Max Tow Axle; a V8 on a 3.15 or 3.31 axle stays near the bottom of that range.` },
    { q: 'Do I need a weight-distributing hitch with an F-150?', a: `Above ${K.lb(H.wc)} of trailer or ${K.lb(H.wcTongue)} of tongue weight, yes: Ford limits the weight-carrying hitch to those figures. With a weight-distributing hitch the receiver is rated up to ${K.lb(H.wd)} of trailer and ${K.lb(H.wdTongue)} of tongue, within your configuration's own rating.` },
    { q: 'How much does the Lightning tow?', a: `Ford rates the ${y.year} F-150 Lightning between ${K.lb(elec.min)} and ${K.lb(elec.max)}, the top figure with the Max Trailer Tow Package. Expect the driving range to fall sharply with a trailer, since the frontal area and the weight both add to the energy needed; plan charging stops that let you unhitch if needed.` },
  ],
  related: ['model:ram-1500', 'model:silverado-1500', 'model:f-250', 'weight-distribution-hitch', 'payload-capacity', 'axle-ratio-towing'],
  trailer: 8000,
});
