// prompts/scenarioPrompt.js

function buildScenarioPrompt(
    template,
    difficulty
){

return `
You are an expert Product Management interviewer.

Your task is to generate a realistic and immersive
PM interview simulation scenario.

The simulation must feel like:
- a real PM interview
- a real company problem
- a realistic cross-functional environment

==================================================
SIMULATION TYPE
==================================================

CATEGORY:
${template.category}

DIFFICULTY:
${difficulty}

==================================================
FOCUS AREAS
==================================================

${template.focus.join(", ")}

==================================================
ALLOWED INDUSTRIES
==================================================

${template.industries.join(", ")}

==================================================
REQUIRED ELEMENTS
==================================================

${template.requiredElements.join(", ")}

==================================================
AVAILABLE STAKEHOLDERS
==================================================

${template.stakeholders.map(
stakeholder => `
- ${stakeholder.role}
(${stakeholder.personality})
`
).join("")}

==================================================
STAGE-WISE STAKEHOLDER PRIORITY
==================================================

${Object.entries(template.stakeholderPriority)
.map(([stage, stakeholders]) => `
${stage}:
${stakeholders.join(", ")}
`).join("\n")}

==================================================
POSSIBLE TWISTS
==================================================

${template.possibleTwists.join(", ")}

==================================================
IMPORTANT RULES
==================================================

- The scenario MUST feel realistic
- Do NOT create fantasy or sci-fi situations
- Use believable business/product problems
- Include measurable business metrics
- Include stakeholder tension
- Include realistic constraints
- The problem should be open-ended
- The problem should allow multiple approaches
- Make the difficulty match the requested difficulty level
- The scenario should challenge PM thinking
- Do NOT generate absurd metrics
- Avoid generic startup buzzwords
- Keep the scenario concise but detailed enough
- Stakeholders should have realistic concerns
- Constraints should create meaningful tradeoffs

==================================================
DIFFICULTY GUIDELINES
==================================================

EASY:
- clear problem statement
- fewer constraints
- simpler stakeholder pressure
- straightforward metrics

MEDIUM:
- moderate ambiguity
- multiple constraints
- conflicting stakeholder goals
- more analytical reasoning required

HARD:
- ambiguous root causes
- multiple conflicting priorities
- severe constraints
- strategic uncertainty
- difficult tradeoffs

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

==================================================
RETURN FORMAT
==================================================

RETURN ONLY VALID JSON.

JSON FORMAT:

{
  "company":"",

  "industry":"",

  "problemStatement":"",

  "businessContext":"",

  "constraints":[
  ],

  "metrics":{
  },

  "stakeholders":[
     {
        "role":"",
        "personality":"",
        "concern":""
     }
  ],

  "initialStage":"problem_discovery"
}

`;
}

module.exports = {
   buildScenarioPrompt}