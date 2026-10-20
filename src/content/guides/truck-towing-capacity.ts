import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const note = (id: string, re: RegExp) => { const n = K.Y(id).notes.find((x) => re.test(x)); if (!n) throw new Error(`${id}: no note ${re}`); return n; };
const grab = (s: string, re: RegExp) => { const m = s.match(re); if (!m) throw new Error(`no ${re} in ${s}`); return Number(m[1].replace(/,/g, '')); };

const CLASSES = ['heavy duty pickup', 'half-ton pickup', 'midsize pickup', 'compact pickup'];
const trucks = K.rank().filter((x) => CLASSES.includes(x.m.class));
const of = (c: string) => trucks.filter((x) => x.m.class === c);
const half = of('half-ton pickup');
const hd = of('heavy duty pickup');
const mid = of('midsize pickup');
const and = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

const mavPack = grab(note('maverick', /4K Tow Package/), /over ([\d,]+) lbs/);
const rangerBumper = grab(note('ranger', /bumper only/), /exceed ([\d,]+) lbs/);
const coloradoTongue = grab(note('colorado', /up to [\d,]+ lbs/), /up to ([\d,]+) lbs/);
const f250Pack = grab(note('f-250', /High-Capacity Axle/), /greater than ([\d,]+) lbs/);
const coloradoLow = K.Y('colorado').rows.find((r) => r.t === K.min('colorado'));
const silvEng = K.engines('silverado-1500');
const ramEng = K.engines('ram-1500');

export default defineGuide({
  id: 'truck-towing-capacity',
  group: 'compare',
  order: 3,
  slug: 'truck-towing-capacity',
  nav: 'Pickup trucks',
  card: 'Pickups compared inside their class: half-ton, heavy duty, midsize and compact.',
  title: `Truck Towing Capacity ${K.P.year}: Pickups Compared by Class`,
  description: `Truck towing capacity ${K.P.year}: ${trucks.length} pickups compared by class, from ${K.lb(trucks[trucks.length - 1].y.max)} to ${K.lb(trucks[0].y.max)}, with the package or axle each top rating needs, from the makers' guides.`,
  h1: 'Truck towing capacity: pickups compared inside their class',
  intro: 'Choose a pickup and a model year in the tool for its best and weakest rating; below, each class of pickup is compared on its own terms.',
  resume: `Pickups fall into four classes with little overlap. Heavy duty three-quarter-ton trucks lead, with the ${K.name(hd[0].m.id)} rated up to ${K.lb(hd[0].y.max)} on a conventional hitch. The half-ton pickups follow, from ${K.lb(half[half.length - 1].y.max)} for the ${K.name(half[half.length - 1].m.id)} to ${K.lb(half[0].y.max)} for the ${K.name(half[0].m.id)} at their best. The midsize trucks top out at ${K.lb(mid[0].y.max)} (${K.name(mid[0].m.id)}), and the compact ${K.name('maverick')} at ${K.lb(K.max('maverick'))}. Inside each class, the top figure always needs something extra: a tow package, a particular axle ratio, sometimes a specific cab and wheelbase. Without it, the same badge can be rated far lower: a ${K.name('maverick')} without its tow package is rated ${K.lb(K.min('maverick'))}, and a ${K.name('colorado')} fitted with the accessory hitch instead of the Trailering Package ${K.lb(K.min('colorado'))}. Pick the class for your trailer first, then the configuration inside it.`,
  body: (h) => `
<h2>Every pickup, grouped by class</h2>
<p>The table keeps the classes apart, because comparing a compact pickup with a heavy duty one tells a buyer nothing. Within each class the trucks are sorted by their best conventional rating for the latest model year read. The last column names the engine that reaches it.</p>
${h.table(['Class', 'Pickup', 'Year', 'Best', 'Weakest', 'Engine of the best row'], CLASSES.flatMap((c) => of(c).map((x) => [K.CLASS_LABEL[c] ?? c, h.a(`model:${x.m.id}`, K.name(x.m.id)), String(x.y.year), K.lb(x.y.max), K.lb(x.y.min), K.top(x.m.id).e ?? 'as printed'])), 'Pickup trucks by class, conventional trailer ratings.', ['l', 'l', 'r', 'r', 'r', 'l'])}
<h2>Half-ton pickups: close at the top, apart at the bottom</h2>
<p>The ${and(half.map((x) => K.name(x.m.id)))} land within ${K.lb(half[0].y.max - half[half.length - 1].y.max)} of each other at their best, so the headline rarely decides between them. Their weakest rows differ more: ${and(half.map((x) => `${K.lb(x.y.min)} for the ${K.name(x.m.id)}`))}. On the Silverado, the ${silvEng[0].engine} and the ${silvEng[1]?.engine ?? 'V8'} are both near the top, while the ${silvEng[silvEng.length - 1].engine} stops at ${K.lb(silvEng[silvEng.length - 1].max)}. On the Ram 1500, the ${ramEng[0].engine} leads at ${K.lb(ramEng[0].max)}, and the axle ratio does much of the sorting, which the ${h.a('axle-ratio-towing', 'axle ratio page')} details. On the F-150, Ford asks for the Tow/Haul Package and the optional Max Tow Axle above ${K.lb(K.P.f150Hitch.maxNoPack)} (${h.src('ford_2026', 'Ford guide')}, p. 19).</p>
<p>The real ceiling of a half-ton is usually its payload, not its trailer rating. A trailer near the top of the range puts well over a thousand pounds on the hitch, and that comes out of a payload that family, gear and hitch hardware already share.</p>
<h2>Heavy duty pickups: the hitch type joins the rating</h2>
<p>The ${and(hd.map((x) => `${K.name(x.m.id)} (${K.lb(x.y.max)})`))} are the only trucks here rated for trailers that size. Ford requires the High-Capacity Axle Upgrade Package for conventional towing above ${K.lb(f250Pack)} on the F-250, and prints separate fifth-wheel and gooseneck ratings${K.Y('f-250').maxGn ? `, up to ${K.lb(K.Y('f-250').maxGn as number)} with a gooseneck` : ''}. Ram's chart notes require a fifth-wheel hitch above ${K.lb(K.P.ramHdHitch.fifthWheelAbove)} and a gooseneck above ${K.lb(K.P.ramHdHitch.gooseneckAbove)} (${h.src('ram_hd_2025', 'Ram notes')}). How the two compare with a half-ton beyond the trailer rating is the subject of the ${h.a('half-ton-vs-three-quarter-ton', 'half-ton versus three-quarter-ton page')}.</p>
<h2>Midsize and compact: the package is the rating</h2>
<p>On the smaller trucks, the option sheet decides more than the engine. Ford's Maverick needs the 4K Tow Package for trailers over ${K.lb(mavPack)}, so a Maverick bought without it is a ${K.lb(K.min('maverick'))} tow vehicle. The Ranger may not exceed ${K.lb(rangerBumper)} towing from the bumper only, and needs its Trailer Tow Package above that. The Colorado's lowest row, ${K.lb(K.min('colorado'))}, ${coloradoLow?.n ? 'requires the accessory hitch and wiring harness, per the footnote of the guide' : 'is the configuration without the trailering package'}, and Chevrolet caps its tongue weight at ${K.lb(coloradoTongue)} (${h.src('gm_2026', 'Chevrolet guide')}, p. 41). A buyer who wants the advertised figure on a used midsize or compact pickup should look for the package code on the window sticker before anything else.</p>
${h.mini('hitch', { t: 'Hitch class your trailer calls for', d: { tw: 5000 } })}
<h2>Choosing the class for a trailer</h2>
<p>Start from the trailer, loaded as you travel, and the people who ride along. If the trailer sits within the weakest row of a class, any truck of that class fits it, and the choice comes down to payload and comfort. If it sits between the weakest and the best rows, the configuration matters and you should read the vehicle's page line by line. If it sits above the best row of a class, step up a class: no aftermarket part raises a maker's rating. The ${h.a('home', 'towing checker')} tests your own combination, and the ${h.a('towing-capacity-chart', 'year-by-year chart')} helps with a used truck.</p>
`,
  faqs: [
    { q: 'Which half-ton pickup tows the most in 2026?', a: `Among the half-tons we cover, the ${K.Y(half[0].m.id).year} ${K.name(half[0].m.id)} prints the highest conventional rating, ${K.lb(half[0].y.max)}, in one configuration. The others follow within ${K.lb(half[0].y.max - half[half.length - 1].y.max)}. Toyota's Tundra is not covered, since its documents could not be read. The gap between the three matters less than the row that matches your truck.` },
    { q: 'Can a midsize pickup tow a travel trailer?', a: `A light one, yes, if the truck has its tow package: the ${K.name(mid[0].m.id)} reaches ${K.lb(mid[0].y.max)} at best. Weigh the trailer loaded, not dry, and check the tongue weight against the hitch limits; Chevrolet caps the Colorado's tongue at ${K.lb(coloradoTongue)}. The passengers and the tongue then share the same payload, so check it on the door label.` },
    { q: 'Does a compact pickup like the Maverick need a tow package?', a: `For anything above ${K.lb(mavPack)}, yes. Ford rates the Maverick at ${K.lb(K.min('maverick'))} without the 4K Tow Package and ${K.lb(K.max('maverick'))} with it, whichever engine is fitted. The package adds the hardware the higher rating assumes, so a hitch added later does not raise a truck built without it.` },
  ],
  tool: 'cap',
  toolArg: { m: 'silverado-1500' },
  related: ['half-ton-vs-three-quarter-ton', 'towing-capacity-by-vehicle', 'suv-towing-capacity', 'axle-ratio-towing', 'payload-capacity'],
  sources: ['ford_2026', 'gm_2026', 'ram1500_2026', 'ram2500_2026', 'ram_hd_2025'],
});
