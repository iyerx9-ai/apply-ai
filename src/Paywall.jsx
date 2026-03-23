const COLORS = {
  bg: "#0a0b0d", card: "#161b22", border: "#21262d",
  accent: "#f0b429", green: "#3fb950", text: "#e6edf3", textMuted: "#7d8590",
};

export default function Paywall({ onClose, reason = "searches", user, onUpgradeSuccess }) {
  const handlePayment = () => {
    window.open("https://imjo.in/MKyfkZ", "_blank");
    if (onUpgradeSuccess) onUpgradeSuccess();
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 16, width: "100%", maxWidth: 440, padding: 36, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
        <h2 style={{ color: COLORS.text, margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>
          You've used your free {reason}
        </h2>
        <p style={{ color: COLORS.textMuted, margin: "0 0 28px", fontSize: 14, lineHeight: 1.6 }}>
          Upgrade to Pro to unlock unlimited job searches, applications, and AI resume tailoring.
        </p>
        <div style={{ background: "#0d1117", border: "1px solid " + COLORS.border, borderRadius: 12, padding: 20, marginBottom: 24, textAlign: "left" }}>
          <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 13, marginBottom: 12 }}>PRO PLAN — ₹499/month</div>
          {["Unlimited job searches", "Unlimited AI applications", "Priority ATS scoring", "Resume improvement AI", "Cover letter generator", "Job alert emails"].map(f => (
            <div key={f} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
              <span style={{ color: COLORS.green, fontSize: 14 }}>✓</span>
              <span style={{ color: COLORS.text, fontSize: 13 }}>{f}</span>
            </div>
          ))}
        </div>
        <button onClick={handlePayment} style={{
          width: "100%", padding: "14px", background: COLORS.accent, color: "#0a0b0d",
          border: "none", borderRadius: 8, fontSize: 15, fontWeight: 800, cursor: "pointer", marginBottom: 12,
        }}>
          Upgrade to Pro — ₹499/month
        </button>
        <div onClick={onClose} style={{ color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>
          Maybe later
        </div>
      </div>
    </div>
  );
}
