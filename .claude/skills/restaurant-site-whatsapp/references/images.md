# Images: generate with Higgsfield, find online, or use real photos

Ask the user which source they want (it is part of the artistic-direction brief). Whatever
the source, every photo on the site must share **one look**: same light, same angle family,
same background, same color grade. Ten consistent average photos beat ten great mismatched ones.

## What to produce

| Image | Ratio | Export size | Where |
|-------|-------|-------------|-------|
| Hero | 4:5 (portrait) | 1600 × 2000 | `images/hero.webp` |
| About / place | 4:5 | 1200 × 1500 | `images/about.webp` |
| Each dish | 4:3 | 800 × 600 | `images/dishes/<dish-id>.webp` |
| Social share (og:image) | 1.91:1 | 1200 × 630 | `images/og.jpg` |

Convert to WebP (quality ~78) before use, e.g. with `npx sharp-cli` or `cwebp`. Keep each
dish image under ~120 KB and the hero under ~300 KB.

## Option A: generate with Higgsfield

1. **Write a house style block once**, from the confirmed artistic direction, and reuse it
   word for word in every prompt. Example for "Terrasse Médina":
   > editorial food photography, natural late-afternoon sunlight, soft shadows, served on
   > handmade terracotta and white zellige-glazed ceramics, warm lime-plaster table
   > surface, shallow depth of field, 45-degree angle, warm and calm color grade, no text,
   > no people's faces, no hands
2. **Per dish:** `<dish description from data.js, plating, garnish> + <house style block>`.
   Be concrete about what is really served (portion, garnish, the dish it comes in).
3. **Test first.** Generate 2 or 3 dishes with `generate_image_batch`, show them, adjust
   the style block, then do the rest. Use `models_explore(action: "recommend")` if unsure
   which model to use, and keep the same model and settings for the whole set.
4. **Best quality: start from real photos.** If the restaurant can send phone photos of
   its dishes, upload them (`media_upload`) and use them as references, so the generated
   image keeps the real plating while getting better light and background.
5. Upscale (`upscale_image`) only the hero if needed.

**Honesty rule:** dish photos must show what the guest will actually receive. Generated
images are fine when they faithfully represent the real dish; replace them with real
photos when they become available, and never invent dishes or portions. If the user wants a
visible note, add a small "Photos non contractuelles / Suggested presentation" line under
the menu (common practice in Morocco and France).

## Option B: find images online

- Only use images with a license that allows commercial use: **Unsplash** and **Pexels**
  (free, no attribution required but appreciated). Never take images from Google Images,
  Instagram or other restaurants' sites.
- Search with the house style words ("moroccan tagine top view natural light", "rooftop
  terrace marrakech sunset"), and keep only images that match each other.
- Write down the source URL of every image in `images/CREDITS.md`.
- Stock photos rarely match the real dishes: prefer them for atmosphere (hero, about) and
  use real or generated photos for dishes.

## Option C: the restaurant's own photos

Ask for the originals (not screenshots from Instagram). Shoot tips to send them: daylight
near a window, same table and plates for every dish, phone at 45° or straight overhead, no
flash. Then crop to the ratios above and color-match them.

## Alt text

Every image gets a short, real description (`alt`): "Tajine d'agneau aux pruneaux et
amandes" not "image" or "plat".
