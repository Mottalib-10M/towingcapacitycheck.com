import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const FW = P.tongue.fifthWheel;
const HW = P.hitchWeight;
const note = (id: string, re: RegExp) => { const n = K.Y(id).notes.find((x) => re.test(x)); if (!n) throw new Error(`${id}: no note ${re}`); return n; };
const grab = (s: string, re: RegExp) => { const m = s.match(re); if (!m) throw new Error(`no ${re} in ${s}`); return Number(m[1].replace(/,/g, '')); };

const sd = K.Y('f-250');
const engines = [...new Set(sd.rows.map((r) => r.e).filter((e): e is string => !!e))].map((e) => {
  const rs = sd.rows.filter((r) => r.e === e);
  const mx = (k: 't' | 'fw' | 'gn') => Math.max(...rs.map((r) => r[k] ?? 0));
  return { e, t: mx('t'), fw: mx('fw'), gn: mx('gn') };
}).sort((a, b) => b.gn - a.gn);
const area = note('f-250', /^Frontal area/);
const areaFw = grab(area, /(\d+) sq\. ft\. for 5th-wheel/);
const areaOther = grab(area, /(\d+) sq\. ft\. all other/);
const ex = 15000;
const r25 = K.top('ram-2500');
const pinLo = ex * FW.min / 100, pinHi = ex * FW.max / 100;

export default defineGuide({
  id: 'fifth-wheel-vs-gooseneck',
  group: 'hitching',
  order: 33,
  slug: 'fifth-wheel-vs-gooseneck',
  nav: 'Fifth wheel vs gooseneck',
  card: 'Two bed hitches compared: ratings, pin weight, hitch weight and when Ram requires each.',
  title: `Fifth Wheel vs Gooseneck ${P.year}: Ratings and Pin Weight`,
  description: `Fifth wheel vs gooseneck ${P.year}: the F-250 is rated ${K.num(sd.maxFw ?? 0)} and ${K.lb(sd.maxGn ?? 0)}, pin weight is ${FW.min} to ${FW.max}% of the trailer, and Ram counts ${K.num(HW.fifthWheel)} lb of hitch against ${K.num(HW.gooseneck)}.`,
  h1: 'Fifth wheel vs gooseneck: two ways to put the trailer over the axle',
  intro: `Enter the loaded trailer weight, ${K.lb(ex)} by default: the calculator gives the tongue range for a ball hitch and the pin weight a fifth wheel or gooseneck would put in the bed.`,
  resume: `Both hitches sit in the truck bed, over or just ahead of the rear axle, and both carry a much larger share of the trailer than a ball hitch: Chevrolet asks for a pin weight of ${FW.min} to ${FW.max}% of the loaded trailer, against ${P.tongue.conventional.min} to ${P.tongue.conventional.max}% on a bumper-pull tongue. A fifth wheel couples a kingpin into a plate with locking jaws; a gooseneck drops a coupler onto a ball in the bed floor. On ratings, the gooseneck usually edges ahead: Ford rates the ${sd.year} F-250 at up to ${K.lb(sd.maxFw ?? 0)} with a fifth wheel and ${K.lb(sd.maxGn ?? 0)} with a gooseneck, against ${K.lb(sd.max)} conventional. On weight, the gooseneck is lighter too: Ram's charts count ${K.num(HW.fifthWheel)} lb of hitch for a fifth wheel and ${K.num(HW.gooseneck)} lb for a gooseneck, all of it payload. Most large RVs are built for a fifth wheel; a gooseneck leaves the bed nearly free once its ball is removed.`,
  body: (h) => `
<h2>Ratings on the same truck</h2>
<p>Ford is the only maker here whose bed-hitch ratings we transcribed. The table takes the highest figure each F-250 engine reaches in the ${sd.year} guide (${h.doc('f-250', sd.year, 'Ford towing guide')}) for each hitch type. The gooseneck column is never below the fifth-wheel column, and both can exceed the conventional rating.</p>
${h.table(['F-250 engine', 'Conventional', 'Fifth wheel', 'Gooseneck'], engines.map((x) => [x.e, K.lb(x.t), K.lb(x.fw), K.lb(x.gn)]), `Ford F-250, ${sd.year}: highest rating per engine and hitch type.`, ['l', 'r', 'r', 'r'])}
<p>Ram sets the boundaries from the other side. Its heavy duty chart notes require a fifth-wheel hitch for trailers over ${K.lb(P.ramHdHitch.fifthWheelAbove)} and a gooseneck for trailers over ${K.lb(P.ramHdHitch.gooseneckAbove)} (${h.src('ram_hd_2025', 'Ram notes')}). Those weights concern the heaviest Ram trucks; the point for every owner is that the maker, not the hitch seller, decides which coupling a given trailer needs.</p>
<h2>Pin weight and payload</h2>
<p>Take an example ${K.lb(ex)} fifth wheel. Its pin puts ${K.lb(pinLo)} to ${K.lb(pinHi)} on the bed, and Ford computes its own tables with ${P.fordTongue.kingPin}% on the king pin, ${K.lb(ex * P.fordTongue.kingPin / 100)} here. Chevrolet adds that when towing the maximum trailer weight, the pin weight may not exceed ${P.tongue.atMaxRating.fifthWheel}% (${h.src('gm_2026', 'Chevrolet guide')}, p. 8). Add the hitch, the people and the gear, and the total must fit within the payload. On the top-rated ${K.Y('ram-2500').year} Ram 2500 build, which prints ${K.lb(r25.pl ?? 0)} of payload, ${(r25.pl ?? 0) - pinHi - HW.fifthWheel >= 0 ? `a fifth wheel at the top of that pin range plus its hitch would leave ${K.lb((r25.pl ?? 0) - pinHi - HW.fifthWheel)} for people and gear` : `a fifth wheel at the top of that pin range plus its hitch would already exceed the payload by ${K.lb(pinHi + HW.fifthWheel - (r25.pl ?? 0))}, before the driver climbs in`}. A heavy duty badge does not mean room to spare.</p>
${h.mini('payload', { t: 'Payload left for the pin and the hitch', d: { pl: r25.pl ?? 0, pp: 350, cg: 150, hz: HW.fifthWheel } })}
<h2>How the two couple</h2>
<p>A fifth-wheel hitch is a heavy plate on rails or a base bolted to the bed, with jaws that close around the trailer's kingpin. The trailer's overhang sits above the bed, and the coupling pivots and tilts, which many owners find smoother on the road. The hitch head can usually be lifted out, but the rails stay. A gooseneck uses a ball, generally mounted below the bed floor on a frame-attached kit, and a long neck on the trailer that reaches down to it. The ball can often be removed or flipped, leaving a flat bed when you are not towing. Fifth wheels are the usual coupling for large RVs; goosenecks are common on livestock, flatbed and equipment trailers, and adapters exist to put a fifth-wheel trailer on a gooseneck ball, within the rating of the weakest part.</p>
<h2>What else changes with a bed hitch</h2>
<p>Frontal area grows with the tall trailers that use these hitches, and Ford sets it as a limit: ${areaFw} sq. ft. for fifth-wheel and gooseneck towing on the F-250, against ${areaOther} sq. ft. for other trailers. The trailer's own brakes become essential at these weights, as the ${h.a('trailer-brakes', 'trailer brakes page')} explains. On half-ton pickups, Ford does not recommend fifth-wheel towing for the F-150 Raptor or Lightning, and the F-150 and Silverado 1500 bed-hitch tables, printed in their guides, are not transcribed on this site yet. The bed length matters as well: a short bed brings the trailer's nose closer to the cab in tight turns, which is why many owners of short-bed trucks use a sliding fifth-wheel hitch.</p>
<h2>Picking one</h2>
<p>If the trailer is an RV already built with a kingpin, the fifth wheel is the natural choice. If you tow equipment or livestock, or need a free bed most days, the gooseneck fits better and weighs less. Either way, read the bed-hitch rating for your exact row, weigh the pin, and run the payload test. The ${h.a('half-ton-vs-three-quarter-ton', 'half-ton versus three-quarter-ton page')} shows where a bed hitch pushes you up a weight class, and the ${h.a('model:f-250', 'F-250 page')} lists every row.</p>
`,
  faqs: [
    { q: 'Does a gooseneck tow more than a fifth wheel on the same truck?', a: `On the F-250, yes, by Ford's own tables: up to ${K.lb(sd.maxGn ?? 0)} with a gooseneck against ${K.lb(sd.maxFw ?? 0)} with a fifth wheel for ${sd.year}, and never less for any engine. Other makers print their own split. The difference is small next to what the payload and the pin weight allow, so check those first.` },
    { q: 'How heavy is the pin weight of a fifth wheel?', a: `Chevrolet asks for ${FW.min} to ${FW.max}% of the loaded trailer on the pin, and Ford computes with ${P.fordTongue.kingPin}%. An example ${K.lb(ex)} fifth wheel puts ${K.lb(pinLo)} to ${K.lb(pinHi)} in the bed. Weigh it loaded on a scale, with the truck hitched and unhitched, since the floor plan and the gear move it a lot.` },
    { q: 'How much does a fifth-wheel hitch weigh compared with a gooseneck?', a: `Ram's heavy duty charts count ${K.num(HW.fifthWheel)} lb of trailering equipment for a fifth-wheel hitch, ${K.num(HW.gooseneck)} lb for a gooseneck and ${K.num(HW.conventional)} lb for a conventional hitch. Your own hitch may weigh more or less; whatever it weighs comes out of the truck's payload together with the pin weight and the passengers.` },
  ],
  tool: 'tongue',
  toolArg: { tw: ex },
  related: ['tongue-weight', 'half-ton-vs-three-quarter-ton', 'trailer-brakes', 'hitch-class', 'payload-capacity'],
  sources: ['gm_2026', 'ford_2026', 'ram_hd_2025', 'ram2500_2026'],
});
