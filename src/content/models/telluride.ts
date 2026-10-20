import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Row } from '../../lib/data';

const ID = 'telluride';
const y = K.Y(ID);
const years = K.years(ID);
const first = years[years.length - 1];
const trimOf = (r: Row) => r.pk!.split(',')[0];
const xpro = y.rows.filter((r) => r.t === y.max);
const xproTrims = [...new Set(xpro.map(trimOf))];
const xproDrives = [...new Set(xpro.map((r) => r.d))];
const fwd = y.rows.filter((r) => r.d === 'FWD');
const fwdMax = Math.max(...fwd.map((r) => r.t!));
const trims = [...new Set(y.rows.map(trimOf))];
const firstHigh = [...years].reverse().find((yr) => K.max(ID, yr) === y.max)!;
const lastFlat = Math.max(...years.filter((yr) => yr < firstHigh));
const xp = xpro[0];
const room = (r: Row) => r.gvwr! - r.cw!;
const lx = y.rows.find((r) => trimOf(r) === 'LX')!;
const T = K.P.tongue.conventional;
const two = y.rows.filter((r) => r.n?.includes(' / ')).length;

export default defineModel({
  id: ID,
  order: 13,
  title: `Telluride Towing Capacity 2026: ${first} to ${y.year} Ratings by Trim`,
  description: `Telluride towing capacity 2026 guide: ${K.lb(fwdMax)} on most trims and ${K.lb(y.max)} on the AWD X-Pro, from Kia's ${first} to ${y.year} spec pages, with payload room checked.`,
  h1: `Kia Telluride towing capacity, ${first} to ${y.year}`,
  intro: `Choose your Telluride's model year, trim and drive: the checker reads Kia's published rating for it and tests your trailer, passengers and cargo against the rating and GVWR.`,
  resume: `Kia's newsroom specifications, the latest read for this site being the ${y.year} page, rate the Telluride at ${K.lb(fwdMax)} on almost every trim and ${K.lb(y.max)} on the ${xproTrims.join(' and ')} with ${xproDrives.join(' or ')}. No ${y.year + 1} figures were in Kia's newsroom data used here, so a ${y.year + 1} owner should confirm the rating in the owner's manual. All ${K.num(y.rows.length)} configurations of ${y.year} use the ${xp.e}; the figure depends only on the trim and the drive, front-wheel or all-wheel. Every front-wheel-drive Telluride is rated ${K.lb(fwdMax)}. The ${K.lb(y.max)} rating first appeared in ${firstHigh} with the X-Pro trims; from ${first} to ${lastFlat} every Telluride read ${K.lb(fwdMax)}. Kia prints curb weights rather than a rating reduced by passengers, and its page states no hitch or brake conditions, so the GVWR and the owner's manual set the other limits. The X-Pro has about ${K.lb(room(xp))} between curb weight and GVWR for people, cargo and the tongue.`,
  body: (h) => `
<h2>Trim decides, not engine</h2>
<p>Kia's pages list a single engine, the ${xp.e}, so the towing figure moves with the trim and the drive alone. The ${y.year} specification page lists ${K.num(trims.length)} trims: ${trims.join(', ')} (${h.doc(ID, y.year, `${y.year} specifications`)}). Each is printed with a front-wheel-drive and an all-wheel-drive rating where both exist. Only the X-Pro trims, ${xproTrims.join(' and ')}, reach ${K.lb(y.max)}, and only with all-wheel drive. Every other trim, the X-Line versions included, reads ${K.lb(fwdMax)}. Check the badge and the window sticker: the trim name is the whole answer here.</p>
${h.mini('cap', { t: 'Telluride maximum by model year', p: ['y'], d: { m: ID } })}
<h2>Model years ${first} to ${y.year}</h2>
<p>The early Telluride had a single rating. From ${first} to ${lastFlat}, every trim and drive in Kia's pages reads ${K.lb(fwdMax)}. The ${firstHigh} page added X-Pro trims at ${K.lb(y.max)}; the names shifted over the years, with the ${K.Y(ID, firstHigh).rows.filter((r) => r.t === y.max).map(trimOf).join(' and ')} in ${firstHigh} and the ${xproTrims.join(' and ')} in ${y.year}. A used Telluride bought for a ${K.lb(y.max)} trailer must therefore be an X-Pro from ${firstHigh} or later. This site has no ${y.year + 1} Kia document; until one is published in the same form, treat any ${y.year + 1} figure you see with caution and read the owner's manual.</p>
<h2>The room between curb weight and GVWR</h2>
<p>Kia does not print a payload, but it prints a curb weight and a GVWR, and the difference is the most that people, cargo and the trailer tongue may add. On the ${trimOf(xp)} with all-wheel drive, ${K.lb(xp.gvwr!)} minus ${K.lb(xp.cw!)} leaves ${K.lb(room(xp))}. On the front-wheel-drive ${trimOf(lx)}, ${K.lb(lx.gvwr!)} minus ${K.lb(lx.cw!)} leaves ${K.lb(room(lx))}. A trailer at ${K.lb(y.max)} adds ${K.lb((y.max * T.min) / 100)} to ${K.lb((y.max * T.max) / 100)} of tongue load at the usual ${T.min} to ${T.max}% share, the range Chevrolet prints (${h.src('gm_2026', 'Chevrolet guide, p. 8')}). With eight seats and their occupants, that room goes quickly. The curb weight we use is the higher of the two values Kia prints for each trim; ${K.num(two)} lines even print two pairs of figures, so weigh your own Telluride if the margin is thin.</p>
${h.mini('payload', { t: 'Telluride: room left for the trailer tongue', d: { pl: room(xp) } })}
<h2>What Kia leaves unsaid</h2>
<p>Ford and Chevrolet tie their ratings to a hitch package, a tongue limit and a brake rule. Kia's specification page states none of that: no hitch requirement, no tongue cap, no trailer brake threshold. Those conditions sit in the owner's manual, which this site did not read, so treat the rating as the upper bound and the manual as the rulebook. For midsize rivals with fuller published conditions, see the ${h.a('model:explorer', 'Explorer')} and the ${h.a('model:grand-cherokee', 'Grand Cherokee')}; the ${h.a('travel-trailer-weight', 'travel trailer weight guide')} helps size a camper for a ${K.lb(fwdMax)} limit.</p>
`,
  faqs: [
    { q: `Which Telluride trims are rated above ${K.lb(fwdMax)}?`, a: `Only the X-Pro trims with all-wheel drive: the ${xproTrims.join(' and ')} in Kia's ${y.year} specifications, at ${K.lb(y.max)}. Every other trim and every front-wheel-drive Telluride reads ${K.lb(fwdMax)}. The X-Pro rating first appears in the ${firstHigh} page; earlier Tellurides are rated ${K.lb(fwdMax)} whatever the trim.` },
    { q: `Is there a ${y.year + 1} Telluride towing figure on this site?`, a: `Not yet. The newest Kia document read for this site is the ${y.year} specification page from Kia's newsroom, so the checker covers ${first} to ${y.year}. For a ${y.year + 1} Telluride, read the rating in the owner's manual or on the vehicle documents, and use the ${y.year} figures only as a guide.` },
    { q: 'Does all-wheel drive change what a Telluride can pull?', a: `Only through the X-Pro trims, which Kia lists with all-wheel drive and rates ${K.lb(y.max)}. On the other trims Kia prints ${K.lb(fwdMax)} for both drives. All-wheel drive adds curb weight, and Kia prints a higher GVWR for it, ${K.lb(xp.gvwr!)} against ${K.lb(lx.gvwr!)}, so the room left for people differs by only ${K.lb(room(lx) - room(xp))} between the X-Pro and the front-wheel-drive LX.` },
  ],
  related: ['model:explorer', 'model:grand-cherokee', 'model:tahoe', 'suv-towing-capacity', 'payload-capacity', 'travel-trailer-weight'],
  trailer: 4500,
});
