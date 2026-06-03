const {llmService}=require('../services/llmService');
const {buildEvaluationPrompt}=require('../prompts/evaluation');

async function evaluateAnswer(sessionObject){
    const conversation=sessionObject.conversation.map(entry=>`${entry.role} , ${entry.stakeholderRole} : ${entry.message}`).join("\n");
    const prompt=buildEvaluationPrompt(sessionObject , conversation );
    const evaluation=await llmService(prompt);
    return evaluation;
}
module.exports={
    evaluateAnswer
}