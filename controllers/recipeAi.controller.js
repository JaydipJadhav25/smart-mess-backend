import { asyncWraper } from "../utils/AsyncWraper.js";
import { ApiError } from "../utils/ApiError.js";
import { generateRecipeAI } from "../service/airecipe.service.js";
import { Recipe } from "../model/recipe.model.js";





export const recipeGenrator = asyncWraper(async(req , res)=>{
     const { meal, style, taste, quantity, message } = req.body;

     if (!meal || !style || !taste || !quantity) {
       throw new ApiError(401 , "Invalida Credentional" , "Meal, style, taste, and quantity are required.")
     }

    const result = await generateRecipeAI({ meal, style, taste, quantity, message });


    //check network
    if(!result){
       throw new ApiError(401 , "Server Error1" , "AI Response error!.")
    }
    res.status(200).json({ success: true, data: result });


    
})




export const saveAiRecipe = asyncWraper(async(req , res)=>{

  const  recipe = req.body;

  if(!recipe){
    throw new ApiError(401 , "Validatiion Error" , "recipe is reqried!");
  }

  //check already save
  

  //save in db
  const response = await Recipe.create({...recipe})


    if(!response){
    throw new ApiError(501 , "Server Error" , "Recipe SaveIn Database Error!");
  }

  //return reponse

  return res.status(201).json(response);
 
});




export const getAllRecipes = asyncWraper(async(req, res)=>{
  const recipes = await Recipe.find(); //return in array

   if(!recipes){
    throw new ApiError(501 , "Server Error" , "Recipe fetch Database Error!");
  }


  return res.status(201).json(recipes);


})