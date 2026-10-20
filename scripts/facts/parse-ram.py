"""Parse the Ram trailer towing charts (Stellantis media spec sheets) into data/facts/ram-*.json.

Usage: python3 -I scripts/facts/parse-ram.py <dir with the text of the PDFs> <out dir>
The text comes from pypdf (one "=====PAGE n" marker per page). Each chart row is
"<engine> <transmission> <axle ratio> GVWR Payload BaseWeight [Front Rear] GAWR-F GAWR-R [GCW] GCWR MaxTrailer".
Rows are kept as printed; nothing is computed except the yearly maxima.
"""
import json, os, re, sys

SRC = sys.argv[1]; OUT = sys.argv[2]
BASE = "https://media.stellantisnorthamerica.com/view-spec.do?id="
DOCS = {
    "ram-1500": {
        "2024": ("25266-2024_RAM_1500_Towing.txt", 25266, "2024 Ram 1500 Towing Charts"),
        "2025": ("26076-2025_Ram_1500_Towing.txt", 26076, "2025 Ram 1500 Towing Charts"),
        "2026": ("27906-2026_Ram_1500_Towing.txt", 27906, "2026 Ram 1500 Trailer Towing Charts"),
        "2027": ("27018-2027_Ram_1500_Towing.txt", 27018, "2027 Ram 1500 Trailer Towing Charts"),
    },
    "ram-2500": {
        "2025": ("26556-2025_Ram_2500_3500_HD_Towing.txt", 26556, "2025 Ram Heavy Duty Towing Charts"),
        "2026": ("27019-2026_Ram_2500_HD_Towing.txt", 27019, "2026 Ram 2500 Heavy Duty Trailer Towing Charts"),
        "2027": ("27924-2027_Ram_2500_HD_Towing.txt", 27924, "2027 Ram 2500 Heavy Duty Trailer Towing Charts"),
    },
}
NUM = r"\d[\d,]*(?:\.\d+)?"
ROW = re.compile(r"^(.*?)\b(\d\.\d{2})\s+((?:" + NUM + r"\s+){6,10}" + NUM + r")\s*$")
HEAD = re.compile(r"^RAM (1500|2500|3500) (4X2|4X4)\s*(.*?)\s*(?:Trailer Towing Chart)?\s*$")

def n(s):
    return int(round(float(s.replace(",", ""))))

def parse(path, model):
    rows, page, header, buf, notes = [], 0, None, [], []
    for raw in open(path, encoding="utf-8"):
        line = raw.strip()
        if line.startswith("=====PAGE"):
            page = int(line.split()[1]); buf = []; continue
        m = HEAD.match(line)
        if m and "BOX" in line.upper():
            header = (m.group(1), m.group(2), m.group(3).replace("Trailer Towing Chart", "").strip()); buf = []; continue
        if re.match(r"^\d{1,2}\. ", line):
            notes.append((page, line)); continue
        if line.startswith("Rating"):
            buf = []; continue
        r = ROW.match(line)
        if r and header:
            vals = [n(v) for v in r.group(3).split()]
            k = len(vals)
            if k == 9:   gvwr, pay, base, gf, gr, gcwr, mt = vals[0], vals[1], vals[2], vals[5], vals[6], vals[7], vals[8]
            elif k == 10: gvwr, pay, base, gf, gr, gcwr, mt = vals[0], vals[1], vals[2], vals[5], vals[6], vals[8], vals[9]
            elif k == 7: gvwr, pay, base, gf, gr, gcwr, mt = vals[0], vals[1], vals[2], vals[3], vals[4], vals[5], vals[6]
            else:
                raise SystemExit(f"{path} p{page}: {k} numbers: {line}")
            text = " ".join(buf + [r.group(1)]).strip()
            text = re.sub(r"\s+", " ", text)
            text = re.sub(r"\b(SRW|DRW)\s*$", "", text).strip()
            if header[0] == model.split("-")[1]:
                rows.append({"cabLine": header[2], "drive": header[1].lower(), "engineTrans": text,
                             "axle": r.group(2), "gvwr": gvwr, "payload": pay, "baseWeight": base,
                             "gawrFront": gf, "gawrRear": gr, "gcwr": gcwr, "trailer": mt, "page": page})
            buf = []; continue
        if header and line and not re.match(r"^(Engine|Ratio|Base|Weight|Total|Front|Rear|GAWR|GCWR|GCW|Max\.?|Trailer|Trans\.?|Axle|Transmission|SRW/|DRW|202 ?\d)", line):
            buf.append(line)
    return rows, notes

def engine_name(t):
    t = t.upper()
    for key, name in [("6.7L I6 CUMMINS HO", "6.7L Cummins HO turbo diesel I6"), ("CUMMINS", "6.7L Cummins turbo diesel I6"),
                      ("6.4L", "6.4L HEMI V8"), ("HO TWIN", "3.0L Hurricane HO twin-turbo I6"),
                      ("3.0L", "3.0L Hurricane twin-turbo I6"), ("5.7L", "5.7L HEMI V8"), ("3.6L", "3.6L Pentastar V6 eTorque" if "BSG" in t or "ETORQUE" in t else "3.6L Pentastar V6"),
                      ("6.2L", "6.2L supercharged HEMI V8")]:
        if key in t: return name
    return t.title()

for model, years in DOCS.items():
    out = {"id": model, "make": "Ram", "model": "1500" if model == "ram-1500" else "2500",
           "class": "half-ton pickup" if model == "ram-1500" else "heavy duty pickup", "years": {}}
    for year, (fn, sid, title) in years.items():
        rows, notes = parse(os.path.join(SRC, fn), model)
        if not rows: raise SystemExit(f"no rows in {fn}")
        configs = []
        for r in rows:
            cab = r["cabLine"]
            mcab = re.match(r"^(QUAD|CREW|REG|MEGA)(?: CAB)?:?\s*(.*)$", cab)
            cabname = {"QUAD": "Quad Cab", "CREW": "Crew Cab", "REG": "Regular Cab", "MEGA": "Mega Cab"}.get(mcab.group(1)) if mcab else None
            rest = mcab.group(2) if mcab else cab
            box = re.search(r"(W/O[^A-Z]*?)?(\d'\s?\d+\"|\d'\d'\"|\d\" BOX|8'0''|6'4\"|5'7\"|6.4')", rest)
            configs.append({"engine": engine_name(r["engineTrans"]), "engineAsPrinted": r["engineTrans"], "drive": r["drive"],
                            "cab": cabname, "trimBox": rest.strip(), "bed": None, "wheelbase": None,
                            "axle": r["axle"], "package": None, "gcwr": r["gcwr"], "conventional": r["trailer"],
                            "fifthWheel": None, "gooseneck": None, "gvwr": r["gvwr"], "payload": r["payload"],
                            "baseWeight": r["baseWeight"], "gawrFront": r["gawrFront"], "gawrRear": r["gawrRear"],
                            "page": r["page"], "note": None})
        out["years"][year] = {
            "source": {"title": title, "url": BASE + str(sid), "copy": None,
                       "pages": f"1-{max(c['page'] for c in configs)}", "read": "2026-10-20"},
            "maxConventional": max(c["conventional"] for c in configs),
            "maxFifthWheel": None, "maxGooseneck": None,
            "maxPayload": max(c["payload"] for c in configs),
            "maxTongueWD": None, "maxTongueWC": None,
            "notes": [t for p, t in notes][:20],
            "configs": configs,
        }
    json.dump(out, open(os.path.join(OUT, model + ".json"), "w"), indent=1, ensure_ascii=False)
    for y, d in out["years"].items():
        print(model, y, len(d["configs"]), "max", d["maxConventional"], "payload", d["maxPayload"])
