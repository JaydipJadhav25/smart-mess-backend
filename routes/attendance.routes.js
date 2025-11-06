import { Router } from "express";
import { getAllAttendaces, getAttendaceByDate  } from "../controllers/attendace.controller.js";



const routerr = Router()


routerr.get("/" , (req , res)=>{
    return res.json({
        message : "This is Attendace Routes!"
    })
})

routerr.get("/all" , getAllAttendaces);
routerr.get("/date" , getAttendaceByDate);


export default routerr;