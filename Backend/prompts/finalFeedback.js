// prompts/finalFeedbackPrompt.js

function buildFinalFeedbackPrompt(
    evaluations,
    conversation
){

return `
You are generating final PM interview feedback.

FULL EVALUATION HISTORY:
${JSON.stringify(evaluations)}

RECENT CONVERSATION:
${conversation}

Analyze:
- recurring strengths
- recurring weaknesses
- PM readiness
- communication quality
- prioritization ability
- analytical thinking

IMPORTANT RULES:
- be realistic
- avoid excessive praise
- provide actionable feedback
- focus on PM competency growth

CRITICAL RESPONSE RULES:

- Return ONLY raw valid JSON.
- Do NOT include markdown code blocks.
- Do NOT wrap the response in markdown fences.
- Do NOT use code blocks of any kind.
- Do NOT include explanations before the JSON.
- Do NOT include explanations after the JSON.
- Do NOT include phrases like "Here is the JSON", "Sure", or "I have generated the response".
- The first character of your response must be {
- The last character of your response must be }
- Your entire response must be parseable by JSON.parse() without any modification.

RETURN ONLY VALID JSON.

JSON FORMAT:

{
   "finalScore":0,

   "topStrengths":[],

   "topWeaknesses":[],

   "overallFeedback":"",

   "recommendations":[]
}
`;
}

module.exports = {
    buildFinalFeedbackPrompt}