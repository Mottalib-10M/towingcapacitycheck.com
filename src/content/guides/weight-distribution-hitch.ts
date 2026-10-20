import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const note = (id: string, re: RegExp, year?: number) => { const n = K.Y(id, year).notes.find((x) => re.test(x)); if (!n) throw new Error(`${id}: no note ${re}`); return n; };
const grab = (s: string, re: RegExp) => { const m = s.match(re); if (!m) throw new Error(`no ${re} in ${s}`); return Number(m[1].replace(/,/g, '')); };

const F = P.f150Hitch;
const T = P.tahoeHitch;
const exp = note('expedition', /^Hitch receiver/);
const expWc = grab(exp, /weight-carrying ([\d,]+)\//), expWcT = grab(exp, /weight-carrying [\d,]+\/([\d,]+)/);
const expWd = grab(exp, /weight-distributing ([\d,]+)\//), expWdT = grab(exp, /weight-distributing [\d,]+\/([\d,]+)/);
const expBars = grab(note('expedition', /require a weight-distributing hitch/), /over ([\d,]+) lbs/);
const sd = note('f-250', /^Hitch receiver/);
const sdW = grab(sd, /([\d,]+) lbs\.\/[\d,]+ tongue/), sdT = grab(sd, /[\d,]+ lbs\.\/([\d,]+) tongue/);
const falr = grab(note('f-250', /FALR/), /recommends (\d+)%/);
const xpl = note('explorer', /^Hitch receiver/);
const xplW = grab(xpl, /hybrid ([\d,]+)\//), xplT = grab(xpl, /hybrid [\d,]+\/([\d,]+)/);
const ram24 = note('ram-1500', /Weight Distributing Hitch is recommended/, 2024);
const ramWd = grab(ram24, /over ([\d,]+) lb/);
const ex = 7500;

const rows: Array<[string, string, string, string]> = [
  ['model:f-150', `${K.lb(F.wc)} / ${K.lb(F.wcTongue)}`, `${K.lb(F.wd)} / ${K.lb(F.wdTongue)}`, 'Ford guide, p. 19'],
  ['model:tahoe', `${K.lb(T.wcTrailer)} / ${K.lb(T.wcTongue)}`, `full rating / up to ${K.lb(T.maxTongue)}, sway control required`, 'Chevrolet guide, p. 41'],
  ['model:expedition', `${K.lb(expWc)} / ${K.lb(expWcT)}`, `${K.lb(expWd)} / ${K.lb(expWdT)} (standard wheelbase)`, 'Ford guide, p. 38'],
  ['model:f-250', `${K.lb(sdW)} / ${K.lb(sdT)}`, `${K.lb(sdW)} / ${K.lb(sdT)}, ${falr}% FALR`, 'Ford guide, p. 26'],
  ['model:explorer', `${K.lb(xplW)} / ${K.lb(xplT)}`, 'no separate figure', 'Ford guide, p. 39'],
];

export default defineGuide({
  id: 'weight-distribution-hitch',
  group: 'hitching',
  order: 31,
  slug: 'weight-distribution-hitch',
  nav: 'Weight distribution',
  card: 'When the makers require spring bars, and what the bars do to the axle loads.',
  title: `Weight Distribution Hitch ${P.year}: When the Makers Require It`,
  description: `Weight distribution hitch ${P.year}: Ford caps the F-150 at ${K.lb(F.wc)} without bars, Chevrolet the Tahoe at ${K.lb(T.wcTrailer)}. Each maker's threshold, and what the bars change.`,
  h1: 'Weight distribution hitch: when you need one, and what it changes',
  intro: 'Enter the loaded trailer and its tongue weight: the calculator gives the range the makers ask for, which tells you whether you are past the bar-free tongue limits below.',
  resume: `A weight distribution hitch uses spring bars between the trailer frame and the hitch head to lever part of the tongue load forward onto the truck's front axle and back onto the trailer's axles. The makers make it mandatory above set limits. Ford allows the F-150 receiver ${K.lb(F.wc)} of trailer and ${K.lb(F.wcTongue)} of tongue as a plain weight-carrying hitch, and ${K.lb(F.wd)} and ${K.lb(F.wdTongue)} with the bars. Chevrolet allows a Tahoe ${K.lb(T.wcTrailer)} and ${K.lb(T.wcTongue)} without bars, and requires a weight-distributing hitch with sway control beyond that. Ford requires one on the Expedition for any rating over ${K.lb(expBars)}. The bars restore steering grip and braking balance by putting weight back on the front wheels. They do not create payload: the full tongue weight, plus the extra weight of the hitch itself, still counts against what the truck may carry, and the GVWR and GCWR stay the same.`,
  body: (h) => `
<h2>Limits with and without bars</h2>
<p>Each figure pair is trailer weight and tongue weight for the vehicle's standard receiver, as the maker prints it. The weight-carrying column is the ceiling for a ball mount alone; where the maker prints a higher second figure, reaching it requires load-leveling bars.</p>
${h.table(['Vehicle', 'Weight-carrying (trailer / tongue)', 'Weight-distributing (trailer / tongue)', 'Where'], rows.map(([id, wc, wd, w]) => [h.a(id, K.name(id.replace('model:', ''))), wc, wd, w]), 'Receiver limits with and without a weight-distributing hitch, latest model year.', ['l', 'r', 'r', 'l'])}
<p>Ram sets its threshold in its chart notes rather than per receiver: the ${h.doc('ram-1500', 2024, '2024 Ram 1500 chart')} recommends a weight-distributing hitch for trailers over ${K.lb(ramWd)}. The F-250 is the exception in the table: Ford gives the Super Duty receiver the same values both ways, and when bars are used it recommends restoring ${falr}% of the front axle load (${h.src('ford_2026', 'Ford guide')}).</p>
<h2>What the bars actually do</h2>
<p>Hitch a heavy tongue to a ball mount and the truck pivots around its rear axle: the rear sinks, the nose rises, and the front tires lose part of their load. Steering and braking both depend on those front tires. The spring bars, tensioned with chains or brackets, resist that pivot. Part of the load that would have pressed on the rear axle goes to the front axle, and part goes back to the trailer's own axles. The truck sits closer to level, the headlights point where they should, and the front brakes have weight to work with.</p>
<p>Ford's term for the result is front axle load restoration, FALR: the share of the weight the front axle lost when the trailer was hitched that the bars give back. ${falr}% means half of it. Measuring it takes three passes over a scale with separate axle pads: the truck alone, the truck hitched without tension on the bars, and the truck with the bars set.</p>
<h2>What the bars do not change</h2>
<p>The truck and trailer weigh exactly the same with or without bars. The payload still has to absorb the whole tongue weight plus the hitch hardware, and a weight-distributing head with bars weighs more than a plain ball mount. The GVWR, the axle ratings on the door label and the GCWR are unchanged. A rig that is over its payload on a ball mount is still over it with bars, just more level. The ${h.a('payload-capacity', 'payload page')} shows how to count it.</p>
${h.mini('payload', { t: 'Payload left with a heavy tongue', d: { pl: 1500, pp: 450, cg: 300 } })}
<h2>Sway control and setting up</h2>
<p>Chevrolet pairs the weight-distributing hitch with sway control on the Tahoe, and many bar systems include a friction or cam device to resist the trailer yawing behind the truck. Sway control complements a correct tongue weight; it does not replace it. A trailer loaded tail-heavy, below the ${P.tongue.conventional.min}% share, can still sway with any hitch, which is why the ${h.a('tongue-weight', 'tongue weight')} comes first. Set the bars with the trailer loaded as you travel, then check the front axle on a scale: a level look is not proof that the load went back where it should.</p>
<h2>A quick way to decide</h2>
<p>Take your trailer, for example a ${K.lb(ex)} travel trailer, and work out its tongue at ${P.tongue.conventional.min} to ${P.tongue.conventional.max}%: ${K.lb(ex * P.tongue.conventional.min / 100)} to ${K.lb(ex * P.tongue.conventional.max / 100)}. On an F-150 or a Tahoe that is past the weight-carrying limit both in trailer and in tongue, so bars are required. On an F-250 they are optional by the maker's figures and still useful for the front axle. The ${h.a('hitch-class', 'hitch class page')} covers the receiver classes, and the ${h.a('suv-towing-capacity', 'SUV page')} the big SUVs whose ratings depend on the bars.</p>
`,
  faqs: [
    { q: 'At what trailer weight do I need a weight distribution hitch?', a: `It depends on the vehicle. Ford limits the F-150 to ${K.lb(F.wc)} without one, Chevrolet the Tahoe to ${K.lb(T.wcTrailer)} or a ${K.lb(T.wcTongue)} tongue, and Ford requires one on the Expedition above ${K.lb(expBars)}. Ram recommended one above ${K.lb(ramWd)} in its 2024 Ram 1500 chart. Check your own owner's manual and the label on your receiver too.` },
    { q: 'Does a weight distribution hitch increase towing capacity?', a: 'It lets you use the higher of the two ratings the maker prints for the receiver, and on some vehicles that is the only way to reach the advertised figure. It does not raise the vehicle\'s trailer rating, payload, GVWR or GCWR, and the extra hardware weight comes out of the payload.' },
    { q: 'Is a weight distribution hitch the same as sway control?', a: 'No. The bars spread the tongue load across the axles; sway control resists the trailer swinging from side to side. Many hitch systems combine the two, and Chevrolet requires both on the Tahoe above the weight-carrying limit. Neither fixes a trailer loaded with too little weight on its tongue.' },
  ],
  tool: 'tongue',
  toolArg: { tw: ex },
  related: ['tongue-weight', 'hitch-class', 'suv-towing-capacity', 'payload-capacity', 'trailer-brakes'],
  sources: ['ford_2026', 'gm_2026', 'ram1500_2026'],
});
