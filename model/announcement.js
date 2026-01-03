import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    } ,
    createdAt :{
        type : Date,
        default : Date.now()
    }
    
} ,{
    timestamps  :true
});
const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;