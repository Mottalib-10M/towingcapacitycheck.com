import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ids = K.rank().map((x) => x.m.id);
const span = (id: string) => { const ys = K.years(id); return { from: Math.min(...ys), to: Math.max(...ys) }; };
const oldest = (id: string) => span(id).from;
const nYears = ids.reduce((a, id) => a + K.years(id).length, 0);
const steady = ids.filter((id) => K.years(id).every((y) => K.max(id, y) === K.max(id)));
const moved = ids.filter((id) => !steady.includes(id));
const and = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const eng = (id: string, y: number) => K.top(id, y).e ?? 'top engine';

const f23 = K.top('f-150', 2023), f24 = K.top('f-150', 2024);
const r24 = K.top('ram-1500', 2024), r25 = K.top('ram-1500', 2025);
const ramY = K.years('ram-1500');
const s23 = K.top('silverado-1500', 2023), s26 = K.top('silverado-1500');
const lowF23 = K.Y('f-150', 2023).rows.find((r) => r.t === K.min('f-150', 2023));
const lowF26 = K.Y('f-150').rows.find((r) => r.t === K.min('f-150'));

export default defineGuide({
  id: 'towing-capacity-chart',
  group: 'compare',
  order: 2,
  slug: 'towing-capacity-chart',
  nav: 'Chart by year',
  card: 'Highest and lowest ratings of each vehicle for every model year we hold.',
  title: `Towing Capacity Chart ${K.P.year}: Ratings for Every Model Year`,
  description: `Towing capacity chart ${K.P.year}: highest and lowest ratings of ${ids.length} trucks and SUVs for each model year, ${nYears} years in all, with what changed and the guide page.`,
  h1: 'Towing capacity chart: every model year side by side',
  intro: 'Choose a vehicle and a model year in the tool to see that year\'s best and weakest ratings; the chart below lays out every year for every vehicle at once.',
  resume: `The chart gives, for each model year we hold, the highest and the lowest conventional trailer rating the maker printed, so you can see how a vehicle changed over time. ${steady.length} of the ${ids.length} vehicles kept the same top figure across every year read, among them the ${K.name('f-250')} at ${K.lb(K.max('f-250'))} and the ${K.name('silverado-1500')} at ${K.lb(K.max('silverado-1500'))}. Others moved: the F-150 peaked at ${K.lb(K.max('f-150', 2023))} in 2023 and has printed ${K.lb(K.max('f-150', 2024))} since 2024, and the Ram 1500 went from ${K.lb(K.max('ram-1500', 2024))} in 2024 to ${K.lb(K.max('ram-1500', 2025))} in 2025, when its top engine changed. The bottom of the range moves even more, because base engines and trims come and go. For a used vehicle, read the row for its own model year: last year's guide can be wrong for this year's truck by a few hundred pounds or by several thousand.`,
  body: (h) => `
<h2>The chart</h2>
<p>One line per vehicle and model year, newest first. "Highest" and "lowest" are the extreme conventional ratings in that year's document; every configuration in between sits somewhere in that range. The row count tells you how detailed the maker's table is, which matters when you need to match an exact build: a year with dozens of rows splits the ratings by cab, wheelbase and axle, while a short table lumps them together.</p>
${h.table(['Vehicle', 'Year', 'Highest', 'Lowest', 'Rows', 'Document'], ids.flatMap((id) => K.years(id).map((y) => [h.a(`model:${id}`, K.name(id)), String(y), K.lb(K.max(id, y)), K.lb(K.min(id, y)), K.Y(id, y).rows.length, h.doc(id, y, 'source')])), 'Highest and lowest conventional ratings by model year, from each maker\'s document.', ['l', 'r', 'r', 'r', 'r', 'l'])}
<h2>Which vehicles held their figure</h2>
<p>The top rating stayed put on the ${and(steady.map(K.name))}. That stability is useful when shopping used: within the years shown, the maximum is the same, and only the configuration decides. It is not a promise that every row stayed the same. The Silverado 1500 kept ${K.lb(K.max('silverado-1500'))} at the top, but in 2023 that figure came from the ${s23.e ?? 'V8'} (${s23.pk ?? 'tow package'}), while from 2024 the guide credits the ${s26.e ?? 'diesel'} (${s26.pk ?? 'tow package'}). Same number, different truck behind it.</p>
<h2>Where the numbers moved</h2>
<p>The vehicles whose top figure changed at least once are the ${and(moved.map(K.name))}. Three cases are worth reading closely.</p>
<p><strong>Ford F-150.</strong> The 2023 guide reached ${K.lb(K.max('f-150', 2023))} with the ${f23.pk ?? 'top package'}; from 2024 the best row is ${K.lb(K.max('f-150', 2024))} with the ${f24.pk ?? 'tow package'}. The low end climbed from ${K.lb(K.min('f-150', 2023))} (${lowF23?.e ?? 'base engine'} in 2023) to ${K.lb(K.min('f-150'))} (${lowF26?.e ?? 'base engine'} in ${K.Y('f-150').year}). Ford's ${h.src('ford_2023', '2023 guide')} and ${h.src('ford_2026', '2026 guide')} are both linked in the table.</p>
<p><strong>Ram 1500.</strong> In 2024 the top row belonged to the ${r24.e ?? 'V8'} at ${K.lb(K.max('ram-1500', 2024))}. From 2025 the ${r25.e ?? 'six-cylinder'} leads, at ${K.lb(K.max('ram-1500', 2025))}, and the following years print ${ramY.filter((y) => y > 2025).sort().map((y) => `${K.lb(K.max('ram-1500', y))} for ${y}`).join(' and ')}. Small year-to-year moves of a few dozen pounds are normal on Ram charts, which compute every rating from the base weight of each build.</p>
<p><strong>Ford Explorer.</strong> The ${oldest('explorer')} and 2024 guides print ratings from ${K.lb(K.min('explorer', 2024))} to ${K.lb(K.max('explorer', 2024))}; the 2025 and 2026 guides print ${K.lb(K.max('explorer'))} for every row. An owner of an earlier Explorer should not assume the newer, flat figure applies, in either direction.</p>
${h.mini('axle', { t: 'Same model year, split by axle ratio', p: ['m', 'y'], d: { m: 'f-150' } })}
<h2>Reading a year that is not in the chart</h2>
<p>For a model year older than the ones shown, the maker's guide for that year is the only reliable source. Ford keeps its guides by year, and Chevrolet publishes a page of charts by model year (${h.src('gm_page', 'Chevrolet trailering charts')}). Copying a figure from a neighboring year is how owners end up with a number their truck was never rated for. For the Telluride we hold ${K.years('telluride').length} years, from ${oldest('telluride')} to ${span('telluride').to}; it gained ${K.lb(K.max('telluride', 2023) - K.max('telluride', 2022))} at the top in 2023, when Kia listed the X-Pro trims at ${K.lb(K.max('telluride', 2023))}.</p>
<p>Once you have the right year, the ${h.a('how-to-calculate-towing-capacity', 'step-by-step calculation')} turns its row into the trailer you can really pull, and the ${h.a('towing-capacity-by-vehicle', 'ranking by vehicle')} compares the latest years only.</p>
`,
  faqs: [
    { q: 'Did the F-150 lose towing capacity after 2023?', a: `At the top, yes: the 2023 guide prints ${K.lb(K.max('f-150', 2023))}, and the 2024 to ${K.Y('f-150').year} guides print ${K.lb(K.max('f-150'))}. At the bottom the range rose, since the lowest ${K.Y('f-150').year} row is ${K.lb(K.min('f-150'))}, against ${K.lb(K.min('f-150', 2023))} in 2023. Your own figure depends on the row that matches your build.` },
    { q: 'Why does the Ram 1500 rating change by a few pounds each year?', a: `Ram computes each rating from the GCWR and the base weight of the build, so small changes in equipment weight move the result. The top row went from ${K.lb(K.max('ram-1500', 2025))} in 2025 to ${K.lb(K.max('ram-1500', 2026))} in 2026 and ${K.lb(K.max('ram-1500'))} in ${K.Y('ram-1500').year}. Read the chart for your own year rather than rounding.` },
    { q: 'Can I use the current towing chart for an older truck?', a: 'Only if the chart above shows the same figure for both years and your configuration existed in both. Engines, packages and axle ratios change between years, and a row present in one guide can disappear from the next. When in doubt, read the guide for your truck\'s model year, which the table links.' },
  ],
  tool: 'cap',
  toolArg: { m: 'ram-1500' },
  related: ['towing-capacity-by-vehicle', 'truck-towing-capacity', 'axle-ratio-towing', 'how-to-calculate-towing-capacity'],
  sources: ['ford_2026', 'ford_2025', 'ford_2024', 'ford_2023', 'gm_2026', 'gm_page', 'ram1500_2026', 'kia_telluride_2025'],
});
