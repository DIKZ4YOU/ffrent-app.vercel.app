import { useState, useEffect } from "react";

const COIN_RATE = 100;
const MIN_WD = 2000;
const RANKS = ["Bronze","Silver","Gold","Platinum","Diamond","Heroic","Grand Master"];

const ADMIN_CONTACT = {
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

const RANK_META = {
  "Bronze":      { color:"#cd7f32", badge:"🥉" },
  "Silver":      { color:"#c0c0c0", badge:"🥈" },
  "Gold":        { color:"#ffd700", badge:"🥇" },
  "Platinum":    { color:"#e5e4e2", badge:"💠" },
  "Diamond":     { color:"#00bfff", badge:"💎" },
  "Heroic":      { color:"#ff4500", badge:"⚔️" },
  "Grand Master":{ color:"#da70d6", badge:"👑" },
};

const SYS_ACCOUNTS = [
  { id:"s1", ownerId:"system", ffId:"5582211990", ffEmail:"fireslayer99@gmail.com", ffPassword:"FireSlayer@99!", ffName:"ꜰɪʀᴇꜱʟᴀʏᴇʀ", level:97, rank:"Grand Master", heroes:["Alok","Chrono","K","Skyler","Wukong"], price:160, desc:"Full diamond Grand Master!", available:true, rating:5.0, totalRent:312 },
  { id:"s2", ownerId:"system", ffId:"8823190045", ffEmail:"heroicking88@yahoo.com",  ffPassword:"HeroicKing@88!", ffName:"ʜᴇʀᴏɪᴄ·ᴋɪɴɢ", level:88, rank:"Heroic",      heroes:["Alok","Hayato","Chrono","K"],         price:90,  desc:"Heroic rank stabil!", available:true, rating:4.9, totalRent:198 },
  { id:"s3", ownerId:"system", ffId:"3310994421", ffEmail:"diamondace77@gmail.com", ffPassword:"DiamondAce#77!", ffName:"ᴅɪᴀᴍᴏɴᴅ·ᴀᴄᴇ", level:75, rank:"Diamond",      heroes:["Alok","Maro","Skyler"],              price:55,  desc:"Diamond stabil!", available:true, rating:4.7, totalRent:87 },
  { id:"s4", ownerId:"system", ffId:"7741882200", ffEmail:"goldrush55@gmail.com",   ffPassword:"GoldRush#55!",  ffName:"ɢᴏʟᴅ·ʀᴜꜱʜ",   level:58, rank:"Gold",         heroes:["Alok","Kapella"],                    price:35,  desc:"Akun gold santai!", available:true, rating:4.5, totalRent:43 },
];

const EVENTS_DATA = [
  { id:"e1", title:"Login Harian",  desc:"Hadiah login setiap hari",      reward:50,  type:"daily",   icon:"🌅", cooldown:24 },
  { id:"e2", title:"Sewa Pertama",  desc:"Lakukan sewa akun pertama",     reward:100, type:"mission", icon:"🎮", cooldown:0  },
  { id:"e3", title:"Top Up Perdana",desc:"Top up koin pertama kali",      reward:150, type:"mission", icon:"💎", cooldown:0  },
  { id:"e4", title:"Daftarkan Akun",desc:"Sewakan akun FF sendiri",       reward:200, type:"mission", icon:"📲", cooldown:0  },
  { id:"e5", title:"Streak 3 Hari", desc:"Login 3 hari berturut-turut",   reward:300, type:"streak",  icon:"🔥", cooldown:0  },
  { id:"e6", title:"Weekend Bonus", desc:"Bonus eksklusif Sabtu-Minggu",  reward:120, type:"weekend", icon:"🎉", cooldown:24 },
  { id:"e7", title:"Rating Akun",   desc:"Beri rating setelah sewa",      reward:30,  type:"daily",   icon:"⭐", cooldown:24 },
];

const ACCOUNT_PHOTOS = {
  "Grand Master": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&q=70",
  "Heroic":       "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&q=70",
  "Diamond":      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&q=70",
  "Platinum":     "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300&q=70",
  "Gold":         "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&q=70",
  "Silver":       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=70",
  "Bronze":       "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=300&q=70",
};

/* ─── Styles ─── */
const G=`
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{background:#050409;font-family:'DM Sans',sans-serif;overflow-x:hidden;}
:root{--g:#c9a84c;--g2:#f0cc7a;--a:#ff9520;--r:#ff4040;--bg:#050409;--bg2:#0a0810;--bg3:#0f0c1a;--line:rgba(255,255,255,0.055);--text:#e8e3d8;--muted:#60587a;}
::-webkit-scrollbar{width:3px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:var(--g);border-radius:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.ff{font-family:'Cinzel',serif;}
.anim{animation:fadeUp .45s ease both;}
.glass{background:rgba(255,255,255,0.025);backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.06);border-radius:14px;}
.glass-g{background:rgba(201,168,76,0.04);backdrop-filter:blur(18px);border:1px solid rgba(201,168,76,0.15);border-radius:14px;}
.card-h{transition:all .2s ease;cursor:pointer;}
.card-h:hover{border-color:rgba(201,168,76,0.3)!important;box-shadow:0 8px 30px rgba(201,168,76,0.08);}
.btn{border:none;border-radius:9px;font-family:'DM Sans',sans-serif;font-weight:600;cursor:pointer;transition:all .18s;display:inline-flex;align-items:center;gap:5px;font-size:13px;white-space:nowrap;}
.btn-g{background:linear-gradient(135deg,var(--g),var(--g2));color:#050409;}
.btn-g:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(201,168,76,0.35);}
.btn-ghost{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09)!important;color:var(--text);}
.btn-ghost:hover{background:rgba(255,255,255,0.08);}
.btn-ok{background:rgba(0,210,120,0.1);border:1px solid rgba(0,210,120,0.25)!important;color:#2dda8a;}
.btn-ok:hover{background:rgba(0,210,120,0.18);}
.btn-no{background:rgba(255,64,64,0.1);border:1px solid rgba(255,64,64,0.25)!important;color:#ff7070;}
.btn-no:hover{background:rgba(255,64,64,0.18);}
.btn-b{background:rgba(80,150,255,0.1);border:1px solid rgba(80,150,255,0.25)!important;color:#80b0ff;}
.btn-b:hover{background:rgba(80,150,255,0.18);}
.btn-sm{padding:6px 12px;font-size:12px;}
.btn-md{padding:10px 18px;}
.btn-lg{padding:13px 24px;font-size:14px;}
.btn-full{width:100%;justify-content:center;}
.inp{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:9px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;padding:10px 13px;width:100%;outline:none;transition:border-color .2s;}
.inp:focus{border-color:var(--g);background:rgba(201,168,76,0.04);}
.inp::placeholder{color:var(--muted);}
select.inp{appearance:none;}
textarea.inp{resize:vertical;min-height:72px;}
.chip{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;border-radius:16px;font-size:11px;font-weight:600;}
.chip-g{background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.22);color:var(--g2);}
.chip-ok{background:rgba(0,210,120,0.08);border:1px solid rgba(0,210,120,0.2);color:#2dda8a;}
.chip-no{background:rgba(255,64,64,0.08);border:1px solid rgba(255,64,64,0.2);color:#ff7070;}
.chip-b{background:rgba(80,150,255,0.08);border:1px solid rgba(80,150,255,0.2);color:#80b0ff;}
.chip-m{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:var(--muted);}
.notif{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999;padding:11px 20px;border-radius:10px;font-size:13px;font-weight:600;animation:fadeUp .3s ease;backdrop-filter:blur(16px);white-space:nowrap;max-width:90vw;}
.notif-ok{background:rgba(0,40,20,0.9);border:1px solid rgba(0,210,120,0.35);color:#2dda8a;}
.notif-e{background:rgba(40,0,0,0.9);border:1px solid rgba(255,64,64,0.35);color:#ff7070;}
.notif-i{background:rgba(10,6,20,0.9);border:1px solid rgba(201,168,76,0.35);color:var(--g2);}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(10px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;animation:fadeIn .2s ease;}
.modal-box{background:linear-gradient(150deg,#0c0b1c,#10101e);border:1px solid rgba(201,168,76,0.18);border-radius:18px;width:100%;max-width:460px;max-height:88vh;overflow-y:auto;padding:26px;}
.sep{height:1px;background:rgba(255,255,255,0.05);}
.sb-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;cursor:pointer;transition:all .2s;color:var(--muted);font-weight:600;font-size:13px;border:none;background:none;font-family:'DM Sans',sans-serif;width:100%;text-align:left;}
.sb-item:hover{background:rgba(255,255,255,0.04);color:var(--text);}
.sb-item.on{background:rgba(201,168,76,0.08);color:var(--g);border-left:2px solid var(--g);}
.dot-on{width:7px;height:7px;background:#2dda8a;border-radius:50%;animation:pulse 2s infinite;display:inline-block;}
.mesh-bg{position:fixed;inset:0;pointer-events:none;z-index:0;}
.mesh-bg::before{content:'';position:absolute;width:600px;height:600px;background:radial-gradient(circle,rgba(201,168,76,0.05) 0%,transparent 65%);top:-120px;right:-120px;border-radius:50%;}
.mesh-bg::after{content:'';position:absolute;width:400px;height:400px;background:radial-gradient(circle,rgba(120,0,200,0.03) 0%,transparent 65%);bottom:-80px;left:-80px;border-radius:50%;}
`;

/* ─── Helpers ─── */
function Notif({n}){
  if(!n) return null;
  const c={ok:"notif-ok",err:"notif-e",inf:"notif-i"}[n.t]||"notif-i";
  return <div className={`notif ${c}`}>{n.msg}</div>;
}
function Label({children,style={}}){
  return <div style={{color:"var(--muted)",fontSize:11,fontWeight:700,letterSpacing:.8,textTransform:"uppercase",marginBottom:7,...style}}>{children}</div>;
}
function Stat({icon,label,value,sub,color="#c9a84c",photo}){
  return (
    <div className="glass" style={{padding:18,position:"relative",overflow:"hidden"}}>
      {photo&&<img src={photo} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:.07,filter:"saturate(1.5)"}} />}
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{color:"var(--muted)",fontSize:11,fontWeight:700,letterSpacing:.5,marginBottom:6}}>{label}</div>
            <div className="ff" style={{fontSize:26,fontWeight:700,color}}>{value}</div>
            {sub&&<div style={{color:"var(--muted)",fontSize:11,marginTop:3}}>{sub}</div>}
          </div>
          <div style={{fontSize:28,background:`${color}12`,padding:9,borderRadius:10,flexShrink:0}}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

export default function Admin(){
  const [init,  setInit]  = useState(false);
  const [logged,setLogged]= useState(false);
  const [lf,    setLf]    = useState({u:"",p:""});
  const [page,  setPage]  = useState("dash");
  const [notif, setNotif] = useState(null);
  const [modal, setModal] = useState(null);

  const [users,  setUsers]  = useState([]);
  const [accs,   setAccs]   = useState(SYS_ACCOUNTS);
  const [rentals,setRentals]= useState([]);
  const [evDone, setEvDone] = useState([]);
  const [topups, setTopups] = useState([]);
  const [wds,    setWds]    = useState([]);
  const [cfg,    setCfg]    = useState({qrisImg:"",qrisName:"FF Rent Pay",qrisPhone:"08123456789"});
  const [events, setEvents] = useState(EVENTS_DATA);

  const [tf,  setTf]  = useState({status:"all"});
  const [wf,  setWf]  = useState({status:"all"});
  const [af,  setAf]  = useState({ffId:"",ffPw:"",ffName:"",lv:"",rank:"Heroic",heroes:"",price:"",desc:""});
  const [editAcc,setEditAcc]=useState(null);
  const [evForm, setEvForm]=useState({title:"",desc:"",reward:"",type:"daily",icon:"🎁",cooldown:24});
  const [cfgF,   setCfgF]  =useState({qrisImg:"",qrisName:"",qrisPhone:""});
  const [coinModal,setCoinModal]=useState(null);
  const [coinAmt,  setCoinAmt]  =useState(0);

  useEffect(()=>{
    (async()=>{
      const keys=["users","accs","rentals","evDone","topups","wds","cfg","adminEvs"];
      for(const k of keys){
        try{
          const r=await window.storage.get(k);
          if(r?.value){
            const d=JSON.parse(r.value);
            if(k==="users")   setUsers(d);
            if(k==="accs"&&d.length) setAccs(d);
            if(k==="rentals") setRentals(d);
            if(k==="evDone")  setEvDone(d);
            if(k==="topups")  setTopups(d);
            if(k==="wds")     setWds(d);
            if(k==="cfg")     {setCfg({...cfg,...d});setCfgF({...cfg,...d});}
            if(k==="adminEvs"&&d.length) setEvents(d);
          }
        }catch{}
      }
      setInit(true);
    })();
  },[]);

  const sv=(k,d)=>{try{window.storage.set(k,JSON.stringify(d));}catch{}};
  const toast=(msg,t="ok")=>{setNotif({msg,t});setTimeout(()=>setNotif(null),3400);};

  const sUsers =(u)=>{setUsers(u); sv("users",u);};
  const sAccs  =(a)=>{setAccs(a);  sv("accs",a);};
  const sTopups=(t)=>{setTopups(t);sv("topups",t);};
  const sWds   =(w)=>{setWds(w);   sv("wds",w);};
  const sCfg   =(c)=>{setCfg(c);   sv("cfg",c);};
  const sEvents=(e)=>{setEvents(e);sv("adminEvs",e);};

  /* LOGIN */
  const doLogin=()=>{
    if(lf.u==="admin"&&lf.p==="admin123"){setLogged(true);toast("Selamat datang, Admin! 👑");}
    else toast("Credential salah","err");
  };

  /* TOP UP */
  const approveTp=(t)=>{
    const u=users.find(x=>x.id===t.uid);
    if(u) sUsers(users.map(x=>x.id===u.id?{...u,coins:u.coins+t.coins}:x));
    sTopups(topups.map(x=>x.id===t.id?{...x,status:"approved"}:x));
    toast(`Top up ${t.uname} approved ✅`);
  };
  const rejectTp=(t)=>{
    sTopups(topups.map(x=>x.id===t.id?{...x,status:"rejected"}:x));
    toast(`Top up ${t.uname} ditolak ❌`);
  };

  /* WITHDRAW */
  const approveWd=(w)=>{
    sWds(wds.map(x=>x.id===w.id?{...x,status:"approved"}:x));
    toast(`Withdraw ${w.uname} approved ✅`);
  };
  const rejectWd=(w)=>{
    const u=users.find(x=>x.id===w.uid);
    if(u) sUsers(users.map(x=>x.id===u.id?{...u,coins:u.coins+w.coins}:x));
    sWds(wds.map(x=>x.id===w.id?{...x,status:"rejected"}:x));
    toast(`Withdraw ditolak, koin dikembalikan ❌`);
  };

  /* ACCOUNTS */
  const saveAcc=()=>{
    if(!af.ffId||!af.ffPw||!af.ffName||!af.price){toast("Lengkapi data akun","err");return;}
    const obj={id:editAcc?editAcc.id:`sys${Date.now()}`,ownerId:editAcc?.ownerId||"system",
      ffId:af.ffId, ffEmail:af.ffEmail||"",
      ffPassword:af.ffPw,ffName:af.ffName,level:parseInt(af.lv)||1,rank:af.rank,
      heroes:af.heroes?af.heroes.split(",").map(h=>h.trim()):[],
      price:parseInt(af.price),desc:af.desc,available:true,
      rating:editAcc?.rating||0,totalRent:editAcc?.totalRent||0};
    sAccs(editAcc?accs.map(a=>a.id===editAcc.id?obj:a):[...accs,obj]);
    setEditAcc(null);setAf({ffId:"",ffEmail:"",ffPw:"",ffName:"",lv:"",rank:"Heroic",heroes:"",price:"",desc:""});
    setModal(null);toast(editAcc?"Akun diperbarui ✅":"Akun ditambahkan ✅");
  };
  const delAcc=(a)=>{ if(!confirm(`Hapus ${a.ffName}?`)) return; sAccs(accs.filter(x=>x.id!==a.id)); toast("Akun dihapus"); };

  /* EVENTS */
  const addEvent=()=>{
    if(!evForm.title||!evForm.desc||!evForm.reward){toast("Lengkapi data event","err");return;}
    sEvents([...events,{id:`ev${Date.now()}`,...evForm,reward:parseInt(evForm.reward),cooldown:parseInt(evForm.cooldown)||0}]);
    setEvForm({title:"",desc:"",reward:"",type:"daily",icon:"🎁",cooldown:24});
    toast("Event ditambahkan 🎁");
  };
  const delEvent=(e)=>{ sEvents(events.filter(x=>x.id!==e.id)); toast("Event dihapus"); };

  /* USERS */
  const adjustCoins=(u,amt)=>{
    sUsers(users.map(x=>x.id===u.id?{...u,coins:Math.max(0,u.coins+amt)}:x));
    toast(`Koin ${u.username} ${amt>0?"+":""}${amt} ✅`);
    setCoinModal(null);
  };
  const banUser=(u)=>{
    sUsers(users.map(x=>x.id===u.id?{...u,banned:!u.banned}:x));
    toast(`${u.username} ${u.banned?"di-unban":"dibanned"}`);
  };

  /* SETTINGS */
  const saveCfg=()=>{ sCfg(cfgF); toast("Pengaturan disimpan ✅"); };

  if(!init) return (
    <div style={{background:"#050409",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{G}</style>
      <div style={{textAlign:"center"}}><div style={{fontSize:48,animation:"float 2s infinite"}}>⚙️</div><div className="ff" style={{color:"var(--g)",fontSize:20,marginTop:12,letterSpacing:3}}>ADMIN PANEL</div></div>
    </div>
  );

  if(!logged) return (
    <div style={{background:"#050409",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <style>{G}</style><div className="mesh-bg"/><Notif n={notif}/>
      <div style={{width:"100%",maxWidth:380,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:52,animation:"float 3s infinite",marginBottom:10}}>🛡️</div>
          <div className="ff" style={{fontSize:32,fontWeight:900,color:"var(--g)",letterSpacing:4}}>ADMIN</div>
          <div style={{color:"var(--muted)",fontSize:12,letterSpacing:2,marginTop:4}}>FF RENT MANAGEMENT</div>
        </div>
        <div className="glass" style={{padding:28}}>
          <div style={{marginBottom:14}}><Label>Username Admin</Label><input className="inp" placeholder="admin" value={lf.u} onChange={e=>setLf({...lf,u:e.target.value})} /></div>
          <div style={{marginBottom:20}}><Label>Password</Label><input className="inp" type="password" placeholder="••••••••" value={lf.p} onChange={e=>setLf({...lf,p:e.target.value})} onKeyDown={e=>e.key==="Enter"&&doLogin()} /></div>
          <button className="btn btn-g btn-lg btn-full" onClick={doLogin}>Masuk ke Admin →</button>
        </div>
      </div>
    </div>
  );

  /* ── DERIVED ── */
  const pendTp=topups.filter(t=>t.status==="pending");
  const pendWd=wds.filter(w=>w.status==="pending");
  const totalRev=topups.filter(t=>t.status==="approved").reduce((s,t)=>s+t.amt,0);
  const activeRents=rentals.filter(r=>r.status==="active"&&new Date(r.end)>new Date());
  const totalCoins=users.reduce((s,u)=>s+(u.coins||0),0);

  const navItems=[
    {id:"dash",ic:"📊",lb:"Dashboard"},
    {id:"topup",ic:"💎",lb:`Top Up${pendTp.length>0?` (${pendTp.length})`:""}`},
    {id:"wd",ic:"💸",lb:`Withdraw${pendWd.length>0?` (${pendWd.length})`:""}`},
    {id:"accs",ic:"🎮",lb:"Akun FF"},
    {id:"members",ic:"👥",lb:"Members"},
    {id:"rentals",ic:"⚡",lb:"Sewa"},
    {id:"events",ic:"🎁",lb:"Events"},
    {id:"settings",ic:"⚙️",lb:"Pengaturan"},
  ];

  /* ─────────────────────────────────
     PAGE: DASH
  ───────────────────────────────── */
  const pageDash=()=>(
    <div>
      <div style={{marginBottom:24}}>
        <div className="ff" style={{fontSize:24,fontWeight:700,color:"var(--text)"}}>Dashboard</div>
        <div style={{color:"var(--muted)",fontSize:13,marginTop:2}}>Selamat datang, Admin 👑 · {new Date().toLocaleDateString("id",{weekday:"long",day:"numeric",month:"long"})}</div>
      </div>

      {/* Alert */}
      {(pendTp.length>0||pendWd.length>0)&&(
        <div className="glass-g" style={{padding:"14px 18px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{color:"var(--g2)",fontSize:13,fontWeight:600}}>⚠️ {pendTp.length} top up & {pendWd.length} withdraw perlu diproses!</div>
          <button className="btn btn-g btn-sm" onClick={()=>setPage("topup")}>Proses →</button>
        </div>
      )}

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:20}}>
        <Stat icon="👥" label="Total Member" value={users.length} sub={`${users.filter(u=>!u.banned).length} aktif`} color="#80b0ff" photo={ACCOUNT_PHOTOS["Diamond"]} />
        <Stat icon="🎮" label="Akun FF" value={accs.length} sub={`${accs.filter(a=>a.ownerId==="system").length} sistem`} color="var(--g)" photo={ACCOUNT_PHOTOS["Heroic"]} />
        <Stat icon="⚡" label="Sewa Aktif" value={activeRents.length} sub="sekarang" color="#2dda8a" photo={ACCOUNT_PHOTOS["Grand Master"]} />
        <Stat icon="💰" label="Revenue" value={`Rp${(totalRev/1000).toFixed(0)}K`} sub="total top up" color="var(--g)" photo={ACCOUNT_PHOTOS["Gold"]} />
        <Stat icon="🪙" label="Koin Beredar" value={totalCoins.toLocaleString()} sub="semua member" color="var(--a)" />
        <Stat icon="🔄" label="Total Sewa" value={rentals.length} sub="all time" color="#da70d6" />
      </div>

      {/* Pending Quick Actions */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
        {/* Top up pending */}
        <div className="glass" style={{padding:16}}>
          <div style={{color:"var(--g2)",fontWeight:700,fontSize:13,marginBottom:12}}>💎 Pending ({pendTp.length})</div>
          {pendTp.length===0&&<div style={{color:"var(--muted)",fontSize:12}}>Tidak ada</div>}
          {pendTp.slice(0,3).map(t=>(
            <div key={t.id} style={{padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{color:"var(--text)",fontSize:12,fontWeight:600}}>{t.uname}</div>
                <div style={{color:"var(--g)",fontSize:11}}>+{t.coins} koin</div>
              </div>
              <div style={{display:"flex",gap:5}}>
                <button className="btn btn-ok btn-sm" onClick={()=>approveTp(t)}>✓</button>
                <button className="btn btn-no btn-sm" onClick={()=>rejectTp(t)}>✕</button>
              </div>
            </div>
          ))}
          {pendTp.length>3&&<button className="btn btn-ghost btn-sm btn-full" style={{marginTop:10}} onClick={()=>setPage("topup")}>Lihat Semua</button>}
        </div>
        {/* Withdraw pending */}
        <div className="glass" style={{padding:16}}>
          <div style={{color:"#2dda8a",fontWeight:700,fontSize:13,marginBottom:12}}>💸 Pending ({pendWd.length})</div>
          {pendWd.length===0&&<div style={{color:"var(--muted)",fontSize:12}}>Tidak ada</div>}
          {pendWd.slice(0,3).map(w=>(
            <div key={w.id} style={{padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.04)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{color:"var(--text)",fontSize:12,fontWeight:600}}>{w.uname}</div>
                <div style={{color:"#2dda8a",fontSize:11}}>Rp {w.amt?.toLocaleString()}</div>
              </div>
              <div style={{display:"flex",gap:5}}>
                <button className="btn btn-ok btn-sm" onClick={()=>approveWd(w)}>✓</button>
                <button className="btn btn-no btn-sm" onClick={()=>rejectWd(w)}>✕</button>
              </div>
            </div>
          ))}
          {pendWd.length>3&&<button className="btn btn-ghost btn-sm btn-full" style={{marginTop:10}} onClick={()=>setPage("wd")}>Lihat Semua</button>}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass" style={{padding:18}}>
        <div className="ff" style={{fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:14}}>Aktivitas Terbaru</div>
        {rentals.length===0&&topups.length===0
          ? <div style={{color:"var(--muted)",fontSize:13,textAlign:"center",padding:16}}>Belum ada aktivitas</div>
          : [...rentals.map(r=>({type:"rent",time:r.start,user:r.uname,detail:`Sewa ${accs.find(a=>a.id===r.accId)?.ffName||"?"} · ${r.cost} koin`})),
             ...topups.map(t=>({type:"topup",time:t.at,user:t.uname,detail:`Top up Rp ${t.amt?.toLocaleString()} · ${t.status}`}))
            ].sort((a,b)=>new Date(b.time)-new Date(a.time)).slice(0,8).map((a,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<7?"1px solid rgba(255,255,255,0.04)":"none"}}>
              <div style={{fontSize:18,flexShrink:0}}>{a.type==="rent"?"🎮":"💎"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:"var(--text)",fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  <span style={{color:"var(--g)"}}>{a.user}</span> {a.detail}
                </div>
                <div style={{color:"var(--muted)",fontSize:11}}>{new Date(a.time).toLocaleString("id")}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );

  /* ─────────────────────────────────
     PAGE: TOP UP
  ───────────────────────────────── */
  const pageTopup=()=>{
    const filtered=topups.filter(t=>tf.status==="all"||t.status===tf.status).sort((a,b)=>new Date(b.at)-new Date(a.at));
    return (
      <div>
        <div className="ff" style={{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:16}}>💎 Manajemen Top Up</div>
        <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
          {[["all","Semua"],["pending",`⏳ Pending (${pendTp.length})`],["approved","✅ Approved"],["rejected","❌ Ditolak"]].map(([v,l])=>(
            <button key={v} onClick={()=>setTf({...tf,status:v})} className="btn" style={{padding:"8px 14px",background:tf.status===v?"linear-gradient(135deg,var(--g),var(--g2))":"rgba(255,255,255,0.04)",border:`1px solid ${tf.status===v?"transparent":"rgba(255,255,255,0.08)"}`,color:tf.status===v?"#050409":"var(--muted)",fontFamily:"'DM Sans',sans-serif"}}>{l}</button>
          ))}
        </div>
        {filtered.length===0&&<div style={{textAlign:"center",padding:40,color:"var(--muted)"}}><div style={{fontSize:40}}>📭</div><div style={{marginTop:8,fontSize:13}}>Tidak ada data</div></div>}
        {filtered.map(t=>(
          <div key={t.id} className="glass" style={{padding:16,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                  <div className="ff" style={{color:"var(--text)",fontWeight:700,fontSize:15}}>{t.uname}</div>
                  <span className={`chip ${t.status==="approved"?"chip-ok":t.status==="rejected"?"chip-no":"chip-b"}`}>
                    {t.status==="approved"?"✅ OK":t.status==="rejected"?"❌ Ditolak":"⏳ Pending"}
                  </span>
                </div>
                <div className="ff" style={{color:"var(--g)",fontWeight:700,fontSize:18}}>Rp {t.amt?.toLocaleString()}</div>
                <div style={{color:"var(--muted)",fontSize:12,marginTop:2}}>+{t.coins} koin · {new Date(t.at).toLocaleString("id")}</div>
                {t.proof&&<button className="btn btn-ghost btn-sm" style={{marginTop:8}} onClick={()=>setModal({t:"proof",img:t.proof})}>📸 Lihat Bukti</button>}
              </div>
              {t.status==="pending"&&(
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <button className="btn btn-ok btn-md" onClick={()=>approveTp(t)}>✅ Approve</button>
                  <button className="btn btn-no btn-md" onClick={()=>rejectTp(t)}>❌ Tolak</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /* ─────────────────────────────────
     PAGE: WITHDRAW
  ───────────────────────────────── */
  const pageWd=()=>{
    const filtered=wds.filter(w=>wf.status==="all"||w.status===wf.status).sort((a,b)=>new Date(b.at)-new Date(a.at));
    return (
      <div>
        <div className="ff" style={{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:16}}>💸 Manajemen Withdraw</div>
        <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
          {[["all","Semua"],["pending",`⏳ Pending (${pendWd.length})`],["approved","✅ Done"],["rejected","❌ Ditolak"]].map(([v,l])=>(
            <button key={v} onClick={()=>setWf({...wf,status:v})} className="btn" style={{padding:"8px 14px",background:wf.status===v?"linear-gradient(135deg,var(--g),var(--g2))":"rgba(255,255,255,0.04)",border:`1px solid ${wf.status===v?"transparent":"rgba(255,255,255,0.08)"}`,color:wf.status===v?"#050409":"var(--muted)",fontFamily:"'DM Sans',sans-serif"}}>{l}</button>
          ))}
        </div>
        {filtered.length===0&&<div style={{textAlign:"center",padding:40,color:"var(--muted)"}}><div style={{fontSize:40}}>📭</div><div style={{marginTop:8,fontSize:13}}>Tidak ada data</div></div>}
        {filtered.map(w=>(
          <div key={w.id} className="glass" style={{padding:16,marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                  <div className="ff" style={{color:"var(--text)",fontWeight:700,fontSize:15}}>{w.uname}</div>
                  <span className={`chip ${w.status==="approved"?"chip-ok":w.status==="rejected"?"chip-no":"chip-b"}`}>
                    {w.status==="approved"?"✅ Cair":w.status==="rejected"?"❌ Ditolak":"⏳ Pending"}
                  </span>
                </div>
                <div className="ff" style={{color:"#2dda8a",fontWeight:700,fontSize:18}}>Rp {w.amt?.toLocaleString()}</div>
                <div style={{color:"var(--text)",fontSize:13,marginTop:4}}>{w.bank} · {w.accNo}</div>
                <div style={{color:"var(--muted)",fontSize:12,marginTop:2}}>{w.accName} · {w.coins} koin · {new Date(w.at).toLocaleString("id")}</div>
              </div>
              {w.status==="pending"&&(
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <button className="btn btn-ok btn-md" onClick={()=>approveWd(w)}>✅ Approve</button>
                  <button className="btn btn-no btn-md" onClick={()=>rejectWd(w)}>❌ Tolak</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /* ─────────────────────────────────
     PAGE: ACCOUNTS
  ───────────────────────────────── */
  const pageAccs=()=>(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div className="ff" style={{fontSize:22,fontWeight:700,color:"var(--text)"}}>🎮 Kelola Akun FF</div>
        <button className="btn btn-g btn-md" onClick={()=>{setEditAcc(null);setAf({ffId:"",ffEmail:"",ffPw:"",ffName:"",lv:"",rank:"Heroic",heroes:"",price:"",desc:""});setModal({t:"accForm"});}}>➕ Tambah</button>
      </div>
      {accs.map(acc=>{
        const rm=RANK_META[acc.rank]||RANK_META["Bronze"];
        const photo=ACCOUNT_PHOTOS[acc.rank]||ACCOUNT_PHOTOS["Gold"];
        const rented=!!rentals.find(r=>r.accId===acc.id&&r.status==="active");
        return (
          <div key={acc.id} className="glass card-h" style={{marginBottom:12,overflow:"hidden"}}>
            <div style={{display:"flex",gap:0}}>
              <div style={{width:90,flexShrink:0,position:"relative",overflow:"hidden"}}>
                <img src={photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.5)",minHeight:90}} />
                <div style={{position:"absolute",inset:0,background:`linear-gradient(to right,transparent,rgba(10,8,16,0.9))`}} />
              </div>
              <div style={{flex:1,padding:"14px 16px 14px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <div className="ff" style={{color:"var(--text)",fontWeight:700,fontSize:15}}>{acc.ffName}</div>
                    <div style={{display:"flex",gap:8,marginTop:5,flexWrap:"wrap"}}>
                      <span className="chip" style={{background:`${rm.color}15`,border:`1px solid ${rm.color}35`,color:rm.color,fontSize:11}}>{rm.badge} {acc.rank}</span>
                      <span style={{color:"var(--muted)",fontSize:12}}>Lv.{acc.level}</span>
                      <span style={{color:acc.ownerId==="system"?"var(--g)":"#80b0ff",fontSize:12}}>{acc.ownerId==="system"?"⚙️ Sistem":"👤 Member"}</span>
                      {rented&&<span className="chip chip-no" style={{fontSize:11}}>🔴 Disewa</span>}
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <button className="btn btn-b btn-sm" onClick={()=>{setEditAcc(acc);setAf({ffId:acc.ffId,ffEmail:acc.ffEmail||"",ffPw:acc.ffPassword,ffName:acc.ffName,lv:acc.level,rank:acc.rank,heroes:(acc.heroes||[]).join(", "),price:acc.price,desc:acc.desc});setModal({t:"accForm"});}}>✏️</button>
                    <button className="btn btn-no btn-sm" onClick={()=>delAcc(acc)}>🗑️</button>
                  </div>
                </div>
                <div style={{color:"var(--muted)",fontSize:12,marginTop:6}}>ID: {acc.ffId} {acc.ffEmail?`· 📧 ${acc.ffEmail}`:""} · {acc.price} koin/jam · 🔄{acc.totalRent}x · ★{acc.rating}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ─────────────────────────────────
     PAGE: MEMBERS
  ───────────────────────────────── */
  const pageMembers=()=>(
    <div>
      <div className="ff" style={{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:6}}>👥 Members ({users.length})</div>
      <div style={{color:"var(--muted)",fontSize:13,marginBottom:20}}>{users.filter(u=>!u.banned).length} aktif · {users.filter(u=>u.banned).length} banned</div>
      {users.length===0&&<div style={{textAlign:"center",padding:40,color:"var(--muted)"}}><div style={{fontSize:40}}>👥</div><div style={{marginTop:8,fontSize:13}}>Belum ada member</div></div>}
      {users.map(u=>{
        const ur=rentals.filter(r=>r.uid===u.id);
        const ua=accs.filter(a=>a.ownerId===u.id);
        return (
          <div key={u.id} className="glass" style={{padding:14,marginBottom:10,opacity:u.banned?.6:1}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,var(--g),var(--a))",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,color:"#050409",fontSize:14,flexShrink:0}}>
                    {u.username[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="ff" style={{color:"var(--text)",fontWeight:700,fontSize:14}}>{u.username}</div>
                    <div style={{color:"var(--muted)",fontSize:11}}>{u.phone}</div>
                  </div>
                  {u.banned&&<span className="chip chip-no" style={{fontSize:10}}>🚫 Banned</span>}
                </div>
                <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
                  <span style={{color:"var(--g)",fontSize:13}}>🪙 {u.coins?.toLocaleString()}</span>
                  <span style={{color:"var(--muted)",fontSize:12}}>🎮 {ur.length}x sewa</span>
                  <span style={{color:"var(--muted)",fontSize:12}}>📋 {ua.length} akun</span>
                  <span style={{color:"var(--a)",fontSize:12}}>🔥 {u.streak||0}d streak</span>
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <button className="btn btn-ghost btn-sm" onClick={()=>{setCoinModal(u);setCoinAmt(0);}}>🪙 Koin</button>
                <button className={`btn btn-sm ${u.banned?"btn-ok":"btn-no"}`} onClick={()=>banUser(u)}>{u.banned?"Unban":"Ban"}</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ─────────────────────────────────
     PAGE: RENTALS
  ───────────────────────────────── */
  const pageRentals=()=>(
    <div>
      <div className="ff" style={{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:20}}>⚡ Riwayat Sewa ({rentals.length})</div>
      {rentals.length===0&&<div style={{textAlign:"center",padding:40,color:"var(--muted)"}}><div style={{fontSize:40}}>🎮</div><div style={{marginTop:8,fontSize:13}}>Belum ada riwayat</div></div>}
      {rentals.slice().reverse().map(r=>{
        const acc=accs.find(a=>a.id===r.accId);
        const isAct=r.status==="active"&&new Date(r.end)>new Date();
        const rm=RANK_META[acc?.rank]||RANK_META["Bronze"];
        return (
          <div key={r.id} className="glass" style={{padding:14,marginBottom:10,borderLeft:`3px solid ${isAct?rm.color:"rgba(255,255,255,0.05)"}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                  <span style={{color:"var(--text)",fontWeight:600}}>{r.uname}</span>
                  <span style={{color:"var(--muted)",fontSize:12}}>→</span>
                  <span style={{color:"var(--g)",fontWeight:600}}>{acc?.ffName||"?"}</span>
                  <span className={`chip ${isAct?"chip-ok":"chip-m"}`} style={{fontSize:11}}>{isAct?"⚡ Aktif":"✅ Selesai"}</span>
                </div>
                <div style={{color:"var(--g)",fontSize:12}}>{r.cost} koin · {r.dur}jam</div>
                <div style={{color:"var(--muted)",fontSize:11,marginTop:2}}>
                  {new Date(r.start).toLocaleString("id")} → {new Date(r.end).toLocaleString("id")}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ─────────────────────────────────
     PAGE: EVENTS
  ───────────────────────────────── */
  const pageEvents=()=>(
    <div>
      <div className="ff" style={{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:20}}>🎁 Event Manager</div>
      {/* Add form */}
      <div className="glass" style={{padding:20,marginBottom:24}}>
        <div style={{color:"var(--g2)",fontWeight:700,fontSize:14,marginBottom:14}}>➕ Tambah Event Baru</div>
        <div style={{display:"grid",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 80px",gap:12}}>
            <div><Label>Judul</Label><input className="inp" placeholder="Nama event" value={evForm.title} onChange={e=>setEvForm({...evForm,title:e.target.value})} /></div>
            <div><Label>Icon</Label><input className="inp" placeholder="🎁" value={evForm.icon} onChange={e=>setEvForm({...evForm,icon:e.target.value})} /></div>
          </div>
          <div><Label>Deskripsi</Label><input className="inp" placeholder="Deskripsi singkat" value={evForm.desc} onChange={e=>setEvForm({...evForm,desc:e.target.value})} /></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            <div><Label>Reward (koin)</Label><input className="inp" type="number" placeholder="50" value={evForm.reward} onChange={e=>setEvForm({...evForm,reward:e.target.value})} /></div>
            <div><Label>Tipe</Label>
              <select className="inp" value={evForm.type} onChange={e=>setEvForm({...evForm,type:e.target.value})}>
                <option value="daily">Daily</option>
                <option value="mission">Mission</option>
                <option value="streak">Streak</option>
                <option value="weekend">Weekend</option>
              </select>
            </div>
            <div><Label>Cooldown (jam)</Label><input className="inp" type="number" placeholder="24" value={evForm.cooldown} onChange={e=>setEvForm({...evForm,cooldown:e.target.value})} /></div>
          </div>
          <button className="btn btn-g btn-md btn-full" onClick={addEvent}>Tambah Event 🎁</button>
        </div>
      </div>
      {/* List */}
      {events.map(ev=>(
        <div key={ev.id} className="glass" style={{padding:14,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:12,alignItems:"center",flex:1,minWidth:0}}>
            <div style={{fontSize:28,flexShrink:0}}>{ev.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="ff" style={{color:"var(--text)",fontWeight:700,fontSize:14}}>{ev.title}</div>
              <div style={{color:"var(--muted)",fontSize:12}}>{ev.desc}</div>
              <div style={{display:"flex",gap:8,marginTop:4}}>
                <span className="chip chip-g" style={{fontSize:10}}>+{ev.reward} koin</span>
                <span className="chip chip-m" style={{fontSize:10}}>{ev.type}</span>
                {evDone.filter(e=>e.evId===ev.id).length>0&&<span style={{color:"var(--muted)",fontSize:11}}>✅{evDone.filter(e=>e.evId===ev.id).length}x</span>}
              </div>
            </div>
          </div>
          <button className="btn btn-no btn-sm" style={{flexShrink:0,marginLeft:10}} onClick={()=>delEvent(ev)}>🗑️</button>
        </div>
      ))}
    </div>
  );

  /* ─────────────────────────────────
     PAGE: SETTINGS
  ───────────────────────────────── */
  const pageSettings=()=>(
    <div>
      <div className="ff" style={{fontSize:22,fontWeight:700,color:"var(--text)",marginBottom:20}}>⚙️ Pengaturan</div>
      <div className="glass" style={{padding:24,marginBottom:20}}>
        <div style={{color:"var(--g2)",fontWeight:700,fontSize:15,marginBottom:16}}>📱 QRIS & Pembayaran</div>
        <div style={{display:"grid",gap:14}}>
          <div><Label>Nama Penerima QRIS</Label><input className="inp" value={cfgF.qrisName||""} onChange={e=>setCfgF({...cfgF,qrisName:e.target.value})} /></div>
          <div><Label>Nomor HP / Dompet Digital</Label><input className="inp" value={cfgF.qrisPhone||""} onChange={e=>setCfgF({...cfgF,qrisPhone:e.target.value})} /></div>
          <div>
            <Label>Foto QRIS (Upload)</Label>
            <div style={{background:"rgba(255,255,255,0.02)",border:"2px dashed rgba(201,168,76,0.2)",borderRadius:12,padding:20,textAlign:"center",cursor:"pointer",position:"relative",transition:"all .2s"}}
              onMouseOver={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.4)";}}
              onMouseOut={e=>{e.currentTarget.style.borderColor="rgba(201,168,76,0.2)";}}>
              <input type="file" accept="image/*" style={{position:"absolute",inset:0,opacity:0,cursor:"pointer",width:"100%"}}
                onChange={e=>{const f=e.target.files?.[0];if(f){const rd=new FileReader();rd.onload=()=>setCfgF({...cfgF,qrisImg:rd.result});rd.readAsDataURL(f);}}} />
              {cfgF.qrisImg
                ? <div><img src={cfgF.qrisImg} alt="QRIS" style={{maxHeight:200,borderRadius:8,maxWidth:"100%"}}/><div style={{color:"#2dda8a",fontSize:12,marginTop:8}}>✅ QRIS terpasang</div></div>
                : <div style={{color:"var(--muted)"}}><div style={{fontSize:36}}>📱</div><div style={{fontSize:13,marginTop:8}}>Klik untuk upload foto QRIS</div></div>
              }
            </div>
          </div>
          {cfgF.qrisImg&&<button className="btn btn-no btn-sm" style={{alignSelf:"flex-start"}} onClick={()=>setCfgF({...cfgF,qrisImg:""})}>🗑️ Hapus QRIS</button>}
          <button className="btn btn-g btn-lg btn-full" onClick={saveCfg}>💾 Simpan Pengaturan</button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="glass" style={{padding:20}}>
        <div className="ff" style={{color:"var(--text)",fontWeight:700,marginBottom:14}}>📊 Statistik Platform</div>
        {[
          ["Total Member",users.length,"#80b0ff"],
          ["Total Akun FF",accs.length,"var(--g)"],
          ["Total Sewa",rentals.length,"#2dda8a"],
          ["Revenue Total",`Rp ${totalRev.toLocaleString()}`,"var(--g)"],
          ["Top Up Approved",topups.filter(t=>t.status==="approved").length,"#2dda8a"],
          ["Withdraw Done",wds.filter(w=>w.status==="approved").length,"#da70d6"],
        ].map(([l,v,c])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <span style={{color:"var(--muted)",fontSize:13}}>{l}</span>
            <span className="ff" style={{color:c,fontWeight:700,fontSize:13}}>{v}</span>
          </div>
        ))}
        <div style={{background:"rgba(201,168,76,0.05)",border:"1px solid rgba(201,168,76,0.15)",borderRadius:10,padding:"10px 14px",marginTop:14}}>
          <div style={{color:"var(--g2)",fontSize:11,fontWeight:700,letterSpacing:.5,marginBottom:6}}>ADMIN CREDENTIALS</div>
          <div style={{color:"var(--text)",fontSize:13}}>Username: <b style={{color:"var(--g)"}}>admin</b> · Password: <b style={{color:"var(--g)"}}>admin123</b></div>
        </div>
      </div>

      {/* Contact Info Display */}
      <div className="glass" style={{padding:20,marginTop:16}}>
        <div className="ff" style={{color:"var(--text)",fontWeight:700,marginBottom:14}}>📞 Info Kontak Admin</div>
        <div style={{color:"var(--muted)",fontSize:12,marginBottom:12}}>Info ini ditampilkan ke member di halaman Hubungi Kami</div>
        {[
          {l:"WhatsApp",    v:ADMIN_CONTACT.waText,  ic:"💬"},
          {l:"Email Utama", v:ADMIN_CONTACT.email,   ic:"📧"},
          {l:"Email Support",v:ADMIN_CONTACT.email2, ic:"📧"},
          {l:"Instagram",   v:ADMIN_CONTACT.ig,      ic:"📸"},
          {l:"TikTok",      v:ADMIN_CONTACT.tiktok,  ic:"🎵"},
          {l:"Discord",     v:ADMIN_CONTACT.discord, ic:"🎮"},
          {l:"Line",        v:ADMIN_CONTACT.line,    ic:"💚"},
          {l:"Jam Buka",    v:ADMIN_CONTACT.openHour,ic:"🕐"},
        ].map(row=>(
          <div key={row.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
            <span style={{color:"var(--muted)",fontSize:13}}>{row.ic} {row.l}</span>
            <span style={{color:"var(--g2)",fontWeight:600,fontSize:13}}>{row.v}</span>
          </div>
        ))}
        <div style={{color:"var(--muted)",fontSize:11,marginTop:10}}>💡 Ubah di konstanta ADMIN_CONTACT dalam kode untuk memperbarui info kontak.</div>
      </div>
    </div>
  );

  /* ─────────────────────────────────
     MODAL
  ───────────────────────────────── */
  const renderModal=()=>{
    if(!modal&&!coinModal) return null;

    if(coinModal){
      const u=coinModal;
      return (
        <div className="modal-bg" onClick={()=>setCoinModal(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="ff" style={{color:"var(--text)",fontWeight:700,fontSize:18,marginBottom:16}}>🪙 Adjust Koin: {u.username}</div>
            <div className="glass-g" style={{padding:"12px 16px",textAlign:"center",marginBottom:16}}>
              <div className="ff" style={{color:"var(--g)",fontSize:24,fontWeight:700}}>🪙 {u.coins?.toLocaleString()}</div>
              <div style={{color:"var(--muted)",fontSize:12,marginTop:2}}>Saldo saat ini</div>
            </div>
            <div style={{marginBottom:14}}>
              <Label>Jumlah (negatif = kurangi)</Label>
              <input className="inp" type="number" placeholder="misal: 500 atau -100" value={coinAmt} onChange={e=>setCoinAmt(parseInt(e.target.value)||0)} />
              {coinAmt!==0&&<div style={{color:coinAmt>0?"#2dda8a":"#ff7070",fontSize:12,marginTop:6}}>Saldo baru: {u.coins+coinAmt} koin</div>}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn btn-g btn-lg" style={{flex:1}} onClick={()=>adjustCoins(u,coinAmt)}>Simpan</button>
              <button className="btn btn-ghost btn-lg" style={{padding:"13px 20px"}} onClick={()=>setCoinModal(null)}>Batal</button>
            </div>
          </div>
        </div>
      );
    }

    if(modal.t==="proof") return (
      <div className="modal-bg" onClick={()=>setModal(null)}>
        <div className="modal-box" style={{textAlign:"center"}} onClick={e=>e.stopPropagation()}>
          <div className="ff" style={{color:"var(--text)",fontWeight:700,fontSize:18,marginBottom:16}}>📸 Bukti Transfer</div>
          <img src={modal.img} alt="Bukti" style={{maxWidth:"100%",borderRadius:12}} />
          <button className="btn btn-ghost btn-lg btn-full" style={{marginTop:16}} onClick={()=>setModal(null)}>Tutup</button>
        </div>
      </div>
    );

    if(modal.t==="accForm") return (
      <div className="modal-bg" onClick={()=>setModal(null)}>
        <div className="modal-box" onClick={e=>e.stopPropagation()}>
          <div className="ff" style={{color:"var(--text)",fontWeight:700,fontSize:18,marginBottom:20}}>{editAcc?"✏️ Edit Akun FF":"➕ Tambah Akun FF"}</div>
          <div style={{display:"grid",gap:12}}>
            {[["ID Free Fire","ffId","text","ID akun"],["Nama Ingame","ffName","text","Nickname FF"]].map(([l,k,t,ph])=>(
              <div key={k}><Label>{l}</Label><input className="inp" type={t} placeholder={ph} value={af[k]} onChange={e=>setAf({...af,[k]:e.target.value})} /></div>
            ))}
            <div><Label>Email Login FF 📧</Label><input className="inp" type="email" placeholder="email@gmail.com" value={af.ffEmail||""} onChange={e=>setAf({...af,ffEmail:e.target.value})} /></div>
            <div><Label>Password FF 🔐</Label><input className="inp" type="password" placeholder="Password akun" value={af.ffPw} onChange={e=>setAf({...af,ffPw:e.target.value})} /></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><Label>Level</Label><input className="inp" type="number" placeholder="Level" value={af.lv} onChange={e=>setAf({...af,lv:e.target.value})} /></div>
              <div><Label>Rank</Label>
                <select className="inp" value={af.rank} onChange={e=>setAf({...af,rank:e.target.value})}>
                  {RANKS.map(r=><option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div><Label>Hero (pisah koma)</Label><input className="inp" placeholder="Alok, Chrono, K" value={af.heroes} onChange={e=>setAf({...af,heroes:e.target.value})} /></div>
            <div><Label>Harga (koin/jam)</Label><input className="inp" type="number" placeholder="80" value={af.price} onChange={e=>setAf({...af,price:e.target.value})} /></div>
            <div><Label>Deskripsi</Label><textarea className="inp" placeholder="Keunggulan akun..." value={af.desc} onChange={e=>setAf({...af,desc:e.target.value})} /></div>
            <div style={{display:"flex",gap:10,marginTop:4}}>
              <button className="btn btn-g btn-lg" style={{flex:1}} onClick={saveAcc}>{editAcc?"💾 Simpan":"➕ Tambah"}</button>
              <button className="btn btn-ghost btn-lg" style={{padding:"13px 20px"}} onClick={()=>setModal(null)}>Batal</button>
            </div>
          </div>
        </div>
      </div>
    );

    return null;
  };

  const pageMap={dash:pageDash,topup:pageTopup,wd:pageWd,accs:pageAccs,members:pageMembers,rentals:pageRentals,events:pageEvents,settings:pageSettings};

  return (
    <div style={{background:"var(--bg)",minHeight:"100vh",display:"flex"}}>
      <style>{G}</style>
      <div className="mesh-bg"/>
      <Notif n={notif}/>

      {/* Sidebar */}
      <div style={{width:220,background:"rgba(10,8,16,0.96)",backdropFilter:"blur(20px)",borderRight:"1px solid rgba(255,255,255,0.05)",padding:"20px 12px",display:"flex",flexDirection:"column",position:"fixed",top:0,bottom:0,left:0,zIndex:50,overflowY:"auto"}}>
        <div style={{textAlign:"center",marginBottom:24,padding:"0 6px"}}>
          <div style={{fontSize:30,animation:"float 3s infinite"}}>🛡️</div>
          <div className="ff" style={{fontSize:18,fontWeight:900,color:"var(--g)",letterSpacing:3,marginTop:6}}>ADMIN</div>
          <div style={{color:"var(--muted)",fontSize:10,letterSpacing:1}}>FF RENT PANEL</div>
          <div style={{marginTop:8,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <span className="dot-on"/>
            <span style={{color:"#2dda8a",fontSize:11,fontWeight:600}}>Online</span>
          </div>
        </div>

        {(pendTp.length>0||pendWd.length>0)&&(
          <div className="glass-g" style={{padding:"8px 10px",marginBottom:12,textAlign:"center"}}>
            <div style={{color:"var(--g2)",fontSize:11,fontWeight:700}}>⚠️ {pendTp.length+pendWd.length} pending!</div>
          </div>
        )}

        <div style={{flex:1}}>
          {navItems.map(n=>(
            <button key={n.id} className={`sb-item ${page===n.id?"on":""}`} onClick={()=>setPage(n.id)}>
              <span style={{fontSize:17}}>{n.ic}</span>
              <span>{n.lb}</span>
            </button>
          ))}
        </div>

        <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:12,marginTop:12}}>
          <button className="sb-item" style={{color:"#ff7070"}} onClick={()=>setLogged(false)}>
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{marginLeft:220,flex:1,padding:"24px 28px",minHeight:"100vh",position:"relative",zIndex:1}}>
        <div style={{maxWidth:860}}>
          {(pageMap[page]||pageDash)()}
        </div>
      </div>

      {renderModal()}
    </div>
  );
}
