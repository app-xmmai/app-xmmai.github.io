/* + button: centered upload dialog. Pick Images or Code first, or drag files anywhere. */
(()=>{
const CODE="js,mjs,cjs,jsx,ts,tsx,html,htm,css,scss,sass,less,php,phtml,py,json,xml,svg,vue,svelte,java,c,cpp,h,hpp,cs,go,rs,rb,sh,bash,sql,yml,yaml,md,txt,csv,log,ini,toml,env,swift,kt,dart,lua,r,bat,ps1,twig,ejs,pug,htaccess,conf".split(",");
const ACCEPT={img:"image/*",code:CODE.map(x=>"."+x).join(",")};
const ext=n=>(n.split(".").pop()||"").toLowerCase();
const okFile=f=>(f.type.startsWith("image/")&&f.type!=="image/svg+xml")||CODE.includes(ext(f.name))||(f.type.startsWith("text/"));
const css=document.createElement("style");css.textContent=`
#upMod{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.5);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);opacity:0;visibility:hidden;transition:opacity .22s ease,visibility 0s .22s}
#upMod.on{opacity:1;visibility:visible;transition:opacity .22s ease}
#upBox{position:relative;width:min(440px,100%);padding:22px;border-radius:30px;background:rgba(28,28,32,.72);-webkit-backdrop-filter:blur(30px) saturate(1.6);backdrop-filter:blur(30px) saturate(1.6);box-shadow:inset 0 0 0 .5px rgba(255,255,255,.18),0 24px 70px rgba(0,0,0,.55);color:#fff;transform:translateY(14px) scale(.93);opacity:0;transition:transform .38s cubic-bezier(.2,.95,.25,1.08),opacity .25s ease,box-shadow .25s ease}
#upMod.on #upBox{transform:none;opacity:1}
#upBox h3{margin:0 0 4px;font-size:19px;font-weight:650}
#upBox .upsub{margin:0 0 16px;font-size:13px;opacity:.6}
#upX{position:absolute;top:14px;right:14px;width:32px;height:32px;border:0;border-radius:50%;background:rgba(255,255,255,.1);color:#fff;display:grid;place-items:center;cursor:pointer;transition:background .2s,transform .2s}
#upX:hover{background:rgba(255,255,255,.2)}#upX:active{transform:scale(.9)}
#upX svg{width:16px;height:16px}
.upTiles{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.upTile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:140px;padding:14px;border:0;border-radius:22px;background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 .5px rgba(255,255,255,.14);color:#fff;font:inherit;cursor:pointer;transition:transform .2s cubic-bezier(.2,.9,.3,1.3),background .2s}
.upTile:hover{background:rgba(255,255,255,.14)}.upTile:active{transform:scale(.95)}
.upTile svg{width:34px;height:34px}
.upTile b{font-size:16px;font-weight:650}
.upTile small{font-size:11.5px;opacity:.55;text-align:center;line-height:1.35}
#upDrop{margin-top:12px;display:flex;align-items:center;justify-content:center;gap:8px;height:64px;border:1.5px dashed rgba(255,255,255,.28);border-radius:18px;font-size:13.5px;opacity:.85;transition:all .2s}
#upDrop svg{width:18px;height:18px}
#upMod.glow #upBox{box-shadow:inset 0 0 0 1px rgba(255,255,255,.7),0 0 50px 8px rgba(255,255,255,.3),0 24px 70px rgba(0,0,0,.55)}
#upMod.glow #upDrop{border-color:#fff;background:rgba(255,255,255,.14);height:110px;opacity:1;animation:upGlow .9s ease-in-out infinite alternate}
@keyframes upGlow{to{box-shadow:0 0 26px 3px rgba(255,255,255,.5)}}
@media(prefers-reduced-motion:reduce){#upBox,#upMod{transition-duration:.01s}}`;
document.head.appendChild(css);
const I={img:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 8"/></svg>',
code:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></svg>',
up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"/></svg>',
x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'};
const mod=document.createElement("div");mod.id="upMod";
mod.innerHTML=`<div id="upBox" role="dialog" aria-label="Upload"><button id="upX" aria-label="Close">${I.x}</button><h3>Upload</h3><p class="upsub">What do you want to upload?</p>
<div class="upTiles"><button class="upTile" data-k="img">${I.img}<b>Images</b><small>PNG, JPG, WEBP, GIF</small></button><button class="upTile" data-k="code">${I.code}<b>Code</b><small>JS, HTML, PHP, CSS, PY, JSON and more</small></button></div>
<div id="upDrop">${I.up}<span>or drag files here</span></div></div>`;
document.body.appendChild(mod);
const inp=()=>document.getElementById("file");
const open=()=>mod.classList.add("on");
const close=()=>{mod.classList.remove("on","glow")};
const isOn=()=>mod.classList.contains("on");
const give=files=>{files=[...(files||[])];if(!files.length)return;
  const good=files.filter(okFile),bad=files.length-good.length;
  if(bad&&typeof toast==="function")toast(bad+" unsupported file"+(bad>1?"s":"")+" skipped");
  close();if(!good.length)return;
  const f=inp(),dt=new DataTransfer();good.forEach(x=>dt.items.add(x));f.files=dt.files;f.dispatchEvent(new Event("change",{bubbles:true}))};
document.addEventListener("click",e=>{
  const a=e.target.closest&&e.target.closest("#attBtn");
  if(a){e.stopPropagation();e.stopImmediatePropagation();isOn()?close():open();return}
},true);
mod.addEventListener("click",e=>{
  if(e.target===mod||e.target.closest("#upX")){close();return}
  const t=e.target.closest(".upTile");if(!t)return;
  const f=inp();f.accept=ACCEPT[t.dataset.k];f.value="";close();f.click();
});
addEventListener("keydown",e=>{if(e.key==="Escape")close()});
/* dragging a file anywhere: open dialog + glow */
const hasF=e=>e.dataTransfer&&[...(e.dataTransfer.types||[])].includes("Files");
addEventListener("dragenter",e=>{if(!hasF(e))return;e.preventDefault();open();mod.classList.add("glow")});
addEventListener("dragover",e=>{if(!hasF(e))return;e.preventDefault();e.dataTransfer.dropEffect="copy"});
addEventListener("dragleave",e=>{if(hasF(e)&&!e.relatedTarget)close()});
addEventListener("drop",e=>{if(!hasF(e))return;e.preventDefault();const f=e.dataTransfer.files;close();give(f);
  if(f&&f.length&&typeof chatView==="function")try{chatView("chat")}catch(_){}});
})();
/* top pill: terminal button opens Code mode */
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#tbCode,#sideCode,[data-act=\"opencode\"]");if(b){window.XMM_CODE&&window.XMM_CODE.open()}});
