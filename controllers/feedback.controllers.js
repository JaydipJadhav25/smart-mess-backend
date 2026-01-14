
import { FeedbackModel } from "../model/feedback.model.js";
import { generateAnalytics } from "../service/ai.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncWraper } from "../utils/AsyncWraper.js";



// const findeFeedbackBydate = async(req , res)=>{
// try {
//     const { startDate, endDate } = req.query;
    
//     console.log("feedback : " , startDate , endDate)

//     if (!startDate || !endDate) {
//       return res.status(400).json({ message: 'Please provide both a startDate and an endDate.' });
//     }

//     // --- The Change is Here ---
//     // The query now looks for a field named "Date" to match your data.
//     const query = {
//       Date: {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       },
//     };

//     // Find the documents and sort by the "Date" field.
//     const feedbackResults = await FeedbackModel.find(query).sort({ Date: 1 }); // Also changed here

//     res.status(200).json(feedbackResults);

//   } catch (error) {

//     console.error('Error fetching feedback by date:', error);
//     res.status(500).json({ message: 'Server error while fetching feedback.' });

//   }
// }

 const findeFeedbackBydate = asyncWraper(async (req, res) => {
  const { startDate, endDate } = req.query;
console.log(startDate , endDate);
  if (!startDate || !endDate) {
    throw new ApiError(400, "Validation Error", "startDate and endDate required");
  }

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // 🔥 THIS IS THE KEY LINE

  const feedbackResults = await FeedbackModel.find({
    Date: {
      $gte: start,
      $lte: end,
    },
  }).sort({ Date: 1 });

  res.status(200).json(feedbackResults);
});


const feedbackAnalytics = async(req , res)=>{
      try {
        const feedbacks = req.body;
          //cehck
          if(!feedbacks){
            return res
            .status(401)
            .json({
                message : "feedback are required!"
            })
          }
        //call ai 
        const response = await generateAnalytics(feedbacks);

        return res
        .status(200)
        .json(response);

      } catch (error) {
         console.error('Error analying feedback by date:', error);
    res.status(500).json({ message: 'Server error while analying feedback.' });
        
      }
}


export const addFeedback = asyncWraper(async (req, res) => {
  const {
    meal,
    overallRating,
    itemFeedback,
    positiveTags,
    negativeTags,
    comment,
  } = req.body;

  // basic validation
  if (!meal) {
    throw new ApiError(
      400,
      "Validation Error",
      "Meal  are required"
    );
  }

  // user from auth middleware
  const user  = req.user?.email;

  if (!user) {
    throw new ApiError(401, "Unauthorized", "User not authenticated");
  }

  // OPTIONAL: prevent duplicate feedback (same day, same meal)
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);

  // const alreadyExists = await FeedbackModel.findOne({
  //   user,
  //   meal,
  //   createdAt: { $gte: today },
  // });

  // if (alreadyExists) {
  //   throw new ApiError(
  //     409,
  //     "Duplicate Feedback",
  //     "You have already submitted feedback for this meal today"
  //   );
  // }

  // create feedback
  const feedback = await FeedbackModel.create({
    user,
    student_id : user.student_id,
    meal,
    overallRating,
    itemFeedback,
    positiveTags,
    negativeTags,
    comment,
  });

  return res.status(201).json({
    success: true,
    message: "Feedback submitted successfully",
    data: feedback,
  });

});

export {
    findeFeedbackBydate ,
    feedbackAnalytics
}