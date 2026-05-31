// prompts/stageClassifierPrompt.js

function buildStageClassifierPrompt(
    scenario,
    conversation,
    userAnswer,
    currentStage
){

return `
You are analyzing a Product Management interview conversation.

Your task is to classify:
1. Which reasoning stage the candidate is currently in
2. Whether the current stage has been sufficiently completed

AVAILABLE STAGES:

1. problem_discovery
- investigating root causes
- discussing metrics/funnels
- identifying user pain points
- asking analytical questions
- understanding the business problem

2. solution_exploration
- proposing product ideas
- brainstorming features
- discussing user experience improvements
- suggesting experiments/solutions

3. tradeoff_analysis
- discussing constraints
- prioritizing under limitations
- handling engineering/resource pressure
- balancing business and technical concerns

4. final_recommendation
- summarizing final strategy
- defining KPIs
- proposing rollout plans
- synthesizing decisions clearly

CURRENT STAGE:
${currentStage}

SCENARIO:
${scenario.problemStatement}

BUSINESS CONTEXT:
${scenario.businessContext}

RECENT CONVERSATION:
${conversation}

LATEST USER RESPONSE:
${userAnswer}

IMPORTANT RULES:
- Prefer staying in the CURRENT STAGE unless strong evidence exists
- Avoid random stage switching
- Only move forward logically
- Do NOT jump backward unless extremely obvious
- Consider the OVERALL reasoning progression
- A stage is complete only if the candidate has demonstrated sufficient reasoning depth

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
   "stage":"",
   "confidence":0,
   "stageComplete":false,
   "reason":""
}
`;
}

module.exports ={
    buildStageClassifierPrompt
}
    