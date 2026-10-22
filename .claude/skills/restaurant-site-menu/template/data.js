/*
 * All the restaurant's content lives here. Edit this file, not the layout.
 * Any text can be a plain string or a per-language object: { fr: "...", en: "...", ar: "..." }.
 * Placeholder content below: replace everything marked "TODO".
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

  // Optional images (skills with photos). Paths are relative to index.html.
  heroImage: "",
  aboutImage: "",

  menu: [
    {
      id: "starters",
      name: { fr: "Entrées", en: "Starters" },
      items: [
        {
          name: { fr: "Zaalouk", en: "Zaalouk" },
          desc: { fr: "Caviar d'aubergine fumée, tomate, cumin", en: "Smoked aubergine, tomato, cumin" },
          price: 45,
          tags: ["veg"],
        },
        {
          name: { fr: "Harira", en: "Harira" },
          desc: { fr: "Soupe de lentilles et pois chiches, dattes", en: "Lentil and chickpea soup, dates" },
          price: 40,
          tags: ["veg"],
        },
      ],
    },
    {
      id: "mains",
      name: { fr: "Plats", en: "Mains" },
      items: [
        {
          name: { fr: "Tajine d'agneau aux pruneaux", en: "Lamb tagine with prunes" },
          desc: { fr: "Amandes grillées, sésame, cannelle", en: "Toasted almonds, sesame, cinnamon" },
          price: 140,
          tags: ["signature"],
        },
        {
          name: { fr: "Couscous aux sept légumes", en: "Seven-vegetable couscous" },
          desc: { fr: "Servi le vendredi et sur demande", en: "Served on Fridays and on request" },
          price: 110,
          tags: ["veg"],
        },
      ],
    },
    {
      id: "desserts",
      name: { fr: "Desserts", en: "Desserts" },
      items: [
        {
          name: { fr: "Pastilla au lait", en: "Milk pastilla" },
          desc: { fr: "Feuilles croustillantes, crème à la fleur d'oranger", en: "Crisp pastry, orange-blossom cream" },
          price: 55,
        },
      ],
    },
    {
      id: "drinks",
      name: { fr: "Boissons", en: "Drinks" },
      items: [
        { name: { fr: "Thé à la menthe", en: "Mint tea" }, price: 25 },
        { name: { fr: "Jus d'orange pressé", en: "Fresh orange juice" }, price: 30 },
      ],
    },
  ],

  // Interface text. Add a key per language you enable.
  ui: {
    navMenu: { fr: "Carte", en: "Menu", ar: "القائمة" },
    navAbout: { fr: "Histoire", en: "Our story", ar: "قصتنا" },
    navVisit: { fr: "Nous trouver", en: "Visit", ar: "زورونا" },
    ctaPrimary: { fr: "Appeler", en: "Call us", ar: "اتصل بنا" },
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
