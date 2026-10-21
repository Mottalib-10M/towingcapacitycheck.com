import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const note = (id: string, re: RegExp, year?: number) => { const n = K.Y(id, year).notes.find((x) => re.test(x)); if (!n) throw new Error(`${id}: no note ${re}`); return n; };

const printed = K.rank().filter((x) => x.y.maxPl).sort((a, b) => (b.y.maxPl ?? 0) - (a.y.maxPl ?? 0)).map((x) => x.m.id);
const ry = K.Y('ram-1500');
const cabs = [...new Set(ry.rows.map((r) => r.cab).filter((c): c is string => !!c))].map((c) => {
  const xs = ry.rows.filter((r) => r.cab === c && r.pl).map((r) => r.pl as number);
  return { c, lo: Math.min(...xs), hi: Math.max(...xs), n: xs.length };
}).filter((x) => x.n).sort((a, b) => b.hi - a.hi);
const plAll = ry.rows.map((r) => r.pl ?? 0).filter((x) => x > 0);
const jeepDef = note('grand-cherokee', /^Payload is/);
const ramDef = note('ram-1500', /Payload = GVWR/, 2024);
const tel = K.top('telluride');
const telPay = (tel.gvwr ?? 0) - (tel.cw ?? 0);

// Example tally on a door label of 1,800 lb (example figure).
const door = 1800;
const ppl = 640, cargo = 180, hitch = P.hitchWeight.conventional;
const left = door - ppl - cargo - hitch;
const trailerAt = (share: number) => (left * 100) / share;

export default defineGuide({
  id: 'payload-capacity',
  group: 'ratings',
  order: 11,
  slug: 'payload-capacity',
  nav: 'Payload',
  card: 'What the door label allows on board, and how much of it the tongue takes.',
  title: `Payload Capacity ${P.year}: What Your Truck or SUV Can Carry`,
  description: `Payload capacity ${P.year}: GVWR minus curb weight, on the door placard. People, cargo, hitch and tongue all count, with the payload of each ${ry.year} Ram 1500 cab.`,
  h1: 'Payload capacity: what the truck may carry, tongue included',
  intro: 'Enter the payload printed on your door label, the people and the cargo: the calculator shows what is left for the tongue and the heaviest trailer it allows.',
  resume: `Payload capacity is the weight a vehicle may carry on top of its own curb weight: the GVWR minus the curb weight. The tire and loading placard on the driver's door pillar prints it as the combined weight of occupants and cargo that should never be exceeded, and that figure belongs to your own vehicle, options included. Everything aboard counts: driver and passengers, luggage, the cooler, a bed cover, the receiver hardware and, once you hitch up, the tongue weight of the trailer. Payload varies far more than buyers expect. On the ${ry.year} Ram 1500 chart it runs from ${K.lb(Math.min(...plAll))} to ${K.lb(Math.max(...plAll))} depending on cab, box, engine and trim. On a door label of, say, ${K.lb(door)}, a family of ${K.lb(ppl)}, ${K.lb(cargo)} of gear and ${K.lb(hitch)} of hitch leave ${K.lb(left)} for the tongue, which caps the trailer at ${K.lb(trailerAt(P.tongue.conventional.min))} at a ${P.tongue.conventional.min}% tongue, whatever the towing rating says.`,
  body: (h) => `
<h2>How the makers define it</h2>
<p>The legal anchor is the placard required by ${h.src('cfr_571_110', '49 CFR 571.110')}: it states the combined weight of occupants and cargo that should never be exceeded. The certification label next to it gives the GVWR (${h.src('cfr_567_4', '49 CFR 567.4')}). The makers describe payload in the same spirit. Ram's chart notes put it as an equation, ${/GVWR/.test(ramDef) ? 'the GVWR minus the base weight' : 'a weight difference'}. Jeep's specification sheet says: "${jeepDef.replace(/\.$/, '')}". The base or curb weight assumes full fluids and standard equipment, so every option bolted on at the factory or later already eats into the figure before anyone climbs aboard.</p>
<h2>The payloads the makers print</h2>
<p>Only some documents print payload at all. Ram and Jeep give it per configuration, and so do Toyota's sheets for the Tundra and the Tacoma (the 4Runner and Highlander sheets stopped printing it after the 2024 and 2023 model years); Ford's F-150 guide gives one maximum in its performance table; Chevrolet's trailering guide and Ford's heavy duty tables leave it to the door label.</p>
${h.table(['Vehicle', 'Year', 'Highest payload printed', 'Where'], printed.map((id) => [h.a(`model:${id}`, K.name(id)), String(K.Y(id).year), K.lb(K.Y(id).maxPl ?? 0), id === 'f-150' ? 'performance table, one engine' : 'per configuration']), 'Highest payload in each maker document that prints one, latest model year.', ['l', 'r', 'r', 'l'])}
<p>A maximum is the lightest, simplest build: on the Ram 1500 it is a ${K.Y('ram-1500').rows.find((r) => r.pl === K.Y('ram-1500').maxPl)?.cab ?? 'base'} work truck. Across the whole ${ry.year} chart, the lightest and the heaviest builds differ by ${K.lb(Math.max(...plAll) - Math.min(...plAll))} of payload. Well-equipped crew cabs sit far lower, as the next table shows. Kia prints no payload for the Telluride, but its GVWR minus the curb weight of the X-Pro gives ${K.lb(telPay)}.</p>
${h.table(['Ram 1500 cab', 'Lowest payload', 'Highest payload', 'Rows'], cabs.map((c) => [c.c, K.lb(c.lo), K.lb(c.hi), c.n]), `Ram 1500, ${ry.year}: payload range by cab.`, ['l', 'r', 'r', 'r'])}
<h2>What counts against it</h2>
<p>Four things, every time you tow. People: weigh them, do not guess, and include the driver, since the placard figure covers every occupant. Cargo: everything in the cab and the bed, plus accessories added after the truck left the factory, such as a tonneau cover, a toolbox or a bed liner. Hitch hardware: Ram's heavy duty charts count ${K.num(P.hitchWeight.conventional)} lb for a conventional hitch and ${K.num(P.hitchWeight.fifthWheel)} lb for a fifth-wheel hitch (${h.src('ram_hd_2025', 'Ram notes')}). Tongue weight: ${P.tongue.conventional.min} to ${P.tongue.conventional.max}% of the loaded trailer on a ball hitch, ${P.tongue.fifthWheel.min} to ${P.tongue.fifthWheel.max}% on a fifth wheel.</p>
${h.table(['Item (example)', 'Weight', 'Payload left'], [['Door-label payload', K.lb(door), K.lb(door)], ['Driver and three passengers', K.lb(ppl), K.lb(door - ppl)], ['Gear in cab and bed', K.lb(cargo), K.lb(door - ppl - cargo)], ['Hitch hardware', K.lb(hitch), K.lb(left)]], 'An example tally before the trailer is hitched.', ['l', 'r', 'r'])}
<p>In this example the tongue may weigh ${K.lb(left)} at most. At ${P.tongue.conventional.min}% that means a trailer of ${K.lb(trailerAt(P.tongue.conventional.min))}, and at ${P.tongue.conventional.max}% only ${K.lb(trailerAt(P.tongue.conventional.max))}. A half-ton rated well above that never gets to use its rating with this load, which is a common way owners end up overloaded without noticing.</p>
<p>A fifth wheel makes the arithmetic harsher. Its pin puts ${P.tongue.fifthWheel.min} to ${P.tongue.fifthWheel.max}% of the trailer on the bed, and the hitch itself is heavier: Ram counts ${K.num(P.hitchWeight.fifthWheel)} lb for it. Take an example fifth wheel of ${K.lb(12000)}: the pin alone weighs ${K.lb(12000 * P.tongue.fifthWheel.min / 100)} to ${K.lb(12000 * P.tongue.fifthWheel.max / 100)}, before the hitch and the passengers, enough on its own to use up the ${K.lb(door)} example label. Fifth-wheel buyers should start from the payload, then look at the trailer rating.</p>
${h.mini('tongue', { t: 'Tongue weight a trailer will add to the load', p: ['tw'], d: { tw: 6500 } })}
<h2>Finding and checking your own figure</h2>
<p>Read the placard on the driver's door pillar first; it is specific to your vehicle as built. If it is missing or the truck has been modified, weigh the empty truck with a full tank on a public scale and subtract that from the GVWR on the certification label. Then weigh it again loaded for a trip, with the trailer hitched and the truck's axles on separate pads, and compare the total with the GVWR and each axle with its GAWR. The ${h.a('gvwr-vs-gcwr', 'GVWR and GCWR page')} covers the combined limit, and the ${h.a('half-ton-vs-three-quarter-ton', 'half-ton versus three-quarter-ton comparison')} shows how much more a heavier truck leaves.</p>
`,
  faqs: [
    { q: 'Is the payload on the door sticker the same as the brochure payload?', a: 'Not usually. The brochure or chart gives the best figure for a light, plain build, while the placard on your door pillar is computed for your own vehicle with its options. A crew cab with a larger engine, four-wheel drive and a premium trim can be rated many hundreds of pounds lower. Trust the door label.' },
    { q: 'Do aftermarket accessories reduce my payload?', a: 'Yes. Anything added after the truck left the factory, such as a bed cover, a toolbox, a bumper, a winch or larger wheels, adds weight the placard did not account for, and that weight comes out of the payload pound for pound. Weighing the truck as you use it is the only reliable way to know what is left.' },
    { q: 'How much payload do I need to tow a 7,000 lb trailer?', a: `For the tongue alone, ${K.lb(7000 * P.tongue.conventional.min / 100)} to ${K.lb(7000 * P.tongue.conventional.max / 100)} at the ${P.tongue.conventional.min} to ${P.tongue.conventional.max}% share makers ask for, plus the hitch hardware, plus everyone in the truck and the gear. Add those and compare the total with the payload on your door label; if it is close, a lighter load in the cab or a truck with more payload is needed.` },
  ],
  tool: 'payload',
  related: ['gvwr-vs-gcwr', 'tongue-weight', 'half-ton-vs-three-quarter-ton', 'how-to-calculate-towing-capacity', 'suv-towing-capacity'],
  sources: ['cfr_571_110', 'cfr_567_4', 'ram1500_2026', 'ram_hd_2025', 'jeep_gc_2026', 'ford_2026'],
});
