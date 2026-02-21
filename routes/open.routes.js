import { Router } from "express";
import { getFeesRecordsById, getStudentFeesRecordsById } from "../controllers/fess.controller.js";
import { allAnnouncements } from "../controllers/announcement.controller.js";
import { getAdminSettings } from "../controllers/adminSettings.controller.js";
import { getFeeRecords, getStudentPlanAiResponce } from "../controllers/open.controller.js";




const router = Router();



// get fees records by id
router.get("/fees/records/:id" ,  getStudentFeesRecordsById);

///get fee record based on fee id
router.get("/fee/record/:id" , getFeesRecordsById);


//get all announcements
router.get("/announcements" , allAnnouncements);


//get open admin settings
router.get("/admin/settings" ,  getAdminSettings);



//open features
router.get("/fees-record" , getFeeRecords);
router.get("/mealPlan-record" ,  getStudentPlanAiResponce);








export default router;