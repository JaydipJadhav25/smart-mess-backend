import { Router } from "express";
import { applicationCreate } from "../controllers/applicationForm.js";



const router = Router();

router.get("/" , (req , res)=>{
    return res.json({
        message : "this is applications routes"
    })
})

router.post("/create" , applicationCreate);


export default router;
