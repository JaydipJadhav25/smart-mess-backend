import AdminSettings from "../model/adminSettings.model.js";
import { asyncWraper } from "../utils/AsyncWraper.js";



// GET /api/admin/settings
export const getAdminSettings = async (req, res) => {
  let settings = await AdminSettings.findOne();

  // Ensure only one global document exists
  if (!settings) {
    settings = await AdminSettings.create({
      onlinePaymentEnabled: false,
      feedbackEnabled: false,
    });
  }

  res.status(200).json({
    onlinePaymentEnabled: settings.onlinePaymentEnabled,
    feedbackEnabled: settings.feedbackEnabled,
  });
};



// PATCH /api/admin/settings/toggle-payment
export const toggleOnlinePayment = asyncWraper(async (req, res) => {

//bit not support
//   const settings = await AdminSettings.findOneAndUpdate(
//     {},
//     { $bit: { onlinePaymentEnabled: { xor: 1 } } },
//     { new: true, upsert: true }
//   );


let settings = await AdminSettings.findOne();

  if (!settings) {
    settings = await AdminSettings.create({
      onlinePaymentEnabled: true,
      feedbackEnabled: false,
    });
  } else {
    settings.onlinePaymentEnabled = !settings.onlinePaymentEnabled;
    await settings.save();
  }

  res.status(200).json({
    message: "Online payment status updated",
    onlinePaymentEnabled: settings.onlinePaymentEnabled,
  });
}
)


// PATCH /api/admin/settings/toggle-feedback
export const toggleFeedback = asyncWraper(async (req, res) => {


//   const settings = await AdminSettings.findOneAndUpdate(
//     {},
//     { $bit: { feedbackEnabled: { xor: 1 } } },
//     { new: true, upsert: true }
//   );

  let settings = await AdminSettings.findOne();

  if (!settings) {
    settings = await AdminSettings.create({
      onlinePaymentEnabled: false,
      feedbackEnabled: true,
    });
  } else {
    settings.feedbackEnabled = !settings.feedbackEnabled;
    await settings.save();
  }



  res.status(200).json({
    message: "Feedback status updated",
    feedbackEnabled: settings.feedbackEnabled,
  });
})


