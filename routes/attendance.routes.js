import { Router } from "express";
import { getAllAttendaces  } from "../controllers/attendace.controller.js";



const router = Router()


router.get("/" , (req , res)=>{
    return res.json({
        message : "This is Attendace Routes!"
    })
})

router.get("/all" , getAllAttendaces);
// router.get("/date" , getAttendaceByDate);


export default router;