# Algeria cities import (wilaya/daira)

This backend prefers a full dataset at `src/locations/data/wilaya-dairas.full.json`. If that file is present and non-empty, it is used for `/locations` endpoints. Otherwise, it falls back to the bundled simplified ASCII dataset.

## Source

We recommend using the SQL dump from: `https://github.com/othmanus/algeria-cities/blob/master/sql/ascii/algeria_cities.sql`.

## Target JSON format

An array of objects:

```json
[
  { "wilaya": "Adrar", "dairas": ["Adrar", "Aougrout", "Reggane", "Timimoun"] },
  { "wilaya": "Chlef", "dairas": ["Chlef", "El Karimia", "Oued Fodda", "..."] }
]
```

- Wilaya names should be in ASCII or UTF-8 consistently.
- Daira names must be unique per wilaya.
- Sort order is applied by the API, so input order is not critical.

## Quick conversion with Node.js

Create `src/locations/tools/convert-sql-to-json.mjs` and run it once:

```bash
node src/locations/tools/convert-sql-to-json.mjs "path/to/algeria_cities.sql" "src/locations/data/wilaya-dairas.full.json"
```
