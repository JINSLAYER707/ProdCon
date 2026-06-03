function buildEvaluationPrompt(
    scenario,
    conversation
){

return `
You are an experienced Product Management interviewer.

Your task is to perform a FINAL evaluation of a PM candidate after the interview has concluded.

SCENARIO:

Company:
${scenario.company}

Problem Statement:
${scenario.problemStatement}

Business Context:
${scenario.businessContext}

FULL INTERVIEW CONVERSATION:

${conversation}

Evaluate the candidate holistically across the entire interview.

Evaluate the following competencies:

1. Product Thinking
   - Problem understanding
   - User needs identification
   - Root cause analysis
   - Structured thinking

2. Metrics Thinking
   - KPI selection
   - Data-driven reasoning
   - Success measurement
   - Analytical approach

3. Prioritization
   - Decision making
   - Focus on high-impact opportunities
   - Resource awareness

4. Tradeoff Analysis
   - Handling constraints
   - Evaluating alternatives
   - Risk awareness
   - Balancing competing objectives

5. Communication Clarity
   - Structured responses
   - Logical flow
   - Executive communication
   - Conciseness

6. User Empathy
   - Understanding user problems
   - User-centric thinking
   - Consideration of user experience

IMPORTANT RULES:

- Give scores between 0 and 10.
- Be realistic and critical.
- Avoid inflated scoring.
- Reward structured reasoning.
- Reward strong product sense.
- Penalize vague or unsupported conclusions.
- Evaluate the ENTIRE interview, not individual answers.
- Consider how the candidate progressed throughout the discussion.
- Consider consistency across stages.
- Consider the quality of the final recommendation.

Calculate an overall assessment based on the complete interview.

CRITICAL RESPONSE RULES:

- Return ONLY raw valid JSON.
- Do NOT include markdown code blocks.
- Do NOT wrap the response in markdown fences.
- Do NOT include explanations before the JSON.
- Do NOT include explanations after the JSON.
- The first character of your response must be {
- The last character of your response must be }
- The response must be directly parseable using JSON.parse().

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

   "aiFeedback":"",

   "overallSummary":""
}
`;
}

module.exports = {
    buildEvaluationPrompt
};