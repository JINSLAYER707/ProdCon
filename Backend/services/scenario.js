const {llmService}=require('../services/llmService');
const {buildScenarioPrompt}=require('../prompts/scenarioGenerator');

async function generateScenario(template,difficulty){
    const prompt=buildScenarioPrompt(template,difficulty);
    const scenario=await llmService(prompt);
    return scenario;
}

module.exports={
    generateScenario
}