import { Router } from "express";
import { getFeesRecordsById, getStudentFeesRecordsById } from "../controllers/fess.controller.js";
import { allAnnouncements } from "../controllers/announcement.controller.js";




const router = Router();



// get fees records by id
router.get("/fees/records/:id" ,  getStudentFeesRecordsById);

///get fee record based on fee id
router.get("/fee/record/:id" , getFeesRecordsById);


//get all announcements
router.get("/announcements" , allAnnouncements);









export default router;