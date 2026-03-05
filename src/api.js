export const callClaude = async (prompt, system) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1000,
        system: system || "You are a helpful AI assistant.",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    return data.content?.map((b) => b.text || "").join("") || "";
  } finally {
    clearTimeout(timeout);
  }
};
