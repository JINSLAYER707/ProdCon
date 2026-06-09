const {llmService}=require('./llmService');
const {buildDiscoveryFollowupPrompt}=require('../prompts/followups/discoveryFollowup');
const {buildFinalFollowupPrompt}=require('../prompts/followups/finalFollowup');
const {buildSolutionFollowupPrompt}=require('../prompts/followups/solutionFollowup');
const {buildTradeoffFollowupPrompt}=require('../prompts/followups/tradeoffFollowup');
const { Client } = require("@gradio/client");
const SPACE_URL =
      "Jin9906/prodcon-qwen8B-test";
const model=Client.connect(SPACE_URL);

async function generateFollowup(sessionObject,stakeholderRole,currentStage,userInput){
    
    const conversation=sessionObject.conversation.map(entry=> `${entry.role} , ${entry.stakeholderRole} : ${entry.message}`).join("\n").slice(-8);
    const userAnswer=userInput;
    const stakeholder=sessionObject.stakeholders.find(stakeholder=> stakeholder.role===stakeholderRole);
    let prompt;
    switch(currentStage){
        case "problem_discovery": prompt=buildDiscoveryFollowupPrompt(sessionObject,stakeholder,conversation,userAnswer);
        break;

        case "solution_exploration": prompt=buildSolutionFollowupPrompt(sessionObject,stakeholder,conversation,userAnswer);
        break;

        case "tradeoff_analysis": prompt=buildTradeoffFollowupPrompt(sessionObject,stakeholder,conversation,userAnswer);
        break;

        case "final_recommendation": prompt=buildFinalFollowupPrompt(sessionObject,stakeholder,conversation,userAnswer);
        break;
    }
    const followup=await llmService(prompt);
    return followup;
}
module.exports={
    generateFollowup
}