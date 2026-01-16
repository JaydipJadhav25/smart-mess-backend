import { Router } from "express";
import { accepteApplication, deleteApplication, getAllAplication, getApplicationById } from "../controllers/applicationForm.js";
import { addAnnouncements, deleteAnnouncement, updateAnnouncements } from "../controllers/announcement.controller.js";
import { getTodayMessLeaves } from "../controllers/leave.controller.js";
import { getAdminSettings, toggleFeedback, toggleOnlinePayment } from "../controllers/adminSettings.controller.js";
import { updateDailyMenu } from "../controllers/mealMenu.controller.js";



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





//admin settings
// router.get("/settings" ,  getAdminSettings);
router.patch("/settings/toggle-payment" , toggleOnlinePayment);
router.patch("/settings/toggle-feedback" , toggleFeedback )


//menu update
router.put("/menu/:day" , updateDailyMenu);








export default router;