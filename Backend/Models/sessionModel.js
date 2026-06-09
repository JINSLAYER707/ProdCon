const {PracticeSession}=require("../utils/db");
const {User}=require("../utils/db")

const createSession=async (userId ,difficulty, category, scenarioObject)=>{
    const session = new PracticeSession({
        user:userId,
        difficulty,
        category,
        company:scenarioObject.company,
        industry:scenarioObject.industry,
        problemStatement:scenarioObject.problemStatement,
        businessContext:scenarioObject.businessContext,
        constraints:scenarioObject.constraints,
        metrics:scenarioObject.metrics,
        stakeholders:scenarioObject.stakeholders,
    });
    
    return await session.save();
}

const getSessionById=async (sessionId)=>{
    const session=await PracticeSession.findById(sessionId);
    if(session){
        return session;
    }
    else{
        return null;
    }
}

const updateSession=async (sessionId,userAnswer,convoObject)=>{
    console.log("Updating session with ID:", sessionId);
    const session=await PracticeSession.findById(sessionId);
    if(!session){
        throw new Error("Session not found");
    }
   
    const stageObject=convoObject.stage;
       session.currentStage=stageObject.stage;
        session.stageConfidence=stageObject.confidence;
        session.stageHistory.push({
            stage:stageObject.stage,
            timestamp:new Date(),
        });
    session.stageCount[stageObject.stage]=(session.stageCount[stageObject.stage] || 0) + 1;
    if(session.stageCount[session.currentStage]>=session.stageLimit[session.currentStage]){
        session.forced_transition=true;
    }
    else{
        session.forced_transition=false;
    }

    const stakeObject=convoObject.stake;
    session.currentStakeholder={
        role:stakeObject.stakeholder,
        personality:stakeObject.personality
    }
     const newCon={
        role:"user",
        currentStage:session.currentStage,
        stakeholderRole:"user",
        message:userAnswer,
        timestamp:new Date()
    }
    session.conversation.push(newCon);

    const stakeConvo={
        role:"stakeholder",
        currentStage:session.currentStage,
        stakeholderRole:stakeObject.stakeholder,
        message:convoObject.followup.statement,
        timestamp:new Date()
    }
    session.conversation.push(stakeConvo);
    console.log({
  currentStage: session.currentStage,
  currentCount: session.stageCount[session.currentStage],
  currentLimit: session.stageLimit[session.currentStage],
  forcedTransition: session.forced_transition
});
    return await session.save();
}

const endSession=async (sessionId,evaluation)=>{
    const session=await PracticeSession.findById(sessionId);
    if(!session){
        throw new Error("Session not found");
    }
    session.evaluation.push(evaluation);
    console.log(
  JSON.stringify(evaluation, null, 2)
);

console.log({
  productThinking: evaluation?.scores?.productThinking,
  metricsThinking: evaluation?.scores?.metricsThinking,
  prioritization: evaluation?.scores?.prioritization,
  tradeoffAnalysis: evaluation?.scores?.tradeoffAnalysis,
  communicationClarity: evaluation?.scores?.communicationClarity,
  userEmpathy: evaluation?.scores?.userEmpathy,
});
   const scores = evaluation.scores || {};

session.finalScore =
      Number(scores.productThinking ?? 0) +
      Number(scores.metricsThinking ?? 0) +
      Number(scores.prioritization ?? 0) +
      Number(scores.tradeoffAnalysis ?? 0) +
      Number(scores.communicationClarity ?? 0) +
      Number(scores.userEmpathy ?? 0);
    session.status = "completed";
    session.finalFeedback = evaluation.aiFeedback;
    const userId = session.user;
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found while ending session");
    }
    user.previousRounds.push(session._id);
    user.points += session.finalScore;
    user.averageScore = user.points / user.previousRounds.length;
    await user.save();
    await session.save();
    return session;
}

module.exports={
    createSession,
    getSessionById,
    updateSession,
    endSession
}