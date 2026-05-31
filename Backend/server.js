const express=require('express');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
require('dotenv').config();
app.use(cors());
app.use(express.json());
const port=process.env.PORT || 5000;
app.get('/',(req,res)=>{
    res.send("Welcome to SpendSense API");
})
mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB");
    app.listen(port,()=>{
        console.log(`Server is running on http://localhost:${port}`);
    })
}).catch((err)=>{
    console.log("Error persists");
    console.log(err);
})