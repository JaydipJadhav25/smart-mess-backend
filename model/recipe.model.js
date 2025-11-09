import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema(
  {
      quantity: { type: Number , default : 200},                   // e.g., 200 students
    // The one selected recipe (AI output)
      name: { type: String, required: true },
      description: { type: String },
      ingredients: { type: [String], required: true },
      steps: { type: [String], required: true },
      estimatedTime: { type: String },
      aiGenerated: { type: Boolean, default: true },
    // Favorite / History tracking
    isFavorite: { type: Boolean, default: false },
    dateSaved: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Recipe = mongoose.model("Recipe", RecipeSchema);
