/* Auto-update: keeps installed apps and open tabs in sync with the latest site files. */
(function(){
"use strict";
var FILES=["index.html","styles.css","glass.js","liquid.css","liquid.js","upload.js","app.js","imgrace.js","img.js","code.js","grow.js","config.js","update.js","geo.js","companion.js","companion.css","video-ui.js","video-ui.css","redesign.js","redesign.css","manifest.webmanifest"];
var KEY="xmm.build",RL="xmm.reloaded";
var ls={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
function hash(s){var h=5381;for(var i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))|0;return String(h)}
function fresh(f){return fetch(f+(f.indexOf("?")<0?"?":"&")+"_="+Date.now(),{cache:"no-store"}).then(function(r){return r.ok?r.text():""}).catch(function(){return ""})}
function build(){return Promise.all(FILES.map(fresh)).then(function(a){return a.some(function(x){return !x})?null:hash(a.join("\u0001"))})}
function wipe(){var p=[];if(window.caches)p.push(caches.keys().then(function(k){return Promise.all(k.map(function(x){return caches.delete(x)}))}));
 if(navigator.serviceWorker)p.push(navigator.serviceWorker.getRegistrations().then(function(r){return Promise.all(r.map(function(x){return x.update().catch(function(){})}))}));
 return Promise.all(p).catch(function(){})}
var pend=false;
function reload(){
 // never reload while the user is looking at the app (caused a double splash); do it silently when the app is in the background
 var last=+(ls.get(RL)||0);if(Date.now()-last<20*1000)return;
 ls.set(RL,String(Date.now()));
 wipe().then(function(){location.reload()})}
var busy=false;
function check(){
 if(busy||!navigator.onLine)return;busy=true;
 build().then(function(b){busy=false;if(!b)return;var old=ls.get(KEY);
  if(!old){ls.set(KEY,b);return}
  if(old!==b){ // confirm with a second fetch so a host that varies its output can never cause reloads
   build().then(function(b2){if(b2&&b2===b){ls.set(KEY,b);reload()}})}
 }).catch(function(){busy=false})}
// service worker registration + update wiring
if("serviceWorker" in navigator&&location.protocol.indexOf("http")===0){
 var reloading=false,had=!!navigator.serviceWorker.controller;
 navigator.serviceWorker.addEventListener("controllerchange",function(){if(!had){had=true;return}if(reloading)return;reloading=true;reload()});
 navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).then(function(reg){
  reg.update().catch(function(){});
  function poke(){reg.update().catch(function(){});check()}
  document.addEventListener("visibilitychange",function(){if(!document.hidden)poke()});
  window.addEventListener("focus",poke);window.addEventListener("online",poke);
  setInterval(poke,5*60*1000);
 }).catch(function(){});
}
// build check even without SW (and on first load)
window.addEventListener("load",function(){setTimeout(check,1500)});
})();
