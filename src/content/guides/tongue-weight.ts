import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const T = K.P.tongue;
const F = K.P.fordTongue;
const ex = 7000;

const num = (x: string | undefined) => Number((x ?? '0').replace(/,/g, ''));
const tunTongue = num(K.Y('tundra').notes.find((n) => n.startsWith('Maximum tongue'))?.match(/([\d,]+) lbs\./)?.[1]);
const tacTongue = num(K.Y('tacoma').rows.find((r) => r.cab === 'XtraCab')?.n?.match(/maximum tongue weight ([\d,]+)/i)?.[1]);
if (!tunTongue || !tacTongue) throw new Error('tongue-weight: Toyota tongue limits not found');

export default defineGuide({
  id: 'tongue-weight',
  group: 'hitching',
  order: 30,
  slug: 'tongue-weight',
  nav: 'Tongue weight',
  card: 'How much of the trailer should rest on the hitch, and how to weigh it.',
  title: `Tongue Weight ${K.P.year}: The 10 to 15% Rule, With a Calculator`,
  description: `Tongue weight ${K.P.year}: makers ask ${T.conventional.min} to ${T.conventional.max}% of the loaded trailer on the hitch, ${T.fifthWheel.min} to ${T.fifthWheel.max}% for a fifth wheel. Enter your trailer to get the range and test it.`,
  h1: 'Tongue weight: how much of the trailer should sit on the hitch',
  intro: 'Enter the loaded trailer weight, and the tongue weight if you have weighed it: the calculator gives the range the makers ask for and tells you whether yours fits.',
  resume: `Tongue weight is the share of a loaded trailer that presses down on the hitch ball. Chevrolet asks for ${T.conventional.min} to ${T.conventional.max}% of the total loaded trailer weight on a conventional hitch, and Ford asks for ${F.conventional}%, so a ${K.lb(ex)} travel trailer should put ${K.lb(ex * T.conventional.min / 100)} to ${K.lb(ex * T.conventional.max / 100)} on the ball. A fifth wheel or gooseneck carries far more, ${T.fifthWheel.min} to ${T.fifthWheel.max}% of the trailer as pin weight, which is why those hitches sit over the rear axle. Too little tongue weight lets the trailer sway; too much unloads the front wheels, lengthens braking and can push the truck over its rear axle rating. The tongue weight also counts as cargo: it comes out of the payload printed on the door pillar, together with the passengers and the hitch hardware. That is the limit owners of half-ton pickups reach first.`,
  body: (h) => `
<h2>What the makers write</h2>
<p>Chevrolet's ${h.src('gm_2026', 'trailering guide')} gives the range of ${T.conventional.min} to ${T.conventional.max}% for a conventional trailer, and adds that at the maximum trailer rating the tongue weight should be ${T.atMaxRating.conventional}% (${T.atMaxRating.fifthWheel}% pin weight for a fifth wheel or gooseneck). Ford computes its tables with ${F.conventional}% on a conventional hitch and ${F.kingPin}% on the king pin, and for light trailers up to ${K.lb(F.lightTrailerUpTo)} sets a maximum of ${K.lb(F.lightTrailerMaxTongue)} on the tongue (${h.src('ford_2026', 'Ford towing guide')}, p. 7). Both makers add that the tongue must not push the vehicle over its rear axle rating or its GVWR.</p>
${h.table(['Loaded trailer', `${T.conventional.min}% tongue`, `${T.conventional.max}% tongue`, `Fifth wheel ${T.fifthWheel.min}%`, `Fifth wheel ${T.fifthWheel.max}%`], [3500, 5000, 7000, 9000, 12000, 15000].map((w) => [K.lb(w), K.lb(w * T.conventional.min / 100), K.lb(w * T.conventional.max / 100), K.lb(w * T.fifthWheel.min / 100), K.lb(w * T.fifthWheel.max / 100)]), 'Tongue and pin weight ranges by loaded trailer weight.', ['l', 'r', 'r', 'r', 'r'])}
<h2>Why both ends of the range matter</h2>
<p>Below ${T.conventional.min}%, the trailer's center of mass sits too close to its axle, and any crosswind or passing truck can start an oscillation that grows with speed. Loading heavy items ahead of the trailer axle is the fix. Above ${T.conventional.max}%, the rear of the truck squats, the headlights aim at the sky and the front tires lose grip, which steering and braking both need. A weight-distributing hitch moves part of that load back to the front axle, but it does not reduce the weight the truck carries: the ${h.a('weight-distribution-hitch', 'weight distribution page')} covers it.</p>
<h2>Tongue limits printed for the hitch itself</h2>
<p>The percentage is only half of the rule; the hitch has a ceiling in pounds as well. Chevrolet allows ${K.lb(K.P.tahoeHitch.wcTongue)} of tongue on a Tahoe with a weight-carrying hitch, which limits the trailer to ${K.lb(K.P.tahoeHitch.wcTrailer)}, and asks for a weight-distributing hitch with sway control above that, up to ${K.lb(K.P.tahoeHitch.maxTongue)} of tongue (${h.src('gm_2026', 'Chevrolet guide')}, p. 41). Ford rates the F-150 receiver at ${K.lb(K.P.f150Hitch.wcTongue)} of tongue as a weight-carrying hitch and ${K.lb(K.P.f150Hitch.wdTongue)} with load bars (${h.src('ford_2026', 'Ford guide')}, p. 19). So a ${K.lb(ex)} trailer at ${T.conventional.max}% passes the share test but already needs the bars on both vehicles. The receiver and the ball mount you bought carry their own stamped ratings, and the lowest figure in the chain is the one that counts. Toyota prints its ceiling beside the rating itself: ${K.lb(tunTongue)} of tongue for the ${h.a('model:tundra', 'Tundra')} 4x2 Double Cab and ${K.lb(tacTongue)} for the ${h.a('model:tacoma', 'Tacoma')} XtraCab, a tenth of each truck's best trailer rating, so a trailer loaded at 15% on its tongue passes Toyota's limit well before it reaches the rating.</p>
<h2>How to weigh the tongue</h2>
<p>A tongue scale reads it directly. A bathroom scale works for light trailers if a short post brings the coupler to towing height. For heavier trailers, a truck stop scale gives three numbers when the rig crosses with the truck's axles on separate pads: weigh once hitched and once with the trailer dropped, and the rise on the truck's axles is the tongue weight. Weigh it loaded as you travel, with water, gear and propane. Weigh it again after any change in the way the trailer is packed: moving a full fresh water tank or a generator from behind the axle to the front changes the tongue weight, and the share you measured last season no longer holds.</p>
<h2>The tongue comes out of the payload</h2>
<p>Every pound on the ball is a pound of cargo for the truck. With ${K.lb(ex * T.conventional.max / 100)} of tongue, a half-ton pickup with a door-label payload of, say, ${K.lb(1800)}, has little left for four people and their bags. Check what remains below, then run the full check on the ${h.a('home', 'towing capacity checker')}.</p>
${h.mini('payload', { t: 'Payload left once the tongue is on', d: { pl: 1800, pp: 500, cg: 150 } })}
`,
  faqs: [
    { q: 'What percentage of trailer weight should the tongue weight be?', a: `${T.conventional.min} to ${T.conventional.max}% of the loaded trailer for a bumper-pull trailer, according to Chevrolet, and ${F.conventional}% in Ford's calculations. Fifth wheels and goosenecks carry ${T.fifthWheel.min} to ${T.fifthWheel.max}% on the pin. Weigh the trailer loaded the way you travel; the dry weight in the brochure says nothing about your own tongue.` },
    { q: 'Is tongue weight part of the payload?', a: 'Yes. The tongue presses on the hitch, which is part of the truck, so it counts as cargo against the payload on the door pillar, together with the passengers, the gear in the cab and bed, and the hitch hardware. On many half-ton pickups the payload runs out before the trailer rating.' },
    { q: 'What happens if the tongue weight is too light?', a: 'The trailer is more likely to sway. With its center of mass close to or behind its axle, a gust or a passing truck can start an oscillation that grows with speed until the driver loses control. Moving heavy items ahead of the trailer axle, not adding more hitch hardware, is the fix.' },
  ],
  tool: 'tongue',
  toolArg: { tw: ex },
  related: ['payload-capacity', 'weight-distribution-hitch', 'travel-trailer-weight', 'fifth-wheel-vs-gooseneck'],
  sources: ['gm_2026', 'ford_2026'],
});
