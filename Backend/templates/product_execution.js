const productExecutionTemplate = {

    category: "product_execution",

    focus: [
        "metrics",
        "execution",
        "operations",
        "tradeoffs"
    ],

    industries: [
        "SaaS",
        "e-commerce",
        "ride sharing"
    ],

    requiredElements: [
        "metric_drop",
        "timeline_pressure",
        "resource_constraints"
    ],

    stakeholders: [
        {
            role: "CEO",
            personality: "aggressive"
        },

        {
            role: "Data Analyst",
            personality: "analytical"
        },

        {
            role: "Engineer",
            personality: "realistic"
        },
        {
      role:"Operations Manager",
      personality:"process focused"
   }
    ],

    scoringFocus: [
        "metricsThinking",
        "tradeoffAnalysis",
        "prioritization",
        "communicationClarity"
    ],

    possibleTwists: [
        "tracking_bug",
        "infrastructure_issue",
        "deadline_pressure"
    ],
    stakeholderPriority:{

   problem_discovery:[
      "Data Analyst",
      "CEO"
   ],

   solution_exploration:[
      "Operations Manager",
      "Engineer"
   ],

   tradeoff_analysis:[
      "Engineer",
      "CEO"
   ],

   final_recommendation:[
      "CEO",
      "Operations Manager"
   ]
}
};

module.exports = {productExecutionTemplate};