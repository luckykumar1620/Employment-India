import bcrypt from "bcrypt"
import validator from "validator"
import {v2 as cloudinary} from "cloudinary"
import workerModel from "../models/workerModel.js"
import jwt from 'jsonwebtoken'




//API for adding worker
const addWorker=async(req,res)=>{

    try {
       
        const {name,email,password,speciality,skill,experience,about,fees,address,}=req.body
        const imageFile=req.file;

        //checking for all data to add worker
        if(!name || !email || !password || !speciality || !skill || !experience || !about || !fees || !address){
            return res.json({success:false,message:"Missing Details"});
        }

        //validate email format
        if(!validator.isEmail(email)){
             return res.json({success:false,message:"Please enter a valid email"});
        }

        //validate strong password
        if(password.length<8){
             return res.json({success:false,message:"Please enter a strong password"});
        }

        //hashing worker password
        const salt= await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        //upload image to cloudinary
        const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl=imageUpload.secure_url

        const workerData={
            name,
            email,
            password:hashedPassword,
            image:imageUrl,
            speciality,
            skill,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newWorker=new workerModel(workerData)
        await newWorker.save();

        res.json({success:true,message:"Worker Added"})
    } catch (error) {
        console.log(error);
        res.send(error.message);
    }
}

//API for admin login
const loginAdmin=async(req,res)=>{
    try {

        const {email,password}=req.body
        
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){

            const token=jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})

        }else{
            res.json({success:false,message:"Invalid Credentials"})
            
        }
        
    } catch (error) {
       console.log(error);
       res.json({success:false,message:error.message}) 
    }
}


//API to get all workers list for admin panel
const allWorkers= async(req,res)=>{
    
    try {
        
       const workers=await workerModel.find({}).select('-password')
        res.json({success:true,workers})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
    
}

export {addWorker,loginAdmin,allWorkers}