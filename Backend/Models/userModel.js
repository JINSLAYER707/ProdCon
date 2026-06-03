const {User}=require('../utils/db');

const createUser=async (name,email,password)=>{
   const user = new User({name,email,password});
   return await user.save();
}

const getUserbyEmail=async (email)=>{
    const user=await User.findOne({email:email});
    if(user){
        return user;
    }
    else{
        return null;
    }
}

const getUserbyId=async (userId)=>{
    const user=await User.findById(userId);
    if(user){
      return user;
    }
    else{
        return null;
    }
    
}

const updateUser=async (userId, SessionObject)=>{
    const user=await User.findById(userId);
    if(!user){
        throw new Error("User not found");
    }
    user.previousRounds.push(SessionObject._id);
    const final=SessionObject.evaluation.at(-1);
    const scoreobj=final.scores;
    const points=scoreobj.productThinking+scoreobj.metricsThinking + scoreobj.prioritization + scoreobj.tradeoffAnalysis + scoreobj.communicationClarity + scoreobj.userEmpathy;
    user.points+=points;
    const average= user.points / user.previousRounds.length;
    user.averageScore=average;
    return await user.save();

}

module.exports={
    createUser,
    getUserbyEmail,
    getUserbyId,
    updateUser
}