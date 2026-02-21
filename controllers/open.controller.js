import { FeeModel } from "../model/fees.model.js";
import { StudentMealPlanAiResponse } from "../model/studentMealPlanAiReponse.model.js";
import { asyncWraper } from "../utils/AsyncWraper.js";



const getFeeRecords = asyncWraper(async (req, res) => {
  // Fetch latest successful blockchain payment record
  const record = await FeeModel.findOne({
    status: "paid",
    hash: { $exists: true, $ne: null }
  }).sort({ createdAt: -1 });

  if (!record) {
    return res.status(404).json({
      success: false,
      message: "No successful fee record found"
    });
  }

  res.status(200).json({
    success: true,
    data: record
  });
});






const getStudentPlanAiResponce = asyncWraper(async (req, res) => {
  
  const  response  =  await StudentMealPlanAiResponse.findOne();

  if (!response) {
    return res.status(404).json({
      success: false,
      message: "No successful fee record found"
    });
  }

  res.status(200).json({
    success: true,
    data: response
  });
});




export {
    getFeeRecords,
    getStudentPlanAiResponce
}