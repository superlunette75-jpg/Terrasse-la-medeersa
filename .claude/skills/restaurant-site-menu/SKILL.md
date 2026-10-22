---
name: restaurant-site-menu
description: Builds a simple, beautiful restaurant website with the menu as real text, no food photos and no online ordering (tier 1, a "site vitrine"). Covers name, menu with categories, story, address, hours, call button, multilingual FR/EN/AR. Use when the user wants a restaurant, café, riad-restaurant or bistro website that shows the menu without photos or ordering, e.g. "site simple avec la carte", "menu website", "carte en ligne". For ordering via WhatsApp use restaurant-site-whatsapp; for online payment and delivery use restaurant-site-online-pay.
---

# Restaurant site, tier 1: menu, no photos, no ordering

A single page that does three things well: makes the place desirable, shows the full menu
as readable text, and makes it easy to call or come. Type, color and space do the work that
photos would do on other sites, so the artistic direction matters even more here.

**The other tiers:** WhatsApp ordering with photos → `restaurant-site-whatsapp`. Online
payment + delivery → `restaurant-site-online-pay`. If the user isn't sure, describe the three
in one line each and let them choose.

## Step 0: artistic direction (always first, every time)

Before writing any code, **ask the user what artistic direction they want**, using the brief
in `references/art-direction.md` (AskUserQuestion, two rounds). Suggest the presets that fit
the restaurant, accept their own ideas, then write the direction back in a few lines and
get a "yes" before building. Never skip this step, even if a direction was used before for
another restaurant.

For this tier, skip the photography question; ask instead whether they have a logo.

## Step 1: collect the content

Ask for (or find on their Google Maps / Instagram page, then confirm):
- Name, one-line promise, cuisine, city, price range
- Full menu: categories, dishes, short descriptions, prices (a photo of the paper menu is
  fine: transcribe it, then have the user check prices)
- Address, Google Maps link, opening hours, phone, WhatsApp, Instagram
- A 2 to 4 sentence story
- Languages (first = default)

Missing items stay as visible `TODO` placeholders; list them at the end.

## Step 2: build from the template

1. Copy `template/` (`index.html`, `styles.css`, `data.js`, `app.js`) into the project
   folder, e.g. `site/`.
2. `styles.css` → set the `:root` tokens (colors, fonts, `--image-shape`) from the direction.
3. `index.html` → replace the Google Fonts link with the chosen pair, set `<title>`,
   meta description, `theme-color` (= `--bg`), Open Graph.
4. `data.js` → all the content. Text can be `"..."` or `{ fr: "...", en: "...", ar: "..." }`.
   Add `"ar"` to `languages` for Arabic (switches to right-to-left automatically).
5. Apply the **signature detail** from the direction (the template has a zellige-dot
   divider and arch-shape variable; replace or remove to match).
6. Keep it simple: no extra sections unless the user asks. Optional, if asked: a
   reservation link (`primaryLink: "https://wa.me/..."` or a booking tool URL).

Design and technical rules: `references/design-system.md`.

## Step 3: check

- Serve the folder (`npx serve site` or `python3 -m http.server`) and screenshot at 390px
  and 1440px with Playwright; look at the screenshots and fix what looks off.
- Test language switch, anchors, `tel:` and maps links, and the menu chip scroll.
- No console errors. Contrast of `--muted` text on `--bg` ≥ 4.5:1.

## Step 4: deliver

Show the screenshots, list remaining TODOs, and propose hosting (Netlify / Vercel /
Cloudflare Pages / GitHub Pages: drag and drop the folder, then connect the domain).
Remind the user to put the site link in the Google Business profile and Instagram bio.
