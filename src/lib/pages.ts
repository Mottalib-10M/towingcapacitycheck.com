/** Registry: every file of src/content/guides and src/content/models is loaded here. */
import type { GuideDef, ModelDef } from './page-types';
import { hasModel, modelOf } from './data';

const base = (file: string) => file.split('/').pop()!.replace(/\.ts$/, '');
const g = import.meta.glob<{ default: GuideDef }>(['../content/guides/*.ts', '!../content/guides/_*.ts'], { eager: true });
export const GUIDES: GuideDef[] = Object.entries(g).map(([f, m]) => {
  if (m.default.id !== base(f)) throw new Error(`${f}: id "${m.default.id}" differs from the file name`);
  return m.default;
}).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
export const guideById = (id: string) => GUIDES.find((p) => p.id === id);

const s = import.meta.glob<{ default: ModelDef }>(['../content/models/*.ts', '!../content/models/_*.ts'], { eager: true });
export const MODEL_PAGES: ModelDef[] = Object.entries(s).map(([f, m]) => {
  if (m.default.id !== base(f)) throw new Error(`${f}: id "${m.default.id}" differs from the file name`);
  if (!hasModel(m.default.id)) throw new Error(`${f}: no data for model ${m.default.id}`);
  return m.default;
}).sort((a, b) => a.order - b.order);
export const modelPageId = (id: string) => `model:${id}`;
export const modelPageById = (pid: string) => MODEL_PAGES.find((p) => modelPageId(p.id) === pid);
export const modelSlug = (id: string) => modelOf(id).slug;
/** The guide named after the calculator when there is one (payload → payload-capacity, tongue → tongue-weight),
 *  else the first guide that carries it: the target of a mini-simulator's link. */
const TOOL_HOME: Record<string, string> = { payload: 'payload-capacity', tongue: 'tongue-weight' };
export const pageOfTool = (kind: string) => (kind === 'tow' || kind === 'cap' ? 'home'
  : GUIDES.find((p) => p.tool === kind && p.id === TOOL_HOME[kind])?.id ?? GUIDES.find((p) => p.tool === kind)?.id);
