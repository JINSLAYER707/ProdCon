const productStrategyTemplate = {

    category: "product_strategy",

    focus: [
        "market expansion",
        "competition",
        "growth",
        "monetization"
    ],

    industries: [
        "marketplace",
        "fintech",
        "AI products",
        "social media"
    ],

    requiredElements: [
        "competitive_pressure",
        "growth_problem",
        "business_tradeoff"
    ],

    stakeholders: [
        {
            role: "CEO",
            personality: "visionary"
        },

        {
            role: "Marketing Lead",
            personality: "growth focused"
        },

        {
            role: "Finance Head",
            personality: "cost conscious"
        },
        {
      role:"Product Strategist",
      personality:"long-term thinker"
   }
    ],

    scoringFocus: [
        "strategicThinking",
        "tradeoffAnalysis",
        "prioritization",
        "communicationClarity"
    ],

    possibleTwists: [
        "competitor_launch",
        "market_shift",
        "budget_cut"
    ],

stakeholderPriority:{

   problem_discovery:[
      "CEO",
      "Growth Manager"
   ],

   solution_exploration:[
      "Growth Manager",
      "Product Strategist"
   ],

   tradeoff_analysis:[
      "Finance Head",
      "CEO"
   ],

   final_recommendation:[
      "CEO",
      "Product Strategist"
   ]
}
};

module.exports = {productStrategyTemplate};