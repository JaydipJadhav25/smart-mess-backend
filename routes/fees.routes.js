import  {Router} from "express"
import { allFeesRecords, currentFeeRecords, studentAddFees } from "../controllers/fess.controller.js";


const router = Router();


router.post("/add" , studentAddFees);
router.get("/current" , currentFeeRecords);
router.get("/all"  , allFeesRecords)




export default router;