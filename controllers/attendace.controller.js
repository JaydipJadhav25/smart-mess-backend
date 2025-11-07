import dayjs from "dayjs";
import { Attendence } from "../model/attendance.model.js";
import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponce.js";
import { asyncWraper } from "../utils/AsyncWraper.js";



const getAllAttendaces =  asyncWraper(async(req , res)=>{

    const  responce = await Attendence.find();

    if(!responce){
        throw new ApiError(400, "Server Error", "something went wrong!");
    }


    return res.status(201).json(
        responce
    )
    
})

const getAttendaceByDate = asyncWraper(async(req, res)=>{

 const date = req.query.date;


 console.log(date);

 if(!date){
    throw new ApiError(400, "Validation Error", "Date is Requried!");
    
 }


 //find is db
 const attendace = await Attendence.findOne({date : date});

//  if(!attendace){
//         throw new ApiError(400, "Server Error", "something went wrong!");
// }


return res.status(201).json(attendace);


})




// Get today's attendance
 const getTodayAttendance = asyncWraper(async (req, res) => {
    // Format today's date 
    const todayDate = dayjs().format("YYYY-MM-DD");


    const todayData = await Attendence.findOne({ date: todayDate });

    // Return today’s attendance list
    res.status(200).json(todayData);

})

export{
    getAllAttendaces,
    getAttendaceByDate,
    getTodayAttendance
}