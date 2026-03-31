import { useState, useEffect, useRef } from "react";
import {
  Menu, X, BookOpen, Users, Award, Globe,
  Mail, Phone, MapPin, ArrowRight, GraduationCap,
  Star, Newspaper, ChevronRight, Shield, Trophy, Heart
} from "lucide-react";

/* ─────────────────────────────────────────
   FONTS & GLOBAL CSS
───────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;500;600;700&display=swap');

    :root {
      --navy:       #0c1f5c;
      --navy-mid:   #1a318a;
      --navy-light: #2748b8;
      --blue-soft:  #dce6fa;
      --gold:       #c8a02a;
      --gold-light: #e8c84a;
      --gold-pale:  #fdf6dc;
      --white:      #ffffff;
      --off-white:  #f5f7fc;
      --charcoal:   #1a1a2e;
      --muted:      #5a607a;
      --border:     rgba(10,31,92,0.1);
    }

    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html { scroll-behavior:smooth; }
    body {
      font-family:'Barlow',sans-serif;
      background:var(--white);
      color:var(--charcoal);
      overflow-x:hidden;
    }
    ::-webkit-scrollbar { width:5px; }
    ::-webkit-scrollbar-track { background:var(--off-white); }
    ::-webkit-scrollbar-thumb { background:var(--navy-mid); border-radius:3px; }

    @keyframes fadeUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
    @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }

    .reveal { opacity:0; transform:translateY(36px); transition:opacity .65s ease, transform .65s ease; }
    .reveal.in { opacity:1; transform:translateY(0); }
    .d1{transition-delay:.10s} .d2{transition-delay:.20s} .d3{transition-delay:.30s} .d4{transition-delay:.40s}

    .navbar {
      position:fixed; top:0; left:0; right:0; z-index:900;
      transition:background .35s, box-shadow .35s;
    }
    .navbar.solid {
      background:rgba(12,31,92,.97);
      backdrop-filter:blur(14px);
      box-shadow:0 2px 24px rgba(0,0,0,.25);
    }

    .nav-a {
      font-family:'Barlow Condensed',sans-serif;
      font-size:.78rem; font-weight:600;
      letter-spacing:.14em; text-transform:uppercase;
      color:rgba(255,255,255,.78); text-decoration:none;
      padding:4px 0; position:relative; transition:color .25s;
    }
    .nav-a::after {
      content:''; position:absolute; bottom:0; left:0;
      width:100%; height:2px; background:var(--gold-light);
      transform:scaleX(0); transform-origin:right;
      transition:transform .28s ease;
    }
    .nav-a:hover { color:var(--gold-light); }
    .nav-a:hover::after { transform:scaleX(1); transform-origin:left; }

    .hero {
      min-height:100vh;
      background:linear-gradient(148deg, var(--navy) 0%, var(--navy-mid) 55%, #1e3fa0 100%);
      position:relative; overflow:hidden;
      display:flex; align-items:center;
    }
    .hero::before {
      content:''; position:absolute; inset:0;
      background-image:
        repeating-linear-gradient(-55deg, transparent 0, transparent 40px, rgba(255,255,255,.018) 40px, rgba(255,255,255,.018) 41px),
        radial-gradient(ellipse at 75% 50%, rgba(200,160,42,.1) 0%, transparent 55%),
        radial-gradient(ellipse at 10% 90%, rgba(39,72,184,.35) 0%, transparent 45%);
    }

    .shimmer-gold {
      background:linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 40%, #fff8dc 55%, var(--gold-light) 70%, var(--gold) 100%);
      background-size:200% auto;
      -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      background-clip:text;
      animation:shimmer 3.5s linear infinite;
    }

    .btn-gold {
      display:inline-flex; align-items:center; gap:8px;
      background:linear-gradient(135deg,var(--gold),#a88020);
      color:var(--navy);
      font-family:'Barlow Condensed',sans-serif;
      font-weight:700; font-size:.78rem; letter-spacing:.12em; text-transform:uppercase;
      padding:13px 26px; border-radius:3px; border:none;
      cursor:pointer; text-decoration:none;
      transition:all .3s; box-shadow:0 4px 18px rgba(200,160,42,.38);
    }
    .btn-gold:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(200,160,42,.55); }

    .btn-ghost {
      display:inline-flex; align-items:center; gap:8px;
      background:transparent; color:rgba(255,255,255,.88);
      font-family:'Barlow Condensed',sans-serif;
      font-weight:600; font-size:.78rem; letter-spacing:.12em; text-transform:uppercase;
      padding:12px 26px; border-radius:3px;
      border:1.5px solid rgba(255,255,255,.3);
      cursor:pointer; text-decoration:none; transition:all .3s;
    }
    .btn-ghost:hover { border-color:var(--gold-light); color:var(--gold-light); background:rgba(200,160,42,.07); }

    .btn-navy {
      display:inline-flex; align-items:center; gap:8px;
      background:linear-gradient(135deg,var(--navy-mid),var(--navy));
      color:#fff;
      font-family:'Barlow Condensed',sans-serif;
      font-weight:700; font-size:.78rem; letter-spacing:.12em; text-transform:uppercase;
      padding:12px 26px; border-radius:3px; border:none;
      cursor:pointer; text-decoration:none;
      transition:all .3s; box-shadow:0 4px 18px rgba(12,31,92,.3);
    }
    .btn-navy:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(12,31,92,.45); }

    .eyebrow {
      font-family:'Barlow Condensed',sans-serif;
      font-size:.7rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase;
      color:var(--gold); display:flex; align-items:center; gap:10px;
    }
    .eyebrow::before { content:''; display:block; width:26px; height:2px; background:var(--gold); }

    .sec-title {
      font-family:'Cormorant Garamond',Georgia,serif;
      font-weight:700; font-size:clamp(1.9rem,4vw,3rem); line-height:1.1; color:var(--navy);
    }
    .sec-title.w { color:#fff; }

    .rule { width:44px; height:3px; background:linear-gradient(90deg,var(--gold),var(--gold-light)); border-radius:2px; }

    .stats-strip { background:var(--navy); }
    .stat-n { font-family:'Cormorant Garamond',serif; font-weight:700; font-size:2.4rem; color:var(--gold); }
    .stat-l { font-family:'Barlow Condensed',sans-serif; font-size:.65rem; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.45); }

    .news-card {
      background:#fff; border-radius:8px; overflow:hidden;
      border:1px solid var(--border);
      transition:transform .32s, box-shadow .32s, border-color .32s; cursor:pointer;
    }
    .news-card:hover { transform:translateY(-6px); box-shadow:0 20px 48px rgba(12,31,92,.12); border-color:rgba(200,160,42,.35); }
    .news-card:hover .nc-inner { transform:scale(1.06); }
    .nc-wrap { overflow:hidden; }
    .nc-inner { transition:transform .5s; }

    .ctag {
      font-family:'Barlow Condensed',sans-serif; font-size:.62rem; font-weight:700;
      letter-spacing:.12em; text-transform:uppercase;
      background:var(--navy); color:#fff;
      padding:3px 10px; border-radius:2px; display:inline-block;
    }
    .ctag.gold { background:var(--gold); color:var(--navy); }

    .lvl-card { border-radius:12px; overflow:hidden; transition:transform .3s, box-shadow .3s; }
    .lvl-card:hover { transform:translateY(-4px); box-shadow:0 24px 60px rgba(0,0,0,.15); }

    .g-item { border-radius:6px; overflow:hidden; position:relative; cursor:pointer; }
    .g-item::after {
      content:''; position:absolute; inset:0;
      background:linear-gradient(to top, rgba(12,31,92,.85) 0%, transparent 55%);
      opacity:0; transition:opacity .3s;
    }
    .g-item:hover::after { opacity:1; }
    .g-item:hover .g-lbl { opacity:1; transform:translateY(0); }
    .g-lbl {
      position:absolute; bottom:14px; left:14px; right:14px; z-index:2;
      opacity:0; transform:translateY(8px); transition:all .3s;
      font-family:'Barlow Condensed',sans-serif; font-size:.8rem; font-weight:600; color:#fff;
    }

    .val-card { border:1.5px solid rgba(255,255,255,.12); border-radius:10px; padding:26px 22px; transition:all .3s; }
    .val-card:hover { border-color:rgba(200,160,42,.45); background:rgba(200,160,42,.07); transform:translateY(-4px); }

    .ticker-wrap { overflow:hidden; background:var(--gold); padding:10px 0; }
    .ticker-inner { display:flex; gap:60px; width:max-content; animation:marquee 22s linear infinite; }
    .ticker-item {
      font-family:'Barlow Condensed',sans-serif; font-size:.72rem; font-weight:700;
      letter-spacing:.15em; text-transform:uppercase; color:var(--navy); white-space:nowrap;
      display:flex; align-items:center; gap:18px;
    }
    .tdot { width:5px; height:5px; border-radius:50%; background:var(--navy); opacity:.35; }

    .scroll-pill {
      width:26px; height:42px; border:2px solid rgba(255,255,255,.35); border-radius:13px;
      display:flex; justify-content:center; padding-top:6px;
    }
    .scroll-pill::before {
      content:''; width:3px; height:7px; background:var(--gold); border-radius:2px;
      animation:float 1.8s ease-in-out infinite;
    }

    .mob-overlay {
      position:fixed; inset:0; z-index:899;
      background:rgba(12,31,92,.98); backdrop-filter:blur(12px);
      display:flex; flex-direction:column; align-items:center; justify-content:center; gap:28px;
      transition:opacity .3s, transform .3s;
    }
    .mob-overlay.off { opacity:0; transform:translateX(-100%); pointer-events:none; }
    .mob-a {
      font-family:'Cormorant Garamond',serif; font-size:2.1rem; font-weight:600;
      color:rgba(255,255,255,.88); text-decoration:none; transition:color .25s;
    }
    .mob-a:hover { color:var(--gold-light); }

    .f-input {
      width:100%; padding:11px 14px; border:1.5px solid var(--border); border-radius:5px;
      font-family:'Barlow',sans-serif; font-size:.875rem; color:var(--charcoal);
      outline:none; background:var(--off-white); transition:border-color .2s;
    }
    .f-input:focus { border-color:var(--navy-mid); background:#fff; }
    .f-lbl {
      font-family:'Barlow Condensed',sans-serif; font-size:.65rem; font-weight:700;
      letter-spacing:.12em; text-transform:uppercase; color:var(--muted); display:block; margin-bottom:5px;
    }

    .footer { background:var(--navy); }
    .ft { font-family:'Barlow Condensed',sans-serif; font-size:.85rem; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#fff; margin-bottom:14px; }
    .fl { font-size:.8rem; color:rgba(255,255,255,.5); text-decoration:none; display:block; margin-bottom:8px; transition:color .2s; }
    .fl:hover { color:var(--gold-light); }

    @media (max-width:768px) { .sm-hide{display:none!important} }
    @media (min-width:769px) { .lg-hide{display:none!important} }
    @media (max-width:640px) {
      .hero-grid { grid-template-columns:1fr!important; }
      .about-grid { grid-template-columns:1fr!important; }
      .contact-grid { grid-template-columns:1fr!important; }
      .footer-grid { grid-template-columns:1fr 1fr!important; }
      .stats-grid { grid-template-columns:1fr 1fr!important; }
    }
  `}</style>
);

/* ── DATA ── */
const NAV_ITEMS = [
  { l:"Home",     h:"#home" },
  { l:"About",    h:"#about" },
  { l:"Programs", h:"#programs" },
  { l:"News",     h:"#news" },
  { l:"Gallery",  h:"#gallery" },
  { l:"Contact",  h:"#contact" },
];

const STATS = [
  { n:"1946",   l:"Year Founded" },
  { n:"1,200+", l:"Students" },
  { n:"60+",    l:"Educators" },
  { n:"10K+",   l:"Alumni Worldwide" },
];

const TICKER = ["2026 WASSCE Prep Underway","Annual Science Fair March 2026","New Computer Lab Open","Alumni Reunion July 2026","Grade 12 Graduation June 2026","Sports Championship Finals"];

const VALUES = [
  { icon:BookOpen, t:"Academic Excellence",  d:"WASSCE-aligned curricula preparing every student for higher education and national success." },
  { icon:Heart,    t:"Christian Heritage",   d:"Rooted in United Methodist tradition — faith, integrity, and servant leadership since 1946." },
  { icon:Users,    t:"Community & Family",   d:"A school that knows your name — staff, parents, and students united in shared purpose." },
  { icon:Globe,    t:"Global Vision",        d:"Equipping Liberian youth to lead confidently on the continental and world stage." },
];

const NEWS_ITEMS = [
  { tag:"Achievement", gold:false, date:"March 2026", title:"JLM Senior Places 1st in Montserrado County Science Competition",           excerpt:"Grade 11 student Emmanuel Jallah swept all categories, earning a berth in the national science exhibition." },
  { tag:"Event",       gold:true,  date:"March 2026", title:"Junior High Cultural Day Celebrates Liberia's Vibrant Heritage",            excerpt:"Grades 7–9 students dazzled staff and parents with traditional dance, drama, and storytelling from across Liberia." },
  { tag:"Scholarship", gold:false, date:"Feb 2026",   title:"Class of 2025 Alumna Awarded Full University Scholarship",                   excerpt:"Comfort Kollie has received a fully funded scholarship to study Medicine — a proud moment for the entire JLM family." },
];

const GALLERY_ITEMS = [
  { l:"Graduation Ceremony 2025",   bg:"linear-gradient(135deg,#0c1f5c,#1a318a)", h:260 },
  { l:"Science Fair — Senior High", bg:"linear-gradient(135deg,#1a318a,#2748b8)", h:140 },
  { l:"Cultural Day — Junior High", bg:"linear-gradient(135deg,#7a5c00,#c8a02a)", h:140 },
  { l:"Football Championship",      bg:"linear-gradient(135deg,#0c1f5c,#2748b8)", h:200 },
  { l:"Chapel Service",             bg:"linear-gradient(135deg,#1a318a,#0c1f5c)", h:200 },
  { l:"Library & Study Hall",       bg:"linear-gradient(135deg,#2748b8,#1a318a)", h:140 },
];

/* ── COUNTER ── */
function useCount(target, go) {
  const [v, setV] = useState("–");
  useEffect(() => {
    if (!go) return;
    const raw = parseInt(target.replace(/\D/g,""));
    const sfx = target.replace(/[0-9]/g,"");
    if (isNaN(raw)) { setV(target); return; }
    let cur = 0; const step = raw / (1800/16);
    const t = setInterval(() => {
      cur += step;
      if (cur >= raw) { setV(raw+sfx); clearInterval(t); }
      else setV(Math.floor(cur)+sfx);
    }, 16);
    return () => clearInterval(t);
  }, [go]);
  return v;
}

function StatCell({ n, l, go }) {
  const v = useCount(n, go);
  return (
    <div style={{ textAlign:"center", padding:"28px 10px" }}>
      <div className="stat-n">{v}</div>
      <div className="stat-l" style={{ marginTop:4 }}>{l}</div>
    </div>
  );
}

/* ── MAIN ── */
export default function JLMSite() {
  const [solid,     setSolid]     = useState(false);
  const [menu,      setMenu]      = useState(false);
  const [statsGo,   setStatsGo]   = useState(false);
  const statsRef = useRef(null);

  useEffect(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);

  useEffect(() => {
    const fn = () => setSolid(window.scrollY > 55);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add("in"); }), { threshold:.08 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsGo(true); }, { threshold:.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const scrollTo = (h) => {
    setMenu(false);
    setTimeout(() => document.querySelector(h)?.scrollIntoView({ behavior:"smooth" }), menu ? 300 : 0);
  };

  return (
    <div>
      <Styles />

      {/* ── Mobile overlay ── */}
      <div className={`mob-overlay lg-hide ${menu ? "" : "off"}`}>
        <button onClick={() => setMenu(false)} style={{ position:"absolute",top:22,right:22,background:"none",border:"none",color:"#fff",cursor:"pointer" }}><X size={28}/></button>
        {NAV_ITEMS.map(l => <a key={l.l} className="mob-a" href={l.h} onClick={e => { e.preventDefault(); scrollTo(l.h); }}>{l.l}</a>)}
        <a className="btn-gold" href="#contact" onClick={e => { e.preventDefault(); scrollTo("#contact"); }} style={{ marginTop:8 }}>Apply Now <ArrowRight size={14}/></a>
      </div>

      {/* ── Navbar ── */}
      <nav className={`navbar${solid ? " solid" : ""}`} style={{ padding:"0 5vw" }}>
        <div style={{ maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:70 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,cursor:"pointer" }} onClick={() => scrollTo("#home")}>
            <div style={{ width:42,height:42,borderRadius:"50%",background:"linear-gradient(135deg,var(--gold),#a88020)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <GraduationCap size={20} color="#0c1f5c"/>
            </div>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:".88rem",color:"#fff",lineHeight:1.15 }}>JLM Memorial</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".58rem",letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.42)" }}>United Methodist High School · Liberia</div>
            </div>
          </div>

          <div className="sm-hide" style={{ display:"flex",alignItems:"center",gap:30 }}>
            {NAV_ITEMS.map(l => <a key={l.l} className="nav-a" href={l.h} onClick={e => { e.preventDefault(); scrollTo(l.h); }}>{l.l}</a>)}
          </div>

          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <a className="btn-gold sm-hide" href="#contact" onClick={e => { e.preventDefault(); scrollTo("#contact"); }} style={{ padding:"9px 20px",fontSize:".72rem" }}>Apply Now <ArrowRight size={13}/></a>
            <button className="lg-hide" onClick={() => setMenu(true)} style={{ background:"none",border:"none",color:"#fff",cursor:"pointer",padding:4 }}><Menu size={26}/></button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="home" className="hero">
        {/* Decorative rings */}
        <div style={{ position:"absolute",top:"-14%",right:"-7%",width:480,height:480,borderRadius:"50%",border:"1px solid rgba(255,255,255,.04)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",top:"-4%",right:"-2%",width:280,height:280,borderRadius:"50%",border:"1px solid rgba(200,160,42,.07)",pointerEvents:"none" }} />
        <div style={{ position:"absolute",bottom:"8%",left:"-8%",width:340,height:340,borderRadius:"50%",background:"radial-gradient(circle,rgba(39,72,184,.25),transparent 70%)",pointerEvents:"none" }} />

        <div style={{ maxWidth:1200,margin:"0 auto",padding:"0 5vw",width:"100%",paddingTop:88 }}>
          <div className="hero-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"center" }}>

            {/* Left */}
            <div>
              <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(200,160,42,.12)",border:"1px solid rgba(200,160,42,.28)",borderRadius:100,padding:"5px 14px",marginBottom:22,animation:"fadeIn 1s ease both" }}>
                <Star size={11} fill="var(--gold)" color="var(--gold)"/>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".66rem",fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:"var(--gold-light)" }}>Founded 1946 · Monrovia, Liberia</span>
              </div>

              <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"clamp(2.5rem,5.5vw,5rem)",lineHeight:1.04,color:"#fff",marginBottom:20,animation:"fadeUp 1s .2s ease both" }}>
                John Lewis Morris<br/>Memorial <span className="shimmer-gold">UMC</span><br/>High School
              </h1>

              <p style={{ fontFamily:"'Barlow',sans-serif",fontSize:"clamp(.92rem,1.5vw,1.08rem)",color:"rgba(255,255,255,.62)",lineHeight:1.78,maxWidth:450,marginBottom:34,fontStyle:"italic",animation:"fadeUp 1s .4s ease both" }}>
                "Educating minds, shaping futures, building a stronger Liberia — one student at a time."
              </p>

              <div style={{ display:"flex",gap:14,flexWrap:"wrap",animation:"fadeUp 1s .55s ease both" }}>
                <a className="btn-gold" href="#about" onClick={e => { e.preventDefault(); scrollTo("#about"); }}>Our Story <ArrowRight size={15}/></a>
                <a className="btn-ghost" href="#programs" onClick={e => { e.preventDefault(); scrollTo("#programs"); }}>View Programs</a>
              </div>

              <div style={{ display:"flex",alignItems:"center",gap:16,marginTop:50,animation:"fadeUp 1s .7s ease both" }}>
                <div className="scroll-pill"/>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".6rem",letterSpacing:".18em",textTransform:"uppercase",color:"rgba(255,255,255,.32)" }}>Scroll to explore</span>
              </div>
            </div>

            {/* Right — info card */}
            <div className="sm-hide" style={{ display:"flex",justifyContent:"center" }}>
              <div style={{ position:"relative",width:340 }}>
                <div style={{ background:"rgba(255,255,255,.06)",backdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,.12)",borderRadius:14,padding:"28px 24px",animation:"fadeUp 1s .5s ease both" }}>

                  {/* Senior High — Blue & White */}
                  <div style={{ background:"linear-gradient(90deg,var(--navy),var(--navy-mid))",borderRadius:8,padding:"12px 16px",marginBottom:12,border:"1px solid rgba(255,255,255,.14)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".58rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.48)",marginBottom:2 }}>Senior High · Grades 10–12</div>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:".95rem",color:"#fff" }}>Colors: Blue & White</div>
                    </div>
                    <div style={{ display:"flex",gap:5 }}>
                      <div style={{ width:13,height:13,borderRadius:"50%",background:"var(--navy-light)",border:"2px solid rgba(255,255,255,.3)" }}/>
                      <div style={{ width:13,height:13,borderRadius:"50%",background:"#fff",border:"2px solid rgba(255,255,255,.5)" }}/>
                    </div>
                  </div>

                  {/* Junior High — Gold & Blue */}
                  <div style={{ background:"linear-gradient(90deg,#7a5c00,#a88020)",borderRadius:8,padding:"12px 16px",marginBottom:20,border:"1px solid rgba(200,160,42,.25)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".58rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(255,255,255,.52)",marginBottom:2 }}>Junior High & Below · Grades 7–9</div>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:".95rem",color:"#fff" }}>Colors: Gold & Blue</div>
                    </div>
                    <div style={{ display:"flex",gap:5 }}>
                      <div style={{ width:13,height:13,borderRadius:"50%",background:"var(--gold-light)",border:"2px solid rgba(255,255,255,.4)" }}/>
                      <div style={{ width:13,height:13,borderRadius:"50%",background:"var(--navy-light)",border:"2px solid rgba(255,255,255,.25)" }}/>
                    </div>
                  </div>

                  {[
                    { icon:Award,    t:"Top-ranked in Montserrado County" },
                    { icon:BookOpen, t:"WASSCE-certified curriculum" },
                    { icon:Shield,   t:"United Methodist mission school" },
                    { icon:Globe,    t:"Alumni across 30+ countries" },
                  ].map(({ icon:Icon, t }, i) => (
                    <div key={i} style={{ display:"flex",alignItems:"center",gap:10,marginBottom:11 }}>
                      <div style={{ width:29,height:29,borderRadius:6,background:"rgba(200,160,42,.14)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                        <Icon size={13} color="var(--gold-light)"/>
                      </div>
                      <span style={{ fontSize:".79rem",color:"rgba(255,255,255,.74)",fontFamily:"'Barlow',sans-serif" }}>{t}</span>
                    </div>
                  ))}
                </div>

                {/* Floating badge */}
                <div style={{ position:"absolute",bottom:-18,right:-18,background:"linear-gradient(135deg,var(--gold),#a88020)",borderRadius:10,padding:"11px 16px",animation:"float 3s ease-in-out infinite",boxShadow:"0 8px 28px rgba(200,160,42,.4)" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"1.5rem",color:"var(--navy)" }}>80</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".52rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--navy)",opacity:.7 }}>Yrs Strong</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...TICKER,...TICKER].map((item,i) => (
            <div key={i} className="ticker-item"><div className="tdot"/>{item}</div>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-strip" ref={statsRef}>
        <div className="stats-grid" style={{ maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderLeft:"1px solid rgba(255,255,255,.05)" }}>
          {STATS.map((s,i) => (
            <div key={i} style={{ borderRight:"1px solid rgba(255,255,255,.05)" }}>
              <StatCell n={s.n} l={s.l} go={statsGo}/>
            </div>
          ))}
        </div>
      </div>

      {/* ── About ── */}
      <section id="about" style={{ padding:"92px 5vw",background:"var(--off-white)" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div className="about-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:68,alignItems:"center",marginBottom:72 }}>
            {/* Visual block */}
            <div className="reveal">
              <div style={{ background:"linear-gradient(150deg,var(--navy),var(--navy-mid))",borderRadius:12,padding:42,position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:-10,right:-10,fontFamily:"'Cormorant Garamond',serif",fontSize:"8.5rem",fontWeight:700,color:"rgba(255,255,255,.04)",lineHeight:1,userSelect:"none",pointerEvents:"none" }}>✝</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",fontStyle:"italic",color:"rgba(255,255,255,.82)",lineHeight:1.82,position:"relative" }}>
                  "Train up a child in the way he should go, and when he is old he will not depart from it."
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".65rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"var(--gold)",marginTop:14 }}>— Proverbs 22:6</div>
                </div>
                <div style={{ marginTop:34,display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,position:"relative" }}>
                  {[{l:"Founded",v:"1946"},{l:"Denomination",v:"UMC"},{l:"County",v:"Montserrado"},{l:"Grades",v:"7–12"}].map(({l,v}) => (
                    <div key={l} style={{ background:"rgba(255,255,255,.07)",borderRadius:7,padding:"14px 12px" }}>
                      <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"1.1rem",color:"var(--gold)" }}>{v}</div>
                      <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".58rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(255,255,255,.42)",marginTop:2 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="reveal d1">
              <div className="eyebrow" style={{ marginBottom:14 }}>Our Legacy</div>
              <h2 className="sec-title" style={{ marginBottom:14 }}>A Pillar of Learning in Monrovia Since 1946</h2>
              <div className="rule" style={{ marginBottom:24 }}/>
              <p style={{ lineHeight:1.88,color:"var(--muted)",marginBottom:16,fontSize:".92rem" }}>
                Founded under the United Methodist Mission, John Lewis Morris Memorial High School has served Liberia for nearly eight decades — surviving civil war, economic hardship, and national transformation, never wavering in its commitment to excellence.
              </p>
              <p style={{ lineHeight:1.88,color:"var(--muted)",marginBottom:32,fontSize:".92rem" }}>
                Our graduates lead in government, medicine, law, engineering, and business across Liberia and the world. Their success is our greatest testimony.
              </p>
              <a className="btn-navy" href="#programs" onClick={e => { e.preventDefault(); scrollTo("#programs"); }}>
                Explore Programs <ArrowRight size={15}/>
              </a>
            </div>
          </div>

          {/* Values */}
          <div style={{ textAlign:"center",marginBottom:42 }}>
            <div className="eyebrow reveal" style={{ justifyContent:"center",marginBottom:12 }}>Core Values</div>
            <h2 className="sec-title reveal d1" style={{ fontSize:"clamp(1.7rem,3vw,2.4rem)" }}>What We Stand For</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16 }}>
            {VALUES.map(({ icon:Icon,t,d },i) => (
              <div key={i} className={`val-card reveal d${i+1}`} style={{ background:"linear-gradient(140deg,var(--navy),var(--navy-mid))" }}>
                <div style={{ width:40,height:40,borderRadius:8,background:"rgba(200,160,42,.14)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14 }}>
                  <Icon size={19} color="var(--gold)"/>
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:600,fontSize:"1.02rem",color:"#fff",marginBottom:8 }}>{t}</div>
                <div style={{ fontSize:".79rem",lineHeight:1.76,color:"rgba(255,255,255,.56)" }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs ── */}
      <section id="programs" style={{ padding:"92px 5vw",background:"#fff" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:50 }}>
            <div className="eyebrow reveal" style={{ justifyContent:"center",marginBottom:12 }}>Academic Programs</div>
            <h2 className="sec-title reveal d1">Two Levels, One Mission</h2>
            <p className="reveal d2" style={{ marginTop:12,color:"var(--muted)",fontSize:".9rem",maxWidth:500,margin:"12px auto 0" }}>
              Each level carries its own identity and colors — united by a shared commitment to excellence.
            </p>
          </div>

          {/* ─ Senior High: Blue & White ─ */}
          <div className="lvl-card reveal" style={{ background:"linear-gradient(145deg,var(--navy),var(--navy-mid))",marginBottom:20 }}>
            <div style={{ padding:"38px 40px" }}>
              <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:28 }}>
                <div style={{ flex:1,minWidth:240 }}>
                  {/* Color chips */}
                  <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.18)",borderRadius:100,padding:"4px 14px",marginBottom:18 }}>
                    <div style={{ display:"flex",gap:5 }}>
                      <div style={{ width:11,height:11,borderRadius:"50%",background:"var(--navy-light)",border:"2px solid rgba(255,255,255,.4)" }}/>
                      <div style={{ width:11,height:11,borderRadius:"50%",background:"#fff",border:"2px solid rgba(255,255,255,.6)" }}/>
                    </div>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".62rem",fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",color:"rgba(255,255,255,.68)" }}>School Colors: Blue & White</span>
                  </div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"1.95rem",color:"#fff",marginBottom:8 }}>Senior High School</h3>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".65rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(255,255,255,.42)",marginBottom:14 }}>Grades 10 – 12</div>
                  <p style={{ fontSize:".84rem",lineHeight:1.82,color:"rgba(255,255,255,.66)",maxWidth:400 }}>
                    Intense preparation for WASSCE, university entrance, and career readiness. Students wear Blue and White — representing loyalty, clarity, and ambition.
                  </p>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,flex:1,minWidth:220 }}>
                  {["Mathematics","English Language","Biology","Chemistry","Physics","Computer Science"].map(s => (
                    <div key={s} style={{ background:"rgba(255,255,255,.07)",borderRadius:7,padding:"9px 13px",fontSize:".78rem",color:"rgba(255,255,255,.78)",fontFamily:"'Barlow',sans-serif",display:"flex",alignItems:"center",gap:7 }}>
                      <ChevronRight size={11} color="rgba(255,255,255,.3)"/> {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─ Junior High: Gold & Blue ─ */}
          <div className="lvl-card reveal d2" style={{ background:"linear-gradient(145deg,#6a4f00,#a88020)" }}>
            <div style={{ padding:"38px 40px" }}>
              <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:28 }}>
                <div style={{ flex:1,minWidth:240 }}>
                  <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:100,padding:"4px 14px",marginBottom:18 }}>
                    <div style={{ display:"flex",gap:5 }}>
                      <div style={{ width:11,height:11,borderRadius:"50%",background:"var(--gold-light)",border:"2px solid rgba(255,255,255,.5)" }}/>
                      <div style={{ width:11,height:11,borderRadius:"50%",background:"var(--navy-light)",border:"2px solid rgba(255,255,255,.3)" }}/>
                    </div>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".62rem",fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",color:"rgba(255,255,255,.68)" }}>School Colors: Gold & Blue</span>
                  </div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"1.95rem",color:"#fff",marginBottom:8 }}>Junior High & Elementary</h3>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".65rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(255,255,255,.48)",marginBottom:14 }}>Grades 7 – 9</div>
                  <p style={{ fontSize:".84rem",lineHeight:1.82,color:"rgba(255,255,255,.68)",maxWidth:400 }}>
                    Building foundational skills, values, and curiosity that will carry students forward. Gold and Blue represent achievement, excellence, and Liberian pride.
                  </p>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,flex:1,minWidth:220 }}>
                  {["English Language","Mathematics","Social Studies","Integrated Science","Visual Arts","French Language"].map(s => (
                    <div key={s} style={{ background:"rgba(255,255,255,.1)",borderRadius:7,padding:"9px 13px",fontSize:".78rem",color:"rgba(255,255,255,.8)",fontFamily:"'Barlow',sans-serif",display:"flex",alignItems:"center",gap:7 }}>
                      <ChevronRight size={11} color="rgba(255,255,255,.38)"/> {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── News ── */}
      <section id="news" style={{ padding:"92px 5vw",background:"var(--off-white)" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:46,flexWrap:"wrap",gap:14 }}>
            <div>
              <div className="eyebrow reveal" style={{ marginBottom:12 }}>Stay Informed</div>
              <h2 className="sec-title reveal d1">Latest News & Events</h2>
            </div>
            <a href="#" style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".72rem",fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--navy-mid)",textDecoration:"none",display:"flex",alignItems:"center",gap:5 }}>
              All News <ArrowRight size={13}/>
            </a>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:20 }}>
            {NEWS_ITEMS.map(({ tag,gold,date,title,excerpt },i) => (
              <div key={i} className={`news-card reveal d${i+1}`}>
                <div className="nc-wrap" style={{ height:148 }}>
                  <div className="nc-inner" style={{ height:"100%",background:gold?"linear-gradient(135deg,#6a4f00,#a88020)":"linear-gradient(135deg,var(--navy),var(--navy-mid))",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <Newspaper size={34} color="rgba(255,255,255,.15)"/>
                  </div>
                </div>
                <div style={{ padding:"18px 20px" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:9,marginBottom:12 }}>
                    <span className={`ctag${gold?" gold":""}`}>{tag}</span>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".6rem",fontWeight:600,color:"var(--muted)" }}>{date}</span>
                  </div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"1.02rem",lineHeight:1.42,color:"var(--navy)",marginBottom:10 }}>{title}</h3>
                  <p style={{ fontSize:".78rem",lineHeight:1.8,color:"var(--muted)" }}>{excerpt}</p>
                  <div style={{ marginTop:14,display:"flex",alignItems:"center",gap:5,fontFamily:"'Barlow Condensed',sans-serif",fontSize:".66rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"var(--navy-mid)",cursor:"pointer" }}>
                    Read More <ArrowRight size={11}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section id="gallery" style={{ padding:"92px 5vw",background:"var(--navy)" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:46 }}>
            <div className="eyebrow reveal" style={{ justifyContent:"center",color:"rgba(200,160,42,.75)",marginBottom:12 }}>School Life</div>
            <h2 className="sec-title w reveal d1">A Glimpse of Our World</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
            {GALLERY_ITEMS.map(({l,bg,h},i) => (
              <div key={i} className={`g-item reveal d${(i%4)+1}`} style={{ height:h }}>
                <div style={{ background:bg,height:"100%",display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .5s" }}>
                  <Trophy size={26} color="rgba(255,255,255,.12)"/>
                </div>
                <div className="g-lbl">{l}</div>
              </div>
            ))}
          </div>
          <p style={{ textAlign:"center",marginTop:26,fontFamily:"'Barlow',sans-serif",fontStyle:"italic",fontSize:".78rem",color:"rgba(255,255,255,.28)" }}>
            Gallery placeholders — replace with real school photos
          </p>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={{ padding:"92px 5vw",background:"#fff" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div className="contact-grid" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:56,alignItems:"start" }}>
            <div className="reveal">
              <div className="eyebrow" style={{ marginBottom:14 }}>Get In Touch</div>
              <h2 className="sec-title" style={{ marginBottom:14,fontSize:"clamp(1.7rem,3vw,2.5rem)" }}>We'd Love to Hear From You</h2>
              <div className="rule" style={{ marginBottom:24 }}/>
              <p style={{ lineHeight:1.9,color:"var(--muted)",marginBottom:32,fontSize:".9rem" }}>
                Whether you're a prospective student, a parent, an alumnus, or a partner — the JLM family is always open to you.
              </p>
              {[
                { icon:MapPin, l:"Address", v:"Sinkor, Monrovia, Liberia" },
                { icon:Phone,  l:"Phone",   v:"+231 (0) XXX-XXXX" },
                { icon:Mail,   l:"Email",   v:"info@jlmmemorial.edu.lr" },
              ].map(({ icon:Icon,l,v }) => (
                <div key={l} style={{ display:"flex",gap:14,marginBottom:18,alignItems:"flex-start" }}>
                  <div style={{ width:38,height:38,borderRadius:8,background:"var(--navy)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <Icon size={15} color="var(--gold)"/>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontSize:".6rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"var(--muted)",marginBottom:2 }}>{l}</div>
                    <div style={{ fontFamily:"'Barlow',sans-serif",color:"var(--charcoal)",fontSize:".88rem" }}>{v}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="reveal d2" style={{ background:"var(--off-white)",borderRadius:12,padding:32,border:"1px solid var(--border)" }}>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"1.25rem",color:"var(--navy)",marginBottom:22 }}>Send a Message</h3>
              {[{l:"Full Name",p:"Your full name",t:"text"},{l:"Email Address",p:"your@email.com",t:"email"},{l:"Subject",p:"How can we help?",t:"text"}].map(({l,p,t}) => (
                <div key={l} style={{ marginBottom:14 }}>
                  <label className="f-lbl">{l}</label>
                  <input className="f-input" type={t} placeholder={p}/>
                </div>
              ))}
              <div style={{ marginBottom:20 }}>
                <label className="f-lbl">Message</label>
                <textarea className="f-input" placeholder="Write your message…" rows={4} style={{ resize:"vertical" }}/>
              </div>
              <button className="btn-navy" style={{ width:"100%",justifyContent:"center" }}>
                Send Message <ArrowRight size={15}/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer" style={{ padding:"52px 5vw 26px" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div className="footer-grid" style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:32,marginBottom:40 }}>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:14 }}>
                <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,var(--gold),#a88020)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <GraduationCap size={16} color="var(--navy)"/>
                </div>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:".85rem",color:"#fff" }}>JLM Memorial HS</span>
              </div>
              <p style={{ fontSize:".78rem",lineHeight:1.82,color:"rgba(255,255,255,.42)",maxWidth:260 }}>
                United in faith. United in excellence. Educating Liberia's next generation since 1946.
              </p>
              <div style={{ marginTop:16,display:"flex",gap:8 }}>
                {["f","t","in","yt"].map(s => (
                  <div key={s} style={{ width:28,height:28,background:"rgba(255,255,255,.07)",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:".65rem",fontWeight:700,color:"rgba(255,255,255,.46)",transition:"background .2s" }}
                    onMouseEnter={e => e.currentTarget.style.background="rgba(200,160,42,.2)"}
                    onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,.07)"}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="ft">Navigation</div>
              {["Home","About Us","Programs","News","Gallery","Contact"].map(l => <a key={l} href="#" className="fl">{l}</a>)}
            </div>
            <div>
              <div className="ft">Programs</div>
              {["Senior High (10–12)","Junior High (7–9)","Sciences","Government","Arts","Sports"].map(l => <a key={l} href="#" className="fl">{l}</a>)}
            </div>
            <div>
              <div className="ft">Contact</div>
              <div style={{ fontSize:".78rem",color:"rgba(255,255,255,.46)",lineHeight:2.1 }}>
                <div>📍 Weaver Avenue Street Paynesville City<br/> Montserrado County, Liberia</div>
                <div>📞 +231 (0) XXX-XXXX</div>
                <div>✉️ info@jlmmemorial.edu.lr</div>
              </div>
            </div>
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
            <div style={{ fontSize:".73rem",color:"rgb(255, 255, 255)",fontFamily:"'Barlow',sans-serif" }}>
              © {new Date().getFullYear()} John Lewis Morris Memorial UMS · All rights reserved
            </div>
            <div style={{ fontSize:".7rem",color:"rgba(207, 197, 197, 0.53)",fontFamily:"'Barlow',sans-serif",fontStyle:"italic" }}>
              Designed & Developed by Samuel B. Gaye
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
