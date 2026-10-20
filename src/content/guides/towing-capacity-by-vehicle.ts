import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const R = K.rank();
const first = R[0];
const last = R[R.length - 1];
const label = (c: string) => K.CLASS_LABEL[c] ?? c;
const isHd = (c: string) => c === 'heavy duty pickup';
const hd = R.filter((x) => isHd(x.m.class));
const half = R.filter((x) => x.m.class === 'half-ton pickup');
const lower = R.filter((x) => !isHd(x.m.class) && x.m.class !== 'half-ton pickup');
const bestLower = lower[0];
const spread = [...R].map((x) => ({ x, gap: x.y.max - x.y.min })).sort((a, b) => b.gap - a.gap);
const flat = R.filter((x) => x.y.max === x.y.min);
const ex = 7000;
const allRows = R.filter((x) => x.y.min >= ex);
const someRows = R.filter((x) => x.y.max >= ex && x.y.min < ex);
const none = R.filter((x) => x.y.max < ex);
const and = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const names = (xs: typeof R) => and(xs.map((x) => K.name(x.m.id)));
const words = ['no', 'one', 'two', 'three', 'four', 'five', 'six'];
const years = [...new Set(R.map((x) => x.y.year))].sort();

export default defineGuide({
  id: 'towing-capacity-by-vehicle',
  group: 'compare',
  order: 1,
  slug: 'towing-capacity-by-vehicle',
  nav: 'By vehicle',
  card: 'Every covered truck and SUV ranked by its highest printed trailer rating.',
  title: `Towing Capacity by Vehicle ${K.P.year}: Every Truck and SUV Ranked`,
  description: `Towing capacity by vehicle, ${K.P.year}: ${R.length} trucks and SUVs ranked by the maker's top rating, from ${K.lb(first.y.max)} down to ${K.lb(last.y.max)}, each with its lowest row and page.`,
  h1: 'Towing capacity by vehicle: the full ranking',
  intro: 'Pick any vehicle in the tool to see its top rating, its lowest one and the page of the maker\'s document; the ranking below puts all of them side by side.',
  resume: `Ranked by the highest conventional trailer rating its maker prints for the latest model year we hold, the ${first.y.year} ${K.name(first.m.id)} leads at ${K.lb(first.y.max)}, followed by the ${hd[1] ? `${hd[1].y.year} ${K.name(hd[1].m.id)} at ${K.lb(hd[1].y.max)}` : 'other heavy duty pickups'}. The half-ton pickups come next, between ${K.lb(half[half.length - 1].y.max)} and ${K.lb(half[0].y.max)}, and the best of the rest is the ${K.name(bestLower.m.id)} at ${K.lb(bestLower.y.max)}. The ${K.name(last.m.id)} closes the list at ${K.lb(last.y.max)}. Those are ceilings for one configuration each. The same vehicle can sit thousands of pounds lower with another engine, axle or package: the ${K.name(spread[0].x.m.id)} spans ${K.lb(spread[0].gap)} between its best and its weakest row. Read the rank as a shortlist, then open the vehicle and find the row that matches your window sticker before you trust any figure for a trailer.`,
  body: (h) => `
<h2>The ranking, row by row</h2>
<p>Each line below is one vehicle at the most recent model year for which we read the maker's own document, which is why the years range from ${years[0]} to ${years[years.length - 1]}: Ram has already published its next charts, while Kia's newsroom page stops earlier. The rating shown is the conventional, bumper-pull figure. Fifth-wheel and gooseneck ratings are left out of the ranking so that a truck with a bed hitch is not compared with an SUV on a different basis.</p>
${h.table(['#', 'Vehicle', 'Class', 'Year', 'Highest rating', 'Lowest rating', 'Rows', 'Document'], R.map((x, i) => [i + 1, h.a(`model:${x.m.id}`, K.name(x.m.id)), label(x.m.class), String(x.y.year), K.lb(x.y.max), K.lb(x.y.min), x.y.rows.length, h.doc(x.m.id, x.y.year, 'maker document')]), 'Every covered vehicle, highest conventional trailer rating first.', ['r', 'l', 'l', 'r', 'r', 'r', 'r', 'l'])}
<h2>Three tiers with wide gaps between them</h2>
<p>The list does not slope gently. The ${words[hd.length] ?? hd.length} heavy duty pickups sit alone at the top, and the gap between the weakest of them and the strongest half-ton is ${K.lb(hd[hd.length - 1].y.max - half[0].y.max)}. Their makers give them a GCWR far above anything a light pickup receives, and that combined limit is what lets the trailer rating climb. The second tier holds the ${words[half.length] ?? half.length} half-ton pickups, packed within ${K.lb(half[0].y.max - half[half.length - 1].y.max)} of each other at their best. The third tier mixes the SUVs with the midsize and compact pickups, from ${K.lb(bestLower.y.max)} down to ${K.lb(last.y.max)}.</p>
<p>A buyer comparing across tiers is usually asking the wrong question. Nobody cross-shops a ${K.name(last.m.id)} against a ${K.name(first.m.id)}; the useful comparison is inside a tier, between trucks a buyer would actually weigh against each other. The ${h.a('truck-towing-capacity', 'pickup comparison by class')} and the ${h.a('suv-towing-capacity', 'SUV page')} do that.</p>
<h2>The headline belongs to one configuration</h2>
<p>A ranked list hides how much each vehicle varies. The table shows the lowest row next to the highest for that reason. The widest spreads belong to the ${and(spread.slice(0, 3).map((s) => `${K.name(s.x.m.id)} (${K.lb(s.gap)})`))}. ${flat.length ? `At the other end, the ${names(flat)} ${flat.length > 1 ? 'print' : 'prints'} one rating for every configuration, so the rank applies to any version you buy.` : ''} On a pickup the low end usually belongs to a base engine, a tall axle ratio or a missing tow package; on a large SUV it is often the two-wheel-drive version with a taller axle, or a trim without the tow package.</p>
<p>The practical consequence: a used vehicle bought because it "tows ${K.num(first.y.max)}" may tow far less. Check the engine, the drive, the axle code and the packages on the window sticker or build sheet, then look up that exact row on the vehicle page.</p>
<h2>Shortlisting for a given trailer</h2>
<p>Take, as an example, a loaded trailer of ${K.lb(ex)}. ${allRows.length ? `Every printed configuration of the ${names(allRows)} is rated at least that much.` : ''} ${someRows.length ? `The ${names(someRows)} reach it only in some configurations, so the row matters.` : ''} ${none.length ? `The ${names(none)} cannot pull it in any configuration listed.` : ''} Then subtract the people and gear: the ratings of Ford and Chevrolet assume a driver and one passenger only (Ford ${h.src('ford_2026', 'towing guide')}, p. 7), so a family trip uses up part of the margin before the trailer is hitched.</p>
${h.mini('payload', { t: 'Payload left once the family is aboard', d: { pl: 1600, pp: 650, cg: 250 } })}
<h2>What the rank leaves out</h2>
<p>A trailer rating says the vehicle can start, pull and stop that mass under the maker's test conditions. It says nothing about the weight already on board. The payload printed on the door pillar, the GVWR and the GCWR usually bind first, and the ${h.a('gvwr-vs-gcwr', 'GVWR and GCWR page')} shows how. The ${h.a('home', 'trailer checker')} runs all five limits at once, and the ${h.a('method', 'method page')} explains how each document was read. Toyota is absent because its documents could not be read and cited here; no rating is copied from a third party.</p>
`,
  faqs: [
    { q: 'Which vehicle on this site has the highest towing capacity?', a: `The ${first.y.year} ${K.name(first.m.id)}, rated up to ${K.lb(first.y.max)} on a conventional hitch in its best configuration${first.y.maxGn ? `, and ${K.lb(first.y.maxGn)} with a gooseneck` : ''}. That figure needs a specific engine, axle and package; the lowest row of the same model year is ${K.lb(first.y.min)}. Check the exact row before comparing it with any other truck.` },
    { q: 'Why does the ranking mix different model years?', a: `Because each line uses the latest year whose document we could read. Ram has published charts for ${K.Y('ram-1500').year}, while the Kia newsroom page we cite stops at ${K.Y('telluride').year}. Ratings rarely jump between two consecutive years, but they do change; the towing capacity chart page lists every year side by side.` },
    { q: 'Is a higher rank always the better tow vehicle for my trailer?', a: 'No. Past the weight of your loaded trailer plus a margin, a higher rating adds cost, fuel use and size without making your tow safer. The better question is which vehicles clear your trailer in the configuration you can buy, and which of them keep enough payload for your passengers and the tongue weight.' },
  ],
  tool: 'cap',
  related: ['towing-capacity-chart', 'truck-towing-capacity', 'suv-towing-capacity', 'how-to-calculate-towing-capacity', 'payload-capacity'],
  sources: ['ford_2026', 'gm_2026', 'ram1500_2026', 'ram2500_2026', 'jeep_gc_2026', 'kia_telluride_2025'],
});
