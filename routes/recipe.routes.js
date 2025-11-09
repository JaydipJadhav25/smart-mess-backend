import { Router } from "express";
import { getAllRecipes, recipeGenrator, saveAiRecipe } from "../controllers/recipeAi.controller.js";



const router  = Router();


router.post("/generate" , recipeGenrator );
router.post("/save" , saveAiRecipe);
router.get("/all" , getAllRecipes);



export default router;