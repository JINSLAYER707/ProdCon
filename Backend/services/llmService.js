const { OpenRouter } =require("@openrouter/sdk") ;
 const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_KEY
});
async function llmService(prompt){
   const response = await openrouter.chat.send({
    chatRequest: {
        model:"nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
        messages:[
             {
      role:"system",
      content:
      "You are a JSON API. You must only return valid JSON."
   },
            {
                role:"user",
                content:prompt
            }
        ]
    }
});
const content =response.choices[0].message.content;
const cleaned = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

return JSON.parse(cleaned);
}

module.exports={
    llmService
}
