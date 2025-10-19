import mongoose from "mongoose";

// Counter Schema for auto-increment student_id
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

const userSchema = new mongoose.Schema(
  {
    student_id: {
      type: Number,
      unique: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
    },

        formState: {
        type: String,
        enum: ["not_submitted", "filled", "pending", "successful"],
        default: "not_submitted",
        },
        isFormSubmitted: {
        type: Boolean,
        default: false,
        },

    role: {
      type: String,
      enum: ["student", "admin", "manager"],
      default: "student",
    },
     // 🔹 Role-based flags
    isStudent: {
      type: Boolean,
      default: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);


// Auto-increment student_id before saving
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "student_id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.student_id = counter.seq;
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
