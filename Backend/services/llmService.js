const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

async function llmService(prompt) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/owl-alpha",
        messages: [
          {
            role: "system",
            content: "You are a JSON API. You must only return valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        reasoning: {
          enabled: true,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  const result = await response.json();

  const content = result?.choices?.[0]?.message?.content;

if (!content) {
  console.log(
    "Unexpected LLM Response:",
    JSON.stringify(result, null, 2)
  );

  throw new Error("LLM returned empty content");
}

// Extract the first JSON object from the response
const match = content.match(/\{[\s\S]*\}/);

if (!match) {
  console.log("Raw model output:", content);
  throw new Error("No JSON found in model response");
}

try {
  return JSON.parse(match[0]);
} catch (err) {
  console.log("Failed JSON:", match[0]);
  throw err;
}
}

module.exports = {
  llmService,
};