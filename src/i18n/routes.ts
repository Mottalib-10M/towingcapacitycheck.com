import { makeRouter, type RouteDef } from './routes-core';
import { GUIDES, MODEL_PAGES, modelPageId, modelSlug } from '../lib/pages';
/** English only (United States). The /en/ prefix is kept from the trame (root redirect, checkers). */
export const LOCALES = ['en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
const R = (id: string, slug: string, noindex = false): RouteDef<Locale> => ({ id, paths: { en: `/en/${slug}/` }, ...(noindex ? { noindex } : {}) });
const CORE: RouteDef<Locale>[] = [
  { id: 'home', paths: { en: '/en/' } },
  R('method', 'method'),
  R('about', 'about'),
  R('widget', 'widget', true),
  R('contact', 'contact', true),
  R('editorial', 'editorial-policy', true),
  R('privacy', 'privacy', true),
  R('terms', 'legal-notice', true),
  R('cookies', 'cookies', true),
];
/** Vehicle pages at /en/<model>-towing-capacity/, topic pages at /en/<slug>/. */
export const ROUTES: RouteDef<Locale>[] = [
  CORE[0],
  ...MODEL_PAGES.map((p) => R(modelPageId(p.id), modelSlug(p.id))),
  ...GUIDES.map((p) => R(p.id, p.slug)),
  ...CORE.slice(1),
];
export const { NOINDEX_PATHS, route, altPaths } = makeRouter(LOCALES, ROUTES);
