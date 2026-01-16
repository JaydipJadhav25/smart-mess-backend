import { ApiError } from "../utils/ApiError.js";
import { DailyMenu } from "../model/Menu.model.js";
import { asyncWraper } from "../utils/AsyncWraper.js";
import { ApiResponse } from "../utils/ApiResponce.js";


 



const getMenu = asyncWraper(async(req, res)=>{
 
    const menu = await DailyMenu.find();

    if(!menu){
     throw new ApiError(400, "Server Error", "something went wrong!");
    }


     return res.status(201).json(
        new ApiResponse(
          201,
          {
            menu
          },
         "Successfully fetch all Menu"
        ));
});





 const updateDailyMenu = async (req, res) => {
  try {
    const { day } = req.params;
    const { meals } = req.body;

    if (!day) {
      return res.status(400).json({
        success: false,
        message: "Day is required",
      });
    }

    if (!meals) {
      return res.status(400).json({
        success: false,
        message: "Meals data is required",
      });
    }

    const updatedMenu = await DailyMenu.findOneAndUpdate(
      { day },
      {
        meals,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMenu) {
      return res.status(404).json({
        success: false,
        message: `Menu not found for ${day}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Daily menu updated successfully",
      data: updatedMenu,
    });
  } catch (error) {
    console.error("Update Menu Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};




export {
    getMenu ,
    updateDailyMenu
}