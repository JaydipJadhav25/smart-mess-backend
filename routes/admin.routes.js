import { Router } from "express";
import { accepteApplication, deleteApplication, getAllAplication, getApplicationById } from "../controllers/applicationForm.js";
import { addAnnouncements, deleteAnnouncement, updateAnnouncements } from "../controllers/announcement.controller.js";
import { getTodayMessLeaves } from "../controllers/leave.controller.js";



const router = Router();


//application for
router.get("/application/all" , getAllAplication);
router.get("/application/review/:id" , getApplicationById);
router.get("/application/update/:id" , accepteApplication);
router.delete("/application/delete/:id" , deleteApplication);



//announcements routes
router.post("/add/announcements" , addAnnouncements);
router.post("/delete/announcements" , deleteAnnouncement);
router.post("/update/announcements" , updateAnnouncements);


//get all leaves 
router.get("/leaves/today" , getTodayMessLeaves)










export default router;