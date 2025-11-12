import {ApiError} from "../utils/ApiError.js"
import { asyncWraper } from "../utils/AsyncWraper.js"
import { StudentApplication } from "../model/StudentApplication.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import User from "../model/user.model.js";
import mongoose from "mongoose";





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
        student_id : user.student_id,
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


//get all application
const getAllAplication = asyncWraper(async(req  , res) =>{

  //fetch from database
  const applications  = await StudentApplication.find();

   //  Response
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        applications
      },
      "fetch All Applications Successfully"
    )
  );
  
})


//update status
const accepteApplication = asyncWraper(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    throw new ApiError(400, "Invalid Request", "Id is required!");
  }

  console.log("id : " , id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid ID format");
  }

  const updateApplication = await StudentApplication.findByIdAndUpdate(
    id,
    {
      isAccepted: true,
      formStatus: "approved",
    },
    { new: true }
  );

  if (!updateApplication) {
    throw new ApiError(404, "Not Found", "Application not found!");
  }

  const updateUser = await User.findByIdAndUpdate(
    updateApplication.user,
    {
      formState: "successful",
    },
    { new: true }
  ).select("-password");

  if (!updateUser) {
    throw new ApiError(404, "Not Found", "User not found!");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { updateApplication, updateUser },
      "User application approved successfully!"
    )
  );
});



const getApplicationById = asyncWraper(async(req , res)=>{
   const id = req.params.id;


   if(!id){
    throw new ApiError(401 , "Invalide Error" , "Id Id required!")
   }

   //finde application
   const application = await StudentApplication.findById(id);
 


    if(!application){
    throw new ApiError(401 , "Invalide Error" , "Application is not Found!")
   }


   return res.status(201).json(application);


});


const getUserApplication = asyncWraper(async(req , res)=>{

  const email = req.user.email;

   if (!email) {
    throw new ApiError(400, "Invalid Request", "email is required!");
  }

  //find an return user application
   
  const application = await StudentApplication.findOne({email : email});



  return res.status(200).json(application);
  


})

const deleteApplication = asyncWraper(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    throw new ApiError(400, "Invalid Error", "Application ID is required!");
  }


  const deletedUserApplication = await StudentApplication.findByIdAndDelete(id);

  if (!deletedUserApplication) {
    throw new ApiError(404, "Not Found", "Application not found!");
  }

  
  const user = await User.findOneAndUpdate(
    { email: deletedUserApplication.email },
    {
      isFormSubmitted: false,
      formState: "not_submitted",
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "Not Found", "User not found!");
  }

  
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        student_id: user.student_id,
      },
      "Application deleted successfully."
    )
  );
});



export {
    applicationCreate ,
    getAllAplication ,
   accepteApplication,
    getApplicationById,
    getUserApplication,
    deleteApplication
}