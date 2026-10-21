import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Row } from '../../lib/data';

const ID = 'tacoma';
const y = K.Y(ID);
const years = K.years(ID);
const first = years[years.length - 1];
const y23 = K.Y(ID, first);
const isMax = (r: Row) => !!r.e?.includes('MAX');
const sr = y.rows.find((r) => r.pk === 'SR')!;
const xtra = y.rows.find((r) => r.cab === 'XtraCab' && r.pk !== 'SR' && !isMax(r))!;
const dbl = y.rows.find((r) => r.cab === 'Double Cab' && r.pk !== 'SR' && !isMax(r))!;
const hy = y.rows.find(isMax)!;
const dbl4 = y.rows.find((r) => r.cab === 'Double Cab' && r.d === '4x4' && r.pk !== 'SR' && !isMax(r))!;
const v6 = K.top(ID, first);
const i4old = y23.rows.find((r) => !r.pk)!;
const v6low = Math.min(...y23.rows.filter((r) => r.pk).map((r) => r.t!));
const tongue = (r: Row) => Number((r.n?.match(/maximum tongue weight ([\d,]+)/i)?.[1] ?? '0').replace(/,/g, ''));
const hyRange = hy.n?.match(/"([\d,]+-[\d,]+)"/)?.[1] ?? '';
const plRows = y.rows.filter((r) => r.pl && !isMax(r));
const plMin = Math.min(...plRows.map((r) => r.pl!));
const T = K.P.tongue.conventional;

export default defineModel({
  id: ID,
  order: 14,
  title: `Tacoma Towing Capacity 2026: ${first} to ${y.year} Ratings by Cab`,
  description: `Toyota Tacoma towing capacity 2026: ${K.lb(y.max)} XtraCab, ${K.lb(dbl.t!)} Double Cab, ${K.lb(sr.t!)} on the SR and ${K.lb(hy.t!)} for the i-FORCE MAX hybrid, per Toyota's own sheets.`,
  h1: `Toyota Tacoma towing capacity, ${first} to ${y.year}`,
  intro: `Choose your Tacoma's model year, engine, drive and cab: the checker reads Toyota's printed rating for it and tests your trailer, passengers and cargo against the rating and GVWR.`,
  resume: `Toyota's ${y.year} Tacoma product information rates the truck at ${K.lb(y.max)} with the i-FORCE turbocharged four-cylinder in the XtraCab and ${K.lb(dbl.t!)} in the Double Cab, two-wheel or four-wheel drive alike. The SR grade is the exception: it carries a lower output version of the same engine and is rated ${K.lb(sr.t!)} in every cab. The i-FORCE MAX hybrid, sold only as a 4x4 Double Cab, is printed as a range of ${hyRange} lb, and the site keeps ${K.lb(hy.t!)} so that the checker never overstates it. The ${years.slice(0, 3).reverse().join(', ').replace(/, (\d+)$/, ' and $1')} sheets print the same figures. The ${first} Tacoma belongs to the previous generation: its 3.5-liter V6 with the Tow Prep Package reached ${K.lb(v6.t!)}, while the four-cylinder stopped at ${K.lb(i4old.t!)}. Toyota prints a curb weight, a GVWR and a payload for each column and no GCWR, so the GVWR and the payload are the limits to watch once the family and the gear are aboard.`,
  body: (h) => `
<h2>Cab and grade, not axle ratio</h2>
<p>Toyota does not split the Tacoma by axle ratio or tow package the way Ford and Chevrolet do. The ${y.year} sheet has one towing table with four columns, 4x2 and 4x4, XtraCab and Double Cab (${h.doc(ID, y.year, `${y.year} product information`)}). The XtraCab, the two-door body with small rear access doors, reads ${K.lb(xtra.t!)}; the Double Cab reads ${K.lb(dbl.t!)}, because it is heavier and carries more people. Under every figure Toyota adds a footnote for the SR, the entry grade, at ${K.lb(sr.t!)}. Page 1 of the sheet lists the SR automatic with a lower output tune of the same 2.4-liter engine, so a Tacoma bought as an SR is a light trailer truck whatever its cab. Check the grade badge before you shop for a camper.</p>
${h.mini('cap', { t: 'Tacoma maximum by model year', p: ['y'], d: { m: ID } })}
<h2>The hybrid rates lower</h2>
<p>The i-FORCE MAX adds an electric motor and a battery to the same engine, and that hardware weighs. Its curb weight is printed up to ${K.lb(hy.cw!)}, against ${K.lb(dbl4.cw!)} at most for the gasoline Double Cab 4x4, and Toyota rates it ${hyRange} lb rather than ${K.lb(dbl.t!)}. The sheet does not say which grade gets which end of that range, so the site keeps the lower one. The hybrid gains on GVWR, printed from ${K.lb(hy.gvwr!)}, but buyers who tow first and drive empty second will find the gasoline Double Cab rated higher.</p>
<h2>Tongue weight and payload</h2>
<p>Toyota prints a maximum tongue weight in the same table: ${K.lb(tongue(xtra))} for the XtraCab and ${K.lb(tongue(dbl))} for the Double Cab, a tenth of the trailer rating. At the usual ${T.min} to ${T.max}% share, a ${K.lb(dbl.t!)} trailer puts ${K.lb((dbl.t! * T.min) / 100)} to ${K.lb((dbl.t! * T.max) / 100)} on the ball, so the upper part of that band already exceeds Toyota's cap. Aim for the low end. The printed payload starts at ${K.lb(plMin)} on the gasoline trucks, and the tongue, the hitch, the driver, the passengers and the bed load all come out of it. A Double Cab with four adults and a loaded bed reaches its payload long before its trailer rating.</p>
${h.mini('payload', { t: 'Tacoma: payload left after people and cargo', d: { pl: dbl.pl! } })}
<h2>The ${first} Tacoma, the last of the old generation</h2>
<p>The ${first} sheet describes the third-generation truck with a 2.7-liter four-cylinder and a 3.5-liter V6 (${h.doc(ID, first, `${first} product information`)}). The four-cylinder is rated ${K.lb(i4old.t!)}. The V6 ratings are printed only with the V6 Tow Prep Package, from ${K.lb(v6low)} for the Double Cab 4x4 up to ${K.lb(v6.t!)} for the Access Cab 4x2, under a gross combined weight of ${K.lb(v6.gcwr!)} for every version. That is higher than the new truck's ${K.lb(y.max)}, a point worth knowing when comparing a used ${first} with a newer Tacoma. A V6 without the package has no figure in this sheet; read its owner's manual. For other midsize pickups, see the ${h.a('model:colorado', 'Colorado')} and the ${h.a('model:ranger', 'Ranger')}, and size a camper with the ${h.a('travel-trailer-weight', 'travel trailer weight guide')}.</p>
`,
  faqs: [
    { q: 'Why is the Tacoma SR rated so much lower than other grades?', a: `Toyota's sheet footnotes the SR at ${K.lb(sr.t!)} in every cab and drive, against ${K.lb(dbl.t!)} to ${K.lb(y.max)} for the other gasoline grades. The SR uses a lower output tune of the 2.4-liter turbo engine. The sheet gives no other reason, so treat the grade as the deciding fact: an SR is not the truck for a ${K.lb(5000)} camper.` },
    { q: 'Does the Tacoma hybrid tow more than the gas version?', a: `No. Toyota prints the i-FORCE MAX at ${hyRange} lb, against ${K.lb(dbl.t!)} for the gasoline Double Cab 4x4 that shares its body. The hybrid is heavier, which lowers the rating even though its GVWR is higher. The site keeps ${K.lb(hy.t!)} for the hybrid because the sheet does not say which grade reaches the upper figure.` },
    { q: `Could the ${first} Tacoma V6 tow more than the new truck?`, a: `Yes, on paper. Toyota's ${first} sheet rates the 3.5-liter V6 with the Tow Prep Package at up to ${K.lb(v6.t!)}, against ${K.lb(y.max)} for the best ${y.year} version. The older truck also has a printed GCWR of ${K.lb(v6.gcwr!)}. A V6 without the Tow Prep Package has no rating in that sheet, so confirm the package on the window sticker before relying on the figure.` },
    { q: 'What tongue weight can a Tacoma carry?', a: `Toyota prints ${K.lb(tongue(xtra))} for the XtraCab and ${K.lb(tongue(dbl))} for the Double Cab, a tenth of each rating; the hybrid reads ${hy.n?.match(/tongue weight ([\d,-]+) lbs/)?.[1] ?? ''} lb. A trailer loaded with ${T.max}% on its tongue would exceed those caps near the full rating, so load it nose light, at about ${T.min}%, and weigh it at a public scale.` },
  ],
  related: ['model:colorado', 'model:ranger', 'model:tundra', 'truck-towing-capacity', 'tongue-weight', 'payload-capacity'],
  trailer: 5000,
});
