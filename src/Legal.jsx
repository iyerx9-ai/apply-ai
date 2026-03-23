const COLORS = {
  bg: "#0a0b0d", card: "#161b22", border: "#21262d",
  accent: "#f0b429", text: "#e6edf3", textMuted: "#7d8590",
};

export function TermsPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", fontFamily: "'DM Sans', sans-serif", color: COLORS.text }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Terms and Conditions</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Last updated: March 2026</p>
      {[
        ["1. Acceptance of Terms", "By accessing ApplyAI at apply-ai-alpha.vercel.app, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform."],
        ["2. Description of Service", "ApplyAI is an AI-powered job search and career platform that helps job seekers find relevant jobs, score resumes against ATS systems, and generate AI-tailored resumes. We are a technology platform and not an employer or recruitment agency."],
        ["3. User Accounts", "You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to use this service."],
        ["4. Subscription and Payments", "ApplyAI offers a free tier with limited searches and a Pro plan at ₹499/month. Payments are processed securely through our payment partners. Subscriptions auto-renew monthly unless cancelled."],
        ["5. AI-Generated Content", "ApplyAI uses artificial intelligence to generate job matches, resume suggestions, and cover letters. We do not guarantee the accuracy or suitability of AI-generated content. Users should review all AI-generated content before use."],
        ["6. Job Listings", "Job listings on ApplyAI are sourced from third-party job boards. We do not guarantee the accuracy, completeness, or availability of any job listing. We are not responsible for the hiring decisions of any employer."],
        ["7. Limitation of Liability", "ApplyAI is provided as is without warranties of any kind. We are not liable for any direct, indirect, or consequential damages arising from use of our platform. We do not guarantee job placement or employment outcomes."],
        ["8. Privacy", "We collect and process personal data as described in our Privacy Policy. By using ApplyAI, you consent to our data practices."],
        ["9. Termination", "We reserve the right to terminate or suspend accounts that violate these terms. Users may cancel their subscription at any time."],
        ["10. Governing Law", "These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Bengaluru, Karnataka."],
        ["11. Contact", "For questions about these terms, contact us at iyerx9@gmail.com"],
      ].map(([title, content]) => (
        <div key={title} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
          <p style={{ color: COLORS.textMuted, lineHeight: 1.7, margin: 0 }}>{content}</p>
        </div>
      ))}
    </div>
  );
}

export function RefundPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", fontFamily: "'DM Sans', sans-serif", color: COLORS.text }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Refund and Cancellation Policy</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>Last updated: March 2026</p>
      {[
        ["Subscription Cancellation", "You may cancel your Pro subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period. You will retain Pro access until the end of the paid period."],
        ["Refund Policy", "We offer a 7-day money-back guarantee for first-time Pro subscribers. If you are not satisfied within 7 days of your first payment, contact us at iyerx9@gmail.com for a full refund. Refunds are not available after 7 days or for renewal payments."],
        ["How to Request a Refund", "Email iyerx9@gmail.com with your registered email address and reason for refund. Refunds are processed within 5-7 business days to your original payment method."],
        ["Non-Refundable Items", "Partial month subscriptions, accounts found violating our Terms of Service, and payments older than 7 days are not eligible for refunds."],
        ["Contact", "For refund queries contact us at iyerx9@gmail.com"],
      ].map(([title, content]) => (
        <div key={title} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</h2>
          <p style={{ color: COLORS.textMuted, lineHeight: 1.7, margin: 0 }}>{content}</p>
        </div>
      ))}
    </div>
  );
}

export function ContactPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", fontFamily: "'DM Sans', sans-serif", color: COLORS.text }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Contact Us</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 32 }}>We are here to help!</p>
      <div style={{ background: COLORS.card, border: "1px solid " + COLORS.border, borderRadius: 12, padding: 28 }}>
        {[
          ["Email", "iyerx9@gmail.com"],
          ["Website", "https://apply-ai-alpha.vercel.app"],
          ["Location", "Bengaluru, Karnataka, India"],
          ["Support Hours", "Monday - Friday, 9am - 6pm IST"],
        ].map(([label, value]) => (
          <div key={label} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 14, minWidth: 120 }}>{label}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 14 }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
