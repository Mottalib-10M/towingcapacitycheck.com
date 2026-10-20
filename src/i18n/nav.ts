import { route, type Locale } from './routes';
import { GUIDES, guideById, modelPageById, MODEL_PAGES, modelPageId } from '../lib/pages';
import { modelOf, fullName } from '../lib/data';
import type { Group } from '../lib/page-types';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const CORE: Record<string, string> = { home: 'Towing capacity checker', method: 'Sources and method', about: 'About', widget: 'Embed the checker', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Legal notice', cookies: 'Cookies' };
export const GROUPS: Array<{ id: Group; label: string }> = [
  { id: 'compare', label: 'Compare vehicles' },
  { id: 'ratings', label: 'Weight ratings' },
  { id: 'hitching', label: 'Hitching up' },
];
export const label = (id: string, _lang?: Locale) => {
  if (CORE[id]) return CORE[id];
  const g = guideById(id); if (g) return g.nav;
  const s = modelPageById(id); if (s) return `${fullName(modelOf(s.id))} towing capacity`;
  return id;
};
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id) });
export const inGroup = (g: Group, lang: Locale): NavLink[] => GUIDES.filter((p) => p.group === g).map((p) => link(p.id, lang));
const vehicles = (lang: Locale): NavLink[] => MODEL_PAGES.map((p) => ({ href: route(modelPageId(p.id), lang), label: fullName(modelOf(p.id)) }));
export function navCategories(lang: Locale): NavCategory[] {
  return [{ label: 'Vehicles', links: vehicles(lang) }, ...GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length)];
}
export const navDirect = (lang: Locale): NavLink[] => [link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [
  ...GROUPS.map((g) => ({ label: g.label, links: inGroup(g.id, lang) })).filter((c) => c.links.length),
  { label: 'This site', links: ['home', 'method', 'about', 'contact', 'editorial', 'widget', 'terms', 'privacy', 'cookies'].map((i) => link(i, lang)) },
];
/** Every vehicle page from the footer: one click from any page (RECETTE §18.2). */
export const popularLinks = (lang: Locale): NavLink[] => vehicles(lang);
