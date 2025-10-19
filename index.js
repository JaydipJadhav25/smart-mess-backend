import dotenv from 'dotenv'
dotenv.config();//configer env varibles
import express from "express"
import cors from "cors"
import { dbConnect } from './db/dbConnet.js';
import feedbackRouter from "./routes/feedback.routes.js"
import userRouter from "./routes/user.routes.js"


//database connecction
await dbConnect();

const app = express();

console.log("url : " , process.env.CLIENT_URL);
//setup ccores , confige cores for cookis access
app.use(
  cors({
    origin: 'https://smart-mess-system.vercel.app',  // e.g., 'http://localhost:5173' or https://smart-mess-system.vercel.app/
    credentials: true,               // allows cookies / auth headers
  })
);

app.use(express.json());
app.use(express.urlencoded({extended : true}));





app.get("/" , async(req , res)=>{
    return res.json({
        text : "smart mess system" , 
    });
})


//routes :////////////////////////////
//feedback router/////////////////
app.use("/feedback" , feedbackRouter);
app.use("/user" , userRouter);











///////////////////////////////// customerror handler/////////////////////
app.use((err, req, res, next) => {
  console.error(err.stack);
  const errorName = err.name || "validation Error";
  const errorMessage = err.message || "Something went wrong";
  const statusCode = err.status || 500;
  // res.status(500).json({ error: "Something went wrong!" });
  
   return res.status(statusCode)
             .json({
              message : errorMessage,
              error : errorName,
              success : false
             });

});



app.listen(process.env.PORT ,()=>{
    console.log(`Server is Starting on PORT ${process.env.PORT } ✔`)
})










