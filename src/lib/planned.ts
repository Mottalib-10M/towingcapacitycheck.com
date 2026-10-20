/** Every page id the site is meant to have. Content tests accept links to these ids while pages are being
 *  written; the "all planned pages exist" test fails until each has its file. */
import { MODEL_IDS } from './data';
export const PLANNED_GUIDES = [
  'towing-capacity-by-vehicle', 'truck-towing-capacity', 'suv-towing-capacity', 'gvwr-vs-gcwr', 'payload-capacity',
  'tongue-weight', 'how-to-calculate-towing-capacity', 'travel-trailer-weight', 'fifth-wheel-vs-gooseneck',
  'axle-ratio-towing', 'weight-distribution-hitch', 'trailer-brakes', 'towing-capacity-chart', 'half-ton-vs-three-quarter-ton',
  'hitch-class',
];
export const PLANNED_MODELS = MODEL_IDS.map((id) => `model:${id}`);
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, ...PLANNED_MODELS]);
