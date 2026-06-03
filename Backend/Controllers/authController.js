const express=require('express');
const {User}=require('../utils/db');
const jwt=require('jsonwebtoken');
const {authMiddleware}=require('../Middlewares/authMiddle');
const {logMiddleware}=require('../Middlewares/logMiddle');
const{signupMiddleware}=require('../Middlewares/logMiddle');
const bcrypt=require('bcryptjs');
const {createUser,getUserbyEmail}=require('../Models/userModel');

const authRouter=express.Router();

authRouter.post('/auth/login' ,logMiddleware, async(req,res)=>{
    const {email,password}=req.body;
    try{
      const user=await getUserbyEmail(email);
      if(!user){
        return res.status(401).json({message:"User not found"});
      }
      const isValid=await bcrypt.compare(password,user.password);
      if(!isValid){
        return res.status(401).json({message:"Invalid credentials"});
      }
      const token=jwt.sign({
        userId:user._id
      },process.env.JWT_SECRET,{
        expiresIn:'1h'
      });
      return res.status(200).json({
        token,
        user:{
            name:user.name,
            email:user.email,
            points:user.points
        }
      });

    }
    catch(error){
      console.log(error);
      return res.status(500).json({message:"Internal server error"});
    }

});

authRouter.post('/auth/signup' , signupMiddleware , async(req,res)=>{
  try{
    const {username,email,password}=req.body;
    const existing=await getUserbyEmail(email);
    if(existing){
        return res.status(400).json({message:"User already exists"});
    }
    const hashedPassword=await bcrypt.hash(password,10);
    const newUser=await createUser(username,email,hashedPassword);
    const token=jwt.sign({
        userId:newUser._id
    },process.env.JWT_SECRET,{
        expiresIn:'1h'
    });
    return res.status(201).json({
        token,
        user:{
            name:newUser.name,
            email:newUser.email,
            points:newUser.points
        }
    });
  }
  catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal server error"});
  }
});


module.exports={
    authRouter
}