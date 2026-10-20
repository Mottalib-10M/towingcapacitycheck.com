import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ID = 'explorer';
const y = K.Y(ID);
const y25 = K.Y(ID, 2025);
const y24 = K.Y(ID, 2024);
const y23 = K.Y(ID, 2023);
const gcwrs = y.rows.map((r) => r.gcwr!);
const hiG = y.rows.find((r) => r.gcwr === Math.max(...gcwrs))!;
const loG = y.rows.find((r) => r.gcwr === Math.min(...gcwrs))!;
const piu = y.rows.filter((r) => r.n?.includes('Police Interceptor')).length;
const engines26 = K.engines(ID).map((e) => e.engine);
const old = K.engines(ID, 2024);
const v30 = old.find((e) => e.engine.startsWith('3.0L'))!;
const i23 = old.find((e) => e.engine.startsWith('2.3L'))!;
const inc = K.M(ID).included!;
const BR = K.P.brakes.find((b) => b.who.startsWith('Ford'))!;
const FT = K.P.fordTongue;
// 2026 Ford RV & Trailer Towing Guide, p. 39 (Explorer notes): Class III Trailer Tow Package standard for 5,000 lbs. maximum;
// hitch receiver, Explorer gas or hybrid, 5,000 lbs./500 tongue (weight-carrying); frontal area 40 sq. ft. with the package.
const RECEIVER = { trailer: 5000, tongue: 500 };
const AREA = 40;
// 2024 Ford RV & Trailer Towing Guide, p. 40: hitch receiver Explorer 5,600/560, Explorer Hybrid 5,000/500 (weight-carrying).
const RECEIVER24 = { trailer: 5600, tongue: 560, hybrid: 5000 };

export default defineModel({
  id: ID,
  order: 12,
  title: `Explorer Towing Capacity ${y.year}: Why It Fell to ${K.lb(y.max)}`,
  description: `Explorer towing capacity ${y.year}: ${K.lb(y.max)} on every engine and drive, down from ${K.lb(y24.max)} in ${y24.year}, with the hitch limit, each GCWR and your trailer checked.`,
  h1: `Ford Explorer towing capacity, ${y.year} and earlier`,
  intro: `Pick the engine and drive of your Explorer: the checker reads its line in Ford's ${y.year} towing guide and tests your trailer, passengers and cargo against the rating and GCWR.`,
  resume: `Every Explorer in Ford's ${y.year} RV and Trailer Towing Guide is rated ${K.lb(y.max)}: all ${K.num(y.rows.length)} lines, every engine and both rear-wheel and four-wheel drive. The Class III Trailer Tow Package is standard for that figure, and the receiver is rated ${K.lb(RECEIVER.trailer)} with ${K.lb(RECEIVER.tongue)} of tongue load as a weight-carrying hitch. The rating was higher until ${y24.year}: the ${y24.year} guide gave the ${v30.engine} ${K.lb(v30.max)} and the ${i23.engine} ${K.lb(i23.max)} with the Class IV Trailer Tow Package (52T), and only ${K.lb(y24.min)} to versions without factory towing equipment. Since ${y25.year} there is one figure for everyone. What still differs is the GCWR, from ${K.lb(loG.gcwr!)} to ${K.lb(hiG.gcwr!)}, which decides how much in passengers and cargo you can carry along with the trailer. Ford counts a ${K.num(K.P.gmIncluded.driver)} lb driver and passenger in the rating.`,
  body: (h) => `
<h2>From three ratings to one</h2>
<p>The ${y23.year} and ${y24.year} guides split the Explorer three ways. The ${v30.engine} was rated ${K.lb(v30.max)}, the ${i23.engine} ${K.lb(i23.max)} with the Class IV Trailer Tow Package (52T), and any Explorer without factory towing equipment ${K.lb(y24.min)}, with a footnote saying that the hitch was then a dealer accessory (${h.doc(ID, y24.year, `${y24.year} guide`)}, p. ${y24.rows[0].p}). The receiver followed: ${K.lb(RECEIVER24.trailer)} and ${K.lb(RECEIVER24.tongue)} of tongue for the gas Explorer, ${K.lb(RECEIVER24.hybrid)} for the hybrid.</p>
<p>From ${y25.year} the table holds a single number. All ${K.num(y.rows.length)} lines of the ${y.year} guide read ${K.lb(y.max)}, the Class III package is standard for it and the receiver is rated to the same figure (${h.doc(ID, y.year, `${y.year} guide`)}, p. ${y.rows[0].p}). That is ${K.lb(y24.max - y.max)} less than the best ${y24.year} Explorer and more than the lowest. A camper chosen for a ${y24.year} ${v30.engine} may be too heavy for a newer one.</p>
${h.mini('cap', { t: 'Explorer maximum by model year', p: ['y'], d: { m: ID } })}
<h2>The GCWR still varies</h2>
<p>With the trailer rating fixed, the GCWR is what separates the lines: ${K.lb(loG.gcwr!)} for the ${loG.e} with ${loG.d} and ${K.lb(hiG.gcwr!)} for the ${hiG.e} with ${hiG.d}. Ford's rating assumes ${K.num(inc)} lb of people. Subtract that and the ${K.lb(y.max)} trailer from the GCWR, and what remains is the heaviest Explorer that still fits under it, curb weight plus everything you add. A heavier, well-equipped Explorer on a low GCWR line has less room for a third-row family and their luggage than the rating suggests. The tool starts from the highest GCWR line.</p>
${h.mini('gcwr', { t: 'Explorer: trailer allowed by the GCWR', d: { gc: hiG.gcwr!, cw: hiG.gcwr! - hiG.t! - inc } })}
<p>Engines in the ${y.year} table: ${engines26.join(', ')}. ${piu ? `${K.num(piu)} of the lines are footnoted as Police Interceptor Utility versions; read the footnote of your own line.` : ''}</p>
<h2>Brakes, tongue and frontal area</h2>
<p>Ford's notes add a warning specific to the Explorer: certain states require electric trailer brakes above a set weight, and a trailer with electric brakes must not be towed without an aftermarket electronic brake controller. Ford itself asks for separate brakes on any trailer above ${K.lb(BR.above)} loaded (${h.src('ford_2026', 'Ford guide, p. 6')}). The tongue should carry ${FT.conventional}% of the trailer, ${K.lb((y.max * FT.conventional) / 100)} at the rating, the same as the receiver's ${K.lb(RECEIVER.tongue)}. The rating assumes a trailer frontal area of up to ${AREA} square feet. Compare with the ${h.a('model:telluride', 'Telluride')} and ${h.a('model:grand-cherokee', 'Grand Cherokee')}, and read the ${h.a('how-to-calculate-towing-capacity', 'step-by-step calculation guide')} for your own load.</p>
`,
  faqs: [
    { q: `Why does the newer Explorer tow less than the ${y23.year} model?`, a: `Ford rated the ${y23.year} and ${y24.year} Explorer up to ${K.lb(y24.max)} with the 3.0L EcoBoost and the Class IV package. From ${y25.year} its guide gives every Explorer ${K.lb(y.max)} with a standard Class III package and a receiver rated to the same figure. The guide does not give a reason for the change.` },
    { q: 'Does the Explorer ST tow more than the base model now?', a: `Not in the ${y.year} guide. The 3.0L EcoBoost lines, the 2.3L and the 3.3L versions all read ${K.lb(y.max)}. Only the GCWR differs, up to ${K.lb(hiG.gcwr!)}, which leaves more room for passengers and cargo with a trailer hitched but does not raise the trailer rating itself.` },
    { q: 'Do I need a brake controller to tow with an Explorer?', a: `If the trailer has electric brakes, yes: Ford's notes say not to tow such a trailer without an aftermarket electronic brake controller. Ford asks for trailer brakes above ${K.lb(BR.above)} loaded, and some states set their own threshold, so most campers within the ${K.lb(y.max)} rating will need both.` },
  ],
  related: ['model:telluride', 'model:grand-cherokee', 'model:expedition', 'suv-towing-capacity', 'trailer-brakes', 'how-to-calculate-towing-capacity'],
  trailer: 4500,
});
