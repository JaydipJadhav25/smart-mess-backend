
import { MessLeave } from "../model/leave.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncWraper } from "../utils/AsyncWraper.js";




const addStudentLeave = asyncWraper(async (req, res) => {
  const { reason, mode } = req.body;

  //  Validation
  if (!reason || !mode) {
    throw new ApiError(400, "Invalid Error", "All fields are required!");
  }

  if (!["morning", "night"].includes(mode)) {
    throw new ApiError(400, "Invalid Error", "Invalid meal type!");
  }

  const student = req.user;
  if (!student) {
    throw new ApiError(401, "Invalid Error", "User not found!");
  }

  //  Today start (00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  //  DUPLICATE CHECK (FIXED)
  const existingLeave = await MessLeave.findOne({
    student: student._id,
    mealType: mode,
    leaveDate: {
      $gte: today,
      $lt: tomorrow,
    },
  });

  if (existingLeave) {
    throw new ApiError(
      409,
      "Invalid Error",
      `You already took ${mode} mess leave for today!`
    );
  }

  //  CREATE LEAVE
  const studentLeave = await MessLeave.create({
    student: student._id,
    student_id : student.student_id,
    reason,
    mealType: mode,
    leaveDate: today, // ensure normalized date
  });

  res.status(201).json({
    success: true,
    message: `${mode} mess leave applied successfully`,
    data: studentLeave,
  });
});

const getStudentLeaveHistory = asyncWraper(async (req, res) => {
//   const { student_id } = req.params;

//   if (!student_id) {
//     throw new ApiError(400, "Invalid Error", "Student ID is required");
//   }

 const student = req.user;
  if (!student) {
    throw new ApiError(401, "Invalid Error", "User not found!");
  }
  const leaves = await MessLeave.find({ student_id : student.student_id })
    .sort({ leaveDate: -1 });

  res.status(200).json({
    success: true,
    count: leaves.length,
    data: leaves,
  });
});


const getTodayMessLeaves = asyncWraper(async (req, res) => {

  // IST today start
  const startIST = new Date();
  startIST.setHours(0, 0, 0, 0);

  // IST tomorrow start
  const endIST = new Date(startIST);
  endIST.setDate(startIST.getDate() + 1);

  const leaves = await MessLeave.find({
    leaveDate: {
      $gte: startIST,
      $lt: endIST,
    },
  });

  // console.log("leaves:", leaves);

  const morningLeaves = leaves.filter(l => l.mealType === "morning");
  const nightLeaves = leaves.filter(l => l.mealType === "night");

  res.status(200).json({
    success: true,
    date: startIST,
    count: {
      morning: morningLeaves.length,
      night: nightLeaves.length,
    },
    data: {
      morning: morningLeaves,
      night: nightLeaves,
    },
  });
});





export {
    addStudentLeave , getTodayMessLeaves , getStudentLeaveHistory
}
