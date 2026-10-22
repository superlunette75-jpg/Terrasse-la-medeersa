/*
 * Order + payment server for the restaurant site. Node 18+, no dependencies.
 *
 *   node server/server.mjs        (reads server/.env, see .env.example)
 *
 * - Serves the static site (the folder above this one).
 * - POST /api/orders           creates an order. Prices come from ../data.js, never from the browser.
 * - GET  /api/orders/:id       order status for success.html
 * - POST /api/stripe/webhook   Stripe confirms the payment
 * - POST /api/cmi/callback     CMI (Morocco) confirms the payment (server-to-server)
 * - POST /api/cmi/ok|fail      CMI sends the customer back here
 *
 * Orders are kept in server/orders.json. Fine for one restaurant on one server; on serverless
 * hosting, swap load/save for a database (Supabase, Firebase, Turso, Netlify Blobs...).
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
loadEnv(path.join(HERE, ".env"));
const ENV = process.env;
const PORT = Number(ENV.PORT || 8787);
const PUBLIC_URL = (ENV.PUBLIC_URL || `http://localhost:${PORT}`).replace(/\/$/, "");
const PROVIDER = (ENV.PAYMENT_PROVIDER || "none").toLowerCase(); // "stripe" | "cmi" | "none"
const ORDERS_FILE = path.join(HERE, "orders.json");

// ---------------------------------------------------------------- menu (single source of truth)
function loadSite() {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "data.js"), "utf8"), ctx);
  const S = ctx.window.SITE;
  const items = new Map();
  S.menu.forEach((cat) => cat.items.forEach((it, i) => items.set(it.id || `${cat.id}-${i + 1}`, it)));
  return { S, items };
}
const label = (S, v) => (v == null ? "" : typeof v === "string" ? v : v[S.ordering?.staffLang || S.languages[0]] ?? Object.values(v)[0]);

// ---------------------------------------------------------------- order store
function loadOrders() { try { return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8")); } catch { return {}; } }
function saveOrder(o) {
  const all = loadOrders();
  all[o.id] = o;
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(all, null, 2));
}
function newId() {
  const d = new Date();
  return `${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

// ---------------------------------------------------------------- create order
const str = (v, max = 300) => String(v ?? "").trim().slice(0, max);

function buildOrder(body) {
  const { S, items } = loadSite();
  const cfg = S.ordering || {};
  const modes = cfg.modes || ["delivery", "pickup"];
  const mode = modes.includes(body.mode) ? body.mode : null;
  if (!mode) throw new Error("invalid mode");
  if (!Array.isArray(body.items) || !body.items.length || body.items.length > 60) throw new Error("empty order");

  const lines = body.items.map(({ id, qty }) => {
    const it = items.get(String(id));
    qty = Number(qty);
    if (!it || it.available === false || !Number.isInteger(qty) || qty < 1 || qty > 50) throw new Error(`invalid item ${id}`);
    return { id: String(id), name: label(S, it.name), qty, price: it.price };
  });
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
  if (subtotal < (cfg.minOrder || 0)) throw new Error("below minimum order");

  let fee = 0, zone = null;
  if (mode === "delivery") {
    const d = cfg.delivery || {};
    if (d.zones?.length) {
      zone = d.zones[Number(body.zoneIndex)];
      if (!zone) throw new Error("invalid zone");
      fee = zone.fee;
    } else fee = d.fee || 0;
    if (d.freeFrom && subtotal >= d.freeFrom) fee = 0;
  }

  const c = body.customer || {};
  const customer = { name: str(c.name, 80), phone: str(c.phone, 30), email: str(c.email, 120), address: str(c.address), time: str(c.time, 60), note: str(c.note) };
  if (!customer.name || !customer.phone || (mode === "delivery" && !customer.address)) throw new Error("missing customer details");
  const loc = body.location && Number.isFinite(+body.location.lat) && Number.isFinite(+body.location.lng) ? { lat: +body.location.lat, lng: +body.location.lng } : null;

  const methods = S.payments?.methods || ["card", "cash"];
  const payment = methods.includes(body.payment) ? body.payment : null;
  if (!payment) throw new Error("invalid payment method");

  return {
    S,
    order: {
      id: newId(), createdAt: new Date().toISOString(), lang: str(body.lang, 5) || S.languages[0],
      mode, zone: zone ? label(S, zone.name) : null, location: loc, customer, lines,
      subtotal, fee, total: subtotal + fee, currency: S.currency, payment,
      status: payment === "cash" ? "confirmed" : "pending",
    },
  };
}

async function createOrder(body) {
  const { S, order } = buildOrder(body);
  saveOrder(order);
  if (order.payment === "cash") {
    await notify(S, order);
    return { orderId: order.id };
  }
  if (PROVIDER === "stripe") return { redirect: await stripeCheckout(S, order) };
  if (PROVIDER === "cmi") return { form: cmiForm(S, order) };
  throw new Error("card payment is not configured (PAYMENT_PROVIDER)");
}

async function markPaid(id, ref) {
  const all = loadOrders();
  const o = all[id];
  if (!o || o.status === "paid") return;
  o.status = "paid";
  o.paymentRef = ref;
  o.paidAt = new Date().toISOString();
  saveOrder(o);
  await notify(loadSite().S, o);
}
function markFailed(id) {
  const o = loadOrders()[id];
  if (o && o.status === "pending") { o.status = "failed"; saveOrder(o); }
}

// ---------------------------------------------------------------- Stripe
// Checkout Session = hosted page with card, Apple Pay and Google Pay. Amounts in the
// smallest unit (MAD and EUR: x100).
async function stripeCheckout(S, o) {
  const p = new URLSearchParams();
  p.set("mode", "payment");
  p.set("client_reference_id", o.id);
  p.set("metadata[order_id]", o.id);
  p.set("success_url", `${PUBLIC_URL}/success.html?order=${o.id}`);
  p.set("cancel_url", `${PUBLIC_URL}/success.html?order=${o.id}&status=failed`);
  if (o.customer.email) p.set("customer_email", o.customer.email);
  const lineItems = o.lines.map((l) => ({ name: l.name, amount: l.price, qty: l.qty }));
  if (o.fee) lineItems.push({ name: "Livraison / Delivery", amount: o.fee, qty: 1 });
  lineItems.forEach((l, i) => {
    p.set(`line_items[${i}][quantity]`, l.qty);
    p.set(`line_items[${i}][price_data][currency]`, o.currency.toLowerCase());
    p.set(`line_items[${i}][price_data][unit_amount]`, Math.round(l.amount * 100));
    p.set(`line_items[${i}][price_data][product_data][name]`, l.name);
  });
  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${ENV.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: p,
  });
  const j = await r.json();
  if (!r.ok) throw new Error(`stripe: ${j.error?.message}`);
  return j.url;
}

function stripeVerify(raw, header) {
  const parts = Object.fromEntries(String(header || "").split(",").map((kv) => kv.split("=")));
  if (!parts.t || !parts.v1 || Math.abs(Date.now() / 1000 - Number(parts.t)) > 300) return false;
  const expected = crypto.createHmac("sha256", ENV.STRIPE_WEBHOOK_SECRET).update(`${parts.t}.${raw}`).digest("hex");
  return expected.length === parts.v1.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
}

// ---------------------------------------------------------------- CMI (Centre Monétique Interbancaire, Morocco)
// "3D_PAY_HOSTING" mode with hash ver3. Field names follow the CMI merchant kit given by
// the bank: check them against the kit you receive, as versions differ.
function cmiHash(fields) {
  const keys = Object.keys(fields)
    .filter((k) => !["hash", "encoding"].includes(k.toLowerCase()))
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  const esc = (v) => String(v).trim().replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
  const plain = keys.map((k) => esc(fields[k])).join("|") + "|" + esc(ENV.CMI_STORE_KEY);
  return crypto.createHash("sha512").update(plain, "utf8").digest("base64");
}

function cmiForm(S, o) {
  const fields = {
    clientid: ENV.CMI_CLIENT_ID,
    storetype: "3D_PAY_HOSTING",
    hashAlgorithm: "ver3",
    TranType: "PreAuth",
    currency: "504", // MAD
    amount: o.total.toFixed(2),
    oid: o.id,
    okUrl: `${PUBLIC_URL}/api/cmi/ok`,
    failUrl: `${PUBLIC_URL}/api/cmi/fail`,
    callbackUrl: `${PUBLIC_URL}/api/cmi/callback`,
    shopurl: PUBLIC_URL,
    lang: ["fr", "en", "ar"].includes(o.lang) ? o.lang : "fr",
    rnd: crypto.randomBytes(10).toString("hex"),
    BillToName: o.customer.name,
    email: o.customer.email || ENV.CMI_FALLBACK_EMAIL || "",
    tel: o.customer.phone,
    encoding: "UTF-8",
    AutoRedirect: "true",
  };
  fields.HASH = cmiHash(fields);
  return { action: ENV.CMI_GATEWAY_URL || "https://testpayment.cmi.co.ma/fim/est3Dgate", fields };
}

function cmiValid(fields) {
  const { HASH, hash, ...rest } = fields;
  const got = HASH || hash || "";
  const exp = cmiHash(rest);
  return got.length === exp.length && crypto.timingSafeEqual(Buffer.from(got), Buffer.from(exp));
}

// ---------------------------------------------------------------- notify the restaurant
function orderText(S, o) {
  const money = (n) => `${n} ${S.currencyLabel}`;
  const L = [
    `🛎 Commande ${o.id} · ${o.payment === "cash" ? "ESPÈCES à encaisser" : "PAYÉE en ligne"}`,
    "",
    ...o.lines.map((l) => `${l.qty} × ${l.name} · ${money(l.qty * l.price)}`),
    "",
    o.fee ? `Livraison: ${money(o.fee)}` : null,
    `Total: ${money(o.total)}`,
    "",
    `${o.mode === "delivery" ? "Livraison" : o.mode === "pickup" ? "À emporter" : "Sur place"} · ${o.customer.time || "dès que possible"}`,
    `${o.customer.name} · ${o.customer.phone}`,
    o.zone ? `Quartier: ${o.zone}` : null,
    o.customer.address ? `Adresse: ${o.customer.address}` : null,
    o.location ? `Position: https://maps.google.com/?q=${o.location.lat},${o.location.lng}` : null,
    o.customer.note ? `Note: ${o.customer.note}` : null,
  ];
  return L.filter((x) => x !== null).join("\n");
}

async function notify(S, o) {
  const text = orderText(S, o);
  console.log("\n" + text + "\n");
  const jobs = [];
  if (ENV.TELEGRAM_BOT_TOKEN && ENV.TELEGRAM_CHAT_ID) {
    jobs.push(fetch(`https://api.telegram.org/bot${ENV.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: ENV.TELEGRAM_CHAT_ID, text }),
    }));
  }
  if (ENV.NOTIFY_WEBHOOK_URL) {
    // e.g. a Make/Zapier/n8n scenario that forwards to WhatsApp, e-mail or a printer
    jobs.push(fetch(ENV.NOTIFY_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, order: o }) }));
  }
  const results = await Promise.allSettled(jobs);
  results.filter((r) => r.status === "rejected").forEach((r) => console.error("notify failed:", r.reason));
}

// ---------------------------------------------------------------- http
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".webp": "image/webp", ".avif": "image/avif", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".ico": "image/x-icon", ".json": "application/json" };

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on("data", (c) => { size += c.length; if (size > 100_000) { reject(new Error("too large")); req.destroy(); } else chunks.push(c); });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}
const json = (res, code, data) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(data)); };
const redirect = (res, to) => { res.writeHead(303, { Location: to }); res.end(); };

function serveStatic(req, res, pathname) {
  if (pathname === "/") pathname = "/index.html";
  const file = path.normalize(path.join(ROOT, decodeURIComponent(pathname)));
  if (!file.startsWith(ROOT + path.sep) || file.startsWith(HERE)) { res.writeHead(404); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, PUBLIC_URL);
  const p = url.pathname;
  try {
    if (req.method === "POST" && p === "/api/orders") {
      let body;
      try { body = JSON.parse(await readBody(req)); } catch { return json(res, 400, { error: "bad json" }); }
      try { return json(res, 200, await createOrder(body)); }
      catch (e) { console.error(e.message); return json(res, 400, { error: e.message }); }
    }
    if (req.method === "GET" && p.startsWith("/api/orders/")) {
      const o = loadOrders()[decodeURIComponent(p.slice("/api/orders/".length))];
      return o ? json(res, 200, { id: o.id, status: o.status, total: o.total }) : json(res, 404, { error: "not found" });
    }
    if (req.method === "POST" && p === "/api/stripe/webhook") {
      const raw = await readBody(req);
      if (!stripeVerify(raw, req.headers["stripe-signature"])) return json(res, 400, { error: "bad signature" });
      const ev = JSON.parse(raw);
      const s = ev.data?.object;
      if (ev.type === "checkout.session.completed" && s?.payment_status === "paid") await markPaid(s.client_reference_id, s.payment_intent);
      if (ev.type === "checkout.session.expired") markFailed(s.client_reference_id);
      return json(res, 200, { received: true });
    }
    if (req.method === "POST" && p === "/api/cmi/callback") {
      const f = Object.fromEntries(new URLSearchParams(await readBody(req)));
      const o = loadOrders()[f.oid];
      res.writeHead(200, { "Content-Type": "text/plain" });
      if (!cmiValid(f) || !o) return res.end("FAILURE"); // forged or unknown: refuse
      if (f.ProcReturnCode === "00" && Number(f.amount) === Number(o.total.toFixed(2))) {
        await markPaid(f.oid, f.TransId);
        return res.end("ACTION=POSTAUTH"); // capture the pre-authorised amount
      }
      markFailed(f.oid);
      return res.end("APPROVED"); // declined: acknowledged, nothing captured
    }
    if (req.method === "POST" && (p === "/api/cmi/ok" || p === "/api/cmi/fail")) {
      const f = Object.fromEntries(new URLSearchParams(await readBody(req)));
      return redirect(res, `/success.html?order=${encodeURIComponent(f.oid || "")}${p.endsWith("fail") ? "&status=failed" : ""}`);
    }
    if (req.method === "GET") return serveStatic(req, res, p);
    res.writeHead(405); res.end();
  } catch (e) {
    console.error(e);
    json(res, 500, { error: "server error" });
  }
});

server.listen(PORT, () => console.log(`Restaurant site on ${PUBLIC_URL}  (payments: ${PROVIDER})`));

// ---------------------------------------------------------------- tiny .env loader
function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/\s+#.*$/, "").replace(/^["']|["']$/g, "");
  }
}
