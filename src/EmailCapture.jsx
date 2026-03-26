import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0a0b0d", card: "#161b22", border: "#21262d",
  accent: "#f0b429", text: "#e6edf3", textMuted: "#7d8590",
  green: "#3fb950",
};

export default function EmailCapture({ user }) {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Show popup after 30 seconds if not logged in and not already subscribed
    if (!user && !localStorage.getItem("emailCaptured")) {
      const timer = setTimeout(() => setShow(true), 30000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const subscribe = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      localStorage.setItem("emailCaptured", "true");
      setDone(true);
      setTimeout(() => setShow(false), 3000);
    } catch (err) {
      console.log("Subscribe error:", err);
    }
    setLoading(false);
  };

  if (!show) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000aa", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 16, width: "100%", maxWidth: 420, padding: 36, textAlign: "center", position: "relative" }}>
        <button onClick={() => setShow(false)} style={{ position: "absolute", top: 12, right: 16, background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 20 }}>×</button>

        {done ? (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h2 style={{ color: COLORS.text, margin: "0 0 8px" }}>You're in!</h2>
            <p style={{ color: COLORS.textMuted, margin: 0 }}>Check your inbox for a welcome email!</p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
            <h2 style={{ color: COLORS.text, margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>Get Weekly Job Alerts</h2>
            <p style={{ color: COLORS.textMuted, margin: "0 0 24px", fontSize: 14, lineHeight: 1.6 }}>
              Get the top 10 jobs matching your profile every Monday morning. Free forever.
            </p>

            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              style={{ display: "block", width: "100%", boxSizing: "border-box", background: "#0d1117", border: "1px solid " + COLORS.border, borderRadius: 7, padding: "10px 14px", color: COLORS.text, fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 10 }}
            />
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && subscribe()}
              placeholder="Your email address"
              type="email"
              style={{ display: "block", width: "100%", boxSizing: "border-box", background: "#0d1117", border: "1px solid " + COLORS.border, borderRadius: 7, padding: "10px 14px", color: COLORS.text, fontSize: 14, fontFamily: "inherit", outline: "none", marginBottom: 16 }}
            />

            <button onClick={subscribe} disabled={loading || !email} style={{
              width: "100%", padding: "12px", background: COLORS.accent, color: "#0a0b0d",
              border: "none", borderRadius: 7, fontSize: 14, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer", marginBottom: 12,
            }}>
              {loading ? "Subscribing..." : "Get Free Job Alerts →"}
            </button>

            <div onClick={() => setShow(false)} style={{ color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>
              No thanks
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
