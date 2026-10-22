# Ordering by WhatsApp

## How it works

1. The guest adds dishes from the menu (add button → quantity stepper).
2. A floating bar shows the number of items and the total: "Voir ma commande · 250 DH".
3. The order drawer: items, delivery / pickup, name, phone, address + "share my location",
   time, note, total with delivery fee.
4. "Envoyer la commande sur WhatsApp" opens WhatsApp with the order already written,
   using WhatsApp's click-to-chat link: `https://wa.me/<number>?text=<message>`.
5. The guest presses Send. The restaurant confirms the timing in the chat and gets paid
   on delivery or at the counter.

No server, no fees, no account: it works on any static host. The restaurant only needs a
WhatsApp (or WhatsApp Business) number.

## The message the restaurant receives

```
*Nouvelle commande · Nom du Restaurant*

2 × Zaalouk · 90 DH
1 × Tajine d'agneau aux pruneaux · 140 DH

Sous-total: 230 DH
Livraison: 20 DH
*Total: 250 DH*

Mode: Livraison
Nom: Amina
Tél: 0612345678
Adresse: Derb X, porte bleue
Position: https://maps.google.com/?q=31.63,-7.98
Pour: Dès que possible

_Paiement à la livraison_
```

It is always written in the staff language (`ordering.staffLang`), whatever language the
guest browses in. `*bold*` and `_italic_` are WhatsApp formatting.

## Configuration (`data.js` → `ordering`)

| Key | Meaning |
|-----|---------|
| `modes` | Any of `"delivery"`, `"pickup"`, `"table"` (first one is selected by default) |
| `minOrder` | Minimum subtotal; the send button stays disabled below it |
| `delivery.fee` | Flat delivery fee |
| `delivery.zones` | Optional list `{ name, fee }`: the guest picks a neighbourhood (Médina, Guéliz, Hivernage…) |
| `delivery.freeFrom` | Free delivery from this subtotal |
| `askLocation` | Shows "share my location" (very useful in a medina where addresses are vague) |
| `staffLang` | Language of the message |

`contact.whatsapp` = the number in international format, digits only (`2126XXXXXXXX`).

## Tips to give the restaurant

- Use **WhatsApp Business** (free): set a greeting message, business hours, an away
  message outside opening hours, and quick replies like "/confirm Your order is confirmed,
  ready in 30 minutes".
- Pin a label "New order" to sort chats.
- Delivery: own driver, or a local courier. Glovo also operates in the main Moroccan
  cities if they want marketplace delivery as well.
- If volume grows, the next step is the online-payment skill (orders with payment,
  notifications to the kitchen).

## Limits (say them honestly)

- The order exists only once the guest presses Send in WhatsApp; the site can't know if
  they did.
- Payment happens offline (cash or card machine on delivery).
- Prices in the message come from the browser; the restaurant checks them in the chat
  (that's normal for this tier).
