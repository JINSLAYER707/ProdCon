const logMiddleware=(req,res,next)=>{
    const {email,password}=req.body;
    
        if(!email || !password){
            return res.status(400).json({message:"Required fields missing"});
        }
        next();
    
    
}

const signupMiddleware=(req,res,next)=>{
    const {username,email,password}=req.body;
    if(!username || !email || !password){
        return res.status(400).json({message:"Required fields missing"});
    }
    next();
}

module.exports={
    logMiddleware,
    signupMiddleware
}
