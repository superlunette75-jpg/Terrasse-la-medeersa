/*
 * All the restaurant's content lives here. Edit this file, not the layout.
 * Any text can be a plain string or a per-language object: { fr: "...", en: "...", ar: "..." }.
 * Placeholder content below: replace everything marked "TODO".
 * Give every dish a fixed `id` before going live: orders and payments refer to it.
 */
window.SITE = {
  name: "Nom du Restaurant", // TODO
  tagline: {
    fr: "Une terrasse calme au cœur de la médina.",
    en: "A quiet terrace in the heart of the medina.",
  },
  cuisine: "Moroccan", // used for SEO (schema.org servesCuisine)
  priceRange: "$$",
  languages: ["fr", "en"], // first one is the default. Add "ar" for Arabic (right-to-left)
  currency: "MAD", // ISO code, used for SEO
  currencyLabel: "DH", // shown next to prices

  contact: {
    phone: "+212600000000", // TODO, international format
    whatsapp: "212600000000", // TODO, digits only, no + or spaces
    email: "",
    instagram: "", // e.g. "https://instagram.com/yourplace"
    address: "Rue Exemple, Médina", // TODO
    city: "Marrakech",
    country: "MA",
    mapsUrl: "https://maps.google.com/?q=Marrakech", // TODO, link to the Google Maps place
  },

  // Days use schema.org codes: Mo Tu We Th Fr Sa Su
  hours: [
    { days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], opens: "12:00", closes: "23:00" },
  ],

  about: {
    fr: "Une cuisine marocaine de saison, servie sur les toits face à la médina. Des recettes de famille, des produits du marché, et le temps de les apprécier.",
    en: "Seasonal Moroccan cooking served on the rooftop facing the medina. Family recipes, market produce, and time to enjoy them.",
  },

  // Images: WebP/AVIF, hero ~1600px wide, dishes 800x600. Paths are relative to index.html.
  heroImage: "images/placeholder.svg", // TODO
  heroAlt: { fr: "La terrasse au coucher du soleil", en: "The terrace at sunset" },
  aboutImage: "images/placeholder.svg", // TODO
  aboutAlt: { fr: "Notre cuisine", en: "Our kitchen" },

  // The main buttons scroll to the menu (where guests add dishes)
  primaryLink: "#menu",

  // Ordering
  ordering: {
    modes: ["delivery", "pickup"], // any of "delivery", "pickup", "table"
    minOrder: 80, // in currency units, 0 for none
    delivery: {
      fee: 20, // flat fee, used when there are no zones
      freeFrom: 300, // free delivery from this subtotal (remove for never)
      // zones: [ { name: { fr: "Médina", en: "Medina" }, fee: 15 }, { name: "Guéliz", fee: 25 } ],
    },
    askLocation: true, // "share my location" button, adds a Google Maps link to the message
    staffLang: "fr", // language of the order notification received by the restaurant
  },

  // Online payment (server/server.mjs does the real work, see server/.env.example)
  payments: {
    methods: ["card", "cash"], // "card" needs PAYMENT_PROVIDER=stripe or cmi; use ["cash"] until it is set up
    endpoint: "/api/orders",
  },

  menu: [
    {
      id: "starters",
      name: { fr: "Entrées", en: "Starters" },
      items: [
        {
          id: "zaalouk",
          name: { fr: "Zaalouk", en: "Zaalouk" },
          desc: { fr: "Caviar d'aubergine fumée, tomate, cumin", en: "Smoked aubergine, tomato, cumin" },
          price: 45,
          image: "images/placeholder.svg", // TODO
          tags: ["veg"],
        },
        {
          id: "harira",
          name: { fr: "Harira", en: "Harira" },
          desc: { fr: "Soupe de lentilles et pois chiches, dattes", en: "Lentil and chickpea soup, dates" },
          price: 40,
          image: "images/placeholder.svg", // TODO
          tags: ["veg"],
        },
      ],
    },
    {
      id: "mains",
      name: { fr: "Plats", en: "Mains" },
      items: [
        {
          id: "lamb-tagine-with-prunes",
          name: { fr: "Tajine d'agneau aux pruneaux", en: "Lamb tagine with prunes" },
          desc: { fr: "Amandes grillées, sésame, cannelle", en: "Toasted almonds, sesame, cinnamon" },
          price: 140,
          image: "images/placeholder.svg", // TODO
          tags: ["signature"],
        },
        {
          id: "seven-vegetable-couscous",
          name: { fr: "Couscous aux sept légumes", en: "Seven-vegetable couscous" },
          desc: { fr: "Servi le vendredi et sur demande", en: "Served on Fridays and on request" },
          price: 110,
          image: "images/placeholder.svg", // TODO
          tags: ["veg"],
        },
      ],
    },
    {
      id: "desserts",
      name: { fr: "Desserts", en: "Desserts" },
      items: [
        {
          id: "milk-pastilla",
          name: { fr: "Pastilla au lait", en: "Milk pastilla" },
          desc: { fr: "Feuilles croustillantes, crème à la fleur d'oranger", en: "Crisp pastry, orange-blossom cream" },
          price: 55,
          image: "images/placeholder.svg", // TODO
        },
      ],
    },
    {
      id: "drinks",
      name: { fr: "Boissons", en: "Drinks" },
      items: [
        { id: "mint-tea", name: { fr: "Thé à la menthe", en: "Mint tea" }, price: 25 },
        { id: "fresh-orange-juice", name: { fr: "Jus d'orange pressé", en: "Fresh orange juice" }, price: 30 },
      ],
    },
  ],

  // Interface text. Add a key per language you enable.
  ui: {
    navMenu: { fr: "Carte", en: "Menu", ar: "القائمة" },
    navAbout: { fr: "Histoire", en: "Our story", ar: "قصتنا" },
    navVisit: { fr: "Nous trouver", en: "Visit", ar: "زورونا" },
    ctaPrimary: { fr: "Commander", en: "Order", ar: "اطلب الآن" },
    ctaSecondary: { fr: "Voir la carte", en: "See the menu", ar: "شاهد القائمة" },
    menuTitle: { fr: "La carte", en: "The menu", ar: "القائمة" },
    aboutTitle: { fr: "Notre histoire", en: "Our story", ar: "قصتنا" },
    visitTitle: { fr: "Nous trouver", en: "Visit us", ar: "زورونا" },
    address: { fr: "Adresse", en: "Address", ar: "العنوان" },
    hours: { fr: "Horaires", en: "Hours", ar: "أوقات العمل" },
    everyDay: { fr: "Tous les jours", en: "Every day", ar: "كل يوم" },
    contact: { fr: "Contact", en: "Contact", ar: "اتصال" },
    directions: { fr: "Itinéraire", en: "Directions", ar: "الاتجاهات" },
    tag_veg: { fr: "Végétarien", en: "Vegetarian", ar: "نباتي" },
    tag_spicy: { fr: "Épicé", en: "Spicy", ar: "حار" },
    tag_signature: { fr: "Signature", en: "Signature", ar: "طبق مميز" },
  },
};
