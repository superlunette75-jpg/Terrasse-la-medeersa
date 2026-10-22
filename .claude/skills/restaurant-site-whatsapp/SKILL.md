---
name: restaurant-site-whatsapp
description: Builds a beautiful restaurant website with photos of the dishes and ordering by WhatsApp (tier 2) - guests add dishes to a cart, choose delivery or pickup, share their location, and the order is sent pre-written to the restaurant's WhatsApp; payment on delivery or at the counter. No server or fees. Use when the user wants a restaurant site with food photos and "commande sur WhatsApp", delivery or takeaway without online payment. Images can be generated with Higgsfield or found online. For a menu-only site use restaurant-site-menu; for online card payment use restaurant-site-online-pay.
---

# Restaurant site, tier 2: photos + order on WhatsApp

Everything from tier 1 (menu, story, address, hours, multilingual), plus:
- photos of the dishes and the place,
- a cart with quantity steppers and a floating "view order" bar,
- an order drawer: delivery / pickup, delivery zones and fees, minimum order, "share my
  location", time, note,
- "Send order on WhatsApp": opens WhatsApp with the order written out; the guest presses
  Send, the restaurant confirms in the chat. Payment on delivery.

It runs on any static host with no server, no account and no commission.

**The other tiers:** no photos, no ordering → `restaurant-site-menu`. Card payment online +
delivery → `restaurant-site-online-pay`.

## Step 0: artistic direction (always first, every time)

Before writing any code, **ask the user what artistic direction they want**, using the brief
in `references/art-direction.md` (AskUserQuestion, two rounds, including the photography
style and source). Suggest the presets that fit, accept their own ideas, write the direction
back in a few lines and get a "yes" before building. Never skip it.

## Step 1: collect the content

Same as tier 1 (name, promise, menu with prices, address, maps link, hours, phone, story,
languages), plus:
- WhatsApp number that receives orders (international, digits only)
- Delivery or pickup or both; delivery zones and fees, free-delivery threshold, minimum
  order, usual delivery time
- Language the staff wants to read orders in
- Which dishes get a photo (all mains at least; drinks can go without)

## Step 2: images

Follow `references/images.md`: generate with Higgsfield (house style block from the
direction, test 2 or 3 first, then the rest), or royalty-free online images, or the
restaurant's photos. One consistent look; WebP; dish photos must look like what's served.

## Step 3: build from the template

1. Copy `template/` into the project folder (e.g. `site/`): `index.html`, `styles.css`,
   `cart.css`, `data.js`, `cart.js`, `app.js`, `whatsapp.js`, `images/`.
   Script order matters: `data.js` → `cart.js` → `app.js` → `whatsapp.js`.
2. `styles.css` tokens + fonts from the direction (same as tier 1); `cart.css` uses the
   same tokens, so it follows automatically.
3. `data.js`: content, `image` per dish (`images/dishes/<id>.webp`), `heroImage`,
   `aboutImage`, and the `ordering` block (see `references/whatsapp-ordering.md`).
4. Apply the signature detail. Keep the page simple: hero → menu → story → visit.

Design rules: `references/design-system.md`.

## Step 4: check

- Screenshot 390px and 1440px with Playwright; look at them.
- Run a full order on a phone viewport: add, change quantity, switch delivery/pickup,
  zone fee, minimum order, required fields, send → check the WhatsApp text (decode the
  `wa.me` URL) is complete and in the staff language.
- Language switch (and RTL if Arabic), no console errors, images lazy-loaded and light.

## Step 5: deliver

Screenshots, remaining TODOs, hosting (any static host) and the WhatsApp Business tips in
`references/whatsapp-ordering.md` (greeting, away message outside hours, quick replies).
