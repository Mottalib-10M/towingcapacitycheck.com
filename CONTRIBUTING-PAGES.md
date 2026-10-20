# Writing a page

One page = one file. Routes, menus, sitemap, schemas, llms.txt and internal links read these files alone.

- Topic page: `src/content/guides/<id>.ts` with `defineGuide` (model: `tongue-weight.ts`).
- Vehicle page: `src/content/models/<model id>.ts` with `defineModel` (model: `f-150.ts`); its tables (by year,
  by engine, every configuration) are generated from the data, the file holds the text only.
- The list of pages the site must have is `src/lib/planned.ts`; links to a planned page are accepted before it exists.

## Figures

Every figure comes from the kit (`src/lib/kit.ts`, documented at its top), never typed by hand:
`K.Y`, `K.max`, `K.min`, `K.top`, `K.engines`, `K.axles`, `K.rank`, `K.P` (params-2026.json, each entry with its
`_source`). Link a maker's document with `h.doc(model, year)` and a source of params with `h.src(key)`.

Ratings are in `data/facts/<model>.json` (one entry per model year: document, URL, archived copy, pages, notes,
and one record per configuration as printed: engine, drive, cab, box or wheelbase, axle, package, conventional,
fifth-wheel and gooseneck ratings, GCWR, GVWR, payload, curb or base weight, page). See `data/facts/SCHEMA.md`.
`python3 -I scripts/build-data.py` builds `src/data/towing.json` and the browser copy `towing-lite.json`.
A vehicle is published only from its maker's own document; no figure from a dealer, a magazine or a forum.

## Rules checked by `npx vitest run tests/pages.test.ts` (PAGE_FILES=id1,model:id2 to test only some)

- title 50 to 60 characters, key term first, 2026, unique; description 150 to 160, 2026, unique;
- `resume`: one paragraph of 120 words or more with the figures (the direct answer);
- body: 500 words of prose for a guide, 380 for a vehicle page, tables apart; at least one `h.mini(...)`;
- 3 to 8 FAQ, answers of 40 to 90 words, questions unique across the site;
- no em or en dash, none of the banned phrases listed in the test; no dealer, no form, no affiliate link.

Then `npm run check` (build and every rule of the factory) must end at 0.
