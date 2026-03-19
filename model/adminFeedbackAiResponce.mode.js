


import mongoose from "mongoose";

const adminFeedbackAiResponseschema = new mongoose.Schema(
  {
    // Day info
    day: {
      type : Date,
      default: Date.now
    },

    // AI response
    aiResponse: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export const AdminFeedbackAiResponse = mongoose.model(
  "adminFeedbackAiResponse",
adminFeedbackAiResponseschema
);
