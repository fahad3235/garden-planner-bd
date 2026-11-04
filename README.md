# Garden Planner BD 🌱

An offline, bilingual (English / বাংলা) home vegetable garden planner for Bangladesh.
Plan a 24-plot garden bed, check what to sow each month, and keep a care log — all
stored only in your browser. No account, no server, no network requests.

## Features

1. **Garden bed planner** — a 4×6 grid of 24 plots. Tap a plot, pick a crop and a
   planting date, and the app tracks days left until the expected harvest.
   Harvesting moves the crop into your harvest history; plots can be cleared.
2. **Vegetable library** — 18 common Bangladeshi home-garden vegetables
   (tomato, brinjal, chilli, okra, bottle gourd, cauliflower, spinach, potato …)
   with sowing months, days to harvest, sun and water needs.
3. **Sowing calendar** — pick any month to see which library crops are normally
   sown in Bangladesh that month; the current month is highlighted.
4. **Care log** — record watering, fertilizing, weeding and pest checks with a
   date and an optional note. Future dates are rejected; entries can be deleted.
5. **Data portability** — export a JSON backup, import it back with strict
   validation (wrong app, wrong plot count, unknown crop or care type are all
   rejected), and erase everything only after typing `DELETE`.
6. **Bilingual + mobile** — EN/বাংলা toggle persisted across reloads, Bengali
   digits in Bengali mode, and a layout verified at 390 px width with no overflow.

## Tech stack

- Pure HTML, CSS and vanilla JavaScript — no build step, no dependencies.
- `localStorage` for persistence (`garden-planner-bd-v1` key).
- Pure logic lives in `js/logic.js` and is shared by the app and the node tests.

## Run locally

```bash
# No build needed — open index.html in any browser, or serve it:
python3 -m http.server 8000
# then open http://localhost:8000
```

## Tests

```bash
node tests/logic.test.js   # 21 unit tests for the pure logic
node tests/smoke.mjs       # 14 headless-Chrome smoke checks (needs the cached headless_shell binary)
```

## Limitations

- Sowing months are typical for Bangladesh and vary with local weather, soil and
  variety — this is a planning aid, not agricultural advice.
- Days-to-harvest figures are library averages; real plants vary.
- Data lives in one browser's `localStorage`; use Export to move it elsewhere.
- The bed is a single fixed 4×6 grid (one bed); multi-bed support is not included.

## Status

Working MVP. Ships EMPTY: no plots planted, no care entries, no harvest history —
everything you see after first load is created by you.
