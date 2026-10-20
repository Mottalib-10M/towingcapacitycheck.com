import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const P = K.P;
const W = P.waterLbPerGallon;
const T = P.tongue.conventional;
const area = (id: string) => (K.Y(id).notes.find((n) => /^Frontal area/.test(n)) ?? '').replace(/^Frontal area\s*(\(p\.\s*\d+\))?:?\s*/, '').replace(/\s*\(p\.\s*\d+\)/g, '').replace(/\.$/, '');
const AREA = ['maverick', 'ranger', 'explorer', 'expedition', 'f-150'].filter((id) => area(id));

// Example camper (illustrative figures): dry weight, water, gear.
const dry = 5200, gal = 30, gear = 900;
const water = gal * W;
const loaded = dry + water + gear;
const fits = K.rank().filter((x) => x.y.max >= loaded);
const fitsAll = fits.filter((x) => x.y.min >= loaded);
const short = K.rank().filter((x) => x.y.max < loaded);
const and = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const alt = 7000;

export default defineGuide({
  id: 'travel-trailer-weight',
  group: 'hitching',
  order: 34,
  slug: 'travel-trailer-weight',
  nav: 'Travel trailer weight',
  card: 'From the brochure\'s dry weight to the weight you will really tow.',
  title: `Travel Trailer Weight ${P.year}: Dry vs Loaded, With a Calculator`,
  description: `Travel trailer weight ${P.year}: water adds ${K.dec(W, 2)} lb a gallon, gear and propane the rest. Turn a dry weight into a loaded one and check it against the trailer's GVWR.`,
  h1: 'Travel trailer weight: from dry weight to the weight you tow',
  intro: 'Enter the dry weight from the brochure, the water you carry and your gear: the calculator gives the loaded weight to compare with your vehicle, and the tongue it will put on the hitch.',
  resume: `The weight that counts for towing is the loaded weight of the travel trailer, as it leaves for a trip, not the dry weight printed in the brochure. Dry weight, also called unloaded vehicle weight, is the trailer as built, usually without water, propane, batteries or anything you pack. Fresh water alone adds ${K.dec(W, 2)} lb per gallon, so a ${gal}-gallon tank holds ${K.lb(water)}. Food, bedding, tools, chairs, a generator and the propane tanks add hundreds of pounds more. In the example worked below, a ${K.lb(dry)} dry trailer becomes ${K.lb(loaded)} once loaded, a jump of ${K.dec((loaded - dry) / dry * 100, 0)}%. The trailer's own GVWR, printed on its certification label, is the most it may ever weigh, and it is the safe figure to use when you cannot weigh it. Compare the loaded weight, never the dry one, with your vehicle's rating, and size the tongue at ${T.min} to ${T.max}% of it.`,
  body: (h) => `
<h2>Dry, loaded and GVWR</h2>
<p>A travel trailer carries three weights worth knowing. The dry or unloaded weight is the starting point in brochures. The cargo capacity is what the builder allows you to add. The GVWR is the sum of the two, the most the loaded trailer may weigh, printed with its axle ratings on the certification label that every trailer, like every truck, must carry (${h.src('cfr_567_4', '49 CFR 567.4')}). Options fitted at the factory or by a seller, such as an awning, a second battery or an upgraded air conditioner, are often missing from the brochure's dry weight, so the real starting point is higher. A scale ticket for the loaded trailer settles it.</p>
<h2>Water is the heavy part</h2>
<p>Water weighs about ${K.dec(W, 2)} lb per US gallon at 60 °F, from the density the US Geological Survey gives (${h.src('usgs_water', 'USGS')}). Fresh, gray and black tanks all count when full. Many owners travel with the fresh tank near empty and fill it at the campsite, which is one of the easiest ways to stay inside the ratings.</p>
${h.table(['Water carried (example)', 'Weight', `Tongue share at ${T.min}%`], [10, 20, 30, 40, 50].map((g) => [`${g} gallons`, K.lb(g * W), K.lb(g * W * T.min / 100)]), 'What water adds to the trailer, and to the tongue if carried ahead of the axle.', ['l', 'r', 'r'])}
<p>Where the tank sits matters too. A tank ahead of the trailer axle adds to the tongue weight; a tank behind it lightens the tongue and can push the share below ${T.min}%, which is where sway begins. Check the ${h.a('tongue-weight', 'tongue weight')} both full and empty.</p>
<h2>From the example to a vehicle</h2>
<p>Our example trailer weighs ${K.lb(dry)} dry, carries ${gal} gallons of water and ${K.lb(gear)} of gear, propane and batteries: ${K.lb(loaded)} loaded. Among the vehicles covered, ${fitsAll.length ? `every configuration of the ${and(fitsAll.map((x) => K.name(x.m.id)))} is rated for it` : 'none is rated for it in every configuration'}${fits.length > fitsAll.length ? `, and the ${and(fits.filter((x) => !fitsAll.includes(x)).map((x) => K.name(x.m.id)))} only in some configurations` : ''}. ${short.length ? `The ${and(short.map((x) => K.name(x.m.id)))} cannot pull it at all.` : ''} The tongue would weigh ${K.lb(loaded * T.min / 100)} to ${K.lb(loaded * T.max / 100)}, which the vehicle's payload must absorb along with everyone aboard.</p>
${h.mini('brakes', { t: 'Does this trailer need its own brakes?', d: { tw: Math.round(loaded) } })}
<h2>Height and width count as well</h2>
<p>A travel trailer is a tall box, and Ford limits the frontal area of the trailer for each vehicle, often with a higher figure once the tow package is fitted. The limits printed in Ford's ${h.src('ford_2026', 'towing guide')}:</p>
${h.table(['Vehicle', 'Frontal area limit, as printed'], AREA.map((id) => [h.a(`model:${id}`, K.name(id)), area(id)]), 'Maximum trailer frontal area in Ford\'s 2026 guide.', ['l', 'l'])}
<p>Measure the trailer's height above the road and its width, and multiply. A trailer that fits the weight rating can still exceed the frontal area allowed without the tow package. Altitude takes its share as well: Ford reduces GVW and GCW by ${P.altitude.percentPer1000ft}% per 1,000 ft, so at ${K.num(alt)} ft the GVW and GCW a Ford may reach shrink by ${K.num(P.altitude.percentPer1000ft * alt / 1000)}%, and a rig planned close to its limits at sea level is over them in the mountains.</p>
<h2>Weighing before the first trip</h2>
<p>Load the trailer as you will travel, then cross a public scale twice: once hitched, with the truck's axles and the trailer's axles on separate pads, and once with the truck alone. The trailer's axle reading plus the tongue, which is the rise in the truck's reading once hitched, is the loaded trailer weight; compare it with the trailer's GVWR and with your row on the vehicle page. The ${h.a('how-to-calculate-towing-capacity', 'step-by-step calculation')} and the ${h.a('suv-towing-capacity', 'SUV page')} take it from there.</p>
`,
  faqs: [
    { q: 'How much does a full fresh water tank add to a travel trailer?', a: `${K.dec(W, 2)} lb per US gallon, so a ${gal}-gallon tank adds ${K.lb(water)} and a 50-gallon one ${K.lb(50 * W)}. Gray and black tanks weigh about the same per gallon when full. Traveling with the fresh tank near empty and filling up at the site is a simple way to keep the loaded weight down.` },
    { q: 'Should I use the dry weight or the GVWR of a camper when choosing a tow vehicle?', a: 'The GVWR, or better, the loaded weight from a scale. The dry weight leaves out water, propane, batteries, gear and often dealer options, and campers usually travel hundreds of pounds above it. The GVWR is the most the trailer may ever weigh, so a vehicle rated for it covers any legal load.' },
    { q: 'What is cargo carrying capacity on a travel trailer label?', a: 'It is the weight you may add to the trailer as built: the GVWR minus the weight of the trailer when it left the factory, with full propane in many cases. Water, food, gear and any accessory added later all come out of it. If the label is old, weigh the trailer empty to know what is left.' },
  ],
  tool: 'camper',
  toolArg: { dw: dry, wa: gal, gr: gear },
  related: ['tongue-weight', 'trailer-brakes', 'how-to-calculate-towing-capacity', 'suv-towing-capacity', 'hitch-class'],
  sources: ['usgs_water', 'cfr_567_4', 'ford_2026', 'gm_2026'],
});
