/**
 * One page = ONE content file (CONTRIBUTING-PAGES.md):
 *  - a topic or comparison page with its calculator: `src/content/guides/<id>.ts` (GuideDef);
 *  - a vehicle page: `src/content/models/<model id>.ts` (ModelDef), its tables generated from src/data/towing.json.
 * Routes, menus, footer, sitemap, schemas and internal links read these files alone.
 */
import type { Kit } from './kit';

export interface FAQ { q: string; a: string }
export interface MiniOpts { /** title */ t?: string; /** ids of the fields shown */ p?: string[]; /** default values */ d?: Record<string, number | string>; /** link text */ c?: string }

export interface Helpers extends Kit {
  /** Internal link by page id ("tongue-weight", "model:f-150", "method"). Unknown id = failed test. */
  a: (id: string, text: string) => string;
  /** Table; numbers are formatted, strings are inserted as HTML. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Link to a source of params-2026.json (key), with optional text. */
  src: (key: string, text?: string) => string;
  /** Link to any official URL already read. */
  ext: (url: string, text: string) => string;
  /** Link to the maker's document of a model year, its title as text unless given: doc('f-150', 2026). */
  doc: (model: string, year?: number, text?: string) => string;
  /** Ruled note. */
  box: (title: string, html: string) => string;
  /** Inline mini-simulator built on a calculator of tool-specs.ts: `${h.mini('tongue', { t, d: { tw: 7000 } })}`. */
  mini: (kind: string, opts?: MiniOpts) => string;
}

export type Group = 'compare' | 'ratings' | 'hitching';

export interface GuideDef {
  id: string; group: Group; order: number;
  /** URL segment, lowercase and dashes, no year. */
  slug: string;
  nav: string; card: string;
  /** 50 to 60 characters, key term first, year included (RECETTE §11). */
  title: string;
  /** 150 to 160 characters, year included. */
  description: string;
  h1: string; intro: string;
  /** ONE paragraph of 120 words or more: the direct answer with the figures (RECETTE §21). */
  resume: string;
  faqs: FAQ[];
  body: (h: Helpers) => string;
  /** Calculator at the top: a key of tool-specs.ts. */
  tool: string;
  /** Default values of that calculator for this page. */
  toolArg?: Record<string, number | string>;
  related: string[];
  /** Keys of params-2026.json > sources. */
  sources: string[];
}
export const defineGuide = (p: GuideDef): GuideDef => p;

export interface ModelDef {
  /** = file name = model id of src/data/towing.json ("f-150"). */
  id: string;
  order: number;
  title: string; description: string; h1: string; intro: string; resume: string;
  body: (h: Helpers) => string;
  faqs: FAQ[];
  related: string[];
  /** Default trailer weight of the page's checker (lb). */
  trailer?: number;
}
export const defineModel = (s: ModelDef): ModelDef => s;
