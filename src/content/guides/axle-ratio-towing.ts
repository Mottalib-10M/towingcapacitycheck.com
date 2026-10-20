import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

interface G { id: string; e: string; ax: string; lo: number; hi: number; n: number }
const groups = (id: string): G[] => {
  const m = new Map<string, G>();
  for (const r of K.Y(id).rows) {
    if (!r.t || !r.ax || !r.e) continue;
    const k = `${r.e}|${r.ax}`;
    const g = m.get(k) ?? { id, e: r.e, ax: r.ax, lo: Infinity, hi: 0, n: 0 };
    g.lo = Math.min(g.lo, r.t); g.hi = Math.max(g.hi, r.t); g.n++;
    m.set(k, g);
  }
  const all = [...m.values()];
  const multi = new Set(all.map((g) => g.e).filter((e) => all.filter((g) => g.e === e).length > 1));
  return all.filter((g) => multi.has(g.e)).sort((a, b) => a.e.localeCompare(b.e) || Number(a.ax) - Number(b.ax));
};
const SHOWN = ['ram-1500', 'f-250', 'ram-2500'];
const rows = SHOWN.flatMap(groups);
const find = (id: string, e: RegExp, ax: string) => { const g = groups(id).find((x) => e.test(x.e) && x.ax === ax); if (!g) throw new Error(`${id} ${e} ${ax}`); return g; };

const hur21 = find('ram-1500', /^3\.0L Hurricane twin/, '3.21');
const hur55 = find('ram-1500', /^3\.0L Hurricane twin/, '3.55');
const hur92 = find('ram-1500', /^3\.0L Hurricane twin/, '3.92');
const g68a = find('f-250', /^6\.8L/, '3.73');
const g68b = find('f-250', /^6\.8L/, '4.30');
const dsl = groups('f-250').filter((g) => /Diesel/.test(g.e));
const gas73 = find('f-250', /^7\.3L/, '4.30');
const hemi73 = find('ram-2500', /6\.4L/, '3.73');
const hemi41 = find('ram-2500', /6\.4L/, '4.10');
const pw = K.Y('ram-2500').rows.find((r) => r.t === K.min('ram-2500'));
const xplAx = K.axles('explorer');
const ry = K.Y('ram-1500').year;
const hurRows = K.Y('ram-1500').rows.filter((r) => /^3\.0L Hurricane twin/.test(r.e ?? ''));
const gcOf = (ax: string) => Math.max(...hurRows.filter((r) => r.ax === ax).map((r) => r.gcwr ?? 0));
const drOf = (ax: string) => [...new Set(hurRows.filter((r) => r.ax === ax).map((r) => r.d ?? ''))].join(' and ');
const xplRecv = K.Y('explorer').notes.find((n) => /^Hitch receiver/.test(n)) ?? '';
const f250Recv = K.Y('f-250').notes.find((n) => /^Hitch receiver/.test(n)) ?? '';
const recvOf = (s: string) => { const m = s.match(/([\d,]+)(?: lbs\.)?\/[\d,]+/); return m ? Number(m[1].replace(/,/g, '')) : 0; };

export default defineGuide({
  id: 'axle-ratio-towing',
  group: 'ratings',
  order: 13,
  slug: 'axle-ratio-towing',
  nav: 'Axle ratio',
  card: 'How much the rear axle ratio moves the rating, engine by engine.',
  title: `Axle Ratio for Towing ${K.P.year}: How Gearing Moves the Rating`,
  description: `Axle ratio for towing ${K.P.year}: on the same ${ry} Ram 1500 engine, the ${hur92.ax} axle adds up to ${K.lb(hur92.hi - hur21.hi)} over the ${hur21.ax}. Gains engine by engine, from makers' tables.`,
  h1: 'Axle ratio and towing: how much the gearing is worth',
  intro: 'Choose a vehicle and a model year: the tool lists its ratings by rear axle ratio and names the ratio that tows the most.',
  resume: `The rear axle ratio is the number of driveshaft turns for one turn of the wheels. A numerically higher ratio, such as ${hur92.ax} rather than ${hur21.ax}, multiplies the engine's torque more and lets it pull a heavier combination from a stop and up a grade, so makers give it a higher trailer rating and usually a higher GCWR. The effect is large when the engine stays the same. On the ${ry} Ram 1500 with the 3.0L Hurricane, the ${hur21.ax} axle tops out at ${K.lb(hur21.hi)} and the ${hur92.ax} axle at ${K.lb(hur92.hi)}. On the F-250 with the 6.8L gas V8, the ${g68a.ax} axle reaches ${K.lb(g68a.hi)} and the ${g68b.ax} axle ${K.lb(g68b.hi)}. Across different engines the ratio tells you little: the F-250 diesels reach ${K.lb(K.max('f-250'))} on a ${dsl[0]?.ax ?? 'tall'} axle. Compare ratios only within one engine, and read the ratio of your own truck on its window sticker.`,
  body: (h) => `
<h2>What the ratio does</h2>
<p>The ring and pinion in the rear axle reduce the driveshaft speed before it reaches the wheels. With a ${hur92.ax} ratio the driveshaft turns ${hur92.ax} times for each wheel turn; with ${hur21.ax}, ${hur21.ax} times. The higher number gives more pulling force at the wheels for the same engine torque, at the cost of higher engine speed at highway pace and, usually, more fuel used when the truck runs empty. In the makers' tables the gain shows up first in the GCWR of the combination, and the trailer rating follows from it.</p>
<h2>Same engine, different axle</h2>
<p>The table lists every engine that the latest tables of three trucks offer with more than one axle ratio, with the range of ratings each pairing reaches. The other differences in the row, such as drive, cab and package, still play a part, which is why each cell is a range.</p>
${h.table(['Vehicle', 'Engine', 'Axle', 'Lowest', 'Highest', 'Rows'], rows.map((g) => [h.a(`model:${g.id}`, K.name(g.id)), g.e, g.ax, K.lb(g.lo), K.lb(g.hi), g.n]), 'Ratings by engine and rear axle ratio, latest model year read.', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>Three patterns stand out. On the Ram 1500, the weakest 3.0L Hurricane row on the ${hur92.ax} axle still beats the best one on the ${hur21.ax} axle by ${K.lb(hur92.lo - hur21.hi)} (${h.doc('ram-1500', ry, 'Ram chart')}). The chart shows how: the ${hur92.ax} rows carry a GCWR of ${K.lb(gcOf(hur92.ax))}, against ${K.lb(gcOf(hur21.ax))} for the ${hur21.ax} and ${hur55.ax} rows. The ${hur55.ax} axle, oddly, does not beat the ${hur21.ax} (${K.lb(hur55.hi)} against ${K.lb(hur21.hi)} at best), because its rows are ${drOf(hur55.ax)} while the ${hur21.ax} rows are ${drOf(hur21.ax)}: same GCWR, heavier truck, lighter trailer. On the F-250, the 6.8L gas V8 gains ${K.lb(g68b.hi - g68a.hi)} at the top with the ${g68b.ax} axle. On the Ram 2500, the 6.4L HEMI on the ${hemi41.ax} axle spans ${K.lb(hemi41.lo)} to ${K.lb(hemi41.hi)}, ${pw?.tb?.toLowerCase().includes('power wagon') ? 'with the Power Wagon at the low end' : 'the heaviest builds at the low end'}, while the ${hemi73.ax} axle stays between ${K.lb(hemi73.lo)} and ${K.lb(hemi73.hi)}.</p>
${h.mini('cap', { t: 'Check the top rating and its configuration', d: { m: 'f-250' } })}
<h2>Why ratios do not compare across engines</h2>
<p>A diesel with a numerically low ratio can outpull a gas engine with a high one. Ford's ${h.src('ford_2026', '2026 guide')} rates the F-250 diesels up to ${K.lb(Math.max(...dsl.map((g) => g.hi)))} on both the ${[...new Set(dsl.map((g) => g.ax))].join(' and ')} axles, while the 7.3L gas V8 stops at ${K.lb(gas73.hi)} even on its ${gas73.ax} axle. The diesel's torque does the work the gearing does on the gas engine. So "get the highest ratio" is advice for choosing between axles behind one engine, not a rule for comparing trucks.</p>
<h2>When the ratio changes nothing</h2>
<p>Some ratings ignore the axle altogether. Ford prints ${K.lb(K.max('explorer'))} for every ${K.Y('explorer').year} Explorer, on ${xplAx.map((a) => a.axle).join(', ')} axles alike, which is also the rating of its receiver, ${K.lb(recvOf(xplRecv))}. At the top of the F-250 range, both diesel ratios reach the same figure, equal to the ${K.lb(recvOf(f250Recv))} receiver rating Ford prints. And some documents do not split by axle at all: the Silverado 1500 table we read lists engine, drive, cab and package, with no axle column, so the tool shows nothing for it.</p>
<h2>Finding your own ratio</h2>
<p>The window sticker and the build sheet list the axle ratio, often next to a limited-slip or locking differential option. On a used truck, the maker's customer service can usually read the build record from the VIN. Once you have it, open the vehicle page, such as the ${h.a('model:ram-1500', 'Ram 1500')} or the ${h.a('model:f-250', 'F-250')}, and read the row that matches. A ratio swap after purchase does not change the rating on paper: the maker's figure belongs to the factory build. The ${h.a('gvwr-vs-gcwr', 'GVWR and GCWR page')} explains the combined limit the ratio mainly acts on.</p>
`,
  faqs: [
    { q: 'Is a 3.92 axle better than a 3.21 for towing?', a: `For the same engine, yes, by the makers' own tables. On the ${ry} Ram 1500 with the 3.0L Hurricane, the ${hur92.ax} axle is rated up to ${K.lb(hur92.hi)} and the ${hur21.ax} axle up to ${K.lb(hur21.hi)}. The price is higher engine speed at highway pace and usually a little more fuel when the truck runs empty.` },
    { q: 'Does changing the axle ratio after purchase raise the towing capacity?', a: 'Not officially. The rating, the GCWR and the door-label figures belong to the configuration the factory built and certified. Swapping gears may help the truck pull, but no maker document will credit your truck with the rating of the other ratio, and an insurer or inspector will go by the factory figures.' },
    { q: 'Why do some trucks list the same rating for every axle ratio?', a: `Because another part sets the limit before gearing does: the hitch receiver, the frame, the tow package or the GCWR. The ${K.Y('explorer').year} Explorer is rated ${K.lb(K.max('explorer'))} whatever its axle, with its Class III package standard for that maximum, and the F-250 diesels reach the same top figure on both of their ratios.` },
  ],
  tool: 'axle',
  related: ['gvwr-vs-gcwr', 'towing-capacity-chart', 'truck-towing-capacity', 'how-to-calculate-towing-capacity'],
  sources: ['ram1500_2026', 'ford_2026', 'ram2500_2026'],
});
