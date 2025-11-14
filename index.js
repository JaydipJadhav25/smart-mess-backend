import dotenv from 'dotenv'
dotenv.config();//configer env varibles
import express from "express"
import cors from "cors"
import moment from 'moment';
import { dbConnect } from './db/dbConnect.js';
import feedbackRouter from "./routes/feedback.routes.js"
import userRouter from "./routes/user.routes.js"
import { userAuth } from './middlewares/authMiddlewares.js';
import applicationRoutes from "./routes/application.routes.js"
import menuRouter from "./routes/mealMenu.routes.js"
import attendanceRouter from "./routes/attendance.routes.js"
import recipeRouter from "./routes/recipe.routes.js"
import adminRouter from "./routes/admin.routes.js"
import feeRecordsRouter from "./routes/fees.routes.js"
import openRouter from "./routes/open.routes.js"


//database connecction
await dbConnect();

const app = express();

console.log("url : " , process.env.CLIENT_URL);
//setup ccores , confige cores for cookis access
app.use(
  cors({
    origin: process.env.CLIENT_URL,  // e.g., 'http://localhost:5173' or https://smart-mess-system.vercel.app/
    credentials: true,               // allows cookies / auth headers
  })
);

app.use(express.json());
app.use(express.urlencoded({extended : true}));





app.get("/" , async(req , res)=>{
  const currentMonth = moment().format("MMMM YYYY DD"); 
  // const response = await createMessage(7249824513 , "jaydip jadhav");
    return res.json({
        text : "smart mess system" , 
        currentMonth,
    });
})


//routes :////////////////////////////
// router/////////////////
app.use("/feedback" , feedbackRouter);
app.use("/menu" , menuRouter)
app.use("/user" , userRouter);
app.use("/user/appplication" , userAuth , applicationRoutes);
app.use("/attendance" ,  attendanceRouter);
app.use("/recipe" , recipeRouter);

//open
 app.use("/open" , openRouter);


//admin
app.use("/admin" , adminRouter );
app.use("/admin/fees" , feeRecordsRouter);















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










