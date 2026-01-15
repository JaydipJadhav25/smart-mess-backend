import {Router} from "express"
import { createStudentPlaneProfile, genrateSrudentTodayPlan, getStudentPlanProfile } from "../controllers/studentPlanProfile.controller.js";


const router = Router();


router.post("/profile" , createStudentPlaneProfile)
router.get("/profile" , getStudentPlanProfile);

router.post("/genrate" , genrateSrudentTodayPlan);



export default router;