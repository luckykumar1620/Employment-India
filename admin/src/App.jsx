import React,{useContext} from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import { Route,Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllServices from './pages/Admin/AllServices';
import Sidebar from './components/Sidebar';
import AddWorker from './pages/Admin/AddWorker';
import WorkerList from './pages/Admin/WorkerList';

const App = () => {

  const {aToken}=useContext(AdminContext)

return aToken? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard/>} />
          <Route path='/all-services' element={<AllServices/>} />
          <Route path='/add-worker' element={<AddWorker/>} />
           <Route path='/worker-list' element={<WorkerList/>} />
        </Routes>
      </div>
    </div>
  ):(
    <>
      <Login/>
      <ToastContainer/>
    </>
  )
}

export default App
