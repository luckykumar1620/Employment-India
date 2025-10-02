import workerModel from "../models/workerModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import serviceModel from "../models/serviceModel.js";


const changeAvailablity=async (req,res)=>{
    try {

        const {workerId}=req.body
        
        const workData=await workerModel.findById(workerId)
        await workerModel.findByIdAndUpdate(workerId,{available:!workData.available})
        res.json({success:true,message:'Availablity Changed'})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const workerList=async(req,res)=>{

     try {

        const workers=await workerModel.find({}).select(['-password','-email'])
        res.json({success:true,workers})
        
     } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
     }

}

//API for worker login
const loginWorker=async(req,res)=>{
    try {

        const {email,password}=req.body

        const worker=await workerModel.findOne({email})

        if(!worker){
            return res.json({success:false,message:"Invalid Credentials"})
        }

        const isMatch=await bcrypt.compare(password,worker.password)

        if(isMatch){

            const token=jwt.sign({id:worker._id},process.env.JWT_SECRET)
            res.json({success:true,token})

        }else{
            return res.json({success:false,message:"Invalid Credentials"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})   
    }
}

//API to get worker services for worker panel
const servicesWorker=async(req,res)=>{
    try {

        const workId=req.workId

        const services=await serviceModel.find({workId})

        res.json({success:true,services})
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})  
    }
}

//API to mark services complted for worker panel
const serviceComplete=async(req,res)=>{
    try {

        const workId=req.workId

        const {serviceId}=req.body

        const serviceData=await serviceModel.findById(serviceId)

        if(serviceData && serviceData.workId ===workId){

            await serviceModel.findByIdAndUpdate(serviceId,{isCompleted:true})
            return res.json({success:true,message:"Service Completed"})
        }else{
            return res.json({success:false,message:"Mark Failed"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to cancel services  for doctor panel
const serviceCancel=async(req,res)=>{
    try {

        const workId=req.workId

        const {serviceId}=req.body

        const serviceData=await serviceModel.findById(serviceId)

        if(serviceData && serviceData.workId ===workId){

            await serviceModel.findByIdAndUpdate(serviceId,{cancelled:true})
            return res.json({success:true,message:"Service Cancelled"})
        }else{
            return res.json({success:false,message:"Cancellation Failed"})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}



export {changeAvailablity,workerList,loginWorker,servicesWorker,serviceComplete,serviceCancel}