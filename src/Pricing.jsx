const COLORS = {
  bg: "#0a0b0d", card: "#161b22", border: "#21262d",
  accent: "#f0b429", green: "#3fb950", blue: "#58a6ff",
  text: "#e6edf3", textMuted: "#7d8590", surface: "#111318",
};

export default function Pricing({ onBack, onUpgrade }) {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      color: COLORS.textMuted,
      features: [
        "3 job searches/month",
        "1 ATS resume score",
        "Basic AI job matching",
        "Email support",
      ],
      cta: "Get Started Free",
    },
    {
      name: "Pro",
      price: "₹499",
      period: "/month",
      color: COLORS.accent,
      highlight: true,
      badge: "Most Popular",
      features: [
        "Unlimited job searches",
        "Unlimited ATS scoring",
        "AI resume tailoring per job",
        "AI cover letter generator",
        "Upload CV — AI reads instantly",
        "Weekly job alert emails",
        "Priority support",
      ],
      cta: "Upgrade to Pro",
    },
    {
      name: "Employer",
      price: "₹2,999",
      period: "/month",
      color: COLORS.blue,
      features: [
        "Post unlimited jobs",
        "AI screens all applicants",
        "Ranked candidate list",
        "ATS score per candidate",
        "Download shortlisted CVs",
        "One-click shortlist/reject",
        "Dedicated support",
      ],
      cta: "Start Hiring",
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ color: COLORS.text, fontSize: 32, fontWeight: 800, margin: "0 0 12px" }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{ color: COLORS.textMuted, fontSize: 16, margin: 0 }}>
          Start free. Upgrade when you're ready.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }}>
        {plans.map(plan => (
          <div key={plan.name} style={{
            background: plan.highlight ? COLORS.accent + "10" : COLORS.card,
            border: "1px solid " + (plan.highlight ? COLORS.accent + "60" : COLORS.border),
            borderRadius: 16, padding: 28, position: "relative",
            display: "flex", flexDirection: "column",
          }}>
            {plan.badge && (
              <div style={{
                position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                background: COLORS.accent, color: "#0a0b0d", padding: "4px 16px",
                borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
              }}>
                {plan.badge}
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: plan.color, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                {plan.name.toUpperCase()}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ color: COLORS.text, fontSize: 36, fontWeight: 800 }}>{plan.price}</span>
                <span style={{ color: COLORS.textMuted, fontSize: 14 }}>{plan.period}</span>
              </div>
            </div>
            <div style={{ flex: 1, marginBottom: 24 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                  <span style={{ color: plan.color, fontSize: 14, marginTop: 1 }}>✓</span>
                  <span style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={() => {
              if (plan.name === "Pro" && onUpgrade) onUpgrade();
              else if (plan.name === "Free" && onBack) onBack();
            }} style={{
              width: "100%", padding: "12px",
              background: plan.highlight ? COLORS.accent : plan.name === "Employer" ? COLORS.blue : "transparent",
              color: plan.highlight || plan.name === "Employer" ? "#0a0b0d" : COLORS.text,
              border: plan.highlight || plan.name === "Employer" ? "none" : "1px solid " + COLORS.border,
              borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 24, marginBottom: 32 }}>
        <h3 style={{ color: COLORS.text, margin: "0 0 16px", fontSize: 16, fontWeight: 700, textAlign: "center" }}>
          All Plans Include
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { icon: "🔒", text: "Data Encrypted" },
            { icon: "🚫", text: "Never Sold" },
            { icon: "✅", text: "DPDP Compliant" },
            { icon: "💳", text: "Cancel Anytime" },
          ].map(item => (
            <div key={item.text} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "0 0 8px" }}>
          7-day money back guarantee on Pro plan
        </p>
        <p style={{ color: COLORS.textMuted, fontSize: 13, margin: 0 }}>
          Questions? Email us at <span style={{ color: COLORS.accent }}>iyerx9@gmail.com</span>
        </p>
        {onBack && (
          <button onClick={onBack} style={{
            marginTop: 16, padding: "8px 20px", background: "transparent",
            color: COLORS.textMuted, border: "1px solid " + COLORS.border,
            borderRadius: 6, fontSize: 13, cursor: "pointer",
          }}>
            Back to App
          </button>
        )}
      </div>
    </div>
  );
}
