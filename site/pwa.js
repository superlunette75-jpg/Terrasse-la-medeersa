/*
 * App mode: registers the service worker and offers "install the app" once.
 * - Android / Chrome: native install prompt behind our own small banner.
 * - iPhone (Safari): a hint "Share → Add to Home Screen" (Apple offers no install prompt).
 * Never shown when already installed, and at most once every 14 days after a dismiss.
 */
(function () {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }

  const KEY = "site-install-dismissed";
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (standalone) return;
  try {
    const at = Number(localStorage.getItem(KEY) || 0);
    if (Date.now() - at < 14 * 864e5) return;
  } catch (e) {}

  const TXT = {
    android: { fr: "Ajoutez La Medersa à votre écran d'accueil", en: "Add La Medersa to your home screen", es: "Añada La Medersa a su pantalla de inicio" },
    ios: { fr: "Installez l'appli : touchez Partager puis « Sur l'écran d'accueil »", en: "Install the app: tap Share, then “Add to Home Screen”", es: "Instale la app: toque Compartir y luego «Añadir a pantalla de inicio»" },
    go: { fr: "Installer", en: "Install", es: "Instalar" },
  };
  const t = (k) => window.APP ? window.APP.t(TXT[k]) : TXT[k].fr;

  function banner(kind, onGo) {
    if (document.querySelector(".install")) return;
    const el = document.createElement("div");
    el.className = "install";
    el.setAttribute("role", "dialog");
    el.innerHTML = `
      <img src="icons/icon-192.png" alt="" width="36" height="36">
      <p>${t(kind)}</p>
      ${onGo ? `<button type="button" class="install__go">${t("go")}</button>` : ""}
      <button type="button" class="install__x" aria-label="OK">✕</button>`;
    document.body.appendChild(el);
    const close = () => { el.remove(); try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} };
    el.querySelector(".install__x").addEventListener("click", close);
    if (onGo) el.querySelector(".install__go").addEventListener("click", () => { onGo(); close(); });
  }

  // show the offer only after the guest has looked around a little (first dish added or 20 s)
  function whenEngaged(fn) {
    let done = false;
    const go = () => { if (!done) { done = true; fn(); } };
    document.addEventListener("click", (e) => { if (e.target.closest("[data-add]")) setTimeout(go, 1200); });
    setTimeout(go, 20000);
  }

  let deferred = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    whenEngaged(() => banner("android", () => { deferred.prompt(); deferred = null; }));
  });

  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent);
  if (ios) whenEngaged(() => banner("ios", null));
})();
