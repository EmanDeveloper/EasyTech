type AgentInput = {
  url: string;
  goal: string;
};

function parseSseOutput(raw: string): any[] {
  const lines = raw.split("\n");
  for (const line of lines) {
    if (!line.startsWith("data: ")) continue;
    try {
      const json = JSON.parse(line.slice(6));
      if (json.type === "COMPLETE" && json.resultJson) {
        const resultJson = json.resultJson;
        // Support both { products: [...] } and a top-level array
        if (Array.isArray(resultJson)) return resultJson;
        const key = Object.keys(resultJson)[0];
        if (key && Array.isArray(resultJson[key])) return resultJson[key];
      }
    } catch {
      // skip non-JSON lines
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