function pickStake(state,scenario,sessionObject){
    const currentStage=state.stage;
    const prevStage=sessionObject.currentStage;
    if(state.confidence > 0.7 && currentStage !== prevStage){
        const len=scenario.stakeholderPriority[currentStage].length;
        const randomIndex=Math.floor(Math.random()*len);
        return {
            stakeholder:scenario.stakeholderPriority[currentStage][randomIndex],
            personality:scenario.stakeholders.find(s=> s.role === scenario.stakeholderPriority[currentStage][randomIndex]).personality
        }
    }
    else{
        const len=scenario.stakeholderPriority[prevStage].length;
        const randomIndex=Math.floor(Math.random()*len);
        return {
            stakeholder:scenario.stakeholderPriority[prevStage][randomIndex],
            personality:scenario.stakeholders.find(s=> s.role === scenario.stakeholderPriority[prevStage][randomIndex]).personality
        }
    }
    }


module.exports={
    pickStake
}