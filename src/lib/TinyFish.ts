type AgentInput = {
  url: string;
  goal: string;
};

function parseSseOutput(raw: string): any[] {
  // SSE events are separated by blank lines; each event may have multiple "data:" lines
  const events = raw.split(/\n\n|\r\n\r\n/);

  for (const event of events) {
    // Collect and join all data: lines within this event
    const dataLines = event
      .split(/\r?\n/)
      .filter((l) => l.startsWith("data: "))
      .map((l) => l.slice(6));

    if (dataLines.length === 0) continue;

    const combined = dataLines.join("");
    try {
      const json = JSON.parse(combined);
      if (json.type === "COMPLETE") {
        // TinyFish may use "resultJson" or "result"
        const payload = json.resultJson ?? json.result;
        if (!payload) continue;

        if (Array.isArray(payload)) return payload;

        // Prefer explicit known array keys, then fall back to first array value
        const preferredKeys = ["results", "products", "items", "data"];
        for (const key of preferredKeys) {
          if (Array.isArray(payload[key])) return payload[key];
        }
        const fallbackKey = Object.keys(payload).find((k) => Array.isArray(payload[k]));
        if (fallbackKey) return payload[fallbackKey];
      }
    } catch {
      // not valid JSON — skip
    }
  }
  return [];
}

export async function runAgentTinyFish(prompt: AgentInput | AgentInput[]): Promise<any[]> {
  const inputs = Array.isArray(prompt) ? prompt : [prompt];

  async function run(input: AgentInput): Promise<any[]> {
    const response = await fetch("https://agent.tinyfish.ai/v1/automation/run-sse", {
      method: "POST",
      headers: {
        "X-API-Key": process.env.TINYFISH_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: input.url,
        goal: input.goal,
      }),
    });

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let raw = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value);
    }

    return parseSseOutput(raw);
  }

  const results = await Promise.all(inputs.map(run));
  // Flatten all product arrays from all runs
  return results.flat();
}