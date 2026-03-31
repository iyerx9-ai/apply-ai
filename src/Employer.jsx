import { useState, useEffect } from "react";
import { callClaude } from "./api.js";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

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
  background: "#111318", border: "1px solid #21262d",
  borderRadius: 7, padding: "10px 14px", color: "#e6edf3",
  fontSize: 13, fontFamily: "inherit", outline: "none",
};

export default function Employer({ onBack, user }) {
  const [tab, setTab] = useState("post");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("3-5 years");
  const [location, setLocation] = useState("");
  const [screening, setScreening] = useState(false);
  const [results, setResults] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [employerPlan, setEmployerPlan] = useState("free");

  useEffect(() => {
    if (user) {
      loadJobs();
      checkEmployerPlan();
    }
  }, [user]);

  const checkEmployerPlan = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    if (data?.plan === "employer") setEmployerPlan("pro");
  };

  const handleEmployerUpgrade = () => {
    if (window.Paddle) {
      window.Paddle.Environment.set("production");
      window.Paddle.Initialize({ token: "live_040d02e495a75071975e3dee5d3" });
      window.Paddle.Checkout.open({
        items: [{ priceId: "pri_01kn25pt4rtaetbdw3ysqdde6g", quantity: 1 }],
        customer: { email: user?.email || "" },
        successUrl: "https://hirex.world/employer",
      });
    }
  };

  const loadJobs = async () => {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("employer_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setJobs(data);
  };

  const loadApplications = async (jobId) => {
    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("job_id", jobId)
      .order("score", { ascending: false });
    if (data) setApplications(data);
  };

  const postJob = async () => {
    if (!jobTitle || !jobDesc) return;
    setPosting(true);
    const { data } = await supabase.from("jobs").insert({
      employer_id: user.id,
      title: jobTitle,
      description: jobDesc,
      skills,
      experience,
      location,
      active: true,
    }).select().single();
    if (data) {
      setJobs(prev => [data, ...prev]);
      setSelectedJob(data);
      setPosted(true);
      setTab("screen");
    }
    setPosting(false);
  };

  const screenApplications = async () => {
    if (!selectedJob) return;
    setScreening(true);
    setResults([]);
    const { data: apps } = await supabase
      .from("applications")
      .select("*")
      .eq("job_id", selectedJob.id);

    if (!apps || apps.length === 0) {
      setScreening(false);
      return;
    }

    try {
      const cvList = apps.map((a, i) =>
        `Candidate ${i+1} - ${a.applicant_name}:\n${a.cv_text?.slice(0, 500)}`
      ).join("\n\n");

      const raw = await callClaude(
        `Screen these candidates for ${selectedJob.title}.
Job: ${selectedJob.description}
Skills needed: ${selectedJob.skills}
Experience: ${selectedJob.experience}

Candidates:
${cvList}

Return ONLY JSON array:
[{"name":"...","score":85,"verdict":"Strong fit","strengths":["s1","s2"],"concerns":["c1"],"recommendation":"Shortlist"}]`,
        "Return only raw JSON array."
      );
      const clean = raw.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("[");
      const end = clean.lastIndexOf("]") + 1;
      const scored = JSON.parse(clean.slice(start, end));

      for (const s of scored) {
        const app = apps.find(a => a.applicant_name === s.name);
        if (app) {
          await supabase.from("applications").update({
            score: s.score,
            verdict: s.verdict,
            strengths: JSON.stringify(s.strengths),
            concerns: JSON.stringify(s.concerns),
            recommendation: s.recommendation,
          }).eq("id", app.id);
        }
      }
      setResults(scored);
    } catch (err) {
      console.error(err);
    }
    setScreening(false);
  };

  const updateStatus = async (appId, status) => {
    await supabase.from("applications").update({ status }).eq("id", appId);
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
  };

  const scoreColor = (s) => s >= 80 ? COLORS.green : s >= 60 ? COLORS.accent : COLORS.red;

  const visibleResults = employerPlan === "pro" ? results : results.slice(0, 3);

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

      {employerPlan === "free" && (
        <div style={{ background: COLORS.accent + "15", border: "1px solid " + COLORS.accent + "40", borderRadius: 10, padding: 16, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Free Plan — Limited Access</div>
            <div style={{ color: COLORS.textMuted, fontSize: 13 }}>Post 1 job, see top 3 candidates only. Start 7-day free trial for unlimited access!</div>
          </div>
          <button onClick={handleEmployerUpgrade} style={{ padding: "10px 20px", background: COLORS.accent, color: "#0a0b0d", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            Start 7-Day Free Trial
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {[["post", "Post a Job"], ["screen", "Screen CVs"], ["candidates", "Candidates"]].map(([id, label]) => (
          <button key={id} onClick={() => { setTab(id); if (id === "candidates" && selectedJob) loadApplications(selectedJob.id); }} style={{
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

          {jobs.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 8 }}>YOUR ACTIVE JOBS</div>
              {jobs.map(j => (
                <div key={j.id} onClick={() => { setSelectedJob(j); setTab("screen"); }} style={{
                  padding: "10px 14px", background: selectedJob?.id === j.id ? COLORS.accent + "15" : COLORS.surface,
                  border: "1px solid " + (selectedJob?.id === j.id ? COLORS.accent + "40" : COLORS.border),
                  borderRadius: 7, marginBottom: 6, cursor: "pointer", display: "flex", justifyContent: "space-between",
                }}>
                  <span style={{ color: COLORS.text, fontSize: 13, fontWeight: 500 }}>{j.title}</span>
                  <span style={{ color: COLORS.textMuted, fontSize: 12 }}>{new Date(j.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}

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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>REQUIRED SKILLS</label>
              <input value={skills} onChange={e => setSkills(e.target.value)} style={iStyle} placeholder="e.g. React, Node.js, AWS" />
            </div>
            <div>
              <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>LOCATION</label>
              <input value={location} onChange={e => setLocation(e.target.value)} style={iStyle} placeholder="e.g. Bengaluru / Remote" />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>JOB DESCRIPTION</label>
            <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={5}
              style={{ ...iStyle, resize: "vertical" }} placeholder="Describe the role, responsibilities and requirements..." />
          </div>
          <button onClick={postJob} disabled={posting || !jobTitle || !jobDesc} style={{
            width: "100%", padding: "12px", background: COLORS.accent, color: "#0a0b0d",
            border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700,
            cursor: posting ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {posting ? <><Spinner size={16} color="#0a0b0d" /> Posting...</> : "Post Job"}
          </button>
          {posted && <p style={{ color: COLORS.green, fontSize: 13, marginTop: 10, textAlign: "center" }}>✅ Job posted! Candidates can now apply at hirex.world</p>}
        </div>
      )}

      {tab === "screen" && (
        <div>
          {!selectedJob ? (
            <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 40, textAlign: "center" }}>
              <p style={{ color: COLORS.textMuted }}>Please post a job first!</p>
              <button onClick={() => setTab("post")} style={{ padding: "10px 24px", background: COLORS.accent, color: "#0a0b0d", border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 16 }}>
                Post a Job
              </button>
            </div>
          ) : (
            <div>
              <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ color: COLORS.text, margin: "0 0 4px", fontSize: 15, fontWeight: 700 }}>{selectedJob.title}</h3>
                    <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 13 }}>{selectedJob.location} · {selectedJob.experience}</p>
                  </div>
                  <button onClick={screenApplications} disabled={screening} style={{
                    padding: "10px 20px", background: screening ? COLORS.border : COLORS.accent,
                    color: "#0a0b0d", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700,
                    cursor: screening ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    {screening ? <><Spinner size={14} color="#0a0b0d" /> Screening...</> : "Screen with AI"}
                  </button>
                </div>
              </div>

              {applications.length === 0 && results.length === 0 && !screening && (
                <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 40, textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                  <p style={{ color: COLORS.textMuted, fontSize: 14 }}>No applications yet.</p>
                  <p style={{ color: COLORS.textMuted, fontSize: 13 }}>Share your job link to start receiving applications!</p>
                  <div style={{ background: COLORS.surface, border: "1px solid " + COLORS.border, borderRadius: 7, padding: "10px 14px", marginTop: 16, fontFamily: "monospace", fontSize: 13, color: COLORS.textMuted }}>
                    hirex.world → Jobs Board
                  </div>
                </div>
              )}

              {visibleResults.sort((a, b) => b.score - a.score).map((r, i) => (
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                    <div>
                      <div style={{ color: COLORS.green, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>STRENGTHS</div>
                      {r.strengths?.map((s, j) => <div key={j} style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 4 }}>+ {s}</div>)}
                    </div>
                    <div>
                      <div style={{ color: COLORS.red, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>CONCERNS</div>
                      {r.concerns?.map((c, j) => <div key={j} style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 4 }}>- {c}</div>)}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ padding: "6px 16px", background: COLORS.green, color: "#0a0b0d", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Shortlist</button>
                    <button style={{ padding: "6px 16px", background: "transparent", color: COLORS.textMuted, border: "1px solid " + COLORS.border, borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Reject</button>
                    <button style={{ padding: "6px 16px", background: COLORS.blue + "20", color: COLORS.blue, border: "1px solid " + COLORS.blue + "40", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Schedule Interview</button>
                  </div>
                </div>
              ))}

              {results.length > 3 && employerPlan === "free" && (
                <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 32, textAlign: "center", marginTop: 12 }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
                  <h3 style={{ color: COLORS.text, margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>
                    {results.length - 3} more candidates hidden
                  </h3>
                  <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "0 0 16px" }}>
                    Upgrade to see all ranked candidates with AI insights.
                  </p>
                  <button onClick={handleEmployerUpgrade} style={{ padding: "12px 28px", background: COLORS.accent, color: "#0a0b0d", border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                    Start 7-Day Free Trial — then $35.99/month
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "candidates" && (
        <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 24 }}>
          <h3 style={{ color: COLORS.text, margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>All Applications</h3>
          {applications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <p style={{ color: COLORS.textMuted }}>No applications yet!</p>
              <button onClick={() => setTab("post")} style={{ padding: "10px 24px", background: COLORS.accent, color: "#0a0b0d", border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 16 }}>
                Post a Job
              </button>
            </div>
          ) : (
            applications.map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid " + COLORS.border }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.accent + "20", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accent, fontWeight: 700, fontSize: 14 }}>
                    {a.applicant_name?.[0] || "?"}
                  </div>
                  <div>
                    <div style={{ color: COLORS.text, fontWeight: 600, fontSize: 14 }}>{a.applicant_name}</div>
                    <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{a.applicant_email}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {a.score && <span style={{ color: scoreColor(a.score), fontWeight: 800, fontSize: 16, fontFamily: "monospace" }}>{a.score}%</span>}
                  <span style={{ background: a.status === "shortlisted" ? COLORS.green + "20" : a.status === "rejected" ? COLORS.red + "20" : COLORS.accent + "20", color: a.status === "shortlisted" ? COLORS.green : a.status === "rejected" ? COLORS.red : COLORS.accent, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {a.status || "pending"}
                  </span>
                  <button onClick={() => updateStatus(a.id, "shortlisted")} style={{ padding: "4px 12px", background: COLORS.green, color: "#0a0b0d", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Shortlist</button>
                  <button onClick={() => updateStatus(a.id, "rejected")} style={{ padding: "4px 12px", background: "transparent", color: COLORS.textMuted, border: "1px solid " + COLORS.border, borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Reject</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
