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

export function AboutPage() {
  const COLORS_LOCAL = {
    bg: "#0a0b0d", card: "#161b22", border: "#21262d",
    accent: "#f0b429", green: "#3fb950", blue: "#58a6ff",
    text: "#e6edf3", textMuted: "#7d8590",
  };
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px", fontFamily: "'DM Sans', sans-serif", color: COLORS_LOCAL.text }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⚡</div>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>About ApplyAI</h1>
        <p style={{ color: COLORS_LOCAL.textMuted, fontSize: 16, lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
          ApplyAI is an AI-powered career platform that helps job seekers find the right jobs faster and helps employers find the right candidates smarter.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 40 }}>
        {[
          { icon: "🤖", title: "AI Job Matching", desc: "Our AI searches thousands of real job listings worldwide and matches them to your skills, experience and location in seconds." },
          { icon: "📄", title: "ATS Resume Scorer", desc: "Know your chances before you apply. Our AI scores your resume against ATS systems and tells you exactly what to fix." },
          { icon: "✍️", title: "AI Resume Tailoring", desc: "Every job is different. Our AI tailors your resume for each specific job, highlighting the most relevant experience." },
          { icon: "🌍", title: "Worldwide Job Search", desc: "Search jobs in any city, country or remote worldwide. From Bengaluru to Berlin, Tokyo to Toronto — we find them all." },
          { icon: "⚡", title: "One-Click Apply", desc: "Apply to multiple jobs in minutes with AI-tailored resumes for each role. Save hours of manual work." },
          { icon: "🏢", title: "Employer Dashboard", desc: "Employers can post jobs and let our AI screen and rank all applicants automatically. Find the best candidates in minutes." },
        ].map(f => (
          <div key={f.title} style={{ background: COLORS_LOCAL.card, border: "1px solid " + COLORS_LOCAL.border, borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ color: COLORS_LOCAL.text, fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
            <p style={{ color: COLORS_LOCAL.textMuted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: COLORS_LOCAL.card, border: "1px solid " + COLORS_LOCAL.border, borderRadius: 12, padding: 32, marginBottom: 32, textAlign: "center" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Our Mission</h2>
        <p style={{ color: COLORS_LOCAL.textMuted, fontSize: 15, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>
          Finding a job should not take months. Getting the right candidate should not take weeks. 
          We built ApplyAI to make hiring faster, fairer, and smarter for everyone — 
          using the power of artificial intelligence.
        </p>
      </div>

      <div style={{ background: COLORS_LOCAL.card, border: "1px solid " + COLORS_LOCAL.border, borderRadius: 12, padding: 32, marginBottom: 32 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, textAlign: "center" }}>Pricing</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { name: "Free", price: "₹0", features: ["3 job searches", "1 resume score", "Basic matching"] },
            { name: "Pro", price: "₹499/mo", features: ["Unlimited searches", "Unlimited scoring", "AI resume tailoring", "Cover letter generator", "Priority support"], highlight: true },
            { name: "Employer", price: "₹2,999/mo", features: ["Post unlimited jobs", "AI candidate screening", "Ranked applicants", "ATS scoring for CVs"] },
          ].map(p => (
            <div key={p.name} style={{ background: p.highlight ? COLORS_LOCAL.accent + "15" : COLORS_LOCAL.bg, border: "1px solid " + (p.highlight ? COLORS_LOCAL.accent + "60" : COLORS_LOCAL.border), borderRadius: 10, padding: 20, textAlign: "center" }}>
              <div style={{ color: p.highlight ? COLORS_LOCAL.accent : COLORS_LOCAL.text, fontWeight: 800, fontSize: 16, marginBottom: 6 }}>{p.name}</div>
              <div style={{ color: p.highlight ? COLORS_LOCAL.accent : COLORS_LOCAL.text, fontSize: 22, fontWeight: 800, marginBottom: 16 }}>{p.price}</div>
              {p.features.map(f => (
                <div key={f} style={{ color: COLORS_LOCAL.textMuted, fontSize: 12, marginBottom: 6 }}>✓ {f}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <p style={{ color: COLORS_LOCAL.textMuted, fontSize: 14 }}>
          Built with ❤️ in Bengaluru, India<br />
          Contact: iyerx9@gmail.com
        </p>
      </div>
    </div>
  );
}
