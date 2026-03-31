import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { callClaude } from "./api.js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const COLORS = {
  bg: "#0a0b0d", surface: "#111318", card: "#161b22", border: "#21262d",
  accent: "#f0b429", green: "#3fb950", blue: "#58a6ff", red: "#f85149",
  text: "#e6edf3", textMuted: "#7d8590",
};

export default function Jobs({ user, onBack }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [cv, setCv] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [applied, setApplied] = useState([]);
  const [showModal, setShowModal] = useState(null);

  useEffect(() => {
    loadJobs();
    if (user) {
      setEmail(user.email || "");
      setName(user.user_metadata?.full_name || "");
    }
  }, [user]);

  const loadJobs = async () => {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (data) setJobs(data);
    setLoading(false);
  };

  const applyToJob = async (job) => {
    if (!cv || !name || !email) return;
    setApplying(job.id);
    try {
      await supabase.from("applications").insert({
        job_id: job.id,
        applicant_id: user?.id || null,
        applicant_name: name,
        applicant_email: email,
        cv_text: cv,
        status: "pending",
      });
      setApplied(prev => [...prev, job.id]);
      setShowModal(null);
    } catch (err) {
      console.error(err);
    }
    setApplying(null);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 0 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: COLORS.text, margin: "0 0 4px", fontSize: 24, fontWeight: 800 }}>Jobs Board</h1>
          <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 14 }}>
            {jobs.length} active positions — apply with AI in seconds
          </p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ padding: "8px 16px", background: "transparent", color: COLORS.textMuted, border: "1px solid " + COLORS.border, borderRadius: 7, cursor: "pointer", fontSize: 13 }}>
            Back
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: COLORS.textMuted }}>Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
          <p style={{ color: COLORS.textMuted }}>No jobs posted yet. Check back soon!</p>
        </div>
      ) : (
        jobs.map(job => (
          <div key={job.id} style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <h3 style={{ color: COLORS.text, margin: "0 0 6px", fontSize: 18, fontWeight: 700 }}>{job.title}</h3>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {job.location && <span style={{ color: COLORS.textMuted, fontSize: 13 }}>📍 {job.location}</span>}
                  {job.experience && <span style={{ color: COLORS.textMuted, fontSize: 13 }}>⏱ {job.experience}</span>}
                  <span style={{ color: COLORS.textMuted, fontSize: 13 }}>🗓 {new Date(job.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {applied.includes(job.id) ? (
                <span style={{ background: COLORS.green + "20", color: COLORS.green, padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                  Applied ✓
                </span>
              ) : (
                <button onClick={() => setShowModal(job)} style={{
                  padding: "10px 20px", background: COLORS.accent, color: "#0a0b0d",
                  border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}>
                  Apply Now
                </button>
              )}
            </div>
            {job.skills && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {job.skills.split(",").map(s => (
                  <span key={s} style={{ background: COLORS.accent + "15", color: COLORS.accent, padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>
                    {s.trim()}
                  </span>
                ))}
              </div>
            )}
            <p style={{ color: COLORS.textMuted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
              {job.description?.slice(0, 200)}...
            </p>
          </div>
        ))
      )}

      {showModal && (
        <div onClick={() => setShowModal(null)} style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, width: "100%", maxWidth: 560, padding: 28 }}>
            <h3 style={{ color: COLORS.text, margin: "0 0 6px", fontSize: 18, fontWeight: 700 }}>Apply for {showModal.title}</h3>
            <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "0 0 20px" }}>AI will score your application automatically</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>YOUR NAME</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
                  style={{ display: "block", width: "100%", boxSizing: "border-box", background: COLORS.surface, border: "1px solid " + COLORS.border, borderRadius: 7, padding: "10px 14px", color: COLORS.text, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>EMAIL</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email"
                  style={{ display: "block", width: "100%", boxSizing: "border-box", background: COLORS.surface, border: "1px solid " + COLORS.border, borderRadius: 7, padding: "10px 14px", color: COLORS.text, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>YOUR CV / RESUME</label>
              <textarea value={cv} onChange={e => setCv(e.target.value)} rows={8}
                style={{ display: "block", width: "100%", boxSizing: "border-box", background: COLORS.surface, border: "1px solid " + COLORS.border, borderRadius: 7, padding: "10px 14px", color: COLORS.text, fontSize: 12, fontFamily: "monospace", outline: "none", resize: "vertical" }}
                placeholder="Paste your CV/resume here..." />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => applyToJob(showModal)} disabled={applying === showModal.id || !cv || !name || !email} style={{
                flex: 1, padding: "12px", background: COLORS.accent, color: "#0a0b0d",
                border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700,
                cursor: applying ? "not-allowed" : "pointer",
              }}>
                {applying === showModal.id ? "Submitting..." : "Submit Application"}
              </button>
              <button onClick={() => setShowModal(null)} style={{ padding: "12px 20px", background: "transparent", color: COLORS.textMuted, border: "1px solid " + COLORS.border, borderRadius: 7, fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
