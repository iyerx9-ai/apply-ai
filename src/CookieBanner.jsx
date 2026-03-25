import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieAccepted");
    if (!accepted) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookieAccepted", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: "#161b22", borderTop: "1px solid #21262d",
      padding: "14px 24px", display: "flex", alignItems: "center",
      justifyContent: "space-between", flexWrap: "wrap", gap: 12,
    }}>
      <p style={{ color: "#7d8590", fontSize: 13, margin: 0, flex: 1 }}>
        🍪 We use essential cookies only for authentication. No tracking, no ads.{" "}
        <span onClick={() => window.location.hash = "privacy"} style={{ color: "#f0b429", cursor: "pointer" }}>
          Privacy Policy
        </span>
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={accept} style={{
          padding: "8px 20px", background: "#f0b429", color: "#0a0b0d",
          border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer"
        }}>
          Accept
        </button>
      </div>
    </div>
  );
}
