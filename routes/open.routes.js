import { Router } from "express";
import { getStudentFeesRecordsById } from "../controllers/fess.controller.js";



const router = Router();



// get fees records by id
router.get("/fees/records/:id" ,  getStudentFeesRecordsById);










export default router;