let w = window.open(
  "https://accounts.google.com/o/oauth2/v2/auth" +
  "?client_id=396192454224-vm2jk77e46pfa69esi2q6h61vitaiudn.apps.googleusercontent.com" +
  "&redirect_uri=" + encodeURIComponent(
    "https://auth.cargurus.co.uk/auth/realms/cargurus/broker/google/endpoint"
  ) +
  "&response_type=token" +
  "&scope=openid email" +
  "&prompt=none",
  "g",
  "width=500,height=600"
);

(function poll(){
  try {
    if (w.location.hash && w.location.hash.includes("access_token")) {
      alert(w.location.href);
      w.close();
      return;
    }
  } catch(e) {}
  setTimeout(poll, 100);
})();
