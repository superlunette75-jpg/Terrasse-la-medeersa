# Online payment and delivery

## Flow

```
menu → cart → order drawer (details + payment choice)
  ├─ card  → POST /api/orders → server recomputes prices → payment page (CMI or Stripe)
  │          → provider confirms to the server (callback/webhook) → order "paid"
  │          → restaurant notified → guest sees success.html
  └─ cash  → POST /api/orders → order "confirmed" → restaurant notified → success.html
```

The browser only sends dish **ids and quantities**. The server reads prices from the same
`data.js`, so a guest can't change a price, and the menu has one source of truth.

## Choosing the payment provider (ask the user)

| Situation | Provider | Notes |
|-----------|----------|-------|
| Restaurant is a Moroccan company, Moroccan guests | **CMI** | Contract through the restaurant's bank (Attijariwafa, BMCE/Bank of Africa, Banque Populaire, CIH…), "vente à distance" contract. Accepts Moroccan and international Visa/Mastercard. Expect ~3 to 6 weeks to activate and ~1.5 to 3% per transaction, plus a possible integration fee. |
| Company registered in a country where Stripe operates (EU, UK, US…) | **Stripe Checkout** | Card, Apple Pay and Google Pay on one hosted page, fastest to set up. Stripe reportedly doesn't onboard companies under Moroccan law: check before promising it. |
| Not ready yet | **Cash only** | Set `payments.methods: ["cash"]`; switch on card later without touching the design. |

These figures come from Moroccan e-commerce guides (Kolonell, 2026) and should be confirmed
with the bank. Cash on delivery still makes up a large share of orders in Morocco, so
**always keep cash as an option** next to card.

"Pay from the phone": both CMI and Stripe pages are mobile-friendly; Stripe shows Apple Pay
/ Google Pay automatically when the device supports it (Apple Pay needs the domain verified
in the Stripe dashboard).

### Stripe setup
1. `PAYMENT_PROVIDER=stripe`, `STRIPE_SECRET_KEY` in `server/.env`.
2. Dashboard → Webhooks → endpoint `https://<site>/api/stripe/webhook`, events
   `checkout.session.completed` and `checkout.session.expired` → copy the signing secret
   into `STRIPE_WEBHOOK_SECRET`.
3. Test with test keys and card `4242 4242 4242 4242`.

### CMI setup
1. The bank gives `clientid`, a **store key** and the gateway URLs (test and production),
   with the CMI merchant kit.
2. `PAYMENT_PROVIDER=cmi`, `CMI_CLIENT_ID`, `CMI_STORE_KEY`, `CMI_GATEWAY_URL`.
3. CMI calls `https://<site>/api/cmi/callback` server-to-server; the server checks the
   hash (SHA-512 "ver3"), the amount and `ProcReturnCode == "00"`, then answers
   `ACTION=POSTAUTH`. The customer comes back through `/api/cmi/ok` or `/api/cmi/fail`.
4. **Check the field names and the callback answers against the kit the bank gives you**:
   the template follows the common 3D_PAY_HOSTING integration, but kits differ by version.
5. The bank requires legal pages before going live: terms of sale (CGV), refund policy,
   privacy policy, company details (ICE, RC, address). Add them to the footer.

## Delivery

Ask the user how they deliver:

- **Own driver(s):** use `ordering.delivery.zones` (neighbourhoods with a fee each) or a
  flat fee, plus `freeFrom` and `minOrder`. "Share my location" sends a Google Maps link,
  which matters in a medina.
- **Courier/partner:** same setup; the notification goes to whoever dispatches.
- **Marketplace (Glovo…):** they bring their own app and commission; the site can link to
  the Glovo page as an extra button but this template doesn't integrate with it.

Show delivery time honestly ("30 to 45 min") in `ordering.note` or the drawer hint, and
turn ordering off outside opening hours if the user wants (the server can refuse orders
by checking `SITE.hours`).

## How the restaurant receives orders

The server prints each order and can send it to:

- **Telegram** (free, instant, recommended to start): a bot from @BotFather posts every
  order in a group the staff shares. `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- **Any webhook** (`NOTIFY_WEBHOOK_URL`): a Make / Zapier / n8n scenario can forward to
  WhatsApp, e-mail, Google Sheets or a ticket printer. Sending to WhatsApp directly needs
  the WhatsApp Business Platform (Cloud API) with an approved message template, so it's
  easier through one of those tools.

Paid orders are notified only once the payment is confirmed; cash orders immediately.

## Hosting

The server is a single dependency-free Node file. Host it on any Node host (Render,
Railway, Fly.io, a small VPS) with HTTPS, and set `PUBLIC_URL` to the real address.
On serverless platforms (Vercel, Netlify), move each route into a function and replace
the `orders.json` file with a database. Never commit `server/.env` or `orders.json`.

## Before going live

- Run a real order end to end in test mode for each method (card success, card failure,
  cash), on a phone.
- Check that a forged callback is refused and that the notification arrives.
- Check the legal pages, the minimum order, the zones and fees with the owner.
