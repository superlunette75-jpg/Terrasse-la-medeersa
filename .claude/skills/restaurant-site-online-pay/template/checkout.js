/*
 * Online checkout: sends the order to the server (server/server.mjs), which recomputes the
 * prices, then either redirects to the payment page (card / Apple Pay / Google Pay) or
 * confirms a cash-on-delivery order. Load AFTER app.js.
 * Config: SITE.payments (see data.js).
 */
(function () {
  const S = window.SITE;
  const O = window.ORDER;
  const P = Object.assign({ endpoint: "/api/orders", methods: ["card", "cash"] }, S.payments || {});
  let method = P.methods[0];

  Object.assign(S.ui, Object.assign({
    email: { fr: "E-mail (pour le reçu)", en: "Email (for the receipt)", ar: "البريد الإلكتروني (للإيصال)" },
    payTitle: { fr: "Paiement", en: "Payment", ar: "الدفع" },
    method_card: { fr: "Payer maintenant par carte", en: "Pay now by card", ar: "الدفع الآن بالبطاقة" },
    method_card_hint: { fr: "Carte bancaire, Apple Pay ou Google Pay, paiement sécurisé", en: "Card, Apple Pay or Google Pay, secure payment", ar: "بطاقة بنكية أو Apple Pay أو Google Pay" },
    method_cash: { fr: "Espèces à la livraison", en: "Cash on delivery", ar: "الدفع نقدًا عند الاستلام" },
    method_cash_hint: { fr: "Vous payez le livreur ou au comptoir", en: "Pay the driver or at the counter", ar: "تدفع للموصّل أو عند الاستلام" },
    payNow: { fr: "Payer", en: "Pay", ar: "ادفع" },
    placeOrder: { fr: "Valider la commande", en: "Place order", ar: "تأكيد الطلب" },
    orderError: { fr: "La commande n'a pas pu être envoyée. Réessayez ou appelez-nous.", en: "We couldn't send your order. Please try again or call us.", ar: "تعذر إرسال الطلب. حاول مجددًا أو اتصل بنا." },
  }, S.ui));

  O.extraFields = () => {
    const esc = window.APP.esc;
    const email = `<label class="field" for="f-email"><span>${esc(O.text("email"))}</span><input id="f-email" name="email" type="email" autocomplete="email" inputmode="email"></label>`;
    if (P.methods.length < 2) return email;
    return `${email}<div class="field"><span>${esc(O.text("payTitle"))}</span>${P.methods.map((m) => `
      <label class="choice">
        <input type="radio" name="payment" value="${m}" ${m === method ? "checked" : ""}>
        <span><strong>${esc(O.text("method_" + m))}</strong><br><small>${esc(O.text("method_" + m + "_hint"))}</small></span>
      </label>`).join("")}</div>`;
  };

  O.submitLabel = () => (method === "card" ? `${O.text("payNow")} ${window.APP.money(O.totals().total)}` : O.text("placeOrder"));

  // keep the button label in sync with the selected method
  document.addEventListener("change", (e) => {
    if (e.target.name !== "payment") return;
    method = e.target.value;
    const btn = document.getElementById("submit");
    if (btn) btn.textContent = O.submitLabel();
  });

  O.submit = async (order, ui) => {
    // Only ids and quantities are sent: the server owns the prices.
    const body = {
      lang: window.APP.lang,
      mode: order.mode,
      zoneIndex: order.zoneIndex,
      location: order.location,
      customer: { ...order.customer, email: (order.extra.email || "").trim() },
      items: order.lines.map((l) => ({ id: l.id, qty: l.qty })),
      payment: method,
    };
    let res;
    try {
      const r = await fetch(P.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      res = await r.json();
      if (!r.ok) throw new Error(res.error || r.status);
    } catch (e) {
      ui.error(O.text("orderError"));
      return;
    }
    if (res.redirect) {               // Stripe Checkout and other hosted payment pages
      location.href = res.redirect;
    } else if (res.form) {            // CMI: auto-submitted POST form to the bank page
      const f = document.createElement("form");
      f.method = "POST";
      f.action = res.form.action;
      for (const [k, v] of Object.entries(res.form.fields)) {
        const i = document.createElement("input");
        i.type = "hidden"; i.name = k; i.value = v;
        f.appendChild(i);
      }
      document.body.appendChild(f);
      f.submit();
    } else if (res.orderId) {         // cash on delivery
      O.clear();
      location.href = `success.html?order=${encodeURIComponent(res.orderId)}`;
    }
  };
})();
