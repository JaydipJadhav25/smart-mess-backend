import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema({
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
});

const mealSchema = new mongoose.Schema({
  items: [String],
  nutrition: nutritionSchema,
  image: { type: String, default: "/" },
});

const dailyMenuSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  meals: {
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
  },
  updatedAt: { type: Date, default: Date.now },
});

export const DailyMenu = mongoose.model("DailyMenu", dailyMenuSchema);
