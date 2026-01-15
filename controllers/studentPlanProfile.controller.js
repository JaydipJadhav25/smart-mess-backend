import { StudentMealPlanAiResponse } from "../model/studentMealPlanAiReponse.model.js";
import { StudentPlanProfile } from "../model/studentPlanProfile.model.js";
import { generateStudentMealPlanAI } from "../service/ai.generateStudenPlan.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncWraper } from "../utils/AsyncWraper.js";



const createStudentPlaneProfile = asyncWraper(async (req, res) => {
  const { age, gender, height, weight, goal } = req.body;

  if (!age || !gender || !height || !weight || !goal) {
    throw new ApiError(400, "Invalide Error", "All fields are required");
  }

  const student = req.user;

  if (!student) {
    throw new ApiError(401, "Unauthorized" , " User is not found!");
  }

  // Check if profile already exists
  const existingProfile = await StudentPlanProfile.findOne({
    student_id: student.student_id,
  });


//   let profile;

//   if (existingProfile) {

//     // Update profile
//     profile = await StudentPlanProfile.findByIdAndUpdate(
//       existingProfile._id,
//       {
//         age,
//         gender,
//         height,
//         weight,
//         goal,
//       },
//       { new: true }
//     );

//   } else {


//     // Create new profile
//     profile = await StudentPlanProfile.create({
//       student: student._id,
//       student_id: student.student_id,
//       age,
//       gender,
//       height,
//       weight,
//       goal,
//     });

//   }



if(existingProfile){
    throw new ApiError(401 , "Invalide Error" , "User Already have Account !")
}


    // Create new profile
  const   profile = await StudentPlanProfile.create({
      student: student._id,
      student_id: student.student_id,
      age,
      gender,
      height,
      weight,
      goal,
      isProfileCompleted : true
    });



  return res.status(201).json({
    success: true,
    message: "Student plan profile saved successfully",
    data: profile,
  });


});


const getStudentPlanProfile = asyncWraper(async (req, res) => {
  const student = req.user;

  if (!student) {
    throw new ApiError(401, "Unauthorized");
  }

  const profile = await StudentPlanProfile.findOne({
    student_id: student.student_id,
  });

  if (!profile) {
    return res.status(200).json({
      success: true,
      profileCompleted: false,
      data: null,
    });

  }

  return res.status(200).json({
    success: true,
    profileCompleted: true,
    data: profile,
  });

});

const genrateSrudentTodayPlan = asyncWraper(async(req, res) =>{
  const {day , lunch , dinner} = req.body;
  // console.log("client side data  : " , day , lunch , dinner);
  if (!day || !lunch|| !dinner) {
    throw new ApiError(400, "Invalide Error", "All fields are required");
  }


  //finde user 
  const student = req.user;

  if (!student) {
    throw new ApiError(401, "Unauthorized" , " User is not found!");
  }


  const existingProfile = await StudentPlanProfile.findOne({
    student_id: student.student_id,
  });

if(!existingProfile){
    throw new ApiError(401 , "Invalide Error" , "User Profile Not Requried!")
}



const userData = {
  day : day,
  lunch : lunch,
  dinner : dinner,
  age: existingProfile.age,
  gender: existingProfile.gender,
  height: existingProfile.height,
  weight: existingProfile.weight,
  goal:  existingProfile.goal,
} 



////////////////IMp : if already create plne to return through db//////////////
const existingUserPlan = await StudentMealPlanAiResponse.findOne({
  students : student._id,
  day : day
})


//return exisiting
if (existingUserPlan) {

  return res.status(200).json({
  success : true,
  data : {...existingUserPlan.aiResponse , ...userData},
  message : "Suucessfully  genrated Studnet meal Plan!"
})

}



console.log("user profile : " , userData)

//all to ai to send userProfile and tday meal
const aiReponse = await generateStudentMealPlanAI({...userData})

console.log("ai reposnes : " , aiReponse);

//save in db
// const aiResponseStor = await StudentMealPlanAiResponse.create({
//   day : day,
//   lunch : `${lunch.join(", ")}`,
//   dinner : `${dinner.join(", ")}`,
//   goal,
//   age,
//   weight,
//   aiResponse : aiReponse
// });

const aiResponseStor = await StudentMealPlanAiResponse.create({
  day :day,
  goal : userData.goal,
  lunch :lunch,
  dinner :dinner,

  ageRange: { min: userData.age - 2, max: userData.age + 2 },
  heightRange: { min: userData.height - 5, max: userData.height + 5 },
  weightRange: { min: userData.weight - 3, max: userData.weight + 3 },

  aiResponse  : aiReponse,    
  students: [student._id] 
})


if(!aiResponseStor){
    throw new ApiError(501 , "Server Error" , "AI reponse Error!")
}


return res.status(200).json({
  success : true,
  data : {...aiReponse , ...userData},
 message : "Suucessfully  genrated Studnet meal Plan!"
})

})

export{
    createStudentPlaneProfile,
    getStudentPlanProfile,
    genrateSrudentTodayPlan
}
