import { FeeModel } from "../model/fees.model.js";
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





export {
    getFeeRecords
}