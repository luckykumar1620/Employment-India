import express from 'express'
import { loginWorker, serviceCancel, serviceComplete, servicesWorker, workerList } from '../controllers/workerController.js'
import authWorker from '../middlewares/authWorker.js'


const workerRouter=express.Router()

workerRouter.get('/list',workerList)
workerRouter.post('/login',loginWorker)
workerRouter.get('/services',authWorker,servicesWorker)
workerRouter.post('/complete-service',authWorker,serviceComplete)
workerRouter.post('/cancel-service',authWorker,serviceCancel)

export default workerRouter