import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Row } from '../../lib/data';

const ID = 'highlander';
const y = K.Y(ID);
const years = K.years(ID);
const first = years[years.length - 1];
const y23 = K.Y(ID, first);
const isHy = (r: Row) => !!r.e?.includes('hybrid');
const gas = y.rows.filter((r) => !isHy(r));
const hyb = y.rows.filter(isHy);
const hyT = hyb[0].t!;
const room = (r: Row) => r.gvwr! - r.cw!;
const gasRoom = gas.map(room);
const hyRoom = hyb.map(room);
const gasGrades = [...new Set(gas.map((r) => r.pk!))];
const hyGrades = [...new Set(hyb.map((r) => r.pk!))];
const fwdYears = years.filter((yr) => K.Y(ID, yr).rows.some((r) => r.d === 'FWD'));
const lastFwd = Math.max(...fwdYears);
const pl23 = y23.rows.filter((r) => !isHy(r) && r.pl).map((r) => r.pl!);
const plHy23 = y23.rows.filter((r) => isHy(r) && r.pl).map((r) => r.pl!);
const T = K.P.tongue.conventional;
const yF = K.Y(ID, lastFwd);
const pair = (g: string) => [yF.rows.find((r) => !isHy(r) && r.pk === g && r.d === 'FWD')!, yF.rows.find((r) => !isHy(r) && r.pk === g && r.d === 'AWD')!];
const [leF, leA] = pair('LE');
const gvGap = leA.gvwr! - leF.gvwr!;
const cwGap = leA.cw! - leF.cw!;
const SEAT = 170;

export default defineModel({
  id: ID,
  order: 17,
  title: `Highlander Towing Capacity 2026: ${first} to ${y.year} Gas and Hybrid`,
  description: `Toyota Highlander towing capacity 2026: ${K.lb(y.max)} for the 2.4L turbo and ${K.lb(hyT)} for the hybrid, ${first} to ${y.year}, with curb weight, GVWR and room for cargo.`,
  h1: `Toyota Highlander towing capacity, ${first} to ${y.year}`,
  intro: `Choose your Highlander's model year, engine, grade and drive: the checker reads Toyota's printed rating for it and tests your trailer, passengers and cargo against the rating and the GVWR.`,
  resume: `Toyota rates every gasoline Highlander from ${first} to ${y.year} at ${K.lb(y.max)} and every Highlander Hybrid at ${K.lb(hyT)}, front-wheel or all-wheel drive, whatever the grade. The gasoline engine is a 2.4-liter turbocharged four-cylinder; the hybrid pairs a 2.5-liter four-cylinder with electric motors. Toyota prints the figures in two separate product information sheets each year, one for the gasoline Highlander and one for the hybrid, and the site reads both. For ${y.year} the gasoline lineup is all-wheel drive only, in ${gasGrades.join(', ')} grades, and the hybrid comes as ${hyGrades.join(', ')}. Toyota prints a curb weight and a GVWR for each grade but no GCWR, and a payload only in the ${first} sheets. The room between curb weight and GVWR, ${K.lb(Math.min(...gasRoom))} to ${K.lb(Math.max(...gasRoom))} on the ${y.year} gasoline grades, is what seven or eight people, their luggage and the trailer tongue must share.`,
  body: (h) => `
<h2>Two engines, two ratings</h2>
<p>The Highlander is a simple case: the rating depends on the engine and nothing else. The ${y.year} gasoline sheet prints "Max Towing Capacity 5,000 lbs." once, for every grade (${h.doc(ID, y.year, `${y.year} gasoline product information`)}), and the hybrid sheet prints ${K.lb(hyT)}, also once. Drive does not change either figure: until ${lastFwd}, Toyota wrote "FWD/AWD" beside each rating. A Highlander Hybrid owner who wants to pull a ${K.lb(y.max)} trailer needs the gasoline turbo, or a larger SUV such as the ${h.a('model:4runner', '4Runner')} or the ${h.a('model:telluride', 'Telluride')}.</p>
${h.mini('cap', { t: 'Highlander maximum by model year', p: ['y'], d: { m: ID } })}
<h2>Seats fill the GVWR first</h2>
<p>A three-row SUV towing a camper is usually full of people. Toyota's ${y.year} sheets print a GVWR of ${K.lb(gas[0].gvwr!)} for the gasoline grades and ${K.lb(hyb[0].gvwr!)} for the hybrid, with curb weights that leave ${K.lb(Math.min(...gasRoom))} to ${K.lb(Math.max(...gasRoom))} on the gasoline grades and ${K.lb(Math.min(...hyRoom))} to ${K.lb(Math.max(...hyRoom))} on the hybrid. Seven adults at about ${K.lb(SEAT)} each already weigh about ${K.lb(SEAT * 7)}, before a single suitcase or cooler is loaded. Add ${T.min}% of a ${K.lb(y.max)} trailer on the hitch, ${K.lb((y.max * T.min) / 100)}, plus bags, and the Highlander reaches its GVWR before its trailer rating. With a full cabin, the honest towing limit is set by the scale, not by the brochure.</p>
${h.mini('payload', { t: 'Highlander: room left after people and cargo', d: { pl: Math.min(...gasRoom) } })}
<h2>What the older sheets add</h2>
<p>The ${first} sheets print a payload for each grade and drive (${h.doc(ID, first, `${first} product information`)}): ${K.lb(Math.min(...pl23))} to ${K.lb(Math.max(...pl23))} for the gasoline Highlander and ${K.lb(Math.min(...plHy23))} to ${K.lb(Math.max(...plHy23))} for the hybrid. Those figures are close to the curb weight to GVWR room, which supports using that room as a payload estimate in later years. The ${first} to ${lastFwd} sheets also list a front-wheel-drive version of most grades, with a GVWR ${K.lb(gvGap)} lower than the all-wheel-drive one and a curb weight ${K.lb(cwGap)} lower on the LE; the trailer rating is the same. Neither drive changes the figure the checker reads.</p>
<h2>Where the Highlander stops</h2>
<p>Toyota prints no GCWR, no tongue limit and no trailer brake rule in these sheets. Those conditions sit in the owner's manual, which the site did not read, so treat ${K.lb(y.max)} as the ceiling and the manual as the rulebook. The ${h.a('travel-trailer-weight', 'travel trailer weight guide')} shows which campers fit under ${K.lb(y.max)} once loaded, and the ${h.a('suv-towing-capacity', 'SUV towing guide')} compares the Highlander with its rivals.</p>
`,
  faqs: [
    { q: 'Can a Highlander Hybrid tow 5,000 pounds?', a: `No. Toyota rates every Highlander Hybrid at ${K.lb(hyT)}, front-wheel or all-wheel drive, in every model year from ${first} to ${y.year}. The ${K.lb(y.max)} rating belongs to the gasoline Highlander with the 2.4-liter turbocharged engine. Check the badge and the window sticker before choosing a trailer.` },
    { q: 'Does an all-wheel-drive Highlander tow more?', a: `No. Toyota prints the same rating for both drives: ${K.lb(y.max)} for the gasoline engine and ${K.lb(hyT)} for the hybrid. The all-wheel-drive LE has a GVWR ${K.lb(gvGap)} higher and a curb weight ${K.lb(cwGap)} higher in the ${lastFwd} sheet, so the room for people and cargo is slightly smaller. From ${y.year}, the gasoline Highlander is sold with all-wheel drive only.` },
    { q: 'Is the Grand Highlander on this page?', a: `No. The Grand Highlander is a larger, separate model with its own product information sheets, and the site has not read them yet. The figures here belong to the Highlander and the Highlander Hybrid from ${first} to ${y.year}, as printed in Toyota's newsroom sheets for each year.` },
  ],
  related: ['model:4runner', 'model:telluride', 'model:explorer', 'model:rav4', 'suv-towing-capacity', 'travel-trailer-weight'],
  trailer: 3500,
});
