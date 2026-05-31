function pickStake(state,scenario,sessionObject){
    const currentStage=state.stage;
    const prevStage=sessionObject.currentStage;
    if(state.confidence > 0.7 && currentStage !== prevStage){
        const len=scenario.stakeholderPriority[currentStage].length;
        const randomIndex=Math.floor(Math.random()*len);
        return scenario.stakeholderPriority[currentStage][randomIndex];
    }
    else{
        const len=scenario.stakeholderPriority[prevStage].length;
        const randomIndex=Math.floor(Math.random()*len);
        return scenario.stakeholderPriority[prevStage][randomIndex];
    }
    }


module.exports={
    pickStake
}