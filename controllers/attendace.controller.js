import { Attendence } from "../model/Attendace.js";
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

 if(!date){
    throw new ApiError(400, "Validation Error", "Date is Requried!");
    
 }


 //find is db
 const attendace = await Attendence.findOne({date : date});

 if(!attendace){
        throw new ApiError(400, "Server Error", "something went wrong!");
}


return res.status(201).json(attendace);


})



export{
    getAllAttendaces,
    getAttendaceByDate
}