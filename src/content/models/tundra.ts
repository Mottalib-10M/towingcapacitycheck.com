import { defineModel } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import type { Row } from '../../lib/data';

const ID = 'tundra';
const y = K.Y(ID);
const years = K.years(ID);
const first = years[years.length - 1];
const top = K.top(ID);
const isMax = (r: Row) => !!r.e?.includes('MAX');
const sr = y.rows.find((r) => r.pk === 'SR')!;
const hyTop = y.rows.filter(isMax).sort((a, b) => b.t! - a.t!)[0];
const cap = y.rows.find((r) => r.pk === 'Capstone')!;
const pro = y.rows.find((r) => r.pk === 'TRD Pro')!;
const left = top.gcwr! - top.cw! - top.t!;
const gasTwin = y.rows.find((r) => !isMax(r) && r.d === hyTop.d && r.cab === hyTop.cab && r.tb === hyTop.tb && r.pk === hyTop.pk)!;
const sameAll = years.every((yr) => K.max(ID, yr) === y.max && K.Y(ID, yr).rows.length === y.rows.length);
const grades = [...new Set(y.rows.map((r) => r.pk!))];
const crew4 = y.rows.filter((r) => r.d === '4x4' && r.cab === 'CrewMax' && !isMax(r));
const crew4Max = Math.max(...crew4.map((r) => r.t!));
const crew4Min = Math.min(...crew4.filter((r) => r.pk !== 'SR').map((r) => r.t!));

export default defineModel({
  id: ID,
  order: 15,
  title: `Tundra Towing Capacity 2026: ${first} to ${y.year} by Grade and Bed`,
  description: `Toyota Tundra towing capacity 2026: ${K.lb(y.max)} at best, ${K.lb(sr.t!)} on the SR, ${K.lb(hyTop.t!)} for the hybrid, by cab, bed and grade from Toyota's own spec sheets.`,
  h1: `Toyota Tundra towing capacity, ${first} to ${y.year}`,
  intro: `Choose your Tundra's model year, engine, drive, cab, bed and grade: the checker reads Toyota's rating for it and tests your trailer against the rating, the payload, the GVWR and the GCWR.`,
  resume: `Toyota's ${y.year} Tundra product information prints ${K.num(y.rows.length)} towing ratings, one per engine, cab, bed, drive and grade. The highest is ${K.lb(y.max)}, for the ${top.pk} ${top.cab} ${top.d} with the ${top.tb} and the i-FORCE twin-turbo V6. Every SR is rated ${K.lb(sr.t!)}, whatever the cab or bed, because Toyota gives the SR a lower GCWR. The i-FORCE MAX hybrid tops out at ${K.lb(hyTop.t!)} on the ${hyTop.pk} ${hyTop.cab} ${hyTop.d}, and the Capstone reads ${K.lb(cap.t!)}. ${sameAll ? `The ${years.slice().reverse().join(', ').replace(/, (\d+)$/, ' and $1')} sheets print the same ratings.` : ''} Toyota also prints the GCWR by grade, a curb weight range, the GVWR and a payload for each grade and bed, which lets the checker test the whole rig. The ${y.year + 1} Tundra has a newsroom page but no product information sheet yet, so it is not in the tables.`,
  body: (h) => `
<h2>Grade decides more than engine</h2>
<p>The Tundra has two engines, the i-FORCE twin-turbo V6 and the i-FORCE MAX hybrid built on it, and Toyota's table puts the grade beside each figure (${h.doc(ID, y.year, `${y.year} product information`)}). The spread inside one engine is wide. On the gasoline truck, the SR reads ${K.lb(sr.t!)} in every body, while the SR5 reaches ${K.lb(y.max)}. The reason is printed on the next page: the SR has a gross combined weight rating of ${K.lb(sr.gcwr!)}, the other grades ${K.lb(top.gcwr!)}. Above the SR5, each step up in grade adds weight and takes a little rating away. The table covers ${K.num(grades.length)} grades: ${grades.join(', ')}.</p>
${h.mini('cap', { t: 'Tundra maximum by model year', p: ['y'], d: { m: ID } })}
<h2>Cab, bed and drive</h2>
<p>The Double Cab with the 6.5 ft bed is the lightest long body and carries the best figure. The CrewMax, with its larger rear cabin, gives up a few hundred pounds, and four-wheel drive takes off more. On a gasoline CrewMax 4x4, the ratings run from ${K.lb(crew4Min)} to ${K.lb(crew4Max)} once the SR is set apart. The 8.1 ft long bed exists only on the Double Cab, and only for the SR and SR5. The 5.5 ft short bed exists only on the CrewMax. Find your bed length on the window sticker or with a tape: it changes the line the checker reads.</p>
<h2>The GCWR leaves almost nothing</h2>
<p>Toyota prints the curb weight as a range for each cab and bed, and the site keeps the upper end. On the top line, ${K.lb(top.gcwr!)} of GCWR minus ${K.lb(top.cw!)} of truck minus the ${K.lb(top.t!)} trailer leaves ${K.lb(left)}. That is less than the weight of the driver, so a Tundra at its full rating is already at or over its GCWR with one person aboard and no cargo, unless the actual truck weighs less than the upper figure. The rating follows SAE J2807, which counts a driver; the curb weight range covers options. In practice, plan the trailer around the GCWR and your own weighed truck, not around the headline.</p>
${h.mini('gcwr', { t: 'Tundra: trailer left under the GCWR', d: { gc: top.gcwr!, cw: top.cw! } })}
<h2>Hybrid, TRD Pro and Capstone</h2>
<p>The hybrid gets a higher GCWR, printed from ${K.lb(hyTop.gcwr!)}, but weighs up to ${K.lb(hyTop.cw! - gasTwin.cw!)} more than the same gasoline body, so its best figure, ${K.lb(hyTop.t!)}, stays below the gasoline SR5. The TRD Pro is rated ${K.lb(pro.t!)} in the detailed table while the summary row of the same sheet prints a lower 4x4 CrewMax maximum; the site keeps the detailed line and says so in its note. The Capstone, with the lowest GCWR of the hybrids, ${K.lb(cap.gcwr!)}, reads ${K.lb(cap.t!)}. Compare with the ${h.a('model:f-150', 'F-150')}, the ${h.a('model:silverado-1500', 'Silverado 1500')} and the ${h.a('model:ram-1500', 'Ram 1500')}, and read the ${h.a('weight-distribution-hitch', 'weight distribution hitch guide')} before towing near ten thousand pounds.</p>
`,
  faqs: [
    { q: 'Why does the Tundra SR tow so much less than the SR5?', a: `Toyota prints a lower gross combined weight rating for the SR, ${K.lb(sr.gcwr!)} at the low end against ${K.lb(top.gcwr!)} for the SR5, and rates every SR at ${K.lb(sr.t!)}. The engine is the same twin-turbo V6. An SR bought for a large travel trailer is the wrong truck; check the grade on the window sticker before you buy.` },
    { q: 'Does the Tundra hybrid tow more than the gas Tundra?', a: `Not at the top. The best i-FORCE MAX line is ${K.lb(hyTop.t!)}, on the ${hyTop.pk} ${hyTop.cab} ${hyTop.d} with the ${hyTop.tb}, while the gasoline SR5 Double Cab 4x2 reaches ${K.lb(y.max)}. The hybrid has a higher GCWR but weighs more. Grade for grade, on the Limited and Platinum CrewMax 4x2, the hybrid is rated a little higher than the gasoline truck.` },
    { q: `Is there a ${y.year + 1} Tundra towing chart on this site?`, a: `Not yet. Toyota's newsroom has a ${y.year + 1} Tundra page, but on October 21, 2026 it linked no product information sheet, and the site only publishes ratings printed by Toyota. The ${first} to ${y.year} sheets all print the same figures, which suggests the ${y.year + 1} truck will be close, but confirm it in the owner's manual.` },
    { q: 'How much tongue weight can a Tundra take?', a: `Toyota's sheet prints the maximum tongue weight by column: ${y.notes.find((n) => n.startsWith('Maximum tongue'))?.match(/([\d,]+) lbs\./)?.[1] ?? ''} lb for the 4x2 Double Cab, a tenth of its best rating, and slightly less for the other bodies. The payload printed for your grade and bed must also absorb the tongue, the hitch and everyone aboard.` },
  ],
  related: ['model:f-150', 'model:silverado-1500', 'model:ram-1500', 'model:tacoma', 'truck-towing-capacity', 'gvwr-vs-gcwr'],
  trailer: 8000,
});
