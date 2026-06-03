const jwt=require('jsonwebtoken');
const {User}=require('../utils/db');

const authMiddleware=async(req,res,next)=>{
    try{

        const token=req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        console.log(req.headers.authorization);
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.userId=decoded.userId;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}

module.exports={
    authMiddleware
}