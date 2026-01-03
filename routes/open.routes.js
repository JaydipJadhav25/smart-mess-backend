import { Router } from "express";
import { getStudentFeesRecordsById } from "../controllers/fess.controller.js";
import { allAnnouncements } from "../controllers/announcement.controller.js";



const router = Router();



// get fees records by id
router.get("/fees/records/:id" ,  getStudentFeesRecordsById);


//get all announ 
router.get("/announcements" , allAnnouncements);









export default router;