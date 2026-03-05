import { callClaude } from "./api.js";
import React, { useState } from "react";

const COLORS = {
  bg: "#0a0b0d", surface: "#111318", card: "#161b22", border: "#21262d",
  accent: "#f0b429", green: "#3fb950", blue: "#58a6ff", red: "#f85149",
  text: "#e6edf3", textMuted: "#7d8590",
};

const Spinner = ({ size = 16, color = COLORS.accent }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ animation: "spin 0.8s linear infinite" }}>
    <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2.5" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
  </svg>
);

const ScoreRing = ({ score, color }) => {
  const r = 40, circ = 2 * Math.PI * r, dash = (score / 100) * circ;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke={COLORS.border} strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 50 50)" />
      <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="18" fontWeight="800" fontFamily="monospace">{score}</text>
    </svg>
  );
};

const ScoreBar = ({ label, score, color }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ color: COLORS.text, fontSize: 13 }}>{label}</span>
      <span style={{ color, fontSize: 13, fontWeight: 700 }}>{score}/100</span>
    </div>
    <div style={{ background: COLORS.border, borderRadius: 99, height: 6 }}>
      <div style={{ width: score + "%", height: "100%", background: color, borderRadius: 99, transition: "width 1s ease" }} />
    </div>
  </div>
);

const iStyle = {
  display: "block", width: "100%", boxSizing: "border-box",
  background: COLORS.surface, border: "1px solid " + COLORS.border,
  borderRadius: 7, padding: "10px 14px", color: COLORS.text, fontSize: 13, fontFamily: "inherit", outline: "none",
};

export default function ResumeScorer({ onBack }) {
  const [resume, setResume] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!resume.trim() || !role.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const raw = await callClaude(
        `Analyze this resume for the role of "${role}". Return ONLY a valid JSON object, no markdown, no extra text:
{"overall":78,"ats":85,"keywords":72,"formatting":90,"quantification":65,"screenLikelihood":80,"verdict":"Strong candidate","strengths":["s1","s2","s3"],"improvements":["i1","i2","i3"],"missingKeywords":["k1","k2","k3"],"topSuggestion":"Most important fix"}

RESUME:
${resume}`,
        "Return only raw JSON. No markdown. No extra text."
      );
      const clean = raw.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}") + 1;
      setResult(JSON.parse(clean.slice(start, end)));
    } catch (err) {
      setError("Analysis failed: " + err.message);
    }
    setLoading(false);
  };

  const sc = (s) => s >= 80 ? COLORS.green : s >= 60 ? COLORS.accent : COLORS.red;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <h1 style={{ color: COLORS.text, fontSize: 28, fontWeight: 800, margin: "0 0 8px" }}>ATS Resume Scorer</h1>
        <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 15 }}>AI-powered resume analysis with screen likelihood prediction</p>
      </div>

      <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>TARGET ROLE</label>
          <input value={role} onChange={e => setRole(e.target.value)} style={iStyle} placeholder="e.g. Senior Product Manager" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>PASTE YOUR RESUME</label>
          <textarea value={resume} onChange={e => setResume(e.target.value)} rows={12}
            style={{ ...iStyle, fontFamily: "monospace", fontSize: 12, lineHeight: 1.6, resize: "vertical" }}
            placeholder="Paste your full resume text here..." />
        </div>
        {error && <div style={{ color: COLORS.red, fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={analyze} disabled={loading || !resume.trim() || !role.trim()} style={{
            flex: 1, padding: "12px 24px", background: loading ? COLORS.border : COLORS.accent,
            color: "#0a0b0d", border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {loading ? <><Spinner size={16} color="#0a0b0d" /> Analyzing...</> : "Analyze My Resume"}
          </button>
          {onBack && <button onClick={onBack} style={{ padding: "12px 20px", background: "transparent", color: COLORS.textMuted, border: "1px solid " + COLORS.border, borderRadius: 7, fontSize: 14, cursor: "pointer" }}>Back</button>}
        </div>
      </div>

      {result && (
        <div>
          <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 24, marginBottom: 16 }}>
            <h3 style={{ color: COLORS.text, margin: "0 0 24px", fontSize: 16, fontWeight: 700 }}>Score Overview</h3>
            <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
              {[["Overall", "overall"], ["ATS Compatible", "ats"], ["Keywords", "keywords"], ["Screen Likelihood", "screenLikelihood"]].map(([label, key]) => (
                <div key={key} style={{ textAlign: "center" }}>
                  <ScoreRing score={result[key]} color={sc(result[key])} />
                  <div style={{ color: COLORS.textMuted, fontSize: 12, marginTop: 6 }}>{label}</div>
                </div>
              ))}
            </div>
            <ScoreBar label="Formatting Quality" score={result.formatting} color={sc(result.formatting)} />
            <ScoreBar label="Quantification" score={result.quantification} color={sc(result.quantification)} />
            <div style={{ background: COLORS.surface, borderRadius: 8, padding: "12px 16px", marginTop: 8 }}>
              <span style={{ color: COLORS.textMuted, fontSize: 12 }}>Verdict: </span>
              <span style={{ color: COLORS.text, fontSize: 13, fontWeight: 500 }}>{result.verdict}</span>
            </div>
          </div>

          <div style={{ background: COLORS.accent + "15", border: "1px solid " + COLORS.accent + "40", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>TOP PRIORITY FIX</div>
            <div style={{ color: COLORS.text, fontSize: 14 }}>{result.topSuggestion}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 20 }}>
              <h4 style={{ color: COLORS.green, margin: "0 0 14px", fontSize: 13, fontWeight: 700 }}>STRENGTHS</h4>
              {result.strengths?.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <span style={{ color: COLORS.green }}>+</span>
                  <span style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 20 }}>
              <h4 style={{ color: COLORS.red, margin: "0 0 14px", fontSize: 13, fontWeight: 700 }}>IMPROVEMENTS</h4>
              {result.improvements?.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <span style={{ color: COLORS.red }}>!</span>
                  <span style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.5 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 20 }}>
            <h4 style={{ color: COLORS.blue, margin: "0 0 14px", fontSize: 13, fontWeight: 700 }}>MISSING KEYWORDS</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {result.missingKeywords?.map((k, i) => (
                <span key={i} style={{ background: COLORS.blue + "15", border: "1px solid " + COLORS.blue + "40", color: COLORS.blue, padding: "4px 12px", borderRadius: 20, fontSize: 12 }}>{k}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
