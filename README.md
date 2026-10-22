# Terrasse la Medersa: restaurant website skills

Three Claude Code skills for building restaurant websites, from simplest to most complete.
They live in `.claude/skills/` and load automatically in Claude Code sessions in this repo.

| Skill | What guests can do | Photos | Server |
|-------|--------------------|--------|--------|
| `restaurant-site-menu` | Read the menu, find the place, call | No | No |
| `restaurant-site-whatsapp` | Order (delivery / pickup), the order is sent pre-written on WhatsApp, pay on delivery | Yes | No |
| `restaurant-site-online-pay` | Order and pay from the phone (card, Apple/Google Pay via CMI or Stripe, or cash), delivery or pickup | Yes | Small Node server |

Every skill **starts by asking for the artistic direction** (feeling, preset, colors, fonts,
signature detail, photography) and only builds once it is confirmed. Six ready-made
directions are described in `references/art-direction.md` (Terrasse Médina, Éditorial Noir,
Soleil & Majorelle, Bistrot de Carte, Nuit sur les toits, Street & Bold).

Each skill folder is self-contained (it can be zipped and uploaded on its own):

```
SKILL.md                 steps Claude follows
references/              art direction, design rules, images (Higgsfield / online), ordering, payments
template/                working starter site: edit data.js for content, :root tokens in styles.css for the look
```

Try a template locally: `npx serve .claude/skills/restaurant-site-whatsapp/template`, or for
tier 3 `node .claude/skills/restaurant-site-online-pay/template/server/server.mjs`.
