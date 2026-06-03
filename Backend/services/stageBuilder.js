const {llmService}=require('../services/llmService');
const {buildStageClassifierPrompt}=require('../prompts/stageClassifier');

async function classifyStage(sessionObject,userAnswer){
    const conversation = sessionObject.conversation.map(entry => `${entry.role} , ${entry.stakeholderRole} : ${entry.message}`).join("\n").slice(-8);
    const prompt=buildStageClassifierPrompt(sessionObject , conversation , userAnswer , sessionObject.currentStage);
    const stage=await llmService(prompt);
    return stage;
}

module.exports={
    classifyStage
}