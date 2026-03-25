export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { role, skills, location, resume } = req.body;

  try {
    // Get AI to suggest related roles
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: `Based on this person's CV, suggest 3 alternative job roles they should also search for.
Role: ${role}
Skills: ${skills?.join(", ")}
CV Summary: ${resume?.slice(0, 500)}

Return ONLY a JSON array of 3 strings, no markdown:
["Role 1", "Role 2", "Role 3"]`
        }]
      }),
    });
    const data = await response.json();
    const text = data.content?.[0]?.text || "[]";
    const clean = text.replace(/\`\`\`json|\`\`\`/g, "").trim();
    const roles = JSON.parse(clean);

    // Fetch jobs for each recommended role
    const allJobs = [];
    for (const recRole of roles.slice(0, 2)) {
      const jobRes = await fetch(
        `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(recRole + " " + (location || ""))}&page=1&num_pages=1&country=in`,
        {
          headers: {
            "x-rapidapi-host": "jsearch.p.rapidapi.com",
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
          },
        }
      );
      const jobData = await jobRes.json();
      const jobs = (jobData.data || []).slice(0, 2).map(j => ({
        id: j.job_id,
        title: j.job_title,
        company: j.employer_name,
        location: j.job_city ? `${j.job_city}, ${j.job_country}` : j.job_country || "Remote",
        type: j.job_is_remote ? "Remote" : "On-site",
        salary: "Competitive",
        match: Math.floor(70 + Math.random() * 15),
        tags: skills?.slice(0, 3) || [],
        posted: j.job_posted_at_datetime_utc ? new Date(j.job_posted_at_datetime_utc).toLocaleDateString() : "Recently",
        desc: j.job_description ? j.job_description.slice(0, 150) + "..." : "Exciting opportunity.",
        requirements: j.job_highlights?.Qualifications?.slice(0, 3) || ["Relevant experience", "Good communication"],
        applyLink: j.job_apply_link,
        recommendedRole: recRole,
      }));
      allJobs.push(...jobs);
    }

    res.status(200).json({ roles, jobs: allJobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
