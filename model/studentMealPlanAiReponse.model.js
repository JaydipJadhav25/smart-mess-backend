import mongoose from "mongoose";

const studentMealPlanCacheSchema = new mongoose.Schema(
  {
    // Day info
    day: {
      type: String,
      required: true,
    },

    // Students who used this plan
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // or Student
      },
    ],

    // Meal (structured, not string)
    lunch: {
      type: [String],
      required: true,
    },

    dinner: {
      type: [String],
      required: true,
    },

    // Goal
    goal: {
      type: String,
      required: true,
    },

    // Body ranges (IMPORTANT for reuse)
    ageRange: {
      min: Number,
      max: Number,
    },

    heightRange: {
      min: Number,
      max: Number,
    },

    weightRange: {
      min: Number,
      max: Number,
    },

    // AI response
    aiResponse: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export const StudentMealPlanAiResponse = mongoose.model(
  "StudentMealPlanAiResponse",
  studentMealPlanCacheSchema
);
