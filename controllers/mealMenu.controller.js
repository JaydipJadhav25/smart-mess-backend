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
})




export {
    getMenu
}