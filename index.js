const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-User-Api-Key"
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (url.pathname !== "/generate" || request.method !== "POST") {
      return json({ error: "Not found. Use POST /generate." }, 404);
    }

    const apiKey = request.headers.get("X-User-Api-Key");
    if (!apiKey) return json({ error: "Missing AI API key. Add it in SellWise AI Settings." }, 401);

    let body;
    try { body = await request.json(); }
    catch { return json({ error: "Request body must be valid JSON." }, 400); }

    const model = typeof body.model === "string" ? body.model.slice(0, 100) : "gpt-4o-mini";
    const prompt = typeof body.prompt === "string" ? body.prompt.slice(0, 12000) : "";
    if (!prompt.trim()) return json({ error: "Please provide a prompt." }, 400);

    try {
      const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "You are SellWise AI, a practical and ethical marketing assistant for digital entrepreneurs. Never fabricate evidence, testimonials, credentials or guaranteed outcomes." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        })
      });
      const result = await upstream.json();
      if (!upstream.ok) {
        const message = result?.error?.message || "The AI provider rejected the request.";
        return json({ error: message }, upstream.status);
      }
      const text = result?.choices?.[0]?.message?.content || "";
      return json({ text });
    } catch {
      return json({ error: "Could not reach the AI provider. Please try again." }, 502);
    }
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
