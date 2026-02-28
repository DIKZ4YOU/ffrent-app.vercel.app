import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const COIN_RATE   = 100;
const MIN_WD      = 2000;
const REG_BONUS   = 50;

const ADMIN_CONTACT = {
  name:    "FF Rent Official",
  wa:      "6281234567890",
  waText:  "08123-4567-890",
  email:   "admin@ffrent.id",
  email2:  "support@ffrent.id",
  ig:      "@ffrental.id",
  tiktok:  "@ffrent.official",
  discord: "discord.gg/ffrent",
  line:    "ffrent_official",
  openHour:"Setiap hari · 08.00 – 23.00 WIB",
};

const RANKS = ["Bronze","Silver","Gold","Platinum","Diamond","Heroic","Grand Master"];

const RANK_META = {
  "Bronze":      { color:"#cd7f32", glow:"rgba(205,127,50,0.4)",  bg:"linear-gradient(135deg,#2a1500,#3d2200)", badge:"🥉" },
  "Silver":      { color:"#c0c0c0", glow:"rgba(192,192,192,0.4)", bg:"linear-gradient(135deg,#1a1a1a,#2e2e2e)", badge:"🥈" },
  "Gold":        { color:"#ffd700", glow:"rgba(255,215,0,0.4)",   bg:"linear-gradient(135deg,#2a2000,#3d3000)", badge:"🥇" },
  "Platinum":    { color:"#e5e4e2", glow:"rgba(229,228,226,0.4)", bg:"linear-gradient(135deg,#1c1c2e,#2a2a3e)", badge:"💠" },
  "Diamond":     { color:"#00bfff", glow:"rgba(0,191,255,0.4)",   bg:"linear-gradient(135deg,#001a2e,#002a3e)", badge:"💎" },
  "Heroic":      { color:"#ff4500", glow:"rgba(255,69,0,0.5)",    bg:"linear-gradient(135deg,#2a0500,#3d0800)", badge:"⚔️" },
  "Grand Master":{ color:"#da70d6", glow:"rgba(218,112,214,0.5)", bg:"linear-gradient(135deg,#1a0028,#2a003a)", badge:"👑" },
};

/* Gradient avatars per rank */
const RANK_GRADIENT = {
  "Bronze":      "linear-gradient(135deg,#cd7f32,#8b4513)",
  "Silver":      "linear-gradient(135deg,#c0c0c0,#708090)",
  "Gold":        "linear-gradient(135deg,#ffd700,#ff8c00)",
  "Platinum":    "linear-gradient(135deg,#e5e4e2,#778899)",
  "Diamond":     "linear-gradient(135deg,#00bfff,#1e90ff)",
  "Heroic":      "linear-gradient(135deg,#ff4500,#dc143c)",
  "Grand Master":"linear-gradient(135deg,#da70d6,#8b008b)",
};

const ACCOUNT_PHOTOS = {
  "Grand Master": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80",
  "Heroic":       "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80",
  "Diamond":      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
  "Platinum":     "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80",
  "Gold":         "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80",
  "Silver":       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  "Bronze":       "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&q=80",
};

const EVENT_BANNERS = [
  "https://images.unsplash.com/photo-1620283085068-5f803da43bf1?w=400&q=80",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80",
  "https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&q=80",
];

const SYS_ACCOUNTS = [
  { id:"s1", ownerId:"system", ffId:"5582211990", ffEmail:"fireslayer99@gmail.com", ffPassword:"FireSlayer@99!", ffName:"ꜰɪʀᴇꜱʟᴀʏᴇʀ", level:97, rank:"Grand Master", heroes:["Alok","Chrono","K","Skyler","Wukong"], price:160, desc:"Full diamond Grand Master! Bundle skin Chrono & Skyler. Winrate 74% season ini. 🔥", available:true, rating:5.0, totalRent:312 },
  { id:"s2", ownerId:"system", ffId:"8823190045", ffEmail:"heroicking88@yahoo.com",  ffPassword:"HeroicKing@88!", ffName:"ʜᴇʀᴏɪᴄ·ᴋɪɴɢ", level:88, rank:"Heroic",      heroes:["Alok","Hayato","Chrono","K"],          price:90,  desc:"Heroic rank stabil! Skin senjata lengkap, karakter maxed. Cocok buat push rank! ⚔️", available:true, rating:4.9, totalRent:198 },
  { id:"s3", ownerId:"system", ffId:"3310994421", ffEmail:"diamondace77@gmail.com", ffPassword:"DiamondAce#77!", ffName:"ᴅɪᴀᴍᴏɴᴅ·ᴀᴄᴇ", level:75, rank:"Diamond",      heroes:["Alok","Maro","Skyler"],               price:55,  desc:"Diamond stabil dengan skin AR keren. Ideal untuk grinding rank bareng squad!", available:true, rating:4.7, totalRent:87 },
  { id:"s4", ownerId:"system", ffId:"7741882200", ffEmail:"goldrush55@gmail.com",   ffPassword:"GoldRush#55!",  ffName:"ɢᴏʟᴅ·ʀᴜꜱʜ",   level:58, rank:"Gold",         heroes:["Alok","Kapella"],                     price:35,  desc:"Akun gold santai buat warming up. Hero support siap dipakai. Cocok pemula!", available:true, rating:4.5, totalRent:43 },
];

const EVENTS_DATA = [
  { id:"e1", title:"Login Harian",  desc:"Klaim bonus koin setiap kamu login",               reward:10, type:"daily",   icon:"🌅", cooldown:24, banner:0 },
  { id:"e2", title:"Sewa Perdana",  desc:"Bonus sekali untuk sewa akun pertama kamu",         reward:25, type:"mission", icon:"🎮", cooldown:0,  banner:1 },
  { id:"e3", title:"Top Up Pertama",desc:"Bonus sekali untuk top up koin pertama kali",       reward:20, type:"mission", icon:"💎", cooldown:0,  banner:2 },
  { id:"e4", title:"Daftarkan Akun",desc:"Bonus sekali untuk mendaftarkan akun FF sendiri",   reward:40, type:"mission", icon:"📲", cooldown:0,  banner:0 },
  { id:"e5", title:"Streak 3 Hari", desc:"Harus login 3 hari berturut-turut tanpa jeda",     reward:50, type:"streak",  icon:"🔥", cooldown:0,  banner:1 },
  { id:"e6", title:"Weekend Bonus", desc:"Klaim setiap Sabtu atau Minggu saja",               reward:15, type:"weekend", icon:"🎉", cooldown:24, banner:2 },
  { id:"e7", title:"Rating Harian", desc:"Klaim setelah beri rating pada akun yang disewa",  reward:8,  type:"daily",   icon:"⭐", cooldown:24, banner:0 },
];

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: #07060e; font-family: 'DM Sans', sans-serif; overflow-x: hidden; -webkit-tap-highlight-color: transparent; }
:root {
  --gold: #c9a84c;
  --gold2: #f0cc7a;
  --amber: #ff9520;
  --red: #ff3d3d;
  --bg: #07060e;
  --bg2: #0d0c18;
  --bg3: #12101f;
  --line: rgba(255,255,255,0.06);
  --text: #e8e2d5;
  --muted: #6a6480;
  --card: rgba(255,255,255,0.03);
  --card-border: rgba(255,255,255,0.07);
}
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

/* ── Utility ── */
.ff { font-family: 'Cinzel', serif; }
.text-gold { color: var(--gold); }
.glow-gold { text-shadow: 0 0 30px rgba(201,168,76,0.6); }

/* ── Animations ── */
@keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.5} }
@keyframes shimmer{ 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes scanline{ 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
@keyframes spin   { to{transform:rotate(360deg)} }
@keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.2)} 50%{box-shadow:0 0 40px rgba(201,168,76,0.5)} }

.anim-fadeup  { animation: fadeUp .5s ease both; }
.anim-fadein  { animation: fadeIn .4s ease both; }

/* ── Cards ── */
.glass {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
}
.glass-gold {
  background: rgba(201,168,76,0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(201,168,76,0.2);
  border-radius: 16px;
}
.card-hover { transition: all .25s ease; cursor: pointer; }
.card-hover:hover { transform: translateY(-3px); border-color: rgba(201,168,76,0.35) !important; box-shadow: 0 12px 40px rgba(201,168,76,0.1); }

/* ── Buttons ── */
.btn { border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer; transition: all .2s ease; display: inline-flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; }
.btn-gold { background: linear-gradient(135deg, #c9a84c, #f0cc7a); color: #07060e; }
.btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,0.4); }
.btn-gold:active { transform: translateY(0); }
.btn-ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1) !important; color: var(--text); }
.btn-ghost:hover { background: rgba(255,255,255,0.09); border-color: rgba(201,168,76,0.3) !important; }
.btn-red-s { background: rgba(255,61,61,0.1); border: 1px solid rgba(255,61,61,0.25) !important; color: #ff7070; }
.btn-red-s:hover { background: rgba(255,61,61,0.2); }
.btn-green-s { background: rgba(0,210,120,0.1); border: 1px solid rgba(0,210,120,0.25) !important; color: #00d278; }
.btn-green-s:hover { background: rgba(0,210,120,0.2); }
.btn-sm { padding: 7px 14px; font-size: 12px; }
.btn-md { padding: 11px 20px; font-size: 14px; }
.btn-lg { padding: 14px 28px; font-size: 15px; }
.btn-full { width: 100%; }

/* ── Input ── */
.inp {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 10px;
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  padding: 12px 14px;
  width: 100%;
  outline: none;
  transition: border-color .2s;
}
.inp:focus { border-color: var(--gold); background: rgba(201,168,76,0.04); }
.inp::placeholder { color: var(--muted); }
select.inp { appearance: none; }
textarea.inp { resize: vertical; min-height: 80px; }

/* ── Badge / Tag ── */
.chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.chip-gold { background: rgba(201,168,76,0.12); border: 1px solid rgba(201,168,76,0.25); color: var(--gold2); }
.chip-green { background: rgba(0,210,120,0.1); border: 1px solid rgba(0,210,120,0.2); color: #2dda8a; }
.chip-red { background: rgba(255,61,61,0.1); border: 1px solid rgba(255,61,61,0.2); color: #ff7070; }
.chip-blue { background: rgba(80,160,255,0.1); border: 1px solid rgba(80,160,255,0.2); color: #80bcff; }
.chip-muted { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: var(--muted); }

/* ── Notification ── */
.notif {
  position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
  z-index: 9999; padding: 12px 22px; border-radius: 12px;
  font-size: 13px; font-weight: 600; animation: fadeUp .3s ease;
  backdrop-filter: blur(20px); white-space: nowrap; max-width: 90vw;
}
.notif-ok  { background: rgba(0,50,30,0.9); border: 1px solid rgba(0,210,120,0.4); color: #2dda8a; }
.notif-err { background: rgba(50,0,0,0.9);  border: 1px solid rgba(255,61,61,0.4); color: #ff7070; }
.notif-inf { background: rgba(10,8,25,0.9); border: 1px solid rgba(201,168,76,0.4); color: var(--gold2); }

/* ── Modal ── */
.modal-bg { position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;animation:fadeIn .2s ease; }
.modal-box { background:linear-gradient(160deg,#0f0e1d,#13121f);border:1px solid rgba(201,168,76,0.2);border-radius:20px;width:100%;max-width:440px;max-height:88vh;overflow-y:auto;padding:28px; }

/* ── Nav ── */
.nav-btn { display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:8px 10px;border-radius:10px;transition:all .2s;color:var(--muted);font-size:10px;font-weight:600;border:none;background:none;font-family:'DM Sans',sans-serif; }
.nav-btn.on { color:var(--gold); background:rgba(201,168,76,0.08); }
.nav-btn:hover:not(.on) { color:var(--text); }

/* ── Progress ── */
.prog-bar { background:rgba(255,255,255,0.06);border-radius:20px;overflow:hidden; }
.prog-fill { height:100%;border-radius:20px;background:linear-gradient(90deg,var(--gold),var(--amber));transition:width .6s ease; }

/* ── Account Photo Card ── */
.acc-photo { position:relative;border-radius:16px;overflow:hidden;aspect-ratio:16/9; }
.acc-photo img { width:100%;height:100%;object-fit:cover;transition:transform .4s ease; }
.card-hover:hover .acc-photo img { transform:scale(1.05); }
.acc-photo-overlay { position:absolute;inset:0;background:linear-gradient(to top,rgba(5,4,15,0.95) 0%,rgba(5,4,15,0.4) 50%,rgba(5,4,15,0.1) 100%); }
.acc-photo-badge { position:absolute;top:12px;right:12px; }
.acc-photo-footer { position:absolute;bottom:0;left:0;right:0;padding:16px; }

/* ── Avatar Ring ── */
.avatar-ring { border-radius:50%;padding:3px;display:inline-flex; }

/* ── Separator ── */
.sep { height:1px;background:var(--line);margin:0; }

/* AI bubbles */
.bub-me  { background:linear-gradient(135deg,var(--gold),var(--amber));color:#07060e;border-radius:18px 18px 4px 18px;padding:12px 16px;max-width:78%;margin-left:auto;font-size:13px;line-height:1.55; }
.bub-ai  { background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);color:var(--text);border-radius:18px 18px 18px 4px;padding:12px 16px;max-width:78%;font-size:13px;line-height:1.55; }

/* ── Mesh BG ── */
.mesh-bg { position:fixed;inset:0;pointer-events:none;z-index:0; }
.mesh-bg::before { content:'';position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(201,168,76,0.06) 0%,transparent 70%);top:-100px;right:-100px;border-radius:50%; }
.mesh-bg::after { content:'';position:absolute;width:400px;height:400px;background:radial-gradient(circle,rgba(255,69,0,0.04) 0%,transparent 70%);bottom:-80px;left:-80px;border-radius:50%; }

/* Dot online */
.dot-on { width:7px;height:7px;background:#00d278;border-radius:50%;animation:pulse 2s infinite; }

/* Scan line effect for auth */
.scanline { position:absolute;width:100%;height:2px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.3),transparent);animation:scanline 3s linear infinite;pointer-events:none;z-index:1; }

/* Star rating */
.star-on  { color:#ffd700; }
.star-off { color:rgba(255,255,255,0.15); }

/* Streak dots */
.str-dot { width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;border:1px solid; }
.str-done { background:rgba(255,149,32,0.2);border-color:rgba(255,149,32,0.5);color:var(--amber); }
.str-todo { background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.08);color:var(--muted); }

/* Tier icon animation */
.tier-float { animation: float 3s ease-in-out infinite; }
`;

/* ─────────────────────────────────────────────
   TINY HELPERS
───────────────────────────────────────────── */
function Notif({ n }) {
  if (!n) return null;
  const cls = n.t==="ok"?"notif-ok":n.t==="err"?"notif-err":"notif-inf";
  return <div className={`notif ${cls}`}>{n.msg}</div>;
}

function Stars({ v=0, max=5 }) {
  return <span>{Array.from({length:max}).map((_,i)=><span key={i} className={i<Math.round(v)?"star-on":"star-off"}>★</span>)}</span>;
}

function Label({ children, htmlFor, style={} }) {
  return <label htmlFor={htmlFor} style={{ display:"block", color:"var(--muted)", fontSize:11, fontWeight:700, letterSpacing:.8, textTransform:"uppercase", marginBottom:8, ...style }}>{children}</label>;
}

function Section({ title, action, onAction, children, style={} }) {
  return (
    <div style={{ ...style }}>
      {title && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontFamily:"Cinzel,serif", fontSize:14, fontWeight:700, color:"var(--text)", letterSpacing:.5 }}>{title}</span>
          {action && <button className="btn btn-ghost btn-sm" onClick={onAction} style={{ fontSize:12, color:"var(--gold)" }}>{action}</button>}
        </div>
      )}
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ACCOUNT PHOTO CARD
───────────────────────────────────────────── */
function AccCard({ acc, rented, onClick }) {
  const rm = RANK_META[acc.rank] || RANK_META["Bronze"];
  const photo = ACCOUNT_PHOTOS[acc.rank] || ACCOUNT_PHOTOS["Gold"];
  return (
    <div className="glass card-hover" style={{ overflow:"hidden", border:`1px solid ${rm.color}22` }} onClick={onClick}>
      {/* Photo Banner */}
      <div className="acc-photo">
        <img src={photo} alt={acc.ffName} loading="lazy" onError={e=>{ e.target.style.display="none"; }} />
        <div className="acc-photo-overlay" />
        <div className="acc-photo-badge">
          {rented
            ? <span className="chip chip-red">🔴 Disewa</span>
            : <span className="chip chip-green">🟢 Tersedia</span>
          }
        </div>
        <div className="acc-photo-footer">
          <div style={{ fontFamily:"Cinzel,serif", fontSize:16, fontWeight:700, color:"#fff", marginBottom:4 }}>{acc.ffName}</div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <span className="chip" style={{ background:`${rm.color}22`, border:`1px solid ${rm.color}44`, color:rm.color, fontSize:11 }}>{rm.badge} {acc.rank}</span>
            <span style={{ color:"rgba(255,255,255,0.5)", fontSize:12 }}>Lv.{acc.level}</span>
            {acc.rating>0 && <span style={{ color:"#ffd700", fontSize:12 }}>★ {acc.rating}</span>}
          </div>
        </div>
      </div>
      {/* Info Bar */}
      <div style={{ padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {(acc.heroes||[]).slice(0,3).map((h,i)=>(
              <span key={i} className="chip chip-muted" style={{ fontSize:10 }}>{h}</span>
            ))}
            {acc.heroes?.length>3 && <span className="chip chip-muted" style={{ fontSize:10 }}>+{acc.heroes.length-3}</span>}
          </div>
          <div style={{ color:"var(--muted)", fontSize:11, marginTop:6 }}>🔄 {acc.totalRent}x disewa</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"Cinzel,serif", fontSize:20, fontWeight:700, color:"var(--gold)" }}>{acc.price}</div>
          <div style={{ color:"var(--muted)", fontSize:10, fontWeight:600 }}>KOIN / JAM</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EVENT CARD
───────────────────────────────────────────── */
function EvCard({ ev, canClaim, statusLabel, onClaim }) {
  const photo = EVENT_BANNERS[ev.banner % EVENT_BANNERS.length];
  return (
    <div className="glass card-hover" style={{ overflow:"hidden" }}>
      <div style={{ position:"relative", height:100, overflow:"hidden" }}>
        <img src={photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.4) saturate(1.3)" }} onError={e=>{e.target.style.display="none";}} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right,rgba(7,6,14,0.8),rgba(7,6,14,0.2))" }} />
        <div style={{ position:"absolute", inset:0, padding:"16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:28 }}>{ev.icon}</div>
              <div style={{ fontFamily:"Cinzel,serif", fontSize:14, fontWeight:700, color:"#fff", marginTop:4 }}>{ev.title}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"Cinzel,serif", fontSize:22, fontWeight:700, color:"var(--gold)" }}>+{ev.reward}</div>
              <div style={{ color:"var(--muted)", fontSize:10, fontWeight:700 }}>KOIN</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ color:"var(--muted)", fontSize:12, flex:1, marginRight:12 }}>{ev.desc}</div>
        <button
          className={`btn btn-sm ${canClaim?"btn-gold":"btn-ghost"}`}
          onClick={canClaim ? onClaim : undefined}
          style={{ flexShrink:0, opacity: canClaim?1:0.6, cursor: canClaim?"pointer":"default" }}
        >{statusLabel}</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   COIN BADGE
───────────────────────────────────────────── */
function CoinBadge({ v }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(201,168,76,0.1)", border:"1px solid rgba(201,168,76,0.25)", borderRadius:20, padding:"6px 14px" }}>
      <span style={{ fontSize:14 }}>🪙</span>
      <span style={{ fontFamily:"Cinzel,serif", fontSize:13, fontWeight:700, color:"var(--gold2)" }}>{v?.toLocaleString()}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function Member() {
  const [ready, setReady] = useState(false);
  const [user,  setUser]  = useState(null);
  const [page,  setPage]  = useState("auth");
  const [tab,   setTab]   = useState("login");
  const [notif, setNotif] = useState(null);
  const [modal, setModal] = useState(null);

  /* data stores */
  const [users,    setUsers]    = useState([]);
  const [accs,     setAccs]     = useState(SYS_ACCOUNTS);
  const [rentals,  setRentals]  = useState([]);
  const [evDone,   setEvDone]   = useState([]);
  const [topups,   setTopups]   = useState([]);
  const [wds,      setWds]      = useState([]);
  const [cfg,      setCfg]      = useState({ qrisImg:"", qrisName:"FF Rent Pay", qrisPhone:"08123456789" });

  /* forms */
  const [aForm, setAForm] = useState({ u:"", p:"", ph:"", c:"" });
  const [dur,   setDur]   = useState(1);
  const [lForm, setLForm] = useState({ ffId:"", ffEmail:"", ffPw:"", ffName:"", lv:"", rank:"Heroic", heroes:"", price:"", desc:"" });
  const [tForm, setTForm] = useState({ amt:50000, proof:"" });
  const [wForm, setWForm] = useState({ coins:MIN_WD, bank:"", no:"", name:"" });
  const [aiMsgs, setAiMsgs]  = useState([{ r:"ai", m:"Halo Bosku! 👋 Gue **FF Bot** — AI asisten expert buat FF Rent!\n\nGue bisa bantu:\n🎮 Rekomendasikan akun sesuai budget\n💎 Panduan top up & withdraw\n🔥 Tips push rank Free Fire\n🎁 Info event & cara dapet koin\n📞 Arahkan ke admin jika butuh bantuan\n\nTanya aja langsung, gue siap! 😎" }]);
  const [aiIn,   setAiIn]    = useState("");
  const [aiLoad, setAiLoad]  = useState(false);
  const [bFilter,setBFilter] = useState("all");
  const aiRef = useRef(null);

  /* ── Load storage ── */
  useEffect(()=>{
    (async()=>{
      const keys = ["users","accs","rentals","evDone","topups","wds","cfg"];
      for(const k of keys){
        try{
          const r = await window.storage.get(k);
          if(r?.value){
            const d=JSON.parse(r.value);
            if(k==="users")   setUsers(d);
            if(k==="accs"&&d.length) setAccs(d);
            if(k==="rentals") setRentals(d);
            if(k==="evDone")  setEvDone(d);
            if(k==="topups")  setTopups(d);
            if(k==="wds")     setWds(d);
            if(k==="cfg")     setCfg(s=>({...s,...d}));
          }
        }catch{}
      }
      setReady(true);
    })();
  },[]);

  useEffect(()=>{ if(aiRef.current) aiRef.current.scrollIntoView({behavior:"smooth"}); },[aiMsgs]);

  const sv = useCallback((k,d)=>{ try{ window.storage.set(k,JSON.stringify(d)); }catch{} },[]);
  const toast = useCallback((msg,t="ok")=>{ setNotif({msg,t}); setTimeout(()=>setNotif(null),3400); },[]);

  const setU  =(u)=>{ const nx=users.map(x=>x.id===u.id?u:x); setUsers(nx); sv("users",nx); setUser(u); };
  const setAs =(a)=>{ setAccs(a); sv("accs",a); };
  const setRs =(r)=>{ setRentals(r); sv("rentals",r); };
  const setEvs=(e)=>{ setEvDone(e); sv("evDone",e); };
  const setTs =(t)=>{ setTopups(t); sv("topups",t); };
  const setWs =(w)=>{ setWds(w); sv("wds",w); };

  /* ── AUTH ── */
  const doLogin = ()=>{
    const found=users.find(u=>u.username===aForm.u&&u.password===aForm.p);
    if(!found){toast("Username atau password salah!","err");return;}
    const now=new Date();
    const last=found.lastLogin?new Date(found.lastLogin):null;
    let streak=found.streak||0;
    if(last){ const diff=(now-last)/86400000; streak=diff<2?streak+1:1; } else streak=1;
    const nu={...found,lastLogin:now.toISOString(),streak};
    const nx=users.map(u=>u.id===nu.id?nu:u); setUsers(nx); sv("users",nx);
    setUser(nu); setPage("home");
    toast(`Selamat datang, ${nu.username}! 🔥 Streak ${streak} hari`);
  };

  const doReg = ()=>{
    if(!aForm.u||!aForm.p||!aForm.ph){toast("Semua field wajib diisi","err");return;}
    if(aForm.p!==aForm.c){toast("Password tidak cocok","err");return;}
    if(users.find(u=>u.username===aForm.u)){toast("Username sudah dipakai","err");return;}
    const nu={ id:Date.now().toString(), username:aForm.u, password:aForm.p, phone:aForm.ph,
               coins:REG_BONUS, createdAt:new Date().toISOString(), streak:1, lastLogin:new Date().toISOString() };
    const nx=[...users,nu]; setUsers(nx); sv("users",nx);
    setUser(nu); setPage("home");
    toast(`Registrasi berhasil! +${REG_BONUS} koin bonus 🎉`);
  };

  const doLogout=()=>{ setUser(null); setPage("auth"); };

  /* ── RENT ── */
  const doRent=(acc)=>{
    const cost=acc.price*dur;
    if(user.coins<cost){toast(`Koin kurang! Butuh ${cost} koin`,"err");return;}
    if(rentals.find(r=>r.accId===acc.id&&r.status==="active")){toast("Akun sedang disewa orang lain","err");return;}
    const r={ id:Date.now().toString(), accId:acc.id, uid:user.id, uname:user.username,
              start:new Date().toISOString(), end:new Date(Date.now()+dur*3600000).toISOString(),
              status:"active", cost, dur };
    /* pay payout to owner */
    if(acc.ownerId!=="system"){
      const own=users.find(u=>u.id===acc.ownerId);
      if(own){ const payout=Math.floor(cost*.8); const no={...own,coins:own.coins+payout};
        const nx=users.map(u=>u.id===no.id?no:u); setUsers(nx); sv("users",nx); }
    }
    /* update acc totalRent */
    setAs(accs.map(a=>a.id===acc.id?{...a,totalRent:(a.totalRent||0)+1}:a));
    setRs([...rentals,r]);
    const nu={...user,coins:user.coins-cost}; setU(nu);
    setModal({t:"rentOk",acc,r}); toast("Sewa berhasil! Data akun ditampilkan 🎮");
  };

  /* ── EVENT ── */
  const doEvent=(ev)=>{
    const now=Date.now();
    const mine=evDone.filter(e=>e.uid===user.id&&e.evId===ev.id);
    if(ev.type==="mission"&&mine.length>0){toast("Sudah diklaim","err");return;}
    if(ev.type==="streak"){
      if(mine.length>0){toast("Sudah diklaim","err");return;}
      if((user.streak||0)<3){toast(`Streak ${user.streak||0}/3 hari belum cukup`,"err");return;}
    }
    if(ev.type==="weekend"){
      const d=new Date().getDay();
      if(d!==0&&d!==6){toast("Hanya bisa klaim Sabtu-Minggu","err");return;}
    }
    if((ev.type==="daily"||ev.type==="weekend")&&mine.length>0){
      const diff=now-new Date(mine[mine.length-1].t).getTime();
      if(diff<ev.cooldown*3600000){toast("Belum waktunya klaim lagi ⏳","err");return;}
    }
    setEvs([...evDone,{uid:user.id,evId:ev.id,t:new Date().toISOString()}]);
    setU({...user,coins:user.coins+ev.reward});
    toast(`+${ev.reward} koin dari ${ev.title} 🎉`);
  };

  /* ── TOP UP ── */
  const doTopup=()=>{
    if(!tForm.amt||tForm.amt<10000){toast("Minimal top up Rp 10.000","err");return;}
    if(!tForm.proof){toast("Upload bukti transfer dulu 📸","err");return;}
    const coins=Math.floor(tForm.amt/COIN_RATE);
    const tp={id:Date.now().toString(),uid:user.id,uname:user.username,amt:tForm.amt,coins,status:"pending",proof:tForm.proof,at:new Date().toISOString()};
    setTs([...topups,tp]);
    setTForm({amt:50000,proof:""});
    toast("Permintaan top up terkirim! Tunggu konfirmasi admin ⏳","inf");
  };

  /* ── WITHDRAW ── */
  const doWd=()=>{
    if(wForm.coins<MIN_WD){toast(`Minimal withdraw ${MIN_WD} koin`,"err");return;}
    if(user.coins<wForm.coins){toast("Koin tidak cukup","err");return;}
    if(!wForm.bank||!wForm.no||!wForm.name){toast("Lengkapi data rekening","err");return;}
    const wd={id:Date.now().toString(),uid:user.id,uname:user.username,coins:wForm.coins,amt:wForm.coins*COIN_RATE,bank:wForm.bank,accNo:wForm.no,accName:wForm.name,status:"pending",at:new Date().toISOString()};
    setU({...user,coins:user.coins-wForm.coins});
    setWs([...wds,wd]);
    setWForm({coins:MIN_WD,bank:"",no:"",name:""});
    toast("Withdraw terkirim! Diproses 1×24 jam ⏳","inf");
  };

  /* ── LIST OWN ACC ── */
  const doList=()=>{
    if(!lForm.ffId||!lForm.ffPw||!lForm.ffName||!lForm.price){toast("Lengkapi semua data akun","err");return;}
    const na={id:Date.now().toString(),ownerId:user.id,ownerName:user.username,
      ffId:lForm.ffId, ffEmail:lForm.ffEmail||"",
      ffPassword:lForm.ffPw,ffName:lForm.ffName,
      level:parseInt(lForm.lv)||1,rank:lForm.rank,
      heroes:lForm.heroes?lForm.heroes.split(",").map(h=>h.trim()):[],
      price:parseInt(lForm.price),desc:lForm.desc,available:true,rating:0,totalRent:0};
    setAs([...accs,na]);
    setLForm({ffId:"",ffEmail:"",ffPw:"",ffName:"",lv:"",rank:"Heroic",heroes:"",price:"",desc:""});
    toast("Akun berhasil didaftarkan! 🎉");
  };

  /* ── AI CHAT ── */
  const doAi=async()=>{
    if(!aiIn.trim()||aiLoad) return;
    const msg=aiIn.trim(); setAiIn("");
    const next=[...aiMsgs,{r:"me",m:msg}]; setAiMsgs(next); setAiLoad(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`Kamu adalah FF Bot — AI asisten canggih & expert untuk platform FF Rent Indonesia (sewa akun Free Fire).

KEPRIBADIAN: Gaul, ramah, percaya diri, responsif. Pakai bahasa Indo casual + emoji relevan. Bukan sekedar menjawab, tapi kasih insight berguna.

KNOWLEDGE BASE PLATFORM:
- Koin: 1 koin = Rp ${COIN_RATE} | Bonus daftar: ${REG_BONUS} koin
- Sewa: bayar pakai koin per jam, data akun (email+password) langsung muncul otomatis
- Owner akun: dapat 80% dari harga sewa, platform 20%
- Top up: transfer ke QRIS/bank → upload bukti → admin konfirmasi
- Withdraw: min ${MIN_WD} koin (Rp ${(MIN_WD*COIN_RATE).toLocaleString()}) → pilih bank/ewallet → proses 1×24 jam
- Event reward (kecil tapi fair): Login harian 10, Sewa pertama 25, Top up pertama 20, Daftar akun 40, Streak 3 hari 50, Weekend 15, Rating 8 koin
- Admin: WA ${ADMIN_CONTACT.waText} | Email ${ADMIN_CONTACT.email} | IG ${ADMIN_CONTACT.ig}
- Jam operasional: ${ADMIN_CONTACT.openHour}

FREE FIRE EXPERTISE (jawab pertanyaan game dengan akurat):
- Karakter meta: Alok (heal+speed aura), Chrono (force field), K (EP recovery), Skyler (restore shield), Jota (heal on kill), Dimitri (heal zone), Maro (distance damage), Wukong (camouflage)
- Mode: Battle Royale, Clash Squad, Lone Wolf, Craftland
- Tips push rank: pilih landing spot aman, pastikan inventory lengkap sebelum fight, gunakan cover, communication dengan squad
- Rank system: Bronze → Silver → Gold → Platinum → Diamond → Heroic → Grand Master
- Senjata meta: SMG SPAS atau MP40 close range, AR M4A1 atau AK medium, Sniper untuk jarak jauh
- Karakter support terbaik untuk squad: Alok+Dimitri+K atau Alok+Skyler+Wukong
- Tips grinding koin di platform: sewa akun, daftar akun sendiri, rajin klaim event harian

CARA BANTU:
- Rekomendasikan akun yang sesuai budget & tujuan user
- Jelaskan step by step jika ditanya cara top up/sewa/WD
- Kasih tips FF yang actionable
- Jika ada keluhan, arahkan ke admin WA/email
- Jika nanya soal teknis error, minta screenshot dan arahkan ke admin

FORMAT JAWABAN: Singkat tapi padat (max 200 kata). Pakai poin jika ada beberapa hal. Selalu akhiri dengan pertanyaan follow-up jika relevan.`,
          messages:next.map(m=>({role:m.r==="me"?"user":"assistant",content:m.m}))})});
      const d=await res.json();
      setAiMsgs([...next,{r:"ai",m:d.content?.[0]?.text||"Maaf ada gangguan 😅 Coba lagi!"}]);
    }catch{
      setAiMsgs([...next,{r:"ai",m:"Koneksi bermasalah nih. Coba lagi atau hubungi admin ya! 😅"}]);
    }
    setAiLoad(false);
  };

  /* ─────────────────────────────────────────
     DERIVED
  ───────────────────────────────────────── */
  if(!ready) return (
    <div style={{background:"#07060e",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{G}</style>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:60,animation:"float 2s infinite"}}>⚔️</div>
        <div className="ff" style={{color:"var(--gold)",fontSize:26,fontWeight:700,marginTop:16,letterSpacing:3}}>FF RENT</div>
        <div style={{color:"var(--muted)",fontSize:13,marginTop:6}}>Loading…</div>
      </div>
    </div>
  );

  const myRents  = rentals.filter(r=>r.uid===user?.id);
  const myAccs   = accs.filter(a=>a.ownerId===user?.id);
  const activeR  = myRents.find(r=>r.status==="active"&&new Date(r.end)>new Date());
  const myTopups = topups.filter(t=>t.uid===user?.id);
  const myWds    = wds.filter(w=>w.uid===user?.id);

  const filteredAccs = accs.filter(a=>{
    if(bFilter==="free")   return !rentals.find(r=>r.accId===a.id&&r.status==="active");
    if(bFilter==="top")    return ["Heroic","Grand Master"].includes(a.rank);
    if(bFilter==="cheap")  return a.price<=50;
    return true;
  });

  /* ══════════════════════════════════════
     PAGE: AUTH
  ══════════════════════════════════════ */
  const pageAuth=()=>(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,position:"relative",overflow:"hidden"}}>
      {/* bg glow */}
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(201,168,76,0.08) 0%,transparent 60%)"}} />
      <div className="scanline" />

      {/* logo */}
      <div style={{textAlign:"center",marginBottom:36,position:"relative",zIndex:1}}>
        <div style={{fontSize:64,animation:"float 3s infinite",marginBottom:8}}>⚔️</div>
        <div className="ff glow-gold" style={{fontSize:44,fontWeight:900,color:"var(--gold)",letterSpacing:6}}>FF RENT</div>
        <div style={{color:"var(--muted)",fontSize:13,marginTop:6,letterSpacing:2}}>PLATFORM SEWA AKUN FREE FIRE</div>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:16}}>
          {["⚡ Instan","🔒 Aman","👑 Premium"].map(x=>(
            <span key={x} className="chip chip-gold" style={{fontSize:11}}>{x}</span>
          ))}
        </div>
      </div>

      {/* card */}
      <div className="glass" style={{width:"100%",maxWidth:380,padding:28,position:"relative",zIndex:1}}>
        {/* tabs */}
        <div style={{display:"flex",background:"rgba(255,255,255,0.03)",borderRadius:10,padding:4,marginBottom:24}}>
          {[["login","🚪 Login"],["reg","✨ Daftar"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"9px",border:"none",borderRadius:8,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",transition:"all .2s",background:tab===k?"linear-gradient(135deg,var(--gold),var(--amber))":"transparent",color:tab===k?"#07060e":"var(--muted)"}}>
              {l}
            </button>
          ))}
        </div>

        {tab==="login"?(
          <div style={{display:"grid",gap:14}}>
            <div><Label>Username</Label><input className="inp" placeholder="Masukkan username" value={aForm.u} onChange={e=>setAForm({...aForm,u:e.target.value})} onKeyDown={e=>e.key==="Enter"&&doLogin()} /></div>
            <div><Label>Password</Label><input className="inp" type="password" placeholder="Masukkan password" value={aForm.p} onChange={e=>setAForm({...aForm,p:e.target.value})} onKeyDown={e=>e.key==="Enter"&&doLogin()} /></div>
            <button className="btn btn-gold btn-lg btn-full" style={{marginTop:4}} onClick={doLogin}>Masuk →</button>
            <div style={{textAlign:"center",color:"var(--muted)",fontSize:12}}>Admin? user: <b style={{color:"var(--gold)"}}>admin</b> / pass: <b style={{color:"var(--gold)"}}>admin123</b></div>
          </div>
        ):(
          <div style={{display:"grid",gap:12}}>
            {[["Username","u","text","Buat username unik"],["No. HP","ph","tel","08xxxxxxxxxx"],["Password","p","password","Min 6 karakter"],["Konfirmasi","c","password","Ulangi password"]].map(([l,k,t,ph])=>(
              <div key={k}><Label>{l}</Label><input className="inp" type={t} placeholder={ph} value={aForm[k]} onChange={e=>setAForm({...aForm,[k]:e.target.value})} /></div>
            ))}
            <div className="glass-gold" style={{padding:"10px 14px",marginTop:2}}>
              <div style={{color:"var(--gold2)",fontSize:13,fontWeight:600}}>🎁 Bonus registrasi: <b>{REG_BONUS} koin gratis!</b></div>
            </div>
            <button className="btn btn-gold btn-lg btn-full" onClick={doReg}>Daftar Sekarang ✨</button>
          </div>
        )}
      </div>
    </div>
  );

  /* ══════════════════════════════════════
     PAGE: HOME
  ══════════════════════════════════════ */
  const pageHome=()=>{
    const streak=user.streak||1;
    return (
      <div style={{padding:"20px 16px 90px"}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div>
            <div style={{color:"var(--muted)",fontSize:12,marginBottom:2}}>Selamat datang 👋</div>
            <div className="ff" style={{fontSize:20,fontWeight:700,color:"var(--text)"}}>{user.username}</div>
          </div>
          <CoinBadge v={user.coins} />
        </div>

        {/* Hero Banner */}
        <div style={{position:"relative",borderRadius:20,overflow:"hidden",marginBottom:20,height:180}}>
          <img src={ACCOUNT_PHOTOS["Grand Master"]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.4)"}} />
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(7,6,14,0.9) 0%,rgba(7,6,14,0.3) 100%)"}} />
          <div style={{position:"absolute",inset:0,padding:"22px 20px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
            <div>
              <span className="chip chip-gold" style={{fontSize:11}}>👑 AKUN TERPILIH</span>
              <div className="ff" style={{fontSize:22,fontWeight:700,color:"#fff",marginTop:8}}>Grand Master Elite</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:13,marginTop:4}}>Dari 160 koin/jam · Skin legend semua</div>
            </div>
            <button className="btn btn-gold btn-sm" style={{alignSelf:"flex-start"}} onClick={()=>setPage("browse")}>Lihat Semua Akun →</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
          {[
            {label:"Koin",val:user.coins?.toLocaleString(),icon:"💰",c:"var(--gold)"},
            {label:"Streak",val:`${streak}d 🔥`,icon:null,c:"var(--amber)"},
            {label:"Sewa",val:myRents.length,icon:"🎮",c:"#80bcff"},
          ].map(s=>(
            <div key={s.label} className="glass" style={{padding:"14px 12px",textAlign:"center"}}>
              <div className="ff" style={{fontSize:18,fontWeight:700,color:s.c}}>{s.val}</div>
              <div style={{color:"var(--muted)",fontSize:11,fontWeight:600,marginTop:2}}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Active Rental */}
        {activeR&&(()=>{
          const acc=accs.find(a=>a.id===activeR.accId);
          const rem=Math.max(0,new Date(activeR.end)-new Date());
          const h=Math.floor(rem/3600000), m=Math.floor((rem%3600000)/60000);
          const rm=RANK_META[acc?.rank]||RANK_META["Bronze"];
          return (
            <div className="glass" style={{padding:16,marginBottom:20,border:`1px solid ${rm.color}33`,background:`linear-gradient(135deg,rgba(7,6,14,0.8),${rm.color}08)`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <span className="chip chip-green" style={{fontSize:11,marginBottom:6}}>⚡ SEWA AKTIF</span>
                  <div className="ff" style={{fontSize:16,fontWeight:700,color:"#fff"}}>{acc?.ffName||"Akun FF"}</div>
                  <div style={{color:"var(--muted)",fontSize:12,marginTop:2}}>Sisa: {h}j {m}m</div>
                </div>
                <button className="btn btn-gold btn-sm" onClick={()=>setModal({t:"rentOk",acc,r:activeR})}>Lihat Akun 👀</button>
              </div>
            </div>
          );
        })()}

        {/* Quick Menu */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:24}}>
          {[["browse","🎮","Sewa"],["events","🎁","Event"],["topup","💎","Top Up"],["contact","📞","CS"]].map(([p,ic,lb])=>(
            <button key={p} onClick={()=>setPage(p)} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,transition:"all .2s"}}
              onMouseOver={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.3)";e.currentTarget.style.background="rgba(201,168,76,0.05)";}}
              onMouseOut={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.07)";e.currentTarget.style.background="rgba(255,255,255,0.03)";}}>
              <span style={{fontSize:26}}>{ic}</span>
              <span style={{color:"var(--text)",fontSize:11,fontWeight:700,letterSpacing:.3}}>{lb}</span>
            </button>
          ))}
        </div>

        {/* Featured Accounts */}
        <Section title="🔥 Akun Populer" action="Lihat Semua" onAction={()=>setPage("browse")}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {accs.slice(0,3).map(acc=>(
              <AccCard key={acc.id} acc={acc} rented={!!rentals.find(r=>r.accId===acc.id&&r.status==="active")} onClick={()=>setModal({t:"accDetail",acc})} />
            ))}
          </div>
        </Section>
      </div>
    );
  };

  /* ══════════════════════════════════════
     PAGE: BROWSE
  ══════════════════════════════════════ */
  const pageBrowse=()=>(
    <div style={{padding:"20px 16px 90px"}}>
      <div className="ff" style={{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:4}}>Sewa Akun FF</div>
      <div style={{color:"var(--muted)",fontSize:13,marginBottom:16}}>Pilih akun impianmu dan mulai bermain!</div>

      {/* Filter */}
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:20}}>
        {[["all","Semua"],["free","Tersedia"],["top","Heroic+"],["cheap","≤50 koin"]].map(([k,l])=>(
          <button key={k} onClick={()=>setBFilter(k)} style={{padding:"8px 16px",borderRadius:20,border:"none",fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",flexShrink:0,transition:"all .2s",background:bFilter===k?"linear-gradient(135deg,var(--gold),var(--amber))":rgba01,color:bFilter===k?"#07060e":"var(--muted)"}}>
            {l}
          </button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {filteredAccs.map(acc=>{
          const rented=!!rentals.find(r=>r.accId===acc.id&&r.status==="active");
          return <AccCard key={acc.id} acc={acc} rented={rented} onClick={()=>{ if(!rented) setModal({t:"accDetail",acc}); }} />;
        })}
        {!filteredAccs.length&&(
          <div style={{textAlign:"center",padding:"40px 0",color:"var(--muted)"}}>
            <div style={{fontSize:48}}>🔍</div>
            <div style={{marginTop:8}}>Tidak ada akun sesuai filter</div>
          </div>
        )}
      </div>
    </div>
  );

  /* ══════════════════════════════════════
     PAGE: EVENTS
  ══════════════════════════════════════ */
  const pageEvents=()=>{
    const now=Date.now(), day=new Date().getDay();
    return (
      <div style={{padding:"20px 16px 90px"}}>
        <div className="ff" style={{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:4}}>Event & Hadiah</div>
        <div style={{color:"var(--muted)",fontSize:13,marginBottom:20}}>Selesaikan event untuk dapat koin gratis!</div>

        {/* Streak Banner */}
        <div style={{background:"linear-gradient(135deg,rgba(255,149,32,0.1),rgba(255,61,61,0.08))",border:"1px solid rgba(255,149,32,0.2)",borderRadius:16,padding:16,marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:"var(--amber)",fontSize:12,fontWeight:700,letterSpacing:.5,marginBottom:4}}>LOGIN STREAK</div>
              <div className="ff" style={{fontSize:28,fontWeight:700,color:"#fff"}}>🔥 {user.streak||1} Hari</div>
            </div>
            <div style={{display:"flex",gap:4}}>
              {Array.from({length:7}).map((_,i)=>(
                <div key={i} className={`str-dot ${i<(user.streak||1)?"str-done":"str-todo"}`}>{i<(user.streak||1)?"🔥":i+1}</div>
              ))}
            </div>
          </div>
          <div style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"8px 12px",marginTop:10,color:"var(--muted)",fontSize:12}}>
            Streak 7 hari berturut-turut = bonus 500 koin! 🎯
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {EVENTS_DATA.map(ev=>{
            const mine=evDone.filter(e=>e.uid===user.id&&e.evId===ev.id);
            let canClaim=true, statusLabel="Klaim";
            if(ev.type==="mission"&&mine.length>0){canClaim=false;statusLabel="✅ Selesai";}
            else if(ev.type==="streak"){
              if(mine.length>0){canClaim=false;statusLabel="✅ Selesai";}
              else if((user.streak||0)<3){canClaim=false;statusLabel=`${user.streak||0}/3 Hari`;}
            }
            else if(ev.type==="weekend"&&(day!==0&&day!==6)){canClaim=false;statusLabel="Sabtu-Minggu";}
            else if((ev.type==="daily"||ev.type==="weekend")&&mine.length>0){
              if(now-new Date(mine[mine.length-1].t).getTime()<ev.cooldown*3600000){canClaim=false;statusLabel="Besok lagi";}
            }
            return <EvCard key={ev.id} ev={ev} canClaim={canClaim} statusLabel={statusLabel} onClaim={()=>doEvent(ev)} />;
          })}
        </div>

        {/* History */}
        <Section title="Riwayat Klaim" style={{marginTop:24}}>
          {evDone.filter(e=>e.uid===user.id).length===0
            ? <div className="glass" style={{padding:20,textAlign:"center",color:"var(--muted)",fontSize:13}}>Belum ada riwayat klaim</div>
            : evDone.filter(e=>e.uid===user.id).slice().reverse().slice(0,6).map((e,i)=>{
                const ev=EVENTS_DATA.find(x=>x.id===e.evId);
                return (
                  <div key={i} className="glass" style={{padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{color:"var(--text)",fontSize:13}}>{ev?.icon} {ev?.title}</span>
                    <span className="chip chip-gold" style={{fontFamily:"Cinzel,serif"}}>+{ev?.reward}</span>
                  </div>
                );
              })
          }
        </Section>
      </div>
    );
  };

  /* ══════════════════════════════════════
     PAGE: TOP UP
  ══════════════════════════════════════ */
  const pageTopup=()=>{
    const opts=[20000,50000,100000,200000,500000];
    return (
      <div style={{padding:"20px 16px 90px"}}>
        <div className="ff" style={{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:4}}>Top Up Koin</div>
        <div style={{color:"var(--muted)",fontSize:13,marginBottom:20}}>1 koin = Rp {COIN_RATE.toLocaleString()}</div>

        {/* Balance */}
        <div className="glass-gold" style={{padding:20,textAlign:"center",marginBottom:20}}>
          <div style={{color:"var(--muted)",fontSize:12,fontWeight:700,letterSpacing:.5,marginBottom:4}}>SALDO KAMU</div>
          <div className="ff" style={{fontSize:36,fontWeight:700,color:"var(--gold)"}}>🪙 {user.coins?.toLocaleString()}</div>
          <div style={{color:"var(--muted)",fontSize:12,marginTop:4}}>≈ Rp {(user.coins*COIN_RATE).toLocaleString()}</div>
        </div>

        {/* Amount picker */}
        <div style={{marginBottom:16}}>
          <Label>Pilih Nominal</Label>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
            {opts.map(o=>(
              <button key={o} onClick={()=>setTForm({...tForm,amt:o})} style={{background:tForm.amt===o?"linear-gradient(135deg,var(--gold),var(--amber))":"rgba(255,255,255,0.03)",border:`1px solid ${tForm.amt===o?"transparent":"rgba(255,255,255,0.08)"}`,borderRadius:10,padding:"12px 6px",color:tForm.amt===o?"#07060e":"var(--text)",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"'DM Sans',sans-serif",transition:"all .2s"}}>
                <div>{(o/1000).toFixed(0)}K</div>
                <div style={{fontSize:10,marginTop:2,opacity:.8,fontWeight:600}}>{Math.floor(o/COIN_RATE)} koin</div>
              </button>
            ))}
          </div>
          <Label>Atau Masukkan Nominal</Label>
          <input className="inp" type="number" placeholder="Rp 0" value={tForm.amt} onChange={e=>setTForm({...tForm,amt:parseInt(e.target.value)||0})} />
          <div style={{color:"var(--gold)",fontSize:12,marginTop:6}}>= {Math.floor((tForm.amt||0)/COIN_RATE)} koin</div>
        </div>

        {/* QRIS */}
        <div className="glass" style={{padding:20,marginBottom:16,textAlign:"center"}}>
          <div style={{color:"var(--gold)",fontWeight:700,fontSize:14,marginBottom:14}}>📱 Scan QRIS untuk Pembayaran</div>
          {cfg.qrisImg
            ? <img src={cfg.qrisImg} alt="QRIS" style={{maxWidth:200,borderRadius:12,margin:"0 auto",display:"block"}} />
            : <div style={{background:"rgba(255,255,255,0.03)",border:"2px dashed rgba(201,168,76,0.25)",borderRadius:12,padding:32,color:"var(--muted)"}}>
                <div style={{fontSize:40}}>📱</div>
                <div style={{fontSize:13,marginTop:8}}>QRIS belum diupload admin</div>
              </div>
          }
          <div style={{marginTop:12,color:"var(--text)",fontWeight:700}}>{cfg.qrisName}</div>
          <div style={{color:"var(--muted)",fontSize:12,marginTop:2}}>Transfer tepat: Rp {(tForm.amt||0).toLocaleString()}</div>
        </div>

        {/* E-wallet list */}
        <div className="glass" style={{padding:16,marginBottom:16}}>
          <Label style={{marginBottom:14}}>Transfer Bank / E-Wallet</Label>
          {[{b:"GoPay",n:cfg.qrisPhone},{b:"OVO",n:cfg.qrisPhone},{b:"DANA",n:cfg.qrisPhone},{b:"BCA",n:"1234567890"}].map((x,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?"1px solid rgba(255,255,255,0.05)":"none"}}>
              <div>
                <div style={{color:"var(--text)",fontWeight:600,fontSize:14}}>{x.b}</div>
                <div style={{color:"var(--muted)",fontSize:12}}>{x.n}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={()=>{navigator.clipboard?.writeText(x.n);toast("Nomor disalin! 📋","inf");}}>Salin</button>
            </div>
          ))}
        </div>

        {/* Upload bukti */}
        <div style={{marginBottom:16}}>
          <Label>Upload Bukti Transfer</Label>
          <div style={{background:"rgba(255,255,255,0.02)",border:"2px dashed rgba(201,168,76,0.2)",borderRadius:12,padding:20,textAlign:"center",cursor:"pointer",position:"relative",transition:"all .2s"}}
            onMouseOver={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.4)";}}
            onMouseOut={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.2)";}}>
            <input type="file" accept="image/*" style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%"}}
              onChange={e=>{const f=e.target.files?.[0];if(f){const rd=new FileReader();rd.onload=()=>setTForm({...tForm,proof:rd.result});rd.readAsDataURL(f);}}} />
            {tForm.proof
              ? <img src={tForm.proof} alt="Bukti" style={{maxHeight:140,borderRadius:8,maxWidth:"100%"}} />
              : <div style={{color:"var(--muted)"}}><div style={{fontSize:32}}>📸</div><div style={{fontSize:13,marginTop:8}}>Tap untuk upload foto bukti</div></div>
            }
          </div>
        </div>

        <button className="btn btn-gold btn-lg btn-full" onClick={doTopup}>Kirim Permintaan Top Up 🚀</button>

        {/* History */}
        {myTopups.length>0&&(
          <Section title="Riwayat Top Up" style={{marginTop:24}}>
            {myTopups.slice().reverse().map(t=>(
              <div key={t.id} className="glass" style={{padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{color:"var(--text)",fontWeight:600}}>Rp {t.amt?.toLocaleString()}</div>
                  <div style={{color:"var(--muted)",fontSize:12}}>{new Date(t.at).toLocaleDateString("id")} · +{t.coins} koin</div>
                </div>
                <span className={`chip ${t.status==="approved"?"chip-green":t.status==="rejected"?"chip-red":"chip-blue"}`}>
                  {t.status==="approved"?"✅ OK":t.status==="rejected"?"❌ Ditolak":"⏳ Pending"}
                </span>
              </div>
            ))}
          </Section>
        )}
      </div>
    );
  };

  /* ══════════════════════════════════════
     PAGE: WITHDRAW
  ══════════════════════════════════════ */
  const pageWd=()=>(
    <div style={{padding:"20px 16px 90px"}}>
      <div className="ff" style={{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:4}}>Withdraw Koin</div>
      <div style={{color:"var(--muted)",fontSize:13,marginBottom:20}}>Cairkan koin ke rekening kamu</div>

      {/* Balance */}
      <div style={{background:"rgba(0,210,120,0.05)",border:"1px solid rgba(0,210,120,0.15)",borderRadius:16,padding:20,textAlign:"center",marginBottom:20}}>
        <div style={{color:"var(--muted)",fontSize:12,fontWeight:700,letterSpacing:.5,marginBottom:4}}>SALDO TERSEDIA</div>
        <div className="ff" style={{fontSize:36,fontWeight:700,color:"#2dda8a"}}>🪙 {user.coins?.toLocaleString()}</div>
        <div style={{color:"var(--muted)",fontSize:12,marginTop:4}}>Min WD: {MIN_WD.toLocaleString()} koin = Rp {(MIN_WD*COIN_RATE).toLocaleString()}</div>
        <div style={{marginTop:8}}>
          <div className="prog-bar" style={{height:4}}>
            <div className="prog-fill" style={{width:`${Math.min(100,user.coins/MIN_WD*100)}%`}} />
          </div>
          <div style={{color:"var(--muted)",fontSize:11,marginTop:4}}>{Math.min(100,Math.round(user.coins/MIN_WD*100))}% dari minimum</div>
        </div>
      </div>

      <div className="glass" style={{padding:20,marginBottom:20}}>
        <div style={{display:"grid",gap:14}}>
          <div>
            <Label>Jumlah Koin</Label>
            <input className="inp" type="number" min={MIN_WD} max={user.coins} value={wForm.coins} onChange={e=>setWForm({...wForm,coins:parseInt(e.target.value)||0})} />
            <div style={{color:"var(--gold)",fontSize:12,marginTop:6}}>= Rp {((wForm.coins||0)*COIN_RATE).toLocaleString()}</div>
          </div>
          <div>
            <Label>Bank / E-Wallet</Label>
            <select className="inp" value={wForm.bank} onChange={e=>setWForm({...wForm,bank:e.target.value})}>
              <option value="">Pilih Bank…</option>
              {["BCA","BRI","BNI","Mandiri","BSI","DANA","GoPay","OVO","ShopeePay"].map(b=><option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <Label>No. Rekening / No. HP</Label>
            <input className="inp" placeholder="0812345XXXXX" value={wForm.no} onChange={e=>setWForm({...wForm,no:e.target.value})} />
          </div>
          <div>
            <Label>Nama Pemilik Rekening</Label>
            <input className="inp" placeholder="Nama sesuai rekening" value={wForm.name} onChange={e=>setWForm({...wForm,name:e.target.value})} />
          </div>
          <div style={{background:"rgba(255,165,0,0.06)",border:"1px solid rgba(255,165,0,0.15)",borderRadius:10,padding:"10px 14px",color:"rgba(255,165,0,0.9)",fontSize:12}}>
            ⚠️ Diproses max 1×24 jam. Pastikan data rekening benar!
          </div>
          <button className="btn btn-gold btn-lg btn-full" onClick={doWd} disabled={user.coins<MIN_WD}
            style={{opacity:user.coins<MIN_WD?.6:1,cursor:user.coins<MIN_WD?"not-allowed":"pointer"}}>
            {user.coins<MIN_WD?`🔒 Koin Kurang (min ${MIN_WD.toLocaleString()})`:"Proses Withdraw 💸"}
          </button>
        </div>
      </div>

      {myWds.length>0&&(
        <Section title="Riwayat Withdraw">
          {myWds.slice().reverse().map(w=>(
            <div key={w.id} className="glass" style={{padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{color:"var(--text)",fontWeight:600}}>Rp {w.amt?.toLocaleString()}</div>
                <div style={{color:"var(--muted)",fontSize:12}}>{w.bank} · {w.accNo} · {w.coins} koin</div>
                <div style={{color:"var(--muted)",fontSize:11}}>{new Date(w.at).toLocaleDateString("id")}</div>
              </div>
              <span className={`chip ${w.status==="approved"?"chip-green":w.status==="rejected"?"chip-red":"chip-blue"}`}>
                {w.status==="approved"?"✅ Cair":w.status==="rejected"?"❌ Ditolak":"⏳ Pending"}
              </span>
            </div>
          ))}
        </Section>
      )}
    </div>
  );

  /* ══════════════════════════════════════
     PAGE: MY ACCOUNT
  ══════════════════════════════════════ */
  const pageMyAcc=()=>{
    const totalEarned=rentals.filter(r=>myAccs.some(a=>a.id===r.accId)).reduce((s,r)=>s+Math.floor(r.cost*.8),0);
    return (
      <div style={{padding:"20px 16px 90px"}}>
        {/* Profile card */}
        <div className="glass" style={{padding:0,overflow:"hidden",marginBottom:20}}>
          <div style={{height:80,background:"linear-gradient(135deg,rgba(201,168,76,0.2),rgba(255,69,0,0.1))"}} />
          <div style={{padding:"0 20px 20px",marginTop:-24}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,var(--gold),var(--amber))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,color:"#07060e",border:"3px solid #07060e",marginBottom:10}}>
              {user.username[0]?.toUpperCase()}
            </div>
            <div className="ff" style={{fontSize:18,fontWeight:700,color:"var(--text)"}}>{user.username}</div>
            <div style={{color:"var(--muted)",fontSize:12,marginTop:2}}>{user.phone}</div>
            <div style={{display:"flex",gap:14,marginTop:12}}>
              <div style={{textAlign:"center"}}><div className="ff" style={{color:"var(--gold)",fontSize:18,fontWeight:700}}>{myAccs.length}</div><div style={{color:"var(--muted)",fontSize:11}}>Akun</div></div>
              <div style={{width:1,background:"rgba(255,255,255,0.06)"}}/>
              <div style={{textAlign:"center"}}><div className="ff" style={{color:"var(--gold)",fontSize:18,fontWeight:700}}>{totalEarned}</div><div style={{color:"var(--muted)",fontSize:11}}>Koin Earned</div></div>
              <div style={{width:1,background:"rgba(255,255,255,0.06)"}}/>
              <div style={{textAlign:"center"}}><div className="ff" style={{color:"var(--gold)",fontSize:18,fontWeight:700}}>{myRents.length}</div><div style={{color:"var(--muted)",fontSize:11}}>Disewa</div></div>
            </div>
          </div>
        </div>

        {/* Daftarkan akun */}
        <div className="glass" style={{padding:20,marginBottom:20}}>
          <div style={{color:"var(--gold)",fontWeight:700,fontSize:14,marginBottom:14}}>➕ Daftarkan Akun FF Kamu</div>
          <div style={{background:"rgba(0,210,120,0.05)",border:"1px solid rgba(0,210,120,0.15)",borderRadius:10,padding:"10px 14px",marginBottom:14,color:"#2dda8a",fontSize:12,fontWeight:600}}>
            💡 Kamu dapat 80% dari setiap sewa! Platform: 20%
          </div>
          <div style={{display:"grid",gap:12}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><Label>ID Free Fire</Label><input className="inp" placeholder="ID akun" value={lForm.ffId} onChange={e=>setLForm({...lForm,ffId:e.target.value})} /></div>
              <div><Label>Nama Ingame</Label><input className="inp" placeholder="Nickname" value={lForm.ffName} onChange={e=>setLForm({...lForm,ffName:e.target.value})} /></div>
            </div>
            <div><Label>Email Login FF 📧</Label><input className="inp" type="email" placeholder="email@gmail.com (yang dipakai login FF)" value={lForm.ffEmail} onChange={e=>setLForm({...lForm,ffEmail:e.target.value})} /></div>
            <div><Label>Password FF 🔐</Label><input className="inp" type="password" placeholder="Password akun" value={lForm.ffPw} onChange={e=>setLForm({...lForm,ffPw:e.target.value})} /></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><Label>Level</Label><input className="inp" type="number" placeholder="Level" value={lForm.lv} onChange={e=>setLForm({...lForm,lv:e.target.value})} /></div>
              <div><Label>Rank</Label>
                <select className="inp" value={lForm.rank} onChange={e=>setLForm({...lForm,rank:e.target.value})}>
                  {RANKS.map(r=><option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div><Label>Hero (pisah koma)</Label><input className="inp" placeholder="Alok, Chrono, K" value={lForm.heroes} onChange={e=>setLForm({...lForm,heroes:e.target.value})} /></div>
            <div><Label>Harga (koin/jam)</Label><input className="inp" type="number" placeholder="misal: 80" value={lForm.price} onChange={e=>setLForm({...lForm,price:e.target.value})} /></div>
            <div><Label>Deskripsi</Label><textarea className="inp" placeholder="Keunggulan akun..." value={lForm.desc} onChange={e=>setLForm({...lForm,desc:e.target.value})} /></div>
            <button className="btn btn-gold btn-lg btn-full" onClick={doList}>Daftarkan Akun 🎮</button>
          </div>
        </div>

        {/* My Accounts */}
        <Section title={`Akun Saya (${myAccs.length})`}>
          {myAccs.length===0
            ? <div className="glass" style={{padding:24,textAlign:"center",color:"var(--muted)"}}>Belum ada akun yang didaftarkan</div>
            : myAccs.map(acc=>{
                const rented=!!rentals.find(r=>r.accId===acc.id&&r.status==="active");
                const earned=rentals.filter(r=>r.accId===acc.id).reduce((s,r)=>s+Math.floor(r.cost*.8),0);
                const rm=RANK_META[acc.rank]||RANK_META["Bronze"];
                return (
                  <div key={acc.id} className="glass" style={{padding:14,marginBottom:10,border:`1px solid ${rm.color}22`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div className="ff" style={{color:"var(--text)",fontWeight:700,fontSize:15}}>{acc.ffName}</div>
                        <div style={{display:"flex",gap:8,marginTop:6}}>
                          <span className="chip" style={{background:`${rm.color}18`,border:`1px solid ${rm.color}33`,color:rm.color,fontSize:11}}>{rm.badge} {acc.rank}</span>
                          <span style={{color:"var(--gold)",fontSize:12}}>+{earned} koin</span>
                        </div>
                      </div>
                      <span className={`chip ${rented?"chip-red":"chip-green"}`}>{rented?"🔴 Disewa":"🟢 Tersedia"}</span>
                    </div>
                  </div>
                );
              })
          }
        </Section>

        {/* Rental History */}
        <Section title="Riwayat Sewa" style={{marginTop:20}}>
          {myRents.length===0
            ? <div className="glass" style={{padding:20,textAlign:"center",color:"var(--muted)"}}>Belum pernah sewa</div>
            : myRents.slice().reverse().slice(0,5).map(r=>{
                const acc=accs.find(a=>a.id===r.accId);
                const isActive=r.status==="active"&&new Date(r.end)>new Date();
                return (
                  <div key={r.id} className="glass" style={{padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{color:"var(--text)",fontWeight:600,fontSize:14}}>{acc?.ffName||"Akun FF"}</div>
                      <div style={{color:"var(--muted)",fontSize:12}}>{new Date(r.start).toLocaleDateString("id")} · {r.dur}jam · {r.cost} koin</div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      {isActive&&<button className="btn btn-gold btn-sm" onClick={()=>setModal({t:"rentOk",acc,r})}>Lihat</button>}
                      <span className={`chip ${isActive?"chip-green":"chip-muted"}`}>{isActive?"⚡ Aktif":"✅ Selesai"}</span>
                    </div>
                  </div>
                );
              })
          }
        </Section>
      </div>
    );
  };

  /* ══════════════════════════════════════
     PAGE: AI
  ══════════════════════════════════════ */
  const pageAI=()=>(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 62px)"}}>
      {/* AI Header */}
      <div style={{padding:"16px",background:"rgba(7,6,14,0.95)",borderBottom:"1px solid rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,var(--gold),var(--amber))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🤖</div>
          <div>
            <div className="ff" style={{fontSize:16,fontWeight:700,color:"var(--text)"}}>FF Bot AI</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span className="dot-on" />
              <span style={{color:"#2dda8a",fontSize:11,fontWeight:600}}>Online · Siap membantu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        {aiMsgs.map((msg,i)=>(
          <div key={i} style={{display:"flex",justifyContent:msg.r==="me"?"flex-end":"flex-start",gap:8,alignItems:"flex-end"}}>
            {msg.r==="ai"&&<div style={{fontSize:22,flexShrink:0}}>🤖</div>}
            <div className={msg.r==="me"?"bub-me":"bub-ai"} style={{whiteSpace:"pre-wrap"}}>{msg.m}</div>
          </div>
        ))}
        {aiLoad&&(
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <div style={{fontSize:22}}>🤖</div>
            <div className="bub-ai" style={{display:"flex",gap:5,alignItems:"center",padding:"14px 18px"}}>
              {[0,1,2].map(i=><div key={i} style={{width:7,height:7,background:"var(--gold)",borderRadius:"50%",animation:`pulse 1.1s ${i*.2}s infinite`}}/>)}
            </div>
          </div>
        )}
        <div ref={aiRef}/>
      </div>

      {/* Quick questions */}
      <div style={{padding:"0 16px 8px",display:"flex",gap:8,overflowX:"auto",flexShrink:0}}>
        {["Rekomendasiin akun 100 koin?","Karakter meta FF?","Cara top up?","Tips push rank?","Cara WD koin?","Hubungi admin?"].map(q=>(
          <button key={q} onClick={()=>setAiIn(q)} style={{background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:16,padding:"6px 12px",color:"var(--gold)",fontSize:11,cursor:"pointer",whiteSpace:"nowrap",fontWeight:600,flexShrink:0}}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{padding:"10px 16px 16px",background:"rgba(7,6,14,0.95)",borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",gap:10,flexShrink:0}}>
        <input className="inp" style={{flex:1}} placeholder="Tanya apa saja…" value={aiIn} onChange={e=>setAiIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAi()} />
        <button className="btn btn-gold btn-md" onClick={doAi} disabled={aiLoad} style={{flexShrink:0,padding:"10px 18px"}}>{aiLoad?"…":"→"}</button>
      </div>
    </div>
  );

  /* ══════════════════════════════════════
     PAGE: CONTACT
  ══════════════════════════════════════ */
  const pageContact=()=>(
    <div style={{padding:"20px 16px 90px"}}>
      <div className="ff" style={{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:4}}>Hubungi Kami</div>
      <div style={{color:"var(--muted)",fontSize:13,marginBottom:20}}>Tim kami siap membantu kamu 24/7</div>

      {/* Hero card */}
      <div style={{position:"relative",borderRadius:20,overflow:"hidden",marginBottom:20,height:130}}>
        <img src={ACCOUNT_PHOTOS["Diamond"]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.3)"}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(7,6,14,0.95),rgba(7,6,14,0.5))"}} />
        <div style={{position:"absolute",inset:0,padding:"20px 22px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div className="ff" style={{fontSize:20,fontWeight:700,color:"var(--gold)"}}>FF Rent Official</div>
          <div style={{color:"rgba(255,255,255,0.6)",fontSize:13,marginTop:4}}>Platform sewa akun Free Fire terpercaya #1</div>
          <div style={{display:"flex",gap:6,marginTop:10}}>
            <span className="chip chip-gold" style={{fontSize:10}}>✅ Verified</span>
            <span className="chip chip-green" style={{fontSize:10}}>● Online</span>
          </div>
        </div>
      </div>

      {/* Jam operasional */}
      <div className="glass-gold" style={{padding:"14px 18px",marginBottom:16,display:"flex",gap:12,alignItems:"center"}}>
        <span style={{fontSize:28}}>🕐</span>
        <div>
          <div style={{color:"var(--gold2)",fontWeight:700,fontSize:13}}>Jam Operasional</div>
          <div style={{color:"var(--text)",fontSize:13,marginTop:2}}>{ADMIN_CONTACT.openHour}</div>
        </div>
      </div>

      {/* Contact cards */}
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
        {[
          { icon:"💬", label:"WhatsApp (Utama)", val:ADMIN_CONTACT.waText, sub:"Chat langsung, respon cepat!", color:"#25d366", href:`https://wa.me/${ADMIN_CONTACT.wa}?text=Halo admin FF Rent, saya butuh bantuan` },
          { icon:"📧", label:"Email Support", val:ADMIN_CONTACT.email, sub:"Untuk pertanyaan formal & laporan", color:"#ea4335", href:`mailto:${ADMIN_CONTACT.email}` },
          { icon:"📧", label:"Email Umum", val:ADMIN_CONTACT.email2, sub:"Info kemitraan & kerjasama", color:"#4285f4", href:`mailto:${ADMIN_CONTACT.email2}` },
          { icon:"📸", label:"Instagram", val:ADMIN_CONTACT.ig, sub:"Update promo & event terbaru", color:"#e1306c", href:`https://instagram.com/ffrental.id` },
          { icon:"🎵", label:"TikTok", val:ADMIN_CONTACT.tiktok, sub:"Konten tips FF & review akun", color:"#ff0050", href:`https://tiktok.com/@ffrent.official` },
          { icon:"💬", label:"Discord", val:ADMIN_CONTACT.discord, sub:"Komunitas player FF Rent", color:"#5865f2", href:`https://discord.gg/ffrent` },
          { icon:"💚", label:"Line", val:ADMIN_CONTACT.line, sub:"Alternatif chat admin", color:"#06c755", href:`https://line.me/ti/p/~ffrent_official` },
        ].map((c,i)=>(
          <div key={i} className="glass card-hover" style={{padding:"14px 16px",display:"flex",gap:14,alignItems:"center"}}>
            <div style={{width:44,height:44,borderRadius:12,background:`${c.color}18`,border:`1px solid ${c.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{c.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:"var(--muted)",fontSize:11,fontWeight:700,letterSpacing:.5}}>{c.label.toUpperCase()}</div>
              <div style={{color:"var(--text)",fontWeight:700,fontSize:14,marginTop:2}}>{c.val}</div>
              <div style={{color:"var(--muted)",fontSize:11,marginTop:1}}>{c.sub}</div>
            </div>
            <a href={c.href} target="_blank" rel="noreferrer" style={{background:`${c.color}18`,border:`1px solid ${c.color}35`,borderRadius:8,padding:"7px 14px",color:c.color,fontWeight:700,fontSize:12,textDecoration:"none",flexShrink:0,fontFamily:"'DM Sans',sans-serif"}}>
              Buka →
            </a>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="ff" style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:12}}>Pertanyaan Umum</div>
      {[
        ["Berapa lama top up diproses?","Top up diproses maksimal 15 menit setelah bukti diterima. Jika lebih lama, hubungi admin WA."],
        ["Berapa lama withdraw diproses?","Withdraw diproses 1×24 jam di hari kerja. Weekend bisa lebih lama."],
        ["Apakah akun aman untuk disewa?","Ya, semua akun dipantau admin. Jangan ubah password/email selama menyewa."],
        ["Bisa refund jika akun bermasalah?","Laporkan ke admin dalam 10 menit pertama sewa, kami akan tinjau dan refund jika terbukti bermasalah."],
      ].map(([q,a],i)=>(
        <div key={i} className="glass" style={{padding:"14px 16px",marginBottom:8}}>
          <div style={{color:"var(--gold2)",fontWeight:700,fontSize:13,marginBottom:6}}>❓ {q}</div>
          <div style={{color:"var(--muted)",fontSize:12,lineHeight:1.6}}>{a}</div>
        </div>
      ))}

      {/* WA CTA */}
      <a href={`https://wa.me/${ADMIN_CONTACT.wa}?text=Halo admin FF Rent, saya butuh bantuan`} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:"linear-gradient(135deg,#25d366,#128c7e)",borderRadius:14,padding:"16px",marginTop:20,textDecoration:"none",fontWeight:700,fontSize:15,color:"white",fontFamily:"'DM Sans',sans-serif"}}>
        💬 Chat WhatsApp Admin Sekarang
      </a>
    </div>
  );

  /* ══════════════════════════════════════
     MODALS
  ══════════════════════════════════════ */
  const renderModal=()=>{
    if(!modal) return null;
    const closeModal=()=>setModal(null);

    /* Account Detail */
    if(modal.t==="accDetail"){
      const acc=modal.acc;
      const rented=!!rentals.find(r=>r.accId===acc.id&&r.status==="active");
      const rm=RANK_META[acc.rank]||RANK_META["Bronze"];
      const photo=ACCOUNT_PHOTOS[acc.rank]||ACCOUNT_PHOTOS["Gold"];
      const totalCost=acc.price*dur;
      return (
        <div className="modal-bg" onClick={closeModal}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{padding:0,overflow:"hidden"}}>
            {/* Photo */}
            <div style={{position:"relative",height:180,overflow:"hidden"}}>
              <img src={photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.45)"}} />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,#0f0e1d 0%,transparent 60%)"}} />
              <button onClick={closeModal} style={{position:"absolute",top:14,right:14,background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 10px",color:"var(--text)",cursor:"pointer",fontSize:16}}>✕</button>
              <div style={{position:"absolute",top:14,left:14}}>
                <span className="chip" style={{background:`${rm.color}22`,border:`1px solid ${rm.color}55`,color:rm.color}}>{rm.badge} {acc.rank}</span>
              </div>
              <div style={{position:"absolute",bottom:16,left:20}}>
                <div className="ff" style={{fontSize:20,fontWeight:700,color:"#fff"}}>{acc.ffName}</div>
                <div style={{display:"flex",gap:8,marginTop:4}}>
                  <span style={{color:"rgba(255,255,255,0.6)",fontSize:13}}>Lv.{acc.level}</span>
                  <Stars v={acc.rating} />
                  <span style={{color:"rgba(255,255,255,0.5)",fontSize:12}}>({acc.rating||"Baru"})</span>
                </div>
              </div>
            </div>
            <div style={{padding:20}}>
              {/* Specs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:16}}>
                {[{l:"Disewa",v:`${acc.totalRent}×`},{l:"Rating",v:acc.rating||"Baru"},{l:"Level",v:acc.level}].map(s=>(
                  <div key={s.l} style={{textAlign:"center",background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"10px 6px"}}>
                    <div className="ff" style={{color:"var(--gold)",fontWeight:700,fontSize:18}}>{s.v}</div>
                    <div style={{color:"var(--muted)",fontSize:11}}>{s.l}</div>
                  </div>
                ))}
              </div>
              {/* Heroes */}
              <div style={{marginBottom:14}}>
                <Label>Hero Tersedia</Label>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {(acc.heroes||[]).map((h,i)=><span key={i} className="chip chip-gold" style={{fontSize:11}}>{h}</span>)}
                </div>
              </div>
              {/* Desc */}
              <div style={{color:"rgba(255,255,255,0.55)",fontSize:13,lineHeight:1.6,marginBottom:16}}>{acc.desc}</div>
              <div className="sep" style={{marginBottom:16}} />
              {/* Duration + Rent */}
              {!rented?(
                <>
                  <Label>Durasi Sewa</Label>
                  <div style={{display:"flex",gap:8,marginBottom:14}}>
                    {[1,2,3,6,12,24].map(h=>(
                      <button key={h} onClick={()=>setDur(h)} style={{flex:1,padding:"8px 4px",background:dur===h?"linear-gradient(135deg,var(--gold),var(--amber))":"rgba(255,255,255,0.03)",border:`1px solid ${dur===h?"transparent":"rgba(255,255,255,0.08)"}`,borderRadius:8,color:dur===h?"#07060e":"var(--text)",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                        {h}j
                      </button>
                    ))}
                  </div>
                  <div className="glass-gold" style={{padding:"12px 16px",marginBottom:14,display:"flex",justifyContent:"space-between"}}>
                    <span style={{color:"var(--muted)",fontSize:13}}>Total Biaya</span>
                    <span className="ff" style={{color:"var(--gold)",fontWeight:700,fontSize:18}}>🪙 {totalCost}</span>
                  </div>
                  <div style={{color:user.coins<totalCost?"#ff7070":"#2dda8a",fontSize:12,textAlign:"right",marginBottom:12}}>
                    Saldo: {user.coins} koin {user.coins<totalCost?"❌":"✅"}
                  </div>
                  <button className="btn btn-gold btn-lg btn-full" onClick={()=>doRent(acc)}>Sewa Sekarang 🎮</button>
                </>
              ):(
                <div style={{background:"rgba(255,61,61,0.08)",border:"1px solid rgba(255,61,61,0.2)",borderRadius:12,padding:16,textAlign:"center",color:"#ff7070"}}>
                  🚫 Akun sedang disewa. Coba lagi nanti!
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    /* Rent Success / Active Rental - Shows FF Account Data */
    if(modal.t==="rentOk"){
      const {acc,r}=modal;
      const end=new Date(r.end), now=new Date();
      const rem=Math.max(0,end-now);
      const h=Math.floor(rem/3600000), m=Math.floor((rem%3600000)/60000);
      const expired=rem<=0;
      const photo=ACCOUNT_PHOTOS[acc?.rank]||ACCOUNT_PHOTOS["Gold"];
      return (
        <div className="modal-bg" onClick={closeModal}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{padding:0,overflow:"hidden"}}>
            {/* Photo header */}
            <div style={{position:"relative",height:120,overflow:"hidden"}}>
              <img src={photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.3)"}} />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,#0f0e1d,transparent)"}} />
              <button onClick={closeModal} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"5px 10px",color:"var(--text)",cursor:"pointer",fontSize:16}}>✕</button>
              <div style={{position:"absolute",bottom:12,left:20}}>
                <span className="chip chip-green" style={{fontSize:12}}>{expired?"⏰ Sewa Berakhir":"⚡ Sewa Aktif"}</span>
              </div>
            </div>

            <div style={{padding:"0 20px 20px"}}>
              <div className="ff" style={{fontSize:20,fontWeight:700,color:"var(--text)",margin:"16px 0 4px"}}>{acc?.ffName}</div>

              {/* Timer */}
              {!expired&&(
                <div style={{display:"flex",justifyContent:"center",gap:6,margin:"12px 0",padding:"12px",background:"rgba(255,255,255,0.03)",borderRadius:12}}>
                  <div style={{textAlign:"center"}}>
                    <div className="ff" style={{fontSize:28,fontWeight:700,color:"var(--amber)"}}>{String(h).padStart(2,"0")}</div>
                    <div style={{color:"var(--muted)",fontSize:10}}>JAM</div>
                  </div>
                  <div className="ff" style={{fontSize:28,color:"var(--muted)",marginTop:4}}>:</div>
                  <div style={{textAlign:"center"}}>
                    <div className="ff" style={{fontSize:28,fontWeight:700,color:"var(--amber)"}}>{String(m).padStart(2,"0")}</div>
                    <div style={{color:"var(--muted)",fontSize:10}}>MENIT</div>
                  </div>
                </div>
              )}

              {/* Account Data Box */}
              <div style={{background:"linear-gradient(135deg,rgba(0,60,30,0.5),rgba(0,40,20,0.3))",border:"1px solid rgba(0,210,120,0.2)",borderRadius:14,padding:16,margin:"12px 0"}}>
                <div style={{color:"#2dda8a",fontSize:11,fontWeight:700,letterSpacing:.8,marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
                  🔐 DATA AKUN FREE FIRE
                  <span style={{background:"rgba(0,210,120,0.15)",border:"1px solid rgba(0,210,120,0.25)",color:"#2dda8a",padding:"1px 8px",borderRadius:8,fontSize:10}}>RAHASIA</span>
                </div>
                {[
                  {l:"Nama Akun",    v:acc?.ffName,       copy:false},
                  {l:"ID Free Fire", v:acc?.ffId,         copy:true},
                  {l:"Email Login",  v:acc?.ffEmail||"—", copy:true,  mono:false},
                  {l:"Password",     v:acc?.ffPassword,   copy:true,  mono:true},
                  {l:"Rank & Level", v:`${acc?.rank} · Level ${acc?.level}`, copy:false},
                ].map(row=>(
                  <div key={row.l} style={{background:"rgba(0,0,0,0.3)",borderRadius:8,padding:"10px 12px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{color:"rgba(0,210,120,0.7)",fontSize:10,fontWeight:700,letterSpacing:.5,marginBottom:3}}>{row.l.toUpperCase()}</div>
                      <div style={{color:"#fff",fontWeight:700,fontSize:14,fontFamily:row.mono?"monospace":"inherit",letterSpacing:row.mono?2:0,wordBreak:"break-all"}}>{row.v}</div>
                    </div>
                    {row.copy&&row.v&&row.v!=="—"&&(
                      <button className="btn btn-ghost btn-sm" style={{marginLeft:8,flexShrink:0}} onClick={()=>{navigator.clipboard?.writeText(row.v);toast("Disalin! 📋","inf");}}>Salin</button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{background:"rgba(255,165,0,0.06)",border:"1px solid rgba(255,165,0,0.15)",borderRadius:10,padding:"10px 14px",color:"rgba(255,165,0,0.9)",fontSize:12}}>
                ⚠️ Jangan ubah email/password! Masalah? Hubungi admin WA <b>{ADMIN_CONTACT.waText}</b>
              </div>
              <button className="btn btn-ghost btn-lg btn-full" style={{marginTop:14}} onClick={closeModal}>Tutup</button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  /* ══════════════════════════════════════
     NAVIGATION
  ══════════════════════════════════════ */
  const navItems=[
    {id:"home",ic:"🏠",lb:"Home"},
    {id:"browse",ic:"🎮",lb:"Sewa"},
    {id:"events",ic:"🎁",lb:"Event"},
    {id:"ai",ic:"🤖",lb:"AI Bot"},
    {id:"myacc",ic:"👤",lb:"Akun"},
  ];

  const pageMap={
    home:pageHome, browse:pageBrowse, events:pageEvents,
    topup:pageTopup, wd:pageWd, ai:pageAI, myacc:pageMyAcc, contact:pageContact,
  };

  /* ══════════════════════════════════════
     TOP BAR
  ══════════════════════════════════════ */
  const pageTitle={
    home:"⚡ FF RENT", browse:"Sewa Akun", events:"Event",
    topup:"Top Up", wd:"Withdraw", ai:"FF Bot AI", myacc:"Akun Saya", contact:"Hubungi Kami",
  };

  return (
    <div style={{background:"var(--bg)",minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative",overflow:"hidden"}}>
      <style>{G}</style>
      <div className="mesh-bg"/>
      <Notif n={notif}/>

      {!user ? pageAuth() : (
        <>
          {/* Top bar */}
          {page!=="ai"&&(
            <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(7,6,14,0.92)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div className="ff" style={{fontSize:18,fontWeight:700,color:"var(--gold)",letterSpacing:1}}>{pageTitle[page]||"FF RENT"}</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <CoinBadge v={user.coins}/>
                <button className="btn btn-ghost btn-sm" onClick={doLogout} style={{fontSize:13,padding:"7px 10px"}}>🚪</button>
              </div>
            </div>
          )}

          {/* Page */}
          <div style={{minHeight:"calc(100vh - 62px)",position:"relative",zIndex:1}}>
            {(pageMap[page]||pageHome)()}
          </div>

          {/* Bottom nav */}
          <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(7,6,14,0.96)",backdropFilter:"blur(24px)",borderTop:"1px solid rgba(255,255,255,0.05)",display:"flex",justifyContent:"space-around",padding:"8px 0 12px",zIndex:200}}>
            {navItems.map(n=>(
              <button key={n.id} className={`nav-btn ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)}>
                <span style={{fontSize:22}}>{n.ic}</span>
                <span>{n.lb}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {renderModal()}
    </div>
  );
}

/* small inline helper */
const rgba01="rgba(255,255,255,0.04)";
