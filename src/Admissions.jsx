import { useState } from "react";
import emailjs from "@emailjs/browser";
import {
  ArrowLeft, ArrowRight, User, Users, School,
  FileText, CheckCircle, MapPin, Mail, Star, ChevronRight
} from "lucide-react";

/* ── Styles ── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@400;500;600;700&display=swap');
    :root {
      --navy:#0c1f5c; --navy-mid:#1a318a; --navy-light:#2748b8;
      --gold:#c8a02a; --gold-light:#e8c84a; --gold-pale:#fdf6dc;
      --white:#ffffff; --off-white:#f5f7fc; --charcoal:#1a1a2e;
      --muted:#5a607a; --border:rgba(10,31,92,0.1);
    }
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html { scroll-behavior:smooth; }
    body { font-family:'Barlow',sans-serif; background:var(--off-white); color:var(--charcoal); }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

    .f-input {
      width:100%; padding:11px 14px; border:1.5px solid var(--border);
      border-radius:5px; font-family:'Barlow',sans-serif; font-size:.875rem;
      color:var(--charcoal); outline:none; background:#fff; transition:border-color .2s;
    }
    .f-input:focus { border-color:var(--navy-mid); }
    .f-lbl {
      font-family:'Barlow Condensed',sans-serif; font-size:.65rem; font-weight:700;
      letter-spacing:.12em; text-transform:uppercase; color:var(--muted);
      display:block; margin-bottom:5px;
    }
    .eyebrow {
      font-family:'Barlow Condensed',sans-serif; font-size:.7rem; font-weight:700;
      letter-spacing:.22em; text-transform:uppercase; color:var(--gold);
      display:flex; align-items:center; gap:10px;
    }
    .eyebrow::before { content:''; display:block; width:26px; height:2px; background:var(--gold); }
    .btn-gold {
      display:inline-flex; align-items:center; gap:8px;
      background:linear-gradient(135deg,var(--gold),#a88020); color:var(--navy);
      font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:.78rem;
      letter-spacing:.12em; text-transform:uppercase; padding:13px 26px;
      border-radius:3px; border:none; cursor:pointer; text-decoration:none;
      transition:all .3s; box-shadow:0 4px 18px rgba(200,160,42,.38);
    }
    .btn-gold:hover { transform:translateY(-2px); }
    .btn-gold:disabled { opacity:.6; cursor:not-allowed; transform:none; }
    .btn-navy {
      display:inline-flex; align-items:center; gap:8px;
      background:linear-gradient(135deg,var(--navy-mid),var(--navy)); color:#fff;
      font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:.78rem;
      letter-spacing:.12em; text-transform:uppercase; padding:12px 26px;
      border-radius:3px; border:none; cursor:pointer; transition:all .3s;
    }
    .btn-navy:hover { transform:translateY(-2px); }
    .btn-outline {
      display:inline-flex; align-items:center; gap:8px;
      background:transparent; color:var(--navy);
      font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:.78rem;
      letter-spacing:.12em; text-transform:uppercase; padding:12px 26px;
      border-radius:3px; border:1.5px solid var(--navy); cursor:pointer; transition:all .3s;
    }
    .btn-outline:hover { background:var(--navy); color:#fff; }
    .step-item { flex:1; padding:16px 10px; display:flex; align-items:center; gap:9; transition:border-color .3s; }
    @media(max-width:640px) {
      .form-grid { grid-template-columns:1fr!important; }
      .step-label { display:none; }
    }
  `}</style>
);

/* ── Data ── */
const STEPS = [
  { n:1, l:"Student Info",    Icon:User },
  { n:2, l:"Parent/Guardian", Icon:Users },
  { n:3, l:"School History",  Icon:School },
  { n:4, l:"Documents",       Icon:FileText },
];

const GRADES = [
  "KI","KII",
  "Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6",
  "Grade 7","Grade 8","Grade 9",
  "Grade 10","Grade 11","Grade 12"
];

const DOCS = [
  "Passport-size photograph (2 recent copies)",
  "Last school report card / grade card",
  "Official transcript from previous school",
  "Recommendation letter from previous school",
  "Transfer letter from previous school principal",
];

/* ── Component ── */
export default function Admissions() {
  const [step,      setStep]      = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const [form, setForm] = useState({
    student_name:"", student_dob:"", student_gender:"", student_nationality:"Liberian",
    grade_applying:"",
    parent_name:"", parent_relationship:"", parent_phone:"", parent_email:"",
    prev_school:"", last_grade_completed:"", reason_leaving:"",
    additional_info:"",
  });

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const next = () => setStep(s => Math.min(s + 1, 4));
  const back = () => setStep(s => Math.max(s - 1, 1));

  const submit = e => {
    e.preventDefault();
    setLoading(true);
    emailjs.send("service_4mkotvj", "template_vazlyma", {
        user_name:  form.parent_name,
        user_email: form.parent_email,
        subject:    `Admission Application — ${form.student_name} — ${form.grade_applying}`,
        message:
    `STUDENT INFORMATION
    ───────────────────
    Full Name:          ${form.student_name}
    Date of Birth:      ${form.student_dob}
    Gender:             ${form.student_gender}
    Nationality:        ${form.student_nationality}
    Grade Applying For: ${form.grade_applying}

    PARENT / GUARDIAN
    ───────────────────
    Name:               ${form.parent_name}
    Relationship:       ${form.parent_relationship}
    Phone:              ${form.parent_phone}
    Email:              ${form.parent_email}

    SCHOOL HISTORY
    ───────────────────
    Previous School:    ${form.prev_school}
    Last Grade:         ${form.last_grade_completed}
    Reason for Leaving: ${form.reason_leaving}

    ADDITIONAL INFO
    ───────────────────
    ${form.additional_info || "None provided"}`
    }, "I7qLc7gVyKx1hh22j")
    .then(() => { setLoading(false); setSubmitted(true); })
    .catch(err => { setLoading(false); console.error(err); alert("Submission failed. Please try again."); });
    };


  /* ── Success Screen ── */
  if (submitted) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(148deg,var(--navy),var(--navy-mid))", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 5vw" }}>
      <Styles/>
      <div style={{ textAlign:"center", maxWidth:520, animation:"fadeUp .6s ease both" }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:"rgba(200,160,42,.15)", border:"2px solid var(--gold)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px" }}>
          <CheckCircle size={34} color="var(--gold)"/>
        </div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:"2.2rem", color:"#fff", marginBottom:14 }}>Application Submitted!</h2>
        <p style={{ color:"rgba(255,255,255,.65)", lineHeight:1.88, marginBottom:10, fontSize:".92rem" }}>
          Thank you, <strong style={{ color:"var(--gold-light)" }}>{form.student_name}</strong>.
          Your application for <strong style={{ color:"var(--gold-light)" }}>{form.grade_applying}</strong> has been received.
        </p>
        <p style={{ color:"rgba(255,255,255,.65)", lineHeight:1.88, marginBottom:32, fontSize:".92rem" }}>
          The admissions office will review your application and contact you within <strong style={{ color:"var(--gold-light)" }}>5–7 working days</strong>.
        </p>
        <div style={{ background:"rgba(200,160,42,.08)", border:"1px solid rgba(200,160,42,.2)", borderRadius:10, padding:"20px 24px", marginBottom:32, textAlign:"left" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:".65rem", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--gold)", marginBottom:14 }}>Next Steps</div>
          {[
            "Bring all required documents to the school admissions office",
            "Visit during office hours: Monday – Friday, 8:00 AM – 4:00 PM",
            "Or email documents to: johnlewismorrismemorialums@gmail.com",
          ].map((s, i) => (
            <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
              <ChevronRight size={13} color="var(--gold)" style={{ marginTop:3, flexShrink:0 }}/>
              <span style={{ fontSize:".82rem", color:"rgba(255,255,255,.65)", lineHeight:1.6 }}>{s}</span>
            </div>
          ))}
        </div>
        <a className="btn-gold" href="/">← Back to Home</a>
      </div>
    </div>
  );

  /* ── Main Page ── */
  return (
    <div style={{ minHeight:"100vh", background:"var(--off-white)" }}>
      <Styles/>

      {/* ── Top bar ── */}
      <div style={{ background:"linear-gradient(135deg,var(--navy),var(--navy-mid))", padding:"18px 5vw" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <a href="/" style={{ background:"none", border:"none", color:"rgba(255,255,255,.7)", cursor:"pointer", display:"inline-flex", alignItems:"center", gap:7, fontFamily:"'Barlow Condensed',sans-serif", fontSize:".72rem", fontWeight:700, letterSpacing:".12em", textTransform:"uppercase", textDecoration:"none" }}>
            <ArrowLeft size={14}/> Back to Home
          </a>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", overflow:"hidden", background:"linear-gradient(135deg,var(--gold),#a88020)" }}>
              <img src="/logo/logo.png" alt="JLM" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
            </div>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:".82rem", color:"#fff" }}>JLM Memorial UMS</span>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ background:"linear-gradient(148deg,var(--navy),var(--navy-mid))", padding:"52px 5vw 60px", textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(200,160,42,.12)", border:"1px solid rgba(200,160,42,.28)", borderRadius:100, padding:"5px 14px", marginBottom:16, animation:"fadeIn .8s ease both" }}>
          <Star size={11} fill="var(--gold)" color="var(--gold)"/>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:".66rem", fontWeight:700, letterSpacing:".16em", textTransform:"uppercase", color:"var(--gold-light)" }}>Admissions Open · 2026</span>
        </div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:"clamp(2rem,5vw,3.2rem)", color:"#fff", marginBottom:12, animation:"fadeUp .8s .1s ease both" }}>
          Apply to JLM Memorial
        </h1>
        <p style={{ color:"rgba(255,255,255,.55)", fontSize:".9rem", maxWidth:480, margin:"0 auto", animation:"fadeUp .8s .2s ease both" }}>
          Begin your journey with one of Liberia's most respected schools. Applications are open for all grade levels — KI through Grade 12.
        </p>
      </div>

      {/* ── Step Indicators ── */}
      <div style={{ background:"#fff", borderBottom:"1px solid var(--border)" }}>
        <div style={{ maxWidth:900, margin:"0 auto", padding:"0 5vw", display:"flex" }}>
          {STEPS.map(({ n, l, Icon }) => (
            <div key={n}
              className="step-item"
              style={{ borderBottom:`2px solid ${step === n ? "var(--navy-mid)" : "transparent"}`, cursor: n < step ? "pointer" : "default" }}
              onClick={() => n < step && setStep(n)}>
              <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background: step >= n ? "var(--navy)" : "rgba(10,31,92,.08)", transition:"background .3s" }}>
                <Icon size={13} color={step >= n ? "#fff" : "var(--muted)"}/>
              </div>
              <span className="step-label" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:".65rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color: step >= n ? "var(--navy)" : "var(--muted)" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form Body ── */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"48px 5vw 72px" }}>
        <form onSubmit={submit}>

          {/* Step 1 — Student Info */}
          {step === 1 && (
            <div style={{ animation:"fadeUp .4s ease both" }}>
              <div style={{ marginBottom:32 }}>
                <div className="eyebrow" style={{ marginBottom:10 }}>Step 1 of 4</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:"1.9rem", color:"var(--navy)" }}>Student Information</h2>
              </div>
              <div className="form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                <div style={{ gridColumn:"1/-1" }}>
                  <label className="f-lbl">Full Name *</label>
                  <input className="f-input" name="student_name" value={form.student_name} onChange={set} placeholder="Student's full legal name" required/>
                </div>
                <div>
                  <label className="f-lbl">Date of Birth *</label>
                  <input className="f-input" type="date" name="student_dob" value={form.student_dob} onChange={set} required/>
                </div>
                <div>
                  <label className="f-lbl">Gender *</label>
                  <select className="f-input" name="student_gender" value={form.student_gender} onChange={set} required>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="f-lbl">Nationality *</label>
                  <input className="f-input" name="student_nationality" value={form.student_nationality} onChange={set} placeholder="e.g. Liberian" required/>
                </div>
                <div>
                  <label className="f-lbl">Grade Applying For *</label>
                  <select className="f-input" name="grade_applying" value={form.grade_applying} onChange={set} required>
                    <option value="">Select grade</option>
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Parent/Guardian */}
          {step === 2 && (
            <div style={{ animation:"fadeUp .4s ease both" }}>
              <div style={{ marginBottom:32 }}>
                <div className="eyebrow" style={{ marginBottom:10 }}>Step 2 of 4</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:"1.9rem", color:"var(--navy)" }}>Parent / Guardian Information</h2>
              </div>
              <div className="form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                <div style={{ gridColumn:"1/-1" }}>
                  <label className="f-lbl">Full Name *</label>
                  <input className="f-input" name="parent_name" value={form.parent_name} onChange={set} placeholder="Parent or guardian's full name" required/>
                </div>
                <div>
                  <label className="f-lbl">Relationship to Student *</label>
                  <select className="f-input" name="parent_relationship" value={form.parent_relationship} onChange={set} required>
                    <option value="">Select relationship</option>
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Guardian</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="f-lbl">Phone Number *</label>
                  <input className="f-input" name="parent_phone" value={form.parent_phone} onChange={set} placeholder="+231 000 000 000" required/>
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label className="f-lbl">Email Address</label>
                  <input className="f-input" type="email" name="parent_email" value={form.parent_email} onChange={set} placeholder="parent@email.com (optional)"/>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — School History */}
          {step === 3 && (
            <div style={{ animation:"fadeUp .4s ease both" }}>
              <div style={{ marginBottom:32 }}>
                <div className="eyebrow" style={{ marginBottom:10 }}>Step 3 of 4</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:"1.9rem", color:"var(--navy)" }}>Previous School History</h2>
              </div>
              <div className="form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                <div style={{ gridColumn:"1/-1" }}>
                  <label className="f-lbl">Previous School Name *</label>
                  <input className="f-input" name="prev_school" value={form.prev_school} onChange={set} placeholder="Name of last school attended" required/>
                </div>
                <div>
                  <label className="f-lbl">Last Grade Completed *</label>
                  <select className="f-input" name="last_grade_completed" value={form.last_grade_completed} onChange={set} required>
                    <option value="">Select grade</option>
                    {GRADES.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="f-lbl">Reason for Leaving</label>
                  <select className="f-input" name="reason_leaving" value={form.reason_leaving} onChange={set}>
                    <option value="">Select reason</option>
                    <option>Graduated / Completed level</option>
                    <option>Seeking better opportunity</option>
                    <option>Relocated</option>
                    <option>Financial reasons</option>
                    <option>Other</option>
                  </select>
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label className="f-lbl">Additional Information</label>
                  <textarea className="f-input" name="additional_info" value={form.additional_info} onChange={set} rows={4} placeholder="Any other details you'd like the admissions office to know…" style={{ resize:"vertical" }}/>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Documents */}
            {step === 4 && (
            <div style={{ animation:"fadeUp .4s ease both" }}>
                <div style={{ marginBottom:32 }}>
                <div className="eyebrow" style={{ marginBottom:10 }}>Step 4 of 4</div>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontWeight:700, fontSize:"1.9rem", color:"var(--navy)" }}>Document Submission</h2>
                <p style={{ marginTop:8, color:"var(--muted)", fontSize:".88rem", lineHeight:1.8 }}>
                    Your application must be accompanied by the following documents — submitted either in person or by email.
                </p>
                </div>

                {/* Required Documents Checklist */}
                <div style={{ background:"#fff", border:"1px solid var(--border)", borderRadius:10, padding:"24px 28px", marginBottom:20 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:".65rem", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--navy-mid)", marginBottom:16 }}>Required Documents</div>
                {DOCS.map((d, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                    <CheckCircle size={14} color="var(--gold)" style={{ marginTop:2, flexShrink:0 }}/>
                    <span style={{ fontSize:".85rem", color:"var(--charcoal)", lineHeight:1.6 }}>{d}</span>
                    </div>
                ))}
                </div>

                {/* Hard Copy */}
                <div style={{ background:"linear-gradient(135deg,var(--navy),var(--navy-mid))", borderRadius:10, padding:"24px 28px", marginBottom:14 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <MapPin size={16} color="var(--gold)"/>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:".65rem", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"var(--gold)" }}>Option A — In Person</div>
                </div>
                <p style={{ fontSize:".84rem", color:"rgba(255,255,255,.72)", lineHeight:1.85 }}>
                    Bring all original documents and photocopies to the <strong style={{ color:"#fff" }}>JLM Admissions Office</strong> at Weaver Avenue Street, Paynesville City, Montserrado County, Liberia.<br/>
                    <strong style={{ color:"var(--gold-light)" }}>Office Hours: Monday – Friday · 8:00 AM – 4:00 PM</strong>
                </p>
                </div>

                {/* Online */}
                <div style={{ background:"linear-gradient(135deg,#6a4f00,#a88020)", borderRadius:10, padding:"24px 28px", marginBottom:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                    <Mail size={16} color="#fff"/>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:".65rem", fontWeight:700, letterSpacing:".14em", textTransform:"uppercase", color:"rgba(255,255,255,.9)" }}>Option B — Email Your Documents</div>
                </div>
                <p style={{ fontSize:".84rem", color:"rgba(255,255,255,.8)", lineHeight:1.85 }}>
                    Scan or photograph your documents clearly and email them to:<br/>
                    <strong style={{ color:"#fff", fontSize:".9rem" }}>johnlewismorrismemorialums@gmail.com</strong><br/><br/>
                    Use this exact subject line:<br/>
                    <strong style={{ color:"#fff" }}>"Admission Documents – {form.student_name || "Your Name"} – {form.grade_applying || "Grade"}"</strong>
                </p>
                </div>

                {/* Note */}
                <div style={{ fontSize:".78rem", color:"var(--muted)", lineHeight:1.8, padding:"14px 16px", background:"var(--gold-pale)", borderRadius:6, border:"1px solid rgba(200,160,42,.2)" }}>
                <strong>📎 Note on document uploads:</strong> For security and reliability, we ask that documents be submitted in person or emailed directly to the school. Our admissions team will confirm receipt within <strong>2 working days</strong>.<br/><br/>
                ⚠️ <em>Submitting this form does not guarantee admission. Your application will be reviewed and you will be contacted within <strong>5–7 working days</strong>.</em>
                </div>
            </div>
            )}

          {/* ── Navigation Buttons ── */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:40, paddingTop:24, borderTop:"1px solid var(--border)" }}>
            {step > 1
              ? <button type="button" className="btn-outline" onClick={back}><ArrowLeft size={14}/> Back</button>
              : <div/>
            }
            {step < 4
              ? <button type="button" className="btn-navy" onClick={next}>Continue <ArrowRight size={14}/></button>
              : <button type="submit" className="btn-gold" disabled={loading}>{loading ? "Submitting…" : "Submit Application"} <ArrowRight size={14}/></button>
            }
          </div>

        </form>
      </div>

      {/* ── Footer note ── */}
      <div style={{ background:"var(--navy)", padding:"22px 5vw", textAlign:"center" }}>
        <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:".75rem", color:"rgba(255,255,255,.35)" }}>
          © {new Date().getFullYear()} John Lewis Morris Memorial United Methodist High School · Admissions Office
        </p>
      </div>
    </div>
  );
}
