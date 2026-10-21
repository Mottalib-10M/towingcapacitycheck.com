import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const note = (id: string, re: RegExp) => { const n = K.Y(id).notes.find((x) => re.test(x)); if (!n) throw new Error(`${id}: no note ${re}`); return n; };
const grab = (s: string, re: RegExp) => { const m = s.match(re); if (!m) throw new Error(`no ${re} in ${s}`); return Number(m[1].replace(/,/g, '')); };

const suvs = K.rank().filter((x) => /SUV/.test(x.m.class));
const T = K.P.tahoeHitch;
const expRecv = note('expedition', /^Hitch receiver/);
const expWc = grab(expRecv, /weight-carrying ([\d,]+)\//);
const expWcT = grab(expRecv, /weight-carrying [\d,]+\/([\d,]+)/);
const expWdSwb = grab(expRecv, /weight-distributing ([\d,]+)\//);
const expWdMax = grab(expRecv, /SWB, ([\d,]+)\/[\d,]+ MAX/);
const expBars = grab(note('expedition', /require a weight-distributing hitch/), /over ([\d,]+) lbs/);
const xpl = note('explorer', /^Hitch receiver/);
const xplWc = grab(xpl, /hybrid ([\d,]+)\//);
const xplWcT = grab(xpl, /hybrid [\d,]+\/([\d,]+)/);
const gc = K.Y('grand-cherokee');
const fr = Math.min(...K.years('4runner'));
const gcAxle = K.top('grand-cherokee').ax ?? '';
const tel = K.Y('telluride');
const telTop = K.top('telluride');
const telPay = (telTop.gvwr ?? 0) - (telTop.cw ?? 0);
const expLow = K.Y('expedition').rows.find((r) => r.t === K.min('expedition'));
const expTop = K.top('expedition');
const wc: Record<string, string> = {
  tahoe: `${K.lb(T.wcTrailer)} / ${K.lb(T.wcTongue)} tongue`,
  expedition: `${K.lb(expWc)} / ${K.lb(expWcT)} tongue`,
  explorer: `${K.lb(xplWc)} / ${K.lb(xplWcT)} tongue`,
};
const fam = 650;
const fordDriver = grab(note('expedition', /driver and passenger/), /(\d+)-lb\. driver/);

export default defineGuide({
  id: 'suv-towing-capacity',
  group: 'compare',
  order: 4,
  slug: 'suv-towing-capacity',
  nav: 'SUVs',
  card: 'SUV ratings, and the lower limit that applies without load-leveling bars.',
  title: `SUV Towing Capacity ${K.P.year}: Ratings and Hitch Limits`,
  description: `SUV towing capacity ${K.P.year}: ${suvs.length} SUVs from ${K.lb(suvs[suvs.length - 1].y.max)} to ${K.lb(suvs[0].y.max)}, the lower limit without weight-distributing bars, and what a full family leaves for the hitch.`,
  h1: 'SUV towing capacity, and the limit without load-leveling bars',
  intro: 'Choose an SUV and a model year in the tool to see its best and weakest rating; below, the hitch limits that cut those figures for most owners.',
  resume: `Among the SUVs covered, the ${K.name(suvs[0].m.id)} leads at ${K.lb(suvs[0].y.max)}, followed by the ${K.name(suvs[1].m.id)} at ${K.lb(suvs[1].y.max)}; the ${K.name('grand-cherokee')} prints ${K.lb(gc.max)} and the ${K.name('4runner')} ${K.lb(K.max('4runner'))}, the three-row ${K.name('telluride')}, ${K.name('explorer')} and ${K.name('highlander')} stop at ${K.lb(K.max('telluride'))}, ${K.lb(K.max('explorer'))} and ${K.lb(K.max('highlander'))}, and the compact ${K.name('rav4')} at ${K.lb(K.max('rav4'))}. For the two big SUVs, the full rating holds only with a weight-distributing hitch. Chevrolet limits a Tahoe on a plain weight-carrying hitch to ${K.lb(T.wcTrailer)} and ${K.lb(T.wcTongue)} of tongue weight, and Ford limits the Expedition to ${K.lb(expWc)} without bars. The second limit is the one families meet: Ford and Chevrolet compute their ratings with a driver and a front passenger only, while a three-row SUV is bought to carry more people, and each extra passenger comes out of the payload the tongue also needs. An SUV towing near its rating with every seat full is often over its payload.`,
  body: (h) => `
<h2>SUV ratings and the bar-free limit</h2>
<p>The table gives the best and weakest conventional ratings for the latest model year read, and, where the maker states it, the most you may tow on a weight-carrying hitch, meaning a receiver and ball mount with no spring bars. Above that figure the maker requires a weight-distributing hitch, and on the Tahoe a sway control as well.</p>
${h.table(['SUV', 'Year', 'Best', 'Weakest', 'Weight-carrying hitch limit'], suvs.map((x) => [h.a(`model:${x.m.id}`, K.name(x.m.id)), String(x.y.year), K.lb(x.y.max), K.lb(x.y.min), wc[x.m.id] ?? 'not stated in the maker\'s sheet']), 'SUVs covered, conventional ratings and the limit without weight-distributing bars.', ['l', 'r', 'r', 'r', 'l'])}
<h2>Tahoe and Expedition: the bars are part of the rating</h2>
<p>Chevrolet's ${h.src('gm_2026', 'trailering guide')} is explicit on page 41: with a weight-carrying hitch the Tahoe may tow ${K.lb(T.wcTrailer)} with a ${K.lb(T.wcTongue)} tongue, and above that tongue weight it needs a weight-distributing hitch and sway control, with the tongue allowed up to ${K.lb(T.maxTongue)}. The ${K.lb(K.max('tahoe'))} headline, reached by the ${K.top('tahoe').e ?? 'V8'} with the Max Trailering Package, belongs to the second set-up only.</p>
<p>Ford says the same for the Expedition on page 38 of its ${h.src('ford_2026', 'towing guide')}: ratings over ${K.lb(expBars)} require a weight-distributing hitch. The receiver itself is rated ${K.lb(expWdSwb)} with bars on the standard wheelbase and ${K.lb(expWdMax)} on the long Expedition MAX. The spread inside the Expedition is wide for another reason: the ${expTop.d ?? '4x4'} with the ${expTop.ax ?? 'shorter'} axle reaches ${K.lb(K.max('expedition'))}, the ${expLow?.d ?? '4x2'} with the ${expLow?.ax ?? 'taller'} axle only ${K.lb(K.min('expedition'))}. The ${h.a('weight-distribution-hitch', 'weight distribution page')} explains what the bars do and do not change.</p>
<h2>Midsize and compact SUVs</h2>
<p>The ${K.name('explorer')} is rated ${K.lb(K.max('explorer'))} for every ${K.Y('explorer').year} configuration, with the receiver rated ${K.lb(xplWc)} and ${K.lb(xplWcT)} of tongue as a weight-carrying hitch. The ${K.name('grand-cherokee')} sheet gives ${K.lb(gc.max)} for two- and four-wheel drive, with the ${gcAxle} axle, and states a payload of up to ${K.lb(gc.maxPl ?? 0)}; it does not set a separate weight-carrying limit. Kia's newsroom lists the Telluride at ${K.lb(tel.min)}, or ${K.lb(tel.max)} for the X-Pro trims, and states no hitch or brake condition at all, so the owner's manual is the place to look before hitching anything heavy.</p>
<p>Toyota's newsroom sheets are simpler still. The ${K.name('4runner')} gets one figure per generation, ${K.lb(K.max('4runner'))} for every ${K.Y('4runner').year} grade and drive, against ${K.lb(K.max('4runner', fr))} for the ${fr} and ${fr + 1} V6 (${h.src('toyota_4runner_2026', '2026 sheet')}). The ${K.name('highlander')} is rated by engine alone: ${K.lb(K.max('highlander'))} with the 2.4-liter turbo, ${K.lb(K.min('highlander'))} for the Highlander Hybrid. The compact ${K.name('rav4')} reaches ${K.lb(K.max('rav4'))} only in the all-wheel-drive grades Toyota names, and ${K.lb(K.min('rav4'))} otherwise, so the drive line of the window sticker decides. None of the three sheets sets a separate limit for a weight-carrying hitch or prints a GCWR, which leaves the curb weight to GVWR room as the figure to watch; the ${h.a('model:4runner', '4Runner')}, ${h.a('model:highlander', 'Highlander')} and ${h.a('model:rav4', 'RAV4')} pages give it grade by grade.</p>
<h2>A full cabin uses up the payload</h2>
<p>Chevrolet computes its SUV ratings with a driver and a front passenger at ${K.num(K.P.gmIncluded.driver)} lb each (${h.src('gm_2026', 'guide')}, p. 7), and Ford's notes assume a ${K.num(fordDriver)} lb driver and passenger. A three-row SUV with ${K.lb(fam)} of people aboard, an example of four or five passengers, already carries more than those ratings assume. Kia prints no payload, but the GVWR minus the curb weight of the Telluride X-Pro gives ${K.lb(telPay)}, and that is what the people, the luggage, the hitch and the tongue share. With a ${K.lb(K.max('telluride'))} trailer at ${K.P.tongue.conventional.min}%, the tongue alone takes ${K.lb(K.max('telluride') * K.P.tongue.conventional.min / 100)}.</p>
${h.mini('payload', { t: 'Grand Cherokee: payload left with the family aboard', d: { pl: gc.maxPl ?? 1280, pp: fam, cg: 200 } })}
<h2>Before hitching the camper</h2>
<p>Weigh the loaded trailer, then the loaded SUV, and compare both with the door label rather than the brochure. Check whether your tow set-up crosses the bar-free limit in the table, and whether the maker asks for its tow package for the rating you are relying on. The ${h.a('home', 'trailer checker')} runs the full test for your configuration, and the ${h.a('travel-trailer-weight', 'travel trailer weight page')} turns a dry weight into a loaded one.</p>
`,
  faqs: [
    { q: 'Can a Tahoe tow its full rating on a regular ball hitch?', a: `No. Chevrolet limits a Tahoe on a weight-carrying hitch to a ${K.lb(T.wcTrailer)} trailer with ${K.lb(T.wcTongue)} of tongue weight. Above that it requires a weight-distributing hitch with sway control, and only then do the ratings up to ${K.lb(K.max('tahoe'))} apply, with the tongue allowed up to ${K.lb(T.maxTongue)}. The guide states this on page 41.` },
    { q: 'Does the Expedition MAX tow as much as the regular Expedition?', a: `Slightly less at the top. Ford's ${K.Y('expedition').year} guide rates the standard-wheelbase 4x4 up to ${K.lb(K.max('expedition'))} and the MAX 4x4 at ${K.lb(expWdMax)}, and the receivers with bars follow the same split. On two-wheel drive with the ${expLow?.ax ?? 'taller'} axle, both drop to the low six-thousands. Check your wheelbase and drive before comparing.` },
    { q: 'How many passengers can ride in an SUV that is towing?', a: 'As many as the payload allows once the tongue weight, the hitch hardware and the luggage are counted. The towing rating assumes only a driver and a front passenger. Add the weights of everyone aboard, the cargo and the tongue, and compare the total with the payload or the occupant and cargo figure on the door placard.' },
  ],
  tool: 'cap',
  toolArg: { m: 'tahoe' },
  related: ['weight-distribution-hitch', 'travel-trailer-weight', 'payload-capacity', 'towing-capacity-by-vehicle', 'truck-towing-capacity'],
  sources: ['gm_2026', 'ford_2026', 'jeep_gc_2026', 'kia_telluride_2025', 'toyota_4runner_2026', 'toyota_highlander_2026', 'toyota_rav4_2026', 'cfr_571_110'],
});
