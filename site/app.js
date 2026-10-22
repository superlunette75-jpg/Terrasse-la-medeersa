/*
 * Renders the whole site from window.SITE (data.js).
 * Optional add-on: window.ORDER (cart.js), loaded before this file, adds "add to order"
 * buttons and a cart. Without it the site is a plain menu site.
 */
(function () {
  const S = window.SITE;
  const ORDER = window.ORDER || null;
  const DAY_CODES = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const STORE_KEY = "site-lang";

  let lang = S.languages[0];
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved && S.languages.includes(saved)) lang = saved;
  } catch (e) {}

  // ---------- helpers ----------
  const t = (v) => (v == null ? "" : typeof v === "string" || typeof v === "number" ? String(v) : v[lang] ?? v[S.languages[0]] ?? Object.values(v)[0] ?? "");
  const ui = (key) => t(S.ui[key]);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => `${Number(n).toLocaleString(lang === "ar" ? "ar-MA" : lang, { maximumFractionDigits: 2 })} ${S.currencyLabel}`;
  const $ = (sel) => document.querySelector(sel);

  // Stable ids for each dish: explicit id, else "<category>-<index>"
  S.menu.forEach((cat) => cat.items.forEach((it, i) => { it.id = it.id || `${cat.id}-${i + 1}`; }));

  window.APP = { t, ui, esc, money, get lang() { return lang; }, render: () => render() };

  function primaryHref() {
    if (S.primaryLink) return S.primaryLink;
    return `tel:${S.contact.phone}`;
  }

  function dayName(code, style) {
    // 2024-01-01 is a Monday
    const d = new Date(Date.UTC(2024, 0, 1 + DAY_CODES.indexOf(code)));
    return new Intl.DateTimeFormat(lang, { weekday: style, timeZone: "UTC" }).format(d);
  }

  function formatDays(days) {
    if (days.length === 7) return ui("everyDay");
    const idx = days.map((d) => DAY_CODES.indexOf(d)).sort((a, b) => a - b);
    const consecutive = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
    if (consecutive && idx.length > 2) return `${dayName(DAY_CODES[idx[0]], "long")} – ${dayName(DAY_CODES[idx[idx.length - 1]], "long")}`;
    return idx.map((i) => dayName(DAY_CODES[i], "long")).join(", ");
  }

  // ---------- render ----------
  function renderText() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-text]").forEach((el) => { el.textContent = t(S[el.dataset.text]); });
    document.querySelectorAll("[data-ui]").forEach((el) => { el.textContent = ui(el.dataset.ui); });
    ["#header-cta", "#hero-cta"].forEach((sel) => { const el = $(sel); if (el) el.href = primaryHref(); });
    $("#year").textContent = `© ${new Date().getFullYear()}`;
  }

  function renderLang() {
    const box = $("#lang");
    if (S.languages.length < 2) { box.hidden = true; return; }
    box.innerHTML = S.languages
      .map((l) => `<button type="button" data-lang="${l}" aria-pressed="${l === lang}">${l.toUpperCase()}</button>`)
      .join("");
    box.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
      lang = b.dataset.lang;
      try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
      render();
    }));
  }

  function renderMedia() {
    const hero = $("#hero-media");
    if (S.heroImage) {
      hero.hidden = false;
      hero.innerHTML = `<img src="${esc(S.heroImage)}" alt="${esc(t(S.heroAlt) || t(S.name))}" fetchpriority="high">`;
      $("#hero").classList.add("hero--image");
    }
    const about = $("#about-media");
    if (S.aboutImage) {
      about.hidden = false;
      about.innerHTML = `<img src="${esc(S.aboutImage)}" alt="${esc(t(S.aboutAlt) || "")}" loading="lazy">`;
    }
  }

  function dishHTML(it) {
    const tags = (it.tags || []).map((tg) => `<span class="tag tag--${esc(tg)}">${esc(ui("tag_" + tg) || tg)}</span>`).join("");
    const img = it.image
      ? `<img class="dish__img" src="${esc(it.image)}" alt="${esc(t(it.name))}" loading="lazy" width="800" height="600" onerror="this.remove()">`
      : "";
    const action = ORDER ? ORDER.dishAction(it) : "";
    return `
      <article class="dish${it.image ? " dish--image" : ""}" id="dish-${esc(it.id)}">
        ${img}
        <div class="dish__body">
          <div class="dish__head">
            <h4 class="dish__name">${esc(t(it.name))}</h4>
            <span class="dish__leader" aria-hidden="true"></span>
            <span class="dish__price">${money(it.price)}</span>
          </div>
          ${it.desc ? `<p class="dish__desc">${esc(t(it.desc))}</p>` : ""}
          ${tags || action ? `<div class="dish__foot"><div class="dish__tags">${tags}</div>${action}</div>` : ""}
        </div>
      </article>`;
  }

  function renderMenu() {
    const cats = S.menu.map((c) => ({ ...c, items: c.items.filter((i) => i.available !== false) })).filter((c) => c.items.length);
    $("#chips").innerHTML = `<div class="chips__track">${cats
      .map((c) => `<a class="chip" href="#cat-${esc(c.id)}" data-cat="${esc(c.id)}">${esc(t(c.name))}</a>`)
      .join("")}</div>`;
    const withImages = cats.some((c) => c.items.some((i) => i.image));
    $("#menu-list").innerHTML = cats
      .map((c) => `
        <section class="category" id="cat-${esc(c.id)}" aria-labelledby="h-${esc(c.id)}">
          <h3 class="category__title" id="h-${esc(c.id)}">${esc(t(c.name))}</h3>
          ${c.note ? `<p class="category__note">${esc(t(c.note))}</p>` : ""}
          <div class="dishes${withImages ? " dishes--grid" : ""}">${c.items.map(dishHTML).join("")}</div>
        </section>`)
      .join("");
    if (ORDER) ORDER.bind();
    spyChips();
  }

  function renderVisit() {
    const c = S.contact;
    const hours = S.hours
      .map((h) => `<li><span>${esc(formatDays(h.days))}</span><span>${esc(h.opens)} – ${esc(h.closes)}</span></li>`)
      .join("");
    const contacts = [
      c.phone && `<a href="tel:${esc(c.phone)}">${esc(c.phone.replace(/^\+212/, "0").replace(/(\d)(?=(\d{2})+$)/g, "$1 "))}</a>`,
      c.whatsapp && `<a href="https://wa.me/${esc(c.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`,
      c.instagram && `<a href="${esc(c.instagram)}" target="_blank" rel="noopener">Instagram</a>`,
      c.email && `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`,
    ].filter(Boolean).join("");
    $("#visit-grid").innerHTML = `
      <div class="visit__block">
        <h3>${esc(ui("address"))}</h3>
        <p>${esc(t(c.address))}<br>${esc(t(c.city))}</p>
        <a class="link" href="${esc(c.mapsUrl)}" target="_blank" rel="noopener">${esc(ui("directions"))} →</a>
      </div>
      <div class="visit__block">
        <h3>${esc(ui("hours"))}</h3>
        <ul class="hours">${hours}</ul>
      </div>
      <div class="visit__block">
        <h3>${esc(ui("contact"))}</h3>
        <div class="contacts">${contacts}</div>
      </div>`;
  }

  function renderSchema() {
    let el = document.getElementById("schema");
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = "schema";
      document.head.appendChild(el);
    }
    const first = S.languages[0];
    const tt = (v) => (v == null ? "" : typeof v === "string" ? v : v[first]);
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Restaurant",
      name: tt(S.name),
      description: tt(S.tagline),
      servesCuisine: S.cuisine,
      priceRange: S.priceRange,
      telephone: S.contact.phone,
      url: location.origin + location.pathname,
      hasMenu: location.origin + location.pathname + "#menu",
      image: S.heroImage ? new URL(S.heroImage, location.href).href : undefined,
      address: { "@type": "PostalAddress", streetAddress: tt(S.contact.address), addressLocality: tt(S.contact.city), addressCountry: S.contact.country },
      openingHoursSpecification: S.hours.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days.map((d) => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][DAY_CODES.indexOf(d)]),
        opens: h.opens,
        closes: h.closes,
      })),
      acceptsReservations: S.acceptsReservations ?? true,
    });
  }

  // ---------- behaviour ----------
  let spy;
  function spyChips() {
    if (spy) spy.disconnect();
    const chips = [...document.querySelectorAll(".chip")];
    spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        chips.forEach((c) => {
          const on = c.dataset.cat === e.target.id.replace("cat-", "");
          c.classList.toggle("is-active", on);
          if (on) { // centre the chip inside its own row only (scrollIntoView would also move the page)
            const track = c.parentElement;
            track.scrollTo({ left: c.offsetLeft - (track.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
          }
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll(".category").forEach((s) => spy.observe(s));
  }

  function headerOnScroll() {
    const h = $(".header");
    const update = () => h.classList.toggle("is-scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function reveal() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -10% 0px" });
    document.querySelectorAll(".section__title, .category, .visit__block, .about__grid > *").forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  function render() {
    renderText();
    renderLang();
    renderMenu();
    renderVisit();
    renderSchema();
    if (ORDER) ORDER.render();
    reveal();
  }

  renderMedia();
  render();
  headerOnScroll();
})();
