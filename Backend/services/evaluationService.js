const {llmService}=require('../services/llmService');
const {buildEvaluationPrompt}=require('../prompts/evaluation');

async function evaluateAnswer(sessionObject,currentStage){
    const conversation=sessionObject.conversation.map(entry=>`${entry.role} , ${entry.stakeholderRole} : ${entry.message}`).join("\n");
    const userAnswer=sessionObject.conversation.filter(entry=> entry.role==="user").slice(-1)[0].message;
    const prompt=buildEvaluationPrompt(sessionObject , conversation , userAnswer , currentStage);
    const evaluation=await llmService(prompt);
    return evaluation;
}
module.exports={
    evaluateAnswer
}