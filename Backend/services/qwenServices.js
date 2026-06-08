const { Client } = require("@gradio/client");

const SPACE_URL =
  "https://huggingface.co/spaces/Jin9906/prodcon-qwen8B-test";

async function generateFollowup(prompt) {
  const client = await Client.connect(SPACE_URL);

  const result = await client.predict(
    "/predict",
    [prompt]
  );

  return result.data[0];
}

module.exports = {
  generateFollowup
};