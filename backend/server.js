import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './config/mongodb.js'
import userRouter from './routes/auth.js'
import stepRouter from './routes/steps.js'
import listRouter from './routes/watchlist.js'
import orderRouter from './routes/order.js'
import gttrouter from './routes/gtt.js'
import fundrouter from './routes/fund.js'
import router from './routes/alertsRoutes.js';
import ipoRoutes from './routes/ipoRoutes.js';
import Grouter from './routes/gsecRoutes.js';
import brouter from "./routes/basket.js";
import sipRoutes from "./routes/sipRoutes.js";
//App config
const app = express()
const port = process.env.PORT || 4000
connectDb()

//middleware
app.use(express.json())
app.use(cors()) //to access backend from any id


//API routes
app.use('/api/auth', userRouter)
app.use('/api/steps', stepRouter)
app.use('/api/watchlist',listRouter)
app.use('/api/order',orderRouter)
app.use('/api/gtt',gttrouter)
app.use('/api/funds',fundrouter)
app.use('/api/alerts', router);
app.use("/api/ipo", ipoRoutes);
app.use("/api/gsec", Grouter);
app.use("/api/baskets", brouter);
app.use("/api/sips", sipRoutes);
app.get('/',(req,res)=>{
    res.send("API working")
})
app.listen(port,()=> console.log('server started on port:'+ port))