import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Row } from '../../lib/data';

const ID = 'silverado-1500';
const y = K.Y(ID);
const y24 = K.Y(ID, 2024);
const top = K.top(ID);
const eng = K.engines(ID);
const inc = K.M(ID).included!;
const GI = K.P.gmIncluded;
const low = y.rows.find((r) => r.t === y.min)!;
const plain = y.rows.filter((r) => !r.pk && r.t);
const plainMax = Math.max(...plain.map((r) => r.t!));
const plainTop = plain.find((r) => r.t === plainMax)!;
const mtp = y.rows.filter((r) => r.pk?.startsWith('Max Trailering'));
/** The top truck in its three versions: no package, the package, the package with 20-inch wheels. */
const ladder = y.rows.filter((r) => r.e === top.e && r.d === top.d && r.cab === top.cab && r.tb === top.tb).sort((a, b) => a.t! - b.t!);
const [l0, l1, l2] = ladder;
const turbo = eng.find((e) => e.engine.startsWith('TurboMax'))!;
const v62 = eng.find((e) => e.engine.startsWith('6.2L'))!;
const v53 = eng.find((e) => e.engine.startsWith('5.3L'))!;
const dmax = eng.find((e) => e.engine.startsWith('Duramax'))!;
const zr2 = y.rows.filter((r) => r.n?.includes('ZR2'));
const zr2Max = Math.max(...zr2.map((r) => r.t!));
const gcwrs = [...new Set(y.rows.map((r) => r.gcwr!))].sort((a, b) => a - b);
const curb = (r: Row) => r.gcwr! - r.t! - inc;
const BR = K.P.brakes.find((b) => b.who.startsWith('Chevrolet Silverado'))!;
const AT_MAX = K.P.tongue.atMaxRating.conventional;

export default defineModel({
  id: ID,
  order: 3,
  title: `Silverado 1500 Towing Capacity ${y.year} by Engine and Package`,
  description: `Silverado 1500 towing capacity ${y.year}: ${K.lb(y.min)} to ${K.lb(y.max)} in Chevrolet's guide, how Max Trailering and 20-inch wheels lift the GCWR, and your trailer checked.`,
  h1: `Chevrolet Silverado 1500 towing capacity, ${y.year} guide and earlier`,
  intro: `Select the engine, drive, cab, bed and package of your Silverado: the checker finds that line in Chevrolet's ${y.year} Trailering Guide and tests your trailer against its rating and GCWR.`,
  resume: `In Chevrolet's ${y.year} Trailering Guide the Silverado 1500 is rated between ${K.lb(y.min)} and ${K.lb(y.max)}, over ${K.num(y.rows.length)} lines. The maximum needs the ${top.pk}: it goes to the ${top.e} ${top.d} ${top.cab} with the ${top.tb!.toLowerCase()}, on a GCWR of ${K.lb(top.gcwr!)}. Without any package the best Silverado is the ${plainTop.e} ${plainTop.cab} ${plainTop.d} at ${K.lb(plainMax)}, so the package is worth thousands of pounds on the same truck. Chevrolet derives each rating from the GCWR: GCWR minus curb weight minus ${K.num(GI.driver)} lb each for a driver and a front passenger. Every extra passenger, cooler or bed load therefore comes straight out of the trailer you may pull. The ${turbo.engine} four-cylinder tops out at ${K.lb(turbo.max)} and the lowest line, ${K.lb(low.t!)}, is a ZR2. Trailers over ${K.lb(BR.above)} need their own brakes by Chevrolet's rule.`,
  body: (h) => `
<h2>The GCWR is where the number comes from</h2>
<p>Chevrolet's trailer rating is not a figure of its own. The guide gives each Silverado a gross combination weight rating, the most the loaded truck and the loaded trailer may weigh together, then subtracts the curb weight and ${K.num(inc)} lb of people to obtain the figure in the table (${h.doc(ID, y.year, `${y.year} Trailering Guide`)}, p. 7 and pp. ${y.src.pages}). The ${y.year} Silverado lines use only ${K.num(gcwrs.length)} GCWR values, from ${K.lb(gcwrs[0])} to ${K.lb(gcwrs[gcwrs.length - 1])}. Two trucks on the same GCWR differ only by their curb weight, which is why a regular cab with a long bed often out-tows a crew cab with the same engine.</p>
<p>Working backwards from the top line, ${K.lb(top.gcwr!)} minus ${K.lb(top.t!)} minus ${K.lb(inc)} implies a curb weight of ${K.lb(curb(top))}. The tool below starts from those two figures. Replace the curb weight with your scale ticket and the people and cargo with what you really carry: the result is the heaviest trailer the GCWR still allows, which is often below the table.</p>
${h.mini('gcwr', { t: 'Silverado 1500: trailer the GCWR leaves room for', d: { gc: top.gcwr!, cw: curb(top) } })}
<h2>Max Trailering Package and wheel size</h2>
<p>${K.num(mtp.length)} of the ${K.num(y.rows.length)} lines in the ${y.year} table carry the Max Trailering Package, and every rating above ${K.lb(plainMax)} needs it. Follow one truck through the table to see what it changes. The ${top.e} ${top.d} ${top.cab} with the ${top.tb!.toLowerCase()} is rated ${K.lb(l0.t!)} as built, on a GCWR of ${K.lb(l0.gcwr!)}. With the ${l1.pk} it moves to ${K.lb(l1.t!)} (GCWR ${K.lb(l1.gcwr!)}), and with the ${l2.pk} to ${K.lb(l2.t!)} (GCWR ${K.lb(l2.gcwr!)}). The wheels matter because Chevrolet ties the highest GCWR to the 20-inch version in this guide; the lines with 18-inch wheels sit one GCWR step lower.</p>
<p>Tires count too. The ${y24.year} guide's footnotes on p. 27 warn that the available mud-terrain tires change some Crew Cab 4x4 ratings (${h.doc(ID, y24.year, `${y24.year} guide`)}). The ZR2 lines, printed as a separate short-bed 4x4, are rated no higher than ${K.lb(zr2Max)} in ${y.year}. Read the wheel and tire codes on the window sticker before choosing a line.</p>
<h2>Engines from the TurboMax to the Duramax</h2>
<p>The ${dmax.engine} covers the widest span, ${K.lb(dmax.min)} to ${K.lb(dmax.max)}, and holds the top line. The ${v62.engine} follows closely at up to ${K.lb(v62.max)}, while the ${v53.engine} reaches ${K.lb(v53.max)} with the package. The ${turbo.engine} has no Max Trailering lines in the ${y.year} table and stays between ${K.lb(turbo.min)} and ${K.lb(turbo.max)}. These spans are wide enough that the engine alone does not tell you the rating; the cab, bed, drive and package each move it by a few hundred pounds or more. The ${h.a('model:f-150', 'F-150')} and ${h.a('model:ram-1500', 'Ram 1500')} pages show how the other half-tons compare, and the ${h.a('gvwr-vs-gcwr', 'GVWR and GCWR guide')} explains the two ceilings.</p>
<h2>Brakes, tongue and what the guide leaves aside</h2>
<p>Chevrolet asks for trailer brakes on any trailer above ${K.lb(BR.above)} behind a Silverado (${h.src('gm_2026', 'Chevrolet guide, p. 6')}), and for a tongue load of ${K.P.tongue.conventional.min} to ${K.P.tongue.conventional.max}% of the loaded trailer. At the maximum rating the guide caps the conventional tongue at ${AT_MAX}% of the trailer, ${K.lb((top.t! * AT_MAX) / 100)} on the top line. The guide calls its maximum ratings figures for comparison only, since options and cargo reduce them. It also prints fifth-wheel and gooseneck ratings for the Silverado 1500 on pp. 28 to 30, which this page does not reproduce; read them in the guide itself if you plan a bed-mounted hitch. See the ${h.a('trailer-brakes', 'trailer brakes guide')} for the controller side.</p>
`,
  faqs: [
    { q: 'Is the Max Trailering Package worth it on a Silverado 1500?', a: `If the trailer is heavier than ${K.lb(plainMax)}, it is required: no Silverado line above that figure exists without it in the ${y.year} guide. On the ${top.e} ${top.cab} ${top.d} it lifts the rating from ${K.lb(l0.t!)} to ${K.lb(l2.t!)} when paired with 20-inch wheels, because Chevrolet raises the GCWR from ${K.lb(l0.gcwr!)} to ${K.lb(l2.gcwr!)}.` },
    { q: 'How does Chevrolet calculate the Silverado trailer rating?', a: `It starts from the GCWR printed for each line and subtracts the curb weight of the truck plus ${K.num(GI.driver)} lb for the driver and ${K.num(GI.passenger)} lb for a front passenger. Nothing else is counted: no rear passengers, no cargo, no hitch hardware. Each of those reduces the trailer you may tow, pound for pound.` },
    { q: 'What is the towing limit of the Silverado ZR2?', a: `${K.lb(zr2Max)} at most in the ${y.year} Trailering Guide, well under the ${K.lb(y.max)} of the best Silverado. The ZR2 lines are printed without the Max Trailering Package, on a GCWR of ${K.lb(zr2[0].gcwr!)}. Those are the lowest Silverado 1500 ratings in the table, so a ZR2 owner should ignore figures quoted for the model in general.` },
    { q: 'Can the TurboMax four-cylinder Silverado tow a camper?', a: `It is rated ${K.lb(turbo.min)} to ${K.lb(turbo.max)} in the ${y.year} guide, which covers many travel trailers once loaded. Its GCWR is lower than that of the V8 and diesel lines, though, so passengers and cargo cut into the margin faster. Weigh the loaded camper and run your figures through the checker before committing.` },
  ],
  related: ['model:f-150', 'model:ram-1500', 'model:tahoe', 'gvwr-vs-gcwr', 'trailer-brakes', 'truck-towing-capacity'],
  trailer: 9000,
});
