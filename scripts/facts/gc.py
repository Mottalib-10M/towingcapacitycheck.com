"""Jeep Grand Cherokee (two-row, gas) ratings from the Stellantis media specification sheets.
Typed from the sheets' "TRAILER TOWING" and "WEIGHTS (ESTIMATES)" tables; run: python3 -I scripts/facts/gc.py"""
import json
B = "https://media.stellantisnorthamerica.com/view-spec.do?id="
W = {  # trim: (gvwr, curb, payload) 2WD, 4WD, as printed (identical in the four sheets for the trims listed)
 "2WD": {"Laredo": (6050, 4238, 1280), "Limited": (6050, 4266, 1260), "Overland": (6050, 4451, 1160), "Summit": (6050, 4475, 1190)},
 "4WD": {"Laredo": (6050, 4365, 1240), "Limited": (6050, 4413, 1260), "Overland": (6050, 4721, 1210), "Summit": (6050, 4784, 1160)},
}
YEARS = {  # year: (spec id, title, towing page, weights page, trims printed, engines)
 "2024": (25137, "2024 Jeep Grand Cherokee Specifications", 8, 5, ["Laredo", "Limited", "Overland", "Summit"], ["3.6L Pentastar V6"]),
 "2025": (26340, "2025 Jeep Grand Cherokee Specifications", 8, 5, ["Laredo", "Limited", "Overland", "Summit"], ["3.6L Pentastar V6"]),
 "2026": (27148, "2026 Jeep Grand Cherokee (ICE) Specifications", 9, 7, ["Laredo", "Limited", "Summit"], ["3.6L Pentastar V6", "2.0L Hurricane turbo I4"]),
 "2027": (28007, "2027 Jeep Grand Cherokee Specifications", 11, 8, ["Laredo", "Limited", "Summit"], ["3.6L Pentastar V6", "2.0L Hurricane turbo I4"]),
}
out = {"id": "grand-cherokee", "make": "Jeep", "model": "Grand Cherokee", "class": "midsize SUV", "years": {}}
for y, (sid, title, tp, wp, trims, engines) in YEARS.items():
    configs = []
    for drive in ("2WD", "4WD"):
        for t in trims:
            g, c, p = W[drive][t]
            configs.append({"engine": " or ".join(engines), "drive": "4x2" if drive == "2WD" else "4x4", "cab": None,
                            "trimBox": t, "bed": None, "wheelbase": "116.7 in", "axle": "3.45", "package": None,
                            "gcwr": None, "conventional": 6200, "fifthWheel": None, "gooseneck": None,
                            "gvwr": g, "payload": p, "baseWeight": c, "gawrFront": None, "gawrRear": None,
                            "page": tp, "note": f"GVWR, curb weight and payload: weights table p. {wp} (estimates, as labelled by the maker)"})
    out["years"][y] = {"source": {"title": title, "url": B + str(sid), "copy": None, "pages": f"{wp}, {tp}", "read": "2026-10-20"},
                       "maxConventional": 6200, "maxFifthWheel": None, "maxGooseneck": None, "maxPayload": max(c["payload"] for c in configs),
                       "maxTongueWD": None, "maxTongueWC": None,
                       "notes": ["Max. Gross Trailer Weight 6,200 lbs., 2WD and 4WD, 3.45 axle ratio.",
                                 "Payload is the maximum allowable weight of driver, passengers, cargo and options, rounded to the nearest 10 lbs.",
                                 "Curb weight includes standard equipment and full quantities of fuel, lubricant and coolant.",
                                 "Two-row gas models only; Grand Cherokee L and 4xe have their own sheets."],
                       "configs": configs}
json.dump(out, open("data/facts/grand-cherokee.json", "w"), indent=1, ensure_ascii=False)
print("ok", list(out["years"]))
