import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const note = (id: string, re: RegExp) => { const n = K.Y(id).notes.find((x) => re.test(x)); if (!n) throw new Error(`${id}: no note ${re}`); return n; };
const grab = (s: string, re: RegExp) => { const m = s.match(re); if (!m) throw new Error(`no ${re} in ${s}`); return Number(m[1].replace(/,/g, '')); };
const most = (id: string, k: 'gcwr' | 'gvwr') => Math.max(...K.Y(id).rows.map((r) => r[k] ?? 0));
const least = (id: string, k: 'gvwr') => Math.min(...K.Y(id).rows.map((r) => r[k] ?? Infinity));
const pct = K.P.fordTongue.conventional;
const T = K.P.tongue;

const ids = ['f-150', 'f-250', 'ram-1500', 'ram-2500'];
const r15 = K.top('ram-1500'), r25 = K.top('ram-2500');
const left15 = (r15.pl ?? 0) - (r15.t ?? 0) * pct / 100;
const left25 = (r25.pl ?? 0) - (r25.t ?? 0) * pct / 100;
const f250 = K.Y('f-250');
const f250Recv = note('f-250', /^Hitch receiver/);
const f250RecvT = grab(f250Recv, /[\d,]+ lbs\.\/([\d,]+) tongue/);
const f250RecvW = grab(f250Recv, /([\d,]+) lbs\.\/[\d,]+ tongue/);
const gapFord = K.max('f-250') - K.max('f-150');
const gapRam = K.max('ram-2500') - K.max('ram-1500');

export default defineGuide({
  id: 'half-ton-vs-three-quarter-ton',
  group: 'compare',
  order: 5,
  slug: 'half-ton-vs-three-quarter-ton',
  nav: 'Half-ton vs 3/4-ton',
  card: 'F-150 against F-250, Ram 1500 against 2500: ratings, payload and bed hitches.',
  title: `Half-Ton vs Three-Quarter-Ton ${K.P.year}: Towing and Payload`,
  description: `Half-ton vs three-quarter-ton, ${K.P.year}: the F-250 and Ram 2500 tow up to ${K.lb(gapFord)} and ${K.lb(gapRam)} more than the F-150 and Ram 1500, and carry far more payload.`,
  h1: 'Half-ton or three-quarter-ton: what the extra weight class buys',
  intro: 'Enter the payload on the door label, the people and the cargo: the calculator shows what is left for a tongue or a pin, and the heaviest trailer that leaves you.',
  resume: `A three-quarter-ton pickup is rated for much heavier trailers than its half-ton sibling: ${K.lb(K.max('f-250'))} against ${K.lb(K.max('f-150'))} for the Ford F-250 and F-150, ${K.lb(K.max('ram-2500'))} against ${K.lb(K.max('ram-1500'))} for the Ram 2500 and 1500, conventional hitch in both cases. The difference that matters most in practice is payload. Ram prints a payload for every build: the best 2500 reaches ${K.lb(K.Y('ram-2500').maxPl ?? 0)}, the best 1500 ${K.lb(K.Y('ram-1500').maxPl ?? 0)}. A heavy travel trailer puts ${pct}% or more of its weight on the hitch, and a fifth wheel ${T.fifthWheel.min} to ${T.fifthWheel.max}%, all of it payload. On the Ram 1500 build that reaches the top rating, a tongue at ${pct}% of that trailer leaves ${K.lb(left15)} for people and hitch; on the top Ram 2500 build, ${K.lb(left25)}. The half-ton is the easier daily truck; the three-quarter-ton is the one that keeps a margin once the trailer gets heavy.`,
  body: (h) => `
<h2>Side by side</h2>
<p>The table sets each half-ton against the heavier truck of the same maker for the latest model year read. "Highest GCWR" is the largest combined weight rating printed in that year's table. Payload and GVWR appear only where the maker prints them per configuration: Ram does, Ford gives the F-150 a single performance figure and no per-row payload for the F-250. Chevrolet's heavy duty Silverado is not covered yet, so it is left out, and Toyota sells no three-quarter-ton pickup: the ${h.a('model:tundra', 'Tundra')} is compared with the other half-tons on the ${h.a('truck-towing-capacity', 'pickup comparison page')}.</p>
${h.table(['Truck', 'Year', 'Best conventional', 'Highest GCWR', 'Highest payload printed', 'GVWR range printed'], ids.map((id) => { const y = K.Y(id); const gv = most(id, 'gvwr'); return [h.a(`model:${id}`, K.name(id)), String(y.year), K.lb(y.max), K.lb(most(id, 'gcwr')), y.maxPl ? K.lb(y.maxPl) : 'not printed per row', gv ? `${K.lb(least(id, 'gvwr'))} to ${K.lb(gv)}` : 'not printed']; }), 'Half-ton and three-quarter-ton pickups of the same maker, latest model year.', ['l', 'r', 'r', 'r', 'r', 'r'])}
<h2>The trailer rating gap</h2>
<p>Ford's step from F-150 to F-250 adds ${K.lb(gapFord)} at the top of the conventional scale, and Ram's step from 1500 to 2500 adds ${K.lb(gapRam)}. The GCWR column explains most of it. The GCWR is the maker's limit for the whole rig, truck and trailer together, and the heavy duty truck is given a far larger one. The trailer rating is roughly what is left of the GCWR once the truck's own weight and the assumed occupants are taken out.</p>
<p>Both scales overlap less than the badges suggest. The weakest F-250 row is ${K.lb(K.min('f-250'))}, which is above the best F-150 row, and the weakest Ram 2500 row, ${K.lb(K.min('ram-2500'))}, sits near the top of the Ram 1500 range. Above ${K.lb(K.max('f-150'))}, there is no half-ton option at all among the trucks covered.</p>
<h2>Payload, where the classes really part</h2>
<p>Ram's chart notes say the payload and the trailer rating are mutually exclusive: the build with the most payload is not the one with the highest trailer rating (${h.src('ram_hd_2025', 'Ram notes')}). So compare them on the same row. The Ram 1500 build that reaches ${K.lb(r15.t ?? 0)} prints a payload of ${K.lb(r15.pl ?? 0)}; a tongue at ${pct}% of that trailer, ${K.lb((r15.t ?? 0) * pct / 100)}, leaves ${K.lb(left15)}. Ram's heavy duty notes say its ratings already count ${K.num(K.P.ramAssumptions.passengers)} lb of passengers and ${K.num(K.P.ramAssumptions.options)} lb of options in its rating, but the payload is what your door label says, and every person aboard comes out of it. The top Ram 2500 build, rated ${K.lb(r25.t ?? 0)} with ${K.lb(r25.pl ?? 0)} of payload, keeps ${K.lb(left25)} after a ${pct}% tongue.</p>
<p>For a trailer near the half-ton's ceiling, that difference decides whether the family fits in the cab. The ${h.a('payload-capacity', 'payload page')} explains how to read your own figure.</p>
${h.mini('gcwr', { t: `Ram 2500: trailer the GCWR leaves (top ${K.Y('ram-2500').year} build)`, d: { gc: r25.gcwr ?? 0, cw: r25.cw ?? 0 } })}
<h2>Bed hitches: fifth wheel and gooseneck</h2>
<p>Above a certain size, travel trailers give way to fifth wheels, and the hitch moves into the bed. Ford prints separate ratings for the ${f250.year} F-250: up to ${K.lb(f250.maxFw ?? 0)} on a fifth wheel and ${K.lb(f250.maxGn ?? 0)} on a gooseneck, while the receiver is rated ${K.lb(f250RecvW)} and ${K.lb(f250RecvT)} of tongue. The F-150 guide also has fifth-wheel tables, which this site has not transcribed, and Ford does not recommend fifth-wheel towing for the Raptor or the Lightning. What decides on a half-ton is again payload: the pin weight of ${T.fifthWheel.min} to ${T.fifthWheel.max}% of the trailer lands on the bed, plus the hitch, which Ram counts at ${K.num(K.P.hitchWeight.fifthWheel)} lb for a fifth wheel. The ${h.a('fifth-wheel-vs-gooseneck', 'fifth wheel and gooseneck page')} covers the choice between the two.</p>
<h2>Which one for your trailer</h2>
<p>If the loaded trailer is well inside the half-ton's rating and its tongue leaves room for your passengers, the lighter truck is enough and easier to live with. If either test is tight, or if you plan to move to a fifth wheel, the three-quarter-ton gives the margin. Run your own numbers in the ${h.a('home', 'checker')} with your door-label payload.</p>
`,
  faqs: [
    { q: 'Is an F-250 overkill for a 9,000 lb travel trailer?', a: `Not by rating alone: the F-150 is rated up to ${K.lb(K.max('f-150'))}. The question is payload. At ${pct}% a 9,000 lb trailer puts 900 lb on the hitch, and that plus your passengers, cargo and hitch must fit within the door-label payload. If it fits with room to spare, a half-ton works; if not, the F-250 is the right truck.` },
    { q: 'How much more payload does a Ram 2500 have than a Ram 1500?', a: `At the top of each range, Ram prints ${K.lb(K.Y('ram-2500').maxPl ?? 0)} for the 2500 and ${K.lb(K.Y('ram-1500').maxPl ?? 0)} for the 1500 in the ${K.Y('ram-2500').year} charts. Payload varies widely by cab, box and trim inside each model, so compare the door labels of the two trucks you are considering rather than the maxima.` },
    { q: 'Can a half-ton pickup pull a fifth wheel?', a: `Some can, within the fifth-wheel ratings their makers print, but the pin weight of ${T.fifthWheel.min} to ${T.fifthWheel.max}% of the trailer usually runs into the half-ton's payload first. Ford does not recommend fifth-wheel towing for the F-150 Raptor or Lightning. Weigh the loaded trailer's pin and compare it with what your payload leaves after passengers.` },
  ],
  tool: 'payload',
  related: ['truck-towing-capacity', 'payload-capacity', 'fifth-wheel-vs-gooseneck', 'gvwr-vs-gcwr', 'tongue-weight'],
  sources: ['ford_2026', 'ram1500_2026', 'ram2500_2026', 'ram_hd_2025'],
});
