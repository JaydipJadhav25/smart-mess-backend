import {ApiError} from "../utils/ApiError.js"
import { asyncWraper } from "../utils/AsyncWraper.js"
import { StudentApplication } from "../model/StudentApplication.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import User from "../model/user.model.js";





const  applicationCreate = asyncWraper(
    async(req , res) =>{
    //1. extrack current user
    const user = req.user;
    if(!user){
     throw new ApiError( "UnAuthorized Access!" ," User is Requried" ,401);
    }
    // create application
    const data = req.body;

    // console.log("user data : " , data , "and user : " , user);

    //cehck
    if(!data){
        throw new ApiError("User Data Is Requried!");
    }
    //sava in db
    const application = await StudentApplication.create({
        user : user._id,
        email : user.email,
        ...data
    });

     if(!application){
        throw new ApiError("User Application save Error!");
    }
    //update is user profile
   await User.findByIdAndUpdate(user._id ,{
        isFormSubmitted : true,
        formState : "pending" 
    } ,{
        new : true
    } );


   // 7. Response
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        application_id : application._id,
        user : user.email
      },
      "User Application Created Successfully"
    )
  );


});




export {
    applicationCreate
}