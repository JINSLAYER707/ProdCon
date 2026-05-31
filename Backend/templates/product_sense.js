const productSenseTemplate = {

    category: "product_sense",

    focus: [
        "user problems",
        "feature thinking",
        "engagement"
    ],

    industries: [
        "social media",
        "music streaming",
        "fitness",
        "edtech"
    ],

    requiredElements: [
        "user_problem",
        "engagement_issue",
        "feature_tradeoff"
    ],

    stakeholders: [
        {
            role: "Designer",
            personality: "UX focused"
        },

        {
            role: "Engineer",
            personality: "skeptical"
        },
        {
      role:"CEO",
      personality:"growth focused"
   },

   {
      role:"Product Lead",
      personality:"strategic"
   }
    ],

    scoringFocus: [
        "productThinking",
        "userEmpathy",
        "prioritization"
    ],

    possibleTwists: [
        "negative_user_feedback",
        "engineering_constraint",
        "low_adoption"
    ],
    stakeholderPriority:{

   problem_discovery:[
      "Designer",
      "CEO"
   ],

   solution_exploration:[
      "Designer",
      "Product Lead"
   ],

   tradeoff_analysis:[
      "Engineer",
      "CEO"
   ],

   final_recommendation:[
      "CEO",
      "Product Lead"
   ]
}

};

module.exports = productSenseTemplate;