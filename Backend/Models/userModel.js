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
    const final=SessionObject.evaluation.at(-1) || {};
    const scoreobj=final.scores || {};
    const points =
      Number(scoreobj.productThinking ?? 0) +
      Number(scoreobj.metricsThinking ?? 0) +
      Number(scoreobj.prioritization ?? 0) +
      Number(scoreobj.tradeoffAnalysis ?? 0) +
      Number(scoreobj.communicationClarity ?? 0) +
      Number(scoreobj.userEmpathy ?? 0);
    user.points += points;
    user.averageScore = user.points / user.previousRounds.length;
    return await user.save();

}

module.exports={
    createUser,
    getUserbyEmail,
    getUserbyId,
    updateUser
}