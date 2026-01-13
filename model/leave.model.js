import mongoose, { Schema, model } from "mongoose";

const messLeaveSchema = new Schema(
  {
    student: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    student_id  :{
    type : Number
    },
    mealType: {
      type: String,
      enum: ["morning", "night"],
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },

    // leave is valid ONLY for this date
    leaveDate: {
      type: Date,
      default: () => new Date().setHours(0, 0, 0, 0),
    },
  },
  { timestamps: true }
);

export const MessLeave = model("MessLeave", messLeaveSchema);
