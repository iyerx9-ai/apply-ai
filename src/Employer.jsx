import { useState } from "react";
import { callClaude } from "./api.js";

const COLORS = {
  bg: "#0a0b0d", surface: "#111318", card: "#161b22", border: "#21262d",
  accent: "#f0b429", green: "#3fb950", blue: "#58a6ff", red: "#f85149",
  text: "#e6edf3", textMuted: "#7d8590", textDim: "#484f58",
};

const Spinner = ({ size = 16, color = COLORS.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite" }}>
    <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
  </svg>
);

const iStyle = {
  display: "block", width: "100%", boxSizing: "border-box",
  background: COLORS.surface, border: "1px solid " + COLORS.border,
  borderRadius: 7, padding: "10px 14px", color: COLORS.text,
  fontSize: 13, fontFamily: "inherit", outline: "none",
};

export default function Employer({ onBack }) {
  const [tab, setTab] = useState("post");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("3-5 years");
  const [candidates, setCandidates] = useState([]);
  const [screening, setScreening] = useState(false);
  const [cvText, setCvText] = useState("");
  const [results, setResults] = useState([]);

  const sampleCVs = [
    { name: "Rahul Sharma", cv: "10 years software engineering. React, Node.js, AWS. Led team of 8. Built scalable systems for 1M+ users. IIT Delhi." },
    { name: "Priya Patel", cv: "5 years frontend developer. React, TypeScript, CSS. Good team player. Some AWS experience. Mumbai University." },
    { name: "Amit Kumar", cv: "15 years full stack. Java, React, Kubernetes, AWS. Architect level. Led digital transformation at 3 companies. NIT Trichy." },
    { name: "Sneha Reddy", cv: "2 years React developer. Basic Node.js. Learning AWS. Fresh energy and quick learner. Osmania University." },
    { name: "Vikram Singh", cv: "8 years backend engineer. Node.js, Python, PostgreSQL, AWS. Microservices expert. Built payment systems. BITS Pilani." },
  ];

  const screenCandidates = async () => {
    if (!jobTitle || !jobDesc) return;
    setScreening(true);
    setResults([]);
    try {
      const cvList = sampleCVs.map((c, i) => `Candidate ${i+1} - ${c.name}:\n${c.cv}`).join("\n\n");
      const raw = await callClaude(
        `You are an expert recruiter. Screen these candidates for the role of ${jobTitle}.

Job Description: ${jobDesc}
Required Skills: ${skills}
Experience: ${experience}

Candidates:
${cvList}

Return ONLY a JSON array, no markdown:
[{"name":"...","score":85,"verdict":"Strong fit","strengths":["s1","s2"],"concerns":["c1"],"recommendation":"Shortlist"}]`,
        "Return only raw JSON array. No markdown."
      );
      const clean = raw.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("[");
      const end = clean.lastIndexOf("]") + 1;
      setResults(JSON.parse(clean.slice(start, end)));
    } catch (err) {
      console.error(err);
    }
    setScreening(false);
  };

  const scoreColor = (s) => s >= 80 ? COLORS.green : s >= 60 ? COLORS.accent : COLORS.red;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: COLORS.text, margin: "0 0 4px", fontSize: 24, fontWeight: 800 }}>Employer Dashboard</h1>
          <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 14 }}>AI-powered hiring — screen 100 CVs in 60 seconds</p>
        </div>
        <button onClick={onBack} style={{ padding: "8px 16px", background: "transparent", color: COLORS.textMuted, border: "1px solid " + COLORS.border, borderRadius: 7, cursor: "pointer", fontSize: 13 }}>
          Back
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[["post", "Post a Job"], ["screen", "Screen CVs"], ["candidates", "Candidates"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "8px 20px", background: tab === id ? COLORS.accent : "transparent",
            color: tab === id ? "#0a0b0d" : COLORS.textMuted,
            border: "1px solid " + (tab === id ? COLORS.accent : COLORS.border),
            borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: tab === id ? 700 : 400,
          }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "post" && (
        <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: COLORS.text, margin: "0 0 20px", fontSize: 16, fontWeight: 700 }}>Post a New Job</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>JOB TITLE</label>
              <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} style={iStyle} placeholder="e.g. Senior Software Engineer" />
            </div>
            <div>
              <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>EXPERIENCE REQUIRED</label>
              <select value={experience} onChange={e => setExperience(e.target.value)} style={{ ...iStyle, cursor: "pointer" }}>
                {["0-2 years", "2-3 years", "3-5 years", "5-8 years", "8+ years"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>REQUIRED SKILLS</label>
            <input value={skills} onChange={e => setSkills(e.target.value)} style={iStyle} placeholder="e.g. React, Node.js, AWS, PostgreSQL" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>JOB DESCRIPTION</label>
            <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={6}
              style={{ ...iStyle, resize: "vertical" }} placeholder="Describe the role, responsibilities and requirements..." />
          </div>
          <button onClick={() => { setTab("screen"); screenCandidates(); }} disabled={!jobTitle || !jobDesc} style={{
            width: "100%", padding: "12px", background: COLORS.accent, color: "#0a0b0d",
            border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}>
            Post Job & Screen Candidates with AI
          </button>
        </div>
      )}

      {tab === "screen" && (
        <div>
          <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <h3 style={{ color: COLORS.text, margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>AI CV Screening</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>PASTE CANDIDATE CVs</label>
              <textarea value={cvText} onChange={e => setCvText(e.target.value)} rows={8}
                style={{ ...iStyle, fontFamily: "monospace", fontSize: 12, resize: "vertical" }}
                placeholder="Paste multiple CVs here or use sample candidates below..." />
            </div>
            <button onClick={screenCandidates} disabled={screening || !jobTitle} style={{
              width: "100%", padding: "12px", background: screening ? COLORS.border : COLORS.accent,
              color: "#0a0b0d", border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700,
              cursor: screening ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {screening ? <><Spinner size={16} color="#0a0b0d" /> Screening with AI...</> : "Screen Candidates with AI"}
            </button>
            {!jobTitle && <p style={{ color: COLORS.red, fontSize: 12, marginTop: 8 }}>Please post a job first!</p>}
          </div>

          {results.length > 0 && (
            <div>
              <h3 style={{ color: COLORS.text, fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
                Ranked Candidates — {results.length} screened
              </h3>
              {results.sort((a, b) => b.score - a.score).map((r, i) => (
                <div key={i} style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 10, padding: 20, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ color: COLORS.text, fontWeight: 700, fontSize: 15 }}>#{i+1} {r.name}</span>
                        <span style={{ background: r.recommendation === "Shortlist" ? COLORS.green + "20" : COLORS.red + "20", color: r.recommendation === "Shortlist" ? COLORS.green : COLORS.red, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                          {r.recommendation}
                        </span>
                      </div>
                      <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{r.verdict}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: scoreColor(r.score), fontSize: 24, fontWeight: 800, fontFamily: "monospace" }}>{r.score}%</div>
                      <div style={{ color: COLORS.textDim, fontSize: 10 }}>FIT SCORE</div>
                    </div>
                  </div>
                  <div style={{ background: COLORS.border, borderRadius: 99, height: 4, marginBottom: 14 }}>
                    <div style={{ width: r.score + "%", height: "100%", background: scoreColor(r.score), borderRadius: 99 }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={{ color: COLORS.green, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>STRENGTHS</div>
                      {r.strengths?.map((s, j) => <div key={j} style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 4 }}>+ {s}</div>)}
                    </div>
                    <div>
                      <div style={{ color: COLORS.red, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>CONCERNS</div>
                      {r.concerns?.map((c, j) => <div key={j} style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 4 }}>- {c}</div>)}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button style={{ padding: "6px 16px", background: COLORS.green, color: "#0a0b0d", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      Shortlist
                    </button>
                    <button style={{ padding: "6px 16px", background: "transparent", color: COLORS.textMuted, border: "1px solid " + COLORS.border, borderRadius: 6, fontSize: 12, cursor: "pointer" }}>
                      Reject
                    </button>
                    <button style={{ padding: "6px 16px", background: COLORS.blue + "20", color: COLORS.blue, border: "1px solid " + COLORS.blue + "40", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>
                      Schedule Interview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "candidates" && (
        <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: COLORS.text, margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>All Candidates</h3>
          {results.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <p style={{ color: COLORS.textMuted }}>No candidates yet. Post a job and screen CVs first!</p>
              <button onClick={() => setTab("post")} style={{ padding: "10px 24px", background: COLORS.accent, color: "#0a0b0d", border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 16 }}>
                Post a Job
              </button>
            </div>
          ) : (
            results.sort((a, b) => b.score - a.score).map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid " + COLORS.border }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.accent + "20", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accent, fontWeight: 700, fontSize: 14 }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                    <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{r.verdict}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: scoreColor(r.score), fontWeight: 800, fontSize: 16, fontFamily: "monospace" }}>{r.score}%</span>
                  <span style={{ background: r.recommendation === "Shortlist" ? COLORS.green + "20" : COLORS.red + "20", color: r.recommendation === "Shortlist" ? COLORS.green : COLORS.red, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {r.recommendation}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
