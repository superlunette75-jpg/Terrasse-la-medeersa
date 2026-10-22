/*
 * Small Moroccan instrument sounds, synthesised with Web Audio (no audio files to load):
 *  - oud pluck (Karplus-Strong string) when a dish is added, rising along a Hijaz scale
 *  - darbouka "tek" when a dish is removed or a category / language is tapped
 *  - darbouka "dum" when the order opens, oud motif when the order is sent
 * Plus a light vibration where the phone supports it (Android).
 * Listens to clicks on the whole page, so it needs no change in the other scripts.
 * Mute toggle in the header, remembered on the device.
 */
(function () {
  const KEY = "site-sound";
  const S = window.SITE;
  let on = true;
  try { on = localStorage.getItem(KEY) !== "off"; } catch (e) {}
  let ctx, master;

  // D Hijaz: D Eb F# G A Bb C D (Hz)
  const HIJAZ = [146.83, 155.56, 185.0, 196.0, 220.0, 233.08, 261.63, 293.66, 311.13, 369.99];
  const strings = new Map();

  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.55;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp).connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // Karplus-Strong plucked string, rendered once per pitch and cached
  function stringBuffer(freq) {
    if (strings.has(freq)) return strings.get(freq);
    const sr = ctx.sampleRate, len = Math.floor(sr * 1.1), period = Math.round(sr / freq);
    const buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
    const line = new Float32Array(period);
    for (let i = 0; i < period; i++) line[i] = Math.random() * 2 - 1;
    let prev = 0;
    for (let i = 0; i < len; i++) {
      const j = i % period;
      const v = line[j];
      line[j] = 0.996 * (0.5 * (v + prev)); // damping: short, woody sustain like an oud
      prev = v;
      d[i] = v;
    }
    strings.set(freq, buf);
    return buf;
  }

  function oud(freq, when = 0, gain = 0.5) {
    const t = ctx.currentTime + when;
    const src = ctx.createBufferSource();
    src.buffer = stringBuffer(freq);
    const body = ctx.createBiquadFilter(); // wooden body resonance
    body.type = "peaking"; body.frequency.value = 280; body.Q.value = 1.2; body.gain.value = 6;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass"; tone.frequency.value = 2600;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    src.connect(body).connect(tone).connect(g).connect(master);
    src.start(t);
    src.stop(t + 1);
  }

  function noise(dur) {
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    return src;
  }

  // darbouka "tek": bright rim hit
  function tek(gain = 0.35) {
    const t = ctx.currentTime;
    const n = noise(0.08);
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 3200; bp.Q.value = 1.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    n.connect(bp).connect(g).connect(master); n.start(t);
    const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(500, t + 0.05);
    const og = ctx.createGain(); og.gain.setValueAtTime(gain * 0.5, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    o.connect(og).connect(master); o.start(t); o.stop(t + 0.08);
  }

  // darbouka "dum": deep centre hit
  function dum(gain = 0.7) {
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(62, t + 0.25);
    const g = ctx.createGain(); g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o.connect(g).connect(master); o.start(t); o.stop(t + 0.4);
    const n = noise(0.03);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900;
    const ng = ctx.createGain(); ng.gain.setValueAtTime(gain * 0.4, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    n.connect(lp).connect(ng).connect(master); n.start(t);
  }

  function buzz(ms) { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} }

  const cartCount = () => (window.ORDER ? window.ORDER.totals().count : 0);

  const play = {
    add() { oud(HIJAZ[Math.min(cartCount(), HIJAZ.length - 1)]); buzz(10); },
    remove() { tek(0.4); buzz(6); },
    tap() { tek(0.22); },
    open() { dum(0.6); buzz(12); },
    send() { [0, 2, 3, 4, 7].forEach((n, i) => oud(HIJAZ[n], i * 0.11, 0.45)); setTimeout(() => dum(0.5), 520); buzz(20); },
  };

  function soundFor(el) {
    if (el.closest("[data-add], [data-inc]")) return "add";
    if (el.closest("[data-dec]")) return "remove";
    if (el.closest("#cartbar")) return "open";
    if (el.closest("#submit")) return null; // played on successful send (below)
    if (el.closest(".chip, .lang button, .segmented, .nav a, .drawer__close, #new-order, .btn, .link")) return "tap";
    return null;
  }

  // capture phase: runs before the cart updates, so "add" knows the count before/after
  document.addEventListener("click", (e) => {
    if (!on) return;
    const kind = soundFor(e.target);
    if (!kind || !audio()) return;
    // let the cart update first so the oud climbs with the number of dishes
    setTimeout(() => play[kind](), 0);
  }, true);

  // order sent: wrap the WhatsApp submit to play the motif
  window.addEventListener("load", () => {
    const O = window.ORDER;
    if (!O || !O.submit) return;
    const send = O.submit;
    O.submit = async (...args) => {
      if (on && audio()) play.send();
      return send(...args);
    };
  });

  // ---------- mute toggle in the header ----------
  const ICON_ON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const ICON_OFF = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/></svg>';
  const t = (k) => window.APP ? window.APP.ui(k) : "";

  function renderToggle() {
    let b = document.getElementById("sound");
    if (!b) {
      b = document.createElement("button");
      b.id = "sound"; b.type = "button"; b.className = "sound";
      document.querySelector(".header__actions").prepend(b);
      b.addEventListener("click", () => {
        on = !on;
        try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
        renderToggle();
        if (on && audio()) play.tap();
      });
    }
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", on ? t("soundOff") : t("soundOn"));
    b.title = b.getAttribute("aria-label");
    b.innerHTML = on ? ICON_ON : ICON_OFF;
  }
  renderToggle();
  document.addEventListener("click", (e) => { if (e.target.closest(".lang button")) setTimeout(renderToggle, 0); });
})();
