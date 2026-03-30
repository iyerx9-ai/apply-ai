import { useState } from "react";
import { supabase } from "./supabase";

const COLORS = {
  bg: "#0a0b0d", surface: "#111318", card: "#161b22", border: "#21262d",
  accent: "#f0b429", text: "#e6edf3", textMuted: "#7d8590", red: "#f85149", green: "#3fb950",
};

const iStyle = {
  display: "block", width: "100%", boxSizing: "border-box",
  background: "#0d1117", border: "1px solid " + COLORS.border,
  borderRadius: 7, padding: "10px 14px", color: COLORS.text,
  fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 12,
};

export default function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) setError(error.message);
  };

  const handle = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin(data.user);
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your email to confirm your account!");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, background: COLORS.accent, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>⚡</div>
          <h1 style={{ color: COLORS.text, margin: "0 0 6px", fontSize: 24, fontWeight: 800 }}>ApplyAI</h1>
          <p style={{ color: COLORS.textMuted, margin: 0, fontSize: 14 }}>{mode === "login" ? "Welcome back" : "Create your account"}</p>
        </div>
        <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 28 }}>
          <input value={email} onChange={e => setEmail(e.target.value)} style={iStyle} placeholder="Email address" type="email" />
          <input value={password} onChange={e => setPassword(e.target.value)} style={iStyle} placeholder="Password" type="password" onKeyDown={e => e.key === "Enter" && handle()} />
          {error && <div style={{ color: COLORS.red, fontSize: 13, marginBottom: 12 }}>{error}</div>}
          {message && <div style={{ color: COLORS.green, fontSize: 13, marginBottom: 12 }}>{message}</div>}
          <button onClick={handle} disabled={loading} style={{
            width: "100%", padding: "12px", background: COLORS.accent, color: "#0a0b0d",
            border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
          }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
            <div style={{ flex: 1, height: 1, background: COLORS.border }} />
            <span style={{ color: COLORS.textMuted, fontSize: 12 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: COLORS.border }} />
          </div>
          <button onClick={handleGoogle} style={{
            width: "100%", padding: "11px", background: "#fff", color: "#333",
            border: "1px solid #ddd", borderRadius: 7, fontSize: 14, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="Google" />
            Continue with Google
          </button>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span style={{ color: COLORS.textMuted, fontSize: 13 }}>
              {mode === "login" ? "No account? " : "Have an account? "}
              <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}
                style={{ color: COLORS.accent, cursor: "pointer", fontWeight: 600 }}>
                {mode === "login" ? "Sign up free" : "Sign in"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
