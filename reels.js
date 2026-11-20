/* DipIFRS — تبويب الريلز: مشاهد تمثيلية متحركة (SVG) + صوت عربي (Web Speech) + ترجمة. شغّال أوفلاين وبدون API. */
(function(){
'use strict';
const KEY='dipifr-reels-v1';
let SEEN={};try{SEEN=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
const markSeen=id=>{SEEN[id]=1;try{localStorage.setItem(KEY,JSON.stringify(SEEN))}catch(e){}};
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const REELS=()=>window.REELS||[];
const S={idx:0,tok:0,paused:false,sound:true,started:false,beat:0,root:null,pos:{}};
const R=()=>REELS()[S.idx];

/* ---------- helpers ---------- */
function mix(h,a){const n=parseInt(h.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=a<0?0:255,p=Math.abs(a);r=Math.round(r+(f-r)*p);g=Math.round(g+(f-g)*p);b=Math.round(b+(f-b)*p);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
function rng(seed){return()=>(seed=(seed*16807)%2147483647)/2147483647}

/* ---------- scene art ---------- */
function skyline(){
  const r=rng(11);let s='';
  for(let i=0;i<70;i++)s+=`<circle cx="${(r()*720).toFixed(0)}" cy="${(r()*150).toFixed(0)}" r="${(.4+r()*.9).toFixed(1)}" fill="#fff" opacity="${(.3+r()*.6).toFixed(2)}"/>`;
  s+=`<circle cx="130" cy="78" r="22" fill="#f6f0d8" opacity=".12"/><circle cx="130" cy="78" r="11" fill="#f6f0d8" opacity=".9"/>`;
  let x=-10;while(x<740){const w=28+r()*38,h=70+r()*170;s+=`<rect x="${x.toFixed(0)}" y="${(428-h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="#161c46" opacity=".95"/>`;x+=w+3+r()*8}
  x=-24;let li=0;
  while(x<740){
    const w=46+r()*58,h=130+r()*230,y=428-h;
    s+=`<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="#0a0e2c"/><rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="2" height="${h.toFixed(0)}" fill="#2b3478" opacity=".6"/>`;
    for(let wy=y+10;wy<420;wy+=11)for(let wx=x+7;wx<x+w-8;wx+=9){if(r()<.36)s+=`<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="4" height="6" fill="${r()<.82?'#ffd98a':'#bfe3ff'}" opacity="${(.45+r()*.55).toFixed(2)}"/>`}
    if(h>250){s+=`<rect x="${(x+w/2-1).toFixed(0)}" y="${(y-26).toFixed(0)}" width="2" height="26" fill="#0a0e2c"/><circle class="rl-blink" style="animation-delay:${(li++*.7).toFixed(1)}s" cx="${(x+w/2).toFixed(0)}" cy="${(y-27).toFixed(0)}" r="2.2" fill="#ff4d4d"/>`}
    x+=w+6+r()*12;
  }
  return s;
}
function person(id,c){
  const sk2=mix(c.skin,-.18),suit2=mix(c.suit,-.3),hair2=mix(c.hair,-.2);
  const hairPath=`<path d="M-23 -26 C-27 -53 -8 -60 2 -58 C19 -57 27 -46 23 -26 C20 -39 13 -43 0 -43 C-13 -43 -20 -39 -23 -26Z" fill="${c.hair}"/>`;
  return `<g class="ch" id="ch-${id}" data-mood="neutral" data-brow="flat" data-mouth="line" data-eye="open" data-head="up" style="opacity:0">
  <ellipse cx="0" cy="2" rx="38" ry="7" fill="#000" opacity=".35"/>
  <g class="bob">
    <g transform="translate(-13,-90)"><g class="leg lL"><rect x="-8" y="0" width="16" height="80" rx="7" fill="${c.pants}"/><ellipse cx="0" cy="83" rx="13" ry="6" fill="#0c0c10"/></g></g>
    <g transform="translate(13,-90)"><g class="leg lR"><rect x="-8" y="0" width="16" height="80" rx="7" fill="${c.pants}"/><ellipse cx="0" cy="83" rx="13" ry="6" fill="#0c0c10"/></g></g>
    <g transform="translate(-36,-170)"><g class="arm aL"><rect x="-8" y="-4" width="16" height="84" rx="8" fill="${c.suit}"/><circle cx="0" cy="84" r="8" fill="${c.skin}"/></g></g>
    <path d="M-36 -168 Q-36 -181 -22 -183 L22 -183 Q36 -181 36 -168 L34 -82 Q0 -74 -34 -82 Z" fill="${c.suit}"/>
    <path d="M-12 -183 L12 -183 L0 -144 Z" fill="${c.shirt}"/>
    <path d="M-23 -183 L-12 -183 L0 -144 L-14 -118 L-25 -150Z" fill="${suit2}"/><path d="M23 -183 L12 -183 L0 -144 L14 -118 L25 -150Z" fill="${suit2}"/>
    <path d="M-4.5 -168 L4.5 -168 L7.5 -128 L0 -117 L-7.5 -128Z" fill="${c.tie}"/><rect x="-5" y="-174" width="10" height="9" rx="2" fill="${mix(c.tie,-.2)}"/>
    <rect x="-8" y="-192" width="16" height="16" fill="${sk2}"/>
    <g transform="translate(0,-176)"><g class="head">
      <ellipse cx="-22" cy="-22" rx="4.6" ry="6" fill="${sk2}"/><ellipse cx="22" cy="-22" rx="4.6" ry="6" fill="${sk2}"/>
      <ellipse cx="0" cy="-24" rx="22" ry="26" fill="${c.skin}"/>
      ${hairPath}
      ${c.mustache?`<path d="M-13 -9 Q-6 -15 0 -11 Q6 -15 13 -9 Q6 -5 0 -8 Q-6 -5 -13 -9Z" fill="${c.hair}"/>`:''}
      <path d="M0 -22 q3.5 7 0 9" stroke="${sk2}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      <g class="eyes">
        <ellipse class="eye" cx="-9" cy="-25" rx="5.2" ry="5.6" fill="#fff"/><ellipse class="eye" cx="9" cy="-25" rx="5.2" ry="5.6" fill="#fff"/>
        <circle class="pupil" cx="-9" cy="-25" r="2.8" fill="#1a1210"/><circle class="pupil" cx="9" cy="-25" r="2.8" fill="#1a1210"/>
        <ellipse class="lid" cx="-9" cy="-25.6" rx="5.8" ry="6.2" fill="${c.skin}"/><ellipse class="lid" cx="9" cy="-25.6" rx="5.8" ry="6.2" fill="${c.skin}"/>
      </g>
      ${c.glasses?`<g fill="none" stroke="#15151a" stroke-width="1.7"><circle cx="-9" cy="-25" r="8.4"/><circle cx="9" cy="-25" r="8.4"/><path d="M-0.6 -25 H0.6"/><path d="M-17.4 -26 L-22 -28M17.4 -26 L22 -28"/></g>`:''}
      <rect class="brow bL" x="-15" y="-37" width="12" height="2.8" rx="1.4" fill="${hair2}"/><rect class="brow bR" x="3" y="-37" width="12" height="2.8" rx="1.4" fill="${hair2}"/>
      <g class="mouths" fill="none" stroke="#5a2a2a" stroke-width="2" stroke-linecap="round">
        <path class="mo m-line" d="M-6 -8 H6"/><path class="mo m-frown" d="M-6.5 -5.5 Q0 -11.5 6.5 -5.5"/>
        <path class="mo m-smile" d="M-7.5 -9.5 Q0 -2.5 7.5 -9.5"/><path class="mo m-smirk" d="M-6.5 -8 Q2 -6.5 7.5 -12.5"/>
        <ellipse class="mo m-o" cx="0" cy="-7" rx="3.4" ry="4.4" fill="#5a1f1f" stroke="none"/>
        <ellipse class="mo m-talk" cx="0" cy="-8" rx="5.2" ry="4" fill="#5a1f1f" stroke="none"/>
      </g>
      <path class="sweat" d="M25 -42 q5 8 0 11 q-5 -3 0 -11z" fill="#8fd3ff"/>
    </g></g>
    <g transform="translate(36,-170)"><g class="arm aR"><rect x="-8" y="-4" width="16" height="84" rx="8" fill="${c.suit}"/><circle cx="0" cy="84" r="8" fill="${c.skin}"/>
      ${c.held?`<g class="held"><rect x="-6" y="70" width="34" height="42" rx="2.5" fill="#d7b25a" transform="rotate(8 10 90)"/><rect x="-2" y="76" width="22" height="2.4" fill="#a8863a" transform="rotate(8 10 90)"/><rect x="-2" y="82" width="26" height="2.4" fill="#a8863a" transform="rotate(8 10 90)"/></g>`:''}
    </g></g>
  </g></g>`.replace(/\n\s*/g,'');
}
function sceneSVG(Rl){
  const C=Rl.cast,ids=Object.keys(C);
  const chars=id=>person(id,C[id]);
  return `<svg class="rl-svg" viewBox="0 0 360 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs>
<linearGradient id="rlSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040614"/><stop offset=".55" stop-color="#151d58"/><stop offset="1" stop-color="#3b4190"/></linearGradient>
<linearGradient id="rlFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#202437"/><stop offset="1" stop-color="#090a11"/></linearGradient>
<radialGradient id="rlLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd58a" stop-opacity=".8"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></radialGradient>
<linearGradient id="rlCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd58a" stop-opacity=".5"/><stop offset="1" stop-color="#ffd58a" stop-opacity="0"/></linearGradient>
<linearGradient id="rlStreak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd98a" stop-opacity=".22"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></linearGradient>
<linearGradient id="rlWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a4630"/><stop offset="1" stop-color="#3a2519"/></linearGradient>
</defs>
<g id="rl-world">
<rect width="720" height="430" fill="url(#rlSky)"/>
${skyline()}
<polygon points="40,0 150,0 60,430 -50,430" fill="#fff" opacity=".035"/><polygon points="330,0 380,0 290,430 240,430" fill="#fff" opacity=".03"/><polygon points="560,0 640,0 550,430 470,430" fill="#fff" opacity=".035"/>
<g fill="#07091a"><rect x="0" y="26" width="720" height="4"/><rect x="-2" y="26" width="6" height="404"/><rect x="178" y="26" width="5" height="404"/><rect x="358" y="26" width="5" height="404"/><rect x="538" y="26" width="5" height="404"/><rect x="716" y="26" width="6" height="404"/><rect x="0" y="426" width="720" height="6"/></g>
<rect width="720" height="26" fill="#05060d"/>
<g fill="#ffe7b0" opacity=".55"><ellipse cx="90" cy="20" rx="14" ry="2.5"/><ellipse cx="270" cy="20" rx="14" ry="2.5"/><ellipse cx="450" cy="20" rx="14" ry="2.5"/><ellipse cx="630" cy="20" rx="14" ry="2.5"/></g>
<rect y="430" width="720" height="210" fill="url(#rlFloor)"/>
<g fill="url(#rlStreak)"><rect x="60" y="432" width="14" height="150"/><rect x="150" y="432" width="9" height="120"/><rect x="250" y="432" width="16" height="170"/><rect x="340" y="432" width="8" height="110"/><rect x="600" y="432" width="14" height="150"/></g>
<rect x="250" y="520" width="460" height="100" rx="10" fill="#1a1d2c" opacity=".85"/>
<g>
 <rect x="26" y="440" width="150" height="74" rx="8" fill="#1d2030"/><rect x="26" y="440" width="150" height="8" rx="4" fill="#2b2f45"/>
 <path d="M70 440 Q50 400 60 372 Q76 396 82 440Z M92 440 Q88 392 110 366 Q108 404 108 440Z M112 440 Q134 404 156 396 Q140 424 126 440Z" fill="#1f5a45"/><rect x="62" y="436" width="64" height="8" rx="3" fill="#2a2d40"/>
</g>
<ellipse cx="540" cy="520" rx="200" ry="14" fill="#000" opacity=".35"/>
<rect x="484" y="296" width="96" height="150" rx="26" fill="#2a2d3f"/><rect x="500" y="282" width="64" height="30" rx="14" fill="#34384d"/>
${chars('chief')}
<polygon points="360,408 705,408 716,421 349,421" fill="#7c5339"/><rect x="349" y="421" width="367" height="95" fill="url(#rlWood)"/>
<g fill="#2a1a11" opacity=".7"><rect x="372" y="436" width="150" height="62" rx="3"/><rect x="543" y="436" width="150" height="62" rx="3"/></g><g fill="#c8a066"><rect x="440" y="462" width="14" height="3" rx="1.5"/><rect x="612" y="462" width="14" height="3" rx="1.5"/></g>
<g><ellipse cx="410" cy="407" rx="16" ry="3.4" fill="#16171f"/><path d="M410 406 L420 366 L446 346" stroke="#1d1f2a" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M438 342 L462 352 L452 366 Z" fill="#222534"/>
 <circle cx="450" cy="366" r="64" fill="url(#rlLamp)" opacity=".7"/><path d="M446 362 L396 410 L520 410 Z" fill="url(#rlCone)"/></g>
<g><rect x="610" y="370" width="74" height="40" rx="3" fill="#252834"/><circle cx="647" cy="390" r="4.5" fill="#9fc3ff" opacity=".8"/><rect x="602" y="406" width="90" height="4" rx="2" fill="#181a22"/><ellipse cx="647" cy="388" rx="46" ry="30" fill="#6fa3ff" opacity=".08"/></g>
<g><rect x="372" y="396" width="26" height="12" rx="2" fill="#e8e8e8"/><rect x="374" y="392" width="24" height="5" rx="1" fill="#cfcfcf"/><rect x="690" y="392" width="12" height="16" rx="2" fill="#3a3f55"/></g>
<path d="M505 403 h52 l9 9 h-70 z" fill="#f4f1e6"/><path d="M510 406 h40 M507 409 h44" stroke="#bdb8a6" stroke-width="1"/>
<g id="rl-report" style="opacity:0;transform:translate(440px,392px)"><path d="M0 0 h54 l9 9 h-72 z" fill="#d7b25a"/><path d="M4 2 h42" stroke="#a8863a" stroke-width="1.4"/></g>
${chars('newbie')}
${chars('ceo')}
</g></svg>`;
}

/* ---------- CSS ---------- */
const CSS=`
body.rl-on{padding-bottom:0!important;overflow:hidden}
body.rl-on main{max-width:none;padding:0}
.rl-wrap{height:var(--rlh,600px);background:#05070d;display:flex;justify-content:center;direction:ltr}
.rl-stage{position:relative;height:100%;aspect-ratio:9/16;max-width:100%;overflow:hidden;background:#000;container-type:inline-size;user-select:none;-webkit-user-select:none;direction:rtl;font-family:var(--f-ui);color:#fff}
.rl-svg,.rl-vid{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:cover}
#rl-world{transform-origin:0 0}
.rl-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 46%,transparent 50%,rgba(0,0,0,.62) 100%),linear-gradient(rgba(0,0,0,.55),transparent 16%,transparent 58%,rgba(0,0,0,.72))}
.rl-fade{position:absolute;inset:0;background:#000;opacity:1;pointer-events:none}
.rl-top{position:absolute;top:0;inset-inline:0;padding:10px 12px;display:flex;flex-direction:column;gap:8px;z-index:5;pointer-events:none}
.rl-prog{height:3px;border-radius:3px;background:rgba(255,255,255,.28);overflow:hidden}.rl-prog i{display:block;height:100%;width:0;background:#fff;transition:width .4s linear}
.rl-chips{display:flex;align-items:center;gap:8px}.rl-chips .grow{flex:1}
.rl-pill{background:rgba(0,0,0,.5);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.18);border-radius:99px;padding:3px 11px;font-size:.78rem;font-weight:600;white-space:nowrap}
.rl-ib{pointer-events:auto;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(0,0,0,.5);backdrop-filter:blur(6px);color:#fff;font-size:1rem;display:grid;place-items:center;padding:0}
.rl-slug{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;opacity:0;transition:opacity .6s;pointer-events:none;z-index:4}
.rl-slug.on{opacity:1}.rl-slug span{font-family:var(--f-num),var(--f-ui);letter-spacing:.14em;font-size:clamp(12px,3.6cqw,17px);color:#cfd6ff;opacity:.9}.rl-slug b{font-size:clamp(20px,7.4cqw,34px);font-weight:700}
.rl-cap{position:absolute;inset-inline:8%;top:20%;text-align:center;font-weight:600;font-size:clamp(14px,4.4cqw,21px);line-height:1.7;opacity:0;transition:opacity .5s;text-shadow:0 2px 10px #000;z-index:4;pointer-events:none;font-style:italic}.rl-cap.on{opacity:1}
.rl-sub{position:absolute;inset-inline:5%;bottom:7%;text-align:center;z-index:4;pointer-events:none;opacity:0;transform:translateY(8px);transition:opacity .25s,transform .25s}.rl-sub.on{opacity:1;transform:none}
.rl-sub b{display:inline-block;background:var(--c,#555);color:#fff;border-radius:99px;padding:1px 12px;font-size:clamp(11px,3.3cqw,14px);font-weight:700}.rl-sub b.dk{color:#1b1500}
.rl-sub span{display:block;margin-top:7px;background:rgba(0,0,0,.58);backdrop-filter:blur(4px);border-radius:14px;padding:8px 12px;font-weight:700;font-size:clamp(15px,5cqw,23px);line-height:1.6;text-wrap:balance}
.rl-flash{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(.8);font-size:3rem;background:rgba(0,0,0,.55);width:84px;height:84px;border-radius:50%;display:grid;place-items:center;opacity:0;pointer-events:none;z-index:6}
.rl-flash.pop{animation:rlPop .7s ease-out}
@keyframes rlPop{0%{opacity:.95;transform:translate(-50%,-50%) scale(.8)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.25)}}
.rl-stage.paused .rl-flash{opacity:.9;transform:translate(-50%,-50%) scale(1);animation:none}
.rl-poster,.rl-end{position:absolute;inset:0;z-index:7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:8%;text-align:center;background:rgba(3,5,16,.74);backdrop-filter:blur(3px)}
.rl-end{background:rgba(3,5,16,.9);gap:10px}
.rl-poster[hidden],.rl-end[hidden]{display:none}
.rl-poster h2{margin:0;font-size:clamp(24px,9cqw,40px);line-height:1.25}.rl-poster p{margin:0;color:#c5cdf5;font-size:clamp(13px,4cqw,17px)}
.rl-play{width:76px;height:76px;border-radius:50%;border:0;background:#fff;color:#0b1030;font-size:1.9rem;display:grid;place-items:center;padding:0 0 0 5px;box-shadow:0 8px 30px rgba(0,0,0,.5)}
.rl-note{font-size:.78rem;color:#ffd98a;max-width:28ch}
.rl-k{font-size:.8rem;color:#9fb0ff;letter-spacing:.04em}.rl-big{font-size:clamp(30px,11cqw,50px);font-weight:700;line-height:1.2}.rl-big em{display:block;font-style:normal;font-family:var(--f-en);font-size:.5em;color:#ff8d7e;direction:ltr}
.rl-def{margin:0;font-size:clamp(13px,4cqw,16px);color:#e1e6ff;line-height:1.7}
.rl-five{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;direction:ltr;margin:2px 0}.rl-five span{font-family:var(--f-en);font-size:clamp(10px,3cqw,13px);padding:3px 10px;border-radius:99px;border:1px solid rgba(255,255,255,.22);color:#c5cdf5}
.rl-five span.hit{background:#e0674f;border-color:#e0674f;color:#fff;font-weight:600}
.rl-pts{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;font-size:clamp(12px,3.7cqw,15px);color:#e1e6ff;text-align:start;line-height:1.6}.rl-pts li{background:rgba(255,255,255,.07);border-radius:12px;padding:7px 11px}
.rl-btns{display:flex;gap:8px;margin-top:4px;flex-wrap:wrap;justify-content:center}
.rl-btn{border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.1);color:#fff;border-radius:99px;padding:8px 16px;font-weight:600;font-size:.9rem;min-height:40px}.rl-btn.pri{background:#fff;color:#0b1030;border-color:#fff}
.rl-dots{position:absolute;inset-inline-start:8px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:6px;z-index:5;pointer-events:none}.rl-dots i{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.4)}.rl-dots i.on{background:#fff;height:16px;border-radius:3px}
.rl-blink{animation:rlBl 2.2s steps(1) infinite}@keyframes rlBl{0%,60%{opacity:1}61%,100%{opacity:.1}}
/* characters */
.ch{transition:transform 1s linear,opacity .3s}
.ch .leg,.ch .arm{transform-box:view-box;transform-origin:0 0;transition:transform .35s ease}
.ch .head{transform-box:view-box;transform-origin:0 0;transition:transform .4s ease}
.ch .bob{animation:rlBr 2.8s ease-in-out infinite alternate}
@keyframes rlBr{from{transform:translateY(0)}to{transform:translateY(-1.6px)}}
.ch.walking .bob{animation:rlBob .26s ease-in-out infinite alternate}@keyframes rlBob{from{transform:translateY(0)}to{transform:translateY(-4px)}}
.ch.walking .lL,.ch.walking .aR{animation:rlSw .52s ease-in-out infinite alternate}
.ch.walking .lR,.ch.walking .aL{animation:rlSw .52s ease-in-out infinite alternate-reverse}
@keyframes rlSw{from{transform:rotate(-22deg)}to{transform:rotate(22deg)}}
.ch.g-hand .aR{transform:rotate(-82deg)!important;animation:none!important}
.ch .held{display:none}.ch.holding .held{display:inline}
.ch .pupil{transform:translate(var(--look,0px),var(--ly,0px));transition:transform .3s}
.ch .eye,.ch .lid,.ch .brow{transform-box:fill-box;transform-origin:50% 50%;transition:transform .25s}
.ch .lid{transform-origin:50% 0;transform:scaleY(var(--lid,0))}
.ch .mo,.ch .sweat{display:none}
.ch[data-mouth=line] .m-line,.ch[data-mouth=frown] .m-frown,.ch[data-mouth=smile] .m-smile,.ch[data-mouth=smirk] .m-smirk,.ch[data-mouth=o] .m-o{display:inline}
.ch[data-talk="1"] .mo{display:none!important}.ch[data-talk="1"] .m-talk{display:inline!important;transform-box:fill-box;transform-origin:50% 50%;animation:rlTalk .2s ease-in-out infinite alternate}
@keyframes rlTalk{from{transform:scaleY(.25)}to{transform:scaleY(1.05)}}
.ch[data-eye=half]{--lid:.38}.ch[data-eye=down]{--lid:.45;--ly:2.4px}.ch[data-eye=wide] .eye{transform:scale(1.22)}.ch[data-eye=wide] .pupil{r:2.3px}
.ch[data-head=down] .head{transform:rotate(7deg) translateY(3px)}
.ch[data-brow=worried] .bL{transform:rotate(-16deg) translateY(-1px)}.ch[data-brow=worried] .bR{transform:rotate(16deg) translateY(-1px)}
.ch[data-brow=angry] .bL{transform:rotate(17deg) translateY(2px)}.ch[data-brow=angry] .bR{transform:rotate(-17deg) translateY(2px)}
.ch[data-brow=up] .bL,.ch[data-brow=up] .bR{transform:translateY(-4px)}
.ch[data-brow=one] .bR{transform:rotate(-8deg) translateY(-4px)}.ch[data-brow=one] .bL{transform:rotate(8deg) translateY(1px)}
.ch[data-mood=nervous] .sweat,.ch[data-mood=sheepish] .sweat{display:inline;animation:rlSw2 1.2s ease-in infinite}
@keyframes rlSw2{from{transform:translateY(-3px);opacity:1}to{transform:translateY(6px);opacity:.1}}
`;
function injectCSS(){if($('#rl-css'))return;const s=document.createElement('style');s.id='rl-css';s.textContent=CSS;document.head.appendChild(s)}

/* ---------- voice ---------- */
const TTS='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
let VO=[];
function loadVoices(){if(!TTS)return;VO=speechSynthesis.getVoices().filter(v=>/^ar/i.test(v.lang))}
if(TTS){loadVoices();try{speechSynthesis.addEventListener('voiceschanged',loadVoices)}catch(e){}}
function voiceFor(id){
  if(!VO.length)return null;
  const male=VO.filter(v=>/male|shakir|maged|majed|tarik|naayf|hamed|ahmed|omar|tarek/i.test(v.name)&&!/female/i.test(v.name));
  const pool=male.length?male:VO,eg=pool.filter(v=>/EG/i.test(v.lang)),list=eg.length?eg:pool;
  return list[({chief:0,newbie:1,ceo:2}[id]||0)%list.length];
}
const haveVoice=()=>TTS&&VO.length>0;
function speakOnce(text,id,c,tok){
  return new Promise(res=>{
    let done=false;const t0=Date.now(),cap=Math.max(4500,text.length*170+2500);
    const fin=r=>{if(!done){done=true;clearInterval(iv);res(r)}};
    const u=new SpeechSynthesisUtterance(text),v=voiceFor(id);
    if(v){u.voice=v;u.lang=v.lang}else u.lang='ar-EG';
    u.pitch=c.pitch||1;u.rate=c.rate||1;u.onend=()=>fin('end');u.onerror=()=>fin('end');
    const iv=setInterval(()=>{
      if(tok!==S.tok){fin('abort');speechSynthesis.cancel()}
      else if(S.paused){fin('paused');speechSynthesis.cancel()}
      else if(Date.now()-t0>cap){fin('end');speechSynthesis.cancel()}
    },70);
    speechSynthesis.speak(u);
  });
}

/* ---------- timeline engine ---------- */
const sleep=(ms,tok)=>new Promise(res=>{let left=ms;const iv=setInterval(()=>{if(tok!==S.tok){clearInterval(iv);res('abort');return}if(!S.paused){left-=50;if(left<=0){clearInterval(iv);res('end')}}},50)});
const gate=async tok=>{while(S.paused&&tok===S.tok)await new Promise(r=>setTimeout(r,80))};
const ch=id=>$('#ch-'+id);
const W=()=>$('#rl-world');
function cam(name,ms){
  const c=Array.isArray(name)?name:R().cams[name];if(!c||!W())return;
  const s=c[2];let tx=180-c[0]*s,ty=320-c[1]*s;
  tx=Math.min(0,Math.max(360-720*s,tx));ty=Math.min(0,Math.max(640-640*s,ty));
  const w=W();w.style.transition=ms?`transform ${ms}ms cubic-bezier(.45,0,.2,1)`:'none';
  w.style.transform=`translate(${tx}px,${ty}px) scale(${s})`;
  if(!ms)void w.getBoundingClientRect();
}
const MOODS={neutral:['flat','line','open','up'],read:['flat','line','down','down'],worried:['worried','frown','open','up'],shock:['up','o','wide','up'],scheme:['one','smirk','half','up'],stern:['angry','line','half','up'],smirk:['one','smirk','half','up'],angry:['angry','frown','half','up'],startled:['up','o','wide','up'],nervous:['worried','frown','open','down'],sheepish:['worried','smile','open','down']};
function setMood(id,m){const el=ch(id),d=MOODS[m]||MOODS.neutral;if(!el)return;el.dataset.mood=m;el.dataset.brow=d[0];el.dataset.mouth=d[1];el.dataset.eye=d[2];el.dataset.head=d[3]}
function place(id,x,ms){
  const el=ch(id),st=S.pos[id];if(!el||!st)return;st.x=x;
  el.style.transition=ms?`transform ${ms}ms linear,opacity .3s`:'none';
  el.style.transform=`translate(${x}px,${st.y}px) scale(${st.s})`;
  if(!ms)void el.getBoundingClientRect();
}
async function walk(sp,tok){
  const [id,from,to,ms,mode]=sp,el=ch(id);
  if(from!=null){place(id,from,0);el.style.opacity=1}
  el.classList.add('walking');place(id,to,ms);
  await sleep(ms,tok);el.classList.remove('walking');
  if(mode==='exit')el.style.opacity=0;
}
async function hand(tok){
  const n=ch('newbie'),rep=$('#rl-report');
  n.classList.add('g-hand');await sleep(650,tok);
  rep.style.transition='none';rep.style.transform='translate(440px,388px)';rep.style.opacity=1;void rep.getBoundingClientRect();
  n.classList.remove('holding');rep.style.transition='transform .7s ease';rep.style.transform='translate(468px,403px)';
  await sleep(550,tok);n.classList.remove('g-hand');await sleep(350,tok);
}
async function showText(sel,html,ms,tok){const e=$(sel);e.innerHTML=html;e.classList.add('on');await sleep(ms,tok);e.classList.remove('on');await sleep(500,tok)}
async function say(b,tok){
  const Rl=R(),c=Rl.cast[b.say],box=$('#rlsub');
  box.innerHTML=`<b class="${c.darkChip?'dk':''}" style="--c:${c.color}">${esc(c.name)}</b><span>${esc(b.t)}</span>`;box.classList.add('on');
  const el=ch(b.say);el.dataset.talk='1';
  const est=Math.max(1800,b.t.length*68+500),t0=Date.now();let done=false;
  while(!done&&tok===S.tok){
    if(S.paused){await gate(tok);continue}
    if(S.sound&&haveVoice()){
      const t1=Date.now(),r=await speakOnce(b.v||b.t,b.say,c,tok);
      if(r==='end'){const used=Date.now()-t1;if(used<(b.v||b.t).length*28)await sleep(est-used,tok);done=true}
      else if(r==='abort')break;
    }else{await sleep(est,tok);done=true}
  }
  el.dataset.talk='0';box.classList.remove('on');await sleep(180,tok);
}
async function doBeat(b,tok){
  if(b.fade!==undefined){const f=$('#rlfade');f.style.transition=b.fadeMs?`opacity ${b.fadeMs}ms ease`:'none';f.style.opacity=b.fade}
  if(b.cam)cam(b.cam,b.camMs==null?900:b.camMs);
  if(b.mood)for(const k in b.mood)setMood(k,b.mood[k]);
  if(b.hand)await hand(tok);
  if(b.slug)await showText('#rlslug',`<span>${esc(b.slug[0])}</span><b>${esc(b.slug[1])}</b><span>${esc(b.slug[2]||'')}</span>`,b.ms||2500,tok);
  if(b.caption)await showText('#rlcap',esc(b.caption),b.ms||2500,tok);
  if(b.walk)await walk(b.walk,tok);
  if(b.say)await say(b,tok);
  if(b.wait)await sleep(b.wait,tok);
}
function reset(){
  const Rl=R();S.pos={};
  Object.keys(Rl.cast).forEach(id=>{
    const st=Object.assign({},Rl.stage[id]);S.pos[id]=st;const el=ch(id),c=Rl.cast[id];
    el.classList.remove('walking','g-hand');el.classList.toggle('holding',!!c.held);el.dataset.talk='0';
    el.style.setProperty('--look',(c.look||0)*2.3+'px');setMood(id,'neutral');place(id,st.x,0);el.style.opacity=id==='chief'?1:0;
  });
  const rep=$('#rl-report');if(rep){rep.style.transition='none';rep.style.opacity=0}
  ['#rlsub','#rlslug','#rlcap'].forEach(s=>$(s).classList.remove('on'));
}
function prog(){const p=$('#rlp');if(p)p.style.width=(S.beat/R().beats.length*100)+'%'}
async function play(){
  const tok=++S.tok,Rl=R();S.paused=false;S.started=true;
  $('#rls').classList.remove('paused');$('#rlposter').hidden=true;$('#rlend').hidden=true;
  reset();cam('chief',0);$('#rlfade').style.transition='none';$('#rlfade').style.opacity=1;
  for(let i=0;i<Rl.beats.length;i++){
    if(tok!==S.tok)return;S.beat=i;prog();
    await doBeat(Rl.beats[i],tok);if(tok!==S.tok)return;await gate(tok);
  }
  if(tok!==S.tok)return;S.beat=Rl.beats.length;prog();finish();
}
function finish(){
  const Rl=R();markSeen(Rl.id);S.started=false;
  const f=$('#rlfade');f.style.transition='opacity .8s';f.style.opacity=.6;
  $('#rlend').hidden=false;
}
function setPause(p){
  if(!S.started)return;S.paused=p;const st=$('#rls');if(!st)return;st.classList.toggle('paused',p);
  const fl=$('#rlflash');fl.textContent=p?'⏸':'▶';if(!p){fl.classList.remove('pop');void fl.offsetWidth;fl.classList.add('pop')}
}
function unlockTTS(){if(!TTS)return;try{const u=new SpeechSynthesisUtterance(' ');u.volume=0;speechSynthesis.speak(u)}catch(e){}}

/* ---------- views ---------- */
function posterHTML(Rl){
  const names=Object.keys(Rl.cast).length;
  const note=!TTS||!haveVoice()?'<div class="rl-note" id="rlnote">مفيش صوت عربي على جهازك دلوقتي — هتشوف المشهد بالترجمة بس.</div>':'<div class="rl-note" id="rlnote" hidden></div>';
  return `<div class="rl-poster" id="rlposter"><span class="rl-pill">🎬 ${esc(Rl.tag||'ريل')} · فصل ${esc(Rl.ch)}</span><h2>${esc(Rl.title)}</h2><p>${esc(Rl.sub)}</p>
<button class="rl-play" data-rl="play" aria-label="تشغيل">▶</button><p>⏱ حوالي ${Rl.secs||60} ثانية · 🎭 ${names} شخصيات${SEEN[Rl.id]?' · ✓ شاهدته':''}</p>${note}</div>`;
}
function endHTML(Rl){
  const L=Rl.lesson;if(!L)return `<div class="rl-end" id="rlend" hidden><div class="rl-btns"><button class="rl-btn" data-rl="play">↻ أعد المشاهدة</button></div></div>`;
  return `<div class="rl-end" id="rlend" hidden><div class="rl-k">${esc(L.k)}</div><div class="rl-big">${esc(L.big)}<em>${esc(L.en)}</em></div><p class="rl-def">${esc(L.def)}</p>${L.defEn?`<p class="rl-def en" style="font-size:.78rem;opacity:.7;margin-top:-4px">${esc(L.defEn)}</p>`:''}
<div class="rl-five">${(L.five||[]).map((x,i)=>`<span class="${i===L.hit?'hit':''}">${i===L.hit?'✗ ':''}${esc(x)}</span>`).join('')}</div>
<ul class="rl-pts">${(L.pts||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
<div class="rl-btns"><button class="rl-btn pri" data-act="openCh" data-id="${esc(Rl.ch)}">📖 افتح الفصل ${esc(Rl.ch)}</button><button class="rl-btn" data-rl="play">↻ أعد المشاهدة</button></div></div>`;
}
function view(){
  injectCSS();const all=REELS();if(!all.length)return '<div class="card" style="margin:16px">مفيش ريلز لسه.</div>';
  if(S.idx>=all.length)S.idx=0;const Rl=R();
  const dots=all.length>1?`<div class="rl-dots">${all.map((_,i)=>`<i class="${i===S.idx?'on':''}"></i>`).join('')}</div>`:'';
  const media=Rl.video?`<video class="rl-vid" src="${esc(Rl.video)}" playsinline loop controls></video>`:sceneSVG(Rl);
  return `<div class="rl-wrap" id="rlw"><div class="rl-stage" id="rls">${media}<div class="rl-vig"></div>
<div class="rl-top"><div class="rl-prog"><i id="rlp"></i></div><div class="rl-chips"><span class="rl-pill">📖 فصل ${esc(Rl.ch)} · ${esc(Rl.std||'')}</span><span class="grow"></span><button class="rl-ib" data-rl="sound" id="rlsnd" aria-label="الصوت">${S.sound?'🔊':'🔇'}</button></div></div>
<div class="rl-slug" id="rlslug"></div><div class="rl-cap" id="rlcap"></div><div class="rl-sub" id="rlsub"></div><div class="rl-flash" id="rlflash">⏸</div><div class="rl-fade" id="rlfade"></div>${dots}
${Rl.video?'':posterHTML(Rl)}${Rl.video?'':endHTML(Rl)}</div></div>`;
}
function size(){
  const w=$('#rlw');if(!w)return;
  const h=$('header.top'),n=$('nav.bar');
  w.style.setProperty('--rlh',Math.max(320,window.innerHeight-(h?h.offsetHeight:0)-(n?n.offsetHeight:0))+'px');
}
let bound=false,ty=0;
function onClick(e){
  const st=e.target.closest('#rls');if(!st||!S.root)return;
  const b=e.target.closest('[data-rl]');
  if(b){
    const a=b.dataset.rl;
    if(a==='play'){unlockTTS();play()}
    else if(a==='sound'){S.sound=!S.sound;b.textContent=S.sound?'🔊':'🔇';if(!S.sound&&TTS)speechSynthesis.cancel()}
    return;
  }
  if(e.target.closest('[data-act]'))return;
  if(S.started&&$('#rlposter').hidden&&$('#rlend').hidden)setPause(!S.paused);
}
function switchTo(i){
  const n=REELS().length;if(n<2)return;
  S.tok++;if(TTS)speechSynthesis.cancel();S.started=false;S.idx=(i+n)%n;
  S.root.innerHTML=view();mount(S.root);
}
function mount(root){
  S.root=root;S.started=false;S.paused=false;S.tok++;
  document.body.classList.add('rl-on');size();
  const Rl=R();if(!Rl||Rl.video)return;
  reset();cam('wide',0);const f=$('#rlfade');if(f){f.style.transition='none';f.style.opacity=.25}
  if(!bound){
    bound=true;document.addEventListener('click',onClick);
    window.addEventListener('resize',()=>{if(S.root)size()});
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&S.started&&S.root)setPause(true)});
    document.addEventListener('touchstart',e=>{ty=e.touches[0].clientY},{passive:true});
    document.addEventListener('touchend',e=>{if(!S.root||!e.target.closest||!e.target.closest('#rls'))return;const d=e.changedTouches[0].clientY-ty;if(Math.abs(d)>90)switchTo(S.idx+(d<0?1:-1))},{passive:true});
  }
  setTimeout(()=>{loadVoices();const n=$('#rlnote');if(n&&haveVoice())n.hidden=true},600);
}
function unmount(){
  if(!S.root&&!document.body.classList.contains('rl-on'))return;
  S.tok++;S.root=null;S.started=false;if(TTS)try{speechSynthesis.cancel()}catch(e){}
  document.body.classList.remove('rl-on');
}
window.Reels={view,mount,unmount,list:REELS};
})();
