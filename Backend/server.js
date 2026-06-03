const express=require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
const {authRouter}=require('./Controllers/authController');
const {sessionRouter}=require('./Controllers/sessionController');
require('dotenv').config();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://prodcon-1.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.options('*', cors());
app.use(express.json());
const port=process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.json({message:"Welcome to the Product Management Interview Preparation Platform API"});
});
app.use('/',authRouter);
app.use('/',sessionRouter);
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB");
    app.listen(port,()=>{
        console.log(`Server is running on http://localhost:${port}`);
    })
}).catch((err)=>{
    console.log("Error persists");
    console.log(err);
})