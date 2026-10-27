# Re-theming

All colours are CSS variables at the top of `src/index.css`, used through Tailwind
names (`bg-ink`, `text-light`, `bg-paper`, `bg-accent`, `text-accent-2`,
`text-accent-dark`, with opacity like `text-ink/60`). RGB triplets, no commas.

| Var | Role | Mootea |
|---|---|---|
| `--ink` | dark sections background, dark text | 20 11 6 (espresso) |
| `--light` | text on dark | 255 231 199 (cream) |
| `--paper` | light sections (How to order, Menu, sheets) | 255 244 230 |
| `--accent` | add buttons, step numbers, primary actions | 242 123 31 (tangerine) |
| `--accent-2` | prices on dark | 247 162 59 (mango) |
| `--accent-dark` | prices/links on light | 180 82 14 |
| `--heading-from/to` | vertical gradient of the giant titles | #a8673a → #ffd9a8 |
| `--btn-1..4` | diagonal gradient of the "Order now" pill | espresso → tangerine → mango → honey |

Recipes:
- Take the accent from the brand's printed menu/sign; ink = a very dark tint of it
  (not pure black); light/paper = a warm or cool off-white matching it.
- Title gradient: a muted mid-tone of the accent → a pale tint (must read on `--ink`).
- Button: dark ink-ish → accent → lighter accent → pale highlight.
- Category `tint`s in `menu.ts` stay pastel so the 3D products pop.
- Font: change `--font` and the Google Fonts `<link>` in `index.html`; pick a font
  with a heavy weight (800–900) for the giant titles (Kanit, Archivo Black, Anton…).
- WhatsApp green `#25D366` stays as is (recognisable).
