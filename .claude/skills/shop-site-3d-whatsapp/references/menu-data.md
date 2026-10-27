# From a menu photo to `menu.ts`

1. Convert/rotate/crop the photos (`scripts/heic-to-jpg.sh`). Menus are often shot
   sideways: try `--rotate` (90° counter-clockwise) if text reads bottom-to-top.
2. Read every crop. Write down per section: code (A1, B2…), name, second-language
   name, prices per size, hot/cold icons, notes ("served cold").
3. Map to the data model:

```ts
CATEGORIES: { id, name, cn, tint, canBeWarm }
  // tint: pastel tile colour (echo the printed menu's section colours)
  // canBeWarm: adds "Warm" to the ice choices (menu shows a hot icon)
DRINKS: { code, name, cn?, cat, m?, l?, price?, img, desc }
  // two sizes → m + l; only a large → l; one price → price
  // desc: one short factual line (what's in it), no marketing claims
TOP_SELLERS: ['A6', 'A7', …]       // from a "Top seller / Recommended" panel, else ask
TOPPINGS: { id, name, price, only? } // toppings + paid swaps (oat milk, syrups…)
ICE_LEVELS / SUGAR_LEVELS            // copy the menu's wording
```

4. Category `id` 'hot' hides the ice choice (hot drinks).
5. Recount: number of items in `menu.ts` = number on the photos. Spot-check 5 prices.
6. Fix obvious typos from the printed menu ("Syurp" → "Syrup") but keep the shop's names.
