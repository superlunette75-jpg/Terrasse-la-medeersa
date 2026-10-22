/*
 * Sends the order as a pre-filled WhatsApp message to the restaurant (wa.me click-to-chat).
 * The customer only has to press "send" in WhatsApp. Load AFTER app.js.
 * The message is written in the staff language: SITE.ordering.staffLang (default: first language).
 */
(function () {
  const S = window.SITE;
  const O = window.ORDER;
  const staff = (S.ordering && S.ordering.staffLang) || S.languages[0];
  const st = (v) => (v == null ? "" : typeof v === "string" ? v : v[staff] ?? Object.values(v)[0]);

  const L = {
    fr: { title: "Nouvelle commande", mode: "Mode", name: "Nom", phone: "Tél", address: "Adresse", zone: "Quartier", map: "Position", time: "Pour", asap: "Dès que possible", note: "Remarque", subtotal: "Sous-total", fee: "Livraison", total: "Total", pay: "Paiement à la livraison" },
    en: { title: "New order", mode: "Mode", name: "Name", phone: "Phone", address: "Address", zone: "Area", map: "Location", time: "For", asap: "As soon as possible", note: "Note", subtotal: "Subtotal", fee: "Delivery", total: "Total", pay: "Payment on delivery" },
    ar: { title: "طلب جديد", mode: "الطريقة", name: "الاسم", phone: "الهاتف", address: "العنوان", zone: "المنطقة", map: "الموقع", time: "الوقت", asap: "في أقرب وقت", note: "ملاحظة", subtotal: "المجموع الفرعي", fee: "التوصيل", total: "المجموع", pay: "الدفع عند الاستلام" },
  }[staff] || {};
  const MODES = { fr: { delivery: "Livraison", pickup: "À emporter", table: "Sur place" }, en: { delivery: "Delivery", pickup: "Pickup", table: "Dine in" }, ar: { delivery: "توصيل", pickup: "استلام", table: "في المطعم" } }[staff] || {};
  const money = (n) => `${n} ${S.currencyLabel}`;

  function buildMessage(o) {
    const c = o.customer;
    const out = [`*${L.title} · ${st(S.name)}*`, ""];
    o.lines.forEach((l) => out.push(`${l.qty} × ${st(l.item.name)} · ${money(l.qty * l.item.price)}`));
    out.push("");
    if (o.mode === "delivery") {
      out.push(`${L.subtotal}: ${money(o.subtotal)}`);
      out.push(`${L.fee}: ${money(o.fee)}`);
    }
    out.push(`*${L.total}: ${money(o.total)}*`, "");
    out.push(`${L.mode}: ${MODES[o.mode] || o.mode}`);
    out.push(`${L.name}: ${c.name}`);
    out.push(`${L.phone}: ${c.phone}`);
    if (o.mode === "delivery") {
      if (o.zone) out.push(`${L.zone}: ${st(o.zone.name)}`);
      out.push(`${L.address}: ${c.address}`);
      if (o.location) out.push(`${L.map}: https://maps.google.com/?q=${o.location.lat},${o.location.lng}`);
    }
    out.push(`${L.time}: ${c.time || L.asap}`);
    if (c.note) out.push(`${L.note}: ${c.note}`);
    if (o.mode === "delivery") out.push("", `_${L.pay}_`);
    return out.join("\n");
  }

  O.submitLabel = () => O.text("sendWhatsApp");
  O.submit = async (order, ui) => {
    const url = `https://wa.me/${S.contact.whatsapp}?text=${encodeURIComponent(buildMessage(order))}`;
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else location.href = url; // pop-up blocked: navigate instead
    showSent(ui.form, url);
  };

  function showSent(form, url) {
    const esc = window.APP.esc;
    form.querySelector(".drawer__body").innerHTML = `
      <div class="sent">
        <div class="sent__icon" aria-hidden="true">✓</div>
        <h3>${esc(O.text("sentTitle"))}</h3>
        <p>${esc(O.text("sentText"))}</p>
        <a class="link" href="${esc(url)}" target="_blank" rel="noopener">${esc(O.text("reopenWhatsApp"))}</a>
      </div>`;
    const foot = form.querySelector(".drawer__foot");
    foot.innerHTML = `<button type="button" class="btn btn--block" id="new-order">${esc(O.text("newOrder"))}</button>`;
    foot.querySelector("#new-order").addEventListener("click", () => {
      O.clear();
      document.getElementById("drawer").close();
    });
  }

  // Interface text specific to WhatsApp ordering (override in SITE.ui if needed)
  Object.assign(S.ui, Object.assign({
    sendWhatsApp: { fr: "Envoyer la commande sur WhatsApp", en: "Send order on WhatsApp", ar: "أرسل الطلب عبر واتساب" },
    sentTitle: { fr: "Il ne reste qu'à appuyer sur «\u00a0Envoyer\u00a0»", en: "Just press “Send” in WhatsApp", ar: "اضغط على «إرسال» في واتساب" },
    sentText: { fr: "Votre commande est prête dans WhatsApp. Nous vous confirmons le délai dès réception.", en: "Your order is ready in WhatsApp. We'll confirm the timing as soon as we receive it.", ar: "طلبك جاهز في واتساب. سنؤكد لك الوقت فور استلامه." },
    reopenWhatsApp: { fr: "Rouvrir WhatsApp", en: "Open WhatsApp again", ar: "فتح واتساب مجددًا" },
    newOrder: { fr: "Nouvelle commande", en: "New order", ar: "طلب جديد" },
  }, S.ui));

  window.ORDER_buildMessage = buildMessage; // exposed for testing
})();
