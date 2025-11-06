import { Router } from "express";
import { getAttendaces } from "../controllers/attendace.controller.js";



const router = Router()


router.get("/" , (req , res)=>{
    return res.json({
        message : "This is Attendace Routes!"
    })
})

router.get("/all" , getAttendaces);


export default router;