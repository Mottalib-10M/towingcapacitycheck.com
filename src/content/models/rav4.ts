import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Row } from '../../lib/data';

const ID = 'rav4';
const y = K.Y(ID);
const years = K.years(ID);
const first = years[years.length - 1];
const y25 = K.Y(ID, 2025);
const y24 = K.Y(ID, 2024);
const isHy = (r: Row) => !!r.e?.includes('hybrid');
const hi = y.rows.filter((r) => r.t === y.max);
const lo = y.rows.filter((r) => r.t === y.min);
const name = (r: Row) => `${r.pk} ${r.d}`;
const gas24 = y24.rows.filter((r) => !isHy(r));
const gasLo = Math.min(...gas24.map((r) => r.t!));
const adv = gas24.filter((r) => r.t === y24.max).map((r) => r.pk!);
const hy24 = y24.rows.find(isHy)!;
const gas25 = y25.rows.filter((r) => !isHy(r));
const T = K.P.tongue.conventional;
const room = (r: Row) => r.gvwr! - r.cw!;
const withCw = y.rows.filter((r) => r.cw);
const tight = [...withCw].sort((a, b) => room(a) - room(b))[0];

export default defineModel({
  id: ID,
  order: 18,
  title: `RAV4 Towing Capacity 2026: ${first} to ${y.year} by Grade and Drive`,
  description: `Toyota RAV4 towing capacity 2026: ${K.lb(y.min)} or ${K.lb(y.max)} on the new hybrid, ${K.lb(gasLo)} on most older gas grades, ${K.lb(y24.max)} for Adventure and TRD, per year.`,
  h1: `Toyota RAV4 towing capacity, ${first} to ${y.year}`,
  intro: `Choose your RAV4's model year, engine, grade and drive: the checker reads Toyota's printed rating for it and tests your trailer, passengers and cargo against the rating and the GVWR.`,
  resume: `The RAV4 is a light tow vehicle, and its rating depends on the grade and the drive more than on the badge. The ${y.year} RAV4, a new generation sold as a hybrid, is rated ${K.lb(y.max)} in ${hi.map(name).join(', ').replace(/, ([^,]+)$/, ' and $1')}, and ${K.lb(y.min)} in ${lo.map(name).join(', ').replace(/, ([^,]+)$/, ' and $1')}. Before that, from ${first} to 2025, Toyota published separate sheets for the gasoline RAV4 and the RAV4 Hybrid. The gasoline RAV4 with its 2.5-liter four-cylinder was rated ${K.lb(gasLo)} in the LE, XLE, XLE Premium and Limited, and ${K.lb(y24.max)} in the ${adv.join(' and ')} grades, which the 2025 sheet no longer lists. The older RAV4 Hybrid was rated ${K.lb(hy24.t!)} in every grade. Toyota prints a GVWR and curb weights but no payload and no GCWR, so the room between curb weight and GVWR is the figure to watch with a full car.`,
  body: (h) => `
<h2>The ${y.year} hybrid: drive and grade decide</h2>
<p>Toyota's ${y.year} RAV4 sheet prints two ratings and names the versions behind each (${h.doc(ID, y.year, `${y.year} product information`)}). The all-wheel-drive Woodland, XLE Premium, SE, XSE and Limited get ${K.lb(y.max)}. The LE in both drives and the front-wheel-drive SE and XLE Premium stay at ${K.lb(y.min)}. The maximum tongue weight is a tenth of each figure. So two RAV4s of the same grade, an XLE Premium with front-wheel drive and one with all-wheel drive, differ by a factor of two. If you plan to tow a small camper, the drive line on the window sticker matters more than the trim name.</p>
${h.mini('cap', { t: 'RAV4 maximum by model year', p: ['y'], d: { m: ID } })}
<h2>${first} to 2025: gasoline and hybrid apart</h2>
<p>Until the new generation, the RAV4 came in a gasoline version and a hybrid version, each with its own sheet. The gasoline RAV4 was rated ${K.lb(gasLo)} in most grades and ${K.lb(y24.max)} in the ${adv.join(' and ')} grades, the two versions with a more rugged trim (${h.doc(ID, 2024, '2024 product information')}). The RAV4 Hybrid read ${K.lb(hy24.t!)} in every grade, above the common gasoline grades but below the Adventure. The 2025 gasoline sheet lists only the LE, XLE, XLE Premium and Limited, all at ${K.lb(Math.max(...gas25.map((r) => r.t!)))}, so a 2025 RAV4 Adventure or TRD Off-Road has no figure in it; read the owner's manual for those.</p>
<h2>Light trailers, real limits</h2>
<p>A ${K.lb(y.max)} rating covers a small teardrop camper, a pair of jet skis or a utility trailer with a garden tractor. At ${T.min}% of the trailer on the hitch, that is ${K.lb((y.max * T.min) / 100)} on the ball. Toyota's ${y.year} sheet gives a GVWR of ${K.lb(y.rows[0].gvwr!)} and curb weights for three versions only; the ${tight.pk} ${tight.d} leaves ${K.lb(room(tight))} between the two. Four adults and a weekend of luggage use most of that. The ${y.year} lines without a printed curb weight keep an empty field, and the checker then asks for your own figure from the door label.</p>
${h.mini('payload', { t: 'RAV4: room left after people and cargo', d: { pl: room(tight) } })}
<p>A compact SUV is rated for light trailers only, and towing above the printed figure leaves the conditions the maker tested, whatever hitch is bolted on. Stay under the line that matches your grade and drive. For a heavier camper, compare the ${h.a('model:highlander', 'Highlander')} and the ${h.a('model:4runner', '4Runner')}, read the ${h.a('trailer-brakes', 'trailer brakes guide')}, and check the hitch class with the ${h.a('hitch-class', 'hitch class guide')}.</p>
`,
  faqs: [
    { q: `Which ${y.year} RAV4 can tow ${K.lb(y.max)}?`, a: `Only the all-wheel-drive versions that Toyota names in its ${y.year} sheet: ${hi.map(name).join(', ')}. The LE, whatever its drive, and the front-wheel-drive SE and XLE Premium are rated ${K.lb(y.min)}. The tongue limits are a tenth of each figure. Check both the grade and the drive on the window sticker before buying a trailer.` },
    { q: 'Can a RAV4 Hybrid tow more than a gas RAV4?', a: `It depends on the year and grade. From ${first} to 2025, the RAV4 Hybrid was rated ${K.lb(hy24.t!)}, above the ${K.lb(gasLo)} of the common gasoline grades, but below the ${K.lb(y24.max)} of the gasoline ${adv.join(' and ')}. In ${y.year} every RAV4 in Toyota's sheet is a hybrid, at ${K.lb(y.min)} or ${K.lb(y.max)} depending on grade and drive.` },
    { q: 'Is the RAV4 plug-in hybrid covered here?', a: `No. The ${y.year} RAV4 plug-in hybrid has its own newsroom page and product information sheet, which the site has not read, and neither has it read the sheets of the earlier plug-in, the RAV4 Prime. The figures on this page come from the RAV4 and RAV4 Hybrid sheets for ${first} to ${y.year}. For a plug-in model, read the rating in its owner's manual.` },
  ],
  related: ['model:highlander', 'model:4runner', 'model:maverick', 'suv-towing-capacity', 'hitch-class', 'trailer-brakes'],
  trailer: 1500,
});
