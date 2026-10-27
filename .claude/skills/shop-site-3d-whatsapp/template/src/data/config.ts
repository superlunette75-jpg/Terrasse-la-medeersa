// ─────────────────────────────────────────────────────────────
// SHOP SETTINGS: everything brand-specific lives here, in menu.ts
// and in the theme variables at the top of src/index.css.
// The values below are the Mootea example (bubble tea, Marrakech).
// ─────────────────────────────────────────────────────────────

export const SHOP = {
  name: 'Mootea',
  nativeName: '靡茶', // optional second-script name for the footer ('' to hide)
  kind: 'Bubble tea', // what the shop sells, used in the footer
  city: 'Marrakech',
  // International format, digits only (country code + number without the leading 0).
  // TODO: replace with the shop's real WhatsApp number before going live.
  whatsapp: '212600000000',
  instagram: 'https://www.instagram.com/',
  hours: 'Every day · 11:00 – 23:00',
  openHour: 11, // first and last hour offered in the "When" time picker
  closeHour: 23,
  address: 'Marrakech',
  mapsUrl: 'https://maps.google.com/?q=Mootea+Marrakech',
  currency: 'DH',
  storageKey: 'mootea-cart-v1', // localStorage key for the cart, unique per site
};

export const COPY = {
  nav: { menu: 'Menu', top: 'Top', delivery: 'Delivery', contact: 'Contact' },
  heroTitle: 'Hi, i’m mootea', // keep it short: it is sized to fill one line
  heroTagline: 'Marrakech bubble tea, shaken fresh & delivered to your door',
  heroImage: '/drinks/hero.webp',
  heroImageAlt: 'Mootea brown sugar bubble tea with tapioca pearls',
  aboutTitle: 'About us',
  aboutText:
    "Mootea brews every cup to order in Marrakech: real tea leaves, fresh fruit, house-made brown sugar pearls and silky cheese foam. Pick your size, your ice and your sweetness, and we'll bring it to your door. Let's make your day a little sweeter!",
  aboutDecor: ['/drinks/decor-boba.webp', '/drinks/decor-mango.webp', '/drinks/decor-strawberry.webp', '/drinks/decor-matcha.webp'],
  stepsTitle: 'How to order',
  steps: [
    { name: 'Pick your drinks', desc: 'Browse milk teas, fruit teas, matcha, cheese smoothies and coffee. Tap a drink to add it.' },
    { name: 'Make it yours', desc: 'Medium 500 ml or Large 700 ml, ice level, sweetness from 0% to 100%, and toppings like pearls, pudding or cheese foam.' },
    { name: 'Delivery or pickup', desc: 'Choose your Marrakech neighbourhood to see the delivery fee, or pick it up at the shop.' },
    { name: 'Send on WhatsApp', desc: 'Your order opens in WhatsApp, already written. Press send and we confirm the timing in the chat.' },
    { name: 'Pay on delivery', desc: 'Pay cash to the driver or at the counter. No card, no account, no app to install.' },
  ],
  topTitle: 'Top sellers',
  menuTitle: 'Menu',
  menuSubtitle: 'Medium 500 ml · Large 700 ml · tap a drink to customise',
  searchPlaceholder: 'Search a drink (taro, mango, A5…)',
  menuFootnote: 'Cross-contamination may occur. Please tell us about any food allergy in the order note. Images are illustrative.',
  deliveryTitle: 'Delivery',
  whatsappHello: 'Hello Mootea!',
};

// Which choices the customise sheet shows. Turn off what doesn't apply
// (e.g. a bakery: sizes off, ice off, sugar off, toppings → "extras").
export const OPTIONS = {
  sizeLabels: { M: 'Medium 500 ml', L: 'Large 700 ml' },
  ice: true,
  sugar: true,
  toppings: true,
  toppingsTitle: 'Toppings & extras',
};

// Delivery estimates (placeholder grid, adjust to the real courier prices).
export interface Zone {
  id: string;
  name: string;
  areas: string;
  fee: number;
  eta: string;
}

export const ZONES: Zone[] = [
  { id: 'gueliz', name: 'Guéliz · Hivernage', areas: 'Guéliz, Hivernage, Majorelle, Victor Hugo', fee: 15, eta: '20–30 min' },
  { id: 'medina', name: 'Médina · Kasbah', areas: 'Médina, Kasbah, Mellah, Riad Zitoun, Bab Doukkala', fee: 20, eta: '30–40 min' },
  { id: 'north', name: 'Semlalia · Daoudiate', areas: 'Semlalia, Daoudiate, Issil, Amerchich', fee: 20, eta: '25–35 min' },
  { id: 'west', name: 'Targa · Massira', areas: 'Targa, Massira, Azli, Mhamid, Sidi Ghanem', fee: 25, eta: '35–45 min' },
  { id: 'south', name: 'Agdal · M’hamid', areas: 'Agdal, Route de l’Ourika (city), Izdihar, Sidi Youssef Ben Ali', fee: 25, eta: '35–45 min' },
  { id: 'far', name: 'Palmeraie · outskirts', areas: 'Palmeraie, Route de Fès, Route de Casa, Tamansourt road', fee: 40, eta: '45–60 min' },
];

export const ORDERING = {
  minOrder: 60,
  freeDeliveryFrom: 250,
  pickup: true, // offer "Pickup" next to "Delivery"
};
