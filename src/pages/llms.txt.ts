/** llms.txt (RECETTE §21), generated from the page registry. */
import { GUIDES, MODEL_PAGES, modelPageId } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS, label } from '../i18n/nav';
import { MODELS } from '../lib/data';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> Towing capacity of ${MODELS.length} US trucks and SUVs, copied row by row from the makers' own towing guides and specification sheets (Ford RV and Trailer Towing Guide, Chevrolet Trailering Guide, Ram and Jeep charts, Kia specifications, Toyota product information sheets), with the model year and the page of each figure, and a checker that tests a reader's trailer against the trailer rating, tongue weight, payload, GVWR and GCWR. Independent site published by Radif Partners; no dealer, no lead form. Last updated ${LAST_UPDATED}.`, '',
    '## Vehicles', ...MODEL_PAGES.map((s) => `- [${label(modelPageId(s.id))}](${SITE_URL}${route(modelPageId(s.id), 'en')}): ${s.intro}`), '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...GUIDES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## About', `- [How the figures are read and checked](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
