const express=require('express');
const sessionRouter=express.Router();
const {orchestrate}=require('../services/orchestrator');
const {getUserbyId}=require('../Models/userModel');
const {PracticeSession}=require('../utils/db');
const {generateScenario}=require('../services/scenario');
const {authMiddleware}=require('../Middlewares/authMiddle');
const {productSenseTemplate}=require('../templates/product_sense');
const {productExecutionTemplate}=require('../templates/product_execution');
const {productStrategyTemplate}=require('../templates/product_strategy');
const {evaluateAnswer}=require('../services/evaluationService');
const {createSession,
    getSessionById,
    updateSession,
    endSession}=require('../Models/sessionModel');

sessionRouter.get('/session/:sessiontype/:sessionlevel',authMiddleware, async(req,res)=>{
    const {sessiontype,sessionlevel}=req.params;
    const userId=req.userId;
    try{
        const user=await getUserbyId(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});    
        }
        if(sessiontype!=="product_sense" && sessiontype!=="product_execution" && sessiontype!=="product_strategy"){
            return res.status(400).json({message:"Invalid session type"});
        }
        if(sessionlevel!=="EASY" && sessionlevel!=="MEDIUM" && sessionlevel!=="HARD"){
            return res.status(400).json({message:"Invalid session level"});
        }
        let template;
        switch(sessiontype){
            case "product_sense":
                template=productSenseTemplate;
                break;
            case "product_execution":
                template=productExecutionTemplate;
                break;
            case "product_strategy":
                template=productStrategyTemplate;
                break;

        }
        const scenario=await generateScenario(template,sessionlevel);
        const session=await createSession(userId,sessionlevel,sessiontype,scenario);
        return res.status(201).json({
            sessionId:session._id,
            scenario:scenario
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
});

sessionRouter.post('/session/respond/:sessionId' , async(req,res)=>{
    const {sessionId}=req.params;
    const {userAnswer}=req.body;
    try{
        const session=await getSessionById(sessionId);
        if(!session){
            return res.status(404).json({message:"Session not found"});
        }
        const sessiontype=session.category;
        let template;
        switch(sessiontype){
            case "product_sense":
                template=productSenseTemplate;
                break;
            case "product_execution":
                template=productExecutionTemplate;
                break;
            case "product_strategy":
                template=productStrategyTemplate;
                break;

        }
        const convObject=await orchestrate(session,template,userAnswer);
        const {stage,stake,followup}=convObject;
        const update=await updateSession(sessionId,userAnswer,convObject);
        if(userAnswer==="I am ready to conclude. Please evaluate my final recommendation based on the conversation so far."  || followup.isCompleted || (session.currentStage==="final_recommendation" && session.stageCount["final_recommendation"]>=session.stageLimit["final_recommendation"])){
            const evaluation=await evaluateAnswer(session);
            await endSession(sessionId,evaluation);
            return res.status(200).json(evaluation);


    }
    console.log("forcedTransition:", session.forced_transition);
        return res.status(200).json({stake,followup,"forced-transition":session.forced_transition});
}
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
});

module.exports={
    sessionRouter
}