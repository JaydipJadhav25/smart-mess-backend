import { Router } from "express";
import {  applicationCreate, getUserApplication } from "../controllers/applicationForm.js";



const router = Router();

router.get("/" , (req , res)=>{
    return res.json({
        message : "this is applications routes"
    })
})

router.post("/create" , applicationCreate);
// router.get("/all" , getAllAplication);
// router.post("/comform" , accepteApplication);

router.get("/get" , getUserApplication);


export default router;
