const {generateScenario}=require('./scenario');
const {classifyStage}=require('./stageBuilder');
const{pickStake}=require('./pickStake');
const {evaluateAnswer}=require('./evaluationService');
const {generateFollowup}=require('./generateFollowup');

async function orchestrate(sessionObject,template,userInput){
    console.time("Stage Classification");
    const stage= await classifyStage(sessionObject,userInput);
    console.timeEnd("Stage Classification");
   
    if(stage.confidence<=0.7 && stage.stage!==sessionObject.currentStage){
        stage.stage=sessionObject.currentStage;
        stage.confidence=sessionObject.stageConfidence;
    }
    const stake=pickStake(stage,template,sessionObject);
    console.time("Followup");
    const followup=await generateFollowup(sessionObject, stake.stakeholder, stage.stage, userInput);
    console.timeEnd("Followup");
    return {
        stage,
        stake,
        followup
    }

   
}
module.exports={
    orchestrate
}