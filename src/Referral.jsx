import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const COLORS = {
  bg: "#0a0b0d", card: "#161b22", border: "#21262d",
  accent: "#f0b429", green: "#3fb950", text: "#e6edf3", textMuted: "#7d8590",
};

export default function Referral({ user }) {
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) loadReferralData();
  }, [user]);

  const loadReferralData = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("referral_code, referral_count")
      .eq("id", user.id)
      .single();
    if (data) {
      setReferralCode(data.referral_code || "");
      setReferralCount(data.referral_count || 0);
    }
  };

  const referralLink = `https://hirex.world?ref=${referralCode}`;

  const copy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 24, marginTop: 20 }}>
      <h3 style={{ color: COLORS.text, margin: "0 0 6px", fontSize: 16, fontWeight: 700 }}>
        Refer Friends — Get 1 Month Free!
      </h3>
      <p style={{ color: COLORS.textMuted, fontSize: 13, margin: "0 0 20px", lineHeight: 1.6 }}>
        Share your referral link. When a friend signs up and upgrades, you both get 1 month Pro free!
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#0a0b0d", borderRadius: 8, padding: 16, textAlign: "center" }}>
          <div style={{ color: COLORS.accent, fontSize: 28, fontWeight: 800 }}>{referralCount}</div>
          <div style={{ color: COLORS.textMuted, fontSize: 12 }}>Friends referred</div>
        </div>
        <div style={{ background: "#0a0b0d", borderRadius: 8, padding: 16, textAlign: "center" }}>
          <div style={{ color: COLORS.green, fontSize: 28, fontWeight: 800 }}>{referralCount}</div>
          <div style={{ color: COLORS.textMuted, fontSize: 12 }}>Free months earned</div>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", color: COLORS.textMuted, fontSize: 11, letterSpacing: "0.07em", marginBottom: 6, fontWeight: 600 }}>YOUR REFERRAL LINK</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={referralLink}
            readOnly
            style={{ flex: 1, background: "#0a0b0d", border: "1px solid " + COLORS.border, borderRadius: 7, padding: "10px 14px", color: COLORS.textMuted, fontSize: 13, fontFamily: "monospace" }}
          />
          <button onClick={copy} style={{
            padding: "10px 20px", background: copied ? COLORS.green : COLORS.accent,
            color: "#0a0b0d", border: "none", borderRadius: 7, fontSize: 13,
            fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
          }}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent("Try HireX — AI job search platform! Upload CV → AI finds jobs → AI applies for you. Free to try: " + referralLink)}`, "_blank")}
          style={{ flex: 1, padding: "10px", background: "#25D366", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Share on WhatsApp
        </button>
        <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, "_blank")}
          style={{ flex: 1, padding: "10px", background: "#0077B5", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          Share on LinkedIn
        </button>
      </div>
    </div>
  );
}
