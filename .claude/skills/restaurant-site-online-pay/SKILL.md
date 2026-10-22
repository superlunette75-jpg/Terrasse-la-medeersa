---
name: restaurant-site-online-pay
description: Builds a beautiful restaurant website with photos of the dishes, online ordering, payment from the phone (card, Apple Pay / Google Pay via CMI in Morocco or Stripe, plus cash on delivery) and delivery or pickup (tier 3). Includes a small Node server that recomputes prices, handles payment callbacks and notifies the restaurant (Telegram / webhook). Use when the user wants guests to order and pay online with delivery, "paiement en ligne", "commande et livraison", "payer par carte". For WhatsApp ordering without payment use restaurant-site-whatsapp; for a menu-only site use restaurant-site-menu.
---

# Restaurant site, tier 3: photos + online order + payment + delivery

Everything from tier 2 (photos, cart, delivery zones, location sharing, multilingual),
but the order goes to the restaurant's own server instead of WhatsApp:
- the guest pays **now by card / Apple Pay / Google Pay** or chooses **cash on delivery**,
- the server recomputes prices from `data.js` (the browser can't change a price),
- the payment provider confirms the payment to the server, then the restaurant is notified,
- the guest lands on a confirmation page that follows the payment status.

**The other tiers:** no photos, no ordering → `restaurant-site-menu`. Order by WhatsApp,
pay on delivery, no server → `restaurant-site-whatsapp`. If the restaurant has no payment
contract yet, suggest starting with tier 2 or with this tier in cash-only mode.

## Step 0: artistic direction (always first, every time)

Before writing any code, **ask the user what artistic direction they want**, using the brief
in `references/art-direction.md` (AskUserQuestion, two rounds, including photography).
Suggest the presets that fit, accept their own ideas, write the direction back in a few
lines and get a "yes" before building. Never skip it.

## Step 1: collect the content and the business setup

Content: same as tier 2 (menu with prices, photos plan, address, hours, story, languages).

Business (ask; see `references/payments-delivery.md`):
- **Payment provider:** Moroccan company → CMI through their bank (do they already have a
  "vente à distance" contract?); company abroad → Stripe; none yet → cash only for now.
- **Delivery:** own drivers / courier; zones and fees; free-delivery threshold; minimum
  order; delivery time; pickup too?
- **Where orders arrive:** Telegram group (simplest), or a Make/Zapier webhook to WhatsApp,
  e-mail or a printer.
- **Legal info** for the footer: company name, ICE/RC, terms of sale, refund and privacy
  policy (required by the bank for CMI).
- **Hosting:** a Node host with HTTPS (Render, Railway, Fly.io, VPS).

## Step 2: images

Follow `references/images.md` (Higgsfield with one house style block, test 2 or 3 first;
or royalty-free; or the restaurant's photos). Dish photos must look like what's served.

## Step 3: build from the template

1. Copy `template/` into the project folder (e.g. `site/`): the static site (`index.html`,
   `success.html`, `styles.css`, `cart.css`, `data.js`, `cart.js`, `app.js`, `checkout.js`,
   `images/`) and `server/` (`server.mjs`, `.env.example`).
   Script order: `data.js` → `cart.js` → `app.js` → `checkout.js`.
2. Tokens, fonts and signature detail from the direction, in `styles.css` (and the font link
   in both HTML files).
3. `data.js`: content, a **fixed `id` on every dish** (orders refer to it), images,
   `ordering` (modes, zones, fees, minimum) and `payments.methods`
   (`["card", "cash"]`, or `["cash"]` until the provider is live).
4. `server/.env` from `.env.example`: provider keys, `PUBLIC_URL`, notification channel.
   Add `server/.env` and `server/orders.json` to `.gitignore`.
5. Add the legal pages and link them in the footer.

## Step 4: check

- `node server/server.mjs`, open `http://localhost:8787`, screenshot 390px and 1440px.
- Cash order end to end → success page shows "confirmed", notification printed/sent.
- Card in **test mode** (Stripe test keys / CMI test gateway): success, failure, back
  button. Stripe locally: `stripe listen --forward-to localhost:8787/api/stripe/webhook`.
- Send a tampered price and a forged callback: both must be refused.
- Language switch, RTL if Arabic, no console errors.

## Step 5: deliver

Screenshots, remaining TODOs, what the owner must do (bank contract, keys, webhook URL,
Telegram bot), hosting steps from `references/payments-delivery.md`, and a go-live checklist.
Never put real keys in the repository or in chat.
