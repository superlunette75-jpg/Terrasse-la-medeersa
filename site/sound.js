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

  // D Hijaz, starting on D4: high enough for phone and laptop speakers (they lose < ~300 Hz)
  const HIJAZ = [293.66, 311.13, 369.99, 392.0, 440.0, 466.16, 523.25, 587.33, 622.25, 739.99];
  const strings = new Map();

  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.9;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4;
      master.connect(comp).connect(ctx.destination);
      // iOS unlocks audio only for a sound started inside the tap itself: play one silent sample now
      const unlock = ctx.createBufferSource();
      unlock.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      unlock.connect(ctx.destination);
      unlock.start(0);
    }
    if (ctx.state !== "running") ctx.resume();
    return ctx;
  }

  // Karplus-Strong plucked string, rendered once per pitch and cached
  function stringBuffer(c, freq) {
    const key = c.sampleRate + ":" + freq;
    if (strings.has(key)) return strings.get(key);
    const sr = c.sampleRate, len = Math.floor(sr * 1.2), period = Math.round(sr / freq);
    const buf = c.createBuffer(1, len, sr), d = buf.getChannelData(0);
    const line = new Float32Array(period);
    for (let i = 0; i < period; i++) line[i] = Math.random() * 2 - 1;
    let prev = 0;
    for (let i = 0; i < len; i++) {
      const j = i % period;
      const v = line[j];
      line[j] = 0.994 * (0.62 * v + 0.38 * prev); // keeps the bright, nasal attack of a plucked oud
      prev = v;
      d[i] = v;
    }
    strings.set(key, buf);
    return buf;
  }

  // Each voice takes (audio context, output node) so it can also be rendered offline for testing
  function oud(c, out, freq, when = 0, gain = 0.7) {
    const t = c.currentTime + when;
    const src = c.createBufferSource();
    src.buffer = stringBuffer(c, freq);
    const body = c.createBiquadFilter(); // wooden body resonance
    body.type = "peaking"; body.frequency.value = 650; body.Q.value = 1; body.gain.value = 5;
    const tone = c.createBiquadFilter();
    tone.type = "lowpass"; tone.frequency.value = 5500;
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
    src.connect(body).connect(tone).connect(g).connect(out);
    src.start(t);
    src.stop(t + 1.2);
  }

  function noise(c, dur) {
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * dur), c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    return src;
  }

  // darbouka "tek": bright rim hit
  function tek(c, out, gain = 0.55) {
    const t = c.currentTime;
    const n = noise(c, 0.1);
    const bp = c.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2600; bp.Q.value = 1.1;
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    n.connect(bp).connect(g).connect(out); n.start(t);
    const o = c.createOscillator(); o.type = "triangle"; o.frequency.setValueAtTime(1300, t); o.frequency.exponentialRampToValueAtTime(700, t + 0.06);
    const og = c.createGain(); og.gain.setValueAtTime(gain * 0.7, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.connect(og).connect(out); o.start(t); o.stop(t + 0.1);
  }

  // darbouka "dum": deep centre hit, with an upper layer so small speakers still render it
  function dum(c, out, gain = 0.8) {
    const t = c.currentTime;
    [[190, 95, 1], [380, 190, 0.55]].forEach(([f0, f1, k]) => {
      const o = c.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + 0.22);
      const g = c.createGain(); g.gain.setValueAtTime(gain * k, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      o.connect(g).connect(out); o.start(t); o.stop(t + 0.4);
    });
    const n = noise(c, 0.03);
    const lp = c.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 2200;
    const ng = c.createGain(); ng.gain.setValueAtTime(gain * 0.5, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    n.connect(lp).connect(ng).connect(out); n.start(t);
  }
  window.SOUND_VOICES = { oud, tek, dum, HIJAZ }; // exposed for testing

  function buzz(ms) { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} }

  const cartCount = () => (window.ORDER ? window.ORDER.totals().count : 0);

  const play = {
    add() { oud(ctx, master, HIJAZ[Math.min(Math.max(cartCount() - 1, 0), HIJAZ.length - 1)]); buzz(10); },
    remove() { tek(ctx, master, 0.6); buzz(6); },
    tap() { tek(ctx, master, 0.35); },
    open() { dum(ctx, master); buzz(12); },
    send() { [0, 2, 3, 4, 7].forEach((n, i) => oud(ctx, master, HIJAZ[n], i * 0.11, 0.6)); setTimeout(() => dum(ctx, master, 0.7), 520); buzz(20); },
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
