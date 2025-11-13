import mongoose from "mongoose";

const FeesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  student_Id: {
    type: String, // e.g. your own student id like "STU001"
    required: true,
  },

  month: {
    type: String,
    enum: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    required: true,
  },

  year: {
    type: Number,
    default: () => new Date().getFullYear(), // auto current year
  },

  amount: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["paid", "pending"],
    default: "paid",
  },
  method: {
    type: String, // cash / upi / online
    enum :["cash" , "upi" , "online"],
    default : "cash"
  },

  paymentDate: {
    type: Date,
    default: Date.now,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const FeeModel = mongoose.model("Fee", FeesSchema);
