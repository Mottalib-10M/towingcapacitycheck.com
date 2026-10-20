"""Build src/data/towing.json from data/facts/<model>.json (one file per model, see data/facts/SCHEMA.md).

Run: python3 -I scripts/build-data.py
Each configuration becomes a compact row; nothing is computed except the yearly maxima, which are checked
against the facts file. A model year whose facts carry no row is dropped and reported.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FACTS = os.path.join(ROOT, 'data', 'facts')
OUT = os.path.join(ROOT, 'src', 'data', 'towing.json')

# Display order and page slug of each model (the slug is the page URL segment).
MODELS = [
    ('f-150', 'f-150-towing-capacity'), ('ram-1500', 'ram-1500-towing-capacity'), ('silverado-1500', 'silverado-towing-capacity'),
    ('f-250', 'f-250-towing-capacity'), ('ram-2500', 'ram-2500-towing-capacity'), ('tahoe', 'tahoe-towing-capacity'),
    ('expedition', 'expedition-towing-capacity'), ('grand-cherokee', 'jeep-grand-cherokee-towing-capacity'),
    ('colorado', 'colorado-towing-capacity'), ('ranger', 'ranger-towing-capacity'), ('maverick', 'maverick-towing-capacity'),
    ('explorer', 'explorer-towing-capacity'), ('telluride', 'telluride-towing-capacity'),
]
# Who the maker's rating assumes is aboard (pounds): Ford guide 2026 p. 7 and Chevrolet guide 2026 p. 7, a driver and a
# front passenger at 150 lb each. Ram prints a base weight per row, Jeep and Kia a curb weight: no assumption needed.
INCLUDED = {'Ford': 300, 'Chevrolet': 300, 'Ram': None, 'Jeep': None, 'Kia': None}


def clean(s):
    if s is None:
        return None
    s = str(s).strip()
    return s or None


def num(x):
    if x is None or x == '':
        return None
    return int(round(float(str(x).replace(',', ''))))


def engine(e):
    e = clean(e)
    if not e:
        return None
    m = re.match(r'^(\d\.\dL), (V6|I4)\b', e)  # Kia: "3.8L, V6, Gasoline Direct Injection (GDI) Lambda-II"
    return f'{m.group(1)} {m.group(2)}' if m else e


def label(c):
    parts = [engine(c.get('engine'))]
    body = ' '.join(p for p in [clean(c.get('drive')), clean(c.get('cab')), clean(c.get('trimBox')) or clean(c.get('bed'))] if p)
    if body:
        parts.append(body)
    if clean(c.get('wheelbase')) and not clean(c.get('trimBox')) and not clean(c.get('bed')):
        parts.append(clean(c.get('wheelbase')) + ' WB')
    if clean(c.get('axle')):
        parts.append(clean(c.get('axle')) + ' axle')
    if clean(c.get('package')):
        parts.append(clean(c.get('package')))
    return ' · '.join(p for p in parts if p)


def main():
    out, problems = {'retrieved': '2026-10-20', 'models': []}, []
    for mid, slug in MODELS:
        path = os.path.join(FACTS, mid + '.json')
        if not os.path.exists(path):
            problems.append(f'{mid}: no facts file')
            continue
        f = json.load(open(path, encoding='utf-8'))
        m = {'id': mid, 'slug': slug, 'make': f['make'], 'model': f['model'], 'class': f.get('class'), 'years': []}
        for year in sorted(f['years'], reverse=True):
            y = f['years'][year]
            rows, seen = [], set()
            for c in y.get('configs', []):
                cw = c.get('baseWeight')
                if cw is None and f['make'] == 'Kia' and c.get('note'):
                    mm = re.search(r"maximum '([\d, ]+) lbs", c['note'])
                    cw = mm.group(1).replace(' ', '') if mm else None
                c = {**c, 'baseWeight': cw}
                conv = num(c.get('conventional'))
                fifth, goose = num(c.get('fifthWheel')), num(c.get('gooseneck'))
                if conv is None and fifth is None and goose is None:
                    continue
                r = {
                    'l': label(c), 'e': engine(c.get('engine')), 'd': clean(c.get('drive')), 'ax': clean(c.get('axle')),
                    'pk': clean(c.get('package')), 'tb': clean(c.get('trimBox')) or clean(c.get('bed')), 'cab': clean(c.get('cab')), 'gcwr': num(c.get('gcwr')), 't': conv, 'fw': fifth, 'gn': goose,
                    'gvwr': num(c.get('gvwr')), 'pl': num(c.get('payload')), 'cw': num(c.get('baseWeight')),
                    'rg': num(c.get('gawrRear')), 'p': c.get('page'), 'n': clean(c.get('note')),
                }
                key = json.dumps({k: v for k, v in r.items() if k not in ('p', 'n')}, sort_keys=True)
                if key in seen:
                    continue
                seen.add(key)
                rows.append({k: v for k, v in r.items() if v is not None})
            if not rows:
                problems.append(f'{mid} {year}: no rows')
                continue
            mx = max(r.get('t', 0) for r in rows)
            if num(y.get('maxConventional')) not in (None, mx):
                problems.append(f'{mid} {year}: maxConventional {y.get("maxConventional")} != {mx}')
            rows.sort(key=lambda r: (-(r.get('t') or 0), r['l']))
            src = y['source']
            m['years'].append({
                'year': int(year), 'max': mx,
                'maxFw': max((r.get('fw') or 0) for r in rows) or None, 'maxGn': max((r.get('gn') or 0) for r in rows) or None,
                'maxPl': num(y.get('maxPayload')), 'min': min(r['t'] for r in rows if r.get('t')),
                'src': {'title': src['title'], 'url': src['url'], 'copy': src.get('copy'), 'pages': str(src.get('pages', '')), 'read': src.get('read', '2026-10-20')},
                'notes': y.get('notes', []), 'rows': rows,
            })
        m['included'] = INCLUDED.get(f['make'])
        if m['years']:
            out['models'].append(m)
    json.dump(out, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    # Light copy for the browser: labels in one table, rows as arrays [label, t, gcwr, gvwr, pl, cw, page, axle].
    labels, idx = [], {}
    def li(x):
        if x not in idx:
            idx[x] = len(labels); labels.append(x)
        return idx[x]
    lite = {'L': labels, 'M': []}
    for m in out['models']:
        lite['M'].append({'id': m['id'], 'mk': m['make'], 'md': m['model'], 'in': m['included'], 'Y': [
            {'y': y['year'], 'st': y['src']['title'], 'sp': y['src']['pages'], 'R': [[li(r['l']), r.get('t', 0), r.get('gcwr', 0), r.get('gvwr', 0), r.get('pl', 0), r.get('cw', 0), r.get('p', 0) if isinstance(r.get('p'), int) else 0, r.get('ax', '')] for r in y['rows']]}
            for y in m['years']]})
    json.dump(lite, open(OUT.replace('towing.json', 'towing-lite.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    for m in out['models']:
        print(f"{m['id']:16} " + ' '.join(f"{y['year']}:{y['max']}({len(y['rows'])})" for y in m['years']))
    print(f'{os.path.getsize(OUT)} bytes, lite {os.path.getsize(OUT.replace("towing.json", "towing-lite.json"))} bytes')
    for p in problems:
        print('PROBLEM', p)
    return 1 if any('!=' in p for p in problems) else 0


if __name__ == '__main__':
    sys.exit(main())
