export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { email, name } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    // Send welcome email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "ApplyAI <hello@hirex.world>",
        to: email,
        subject: "Welcome to ApplyAI — Your AI Job Search Starts Now! ⚡",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 60px; height: 60px; background: #f0b429; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 28px;">⚡</div>
              <h1 style="color: #0a0b0d; margin: 16px 0 8px;">Welcome to ApplyAI!</h1>
              <p style="color: #7d8590; margin: 0;">Your AI-powered career platform</p>
            </div>

            <p style="color: #333; line-height: 1.7;">Hi ${name || "there"},</p>
            <p style="color: #333; line-height: 1.7;">Thank you for joining ApplyAI! You're now part of a smarter way to job search.</p>

            <div style="background: #f9f9f9; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <h3 style="margin: 0 0 16px; color: #0a0b0d;">Here's what you can do:</h3>
              <div style="margin-bottom: 12px;">✅ <strong>Upload your CV</strong> — AI reads it instantly</div>
              <div style="margin-bottom: 12px;">✅ <strong>Find real jobs</strong> — from Cisco, Siemens, Deloitte & more</div>
              <div style="margin-bottom: 12px;">✅ <strong>AI tailors your resume</strong> — for each specific job</div>
              <div style="margin-bottom: 12px;">✅ <strong>AI cover letter</strong> — generated in seconds</div>
              <div>✅ <strong>ATS scoring</strong> — know your chances before applying</div>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="https://hirex.world" style="background: #f0b429; color: #0a0b0d; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">
                Start Finding Jobs →
              </a>
            </div>

            <p style="color: #7d8590; font-size: 13px; text-align: center;">
              You're on the free plan — 3 job searches included.<br/>
              Upgrade to Pro for unlimited searches at ₹499/month.
            </p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #aaa; font-size: 12px; text-align: center;">
              ApplyAI · Bengaluru, India · 
              <a href="https://hirex.world" style="color: #aaa;">hirex.world</a>
            </p>
          </div>
        `,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to send email");

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
