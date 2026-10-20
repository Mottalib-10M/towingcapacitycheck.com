import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Row } from '../../lib/data';

const ID = 'tahoe';
const y = K.Y(ID);
const years = K.years(ID);
const oldest = years[years.length - 1];
const steady = years.every((yr) => K.max(ID, yr) === y.max && K.min(ID, yr) === y.min);
const top = K.top(ID);
const low = y.rows.find((r) => r.t === y.min)!;
const eng = K.engines(ID);
const dsl = eng.find((e) => e.engine.startsWith('Duramax'))!;
const v53 = eng.find((e) => e.engine.startsWith('5.3L'))!;
const v62 = eng.find((e) => e.engine.startsWith('6.2L'))!;
const isMtp = (r: Row) => !!r.pk?.startsWith('Max Trailering');
const find = (e: string, d: string, mtp: boolean) => y.rows.find((r) => r.e === e && r.d === d && isMtp(r) === mtp)!;
const g53 = { base: find(v53.engine, '4x2', false), pack: find(v53.engine, '4x2', true) };
const gD = { base: find(dsl.engine, '4x2', false), pack: find(dsl.engine, '4x2', true) };
const top4 = find(top.e!, '4x4', true);
const drops = y.rows.filter((r) => r.d === '4x2').map((r) => r.t! - find(r.e!, '4x4', isMtp(r)).t!);
const TH = K.P.tahoeHitch;
const T = K.P.tongue.conventional;
const AT_MAX = K.P.tongue.atMaxRating.conventional;
const maxAt15 = Math.floor((TH.maxTongue * 100) / T.max / 100) * 100;
const inc = K.M(ID).included!;
const curb = top.gcwr! - top.t! - inc;
const BR = K.P.brakes.find((b) => b.who.includes('Tahoe'))!;
const axle = top.ax;

export default defineModel({
  id: ID,
  order: 6,
  title: `Tahoe Towing Capacity ${y.year}: 2WD, 4WD and Hitch Limits`,
  description: `Tahoe towing capacity ${y.year}: ${K.lb(y.min)} to ${K.lb(y.max)} by engine and drive, the ${K.lb(TH.wcTrailer)} limit without load bars, the ${K.lb(TH.maxTongue)} tongue cap and your trailer checked.`,
  h1: `Chevrolet Tahoe towing capacity, ${y.year} and earlier`,
  intro: `Pick the engine, drive and package of your Tahoe: the checker reads that line of Chevrolet's ${y.year} Trailering Guide and tests your trailer, passengers and cargo against it.`,
  resume: `Chevrolet's ${y.year} Trailering Guide rates the Tahoe between ${K.lb(y.min)} and ${K.lb(y.max)}, in a short table of ${K.num(y.rows.length)} lines, all on the ${axle} axle. The maximum goes to the ${top.e} with two-wheel drive and the Max Trailering Package, on a GCWR of ${K.lb(top.gcwr!)}; four-wheel drive costs a little on every engine. The figure that matters most for many owners comes from the hitch, not the table: with a plain weight-carrying hitch the Tahoe may pull only ${K.lb(TH.wcTrailer)} with ${K.lb(TH.wcTongue)} of tongue weight. Above that, Chevrolet requires a weight-distributing hitch and sway control, and caps the tongue at ${K.lb(TH.maxTongue)}. Ratings assume a ${K.num(K.P.gmIncluded.driver)} lb driver and front passenger only, so a full third row comes off the allowance. The top and bottom figures are the same in every guide from ${oldest} to ${y.year}.`,
  body: (h) => `
<h2>Two limits, depending on the hitch</h2>
<p>A Tahoe owner deals with two ceilings. The table gives the rating of the vehicle, from ${K.lb(y.min)} to ${K.lb(y.max)}. A note under it gives the limit of the hitch setup: a weight-carrying hitch, the ball mount on its own, is good for ${K.lb(TH.wcTrailer)} of trailer and ${K.lb(TH.wcTongue)} of tongue weight. Chevrolet requires a weight-distributing hitch and sway control for any tongue heavier than ${K.lb(TH.wcTongue)} (${h.doc(ID, y.year, `${y.year} Trailering Guide`)}, p. ${top.p}). So the last ${K.lb(y.max - TH.wcTrailer)} of the top rating only exist once the load bars are on.</p>
<p>The tongue has its own cap. Chevrolet wants ${T.min} to ${T.max}% of the loaded trailer on the tongue, up to ${K.lb(TH.maxTongue)}, without exceeding the rear axle rating or the GVWR. At ${T.max}%, the cap is reached with a trailer of about ${K.lb(maxAt15)}, below the top rating; at the maximum trailer weight the guide limits the conventional tongue to ${AT_MAX}%. Put your own trailer weight in below to see the range Chevrolet expects; the ${h.a('weight-distribution-hitch', 'weight distribution guide')} explains how the bars spread that load.</p>
${h.mini('tongue', { t: 'Tahoe: tongue weight range for your trailer', d: { tw: top.t! } })}
<h2>Drive, engine and the Max Trailering Package</h2>
<p>Every Tahoe line uses the same ${axle} axle, so the spread comes from the engine, the drive and the package. Four-wheel drive takes ${K.lb(top.t! - top4.t!)} off the top truck and between ${K.lb(Math.min(...drops))} and ${K.lb(Math.max(...drops))} on the others, because it adds weight under the same GCWR. The Max Trailering Package raises the GCWR of the gas V8s, and that is where it pays: the ${v53.engine} with two-wheel drive goes from ${K.lb(g53.base.t!)} to ${K.lb(g53.pack.t!)}. The ${dsl.engine} already carries the higher GCWR without the package, so on the 2WD diesel the rating is ${K.lb(gD.base.t!)} either way. The ${v62.engine} spans ${K.lb(v62.min)} to ${K.lb(v62.max)}; the lowest line, ${K.lb(low.t!)}, is the ${low.e} with ${low.d} and no package.</p>
<p>The standard Heavy-Duty Trailering Package adds an external transmission fluid cooler and an engine oil cooler. Working from the GCWR, ${K.lb(top.gcwr!)} minus ${K.lb(top.t!)} minus ${K.lb(inc)} of people implies a curb weight near ${K.lb(curb)} for the top line; change it to your own figures below.</p>
${h.mini('gcwr', { t: 'Tahoe: trailer allowed by the GCWR', d: { gc: top.gcwr!, cw: curb } })}
<h2>A family SUV with a family aboard</h2>
<p>The rating counts a driver and one front passenger. A Tahoe often travels with a full second and third row, a cargo area full of bags and a roof box, and all of that weight beyond the first ${K.num(inc)} lb comes off the trailer the GCWR allows, while the tongue weight comes off the payload. Trailers above ${K.lb(BR.above)} need their own brakes by Chevrolet's rule (${h.src('gm_2026', 'Chevrolet guide, p. 6')}). ${steady ? `Since the maximum and minimum have not moved between ${oldest} and ${y.year}, a used Tahoe from those years reads the same way.` : ''} For other full-size SUVs, see the ${h.a('model:expedition', 'Expedition')} page, and the ${h.a('suv-towing-capacity', 'SUV towing guide')} for the wider field.</p>
`,
  faqs: [
    { q: 'Can a Tahoe tow without a weight-distributing hitch?', a: `Yes, up to ${K.lb(TH.wcTrailer)} of trailer and ${K.lb(TH.wcTongue)} of tongue weight, according to Chevrolet's ${y.year} guide. Above a ${K.lb(TH.wcTongue)} tongue, a weight-distributing hitch and sway control are required. Since a ${K.lb(TH.wcTrailer)} trailer at ${T.min}% already puts ${K.lb((TH.wcTrailer * T.min) / 100)} on the ball, most campers near that weight call for load bars anyway.` },
    { q: 'Does four-wheel drive reduce Tahoe towing capacity?', a: `Slightly. In the ${y.year} guide the 4WD version of each engine is rated a little below the 2WD version, ${K.lb(top4.t!)} against ${K.lb(top.t!)} for the ${top.e} with the Max Trailering Package. The GCWR stays the same, so the extra weight of the four-wheel-drive hardware comes straight off the trailer rating.` },
    { q: 'Which Tahoe engine tows the most?', a: `The ${top.e}, at ${K.lb(top.t!)} with two-wheel drive and the Max Trailering Package. The ${dsl.engine} reaches ${K.lb(dsl.max)} and the ${v62.engine} ${K.lb(v62.max)}. The gaps are small, a few hundred pounds, so drive and package matter as much as the engine.` },
  ],
  related: ['model:expedition', 'model:silverado-1500', 'model:grand-cherokee', 'weight-distribution-hitch', 'suv-towing-capacity', 'tongue-weight'],
  trailer: 6000,
});
