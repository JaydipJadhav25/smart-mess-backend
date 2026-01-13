import { Router } from "express";
import { addStudentLeave, getStudentLeaveHistory } from "../controllers/leave.controller.js";




const router = Router();


router.post("/add" , addStudentLeave);
router.get("/history" , getStudentLeaveHistory);

export default router;
