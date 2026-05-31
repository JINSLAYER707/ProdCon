const {llmService}=require('../services/llmService');
const {buildStageClassifierPrompt}=require('../prompts/stageClassifier');

async function classifyStage(sessionObject){
    const conversation = sessionObject.conversation.map(entry => `${entry.role} , ${entry.stakeholderRole} : ${entry.message}`).join("\n").slice(-8);
    const userAnswer = sessionObject.conversation.filter(entry => entry.role==="user").slice(-1)[0].message;
    const prompt=buildStageClassifierPrompt(sessionObject , conversation , userAnswer , sessionObject.currentStage);
    const stage=await llmService(`
Return:

{
 "stage":"problem_discovery",
 "confidence":0.8
}
`);
    return stage;
}

module.exports={
    classifyStage
}