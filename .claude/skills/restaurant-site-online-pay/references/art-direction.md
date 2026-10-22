# Artistic direction: brief and presets

Every restaurant site starts with this brief. **Do not write any code until the user has
answered it.** Even if the user has done this before for another site, ask again: each
restaurant gets its own direction.

## 1. The brief (ask with AskUserQuestion, two rounds of up to 4 questions)

### Round 1: feeling and look

1. **The feeling.** "In three words, what should a guest feel in the first three seconds?"
   Offer examples (calm & sunlit / intimate & candlelit / lively & generous /
   refined & quiet), and let the user type their own.
2. **Direction preset.** Offer the 4 presets below that best fit the restaurant and what
   the user has said. The user can also pick "Other" and describe their own, or mix two.
3. **Colors.** Use the preset palette, use the restaurant's existing brand colors (ask for
   hex codes or a logo/photo to sample from), or adjust the preset (warmer, darker, more
   contrast).
4. **Typography.** Use the preset pairing, or pick: classic serif (elegant) /
   modern sans (clean) / expressive display (bold, casual).

### Round 2: content and details

5. **Languages.** Which languages, and which one is default? For Morocco suggest
   FR + EN, with AR optional (the templates support right-to-left).
6. **Signature detail.** One visual detail that makes it theirs, and only one: arch-shaped
   image frames, a fine zellige line divider, a hand-drawn stamp/logo, a texture (lime
   plaster, linen paper), or none (pure minimal).
7. **Photography** (skills with images only). Style: bright natural daylight, warm
   golden hour, moody low-light, top-down flat-lay. Source: generate with Higgsfield,
   find online, or the restaurant's own photos. See `images.md`.
8. **References.** "Any site, Instagram account or place whose look you love?"
   (Optional; open the links and take note of what to borrow.)

Then **write the direction back in 5 to 8 lines** (feeling, palette with hex, fonts,
signature detail, photo style, languages) and ask the user to confirm it before building.
Save it as `art-direction.md` in the project so later changes stay consistent.

## 2. Presets

Each preset is a full direction: palette (as CSS tokens for `template/styles.css`), font
pairing (all on Google Fonts), and the details that sell it. Keep to one accent color.

### A. Terrasse Médina: warm, sunlit, calm
For riads, rooftop terraces and Moroccan houses that want warmth without cliché.
```
--bg: #F4EDE3;  --surface: #FBF7F1;  --ink: #2A211C;  --muted: #7A6A5D;
--accent: #B5532E (terracotta);  --accent-ink: #FFFFFF;  --line: #E2D6C6;
```
Fonts: **Cormorant Garamond** 500/600 for titles + **Manrope** 400/600 for text.
Details: arch-masked images (`border-radius: 999px 999px 0 0`), a thin zellige-star line
between sections, wide letter spacing on small labels. No lanterns, no camel clip-art.

### B. Éditorial Noir: refined, quiet, confident
For chef-driven or gastronomic places. Feels like a printed magazine.
```
--bg: #0E0E0E;  --surface: #171717;  --ink: #F5F2EC;  --muted: #A39E95;
--accent: #B08D57 (brass);  --accent-ink: #0E0E0E;  --line: #2A2A2A;
```
Fonts: **Instrument Serif** for titles (very large) + **Inter** 400/500 for text.
Details: big type, lots of empty space, black-and-white or desaturated photos, thin rules.

### C. Soleil & Majorelle: bright, generous, Mediterranean
For daytime terraces, brunch, families, tourists.
```
--bg: #FFFDF8;  --surface: #FFFFFF;  --ink: #1F2340;  --muted: #6B6F86;
--accent: #2E4BB0 (Majorelle blue);  --accent-ink: #FFFFFF;  --line: #ECE6DA;
--accent-2: #E3A72F (saffron, use only for small highlights)
```
Fonts: **DM Serif Display** for titles + **DM Sans** 400/500/700 for text.
Details: rounded cards, saffron dots as dietary markers, bright daylight photos.

### D. Bistrot de Carte: classic, printed, warm
For bistros, brasseries, wine bars. The menu reads like a printed card.
```
--bg: #F6F1E7;  --surface: #FFFDF8;  --ink: #2B1D1A;  --muted: #7D6B62;
--accent: #6E1F2A (bordeaux);  --accent-ink: #FFFFFF;  --line: #DCCFBC;
```
Fonts: **Libre Caslon Text** for titles and dish names + **Work Sans** for text.
Details: dotted leaders between dish and price, small caps categories, centered menu.

### E. Nuit sur les toits: evening, intimate, candlelit
For dinner-led rooftops and lounges.
```
--bg: #141B2D;  --surface: #1C2540;  --ink: #F1E9DB;  --muted: #A9A6B5;
--accent: #D9A85B (candle gold);  --accent-ink: #141B2D;  --line: #2C3654;
```
Fonts: **Cormorant** 500 italic for titles + **Jost** 400/500 for text.
Details: warm low-light photos, soft gold glow on buttons, a star or moon motif used once.

### F. Street & Bold: casual, fast, fun
For snack, burger, tacos, street food, delivery-first brands.
```
--bg: #FFF6E8;  --surface: #FFFFFF;  --ink: #111111;  --muted: #555555;
--accent: #E2412E (tomato);  --accent-ink: #FFFFFF;  --line: #111111;
```
Fonts: **Bricolage Grotesque** 700/800 for titles + **Inter** for text.
Details: thick 2px outlines, color-block sections, big prices, playful stickers.

### Arabic fonts (any preset)
Pair with **Noto Naskh Arabic** (classic, matches serifs) or **IBM Plex Sans Arabic**
(modern, matches sans). Set `--font-ar` in the template.

## 3. Rules that hold whatever the direction

- **Simple and straightforward first.** A guest must find the menu, the hours, the address
  and the main action (call / order) within one scroll on a phone.
- One accent color, one or two typefaces, one signature detail.
- Text contrast at least 4.5:1 (check `--muted` on `--bg`, and `--accent-ink` on `--accent`).
- Never put the menu in a PDF or an image: it must be real text (SEO, accessibility,
  translation, easy to edit).
- No autoplay video with sound, no pop-ups, no carousel as hero.
