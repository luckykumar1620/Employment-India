import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


export const WorkerContext=createContext();

const WorkerContextProvider=(props)=>{

const backendUrl=import.meta.env.VITE_BACKEND_URL

    const [wToken,setWToken]=useState(localStorage.getItem('wToken')?localStorage.getItem('wToken'):'')
    const [services,setServices]=useState([])

      const getServices=async()=>{
        try {

            const {data}=await axios.get(backendUrl+'/api/worker/services',{headers:{wToken}})

            if(data.success){
                setServices(data.services)
                console.log(data.services)
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)  
        }
    }

     const completeService=async(serviceId)=>{
        try {

          const {data}=await axios.post(backendUrl+'/api/worker/complete-service',{serviceId},{headers:{wToken}})

          if(data.success){
            toast.success(data.message)
            getServices()
          }else{
            toast.error(data.message)
          }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

      const cancelService=async(serviceId)=>{
        try {

          const {data}=await axios.post(backendUrl+'/api/worker/cancel-service',{serviceId},{headers:{wToken}})

          if(data.success){
            toast.success(data.message)
            getServices()
          }else{
            toast.error(data.message)
          }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value={
        backendUrl,wToken,
        setWToken,services,
        setServices,
        getServices,
        completeService,
        cancelService

    }

    return (
         <WorkerContext.Provider value={value}>
            {props.children}
         </WorkerContext.Provider>
    )
}

export default WorkerContextProvider