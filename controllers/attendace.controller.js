import { Attendence } from "../model/Attendace.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { asyncWraper } from "../utils/AsyncWraper.js";



const getAttendaces =  asyncWraper(async(req , res)=>{

    const  responce = await Attendence.find();

    if(!responce){
             throw new ApiError(400, "Server Error", "something went wrong!");
    }


    return res.status(201).json(
        responce
    )
    
})




export{
    getAttendaces
}