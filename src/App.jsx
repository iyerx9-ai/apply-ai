import { callClaude } from "./api.js";
import CoverLetter from "./CoverLetter";
import CookieBanner from "./CookieBanner";
import { TermsPage, RefundPage, ContactPage, AboutPage, PrivacyPage } from "./Legal";
import Auth from "./Auth";
import { supabase } from "./supabase";
import React, { useState, useCallback } from "react";
import ResumeScorer from "./ResumeScorer";
import Paywall from "./Paywall";
import { incrementSearch, incrementApplication } from "./usageLimits";

const saveProfile = async (userId, profile) => {
  const { supabase } = await import('./supabase');
  await supabase.from('profiles').upsert({
    id: userId,
    resume: profile.resume,
    role: profile.role,
    location: profile.location,
    skills: JSON.stringify(profile.skills),
  });
};

const loadProfile = async (userId) => {
  const { supabase } = await import('./supabase');
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  if (data) {
    return {
      resume: data.resume || '',
      role: data.role || '',
      location: data.location || '',
      skills: data.skills ? JSON.parse(data.skills) : [],
    };
  }
  return null;
};

const COLORS = {
  bg: "#0a0b0d", surface: "#111318", card: "#161b22", border: "#21262d",
  accent: "#f0b429", accentDim: "#f0b42920", green: "#3fb950", greenDim: "#3fb95020",
  blue: "#58a6ff", red: "#f85149", redDim: "#f8514915",
  text: "#e6edf3", textMuted: "#7d8590", textDim: "#484f58",
};

const Spinner = ({ size = 16, color = COLORS.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite" }}>
    <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
  </svg>
);

const Badge = ({ children, color = COLORS.accent }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, color, background: color + "20" }}>
    {children}
  </span>
);

const Btn = ({ children, onClick, variant = "primary", disabled, loading, style = {} }) => {
  const s = {
    primary: { bg: COLORS.accent, color: "#0a0b0d", border: "none" },
    secondary: { bg: "transparent", color: COLORS.accent, border: "1px solid " + COLORS.accent + "40" },
    ghost: { bg: "transparent", color: COLORS.textMuted, border: "1px solid " + COLORS.border },
    green: { bg: COLORS.green, color: "#0a0b0d", border: "none" },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled || loading} style={{
      display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px",
      borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: disabled || loading ? "not-allowed" : "pointer",
      opacity: disabled || loading ? 0.6 : 1, transition: "all 0.15s", fontFamily: "inherit",
      background: s.bg, color: s.color, border: s.border, ...style,
    }}>
      {loading && <Spinner size={13} color={s.color} />}
      {children}
    </button>
  );
};

const Tag = ({ label, onRemove }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: COLORS.accentDim, border: "1px solid " + COLORS.accent + "40", color: COLORS.accent, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
    {label}
    {onRemove && <span onClick={onRemove} style={{ cursor: "pointer", opacity: 0.6, fontSize: 14 }}>x</span>}
  </span>
);

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, width: "100%", maxWidth: 720, maxHeight: "85vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid " + COLORS.border }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: COLORS.text }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 20 }}>x</button>
        </div>
        <div style={{ overflowY: "auto", padding: 24, flex: 1 }}>{children}</div>
      </div>
    </div>
  );
};

const SAMPLE_RESUME = `John Doe
john.doe@email.com | linkedin.com/in/johndoe

SUMMARY
Software engineer with 4 years of experience building scalable web applications.

EXPERIENCE
Software Engineer - TechCorp (2021-Present)
- Built REST APIs using Node.js and Express serving 500K+ daily requests
- Led migration from monolith to microservices, reducing latency by 40%

SKILLS
JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, Docker, AWS`;

const iStyle = {
  display: "block", width: "100%", boxSizing: "border-box",
  background: COLORS.surface, border: "1px solid " + COLORS.border,
  borderRadius: 7, padding: "9px 12px", color: COLORS.text, fontSize: 13, fontFamily: "inherit", outline: "none",
};
const lStyle = { display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 };

function HomeScreen({ onNavigate }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 0" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
      <h1 style={{ color: COLORS.text, fontSize: 32, fontWeight: 800, margin: "0 0 12px" }}>ApplyAI</h1>
      <p style={{ color: COLORS.textMuted, fontSize: 16, margin: "0 0 48px" }}>Your AI-powered career platform</p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => onNavigate("setup")} style={{ padding: "18px 36px", background: COLORS.accent, color: "#0a0b0d", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Find Jobs with AI
        </button>
        <button onClick={() => onNavigate("scorer")} style={{ padding: "18px 36px", background: "transparent", color: COLORS.accent, border: "1px solid " + COLORS.accent + "40", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Score My Resume
        </button>
      </div>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
        {["🔒 Data Encrypted", "🚫 Never Sold", "✅ DPDP Compliant", "🛡️ SOC 2 Infra"].map(b => (
          <span key={b} style={{ background: "#3fb95015", border: "1px solid #3fb95040", color: "#3fb950", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{b}</span>
        ))}
      </div>
      <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 64, flexWrap: "wrap" }}>
        {[
          { icon: "🤖", title: "AI Job Matching", desc: "Find jobs matched to your skills" },
          { icon: "📄", title: "ATS Resume Scorer", desc: "Know your screen likelihood" },
          { icon: "⚡", title: "One-Click Apply", desc: "AI tailors resume per job" },
        ].map((f) => (
          <div key={f.title} style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: "24px 28px", maxWidth: 200, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
            <div style={{ color: COLORS.text, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{f.title}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 12, lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


const LOCATIONS = [
  "Remote", "Anywhere",
  "Bengaluru, India", "Mumbai, India", "Delhi, India", "Hyderabad, India", "Chennai, India", "Pune, India", "Kolkata, India", "Ahmedabad, India", "Noida, India", "Gurugram, India",
  "New York, USA", "San Francisco, USA", "Seattle, USA", "Austin, USA", "Chicago, USA", "Boston, USA", "Los Angeles, USA", "Atlanta, USA",
  "London, UK", "Manchester, UK", "Birmingham, UK",
  "Singapore", "Dubai, UAE", "Abu Dhabi, UAE",
  "Toronto, Canada", "Vancouver, Canada", "Montreal, Canada",
  "Sydney, Australia", "Melbourne, Australia",
  "Berlin, Germany", "Munich, Germany", "Amsterdam, Netherlands",
  "Paris, France", "Madrid, Spain", "Dublin, Ireland",
  "Tokyo, Japan", "Osaka, Japan", "Seoul, South Korea",
  "Shanghai, China", "Beijing, China", "Shenzhen, China",
  "Nairobi, Kenya", "Lagos, Nigeria", "Cape Town, South Africa",
  "São Paulo, Brazil", "Mexico City, Mexico", "Buenos Aires, Argentina",
];

const LocationSearch = ({ value, onChange }) => {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const filtered = query.length > 0 ? LOCATIONS.filter(l => l.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : LOCATIONS.slice(0, 8);
  return (
    <div style={{ position: "relative" }}>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        style={iStyle}
        placeholder="Type any city, country or Remote..."
      />
      <div style={{ fontSize: 10, color: "#484f58", marginTop: 3 }}>Type any city worldwide — e.g. Lagos, Tokyo, Remote</div>
      {open && (filtered.length > 0 || query.length > 0) && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#161b22", border: "1px solid #21262d", borderRadius: 7, zIndex: 100, maxHeight: 220, overflowY: "auto" }}>
          {filtered.map(l => (
            <div key={l} onMouseDown={() => { setQuery(l); onChange(l); setOpen(false); }}
              style={{ padding: "9px 14px", color: "#e6edf3", fontSize: 13, cursor: "pointer", borderBottom: "1px solid #21262d" }}
              onMouseEnter={e => e.target.style.background = "#21262d"}
              onMouseLeave={e => e.target.style.background = "transparent"}>
              {l}
            </div>
          ))}
          {query.length > 0 && (
            <div onMouseDown={() => { onChange(query); setOpen(false); }}
              style={{ padding: "9px 14px", color: "#f0b429", fontSize: 13, cursor: "pointer", borderTop: "1px solid #21262d", fontWeight: 600 }}>
              🔍 Search "{query}" anywhere →
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function SetupStep({ onNext }) {
  const [skills, setSkills] = useState(["React", "Node.js", "TypeScript"]);
  const [input, setInput] = useState("");
  const [resume, setResume] = useState(SAMPLE_RESUME);
  const [role, setRole] = useState("Software Engineer");
  const [location, setLocation] = useState("Bengaluru");
  const [exp, setExp] = useState("Mid-level");

  const addSkill = () => {
    const t = input.trim();
    if (t && !skills.includes(t)) setSkills([...skills, t]);
    setInput("");
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h2 style={{ color: COLORS.text, margin: "0 0 6px", fontSize: 22, fontWeight: 700 }}>Configure Your Profile</h2>
        <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 14 }}>AI will tailor your resume and apply to matching jobs automatically</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div>
          <label style={lStyle}>TARGET ROLE</label>
          <input value={role} onChange={e => setRole(e.target.value)} style={iStyle} placeholder="e.g. Software Engineer" />
        </div>
        <div>
          <label style={lStyle}>LOCATION</label>
          <LocationSearch value={location} onChange={setLocation} />
        </div>
        <div>
          <label style={lStyle}>EXPERIENCE LEVEL</label>
          <select value={exp} onChange={e => setExp(e.target.value)} style={{ ...iStyle, cursor: "pointer" }}>
            {["Entry-level", "Mid-level", "Senior", "Lead / Manager"].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={lStyle}>YOUR SKILLS</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill()} style={{ ...iStyle, flex: 1 }} placeholder="Add a skill, press Enter" />
          <Btn onClick={addSkill} variant="secondary">Add</Btn>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {skills.map(s => <Tag key={s} label={s} onRemove={() => setSkills(skills.filter(x => x !== s))} />)}
        </div>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={lStyle}>BASE RESUME</label>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: COLORS.surface, border: "1px solid " + COLORS.border, borderRadius: 7, cursor: "pointer", fontSize: 13, color: COLORS.textMuted }}>
            📎 Upload CV (PDF, Word or Text)
            <input type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              setResume("⏳ Reading " + file.name + "...");
              try {
                if (file.type === "text/plain") {
                  const text = await file.text();
                  setResume(text);
                } else if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
                  const mammoth = await import("mammoth");
                  const arrayBuffer = await file.arrayBuffer();
                  const result = await mammoth.extractRawText({ arrayBuffer });
                  const extractedText = result.value;
                  setResume(extractedText);
                  // Auto extract role and skills from CV using AI
                  setRole("Analyzing CV...");
                  try {
                    const { callClaude: cc } = await import("./api.js");
                    const analysis = await cc(
                      `Analyze this CV and extract in JSON only, no markdown:
{"role":"most recent job title","skills":["skill1","skill2","skill3","skill4","skill5"],"exp":"Entry-level|Mid-level|Senior|Lead / Manager"}

CV:
${extractedText.slice(0, 2000)}`,
                      "Return only raw JSON. No markdown. No extra text."
                    );
                    const clean = analysis.replace(/\`\`\`json|\`\`\`/g, "").trim();
                    const parsed = JSON.parse(clean);
                    if (parsed.role) setRole(parsed.role);
                    if (parsed.skills) setSkills(parsed.skills);
                    if (parsed.exp) setExp(parsed.exp);
                  } catch(e) {
                    console.log("Auto-extract failed", e);
                  }
                } else if (file.type === "application/pdf") {
                  setResume("PDF detected: " + file.name + "\n\nPDF text extraction coming soon. Please paste your CV text below.");
                } else {
                  const text = await file.text();
                  setResume(text);
                }
              } catch (err) {
                setResume("Could not read file. Please paste your CV text below.");
              }
            }} />
          </label>
        </div>
        <textarea value={resume} onChange={e => setResume(e.target.value)} rows={10} style={{ ...iStyle, fontFamily: "monospace", fontSize: 12, lineHeight: 1.6, resize: "vertical" }} placeholder="Paste your CV here or upload above..." />
      </div>
      <Btn onClick={() => {
  onNext({ skills, resume, role, exp, location });
      }} style={{ width: "100%", justifyContent: "center", padding: "12px 24px", fontSize: 14 }}>
        Find Matching Jobs
      </Btn>
    </div>
  );
}

function JobsStep({ profile, onBack, user }) {
  const [jobs, setJobs] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [previewJob, setPreviewJob] = useState(null);
  const [previewResume, setPreviewResume] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedIds, setAppliedIds] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [toast, setToast] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // Fetch recommendations after jobs load
  const fetchRecommendations = async () => {
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: profile.role,
          skills: profile.skills,
          location: profile.location,
          resume: profile.resume?.slice(0, 500),
        }),
      });
      const data = await res.json();
      if (data.jobs?.length > 0) setRecommendations(data.jobs);
    } catch (err) {
      console.log("Recommendations failed:", err);
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchJobs = useCallback(async (countUsage = true) => {
    if (user && countUsage) {
      const result = await incrementSearch(user.id);
      if (!result.allowed) { setShowPaywall(true); return; }
    }
    // Check cache first
    const cacheKey = `jobs-${profile.role}-${profile.location}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { jobs, time } = JSON.parse(cached);
      if (Date.now() - time < 3600000) { // 1 hour cache
        setJobs(jobs);
        return;
      }
    }
    setFetching(true);
    setJobs([]);
    try {
      // Fetch real jobs from JSearch
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: profile.role, location: profile.location || "", skills: profile.skills }),
      });
      const data = await res.json();
      console.log("API response:", JSON.stringify(data).slice(0,200));
      const jobs = (data.data || []).slice(0, 6).map((j, i) => ({
        id: j.job_id || `j${i}`,
        title: j.job_title,
        company: j.employer_name,
        location: j.job_city ? `${j.job_city}, ${j.job_country}` : j.job_country || "Remote",
        type: j.job_is_remote ? "Remote" : "On-site",
        salary: j.job_min_salary ? `$${j.job_min_salary/1000}k-$${j.job_max_salary/1000}k/yr` : "Competitive",
        match: Math.floor(75 + Math.random() * 20),
        tags: profile.skills.slice(0, 3),
        posted: j.job_posted_at_datetime_utc ? new Date(j.job_posted_at_datetime_utc).toLocaleDateString() : "Recently",
        desc: j.job_description ? j.job_description.slice(0, 150) + "..." : "Exciting opportunity.",
        requirements: j.job_highlights?.Qualifications?.slice(0, 3) || ["Relevant experience", "Good communication", "Team player"],
        applyLink: j.job_apply_link,
      }));
      setJobs(jobs);
      // Save to cache
      sessionStorage.setItem(cacheKey, JSON.stringify({ jobs, time: Date.now() }));
    } catch (err) {
      showToast("Failed to fetch jobs: " + err.message, "error");
    }
    setFetching(false);
  }, [profile]);

  useState(() => { 
    fetchJobs(false); 
    fetchRecommendations();
  }, []);

  const handlePreview = async (job) => {
    setPreviewJob(job);
    setPreviewResume("");
    setPreviewLoading(true);
    try {
      // Use real jobs from JSearch
      const tailored = await callClaude(
        `Tailor this resume for: ${job.title} at ${job.company}. Requirements: ${job.requirements.join(", ")}.\n\nRESUME:\n${profile.resume}\n\nReturn only the tailored resume text.`,
        "You are an expert resume writer."
      );
      setPreviewResume(tailored);
    } catch {
      setPreviewResume("Error generating resume.");
    }
    setPreviewLoading(false);
  };

  const [aiPackage, setAiPackage] = useState(null);

  const handleApply = async (job) => {
    setApplyingId(job.id);
    setStatusMsg("Tailoring resume...");
    try {
      const tailored = await callClaude(
        `Tailor this resume for: ${job.title} at ${job.company}.
Requirements: ${job.requirements?.join(", ")}
Job Description: ${job.desc}

RESUME:
${profile.resume}

Return only the tailored resume text, no explanations.`,
        "You are an expert resume writer."
      );
      setStatusMsg("Writing cover letter...");
      const coverLetter = await callClaude(
        `Write a professional cover letter for ${job.title} at ${job.company}.
Job: ${job.desc}
Resume: ${profile.resume.slice(0, 1000)}
Keep it to 3 paragraphs.`,
        "You are an expert cover letter writer."
      );
      setApplyingId(null);
      setStatusMsg("");
      setAppliedIds(prev => [...prev, job.id]);
      setAiPackage({ job, resume: tailored, coverLetter });
    } catch(err) {
      setApplyingId(null);
      setStatusMsg("");
      showToast("Failed: " + err.message, "error");
    }
  };

  const mc = (n) => n >= 85 ? COLORS.green : n >= 70 ? COLORS.accent : COLORS.blue;

  return (
    <div>
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 2000, background: toast.type === "error" ? COLORS.redDim : COLORS.greenDim, border: "1px solid " + (toast.type === "error" ? COLORS.red : COLORS.green) + "50", color: toast.type === "error" ? COLORS.red : COLORS.green, padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, maxWidth: 300 }}>
          {toast.msg}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ color: COLORS.text, margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Job Openings</h2>
          <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 13 }}>Matched for <span style={{ color: COLORS.accent }}>{profile.role}</span></p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn onClick={onBack} variant="ghost">Back</Btn>
          <Btn onClick={fetchJobs} variant="secondary" loading={fetching}>Refresh</Btn>
        </div>
      </div>

      {fetching && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 0", gap: 14 }}>
          <Spinner size={28} />
          <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 14 }}>Scanning job boards with AI...</p>
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {jobs.map((job) => {
          const applied = appliedIds.includes(job.id);
          const applying = applyingId === job.id;
          const matchColor = mc(job.match);
          return (
            <div key={job.id} style={{ background: applied ? COLORS.greenDim : COLORS.card, border: "1px solid " + (applied ? COLORS.green + "40" : COLORS.border), borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0, background: "hsl(" + (job.id.charCodeAt(1) * 40) + ", 50%, 20%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "1px solid " + COLORS.border }}>
                  {job.company[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: COLORS.text }}>{job.title}</h3>
                      <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted }}>{job.company} · {job.location} · <span style={{ color: job.type === "Remote" ? COLORS.green : COLORS.blue }}>{job.type}</span></p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 8 }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: matchColor, fontFamily: "monospace" }}>{job.match}%</div>
                      <div style={{ fontSize: 10, color: COLORS.textDim }}>MATCH</div>
                    </div>
                  </div>
                  <div style={{ background: COLORS.border, borderRadius: 99, height: 4, marginBottom: 10 }}>
                    <div style={{ width: job.match + "%", height: "100%", background: matchColor, borderRadius: 99 }} />
                  </div>
                  <p style={{ margin: "0 0 10px", fontSize: 12.5, color: COLORS.textMuted, lineHeight: 1.5 }}>{job.desc}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                    {job.tags?.map(t => <Tag key={t} label={t} />)}
                    <span style={{ color: COLORS.textDim, fontSize: 12, marginLeft: "auto" }}>{job.posted}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    {applied ? (
                      <Badge color={COLORS.green}>Applied</Badge>
                    ) : (
                      <>
                        <Btn onClick={() => handleApply(job)} variant="green" loading={applying} disabled={!!applyingId}>Apply with AI</Btn>
                        <Btn onClick={() => handlePreview(job)} variant="secondary" disabled={applying || !!applyingId}>Preview</Btn>
                      </>
                    )}
                    <span style={{ color: COLORS.textMuted, fontSize: 13 }}>{job.salary}</span>
                  </div>
                  {applying && (
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                      <Spinner size={13} color={COLORS.green} />
                      <span style={{ color: COLORS.green, fontSize: 12 }}>{statusMsg}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showPaywall && <Paywall onClose={() => setShowPaywall(false)} reason="searches" user={user} onUpgradeSuccess={() => { setShowPaywall(false); }} />}
      {recommendations.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ color: COLORS.text, fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            💡 You Might Also Like
          </h3>
          <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 16 }}>
            Based on your CV, AI recommends these roles too
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {recommendations.map((job) => (
              <div key={job.id} style={{ background: COLORS.surface, border: "1px solid " + COLORS.border, borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ color: COLORS.accent, fontSize: 10, fontWeight: 700, marginBottom: 4 }}>
                      RECOMMENDED: {job.recommendedRole}
                    </div>
                    <h4 style={{ color: COLORS.text, margin: 0, fontSize: 14, fontWeight: 700 }}>{job.title}</h4>
                    <p style={{ color: COLORS.textMuted, margin: "2px 0 0", fontSize: 12 }}>{job.company} · {job.location}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: COLORS.blue, fontWeight: 800, fontSize: 16, fontFamily: "monospace" }}>{job.match}%</div>
                    <div style={{ color: COLORS.textDim, fontSize: 10 }}>MATCH</div>
                  </div>
                </div>
                <p style={{ color: COLORS.textMuted, fontSize: 12, margin: "8px 0", lineHeight: 1.5 }}>{job.desc}</p>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <Btn onClick={() => handleApply(job)} variant="secondary" style={{ fontSize: 12, padding: "6px 14px" }}>Apply with AI</Btn>
                  {job.applyLink && <Btn onClick={() => window.open(job.applyLink, "_blank")} variant="ghost" style={{ fontSize: 12, padding: "6px 14px" }}>View Job</Btn>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {appliedIds.length > 0 && (
        <div style={{ marginTop: 20, background: COLORS.greenDim, border: "1px solid " + COLORS.green + "40", borderRadius: 10, padding: "14px 20px" }}>
          <div style={{ color: COLORS.green, fontWeight: 700, fontSize: 14 }}>{appliedIds.length} application{appliedIds.length > 1 ? "s" : ""} submitted</div>
          <div style={{ color: COLORS.textMuted, fontSize: 12 }}>AI tailored your resume for each role</div>
        </div>
      )}

      {aiPackage && (
        <div onClick={() => setAiPackage(null)} style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 12, width: "100%", maxWidth: 720, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #21262d" }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#e6edf3" }}>✅ AI Package Ready — {aiPackage.job.title} at {aiPackage.job.company}</span>
              <button onClick={() => setAiPackage(null)} style={{ background: "none", border: "none", color: "#7d8590", cursor: "pointer", fontSize: 20 }}>×</button>
            </div>
            <div style={{ overflowY: "auto", padding: 24, flex: 1 }}>
              <h4 style={{ color: "#7d8590", fontSize: 11, letterSpacing: "0.08em", marginBottom: 8 }}>AI-TAILORED RESUME</h4>
              <pre style={{ background: "#111318", border: "1px solid #21262d", borderRadius: 8, padding: 16, fontSize: 12, lineHeight: 1.7, color: "#e6edf3", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: "0 0 20px", fontFamily: "monospace" }}>{aiPackage.resume}</pre>
              <h4 style={{ color: "#7d8590", fontSize: 11, letterSpacing: "0.08em", marginBottom: 8 }}>AI-GENERATED COVER LETTER</h4>
              <pre style={{ background: "#111318", border: "1px solid #21262d", borderRadius: 8, padding: 16, fontSize: 12, lineHeight: 1.7, color: "#e6edf3", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: "0 0 20px", fontFamily: "monospace" }}>{aiPackage.coverLetter}</pre>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { navigator.clipboard.writeText(aiPackage.resume + "\n\n---COVER LETTER---\n\n" + aiPackage.coverLetter); showToast("Copied to clipboard!"); }} style={{ padding: "10px 20px", background: "#f0b429", color: "#0a0b0d", border: "none", borderRadius: 7, fontWeight: 700, cursor: "pointer" }}>Copy All</button>
                {aiPackage.job.applyLink && <button onClick={() => { window.open(aiPackage.job.applyLink, "_blank"); setAiPackage(null); }} style={{ padding: "10px 20px", background: "#3fb950", color: "#0a0b0d", border: "none", borderRadius: 7, fontWeight: 700, cursor: "pointer" }}>Open Job Application →</button>}
                <button onClick={() => setAiPackage(null)} style={{ padding: "10px 20px", background: "transparent", color: "#7d8590", border: "1px solid #21262d", borderRadius: 7, cursor: "pointer" }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal open={!!previewJob} onClose={() => setPreviewJob(null)} title={previewJob ? "Preview - " + previewJob.title + " at " + previewJob.company : ""}>
        {previewJob && (
          <div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <Badge color={COLORS.blue}>{previewJob.location}</Badge>
              <Badge color={COLORS.accent}>{previewJob.salary}</Badge>
              <Badge color={mc(previewJob.match)}>{previewJob.match}% match</Badge>
            </div>
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.08em", marginBottom: 8 }}>JOB DESCRIPTION</h4>
              <p style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{previewJob.desc}</p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.08em", marginBottom: 8 }}>REQUIRED SKILLS</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {previewJob.tags?.map((t, i) => (
                  <span key={i} style={{ background: COLORS.accentDim, border: "1px solid " + COLORS.accent + "40", color: COLORS.accent, padding: "4px 12px", borderRadius: 20, fontSize: 12 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.08em", marginBottom: 8 }}>REQUIREMENTS</h4>
              <ul style={{ margin: 0, paddingLeft: 20, color: COLORS.textMuted, fontSize: 13, lineHeight: 1.8 }}>
                {previewJob.requirements?.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
            <div style={{ borderTop: "1px solid " + COLORS.border, paddingTop: 20 }}>
              <h4 style={{ color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.08em", marginBottom: 12 }}>AI-TAILORED RESUME</h4>
              {previewLoading ? (
                <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "20px 0" }}>
                  <Spinner size={16} />
                  <span style={{ color: COLORS.textMuted, fontSize: 13 }}>Customizing resume...</span>
                </div>
              ) : (
                <pre style={{ background: COLORS.surface, border: "1px solid " + COLORS.border, borderRadius: 8, padding: 16, fontSize: 12, lineHeight: 1.7, color: COLORS.text, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, fontFamily: "monospace" }}>
                  {previewResume}
                </pre>
              )}
            </div>
            {!previewLoading && previewResume && (
              <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <Btn onClick={() => { if (!appliedIds.includes(previewJob.id)) { handleApply(previewJob); setPreviewJob(null); } }} variant="green" disabled={appliedIds.includes(previewJob.id)}>
                  {appliedIds.includes(previewJob.id) ? "Already Applied" : "Apply with This Resume"}
                </Btn>
                <Btn onClick={() => setPreviewJob(null)} variant="ghost">Close</Btn>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// Footer added below
export default function App() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState("home");
  const [profile, setProfile] = useState(null);
  if (!user) return <Auth onLogin={setUser} />;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: COLORS.text }}>
      <CookieBanner />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ borderBottom: "1px solid " + COLORS.border, background: COLORS.surface }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => setStep("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{ width: 28, height: 28, background: COLORS.accent, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>⚡</div>
            <span style={{ fontWeight: 800, fontSize: 16 }}>ApplyAI</span>
            <Badge color={COLORS.accent}>Beta</Badge>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ color: COLORS.textMuted, fontSize: 12 }}>{user?.email}</span>
            <Btn onClick={() => { supabase.auth.signOut(); setUser(null); }} variant="ghost" style={{ fontSize: 12, padding: "4px 10px" }}>Sign Out</Btn>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => setStep("setup")} variant="ghost" style={{ fontSize: 12, padding: "6px 12px" }}>Find Jobs</Btn>
            <Btn onClick={() => setStep("scorer")} variant="secondary" style={{ fontSize: 12, padding: "6px 12px" }}>Score Resume</Btn>
            <Btn onClick={() => setStep("cover")} variant="ghost" style={{ fontSize: 12, padding: "6px 12px" }}>Cover Letter</Btn>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        {step === "home" && <HomeScreen onNavigate={setStep} />}
        {step === "setup" && <SetupStep onNext={(p) => { setProfile(p); setStep("jobs"); }} user={user} />}
        {step === "jobs" && profile && <JobsStep profile={profile} onBack={() => setStep("home")} user={user} />}
        {step === "scorer" && <ResumeScorer onBack={() => setStep("home")} />}
        {step === "cover" && <CoverLetter onBack={() => setStep("home")} />}
        {step === "terms" && <TermsPage />}
        {step === "about" && <AboutPage />}
        {step === "privacy" && <PrivacyPage />}
        {step === "refund" && <RefundPage />}
        {step === "contact" && <ContactPage />}
      </div>
      <div style={{ borderTop: "1px solid #21262d", marginTop: 40, padding: "20px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
          {[["About", "about"], ["Privacy", "privacy"], ["Terms", "terms"], ["Refund Policy", "refund"], ["Contact", "contact"]].map(([label, s]) => (
            <span key={s} onClick={() => setStep(s)} style={{ color: "#7d8590", fontSize: 12, cursor: "pointer" }}>{label}</span>
          ))}
        </div>
        <p style={{ color: "#484f58", fontSize: 11, margin: "8px 0 0" }}>© 2026 ApplyAI. All rights reserved.</p>
      </div>
    </div>
  );
}
