import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Row } from '../../lib/data';

const ID = '4runner';
const y = K.Y(ID);
const years = K.years(ID);
const first = years[years.length - 1];
const old = K.Y(ID, first);
const newYears = years.filter((yr) => K.max(ID, yr) === y.max);
const oldYears = years.filter((yr) => K.max(ID, yr) !== y.max);
const firstNew = Math.min(...newYears);
const lastOld = Math.max(...oldYears);
const room = (r: Row) => r.gvwr! - r.cw!;
const byRoom = [...y.rows].sort((a, b) => room(a) - room(b));
const tight = byRoom[0];
const roomy = byRoom[byRoom.length - 1];
const hy = y.rows.filter((r) => r.e?.includes('MAX'));
const hyCw = Math.max(...hy.map((r) => r.cw!));
const gasCw = Math.min(...y.rows.filter((r) => !r.e?.includes('MAX')).map((r) => r.cw!));
const oldPl = Math.min(...old.rows.map((r) => r.pl!));
const oldPlMax = Math.max(...old.rows.map((r) => r.pl!));
const tongueOld = Number(old.notes.find((n) => n.startsWith('Tongue'))?.match(/([\d,]+) lbs/)?.[1].replace(/,/g, '') ?? 0);
const T = K.P.tongue.conventional;

export default defineModel({
  id: ID,
  order: 16,
  title: `4Runner Towing Capacity 2026: ${first} to ${y.year} V6 and Turbo`,
  description: `Toyota 4Runner towing capacity 2026: ${K.lb(y.max)} for every ${firstNew} to ${y.year} version and ${K.lb(old.max)} for the ${first} to ${lastOld} V6, with the GVWR room for people and cargo.`,
  h1: `Toyota 4Runner towing capacity, ${first} to ${y.year}`,
  intro: `Choose your 4Runner's model year, engine and grade: the checker reads Toyota's printed rating for it and tests your trailer, passengers and cargo against the rating and the GVWR.`,
  resume: `Toyota prints a single towing figure for each 4Runner generation. The sixth generation, sold from the ${firstNew} model year with a 2.4-liter turbocharged four-cylinder or the i-FORCE MAX hybrid, is rated ${K.lb(y.max)} in every grade, two-wheel or four-wheel drive. The ${first} and ${lastOld} 4Runner, the end of the fifth generation with its 4.0-liter V6 and five-speed automatic, is rated ${K.lb(old.max)} in every grade and drive. Both figures follow the SAE J2807 method. What changes from one 4Runner to the next is weight: Toyota prints a curb weight and a GVWR for each grade, and the room between them, from ${K.lb(room(tight))} on the ${tight.pk} ${tight.e?.includes('MAX') ? 'hybrid' : tight.d} to ${K.lb(room(roomy))} on the ${roomy.pk} ${roomy.d}, is what people, cargo and the trailer tongue must fit in. Toyota prints no GCWR for either generation.`,
  body: (h) => `
<h2>One figure per generation</h2>
<p>The ${y.year} product information gives the 4Runner one line, "Maximum Towing Weight" of ${K.lb(y.max)}, with no split by grade, drive or engine (${h.doc(ID, y.year, `${y.year} product information`)}). The ${lastOld} sheet does the same with ${K.lb(old.max)} and the words "all" beside its maximum trailer and tongue figures (${h.doc(ID, lastOld, `${lastOld} product information`)}). That simplicity is rare in this segment, and it means the badge on the tailgate does not change the rating. It does not mean every 4Runner carries the same load, because the weights printed beside the rating differ by several hundred pounds.</p>
${h.mini('cap', { t: '4Runner maximum by model year', p: ['y'], d: { m: ID } })}
<h2>The room between curb weight and GVWR</h2>
<p>For the ${y.year} truck Toyota prints no payload, only a curb weight and a GVWR for each grade. The difference is the most that people, cargo, accessories and the trailer tongue may add. The ${roomy.pk} with ${roomy.d} leaves ${K.lb(room(roomy))}; the ${tight.pk} ${tight.e?.includes('MAX') ? 'hybrid' : tight.d} leaves ${K.lb(room(tight))}. The grades are printed with abbreviations in that table, copied here as Toyota wrote them. A ${K.lb(y.max)} trailer with ${T.min}% of its weight on the tongue puts ${K.lb((y.max * T.min) / 100)} on the ball, so the tight versions have little left for a family of four and their luggage. Weigh the loaded vehicle once before a long trip.</p>
${h.mini('payload', { t: '4Runner: room left after people and cargo', d: { pl: room(tight) } })}
<h2>Hybrid or turbo</h2>
<p>The i-FORCE MAX hybrid is printed only with four-wheel drive and weighs up to ${K.lb(hyCw)}, against ${K.lb(gasCw)} for the lightest gasoline version. Toyota still rates it ${K.lb(y.max)}, and gives it a higher GVWR to match. Choosing the hybrid for towing is therefore a question of torque and fuel use, not of a higher rating. The hybrid grades are also the heavier ones, so they sit at the tight end of the curb weight to GVWR room, and a family that tows and carries a full cargo area should compare that room grade by grade before choosing.</p>
<h2>The fifth generation</h2>
<p>The ${first} and ${lastOld} 4Runner use the 4.0-liter V6. Toyota prints a payload for that truck, from ${K.lb(oldPl)} to ${K.lb(oldPlMax)} depending on grade and drive, and a tongue weight of ${K.lb(tongueOld)} for every version, a tenth of the rating. The jump to ${K.lb(y.max)} came with the new generation in ${firstNew}; a used ${lastOld} is rated ${K.lb(y.max - old.max)} lower. For three-row and midsize rivals see the ${h.a('model:highlander', 'Highlander')}, the ${h.a('model:grand-cherokee', 'Grand Cherokee')} and the ${h.a('model:explorer', 'Explorer')}, and the ${h.a('suv-towing-capacity', 'SUV towing guide')} for the whole class.</p>
`,
  faqs: [
    { q: 'Does the 4Runner TRD Pro tow more than the SR5?', a: `No. Toyota prints one rating for every grade of a generation: ${K.lb(y.max)} from ${firstNew} and ${K.lb(old.max)} for the ${first} and ${lastOld} trucks. The TRD Pro and Trailhunter weigh more than an SR5, so they keep less room between curb weight and GVWR for people, cargo and the tongue, but their trailer rating is the same.` },
    { q: `Why did the 4Runner rating rise in ${firstNew}?`, a: `The ${firstNew} 4Runner is a new generation on a new platform with a turbocharged four-cylinder and an optional hybrid, and Toyota rates it ${K.lb(y.max)} against ${K.lb(old.max)} for the outgoing V6. Toyota's sheets do not explain the change; they print the figure and cite the SAE J2807 method behind both ratings.` },
    { q: 'How much can a loaded 4Runner carry with a trailer attached?', a: `Toyota's ${y.year} sheet prints no payload, so subtract the curb weight from the GVWR for your grade: between ${K.lb(room(tight))} and ${K.lb(room(roomy))}. People, cargo, accessories and the trailer tongue must all fit in that figure. The payload on the door pillar label of your own 4Runner wins over the sheet.` },
  ],
  related: ['model:highlander', 'model:grand-cherokee', 'model:tacoma', 'suv-towing-capacity', 'payload-capacity', 'tongue-weight'],
  trailer: 4500,
});
