import mongoose from "mongoose";

const studentPlanProfileSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or Student
      required: true,
    },
    student_id : {
        type : Number,
        require : true
    },
    age: {
      type: Number,
      required: true,
      min: 10,
      max: 100,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    height: {
      type: Number, // in cm
      required: true,
      min: 100,
      max: 250,
    },

    weight: {
      type: Number, // in kg
      required: true,
      min: 30,
      max: 200,
    },

    goal: {
      type: String,
      enum: ["weight_loss", "maintenance", "weight_gain"],
      required: true,
    },

    isProfileCompleted: {
      type: Boolean,
      default: true,
    },
    
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const StudentPlanProfile = mongoose.model(
  "StudentPlanProfile",
  studentPlanProfileSchema
);
