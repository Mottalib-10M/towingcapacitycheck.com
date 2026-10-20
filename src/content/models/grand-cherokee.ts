import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Row } from '../../lib/data';

const ID = 'grand-cherokee';
const y = K.Y(ID);
const years = K.years(ID);
const oldest = years[years.length - 1];
const flat = years.every((yr) => K.max(ID, yr) === y.max && K.min(ID, yr) === y.min);
const top = K.top(ID);
const engine = top.e!;
const y25 = K.Y(ID, 2025);
const prevEngine = y25.rows[0].e!;
const axle = top.ax!;
const pls = y.rows.map((r) => r.pl!);
const minPl = Math.min(...pls);
const maxPl = Math.max(...pls);
const lightest = y.rows.find((r) => r.pl === maxPl)!;
const heaviest = y.rows.find((r) => r.pl === minPl)!;
const gvwr = top.gvwr!;
const cws = y.rows.map((r) => r.cw!);
const trim = (r: Row) => r.l.split(' · ')[1];
const gap = (r: Row) => r.gvwr! - r.cw! - r.pl!;
const T = K.P.tongue.conventional;
const tLo = (y.max * T.min) / 100;
const tHi = (y.max * T.max) / 100;
const person = K.P.gmIncluded.driver;
const seats = Math.floor((minPl - tLo) / person);

export default defineModel({
  id: ID,
  order: 8,
  title: `Jeep Grand Cherokee Towing Capacity 2026, ${y.year} and Payload`,
  description: `Jeep Grand Cherokee towing capacity 2026 and ${y.year}: ${K.lb(y.max)} on every two-row gas version, and why the ${K.lb(minPl)} to ${K.lb(maxPl)} payload sets the real limit.`,
  h1: `Jeep Grand Cherokee towing capacity, ${y.year} and earlier`,
  intro: `Select the drive and trim of your Grand Cherokee: the checker reads Jeep's ${y.year} specification sheet and tests your trailer, passengers and cargo against the rating and the payload.`,
  resume: `Jeep's ${y.year} specification sheet rates every two-row gas Grand Cherokee at ${K.lb(y.max)}, with two-wheel or four-wheel drive, the ${axle} axle and either engine listed (${engine}). There is no lower or higher line to pick from: the ${K.num(y.rows.length)} configurations differ only in trim, curb weight and payload. ${flat ? `The same ${K.lb(y.max)} appears in every sheet from ${oldest} to ${y.year}.` : ''} Because the rating never moves, the payload decides how much of it you can use. Jeep prints payloads of ${K.lb(minPl)} to ${K.lb(maxPl)} against a GVWR of ${K.lb(gvwr)}, and a trailer at the rating puts ${K.lb(tLo)} to ${K.lb(tHi)} on the hitch at the usual tongue share. That leaves little for a family and luggage on the heavier trims. The Grand Cherokee L and the 4xe plug-in hybrid have their own sheets and are not covered by these figures.`,
  body: (h) => `
<h2>One rating for every version</h2>
<p>Most towing tables are long because the rating changes with the engine, cab, axle and package. The Grand Cherokee sheet is short because it does not: Jeep prints a maximum gross trailer weight of ${K.lb(y.max)} for two-wheel and four-wheel drive alike, with the ${axle} axle, on Laredo, Limited and Summit (${h.doc(ID, y.year, `${y.year} specifications`)}, p. ${top.p}). The ${y.year} sheet lists the engine as ${engine}; the ${y25.year} sheet named only the ${prevEngine} and also listed an Overland trim. None of that changes the trailer figure.</p>
<p>Jeep, unlike Ford and Chevrolet, prints curb weights rather than a rating already reduced by passengers. The curb weight here, ${K.lb(Math.min(...cws))} to ${K.lb(Math.max(...cws))}, includes standard equipment and a full tank, fluids and coolant. It does not include you, your passengers or anything in the cargo area.</p>
<h2>Why payload is the real limit</h2>
<p>A trailer presses on the hitch, and that tongue load rides on the SUV as cargo. At ${T.min} to ${T.max}% of a ${K.lb(y.max)} trailer, the tongue weighs ${K.lb(tLo)} to ${K.lb(tHi)}. The ${trim(heaviest)} with the lowest payload in the ${y.year} sheet, ${K.lb(minPl)}, would have about ${K.lb(minPl - tLo)} left after the lightest of those tongues: roughly ${K.num(seats)} adults at the ${K.num(person)} lb per person that other makers assume, and no luggage. The ${trim(lightest)} does better with ${K.lb(maxPl)}, but a family of four with bags still runs out before the trailer does.</p>
<p>The ${T.min} to ${T.max}% range is the one Chevrolet prints (${h.src('gm_2026', 'Chevrolet guide, p. 8')}); the Jeep sheet gives no tongue rule of its own, so check the owner's manual for the hitch and receiver limits of your vehicle. Enter your door-label payload and your load below.</p>
${h.mini('payload', { t: 'Grand Cherokee: payload left for the trailer tongue', d: { pl: minPl } })}
<h2>Payload figures that do not add up</h2>
<p>The sheet calls payload the maximum allowable weight of driver, passengers, cargo and options, and its weights are labelled as estimates. Yet the printed payload is lower than GVWR minus curb weight on every line: on the ${trim(lightest)}, ${K.lb(gvwr)} minus ${K.lb(lightest.cw!)} would give ${K.lb(gvwr - lightest.cw!)}, while Jeep prints ${K.lb(lightest.pl!)}, a gap of ${K.lb(gap(lightest))}. The gap shrinks to ${K.lb(gap(heaviest))} on the ${trim(heaviest)}. Jeep does not explain it, and we have not found the answer in the sheet. Until you can weigh your own vehicle, use the lower of the two, which is the printed payload or the figure on your door label.</p>
<h2>Where the Grand Cherokee sits</h2>
<p>At ${K.lb(y.max)}, the Grand Cherokee rates above the two midsize three-row SUVs in this site's data, the ${h.a('model:explorer', 'Explorer')} and the ${h.a('model:telluride', 'Telluride')}, and below a full-size ${h.a('model:tahoe', 'Tahoe')}. The ${h.a('suv-towing-capacity', 'SUV towing guide')} puts them side by side, and the ${h.a('payload-capacity', 'payload guide')} shows how to read the door label.</p>
${h.mini('tongue', { t: 'Grand Cherokee: tongue load of your trailer', d: { tw: y.max } })}
`,
  faqs: [
    { q: 'Does the Grand Cherokee 4x4 tow more than the 4x2?', a: `No. Jeep's ${y.year} sheet gives both drives the same ${K.lb(y.max)} maximum, with the ${axle} axle. Four-wheel drive adds curb weight, so its payload is a little lower on most trims, which leaves slightly less room for the tongue load and passengers. For a trailer near the limit that difference can matter.` },
    { q: 'How many people can ride in a Grand Cherokee towing its maximum?', a: `Few. With the lowest printed payload, ${K.lb(minPl)}, a ${K.lb(y.max)} trailer at ${T.min}% tongue leaves ${K.lb(minPl - tLo)} for everyone and everything aboard. At ${K.num(person)} lb per adult that is about ${K.num(seats)} people with no luggage. A lighter trailer or a trim with more payload widens the margin.` },
    { q: 'Are the Grand Cherokee L and 4xe rated the same?', a: `This page does not say, because they are not in the data. Jeep publishes separate specification sheets for the three-row Grand Cherokee L and the 4xe plug-in hybrid, and the ${K.lb(y.max)} figure here comes only from the two-row gas sheet. Read the sheet of your own version before relying on any number.` },
  ],
  related: ['model:telluride', 'model:explorer', 'model:tahoe', 'payload-capacity', 'suv-towing-capacity', 'tongue-weight'],
  trailer: 5000,
});
