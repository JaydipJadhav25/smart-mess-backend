import User from "../model/user.model.js";





const findeUserByEmail = async(email) =>{
   try {
    
    const user = await User.findOne({email : email});

    return user;
   } catch (error) {

    console.log("user service error : " , error);
    return error;

   }
}



export {
    findeUserByEmail
}
