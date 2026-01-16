import { Router } from "express";
import {  getUserById, userLogin, userLogout, userSignup, verifyEmail } from "../controllers/user.controllers.js";
import { userAuth } from "../middlewares/authMiddlewares.js";
import { addFeedback } from "../controllers/feedback.controllers.js";


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

//get user profile
router.get("/myProfile" , userAuth , getUserById);


//add feedback
 router.post("/addfeedback" , userAuth ,  addFeedback);








export default router;
