---
name: shop-site-3d-whatsapp
description: Builds a phone-first, app-like shop website in React + TypeScript + Tailwind + Framer Motion with glossy 3D product images (generated with Higgsfield, transparent background), hover/tilt and magnetic effects, a scroll-animated landing page, a full menu with search and category chips, a customise sheet (sizes, options, toppings), Marrakech/city delivery zones, and a cart that sends the order pre-written on WhatsApp (payment on delivery, no server). Use when the user wants a "Mootea-style" site, a bubble tea / coffee / juice bar / dessert / snack / café ordering site, a 3D landing page with WhatsApp orders, or sends a menu photo and asks for a site where people order from their phone. For a classic restaurant site with photos use restaurant-site-whatsapp; for online card payment use restaurant-site-online-pay.
---

# Shop site: 3D landing + menu + WhatsApp ordering

First built for **Mootea** (bubble tea, Marrakech). The `template/` folder is that
site with every brand detail moved into three places, so a new shop means editing
data, not components:

| What | Where |
|---|---|
| Name, WhatsApp, hours, links, every text on the page, delivery zones, min order | `src/data/config.ts` |
| Categories, items, prices (M/L or single), toppings, option lists | `src/data/menu.ts` |
| Colours, title gradient, button gradient, font | top of `src/index.css` (+ Google Fonts link in `index.html`) |
| Product images | `public/drinks/<key>.webp` (+ `hero.webp`, 4 decor images) |

Page order: Hero (giant gradient title, magnetic 3D product) → two marquee rows that
slide with scroll → About (scroll-revealed text, 4 floating 3D decor objects) →
How to order (5 numbered steps on a light panel) → Top sellers (sticky stacking cards)
→ Menu (sticky search + chips, 3D tilt cards, customise bottom sheet) → Delivery
zones + contact + footer. A floating "View order" bar opens the cart / checkout.

## Step 1: gather (ask only for what's missing)

- **Menu**: photo(s) of the printed menu. iPhone HEIC → `scripts/heic-to-jpg.sh <out> [--rotate] files…`
  makes a JPG plus 6 zoomed crops; read the crops to get every name and price right.
  See `references/menu-data.md` for how to map a menu into `menu.ts`.
- **Brand look**: logo / shop photos / Instagram, or "make it look like <brand>". Pick
  colours from the menu or storefront (see `references/theming.md`).
- **WhatsApp number** that receives orders (digits, international). If unknown, keep the
  placeholder and say so loudly in the final message: orders go nowhere until it's set.
- **City + delivery**: zones and fees. If the user says "make up the prices", build a
  plausible grid (cheap centre → expensive outskirts), minimum order, free-delivery
  threshold, and say they're estimates.
- Language of the site and of the WhatsApp message (template is English).

The user's brief is usually enough; don't block on questions. State assumptions at the end.

## Step 2: images with Higgsfield

Follow `references/images.md` (model, exact prompt style block, rate limit, costs).
In short: `gpt_image_2_5`, `quality: "high"`, `background: "transparent"`, `4:5`,
one shared style block; test 3 first, then waves of **4 at a time** (more → HTTP 429).
Save `key url` lines as you go, then `scripts/fetch-images.sh urls.txt <project>/public/drinks`.
One image per distinct flavour/product; items that look the same share an image.

## Step 3: build

```bash
cp -r <skill>/template <project>      # then git init / use the repo
cd <project> && npm install
```
1. `config.ts`: SHOP, COPY (hero title ≤ ~14 characters so it fits one line), OPTIONS
   (turn off ice/sugar/toppings for non-drink shops; rename size labels), ZONES, ORDERING.
2. `menu.ts`: CATEGORIES (pastel `tint` per category, `canBeWarm`), DRINKS (`code`,
   `name`, `cn` optional second-language name, `m`/`l` or `price`, `img`, `desc`),
   TOP_SELLERS (codes), TOPPINGS (`only` restricts an extra to categories).
3. `index.css` theme variables + font; `index.html` title/description/og tags.
4. `TopSellersSection.tsx` has a small `DECOR` map (code → decor image): update it.
5. `npx tsc -b && npx vite build` must be clean.

Keep the code idiom as is (components read config; no brand strings in components).

## Step 4: check on a phone viewport

```bash
npx vite preview --port 4173 &
node <skill>/scripts/test-order.mjs http://localhost:4173/ <scratch>/shots
```
It screenshots every section at 390 px and 1440 px, places a 2-item order, checks the
required-field errors, picks a zone, shares a location, sends, and prints the decoded
WhatsApp message + console errors + horizontal overflow. Look at the screenshots
(montage them) and read the message: prices, extras, fee and total must add up.

Known pitfall: never put Tailwind `translate-*` classes on a Framer `motion` element
(FadeIn): Framer's transform overrides them. Position with a plain wrapper `div`
and put FadeIn inside (that's how the hero cup is done).

## Step 5: deliver

- Commit + push; add a README from `template/README.md` (fill the shop name).
- Hosting: any static host; `netlify.toml` is included (build `npm run build`, publish `dist`).
- Tell the user: WhatsApp placeholder (if any), estimated delivery prices, shared
  images, "images are illustrative" note, and WhatsApp Business tips (greeting, away
  message, quick reply like "/ok Order confirmed, ready in 30 min", "New order" label).
- Limits: the site can't know whether the guest pressed Send in WhatsApp; prices in
  the message come from the browser (staff confirm in the chat); payment is offline.
