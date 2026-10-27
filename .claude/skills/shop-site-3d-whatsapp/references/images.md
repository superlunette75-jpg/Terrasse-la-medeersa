# 3D product images with Higgsfield

## Settings that worked (Mootea, Oct 2026)

- Tool: `mcp__Higgsfield__generate_image_batch`, then `jobs_wait` (≤15 s per poll).
- Model `gpt_image_2_5`, `quality: "high"`, `background: "transparent"`,
  `aspect_ratio: "4:5"` for products, `"1:1"` for decor objects.
- Cost ≈ 0.5–1 credit per image (check once with `generate_image` + `get_cost: true`).
- **Rate limit: 4 concurrent jobs.** A batch of 12 returns 8 × `429 rate_limit_reached`.
  Submit 4, wait, save URLs, submit the next 4. Write code while they render.
- Result URLs contain a timestamp: save each `key url` line to `urls.txt` immediately.
- PNGs come back with real alpha; `scripts/fetch-images.sh` trims the empty margin
  and writes ~35–90 KB WebP (hero ~110 KB).

## Prompt = subject + shared style block

Subject first, then the **same** style block for every product so the set matches:

```
A single 3D rendered bubble tea drink: <what is in the cup, colours, layers, toppings>,
in a clear plastic bubble tea cup with sealed lid and a thick straw, slightly tilted 3/4
hero angle, glossy stylized 3D product render, soft studio lighting with warm orange rim
light, crisp reflections, subtle condensation droplets, playful premium look, isolated
single object, fully transparent background, no text, no logo
```

Adapt the container line to the shop: "on a small kraft paper plate", "in a glass
juice bottle", "in a paper coffee cup with brown lid", "a single glazed donut"…
Change the rim-light colour to the brand accent ("warm orange", "pink", "mint").

Decor objects (About section corners, Top-seller cards), 4 of them, tied to the products:
```
A playful cluster of floating 3D tapioca pearls … / A playful 3D strawberry with floating
slices … / Playful 3D mango cubes and a mango half … / A 3D bamboo matcha whisk next to a
bowl of frothy matcha …, glossy stylized 3D render, soft studio lighting with warm orange
rim light, isolated object, fully transparent background, no text
```

## How many

- One image per **distinct look**, not per menu line: 58 Mootea drinks → 36 images
  (e.g. all 5 hot drinks share one coffee cup; "Pomelo Double" reuses pomelo tea).
- `hero` = the signature product (export it as key `hero` for the larger size).
- 4 decor keys: `decor-*` → set `COPY.aboutDecor` and the `DECOR` map in Top sellers.

## Checks

- Make a contact sheet (`montage public/drinks/*.webp -background '#F6E3CF' -geometry 140x170+4+4 -tile 9x sheet.jpg`)
  and look at it: same angle, same light, nothing cropped, no text/logos.
- Generated images show a suggested presentation; keep the "Images are illustrative"
  footnote and offer to swap in real photos (same file name).
