import { Router } from "express";
import {  userLogin, userLogout, userSignup, verifyEmail } from "../controllers/user.controllers.js";
import { userAuth } from "../middlewares/authMiddlewares.js";


const router = Router();

router.get("/" ,async(req, res)=>{
    return res.json({
        message : "this is User route" 
    })
});

router.post("/verify" , verifyEmail);
router.post("/signup" , userSignup);
router.post("/login" , userLogin );

router.get("/logout" , userAuth , userLogout);









export default router;
