import {Router} from "express"
import { createStudentPlaneProfile, genrateStudentTodayPlan, getStudentPlanProfile } from "../controllers/studentPlanProfile.controller.js";


const router = Router();


router.post("/profile" , createStudentPlaneProfile)
router.get("/profile" , getStudentPlanProfile);

router.post("/genrate" , genrateStudentTodayPlan);



export default router;