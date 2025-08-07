import express from "express";
import dotenv from "dotenv";
import mongodb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import memoryRoutes from "./routes/memoryRoutes.js"
import adminRoutes from './routes/adminRoutes.js'
import cors from "cors"

const app=express()
dotenv.config();
mongodb();

app.use(cors({
  origin: "http://localhost:5173", // React app URL
  credentials: true,  
  allowedHeaders: ['Content-Type', 'Authorization'],             // only if you're using cookies
}));

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.use('/api/auth',authRoutes)
app.use('/api/memories',memoryRoutes)
app.use('/api/admin',adminRoutes)



app.listen(3000,()=>{
    console.log(`Your app is running on http://localhost:3000`)
})
