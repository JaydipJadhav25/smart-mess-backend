import Announcement from "../model/announcement.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { asyncWraper } from "../utils/AsyncWraper.js";



//get
const allAnnouncements = asyncWraper(async(req , res)=>{
    // Sort by createdAt in descending order (-1) and limit to 4
    const announcements = await Announcement.find();
    return res.status(200).json(announcements);
})


//add
const addAnnouncements = asyncWraper(
    async(req ,res) =>{
        const { title, description, date } = req.body;
        // Basic validation
        if (!title || !description || !date) {
        //   return res.status(400).json({ : 'All fields are required' });
         throw new ApiError(401,  "Invalide Data!" ," All fileds are requride");
        }
    
        // Create and save the announcement
        const newAnnouncement = new Announcement({
          title,
          description,
          date,   
        });
         
        await newAnnouncement.save();
    
    return res
    .status(200)
    .json(new ApiResponse(200,{
        newAnnouncement
    },"Announcement added successfully"));
}

)
//delete
const deleteAnnouncement = asyncWraper(async(req , res)=>{
  
  const {id} = req.body;

  //check
  if(!id){
    throw new ApiError(400 , "validations Error" , "Announcement id is requride!");
  }

  //delete 
const announcement = await Announcement.findOneAndDelete({_id : id});

if(!announcement){
    throw new ApiError(501 , "Server Error" , "Announcement deleted falied ! check member id");
}


 return res.status(200).json(
    new ApiResponse(
        200 , announcement , "Announcement deleted successfully !"));


});

//update 
const updateAnnouncements = asyncWraper(async(req ,res) =>{
  
        const {  id , title, description, date } = req.body;

        // console.log("id , title, description, date " , id , title, description, date );


        // Basic validation
        if (!title || !description || !date) {
          throw new ApiError(400 , "validation Error" , "All fields are required")
        }
    
        // finde and update  announcement
         const announcement = await Announcement.findByIdAndUpdate(
            id,
            { title, description, date },
            { new: true }
          );

           if(!announcement){
          throw new ApiError(500 , "server error" , "server Error check NetWorlConnections!")
           }
        
           return res.status(201).json(
            new ApiResponse(200,
                announcement ,
                "Announcement update successfully"
            )
           );
      
})



export {
    updateAnnouncements , 
    deleteAnnouncement,
    addAnnouncements,
    allAnnouncements
}