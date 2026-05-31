// prompts/evaluationPrompt.js

function buildEvaluationPrompt(
    scenario,
    conversation,
    userAnswer,
    stage
){

let stageCriteria = "";

switch(stage){

    case "problem_discovery":

        stageCriteria = `
PRIMARY EVALUATION AREAS:
- Product Thinking
- Metrics Thinking
- Communication Clarity

Look for:
- Problem understanding
- Root cause analysis
- Hypothesis generation
- Analytical reasoning
- User problem identification

Do NOT heavily penalize lack of solution details or tradeoff discussion at this stage.
`;
        break;

    case "solution_exploration":

        stageCriteria = `
PRIMARY EVALUATION AREAS:
- Product Thinking
- User Empathy
- Prioritization
- Communication Clarity

Look for:
- Quality of proposed solutions
- Understanding of user needs
- Feature reasoning
- Structured thinking
- Creativity balanced with practicality

Do NOT heavily penalize lack of detailed execution planning at this stage.
`;
        break;

    case "tradeoff_analysis":

        stageCriteria = `
PRIMARY EVALUATION AREAS:
- Tradeoff Analysis
- Prioritization
- Communication Clarity
- Product Thinking

Look for:
- Resource awareness
- Handling constraints
- Prioritization decisions
- Feasibility considerations
- Ability to adapt strategy

This stage should strongly reward realistic decision making.
`;
        break;

    case "final_recommendation":

        stageCriteria = `
PRIMARY EVALUATION AREAS:
- Communication Clarity
- Prioritization
- Product Thinking
- Tradeoff Analysis

Look for:
- Clear recommendation
- Executive communication
- KPI definition
- Strategic thinking
- Structured summary

This stage should reward synthesis and decision making.
`;
        break;

    default:

        stageCriteria = `
Evaluate all PM competencies fairly.
`;
}

return `
You are an experienced Product Management interviewer.

Your task is to realistically evaluate a PM candidate.

CURRENT STAGE:
${stage}

SCENARIO:
${scenario.problemStatement}

BUSINESS CONTEXT:
${scenario.businessContext}

RECENT CONVERSATION:
${conversation}

LATEST USER RESPONSE:
${userAnswer}

${stageCriteria}

Evaluate the candidate on:

1. Product Thinking
2. Metrics Thinking
3. Prioritization
4. Tradeoff Analysis
5. Communication Clarity
6. User Empathy

IMPORTANT RULES:
- Give scores between 0 and 10
- Be realistic and critical
- Avoid inflated scoring
- Penalize vague thinking
- Reward structured reasoning
- Consider the CURRENT STAGE while scoring
- Focus more heavily on the primary evaluation areas for this stage

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
   "scores":{
      "productThinking":0,
      "metricsThinking":0,
      "prioritization":0,
      "tradeoffAnalysis":0,
      "communicationClarity":0,
      "userEmpathy":0
   },

   "strengths":[],

   "weaknesses":[],

   "aiFeedback":""
}
`;
}

module.exports = {
   buildEvaluationPrompt}