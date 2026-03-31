import { useState } from "react";

const COLORS = {
  bg: "#0a0b0d", card: "#161b22", border: "#21262d",
  accent: "#f0b429", green: "#3fb950", text: "#e6edf3", textMuted: "#7d8590",
};

export default function Paywall({ onClose, reason = "searches", user, onUpgradeSuccess }) {
  const handlePayment = () => {
    window.open("https://imjo.in/MKyfkZ", "_blank");
    if (onUpgradeSuccess) onUpgradeSuccess();
  };

  const [showUPI, setShowUPI] = useState(false);

  const handleUPI = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.open("upi://pay?pa=9985847014@jupiteraxis&pn=ApplyAI&am=499&cu=INR&tn=ApplyAI+Pro+Plan", "_blank");
    } else {
      setShowUPI(true);
    }
  };

  const handlePaddle = () => {
    if (window.Paddle) {
      window.Paddle.Environment.set("production");
      window.Paddle.Initialize({ token: "live_040d02e495a75071975e3dee5d3" });
      window.Paddle.Checkout.open({
        items: [{ priceId: "pri_01kmzkr4pr65s00cqfwc83n3ch", quantity: 1 }],
        customer: { email: user?.email || "" },
        successUrl: "https://hirex.world",
      });
    }
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
          border: "none", borderRadius: 8, fontSize: 15, fontWeight: 800, cursor: "pointer", marginBottom: 10,
        }}>
          Pay with Card / Netbanking — ₹499
        </button>
        <button onClick={handleUPI} style={{
          width: "100%", padding: "14px", background: "#4CAF50", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 15, fontWeight: 800, cursor: "pointer", marginBottom: 10,
        }}>
          Pay with UPI — ₹499
        </button>
        {showUPI && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, marginBottom: 10, textAlign: "center" }}>
            <p style={{ color: "#333", fontSize: 13, margin: "0 0 12px", fontWeight: 600 }}>
              Scan QR code with any UPI app
            </p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent("upi://pay?pa=9985847014@jupiteraxis&pn=ApplyAI&am=499&cu=INR&tn=ApplyAI+Pro+Plan")}`}
              alt="UPI QR Code"
              style={{ width: 180, height: 180, borderRadius: 8 }}
            />
            <p style={{ color: "#666", fontSize: 12, margin: "12px 0 4px" }}>UPI ID: 9985847014@jupiteraxis</p>
            <p style={{ color: "#666", fontSize: 12, margin: 0 }}>Amount: ₹499</p>
            <p style={{ color: "#999", fontSize: 11, margin: "8px 0 0" }}>
              After payment, email iyerx9@gmail.com with screenshot
            </p>
            <button onClick={() => setShowUPI(false)} style={{
              marginTop: 12, padding: "6px 16px", background: "transparent",
              color: "#999", border: "1px solid #ddd", borderRadius: 6,
              fontSize: 12, cursor: "pointer"
            }}>Close</button>
          </div>
        )}
        <button onClick={handlePaddle} style={{
          width: "100%", padding: "14px", background: "#0066FF", color: "#fff",
          border: "none", borderRadius: 8, fontSize: 15, fontWeight: 800, cursor: "pointer", marginBottom: 12,
        }}>
          Pay with Card — $6.99/month 🌍
        </button>
        <div onClick={onClose} style={{ color: COLORS.textMuted, fontSize: 13, cursor: "pointer" }}>
          Maybe later
        </div>
      </div>
    </div>
  );
}
