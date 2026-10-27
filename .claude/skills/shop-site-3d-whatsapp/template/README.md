# {{SHOP_NAME}} — online menu + WhatsApp ordering

Built from the `shop-site-3d-whatsapp` skill template.

```bash
npm install
npm run dev     # local
npm run build   # dist/ for any static host (Netlify config included)
```

Edit before going live:
- `src/data/config.ts`: name, WhatsApp number, hours, links, texts, delivery zones, minimum order.
- `src/data/menu.ts`: categories, items, prices, toppings.
- `src/index.css` (top): brand colours and font.
- `public/drinks/`: one transparent WebP per item, plus `hero.webp` and 4 decor images.
