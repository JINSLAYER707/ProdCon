const {generateScenario}=require('./scenario');
const {classifyStage}=require('./stageBuilder');
const{pickStake}=require('./pickStake');
const {evaluateAnswer}=require('./evaluationService');
const {generateFollowup}=require('./generateFollowup');

async function orchestrate(sessionObject,template,userInput){
    console.time("Stage Classification");
    const stage= await classifyStage(sessionObject);
    console.timeEnd("Stage Classification");
   
    if(stage.confidence<=0.7 && stage.stage!==sessionObject.currentStage){
        stage.stage=sessionObject.currentStage;
    }
    const stake=pickStake(stage,template,sessionObject);
    console.time("Followup");
    const followup=await generateFollowup(sessionObject,stake, stage.stage);
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