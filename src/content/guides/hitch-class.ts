import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const C = P.trailerClasses as Array<{ cls: string; name: string; upTo: number | null; hitch: string }>;
const note = (id: string, re: RegExp) => { const n = K.Y(id).notes.find((x) => re.test(x)); if (!n) throw new Error(`${id}: no note ${re}`); return n; };
const grab = (s: string, re: RegExp) => { const m = s.match(re); if (!m) throw new Error(`no ${re} in ${s}`); return Number(m[1].replace(/,/g, '')); };
const classOf = (w: number) => C.find((c) => c.upTo === null || w <= c.upTo)!;
const lastCap = C[C.length - 2].upTo as number;

const mav = note('maverick', /^Hitch receiver/);
const rng = note('ranger', /^Hitch receiver/);
const xpl = note('explorer', /^Hitch receiver/);
const exp = note('expedition', /^Hitch receiver/);
const sd = note('f-250', /^Hitch receiver/);
const expIv = grab(note('expedition', /Class IV/), /over ([\d,]+) lbs/);
const RECV: Array<[string, string, number, number]> = [
  ['maverick', 'receiver', grab(mav, /([\d,]+) lbs\.\//), grab(mav, /lbs\.\/([\d,]+) tongue/)],
  ['ranger', 'rear step bumper', grab(rng, /bumper ([\d,]+)\//), grab(rng, /bumper [\d,]+\/([\d,]+)/)],
  ['ranger', 'receiver', grab(rng, /receiver ([\d,]+) lbs\.\//), grab(rng, /receiver [\d,]+ lbs\.\/([\d,]+) tongue/)],
  ['explorer', 'receiver, weight-carrying', grab(xpl, /hybrid ([\d,]+)\//), grab(xpl, /hybrid [\d,]+\/([\d,]+)/)],
  ['expedition', 'receiver, weight-carrying', grab(exp, /weight-carrying ([\d,]+)\//), grab(exp, /weight-carrying [\d,]+\/([\d,]+)/)],
  ['f-150', 'receiver, weight-distributing', P.f150Hitch.wd, P.f150Hitch.wdTongue],
  ['f-250', 'receiver', grab(sd, /([\d,]+) lbs\.\/[\d,]+ tongue/), grab(sd, /[\d,]+ lbs\.\/([\d,]+) tongue/)],
];
const ex = 6500;

export default defineGuide({
  id: 'hitch-class',
  group: 'hitching',
  order: 32,
  slug: 'hitch-class',
  nav: 'Hitch class',
  card: 'Class I to V by trailer weight, and what the receivers on each vehicle are rated.',
  title: `Hitch Class ${P.year}: Class I to V Hitches by Trailer Weight`,
  description: `Hitch class ${P.year}: Class ${C[0].cls} up to ${K.lb(C[0].upTo ?? 0)}, Class ${C[C.length - 1].cls} above ${K.lb(lastCap)}, per Chevrolet's guide, plus the receiver ratings Ford prints and the class each falls in.`,
  h1: 'Hitch class: which receiver your trailer calls for',
  intro: 'Enter the loaded trailer weight: the calculator returns the minimum hitch class Chevrolet recommends for it, with the limits of every class.',
  resume: `Hitch classes group trailers by loaded weight and tell you the minimum hitch they call for. Chevrolet's trailering guide lists five: Class ${C[0].cls} up to ${K.lb(C[0].upTo ?? 0)}, Class ${C[1].cls} up to ${K.lb(C[1].upTo ?? 0)}, Class ${C[2].cls} up to ${K.lb(C[2].upTo ?? 0)}, Class ${C[3].cls} up to ${K.lb(C[3].upTo ?? 0)}, and Class ${C[4].cls} above that. The first two need only a conventional hitch; from Class ${C[2].cls} a weight-distributing hitch becomes an option, and fifth-wheel and gooseneck hitches appear at Class ${C[3].cls}. The class is a floor, not a permission. The receiver bolted to your vehicle carries its own rating, printed on its label and in the maker's towing guide, and so do the ball mount and the ball. The lowest of those ratings, the vehicle's own trailer rating, and the payload all apply at once. A ${K.lb(ex)} trailer, for example, calls for a Class ${classOf(ex).cls} hitch, which a Ford Explorer receiver rated ${K.lb(RECV[3][2])} cannot provide.`,
  body: (h) => `
<h2>The five classes</h2>
<p>The table follows page 7 of Chevrolet's ${h.src('gm_2026', 'trailering guide')}, which lists the minimum recommended hitch for each trailer class. The tongue columns apply the ${P.tongue.conventional.min} to ${P.tongue.conventional.max}% share Chevrolet asks for to the upper limit of each class, to show the order of magnitude the hitch has to carry.</p>
${h.table(['Class', 'Name', 'Loaded trailer', `Tongue at ${P.tongue.conventional.min}%`, `Tongue at ${P.tongue.conventional.max}%`, 'Hitch types'], C.map((c) => [c.cls, c.name, c.upTo === null ? `above ${K.lb(lastCap)}` : `up to ${K.lb(c.upTo)}`, c.upTo === null ? 'depends on trailer' : K.lb(c.upTo * P.tongue.conventional.min / 100), c.upTo === null ? 'depends on trailer' : K.lb(c.upTo * P.tongue.conventional.max / 100), c.hitch]), 'Trailer classes and the minimum hitch Chevrolet recommends.', ['l', 'l', 'r', 'r', 'r', 'l'])}
<h2>Receivers as the makers rate them</h2>
<p>A receiver is the square tube under the bumper that takes the ball mount. Each vehicle maker rates the one it fits, and Ford prints those ratings next to its towing tables. The class column places each rating in Chevrolet's scheme.</p>
${h.table(['Vehicle', 'Hitch', 'Trailer', 'Tongue', 'Class it reaches'], RECV.map(([id, w, t, tg]) => [h.a(`model:${id}`, K.name(id)), w, K.lb(t), K.lb(tg), `Class ${classOf(t).cls}`]), 'Receiver ratings printed in Ford\'s 2026 towing guide.', ['l', 'l', 'r', 'r', 'l'])}
<p>Two details are easy to miss. The Ranger's rear step bumper is a hitch too, with a much lower rating than the receiver, and Ford forbids towing more than that on the bumper alone. On the F-150, the standard 2-inch receiver is rated ${K.lb(P.f150Hitch.maxNoPack)}, and the reinforced receiver that comes with the Max Tow Axle ${K.lb(P.f150Hitch.maxTowReceiver)} (${h.src('ford_2026', 'Ford guide')}, p. 19); the ${K.lb(P.f150Hitch.wd)} figure in the table is the weight-distributing limit Ford prints for the receiver. Ford's Expedition notes call for the Class IV heavy-duty trailer tow equipment above ${K.lb(expIv)}, which matches Chevrolet's scheme.</p>
<h2>The weakest link sets the class</h2>
<p>A towing set-up is a chain: receiver, ball mount, ball, coupler on the trailer, safety chains. Each piece is stamped or labeled with its own trailer and tongue rating, and the set-up is only as strong as the lowest of them. A Class IV receiver with a ball rated for a lighter trailer is, in practice, a lighter hitch. When you buy a ball mount, match its rise or drop so the trailer sits level, and check that its rating covers your trailer's loaded weight, not its dry weight.</p>
<h2>Trailers near a class boundary</h2>
<p>Classes are set by loaded weight, and loaded weight grows over a season: a fuller water tank, a generator, bikes on the rear bumper. A trailer that weighs just under ${K.lb(C[2].upTo ?? 0)} on the day you buy it can cross into Class ${C[3].cls} by the first long trip. When the weight sits close to a limit, plan for the class above, or weigh the trailer loaded and keep a margin. The same goes for the tongue: the share drifts with the way the trailer is packed, so a hitch chosen at the low end of the ${P.tongue.conventional.min} to ${P.tongue.conventional.max}% range may be overloaded once heavy gear moves forward. Weigh it again after any change in how you load.</p>
${h.mini('tongue', { t: 'Tongue weight the hitch must carry', p: ['tw'], d: { tw: ex } })}
<h2>A class is not a towing capacity</h2>
<p>Fitting a Class ${C[3].cls} receiver to a midsize SUV does not let it tow a Class ${C[3].cls} trailer. The vehicle's rating, set by the maker for its frame, brakes, cooling and GCWR, stays the ceiling, and the payload still has to carry the tongue. Read the class as the minimum hitch for the trailer, then check the vehicle on its own page, such as the ${h.a('model:explorer', 'Explorer')} or the ${h.a('model:f-150', 'F-150')}. Above Class ${C[2].cls}, many vehicles also require the bars covered on the ${h.a('weight-distribution-hitch', 'weight distribution page')}, and at Class ${C[4].cls} the choice between a fifth wheel and a gooseneck is discussed on the ${h.a('fifth-wheel-vs-gooseneck', 'fifth wheel and gooseneck page')}. The ${h.a('home', 'towing checker')} puts the trailer, the tongue and the payload together.</p>
`,
  faqs: [
    { q: 'What hitch class do I need for a 5,000 lb trailer?', a: `Class ${classOf(5000).cls}, ${classOf(5000).name}, by Chevrolet's table: it covers trailers up to ${K.lb(classOf(5000).upTo ?? 0)} with a conventional or weight-distributing hitch. Any heavier and you move to Class ${C[3].cls}. Check that the receiver, ball mount and ball are each rated for the loaded trailer and that the vehicle itself is rated for it.` },
    { q: 'Can I put a bigger hitch class on my vehicle to tow more?', a: 'No. A receiver of a higher class raises the rating of the hitch only, not the trailer rating, payload, GVWR or GCWR the maker set for the vehicle. The lowest of all those limits still applies. The maker\'s towing guide or owner\'s manual gives the rating that counts for your configuration.' },
    { q: 'Is the hitch class printed on the receiver?', a: 'Usually the receiver label gives its maximum trailer weight and tongue weight, sometimes with a weight-carrying and a weight-distributing pair, and often the class as well. Those figures are what matter. If the label is missing or unreadable, the vehicle maker\'s towing guide prints the rating of the factory receiver for each model.' },
  ],
  tool: 'hitch',
  toolArg: { tw: ex },
  related: ['weight-distribution-hitch', 'tongue-weight', 'fifth-wheel-vs-gooseneck', 'trailer-brakes', 'suv-towing-capacity'],
  sources: ['gm_2026', 'ford_2026'],
});
