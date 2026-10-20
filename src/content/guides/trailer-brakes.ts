import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const B = P.brakes as Array<{ who: string; above: number; _source: string }>;
const ford = B.find((b) => /^Ford/.test(b.who))!;
const gmBig = B.find((b) => /Silverado/.test(b.who))!;
const gmOther = B.find((b) => /Other Chevrolet/.test(b.who))!;
const APPLIES: Array<[typeof ford, string[]]> = [
  [ford, ['f-150', 'f-250', 'expedition', 'explorer', 'ranger', 'maverick']],
  [gmBig, ['silverado-1500', 'tahoe']],
  [gmOther, ['colorado']],
];
const none = ['ram-1500', 'ram-2500', 'grand-cherokee', 'telluride'];
const xplNote = K.Y('explorer').notes.find((n) => /electric trailer brakes/.test(n)) ?? '';
const low = Math.min(...B.map((b) => b.above));
const high = Math.max(...B.map((b) => b.above));
const ex = 3200;
const and = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

export default defineGuide({
  id: 'trailer-brakes',
  group: 'hitching',
  order: 35,
  slug: 'trailer-brakes',
  nav: 'Trailer brakes',
  card: 'The trailer weight above which Ford and Chevrolet require brakes on the trailer.',
  title: `Trailer Brakes ${P.year}: When the Vehicle Makers Require Them`,
  description: `Trailer brakes ${P.year}: Ford asks for them above ${K.lb(ford.above)} loaded, Chevrolet above ${K.lb(gmBig.above)} with a Silverado or Tahoe. State laws set their own limits; check both.`,
  h1: 'Trailer brakes: the weight above which your trailer needs its own',
  intro: 'Enter the loaded trailer weight: the calculator tells you, maker by maker, whether its towing guide requires the trailer to have its own brakes.',
  resume: `Above a certain loaded weight, a trailer must brake itself rather than lean on the tow vehicle. Ford's towing guide says separate, functional trailer brakes should be used for trailers weighing more than ${K.lb(ford.above)} loaded, for every model it covers. Chevrolet's trailering guide sets ${K.lb(gmBig.above)} for the Silverado, Suburban and Tahoe and ${K.lb(gmOther.above)} for its other models, such as the Colorado. Those are the makers' conditions for their own vehicles; they sit alongside state law, and each state sets its own threshold and equipment rules, sometimes lower, so read both and follow the stricter one. Most travel trailers, all fifth wheels and many boat and utility trailers are far above these figures once loaded. Electric brakes also need a brake controller in the tow vehicle, and Ford warns against towing a trailer with electric brakes without one. Use the loaded weight, never the dry weight, to decide.`,
  body: (h) => `
<h2>The makers' thresholds</h2>
<p>The table gives each rule as printed and the vehicles covered here to which it applies. Ford states its rule on page 6 of its ${h.src('ford_2026', 'towing guide')}, Chevrolet on page 6 of its ${h.src('gm_2026', 'trailering guide')}.</p>
${h.table(['Maker rule', 'Brakes required above', 'Vehicles on this site'], APPLIES.map(([b, ids]) => [b.who, K.lb(b.above), ids.map((id) => h.a(`model:${id}`, K.name(id))).join(', ')]), 'Trailer weight above which the vehicle maker requires trailer brakes.', ['l', 'r', 'l'])}
<p>The Ram and Jeep charts and the Kia specification pages we read for the ${and(none.map(K.name))} do not state a trailer brake threshold, so the site gives none for them; their owner's manuals are the place to look. Kia's page, for instance, gives towing capacities but no brake or hitch condition.</p>
<h2>Why a light threshold</h2>
<p>A vehicle's brakes are sized for its own GVWR, not for the extra mass of a trailer pushing from behind. Without trailer brakes, every pound of trailer has to be stopped by the tow vehicle's tires and pads, and the stopping distance grows with the trailer's weight. The thresholds are low, ${K.lb(low)} to ${K.lb(high)}, because the penalty starts early: a small utility trailer with a heavy load can cross them. Weigh a loaded trailer at least once before deciding it is light enough to go without.</p>
${h.mini('camper', { t: 'Loaded weight, not dry weight, decides', d: { dw: 2400, wa: 0, gr: 500, gv: ex } })}
<h2>Controllers and the Explorer note</h2>
<p>Most travel trailers use electric drum brakes, driven by a brake controller in the tow vehicle that sends current in proportion to the braking you apply. Ford's Explorer notes ${/brake controller/.test(xplNote) ? 'warn that certain states require electric trailer brakes above a set weight, and that a trailer with electric brakes should not be towed unless an aftermarket electronic brake controller is fitted' : 'cover the brake controller'} (${h.doc('explorer', undefined, 'Ford guide')}, p. 39). Set the controller's gain with the trailer loaded, on a dry road at low speed, so that the trailer slows the rig without locking its wheels. Boat trailers often use surge brakes instead, which a hydraulic actuator in the coupler applies as the trailer pushes against the hitch; they need no controller, but check that your vehicle maker allows them.</p>
<p>Before each trip, plug in the trailer connector and check that the controller sees the brakes, then test them at walking pace in a parking lot: the rig should slow as soon as you press the pedal or squeeze the manual lever. Brakes that went unused over a winter often need their magnets, shoes and wiring inspected, and a trailer whose brakes do not work is, for the maker's rule, a trailer without brakes.</p>
<h2>State law sits on top</h2>
<p>The makers' figures are conditions of the vehicle's ratings, not traffic law. Each state sets its own weight above which a trailer must have brakes, and many add a breakaway device that applies the trailer brakes if the trailer comes loose. Those limits differ from state to state and from the makers' figures, and you are bound by the state you are driving in. Read the vehicle code of your state, and of the states on your route, then follow the stricter of the state rule and the maker rule.</p>
<h2>Putting it together</h2>
<p>Take an example loaded trailer of ${K.lb(ex)}. It is above every threshold in the table, so it needs working brakes and, if electric, a controller. Check the tongue next, at ${P.tongue.conventional.min} to ${P.tongue.conventional.max}% of the trailer, ${K.lb(ex * P.tongue.conventional.min / 100)} to ${K.lb(ex * P.tongue.conventional.max / 100)}, and the payload. The ${h.a('travel-trailer-weight', 'travel trailer weight page')} turns a brochure figure into a loaded one, the ${h.a('hitch-class', 'hitch class page')} gives the hitch it calls for, and the ${h.a('home', 'checker')} runs the full test.</p>
`,
  faqs: [
    { q: 'At what weight does Ford require trailer brakes?', a: `Above ${K.lb(ford.above)} loaded. Ford's ${P.year} towing guide says separate, functional brakes should be used for trailers heavier than that, for all the models it covers, from the Maverick to the Super Duty. State law may set a different threshold, and the stricter of the two applies to you.` },
    { q: 'Does a Silverado need trailer brakes on a 1,800 lb trailer?', a: `Not by Chevrolet's rule, which asks for trailer brakes above ${K.lb(gmBig.above)} for the Silverado, Suburban and Tahoe. Your state may still require them at that weight, so check its vehicle code. Weigh the trailer loaded: a light utility trailer with a full load can pass ${K.lb(gmBig.above)} quickly.` },
    { q: 'Do I need a brake controller for trailer brakes?', a: 'For electric brakes, yes: the controller in the tow vehicle sends the current that applies them, and Ford warns against towing an electric-braked trailer without one. Surge brakes, common on boat trailers, work from the trailer pushing against the hitch and need no controller, but check that your vehicle maker allows them.' },
  ],
  tool: 'brakes',
  toolArg: { tw: ex },
  related: ['travel-trailer-weight', 'hitch-class', 'tongue-weight', 'weight-distribution-hitch', 'fifth-wheel-vs-gooseneck'],
  sources: ['ford_2026', 'gm_2026'],
});
