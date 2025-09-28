import { meta } from "@eslint/js";
import { createContext,useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [workers,setWorkers]=useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllWorkers=async(req,res)=>{
        
        try {
             const {data}=await axios.post(backendUrl + '/api/admin/all-workers',{},{headers:{aToken}})
             
             if(data.success){
                setWorkers(data.workers)
                console.log(data.workers)
             }else{
                toast.error(data.message)
             }

        } catch (error) {
            toast.error(error.message)
        }
       
    }

     const changeAvailability=async(workerId)=>{

        try {

            const {data}=await axios.post(backendUrl + '/api/admin/change-availability',{workerId},{headers:{aToken}})
            if (data.success) {
                toast.success(data.message)
                getAllWorkers()
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }


    const value = {
        aToken, setAToken,
        backendUrl,workers,
        getAllWorkers,changeAvailability
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider