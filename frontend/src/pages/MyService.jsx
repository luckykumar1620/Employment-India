import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import {toast} from 'react-toastify'


const MyService = () => {

  const {backendUrl,token,getWorkersData}=useContext(AppContext);

   const [services,setServices]=useState([])
  const months=["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  const slotDateFormat=(slotDate)=>{
    const dateArray=slotDate.split('_')
    return dateArray[0]+" "+months[Number(dateArray[1])]+" "+dateArray[2]

  }
  
  const getUserServices=async()=>{
    try {

      const {data}=await axios.get(backendUrl+'/api/user/services',{headers:{token}})
      if(data.success){
        setServices(data.services.reverse())
        console.log(data.services)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelService=async(serviceId)=>{
    try {

      const {data}=await axios.post(backendUrl+'/api/user/cancel-service',{serviceId},{headers:{token}})

      if(data.success){
        toast.success(data.message)
        getUserServices()
        getWorkersData()
      }else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  useEffect(()=>{
    if(token){
      getUserServices()
    }
  },[token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My service</p>
      <div>
        {services.map((item,index)=>(
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.workData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-700 font-semibold'>{item.workData.name}</p>
                <p>{item.workData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs '>{item.workData.address.line1}</p>
                <p className='text-xs '>{item.workData.address.line2}</p>
                <p className='text-sm mt-1'><span className='text-sm font-medium text-neutral-700'>Date & Time:</span>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div></div>
              <div className='flex flex-col justify-end gap-2'>
               {  !item.cancelled && <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-blue-500 hover:text-white transition-all duration-300'>Pay online</button>}
               {  !item.cancelled && <button onClick={()=>cancelService(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel service</button>}
               {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Service Cancelled</button>}
              </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyService
