# Design and build rules

What the best restaurant sites have in common (Eleven Madison Park, Roman's, NoirNosh,
NKORA and the 2026 roundups): restraint, the menu up front, and the next action always one
tap away. A restaurant site has three jobs, in this order:

1. Make the visitor hungry (direction, type, photos when there are any).
2. Tell them what, where and when (menu, address, hours).
3. Let them act with the least friction (call, book, order).

## Page structure (single page, anchor navigation)

| # | Section | Content | Notes |
|---|---------|---------|-------|
| 1 | Header | Logo/name, 2 to 4 anchor links, language switch, primary button | Sticky, thin, becomes solid on scroll |
| 2 | Hero | Name, one-line promise, primary button, secondary link | At most one screen tall. No carousel |
| 3 | Menu | Category chips + dishes | The heart of the site. See below |
| 4 | About | 2 to 4 sentences + optional image | Short. What makes the place unique |
| 5 | Visit | Address, map link, hours, phone, Instagram | Every item is a tap target (`tel:`, maps, `wa.me`) |
| 6 | Footer | Name, small links, legal | Quiet |

Mobile first: most visitors arrive from Instagram or Google Maps on a phone.

## Menu rules

- Categories as **sticky horizontal chips** that scroll to each section; the active chip
  follows the scroll.
- Each dish: **name**, optional **one-line description** (max ~90 characters), **price**
  aligned to the end of the line. Optional tags: vegetarian, spicy, signature (max 1 to 2).
- Prices: one consistent format, e.g. `85 MAD` or `85 DH`. No decimals unless needed.
- Order categories as the guest eats: starters → mains → desserts → drinks.
- Unavailable dishes: hide them (`available: false`), don't strike them through.

## Technical rules

- **No framework, no build step.** Plain HTML + CSS + a little JS. The templates render
  everything from `data.js`, so editing the menu never means touching the layout.
- Weight: under 100 KB of HTML/CSS/JS (images apart). Load at most 2 font families, with
  `display=swap` and only the weights used.
- Images: WebP or AVIF, max 1600px wide for hero and 800px for dishes, `loading="lazy"`
  below the fold, always `width`/`height` (or `aspect-ratio`) to avoid layout shift.
- Accessibility: contrast ≥ 4.5:1, tap targets ≥ 44px, visible focus, `alt` on every
  image, `prefers-reduced-motion` respected, `lang` and `dir` set on `<html>`.
- SEO: `<title>` = "Name, cuisine, city", meta description, Open Graph image,
  `Restaurant` JSON-LD (the template builds it from `data.js`: address, hours, phone,
  menu URL, price range, cuisine).
- Languages: every text in `data.js` can be a plain string or `{ fr: "...", en: "..." }`.
  The language switch remembers the choice. Arabic switches the page to right-to-left.
- Hosting: any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages). Order and
  payment sites need a host with serverless functions (see the payment skill).

## Motion

Subtle only: fade/slide-in of sections (≤ 300 ms), header shadow on scroll, button
press. All disabled under `prefers-reduced-motion`.

## Before delivering

- Screenshot at 390px (phone) and 1440px (desktop) with Playwright and look at them.
- Check every link: `tel:`, maps, Instagram, WhatsApp, anchors.
- Check each language, and Arabic right-to-left if enabled.
- Lighthouse (or equivalent): performance, accessibility, SEO ≥ 90.
