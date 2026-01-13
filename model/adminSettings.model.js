import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema(
  {
    onlinePaymentEnabled: {
      type: Boolean,
      default: false,
    },
    feedbackEnabled: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);
const AdminSettings = mongoose.model("AdminSettings", adminSettingsSchema);
export default AdminSettings;
