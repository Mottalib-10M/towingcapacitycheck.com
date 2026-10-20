# Facts files: one JSON per model, `data/facts/<model-id>.json`

Each rating is copied from the maker's document exactly as printed. No figure is computed,
rounded, guessed or taken from a dealer, a forum or a magazine. If a cell is unreadable or
ambiguous, leave the field `null` and say why in `note`.

```json
{
  "id": "f-150",
  "make": "Ford",
  "model": "F-150",
  "class": "half-ton pickup",            // half-ton pickup | heavy duty pickup | midsize pickup | compact pickup | full-size SUV | midsize SUV
  "years": {
    "2026": {
      "source": {
        "title": "2026 Ford RV & Trailer Towing Guide",
        "url": "www.vdm.ford.com/content/dam/brand_ford/en_us/brand/towing/pdf/2026-Ford-RV-and-Trailer-Towing-Guide.pdf",
        "copy": "https://web.archive.org/web/20251204182631/www.vdm.ford.com/...pdf",   // only if read from an archived copy, else null
        "pages": "18-20",
        "read": "2026-10-20"
      },
      "maxConventional": 13500,          // highest conventional (bumper-pull) rating printed for the year, lbs
      "maxFifthWheel": null,             // highest 5th-wheel rating, heavy duty only
      "maxGooseneck": null,
      "maxPayload": 2455,                // only if printed in the same source (or another official source cited in note)
      "maxTongueWD": null,               // max tongue weight with weight-distributing hitch if printed
      "maxTongueWC": null,               // weight-carrying (no WD) tongue limit if printed
      "notes": ["Ratings assume a 150-lb driver ...", "..."],   // short facts from the guide that change the rating (required package, frontal area, etc.)
      "configs": [
        {
          "engine": "3.5L EcoBoost V6",
          "drive": "4x2",                  // 4x2 | 4x4 | AWD | FWD | RWD
          "cab": "SuperCrew",              // or null for SUVs
          "bed": "5.5 ft",                 // bed length or wheelbase string as printed, or null
          "wheelbase": "145 in",
          "axle": "3.73",                  // axle ratio as printed, or null
          "package": "Max Trailer Tow Pkg", // package required for this row, or null
          "gcwr": 18800,
          "conventional": 13500,           // max loaded trailer weight, conventional
          "fifthWheel": null,
          "gooseneck": null,
          "gvwr": null,
          "payload": null,
          "page": 19,
          "note": null
        }
      ]
    }
  }
}
```

Rules
- One `configs` entry per printed row × column cell group that has its own rating. Keep the
  maker's wording for engines, cabs and packages. Weights are integers in pounds.
- A slash pair such as `15,900/15,800` with footnote means two ratings: keep the first in the
  field and put the footnoted alternative and the footnote text in `note`.
- `maxConventional` must equal the maximum of `configs[].conventional` for the year (check it).
- Record the page number of the PDF (1-based, as counted by the PDF reader) where each row is printed.
