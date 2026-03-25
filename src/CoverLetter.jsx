import { useState } from "react";
import { callClaude } from "./api.js";

const COLORS = {
  bg: "#0a0b0d", surface: "#111318", card: "#161b22", border: "#21262d",
  accent: "#f0b429", green: "#3fb950", text: "#e6edf3", textMuted: "#7d8590", red: "#f85149",
};

const iStyle = {
  display: "block", width: "100%", boxSizing: "border-box",
  background: COLORS.surface, border: "1px solid " + COLORS.border,
  borderRadius: 7, padding: "10px 14px", color: COLORS.text,
  fontSize: 13, fontFamily: "inherit", outline: "none",
};

const Spinner = ({ size = 16, color = COLORS.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite" }}>
    <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
  </svg>
);

export default function CoverLetter({ onBack }) {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [resume, setResume] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!jobTitle || !company || !resume) return;
    setLoading(true);
    setResult("");
    setError("");
    try {
      const letter = await callClaude(
        `Write a ${tone.toLowerCase()} cover letter for:
Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDesc || "Not provided"}

Resume:
${resume}

Write a compelling 3-paragraph cover letter. Be specific, avoid clichés, and match the tone to ${company}'s culture. Do not use placeholders like [Your Name].`,
        "You are an expert career coach and cover letter writer. Write compelling, personalized cover letters."
      );
      setResult(letter);
    } catch (err) {
      setError("Failed to generate: " + err.message);
    }
    setLoading(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h1 style={{ color: COLORS.text, fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>Cover Letter Generator</h1>
        <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 15 }}>AI-powered personalized cover letters in seconds</p>
      </div>

      <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>JOB TITLE</label>
            <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} style={iStyle} placeholder="e.g. Software Engineer" />
          </div>
          <div>
            <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>COMPANY</label>
            <input value={company} onChange={e => setCompany(e.target.value)} style={iStyle} placeholder="e.g. Google" />
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>TONE</label>
          <select value={tone} onChange={e => setTone(e.target.value)} style={{ ...iStyle, cursor: "pointer" }}>
            {["Professional", "Enthusiastic", "Creative", "Concise", "Formal"].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>JOB DESCRIPTION (optional)</label>
          <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} rows={3} style={{ ...iStyle, resize: "vertical" }} placeholder="Paste the job description for a more targeted letter..." />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>YOUR RESUME</label>
          <textarea value={resume} onChange={e => setResume(e.target.value)} rows={6} style={{ ...iStyle, fontFamily: "monospace", fontSize: 12, resize: "vertical" }} placeholder="Paste your resume here..." />
        </div>
        {error && <div style={{ color: COLORS.red, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={generate} disabled={loading || !jobTitle || !company || !resume} style={{
            flex: 1, padding: "12px", background: loading ? COLORS.border : COLORS.accent,
            color: "#0a0b0d", border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {loading ? <><Spinner size={16} color="#0a0b0d" /> Generating...</> : "✍️ Generate Cover Letter"}
          </button>
          {onBack && <button onClick={onBack} style={{ padding: "12px 20px", background: "transparent", color: COLORS.textMuted, border: "1px solid " + COLORS.border, borderRadius: 7, fontSize: 14, cursor: "pointer" }}>Back</button>}
        </div>
      </div>

      {result && (
        <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: COLORS.text, margin: 0, fontSize: 16, fontWeight: 700 }}>Your Cover Letter</h3>
            <button onClick={copy} style={{ padding: "6px 16px", background: copied ? COLORS.green : COLORS.accent, color: "#0a0b0d", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <pre style={{ background: COLORS.surface, border: "1px solid " + COLORS.border, borderRadius: 8, padding: 20, fontSize: 13, lineHeight: 1.8, color: COLORS.text, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, fontFamily: "inherit" }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
