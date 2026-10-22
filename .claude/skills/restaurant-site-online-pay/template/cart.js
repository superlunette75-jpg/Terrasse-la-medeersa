/*
 * Cart + order form. Load BEFORE app.js, and load a "submitter" AFTER app.js that sets
 * window.ORDER.submit = async (order, ui) => { ... }  (whatsapp.js or checkout.js).
 * Config: window.SITE.ordering (see data.js).
 */
(function () {
  const S = window.SITE;
  const CFG = Object.assign({ modes: ["delivery", "pickup"], minOrder: 0, delivery: { fee: 0 }, askLocation: true }, S.ordering || {});
  const KEY = "site-cart";

  // Default interface text for ordering; data.js can override any key in SITE.ui
  const TXT = {
    add: { fr: "Ajouter", en: "Add", ar: "أضف" },
    viewOrder: { fr: "Voir ma commande", en: "View order", ar: "عرض الطلب" },
    yourOrder: { fr: "Votre commande", en: "Your order", ar: "طلبك" },
    empty: { fr: "Votre commande est vide.", en: "Your order is empty.", ar: "طلبك فارغ." },
    items: { fr: "article(s)", en: "item(s)", ar: "منتج" },
    subtotal: { fr: "Sous-total", en: "Subtotal", ar: "المجموع الفرعي" },
    deliveryFee: { fr: "Livraison", en: "Delivery", ar: "التوصيل" },
    free: { fr: "Offerte", en: "Free", ar: "مجاني" },
    total: { fr: "Total", en: "Total", ar: "المجموع" },
    mode_delivery: { fr: "Livraison", en: "Delivery", ar: "توصيل" },
    mode_pickup: { fr: "À emporter", en: "Pickup", ar: "استلام" },
    mode_table: { fr: "Sur place", en: "Dine in", ar: "في المطعم" },
    zone: { fr: "Quartier de livraison", en: "Delivery area", ar: "منطقة التوصيل" },
    name: { fr: "Nom", en: "Name", ar: "الاسم" },
    phone: { fr: "Téléphone", en: "Phone", ar: "الهاتف" },
    address: { fr: "Adresse / repère", en: "Address / landmark", ar: "العنوان / علامة مميزة" },
    shareLocation: { fr: "Partager ma position", en: "Share my location", ar: "مشاركة موقعي" },
    locationShared: { fr: "Position ajoutée ✓", en: "Location added ✓", ar: "تمت إضافة الموقع ✓" },
    locationError: { fr: "Position indisponible", en: "Location unavailable", ar: "الموقع غير متاح" },
    time: { fr: "Pour quand ?", en: "When?", ar: "متى؟" },
    asap: { fr: "Dès que possible", en: "As soon as possible", ar: "في أقرب وقت" },
    note: { fr: "Remarque (allergies, étage…)", en: "Note (allergies, floor…)", ar: "ملاحظة" },
    minOrder: { fr: "Minimum de commande", en: "Minimum order", ar: "الحد الأدنى للطلب" },
    freeFrom: { fr: "Livraison offerte dès", en: "Free delivery from", ar: "توصيل مجاني ابتداءً من" },
    remove: { fr: "Retirer", en: "Remove", ar: "إزالة" },
    close: { fr: "Fermer", en: "Close", ar: "إغلاق" },
    required: { fr: "Merci de compléter ce champ.", en: "Please fill in this field.", ar: "يرجى ملء هذا الحقل." },
  };

  let cart = {};
  try { cart = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
  const state = { mode: CFG.modes[0], zone: 0, location: null };

  const A = () => window.APP;
  const T = (k) => A().t((S.ui && S.ui[k]) || TXT[k]);
  const findItem = (id) => { for (const c of S.menu) for (const i of c.items) if (i.id === id) return i; return null; };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };

  function lines() {
    return Object.entries(cart)
      .map(([id, qty]) => ({ item: findItem(id), qty }))
      .filter((l) => l.item && l.item.available !== false && l.qty > 0);
  }

  function totals() {
    const ls = lines();
    const count = ls.reduce((n, l) => n + l.qty, 0);
    const subtotal = ls.reduce((n, l) => n + l.qty * l.item.price, 0);
    let fee = 0;
    if (state.mode === "delivery") {
      const zones = CFG.delivery.zones;
      fee = zones && zones.length ? zones[state.zone].fee : CFG.delivery.fee || 0;
      if (CFG.delivery.freeFrom && subtotal >= CFG.delivery.freeFrom) fee = 0;
    }
    return { count, subtotal, fee, total: subtotal + fee, belowMin: subtotal < (CFG.minOrder || 0) };
  }

  function setQty(id, qty) {
    if (qty <= 0) delete cart[id]; else cart[id] = Math.min(qty, 50);
    save();
    refresh();
  }

  // ---------- dish button ----------
  function dishAction(it) {
    const qty = cart[it.id] || 0;
    const name = A().esc(A().t(it.name));
    if (!qty) return `<button class="add" type="button" data-add="${A().esc(it.id)}" aria-label="${A().esc(T("add"))}: ${name}">${A().esc(T("add"))} <span aria-hidden="true">+</span></button>`;
    return `<div class="stepper" role="group" aria-label="${name}">
      <button type="button" data-dec="${A().esc(it.id)}" aria-label="−1">−</button>
      <span aria-live="polite">${qty}</span>
      <button type="button" data-inc="${A().esc(it.id)}" aria-label="+1">+</button>
    </div>`;
  }

  function bindIn(root) {
    root.querySelectorAll("[data-add],[data-inc]").forEach((b) => b.addEventListener("click", () => {
      const id = b.dataset.add || b.dataset.inc;
      setQty(id, (cart[id] || 0) + 1);
    }));
    root.querySelectorAll("[data-dec]").forEach((b) => b.addEventListener("click", () => setQty(b.dataset.dec, (cart[b.dataset.dec] || 0) - 1)));
  }

  // ---------- floating bar + drawer ----------
  function ensureShell() {
    if (document.getElementById("cartbar")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <button class="cartbar" id="cartbar" type="button" hidden></button>
      <dialog class="drawer" id="drawer" aria-labelledby="drawer-title">
        <form method="dialog" class="drawer__inner" id="order-form" novalidate></form>
      </dialog>`);
    document.getElementById("cartbar").addEventListener("click", open);
    const d = document.getElementById("drawer");
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); }); // click on backdrop
  }

  function open() {
    renderDrawer();
    document.getElementById("drawer").showModal();
  }

  function renderBar() {
    const { count, total } = totals();
    const bar = document.getElementById("cartbar");
    bar.hidden = count === 0;
    bar.innerHTML = `<span class="cartbar__count">${count}</span><span>${A().esc(T("viewOrder"))}</span><span class="cartbar__total">${A().money(total)}</span>`;
    document.body.classList.toggle("has-cartbar", count > 0);
  }

  function field(name, type, label, attrs = "") {
    const id = `f-${name}`;
    const tag = type === "textarea"
      ? `<textarea id="${id}" name="${name}" rows="2" ${attrs}></textarea>`
      : `<input id="${id}" name="${name}" type="${type}" ${attrs}>`;
    return `<label class="field" for="${id}"><span>${A().esc(label)}</span>${tag}</label>`;
  }

  function renderDrawer() {
    const esc = A().esc, money = A().money, t = A().t;
    const ls = lines();
    const tt = totals();
    const form = document.getElementById("order-form");
    const keep = Object.fromEntries(new FormData(form)); // keep typed values across re-renders

    const items = ls.length
      ? ls.map((l) => `
        <li class="line">
          <div><strong>${esc(t(l.item.name))}</strong><small>${money(l.item.price)}</small></div>
          ${dishAction(l.item)}
        </li>`).join("")
      : `<li class="line line--empty">${esc(T("empty"))}</li>`;

    const modes = CFG.modes.length > 1
      ? `<div class="segmented" role="radiogroup">${CFG.modes.map((m) => `
          <label><input type="radio" name="mode" value="${m}" ${m === state.mode ? "checked" : ""}><span>${esc(T("mode_" + m))}</span></label>`).join("")}</div>`
      : "";

    const zones = CFG.delivery.zones && CFG.delivery.zones.length && state.mode === "delivery"
      ? `<label class="field" for="f-zone"><span>${esc(T("zone"))}</span><select id="f-zone" name="zone">${CFG.delivery.zones
          .map((z, i) => `<option value="${i}" ${i === state.zone ? "selected" : ""}>${esc(t(z.name))} · ${z.fee ? money(z.fee) : esc(T("free"))}</option>`).join("")}</select></label>`
      : "";

    const delivery = state.mode === "delivery"
      ? `${zones}
         ${field("address", "textarea", T("address"), 'required autocomplete="street-address"')}
         ${CFG.askLocation ? `<button type="button" class="btn btn--ghost btn--small" id="geo">${esc(state.location ? T("locationShared") : T("shareLocation"))}</button>` : ""}`
      : "";

    const extra = window.ORDER.extraFields ? window.ORDER.extraFields() : "";
    const hint = [
      CFG.note ? t(CFG.note) : "",
      CFG.minOrder ? `${T("minOrder")} : ${money(CFG.minOrder)}` : "",
      state.mode === "delivery" && CFG.delivery.freeFrom ? `${T("freeFrom")} ${money(CFG.delivery.freeFrom)}` : "",
    ].filter(Boolean).join(" · ");

    form.innerHTML = `
      <header class="drawer__head">
        <h2 id="drawer-title">${esc(T("yourOrder"))}</h2>
        <button type="button" class="drawer__close" id="drawer-close" aria-label="${esc(T("close"))}">✕</button>
      </header>
      <div class="drawer__body">
        <ul class="lines">${items}</ul>
        ${ls.length ? `
          ${modes}
          <fieldset class="fields">
            ${field("name", "text", T("name"), 'required autocomplete="name"')}
            ${field("phone", "tel", T("phone"), 'required autocomplete="tel" inputmode="tel"')}
            ${delivery}
            ${CFG.askTime === false ? "" : field("time", "text", T("time"), `placeholder="${esc(T("asap"))}"`)}
            ${field("note", "textarea", T("note"))}
            ${extra}
          </fieldset>` : ""}
      </div>
      ${ls.length ? `
      <footer class="drawer__foot">
        <dl class="sum">
          <div><dt>${esc(T("subtotal"))}</dt><dd>${money(tt.subtotal)}</dd></div>
          ${state.mode === "delivery" ? `<div><dt>${esc(T("deliveryFee"))}</dt><dd>${tt.fee ? money(tt.fee) : esc(T("free"))}</dd></div>` : ""}
          <div class="sum__total"><dt>${esc(T("total"))}</dt><dd>${money(tt.total)}</dd></div>
        </dl>
        ${hint ? `<p class="drawer__hint">${esc(hint)}</p>` : ""}
        <p class="drawer__error" id="form-error" role="alert" hidden></p>
        <button type="submit" class="btn btn--block" id="submit" ${tt.belowMin ? "disabled" : ""}>${esc(window.ORDER.submitLabel ? window.ORDER.submitLabel() : "OK")}</button>
      </footer>` : ""}`;

    for (const [k, v] of Object.entries(keep)) {
      const el = form.elements[k];
      if (el && el.type !== "radio" && k !== "zone") el.value = v;
    }

    bindIn(form);
    form.querySelector("#drawer-close").addEventListener("click", () => document.getElementById("drawer").close());
    form.querySelectorAll('input[name="mode"]').forEach((r) => r.addEventListener("change", () => { state.mode = r.value; renderDrawer(); }));
    const z = form.querySelector("#f-zone");
    if (z) z.addEventListener("change", () => { state.zone = Number(z.value); renderDrawer(); });
    const geo = form.querySelector("#geo");
    if (geo) geo.addEventListener("click", shareLocation);
    form.onsubmit = onSubmit;
  }

  function shareLocation(e) {
    const btn = e.currentTarget;
    if (!navigator.geolocation) { btn.textContent = T("locationError"); return; }
    btn.disabled = true;
    navigator.geolocation.getCurrentPosition(
      (p) => { state.location = { lat: +p.coords.latitude.toFixed(6), lng: +p.coords.longitude.toFixed(6) }; btn.textContent = T("locationShared"); btn.disabled = false; },
      () => { btn.textContent = T("locationError"); btn.disabled = false; },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const err = form.querySelector("#form-error");
    const bad = [...form.querySelectorAll("[required]")].find((el) => !el.value.trim());
    if (bad) {
      err.hidden = false;
      err.textContent = T("required");
      bad.focus();
      return;
    }
    err.hidden = true;
    const data = Object.fromEntries(new FormData(form));
    const tt = totals();
    const order = {
      mode: state.mode,
      zone: CFG.delivery.zones && state.mode === "delivery" ? CFG.delivery.zones[state.zone] : null,
      zoneIndex: state.zone,
      location: state.mode === "delivery" ? state.location : null,
      customer: { name: data.name.trim(), phone: data.phone.trim(), address: (data.address || "").trim(), time: (data.time || "").trim(), note: (data.note || "").trim() },
      lines: lines().map((l) => ({ id: l.item.id, item: l.item, qty: l.qty })),
      extra: data,
      ...tt,
    };
    const submit = form.querySelector("#submit");
    submit.disabled = true;
    try {
      await window.ORDER.submit(order, { form, error: (msg) => { err.hidden = false; err.textContent = msg; } });
    } finally {
      submit.disabled = false;
    }
  }

  function refresh() {
    // update dish buttons in the menu without re-rendering the page
    document.querySelectorAll(".dish").forEach((el) => {
      const it = findItem(el.id.replace("dish-", ""));
      const slot = el.querySelector(".add, .stepper");
      if (!it || !slot) return;
      slot.outerHTML = dishAction(it);
      bindIn(el);
    });
    renderBar();
    const d = document.getElementById("drawer");
    if (d && d.open) renderDrawer();
  }

  window.ORDER = {
    dishAction,
    bind() { bindIn(document.getElementById("menu-list")); },
    render() { ensureShell(); renderBar(); },
    clear() { cart = {}; save(); refresh(); },
    open,
    totals,
    lines,
    config: CFG,
    text: T,
    // set by whatsapp.js / checkout.js:
    submit: async () => {},
    submitLabel: null,
    extraFields: null,
  };
})();
